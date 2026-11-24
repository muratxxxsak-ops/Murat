'use strict';
const PER = 60 / 104, B0 = 0.1, bph = t => (t - B0) / PER;
const pulse = t => { let f = bph(t) % 1; if (f < 0) f += 1; return Math.pow(1 - f, 3); };
const TEAL = [20, 230, 220], MAG = [255, 40, 170], ORG = [255, 150, 40], BLU = [60, 110, 255], VIO = [150, 80, 255], RED = [255, 40, 60];
const NC = [TEAL, MAG, ORG, BLU, VIO];
const hsh = (a, b, c = 0) => { const v = Math.sin(a * 12.9898 + b * 78.233 + c * 37.719) * 43758.5453; return v - Math.floor(v); };
const MONO = "'JetBrains Mono','DejaVu Sans Mono',monospace";
const G = (c, x, y, r, col, a, m = 'lighter') => glow(c, x, y, Math.max(0.5, r), col, a, m);
function sky(c, t, top, bot, hy = 420) { c.fillStyle = vgrad(c, 0, hy + 80, [[0, top], [1, bot]]); c.fillRect(-300, -300, W + 600, hy + 380); }
// katmanlı gökdelen silüeti (yan/kuşbakışı)
function layer(c, t, o) {
  const { seed, base, hmin, hmax, wmin, wmax, scroll = 0, col, lp = 0.3, edge = null, wa = 0.8, neon = 0 } = o, r = rng(seed), list = []; let x = 0;
  while (x < 2600) { const w = wmin + r() * (wmax - wmin); list.push({ x, w, h: hmin + r() * (hmax - hmin), n: r() }); x += w + r() * 10; } const tot = x;
  list.forEach((b, i) => {
    const bx = (((b.x - scroll) % tot) + tot) % tot - 300; if (bx > W + 50) return;
    c.fillStyle = rgba(col); c.fillRect(bx, base - b.h, b.w, b.h + 400);
    if (edge) { c.fillStyle = rgba(edge, 0.55); c.fillRect(bx, base - b.h, 2, b.h); c.fillRect(bx, base - b.h, b.w, 2); }
    const nx = Math.floor(b.w / 9), ny = Math.floor(b.h / 12);
    for (let i2 = 0; i2 < nx; i2++) for (let j = 0; j < ny; j++) { const hv = hsh(i + o.seed, i2, j); if (hv < lp + pulse(t) * 0.05 * (hv > 0.9 ? 1 : 0)) { c.fillStyle = rgba(hv < lp * 0.4 ? [255, 190, 90] : TEAL, wa * (0.5 + 0.5 * hsh(i2, j, i))); c.fillRect(bx + 3 + i2 * 9, base - b.h + 6 + j * 12, 4, 5); } }
    if (neon && b.n > 0.55) { const col2 = NC[(i + o.seed) % 5]; c.fillStyle = rgba(col2, 0.9); c.fillRect(bx + b.w - 4, base - b.h + 10, 3, Math.min(b.h - 20, 120)); G(c, bx + b.w - 2, base - b.h + 60, 60, col2, 0.35 * neon); }
  });
}
function drone(c, x, y, s, t, o = {}) {
  const col = o.col || RED; c.save(); c.translate(x, y); c.scale(s, s);
  if (o.beam) { const g = c.createLinearGradient(0, 10, 0, 520); g.addColorStop(0, rgba(col, 0.38)); g.addColorStop(1, rgba(col, 0)); c.save(); c.globalCompositeOperation = 'lighter'; c.fillStyle = g; c.beginPath(); c.moveTo(-8, 10); c.lineTo(8, 10); c.lineTo(o.beam * 120 + 150, 520); c.lineTo(o.beam * 120 - 150, 520); c.fill(); c.restore(); }
  c.fillStyle = '#05070d'; c.beginPath(); c.ellipse(0, 0, 34, 12, 0, 0, TAU); c.fill(); c.strokeStyle = rgba([120, 140, 190], 0.6); c.lineWidth = 1.5; c.stroke();
  for (const sd of [-1, 1]) { c.fillStyle = 'rgba(160,180,230,0.25)'; c.beginPath(); c.ellipse(sd * 40, -8, 26, 3 + Math.abs(Math.sin(t * 40)) * 1.5, 0, 0, TAU); c.fill(); c.fillStyle = '#05070d'; c.fillRect(sd * 34 - 2, -10, 4, 10); }
  c.fillStyle = rgba(col, 0.95); c.beginPath(); c.arc(0, 4, 5 + pulse(t) * 2, 0, TAU); c.fill(); G(c, 0, 4, 40, col, 0.8); c.restore();
}
// yandan motosiklet + kuryeci
function bike(c, x, y, s, t, o = {}) {
  const { ph = 0, head = 0, lean = 0, out = null, rim = TEAL } = o; c.save(); c.translate(x, y); c.scale(s, s); c.rotate(lean);
  const wheel = wx => { c.save(); c.translate(wx, -32); c.fillStyle = '#04050a'; c.beginPath(); c.arc(0, 0, 32, 0, TAU); c.fill(); c.strokeStyle = rgba(rim, 0.95); c.lineWidth = 3.5; c.beginPath(); c.arc(0, 0, 26, 0, TAU); c.stroke(); G(c, 0, 0, 70, rim, 0.3); c.strokeStyle = rgba(rim, 0.35); c.lineWidth = 1.2; for (let i = 0; i < 6; i++) { const a = ph + i / 6 * Math.PI; c.beginPath(); c.moveTo(Math.cos(a) * 24, Math.sin(a) * 24); c.lineTo(-Math.cos(a) * 24, -Math.sin(a) * 24); c.stroke(); } c.restore(); };
  wheel(-66); wheel(66);
  const body = (fill, dx, dy) => { c.save(); c.translate(dx, dy); c.fillStyle = fill; c.strokeStyle = fill; c.lineJoin = 'round'; c.lineCap = 'round';
    c.beginPath(); c.moveTo(-70, -34); c.lineTo(-52, -70); c.lineTo(-10, -78); c.lineTo(32, -92); c.lineTo(54, -86); c.lineTo(66, -40); c.lineTo(52, -34); c.lineTo(20, -46); c.lineTo(-14, -42); c.closePath(); c.fill();
    c.lineWidth = 7; c.beginPath(); c.moveTo(58, -92); c.lineTo(68, -34); c.stroke(); c.lineWidth = 5; c.beginPath(); c.moveTo(44, -96); c.lineTo(66, -100); c.stroke();
    c.lineWidth = 24; c.beginPath(); c.moveTo(-14, -78); c.lineTo(24, -128); c.stroke(); c.lineWidth = 15; c.beginPath(); c.moveTo(-8, -68); c.lineTo(34, -52); c.lineTo(28, -36); c.stroke();
    c.lineWidth = 8; c.beginPath(); c.moveTo(24, -122); c.lineTo(42, -104); c.lineTo(64, -98); c.stroke();
    c.beginPath(); c.arc(38, -142, 17, 0, TAU); c.fill(); c.restore(); };
  body(rgba(rim, 0.9), 2, -2); body('#080a14', 0, 0);
  const vg = c.createLinearGradient(30, -150, 56, -130); vg.addColorStop(0, rgba(MAG, 0.95)); vg.addColorStop(1, rgba(TEAL, 0.95)); c.fillStyle = vg; c.beginPath(); c.ellipse(48, -141, 9, 6.5, 0.1, 0, TAU); c.fill();
  c.fillStyle = rgba(MAG, 0.95); c.fillRect(-40, -92, 10, 3); c.fillStyle = rgba(TEAL, 0.9); c.fillRect(-4, -108, 22, 2.5);
  G(c, -70, -60, 50, RED, 0.9); c.fillStyle = rgba(RED); c.fillRect(-76, -66, 8, 5);
  if (head) { G(c, 76, -64, 90, [255, 240, 210], 0.85 * head); const g = c.createLinearGradient(76, 0, 900, 0); g.addColorStop(0, `rgba(255,236,200,${0.5 * head})`); g.addColorStop(1, 'rgba(255,236,200,0)'); c.save(); c.globalCompositeOperation = 'lighter'; c.fillStyle = g; c.beginPath(); c.moveTo(72, -66); c.lineTo(900, -250); c.lineTo(900, 120); c.lineTo(72, -58); c.fill(); c.restore(); }
  if (out) { out.hx = x + s * 66; out.hy = y + s * -98; }
  c.restore();
}
function hud(c, t, o = {}) {
  c.save(); const col = rgba(TEAL, 0.85); c.strokeStyle = col; c.lineWidth = 2;
  for (const [x, y, sx, sy] of [[70, 76, 1, 1], [W - 70, 76, -1, 1], [70, H - 76, 1, -1], [W - 70, H - 76, -1, -1]]) { c.beginPath(); c.moveTo(x, y + sy * 30); c.lineTo(x, y); c.lineTo(x + sx * 30, y); c.stroke(); }
  const up = o.up === undefined ? 0 : o.up, lines = o.lines || [];
  lines.forEach((s, i) => txt(c, s, 88, 112 + i * 18, 12, { font: MONO, col: rgba(TEAL, 0.9), sp: 1.5 }));
  txt(c, 'BPM 104', 88, H - 100, 12, { font: MONO, col: rgba(ORG, 0.95), sp: 2 });
  const tc = Math.floor(t / 60) + ':' + String(Math.floor(t % 60)).padStart(2, '0'); txt(c, 'T+' + tc, W - 88, H - 100, 12, { font: MONO, col: rgba(TEAL, 0.9), sp: 2, align: 'right' });
  c.strokeStyle = rgba(TEAL, 0.5); c.strokeRect(300, H - 112, 680, 10); c.fillStyle = rgba(up >= 100 ? MAG : TEAL, 0.95); c.fillRect(302, H - 110, 676 * clamp(up / 100), 6);
  txt(c, 'YAYIN YÜKLENİYOR  ' + Math.floor(up) + '%', 640, H - 120, 12, { font: MONO, col: rgba(TEAL, 0.95), sp: 3, align: 'center' });
  c.restore();
}
const UP = t => t < 20 ? 0 : t < 44 ? lerp(0, 28, (t - 20) / 24) : t < 81.5 ? lerp(28, 72, (t - 44) / 37.5) : t < 89.7 ? lerp(72, 99, (t - 81.5) / 8.2) : 100;
function rainFx(c, t, n, a, slant = 0.22, seed = 3) { rain(c, t, n, slant, [170, 210, 255], a, 28, 1000, seed); }
// ===== pseudo-3D yol =====
function road3d(c, t, o) {
  const f = 640, camY = 2.4, D = o.dist, bend = o.bend || 0, camX = o.camX || 0, SPc = 14, VPXv = 640, VPYv = 310;
  const P = (x, y, z) => { const xw = x + bend * z * z * 0.00004; return [VPXv + (xw - camX) * f / z, VPYv + (camY - y) * f / z]; };
  sky(c, t, [4, 6, 18], mix([50, 20, 90], [20, 40, 70], 0.4), VPYv);
  G(c, 640 + bend * 40, VPYv, 620, o.glowCol || MAG, 0.7 * (o.lit === undefined ? 1 : o.lit)); G(c, 640 + bend * 40, VPYv, 260, [255, 200, 240], 0.35);
  c.fillStyle = vgrad(c, VPYv, H, [[0, [14, 12, 30]], [1, [4, 4, 12]]]); c.fillRect(-300, VPYv, W + 600, 500);
  const roadHalf = 9, lit = o.lit === undefined ? 1 : o.lit;
  const quad = (a, b, cc, d, col) => { c.fillStyle = col; c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.lineTo(cc[0], cc[1]); c.lineTo(d[0], d[1]); c.closePath(); c.fill(); };
  quad(P(-roadHalf, 0, 4), P(roadHalf, 0, 4), P(roadHalf, 0, 300), P(-roadHalf, 0, 300), 'rgba(10,12,26,1)');
  for (let k = 30; k >= 1; k--) { const z0 = k * SPc - (D % SPc); if (z0 < 4) continue; const a = clamp(1 - z0 / 330); for (const lx of [-3, 3]) { quad(P(lx - 0.12, 0, z0), P(lx + 0.12, 0, z0), P(lx + 0.12, 0, z0 + 5), P(lx - 0.12, 0, z0 + 5), rgba(TEAL, 0.9 * a)); } }
  for (const sd of [-1, 1]) { quad(P(sd * roadHalf, 0, 4), P(sd * (roadHalf + 0.3), 0, 4), P(sd * (roadHalf + 0.3), 0, 300), P(sd * roadHalf, 0, 300), rgba(sd < 0 ? MAG : TEAL, 0.9 * lit)); }
  const N = 24, idx0 = Math.floor(D / SPc);
  for (let k = N; k >= 1; k--) {
    const z = k * SPc - (D % SPc) + 4, id = idx0 + k;
    for (const sd of [-1, 1]) {
      const h = 22 + hsh(id, sd, 1) * 80, w = 7 + hsh(id, sd, 2) * 9, xi = sd * (roadHalf + 1.6 + hsh(id, sd, 3) * 2), xo = xi + sd * w, dz = SPc - 1.5;
      const A = P(xi, 0, z), B = P(xi, h, z), Cc = P(xi, h, z + dz), Dd = P(xi, 0, z + dz);
      quad(A, B, Cc, Dd, 'rgb(22,26,58)'); const fa = clamp(1 - z / 320);
      const x1 = P(xi, 0, z)[0], x2 = P(xo, 0, z)[0], yt = P(xi, h, z)[1], yb = P(xi, 0, z)[1];
      c.fillStyle = 'rgb(12,15,36)'; c.fillRect(Math.min(x1, x2), yt, Math.abs(x2 - x1), yb - yt);
      c.fillStyle = rgba(NC[(id + (sd > 0 ? 1 : 0)) % 5], 0.9 * fa * lit); c.fillRect(x1 - (sd < 0 ? 1.5 : 0), yt, 3, yb - yt);
      if (z < 150 && lit > 0.05) { const rows = Math.floor(h / 4), cols = 3; for (let r = 0; r < rows; r++) for (let q = 0; q < cols; q++) { if (hsh(id + q, r, sd) < 0.42 + pulse(t) * 0.08 * hsh(r, id, 5)) { const wx = xi + sd * (0.8 + q * (w - 1.2) / cols), p0 = P(wx, r * 4 + 1, z), p1 = P(wx + sd * (w - 1.8) / cols, r * 4 + 3, z); c.fillStyle = rgba(hsh(id, r, q) > 0.7 ? ORG : TEAL, 0.75 * fa * lit); c.fillRect(Math.min(p0[0], p1[0]), Math.min(p0[1], p1[1]), Math.abs(p1[0] - p0[0]), Math.abs(p1[1] - p0[1])); } } }
      if (o.arches && id % 3 === 0) { const col = NC[(id >> 1) % 5]; const p1 = P(-roadHalf, 0, z), p2 = P(roadHalf, 0, z), p3 = P(-roadHalf, 26, z), p4 = P(roadHalf, 26, z); c.strokeStyle = rgba(col, 0.95 * fa); c.lineWidth = Math.max(2, 22 / z * 7); c.beginPath(); c.moveTo(p1[0], p1[1]); c.lineTo(p3[0], p3[1]); c.lineTo(p4[0], p4[1]); c.lineTo(p2[0], p2[1]); c.stroke(); G(c, 640 + (p3[0] + p4[0]) / 2 - 640, (p3[1] + p4[1]) / 2, 700 / z * 60, col, 0.35 * fa); }
    }
  }
  for (let i = 0; i < (o.cars || 6); i++) { const z = ((hsh(i, 1) * 200 + 30 + D * 0.2 * (0.3 + hsh(i, 2))) % 220) + 8, lx = [-6, -3, 0, 3, 6][i % 5] + (i % 2 ? 0.4 : -0.4), p = P(lx, 0.9, z); c.fillStyle = rgba(RED, 0.95); G(c, p[0], p[1], 520 / z * 0.8 + 10, RED, 0.7); c.fillRect(p[0] - 520 / z * 0.7, p[1] - 2, 520 / z * 0.4, 3); c.fillRect(p[0] + 520 / z * 0.3, p[1] - 2, 520 / z * 0.4, 3); }
  if (o.rain !== false) rainFx(c, t, 260, 0.28);
  return P;
}
function bikeBack(c, x, y, s, t, lean) {
  c.save(); c.translate(x, y); c.rotate(lean); c.scale(s, s);
  c.fillStyle = '#04050a'; c.beginPath(); c.ellipse(0, -20, 16, 40, 0, 0, TAU); c.fill(); G(c, 0, -56, 50, RED, 0.7); c.fillStyle = rgba(RED); c.fillRect(-16, -64, 32, 6);
  c.fillStyle = '#080a14'; c.beginPath(); c.moveTo(-34, -70); c.lineTo(34, -70); c.lineTo(28, -150); c.lineTo(-28, -150); c.closePath(); c.fill(); c.fillStyle = rgba(MAG, 0.9); c.fillRect(-3, -146, 6, 74); G(c, 0, -110, 70, MAG, 0.35);
  c.fillStyle = '#080a14'; c.beginPath(); c.arc(0, -172, 20, 0, TAU); c.fill(); c.strokeStyle = rgba(TEAL, 0.9); c.lineWidth = 2.5; c.beginPath(); c.arc(0, -172, 20, Math.PI * 1.1, Math.PI * 1.9); c.stroke();
  c.strokeStyle = '#080a14'; c.lineWidth = 14; c.lineCap = 'round'; c.beginPath(); c.moveTo(-28, -136); c.lineTo(-62, -100); c.moveTo(28, -136); c.lineTo(62, -100); c.stroke();
  c.restore();
}
