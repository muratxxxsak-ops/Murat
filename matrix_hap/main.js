'use strict';
const cv = document.getElementById('cv'), ctx = cv.getContext('2d');
const T_END = 356.5;
const SH = []; const S = (a, b, fn, o = {}) => SH.push(Object.assign({ a, b, fn }, o));
const vox = t => VOX[clamp(Math.round(t * 24), 0, VOX.length - 1)] || 0;
function badge(t) {
  ctx.save(); ctx.translate(W - 222, H - 62);
  ctx.shadowColor = 'rgba(0,0,0,.35)'; ctx.shadowBlur = 10; ctx.shadowOffsetY = 4;
  ctx.fillStyle = '#f4d23c'; ctx.beginPath(); ctx.roundRect(0, 0, 200, 44, 22); ctx.fill(); ctx.shadowColor = 'transparent';
  const g = ctx.createLinearGradient(0, 0, 0, 44); g.addColorStop(0, 'rgba(255,255,255,.45)'); g.addColorStop(.5, 'rgba(255,255,255,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect(0, 0, 200, 44, 22); ctx.fill();
  ctx.fillStyle = '#d33'; ctx.beginPath(); ctx.arc(24, 22, 9, 0, TAU); ctx.fill(); ctx.fillStyle = '#36c'; ctx.beginPath(); ctx.arc(24, 22, 9, -Math.PI / 2, Math.PI / 2); ctx.fill();
  ctx.font = '700 24px Kalam'; ctx.fillStyle = '#2a1a1a'; ctx.textBaseline = 'middle'; ctx.fillText('murat250sr', 42, 24);
  ctx.restore();
}
function renderFrame(f) {
  const t = f / 24, td = Math.floor(t * 12) / 12; setAudio(t);
  const i = SH.findIndex(s => t >= s.a && t < s.b), sh = SH[i < 0 ? SH.length - 1 : i], lt = td - sh.a, d = sh.b - sh.a;
  JSEED = Math.floor(t * 12) % 7; JN = 0;
  C.setTransform(1, 0, 0, 1, 0, 0); C.globalAlpha = 1; C.globalCompositeOperation = 'source-over'; C.filter = 'none'; C.shadowColor = 'transparent'; C.fillStyle = '#222'; C.fillRect(0, 0, W, H);
  const o = sh.fn(td, Math.max(0, lt), d, t) || {};
  C.setTransform(1, 0, 0, 1, 0, 0);
  const out = post({ seed: JSEED, flash: o.flash });
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1;
  if (o.shake) ctx.translate(Math.sin(t * 71) * o.shake, Math.cos(t * 53) * o.shake);
  ctx.drawImage(out, 0, 0); ctx.setTransform(1, 0, 0, 1, 0, 0);
  // geçiş: iris
  const xi = sh.xi || 0; if (xi && t - sh.a < xi) { const k = sm((t - sh.a) / xi); ctx.save(); ctx.fillStyle = '#111'; ctx.beginPath(); ctx.rect(0, 0, W, H); ctx.arc(W / 2, H / 2, k * 800, 0, TAU, true); ctx.fill('evenodd'); ctx.restore(); }
  if (o.post) o.post(ctx, t);
  if (!o.nobadge) badge(t);
}
window.renderFrame = renderFrame;
