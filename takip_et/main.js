'use strict';
const SH = []; const S = (a, b, fn, o = {}) => SH.push(Object.assign({ a, b, fn }, o));
const T_END = 17.79;
const vox = t => VOX[clamp(Math.round(t * 24), 0, VOX.length - 1)] || 0;
const talk = (t, a = 0, b = 15.6) => t >= a && t < b ? clamp(vox(t) * 1.4 - .08) : 0;
function badge(t) { C.save(); C.translate(W - 330, 110); C.rotate(.04);
  C.fillStyle = 'rgba(250,236,150,.92)'; C.fillRect(0, 0, 290, 78); C.strokeStyle = 'rgba(60,50,40,.6)'; C.lineWidth = 3; C.strokeRect(0, 0, 290, 78);
  C.fillStyle = 'rgba(230,220,200,.7)'; C.fillRect(110, -18, 70, 34);
  C.font = '700 46px Caveat'; C.fillStyle = '#2f2a2a'; C.textAlign = 'center'; C.textBaseline = 'middle'; C.fillText('murat250sr', 145, 42); C.restore(); }
function renderFrame(f) {
  const t = f / 24, td = Math.floor(t * 12) / 12; setAudio(t);
  const i = SH.findIndex(s => t >= s.a && t < s.b), sh = SH[i < 0 ? SH.length - 1 : i], lt = td - sh.a, d = sh.b - sh.a;
  BSEED = Math.floor(t * 12) % 4; BN = 0;
  C.setTransform(1, 0, 0, 1, 0, 0); C.globalAlpha = 1; C.drawImage(PAPER, 0, 0);
  const o = sh.fn(td, Math.max(0, lt), d, t) || {};
  C.setTransform(1, 0, 0, 1, 0, 0);
  // sayfa çevirme geçişi
  if (lt < .17 && i > 0) { const k = sm(lt / .17); C.save(); C.fillStyle = 'rgba(251,248,239,1)'; C.beginPath(); C.moveTo(W * k, 0); C.lineTo(W, 0); C.lineTo(W, H); C.lineTo(W * k - 120 * (1 - k), H); C.fill(); C.strokeStyle = 'rgba(0,0,0,.12)'; C.lineWidth = 8; C.stroke(); C.restore(); }
  if (!o.nobadge) badge(t);
}
window.renderFrame = renderFrame;
