'use strict';
// ---------- temel yardımcılar ----------
const W = 1280, H = 720, TAU = Math.PI * 2;
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a, b, t) => a + (b - a) * t;
const sm = t => { t = clamp(t); return t * t * (3 - 2 * t); };
const eo = t => 1 - Math.pow(1 - clamp(t), 3);
const ei = t => { t = clamp(t); return t * t * t; };
const seg = (t, a, b) => clamp((t - a) / (b - a));
function rng(seed) { let s = (seed * 2654435761) >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
const hx = h => { h = h.replace('#', ''); return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]; };
const mix = (a, b, t) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
const rgba = (c, a = 1) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`;
const mul = (c, k) => [c[0] * k, c[1] * k, c[2] * k];
const FONT = "'Bitstream Charter','DejaVu Serif',serif";
const SANS = "'Inter','DejaVu Sans',sans-serif";

// ---------- ses verisi ----------
let EN = 0, BS = 0, HI = 0, KK = 0;
function setAudio(t) {
  const i = clamp(Math.round(t * 24), 0, ENERGY.e.length - 1);
  EN = ENERGY.e[i]; BS = ENERGY.b[i]; HI = ENERGY.h[i]; KK = ENERGY.k[i];
}
// zaman dondurma (G3 -> H1)
const wt = t => t < 162.2 ? t : 162.2 + (t - 162.2) * 0.03;

// ---------- paletler ----------
const PAL = {
  dusk: { top: [28, 22, 64], mid: [138, 63, 109], low: [242, 137, 78], glow: [255, 208, 138], sea: [40, 28, 60] },
  cold: { top: [24, 30, 58], mid: [78, 88, 122], low: [150, 160, 180], glow: [190, 200, 215], sea: [22, 30, 50] },
  night: { top: [5, 7, 22], mid: [18, 24, 60], low: [40, 52, 100], glow: [190, 210, 255], sea: [8, 12, 30] },
  dawn: { top: [58, 66, 128], mid: [232, 150, 128], low: [255, 214, 150], glow: [255, 236, 190], sea: [70, 54, 96] },
  gold: { top: [70, 90, 150], mid: [246, 170, 120], low: [255, 226, 160], glow: [255, 240, 200], sea: [80, 70, 110] },
};
const palMix = (a, b, t) => { const o = {}; for (const k in a) o[k] = mix(a[k], b[k], t); return o; };

// ---------- kamera ----------
function cam(c, cx, cy, z, rot = 0) {
  c.translate(W / 2, H / 2); if (rot) c.rotate(rot); c.scale(z, z); c.translate(-cx, -cy);
}

// ---------- çizim temel taşları ----------
function vgrad(c, y0, y1, stops) {
  const g = c.createLinearGradient(0, y0, 0, y1);
  for (const [p, col, a] of stops) g.addColorStop(p, rgba(col, a === undefined ? 1 : a));
  return g;
}
function glow(c, x, y, r, col, a = 1, mode) {
  if (r <= 0 || a <= 0) return;
  if (mode) { c.save(); c.globalCompositeOperation = mode; }
  const g = c.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, rgba(col, a)); g.addColorStop(0.35, rgba(col, a * 0.42)); g.addColorStop(1, rgba(col, 0));
  c.fillStyle = g; c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill();
  if (mode) c.restore();
}
function skyFill(c, pal, y1 = H) { c.fillStyle = vgrad(c, 0, y1, [[0, pal.top], [0.55, pal.mid], [1, pal.low]]); c.fillRect(-200, -200, W + 400, y1 + 200); }
const STAR = (() => { const r = rng(7); return Array.from({ length: 170 }, () => ({ x: r() * W, y: r() * H * 0.62, s: r() * 1.5 + 0.5, p: r() * TAU })); })();
function stars(c, t, a = 1, ymax = H) {
  for (const s of STAR) { if (s.y > ymax) continue; const tw = 0.5 + 0.5 * Math.sin(t * 1.6 + s.p); c.fillStyle = `rgba(255,255,255,${a * tw * 0.9})`; c.fillRect(s.x, s.y, s.s, s.s); }
}
function moon(c, x, y, r, a = 1) {
  glow(c, x, y, r * 6, [160, 190, 255], 0.32 * a * (1 + 0.15 * KK));
  glow(c, x, y, r * 2.4, [215, 232, 255], 0.4 * a);
  c.fillStyle = `rgba(247,249,255,${a})`; c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill();
  c.fillStyle = `rgba(150,165,200,${0.2 * a})`;
  for (const [dx, dy, rr] of [[-0.3, -0.2, 0.22], [0.25, 0.1, 0.3], [-0.1, 0.4, 0.16], [0.4, -0.35, 0.12]]) { c.beginPath(); c.arc(x + dx * r, y + dy * r, rr * r, 0, TAU); c.fill(); }
}
function clouds(c, t, y, col, a, seed, speed = 6, n = 6, scale = 1) {
  const r = rng(seed);
  for (let i = 0; i < n; i++) {
    const bx = r() * (W + 600) - 300, by = y + (r() - 0.5) * 90, sw = (190 + r() * 280) * scale, sh = (16 + r() * 22) * scale, sp = 0.6 + r() * 0.8;
    const x = (((bx + t * speed * sp) % (W + 600)) + W + 600) % (W + 600) - 300;
    c.save(); c.translate(x, by); c.scale(1, sh / sw); glow(c, 0, 0, sw, col, a); c.restore();
  }
}
function sea(c, hy, top, bot, t, o = {}) {
  c.fillStyle = vgrad(c, hy, H, [[0, top], [1, bot]]); c.fillRect(-200, hy, W + 400, H - hy + 200);
  const n = o.lines || 24, wa = o.wa === undefined ? 1 : o.wa, amp0 = 1 + BS * 1.2;
  for (let i = 0; i < n; i++) {
    const p = i / n, y = hy + Math.pow(p, 1.7) * (H - hy), amp = (1 + p * 5) * amp0;
    c.strokeStyle = rgba(o.wc || [255, 255, 255], (0.04 + p * 0.1) * wa); c.lineWidth = 0.6 + p * 1.8;
    c.beginPath();
    for (let x = -20; x <= W + 20; x += 28) { const yy = y + Math.sin(x * 0.02 / (0.4 + p) + t * (0.6 + p * 0.5) + i * 1.7) * amp; x === -20 ? c.moveTo(x, yy) : c.lineTo(x, yy); }
    c.stroke();
  }
  if (o.refl) {
    const [rx, rc, rw, ra] = o.refl;
    for (let j = 0; j < 46; j++) {
      const p = j / 46, y = hy + Math.pow(p, 1.5) * (H - hy), w = rw * (0.25 + p * 1.7) * (0.45 + 0.55 * Math.sin(t * 2.2 + j * 1.3));
      const ox = Math.sin(t * 1.3 + j * 0.9) * (3 + p * 14);
      c.fillStyle = rgba(rc, ra * (1 - p * 0.45) * (0.6 + 0.4 * Math.sin(j * 3.1 + t * 3)));
      c.fillRect(rx - w / 2 + ox, y, Math.max(2, w), 1 + p * 2.8);
    }
  }
}
// kentlerin silüeti
const _city = {};
function cityArr(seed, n, hmin, hmax) {
  const k = seed + '_' + n + '_' + hmin + '_' + hmax; if (_city[k]) return _city[k];
  const r = rng(seed); let x = 0; const a = [];
  for (let i = 0; i < n; i++) { const w = 14 + r() * 34; a.push({ x, w, h: hmin + r() * (hmax - hmin), roof: r(), win: r() }); x += w + r() * 3; }
  return (_city[k] = { list: a, total: x });
}
function skyline(c, x0, baseY, w, seed, hmin, hmax, col, o = {}) {
  const city = cityArr(seed, 60, hmin, hmax);
  c.fillStyle = rgba(col);
  for (let rep = 0; rep * city.total < w + city.total; rep++) {
    for (const b of city.list) {
      const bx = x0 + rep * city.total + b.x; if (bx > x0 + w || bx + b.w < x0) continue;
      const hill = o.hill ? o.hill(bx) : 1; const bh = b.h * hill;
      c.fillRect(bx, baseY - bh, b.w, bh + 40);
      if (b.roof > 0.7) { c.beginPath(); c.moveTo(bx, baseY - bh); c.lineTo(bx + b.w / 2, baseY - bh - 9); c.lineTo(bx + b.w, baseY - bh); c.fill(); }
      else if (b.roof > 0.55) { c.fillRect(bx + b.w * 0.4, baseY - bh - 6, 2, 6); }
    }
  }
  if (o.lights) {
    const r = rng(seed + 99); const L = o.lights;
    for (let rep = 0; rep * city.total < w + city.total; rep++) for (const b of city.list) {
      const bx = x0 + rep * city.total + b.x; if (bx > x0 + w || bx + b.w < x0) continue;
      const hill = o.hill ? o.hill(bx) : 1; const bh = b.h * hill;
      for (let k = 0; k < 3; k++) if (r() < L.p) {
        const wy = baseY - bh + 6 + r() * (bh - 8), wx = bx + 3 + r() * Math.max(1, b.w - 8);
        c.fillStyle = rgba(L.col, L.a * (0.6 + 0.4 * Math.sin(r() * 9 + (o.t || 0) * 0.7))); c.fillRect(wx, wy, 2.5, 3);
      }
    }
  }
}
function galata(c, x, y, s, col) {
  c.fillStyle = rgba(col);
  c.fillRect(x - 14 * s, y - 92 * s, 28 * s, 92 * s);
  c.fillRect(x - 19 * s, y - 106 * s, 38 * s, 14 * s);
  c.fillRect(x - 14 * s, y - 120 * s, 28 * s, 14 * s);
  c.beginPath(); c.moveTo(x - 18 * s, y - 120 * s); c.lineTo(x, y - 166 * s); c.lineTo(x + 18 * s, y - 120 * s); c.fill();
  c.fillRect(x - 1 * s, y - 180 * s, 2 * s, 16 * s);
}
function mosque(c, x, y, s, col) {
  c.fillStyle = rgba(col);
  c.beginPath(); c.arc(x, y - 52 * s, 44 * s, Math.PI, 0); c.lineTo(x + 44 * s, y); c.lineTo(x - 44 * s, y); c.fill();
  for (const d of [-1, 1]) { c.beginPath(); c.arc(x + d * 52 * s, y - 28 * s, 24 * s, Math.PI, 0); c.lineTo(x + d * 76 * s, y); c.lineTo(x + d * 28 * s, y); c.fill(); }
  c.fillRect(x - 1.5 * s, y - 112 * s, 3 * s, 18 * s);
  for (const d of [-1, 1]) {
    const mx = x + d * 92 * s;
    c.fillRect(mx - 3.2 * s, y - 128 * s, 6.4 * s, 128 * s);
    c.fillRect(mx - 6 * s, y - 100 * s, 12 * s, 4 * s);
    c.beginPath(); c.moveTo(mx - 4.2 * s, y - 128 * s); c.lineTo(mx, y - 156 * s); c.lineTo(mx + 4.2 * s, y - 128 * s); c.fill();
  }
}
// ---------- vapur ----------
function ferry(c, x, y, s, dir, o = {}) {
  const lit = o.lit === undefined ? 0.6 : o.lit, D = o.dim === undefined ? 1 : o.dim, t = o.t || 0;
  const body = mul(o.body || [238, 234, 226], D), hull = mul(o.hull || [34, 42, 62], Math.max(D, 0.5)), red = mul([186, 38, 46], D);
  const warm = [255, 214, 130], dark = [24, 30, 48];
  c.save(); c.translate(x, y); c.scale(dir * s, s);
  if (lit > 0.05) { // su yansıması
    c.save(); c.globalAlpha = 0.4 * lit;
    for (let i = 0; i < 24; i++) { const wx = -146 + i * 12.2, wl = 14 + (Math.sin(t * 3 + i * 1.7) * 0.5 + 0.5) * 36; c.fillStyle = rgba(warm, 0.55); c.fillRect(wx, 6, 6, wl); }
    c.restore();
  }
  c.fillStyle = rgba(hull); c.beginPath(); c.moveTo(-178, -34); c.lineTo(168, -34); c.quadraticCurveTo(196, -36, 208, -56); c.lineTo(182, 0); c.lineTo(-166, 0); c.quadraticCurveTo(-182, -14, -178, -34); c.fill();
  c.fillStyle = rgba(red); c.fillRect(-168, -14, 346, 5);
  c.fillStyle = rgba(body); c.fillRect(-152, -62, 300, 28);
  c.fillRect(-106, -88, 204, 26);
  c.fillRect(-26, -108, 86, 20);
  const win = mix(dark, warm, lit);
  c.fillStyle = rgba(win);
  for (let i = 0; i < 24; i++) c.fillRect(-144 + i * 12.2, -56, 8, 11);
  for (let i = 0; i < 16; i++) c.fillRect(-98 + i * 12.4, -82, 8, 11);
  c.fillRect(-20, -103, 74, 9);
  c.fillStyle = rgba(red); c.fillRect(-78, -134, 22, 48); c.fillRect(20, -134, 22, 48);
  c.fillStyle = rgba(mul([22, 24, 30], D)); c.fillRect(-78, -134, 22, 9); c.fillRect(20, -134, 22, 9);
  c.strokeStyle = rgba(mul(body, 0.8)); c.lineWidth = 2; c.beginPath(); c.moveTo(130, -34); c.lineTo(130, -96); c.moveTo(-140, -62); c.lineTo(-140, -80); c.stroke();
  c.fillStyle = rgba(mul(body, 0.85)); c.fillRect(-160, -64, 310, 2.5);
  if (lit > 0.3) glow(c, 0, -52, 150, warm, 0.22 * lit, 'lighter');
  c.restore();
  if (o.wake) { // köpük izi
    c.save(); c.translate(x, y); c.scale(dir * s, s); c.lineCap = 'round';
    for (let i = 0; i < 7; i++) { c.strokeStyle = `rgba(255,255,255,${0.32 - i * 0.04})`; c.lineWidth = 2.4; const len = 160 + i * 55 + Math.sin(t * 2 + i) * 14; c.beginPath(); c.moveTo(-170, 1 + i * 1.6); c.lineTo(-170 - len, 2 + i * 3.2); c.stroke(); }
    c.restore();
  }
}
function gull(c, x, y, s, ph, col) {
  c.save(); c.translate(x, y); c.scale(s, s); const f = Math.sin(ph) * 9;
  c.strokeStyle = col || 'rgba(18,16,30,0.9)'; c.lineWidth = 2.3; c.lineCap = 'round'; c.lineJoin = 'round';
  c.beginPath(); c.moveTo(-22, -f * 0.1); c.quadraticCurveTo(-11, -9 - f, 0, 0); c.quadraticCurveTo(11, -9 - f, 22, -f * 0.1); c.stroke(); c.restore();
}
// ---------- insan silüetleri ----------
function person(c, o) {
  const { x, y, s = 1, dir = 1, ph = 0, t = 0, col = [14, 14, 26], rim = null, wind = 0.3, kind = 'girl', pose = 'walk', umbrella = 0, suitcase = 0, head = 0, alpha = 1 } = o;
  const dr = (fill, dx, dy, last) => {
    c.save(); c.globalAlpha *= alpha; c.translate(x + dx, y + dy); c.scale(dir * s, s);
    c.fillStyle = fill; c.strokeStyle = fill; c.lineCap = 'round'; c.lineJoin = 'round';
    let amp = 0, lean = 0, kfl = 0, armA = 0, elb = 0.1;
    if (pose === 'walk') { amp = 0.5; lean = 0.06; kfl = 0.55; armA = 0.45; elb = 0.35; }
    else if (pose === 'run') { amp = 0.95; lean = 0.3; kfl = 1.4; armA = 1.0; elb = 1.3; }
    const sit = pose === 'sit';
    // bacak noktaları (kalçaya göre)
    const legs = [0, Math.PI].map(p => {
      if (sit) return null;
      const a = pose === 'stand' ? (p === 0 ? 0.05 : -0.06) : Math.sin(ph + p) * amp;
      const kf = pose === 'stand' ? 0.04 : Math.max(0, Math.cos(ph + p)) * kfl;
      const kx = Math.sin(a) * 42, ky = Math.cos(a) * 42, a2 = a - kf;
      return { kx, ky, ax: kx + Math.sin(a2) * 42, ay: ky + Math.cos(a2) * 42 };
    });
    const hipY = sit ? -50 : -Math.max(legs[0].ay, legs[1].ay), hipX = 0;
    const shY = hipY - 50 * Math.cos(lean), shX = hipX + 50 * Math.sin(lean);
    // arka kol
    const arm = (p, front) => {
      let b = -Math.sin(ph + p) * armA, e = elb;
      const sx = shX, sy = shY + 5;
      let ex, ey, hx2, hy2;
      if (sit) { ex = sx + 6; ey = sy + 26; hx2 = ex + 26; hy2 = ey + 2; if (!front) { hx2 -= 4; } }
      else { ex = sx + Math.sin(b) * 28; ey = sy + Math.cos(b) * 28; hx2 = ex + Math.sin(b + e) * 26; hy2 = ey + Math.cos(b + e) * 26; }
      c.lineWidth = 9; c.beginPath(); c.moveTo(sx, sy); c.lineTo(ex, ey); c.stroke();
      c.lineWidth = 8; c.beginPath(); c.moveTo(ex, ey); c.lineTo(hx2, hy2); c.stroke();
      if (front && last && o.out) { o.out.hx = x + dx + dir * s * hx2; o.out.hy = y + dy + s * hy2; }
      return [hx2, hy2];
    };
    arm(Math.PI, false);
    // bacaklar
    c.lineWidth = 14;
    if (sit) {
      c.lineWidth = 15; c.beginPath(); c.moveTo(0, hipY); c.lineTo(40, hipY + 2); c.stroke();
      c.lineWidth = 11; c.beginPath(); c.moveTo(40, hipY + 2); c.lineTo(42, -6); c.stroke();
      c.lineWidth = 7; c.beginPath(); c.moveTo(42, -4); c.lineTo(55, -2); c.stroke();
    } else for (const L of legs) {
      c.lineWidth = 14; c.beginPath(); c.moveTo(hipX, hipY); c.lineTo(hipX + L.kx, hipY + L.ky); c.stroke();
      c.lineWidth = 10; c.beginPath(); c.moveTo(hipX + L.kx, hipY + L.ky); c.lineTo(hipX + L.ax, hipY + L.ay); c.stroke();
      c.lineWidth = 7; c.beginPath(); c.moveTo(hipX + L.ax, hipY + L.ay); c.lineTo(hipX + L.ax + 10, hipY + L.ay + 1); c.stroke();
    }
    // gövde / palto
    const girl = kind === 'girl';
    const hemY = hipY + (girl ? (sit ? 4 : 36) : 16), flare = girl ? 14 : 8;
    const wsw = wind * (16 + Math.sin(t * 6 + ph) * 6);
    c.beginPath(); c.moveTo(shX - 12, shY - 2); c.lineTo(shX + 12, shY - 2); c.lineTo(hipX + 13 + flare * 0.6, hemY); c.lineTo(hipX - 13 - flare - wsw * 0.3, hemY + (girl ? 4 : 0)); c.closePath(); c.fill();
    if (!sit) {
      c.beginPath(); c.moveTo(hipX - 9, hemY - 22); c.quadraticCurveTo(hipX - 22 - wind * 46, hemY - 8 + Math.sin(t * 7 + ph) * 7 * wind, hipX - 14 - wind * 52, hemY + 4 + Math.sin(t * 5) * 5 * wind); c.lineTo(hipX - 10, hemY); c.closePath(); c.fill();
    }
    // baş
    const hx2 = shX + Math.sin(lean) * 10 + head * 3, hy2 = shY - 19;
    c.lineWidth = 7; c.beginPath(); c.moveTo(shX, shY); c.lineTo(hx2, hy2 + 8); c.stroke();
    c.beginPath(); c.arc(hx2, hy2, 11, 0, TAU); c.fill();
    if (girl) {
      const sw = Math.sin(t * 4.2 + 1) * 5 * (0.4 + wind), L = 30 + wind * 42;
      c.beginPath(); c.moveTo(hx2 + 8, hy2 - 9);
      c.bezierCurveTo(hx2 - 14, hy2 - 20, hx2 - 26 - wind * 10, hy2 + 4, hx2 - L + sw, hy2 + 28 + Math.sin(t * 3) * 3);
      c.lineTo(hx2 - L * 0.55 + sw * 0.6, hy2 + 36);
      c.bezierCurveTo(hx2 - 8, hy2 + 18, hx2 + 5, hy2 + 8, hx2 + 8, hy2 + 3); c.closePath(); c.fill();
      c.beginPath(); c.moveTo(hx2 - 6, hy2 - 4); c.quadraticCurveTo(hx2 - L * 0.7 + sw, hy2 + 4, hx2 - L * 1.1 + sw * 1.4, hy2 + 20 + Math.sin(t * 5) * 4); c.lineTo(hx2 - L * 0.6, hy2 + 14); c.closePath(); c.fill();
    } else {
      c.beginPath(); c.ellipse(hx2 - 1, hy2 - 4, 12.5, 9, 0, Math.PI, 0); c.fill();
      c.beginPath(); c.moveTo(hx2 - 8, hy2 - 8); c.lineTo(hx2 - 15 - wind * 6, hy2 - 3 + Math.sin(t * 6) * 2); c.lineTo(hx2 - 6, hy2); c.fill();
    }
    // ön kol
    const hand = arm(0, true);
    if (suitcase) { c.fillStyle = rgba(mul(col, 1.5)); c.fillRect(hand[0] - 12, hand[1], 28, 22); c.fillStyle = fill; }
    if (umbrella) {
      c.lineWidth = 2.2; c.beginPath(); c.moveTo(hand[0], hand[1]); c.lineTo(hx2 + 6, hy2 - 62); c.stroke();
      c.beginPath(); c.moveTo(hx2 - 52, hy2 - 38); c.quadraticCurveTo(hx2 + 6, hy2 - 92, hx2 + 64, hy2 - 38);
      c.quadraticCurveTo(hx2 + 40, hy2 - 46, hx2 + 20, hy2 - 38); c.quadraticCurveTo(hx2 + 6, hy2 - 48, hx2 - 10, hy2 - 38); c.quadraticCurveTo(hx2 - 32, hy2 - 46, hx2 - 52, hy2 - 38); c.fill();
    }
    c.restore();
  };
  let last = false;
  if (rim) dr(rgba(rim), 1.6 * dir * s, -1.4 * s, false);
  last = true; dr(rgba(col), 0, 0, true);
}
// bankta oturan (önden)
function sitFront(c, o) {
  const { x, y, s = 1, col, rim, kind = 'girl', t = 0, lean = 0 } = o;
  const dr = (fill, dx, dy) => {
    c.save(); c.translate(x + dx, y + dy); c.scale(s, s); c.fillStyle = fill; c.strokeStyle = fill; c.lineCap = 'round'; c.lineJoin = 'round';
    const seat = -44;
    c.lineWidth = 13; c.beginPath(); c.moveTo(-9, seat); c.lineTo(-11, -4); c.moveTo(9, seat); c.lineTo(11, -4); c.stroke();
    c.lineWidth = 7; c.beginPath(); c.moveTo(-11, -3); c.lineTo(-18, 0); c.moveTo(11, -3); c.lineTo(18, 0); c.stroke();
    c.beginPath(); c.moveTo(-21, seat - 50); c.quadraticCurveTo(0, seat - 58, 21, seat - 50); c.lineTo(18, seat + 5); c.lineTo(-18, seat + 5); c.closePath(); c.fill();
    c.lineWidth = 8; c.beginPath(); c.moveTo(-19, seat - 47); c.lineTo(-23, seat - 20); c.lineTo(-6, seat - 12); c.moveTo(19, seat - 47); c.lineTo(34, seat - 30); c.lineTo(37, seat - 38); c.stroke();
    c.lineWidth = 8; c.beginPath(); c.moveTo(0, seat - 56); c.lineTo(lean * 3, seat - 66); c.stroke();
    const hx2 = lean * 6, hy2 = seat - 77;
    c.beginPath(); c.arc(hx2, hy2, 12, 0, TAU); c.fill();
    if (kind === 'girl') {
      const sw = Math.sin(t * 2 + 1) * 2;
      c.beginPath(); c.moveTo(hx2 - 13, hy2 + 2); c.bezierCurveTo(hx2 - 15, hy2 - 18, hx2 + 15, hy2 - 18, hx2 + 13, hy2 + 2);
      c.bezierCurveTo(hx2 + 24, hy2 + 18, hx2 + 27, seat - 40, hx2 + 22 + sw, seat - 26); c.lineTo(hx2 + 9, seat - 46); c.lineTo(hx2 - 9, seat - 46); c.lineTo(hx2 - 22 - sw, seat - 26);
      c.bezierCurveTo(hx2 - 27, seat - 40, hx2 - 24, hy2 + 18, hx2 - 13, hy2 + 2); c.fill();
    } else { c.beginPath(); c.ellipse(hx2, hy2 - 4, 12.5, 9, 0, Math.PI, 0); c.fill(); }
    c.restore();
  };
  if (rim) dr(rgba(rim), 1.6 * s, -1.3 * s); dr(rgba(col), 0, 0);
}
function bench(c, x, y, s, col) {
  c.save(); c.translate(x, y); c.scale(s, s); c.fillStyle = rgba(col);
  for (const lx of [-66, 66]) { c.fillRect(lx - 3, -40, 6, 40); c.fillRect(lx - 3, -92, 6, 52); }
  c.fillRect(-78, -44, 156, 7);
  for (let i = 0; i < 3; i++) c.fillRect(-78, -92 + i * 13, 156, 8);
  c.fillRect(-82, -62, 8, 20); c.fillRect(74, -62, 8, 20);
  c.restore();
}
function teaGlass(c, x, y, s, a, t, steam, seed = 1) {
  c.save(); c.translate(x, y); c.scale(s, s);
  glow(c, 0, 8, 26, [255, 150, 60], 0.5 * a);
  c.fillStyle = `rgba(190,70,20,${0.55 + 0.45 * a})`; c.beginPath(); c.moveTo(-6, 0); c.lineTo(6, 0); c.quadraticCurveTo(7, 12, 3.5, 17); c.lineTo(-3.5, 17); c.quadraticCurveTo(-7, 12, -6, 0); c.fill();
  c.fillStyle = `rgba(255,190,100,${0.4 * a})`; c.fillRect(-4, 2, 3, 10);
  c.fillStyle = 'rgba(20,14,20,0.9)'; c.beginPath(); c.ellipse(0, 18, 11, 2.5, 0, 0, TAU); c.fill();
  if (steam > 0.02) {
    c.lineCap = 'round';
    for (let i = 0; i < 4; i++) {
      c.strokeStyle = `rgba(255,255,255,${0.32 * steam * (0.6 + 0.4 * Math.sin(t * 1.3 + i))})`; c.lineWidth = 3.2; c.beginPath();
      for (let k = 0; k <= 12; k++) { const yy = -k * 7 - 2, xx = Math.sin(k * 0.5 + t * 1.6 + i * 1.9) * (1.5 + k * 0.55) + (i - 1.5) * 2.5; k ? c.lineTo(xx, yy) : c.moveTo(xx, yy); }
      c.stroke();
    }
  }
  c.restore();
}
// ---------- atmosfer ----------
function bokeh(c, t, seed, n, cols, rmin, rmax, y0, y1, a, drift = 6) {
  const r = rng(seed); c.save(); c.globalCompositeOperation = 'lighter';
  for (let i = 0; i < n; i++) {
    const x = (((r() * W + t * drift * (r() - 0.3)) % W) + W) % W, y = y0 + r() * (y1 - y0), rad = (rmin + r() * (rmax - rmin)) * (1 + 0.1 * KK), col = cols[Math.floor(r() * cols.length)];
    const al = a * (0.5 + 0.5 * Math.sin(t * 0.8 + r() * TAU));
    const g = c.createRadialGradient(x, y, rad * 0.15, x, y, rad); g.addColorStop(0, rgba(col, al * 0.45)); g.addColorStop(0.82, rgba(col, al * 0.9)); g.addColorStop(1, rgba(col, 0));
    c.fillStyle = g; c.beginPath(); c.arc(x, y, rad, 0, TAU); c.fill();
  }
  c.restore();
}
function rain(c, t, amt, slant, col, a, len = 26, sp = 900, seed = 3) {
  const r = rng(seed); c.strokeStyle = rgba(col || [190, 210, 255], a); c.lineWidth = 1.2; c.beginPath();
  for (let i = 0; i < amt; i++) {
    const x0 = r() * (W + 600) - 300, y0 = r() * H, v = sp * (0.7 + r() * 0.6), y = ((y0 + t * v) % (H + 60)) - 30, x = x0 - y * slant;
    c.moveTo(x, y); c.lineTo(x - slant * len, y + len);
  }
  c.stroke();
}
function vignette(c, a = 0.55) {
  const g = c.createRadialGradient(W / 2, H / 2, H * 0.35, W / 2, H / 2, H * 1.0); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, `rgba(0,0,0,${a})`);
  c.fillStyle = g; c.fillRect(0, 0, W, H);
}
function desat(c, amt) { if (amt <= 0.01) return; c.save(); c.globalCompositeOperation = 'saturation'; c.globalAlpha = clamp(amt); c.fillStyle = '#808080'; c.fillRect(0, 0, W, H); c.restore(); }
function tint(c, col, a, mode) { c.save(); if (mode) c.globalCompositeOperation = mode; c.fillStyle = rgba(col, a); c.fillRect(0, 0, W, H); c.restore(); }
function txt(c, s, x, y, size, o = {}) {
  c.save(); c.font = `${o.style || ''} ${o.weight || ''} ${size}px ${o.font || FONT}`; c.letterSpacing = (o.sp || 0) + 'px'; c.textAlign = o.align || 'left'; c.textBaseline = 'alphabetic';
  c.fillStyle = o.col || '#fff'; c.globalAlpha *= o.a === undefined ? 1 : o.a;
  if (o.shadow) { c.shadowColor = o.shadow; c.shadowBlur = o.sb || 12; }
  c.fillText(s, x, y); c.restore();
}
function rrect(c, x, y, w, h, r) { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }
// iskele zemini (planklar)
function pierDeck(c, y0, col, lineCol, t) {
  c.fillStyle = rgba(col); c.fillRect(-300, y0, W + 600, H - y0 + 300);
  c.strokeStyle = rgba(lineCol, 0.5); c.lineWidth = 1.5;
  for (let i = 0; i < 9; i++) { const yy = y0 + Math.pow(i / 9, 1.6) * (H - y0 + 120) + 6; c.beginPath(); c.moveTo(-300, yy); c.lineTo(W + 300, yy); c.stroke(); }
  c.fillStyle = rgba(mul(col, 0.55)); c.fillRect(-300, y0, W + 600, 5);
}
