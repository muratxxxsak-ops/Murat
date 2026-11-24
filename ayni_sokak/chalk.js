'use strict';
const PER = 60 / ENERGY.bpm, B0 = ENERGY.ph, bph = t => (t - B0) / PER, pulse = t => { let f = bph(t) % 1; if (f < 0) f += 1; return Math.pow(1 - f, 3); };
const hsh = (a, b, c = 0) => { const v = Math.sin(a * 12.9898 + b * 78.233 + c * 37.719) * 43758.5453; return v - Math.floor(v); };
const FI = "'Bitstream Charter','DejaVu Serif',serif";
const CW = [238, 238, 230], CR = [240, 92, 82], CY = [250, 214, 96], CB = [116, 172, 240], CP = [240, 150, 196], CG = [132, 212, 144], CO = [250, 164, 76];
const cv = document.getElementById('cv'), ctx = cv.getContext('2d');
const LY = document.createElement('canvas'); LY.width = W; LY.height = H; const L = LY.getContext('2d');
const WALL = (() => { const k = document.createElement('canvas'); k.width = W; k.height = H; const c = k.getContext('2d'); c.fillStyle = vgrad(c, 0, H, [[0, [34, 36, 40]], [1, [22, 23, 27]]]); c.fillRect(0, 0, W, H); const r = rng(3); for (let i = 0; i < 26; i++) { const x = r() * W, y = r() * H, rad = 80 + r() * 260; const g = c.createRadialGradient(x, y, 0, x, y, rad); g.addColorStop(0, `rgba(${r() > 0.5 ? '70,72,78' : '10,10,12'},${0.14 + r() * 0.12})`); g.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = g; c.fillRect(x - rad, y - rad, rad * 2, rad * 2); } for (let i = 0; i < 9000; i++) { c.fillStyle = `rgba(${r() > 0.5 ? 255 : 0},${r() > 0.5 ? 255 : 0},${r() > 0.5 ? 255 : 0},${r() * 0.07})`; c.fillRect(r() * W, r() * H, 1 + r() * 2, 1 + r() * 2); } c.strokeStyle = 'rgba(0,0,0,0.35)'; c.lineWidth = 1.4; for (let i = 0; i < 7; i++) { let x = r() * W, y = r() * H; c.beginPath(); c.moveTo(x, y); for (let q = 0; q < 24; q++) { x += (r() - 0.45) * 26; y += (r() - 0.3) * 22; c.lineTo(x, y); } c.stroke(); } return k; })();
const GRN = (() => { const g = document.createElement('canvas'); g.width = 256; g.height = 256; const x = g.getContext('2d'), d = x.createImageData(256, 256), r = rng(11); for (let i = 0; i < d.data.length; i += 4) { const v = r(); d.data[i] = d.data[i + 1] = d.data[i + 2] = 0; d.data[i + 3] = v > 0.62 ? (v - 0.62) * 560 : 0; } x.putImageData(d, 0, 0); return g; })();
let FS = 0; // kırpışma adımı
const jt = (seed, i, k = 0) => (hsh(seed + FS * 0.37, i, k) - 0.5);
function stroke(c, pts, o = {}) {
  const p = o.p === undefined ? 1 : o.p; if (p <= 0 || pts.length < 2) return; const col = o.col || CW, w = o.w || 4, a = o.a === undefined ? 0.92 : o.a, wob = o.wob === undefined ? 1.6 : o.wob, sd = o.seed || 1;
  let len = 0; const seg = []; for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(l); len += l; } let rem = len * clamp(p), acc = 0;
  const out = [[pts[0][0] + jt(sd, 0) * wob * 2, pts[0][1] + jt(sd, 0, 1) * wob * 2]];
  for (let i = 1; i < pts.length; i++) { if (rem <= 0) break; const f = Math.min(1, rem / seg[i - 1]); const x = lerp(pts[i - 1][0], pts[i][0], f), y = lerp(pts[i - 1][1], pts[i][1], f); out.push([x + jt(sd, i) * wob * 2, y + jt(sd, i, 1) * wob * 2]); rem -= seg[i - 1]; }
  c.save(); c.lineCap = 'round'; c.lineJoin = 'round';
  for (let pass = 0; pass < 2; pass++) { c.strokeStyle = rgba(col, a * (pass ? 0.5 : 1)); c.lineWidth = w * (pass ? 0.55 : 1); c.beginPath(); out.forEach((q, i) => { const ox = pass ? jt(sd + 5, i) * 2.2 : 0, oy = pass ? jt(sd + 7, i) * 2.2 : 0; i ? c.lineTo(q[0] + ox, q[1] + oy) : c.moveTo(q[0] + ox, q[1] + oy); }); c.stroke(); }
  c.restore(); return out[out.length - 1];
}
const circ = (c, x, y, r, o = {}) => { const pts = []; const n = 28; for (let i = 0; i <= n; i++) { const a = -Math.PI / 2 + i / n * TAU * 1.04; pts.push([x + Math.cos(a) * r, y + Math.sin(a) * r * (o.ry || 1)]); } return stroke(c, pts, o); };
const box = (c, x, y, w, h, o = {}) => stroke(c, [[x, y], [x + w, y], [x + w, y + h], [x, y + h], [x, y - 1]], o);
function hatch(c, x, y, w, h, gap, ang, o = {}) { const p = o.p === undefined ? 1 : o.p; const n = Math.floor((w + h) / gap); for (let i = 0; i < n * p; i++) { const t0 = i * gap; stroke(c, [[x + Math.min(t0, w), y + Math.max(0, t0 - w)], [x + Math.max(0, t0 - h), y + Math.min(t0, h)]], Object.assign({}, o, { p: 1, w: o.w || 2, a: o.a || 0.5, seed: (o.seed || 1) + i })); } }
function ctext(c, s, x, y, size, o = {}) { c.save(); c.globalAlpha = o.a === undefined ? 1 : o.a; c.font = `${o.style || 'italic'} ${o.weight || 'bold'} ${size}px ${o.font || FI}`; c.textAlign = o.al || 'center'; c.letterSpacing = (o.sp || 0) + 'px'; c.fillStyle = rgba(o.col || CW, 0.92); c.shadowColor = rgba(o.col || CW, 0.4); c.shadowBlur = 6; c.fillText(s, x + jt(7, 1) * 1.5, y + jt(7, 2) * 1.5); c.restore(); }
// çizgi insan: o = {p, col, a:[[a1,a2],[a1,a2]], lg:[[..],[..]], face, hair, flip, lean}
const POSE = { stand: { a: [[0.2, 0.12], [-0.2, -0.12]], lg: [[0.08, 0.04], [-0.08, -0.04]] }, up: { a: [[2.7, 2.9], [-2.7, -2.9]], lg: [[0.1, 0.05], [-0.1, -0.05]] }, hold: { a: [[0.8, 1.6], [-0.8, -1.6]], lg: [[0.08, 0.04], [-0.08, -0.04]] }, sit: { a: [[0.5, 1.3], [-0.2, 0.9]], lg: [[1.5, 0.1], [1.4, 0.1]] }, reach: { a: [[1.5, 1.55], [0.3, 0.2]], lg: [[0.1, 0.05], [-0.1, -0.05]] } };
function fig(c, x, y, s, o = {}) {
  s = s * 1.45; const P = o.pose ? (typeof o.pose === 'string' ? POSE[o.pose] : o.pose) : POSE.stand, fl = o.flip ? -1 : 1, col = o.col || CW, w = (o.w || 6) * Math.max(0.75, s * 0.6), sd = o.seed || 1, p = o.p === undefined ? 1 : o.p, lean = o.lean || 0;
  const T = (px, py) => [x + (px * Math.cos(lean) - py * Math.sin(lean)) * s * fl, y + (px * Math.sin(lean) + py * Math.cos(lean)) * s];
  const sh = [0, -130], hp = [0, -72], A = 34, Lg = 36; const lim = (b, a, l) => { const e = [b[0] + Math.sin(a[0]) * l, b[1] + Math.cos(a[0]) * l]; return [b, e, [e[0] + Math.sin(a[1]) * l, e[1] + Math.cos(a[1]) * l]]; };
  const parts = [[T(0, -134), T(...hp)], lim(sh, P.a[0], A).map(q => T(...q)), lim(sh, P.a[1], A).map(q => T(...q)), lim(hp, P.lg[0], Lg).map(q => T(...q)), lim(hp, P.lg[1], Lg).map(q => T(...q))];
  if (o.shirt !== false) { const sc = o.shirt || [CB, CP, CG, CO, CY][sd % 5], a0 = T(-22, -128), a1 = T(22, -128), b0 = T(-18, -74), b1 = T(18, -74); for (let k = 0; k < 9 * p; k++) { const f = k / 8; stroke(c, [[lerp(a0[0], a1[0], f), lerp(a0[1], a1[1], f)], [lerp(b0[0], b1[0], f), lerp(b0[1], b1[1], f)]], { col: sc, w: w * 0.9, a: 0.55, wob: 0.8, seed: sd + 60 + k }); } }
  parts.forEach((pts, i) => stroke(c, pts, { col, w, p, seed: sd + i * 3, wob: o.wob }));
  circ(c, ...T(0, -156), 20 * s, { col, w, p, seed: sd + 20 }); if (o.hair) stroke(c, [T(-18, -168), T(-6, -184), T(10, -182), T(20, -166)], { col, w: w * 0.8, p, seed: sd + 22 });
  if (o.face !== false) { const e = T(0, -158); c.save(); c.fillStyle = rgba(col, 0.95); c.beginPath(); c.arc(e[0] - 7 * s * fl, e[1], 1.8 * s, 0, TAU); c.arc(e[0] + 7 * s * fl, e[1], 1.8 * s, 0, TAU); c.fill(); c.restore(); stroke(c, [T(-6, -146), T(0, -143 + (o.sad ? -3 : 3)), T(6, -146)], { col, w: w * 0.5, p, seed: sd + 25 }); }
  return { head: T(0, -156), hand: [parts[1][2], parts[2][2]], sh: T(...sh), foot: [parts[3][2], parts[4][2]] };
}
const walkP = t => ({ a: [[Math.sin(t * 5) * 0.6, 0.2], [-Math.sin(t * 5) * 0.6, -0.2]], lg: [[Math.sin(t * 5) * 0.5, 0.1], [-Math.sin(t * 5) * 0.5, -0.1]] });
function kid(c, x, y, s, o = {}) { return fig(c, x, y, s * 0.62, Object.assign({ hair: true }, o)); }
