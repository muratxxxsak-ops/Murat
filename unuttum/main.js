'use strict';
const T_END = 189.98;
const SH = []; const S = (a, b, fn, o = {}) => SH.push(Object.assign({ a, b, fn }, o));
function renderFrame(f) {
  const t = f / 24; setAudio(t); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.filter = 'none'; ctx.globalCompositeOperation = 'source-over';
  const i = SH.findIndex(s => t >= s.a && t < s.b), sh = SH[i < 0 ? SH.length - 1 : i], lt = t - sh.a, d = sh.b - sh.a;
  CAM = { x: W / 2, y: H / 2, z: 1, r: 0 };
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
  const g = sh.fn(t, lt, d, f) || {};
  // geçiş: önceki sahneden çapraz geçiş yerine karartmalı yumuşak kesme
  const xf = sh.x === undefined ? .35 : sh.x; if (xf > 0 && lt < xf) { ctx.fillStyle = `rgba(0,0,0,${1 - sm(lt / xf)})`; ctx.fillRect(0, 0, W, H); }
  if (sh.xo && lt > d - sh.xo) { ctx.fillStyle = `rgba(0,0,0,${sm((lt - d + sh.xo) / sh.xo)})`; ctx.fillRect(0, 0, W, H); }
  if (!g.raw) finish(f, g);
  letterbox(g.lb === undefined ? 70 : g.lb);
  badge(t, g);
  const fi = Math.max(1 - t / 1.2, 0); if (fi > 0) { ctx.fillStyle = `rgba(0,0,0,${fi})`; ctx.fillRect(0, 0, W, H); }
  const fo = seg(t, T_END - 1.5, T_END); if (fo > 0) { ctx.fillStyle = `rgba(0,0,0,${fo})`; ctx.fillRect(0, 0, W, H); }
}
function badge(t, g) {
  if (g.nobadge) return; ctx.save(); ctx.globalAlpha = .92; ctx.font = `700 24px ${SANS}`; ctx.letterSpacing = '3px'; ctx.textAlign = 'right'; ctx.fillStyle = '#f2efe8'; ctx.shadowColor = 'rgba(0,0,0,.8)'; ctx.shadowBlur = 6;
  ctx.fillText('murat250sr', W - 40, H - 24); ctx.shadowBlur = 0; const w = ctx.measureText('murat250sr').width;
  ctx.fillStyle = `rgba(230,60,60,${.6 + .4 * pulse(t)})`; ctx.beginPath(); ctx.arc(W - 52 - w, H - 32, 5, 0, TAU); ctx.fill();
  ctx.fillStyle = 'rgba(242,239,232,.5)'; ctx.fillRect(W - 40 - w, H - 17, w, 1.5); ctx.restore();
}
