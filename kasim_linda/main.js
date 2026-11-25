'use strict';
const cv = document.getElementById('cv'), ctx = cv.getContext('2d');
const PER = 60 / ENERGY.bpm, B0 = ENERGY.ph, bar = k => B0 + k * PER * 4;
const T_END = 167.1;
const SH = []; const S = (a, b, fn, o = {}) => SH.push(Object.assign({ a, b, fn }, o));
function badge(t) {
  ctx.save(); ctx.translate(30, 34); ctx.rotate(-.035);
  ctx.fillStyle = 'rgba(232,220,190,.92)'; ctx.beginPath(); ctx.moveTo(0, 0);
  for (let i = 0; i <= 8; i++) ctx.lineTo(i * 25, (i % 2) * 2); ctx.lineTo(200, 2); for (let i = 0; i <= 6; i++) ctx.lineTo(200 + (i % 2) * 4, 6 + i * 6); ctx.lineTo(200, 42);
  for (let i = 8; i >= 0; i--) ctx.lineTo(i * 25, 42 - (i % 2) * 2); for (let i = 6; i >= 0; i--) ctx.lineTo(-(i % 2) * 4, 6 + i * 6); ctx.closePath(); ctx.fill();
  ctx.fillStyle = 'rgba(176,36,40,.85)'; ctx.beginPath(); ctx.arc(20, 21, 7, 0, TAU); ctx.fill();
  ctx.font = "700 25px Kalam"; ctx.fillStyle = '#2e2622'; ctx.textBaseline = 'middle'; ctx.fillText('murat250sr', 36, 23);
  ctx.restore();
}
function renderFrame(f) {
  const t = f / 24; setAudio(t);
  const i = SH.findIndex(s => t >= s.a && t < s.b), sh = SH[i < 0 ? SH.length - 1 : i], lt = t - sh.a, d = sh.b - sh.a;
  for (const k of [C, L, TP]) { k.setTransform(1, 0, 0, 1, 0, 0); k.globalAlpha = 1; k.globalCompositeOperation = 'source-over'; k.filter = 'none'; }
  C.fillStyle = '#fff'; C.fillRect(0, 0, W, H); L.clearRect(0, 0, W, H); TP.clearRect(0, 0, W, H);
  const o = sh.fn(t, lt, d) || {};
  for (const k of [C, L, TP]) k.setTransform(1, 0, 0, 1, 0, 0);
  let rv = o.reveal === undefined ? 1 : o.reveal; const xi = sh.xi || 0; if (xi && lt < xi) rv = Math.min(rv, sm(lt / xi) * 1.05);
  const out = paint({ seed: (i < 0 ? 0 : i) % 5 + .3, t, wet: o.wet, pencil: o.pencil, reveal: rv, margin: o.margin });
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  if (o.shake) ctx.translate(Math.sin(t * 71) * o.shake, Math.cos(t * 53) * o.shake);
  const zz = 1 + .006 * KK * (o.pulse === undefined ? 1 : o.pulse); ctx.translate(W / 2, H / 2); ctx.scale(zz, zz); ctx.translate(-W / 2, -H / 2);
  ctx.drawImage(out, 0, 0); ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (rv >= 1) ctx.drawImage(TOP, 0, 0);
  if (o.post) o.post(ctx, t);
  if (!o.nobadge) badge(t);
}
window.renderFrame = renderFrame;
