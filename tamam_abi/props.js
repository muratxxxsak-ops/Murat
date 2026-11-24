'use strict';
const SC = document.createElement('canvas'); SC.width = 700; SC.height = 720; const SCx = SC.getContext('2d');
const SW = document.createElement('canvas'); SW.width = 700; SW.height = 720; const SWx = SW.getContext('2d');
function stk(fn, x, y, s = 1, r = 0, o = {}) {
  const dst = v; v = SCx; SCx.clearRect(0, 0, 700, 720); SCx.save(); SCx.translate(350, 360); fn(); SCx.restore(); v = dst;
  SWx.globalCompositeOperation = 'source-over'; SWx.clearRect(0, 0, 700, 720); SWx.drawImage(SC, 0, 0); SWx.globalCompositeOperation = 'source-in'; SWx.fillStyle = '#fff'; SWx.fillRect(0, 0, 700, 720);
  dst.save(); dst.translate(x, y); dst.rotate(r); dst.scale(s, s); dst.globalAlpha *= o.a === undefined ? 1 : o.a;
  dst.shadowColor = 'rgba(0,0,0,.4)'; dst.shadowBlur = 16; dst.shadowOffsetY = 9; dst.drawImage(SW, -350, -360); dst.shadowColor = 'transparent';
  for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; dst.drawImage(SW, -350 + Math.cos(a) * 7, -360 + Math.sin(a) * 7); }
  dst.drawImage(SC, -350, -360); dst.restore();
}
const GRNH = [70, 190, 110];
function hero(x, y, s, o = {}) { guy(x, y, s, Object.assign({ shirt: GRNH, cap: YEL }, o)); }
function abi(x, y, s, o = {}) { guy(x, y, s, Object.assign({ big: true, shades: true, shirt: [255, 196, 30], flex: true, skin: [226, 168, 120] }, o)); }
function girl(x, y, s, t = 0) {
  v.save(); v.translate(x, y); v.scale(s, s); v.lineCap = 'round'; v.lineJoin = 'round'; v.strokeStyle = rgba(INK); v.lineWidth = 6;
  v.fillStyle = rgba([60, 36, 36]); v.beginPath(); v.ellipse(0, -170, 42, 48 + Math.sin(t * 3) * 2, 0, 0, TAU); v.fill(); v.stroke();
  v.fillStyle = rgba(PNK); v.beginPath(); v.moveTo(-18, -138); v.lineTo(18, -138); v.lineTo(46, -34); v.lineTo(-46, -34); v.closePath(); v.fill(); v.stroke();
  v.strokeStyle = rgba(INK); v.lineWidth = 8; v.beginPath(); v.moveTo(-10, -34); v.lineTo(-10, 0); v.moveTo(10, -34); v.lineTo(10, 0); v.stroke();
  v.fillStyle = rgba([245, 200, 160]); v.lineWidth = 6; v.beginPath(); v.arc(0, -172, 30, 0, TAU); v.fill(); v.stroke();
  v.fillStyle = rgba([60, 36, 36]); v.beginPath(); v.arc(0, -190, 31, Math.PI, TAU); v.fill();
  v.fillStyle = rgba(INK); v.beginPath(); v.arc(-10, -172, 3.5, 0, TAU); v.arc(10, -172, 3.5, 0, TAU); v.fill(); v.beginPath(); v.arc(0, -160, 9, 0.2, Math.PI - 0.2); v.stroke(); v.restore();
}
function mother(x, y, s, t = 0) {
  v.save(); v.translate(x, y); v.scale(s, s); v.lineCap = 'round'; v.lineJoin = 'round'; v.strokeStyle = rgba(INK); v.lineWidth = 6;
  v.fillStyle = rgba([160, 70, 120]); v.beginPath(); v.moveTo(-26, -140); v.lineTo(26, -140); v.lineTo(40, 0); v.lineTo(-40, 0); v.closePath(); v.fill(); v.stroke();
  const up = Math.sin(t * 2) * 5; v.lineWidth = 10; v.strokeStyle = rgba([245, 200, 160]); v.beginPath(); v.moveTo(-22, -128); v.lineTo(-40, -150 + up); v.lineTo(-22, -180 + up); v.moveTo(22, -128); v.lineTo(40, -150 + up); v.lineTo(22, -180 + up); v.stroke();
  v.fillStyle = rgba([235, 235, 245]); v.strokeStyle = rgba(INK); v.lineWidth = 6; v.beginPath(); v.arc(0, -170, 36, 0, TAU); v.fill(); v.stroke();
  v.fillStyle = rgba([245, 200, 160]); v.beginPath(); v.ellipse(0, -164, 24, 26, 0, 0, TAU); v.fill(); v.stroke();
  v.fillStyle = rgba(INK); v.beginPath(); v.arc(-8, -166, 3, 0, TAU); v.arc(8, -166, 3, 0, TAU); v.fill(); v.beginPath(); v.arc(0, -156, 7, 0.2, Math.PI - 0.2); v.stroke(); v.restore();
}
function bus(x, y, s) {
  v.save(); v.translate(x, y); v.scale(s, s); v.strokeStyle = rgba(INK); v.lineWidth = 6; v.lineJoin = 'round'; v.fillStyle = rgba([40, 130, 230]); v.beginPath(); v.roundRect(-150, -120, 300, 110, 16); v.fill(); v.stroke();
  v.fillStyle = 'rgba(210,240,255,.95)'; for (let i = 0; i < 5; i++) { v.beginPath(); v.roundRect(-136 + i * 48, -104, 40, 40, 6); v.fill(); v.stroke(); }
  v.fillStyle = rgba(YEL); v.fillRect(-150, -34, 300, 10); v.fillStyle = rgba(INK); for (const wx of [-90, 90]) { v.beginPath(); v.arc(wx, -8, 22, 0, TAU); v.fill(); v.fillStyle = '#ddd'; v.beginPath(); v.arc(wx, -8, 9, 0, TAU); v.fill(); v.fillStyle = rgba(INK); }
  v.restore();
}
function card(x, y, s, txt, col) { v.save(); v.translate(x, y); v.scale(s, s); rr(-90, -56, 180, 112, 12, col, { ls: 6 }); v.fillStyle = 'rgba(0,0,0,.18)'; v.fillRect(-90, -30, 180, 18); txtv(txt, 0, 26, 26, { col: INK }); v.restore(); }
function bottle(x, y, s, col) { v.save(); v.translate(x, y); v.scale(s, s); v.fillStyle = rgba(col); v.strokeStyle = rgba(INK); v.lineWidth = 5; v.beginPath(); v.roundRect(-16, -70, 32, 80, 8); v.fill(); v.stroke(); v.fillRect(-7, -104, 14, 36); v.strokeRect(-7, -104, 14, 36); v.restore(); }
function burst(x, y, r, n, col, rot = 0) { v.save(); v.translate(x, y); v.rotate(rot); v.fillStyle = rgba(col); v.beginPath(); for (let i = 0; i < n * 2; i++) { const a = i / (n * 2) * TAU, rad = i % 2 ? r * 0.62 : r; i ? v.lineTo(Math.cos(a) * rad, Math.sin(a) * rad) : v.moveTo(rad, 0); } v.closePath(); v.fill(); v.lineWidth = 5; v.strokeStyle = rgba(INK); v.stroke(); v.restore(); }
function dumbbell(x, y, s, rot) { v.save(); v.translate(x, y); v.rotate(rot); v.scale(s, s); v.fillStyle = rgba([70, 70, 80]); v.strokeStyle = rgba(INK); v.lineWidth = 5; v.fillRect(-60, -6, 120, 12); for (const sx of [-1, 1]) { v.beginPath(); v.roundRect(sx * 60 - 14, -34, 28, 68, 6); v.fill(); v.stroke(); } v.restore(); }
function phoneIn(x, y, s) { v.save(); v.translate(x, y); v.scale(s, s); rr(-34, -64, 68, 128, 12, [30, 32, 44], { ls: 5 }); rr(-27, -54, 54, 100, 4, BLU); v.restore(); }
function errBox(x, y, w, title, msg, a = 1) { v.save(); v.globalAlpha *= a; rr(x - w / 2, y - 70, w, 140, 10, [235, 235, 240], { ls: 5 }); rr(x - w / 2, y - 70, w, 34, 8, RED); txtv(title, x, y - 46, 18, { col: WHT }); txtv(msg, x, y + 4, 26, { col: INK }); rr(x - 40, y + 28, 80, 30, 6, BLU); txtv('Tamam', x, y + 50, 17, {}); v.restore(); }
