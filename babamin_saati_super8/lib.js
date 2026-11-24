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
