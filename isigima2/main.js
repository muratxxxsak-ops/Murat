'use strict';
const cv = document.getElementById('cv'), ctx = cv.getContext('2d');
const PER = 60 / ENERGY.bpm, B0 = ENERGY.ph;
const T_END = 189.96;
const SH = []; const S = (a, b, fn, o = {}) => SH.push(Object.assign({ a, b, fn }, o));
const PAPER = 'rgb(236,226,204)', INKC = 'rgb(26,22,20)';
function badge(t) {
  const x = W - 206, y = H - 58, w = 182, h = 36;
  ctx.save();
  ctx.fillStyle = 'rgba(236,226,204,.94)'; ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = INKC; ctx.lineWidth = 1.5; ctx.strokeRect(x + .5, y + .5, w - 1, h - 1); ctx.lineWidth = .8; ctx.strokeRect(x + 4.5, y + 4.5, w - 9, h - 9);
  const g = ctx.createLinearGradient(x, 0, x + w, 0); const s = (t * .25) % 1;
  g.addColorStop(0, '#8a5a1c'); g.addColorStop(clamp(s), '#f3d48a'); g.addColorStop(1, '#8a5a1c');
  ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(x + 18, y + h / 2 - 6); ctx.lineTo(x + 24, y + h / 2); ctx.lineTo(x + 18, y + h / 2 + 6); ctx.lineTo(x + 12, y + h / 2); ctx.fill();
  ctx.font = `600 19px ${FONT}`; ctx.letterSpacing = '1.5px'; ctx.fillStyle = INKC; ctx.textBaseline = 'middle'; ctx.fillText('murat250sr', x + 33, y + h / 2 + 1);
  ctx.restore();
}
function frameBorder() {
  ctx.save(); ctx.fillStyle = PAPER; ctx.fillRect(0, 0, W, 10); ctx.fillRect(0, H - 10, W, 10); ctx.fillRect(0, 0, 10, H); ctx.fillRect(W - 10, 0, 10, H);
  ctx.strokeStyle = INKC; ctx.lineWidth = 2; ctx.strokeRect(10, 10, W - 20, H - 20); ctx.lineWidth = .8; ctx.strokeRect(5.5, 5.5, W - 11, H - 11); ctx.restore();
}
let SEED = 0;
function renderFrame(f) {
  const t = f / 24, td = Math.floor(t * 12) / 12; setAudio(t);
  const i = SH.findIndex(s => t >= s.a && t < s.b), sh = SH[i < 0 ? SH.length - 1 : i], lt = td - sh.a, d = sh.b - sh.a;
  C.setTransform(1, 0, 0, 1, 0, 0); C.globalAlpha = 1; C.globalCompositeOperation = 'source-over'; C.fillStyle = ink(.1, 0); C.fillRect(0, 0, W, H);
  G.setTransform(1, 0, 0, 1, 0, 0); G.globalCompositeOperation = 'source-over'; G.fillStyle = '#000'; G.fillRect(0, 0, W / 2, H / 2);
  LIGHTS = []; setCam({});
  const o = sh.fn(td, Math.max(0, lt), d, t) || {};
  C.setTransform(1, 0, 0, 1, 0, 0);
  SEED = (i < 0 ? 0 : i) % 3;
  let pf = o.paperFade || 0;
  const xi = sh.xi === undefined ? 0 : sh.xi; if (xi > 0 && t - sh.a < xi) pf = Math.max(pf, 1 - sm((t - sh.a) / xi));
  if (sh.xo && t > sh.b - sh.xo) pf = Math.max(pf, sm((t - sh.b + sh.xo) / sh.xo));
  const out = engrave({ off: o.off || [0, 0], seed: SEED, t, sp: o.sp, flash: o.flash, paperFade: pf, inkFade: o.inkFade, warm: o.warm });
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  if (o.shake) { ctx.fillStyle = PAPER; ctx.fillRect(0, 0, W, H); ctx.drawImage(out, Math.sin(t * 71) * o.shake, Math.cos(t * 53) * o.shake); } else ctx.drawImage(out, 0, 0);
  if (o.post) o.post(ctx, t);
  frameBorder();
  if (!o.nobadge) badge(t);
}
window.renderFrame = renderFrame;
