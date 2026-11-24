'use strict';
// ===== ortam parçaları: kamera, cephe, lamba, ıslak sokak, oda =====
let CAM = { x: W / 2, y: H / 2, z: 1, r: 0 };
function camA(c, par = 1) { const z = 1 + (CAM.z - 1) * par; c.translate(W / 2, H / 2); c.rotate(CAM.r * par); c.scale(z, z); c.translate(-(W / 2 + (CAM.x - W / 2) * par), -(H / 2 + (CAM.y - H / 2) * par)); }
function nightSky(c, top = [6, 10, 20], bot = [26, 32, 48]) { c.fillStyle = lin(c, 0, 0, 0, H, [[0, top], [1, bot]]); c.fillRect(-400, -400, W + 800, H + 800); }
// uzak bina siluetleri + pencere ışıkları
function farCity(c, base, seed, col = [14, 18, 28], lit = .5, scale = 1) {
  const r = rng(seed); let x = -300;
  while (x < W + 300) {
    const w = (50 + r() * 110) * scale, h = (90 + r() * 260) * scale; c.fillStyle = rgba(col); c.fillRect(x, base - h, w + 1, h + 400);
    for (let yy = base - h + 12 * scale; yy < base - 10; yy += 15 * scale) for (let xx = x + 7 * scale; xx < x + w - 6; xx += 12 * scale) { if (r() < lit * .35) { c.fillStyle = rgba(r() < .7 ? [255, 190, 120] : [170, 200, 255], .35 + r() * .5); c.fillRect(xx, yy, 5 * scale, 7 * scale); } }
    x += w + r() * 10;
  }
}
// apartman cephesi
function facade(c, x0, y0, cols, rows, cw, rh, seed, t, hero) {
  const r = rng(seed); c.fillStyle = lin(c, 0, y0, 0, y0 + rows * rh, [[0, [34, 32, 36]], [1, [22, 22, 28]]]); c.fillRect(x0 - 40, y0 - 30, cols * cw + 80, rows * rh + 600);
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
    const x = x0 + i * cw + cw * .2, y = y0 + j * rh + rh * .18, w = cw * .6, h = rh * .62, isH = hero && hero[0] === i && hero[1] === j;
    c.fillStyle = 'rgba(0,0,0,.5)'; c.fillRect(x - 5, y - 5, w + 10, h + 14); // pervaz gölgesi
    c.fillStyle = rgba([48, 46, 52]); c.fillRect(x - 8, y + h + 4, w + 16, 6); // denizlik
    const on = isH ? 1 : r() < .3 ? .4 + r() * .6 : 0, warm = r() < .75;
    if (on > 0) { const lc = isH ? [120, 160, 230] : warm ? [255, 180, 110] : [150, 180, 255]; c.fillStyle = lin(c, x, y, x, y + h, [[0, mul(lc, .45 * on)], [1, mul(lc, .85 * on)]]); c.fillRect(x, y, w, h); if (!isH && r() < .6) { c.fillStyle = `rgba(255,230,200,${.18 * on})`; c.fillRect(x + w * .55, y, w * .45, h); } }
    else { c.fillStyle = rgba([12, 14, 20]); c.fillRect(x, y, w, h); c.fillStyle = 'rgba(120,140,170,.08)'; c.fillRect(x, y, w * .4, h * .3); }
    c.fillStyle = rgba([20, 18, 22]); c.fillRect(x + w / 2 - 2, y, 4, h); c.fillRect(x, y + h * .4, w, 3);
    if (isH) hero.rect = [x, y, w, h];
  }
}
function lamp(c, x, y, h, t, a = 1, col = [255, 190, 110]) {
  c.fillStyle = '#0c0d10'; c.fillRect(x - 4, y - h, 8, h); c.fillRect(x - 4, y - h, 46, 6); c.beginPath(); c.moveTo(x + 24, y - h + 4); c.lineTo(x + 52, y - h + 4); c.lineTo(x + 46, y - h + 14); c.lineTo(x + 30, y - h + 14); c.fill();
  cone(c, x + 38, y - h + 12, Math.PI / 2, .42, h * 1.05, col, .2 * a);
  rad(c, x + 38, y - h + 14, 120, col, .55 * a); rad(c, x + 38, y - h + 14, 26, [255, 240, 210], .9 * a);
}
// ışık konisi içinde parlayan yağmur
function lampRain(c, t, x, y, h, n = 90, col = [255, 200, 140]) {
  c.save(); c.beginPath(); c.moveTo(x, y); c.lineTo(x - h * .45, y + h); c.lineTo(x + h * .45, y + h); c.closePath(); c.clip();
  rainFall(c, t, n, 26, 900, .06, col, .55, 31, 1.3); c.restore();
}
// ıslak asfalt + ışık yansımaları
function wetStreet(c, y0, t, lights) {
  c.fillStyle = lin(c, 0, y0, 0, H, [[0, [16, 18, 24]], [1, [8, 9, 12]]]); c.fillRect(-300, y0, W + 600, H - y0 + 300);
  for (const [x, col, a, w] of lights) { const g = c.createLinearGradient(0, y0, 0, H); g.addColorStop(0, rgba(col, a)); g.addColorStop(1, rgba(col, 0)); c.save(); c.globalCompositeOperation = 'lighter'; c.fillStyle = g; for (let i = 0; i < 7; i++) { const ww = w * (1 - i * .1), xx = x + Math.sin(t * 2 + i * 1.7) * 3; c.globalAlpha = .5; c.fillRect(xx - ww / 2, y0 + i * 2, ww, H - y0); } c.restore(); }
  splashes(c, t, 60, y0 + 6, H, [200, 210, 230], .35);
}
// oda içi: duvar, perde, pencere (dışarısı yağmurlu şehir)
function roomWall(c, col = [20, 22, 30]) { c.fillStyle = lin(c, 0, 0, 0, H, [[0, mul(col, .7)], [1, col]]); c.fillRect(-300, -300, W + 600, H + 600); }
function rainShadows(c, t, x, y, w, h, a = .12) { // pencereden duvara düşen yağmur gölgeleri
  c.save(); c.beginPath(); c.rect(x, y, w, h); c.clip(); c.fillStyle = `rgba(0,0,0,${a})`;
  for (const d of DROPS) { const yy = y + ((d.y * 1.2 + t * (d.v || 20) * .8) % (h + 40)) - 20, xx = x + (d.x / W) * w; c.beginPath(); c.ellipse(xx, yy, d.s * .7, d.s * 1.4, 0, 0, TAU); c.fill(); }
  c.restore();
}
