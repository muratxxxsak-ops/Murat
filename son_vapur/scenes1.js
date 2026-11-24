'use strict';
// =============== BÖLÜM 1: Boş Yer (0 - 52) ===============
function scenePier(c, t, mode) {
  const dawn = mode === 'dawn', lt = dawn ? t - 186 : t;
  const k = dawn ? 0 : sm(seg(t, 14, 30));
  const pal = dawn ? PAL.gold : palMix(PAL.dusk, PAL.cold, k);
  c.save();
  let z, cx, cy;
  if (dawn) { z = 1.62 + lt * 0.012; cx = 490; cy = 505; }
  else { const a = sm(seg(t, 5, 14)); z = lerp(1, 1.62, a) + Math.max(0, t - 14) * 0.004; cx = lerp(640, 490, a); cy = lerp(360, 505, a); }
  cam(c, cx, cy, z, 0);
  skyFill(c, pal, 440);
  const sunX = 820, sunY = dawn ? 392 : 415 + sm(seg(t, 0, 31)) * 66, sa = dawn ? 1 : 1 - 0.75 * k;
  glow(c, sunX, sunY, 600, pal.glow, 0.55 * sa);
  clouds(c, t, 250, mix(pal.low, pal.glow, 0.3), 0.3 * sa, 21, 5, 6, 1.2);
  clouds(c, t, 330, mix(pal.mid, pal.low, 0.5), 0.26, 22, 8, 5, 1.0);
  c.fillStyle = rgba(pal.glow, 0.95 * sa); c.beginPath(); c.arc(sunX, sunY, 36, 0, TAU); c.fill();
  const far = mix(pal.mid, [10, 8, 30], 0.55), near = mix(pal.mid, [6, 4, 20], 0.8);
  skyline(c, -80, 436, 800, 11, 14, 70, far, { hill: x => 0.35 + 0.65 * Math.exp(-Math.pow((x - 330) / 330, 2)) });
  c.fillStyle = rgba(near); c.beginPath(); c.moveTo(60, 438); c.quadraticCurveTo(330, 378, 720, 438); c.fill();
  galata(c, 290, 410, 0.78, near); mosque(c, 480, 418, 0.8, near); mosque(c, 120, 424, 0.55, near);
  skyline(c, 760, 436, 700, 13, 6, 26, mix(far, pal.low, 0.3));
  sea(c, 432, mix(pal.low, [0, 0, 0], 0.3), pal.sea, t, { refl: [sunX, pal.glow, 14, 0.5 * sa] });
  const fp = dawn ? 0 : ei(seg(t, 14, 31));
  const fx = dawn ? 760 : 620 + fp * 1000, fs = dawn ? 0.5 : lerp(0.72, 0.45, fp), fy = dawn ? 452 : lerp(468, 446, fp);
  ferry(c, fx, fy, fs, 1, { lit: dawn ? 0.4 : lerp(0.55, 0.9, k), dim: dawn ? 0.95 : lerp(0.95, 0.55, k), t, wake: !dawn && t > 14.3 });
  if (!dawn) { // vapur düdüğü halkaları
    const hr = t - 14;
    if (hr > 0 && hr < 2.4) for (let i = 0; i < 2; i++) { const rr = (hr - i * 0.35); if (rr > 0) { c.strokeStyle = `rgba(255,240,220,${0.5 * (1 - rr / 2.4)})`; c.lineWidth = 2; c.beginPath(); c.arc(fx - 67 * fs, fy - 134 * fs, rr * 240, 0, TAU); c.stroke(); } }
  }
  const gc = dawn ? 4 : 7;
  for (let i = 0; i < gc; i++) {
    const a = i * 0.9 + t * (0.35 + i * 0.02); let gx = 640 + Math.cos(a) * (260 + i * 22), gy = 250 + Math.sin(a * 1.3) * 50 - (i % 3) * 18;
    if (!dawn && t > 14) { const e = t - 14; gx += (i % 2 ? 1 : -1) * e * e * 30; gy -= e * e * 14; }
    gull(c, gx, gy, 1.1, t * 7 + i * 2);
  }
  const deckCol = dawn ? [40, 26, 34] : mix([22, 13, 30], [15, 19, 29], k);
  pierDeck(c, 560, deckCol, mix(pal.glow, deckCol, 0.5), t);
  c.fillStyle = rgba(deckCol);
  for (let x = -100; x < 1500; x += 110) c.fillRect(x, 528, 5, 34);
  c.strokeStyle = rgba(deckCol); c.lineWidth = 2.4; c.beginPath(); for (let x = -100; x <= 1500; x += 110) { x === -100 ? c.moveTo(x, 536) : c.quadraticCurveTo(x - 55, 546, x, 536); } c.stroke();
  bench(c, 330, 612, 0.95, mul(deckCol, 0.85));
  const pc = dawn ? [28, 16, 26] : mix([16, 10, 24], [14, 16, 26], k), rim = dawn ? [255, 224, 160] : mix(pal.glow, [120, 130, 150], k * 0.7);
  const steam = dawn ? 1 : (t < 14 ? 1 : 1 - sm(seg(t, 14, 24)));
  sitFront(c, { x: dawn ? 306 : 301, y: 612, s: 0.95, col: pc, rim, kind: 'girl', t, lean: dawn ? 0.5 : 0 });
  teaGlass(c, (dawn ? 306 : 301) + 36 * 0.95, 612 - 83 * 0.95, 0.95, 0.15 + 0.85 * steam, t, steam);
  if (dawn) { sitFront(c, { x: 352, y: 612, s: 0.95, col: pc, rim, kind: 'boy', t, lean: -0.4 }); teaGlass(c, 352 + 36 * 0.95, 612 - 83 * 0.95, 0.95, 0.9, t + 2, 0.9); }
  else glow(c, 365, 566, 40, mix(pal.glow, [120, 130, 150], k), 0.12 * (1 - k * 0.7), 'lighter');
  c.restore();
  vignette(c, 0.45);
}
function sceneTicket(c, t) {
  const lt = t - 31;
  c.save(); cam(c, 640, 380, 1.02 + lt * 0.011, Math.sin(lt * 0.3) * 0.01);
  c.fillStyle = '#2a1a16'; c.fillRect(-200, -200, W + 400, H + 400);
  for (let i = 0; i < 11; i++) {
    const y = -80 + i * 80, g = c.createLinearGradient(0, y, 0, y + 76); g.addColorStop(0, rgba([70, 46, 38])); g.addColorStop(1, rgba([50, 32, 28]));
    c.fillStyle = g; c.fillRect(-200, y, W + 400, 76);
    const r = rng(i + 40); c.strokeStyle = 'rgba(20,10,8,0.35)'; c.lineWidth = 1;
    for (let j = 0; j < 10; j++) { const yy = y + 8 + r() * 60, xx = r() * W; c.beginPath(); c.moveTo(xx - 300, yy); c.bezierCurveTo(xx - 100, yy + 4, xx + 100, yy - 4, xx + 300, yy + 2); c.stroke(); }
    c.fillStyle = 'rgba(0,0,0,0.55)'; c.fillRect(-200, y + 76, W + 400, 4);
  }
  glow(c, 300, 120, 700, [140, 160, 210], 0.22);
  // kuru yaprak
  c.save(); c.translate(260 + Math.sin(lt * 0.6) * 4, 560); c.rotate(0.5); c.fillStyle = 'rgba(120,70,30,0.85)';
  c.beginPath(); c.moveTo(-40, 0); c.quadraticCurveTo(0, -30, 44, 0); c.quadraticCurveTo(0, 26, -40, 0); c.fill();
  c.strokeStyle = 'rgba(60,30,10,0.8)'; c.beginPath(); c.moveTo(-40, 0); c.lineTo(44, 0); c.stroke(); c.restore();
  // soğumuş çay (kuşbakışı)
  c.save(); c.translate(1010, 250);
  c.fillStyle = 'rgba(0,0,0,0.35)'; c.beginPath(); c.ellipse(10, 14, 84, 80, 0, 0, TAU); c.fill();
  c.fillStyle = 'rgba(210,200,190,0.9)'; c.beginPath(); c.arc(0, 0, 78, 0, TAU); c.fill();
  c.fillStyle = 'rgba(160,150,140,0.9)'; c.beginPath(); c.arc(0, 0, 60, 0, TAU); c.fill();
  c.fillStyle = 'rgba(120,50,18,0.95)'; c.beginPath(); c.arc(0, 0, 40, 0, TAU); c.fill();
  c.fillStyle = 'rgba(190,100,40,0.8)'; c.beginPath(); c.arc(-6, -6, 28, 0, TAU); c.fill();
  c.strokeStyle = 'rgba(255,255,255,0.55)'; c.lineWidth = 3; c.beginPath(); c.arc(0, 0, 36, 3.6, 4.6); c.stroke();
  c.strokeStyle = 'rgba(190,190,200,0.9)'; c.lineWidth = 5; c.lineCap = 'round'; c.beginPath(); c.moveTo(30, 30); c.lineTo(130, 70); c.stroke();
  c.restore();
  // bilet
  const flut = Math.sin(lt * 1.6) * 0.012 + BS * 0.01;
  c.save(); c.translate(640, 390); c.rotate(-0.12 + flut);
  c.shadowColor = 'rgba(0,0,0,0.65)'; c.shadowBlur = 36; c.shadowOffsetY = 18; c.fillStyle = '#e9dec3'; rrect(c, -210, -100, 420, 200, 8); c.fill();
  c.shadowColor = 'transparent'; c.shadowBlur = 0; c.shadowOffsetY = 0;
  const pg = c.createLinearGradient(-210, -100, 210, 100); pg.addColorStop(0, 'rgba(255,255,255,0.25)'); pg.addColorStop(1, 'rgba(120,90,50,0.18)'); c.fillStyle = pg; rrect(c, -210, -100, 420, 200, 8); c.fill();
  c.strokeStyle = 'rgba(60,40,30,0.6)'; c.setLineDash([7, 7]); c.lineWidth = 2; c.beginPath(); c.moveTo(100, -100); c.lineTo(100, 100); c.stroke(); c.setLineDash([]);
  txt(c, 'VAPUR BİLETİ', -190, -62, 16, { font: SANS, col: '#5a3e2a', sp: 5, weight: 600 });
  txt(c, 'İKİ KİŞİLİK', -190, -8, 42, { font: FONT, col: '#3a2418', weight: 'bold' });
  txt(c, 'KARAKÖY → KADIKÖY', -190, 30, 17, { font: "'DejaVu Sans Mono',monospace", col: '#5a3e2a', sp: 2 });
  txt(c, '— — / — — / — — — —', -190, 80, 15, { font: "'DejaVu Sans Mono',monospace", col: 'rgba(90,60,40,0.55)', sp: 2 });
  txt(c, '2', 155, 26, 70, { font: FONT, col: 'rgba(60,36,24,0.85)', align: 'center', weight: 'bold' });
  const sp = eo(seg(lt, 4.2, 4.7));
  if (sp > 0) {
    c.save(); c.translate(-30 + (1 - sp) * 6, 62); c.rotate(-0.2); const sc2 = lerp(1.7, 0.82, sp); c.scale(sc2, sc2); c.globalAlpha = sp * 0.92;
    c.strokeStyle = '#b0222a'; c.lineWidth = 5; rrect(c, -150, -34, 300, 68, 6); c.stroke();
    txt(c, 'GEÇERSİZ', 0, 16, 46, { font: SANS, col: '#b0222a', align: 'center', weight: 800, sp: 6 }); c.restore();
  }
  c.restore(); c.restore();
  bokeh(c, t, 9, 16, [[255, 190, 120], [120, 180, 255], [255, 130, 160]], 30, 90, 20, 330, 0.28, 5);
  vignette(c, 0.62);
}
function sceneStreet(c, t) {
  const lt = t - 42; let sc = 0;
  for (let u = 42; u < t; u += 0.05) sc += (1 - sm(seg(u, 46.8, 47.4)) + sm(seg(u, 49.8, 50.6))) * 0.05;
  c.save();
  c.fillStyle = vgrad(c, 0, 520, [[0, [12, 14, 40]], [0.6, [64, 38, 88]], [1, [190, 90, 88]]]); c.fillRect(-100, -100, W + 200, 640);
  glow(c, 640, 470, 500, [255, 150, 110], 0.35);
  const lay = (scr, seed, h1, h2, col, lp, wcol) => { const tot = cityArr(seed, 60, h1, h2).total; skyline(c, -(((scr % tot) + tot) % tot), 548, W + tot, seed, h1, h2, col, { lights: { p: lp, col: wcol, a: 0.85 }, t }); };
  lay(sc * 35, 31, 90, 210, [34, 28, 70], 0.2, [255, 190, 120]);
  lay(sc * 90, 32, 150, 320, [20, 17, 46], 0.4, [255, 205, 130]);
  c.fillStyle = vgrad(c, 548, H, [[0, [30, 22, 48]], [1, [10, 8, 22]]]); c.fillRect(-100, 548, W + 200, H);
  const near = sc * 230;
  for (let i = 0; i < 5; i++) {
    const x = ((((i * 420 - near) % 1680) + 1680) % 1680) - 200;
    c.fillStyle = '#0c0916'; c.fillRect(x - 2, 330, 4, 222); glow(c, x, 326, 170, [255, 190, 110], 0.6, 'lighter'); glow(c, x, 326, 28, [255, 240, 200], 0.9, 'lighter');
    c.save(); c.translate(x, 640); c.scale(1, 0.18); glow(c, 0, 0, 220, [255, 170, 100], 0.4, 'lighter'); c.restore();
    c.fillStyle = 'rgba(255,170,100,0.12)'; c.fillRect(x - 3, 560, 6, 160);
  }
  const rimC = [255, 170, 110];
  for (let i = 0; i < 6; i++) {
    const x = ((((i * 290 + 900 - (t - 42) * 65 - sc * 150) % 1700) + 1700) % 1700) - 200;
    if (Math.abs(x - 560) < 120) continue;
    person(c, { x, y: 600 + (i % 3) * 8, s: 0.86 + (i % 3) * 0.1, dir: -1, ph: t * 6 + i * 2, t, col: [10, 8, 18], rim: rimC, kind: i % 2 ? 'boy' : 'girl', wind: 0.1 });
  }
  const sx = 1100 - (t - 46.3) * 240;
  if (sx > -200 && sx < 1400) {
    person(c, { x: sx, y: 640, s: 1.25, dir: -1, ph: t * 7, t, col: [10, 8, 18], rim: [255, 190, 140], kind: 'girl', wind: 0.25 });
    glow(c, sx - 8, 640 - 205, 46 + Math.sin(t * 14) * 8, [255, 220, 150], 0.45 * (0.5 + 0.5 * Math.sin(t * 9)), 'lighter');
  }
  const walking = t < 47.1 || t > 50.0, dirG = (t > 48.6 && t < 49.9) ? -1 : 1;
  person(c, { x: 560, y: 642, s: 1.25, dir: dirG, ph: t * 7.2, t, col: [8, 6, 14], rim: [255, 180, 120], kind: 'girl', pose: walking ? 'walk' : 'stand', wind: 0.2 });
  // sokaklar adını bağırır: ses halkaları
  if (lt > 6) for (const [wx, wy] of [[300, 260], [980, 230], [640, 170]]) { const rr = (1 - KK) * 150 + 20; c.strokeStyle = `rgba(255,220,170,${KK * 0.32})`; c.lineWidth = 2; c.beginPath(); c.arc(wx, wy, rr, 0, TAU); c.stroke(); }
  const e = 40 + sm(lt / 9) * 190;
  for (const sd of [-1, 1]) {
    c.save(); if (sd > 0) { c.translate(W, 0); c.scale(-1, 1); }
    c.fillStyle = 'rgba(6,4,14,0.97)'; c.beginPath(); c.moveTo(-20, 0); c.lineTo(e, 40); c.lineTo(e + 14, H); c.lineTo(-20, H); c.fill();
    const r = rng(77 + sd); for (let i = 0; i < 9; i++) { c.fillStyle = `rgba(255,200,120,${0.25 + 0.3 * r()})`; c.fillRect(e * 0.2 + r() * e * 0.6, 80 + i * 60, 14, 20); }
    c.restore();
  }
  c.restore();
  vignette(c, 0.4 + 0.35 * sm(lt / 10));
}
