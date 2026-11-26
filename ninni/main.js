'use strict';
const cv = document.getElementById('cv'), ctx = cv.getContext('2d');
const SH = []; const S = (a, b, fn, o = {}) => SH.push(Object.assign({ a, b, fn }, o));
const vox = t => VOX[clamp(Math.round(t * 24), 0, VOX.length - 1)] || 0;
const say = (who, t) => { for (const it of TL) if (it.who !== 'amb' && t >= it.a && t < it.b) return who.includes(it.who) ? clamp(vox(t) * 1.5 - .1) : 0; return 0; };
const line = (who, k = 0) => TL.filter(it => it.who === who)[k];
function badge() { ctx.save(); ctx.globalAlpha = .9; ctx.translate(W - 290, 64); ctx.fillStyle = 'rgba(30,24,20,.55)'; ctx.beginPath(); ctx.roundRect(0, 0, 250, 62, 31); ctx.fill();
  ctx.strokeStyle = 'rgba(240,220,170,.8)'; ctx.lineWidth = 2; ctx.stroke(); ctx.font = '700 36px Kalam'; ctx.fillStyle = '#f3e3bf'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('murat250sr', 125, 33); ctx.restore(); }
function renderFrame(f) {
  const t = f / 24, td = Math.floor(t * 12) / 12;
  const i = SH.findIndex(s => t >= s.a && t < s.b), sh = SH[i < 0 ? SH.length - 1 : i], lt = td - sh.a, d = sh.b - sh.a;
  C.setTransform(RW / W, 0, 0, RW / W, 0, 0); C.globalAlpha = 1; C.globalCompositeOperation = 'source-over'; C.filter = 'none'; C.fillStyle = '#000'; C.fillRect(0, 0, W, H); LD = [-.6, -.7];
  const o = sh.fn(td, Math.max(0, lt), d, t) || {};
  let fade = o.fade || 0; const xi = sh.xi === undefined ? .12 : sh.xi, xo = sh.xo === undefined ? 0 : sh.xo;
  if (xi && t - sh.a < xi) fade = Math.max(fade, 1 - sm((t - sh.a) / xi)); if (xo && sh.b - t < xo) fade = Math.max(fade, 1 - sm((sh.b - t) / xo));
  const out = paint({ seed: (i % 5) * 1.7, fade, sep: o.sep, warm: o.warm, cool: o.cool, flash: o.flash });
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.drawImage(out, 0, 0);
  if (o.post) o.post(ctx, t, lt);
  if (!o.nobadge) badge();
}
window.renderFrame = renderFrame;
