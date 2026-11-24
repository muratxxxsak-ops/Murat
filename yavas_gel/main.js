'use strict';
function renderFrame(f) {
  const t = f / 24; setAudio(t); const c = ctx; c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1;
  let i = SHOTS.findIndex(s => t >= s[0] && t < s[1]); if (i < 0) i = SHOTS.length - 1; const s = SHOTS[i];
  for (const L of [P, B]) { L.setTransform(1, 0, 0, 1, 0, 0); L.globalAlpha = 1; L.globalCompositeOperation = 'source-over'; L.clearRect(0, 0, W, H); }
  s[2](t, t - s[0]);
  compose(c, t);
  const nx = SHOTS[i + 1], d = nx ? nx[0] - t : 9; if (nx && d < 0.35) { const keep = c.getImageData(0, 0, 1, 1); }
  // damga etiket
  const a = sm(seg(t, 1.5, 2.5)); c.save(); c.globalAlpha = a; c.translate(W - 60, H - 60); c.rotate(-0.05); c.font = `900 30px ${SANS}`; c.letterSpacing = '3px'; const w = c.measureText('murat250sr').width + 44; c.fillStyle = 'rgba(255,62,126,0.92)'; c.fillRect(-w, -40, w, 56); c.globalCompositeOperation = 'multiply'; c.fillStyle = 'rgba(18,98,196,0.5)'; c.fillRect(-w + 4, -36, w, 56); c.globalCompositeOperation = 'source-over'; c.fillStyle = rgba(PAPER); c.textAlign = 'right'; c.fillText('murat250sr', -20, 0); c.restore();
  const fi = 1 - sm(t / 1.2); if (fi > 0) { c.fillStyle = `rgba(246,238,222,${fi})`; c.fillRect(0, 0, W, H); } const fo = sm(seg(t, 130.4, 131.2)); if (fo > 0) { c.fillStyle = `rgba(246,238,222,${fo})`; c.fillRect(0, 0, W, H); }
}
window.renderFrame = renderFrame;
