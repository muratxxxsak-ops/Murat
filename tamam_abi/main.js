'use strict';
const T_END = 110.79;
const C1 = [10, 13, 16, 18.2, 20], C2 = [43, 46, 49, 52, 55], C3 = [82, 86, 90, 94, 101];
const VIO = [[96, 40, 200], [236, 70, 160]], TEAL = [[20, 150, 160], [250, 210, 70]], ORG = [[255, 120, 60], [255, 70, 110]], NIGHT = [[30, 20, 70], [120, 40, 150]], SUN = [[255, 200, 60], [255, 90, 90]], MINT = [[40, 190, 140], [60, 120, 230]];
const ease = (a, b, t) => lerp(a, b, sm(t));
function live(t, lt, o = {}) {
  bg(o.c1 || [70, 30, 150], o.c2 || [220, 60, 140]); ui(lt, t);
  rr(300, 84, 90, 30, 8, RED); txtv('CANLI', 345, 106, 18, {}); txtv(((12400 - (o.drop ? Math.min(lt, 8) * 1500 : 0)) | 0).toLocaleString('tr-TR') + ' izliyor', 205, 140, 17, { a: .85, w: 700 });
  for (let i = 0; i < 6; i++) { const p = ((t * 0.4 + i / 6) % 1); heartV(330 + Math.sin(i * 2 + t * 3) * 30, 640 - p * 420, 0.9, i % 2 ? RED : PNK, 1 - p); }
  const fl = ((bph(t) | 0) % 2) * (o.nof ? 0 : 1);
  abi(205, 650, 1.3, { t, flex: fl && !o.nof, sad: false });
}
function mouth(lt) { return Math.abs(Math.sin(lt * 14)) > .4; }
function bub(x, y, s, a = 1) { v.save(); v.globalAlpha = a; v.font = `800 20px ${SANS}`; const w = v.measureText(s).width + 30; rr(x - w / 2, y - 24, w, 44, 16, WHT, { ls: 4 }); txtv(s, x, y + 6, 20, { col: INK }); v.restore(); }
// ---------- yan tarafları çizen yardımcılar ----------
function cheer(t, side) { /* kalabalık yorum etiketleri */ }
function lft(fn, x = 215, y = 400, s = 1.25, r = 0) { stk(fn, x, y, s, r); }
function chorusPh(t, k, lt) {
  if (k === 0) { live(t, lt); bub(205 + Math.sin(t * 5) * 6, 300, ['blabla', 'bla bla', 'blabla bla'][((lt * 3) | 0) % 3], 1); }
  if (k === 1) { live(t, lt, { nof: 1 }); errBox(205, 270, 300, 'HATA', 'Akıl bulunamadı', sm(lt * 3)); }
  if (k === 2) { live(t, lt, { nof: 1, c1: [150, 20, 40], c2: [240, 80, 60] }); for (let i = 0; i < 5; i++) { const p = (lt * 1.5 + i / 5) % 1; disc(150 + i * 25, 440 - p * 120, 10 + p * 14, WHT, { a: (1 - p) * .6 }); } }
  if (k === 3) { live(t, lt, { drop: 1 }); }
}
function chorusL(t, k, lt, cb) {
  if (k === 0) lft(() => { hero(0, 150, 1.5, { t, sad: true }); }, 215, 420);
  if (k === 1) lft(() => { hero(0, 150, 1.5, { t }); v.strokeStyle = rgba(INK); v.lineWidth = 9; v.lineCap = 'round'; v.beginPath(); v.moveTo(36, -90); v.lineTo(58, -190 + Math.sin(t * 10) * 5); v.stroke(); }, 215, 420);
  if (k === 2) lft(() => { hero(0, 150, 1.5, { t }); v.fillStyle = rgba([240, 190, 140]); v.strokeStyle = rgba(INK); v.lineWidth = 6; v.beginPath(); v.roundRect(34, -190, 40, 60, 10); v.fill(); v.stroke(); }, 215 + Math.sin(t * 6) * 3, 420);
}
function chorusR(t, k, lt) {
  if (k === 0) { stk(() => { txtv('tamam', 0, 0, 90, { col: YEL, stroke: 14 }); }, 1060, 300, 1, -0.12 + .02 * pulse(t)); stk(() => { txtv('abi', 0, 0, 120, { col: WHT, stroke: 16 }); }, 1080, 420, 1, 0.1 - .02 * pulse(t)); }
  if (k === 1) { const it = [() => car(0, 60, 1.1), () => watchV(0, 0, 1), () => plane(0, 0, 1.2)]; it.forEach((f, i) => stk(f, 960 + i * 130 - 40, 300 + Math.abs(Math.sin(t * 5 + i)) * -30 + i * 110, 0.9, i * 0.15 - .15)); }
  if (k === 2) stk(() => { tea(0, 80, 2.4); for (let i = 0; i < 3; i++) { v.strokeStyle = 'rgba(255,255,255,.8)'; v.lineWidth = 8; v.lineCap = 'round'; v.beginPath(); v.moveTo(-20 + i * 20, -60); v.quadraticCurveTo(-34 + i * 20, -100 - ((t * 40) % 40), -20 + i * 20, -140); v.stroke(); } }, 1060, 380, 1, 0);
}
// ---------- sahneler ----------
const SH = [];
const add = (a, b, pal, ph, L, R, ex) => SH.push({ a, b, pal, ph, L, R, ex });
add(0, 5, NIGHT, (t, lt) => { live(t, lt); bub(205, 300, 'blabla...', sm(lt - 1)); },
  (t, lt) => { lft(() => { hero(0, 150, 1.5, { t, sad: true }); phoneIn(60, -60, 1); }, 215, 420); },
  (t, lt) => { ['efsane abi', 'ne kadar zengin', 'abi bi dur'].forEach((s, i) => { const p = sm(seg(lt, 1 + i * 0.9, 1.5 + i * 0.9)); stk(() => { v.font = `800 30px ${SANS}`; const w = v.measureText(s).width + 40; rr(-w / 2, -26, w, 52, 26, i === 2 ? [90, 90, 100] : BLU); txtv(s, 0, 10, 30, {}); }, 1040, 260 + i * 100, p, (i - 1) * .06, { a: p }); }); });
add(5, 10, NIGHT, (t, lt) => { live(t, lt); }, (t, lt) => { lft(() => { hero(0, 150, 1.5, { t }); }, 215, 420); }, null, 'title');
add(10, 13, SUN, (t, lt) => chorusPh(t, 0, lt), (t, lt) => chorusL(t, 0, lt), (t, lt) => chorusR(t, 0, lt));
add(13, 16, SUN, (t, lt) => chorusPh(t, 1, lt), (t, lt) => chorusL(t, 1, lt), (t, lt) => chorusR(t, 1, lt));
add(16, 18.2, SUN, (t, lt) => chorusPh(t, 2, lt), (t, lt) => chorusL(t, 2, lt), (t, lt) => chorusR(t, 2, lt));
add(18.2, 20, SUN, (t, lt) => chorusPh(t, 3, lt), null, null, 'ride');
// verse 1
add(20, 22.5, TEAL, (t, lt) => { bg([30, 160, 200], [250, 210, 120]); ui(lt, t); stk(() => car(0, 30, 1.9), 205, 400, 1, -.04 + .01 * pulse(t)); txtv('benim arabam', 205, 220, 36, { col: WHT, stroke: 8 }); },
  (t, lt) => lft(() => { hero(0, 150, 1.5, { t, sad: false }); }, 215, 420),
  (t, lt) => { stk(() => { rr(-110, -60, 220, 120, 14, WHT, { ls: 6 }); txtv('KİRALIK', 0, 12, 56, { col: RED }); }, 1060, 330 + Math.sin(t * 3) * 8, 1, .12); stk(() => { txtv('250₺ / gün', 0, 0, 40, { col: INK, stroke: 0 }); }, 1060, 440, 1, .12); });
add(22.5, 25, TEAL, (t, lt) => { bg([240, 190, 60], [250, 130, 90]); ui(lt, t); stk(() => watchV(0, 0, 2.3), 205, 380, 1, Math.sin(t * 2) * .05); },
  (t, lt) => lft(() => { watchV(0, 0, 2.2); }, 215, 380, 1, .08),
  (t, lt) => { const p = sm(seg(lt, .5, .9)); stk(() => { txtv('ÇAKMA', 0, 0, 100, { col: RED, stroke: 12, sc: WHT }); }, 1060, 360, 1.6 - .6 * p, -.2, { a: p }); });
add(25, 27.5, TEAL, (t, lt) => { bg([60, 120, 230], [140, 220, 250]); ui(lt, t); const x = ease(-80, 480, lt / 2.5); stk(() => plane(0, 0, 2), x, 330, 1, -.1); txtv('özel jet', 205, 560, 52, { col: WHT, stroke: 10 }); },
  (t, lt) => lft(() => { hero(0, 150, 1.5, { t }); v.fillStyle = rgba([240, 190, 140]); v.strokeStyle = rgba(INK); v.lineWidth = 6; v.beginPath(); v.roundRect(-70, -170, 40, 40, 10); v.fill(); v.stroke(); }, 215, 420),
  (t, lt) => { stk(() => card(0, 0, 1.7, 'AKBİL', [255, 200, 60]), 1050, 360, 1, -.12 + .02 * pulse(t)); stk(() => { txtv('cebimde', 0, 0, 36, { col: WHT, stroke: 8 }); }, 1050, 500, 1, -.12); });
add(27.5, 30, MINT, (t, lt) => { bg([30, 30, 50], [60, 60, 100]); ui(lt, t); const m = [['dün tanıştık', 0, 0], ['kardeşim', 1, 1.2], ['bugün abi', 1, 2.2]]; m.forEach(([s, me, d], i) => { const p = sm(seg(lt, d, d + .25)); bubble(s, me ? 380 : 24, 190 + i * 70, me, p); }); const c = sm(seg(lt, 1.6, 2)); stk(() => { rr(-70, -76, 140, 140, 14, WHT, { ls: 6 }); rr(-70, -76, 140, 40, 10, RED, { ls: 6 }); txtv('DÜN', 0, 30, 52, { col: INK }); }, 105, 520, c, -.1); stk(() => { rr(-70, -76, 140, 140, 14, WHT, { ls: 6 }); rr(-70, -76, 140, 40, 10, BLU, { ls: 6 }); txtv('BUGÜN', 0, 30, 36, { col: INK }); }, 300, 520, c, .1); },
  (t, lt) => lft(() => { hero(0, 150, 1.5, { t, sad: true }); }, 215, 420),
  (t, lt) => stk(() => { abi(0, 150, 1.3, { t, flex: 0 }); txtv('kardeşim!', 70, -160, 36, { col: YEL, stroke: 8 }); }, 1060, 400, 1.25));
add(30, 32.5, MINT, (t, lt) => { bg([30, 30, 50], [60, 60, 100]); ui(lt, t); bubble('kardeşim 500 lira atsan', 380, 200, 1, 1, 330); bubble('yarın veririm', 24, 270, 0, sm(seg(lt, .6, .9))); stk(() => { rr(-70, -76, 140, 140, 14, WHT, { ls: 6 }); rr(-70, -76, 140, 40, 10, GRN, { ls: 6 }); txtv('YARIN', 0, 30, 42, { col: INK }); }, 205, 480, 1 + .06 * pulse(t), 0); },
  (t, lt) => lft(() => { hero(0, 150, 1.5, { t }); const p = sm(seg(lt, 1, 1.5)); v.fillStyle = rgba(INK); v.save(); v.globalAlpha = p; v.fillRect(-210, -300, 150, 14); v.restore(); }, 215, 420),
  (t, lt) => { stk(() => { rr(-130, -60, 260, 120, 8, [30, 30, 40], { ls: 6 }); v.fillStyle = 'rgba(255,255,255,.25)'; for (let i = 0; i < 6; i++) v.fillRect(-120 + i * 42, -52, 24, 14); for (let i = 0; i < 6; i++) v.fillRect(-120 + i * 42, 38, 24, 14); txtv('BU FİLM', 0, -2, 40, { col: WHT }); txtv('TANIDIK', 0, 36, 40, { col: YEL }); }, 1060, 360, 1, .1 + Math.sin(t * 4) * .02); });
add(32.5, 35, VIO, (t, lt) => { bg([30, 30, 50], [90, 40, 120]); ui(lt, t); for (let i = 0; i < 9; i++) { const x = 30 + (i % 3) * 120, y = 100 + ((i / 3) | 0) * 190; v.save(); v.beginPath(); v.rect(x, y, 110, 180); v.clip(); v.fillStyle = rgba(mix([90, 60, 160], [250, 150, 80], (i % 4) / 4)); v.fillRect(x, y, 110, 180); abi(x + 55, y + 190, 0.5, { t: t + i, flex: ((bph(t) | 0) + i) % 2 }); v.restore(); } },
  (t, lt) => lft(() => { abi(0, 150, 1.5, { t, flex: 1 }); }, 215, 420),
  (t, lt) => { stk(() => { dumbbell(0, 0, 2, 0); }, 1060, 330, 1, Math.sin(t * 5) * .15); stk(() => { txtv('KAS', 0, 0, 110, { col: RED, stroke: 14, sc: WHT }); }, 1060, 500, 1 + .08 * KK, -.1); });
add(35, 37.5, VIO, (t, lt) => { bg([30, 30, 50], [90, 40, 120]); ui(lt, t); abi(205, 650, 1.3, { t, flex: 1 }); bub(205, 230, 'kas var tamam da...', 1); },
  (t, lt) => lft(() => { hero(0, 150, 1.5, { t }); v.strokeStyle = rgba(INK); v.lineWidth = 9; v.lineCap = 'round'; v.beginPath(); v.moveTo(36, -90); v.lineTo(40, -130); v.lineTo(10, -205); v.stroke(); }, 215, 420),
  (t, lt) => stk(() => { abi(0, 190, 1.2, { t, flex: 0 }); const p = sm(seg(lt, .5, 1.2)); v.fillStyle = rgba(WHT); v.strokeStyle = rgba(INK); v.lineWidth = 5; v.beginPath(); v.arc(120, -230, 20 * p, 0, TAU); v.fill(); v.stroke(); txtv('?', 120, -218, 30 * p, { col: INK }); }, 1060, 380, 1.2));
add(37.5, 40.5, SUN, (t, lt) => { bg([255, 170, 90], [250, 220, 140]); ui(lt, t); v.fillStyle = rgba([150, 120, 100]); v.fillRect(0, 560, 405, 160); for (let i = 0; i < 4; i++) { v.fillStyle = rgba([[220, 120, 100], [240, 190, 120], [180, 130, 100], [210, 160, 140]][i]); v.fillRect(i * 100 + 6, 300, 92, 260); v.fillStyle = 'rgba(255,255,255,.6)'; v.fillRect(i * 100 + 24, 340, 28, 40); v.fillRect(i * 100 + 62, 340, 24, 40); } stk(() => { hero(0, 100, 1.2, { t, walk: 1 }); }, 120 + Math.sin(t) * 6, 560); stk(() => bike(0, 40, 1.5), 300, 600); },
  (t, lt) => lft(() => { mother(0, 160, 1.5, t); for (let i = 0; i < 12; i++) { const a = i / 12 * TAU + t; v.strokeStyle = 'rgba(255,230,120,.8)'; v.lineWidth = 6; v.beginPath(); v.moveTo(Math.cos(a) * 130, -120 + Math.sin(a) * 130); v.lineTo(Math.cos(a) * 160, -120 + Math.sin(a) * 160); v.stroke(); } }, 215, 400),
  (t, lt) => { stk(() => bike(0, 80, 2.4), 1050, 400, 1, -.05 + .02 * pulse(t)); stk(() => { txtv('annemin duası', 0, 0, 44, { col: WHT, stroke: 10 }); }, 1050, 220, 1, .06); });
add(40.5, 43, SUN, (t, lt) => { bg([90, 90, 120], [60, 60, 90]); ui(lt, t); const p = (lt * 2) % 1; v.strokeStyle = 'rgba(255,255,255,.8)'; v.lineWidth = 8; v.beginPath(); v.arc(205, 400, 50, lt * 8, lt * 8 + 4.5); v.stroke(); },
  (t, lt) => lft(() => { hero(0, 150, 1.5, { t }); txtv('¯\\_(ツ)_/¯', 0, -260, 36, { col: WHT, stroke: 8 }); }, 215, 420), null);
// chorus 2
for (let k = 0; k < 4; k++) add(C2[k], C2[k + 1], SUN, (t, lt) => k === 0 ? (live(t, lt), bub(205, 300, 'blabla', 1)) : chorusPh(t, k, lt), (t, lt) => k < 3 ? chorusL(t, k, lt) : 0, (t, lt) => k < 3 ? chorusR(t, k, lt) : 0, k === 3 ? 'ride' : 0);
// verse 2
add(56, 59, ORG, (t, lt) => { bg([30, 30, 50], [60, 60, 100]); ui(lt, t); bubble('Neyin var?', 24, 200, 0, sm(seg(lt, .3, .5))); bubble('Bir gönlüm var', 380, 270, 1, sm(seg(lt, 1.3, 1.6))); heartV(205, 460, 3 + .3 * pulse(t), RED, sm(seg(lt, 1.7, 2.2))); },
  (t, lt) => lft(() => { girl(0, 150, 1.5, t); }, 215, 420), (t, lt) => lft(() => { hero(0, 150, 1.5, { t }); }, 1060, 420));
add(59, 62, ORG, (t, lt) => { bg([240, 200, 140], [255, 140, 110]); ui(lt, t); bubble('Araban?', 24, 200, 0, sm(seg(lt, .2, .5))); stk(() => bus(0, 60, 1.1), ease(480, 205, seg(lt, 1, 1.8)), 440); },
  (t, lt) => lft(() => { girl(0, 150, 1.5, t); }, 215, 420), (t, lt) => stk(() => { bus(0, 70, 1.4); txtv('Otobüs yeter', 0, -140, 40, { col: WHT, stroke: 10 }); hero(100, 70, .7, { t }); }, 1060, 380));
add(62, 65, ORG, (t, lt) => { const c = lt < 1.5; bg(c ? [40, 10, 70] : [250, 220, 160], c ? [200, 30, 150] : [255, 180, 100]); ui(lt, t); if (c) { for (let i = 0; i < 5; i++) { const a = i * 1.2 + t * 2; v.save(); v.globalCompositeOperation = 'lighter'; v.fillStyle = rgba([[255, 60, 150], [60, 220, 255], [255, 220, 60]][i % 3], .25); v.beginPath(); v.moveTo(205 + i * 40 - 80, 80); v.lineTo(205 + Math.sin(a) * 200, 700); v.lineTo(205 + Math.sin(a) * 200 + 60, 700); v.fill(); v.restore(); } bottle(120, 540, 2, [60, 200, 255]); bottle(290, 540, 2, [250, 200, 60]); txtv('masa', 205, 640, 60, { col: WHT, stroke: 10 }); } else { stk(() => tea(0, 40, 2.6), 120, 470); stk(() => simit(0, 0, 1.6), 290, 430); txtv('simitçide çay', 205, 640, 46, { col: INK, stroke: 0 }); } },
  (t, lt) => lft(() => { abi(0, 150, 1.5, { t, flex: 0 }); }, 215, 420), (t, lt) => lft(() => { hero(0, 150, 1.5, { t }); }, 1060, 420));
add(65, 68, ORG, (t, lt) => { bg([240, 240, 230], [220, 220, 200]); ui(lt, t); stk(() => { rr(-110, -170, 220, 340, 6, WHT, { ls: 5 }); for (let i = 0; i < 6; i++) txtv('— — — — —', 0, -120 + i * 36, 22, { col: INK, a: .7 }); txtv('HESAP', 0, -140, 28, { col: INK }); const p = lt < 1.5 ? 1 : 0; if (p) txtv('÷ 2', 0, 130, 60, { col: RED }); }, 205, 400, 1, -.04); if (lt > 1.5) { burst(205, 450, 120 + 12 * pulse(t), 12, YEL, t); txtv('ısmarlarım', 205, 462, 36, { col: INK }); } },
  (t, lt) => lft(() => { abi(0, 150, 1.5, { t, flex: 0 }); }, 215, 420), (t, lt) => lft(() => { hero(0, 150, 1.5, { t }); }, 1060, 420), 'vay');
add(68, 71, NIGHT, (t, lt) => { bg([40, 40, 60], [70, 70, 100]); ui(lt, t); bubble('fakir', 24, 200, 0, sm(seg(lt, .2, .4))); bubble('fakir ahaha', 24, 270, 0, sm(seg(lt, .6, .8))); bubble('fakir', 24, 340, 0, sm(seg(lt, 1, 1.2))); bubble('hahaha :)', 380, 440, 1, sm(seg(lt, 1.6, 1.8))); },
  (t, lt) => lft(() => { hero(0, 150, 1.5, { t }); }, 215 + Math.sin(t * 9) * 4, 420 + Math.abs(Math.sin(t * 9)) * -8), (t, lt) => stk(() => { txtv('FAKİR', 0, 0, 100, { col: RED, stroke: 14, sc: WHT }); }, 1060, 360, 1, .08));
add(71, 75, MINT, (t, lt) => { bg([210, 230, 255], [250, 240, 200]); ui(lt, t); v.fillStyle = rgba([120, 110, 100]); v.fillRect(150, 300, 105, 420); v.save(); v.translate(205, 330); v.fillStyle = rgba([200, 160, 90]); v.fillRect(-170, 0, 125, 56); v.fillRect(45, 0, 125, 56); v.restore(); txtv('ZENGİN', 100, 350, 36, { col: INK }); txtv('ADAM', 310, 350, 36, { col: INK }); stk(() => hero(0, 100, 1.2, { t, walk: 1 }), ease(205, 310, seg(lt, 1.5, 3)), 640); },
  (t, lt) => lft(() => { rr(-110, -60, 220, 100, 8, [40, 140, 80], { ls: 6 }); txtv('ADAM OL', 0, 14, 48, {}); }, 215, 340, 1, -.08), (t, lt) => lft(() => { rr(-110, -60, 220, 100, 8, [150, 150, 160], { ls: 6 }); txtv('zengin', 0, 14, 48, { col: [200, 200, 210] }); }, 1060, 340, 1, .1));
add(75, 79, SUN, (t, lt) => { bg([255, 220, 120], [255, 160, 90]); ui(lt, t); stk(() => { v.fillStyle = rgba([200, 160, 60]); v.strokeStyle = rgba(INK); v.lineWidth = 6; v.fillRect(-90, 40, 180, 80); v.strokeRect(-90, 40, 180, 80); abi(0, 40, 1.2, { t, flex: ((bph(t) | 0) % 2) }); }, 205, 480); txtv('EFSANE', 205, 190, 70, { col: WHT, stroke: 12 }); for (let i = 0; i < 28; i++) { const r = rng(i + 90)(); v.fillStyle = rgba([RED, BLU, GRN, YEL][i % 4]); v.fillRect((r * 405 + i * 40) % 405, ((t * 120 + i * 77) % 700), 8, 14); } },
  (t, lt) => lft(() => { hero(0, 150, 1.5, { t }); v.strokeStyle = rgba(INK); v.lineWidth = 9; v.lineCap = 'round'; v.beginPath(); v.moveTo(36, -90); v.lineTo(70, -90 + Math.sin(t * 5) * 20); v.stroke(); }, 215, 420), (t, lt) => stk(() => { txtv('tamam tamam', 0, 0, 56, { col: WHT, stroke: 12 }); txtv('anladım', 0, 56, 56, { col: YEL, stroke: 12 }); }, 1060, 380, 1, .08));
add(79, 82, NIGHT, (t, lt) => { const p = sm(seg(lt, .6, 1.8)); bg([30, 30, 50], [70, 70, 100]); ui(lt, t); stk(() => { abi(0, 140, 1.3 - .2 * p, { t, flex: 0, shades: p < .6 }); if (p > .5) { v.fillStyle = rgba(INK); v.beginPath(); v.arc(-11, -150, 3, 0, TAU); v.fill(); } }, 205, 480); for (let i = 0; i < 3; i++) txtv('?', 80 + i * 120, 190 + Math.sin(t * 5 + i) * 10, 80 * p, { col: YEL, stroke: 10 }); },
  (t, lt) => lft(() => { hero(0, 150, 1.5, { t }); }, 215, 420), (t, lt) => stk(() => { txtv('sen kimsin', 0, 0, 62, { col: WHT, stroke: 12 }); txtv('nesin?', 0, 66, 80, { col: YEL, stroke: 14 }); }, 1060, 360, 1.05 + .06 * pulse(t), -.08));
// chorus 3
for (let k = 0; k < 4; k++) add(C3[k], C3[k + 1], SUN, (t, lt) => k === 0 ? (live(t, lt), bub(205, 300, 'blabla', 1)) : chorusPh(t, k, lt), (t, lt) => k < 3 ? chorusL(t, k, lt) : 0, (t, lt) => k < 3 ? chorusR(t, k, lt) : 0, k === 3 ? 'ride' : 0);
add(101, 106, NIGHT, (t, lt) => { live(t, lt, { drop: 1 }); errBox(205, 400, 300, 'CANLI YAYIN', 'sona erdi', sm(seg(lt, 1, 1.4))); },
  (t, lt) => lft(() => { hero(0, 150, 1.5, { t }); v.strokeStyle = rgba(INK); v.lineWidth = 9; v.lineCap = 'round'; v.beginPath(); v.moveTo(36, -90); v.lineTo(62, -150 + Math.sin(t * 8) * 8); v.stroke(); }, 215, 420), (t, lt) => stk(() => { txtv('tamam', 0, 0, 96, { col: WHT, stroke: 14 }); txtv('abi!', 0, 100, 120, { col: YEL, stroke: 16 }); }, 1060, 300, 1 + .08 * KK, -.08));
add(106, 120, NIGHT, (t, lt) => { bg([10, 10, 20], [10, 10, 20]); }, null, null, 'end');
// ---------- çizim ----------
const FRAMEC = [1280, 720];
function halftone(t, pal) { const [a, b] = pal; const g = ctx.createLinearGradient(0, 0, W, H); g.addColorStop(0, rgba(a)); g.addColorStop(1, rgba(b)); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.save(); ctx.fillStyle = 'rgba(255,255,255,.14)'; const sp = 26, sh = (t * 18) % sp; for (let y = -sp; y < H + sp; y += sp) for (let x = -sp; x < W + sp; x += sp) { const r = 1 + 7 * (0.5 + 0.5 * Math.sin((x + y * .4) * .012 + t * .6)) * (.7 + .5 * KK); ctx.beginPath(); ctx.arc(x + ((y / sp) % 2 ? sp / 2 : 0) + sh * .5, y + sh * .5, r, 0, TAU); ctx.fill(); } ctx.restore(); }
function drawPhone(t) {
  const sc = 1 + .012 * pulse(t), rot = Math.sin(t * .7) * .012;
  ctx.save(); ctx.translate(640, 360); ctx.rotate(rot); ctx.scale(sc, sc);
  ctx.shadowColor = 'rgba(0,0,0,.55)'; ctx.shadowBlur = 40; ctx.shadowOffsetY = 18; ctx.fillStyle = '#0c0c14'; rrect(ctx, -222, -372, 444, 744, 44); ctx.fill(); ctx.shadowColor = 'transparent';
  ctx.save(); rrect(ctx, -202.5, -360, 405, 720, 28); ctx.clip(); ctx.drawImage(VC, -202.5, -360); ctx.restore();
  ctx.fillStyle = '#0c0c14'; rrect(ctx, -50, -366, 100, 24, 12); ctx.fill(); ctx.restore();
}
function rideLayer(t, lt, dur) {
  const p = lt / dur, x = lerp(150, 1500, p * p * .6 + p * .4), y = 590 + Math.sin(lt * 9) * 3;
  stk(() => { bike(0, 70, 1.5); hero(-6, 12, 0.7, { t }); }, x, y, 1.0, -.03);
  for (let i = 0; i < 8; i++) { const sx = x - 120 - i * 50; ctx.fillStyle = `rgba(255,255,255,${.5 - i * .06})`; ctx.fillRect(sx, y + 70 + (i % 2) * 8, 40, 5); }
}
function renderFrame(f) {
  const t = f / 24; setAudio(t);
  const sh = SH.find(s => t >= s.a && t < s.b) || SH[SH.length - 1], lt = t - sh.a;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (sh.ex === 'end') return endCard(t, lt);
  halftone(t, sh.pal);
  if (sh.ex === 'title') {
    const words = ['TAMAM', 'ABİ'];
    ctx.save(); ctx.globalAlpha = 1; v = ctx;
    words.forEach((w, i) => { const p = sm(seg(lt, 2.2 + i * .5, 2.7 + i * .5)); const sz = w === 'TAMAM' ? 82 : 190; stk(() => { txtv(w, 0, 0, sz, { col: i ? YEL : WHT, stroke: 20, sc: INK }); }, i ? 1060 : 215, i ? 380 : 130, p * (1 + .05 * pulse(t)), i ? .1 : -.12); });
    ctx.restore();
  }
  v = VCx; v.save(); v.clearRect(0, 0, 405, 720); sh.ph(t, lt); v.restore();
  drawPhone(t);
  v = ctx;
  if (sh.L) sh.L(t, lt); if (sh.R) sh.R(t, lt);
  if (sh.ex === 'ride') { v = ctx; rideLayer(t, lt, sh.b - sh.a); }
  if (sh.ex === 'vay') { for (let i = 0; i < 2; i++) stk(() => { txtv('VAY VAY!', 0, 0, 80, { col: WHT, stroke: 14 }); }, 640, 120 + i * 480, 1 + .08 * pulse(t), i ? .05 : -.05); }
  // glitch
  if (KK > .85) { const o = 6; ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = .25; ctx.drawImage(cv, o, 0); ctx.restore(); }
  badge(t); fade(t);
}
function badge(t) {
  ctx.save(); ctx.translate(36, 44); ctx.rotate(-.04); const w = 238, h = 46; ctx.fillStyle = rgba(YEL); rrect(ctx, 0, -h / 2, w, h, 12); ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = rgba(INK); ctx.stroke();
  ctx.fillStyle = rgba(INK); ctx.font = `900 28px ${SANS}`; ctx.textAlign = 'left'; ctx.fillText('murat250sr', 16, 10); ctx.fillStyle = rgba(RED); ctx.beginPath(); ctx.arc(w - 18, 0, 6 + 1.5 * pulse(t), 0, TAU); ctx.fill(); ctx.restore();
}
function fade(t) { const a = Math.max(1 - t / .6, 0); if (a > 0) { ctx.fillStyle = `rgba(0,0,0,${a})`; ctx.fillRect(0, 0, W, H); } }
function endCard(t, lt) {
  const g = ctx.createLinearGradient(0, 0, W, H); g.addColorStop(0, rgba(VIO[0])); g.addColorStop(1, rgba(VIO[1])); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  ctx.save(); ctx.translate(640, 360); for (let i = 0; i < 24; i++) { ctx.rotate(TAU / 24); ctx.fillStyle = `rgba(255,255,255,${i % 2 ? .08 : .0})`; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(900, -60); ctx.lineTo(900, 60); ctx.fill(); } ctx.restore();
  const p = eo(seg(lt, .2, 1.1)), pp = 1 + .04 * pulse(t);
  ctx.save(); ctx.translate(640, 360); ctx.rotate(-.05 * (1 - p)); ctx.scale(p * pp * 1.0, p * pp); ctx.shadowColor = 'rgba(0,0,0,.5)'; ctx.shadowBlur = 40; ctx.shadowOffsetY = 20;
  ctx.fillStyle = rgba(YEL); rrect(ctx, -430, -150, 860, 300, 40); ctx.fill(); ctx.shadowColor = 'transparent'; ctx.lineWidth = 10; ctx.strokeStyle = rgba(INK); ctx.stroke();
  ctx.fillStyle = rgba(INK); ctx.textAlign = 'center'; ctx.font = `900 124px ${SANS}`; ctx.fillText('murat250sr', 0, 40); ctx.font = `800 36px ${SANS}`; ctx.letterSpacing = '8px'; ctx.fillText('REKLAM · TAMAM ABİ', 0, 100); ctx.restore();
  for (let i = 0; i < 40; i++) { const r = rng(i + 5)(), x = (r * 1280 + i * 91) % 1280, y = ((t * 150 + i * 53) % 800) - 40; ctx.fillStyle = rgba([RED, BLU, GRN, WHT][i % 4]); ctx.fillRect(x, y, 10, 16); }
  const fo = seg(t, T_END - 1.2, T_END); if (fo > 0) { ctx.fillStyle = `rgba(0,0,0,${fo})`; ctx.fillRect(0, 0, W, H); }
}
