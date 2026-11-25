'use strict';
// ====== AÇ KARNINA MATRİX — hamur animasyon, konuşmalara göre ======
const WIDE = (o = {}) => (t, lt) => { const r = wide(t, typeof o === 'function' ? o(t, lt) : o); return (typeof o === 'function' ? o(t, lt) : o).ret || {}; };
const CU = (who, o = {}) => (t, lt) => { const oo = typeof o === 'function' ? o(t, lt) : o; const res = closeup(t, who, oo); if (oo.after) oo.after(t, lt, res); return oo.ret || {}; };
const pz = (t, k = 1) => Math.sin(t * 2.2) * .04 * k; // nefes
// ---------- 0-30: "Yaşadığın dünya bir simülasyon" ----------
S(0, 5.8, (t, lt) => { const r = wide(t, { u: { arms: [[.5, 1.2], [1.6, -.4]] }, h: { eyes: 'wide', brow: -.6 } }); return {}; }, { xi: 1.2 });
S(5.8, 13.75, CU('usta', (t, lt) => ({ r: 160, arms: [[.3, .2], [1.2 + Math.sin(t * 2) * .2, -.6]], after: (t) => { for (const sd of [-1, 1]) { C.save(); C.globalAlpha = .55; codeRain(640 + sd * 61 - 40, 238, 80, 50, t, 7 + sd); C.restore(); } } })));
S(13.75, 17.7, CU('huseyin', (t, lt) => ({ r: 165, brow: -.8, raise: 1, eyes: 'wide', arms: [[.4, 1.6], [.3, .2]], after: (t, lt, res) => tespih(res.hands[0][0], res.hands[0][1], 120, t) })));
S(17.7, 25.3, WIDE(t => ({ u: { arms: [[.4, .2], [1.0, .2]] }, h: { brow: -.3, smile: .2 } })));
S(25.3, 29.6, CU('huseyin', (t, lt) => ({ r: 165, smile: 1, eyes: 'happy', blush: 1, bob: Math.min(1, lt) * -.15, arms: [[1.2, 1.4], [1.2, 1.4]], after: (t, lt) => { glowC(640, 300, 500, [255, 230, 150], .35 * sm(lt)); for (let i = 0; i < 6; i++) { const a = t * 2 + i; ball(640 + Math.cos(a) * 300, 300 + Math.sin(a) * 160, 10, 10, [255, 240, 150], 0, { spec: .8 }); } sfx('KAHRAMAN!', 640, 90, 70, [255, 220, 60], -.06, sm(lt * 2)); } })));
S(29.6, 31.1, WIDE({ u: { face: -.4, arms: [[.3, .2], [1.4, -.2]] } }));
// ---------- 31-56: suç dosyası ----------
S(31.1, 35.35, (t, lt) => { // ikamet adresine akraba: dolup taşan ev
  stage([170, 210, 240], [110, 160, 90]); house(640, 560, 300, 230);
  const n = Math.min(14, Math.floor(lt * 4)); const r = rng(3);
  for (let i = 0; i < n; i++) { const x = 520 + (i % 5) * 60, y = 400 + Math.floor(i / 5) * 60; layer(() => toon({ who: 'akraba', x, y: y + 50, r: 22, face: (r() - .5), smile: .8, noLegs: 1, sit: 1 }), { sb: 6, sx: 3, sy: 3 }); }
  slab(560, 140, 160, 40, [250, 250, 245], 8); label('İKAMET: 14 KİŞİ', 640, 160, 22, [60, 40, 36]);
  coinBag(950, 520, 60 + Math.sin(t * 6) * 3); label('BELEDİYE', 950, 600, 26, [40, 60, 40]);
  return {}; }, { xi: .4 });
S(35.35, 37.9, CU('huseyin', (t, lt) => ({ r: 165, sweat: 1, t, brow: -.5, eyes: 'wide', arms: [[1.0, 1.9 + Math.sin(t * 14) * .3], [1.0, 1.9 + Math.cos(t * 14) * .3]] })));
S(37.9, 40.6, WIDE({ u: { face: -.4 }, h: { eyes: 'squint', smile: -.3, sweat: 1 } }));
S(40.6, 45.5, (t, lt) => { // turp gibi anne: kimse bakmazken halter, bakınca tekerlekli sandalye
  stage([230, 214, 190], [170, 140, 110]); const look = lt > 2.5;
  slab(860, 260, 160, 220, [240, 236, 226], 10); label('EVDE BAKIM', 940, 300, 22, [60, 40, 36]); label('MAAŞI', 940, 330, 22, [60, 40, 36]);
  layer(() => toon({ who: 'asist', x: 1060, y: 640, r: 50, face: -.6, eyes: look ? 'open' : 'closed', arms: [[.6, 1.0], [.3, .2]] }));
  if (!look) { const lift = Math.abs(Math.sin(t * 5)); layer(() => { const p = toon({ who: 'anne', x: 470, y: 640, r: 62, face: .2, smile: 1, eyes: 'happy', arms: [[2.8 - lift * .6, .2], [2.8 - lift * .6, .2]] }); sausage([p.hands[0][0] - 40, p.hands[0][1]], [p.hands[1][0] + 40, p.hands[1][1]], 7, [60, 60, 60]); for (const h of p.hands) ball(h[0] + (h[0] < 470 ? -50 : 50), h[1], 26, 36, [40, 40, 44]); }); sfx('HOP!', 470, 120, 60, [255, 220, 60], -.1, sm(lt * 3)); }
  else { slab(380, 520, 180, 30, [120, 120, 130], 10); for (const sd of [-1, 1]) { C.beginPath(); C.arc(470 + sd * 85, 600, 48, 0, TAU); C.strokeStyle = cs([60, 60, 66]); C.lineWidth = 10; C.stroke(); }
    layer(() => toon({ who: 'anne', x: 470, y: 600, r: 62, face: .4, sit: 1, eyes: 'squint', brow: -.9, smile: -.6, arms: [[.2, .1], [.2, .1]] })); sfx('ÖHÖ ÖHÖ', 470, 160, 50, [230, 230, 230], .08, sm((lt - 2.5) * 3)); }
  return {}; });
S(45.5, 47.7, CU('huseyin', (t, lt) => ({ r: 165, sweat: 1, t, brow: -.6, smile: .3, arms: [[1.4, 1.2], [.3, .2]] })));
S(47.7, 50.3, (t, lt) => { // EYT: sigorta girişi geriye alınır
  stage([200, 220, 200], [150, 160, 140]); const yr = Math.round(lerp(2004, 1995, sm(lt / 2)));
  slab(440, 160, 400, 300, [250, 248, 240], 14); label('SİGORTA GİRİŞİ', 640, 210, 34, [60, 40, 36]); label(String(yr), 640, 320, 110, [180, 40, 40]);
  sfx('EYT ✔', 640, 540, 80, [120, 230, 120], -.05, sm((lt - 1.6) * 3));
  return {}; });
S(50.3, 56, CU('huseyin', (t, lt) => ({ r: 165, brow: -.4, smile: lt > 2.6 ? .5 : -.2, arms: [[1.3, -.4], [1.3, -.4]], sweat: lt < 2.6, t })));
S(56, 59.1, WIDE(t => ({ u: { arms: [[.3, .2], [1.2, -.3]] }, h: { brow: -.2, eyes: speaking('huseyin', t) ? 'happy' : 'open' } })));
S(59.1, 66, CU('usta', (t, lt) => ({ r: 160 + lt * 4, arms: [[.3, .2], [1.0, -.5]], brow: .3, after: (t) => { for (const sd of [-1, 1]) { C.save(); C.globalAlpha = .55; codeRain(640 + sd * 61 - 40, 238 - lt * 8, 80, 50, t, 3 + sd); C.restore(); } } })));
// ---------- 66-91: haplar ----------
S(66, 76.3, (t, lt) => { // avuçlarda mavi ve kırmızı hap (sessiz, dramatik)
  vgrad(0, H, [[0, [20, 30, 28]], [1, [10, 14, 14]]]); glowC(640, 380, 600, [255, 220, 170], .18);
  const k = eo(seg(lt, .3, 2.5));
  for (const sd of [-1, 1]) { C.save(); C.translate(640 + sd * 260, 470); limbS([[sd * 520, 260], [sd * 200, 120], [0, 20]], 60, CAST.usta.coat); ball(0, 0, 110, 70, CAST.usta.skin, 0, { spec: .3 }); for (let i = 0; i < 4; i++) ball(-sd * (70 - i * 12) - sd * 30, -40 + i * 26, 34, 18, CAST.usta.skin); C.restore();
    if (k > .05) pill(640 + sd * 260, 440 - k * 20, 28, sd < 0 ? BLUE : RED, sd * .4); }
  if (lt > 4) { const z = sm(seg(lt, 4, 9)); glowC(380, 420, 240 * z, BLUE, .3 * z); glowC(900, 420, 240 * z, RED, .3 * z); }
  return {}; });
S(76.3, 85.7, (t, lt) => { // mavi hap: sahte ama rahat dünya
  stage([150, 180, 230], [110, 130, 180]); cloudFrame(t, [210, 225, 250]);
  slab(300, 430, 380, 120, [90, 110, 170], 30); slab(300, 380, 380, 70, [80, 100, 160], 30); slab(860, 300, 220, 150, [40, 40, 50], 12); slab(875, 312, 190, 120, [140, 200, 230], 8);
  layer(() => toon({ who: 'huseyin', x: 490, y: 560, r: 50, face: .4, sit: 1, eyes: 'happy', smile: 1, arms: [[.6, 1.4], [.3, .2]] }));
  ball(560, 445, 14, 18, [200, 90, 50], 0, { spec: .6 }); label('ÇAY', 560, 410, 18, [60, 40, 36]); pill(640, 150, 30, BLUE, .3);
  return {}; }, { xi: .3 });
S(85.7, 94.6, (t, lt) => { // kırmızı hap: sancılı gerçek
  stage([120, 40, 36], [70, 30, 30], 600); for (let i = 0; i < 4; i++) robot(220 + i * 280, 600, 55 + (i % 2) * 15, t);
  for (let i = 0; i < 20; i++) { const r = rng(i), x = r() * W, y = (r() * H + t * 80) % H; ball(x, y, 4, 4, [255, 150, 80], 0, { spec: .8 }); }
  pill(640, 150, 30, RED, -.3); sfx('GERÇEK!', 640, 260, 70, [255, 200, 180], .05, sm(lt * 2));
  return { shake: 2 }; });
S(94.6, 99, CU('huseyin', (t, lt) => ({ r: 165, eyes: 'squint', brow: -.2, raise: 1, smile: -.2, after: (t, lt) => { for (let i = 0; i < 3; i++) sfx('?', 420 + i * 90, 150 - i * 20 + Math.sin(t * 4 + i) * 8, 70 + i * 10, [255, 240, 120], .1 * i, sm((lt - i * .3) * 3)); } })));
S(99, 108.5, (t, lt) => { closeup(t, 'usta', { r: 150, x: 520, arms: [[.3, .2], [1.5, -.3]] }); const k = lt < 3 ? 0 : lt < 6 ? 1 : 2; if (k > 0) pill(980, 300, 34, k === 1 ? BLUE : RED, .3); if (k === 1) sfx('UYU', 980, 180, 60, [170, 200, 255], -.05, sm((lt - 3) * 3)); if (k === 2) sfx('UYAN', 980, 180, 60, [255, 170, 160], -.05, sm((lt - 6) * 3)); return {}; });
S(108.5, 111, WIDE({ h: { eyes: 'squint', smile: .3 } }));
S(111, 112.6, CU('huseyin', (t, lt) => ({ r: 165, smile: .7, eyes: 'squint', brow: .3, arms: [[.2, .1], [1.6, -.6]] })));
S(112.6, 120.3, (t, lt) => { const r = wide(t, { u: { eyes: 'open', mouth: 0, arms: [[.3, .2], [.3, .2]] }, h: { smile: .5 } }); // garip sessizlik
  const c = Math.floor(t * 4) % 2; sfx(c ? 'cırr cırr' : '', 640, 120, 46, [200, 230, 170], -.05, 1); if (lt > 3) ball(380, 360, 9, 13, [170, 210, 240], 0, { spec: .7 }); return {}; });
S(120.3, 129.7, CU('usta', (t, lt) => ({ r: 160, brow: -.6, raise: 1, arms: [[.3, .2], [2.6, .9 + Math.sin(t * 8) * .2]], after: (t, lt) => sfx('?!', 920, 160, 80, [255, 230, 120], .1, sm(lt * 2)) })));
// ---------- 130-200: Hüseyin'in soruları ----------
S(129.7, 138.6, CU('huseyin', (t, lt) => ({ r: 170, face: .1, look: 0, brow: -.6, eyes: 'wide', arms: [[1.6, 1.6], [1.6, 1.6]] })));
S(138.6, 143.6, CU('usta', (t, lt) => ({ r: 160, brow: .5, arms: [[.3, .2], [1.4, -.8]] })));
S(143.6, 148, CU('huseyin', (t, lt) => ({ r: 165, brow: -.3, smile: .2, arms: [[1.1, 1.6], [.3, .2]] })));
S(148, 154.7, (t, lt) => { closeup(t, 'huseyin', { r: 150, x: 400, eyes: 'happy', smile: 1, blush: 1 }); // börek hayali
  for (let i = 0; i < 3; i++) ball(600 + i * 50, 240 - i * 40, 14 + i * 6, 12 + i * 5, [250, 250, 245]);
  C.save(); C.beginPath(); C.ellipse(930, 190, 270, 150, 0, 0, TAU); C.fillStyle = cs([252, 250, 244]); C.fill(); C.restore();
  slab(800, 200, 260, 26, [190, 190, 196], 12); for (let i = 0; i < 5; i++) ball(830 + i * 50, 185, 30, 18, [220, 170, 90], 0, { spec: .4 }); label('SU BÖREĞİ', 930, 120, 34, [140, 80, 40]);
  for (let i = 0; i < 3; i++) { const ph = (t * .7 + i / 3) % 1; ball(880 + i * 40, 160 - ph * 60, 6, 10, [240, 240, 240], 0, { spec: 0 }); }
  return {}; });
S(154.7, 159.2, CU('usta', (t, lt) => ({ r: 160, brow: 1, arms: [[.3, .2], [1.8, -.9]], after: (t, lt) => { for (let i = 0; i < 4; i++) { const ph = (t * 1.5 + i / 4) % 1; ball(640 + (i - 1.5) * 60 + Math.sin(t * 6 + i) * 10, 120 - ph * 120, 18 + ph * 20, 18 + ph * 20, [240, 240, 240], 0, { spec: 0 }); } sfx('BÖREK Mİ?!', 640, 640, 60, [255, 180, 120], -.04, sm(lt * 2)); } })));
S(159.2, 162.9, CU('huseyin', (t, lt) => ({ r: 165, smile: -.3, brow: -.5, arms: [[1.4, 1.5], [1.3, 1.4]] })));
S(162.9, 169.4, CU('usta', (t, lt) => ({ r: 160, brow: .7, arms: [[.3, .2], [1.0 + Math.abs(Math.sin(t * 7)) * .3, -.8]], after: (t, lt) => sfx('HADİ!', 960, 200, 70, [255, 220, 60], .08, sm((lt - 3) * 3)) })));
S(169.4, 175.7, (t, lt) => { const res = closeup(t, 'huseyin', { r: 165, brow: -.6, smile: -.2, arms: [[1.3, 1.6], [.3, .2]] }); const [hx, hy] = res.hands[0]; slab(hx - 70, hy - 110, 150, 100, [250, 250, 250], 10); slab(hx - 70, hy - 110, 150, 26, [200, 60, 60], 10); label('ANTİBİYOTİK', hx + 5, hy - 55, 20, [60, 40, 36]); return {}; });
S(175.7, 183, CU('usta', (t, lt) => ({ r: 160, brow: .9, arms: [[.3, .2], [2.9, 2.4]], after: (t, lt) => sfx('OF!', 980, 180, 70, [255, 220, 60], .1, sm(lt * 2)) })));
S(183, 190.4, (t, lt) => { const res = closeup(t, 'huseyin', { r: 165, smile: .4, brow: -.2, arms: [[1.3, 1.6], [.3, .2]] }); const [hx, hy] = res.hands[0]; slab(hx - 80, hy - 100, 170, 100, [90, 160, 120], 12); label('SİGORTA', hx + 5, hy - 50, 26, [250, 250, 240]); if (lt > 4.6) sfx('...', 940, 200, 80, [255, 255, 255], 0, 1); return {}; });
S(190.4, 200.85, CU('huseyin', (t, lt) => ({ r: 165, face: -.25, smile: .3, eyes: lt > 4 ? 'squint' : 'open', brow: -.2, arms: [[1.0, 1.4], [1.0, 1.4]] })));
// ---------- 200-243: iki dünya, kırmızı ve mavi ----------
S(200.85, 210.8, (t, lt) => { // iki dünya şeması
  stage([60, 70, 70], [40, 44, 44]); slab(140, 100, 1000, 480, [40, 60, 50], 20); slab(160, 120, 960, 440, [30, 50, 40], 16, { edge: false });
  C.strokeStyle = 'rgba(240,240,230,.9)'; C.lineWidth = 6; C.beginPath(); C.moveTo(640, 140); C.lineTo(640, 540); C.stroke();
  label('GERÇEK DÜNYA', 390, 170, 36, [240, 240, 230]); label('SANAL DÜNYA', 890, 170, 36, [240, 240, 230]);
  if (lt > 1) { slab(270, 330, 240, 120, [120, 140, 160], 50); layer(() => toon({ who: 'huseyin', x: 390, y: 450, r: 30, face: 0, eyes: 'closed', sit: 1, noLegs: 1 })); sfx('zzz', 470, 280, 40, [200, 220, 255], .1, 1); }
  if (lt > 4.5) { house(820, 480, 90, 80); house(960, 480, 80, 110, [200, 200, 220], [80, 90, 140]); layer(() => toon({ who: 'huseyin', x: 890, y: 500, r: 26, face: .3, smile: 1, walk: t * 8 })); }
  return {}; });
S(210.8, 215.4, CU('huseyin', (t, lt) => ({ r: 165, smile: .4, brow: -.1, arms: [[1.0, 1.6], [.3, .2]] })));
S(215.4, 222.1, (t, lt) => { // kapsülde çırılçıplak uyanma
  stage([40, 50, 70], [20, 26, 40]); slab(380, 160, 520, 420, [120, 200, 190], 200); C.save(); C.globalAlpha = .4; slab(400, 180, 480, 380, [180, 240, 230], 180, { edge: false }); C.restore();
  layer(() => { toon({ who: 'huseyin', x: 640, y: 560, r: 70, face: 0, eyes: lt > 1.5 ? 'wide' : 'closed', mouth: lt > 1.5 ? .8 : 0, noLegs: 1, sit: 1, arms: [[.5, 1.2], [.5, 1.2]] }); });
  slab(520, 420, 240, 70, [20, 20, 20], 12); label('SANSÜR', 640, 456, 34, [255, 255, 255]);
  for (let i = 0; i < 8; i++) { const ph = (t * .6 + i / 8) % 1; ball(420 + i * 60, 560 - ph * 380, 8, 8, [200, 250, 240], 0, { spec: .7 }); }
  return {}; });
S(222.1, 227.4, (t, lt) => { // ensedeki fiş
  stage([40, 50, 70], [20, 26, 40]); const k = sm(seg(lt, 1.2, 2.2));
  layer(() => toon({ who: 'huseyin', x: 560, y: 960, r: 170, face: .5, eyes: 'squint', brow: -.7, mouth: k > .5 ? .9 : .3, noLegs: 1, sit: 1, arms: [[.3, .2], [2.5, 2.2]] }));
  sausage([690 + k * 200, 400 - k * 80], [1300, 150], 14, [50, 50, 56]); ball(690 + k * 200, 400 - k * 80, 30, 22, [160, 160, 170], 0, { spec: .6 });
  sfx(k > .9 ? 'PLOP!' : '', 900, 200, 80, [255, 220, 60], .1, sm((lt - 2.2) * 3));
  return {}; });
S(227.4, 232.2, (t, lt) => { // havuzdan güç bela çıkış
  stage([30, 40, 60], [20, 30, 50], 470); vgrad(470, H, [[0, [40, 110, 140]], [1, [20, 60, 90]]]);
  const y = 560 - Math.max(0, Math.sin(lt * 2.5)) * 40 - lt * 20;
  layer(() => toon({ who: 'huseyin', x: 640, y: y + 120, r: 60, face: -.2, eyes: 'squint', brow: -.8, mouth: .5, noLegs: 1, sit: 1, arms: [[2.6, .4], [2.4, .3]] }));
  C.save(); C.globalAlpha = .7; vgrad(540, H, [[0, [50, 130, 160]], [1, [20, 60, 90]]]); C.restore();
  for (let i = 0; i < 12; i++) ball(560 + i * 15, 540 + Math.sin(t * 8 + i) * 6, 10, 6, [200, 240, 250], 0, { spec: .8 }); sfx('ŞAPUR ŞUPUR', 640, 140, 54, [160, 230, 255], -.05, 1);
  return {}; });
S(232.2, 236, (t, lt) => { // insanlık için savaş
  stage([90, 40, 36], [50, 30, 30], 600); for (let i = 0; i < 3; i++) robot(760 + i * 170, 600, 60, t);
  layer(() => toon({ who: 'huseyin', x: 360, y: 640, r: 50, face: .6, eyes: 'wide', brow: .6, mouth: .8, arms: [[2.8, .2], [.4, .2]], walk: t * 10 }));
  sfx('SAVAŞ!', 400, 160, 70, [255, 200, 120], -.08, sm(lt * 3)); return { shake: 4 }; });
S(236, 237.85, CU('huseyin', (t, lt) => ({ r: 165, raise: 1, brow: -.3, arms: [[1.0, 1.6], [.3, .2]] })));
S(237.85, 240.8, (t, lt) => { // mavi: evde, yatakta uyanmak
  stage([170, 190, 230], [140, 120, 100]); cloudFrame(t, [210, 225, 250]); bed(640, 560, 260);
  layer(() => toon({ who: 'huseyin', x: 520, y: 540, r: 46, face: .3, eyes: lt > 1 ? 'happy' : 'closed', smile: 1, noLegs: 1, sit: 1, arms: [[2.4, .4], [2.4, .4]] }));
  ball(1000, 140, 50, 50, [255, 220, 120], 0, { spec: .5 }); glowC(1000, 140, 200, [255, 230, 150], .35); return {}; });
S(240.8, 243.3, CU('huseyin', (t, lt) => ({ r: 170, smile: 1, eyes: 'happy', arms: [[1.0, 1.6], [1.6, -.4]], after: (t, lt, res) => { pill(res.hands[1][0], res.hands[1][1] - 40, 26, BLUE, .3); sfx('DING!', 940, 160, 70, [140, 200, 255], .1, sm(lt * 3)); } })));
S(243.3, 251.45, CU('usta', (t, lt) => ({ r: 160 + Math.min(lt, .3) * 60, brow: -.8, raise: 1, mouth: Math.max(mouthOf('usta', t), lt < 1.2 ? .9 : 0), arms: [[.3, .2], [2.0, .8]], after: (t, lt) => sfx('NE?!', 960, 180, 90, [255, 230, 80], .1, sm(lt * 3)) })));
S(251.45, 256.6, CU('huseyin', (t, lt) => ({ r: 165, smile: .6, eyes: 'squint', arms: [[1.3, -.4], [1.3, -.4]] })));
S(256.6, 267.15, (t, lt) => { if (lt < 5) return CU('usta', { r: 160, brow: -1, raise: 1, arms: [[.3, .2], [2.6, .6]] })(t, lt); // insanlık ne olacak? diz çöküp dram
  hideout(t); glowC(640, 300, 400, [255, 240, 200], .35); layer(() => toon({ who: 'usta', x: 640, y: 640, r: 70, face: 0, sit: .7, brow: -1, raise: 1, eyes: 'open', mouth: mouthOf('usta', t), arms: [[2.7, .3], [2.7, .3]] })); return {}; });
// ---------- 267-297: kahvaltı ve robotlar ----------
S(267.15, 269.3, CU('huseyin', (t, lt) => ({ r: 165, smile: .8, arms: [[1.2, 1.5], [1.2, 1.5]], after: (t, lt, res) => { const k = sm(lt / 1.2); pill(res.hands[0][0] - k * 30, res.hands[0][1] - 40, 22, BLUE, -.3); pill(res.hands[1][0] + k * 30, res.hands[1][1] - 40, 22, BLUE, .3); sfx('ÇIT!', 640, 200, 60, [255, 220, 60], 0, k); } })));
S(269.3, 276.7, (t, lt) => { // birlikte kahvaltı
  stage([250, 230, 190], [190, 150, 110]); cloudFrame(t, [255, 245, 220]);
  slab(320, 470, 640, 40, [200, 150, 100], 14);
  layer(() => toon({ who: 'huseyin', x: 820, y: 560, r: 52, face: -.4, smile: 1, eyes: 'happy', noLegs: 1, sit: 1, mouth: mouthOf('huseyin', t), arms: [[1.3, 1.0], [.6, 1.0]] }));
  layer(() => toon({ who: 'usta', x: 460, y: 560, r: 50, face: .4, noLegs: 1, sit: 1, smile: .3, arms: [[.6, 1.0], [1.3, 1.0]], noGlasses: 0 }));
  ball(640, 450, 70, 22, [60, 50, 50]); ball(640, 444, 56, 15, [230, 120, 60], 0, { spec: .5 }); label('MENEMEN', 640, 400, 22, [120, 60, 30]);
  for (const x of [520, 760]) { ball(x, 450, 12, 18, [200, 90, 50], 0, { spec: .6 }); } C.beginPath(); C.arc(380, 452, 30, 0, TAU); C.strokeStyle = cs([200, 150, 80]); C.lineWidth = 12; C.stroke();
  return {}; });
S(276.7, 283.9, CU('usta', (t, lt) => ({ r: 160, brow: .8, arms: [[.3, .2], [1.6, -1.0]], after: (t, lt, res) => { if (lt > 4) pill(res.hands[1][0], res.hands[1][1] - 40, 26, RED, .3); } })));
S(283.9, 290.4, (t, lt) => { // robotların kontrol ettiği insanlık
  stage([60, 30, 30], [40, 24, 24], 600); robot(640, 620, 120, t);
  for (let i = 0; i < 7; i++) { const x = 180 + i * 150; if (Math.abs(x - 640) < 120) continue; sausage([640, 260], [x, 520], 2, [200, 200, 210]); layer(() => toon({ who: 'akraba', x, y: 640, r: 26, face: 0, eyes: 'closed', arms: [[2.5, .2], [2.5, .2]] }), { sb: 6, sx: 3, sy: 3 }); }
  return {}; });
S(290.4, 297.6, CU('usta', (t, lt) => ({ r: 160, brow: .3, face: .25, arms: [[.3, .2], [1.6, -.6]], after: (t, lt) => { if (lt > 4.5) sfx('SEBEBİN NE?', 640, 640, 50, [255, 230, 120], -.03, sm((lt - 4.5) * 3)); } })));
// ---------- 297-327: 1+1 ev ----------
S(297.6, 309.6, (t, lt) => { // yeni alınmış 1+1 ev, anahtara sarılmak
  stage([240, 220, 200], [170, 140, 120]); slab(470, 150, 340, 430, [160, 110, 80], 14); slab(490, 170, 300, 400, [190, 140, 100], 10); ball(760, 380, 14, 14, [230, 200, 90], 0, { spec: .8 });
  slab(570, 210, 140, 70, [250, 248, 240], 10); label('1+1', 640, 246, 52, [180, 40, 40]);
  const p = layer(() => toon({ who: 'huseyin', x: 350, y: 640, r: 70, face: .5, smile: 1, eyes: 'happy', blush: 1, mouth: mouthOf('huseyin', t), arms: [[1.5, 1.6], [1.4, 1.6]] }));
  ball(p.hands[1][0] + 10, p.hands[1][1] - 20, 20, 20, [230, 200, 80], 0, { spec: .8 }); sausage([p.hands[1][0] + 10, p.hands[1][1] - 20], [p.hands[1][0] + 60, p.hands[1][1] - 30], 7, [230, 200, 80]);
  for (let i = 0; i < 5; i++) { const ph = (t * .5 + i / 5) % 1; const x = 350 + Math.sin(i * 3) * 100, y = 300 - ph * 200; C.save(); C.globalAlpha = 1 - ph; ball(x - 8, y, 12, 12, [240, 80, 100]); ball(x + 8, y, 12, 12, [240, 80, 100]); C.beginPath(); C.moveTo(x - 19, y + 4); C.lineTo(x, y + 24); C.lineTo(x + 19, y + 4); C.fillStyle = cs([240, 80, 100]); C.fill(); C.restore(); }
  return {}; }, { xi: .3 });
S(309.6, 316.6, (t, lt) => { // 15 yıl kiracılık: taşınma kolileri
  stage([200, 190, 180], [140, 120, 110]); const r = rng(4);
  for (let i = 0; i < 10; i++) { const x = ((r() * W + t * 120 * (i % 2 ? 1 : -1)) % (W + 200)) - 100; slab(x, 430 + (i % 3) * 50, 110, 80, [190, 150, 100], 8); label('KOLİ', x + 55, 470 + (i % 3) * 50, 20, [100, 70, 40]); }
  slab(440, 120, 400, 140, [250, 248, 240], 12); label('15 YIL KİRA', 640, 170, 44, [60, 40, 36]); label('15 × ZAM', 640, 225, 36, [180, 40, 40]);
  layer(() => toon({ who: 'huseyin', x: 640, y: 680, r: 46, face: .2, sweat: 1, t, brow: -.8, mouth: .4, walk: t * 9, arms: [[2.8, .2], [2.8, .2]] })); slab(560, 470, 160, 110, [190, 150, 100], 8);
  return {}; });
S(316.6, 321.9, CU('usta', (t, lt) => ({ r: 160, brow: .4, smile: -.8, face: .5, arms: [[.3, .2], [1.2, .4]] })));
S(321.9, 327.2, CU('huseyin', (t, lt) => ({ r: 170, smile: 1, eyes: 'happy', blush: 1, arms: [[1.6, 1.6], [1.6, 1.6]], after: (t) => { for (let i = 0; i < 6; i++) { const a = t + i; ball(640 + Math.cos(a) * 320, 330 + Math.sin(a) * 170, 14, 14, [240, 90, 110], 0, { spec: .5 }); } } })));
// ---------- 327-346: ajanlar geliyor, final ----------
S(327.2, 333.7, (t, lt) => { const r = wide(t, { alarm: 1, u: { face: -.2, brow: .5, arms: [[.3, .2], [1.4, -.4]] }, h: { eyes: 'wide', sweat: 1, t } });
  layer(() => toon({ who: 'asist', x: 640, y: 640, r: 46, face: 0, mouth: mouthOf('asist', t), arms: [[.4, .3], [1.6, -.6]] })); sfx('ALARM!', 640, 150, 66, [255, 90, 80], -.05, Math.sin(t * 9) > 0 ? 1 : .8); return {}; });
S(333.7, 338, (t, lt) => { hideout(t, { alarm: 1 }); // kapıda ajanlar
  slab(470, 180, 340, 380, [70, 60, 56], 14); const k = sm(seg(lt, .4, 1.6)); C.save(); C.translate(470, 180); C.scale(1 - k * .85, 1); slab(0, 0, 340, 380, [110, 84, 60], 14); C.restore();
  if (k > .2) for (let i = 0; i < 3; i++) layer(() => toon({ who: 'ajan', x: 540 + i * 100, y: 560, r: 34, face: (i - 1) * .3, brow: 1, smile: -.4 }), { sb: 8, sx: 4, sy: 4 });
  sfx('GÜM!', 640, 120, 80, [255, 220, 60], .08, sm(lt * 3)); return { shake: lt < .6 ? 8 : 0 }; });
S(338, 341.5, (t, lt) => { const k = sm(seg(lt, .8, 1.6)); // Hüseyin mavi hapı yutar: puf!
  const res = closeup(t, 'huseyin', { r: 165, smile: 1, eyes: k > .5 ? 'happy' : 'open', alarm: 1, arms: [[1.2, 1.6 + k * .5], [.3, .2]] });
  if (k < .9) pill(res.hands[0][0], res.hands[0][1] - 40 - k * 120, 24, BLUE, .3);
  if (lt > 2.2) { const q = sm(seg(lt, 2.2, 3)); for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; ball(640 + Math.cos(a) * 300 * q, 400 + Math.sin(a) * 200 * q, 60 * (1 - q * .5), 50 * (1 - q * .5), [240, 240, 250], 0, { spec: .2 }); } sfx('PUF!', 640, 300, 110, [140, 200, 255], 0, q); }
  return {}; });
S(341.5, 346, (t, lt) => { // yeni evinde, yatağında mutlu uyanış; usta ajanlarla baş başa
  stage([190, 205, 240], [150, 125, 100]); bed(520, 590, 240); slab(860, 200, 220, 160, [250, 248, 240], 12); label('1+1', 970, 280, 60, [180, 40, 40]);
  layer(() => toon({ who: 'huseyin', x: 420, y: 565, r: 46, face: .3, eyes: 'happy', smile: 1, noLegs: 1, sit: 1, arms: [[2.4, .4], [2.4, .4]] }));
  C.save(); C.beginPath(); C.ellipse(1080, 560, 170, 110, 0, 0, TAU); C.fillStyle = cs([60, 20, 20]); C.fill(); C.clip(); vgrad(450, 680, [[0, [150, 40, 40]], [1, [90, 20, 20]]], 900, 1260);
  layer(() => { toon({ who: 'usta', x: 1040, y: 690, r: 30, face: .3, brow: -.8, smile: -.5, arms: [[1.3, -.4], [1.3, -.4]] }); toon({ who: 'ajan', x: 1120, y: 690, r: 30, face: -.3, brow: 1 }); }, { shadow: false }); C.restore();
  return {}; });
// ---------- bitiş kartı ----------
S(346, T_END + 1, (t, lt) => {
  vgrad(0, H, [[0, [36, 44, 42]], [1, [20, 24, 24]]]); codeRain(0, 0, W, H, t, 3); C.fillStyle = 'rgba(10,16,14,.75)'; C.fillRect(0, 0, W, H);
  const k = eo(seg(lt, 0, 1.2));
  C.save(); C.translate(640, 330); C.scale(.6 + .4 * k, .6 + .4 * k); C.font = '700 150px Kalam'; C.textAlign = 'center'; C.textBaseline = 'middle';
  C.lineJoin = 'round'; C.lineWidth = 26; C.strokeStyle = '#2a1a1a'; C.strokeText('murat250sr', 0, 0); const g = C.createLinearGradient(0, -70, 0, 70); g.addColorStop(0, '#ffe680'); g.addColorStop(1, '#f0b020'); C.fillStyle = g; C.fillText('murat250sr', 0, 0); C.restore();
  pill(450, 480, 34 * k, BLUE, -.3); pill(830, 480, 34 * k, RED, .3);
  label('Aç Karnına Matrix', 640, 560, 44, [200, 255, 210], { a: sm(seg(lt, .8, 1.8)), font: 'Caveat', w: 600 });
  return { nobadge: 1 }; }, { xi: .5 });
SH.sort((a, b) => a.a - b.a);
