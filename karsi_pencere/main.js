'use strict';
const cv = document.getElementById('cv'); const ctx = cv.getContext('2d');
const OFF = document.createElement('canvas'); OFF.width = W; OFF.height = H;
const PG = (() => { const g = document.createElement('canvas'); g.width = 256; g.height = 256; const x = g.getContext('2d'), d = x.createImageData(256, 256), r = rng(9); for (let i = 0; i < d.data.length; i += 4) { const v = 120 + r() * 135; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 46; } x.putImageData(d, 0, 0); x.strokeStyle = 'rgba(255,255,255,0.05)'; for (let i = 0; i < 60; i++) { x.beginPath(); const a = r() * 256, b = r() * 256; x.moveTo(a, b); x.lineTo(a + r() * 30 - 15, b + r() * 30 - 15); x.stroke(); } return g; })();
const SCENES = [{ s: 0, e: 160, xf: 0, fn: drawWorld }, { s: 160, e: 170, xf: 0.3, fn: sceneStairs }, { s: 170, e: 176, xf: 0.3, fn: drawWorld }, { s: 176, e: 182, xf: 0.4, fn: sceneFaces }, { s: 182, e: 224, xf: 0.5, fn: drawWorld }];
const CHAPTERS = [[5, 13, 'Her gece saat on bir…'], [15.5, 21, 'Üç metre ara'], [49.5, 55, 'Karşı pencere'], [79.5, 85, 'Güzel çalıyorsun'], [146.8, 153, 'Elektrikler kesildi'], [160.5, 166, 'Dört kat'], [170.8, 175, 'Merhaba'], [184, 190, 'Tek bir ışık']];
function drawScene(c, sc, t) { c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1; c.globalCompositeOperation = 'source-over'; sc.fn(c, t); c.restore(); }
const BRAND = 'murat250sr';
function brandBadge(c, t) {
  const lt = t - 2; if (lt < 0 || t > 219.5) return; const a = eo(seg(lt, 0, 0.8)) * (1 - sm(seg(t, 219, 219.5)));
  c.save(); c.font = `700 30px ${SANS}`; c.letterSpacing = '4px'; const tw = c.measureText(BRAND).width, w = tw + 86, h = 54, x = W - 60 - w + (1 - eo(seg(lt, 0, 0.8))) * 80, y = 76;
  c.globalAlpha = a; c.shadowColor = 'rgba(0,0,0,0.5)'; c.shadowBlur = 14; c.shadowOffsetY = 4; c.fillStyle = 'rgba(250,240,214,0.95)'; rrect(c, x, y, w, h, 14); c.fill(); c.shadowColor = 'transparent'; c.shadowBlur = 0; c.shadowOffsetY = 0;
  c.strokeStyle = 'rgba(196,110,60,0.9)'; c.lineWidth = 2; rrect(c, x + 5, y + 5, w - 10, h - 10, 10); c.stroke(); c.fillStyle = 'rgba(214,84,60,1)'; c.beginPath(); c.arc(x + 30, y + h / 2, 6 + KK * 2, 0, TAU); c.fill();
  c.fillStyle = '#3a2a2a'; c.textBaseline = 'middle'; c.textAlign = 'left'; c.fillText(BRAND, x + 48, y + h / 2 + 1); c.restore();
}
function brandEnd(c, t) {
  const lt = t - 220.2; if (lt < 0) return; c.save(); c.font = `italic 700 60px ${FI}`; c.letterSpacing = '4px'; const tw = c.measureText(BRAND).width; let x = 640 - tw / 2;
  for (let i = 0; i < BRAND.length; i++) { const ch = BRAND[i], a = eo(seg(lt, i * 0.05, i * 0.05 + 0.3)), cw = c.measureText(ch).width; c.globalAlpha = a; c.shadowColor = 'rgba(0,0,0,0.5)'; c.shadowBlur = 10; c.shadowOffsetY = 4; c.fillStyle = '#fbeed0'; c.fillText(ch, x, 470 + (1 - a) * -24); x += cw; } c.restore();
}
function renderFrame(f) {
  const t = f / 24; setAudio(t); const c = ctx; c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1; c.globalCompositeOperation = 'source-over'; c.shadowColor = 'transparent';
  c.fillStyle = '#000'; c.fillRect(0, 0, W, H);
  SCENES.forEach((sc, i) => { const nx = SCENES[i + 1] ? SCENES[i + 1].xf : 0, x = sc.xf || 0; if (t < sc.s - x / 2 || t > sc.e + nx / 2) return; const a = x > 0 ? sm(seg(t, sc.s - x / 2, sc.s + x / 2)) : (t >= sc.s ? 1 : 0); if (a <= 0) return;
    if (a >= 0.999) drawScene(c, sc, t); else { const oc = OFF.getContext('2d'); oc.setTransform(1, 0, 0, 1, 0, 0); oc.clearRect(0, 0, W, H); drawScene(oc, sc, t); c.globalAlpha = a; c.drawImage(OFF, 0, 0); c.globalAlpha = 1; } });
  c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1;
  for (const [s, e, title] of CHAPTERS) { const a = sm(seg(t, s, s + 0.7)) * (1 - sm(seg(t, e - 0.7, e))); if (a <= 0) continue; c.save(); c.globalAlpha = a; c.translate(0, (1 - eo(seg(t, s, s + 0.8))) * 12); c.shadowColor = 'rgba(0,0,0,0.6)'; c.shadowBlur = 12; c.fillStyle = 'rgba(250,240,214,0.96)'; rrect(c, 66, H - 138, c.measureText(title).width + 60, 54, 6); c.restore(); c.save(); c.globalAlpha = a; c.font = `italic 28px ${FI}`; const wd = c.measureText(title).width; c.shadowColor = 'rgba(0,0,0,0.5)'; c.shadowBlur = 12; c.shadowOffsetY = 4; c.fillStyle = '#f8ecd0'; rrect(c, 70, H - 134, wd + 36, 50, 6); c.fill(); c.shadowColor = 'transparent'; c.fillStyle = '#3a2a2a'; c.fillText(title, 88, H - 100); c.restore(); }
  const ta = sm(seg(t, 5.0, 6.4)) * (1 - sm(seg(t, 12, 13.4)));
  if (ta > 0) { c.save(); c.globalAlpha = ta; c.font = `700 92px ${FI}`; c.letterSpacing = '10px'; const tw = c.measureText('KARŞI PENCERE').width; c.shadowColor = 'rgba(0,0,0,0.6)'; c.shadowBlur = 18; c.shadowOffsetY = 8; c.fillStyle = '#f8ecd0'; c.fillText('KARŞI PENCERE', 640 - tw / 2, 300); c.shadowColor = 'transparent'; c.font = `italic 22px ${FI}`; c.letterSpacing = '6px'; c.fillStyle = '#f0d8a8'; const t2 = c.measureText('kısa dizi').width; c.fillText('kısa dizi', 640 - t2 / 2, 342); c.restore(); }
  brandBadge(c, t); brandEnd(c, t);
  const fo = sm(seg(t, 219.5, 220.6)); if (fo > 0) { c.fillStyle = `rgba(14,10,16,${fo})`; c.fillRect(0, 0, W, H); const ea = sm(seg(t, 220.0, 220.8)); txt(c, 'KARŞI PENCERE', 640, 400, 54, { font: FI, col: '#f8ecd0', align: 'center', sp: 8, a: ea }); } if (t > 220.2) brandEnd(c, t);
  c.save(); c.globalAlpha = 0.55; c.globalCompositeOperation = 'overlay'; c.translate(-((f * 37) % 256), -((f * 91) % 256)); c.fillStyle = c.createPattern(PG, 'repeat'); c.fillRect(0, 0, W + 256, H + 256); c.restore();
  c.fillStyle = '#000'; c.fillRect(0, 0, W, 52); c.fillRect(0, H - 52, W, 52); const fi = 1 - sm(t / 1.2); if (fi > 0) { c.fillStyle = `rgba(0,0,0,${fi})`; c.fillRect(0, 0, W, H); }
}
window.renderFrame = renderFrame;
