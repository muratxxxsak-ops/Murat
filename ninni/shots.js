'use strict';
// ====== HER SABAH — yağlı boya kısa film ======
const A = i => TL[i].a, B2 = i => TL[i].b;
const mH = t => say(['H', 'HS'], t), mY = t => say(['Y', 'YB', 'YS'], t), mG = t => say(['HG'], t), mA = t => say(['A'], t);
const breathe = (t, k = 1) => Math.sin(t * 1.6) * 4 * k;
// yarım boy: x, y = kafa merkezi, r = kafa ölçeği
function half(o) { const P = PEOPLE[o.who], r = o.r, shY = o.y + (o.slump ? .8 : 1.0) * r + breathe(o.t || 0) * .3;
  const T = torso({ who: o.who, x: o.x - (o.turn || 0) * .1 * r, y: shY, r, turn: o.turn, len: o.len || 4.2, slump: o.slump });
  const hands = (o.arms || [[.15, .1], [.15, .1]]).map((a, i) => a ? arm([o.x + (i ? 1 : -1) * T.sw * .85, shY + .3 * r], a[0], a[1], r, P.top2 || P.top, P.skin, { sd: i ? 1 : -1, noHand: a[2], tremble: o.tremble }) : null);
  head(Object.assign({}, o, { y: o.y + breathe(o.t || 0) * .3 }));
  return hands; }
// ---------- SAHNE 1: SABAH ----------
S(0, A(1), (t, lt) => { roomMorning(t, { cam: [0, 0, 1 + lt * .01] }); // oda, Halil pencere önünde arkadan
  chair(330, 1500, 360); figure({ who: 'halil', x: 330, y: 1480, h: 760, sit: 1, view: 'back', eyes: 'blank', turn: -.2, slump: 1, arms: [[.2, .6], [.2, .6]] }); C.save(); C.globalAlpha = .9; form(ell(330, 750, 120, 140, 16), [214, 170, 140], { n: 3 }); C.restore(); head({ who: 'halil', x: 330, y: 760, r: 115, turn: -.9, eyes: 'blank' });
  return { warm: .5 }; }, { xi: 2 });
S(A(1), A(4), (t, lt, d) => { roomMorning(t, { cam: [40, 0, 1.04] }); // Yusuf tepsiyle girer
  const k = sm(lt / 3); chair(250, 1500, 340); half({ who: 'halil', x: 250, y: 780, r: 120, turn: -.8, eyes: 'blank', slump: 1, t });
  const yx = lerp(1300, 760, k); const hs = half({ who: 'yusuf', x: yx, y: 640, r: 135, turn: -.4, eyes: 'tired', sad: .5, smile: 0, t, arms: [[1.1, -.9], [1.1, -.9]] });
  tray((hs[0][0] + hs[1][0]) / 2, hs[0][1] - 20, 120);
  return { warm: .5 }; });
S(A(4), A(5), (t, lt) => { roomMorning(t, { cam: [-200, -150, 1.6] }); // CU Halil: "Kimsin sen, evlat?"
  half({ who: 'halil', x: 540, y: 900, r: 300, turn: lerp(-.6, .25, sm(lt / 1)), eyes: 'blank', mouth: mH(t), sad: .1, t, slump: 1 });
  return { warm: .4 }; }, { xi: .3 });
S(A(5), A(6), (t, lt) => { roomMorning(t, { cam: [260, -150, 1.6] }); // CU Yusuf: "Ben Yusuf, baba. Oğlun."
  half({ who: 'yusuf', x: 540, y: 880, r: 300, turn: -.25, eyes: 'tired', smile: .5, sad: .8, mouth: mY(t), t });
  return { warm: .3 }; }, { xi: .3 });
S(A(6), A(8), (t, lt) => { roomMorning(t, { cam: [-200, -150, 1.5] }); // "Oğlum mu? Benim oğlum küçük..."
  const laugh = lt < 2 ? .7 : .3; half({ who: 'halil', x: 520, y: 900, r: 290, turn: .25, eyes: lt < 1.6 ? 'closed' : 'blank', smile: laugh, mouth: mH(t), sad: 0, t, slump: 1, arms: [null, lt > 2 ? [.9, -1.6] : [.15, .2]] });
  return { warm: .4 }; }, { xi: .3 });
S(A(8), A(11), (t, lt, d) => { roomMorning(t, { cam: [60, 60, 1.05 + lt * .012] }); // iki kez kaybetmek: geniş iki kişilik
  chair(260, 1500, 340); half({ who: 'halil', x: 260, y: 790, r: 118, turn: -.85, eyes: 'blank', slump: 1, t });
  chair(820, 1520, 300); half({ who: 'yusuf', x: 820, y: 860, r: 118, turn: -.5, eyes: lt > d * .6 ? 'closed' : 'tired', sad: .9, t, slump: 1, arms: [[.6, 1.2], [.6, 1.2]] });
  tray(560, 1260, 90);
  return { warm: .45, fade: 0 }; }, { xo: 1.5 });
// ---------- SAHNE 2: GEÇMİŞ ----------
S(A(11), A(12), (t, lt) => { park(t); // omuzlarda çocuk, parkta koşu
  const x = 300 + lt * 140, b = Math.abs(Math.sin(lt * 7)) * 18; figure({ who: 'genc', x, y: 1750 - b, h: 1050, walk: lt * 7, smile: .9, turn: .3, arms: [[2.6, .4], [2.6, .4]] });
  half({ who: 'cocuk', x: x + 20, y: 870 - b, r: 95, smile: 1, eyes: 'closed', sad: -.3, len: 2.5, arms: [[1.9, .5], [1.9, .5]] });
  return { sep: .35, warm: .8 }; }, { xi: 1.5 });
S(A(12), A(14), (t, lt) => { bedroom(t, { night: 1, stars: 1 }); // ninni: genç Halil yatak kenarında
  blanket(320, 1260, 1000, 1560, [110, 140, 190]); head({ who: 'cocuk', x: 520, y: 1210, r: 90, turn: .1, eyes: 'closed', smile: .3, sad: 0 }); form(ell(500, 1290, 150, 40, 14), [240, 236, 226], { n: 3 });
  half({ who: 'genc', x: 820, y: 860, r: 140, turn: -.55, eyes: 'closed', smile: .5, sad: .1, mouth: mG(t) * .6, t, arms: [[.5, 1.5], [.4, .6]] });
  return { sep: .25, warm: .6 }; }, { xi: 1 });
S(A(14), A(15), (t, lt) => { park(t); // "o ellerdi beni yere düşmeden tutan": düşerken yakalar
  const k = sm(seg(lt, .6, 1.6)), fall = lt < .6 ? lt / .6 : 1; figure({ who: 'genc', x: 600, y: 1780, h: 1050, turn: -.3, smile: .5, sad: 0, arms: [[lerp(.3, 1.2, k), lerp(.1, -.6, k)], [lerp(.3, 1.2, k), lerp(.1, -.6, k)]] });
  figure({ who: 'cocuk', x: lerp(380, 560, k), y: lerp(1500, 1380, k) + (1 - k) * fall * 40, h: 560, turn: .4, eyes: k > .5 ? 'closed' : 'wide', smile: k > .5 ? .9 : -.3, sad: k > .5 ? 0 : .8 });
  return { sep: .4, warm: .8 }; });
S(A(15), A(16), (t, lt) => { park(t); // omuzlarda: dünyayı yukarıdan
  const b = Math.abs(Math.sin(lt * 3)) * 10; half({ who: 'cocuk', x: 540, y: 470 - b, r: 100, smile: 1, eyes: 'open', sad: -.3, len: 2.6, arms: [[2.4, .3], [2.4, .3]] });
  figure({ who: 'genc', x: 540, y: 1800 - b, h: 1100, turn: 0, smile: .8, eyes: 'closed', sad: -.2, arms: [[2.2, 1.0], [2.2, 1.0]] });
  return { sep: .4, warm: .9 }; });
S(A(16), A(17), (t, lt) => { bedroom(t, { night: 1, lamp: false }); C.fillStyle = 'rgba(0,0,10,.45)'; C.fillRect(0, 0, W, H); // karanlıktan korkan çocuk, kapıda baba
  blanket(320, 1260, 1000, 1560, [80, 100, 140]); head({ who: 'cocuk', x: 540, y: 1180, r: 95, turn: .5, eyes: 'wide', sad: .9 });
  light(140, 900, 500, [255, 200, 120], .55 * sm(lt / 1.5)); figure({ who: 'genc', x: 140, y: 1600, h: 980, turn: .4, smile: .6, eyes: 'open', sad: 0, arms: [[.3, .2], [1.3, -.3]] });
  return { sep: .25, warm: .5 }; });
S(A(17), A(18), (t, lt) => { roomMorning(t, { cam: [-180, -100, 1.35], warm: .4 }); // titreyen eller: kucağındaki eller
  half({ who: 'halil', x: 520, y: 880, r: 250, turn: -.3, eyes: 'blank', slump: 1, sad: .2, t, look: .5, tremble: 1, arms: [[.35, -1.5], [.35, -1.5]] });
  return { cool: .2 }; }, { xi: .6 });
S(A(18), A(20), (t, lt, d) => { roomMorning(t, { cam: [-180, -100, 1.35], warm: .4 }); // çöken omuzlar, unutulan ad
  half({ who: 'halil', x: 520, y: 880, r: 250, turn: -.6, eyes: 'blank', slump: 1, sad: .2, t, look: -.8 });
  return { cool: .2 }; }, { xo: 1.5 });
// ---------- SAHNE 3: KAPI ----------
S(A(20), A(21), (t, lt) => { hallway(t, { open: .35 }); // ceketiyle kapıda bekleyen Halil, ceplerinde ekmek
  figure({ who: 'halil', x: 640, y: 1720, h: 980, turn: -.5, eyes: 'blank', smile: .2, slump: 1, look: -1, arms: [[.25, .2], [.25, .2]] });
  for (let i = 0; i < 3; i++) blob(500 + i * 30, 1240 + i * 10, 18, [220, 180, 120], 1);
  return { warm: .3 }; }, { xi: 1 });
S(A(21), A(22), (t, lt) => { hallway(t, { open: .35 }); // "Baba, nereye gidiyorsun?"
  half({ who: 'yusuf', x: 540, y: 820, r: 270, turn: .35, eyes: 'tired', sad: .7, mouth: mY(t), t }); return { warm: .2 }; });
S(A(22), A(24), (t, lt) => { hallway(t, { open: .4 }); // "Annen gelecek. Işığım gelecek."
  half({ who: 'halil', x: 540, y: 860, r: 270, turn: -.35, eyes: 'open', smile: .6, sad: 0, mouth: mH(t), t, look: -1 }); light(330, 900, 300, [255, 220, 160], .25); return { warm: .4 }; });
S(A(24), A(27), (t, lt) => { hallway(t, { open: .4 }); // Yusuf donup kalır; annenin fotoğrafı
  if (lt < 4) { C.save(); C.translate(540, 900); C.scale(2.6, 2.6); C.translate(-860, -510); form([[760, 380], [960, 380], [960, 640], [760, 640]], [90, 60, 40], { n: 3 }); C.fillStyle = cs([210, 196, 170]); C.fillRect(784, 404, 152, 212); head({ who: 'anne', x: 860, y: 500, r: 58, smile: .5, sad: 0 }); C.strokeStyle = cs([20, 20, 20]); C.lineWidth = 16; C.beginPath(); C.moveTo(900, 380); C.lineTo(960, 440); C.stroke(); C.restore(); return { cool: .2, sep: .2 }; }
  half({ who: 'yusuf', x: 540, y: 820, r: 290, turn: .1, eyes: 'wet', sad: 1, t }); return { cool: .2 }; });
S(A(27), A(28), (t, lt) => { hallway(t, { open: .4 }); half({ who: 'yusuf', x: 540, y: 800, r: 310, turn: 0, eyes: 'closed', sad: 1, t }); return { cool: .25 }; }); // yalancı olmayı seçtim
S(A(28), A(29) + 1.2, (t, lt) => { hallway(t, { open: .4 }); // "Gelecek baba..."
  half({ who: 'yusuf', x: 360, y: 820, r: 210, turn: .5, eyes: 'wet', smile: .3, sad: .9, mouth: mY(t), t, arms: [null, [1.3, -.6]] });
  half({ who: 'halil', x: 800, y: 900, r: 190, turn: -.5, eyes: 'open', smile: .6, sad: 0, t }); return { warm: .2 }; });
S(A(29) + 1.2, A(30), (t, lt, d) => { hallway(t, { open: 0 }); // alnını kapıya dayar
  figure({ who: 'yusuf', x: 560, y: 1740, h: 1000, turn: -.9, view: 'back', eyes: 'closed', sad: 1, slump: 1, arms: [[2.6, .3], [.2, .1]] });
  return { cool: .3 }; }, { xo: 1.5 });
// ---------- SAHNE 4: FABRİKA ----------
S(A(30), A(31), (t, lt) => { factory(t, { sparks: 1 }); // makine başında, gözleri kapanıyor
  half({ who: 'yusuf', x: 540, y: 820, r: 230, turn: .2, eyes: Math.sin(lt * 2.2) > .4 ? 'closed' : 'tired', sad: .6, t, arms: [[.9, -.6], [.9, -.6]] }); return { cool: .5 }; }, { xi: 1 });
S(A(31), A(33), (t, lt) => { factory(t); // molada arkadaş
  half({ who: 'arkadas', x: 330, y: 900, r: 200, turn: .5, eyes: 'open', sad: .5, mouth: mA(t), t, arms: [[.4, 1.4], [.9, -.9]] });
  half({ who: 'yusuf', x: 800, y: 960, r: 190, turn: -.4, eyes: 'tired', sad: .6, t, slump: 1, arms: [[.6, 1.4], [.6, 1.4]] });
  return { cool: .5 }; });
S(A(33), A(35), (t, lt) => { factory(t); half({ who: 'yusuf', x: 540, y: 850, r: 300, turn: -.15, eyes: 'open', sad: .3, mouth: mY(t), t }); return { cool: .4 }; }); // "O beni otuz yıl taşıdı"
S(A(35), A(36), (t, lt) => { factory(t); half({ who: 'yusuf', x: 540, y: 850, r: 300, turn: .1, eyes: 'wet', sad: .6, t, look: .5 }); return { cool: .4 }; });
S(A(36), A(37), (t, lt) => { park(t); // "Baba." — ilk kelime (geçmiş)
  half({ who: 'genc', x: 700, y: 820, r: 210, turn: -.5, eyes: 'open', smile: 1, sad: -.2, t, arms: [[1.0, 1.2], [1.0, 1.2]] }); half({ who: 'cocuk', x: 360, y: 1180, r: 150, turn: .5, smile: .8, mouth: .5, sad: 0, len: 3 });
  return { sep: .4, warm: .9 }; }, { xi: .3 });
S(A(37), A(38), (t, lt) => { factory(t); half({ who: 'yusuf', x: 540, y: 850, r: 300, turn: 0, eyes: 'open', sad: .1, smile: .1, t }); return { cool: .35 }; }, { xo: 1.2 });
// ---------- SAHNE 5: YAĞMUR ----------
S(A(38), A(39), (t, lt) => { roomMorning(t, { warm: 0, photo: true }); C.fillStyle = 'rgba(10,14,30,.6)'; C.fillRect(0, 0, W, H); chair(330, 1500, 360); rainOver(t, 60, .25); return { cool: .8 }; }, { xi: 1 }); // boş sandalye
S(A(39), A(41), (t, lt) => { rainNight(t, { street: 1, lampX: 820 }); // "Baba! BABA!" koşar
  const x = 300 + lt * 60; figure({ who: 'yusuf', x, y: 1700, h: 900, walk: lt * 10, turn: .3, eyes: 'wide', sad: .8, mouth: mY(t), arms: [[.6, -1.2], [.6, -1.2]], wet: 1 });
  rainOver(t, 260, .5); return { cool: .7, shake: 0 }; });
S(A(41), A(42), (t, lt) => { rainNight(t, { lampX: 540 }); bench(540, 1560, 380); // bankta Halil, kucağında ayı
  figure({ who: 'halil', x: 540, y: 1560, h: 900, sit: 1, turn: 0, eyes: 'blank', slump: 1, sad: .5, wet: 1, arms: [[.3, -1.6], [.3, -1.6]], tremble: 1 }); teddy(540, 1330, 90, 1);
  rainOver(t, 240, .5); return { cool: .6 }; });
S(A(42), A(43), (t, lt) => { rainNight(t, { lampX: 300 }); // Yusuf diz çöker: "ne işin var burada?"
  half({ who: 'yusuf', x: 540, y: 900, r: 280, turn: .3, eyes: 'wet', sad: 1, mouth: mY(t), wet: 1, t }); rainOver(t, 240, .5); return { cool: .6 }; });
S(A(43), A(45), (t, lt) => { rainNight(t, { lampX: 820 }); // "Oğlumu bekliyorum..."
  half({ who: 'halil', x: 540, y: 880, r: 280, turn: -.2, eyes: 'blank', sad: .6, mouth: mH(t), wet: 1, t, tremble: 1, arms: [[.3, -1.5], [.3, -1.5]] }); teddy(540, 1520, 150, 1);
  rainOver(t, 240, .5); return { cool: .55 }; });
S(A(45), A(47), (t, lt) => { rainNight(t, { lampX: 300 }); half({ who: 'yusuf', x: 540, y: 880, r: 300, turn: 0, eyes: 'wet', sad: 1, tear: (lt * .5) % 1, wet: 1, t }); rainOver(t, 240, .5); return { cool: .55 }; }); // yağmur mu gözyaşı mı
S(A(47), A(49), (t, lt, d) => { rainNight(t, { lampX: 540 }); bench(540, 1560, 380); // ceketini örter, sarılır; kamera yükselir
  C.save(); C.translate(540, 1300); const z = 1 - lt * .02; C.scale(z, z); C.translate(-540, -1300);
  figure({ who: 'halil', x: 640, y: 1560, h: 880, sit: 1, turn: -.3, eyes: 'closed', slump: 1, sad: .2, wet: 1, arms: [[.3, -1.6], [.3, -1.6]] }); teddy(640, 1330, 85, 1);
  figure({ who: 'yusuf', x: 430, y: 1560, h: 920, sit: 1, turn: .5, eyes: 'closed', sad: .6, wet: 1, arms: [[.2, .1], [1.5, -.2]] }); C.restore();
  rainOver(t, 240, .5); return { cool: .5 }; }, { xo: 1.5 });
// ---------- SAHNE 6: NİNNİ ----------
S(A(49), A(51), (t, lt) => { bedroom(t, { night: 1 }); blanket(320, 1260, 1000, 1560); // Yusuf ninniyi söyler
  head({ who: 'halil', x: 600, y: 1190, r: 110, turn: .3, eyes: 'closed', sad: .2 }); form(ell(600, 1280, 160, 40, 14), [240, 236, 226], { n: 3 });
  half({ who: 'yusuf', x: 300, y: 820, r: 160, turn: .6, eyes: 'tired', sad: .8, mouth: mY(t) * .7, t, slump: 1, arms: [[.4, .8], [.6, 1.0]] });
  return { warm: .35 }; }, { xi: 1.2 });
S(A(51), A(52), (t, lt) => { bedroom(t, { night: 1 }); // Halil'in gözleri açılır, devam eder
  C.save(); C.translate(540, 900); C.scale(2.4, 2.4); C.translate(-600, -1190); blanket(320, 1260, 1000, 1560); head({ who: 'halil', x: 600, y: 1190, r: 110, turn: .4, eyes: lt < 1 ? 'closed' : 'open', sad: .1, smile: .2, mouth: mH(t), look: .8 }); C.restore();
  return { warm: .45 }; });
S(A(52), A(54), (t, lt) => { bedroom(t, { night: 1 }); blanket(380, 1500, 1100, 1920); // "Yusuf... Büyümüşsün oğlum": eli oğlunun yüzüne
  head({ who: 'halil', x: 800, y: 1380, r: 200, turn: -.55, eyes: 'wet', smile: .5, sad: .2, mouth: mH(t), look: -1 });
  const yx = 380, yy = 760; half({ who: 'yusuf', x: yx, y: yy, r: 250, turn: .45, eyes: 'wet', sad: .9, tear: (lt * .4) % 1, t, slump: 1 });
  const k = sm(lt / 1.4), hx = lerp(820, yx + 230, k), hy = lerp(1500, yy + 260, k); limb([1000, 1750], [lerp(950, 760, k), lerp(1550, 1150, k)], [hx, hy + 60], 60, 50, 42, PEOPLE.halil.top); handP([hx, hy], -2.6, 220, PEOPLE.halil.skin, 1);
  return { warm: .55 }; });
S(A(54), A(55), (t, lt) => { bedroom(t, { night: 1 }); // "Buradayım baba...": babanın elini yanağına bastırır
  half({ who: 'yusuf', x: 540, y: 860, r: 290, turn: .2, eyes: 'closed', sad: 1, mouth: mY(t), tear: (lt * .6) % 1, t });
  limb([1150, 1600], [980, 1350], [820, 1180], 70, 60, 50, PEOPLE.halil.top); handP([800, 1150], -2.6, 260, PEOPLE.halil.skin, 1);
  return { warm: .5 }; });
S(A(55), A(56), (t, lt) => { bedroom(t, { night: 1 }); // yeniden yabancı bakış
  C.save(); C.translate(540, 900); C.scale(2.4, 2.4); C.translate(-600, -1190); blanket(320, 1260, 1000, 1560); head({ who: 'halil', x: 600, y: 1190, r: 110, turn: .4, eyes: 'blank', sad: .1, mouth: mH(t) }); C.restore();
  return { cool: .2 }; });
S(A(56), A(57), (t, lt) => { bedroom(t, { night: 1 }); // "Ben Yusuf, baba. Yarın yine söylerim."
  half({ who: 'yusuf', x: 540, y: 860, r: 290, turn: -.1, eyes: 'wet', smile: .55, sad: .6, mouth: mY(t), t }); return { warm: .4 }; }, { xo: 1.5 });
// ---------- SAHNE 7: FİNAL ----------
S(A(57), A(58), (t, lt) => { roomMorning(t, { cam: [40, 0, 1.04], warm: 1.2 }); chair(250, 1500, 340); half({ who: 'halil', x: 250, y: 780, r: 120, turn: -.8, eyes: 'blank', slump: 1, t });
  const yx = lerp(1300, 760, sm(lt / 2.2)); const hs = half({ who: 'yusuf', x: yx, y: 640, r: 135, turn: -.4, eyes: 'open', sad: .2, smile: .4, t, arms: [[1.1, -.9], [1.1, -.9]] }); tray((hs[0][0] + hs[1][0]) / 2, hs[0][1] - 20, 120);
  return { warm: .7 }; }, { xi: 1.5 });
S(A(58), A(59), (t, lt) => { roomMorning(t, { cam: [-200, -150, 1.6], warm: 1.2 }); half({ who: 'halil', x: 540, y: 900, r: 300, turn: .25, eyes: 'blank', mouth: mH(t), sad: .1, t, slump: 1 }); return { warm: .6 }; }, { xi: .3 });
S(A(59), A(60), (t, lt) => { roomMorning(t, { cam: [260, -150, 1.6], warm: 1.2 }); half({ who: 'yusuf', x: 540, y: 880, r: 300, turn: -.25, eyes: 'open', smile: 1, sad: -.1, mouth: mY(t), t }); return { warm: .6 }; }, { xi: .3 });
S(A(60), A(63), (t, lt) => { roomMorning(t, { cam: [60, 60, 1.05 + lt * .008], warm: 1.2 }); // iki kişilik: Yusuf yanında oturur, çay
  chair(300, 1500, 340); half({ who: 'halil', x: 300, y: 790, r: 118, turn: -.7, eyes: 'blank', slump: 1, smile: .2, t, arms: [null, [.9, -1.0]] });
  chair(760, 1520, 320); half({ who: 'yusuf', x: 760, y: 840, r: 120, turn: -.55, eyes: 'open', smile: .5, sad: .3, t, arms: [[.9, -1.0], null] });
  tray(540, 1300, 90); return { warm: .6 }; });
S(A(63), A(64), (t, lt) => { roomMorning(t, { cam: [160, 260, 1.5 + lt * .01], warm: 1.2 }); // el ele
  chair(300, 1500, 340); half({ who: 'halil', x: 300, y: 790, r: 118, turn: -.7, eyes: 'blank', slump: 1, smile: .3, t, arms: [null, [.9, -1.0]] });
  chair(760, 1520, 320); half({ who: 'yusuf', x: 760, y: 840, r: 120, turn: -.55, eyes: 'closed', smile: .6, sad: .2, t, arms: [[.9, -1.0], null] });
  return { warm: .7 }; });
S(A(64), A(66), (t, lt) => { roomMorning(t, { cam: [60, 60, 1.05], warm: 1.3, sun: sm(lt / 6) * .5 }); // her sabah yeniden
  chair(300, 1500, 340); half({ who: 'halil', x: 300, y: 790, r: 118, turn: -.8, eyes: 'blank', slump: 1, smile: .25, t });
  chair(760, 1520, 320); half({ who: 'yusuf', x: 760, y: 840, r: 120, turn: -.6, eyes: 'open', smile: .7, t });
  return { warm: .7 }; });
S(A(66), A(67), (t, lt, d) => { const k = sm(lt / d); roomMorning(t, { cam: [-230, -150, 1.0 + k * .9], warm: 1.5, sun: .5 + k * .5, dawn: 1 }); return { warm: .8, flash: k * .25 }; }, { xo: 2 }); // pencere, güneş doğar
// SON
S(A(67), T_END + .5, (t, lt) => { vg(0, H, [[0, [20, 16, 14]], [1, [10, 8, 8]]]); light(540, 900, 500, [255, 200, 120], .25 * sm(lt));
  return { nobadge: 1, post: (c, t2) => { const a = sm(lt / 1.2); c.save(); c.globalAlpha = a; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#f2e2c0'; c.font = '600 64px Caveat'; c.fillText('— SON —', 540, 760); c.font = '700 120px Kalam'; c.fillStyle = '#f6d58a'; c.fillText('murat250sr', 540, 960); c.font = '600 54px Caveat'; c.fillStyle = '#d8c8a8'; c.fillText('Her sabah yeniden.', 540, 1110); c.restore(); } }; }, { xi: .5, xo: 0 });
SH.sort((a, b) => a.a - b.a);
