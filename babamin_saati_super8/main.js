'use strict';
const cv = document.getElementById('cv'); const ctx = cv.getContext('2d');
const OFF = document.createElement('canvas'); OFF.width = W; OFF.height = H;
const S8 = document.createElement('canvas'); S8.width = 640; S8.height = 480;
const P = (fn, m) => (c, t, lt) => fn(c, t, lt, m);
const SHOTS = [[0, 3.6, mLeader, 'm'], [3.6, 17, shWatchIntro, 'M'], [17, 19.5, mStreet, 'm'], [19.5, 22, mShirt, 'm'], [22, 24.5, mSplit, 'm'], [24.5, 27, mOven, 'm'], [27, 29.5, shWatchScratch, 'M'], [29.5, 32, mCrouch, 'm'], [32, 34.5, mSchool, 'm'], [34.5, 37, shDesk, 'M'], [37, 42, shBreadTable, 'M'], [42, 44.5, mBayram, 'm'], [44.5, 51, mWinters, 'm'], [51, 59, shChorusWatch, 'M'], [59, 64, shBreadCool, 'M'], [64, 68, mWave, 'm'], [68, 74, shTickBlack, 'M'],
  [74, 76.7, shSuitcase, 'p'], [76.7, 79.4, shCity, 'p'], [79.4, 87.4, P(shPhone, 'a'), 'p'], [87.4, 90, shBrick, 'p'], [90, 92.7, shPoster, 'p'], [92.7, 95.4, P(shPhone, 'b'), 'p'], [95.4, 100.7, shBus, 'p'], [100.7, 103.4, shCorridor, 'p'], [103.4, 108, shNightstand, 'p'], [108, 116, P(shChorusWatch, 1), 'p'], [116, 125.5, P(shBreadCool, 1), 'p'], [125.5, 131, shTickBlack, 'p'], [131, 137, shClockWall, 'p'], [137, 143, shLoupe, 'p'], [143, 148, shPulseWatch, 'p'], [148, 151, shWinding, 'p'], [151, 154, shAlarm, 'p'], [154, 157, shDoorstep, 'p'], [157, 160, P(shPhone, 'c'), 'p'], [160, 163, shScale, 'p'], [163, 169, shStageRack, 'p'], [169, 172, shWrist, 'p'], [172, 177, shPromise, 'p'],
  [177, 186, shDawn, 'M'], [186, 197, shSlice, 'M'], [197, 214, shFinale, 'p'], [214, 222.5, shOutro, 'p']];
const FLASH = [[105.8, 107.8, 0.85], [146, 147.8, 0.8], [165.8, 167.2, 0.5]];
const BRAND = 'murat250sr';
let FRAME = 0;
function memFrame(c, s, t, f) {
  const g = S8.getContext('2d'); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over'; g.filter = 'none'; g.fillStyle = '#000'; g.fillRect(0, 0, 640, 480);
  const t8 = Math.floor(t * 16) / 16; g.save(); if (s[3] === 'M') { g.scale(2 / 3, 2 / 3); g.translate(-160, 0); } s[2](g, t8, t8 - s[0]); g.restore();
  const id = g.getImageData(0, 0, 640, 480), d = id.data; let seed = (f * 7919 + 13) >>> 0; const fl = 1 + (hsh(f, 3) - 0.5) * 0.12;
  for (let i = 0; i < d.length; i += 4) { let r = d[i], gg = d[i + 1], b = d[i + 2]; const l = 0.3 * r + 0.59 * gg + 0.11 * b; r = l + (r - l) * 0.72; gg = l + (gg - l) * 0.72; b = l + (b - l) * 0.72; seed = (seed * 1664525 + 1013904223) >>> 0; const n = ((seed >>> 24) / 255 - 0.5) * 46; d[i] = (r * 0.8 + 30) * 1.06 * fl + n; d[i + 1] = (gg * 0.8 + 24) * 1.0 * fl + n; d[i + 2] = (b * 0.78 + 14) * 0.8 * fl + n * 0.8; }
  g.putImageData(id, 0, 0);
  c.save(); c.fillStyle = '#000'; c.fillRect(0, 0, W, H); const j = Math.floor(f / 2), jx = (hsh(j, 1) - 0.5) * 6, jy = (hsh(j, 2) - 0.5) * 6; c.translate(640, 360); c.rotate((hsh(j, 3) - 0.5) * 0.008); c.translate(-640, -360);
  c.beginPath(); rrect(c, 160, 4, 960, 712, 30); c.clip(); c.imageSmoothingEnabled = true; c.filter = 'blur(0.9px)'; c.drawImage(S8, 160 + jx, jy, 960, 720); c.filter = 'none';
  const vg = c.createRadialGradient(640, 360, 220, 640, 360, 620); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(10,4,0,0.72)'); c.fillStyle = vg; c.fillRect(160, 0, 960, 720);
  if (hsh(Math.floor(t * 2.2), 5) > 0.82) { const side = hsh(Math.floor(t * 2.2), 6) > 0.5 ? 160 : 1120, lk = c.createRadialGradient(side, 200 + hsh(Math.floor(t * 2.2), 7) * 300, 10, side, 360, 520); lk.addColorStop(0, 'rgba(255,120,30,0.55)'); lk.addColorStop(1, 'rgba(255,60,0,0)'); c.save(); c.globalCompositeOperation = 'screen'; c.fillStyle = lk; c.fillRect(160, 0, 960, 720); c.restore(); }
  c.strokeStyle = 'rgba(255,248,230,0.35)'; c.lineWidth = 1.5; for (let i = 0; i < 3; i++) if (hsh(f, 10 + i) > 0.62) { const x = 160 + hsh(f, 20 + i) * 960; c.beginPath(); c.moveTo(x, 0); c.lineTo(x + (hsh(f, 30 + i) - 0.5) * 6, 720); c.stroke(); }
  for (let i = 0; i < 9; i++) if (hsh(f, 40 + i) > 0.5) { c.fillStyle = hsh(f, 50 + i) > 0.5 ? 'rgba(255,250,235,0.55)' : 'rgba(10,6,2,0.6)'; c.beginPath(); c.arc(160 + hsh(f, 60 + i) * 960, hsh(f, 70 + i) * 720, 1 + hsh(f, 80 + i) * 2.4, 0, TAU); c.fill(); }
  c.restore();
  c.save(); c.font = `700 30px ${MONO}`; c.textAlign = 'right'; c.shadowColor = 'rgba(255,120,20,0.9)'; c.shadowBlur = 10; c.fillStyle = 'rgba(255,150,40,0.92)'; c.fillText(t < 51 ? "12 09 '86" : "05 04 '91", 1086, 686); c.restore();
}
function presentFrame(c, s, t) { c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1; c.globalCompositeOperation = 'source-over'; c.filter = 'none'; s[2](c, t, t - s[0]); c.fillStyle = 'rgba(90,130,170,0.07)'; c.globalCompositeOperation = 'multiply'; c.fillRect(0, 0, W, H); c.globalCompositeOperation = 'source-over'; c.fillStyle = '#000'; c.fillRect(0, 0, W, 88); c.fillRect(0, H - 88, W, 88); c.restore(); }
function drawShot(c, s, t, f) { if (s[3] === 'p') presentFrame(c, s, t); else memFrame(c, s, t, f); }
function brandPlate(c, t) { if (t < 1.5 || t > 219.6) return; const a = sm(seg(t, 1.5, 2.5)) * (1 - sm(seg(t, 219, 219.6))); c.save(); c.globalAlpha = a * 0.92; c.font = `italic 700 26px ${FI}`; c.letterSpacing = '3px'; const w = c.measureText(BRAND).width + 44, x = W - 40 - w, y = 108; const g = c.createLinearGradient(x, y, x, y + 46); g.addColorStop(0, '#d9b872'); g.addColorStop(0.5, '#a07c3c'); g.addColorStop(1, '#c8a45a'); c.shadowColor = 'rgba(0,0,0,0.6)'; c.shadowBlur = 10; c.shadowOffsetY = 3; c.fillStyle = g; rrect(c, x, y, w, 46, 6); c.fill(); c.shadowColor = 'transparent'; c.strokeStyle = 'rgba(60,38,10,0.7)'; c.lineWidth = 2; rrect(c, x + 4, y + 4, w - 8, 38, 4); c.stroke(); c.fillStyle = 'rgba(255,240,200,0.5)'; c.textBaseline = 'middle'; c.fillText(BRAND, x + 23, y + 24); c.fillStyle = '#3a2410'; c.fillText(BRAND, x + 22, y + 23); c.restore(); }
function renderFrame(f) {
  const t = f / 24; setAudio(t); const c = ctx; c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1; c.globalCompositeOperation = 'source-over'; c.shadowColor = 'transparent'; c.filter = 'none'; c.fillStyle = '#000'; c.fillRect(0, 0, W, H);
  SHOTS.forEach((s, i) => { const xf = 0.4, nx = SHOTS[i + 1] ? xf : 0; if (t < s[0] - (i ? xf / 2 : 0) || t > s[1] + nx / 2) return; const a = i ? sm(seg(t, s[0] - xf / 2, s[0] + xf / 2)) : 1; if (a <= 0) return;
    if (a >= 0.999) drawShot(c, s, t, f); else { const oc = OFF.getContext('2d'); oc.setTransform(1, 0, 0, 1, 0, 0); oc.clearRect(0, 0, W, H); drawShot(oc, s, t, f); c.globalAlpha = a; c.drawImage(OFF, 0, 0); c.globalAlpha = 1; } });
  c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1;
  for (const [a0, a1, al] of FLASH) { const a = sm(seg(t, a0, a0 + 0.4)) * (1 - sm(seg(t, a1 - 0.4, a1))) * al; if (a > 0.01) { const oc = OFF.getContext('2d'); oc.setTransform(1, 0, 0, 1, 0, 0); oc.clearRect(0, 0, W, H); memFrame(oc, [0, 0, mWave, 'm'], t, f); c.globalAlpha = a; c.drawImage(OFF, 0, 0); c.globalAlpha = 1; } }
  for (let i = 1; i < SHOTS.length; i++) { if ((SHOTS[i][3] === 'p') !== (SHOTS[i - 1][3] === 'p')) { const d = Math.abs(t - SHOTS[i][0]); if (d < 0.22) { c.fillStyle = `rgba(255,244,224,${0.75 * (1 - d / 0.22)})`; c.fillRect(0, 0, W, H); } } }
  const sc = SC.getContext('2d'); sc.setTransform(1, 0, 0, 1, 0, 0); sc.clearRect(0, 0, 640, 360); sc.drawImage(cv, 0, 0, 640, 360); c.save(); c.filter = 'blur(10px)'; c.globalCompositeOperation = 'screen'; c.globalAlpha = 0.3; c.drawImage(SC, 0, 0, W, H); c.restore();
  brandPlate(c, t); const fi = 1 - sm(t / 0.6); if (fi > 0) { c.fillStyle = `rgba(0,0,0,${fi})`; c.fillRect(0, 0, W, H); }
}
window.renderFrame = renderFrame;
