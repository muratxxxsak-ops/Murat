'use strict';
const PER = 60 / 93, B0 = 0.63, bph = t => (t - B0) / PER;
const pulse = t => { let f = bph(t) % 1; if (f < 0) f += 1; return Math.pow(1 - f, 3); };
const hsh = (a, b, c = 0) => { const v = Math.sin(a * 12.9898 + b * 78.233 + c * 37.719) * 43758.5453; return v - Math.floor(v); };
const FI = "'Bitstream Charter','DejaVu Serif',serif";
const SKIN = [236, 190, 150], SKIN2 = [214, 160, 122];
const tod = t => t < 79 ? 0 : t < 88 ? 0.85 * sm(seg(t, 79, 88)) : t < 97 ? lerp(0.85, 0.3, sm(seg(t, 88, 97))) : t < 104 ? lerp(0.3, 0.05, sm(seg(t, 97, 104))) : t < 183 ? 0.05 : lerp(0.05, 0.95, sm(seg(t, 183, 212)));
const power = t => (t >= 148 && t < 160) ? 0 : 1;
const tq = t => Math.floor(t * 12) / 12;                      // stop-motion zamanı
function pap(c, col, fn, sh = 1) { c.save(); c.shadowColor = 'rgba(0,0,0,0.4)'; c.shadowBlur = 8 * sh; c.shadowOffsetY = 4 * sh; c.shadowOffsetX = 1.5 * sh; c.fillStyle = rgba(col); c.beginPath(); fn(); c.fill(); c.restore(); }
const shade = (col, td) => mix([col[0] * 0.36, col[1] * 0.42, col[2] * 0.72], col, td);
function flame(c, x, y, s, t) { const f = 1 + Math.sin(t * 17 + x) * 0.08; c.save(); c.translate(x, y); c.scale(s * f, s * f); glow(c, 0, -10, 70, [255, 170, 60], 0.9, 'lighter'); c.fillStyle = rgba([255, 214, 120]); c.beginPath(); c.moveTo(0, -26); c.quadraticCurveTo(8, -12, 0, 0); c.quadraticCurveTo(-8, -12, 0, -26); c.fill(); c.fillStyle = rgba([255, 250, 220]); c.beginPath(); c.ellipse(0, -8, 2.5, 6, 0, 0, TAU); c.fill(); c.restore(); }
// ön görünüşlü oturan kişi (kalça merkezli)
function fperson(c, o) {
  const { x, y, s = 1, girl = false, hair = [50, 34, 28], cloth = [80, 100, 150], head = 0, arms = 'desk', t = 0, face = 0, wave = 0 } = o;
  c.save(); c.translate(x, y); c.scale(s, s);
  if (girl) pap(c, hair, () => { c.ellipse(head * 5, -70 + head * 0.6, 21, 34, 0, 0, TAU); }, 0.5);
  pap(c, cloth, () => { c.moveTo(-24, 0); c.lineTo(-28, -48); c.quadraticCurveTo(0, -62, 28, -48); c.lineTo(24, 0); c.closePath(); }, 0.6);
  c.strokeStyle = rgba(cloth); c.lineWidth = 11; c.lineCap = 'round';
  const aw = Math.sin(t * 9) * 5;
  if (arms === 'desk') { c.beginPath(); c.moveTo(-26, -44); c.lineTo(-32, -16); c.lineTo(-8, -10 + aw * 0.3); c.moveTo(26, -44); c.lineTo(32, -16); c.lineTo(10, -10 + aw); c.stroke(); }
  else if (arms === 'up') { c.beginPath(); c.moveTo(26, -44); c.lineTo(46, -62 - wave * 6); c.lineTo(44 + Math.sin(t * 10) * 8, -92); c.moveTo(-26, -44); c.lineTo(-32, -14); c.lineTo(-10, -10); c.stroke(); }
  else if (arms === 'glass') { c.beginPath(); c.moveTo(-26, -44); c.lineTo(-48, -66); c.lineTo(-56, -90); c.moveTo(26, -44); c.lineTo(32, -14); c.lineTo(10, -10); c.stroke(); c.fillStyle = rgba(SKIN); c.beginPath(); c.arc(-56, -94, 7, 0, TAU); c.fill(); }
  else { c.beginPath(); c.moveTo(-26, -44); c.lineTo(-34, -14); c.lineTo(-12, 0); c.moveTo(26, -44); c.lineTo(34, -14); c.lineTo(12, 0); c.stroke(); }
  c.fillStyle = rgba(SKIN); for (const hx of [-8, 10]) { if (arms === 'desk') { c.beginPath(); c.arc(hx, -10 + (hx > 0 ? aw : 0), 6, 0, TAU); c.fill(); } }
  c.fillStyle = rgba(SKIN2); c.fillRect(-5, -66, 10, 10);
  const hy = -78 + head * 0.6, hx = head * 5;
  pap(c, SKIN, () => { c.arc(hx, hy, 15, 0, TAU); }, 0.5);
  c.fillStyle = rgba(hair); c.beginPath(); c.ellipse(hx, hy - 8, girl ? 17 : 16, girl ? 10 : 8, 0, Math.PI, 0); c.fill();
  if (girl) { c.fillRect(hx - 17, hy - 8, 4, 18); c.fillRect(hx + 13, hy - 8, 4, 18); }
  if (face || s > 0.7) { c.fillStyle = rgba([40, 28, 30]); const bl = Math.sin(t * 0.9) > 0.97 ? 0.2 : 1; c.beginPath(); c.ellipse(hx - 5, hy, 1.6, 1.8 * bl, 0, 0, TAU); c.ellipse(hx + 5, hy, 1.6, 1.8 * bl, 0, 0, TAU); c.fill(); c.strokeStyle = rgba([150, 80, 70]); c.lineWidth = 1.2; c.beginPath(); c.arc(hx, hy + 5, 3.5, 0.2, Math.PI - 0.2); c.stroke(); }
  c.restore();
}
function fstand(c, o) {
  const { x, y, s = 1, girl = false, hair = [50, 34, 28], cloth = [80, 100, 150], pants = [40, 44, 70], t = 0, ph = 0, run = 0, arms = 'down', dir = 1 } = o;
  c.save(); c.translate(x, y); c.scale(s * dir, s);
  c.strokeStyle = rgba(pants); c.lineWidth = 15; c.lineCap = 'round'; const a = Math.sin(ph) * (run ? 0.8 : 0.45);
  c.beginPath(); c.moveTo(-8, -64); c.lineTo(-8 + Math.sin(a) * 40, -6); c.moveTo(8, -64); c.lineTo(8 - Math.sin(a) * 40, -6); c.stroke();
  c.fillStyle = rgba([30, 26, 30]); c.beginPath(); c.ellipse(-8 + Math.sin(a) * 40 + 4, -4, 12, 5, 0, 0, TAU); c.ellipse(8 - Math.sin(a) * 40 + 4, -4, 12, 5, 0, 0, TAU); c.fill();
  pap(c, cloth, () => { c.moveTo(-17, -62); c.lineTo(-20, -112); c.quadraticCurveTo(0, -122, 20, -112); c.lineTo(17, -62); c.closePath(); }, 0.6);
  c.strokeStyle = rgba(cloth); c.lineWidth = 10; const sw = Math.sin(ph + Math.PI) * (run ? 0.8 : 0.4);
  c.beginPath(); if (arms === 'wave') { c.moveTo(-18, -106); c.lineTo(-30, -80); c.lineTo(-28, -60); c.moveTo(18, -106); c.lineTo(36, -122); c.lineTo(34 + Math.sin(t * 12) * 8, -148); } else if (arms === 'cup') { c.moveTo(-18, -106); c.lineTo(-26, -84); c.lineTo(-6, -82); c.moveTo(18, -106); c.lineTo(26, -84); c.lineTo(6, -82); } else { c.moveTo(-18, -106); c.lineTo(-22 + Math.sin(sw) * 18, -62); c.moveTo(18, -106); c.lineTo(22 - Math.sin(sw) * 18, -62); } c.stroke();
  c.fillStyle = rgba(SKIN2); c.fillRect(-4, -124, 8, 10);
  if (girl) pap(c, hair, () => { c.ellipse(0, -126, 18, 24, 0, 0, TAU); }, 0.4); pap(c, SKIN, () => { c.arc(0, -134, 14, 0, TAU); }, 0.4);
  c.fillStyle = rgba(hair); c.beginPath(); c.ellipse(0, -142, 15, 8, 0, Math.PI, 0); c.fill();
  c.restore();
}
function guitar(c, x, y, s, t, strum) { c.save(); c.translate(x, y); c.rotate(-0.55); c.scale(s, s); pap(c, [168, 100, 52], () => { c.ellipse(0, 0, 30, 24, 0, 0, TAU); c.ellipse(24, 0, 22, 18, 0, 0, TAU); }, 0.6); c.fillStyle = rgba([40, 24, 18]); c.beginPath(); c.arc(10, 0, 8, 0, TAU); c.fill(); c.fillStyle = rgba([120, 70, 38]); c.fillRect(-90, -4, 70, 8); c.fillStyle = rgba([60, 40, 30]); c.fillRect(-104, -6, 14, 12); c.restore(); }
function note(c, x, y, s, col, rot = 0) { c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s); pap(c, col, () => { c.ellipse(0, 0, 7, 5, -0.4, 0, TAU); c.rect(5, -28, 3, 28); c.moveTo(8, -28); c.quadraticCurveTo(20, -22, 16, -10); c.lineTo(8, -16); }, 0.4); c.restore(); }
// odalar (pencerenin içinden görünen)
function roomHim(c, x, y, w, h, t) {
  const lt = t;
  c.save(); c.beginPath(); c.rect(x, y, w, h); c.clip();
  const pw = power(t), cd = t >= 148 && t < 160;
  c.fillStyle = vgrad(c, y, y + h, [[0, cd ? [14, 14, 24] : [168, 126, 92]], [1, cd ? [10, 10, 18] : [120, 84, 64]]]); c.fillRect(x, y, w, h);
  if (!cd) glow(c, x + 80, y + 50, 120, [255, 214, 140], 0.7, 'lighter');
  c.fillStyle = rgba(cd ? [30, 24, 20] : [82, 56, 40]); c.fillRect(x, y + h - 30, w, 30); c.fillStyle = rgba([100, 70, 50]); c.fillRect(x - 4, y + h - 34, w + 8, 6);
  pap(c, [235, 225, 200], () => { c.rect(x + 30, y + h - 40, 44, 8); }, 0.3);
  if (!cd) { c.fillStyle = rgba([60, 60, 70]); c.fillRect(x + 12, y + h - 66, 4, 30); c.fillStyle = rgba([255, 214, 120]); c.beginPath(); c.moveTo(x + 4, y + h - 66); c.lineTo(x + 26, y + h - 66); c.lineTo(x + 20, y + h - 82); c.lineTo(x + 10, y + h - 82); c.fill(); }
  const gone = t >= 158.5 && t < 190, writing = t < 33 || (t >= 43 && t < 49), arms = (t >= 157 && t < 158.5) ? 'glass' : 'desk';
  if (!gone) fperson(c, { x: x + w * 0.62, y: y + h - 28, s: 0.82, cloth: [78, 98, 130], hair: [44, 30, 26], head: writing ? 0.9 : (t >= 33 && t < 43 ? -0.4 : 0.1), arms, t: tq(t), face: 0 });
  if (t >= 38 && t < 49 || t >= 190) { for (const q of [0, 1]) { c.fillStyle = rgba([200, 110, 40], 0.9); c.beginPath(); c.moveTo(x + w * 0.2 + q * 20, y + h - 36); c.lineTo(x + w * 0.2 + q * 20 + 14, y + h - 36); c.lineTo(x + w * 0.2 + q * 20 + 11, y + h - 56); c.lineTo(x + w * 0.2 + q * 20 + 3, y + h - 56); c.fill(); } }
  c.restore();
}
function roomHer(c, x, y, w, h, t) {
  c.save(); c.beginPath(); c.rect(x, y, w, h); c.clip();
  const on = t >= 23, cd = t >= 148 && t < 160, dim = !on || (cd && t < 151);
  c.fillStyle = vgrad(c, y, y + h, [[0, dim ? [20, 24, 44] : [236, 170, 80]], [1, dim ? [14, 16, 30] : [190, 120, 60]]]); c.fillRect(x, y, w, h);
  if (!dim) glow(c, x + w - 40, y + 50, 130, [255, 200, 90], 0.9, 'lighter');
  if (!dim) { c.fillStyle = rgba([255, 214, 110]); c.beginPath(); c.moveTo(x + w - 56, y + 18); c.lineTo(x + w - 24, y + 18); c.lineTo(x + w - 30, y + 38); c.lineTo(x + w - 50, y + 38); c.fill(); }
  pap(c, [70, 46, 40], () => { c.rect(x + 4, y + 34, 24, 70); }, 0.3);
  c.fillStyle = rgba([150, 80, 60]); c.fillRect(x, y + h - 22, w, 22);
  const gone = t >= 160 && t < 190;
  if (on && !gone) { const strum = Math.sin(tq(t) * 10); fperson(c, { x: x + w * 0.42, y: y + h - 20, s: 0.82, girl: true, cloth: [196, 84, 70], hair: [32, 22, 26], head: -0.3 + Math.sin(t * 0.8) * 0.4, arms: 'rest', t: tq(t) }); guitar(c, x + w * 0.46, y + h - 40, 0.55, t, strum); }
  if (!gone && t >= 111 && t < 113) { /* kapıya bakış */ }
  c.restore();
}
function windowAt(c, x, y, w, h, t, kind, tdv, lit) {
  const fr = shade([236, 226, 196], tdv);
  c.fillStyle = rgba([20, 26, 50]); c.fillRect(x - 8, y - 8, w + 16, h + 16);
  if (kind === 'him') roomHim(c, x, y, w, h, t); else if (kind === 'her') roomHer(c, x, y, w, h, t);
  else { c.fillStyle = lit ? rgba([255, 214, 130], 0.9 - 0.2 * hsh(x, y)) : rgba(shade([40, 60, 100], tdv)); c.fillRect(x, y, w, h); if (lit) glow(c, x + w / 2, y + h / 2, 130, [255, 190, 90], 0.3, 'lighter'); }
  c.strokeStyle = rgba(fr); c.lineWidth = 9; c.strokeRect(x - 2, y - 2, w + 4, h + 4); c.lineWidth = 5; c.beginPath(); c.moveTo(x + w / 2, y); c.lineTo(x + w / 2, y + h); c.stroke();
  const g = c.createLinearGradient(x, y, x + w, y + h); g.addColorStop(0, 'rgba(255,255,255,0.18)'); g.addColorStop(0.4, 'rgba(255,255,255,0)'); c.fillStyle = g; c.fillRect(x, y, w, h);
  pap(c, shade([210, 200, 180], tdv), () => { c.rect(x - 14, y + h + 4, w + 28, 12); }, 0.8);
}
