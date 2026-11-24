'use strict';
// ===== sinematik motor: katmanlar, alan derinliği, ışık, yağmur, cam, gren =====
const cv = document.getElementById('cv'), ctx = cv.getContext('2d');
const PER = 60 / ENERGY.bpm, B0 = ENERGY.ph, bph = t => (t - B0) / PER;
const pulse = t => { let f = bph(t) % 1; if (f < 0) f += 1; return Math.pow(1 - f, 3); };
const mk = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
const LAY = [0, 1, 2, 3].map(() => mk(W, H)), HALF = mk(W / 2, H / 2), HX = HALF.getContext('2d');
const BLM = mk(320, 180), BX = BLM.getContext('2d');
// katmana çiz, gerekirse bulanıklaştırıp ana tuvale bas
function layer(i, blur, fn, o = {}) {
  const L = LAY[i], c = L.getContext('2d'); c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1; c.globalCompositeOperation = 'source-over'; c.filter = 'none'; c.clearRect(0, 0, W, H);
  fn(c);
  ctx.save(); ctx.globalAlpha = o.a === undefined ? 1 : o.a; if (o.mode) ctx.globalCompositeOperation = o.mode;
  if (blur > 0.4) {
    if (blur > 5) { HX.clearRect(0, 0, W / 2, H / 2); HX.filter = `blur(${(blur / 2).toFixed(1)}px)`; HX.drawImage(L, 0, 0, W / 2, H / 2); HX.filter = 'none'; ctx.drawImage(HALF, 0, 0, W, H); }
    else { ctx.filter = `blur(${blur.toFixed(1)}px)`; ctx.drawImage(L, 0, 0); ctx.filter = 'none'; }
  } else ctx.drawImage(L, 0, 0);
  ctx.restore();
}
// ışık yardımcıları
function rad(c, x, y, r, col, a = 1, mode = 'lighter', sy = 1) {
  if (r <= 0 || a <= 0) return; c.save(); c.globalCompositeOperation = mode; c.translate(x, y); c.scale(1, sy);
  const g = c.createRadialGradient(0, 0, 0, 0, 0, r); g.addColorStop(0, rgba(col, a)); g.addColorStop(.25, rgba(col, a * .45)); g.addColorStop(.6, rgba(col, a * .12)); g.addColorStop(1, rgba(col, 0));
  c.fillStyle = g; c.fillRect(-r, -r, r * 2, r * 2); c.restore();
}
function cone(c, x, y, ang, spread, len, col, a, mode = 'lighter') { // hacimsel ışık konisi
  c.save(); c.globalCompositeOperation = mode; c.translate(x, y); c.rotate(ang);
  const g = c.createLinearGradient(0, 0, len, 0); g.addColorStop(0, rgba(col, a)); g.addColorStop(1, rgba(col, 0));
  c.fillStyle = g; c.beginPath(); c.moveTo(0, -4); c.lineTo(len, -len * Math.tan(spread)); c.lineTo(len, len * Math.tan(spread)); c.lineTo(0, 4); c.closePath(); c.fill(); c.restore();
}
function lin(c, x0, y0, x1, y1, stops) { const g = c.createLinearGradient(x0, y0, x1, y1); for (const [p, col, a] of stops) g.addColorStop(p, rgba(col, a === undefined ? 1 : a)); return g; }
// şehir bokehi (bulanık uzak ışıklar)
function cityBokeh(c, t, seed, n, y0, y1, a = 1, drift = 0, cols) {
  const r = rng(seed); cols = cols || [[255, 190, 110], [255, 150, 80], [120, 180, 255], [255, 230, 190], [255, 90, 80]];
  c.save(); c.globalCompositeOperation = 'lighter';
  for (let i = 0; i < n; i++) {
    const x = ((r() * (W + 200) + t * drift * (0.5 + r())) % (W + 200) + W + 200) % (W + 200) - 100, y = y0 + Math.pow(r(), .8) * (y1 - y0), s = 6 + r() * 34, col = cols[(r() * cols.length) | 0];
    const tw = .65 + .35 * Math.sin(t * (0.5 + r()) + i), al = a * (.25 + r() * .6) * tw;
    const g = c.createRadialGradient(x, y, 0, x, y, s); g.addColorStop(0, rgba(col, al)); g.addColorStop(.7, rgba(col, al * .75)); g.addColorStop(1, rgba(col, 0));
    c.fillStyle = g; c.beginPath(); c.arc(x, y, s, 0, TAU); c.fill();
  }
  c.restore();
}
// düşen yağmur çizgileri
function rainFall(c, t, n, len, sp, slant, col, a, seed = 11, w = 1.2) {
  const r = rng(seed); c.save(); c.strokeStyle = rgba(col, a); c.lineWidth = w; c.lineCap = 'round'; c.beginPath();
  for (let i = 0; i < n; i++) { const x0 = r() * (W + 400) - 200, v = sp * (.7 + r() * .6), y = ((r() * H + t * v) % (H + len * 2)) - len, x = x0 + y * slant; c.moveTo(x, y); c.lineTo(x + slant * len, y + len); }
  c.stroke(); c.restore();
}
// ıslak zemin sıçramaları
function splashes(c, t, n, y0, y1, col, a, seed = 5) {
  const r = rng(seed); c.save(); c.strokeStyle = rgba(col, a); c.lineWidth = 1.2;
  for (let i = 0; i < n; i++) { const ph = (t * (1.5 + r()) + r()) % 1, x = r() * W, y = y0 + r() * (y1 - y0), s = (y - y0) / (y1 - y0) * 8 + 2; c.globalAlpha = (1 - ph); c.beginPath(); c.ellipse(x, y, s * ph * 2, s * ph * .5, 0, 0, TAU); c.stroke(); }
  c.restore();
}
// cam üzerindeki damlalar: arka planı kırarak gösterir (src = arkadaki görüntü tuvali)
const DROPS = (() => { const r = rng(77); return Array.from({ length: 140 }, () => ({ x: r() * W, y: r() * H, s: 2 + Math.pow(r(), 3) * 13, v: r() < .18 ? 40 + r() * 120 : 0, p: r() * 10 })); })();
function glassDrops(c, t, src, a = 1, k = 1) {
  c.save(); c.globalAlpha = a;
  for (let i = 0; i < DROPS.length * k; i++) {
    const d = DROPS[i | 0]; let y = d.y; if (d.v) y = ((d.y + t * d.v * (0.6 + .4 * Math.sin(t + d.p))) % (H + 60)) - 30;
    const x = d.x + (d.v ? Math.sin(y * .03 + d.p) * 3 : 0), s = d.s;
    if (d.v) { const g = c.createLinearGradient(x, y - s * 9, x, y); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(1, 'rgba(255,255,255,.10)'); c.fillStyle = g; c.fillRect(x - s * .35, y - s * 9, s * .7, s * 9); }
    c.save(); c.beginPath(); c.ellipse(x, y, s, s * 1.12, 0, 0, TAU); c.clip();
    if (src) { c.translate(x, y); c.scale(-1, -1); c.drawImage(src, x - s * 5, y - s * 5, s * 10, s * 10, -s * 1.1, -s * 1.2, s * 2.2, s * 2.4); c.setTransform(1, 0, 0, 1, 0, 0); }
    const g = c.createRadialGradient(x - s * .3, y - s * .35, s * .05, x, y, s * 1.12); g.addColorStop(0, 'rgba(255,255,255,.55)'); g.addColorStop(.25, 'rgba(255,255,255,.05)'); g.addColorStop(.8, 'rgba(0,0,0,.0)'); g.addColorStop(1, 'rgba(0,0,0,.45)');
    c.fillStyle = g; c.fillRect(x - s * 1.2, y - s * 1.2, s * 2.4, s * 2.4); c.restore();
  }
  c.restore();
}
// buğulu cam
function fog(c, a, col = [190, 200, 210]) { c.save(); c.fillStyle = rgba(col, a); c.fillRect(0, 0, W, H); c.restore(); }
// gren
const GR = [0, 1, 2, 3, 4, 5].map(k => { const g = mk(640, 360), x = g.getContext('2d'), id = x.createImageData(640, 360), r = rng(900 + k); for (let i = 0; i < id.data.length; i += 4) { const v = 128 + (r() + r() + r() - 1.5) * 120; id.data[i] = id.data[i + 1] = id.data[i + 2] = v; id.data[i + 3] = 255; } x.putImageData(id, 0, 0); return g; });
function finish(f, o = {}) {
  // bloom
  BX.clearRect(0, 0, 320, 180); BX.filter = 'blur(6px) brightness(1.1)'; BX.drawImage(cv, 0, 0, 320, 180); BX.filter = 'none';
  ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.globalAlpha = o.bloom === undefined ? .42 : o.bloom; ctx.drawImage(BLM, 0, 0, W, H); ctx.restore();
  // renk dokusu: gölgeler soğuk, ışıklar sıcak
  ctx.save(); ctx.globalCompositeOperation = 'soft-light'; ctx.fillStyle = lin(ctx, 0, 0, 0, H, [[0, o.top || [40, 70, 110], .35], [1, o.bot || [255, 150, 90], .18]]); ctx.fillRect(0, 0, W, H); ctx.restore();
  // vinyet
  const g = ctx.createRadialGradient(W / 2, H / 2, H * .3, W / 2, H / 2, H * .95); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, `rgba(0,0,0,${o.vig === undefined ? .6 : o.vig})`); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  // gren
  ctx.save(); ctx.globalCompositeOperation = 'overlay'; ctx.globalAlpha = .13; ctx.drawImage(GR[f % 6], ((f * 37) % 40) - 40, ((f * 53) % 40) - 40, W + 80, H + 80); ctx.restore();
}
function letterbox(h = 76) { ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, h); ctx.fillRect(0, H - h, W, h); }
