'use strict';
// ============ "Renk Şehri" çizim dili: yüzlü, kalın konturlu, canlı karakterler ============
const PER = 60 / 104, B0 = 0.1;
const bph = t => (t - B0) / PER;
const pulse = t => { let f = bph(t) % 1; if (f < 0) f += 1; return Math.pow(1 - f, 3); };
const P = { pink: [255, 92, 160], cyan: [48, 208, 255], yellow: [255, 208, 64], lime: [120, 230, 90], violet: [150, 100, 255], orange: [255, 140, 60], white: [255, 255, 255], navy: [28, 20, 64] };
const PC = [P.pink, P.cyan, P.yellow, P.lime, P.violet, P.orange];
const gry = (rgb, s) => { const l = 0.3 * rgb[0] + 0.59 * rgb[1] + 0.11 * rgb[2]; return mix([l * 0.9 + 16, l * 0.95 + 18, l + 26], rgb, clamp(s)); };
const cs = (rgb, sat = 1, a = 1) => rgba(gry(rgb, sat), a);
const hsl = (h, s, l) => { h = ((h % 360) + 360) % 360; const k = n => (n + h / 30) % 12, a = s * Math.min(l, 1 - l), f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1))); return [f(0) * 255, f(8) * 255, f(4) * 255]; };
function oln(c, w, sat) { c.lineWidth = w; c.strokeStyle = cs(P.navy, sat === undefined ? 1 : sat); c.lineJoin = 'round'; c.lineCap = 'round'; c.stroke(); }
function fillOl(c, col, sat, w = 5) { c.fillStyle = cs(col, sat); c.fill(); oln(c, w, sat); }

// ---- Robot: kaset-radyo, gözleri hoparlör ----
function robot(c, o) {
  const { x, y, s = 1, t = 0, open = 1, look = 0, sat = 1, ph = 0, arms = 'swing', sq = 0, brow = 0, rot = 0, mouth = 1, body = P.pink, zz = 0, legs = true } = o;
  const cl = (r, a) => cs(r, sat, a);
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(s * (1 + sq * 0.6), s * (1 - sq));
  if (legs) for (const sd of [-1, 1]) {
    const l = Math.sin(ph + (sd > 0 ? 0 : Math.PI)) * 12;
    c.beginPath(); c.moveTo(sd * 30, -34); c.lineTo(sd * 30 + l, -12); oln(c, 13, sat); c.strokeStyle = cl([200, 200, 225]); c.lineWidth = 7; c.stroke();
    c.beginPath(); c.ellipse(sd * 30 + l + 7, -8, 19, 10, 0, 0, TAU); fillOl(c, P.white, sat, 4);
    c.fillStyle = cl(P.cyan); c.fillRect(sd * 30 + l - 8, -5, 30, 4);
  }
  c.beginPath(); c.moveTo(-50, -134); c.quadraticCurveTo(0, -184, 50, -134); oln(c, 12, sat); c.strokeStyle = cl([240, 240, 255]); c.lineWidth = 6; c.stroke();
  c.beginPath(); c.moveTo(58, -134); c.lineTo(86, -196); oln(c, 7, sat); c.strokeStyle = cl([220, 220, 240]); c.lineWidth = 3; c.stroke();
  c.beginPath(); c.arc(86, -200, 9, 0, TAU); fillOl(c, P.yellow, sat, 4);
  if (sat > 0.2) glow(c, 86, -200, 44, P.yellow, 0.55 * sat * (0.6 + 0.4 * Math.sin(t * 6) + KK * 0.5), 'lighter');
  rrect(c, -80, -134, 160, 102, 26); fillOl(c, body, sat, 6);
  rrect(c, -70, -128, 140, 18, 9); c.fillStyle = cl(mix(body, [255, 255, 255], 0.4), 0.55); c.fill();
  for (const ex of [-38, 38]) {
    const r = 28 * (1 + 0.12 * BS);
    c.beginPath(); c.arc(ex, -86, r + 4, 0, TAU); c.fillStyle = cl(P.navy); c.fill();
    const g = c.createRadialGradient(ex - 5, -91, 2, ex, -86, r); g.addColorStop(0, cl([255, 255, 255])); g.addColorStop(0.5, cl(P.cyan)); g.addColorStop(1, cl([20, 110, 190]));
    c.beginPath(); c.arc(ex, -86, r, 0, TAU); c.fillStyle = g; c.fill();
    c.strokeStyle = cl([255, 255, 255], 0.5); c.lineWidth = 2; c.beginPath(); c.arc(ex, -86, r * 0.62, 0, TAU); c.stroke();
    c.beginPath(); c.arc(ex + look * 6, -86, r * 0.27, 0, TAU); c.fillStyle = cl(P.navy); c.fill();
    c.save(); c.beginPath(); c.arc(ex, -86, r + 4, 0, TAU); c.clip();
    const lid = (1 - open) * (2 * r + 8), bs = brow * (ex < 0 ? 1 : -1) * 14, y0 = -86 - r - 6;
    c.fillStyle = cl(body); c.beginPath(); c.moveTo(ex - r - 6, y0); c.lineTo(ex + r + 6, y0); c.lineTo(ex + r + 6, y0 + lid + bs); c.lineTo(ex - r - 6, y0 + lid - bs); c.fill();
    if (lid + Math.abs(bs) > 3) { c.beginPath(); c.moveTo(ex - r - 6, y0 + lid - bs); c.lineTo(ex + r + 6, y0 + lid + bs); oln(c, 5, sat); }
    c.restore();
  }
  rrect(c, -48, -58, 96, 17, 8); c.fillStyle = cl([30, 22, 60]); c.fill();
  for (let i = 0; i < 9; i++) { const lvl = mouth ? clamp((BS * (1 - i / 9) + HI * (i / 9) * 1.2 + EN * 0.25) * (0.55 + 0.45 * Math.sin(t * 8 + i * 1.6))) : 0.05, bh = 2 + 13 * lvl; c.fillStyle = cl(PC[i % 6]); c.fillRect(-43 + i * 10, -43 - bh, 6, bh); }
  c.fillStyle = cl(P.pink, 0.5); for (const bx of [-64, 64]) { c.beginPath(); c.arc(bx, -58, 7, 0, TAU); c.fill(); }
  for (const sd of [-1, 1]) {
    let hx, hy; const ang = Math.sin(ph + (sd > 0 ? Math.PI : 0)) * 0.7;
    if (arms === 'up') { hx = sd * (118 + Math.sin(t * 5 + sd) * 10); hy = -192 + Math.sin(t * 7 + sd) * 14; }
    else if (arms === 'dance') { hx = sd * (112 + Math.sin(t * 6) * 14); hy = -90 - Math.abs(Math.sin(bph(t) * Math.PI + (sd > 0 ? 0 : 1.2))) * 100; }
    else { hx = sd * (98 + Math.sin(ang) * 8); hy = -66 + Math.cos(ang) * 18 + Math.sin(ang) * sd * 22; }
    c.beginPath(); c.moveTo(sd * 78, -96); c.quadraticCurveTo(sd * 112, (-96 + hy) / 2, hx, hy); oln(c, 11, sat); c.strokeStyle = cl([220, 220, 240]); c.lineWidth = 5; c.stroke();
    c.beginPath(); c.arc(hx, hy, 11, 0, TAU); fillOl(c, P.white, sat, 4);
  }
  if (zz) for (let i = 0; i < 3; i++) { const p = ((t * 0.5 + i / 3) % 1); txt(c, 'z', 70 + p * 40, -150 - p * 90, 26 + i * 8, { font: SANS, weight: 800, col: cl([120, 130, 170]), a: (1 - p) * zz }); }
  c.restore();
}
// ---- Şehir sakinleri ----
function citizen(c, o) {
  const { x, y, s = 1, t = 0, kind = 0, hue = P.yellow, awake = 0, ph = 0, hat = 0, up = 0, flip = 1 } = o, sat = o.sat === undefined ? awake : o.sat;
  const cl = (r, a) => cs(r, sat, a), bob = Math.abs(Math.sin(ph)) * awake * 20;
  c.save(); c.translate(x, y - bob); c.scale(s * flip, s); const q = awake * 0.06 * Math.sin(ph * 2); c.scale(1 - q, 1 + q);
  for (const sd of [-1, 1]) { c.beginPath(); c.ellipse(sd * 16, -3, 13, 7, 0, 0, TAU); fillOl(c, [70, 60, 110], sat, 3.5); }
  for (const sd of [-1, 1]) { const hy = up ? -104 - Math.sin(t * 6 + sd) * 10 : -34 + Math.sin(ph + sd) * 6 * awake, hx = sd * (up ? 54 : 58); c.beginPath(); c.moveTo(sd * 34, -52); c.quadraticCurveTo(sd * 54, -52, hx, hy); oln(c, 8, sat); c.strokeStyle = cl(hue); c.lineWidth = 4; c.stroke(); c.beginPath(); c.arc(hx, hy, 6, 0, TAU); fillOl(c, P.white, sat, 3); }
  c.beginPath();
  if (kind === 0) c.arc(0, -48, 42, 0, TAU); else if (kind === 1) rrect(c, -40, -92, 80, 84, 18);
  else if (kind === 2) { c.moveTo(0, -106); c.lineTo(46, -10); c.lineTo(-46, -10); c.closePath(); }
  else { c.moveTo(0, -110); c.bezierCurveTo(52, -60, 50, -8, 0, -8); c.bezierCurveTo(-50, -8, -52, -60, 0, -110); }
  fillOl(c, hue, sat, 5);
  const ey = kind === 2 ? -38 : -56, open = 0.22 + 0.78 * awake;
  for (const ex of [-15, 15]) {
    c.beginPath(); c.arc(ex, ey, 10, 0, TAU); c.fillStyle = cl(P.white); c.fill(); c.beginPath(); c.arc(ex + 1, ey + 1, 5, 0, TAU); c.fillStyle = cl(P.navy); c.fill();
    c.save(); c.beginPath(); c.arc(ex, ey, 10.5, 0, TAU); c.clip(); c.fillStyle = cl(hue); c.fillRect(ex - 11, ey - 11, 22, 22 * (1 - open)); c.restore();
  }
  if (awake > 0.5) { c.beginPath(); c.arc(0, ey + 14, 5 + 8 * awake, 0, Math.PI); c.fillStyle = cl([70, 20, 60]); c.fill(); oln(c, 3, sat); }
  else { c.beginPath(); c.moveTo(-7, ey + 18); c.lineTo(7, ey + 18); oln(c, 3.5, sat); }
  c.fillStyle = cl(P.pink, 0.4 * awake); for (const bx of [-27, 27]) { c.beginPath(); c.arc(bx, ey + 10, 6, 0, TAU); c.fill(); }
  const top = kind === 0 ? -90 : kind === 1 ? -92 : kind === 2 ? -106 : -110;
  if (hat === 1) { c.beginPath(); c.arc(0, top + 18, 30, Math.PI, 0); c.closePath(); fillOl(c, PC[((Math.round(x) >> 3) % 6 + 6) % 6], sat, 4); c.beginPath(); c.arc(0, top - 12, 8, 0, TAU); fillOl(c, P.white, sat, 3); }
  else if (hat === 2) { c.beginPath(); c.moveTo(0, top + 4); c.quadraticCurveTo(10, top - 16, 0, top - 30); oln(c, 5, sat); c.strokeStyle = cl(P.lime); c.lineWidth = 2.5; c.stroke(); c.beginPath(); c.arc(0, top - 34, 11 + 2 * Math.sin(t * 5), 0, TAU); fillOl(c, P.pink, sat, 3); }
  else if (hat === 3) { c.beginPath(); c.moveTo(-20, top + 10); c.lineTo(0, top - 40); c.lineTo(20, top + 10); c.closePath(); fillOl(c, P.violet, sat, 4); c.beginPath(); c.arc(0, top - 42, 6, 0, TAU); fillOl(c, P.yellow, sat, 3); }
  c.restore();
}
function cat(c, o) {
  const { x, y, s = 1, t = 0, ph = 0, awake = 1, hue = P.orange, flip = 1 } = o, sat = o.sat === undefined ? awake : o.sat, cl = (r, a) => cs(r, sat, a), bob = Math.abs(Math.sin(ph)) * awake * 18;
  c.save(); c.translate(x, y - bob); c.scale(s * flip, s);
  c.beginPath(); c.moveTo(30, -26); c.bezierCurveTo(70, -30 + Math.sin(t * 6) * 14, 60, -80, 80, -70 + Math.sin(t * 6) * 10); oln(c, 14, sat); c.strokeStyle = cl(hue); c.lineWidth = 8; c.stroke();
  c.beginPath(); c.ellipse(0, -28, 36, 28, 0, 0, TAU); fillOl(c, hue, sat, 5);
  for (const sd of [-1, 1]) { c.beginPath(); c.ellipse(sd * 18, -4, 11, 7, 0, 0, TAU); fillOl(c, mix(hue, [255, 255, 255], 0.5), sat, 3.5); }
  for (const sd of [-1, 1]) { c.beginPath(); c.moveTo(sd * 12, -86); c.lineTo(sd * 30, -112); c.lineTo(sd * 34, -78); c.closePath(); fillOl(c, hue, sat, 4); }
  c.beginPath(); c.arc(0, -66, 28, 0, TAU); fillOl(c, hue, sat, 5);
  c.beginPath(); c.arc(0, -72, 34, Math.PI * 1.05, Math.PI * 1.95); oln(c, 8, sat); c.strokeStyle = cl(P.cyan); c.lineWidth = 4; c.stroke();
  for (const sd of [-1, 1]) { c.beginPath(); c.arc(sd * 31, -70, 11, 0, TAU); fillOl(c, P.pink, sat, 3.5); }
  for (const ex of [-11, 11]) { c.beginPath(); c.arc(ex, -66, 5.5, 0, TAU); c.fillStyle = cl(P.navy); c.fill(); c.beginPath(); c.arc(ex + 1.5, -68, 1.8, 0, TAU); c.fillStyle = cl(P.white); c.fill(); }
  c.beginPath(); c.moveTo(-4, -57); c.lineTo(4, -57); c.lineTo(0, -52); c.closePath(); c.fillStyle = cl(P.pink); c.fill();
  c.beginPath(); c.arc(0, -52, 6, 0.1, Math.PI - 0.1); oln(c, 2.5, sat);
  c.restore();
}
function pigeon(c, o) {
  const { x, y, s = 1, t = 0, ph = 0, awake = 1, flip = 1 } = o, sat = o.sat === undefined ? awake : o.sat, cl = (r, a) => cs(r, sat, a), bob = Math.abs(Math.sin(ph)) * awake * 14, nod = Math.sin(ph * 2) * 5 * awake;
  c.save(); c.translate(x, y - bob); c.scale(s * flip, s);
  for (const sd of [-8, 8]) { c.beginPath(); c.moveTo(sd, -14); c.lineTo(sd, -2); oln(c, 4, sat); }
  c.beginPath(); c.ellipse(0, -34, 30, 21, -0.1, 0, TAU); fillOl(c, [150, 160, 190], sat, 4.5);
  c.beginPath(); c.arc(24, -54 + nod, 14, 0, TAU); fillOl(c, [150, 160, 190], sat, 4.5);
  c.beginPath(); c.ellipse(16, -42, 12, 9, 0, 0, TAU); c.fillStyle = cl(P.violet, 0.9); c.fill();
  c.beginPath(); c.moveTo(36, -56 + nod); c.lineTo(48, -52 + nod); c.lineTo(36, -50 + nod); c.closePath(); fillOl(c, P.yellow, sat, 3);
  c.beginPath(); c.arc(28, -57 + nod, 3.4, 0, TAU); c.fillStyle = cl(P.navy); c.fill();
  const fl = Math.sin(t * 10 + ph) * 0.5; c.save(); c.translate(-6, -38); c.rotate(-0.6 + fl); c.beginPath(); c.ellipse(-14, 0, 24, 11, 0, 0, TAU); fillOl(c, mix([150, 160, 190], [60, 70, 150], 0.4), sat, 4); c.restore();
  c.restore();
}
function building(c, o) {
  const { x, base, w, h, col, roof = 0, sat = 1, awake = 0, t = 0, ph = 0, seed = 1 } = o, cl = (r, a) => cs(r, sat, a), sq = awake * 0.05 * pulse(t);
  c.save(); c.translate(x, base); c.scale(1 + sq * 0.7, 1 - sq);
  if (roof === 1) { c.beginPath(); c.moveTo(-w / 2 - 6, -h); c.lineTo(0, -h - w * 0.38); c.lineTo(w / 2 + 6, -h); c.closePath(); fillOl(c, mix(col, [0, 0, 0], 0.25), sat, 5); }
  else if (roof === 2) { c.beginPath(); c.arc(0, -h, w / 2, Math.PI, 0); fillOl(c, mix(col, [255, 255, 255], 0.2), sat, 5); c.beginPath(); c.moveTo(0, -h - w / 2); c.lineTo(0, -h - w / 2 - 24); oln(c, 4, sat); }
  rrect(c, -w / 2, -h, w, h, 10); fillOl(c, col, sat, 5);
  const r = rng(seed), cols = Math.max(2, Math.floor(w / 40)), top = -h * 0.55;
  for (let i = 0; i < cols; i++) for (let j = 0; j < Math.floor((h * 0.55 - 60) / 52); j++) { const wx = -w / 2 + 12 + i * ((w - 24) / cols), wy = top + j * 52; rrect(c, wx, wy, (w - 24) / cols - 8, 34, 6); c.fillStyle = r() < 0.55 * awake + 0.1 ? cl([255, 238, 150]) : cl(mix(col, [255, 255, 255], 0.5), 0.8); c.fill(); oln(c, 3, sat); }
  const er = Math.min(24, w * 0.15);
  for (const sd of [-1, 1]) {
    const ex = sd * w * 0.22, ey = -h * 0.8;
    c.beginPath(); c.arc(ex, ey, er, 0, TAU); c.fillStyle = cl(P.white); c.fill(); oln(c, 4, sat);
    if (awake > 0.3) { c.beginPath(); c.arc(ex + Math.sin(t * 2) * 4, ey + 2, er * 0.45, 0, TAU); c.fillStyle = cl(P.navy); c.fill(); }
    else { c.fillStyle = cl(col); c.fillRect(ex - er, ey - er, er * 2, er * 1.4); c.beginPath(); c.moveTo(ex - er, ey + er * 0.4); c.lineTo(ex + er, ey + er * 0.4); oln(c, 4, sat); }
  }
  rrect(c, -16, -50, 32, 50, 12); c.fillStyle = cl(mix(col, [0, 0, 0], 0.4)); c.fill(); oln(c, 4, sat);
  if (awake > 0.4) { c.beginPath(); c.arc(0, -h * 0.66, 14 + 4 * awake, 0.15, Math.PI - 0.15); oln(c, 4, sat); }
  c.restore();
}
function tower(c, x, base, h, lit, sat, t) {
  const cl = (r, a) => cs(r, sat, a), top = base - h;
  c.save();
  for (const sd of [-1, 1]) { c.beginPath(); c.moveTo(x + sd * 78, base); c.lineTo(x + sd * 12, top + 40); oln(c, 12, sat); c.strokeStyle = cl([190, 195, 220]); c.lineWidth = 6; c.stroke(); }
  const n = 12;
  for (let i = 0; i < n; i++) { const y0 = base - h * 0.93 * i / n, y1 = base - h * 0.93 * (i + 1) / n, w0 = lerp(78, 12, i / n), w1 = lerp(78, 12, (i + 1) / n), on = lit > (i + 1) / n - 0.04; c.beginPath(); c.moveTo(x - w0, y0); c.lineTo(x + w1, y1); c.moveTo(x + w0, y0); c.lineTo(x - w1, y1); c.moveTo(x - w1, y1); c.lineTo(x + w1, y1); c.strokeStyle = on ? cs(PC[i % 6], 1) : cl([150, 155, 185]); c.lineWidth = on ? 6 : 4; c.stroke(); if (on) glow(c, x, (y0 + y1) / 2, 60, PC[i % 6], 0.35, 'lighter'); }
  rrect(c, x - 30, top + 14, 60, 30, 8); fillOl(c, [210, 210, 235], sat, 4);
  c.beginPath(); c.ellipse(x, top - 10, 62, 24, -0.3, 0, TAU); fillOl(c, mix([220, 220, 240], P.pink, lit * 0.5), sat, 5);
  c.beginPath(); c.moveTo(x, top - 22); c.lineTo(x, top - 70); oln(c, 6, sat); c.beginPath(); c.arc(x, top - 76, 12, 0, TAU); fillOl(c, lit > 0.9 ? P.yellow : [190, 190, 210], sat, 4);
  if (lit > 0.9) glow(c, x, top - 76, 120, P.yellow, 0.7, 'lighter');
  c.restore();
}
function bigButton(c, x, y, s, press, t, sat) {
  const cl = (r, a) => cs(r, sat, a); c.save(); c.translate(x, y); c.scale(s, s);
  c.beginPath(); c.ellipse(0, 6, 150, 40, 0, 0, TAU); fillOl(c, [70, 60, 120], sat, 6);
  rrect(c, -140, -30, 280, 40, 14); fillOl(c, [120, 110, 190], sat, 6);
  const h = 78 - press * 52; c.beginPath(); c.moveTo(-96, -30); c.lineTo(-96, -30 - h); c.ellipse(0, -30 - h, 96, 30, 0, Math.PI, 0, true); c.lineTo(96, -30); c.closePath();
  const g = c.createLinearGradient(-96, 0, 96, 0); g.addColorStop(0, cl([200, 20, 60])); g.addColorStop(0.4, cl([255, 70, 100])); g.addColorStop(1, cl([170, 10, 50])); c.fillStyle = g; c.fill(); oln(c, 6, sat);
  c.beginPath(); c.ellipse(0, -30 - h, 96, 30, 0, 0, TAU); c.fillStyle = cl([255, 110, 130]); c.fill(); oln(c, 6, sat);
  c.beginPath(); c.ellipse(-30, -34 - h, 30, 8, -0.2, 0, TAU); c.fillStyle = cl([255, 255, 255], 0.5); c.fill();
  if (sat > 0.3) glow(c, 0, -40 - h, 240, [255, 40, 90], (0.25 + 0.3 * Math.abs(Math.sin(t * 4))) * sat, 'lighter');
  c.restore();
}
function discoBall(c, x, y, r, t, sat = 1) {
  c.save(); c.translate(x, y); c.strokeStyle = cs([200, 200, 230], sat); c.lineWidth = 3; c.beginPath(); c.moveTo(0, -y); c.lineTo(0, -r); c.stroke();
  glow(c, 0, 0, r * 2.2, [255, 255, 255], 0.2 * sat, 'lighter');
  const g = c.createRadialGradient(-r * 0.3, -r * 0.3, 2, 0, 0, r); g.addColorStop(0, cs([255, 255, 255], sat)); g.addColorStop(1, cs([120, 130, 170], sat)); c.beginPath(); c.arc(0, 0, r, 0, TAU); c.fillStyle = g; c.fill(); oln(c, 4, sat);
  c.save(); c.beginPath(); c.arc(0, 0, r, 0, TAU); c.clip(); c.strokeStyle = cs(P.navy, sat, 0.35); c.lineWidth = 1.5;
  for (let i = -5; i <= 5; i++) { c.beginPath(); c.ellipse(0, 0, Math.abs(Math.cos(i * 0.31 + t * 0.8)) * r, r, 0, 0, TAU); c.stroke(); }
  for (let j = -4; j <= 4; j++) { c.beginPath(); c.moveTo(-r, j * r / 4.5); c.lineTo(r, j * r / 4.5); c.stroke(); }
  const rr = rng(4); for (let i = 0; i < 14; i++) { c.fillStyle = cs(PC[i % 6], sat, 0.6 * (0.5 + 0.5 * Math.sin(t * 5 + i))); c.fillRect((rr() - 0.5) * r * 1.6, (rr() - 0.5) * r * 1.6, 7, 7); } c.restore(); c.restore();
}
function rays(c, cx, cy, t, n, colA, colB, a, spin = 0.2) {
  c.save(); c.translate(cx, cy); c.rotate(t * spin);
  for (let i = 0; i < n; i++) { c.fillStyle = rgba(i % 2 ? colA : colB, a); c.beginPath(); c.moveTo(0, 0); c.arc(0, 0, 1800, i / n * TAU, (i + 1) / n * TAU); c.closePath(); c.fill(); }
  c.restore();
}
function notes(c, t, seed, n, x0, x1, y0, sat = 1, size = 34) {
  const r = rng(seed);
  for (let i = 0; i < n; i++) { const p = ((t * (0.18 + r() * 0.2) + r()) % 1), x = x0 + r() * (x1 - x0) + Math.sin(t * 2 + i) * 20, y = y0 - p * 420; txt(c, r() > 0.5 ? '♪' : '♫', x, y, size * (0.7 + r() * 0.7), { font: "'DejaVu Sans',sans-serif", weight: 700, col: cs(PC[i % 6], sat), a: Math.sin(p * Math.PI) * 0.95 }); }
}
function spkFlower(c, x, y, s, t, col, sat, ph = 0) {
  const cl = (r, a) => cs(r, sat, a); c.save(); c.translate(x, y); c.scale(s, s); const sw = Math.sin(t * 2 + ph) * 8;
  c.beginPath(); c.moveTo(0, 0); c.quadraticCurveTo(sw, -60, sw * 0.6, -120); oln(c, 12, sat); c.strokeStyle = cl(P.lime); c.lineWidth = 7; c.stroke();
  c.save(); c.translate(sw * 0.6, -128); const k = 1 + 0.16 * pulse(t + ph);
  for (let i = 0; i < 8; i++) { c.save(); c.rotate(i / 8 * TAU + t * 0.3); c.beginPath(); c.ellipse(0, -44 * k, 17, 30 * k, 0, 0, TAU); fillOl(c, mix(col, [255, 255, 255], (i % 2) * 0.25), sat, 4); c.restore(); }
  c.beginPath(); c.arc(0, 0, 34 * k, 0, TAU); fillOl(c, P.navy, sat, 4); c.beginPath(); c.arc(0, 0, 24 * k, 0, TAU); c.fillStyle = cl(P.yellow); c.fill(); c.beginPath(); c.arc(0, 0, 9 * k, 0, TAU); c.fillStyle = cl(P.navy); c.fill(); c.restore();
  c.restore();
}
function puffCloud(c, x, y, s, col, sat) {
  c.save(); c.translate(x, y); c.scale(s, s); c.beginPath(); for (const [dx, dy, r] of [[-50, 0, 34], [-12, -20, 44], [34, -6, 38], [64, 8, 26], [-80, 12, 24]]) { c.moveTo(dx + r, dy); c.arc(dx, dy, r, 0, TAU); }
  c.fillStyle = cs(col, sat); c.fill(); c.restore();
}
