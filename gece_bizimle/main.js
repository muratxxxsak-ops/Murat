'use strict';
const cv = document.getElementById('cv'); const ctx = cv.getContext('2d');
const OFF = document.createElement('canvas'); OFF.width = W; OFF.height = H;
const GR = (() => { const g = document.createElement('canvas'); g.width = 256; g.height = 256; const x = g.getContext('2d'), d = x.createImageData(256, 256), r = rng(5); for (let i = 0; i < d.data.length; i += 4) { const v = r() * 255; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 30; } x.putImageData(d, 0, 0); return g; })();
const SCENES = [
  { s: 0, e: 20, xf: 0, fn: sceneStudio },
  { s: 20, e: 44, xf: 0.3, fn: sceneStreet },
  { s: 44, e: 60.5, xf: 0.25, fn: sceneHook1 },
  { s: 60.5, e: 70.5, xf: 0.15, fn: sceneDecks },
  { s: 70.5, e: 81.5, xf: 0.15, fn: sceneCrowd },
  { s: 81.5, e: 89.7, xf: 0.9, fn: sceneReady },
  { s: 89.7, e: 112.5, xf: 0.1, fn: sceneDrop },
  { s: 112.5, e: 128.3, xf: 0.2, fn: sceneSky },
  { s: 128.3, e: 140, xf: 0.5, fn: sceneFinale },
];
const CHAPTERS = [[12.5, 17.5, 1, 'Yeni Sürüm'], [20.6, 25.6, 2, 'Sahne Hazır'], [44.6, 49.6, 3, 'Gece Bizimle'], [82.6, 86.6, 4, 'Sessizlik'], [90.3, 95.3, 5, 'Düzen Değişir'], [113, 118, 6, 'Yukarı El']];
function drawScene(c, sc, t) { c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1; c.globalCompositeOperation = 'source-over'; sc.fn(c, t); c.restore(); }
const BRAND = 'murat250sr';
function brandBadge(c, t) {
  const lt = t - 2; if (lt < 0 || t > 138.3) return;
  const a = eo(seg(lt, 0, 0.8)) * (1 - sm(seg(t, 137.8, 138.3)));
  c.save(); c.font = `700 30px ${SANS}`; c.letterSpacing = '4px';
  const tw = c.measureText(BRAND).width, w = tw + 86, h = 54, x = W - 60 - w + (1 - eo(seg(lt, 0, 0.8))) * 80, y = 76;
  c.globalAlpha = a; c.shadowColor = 'rgba(0,0,0,0.5)'; c.shadowBlur = 18; c.fillStyle = 'rgba(12,9,20,0.66)'; rrect(c, x, y, w, h, 27); c.fill(); c.shadowColor = 'transparent'; c.shadowBlur = 0;
  c.strokeStyle = 'rgba(240,200,130,0.75)'; c.lineWidth = 1.5; rrect(c, x, y, w, h, 27); c.stroke();
  const pr = 0.5 + 0.5 * Math.sin(t * 4) + KK * 0.5; c.fillStyle = 'rgba(255,196,110,1)'; c.beginPath(); c.arc(x + 30, y + h / 2, 6 + pr * 2, 0, TAU); c.fill(); glow(c, x + 30, y + h / 2, 22, [255, 190, 100], 0.5 * (0.5 + pr * 0.5), 'lighter');
  const sw = ((lt * 0.45) % 1.6 - 0.3) * tw, g = c.createLinearGradient(x + 48, 0, x + 48 + tw, 0);
  g.addColorStop(0, '#ffe2a8'); g.addColorStop(clamp(sw / tw - 0.12), '#ffd08a'); g.addColorStop(clamp(sw / tw), '#ffffff'); g.addColorStop(clamp(sw / tw + 0.12), '#ffd08a'); g.addColorStop(1, '#ffe2a8');
  c.fillStyle = g; c.textBaseline = 'middle'; c.textAlign = 'left'; c.fillText(BRAND, x + 48, y + h / 2 + 1); c.restore();
}
function brandEnd(c, t) {
  const lt = t - 138.7; if (lt < 0) return;
  c.save(); c.font = `700 66px ${SANS}`; c.letterSpacing = '6px'; const tw = c.measureText(BRAND).width; let x = W / 2 - tw / 2;
  for (let i = 0; i < BRAND.length; i++) { const ch = BRAND[i], a = eo(seg(lt, i * 0.06, i * 0.06 + 0.35)), cw = c.measureText(ch).width; c.globalAlpha = a; c.shadowColor = 'rgba(255,170,80,0.9)'; c.shadowBlur = 24 * a; c.fillStyle = '#ffe6b8'; c.fillText(ch, x, 508 + (1 - a) * -26); x += cw; }
  c.globalAlpha = sm(seg(lt, 0.8, 1.1)); c.shadowBlur = 0; c.fillStyle = 'rgba(240,200,130,0.9)'; c.fillRect(W / 2 - tw / 2, 528, tw * sm(seg(lt, 0.6, 1.1)), 2); c.restore();
}
function renderFrame(f) {
  const t = f / 24; setAudio(t);
  const c = ctx; c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1; c.globalCompositeOperation = 'source-over'; c.shadowColor = 'transparent';
  c.fillStyle = '#000'; c.fillRect(0, 0, W, H);
  SCENES.forEach((sc, i) => {
    const nx = SCENES[i + 1] ? SCENES[i + 1].xf : 0, x = sc.xf || 0;
    if (t < sc.s - x / 2 || t > sc.e + nx / 2) return;
    const a = x > 0 ? sm(seg(t, sc.s - x / 2, sc.s + x / 2)) : (t >= sc.s ? 1 : 0); if (a <= 0) return;
    if (a >= 0.999) drawScene(c, sc, t); else { const oc = OFF.getContext('2d'); oc.setTransform(1, 0, 0, 1, 0, 0); oc.clearRect(0, 0, W, H); drawScene(oc, sc, t); c.globalAlpha = a; c.drawImage(OFF, 0, 0); c.globalAlpha = 1; }
  });
  c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1;
  for (const [s, e, n, title] of CHAPTERS) {
    const a = sm(seg(t, s, s + 0.6)) * (1 - sm(seg(t, e - 0.6, e))); if (a <= 0) continue; const dx = -26 * (1 - eo(seg(t, s, s + 0.8)));
    c.save(); c.translate(dx, 0); c.globalAlpha = a; c.fillStyle = 'rgba(255,90,190,0.95)'; c.fillRect(70, H - 160, 38, 3);
    txt(c, 'BÖLÜM ' + n, 70, H - 132, 13, { font: SANS, weight: 700, col: '#ff7ac8', sp: 5 }); txt(c, title, 70, H - 92, 40, { font: SANS, weight: 800, col: '#fff', shadow: 'rgba(0,0,0,0.6)', sb: 14 }); c.restore();
  }
  const ta = sm(seg(t, 5.0, 6.2)) * (1 - sm(seg(t, 13.0, 14.0)));
  if (ta > 0) { neonTxt(c, 'GECE BİZİMLE', 640, 180, 84, [255, 60, 170], ta, Math.sin(t * 19) > 0.95 ? 0.6 : 1); txt(c, 'KISA DİZİ  ·  REMİX', 640, 222, 15, { font: SANS, weight: 700, col: '#9be8ff', align: 'center', sp: 9, a: ta * 0.9 }); }
  brandBadge(c, t); brandEnd(c, t);
  c.save(); c.globalAlpha = 0.5; c.translate(-((f * 37) % 256), -((f * 91) % 256)); c.fillStyle = c.createPattern(GR, 'repeat'); c.fillRect(0, 0, W + 256, H + 256); c.restore();
  c.fillStyle = '#000'; c.fillRect(0, 0, W, 52); c.fillRect(0, H - 52, W, 52);
  const fi = 1 - sm(t / 1.0); if (fi > 0) { c.fillStyle = `rgba(0,0,0,${fi})`; c.fillRect(0, 0, W, H); }
}
window.renderFrame = renderFrame;
