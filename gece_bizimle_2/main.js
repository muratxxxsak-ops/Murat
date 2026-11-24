'use strict';
const cv = document.getElementById('cv'); const ctx = cv.getContext('2d');
const OFF = document.createElement('canvas'); OFF.width = W; OFF.height = H;
const SCENES = [
  { s: 0, e: 20, xf: 0, fn: sceneSilent },
  { s: 20, e: 44, xf: 0.4, fn: sceneMarch },
  { s: 44, e: 51.5, xf: 0.2, fn: sceneTowerBase },
  { s: 51.5, e: 60.5, xf: 0.5, fn: sceneWave },
  { s: 60.5, e: 70.5, xf: 0.15, fn: sceneWall },
  { s: 70.5, e: 81.5, xf: 0.15, fn: sceneSurf },
  { s: 81.5, e: 89.7, xf: 0.9, fn: sceneReady },
  { s: 89.7, e: 112.5, xf: 0.1, fn: sceneDrop },
  { s: 112.5, e: 128.3, xf: 0.2, fn: sceneRise },
  { s: 128.3, e: 140, xf: 0.5, fn: sceneSelfie },
];
const CHAPTERS = [[12.5, 17.5, 1, 'Sessiz Şehir'], [20.6, 25.6, 2, 'Adımlar Hızlı'], [44.5, 49.5, 3, 'Fiş Takılıyor'], [60.8, 65.3, 4, 'Duvarlar Çatlıyor'], [70.8, 75.8, 5, 'Kalabalık'], [82, 86, 6, 'Tek Dokunuş'], [90.3, 95.3, 7, 'Düzen Değişir'], [113, 118, 8, 'Yukarı El'], [129, 134, 9, 'Gece Devam']];
function drawScene(c, sc, t) { c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1; c.globalCompositeOperation = 'source-over'; sc.fn(c, t); c.restore(); }
const BRAND = 'murat250sr';
function brandBadge(c, t) {
  const lt = t - 2; if (lt < 0 || t > 137.9) return;
  const a = eo(seg(lt, 0, 0.8)) * (1 - sm(seg(t, 137.4, 137.9)));
  c.save(); c.font = `700 30px ${SANS}`; c.letterSpacing = '4px';
  const tw = c.measureText(BRAND).width, w = tw + 86, h = 54, x = W - 60 - w + (1 - eo(seg(lt, 0, 0.8))) * 80, y = 76;
  c.globalAlpha = a; c.shadowColor = 'rgba(0,0,0,0.5)'; c.shadowBlur = 18; c.fillStyle = 'rgba(28,20,64,0.78)'; rrect(c, x, y, w, h, 27); c.fill(); c.shadowColor = 'transparent'; c.shadowBlur = 0;
  c.strokeStyle = 'rgba(255,224,150,0.9)'; c.lineWidth = 2; rrect(c, x, y, w, h, 27); c.stroke();
  const pr = 0.5 + 0.5 * Math.sin(t * 4) + KK * 0.5; c.fillStyle = 'rgba(255,208,64,1)'; c.beginPath(); c.arc(x + 30, y + h / 2, 6 + pr * 2, 0, TAU); c.fill();
  const sw = ((lt * 0.45) % 1.6 - 0.3) * tw, g = c.createLinearGradient(x + 48, 0, x + 48 + tw, 0);
  g.addColorStop(0, '#ffe9a8'); g.addColorStop(clamp(sw / tw - 0.12), '#ffd040'); g.addColorStop(clamp(sw / tw), '#ffffff'); g.addColorStop(clamp(sw / tw + 0.12), '#ffd040'); g.addColorStop(1, '#ffe9a8');
  c.fillStyle = g; c.textBaseline = 'middle'; c.textAlign = 'left'; c.fillText(BRAND, x + 48, y + h / 2 + 1); c.restore();
}
function brandEnd(c, t) {
  const lt = t - 139.0; if (lt < 0) return;
  c.save(); c.font = `800 62px ${SANS}`; c.letterSpacing = '5px'; const tw = c.measureText(BRAND).width; let x = 900 - tw / 2;
  for (let i = 0; i < BRAND.length; i++) { const ch = BRAND[i], a = eo(seg(lt, i * 0.05, i * 0.05 + 0.3)), cw = c.measureText(ch).width; c.globalAlpha = a; c.lineWidth = 8; c.strokeStyle = '#1c1440'; c.lineJoin = 'round'; c.strokeText(ch, x, 468 + (1 - a) * -24); c.fillStyle = cs(PC[i % 6]); c.fillText(ch, x, 468 + (1 - a) * -24); x += cw; }
  c.restore();
}
function bigTitle(c, t) {
  const a0 = sm(seg(t, 5.0, 5.4)) * (1 - sm(seg(t, 12.6, 13.6))); if (a0 <= 0) return;
  c.save(); c.font = `900 96px ${SANS}`; c.letterSpacing = '4px'; const str = 'GECE BİZİMLE', tw = c.measureText(str).width; let x = 640 - tw / 2;
  for (let i = 0; i < str.length; i++) { const ch = str[i], a = eo(seg(t, 5.0 + i * 0.08, 5.0 + i * 0.08 + 0.45)) * a0, cw = c.measureText(ch).width, y = 215 + (1 - eo(seg(t, 5.0 + i * 0.08, 5.0 + i * 0.08 + 0.45))) * -60 + Math.sin(t * 3 + i) * 5;
    c.globalAlpha = a; c.lineWidth = 14; c.strokeStyle = '#1c1440'; c.lineJoin = 'round'; c.strokeText(ch, x, y); c.fillStyle = rgba(PC[i % 6]); c.fillText(ch, x, y); x += cw; }
  c.globalAlpha = a0; c.font = `700 17px ${SANS}`; c.letterSpacing = '10px'; c.textAlign = 'center'; c.fillStyle = '#1c1440'; c.fillText('KISA DİZİ  ·  RENK ŞEHRİ', 640, 262); c.restore();
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
    c.save(); c.translate(dx, 0); c.globalAlpha = a; c.fillStyle = '#ffd040'; c.fillRect(70, H - 160, 44, 5);
    txt(c, 'BÖLÜM ' + n, 70, H - 132, 14, { font: SANS, weight: 800, col: '#ffd040', sp: 5 });
    c.font = `900 40px ${SANS}`; c.lineWidth = 9; c.strokeStyle = '#1c1440'; c.lineJoin = 'round'; c.strokeText(title, 70, H - 90); c.fillStyle = '#fff'; c.fillText(title, 70, H - 90); c.restore();
  }
  bigTitle(c, t); brandBadge(c, t); brandEnd(c, t);
  c.fillStyle = '#000'; c.fillRect(0, 0, W, 52); c.fillRect(0, H - 52, W, 52);
  const fi = 1 - sm(t / 1.0); if (fi > 0) { c.fillStyle = `rgba(0,0,0,${fi})`; c.fillRect(0, 0, W, H); }
}
window.renderFrame = renderFrame;
