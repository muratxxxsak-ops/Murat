'use strict';
const cv = document.getElementById('cv'), ctx = cv.getContext('2d');
const PER = 60 / ENERGY.bpm, B0 = ENERGY.ph, bph = t => (t - B0) / PER;
const pulse = t => { let f = bph(t) % 1; if (f < 0) f += 1; return Math.pow(1 - f, 3); };
const T_END = 189.98;
const SH = []; const S = (a, b, fn, o = {}) => SH.push(Object.assign({ a, b, fn }, o));
const mk = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
const BLM = mk(320, 180), BX = BLM.getContext('2d');
const GR = [0, 1, 2, 3, 4, 5].map(k => { const g = mk(640, 360), x = g.getContext('2d'), id = x.createImageData(640, 360), r = rng(900 + k); for (let i = 0; i < id.data.length; i += 4) { const v = 128 + (r() + r() + r() - 1.5) * 120; id.data[i] = id.data[i + 1] = id.data[i + 2] = v; id.data[i + 3] = 255; } x.putImageData(id, 0, 0); return g; });
// karakter kısayolu
function man(P, x, z, yaw, o = {}) { return Object.assign({ type: 1, yaw, J: skeleton(P, x, z, yaw, o.h || 1.82, 0), headYaw: P.headYaw || 0 }, o); }
function woman(P, x, z, yaw, o = {}) { return Object.assign({ type: 2, yaw, J: skeleton(P, x, z, yaw, o.h || 1.66, 1), headYaw: P.headYaw || 0 }, o); }
function enemy(P, x, z, yaw, o = {}) { return Object.assign({ type: 3, yaw, J: skeleton(P, x, z, yaw, o.h || 1.85, 0), headYaw: P.headYaw || 0 }, o); }
function renderFrame(f) {
  const t = f / 24; setAudio(t); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; ctx.filter = 'none';
  const i = SH.findIndex(s => t >= s.a && t < s.b), sh = SH[i < 0 ? SH.length - 1 : i], lt = t - sh.a, d = sh.b - sh.a;
  const sc = sh.fn(t, lt, d) || {};
  if (sc.cam) { const shk = sc.shake || 0; if (shk) { sc.cam.p = [sc.cam.p[0] + Math.sin(t * 61) * shk, sc.cam.p[1] + Math.cos(t * 47) * shk, sc.cam.p[2]]; } sc.t = t; const g = scene3d(sc); ctx.filter = 'contrast(1.22) brightness(.9)'; ctx.drawImage(g, 0, 0, W, H); ctx.filter = 'none'; } else { ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H); }
  if (sc.over) sc.over(ctx, t, lt, d);
  // ışık taşması (bloom)
  BX.clearRect(0, 0, 320, 180); BX.filter = 'blur(5px) brightness(1.15)'; BX.drawImage(cv, 0, 0, 320, 180); BX.filter = 'none';
  ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.globalAlpha = sc.bloom === undefined ? .5 : sc.bloom; ctx.drawImage(BLM, 0, 0, W, H); ctx.restore();
  if (sc.post) sc.post(ctx, t, lt, d);
  const g = ctx.createRadialGradient(W / 2, H / 2, H * .3, W / 2, H / 2, H * .95); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, `rgba(0,0,0,${sc.vig === undefined ? .55 : sc.vig})`); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  ctx.save(); ctx.globalCompositeOperation = 'overlay'; ctx.globalAlpha = .16; ctx.drawImage(GR[f % 6], ((f * 37) % 40) - 40, ((f * 53) % 40) - 40, W + 80, H + 80); ctx.restore();
  const xf = sh.x === undefined ? .25 : sh.x; if (xf > 0 && lt < xf) { ctx.fillStyle = `rgba(0,0,0,${1 - sm(lt / xf)})`; ctx.fillRect(0, 0, W, H); }
  if (sh.xo && lt > d - sh.xo) { ctx.fillStyle = `rgba(0,0,0,${sm((lt - d + sh.xo) / sh.xo)})`; ctx.fillRect(0, 0, W, H); }
  if (sc.flash) { ctx.fillStyle = `rgba(255,250,240,${sc.flash})`; ctx.fillRect(0, 0, W, H); }
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, 66); ctx.fillRect(0, H - 66, W, 66);
  if (!sc.nobadge) badge(t);
  const fi = Math.max(1 - t / 1.5, 0); if (fi > 0) { ctx.fillStyle = `rgba(0,0,0,${fi})`; ctx.fillRect(0, 0, W, H); }
  const fo = seg(t, T_END - 1.5, T_END); if (fo > 0) { ctx.fillStyle = `rgba(0,0,0,${fo})`; ctx.fillRect(0, 0, W, H); }
}
function badge(t) { ctx.save(); ctx.font = `700 23px ${SANS}`; ctx.letterSpacing = '4px'; ctx.textAlign = 'right'; const w = ctx.measureText('murat250sr').width;
  ctx.fillStyle = `rgba(255,190,90,${.7 + .3 * pulse(t)})`; ctx.fillRect(W - 44 - w - 16, H - 38, 4, 18);
  ctx.fillStyle = '#ece6da'; ctx.shadowColor = 'rgba(0,0,0,.9)'; ctx.shadowBlur = 6; ctx.fillText('murat250sr', W - 40, H - 22); ctx.restore(); }
