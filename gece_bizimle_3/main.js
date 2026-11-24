'use strict';
const cv = document.getElementById('cv'); const ctx = cv.getContext('2d');
const OFF = document.createElement('canvas'); OFF.width = W; OFF.height = H; const OFF2 = document.createElement('canvas'); OFF2.width = W; OFF2.height = H;
const GR = (() => { const g = document.createElement('canvas'); g.width = 256; g.height = 256; const x = g.getContext('2d'), d = x.createImageData(256, 256), r = rng(5); for (let i = 0; i < d.data.length; i += 4) { const v = r() * 255; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 34; } x.putImageData(d, 0, 0); return g; })();
const SCENES = [
  { s: 0, e: 10, xf: 0, fn: sceneAerial }, { s: 10, e: 20, xf: 0.6, fn: sceneAlley }, { s: 20, e: 44, xf: 0.3, fn: sceneChase },
  { s: 44, e: 52, xf: 0.2, fn: sceneRail }, { s: 52, e: 60.5, xf: 0.3, fn: sceneMap }, { s: 60.5, e: 70.5, xf: 0.15, fn: sceneGlass },
  { s: 70.5, e: 81.5, xf: 0.15, fn: sceneWindows }, { s: 81.5, e: 89.7, xf: 0.9, fn: sceneBlackout }, { s: 89.7, e: 99.1, xf: 0.1, fn: sceneDropTower },
  { s: 99.1, e: 112.5, xf: 0.15, fn: sceneAvenue }, { s: 112.5, e: 128.3, xf: 0.25, fn: sceneOrbit }, { s: 128.3, e: 140, xf: 0.5, fn: sceneDawn },
];
const CHAPTERS = [[11, 15.5, 1, 'SESSİZLİK YASASI'], [20.6, 25, 2, 'KOVALAMACA'], [44.5, 49, 3, 'RAYLAR'], [60.9, 65.2, 4, 'CAM CEPHE'], [70.8, 75.3, 5, 'HALK UYANIYOR'], [90.3, 94.8, 6, 'DÜZEN DEĞİŞİR'], [113, 117.5, 7, 'YUKARI EL']];
function drawScene(c, sc, t) { c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1; c.globalCompositeOperation = 'source-over'; sc.fn(c, t); c.restore(); }
const BRAND = 'murat250sr';
function brandBadge(c, t) {
  const lt = t - 2; if (lt < 0 || t > 137.9) return; const a = eo(seg(lt, 0, 0.8)) * (1 - sm(seg(t, 137.4, 137.9)));
  c.save(); c.font = `700 30px ${SANS}`; c.letterSpacing = '4px'; const tw = c.measureText(BRAND).width, w = tw + 86, h = 54, x = W - 60 - w + (1 - eo(seg(lt, 0, 0.8))) * 80, y = 76;
  c.globalAlpha = a; c.shadowColor = 'rgba(0,0,0,0.5)'; c.shadowBlur = 18; c.fillStyle = 'rgba(4,8,18,0.8)'; rrect(c, x, y, w, h, 27); c.fill(); c.shadowColor = 'transparent'; c.shadowBlur = 0;
  c.strokeStyle = rgba(TEAL, 0.95); c.lineWidth = 2; rrect(c, x, y, w, h, 27); c.stroke(); const pr = 0.5 + 0.5 * Math.sin(t * 4) + KK * 0.5; c.fillStyle = rgba(MAG); c.beginPath(); c.arc(x + 30, y + h / 2, 6 + pr * 2, 0, TAU); c.fill(); G(c, x + 30, y + h / 2, 24, MAG, 0.7);
  const sw = ((lt * 0.45) % 1.6 - 0.3) * tw, g = c.createLinearGradient(x + 48, 0, x + 48 + tw, 0); g.addColorStop(0, '#bffcff'); g.addColorStop(clamp(sw / tw - 0.12), '#5ff'); g.addColorStop(clamp(sw / tw), '#fff'); g.addColorStop(clamp(sw / tw + 0.12), '#5ff'); g.addColorStop(1, '#bffcff');
  c.fillStyle = g; c.textBaseline = 'middle'; c.textAlign = 'left'; c.fillText(BRAND, x + 48, y + h / 2 + 1); c.restore();
}
function brandEnd(c, t) {
  const lt = t - 139.0; if (lt < 0) return; c.save(); c.font = `700 56px ${SANS}`; c.letterSpacing = '10px'; const tw = c.measureText(BRAND).width; let x = 640 - tw / 2;
  for (let i = 0; i < BRAND.length; i++) { const ch = BRAND[i], a = eo(seg(lt, i * 0.05, i * 0.05 + 0.3)), cw = c.measureText(ch).width; c.globalAlpha = a; c.shadowColor = rgba(TEAL); c.shadowBlur = 24; c.fillStyle = '#dffffd'; c.fillText(ch, x, 450 + (1 - a) * -20); x += cw; } c.restore();
}
function bigTitle(c, t) {
  const a = sm(seg(t, 5.0, 6.4)) * (1 - sm(seg(t, 12.6, 13.8))); if (a <= 0) return; const j = Math.sin(t * 31) > 0.96 ? 6 : 0;
  txt(c, 'GECE BİZİMLE', 640 + j, 330, 96, { font: SANS, weight: 800, col: '#fff', align: 'center', sp: 16, a }); txt(c, 'GECE BİZİMLE', 640 - 4 + j, 330, 96, { font: SANS, weight: 800, col: rgba(MAG, 0.55), align: 'center', sp: 16, a: a * 0.8 }); txt(c, 'GECE BİZİMLE', 640 + 4 + j, 330, 96, { font: SANS, weight: 800, col: rgba(TEAL, 0.55), align: 'center', sp: 16, a: a * 0.8 });
  c.fillStyle = rgba(TEAL, 0.9 * a); c.fillRect(440, 356, 400 * eo(seg(t, 5.4, 6.8)), 2); txt(c, 'KISA DİZİ  //  REMİX  //  SESSİZLİK YASASI', 640, 392, 14, { font: MONO, col: rgba(TEAL), align: 'center', sp: 6, a });
}
function renderFrame(f) {
  const t = f / 24; setAudio(t); const c = ctx; c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1; c.globalCompositeOperation = 'source-over'; c.shadowColor = 'transparent'; c.filter = 'none';
  c.fillStyle = '#000'; c.fillRect(0, 0, W, H);
  SCENES.forEach((sc, i) => { const nx = SCENES[i + 1] ? SCENES[i + 1].xf : 0, x = sc.xf || 0; if (t < sc.s - x / 2 || t > sc.e + nx / 2) return; const a = x > 0 ? sm(seg(t, sc.s - x / 2, sc.s + x / 2)) : (t >= sc.s ? 1 : 0); if (a <= 0) return;
    if (a >= 0.999) drawScene(c, sc, t); else { const oc = OFF.getContext('2d'); oc.setTransform(1, 0, 0, 1, 0, 0); oc.clearRect(0, 0, W, H); drawScene(oc, sc, t); c.globalAlpha = a; c.drawImage(OFF, 0, 0); c.globalAlpha = 1; } });
  c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1;
  const bl = t < 14 ? 16 * (1 - sm(seg(t, 1, 14))) : 0; // "filtre açılır"
  if (bl > 0.3) { const o2 = OFF2.getContext('2d'); o2.clearRect(0, 0, W, H); o2.drawImage(cv, 0, 0); c.fillStyle = '#000'; c.fillRect(0, 0, W, H); c.filter = `blur(${bl.toFixed(1)}px)`; c.drawImage(OFF2, 0, 0); c.filter = 'none'; tint(c, [0, 0, 10], 0.35 * (bl / 16)); }
  const gs = KK > 0.55 && ((t > 89.7 && t < 112.5) || (t > 44 && t < 60)); if (gs) { const o2 = OFF2.getContext('2d'); o2.clearRect(0, 0, W, H); o2.drawImage(cv, 0, 0); const r = rng(f); for (let i = 0; i < 3; i++) { const y = r() * H, h = 8 + r() * 30, dx = (r() - 0.5) * 30 * KK; c.drawImage(OFF2, 0, y, W, h, dx, y, W, h); } c.globalAlpha = 0.5 * KK; c.globalCompositeOperation = 'lighter'; c.drawImage(OFF2, 4, 0); c.globalCompositeOperation = 'source-over'; c.globalAlpha = 1; }
  for (const [s, e, n, title] of CHAPTERS) { const a = sm(seg(t, s, s + 0.5)) * (1 - sm(seg(t, e - 0.5, e))); if (a <= 0) continue; c.save(); c.globalAlpha = a; c.fillStyle = rgba(MAG); c.fillRect(70, H - 168, 3, 40); txt(c, 'KANAL 0' + n, 84, H - 150, 12, { font: MONO, col: rgba(TEAL), sp: 4 }); txt(c, title, 84, H - 128, 26, { font: SANS, weight: 800, col: '#fff', sp: 5 }); c.restore(); }
  bigTitle(c, t); brandBadge(c, t); brandEnd(c, t);
  c.fillStyle = 'rgba(0,0,0,0.10)'; for (let y = 0; y < H; y += 4) c.fillRect(0, y, W, 1);
  c.save(); c.globalAlpha = 0.5; c.translate(-((f * 37) % 256), -((f * 91) % 256)); c.fillStyle = c.createPattern(GR, 'repeat'); c.fillRect(0, 0, W + 256, H + 256); c.restore();
  c.fillStyle = '#000'; c.fillRect(0, 0, W, 52); c.fillRect(0, H - 52, W, 52); const fi = 1 - sm(t / 1.0); if (fi > 0) { c.fillStyle = `rgba(0,0,0,${fi})`; c.fillRect(0, 0, W, H); }
}
window.renderFrame = renderFrame;
