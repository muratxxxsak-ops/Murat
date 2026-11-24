'use strict';
// =============== BÖLÜM 8: Yeni Bir Nefes (191 - 217.6) ===============
function istanbulSkyline(c, baseY, col, scroll, o = {}) {
  const sx = scroll || 0, tot = cityArr(81, 60, 10, 60).total;
  skyline(c, -(((sx * 0.5) % tot) + tot) % tot, baseY, W + tot, 81, 12, 64, mix(col, [255, 160, 130], 0.12), { hill: x => 0.5 + 0.5 * Math.exp(-Math.pow((x - 420) / 520, 2)) });
  c.fillStyle = rgba(col); c.beginPath(); c.moveTo(-100, baseY + 4); c.quadraticCurveTo(300, baseY - 60, 900, baseY + 4); c.fill();
  const lm = (x, fn) => fn(((x - sx + 3000) % 2400) - 400);
  lm(250, x => mosque(c, x, baseY - 14, 1.35, col)); lm(600, x => galata(c, x, baseY - 30, 1.1, col)); lm(80, x => mosque(c, x, baseY - 6, 0.85, col)); lm(900, x => mosque(c, x, baseY - 2, 0.7, col));
  skyline(c, 880, baseY + 2, W, 91, 6, 30, mix(col, [255, 170, 130], 0.2));
}
function sceneDeck(c, t) {
  const lt = t - 191, pal = palMix(PAL.dawn, PAL.gold, sm(lt / 9));
  const sunX = 640, sunY = lerp(472, 392, sm(lt / 9));
  c.save(); cam(c, 640, 380, 1 + lt * 0.008, Math.sin(t * 0.8) * 0.006);
  skyFill(c, pal, 440);
  glow(c, sunX, sunY, 760, pal.glow, 0.7 + 0.2 * BS);
  clouds(c, t, 230, mix(pal.low, pal.glow, 0.4), 0.32, 121, 6, 6, 1.3); clouds(c, t, 320, mix(pal.mid, pal.low, 0.5), 0.3, 122, 9, 5, 1.1);
  c.save(); c.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 16; i++) { const a = -Math.PI + (i + 0.5) / 16 * Math.PI + Math.sin(t * 0.3 + i) * 0.02; c.fillStyle = rgba(pal.glow, 0.08 * (0.7 + BS * 0.8)); c.beginPath(); c.moveTo(sunX, sunY); c.lineTo(sunX + Math.cos(a - 0.04) * 1100, sunY + Math.sin(a - 0.04) * 1100); c.lineTo(sunX + Math.cos(a + 0.04) * 1100, sunY + Math.sin(a + 0.04) * 1100); c.fill(); }
  c.restore();
  c.fillStyle = rgba(mix(pal.glow, [255, 255, 255], 0.5)); c.beginPath(); c.arc(sunX, sunY, 46 * (1 + 0.03 * KK), 0, TAU); c.fill();
  istanbulSkyline(c, 438, [58, 34, 70], t * 4);
  sea(c, 432, mix(pal.low, [0, 0, 0], 0.15), pal.sea, t, { wc: [255, 240, 210], wa: 1.5, refl: [sunX, pal.glow, 20, 0.85] });
  for (let i = 0; i < 7; i++) { const a = i * 0.9 + t * 0.4; gull(c, 300 + ((i * 190 + t * 50) % 900), 200 + Math.sin(a) * 40 + i * 14, 1.2, t * 7 + i * 2, 'rgba(60,34,50,0.85)'); }
  c.fillStyle = '#0d0912'; c.fillRect(-300, 590, W + 600, 200);
  c.strokeStyle = '#0d0912'; c.lineWidth = 8; c.beginPath(); c.moveTo(-300, 580); c.lineTo(W + 300, 580); c.stroke(); c.lineWidth = 5; c.beginPath(); c.moveTo(-300, 626); c.lineTo(W + 300, 626); c.stroke();
  for (let x = 20; x < W + 300; x += 130) c.fillRect(x, 580, 7, 70);
  const rim = [255, 232, 176], col = [38, 20, 36];
  person(c, { x: 436, y: 668, s: 1.75, dir: 1, pose: 'stand', t, col, rim, kind: 'girl', wind: 0.8, head: 1 });
  person(c, { x: 492, y: 668, s: 1.75, dir: 1, pose: 'stand', t: t + 1, col, rim, kind: 'boy', wind: 0.7 });
  c.restore();
  for (let i = 0; i < 5; i++) { const p = (i + 1) / 6; c.fillStyle = `rgba(255,236,190,${0.05 + 0.05 * KK})`; c.beginPath(); c.arc(lerp(W / 2 + (sunX - W / 2) * 0.1, W * 1.1, p * 0.9), lerp(sunY, H * 1.1, p * 0.9), 20 + i * 14, 0, TAU); c.fill(); }
  vignette(c, 0.3);
}
function sceneSail(c, t) {
  const lt = t - 200, pal = PAL.gold, sunX = 900, sunY = 300, hy = 440;
  c.save(); cam(c, 640, 380, 1.22 - 0.22 * sm(lt / 10), 0);
  skyFill(c, pal, hy + 2);
  glow(c, sunX, sunY, 720, pal.glow, 0.7 + 0.2 * BS);
  clouds(c, t, 200, mix(pal.low, pal.glow, 0.4), 0.3, 131, 7, 6, 1.3); clouds(c, t, 300, mix(pal.mid, pal.low, 0.5), 0.26, 132, 10, 5, 1.1);
  glow(c, 260, 150, 120, [220, 230, 255], 0.15); c.fillStyle = 'rgba(235,240,255,0.4)'; c.beginPath(); c.arc(260, 150, 24, 0, TAU); c.fill();
  c.fillStyle = rgba(mix(pal.glow, [255, 255, 255], 0.5)); c.beginPath(); c.arc(sunX, sunY, 42 * (1 + 0.04 * KK), 0, TAU); c.fill();
  istanbulSkyline(c, hy, [66, 40, 76], lt * 60);
  sea(c, hy - 6, mix(pal.low, [0, 0, 0], 0.15), pal.sea, t, { wc: [255, 240, 210], wa: 1.5, refl: [sunX, pal.glow, 22, 0.85] });
  const fx = 560, fy = 540, fs = 1.2; ferry(c, fx, fy, fs, 1, { lit: 0.35, dim: 0.98, t, wake: true });
  const dx = fx + 90 * fs, dy = fy - 90 * fs;
  person(c, { x: dx, y: dy + 4, s: 0.12, dir: 1, pose: 'stand', t, col: [40, 22, 40], kind: 'girl', wind: 0.6 }); person(c, { x: dx + 7, y: dy + 4, s: 0.125, dir: 1, pose: 'stand', t, col: [40, 22, 40], kind: 'boy', wind: 0.6 });
  for (let i = 0; i < 9; i++) { const a = i * 0.8 + t * 0.5; gull(c, ((i * 170 + t * 90) % 1500) - 100, 130 + Math.sin(a) * 40 + i * 12, 1.3, t * 7 + i * 2, 'rgba(60,34,50,0.85)'); }
  const rp = rng(140);
  for (let i = 0; i < 70; i++) { const px = rp() * W * 1.2 - 100, sp = 10 + rp() * 22, py = ((rp() * 800 - t * sp) % 800 + 800) % 800 - 40; glow(c, px + Math.sin(t + i) * 10, py, 7 + rp() * 6, [255, 224, 160], 0.55 * rp(), 'lighter'); }
  c.restore();
  const fl = seg(lt, 9.1, 10); if (fl > 0) tint(c, [255, 244, 220], fl);
  vignette(c, 0.25);
}
function sceneOutro(c, t) {
  const lt = t - 210, pal = palMix(PAL.gold, PAL.dawn, sm(lt / 7)), sunX = 700, sunY = 396;
  c.save();
  skyFill(c, pal, 440); glow(c, sunX, sunY, 700, pal.glow, 0.65);
  clouds(c, t, 230, mix(pal.low, pal.glow, 0.4), 0.3, 141, 4, 6, 1.3);
  c.fillStyle = rgba(mix(pal.glow, [255, 255, 255], 0.5)); c.beginPath(); c.arc(sunX, sunY, 40, 0, TAU); c.fill();
  istanbulSkyline(c, 438, [66, 40, 76], 0);
  sea(c, 432, mix(pal.low, [0, 0, 0], 0.15), pal.sea, t, { wc: [255, 240, 210], wa: 1.3, refl: [sunX, pal.glow, 18, 0.8] });
  ferry(c, 760 + lt * 38, 452 - lt * 1.2, 0.36, 1, { lit: 0.3, dim: 0.98, t, wake: true });
  for (let i = 0; i < 5; i++) { const a = i * 0.9 + t * 0.4; gull(c, 200 + ((i * 230 + t * 30) % 900), 190 + Math.sin(a) * 30 + i * 18, 1.1, t * 6 + i * 2, 'rgba(60,34,50,0.85)'); }
  c.restore();
  const a1 = sm(seg(lt, 1.2, 2.2)) * (1 - sm(seg(lt, 3.4, 4.0))), a2 = sm(seg(lt, 2.6, 3.4)) * (1 - sm(seg(lt, 4.2, 4.7)));
  txt(c, 'Kal dedin…', 640, 170, 54, { font: FONT, style: 'italic', col: '#fff4de', align: 'center', a: a1, shadow: 'rgba(120,60,40,0.7)', sb: 18, sp: 2 });
  txt(c, 'Kaldın.', 640, 238, 54, { font: FONT, style: 'italic', col: '#fff4de', align: 'center', a: a2, shadow: 'rgba(120,60,40,0.7)', sb: 18, sp: 2 });
  vignette(c, 0.35);
  const bl = sm(seg(lt, 4.6, 5.4)); if (bl > 0) { c.fillStyle = `rgba(0,0,0,${bl})`; c.fillRect(0, 0, W, H); }
  const ea = sm(seg(lt, 5.3, 5.9));
  txt(c, 'SON VAPUR', 640, 400, 60, { font: FONT, col: '#f6e6c8', align: 'center', sp: 14, a: ea });
  txt(c, 'bölüm sonu', 640, 436, 15, { font: SANS, col: '#c9b48c', align: 'center', sp: 8, a: ea * 0.85 });
}
