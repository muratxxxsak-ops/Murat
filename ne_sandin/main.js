'use strict';
const cv = document.getElementById('cv'), ctx = cv.getContext('2d');
const PER = 60 / ENERGY.bpm, B0 = ENERGY.ph, bph = t => (t - B0) / PER, pulse = t => { let f = bph(t) % 1; if (f < 0) f += 1; return Math.pow(1 - f, 3); };
const PAPER = [238, 230, 214], INK = [20, 20, 22], RED = [226, 36, 40], GREY = [150, 144, 134];
const PM = [{ bg: PAPER, fg: INK, ac: RED, al: [200, 192, 178] }, { bg: RED, fg: INK, ac: PAPER, al: [170, 24, 28] }, { bg: INK, fg: PAPER, ac: RED, al: [52, 52, 56] }];
const SANS2 = "'DejaVu Sans','Inter',sans-serif", T_END = 116.3;
function R(c, x, y, w, h, col, rot = 0, ax = .5, ay = .5, a = 1) { c.save(); c.translate(x, y); c.rotate(rot); c.globalAlpha *= a; c.fillStyle = rgba(col); c.fillRect(-w * ax, -h * ay, w, h); c.restore(); }
function C(c, x, y, r, col, a = 1) { if (r <= 0) return; c.save(); c.globalAlpha *= a; c.fillStyle = rgba(col); c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill(); c.restore(); }
function ty(c, s, x, y, size, col, o = {}) { c.save(); c.translate(x, y); c.rotate(o.rot || 0); c.scale(o.sx || 1, 1); c.globalAlpha *= o.a === undefined ? 1 : o.a; c.font = `900 ${size}px ${SANS2}`; c.textAlign = o.al || 'center'; c.letterSpacing = (o.sp || 0) + 'px'; if (o.out) { c.lineWidth = o.out; c.strokeStyle = rgba(o.oc || col); c.lineJoin = 'miter'; c.strokeText(s, 0, 0); } if (!o.noFill) { c.fillStyle = rgba(col); c.fillText(s, 0, 0); } c.restore(); }
function heart(c, x, y, s, col, crack) { c.save(); c.translate(x, y); c.scale(s, s); c.fillStyle = rgba(col); c.beginPath(); c.moveTo(0, 30); c.bezierCurveTo(-60, -8, -34, -52, 0, -22); c.bezierCurveTo(34, -52, 60, -8, 0, 30); c.fill(); if (crack) { c.strokeStyle = rgba(crack); c.lineWidth = 6; c.lineJoin = 'miter'; c.beginPath(); c.moveTo(2, -22); c.lineTo(-8, -6); c.lineTo(6, 4); c.lineTo(-4, 16); c.lineTo(2, 30); c.stroke(); } c.restore(); }
function fig(c, x, y, s, P, o = {}) {
  const col = o.col || P.fg, ph = o.ph || 0, sw = o.walk ? Math.sin(ph) * .5 : 0, dir = o.dir || 1, ar = o.arms || 'down', a = o.a === undefined ? 1 : o.a;
  c.save(); c.translate(x, y); c.scale(s * dir, s); c.globalAlpha *= a; if (o.rot) c.rotate(o.rot);
  R(c, -9, -74, 17, 74, col, sw, .5, 0); R(c, 9, -74, 17, 74, col, -sw, .5, 0);
  c.fillStyle = rgba(col); c.beginPath(); c.moveTo(-26, -152); c.lineTo(26, -152); c.lineTo(20, -70); c.lineTo(-20, -70); c.closePath(); c.fill();
  const armA = (side) => { if (ar === 'up') return side ? -2.6 : 2.6 - Math.sin(ph) * .0; if (ar === 'chest') return side ? .4 : -2.0; if (ar === 'ears') return side ? -2.9 : 2.9; if (ar === 'hold') return side ? -.9 : .9; return (side ? -1 : 1) * sw * .8 + (side ? -.08 : .08); };
  R(c, -28, -142, 13, 70, col, armA(0), .5, 0); R(c, 28, -142, 13, 70, col, armA(1), .5, 0);
  C(c, 0, -178, 25, col);
  if (o.cap) { c.fillStyle = rgba(o.cap); c.beginPath(); c.arc(0, -184, 26, Math.PI, TAU); c.fill(); c.fillRect(0, -188, 34, 7); }
  if (o.hair) R(c, -4, -176, 54, 60, o.hair, 0, 1, .5);
  C(c, 9, -180, 3.5, P.bg);
  if (o.smile) { c.strokeStyle = rgba(P.bg); c.lineWidth = 3.5; c.beginPath(); c.arc(8, -170, 8, .2, Math.PI - .5); c.stroke(); }
  c.restore();
}
function bars(c, lt, P, col) { if (lt > .42) return; for (let i = 0; i < 8; i++) { const p = seg(lt, i * .02, i * .02 + .3); R(c, i * 160, 0, 160, H * (1 - sm(p)), col, 0, 0, 0); } }
function slam(t) { return 1 + .06 * pulse(t); }
function mainTy(c, t, lt, P, big) {
  const s = slam(t), q = (bph(t) | 0);
  for (let i = 3; i > 0; i--) { ty(c, 'NE', 330 + i * 22, 300 + i * 18, 280, P.al, { sx: .9 }); ty(c, 'SANDIN', 640 + i * 22, 590 + i * 18, 230, P.al, { sx: .88 }); }
  c.save(); c.translate(640, 360); c.scale(s, s); c.translate(-640, -360);
  C(c, 1010, 180, 120 + 20 * pulse(t), P.ac);
  ty(c, 'NE', 330, 300, 280, P.fg, { sx: .9 }); ty(c, 'SANDIN', 640, 590, 230, P.fg, { sx: .88 });
  ty(c, '?', 1010, 262, 300, P.bg, { rot: Math.sin(t * 2) * .2 + (q % 2 ? .1 : -.1) });
  c.restore();
}
function sFlame(c, t, lt, P) {
  fig(c, 640, 640, 2.5, P, { t, cap: P.ac, smile: 1 });
  const go = sm(seg(lt, .4, 1.3)); fig(c, lerp(1000, -140, go), 640, 2.2, P, { col: P.ac === RED ? RED : P.ac, walk: 1, ph: t * 7, dir: -1, hair: P.ac === RED ? RED : P.ac });
  const k = 1 - sm(seg(lt, 1.4, 2.3)); c.save(); c.translate(1040, 640); c.scale(k, k); c.fillStyle = rgba(P.ac); c.beginPath(); c.moveTo(0, 0); c.bezierCurveTo(-70, -60, -30, -150, 0, -240 + Math.sin(t * 20) * 14); c.bezierCurveTo(30, -150, 70, -60, 0, 0); c.fill(); c.fillStyle = rgba(P.bg); c.beginPath(); c.moveTo(0, 0); c.bezierCurveTo(-34, -30, -14, -80, 0, -110); c.bezierCurveTo(14, -80, 34, -30, 0, 0); c.fill(); c.restore();
  R(c, 1040, 650, 160, 30, P.fg);
}
function sCall(c, t, lt, P) {
  const cx = 330, cy = 360; C(c, cx, cy, 190, P.fg); C(c, cx, cy, 168, P.bg);
  const day = (lt * .8) % 1; for (let i = 0; i < 12; i++) R(c, cx + Math.cos(i / 12 * TAU) * 150, cy + Math.sin(i / 12 * TAU) * 150, 8, 24, P.fg, i / 12 * TAU + Math.PI / 2);
  R(c, cx, cy, 10, 120, P.fg, lt * 5, .5, 1); R(c, cx, cy, 14, 80, P.ac, lt * .5, .5, 1); C(c, cx, cy, 14, P.fg);
  const ang = day * TAU; C(c, cx + Math.cos(ang) * 235, cy + Math.sin(ang) * 235, 28, Math.sin(ang) > 0 ? P.fg : P.ac);
  c.save(); c.translate(900, 380); c.rotate(.05 * Math.sin(t * 3)); R(c, 0, 0, 260, 480, P.fg); R(c, 0, -6, 220, 400, P.bg); ty(c, '0', 0, 20, 150, P.fg); ty(c, 'arama', 0, 80, 40, P.ac); R(c, 0, 210, 60, 8, P.fg); c.restore();
}
function sSmile(c, t, lt, P) {
  const b = Math.abs(Math.sin(lt * 4.2)) * 40, r = 230; C(c, 640, 380 - b * .4, r, P.ac); C(c, 560, 320 - b * .4, 26, P.fg); C(c, 720, 320 - b * .4, 26, P.fg);
  c.strokeStyle = rgba(P.fg); c.lineWidth = 26; c.lineCap = 'butt'; c.beginPath(); c.arc(640, 400 - b * .4, 120, .15, Math.PI - .15); c.stroke();
  for (const s of [-1, 1]) { c.save(); c.translate(640 + s * 440, 360); c.scale(s, 1); const k = (lt * 2.1) % 1; ty(c, 'BAK', 0, 0, 70, P.fg, { rot: -.08 }); R(c, 0 - 40 + k * 40, 40, 140, 22, P.fg); c.fillStyle = rgba(P.fg); c.beginPath(); c.moveTo(100 + k * 40, 24); c.lineTo(140 + k * 40, 51); c.lineTo(100 + k * 40, 78); c.fill(); c.restore(); }
}
function sWalk(c, t, lt, P, o = {}) {
  for (let i = 0; i < 9; i++) { const x = ((i * 190 - lt * 160) % 1710 + 1710) % 1710 - 220, h = 160 + (i * 61) % 140; R(c, x, 560, 130, h, P.al, 0, 0, 1); for (let w = 0; w < 3; w++) R(c, x + 24, 560 - h + 24 + w * 40, 22, 22, P.bg); }
  R(c, 640, 650, 1400, 120, P.fg);
  fig(c, 640, 650, 2.5, P, { t, walk: 1, ph: lt * 7.4, cap: P.ac });
  heart(c, 640 + 4, 460 + 4 * pulse(t), 1.3 + .2 * pulse(t), P.ac, P.bg);
}
function sQ(c, t, lt, P) { const s = slam(t); C(c, 640, 360, 300 * s, P.ac); ty(c, '?', 640, 590, 820, P.fg, { rot: lt * .8 }); ty(c, 'NE SANDIN', 640, 110, 90, P.fg, { sp: 10 }); }
function sApart(c, t, lt, P) {
  R(c, 640, 360, 70, 760, P.fg, .08); fig(c, 330, 640, 2.4, P, { t, cap: P.ac, arms: 'down' });
  for (let i = 0; i < 4; i++) { const p = (lt * .8 + i / 4) % 1; c.strokeStyle = rgba(P.fg); c.lineWidth = 6; c.setLineDash([14, 14]); c.globalAlpha = 1 - p; c.beginPath(); c.arc(330 + 170, 250, 20 + p * 150, -.6, .6); c.stroke(); c.setLineDash([]); c.globalAlpha = 1; }
  fig(c, 950, 640, 2.4, P, { col: P.ac === RED ? RED : P.ac, arms: 'ears', dir: -1, hair: P.ac === RED ? RED : P.ac }); ty(c, '?', 1120, 250, 160, P.fg, { rot: .2 });
}
function sDoor(c, t, lt, P) {
  const k = eo(seg(lt, .2, .55)), sx = lerp(1, .06, k); R(c, 640, 660, 460, 660, P.fg, 0, .5, 1); R(c, 640, 640, 400, 620, P.al, 0, .5, 1);
  R(c, 440, 640, 400 * sx, 620, P.ac, 0, 0, 1); C(c, 440 + 360 * sx, 340, 14, P.fg);
  if (lt > .55) { const q = seg(lt, .55, 1.6); for (let i = 0; i < 16; i++) { const a = i / 16 * TAU; R(c, 640 + Math.cos(a) * (240 + q * 260), 350 + Math.sin(a) * (240 + q * 260), 70 * (1 - q), 10, P.fg, a); } }
  ty(c, 'KAPI', 1090, 220, 110, P.fg, { rot: -.15 }); ty(c, 'ÇARP!', 190, 560, 120, P.fg, { rot: .1, a: lt > .5 ? 1 : 0 });
}
function sBubble(c, t, lt, P) {
  c.save(); c.translate(640, 330); c.rotate(-.04); c.fillStyle = rgba(P.fg); c.beginPath(); c.roundRect(-380, -170, 760, 300, 40); c.fill(); c.beginPath(); c.moveTo(-250, 120); c.lineTo(-310, 230); c.lineTo(-170, 120); c.fill();
  ty(c, 'ONDAN BAŞKA YOK', 0, 20, 100, P.bg, { sx: .95 });
  const k = sm(seg(lt, 1.2, 1.7)); R(c, 0 - 400 * (1 - k), 0, 840, 44, P.ac, -.12); ty(c, 'BİTTİ', 0, 120, 130, P.ac, { a: k, rot: -.12 }); c.restore();
  fig(c, 1100, 700, 1.8, P, { col: P.ac, dir: -1, walk: 1, ph: t * 7, hair: P.ac });
}
function sGhost(c, t, lt, P) {
  fig(c, 960, 650, 2.5, P, { t, cap: P.ac, smile: 1 });
  const k = sm(seg(lt, .3, 1.8)); fig(c, 330, 650 - 0, 2.4, P, { col: P.ac, a: .3, rot: -k * 1.45 }); for (let i = 0; i < 6; i++) { const p = (lt * 1.2 + i / 6) % 1; C(c, 330 + (i - 3) * 50, 640 - p * 120, 10 + p * 20, P.al, (1 - p) * k); }
  ty(c, 'SANDIN Kİ', 330, 150, 80, P.fg, { rot: -.05 }); R(c, 330, 175, 400, 10, P.ac, -.05);
}
function sCorner(c, t, lt, P) {
  R(c, 220, 360, 40, 760, P.fg, 0, .5, .5); R(c, 640, 690, 1400, 60, P.fg);
  fig(c, 280, 690, 1.9, P, { col: P.ac, a: .35, rot: -1.5 }); const day = (lt * .5) % 1; C(c, 640 + Math.cos(day * TAU + Math.PI) * 340, 360 + Math.sin(day * TAU + Math.PI) * 220, 60, day < .5 ? P.ac : P.fg);
  R(c, 640, 500, 12, 200, P.fg, 0, .5, 1); const g = sm(seg(lt, 1.8, 2.4)); fig(c, lerp(1500, 980, g), 650, 2.4, P, { t, walk: g < 1 ? 1 : 0, ph: t * 7, cap: P.ac, smile: 1, dir: -1 });
  ty(c, 'HER AKŞAM', 700, 150, 90, P.fg, { rot: .03 });
}
function sStreet(c, t, lt, P) {
  const cols = [P.al, P.fg, P.al]; for (let i = 0; i < 6; i++) { const x = ((i * 300 - lt * 40) % 1800 + 1800) % 1800 - 260, h = 300 + (i * 97) % 200; R(c, x, 620, 280, h, i % 2 ? P.al : P.fg, 0, 0, 1); for (let a = 0; a < 3; a++) for (let b = 0; b < 3; b++) R(c, x + 40 + a * 80, 620 - h + 50 + b * 90, 40, 52, i % 2 ? P.bg : P.ac); }
  R(c, 640, 660, 1400, 100, P.ac === RED && P.bg !== RED ? P.fg : P.bg === RED ? INK : P.al); fig(c, 640, 660, 2.4, P, { t, walk: 1, ph: lt * 6, cap: P.ac });
  for (const x of [200, 1080]) { R(c, x, 660, 14, 400, P.fg, 0, .5, 1); C(c, x, 270, 30 + 6 * pulse(t), P.ac); }
}
function sTea(c, t, lt, P) {
  R(c, 640, 560, 1000, 40, P.fg); R(c, 400, 640, 40, 160, P.fg, 0, .5, 0); R(c, 880, 640, 40, 160, P.fg, 0, .5, 0);
  fig(c, 300, 560, 2.2, P, { t, cap: P.ac, smile: 1 }); fig(c, 980, 560, 2.2, P, { t, col: P.al === P.al ? P.ac : P.ac, dir: -1, smile: 1, hair: null });
  const cl = sm(seg(lt, 1.6, 2)) * (lt < 2.4 ? 1 : 0), gx1 = 560 + cl * 50, gx2 = 720 - cl * 50;
  for (const [gx, col] of [[gx1, P.ac], [gx2, P.ac]]) { c.fillStyle = rgba(col); c.beginPath(); c.moveTo(gx - 34, 440); c.lineTo(gx + 34, 440); c.lineTo(gx + 24, 540); c.lineTo(gx - 24, 540); c.closePath(); c.fill(); c.fillStyle = rgba(P.bg); c.fillRect(gx - 28, 440, 56, 14); R(c, gx, 546, 90, 12, P.fg); }
  for (let i = 0; i < 4; i++) { const p = (lt * .7 + i / 4) % 1; c.strokeStyle = rgba(P.fg); c.globalAlpha = 1 - p; c.lineWidth = 7; c.beginPath(); c.moveTo((i % 2 ? gx1 : gx2) - 10 + i * 6, 420); c.quadraticCurveTo((i % 2 ? gx1 : gx2) + 18, 380 - p * 100, (i % 2 ? gx1 : gx2) - 6, 330 - p * 140); c.stroke(); c.globalAlpha = 1; }
  ty(c, 'ÇAY HÂLÂ MASADA', 640, 90, 70, P.fg, { rot: -.02 });
}
function sEyes(c, t, lt, P) {
  const up = sm(seg(lt, .3, 1)); for (const x of [420, 860]) { C(c, x, 330, 170, P.fg); C(c, x, 330, 150, P.bg); C(c, x + 20, 330 - up * 90, 72, P.fg); C(c, x + 40, 300 - up * 90, 20, P.bg); R(c, x, 140, 340, 34, P.fg, x < 600 ? .15 : -.15); }
  const dr = ((lt * .8) % 1); c.save(); c.translate(640, 560); c.fillStyle = rgba(P.al); c.beginPath(); c.moveTo(0, -60); c.bezierCurveTo(-40, 0, -40, 40, 0, 40); c.bezierCurveTo(40, 40, 40, 0, 0, -60); c.fill(); R(c, 0, 0, 140, 22, P.ac, .7); R(c, 0, 0, 140, 22, P.ac, -.7); c.restore();
  ty(c, 'YUKARDA', 640, 690, 100, P.fg, { rot: 0 }); c.fillStyle = rgba(P.ac); c.beginPath(); c.moveTo(640, 70 + up * -10); c.lineTo(600, 120); c.lineTo(680, 120); c.fill();
}
function sTangle(c, t, lt, P) {
  const drop = sm(seg(lt, 1.2, 1.9)); fig(c, 500, 650, 2.4, P, { t, cap: P.ac, arms: lt < 1.2 ? 'hold' : 'down', smile: 1 });
  const bx = lerp(640, 760, drop), by = lerp(440, 640, drop * drop) - Math.abs(Math.sin(drop * 9)) * 30 * (1 - drop) * drop; c.strokeStyle = rgba(P.ac); c.lineWidth = 7; c.beginPath(); for (let i = 0; i < 80; i++) { const a = i * .5, r = 20 + (i % 9) * 5; i ? c.lineTo(bx + Math.cos(a * 2.3) * r, by + Math.sin(a * 1.7) * r) : c.moveTo(bx + r, by); } c.stroke();
  const k = sm(seg(lt, 2, 2.8)); c.fillStyle = rgba(P.fg); c.beginPath(); c.moveTo(780, 360); c.lineTo(980 + k * 180, 360); c.lineTo(980 + k * 180, 320); c.lineTo(1100 + k * 180, 380); c.lineTo(980 + k * 180, 440); c.lineTo(980 + k * 180, 400); c.lineTo(780, 400); c.fill(); ty(c, 'BENİM DERDİM BAŞKA', 900, 230, 56, P.fg);
  ty(c, 'SENİN DERDİN', 760, 740 - 40, 50, P.al);
}
function sNight(c, t, lt, P) {
  R(c, 640, 360, 640, 560, P.fg); R(c, 640, 360, 590, 510, P.bg); R(c, 640, 360, 20, 510, P.fg); R(c, 640, 330, 590, 20, P.fg); C(c, 480, 220, 62, P.ac); C(c, 506, 206, 54, P.bg);
  for (let i = 0; i < 9; i++) { const r = rng(i + 5); C(c, 400 + r() * 470, 140 + r() * 250, 3 + 3 * Math.abs(Math.sin(t * 2 + i)), P.fg); }
  R(c, 640, 640, 800, 40, P.fg); fig(c, 760, 640, 2.0, P, { t, cap: P.ac, arms: 'down', dir: -1 });
  for (let i = 0; i < 3; i++) C(c, 640 + i * 52, 380 - i * 56 - Math.sin(t * 2 + i) * 6, 8 + i * 10, P.fg, sm(seg(lt, .4 + i * .3, .7 + i * .3)));
}
function sShrug(c, t, lt, P) {
  const pop = sm(seg(lt, .2, .5)) * (1 - sm(seg(lt, .8, 1))); C(c, 500, 200, 100 * pop, P.fg); ty(c, 'BOŞ VER', 640, 380, 190 * (.85 + .15 * sm(seg(lt, .6, 1.2))), P.fg, { rot: -.04, a: sm(seg(lt, .8, 1.2)) });
  for (let i = 0; i < 4; i++) { const x = ((i * 460 - lt * 300) % 1840 + 1840) % 1840 - 280; R(c, x, 620, 14, 440, P.fg, 0, .5, 1); C(c, x, 190, 34, P.ac); }
  R(c, 640, 690, 1400, 80, P.fg); fig(c, 640, 690, 2.2, P, { t, walk: 1, ph: lt * 6.5, cap: P.ac });
}
function sPhone(c, t, lt, P, ok) {
  c.save(); c.translate(640, 380); c.rotate(-.04); R(c, 0, 0, 380, 640, P.fg); R(c, 0, 0, 340, 580, P.bg);
  for (let i = 0; i < 12; i++) { const x = -110 + (i % 3) * 110, y = -200 + ((i / 3) | 0) * 100; R(c, x, y, 94, 84, i === 7 ? P.ac : P.al); if (i === 7 || i % 4 === 0) { c.strokeStyle = rgba(P.bg); c.lineWidth = 5; c.beginPath(); c.arc(x, y + 4, 20, .3, Math.PI - .3); c.stroke(); } }
  const sh = Math.sin(lt * 30) * 6 * (lt > 1.2 ? 1 : 0); R(c, sh, 260, 220, 62, P.fg); ty(c, 'SİL', sh, 282, 46, P.bg);
  const k = sm(seg(lt, .4, 1.2)) * (1 - sm(seg(lt, 1.3, 1.8))); R(c, 130 - k * 100, 300 - k * 40, 36, 20, P.ac, -.6);
  c.restore(); ty(c, 'HEPSİNİ', 220, 300, 70, P.fg, { rot: -.1 }); ty(c, 'SİLEMEDİM', 230, 380, 70, P.ac, { rot: -.1 });
}
function sPhoto(c, t, lt, P) {
  const k = eo(seg(lt, .1, .9)), s = lerp(.3, 1, k); c.save(); c.translate(640, 360); c.rotate(-.06 * (1 - k) + .03); c.scale(s, s); R(c, 0, 20, 560, 560, P.fg); R(c, 0, 0, 500, 500, P.ac); C(c, -90, -60, 30, P.fg); C(c, 90, -60, 30, P.fg); c.strokeStyle = rgba(P.fg); c.lineWidth = 28; c.beginPath(); c.arc(0, 20, 150, .12, Math.PI - .12); c.stroke(); c.restore();
  for (let i = 0; i < 10; i++) { const a = i / 10 * TAU + t, p = (lt * 1.3 + i * .1) % 1; R(c, 640 + Math.cos(a) * (360 + p * 80), 360 + Math.sin(a) * (320 + p * 60), 22, 22, P.fg, a + t, .5, .5, 1 - p); }
  ty(c, 'EN GÜZEL HÂLİ', 640, 690, 70, P.fg);
}
function sChest(c, t, lt, P) {
  fig(c, 500, 660, 2.6, P, { t, cap: P.ac, arms: 'chest', smile: 1 }); const s = 1 + .2 * pulse(t); heart(c, 500 + 6, 470, 1.4 * s, P.ac); heart(c, 1010, 380, 3.2 * s, P.ac);
  ty(c, 'ADAM GİBİ', 1010, 620, 110, P.fg, { sx: .85 });
}
function sGame(c, t, lt, P) {
  for (let i = 0; i < 4; i++) { const p = (lt * .9 + i * .25) % 1, x = lerp(1300, 700, p), y = 160 + Math.abs(Math.sin(p * 8)) * -60 + i * 40 + 120, ro = p * 12 + i; c.save(); c.translate(x, y); c.rotate(ro); R(c, 0, 0, 90, 90, P.ac); for (const [dx, dy] of [[-22, -22], [22, 22], [0, 0]]) C(c, dx, dy, 8, P.bg); c.restore(); }
  fig(c, 380, 660, 2.4, P, { t, cap: P.ac, arms: 'hold', smile: 0 }); heart(c, 470, 430 + 5 * Math.sin(t * 5), 1.5, P.ac);
  ty(c, 'OYUN', 960, 560, 150, P.fg, { rot: .06 }); R(c, 960, 520, 440, 22, P.ac, .06);
}
function sBounce(c, t, lt, P) {
  fig(c, 640, 680, 2.6, P, { t, cap: P.ac, smile: 1 }); C(c, 640, 420, 300 + 6 * pulse(t), P.al, .5);
  for (let i = 0; i < 12; i++) { const side = i % 2 ? 1 : -1, p = (lt * .9 + i * .083) % 1, d = Math.abs(1 - p * 2); const x = 640 + side * (330 + 480 * (1 - Math.min(1, p * 2.2))) * (p < .5 ? 1 : 1 + (p - .5) * 3), y = 120 + (i * 53) % 440 + (p > .45 ? (p - .45) * 220 : 0); c.save(); c.translate(x, y); c.rotate(p > .45 ? (p - .45) * 6 * side : 0); c.globalAlpha = p > .8 ? 1 - (p - .8) * 5 : 1; c.fillStyle = rgba(i % 3 ? P.fg : P.ac); c.beginPath(); c.roundRect(-60, -30, 120, 60, 20); c.fill(); c.beginPath(); c.moveTo(-side * 20, 28); c.lineTo(-side * 40, 52); c.lineTo(side * 10, 28); c.fill(); c.restore(); }
  ty(c, 'KİN YOK', 640, 160, 120, P.fg, { rot: -.02 });
}
function sPodium(c, t, lt, P) {
  const dua = lt < 1.4; if (dua) { for (const s of [-1, 1]) { c.save(); c.translate(640 + s * 90, 560); c.rotate(s * (.25 + .05 * Math.sin(t * 4))); c.scale(s, 1); c.fillStyle = rgba(P.fg); c.beginPath(); c.moveTo(0, 0); c.lineTo(-30, -150); c.quadraticCurveTo(0, -250, 90, -180); c.lineTo(110, 0); c.fill(); c.restore(); } for (let i = 0; i < 12; i++) { const a = i / 12 * TAU, r = 320 + 20 * Math.sin(t * 3 + i); R(c, 640 + Math.cos(a) * r, 380 + Math.sin(a) * r * .8, 14, 40, P.ac, a + Math.PI / 2); } ty(c, 'ALLAH MUTLU ETSİN', 640, 130, 80, P.fg); return; }
  const k = eo(seg(lt, 1.4, 2.2)); R(c, 640, 700, 400, 380 * k, P.fg, 0, .5, 1); R(c, 1000, 700, 340, 160 * k, P.fg, 0, .5, 1); fig(c, 640, 700 - 380 * k, 2.1, P, { t, cap: P.ac, smile: 1, arms: 'up' }); fig(c, 1000, 700 - 160 * k, 2.0, P, { col: P.ac, hair: P.ac, dir: -1, rot: .1 });
  ty(c, '1', 640, 700, 180, P.bg); ty(c, 'KAYBEDEN', 300, 330, 80, P.fg, { rot: -.06 }); ty(c, 'SENSİN', 300, 440, 110, P.ac, { rot: -.06 });
}
function sDoorEnd(c, t, lt, P) {
  R(c, 640, 660, 460, 660, P.fg, 0, .5, 1); C(c, 640, 330, 120, P.ac); fig(c, 640 + Math.min(lt, 3) * 55, 650, 1.6 - Math.min(lt, 3) * .15, P, { t, walk: 1, ph: t * 7, cap: P.ac, dir: 1 });
  ty(c, 'BU KADAR', 250, 190, 90, P.fg, { rot: -.04 }); ty(c, 'KOLAY MI', 1000, 520, 100, P.fg, { rot: .04 }); ty(c, 'SANDIN?', 1000, 630, 100, P.ac, { rot: .04 });
}
const SHOTS = [];
const A = (a, b, fn, m) => SHOTS.push({ a, b, fn, m });
const CH = (t0, dt, m) => { const f = [mainTy, sFlame, mainTy, sCall, sSmile, sWalk, sQ, sApart]; f.forEach((fn, i) => A(t0 + i * dt, t0 + (i + 1) * dt, fn, m)); };
A(0, 3, (c, t, lt, P) => { ty(c, 'NE', 640, 380, 60, P.fg, { a: sm(seg(lt, 1, 2)), sp: 20 }); }, 0);
CH(3, 2.5, 0);
const V1 = [[23, 26.5, sDoor, 1], [26.5, 30, sBubble, 0], [30, 33.5, sGhost, 0], [33.5, 37.5, sCorner, 0], [37.5, 41, sStreet, 0], [41, 45, sTea, 0], [45, 48.5, sEyes, 0], [48.5, 55, sTangle, 0]];
V1.forEach(s => A(...s)); CH(55, 2.28, 1);
const V2 = [[73.5, 75, sQ, 2], [75, 77.5, sNight, 2], [77.5, 80, sShrug, 2], [80, 82.5, sPhone, 2], [82.5, 85, sPhoto, 2], [85, 87.5, sChest, 2], [87.5, 90, sGame, 2], [90, 92.5, sBounce, 2], [92.5, 97, sPodium, 2]];
V2.forEach(s => A(...s)); [[97, 99.3, mainTy], [99.3, 101.6, sSmile], [101.6, 103.8, sWalk], [103.8, 106, sCall]].forEach(s => A(s[0], s[1], s[2], 2));
A(106, 111, sDoorEnd, 0); A(111, 120, () => { }, 2);
function endCard(c, t, lt) {
  c.fillStyle = rgba(RED); c.fillRect(0, 0, W, H);
  for (let i = 0; i < 12; i++) R(c, ((i * 140 + lt * 120) % 1680) - 200, 360, 70, 900, [190, 24, 30], .3);
  const p = eo(seg(lt, .2, 1)), s = (1 + .035 * pulse(t)) * p; c.save(); c.translate(640, 360); c.rotate(-.05 * (1 - p)); c.scale(s, s);
  R(c, 14, 14, 940, 330, INK); R(c, 0, 0, 940, 330, PAPER); R(c, 0, 128, 940, 14, RED);
  ty(c, 'murat250sr', 0, 80, 150, INK, { sx: .98 }); ty(c, 'REKLAM', 0, 200, 60, RED, { sp: 16 }); ty(c, 'NE SANDIN?', 0, 270, 70, INK, { sp: 6 }); c.restore();
}
function renderFrame(f) {
  const t = f / 24; setAudio(t); const c = ctx; c.setTransform(1, 0, 0, 1, 0, 0);
  const sh = SHOTS.find(s => t >= s.a && t < s.b) || SHOTS[SHOTS.length - 1], lt = t - sh.a, P = PM[sh.m];
  if (t >= 111) { endCard(c, t, t - 111); } else {
    c.fillStyle = rgba(P.bg); c.fillRect(0, 0, W, H);
    for (let i = 0; i < 14; i++) R(c, i * 100 + 50, 360, 2, 720, P.al, 0, .5, .5, .5);
    c.save(); const sk = KK * (sh.m ? 5 : 2); c.translate(Math.sin(t * 90) * sk, Math.cos(t * 70) * sk); sh.fn(c, t, lt, P); c.restore();
    bars(c, lt, P, sh.m === 2 ? RED : P.fg);
  }
  // grain
  c.save(); c.globalAlpha = .06; const r = rng(f + 3); for (let i = 0; i < 380; i++) { c.fillStyle = r() > .5 ? '#000' : '#fff'; c.fillRect(r() * W, r() * H, 2, 2); } c.restore();
  // etiket: baştan sona
  c.save(); c.translate(1150, 44); c.rotate(.02); R(c, 5, 5, 230, 46, INK); R(c, 0, 0, 230, 46, PAPER); R(c, -115, 0, 12, 46, RED, 0, 0, .5); c.fillStyle = '#141416'; c.font = `900 27px ${SANS2}`; c.textAlign = 'center'; c.fillText('murat250sr', 0, 9); c.restore();
  const a = Math.max(1 - t / .5, 0); if (a > 0) { c.fillStyle = `rgba(0,0,0,${a})`; c.fillRect(0, 0, W, H); }
  const fo = seg(t, T_END - 1, T_END); if (fo > 0) { c.fillStyle = `rgba(0,0,0,${fo})`; c.fillRect(0, 0, W, H); }
}
