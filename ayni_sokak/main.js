'use strict';
const OFF = document.createElement('canvas'); OFF.width = W; OFF.height = H; const OFFL = document.createElement('canvas'); OFFL.width = W; OFFL.height = H;
const BRAND = 'murat250sr';
function shotAt(t) { let i = SHOTS.findIndex(s => t >= s[0] && t < s[1]); if (i < 0) i = SHOTS.length - 1; return i; }
function drawChalk(i, t) { const s = SHOTS[i]; L.setTransform(1, 0, 0, 1, 0, 0); L.globalCompositeOperation = 'source-over'; L.globalAlpha = 1; L.clearRect(0, 0, W, H); s[2](L, ctx, t, t - s[0]); L.save(); L.globalCompositeOperation = 'destination-out'; L.globalAlpha = 0.9; L.translate(-(FS * 53) % 256, -(FS * 97) % 256); L.fillStyle = L.createPattern(GRN, 'repeat'); L.fillRect(0, 0, W + 256, H + 256); L.restore(); }
function renderFrame(f) {
  const t = f / 24; setAudio(t); FS = Math.floor(t * 8); const c = ctx; c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1; c.globalCompositeOperation = 'source-over'; c.filter = 'none';
  const fl = sm(seg(t, 172, 178)) * 0.55 + sm(seg(t, 196, 202)) * 0.45; const sh = (t > 3.4 && t < 3.9) ? Math.sin(t * 90) * 6 * (1 - (t - 3.4) / 0.5) : 0; const bp = (t > 148 && t < 160) ? Math.sin(t * 40) * 3 * seg(t, 148, 160) : 0;
  c.save(); c.translate(sh + bp, 0); c.drawImage(WALL, 0, 0);
  if (fl > 0) { c.save(); c.globalCompositeOperation = 'screen'; const g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, `rgba(80,160,255,${0.34 * fl})`); g.addColorStop(0.55, `rgba(255,170,90,${0.42 * fl})`); g.addColorStop(1, `rgba(255,90,140,${0.3 * fl})`); c.fillStyle = g; c.fillRect(0, 0, W, H); c.restore(); }
  const i = shotAt(t), s = SHOTS[i]; drawChalk(i, t);
  const nx = SHOTS[i + 1], d = nx ? nx[0] - t : 9; if (nx && d < 0.3) { c.drawImage(LY, 0, 0); drawChalk(i + 1, t); c.globalAlpha = sm(1 - d / 0.3); c.drawImage(LY, 0, 0); c.globalAlpha = 1; } else c.drawImage(LY, 0, 0);
  c.restore();
  vignette(c, 0.5);
  if (t > 1.5) { const a = sm(seg(t, 1.5, 2.4)); c.save(); c.globalAlpha = a * 0.95; c.translate(W - 70, H - 44); c.rotate(-0.04); c.font = `italic 700 34px ${FI}`; c.textAlign = 'right'; c.letterSpacing = '3px'; c.shadowColor = 'rgba(238,238,230,0.5)'; c.shadowBlur = 8; c.fillStyle = 'rgba(238,238,230,0.92)'; c.fillText(BRAND, 0, 0); c.strokeStyle = 'rgba(250,214,96,0.9)'; c.lineWidth = 4; c.beginPath(); c.moveTo(-250, 12); c.quadraticCurveTo(-120, 18, 0, 8); c.stroke(); c.restore(); }
  const fi = 1 - sm(t / 1.2); if (fi > 0) { c.fillStyle = `rgba(0,0,0,${fi})`; c.fillRect(0, 0, W, H); } const fo = sm(seg(t, 230.6, 231.6)); if (fo > 0) { c.fillStyle = `rgba(0,0,0,${fo})`; c.fillRect(0, 0, W, H); }
}
window.renderFrame = renderFrame;
