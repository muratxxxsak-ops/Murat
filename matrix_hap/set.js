'use strict';
// ====== SETLER VE DEKOR ======
const GREEN = [60, 220, 110], RED = [220, 40, 40], BLUE = [50, 110, 230];
// konuşanlar: [başlangıç, bitiş, kim]
const SPK = [[0, 13.75, 'usta'], [13.8, 17.7, 'huseyin'], [17.7, 29.2, 'usta'], [29.6, 30.6, 'usta'], [31.1, 35.35, 'asist'], [35.4, 37.9, 'huseyin'], [40.6, 45.5, 'asist'], [45.5, 47.7, 'huseyin'], [47.7, 50.3, 'asist'], [50.3, 56, 'huseyin'],
  [56, 58.15, 'usta'], [58.2, 59.1, 'huseyin'], [59.1, 66, 'usta'], [76.3, 91, 'usta'], [94.6, 96, 'huseyin'], [99, 108.5, 'usta'], [111, 112.5, 'huseyin'], [120.3, 129.7, 'usta'], [130.8, 138.6, 'huseyin'], [139.6, 143.6, 'usta'],
  [144.4, 154, 'huseyin'], [154.7, 159.2, 'usta'], [160.1, 161.6, 'huseyin'], [162.9, 169.4, 'usta'], [170.1, 175.7, 'huseyin'], [175.7, 183, 'usta'], [183, 187.6, 'huseyin'], [190.4, 200.85, 'huseyin'], [200.85, 209.8, 'usta'], [210.8, 214.3, 'huseyin'],
  [215.4, 234.8, 'usta'], [236, 237.3, 'huseyin'], [237.85, 240.75, 'usta'], [240.8, 242.2, 'huseyin'], [243.3, 251.45, 'usta'], [251.45, 256.6, 'huseyin'], [258.1, 267.15, 'usta'], [267.2, 276.7, 'huseyin'], [276.7, 297, 'usta'], [297.6, 315.7, 'huseyin'],
  [316.6, 321.9, 'usta'], [321.9, 326.3, 'huseyin'], [327.2, 333.7, 'asist']];
function speaking(who, t) { for (const s of SPK) if (t >= s[0] && t < s[1]) return s[2] === who; return false; }
function mouthOf(who, t) { return speaking(who, t) ? clamp(vox(t) * 1.5 - .1) : 0; }
// ---- sığınak ----
function hideout(t, o = {}) {
  const fy = o.floor || 560;
  vgrad(0, fy, [[0, [28, 44, 42]], [1, [44, 62, 58]]]);
  // borular
  for (const [y, w] of [[40, 22], [80, 14]]) { sausage([-20, y], [W + 20, y + 8], w, [70, 80, 76]); }
  sausage([1150, 0], [1150, fy], 16, [80, 86, 80]);
  // monitör kulesi
  const mons = [[120, 200, 150, 120], [280, 220, 130, 110], [120, 330, 140, 110], [270, 340, 150, 120], [980, 210, 150, 120], [960, 340, 170, 130]];
  for (const [x, y, w, h] of mons) { slab(x, y, w, h, [70, 72, 70], 14); slab(x + 12, y + 10, w - 24, h - 30, [12, 30, 18], 10, { edge: false }); codeRain(x + 14, y + 12, w - 28, h - 34, t, x); glowC(x + w / 2, y + h / 2, w * .9, GREEN, .12); }
  // zemin
  vgrad(fy, H, [[0, [60, 52, 48]], [1, [36, 30, 30]]]);
  for (let i = 0; i < 9; i++) { C.strokeStyle = 'rgba(0,0,0,.15)'; C.lineWidth = 2; C.beginPath(); C.moveTo(640 + (i - 4) * 60, fy); C.lineTo(640 + (i - 4) * 260, H); C.stroke(); }
  // lamba
  if (o.lamp !== false) { sausage([640, -10], [640, 90], 3, [30, 30, 30]); ball(640, 110, 70, 34, [180, 150, 90], 0, { spec: .5 }); glowC(640, 200, 520, [255, 210, 140], .25); }
  if (o.alarm) { const a = (Math.sin(t * 9) > 0 ? 1 : 0) * o.alarm; C.save(); C.fillStyle = `rgba(255,30,20,${.25 * a})`; C.fillRect(0, 0, W, H); C.restore(); ball(640, 30, 40, 26, a ? [255, 60, 40] : [120, 30, 30], 0, { spec: .6 }); if (a) glowC(640, 30, 300, [255, 40, 30], .4); }
}
function codeRain(x, y, w, h, t, seed) { C.save(); C.beginPath(); C.rect(x, y, w, h); C.clip(); C.font = '700 13px JetBrains Mono'; const r = rng(seed); const cols = Math.floor(w / 11);
  for (let c = 0; c < cols; c++) { const sp = 30 + r() * 50, off = r() * 300; for (let k = 0; k < 12; k++) { const yy = y + ((t * sp + off + k * 14) % (h + 60)) - 30, a = 1 - k / 12; C.fillStyle = `rgba(120,255,150,${a * .85})`; C.fillText('アカ01タハ'[((c * 7 + k + Math.floor(t * 8)) % 6)], x + c * 11, yy); } } C.restore(); }
// geniş iki kişilik çekim (koltuklar)
function wide(t, o = {}) {
  hideout(t, o);
  // masa ve su bardağı
  slab(560, 470, 160, 20, [110, 80, 60], 8); sausage([600, 490], [596, 560], 8, [90, 64, 50]); sausage([680, 490], [684, 560], 8, [90, 64, 50]);
  ball(640, 455, 16, 22, [200, 230, 240], 0, { spec: .7 });
  softShadow(330, 570, 170, 26); softShadow(960, 570, 180, 26);
  armchair(330, 570, 100, [130, 34, 30]); armchair(960, 570, 100, [130, 34, 30]);
  const u = layer(() => toon(Object.assign({ who: 'usta', x: 330, y: 560, r: 58, face: .55, sit: 1, mouth: mouthOf('usta', t) }, o.u || {})), { sx: 10, sy: 6 });
  const h = layer(() => toon(Object.assign({ who: 'huseyin', x: 960, y: 560, r: 62, face: -.55, sit: 1, mouth: mouthOf('huseyin', t) }, o.h || {})), { sx: 10, sy: 6 });
  armchairFront(330, 570, 100, [130, 34, 30]); armchairFront(960, 570, 100, [130, 34, 30]);
  if (o.tespih !== false) tespih(h.hands[0][0], h.hands[0][1], 60, t);
  return { u, h };
}
// yakın plan (bulanık arka plan)
const BGC = mkc(W, H), BGX = BGC.getContext('2d');
function closeup(t, who, o = {}) {
  const prev = C; C = BGX; C.setTransform(1, 0, 0, 1, 0, 0); C.save(); C.translate(640, 360); C.scale(1.5, 1.5); C.translate(-640 + (who === 'usta' ? -250 : 250), -330); hideout(t, o); C.restore(); C = prev;
  C.save(); C.filter = 'blur(7px)'; C.drawImage(BGC, 0, 0); C.restore();
  if (o.alarm) { const a = (Math.sin(t * 9) > 0 ? 1 : 0) * o.alarm; C.fillStyle = `rgba(255,30,20,${.25 * a})`; C.fillRect(0, 0, W, H); }
  const x = (o.x || 640) + (o.dx || 0), r = o.r || 150, tl = CAST[who].tall, yy = (o.headY || 330) + .95 * r + 2.6 * r * tl;
  const res = layer(() => { if (o.chair !== false) { slab(x - 330, yy - 1.4 * r * tl - 2.5 * r, 660, 900, shade([130, 34, 30], .8), 120); }
    return toon(Object.assign({ who, x, y: yy, r, face: who === 'usta' ? .35 : -.35, sit: 1, mouth: mouthOf(who, t), noLegs: 1 }, o)); }, { sx: 18, sy: 12 });
  return res;
}
// ---- ara sahne dekoru ----
function stage(top, bot, fy = 560) { vgrad(0, fy, [[0, top], [1, shade(top, .8)]]); vgrad(fy, H, [[0, bot], [1, shade(bot, .7)]]); }
function cloudFrame(t, col = [255, 250, 240]) { // hayal balonu kenarı
  const g = C.createRadialGradient(640, 360, 300, 640, 360, 760); g.addColorStop(0, cs(col, 0)); g.addColorStop(.55, cs(col, .55)); g.addColorStop(1, cs(col, 1)); C.fillStyle = g; C.fillRect(0, 0, W, H); }
function house(x, y, w, h, col = [220, 190, 150], roof = [170, 70, 50]) { slab(x - w / 2, y - h, w, h, col, 10); C.beginPath(); C.moveTo(x - w / 2 - 20, y - h + 4); C.lineTo(x, y - h - w * .45); C.lineTo(x + w / 2 + 20, y - h + 4); C.closePath(); C.fillStyle = cs(roof); C.fill(); }
function coinBag(x, y, s, label2 = '₺') { ball(x, y, s, s * .9, [200, 170, 90], 0, { spec: .4 }); ball(x, y - s * .95, s * .35, s * .2, [180, 150, 70]); label(label2, x, y + s * .1, s * .9, [90, 60, 20]); }
function bed(x, y, s, col = [90, 130, 220]) { slab(x - s, y - s * .55, s * 2, s * .5, [240, 236, 226], 14); slab(x - s * 1.05, y - s * .95, s * .25, s * .95, [120, 80, 60], 10); slab(x - s * .4, y - s * .62, s * 1.4, s * .42, col, 16); ball(x - s * .65, y - s * .65, s * .3, s * .16, [250, 250, 250]); }
function robot(x, y, s, t, eye = RED) { slab(x - s * .6, y - s * 2.2, s * 1.2, s * 1.3, [120, 126, 136], 14); slab(x - s * .45, y - s * 3.0, s * .9, s * .75, [140, 146, 156], 12); ball(x - s * .2, y - s * 2.65, s * .12, s * .12, eye, 0, { spec: .8 }); ball(x + s * .2, y - s * 2.65, s * .12, s * .12, eye, 0, { spec: .8 }); glowC(x, y - s * 2.65, s * .8, eye, .4);
  for (const sd of [-1, 1]) { limbS([[x + sd * s * .7, y - s * 2.0], [x + sd * s * 1.0, y - s * 1.5 + Math.sin(t * 4 + sd) * s * .2]], s * .16, [100, 106, 116]); limbS([[x + sd * s * .3, y - s * .9], [x + sd * s * .35, y]], s * .2, [100, 106, 116]); }
  sausage([x, y - s * 3.0], [x, y - s * 3.4], s * .04, [80, 80, 80]); ball(x, y - s * 3.45, s * .08, s * .08, eye); }
