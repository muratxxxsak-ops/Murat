'use strict';
// ====== TAKİP ET — defter karalaması, sesteki her cümle bir sahne ======
const room = (t, o = {}) => { // küçük oda: pencere, raf, ring ışık
  stroke([[130, 1240], [W - 20, 1240]], { w: 4 });
  shape(rectP(170, 300, 300, 260), o.night ? [60, 70, 120] : [170, 210, 240], { a: .4 }); stroke([[320, 300], [320, 560]]); stroke([[170, 430], [470, 430]]);
  if (o.night) { blobC(400, 360, 28, 28, [250, 240, 180]); }
  stroke([[650, 520], [1000, 520]], { w: 4 }); shape(rectP(680, 440, 60, 80), BLUE); shape(rectP(760, 460, 50, 60), GRN); blobC(880, 480, 40, 40, YEL);
};
// 0 - 2.2: "Benim videolarımı niye izlemiyorsunuz?" (telefon kamerası bakışı)
S(0, 2.2, (t, lt) => { room(t);
  kid({ x: 600, y: 1500, s: 260, mouth: talk(t), mood: 'sad', arms: [[1.2 + Math.sin(t * 6) * .3, 1.1], [1.2 - Math.sin(t * 6) * .3, 1.1]], bob: Math.sin(t * 8) * 6 });
  // telefon arayüzü çerçevesi
  C.save(); C.strokeStyle = 'rgba(50,50,56,.7)'; C.lineWidth = 6; C.setLineDash([24, 16]); C.strokeRect(150, 230, 860, 1500); C.restore();
  eyeIcon(250, 1640, 34); write('0', 320, 1642, 70, { align: 'left', col: RED }); write('izlenme', 380, 1645, 52, { align: 'left' });
  write('● REC', 870, 290, 50, { col: RED, a: Math.floor(t * 2) % 2 ? .95 : .3 });
  return {}; });
// 2.2 - 4.25: "Ben o videoları süs niye mi koyuyorum ya?" — duvardaki tozlu video çerçeveleri
S(2.2, 4.25, (t, lt) => {
  const fr = [[200, 320, 300, 220], [580, 300, 280, 240], [240, 620, 260, 200], [600, 640, 300, 200], [380, 900, 320, 220]];
  fr.forEach(([x, y, w, h], i) => { shape(rectP(x, y, w, h), [200, 150, 90], { sp: 6 }); shape(rectP(x + 20, y + 20, w - 40, h - 40), [190, 215, 235], { a: .35 }); const r = rng(i);
    stroke([[x + w / 2 - 20, y + h / 2 - 28], [x + w / 2 + 26, y + h / 2], [x + w / 2 - 20, y + h / 2 + 28], [x + w / 2 - 20, y + h / 2 - 28]], { w: 4 }); write('0 izlenme', x + w / 2, y + h - 36, 34, { col: [120, 120, 120] });
    for (let k = 0; k < 4; k++) stroke([[x + r() * w, y + r() * h], [x + r() * w, y + r() * h]], { col: [170, 170, 170], w: 2, a: .4 }); });
  // örümcek ağı
  for (let i = 0; i < 6; i++) stroke([[960, 260], [960 - Math.cos(i * .3) * 200, 260 + Math.sin(i * .3) * 200]], { w: 2, a: .5 }); for (let k = 1; k < 4; k++) stroke(ell(960, 260, k * 55, k * 55, 8, Math.PI * .5, Math.PI), { w: 2, a: .5 });
  const sy = 330 + Math.sin(t * 2) * 30; stroke([[880, 260], [880, sy]], { w: 2 }); blobC(880, sy + 14, 14, 16, GR); for (const sd of [-1, 1]) for (let k = 0; k < 3; k++) stroke([[880, sy + 10 + k * 6], [880 + sd * 26, sy + k * 10]], { w: 2.5 });
  const k = kid({ x: 760, y: 1880, s: 210, mouth: talk(t), mood: 'sad', look: -1, arms: [[.3, .2], [2.4, .3]] });
  write('süs?', 330, 1250, 110, { col: RED, rot: -.1 });
  return {}; });
// 4.25 - 6.1: "Girip izleyip beğenseniz ee" — kendi videosunu kendisi beğeniyor
S(4.25, 6.1, (t, lt) => { room(t);
  const press = lt > 1 ? 1 : 0; heart(700, 780 + press * 14, 170 * (1 + press * .08), press ? RED : null, { line: { w: 7 } });
  const k = kid({ x: 360, y: 1820, s: 220, mouth: talk(t), mood: press ? 'happy' : 'sad', look: 1, arms: [[.3, .2], [2.2 - press * .2, -.7]] });
  write(press ? '1' : '0', 700, 1000, 120, { col: press ? RED : GR }); write('(kendisi)', 700, 1090, 54, { col: [120, 120, 120], a: press });
  if (press) { spark(700, 780, 240, PINK); const ph = (lt - 1) * .9; heart(700 + Math.sin(lt * 5) * 30, 600 - ph * 300, 40, PINK); }
  return {}; });
// 6.1 - 7.44: "Yorum vurun bir şeyler yapın" — boş yorumlardan geçen çalı topu
S(6.1, 7.44, (t, lt) => {
  write('Yorumlar (0)', 540, 300, 90, { font: 'Kalam', w: 700 }); stroke([[200, 370], [880, 370]], { w: 4 });
  for (let i = 0; i < 4; i++) { bubble(220, 470 + i * 260, 640, 160); stroke([[270, 540 + i * 260], [700, 540 + i * 260]], { col: [200, 200, 200], w: 4, a: .5 }); }
  const tx = lerp(-150, 1250, lt / 1.34); tumbleweed(tx, 1500, 90, t); stroke([[0, 1600], [W, 1600]], { w: 3, a: .5 });
  kid({ x: 880, y: 1880, s: 150, mouth: talk(t), mood: 'sad', look: -1, arms: [[.3, .2], [1.6, -.6]] });
  return {}; });
// 7.44 - 9.3: "TikTok'un böyle özellikleri yok mu?" — telefonu sallar, tuşlar dökülür
S(7.44, 9.3, (t, lt) => {
  const sh = Math.sin(t * 30) * .25;
  const k = kid({ x: 540, y: 1880, s: 240, mouth: talk(t), mood: 'shock', look: 0, arms: [[2.4 + sh, .3], [2.4 - sh, .3]] });
  phone(540, 470, 300, 540, sh, (w, h) => { heart(0, -60, 50, null); stroke(ell(0, 80, 40, 30, 12), { w: 4 }); });
  const r = rng(2); for (let i = 0; i < 5; i++) { const ft = Math.max(0, lt - .2 - i * .2), x = 400 + r() * 280 + ft * (r() - .5) * 200, y = 700 + ft * ft * 900; if (ft > 0 && y < 1700) { [() => heart(x, y, 34, RED), () => blobC(x, y, 30, 24, BLUE), () => stroke([[x - 30, y], [x + 30, y], [x + 10, y - 20]], { w: 6 })][i % 3](); } }
  write('?!', 860, 300, 140, { col: RED, rot: .1 });
  return {}; });
// 9.3 - 11.65: "Bu özellikler benim videolarıma kapandı mı?" — kilitli tuşlar, KAPALI tabelası
S(9.3, 11.65, (t, lt) => {
  shape(rectP(300, 260, 480, 860), [60, 60, 70], { sp: 5 }); shape(rectP(330, 300, 420, 780), [220, 230, 240], { a: .35 });
  [[540, 520], [540, 720], [540, 920]].forEach(([x, y], i) => { if (i === 0) heart(x, y, 50, [200, 200, 200]); else if (i === 1) blobC(x, y, 50, 40, [200, 200, 200]); else stroke([[x - 40, y], [x + 40, y], [x + 10, y - 26]], { w: 6, col: [160, 160, 160] }); lock(x + 70, y + 40 + (lt > .3 + i * .3 ? 0 : -400), 60); });
  const sw = Math.sin(t * 3) * .08; C.save(); C.translate(540, 300); C.rotate(sw); stroke([[-120, 0], [0, -80], [120, 0]], { w: 3 }); shape(rectP(-170, 0, 340, 120), [250, 240, 200]); write('KAPALI', 0, 60, 80, { col: RED, font: 'Kalam', w: 700 }); C.restore();
  kid({ x: 540, y: 1900, s: 200, mouth: talk(t), mood: 'sad', look: 0, arms: [[.6, 1.6], [.6, 1.6]] });
  return {}; });
// 11.65 - 12.95: "Kimse takip de etmiyor." — arkasına döner, arkasında kimse yok
S(11.65, 12.95, (t, lt) => {
  stroke([[0, 1500], [W, 1500]], { w: 4 }); for (let i = 0; i < 6; i++) stroke([[100 + i * 180, 1500], [60 + i * 180, 1560]], { w: 2, a: .4 });
  const back = lt > .55; const k = kid({ x: 380 + (back ? 0 : lt * 120), y: 1500, s: 200, mouth: talk(t), mood: back ? 'sad' : 'sad', look: back ? 1 : -1, walk: back ? 0 : t * 9, arms: [[.3, .2], [.3, .2]] });
  if (back) { write('...', 820, 1300, 120, { col: [150, 150, 150] }); const lx = 800 + Math.sin(t * 3) * 40, ly = 900 + (lt - .55) * 500; shape([[lx, ly], [lx + 30, ly - 14], [lx + 50, ly + 6], [lx + 20, ly + 20]], [210, 150, 60]); }
  write('takipçiler →', 760, 1180, 64, { col: [120, 120, 120], a: back ? 1 : 0 });
  return {}; });
// 12.95 - 14.5: "Takip et tuşun mu bozuldu?" — tornavidayla açar, yay fırlar
S(12.95, 14.5, (t, lt) => {
  const open = lt > .7; C.save(); C.translate(540, 760); C.rotate(open ? -.25 : 0);
  shape(rectP(-300, -110, 600, 220), RED, { sp: 6 }); write('Takip et', 0, 0, 110, { col: [255, 250, 240], font: 'Kalam', w: 700 }); C.restore();
  if (open) { spring(540, 760, 540 + (lt - .7) * 300, 300, 7, 26); spring(500, 780, 260, 420 - (lt - .7) * 150, 5, 22); spark(560, 720, 160, YEL); write('BOING!', 820, 400, 100, { col: BLUE, rot: .15, font: 'Kalam', w: 700 }); }
  const k = kid({ x: 520, y: 1880, s: 220, mouth: talk(t), mood: open ? 'shock' : 'sad', look: 0, arms: [[.3, .2], [2.3, .2]] });
  const [hx, hy] = k.hands[1]; stroke([[hx, hy], [hx + 30, hy - 160]], { w: 14, col: [230, 80, 60] }); stroke([[hx + 30, hy - 160], [hx + 40, hy - 260]], { w: 6, col: [150, 150, 160] });
  return {}; });
// 14.5 - 15.95: gece, yatağında yalnız, iç çeker
S(14.5, 15.95, (t, lt) => { room(t, { night: 1 }); C.fillStyle = 'rgba(40,50,90,.18)'; C.fillRect(0, 0, W, H);
  shape(rectP(140, 1300, 860, 220), [120, 150, 220], { sp: 8 }); shape(rectP(140, 1240, 220, 90), [250, 250, 250]);
  const k = kid({ x: 560, y: 1460, s: 230, mood: 'sad', look: .5, mouth: talk(t, 14.5, 16), noLegs: 1, tear: sm(lt / 1.2), arms: [[.9, 1.3], [.9, 1.3]] });
  phone(560, 1150, 120, 200, 0); const g = C.createRadialGradient(560, 1000, 10, 560, 1000, 360); g.addColorStop(0, 'rgba(200,230,255,.35)'); g.addColorStop(1, 'rgba(200,230,255,0)'); C.fillStyle = g; C.fillRect(0, 600, W, 800);
  write('ah...', 860, 820, 80, { col: [140, 140, 160], a: sm((lt - .6) * 2) });
  return {}; });
// 15.95 - son: DING! bir takipçi — sevinç gözyaşları ve takip et kartı
S(15.95, T_END + 1, (t, lt) => { C.fillStyle = 'rgba(40,50,90,.12)'; C.fillRect(0, 0, W, H);
  const k = kid({ x: 540, y: 1900, s: 220, mood: 'happy', tear: (lt * 2) % 1, mouth: 0, arms: [[2.5, .6], [2.5, .6]], bob: -Math.abs(Math.sin(t * 9)) * 30 });
  for (let i = 0; i < 6; i++) { const a = t * 1.5 + i; heart(540 + Math.cos(a) * 380, 950 + Math.sin(a) * 200, 34, PINK); }
  const p = eo(seg(lt, 0, .35)); C.save(); C.translate(540, 430); C.scale(p, p); shape(rectP(-400, -110, 800, 220), [255, 255, 255], { a: .3 }); heart(-310, 0, 50, RED); write('1 yeni takipçi!', 40, 0, 84, { font: 'Kalam', w: 700, col: RED }); C.restore();
  write('DING!', 900, 270, 90, { col: BLUE, rot: .2, font: 'Kalam', w: 700, a: p });
  // takip et kartı
  const q = eo(seg(lt, .6, 1.1)); if (q > 0) { C.save(); C.translate(540, 760); C.scale(q, q); shape(rectP(-330, -100, 660, 200), RED, { sp: 6 }); write('Takip et', -40, 0, 100, { col: [255, 250, 240], font: 'Kalam', w: 700 }); write('murat250sr', 0, 150, 90, { font: 'Kalam', w: 700 });
    const hx = 230 + Math.sin(t * 8) * 10, hy = 40 + Math.abs(Math.sin(t * 6)) * 20; blobC(hx, hy, 40, 50, SKIN); stroke([[hx - 10, hy - 40], [hx - 14, hy - 110]], { w: 26, col: GR, a: .9 }); stroke([[hx - 10, hy - 40], [hx - 14, hy - 110]], { w: 18, col: SKIN }); C.restore(); }
  return { nobadge: q > .5 }; });
SH.sort((a, b) => a.a - b.a);
