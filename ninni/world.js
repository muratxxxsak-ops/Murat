'use strict';
// ====== MEKÂNLAR ======
const WALL = [196, 176, 146], WOOD = [120, 82, 56], DARKW = [70, 48, 34];
// sabah odası: pencere solda, sandalye, küçük masa, annenin fotoğrafı
function roomMorning(t, o = {}) {
  const warm = o.warm === undefined ? 1 : o.warm, cam = o.cam || [0, 0, 1];
  C.save(); C.translate(W / 2, H / 2); C.scale(cam[2], cam[2]); C.translate(-W / 2 - cam[0], -H / 2 - cam[1]);
  vg(0, 1350, [[0, shade(WALL, .78)], [.6, WALL], [1, shade(WALL, .82)]]);
  // duvar lekeleri
  const R = rng(4); for (let i = 0; i < 18; i++) blob(R() * W, R() * 1300, 60 + R() * 120, shade(WALL, .85 + R() * .25), .25, .7);
  // pencere
  const wx = 90, wy = 260, ww = 520, wh = 720;
  form([[wx - 30, wy - 30], [wx + ww + 30, wy - 30], [wx + ww + 30, wy + wh + 50], [wx - 30, wy + wh + 50]], [226, 216, 196], { n: 4 });
  const sky = o.dawn ? [[0, [250, 200, 150]], [1, [255, 236, 200]]] : [[0, [190, 214, 236]], [1, [236, 236, 220]]]; C.fillStyle = lgr(0, wy, 0, wy + wh, sky); C.fillRect(wx, wy, ww, wh);
  // dışarıda karşı ev ve ağaç
  form([[wx, wy + wh * .55], [wx + ww * .55, wy + wh * .5], [wx + ww * .55, wy + wh], [wx, wy + wh]], [214, 196, 176], { n: 4 }); for (let i = 0; i < 3; i++) C.fillStyle = cs([150, 170, 190]), C.fillRect(wx + 40 + i * 90, wy + wh * .62, 50, 70);
  for (let i = 0; i < 7; i++) blob(wx + ww * .72 + R() * 160, wy + wh * .35 + R() * 260, 80 + R() * 60, [120, 150, 90], .7);
  if (o.sun) { const sy = lerp(wy + wh, wy + wh * .25, o.sun); blob(wx + ww * .45, sy, 120, [255, 230, 170], .9); light(wx + ww * .45, sy, 500, [255, 200, 130], .5 * o.sun); }
  C.fillStyle = cs([236, 228, 210]); C.fillRect(wx + ww / 2 - 10, wy, 20, wh); C.fillRect(wx, wy + wh * .42, ww, 18);
  // perde
  form([[wx - 50, wy - 60], [wx + 90, wy - 60], [wx + 60, wy + wh * .5], [wx + 110, wy + wh + 80], [wx - 50, wy + wh + 80]], [176, 120, 100], { n: 8 });
  // duvarda annenin fotoğrafı
  if (o.photo !== false) { form([[760, 380], [960, 380], [960, 640], [760, 640]], [90, 60, 40], { n: 3 }); C.fillStyle = cs([210, 196, 170]); C.fillRect(784, 404, 152, 212); head({ who: 'anne', x: 860, y: 500, r: 58, smile: .5, sad: 0 }); if (o.ribbon) { C.strokeStyle = cs([20, 20, 20]); C.lineWidth = 16; C.beginPath(); C.moveTo(900, 380); C.lineTo(960, 440); C.stroke(); } }
  // zemin
  vg(1350, H + 60, [[0, [120, 90, 66]], [1, [70, 50, 38]]]); for (let i = 0; i < 9; i++) { C.strokeStyle = cs([60, 42, 30], .35); C.lineWidth = 4; C.beginPath(); C.moveTo(0, 1380 + i * 70); C.lineTo(W, 1390 + i * 72); C.stroke(); }
  form(ell(540, 1640, 460, 120, 24), [150, 60, 50], { n: 10 }); // halı
  // pencereden ışık hüzmesi
  C.save(); C.globalCompositeOperation = 'lighter'; poly([[wx, wy], [wx + ww, wy], [wx + ww + 520, 1900], [wx + 120, 1900]]); C.fillStyle = lgr(0, wy, 0, 1900, [[0, [255, 210, 150], .22 * warm], [1, [255, 210, 150], 0]]); C.fill(); C.restore();
  for (let i = 0; i < 26; i++) { const px = wx + 100 + ((R() * 700 + t * 8 * (R() - .3)) % 700), py = wy + 200 + ((R() * 1100 + t * 6) % 1100); blob(px, py, 4, [255, 240, 200], .6 * warm); }
  C.restore();
}
function chair(x, y, s, col = WOOD) { // arkalıklı tahta sandalye (ön görünüş)
  form([[x - .55 * s, y - 1.6 * s], [x + .55 * s, y - 1.6 * s], [x + .5 * s, y - .65 * s], [x - .5 * s, y - .65 * s]], col, { n: 4 });
  form([[x - .62 * s, y - .7 * s], [x + .62 * s, y - .7 * s], [x + .6 * s, y - .52 * s], [x - .6 * s, y - .52 * s]], shade(col, 1.1), { n: 3 });
  for (const sd of [-1, 1]) { C.fillStyle = cs(shade(col, .7)); C.fillRect(x + sd * .52 * s - 8, y - .55 * s, 16, .55 * s); } }
function tray(x, y, s) { form(ell(x, y, 1.1 * s, .3 * s, 20), [190, 160, 110], { n: 3 }); // çay bardağı ve simit
  form([[x - .5 * s, y - .05 * s], [x - .36 * s, y - .05 * s], [x - .32 * s, y - .6 * s], [x - .54 * s, y - .6 * s]], [170, 60, 30], { n: 2, hi: .4 }); blob(x - .43 * s, y - .62 * s, .12 * s, [240, 240, 240], .5, .4);
  C.save(); C.translate(x + .35 * s, y - .12 * s); C.scale(1, .4); C.lineWidth = .2 * s; C.strokeStyle = cs([190, 120, 60]); C.beginPath(); C.arc(0, 0, .35 * s, 0, TAU); C.stroke(); C.restore();
  for (let i = 0; i < 3; i++) { const ph = (Date.now() * 0 + i * .33) % 1; blob(x - .43 * s + Math.sin(i * 2) * 10, y - .8 * s - i * 30, 14 + i * 6, [250, 250, 250], .18); } }
// park (geçmiş, altın ışık)
function park(t, o = {}) {
  vg(0, 1200, [[0, [250, 210, 140]], [.7, [255, 230, 170]], [1, [230, 200, 140]]]); blob(760, 520, 220, [255, 240, 190], .9); light(760, 520, 700, [255, 200, 120], .35);
  const R = rng(9); for (let i = 0; i < 5; i++) { const x = i * 260 - 60 + R() * 60; C.fillStyle = cs([110, 80, 50]); C.fillRect(x - 18, 700, 36, 520); for (let k = 0; k < 6; k++) blob(x + (R() - .5) * 260, 620 + R() * 200, 110 + R() * 60, [[160, 170, 80], [190, 170, 70], [140, 150, 70]][k % 3], .8); }
  vg(1150, H + 40, [[0, [170, 170, 90]], [1, [110, 120, 60]]]); for (let i = 0; i < 40; i++) blob(R() * W, 1200 + R() * 700, 40 + R() * 50, [190, 190, 100], .3, .4);
  form([[300, 1150], [780, 1150], [1080, H], [0, H]], [214, 190, 150], { n: 8 });
  for (let i = 0; i < 30; i++) { const px = (R() * W + t * 20) % W, py = 300 + R() * 900; blob(px, py, 5, [255, 240, 190], .7); }
}
// yatak odası (gece veya geçmiş)
function bedroom(t, o = {}) {
  vg(0, 1400, [[0, o.night ? [40, 46, 70] : [120, 100, 90]], [1, o.night ? [70, 66, 80] : [150, 126, 104]]]);
  // pencere + ay
  form([[620, 260], [980, 260], [980, 700], [620, 700]], [60, 50, 50], { n: 3 }); C.fillStyle = lgr(0, 280, 0, 680, [[0, [30, 40, 80]], [1, [60, 70, 110]]]); C.fillRect(640, 280, 320, 400); blob(860, 380, 46, [250, 244, 210], 1); light(860, 380, 260, [180, 200, 255], .25); C.fillStyle = cs([60, 50, 50]); C.fillRect(792, 280, 14, 400);
  if (o.stars) { const R = rng(2); for (let i = 0; i < 12; i++) blob(650 + R() * 300, 300 + R() * 360, 4, [255, 255, 230], .9); }
  vg(1400, H + 40, [[0, [80, 60, 50]], [1, [40, 30, 26]]]);
  // gece lambası
  if (o.lamp !== false) { form([[120, 1080], [260, 1080], [230, 960], [150, 960]], [230, 200, 150], { n: 3, hi: .5 }); C.fillStyle = cs(DARKW); C.fillRect(100, 1080, 180, 380); light(190, 1000, 520, [255, 190, 110], .55); }
  // yatak
  form([[260, 1180], [1080, 1180], [1080, 1560], [260, 1560]], [210, 200, 186], { n: 6 }); form([[230, 1000], [300, 1000], [300, 1600], [230, 1600]], WOOD, { n: 3 });
}
function blanket(x0, y0, x1, y1, col = [130, 90, 110]) { form([[x0, y0 + 40], [x0 + (x1 - x0) * .3, y0], [x1, y0 + 20], [x1, y1], [x0 - 20, y1]], col, { n: 10 }); for (let i = 0; i < 4; i++) { C.strokeStyle = cs(shade(col, .7), .5); C.lineWidth = 6; C.beginPath(); C.moveTo(x0 + 60 + i * 150, y0 + 40); C.quadraticCurveTo(x0 + 100 + i * 150, (y0 + y1) / 2, x0 + 40 + i * 150, y1); C.stroke(); } }
// kapı önü (akşam)
function hallway(t, o = {}) {
  vg(0, 1500, [[0, [90, 74, 60]], [1, [130, 106, 84]]]); light(540, 140, 600, [255, 190, 120], .4); C.fillStyle = cs([40, 36, 30]); C.fillRect(536, 0, 8, 120); blob(540, 140, 30, [255, 230, 170], 1);
  // kapı
  const op = o.open || 0; form([[300, 330], [800, 330], [800, 1500], [300, 1500]], [60, 42, 30], { n: 3 });
  C.fillStyle = lgr(0, 360, 0, 1500, [[0, [20, 24, 40]], [1, [40, 40, 56]]]); C.fillRect(330, 360, 440, 1140);
  if (op < 1) { const dw = 440 * (1 - op); form([[330, 360], [330 + dw, 360 + op * 40], [330 + dw, 1500 - op * 40], [330, 1500]], [140, 96, 62], { n: 6 }); blob(330 + dw - 40, 960, 16, [220, 190, 110], 1); }
  // askılık
  C.fillStyle = cs(DARKW); C.fillRect(860, 520, 180, 20); for (let i = 0; i < 3; i++) blob(890 + i * 60, 560, 14, [150, 120, 80], 1);
  vg(1500, H + 40, [[0, [90, 66, 50]], [1, [50, 36, 28]]]);
}
// fabrika (gece)
function factory(t, o = {}) {
  vg(0, H, [[0, [24, 30, 40]], [1, [40, 46, 54]]]); const R = rng(6);
  for (let i = 0; i < 6; i++) { const x = i * 210 - 40, h = 500 + R() * 400; form([[x, 1500 - h], [x + 190, 1500 - h], [x + 190, 1500], [x, 1500]], [70 + R() * 20, 76, 86], { n: 5 }); blob(x + 95, 1500 - h + 80, 30, [255, 170, 60], .8); light(x + 95, 1500 - h + 80, 140, [255, 160, 60], .3); }
  for (let i = 0; i < 4; i++) light(200 + i * 230, 120, 400, [140, 200, 220], .18);
  vg(1500, H + 40, [[0, [50, 54, 60]], [1, [24, 26, 30]]]); C.fillStyle = cs([90, 90, 96]); C.fillRect(0, 1480, W, 40);
  if (o.sparks) { for (let i = 0; i < 30; i++) { const ph = (t * 1.5 + R()) % 1, x = 700 + (R() - .5) * 300 * ph, y = 900 + ph * 500 + ph * ph * 300; blob(x, y, 6, [255, 200, 90], 1 - ph); } light(700, 900, 260, [255, 190, 80], .45 * (Math.sin(t * 20) * .3 + .7)); }
  for (let i = 0; i < 5; i++) { const ph = (t * .12 + i / 5) % 1; blob(300 + i * 140, 1400 - ph * 900, 120 + ph * 200, [140, 150, 160], .12 * Math.sin(ph * Math.PI)); }
}
// yağmurlu gece sokağı / park
function rainNight(t, o = {}) {
  vg(0, H, [[0, [16, 20, 34]], [.6, [34, 40, 56]], [1, [24, 28, 38]]]); const R = rng(11);
  if (o.street) { for (let i = 0; i < 6; i++) { const x = i * 200 - 80, h = 700 + R() * 500; form([[x, 1300 - h], [x + 190, 1300 - h], [x + 190, 1300], [x, 1300]], [40 + R() * 20, 44, 58], { n: 4 }); for (let k = 0; k < 5; k++) if (R() < .4) { C.fillStyle = cs([240, 190, 110]); C.fillRect(x + 30 + (k % 2) * 80, 1300 - h + 80 + k * 110, 50, 60); } } }
  if (o.lampX !== undefined) { C.fillStyle = cs([30, 30, 34]); C.fillRect(o.lampX - 8, 500, 16, 1000); blob(o.lampX, 500, 30, [255, 226, 160], 1); light(o.lampX, 520, 700, [255, 200, 120], .45); C.save(); C.globalCompositeOperation = 'lighter'; poly([[o.lampX - 20, 520], [o.lampX + 20, 520], [o.lampX + 380, 1600], [o.lampX - 380, 1600]]); C.fillStyle = lgr(0, 520, 0, 1600, [[0, [255, 210, 140], .25], [1, [255, 210, 140], 0]]); C.fill(); C.restore(); }
  vg(1300, H + 40, [[0, [40, 44, 56]], [1, [20, 22, 30]]]);
  for (let i = 0; i < 18; i++) blob(R() * W, 1400 + R() * 500, 60 + R() * 80, [70, 80, 100], .35, .25); // su birikintileri
  if (o.lampX !== undefined) blob(o.lampX, 1700, 200, [255, 200, 120], .25, .2);
}
function rainOver(t, n = 220, a = .45) { const R = rng(3); C.save(); C.strokeStyle = `rgba(210,220,240,${a})`; C.lineWidth = 3; C.beginPath(); for (let i = 0; i < n; i++) { const x0 = R() * (W + 200) - 100, sp = 2600 * (.7 + R() * .6), y = ((R() * H + t * sp) % (H + 100)) - 50, x = x0 - y * .08; C.moveTo(x, y); C.lineTo(x - 5, y + 60); } C.stroke(); C.restore(); }
function bench(x, y, s) { const col = [110, 80, 56]; for (let i = 0; i < 3; i++) form([[x - s, y - s * (.55 + i * .13)], [x + s, y - s * (.55 + i * .13)], [x + s, y - s * (.48 + i * .13)], [x - s, y - s * (.48 + i * .13)]], col, { n: 2 }); form([[x - s, y - s * .42], [x + s, y - s * .42], [x + s, y - s * .34], [x - s, y - s * .34]], shade(col, 1.1), { n: 2 }); for (const sd of [-1, 1]) { C.fillStyle = cs([40, 40, 44]); C.fillRect(x + sd * s * .85 - 8, y - s * .9, 16, s * .9); } }
function teddy(x, y, s, wet = 0) { const c = shade([160, 110, 70], 1 - wet * .3); form(ell(x, y, .7 * s, .8 * s, 16), c, { n: 4 }); form(ell(x, y - 1.05 * s, .55 * s, .5 * s, 14), c, { n: 3 }); for (const sd of [-1, 1]) form(ell(x + sd * .45 * s, y - 1.45 * s, .2 * s, .2 * s, 10), c, { n: 2 }); form(ell(x, y - .92 * s, .22 * s, .16 * s, 10), [200, 170, 130], { n: 2 }); blob(x, y - .98 * s, .07 * s, [30, 20, 20], 1); for (const sd of [-1, 1]) blob(x + sd * .2 * s, y - 1.15 * s, .05 * s, [20, 16, 16], 1); C.strokeStyle = cs([240, 230, 210]); C.lineWidth = 5; C.beginPath(); C.moveTo(x + .2 * s, y - .2 * s); C.lineTo(x + .5 * s, y + .2 * s); C.stroke(); }
