'use strict';
// ===== NAKARAT 2 (72-89) =====
// 72 yağmurda yürüyüş (yan kaydırma, lambalar)
function shWalk(t, lt, d, o = {}) {
  const sp = 70; CAM.x = 640 + lt * sp * .2;
  layer(0, 7, c => { camA(c, .3); nightSky(c, [6, 9, 18], [24, 28, 42]); cityBokeh(c, t, o.seed || 81, 30, 100, 420, .6, -10); farCity(c, 470, 83, [12, 14, 22], .5, 1.1); });
  layer(1, 0, c => { c.translate(-lt * sp, 0);
    c.fillStyle = '#0b0c10'; c.fillRect(-300, 480, W + 1200, 300);
    const lx = [100, 520, 940, 1360, 1780]; wetStreet(c, 500, t, lx.map(x => [x + 38, [255, 190, 110], .28, 34]));
    for (const x of lx) { lamp(c, x, 505, 300, t); lampRain(c, t, x + 38, 218, 300, 70); }
    walker(c, t, 560 + lt * sp, 600, 300, lt * 5.6, { rim: [255, 190, 120], rimX: -1.6 });
    rainFall(c, t, 260, 18, 700, .05, [170, 190, 220], .2, 3, 1);
  });
  layer(2, 8, c => { rainFall(c, t, 40, 60, 1400, .05, [200, 210, 230], .22, 9, 3); c.fillStyle = 'rgba(0,0,0,.85)'; c.fillRect(((1800 - lt * 380) % 2400) - 300, 0, 140, H); });
  return { vig: .7 };
}
S(72, 76.25, shWalk);
// 76.25 arama ekranı: başparmak 'ara' tuşunun üstünde, basamıyor
function dialer(c, w, h, t, lt) { const k = w / 300; c.fillStyle = lin(c, 0, 0, 0, h, [[0, [24, 30, 40]], [1, [8, 10, 14]]]); c.fillRect(0, 0, w, h);
  c.fillStyle = rgba([80, 90, 100]); c.beginPath(); c.arc(w / 2, 150 * k, 56 * k, 0, TAU); c.fill(); txt(c, 'S', w / 2, 170 * k, 54 * k, { font: SANS, weight: '600', col: '#dfe5ea', align: 'center' });
  txt(c, 'S.', w / 2, 250 * k, 28 * k, { font: SANS, weight: '600', col: '#fff', align: 'center' }); txt(c, 'cep', w / 2, 278 * k, 15 * k, { font: SANS, col: '#8a96a0', align: 'center' });
  c.fillStyle = '#30d158'; c.beginPath(); c.arc(w / 2, h - 110 * k, 34 * k, 0, TAU); c.fill(); c.fillStyle = '#fff'; c.save(); c.translate(w / 2, h - 110 * k); c.rotate(-.6); c.beginPath(); c.roundRect(-14 * k, -5 * k, 28 * k, 10 * k, 5 * k); c.fill(); c.restore(); }
function shDial(t, lt, d) {
  CAM.z = 1.15 + lt * .04; CAM.y = 420;
  layer(0, 16, c => { streetScene(c, t, { seed: 91, lx: [300, 1000] }); });
  layer(1, 0, c => { camA(c, 1); const x = 640, y = 390, w = 200, rot = .02; hand(c, x, y, w, rot, [255, 190, 120]); phone(c, x, y, w, rot, (c2, ww, hh) => dialer(c2, ww, hh, t, lt));
    // başparmak tuşa yaklaşır, son anda geri çekilir
    const k = sm(seg(lt, .4, 2.0)) * (1 - sm(seg(lt, 2.6, 3.6))); const tx = lerp(840, 650, k), ty = lerp(560, 480, k);
    c.save(); c.translate(tx, ty); c.rotate(-.7); c.fillStyle = lin(c, -30, 0, 30, 0, [[0, [20, 17, 19]], [1, [58, 48, 50]]]); c.beginPath(); c.roundRect(-22, -36, 44, 200, 22); c.fill(); c.fillStyle = 'rgba(200,170,160,.35)'; c.beginPath(); c.ellipse(0, -22, 14, 12, 0, 0, TAU); c.fill(); c.restore();
    fingers(c, x, y, w, rot, [255, 190, 120]); rad(c, 640, 380, 300, [80, 120, 200], .15); });
  layer(2, 0, c => { glassDrops(c, t, null, .5, .3); rainFall(c, t, 80, 30, 900, .04, [200, 210, 230], .15, 4, 1); });
  return { vig: .7 };
}
S(76.25, 80.5, shDial);
// 80.5 "Unuttum de, gideyim": otobüs gelir, durur, gider — o binmez
function bus(c, x, y, s, t) { c.save(); c.translate(x, y); c.scale(s, s);
  c.fillStyle = lin(c, 0, -300, 0, 0, [[0, [40, 44, 52]], [1, [16, 18, 22]]]); c.beginPath(); c.roundRect(-480, -300, 960, 290, 20); c.fill();
  for (let i = 0; i < 7; i++) { c.fillStyle = lin(c, 0, -270, 0, -150, [[0, [255, 230, 180]], [1, [220, 180, 120]]]); c.fillRect(-440 + i * 128, -270, 110, 120); }
  c.fillStyle = 'rgba(0,0,0,.6)'; for (let i = 0; i < 9; i++) { const r = rng(i + 4); if (r() < .5) { c.beginPath(); c.arc(-420 + i * 100 + r() * 40, -190, 16, 0, TAU); c.fill(); c.fillRect(-436 + i * 100 + r() * 40, -175, 32, 30); } }
  c.fillStyle = '#ff6a3a'; c.fillRect(-460, -296, 300, 18); rad(c, 470, -40, 90, [255, 240, 210], .9); rad(c, -470, -40, 70, [255, 40, 30], .8);
  c.fillStyle = '#060608'; for (const wx of [-300, 300]) { c.beginPath(); c.arc(wx, -10, 46, 0, TAU); c.fill(); } c.restore(); }
function shBus(t, lt, d) {
  CAM.z = 1.05;
  const bx = lt < 1.4 ? lerp(-900, 560, eo(lt / 1.4)) : lt < 2.8 ? 560 : 560 + Math.pow(lt - 2.8, 2) * 900;
  layer(0, 6, c => { streetScene(c, t, { seed: 101, lx: [80, 1150] }); });
  layer(1, 0, c => { // durak
    c.fillStyle = 'rgba(160,190,220,.12)'; c.fillRect(760, 260, 360, 240); c.fillStyle = '#0c0d10'; c.fillRect(760, 250, 380, 14); c.fillRect(760, 250, 8, 260); c.fillRect(1132, 250, 8, 260); rad(c, 940, 270, 200, [190, 220, 255], .25);
    fig(c, 940, 505, 260, Object.assign({}, P0, { head: .05 }), { col: [10, 11, 16], rim: [190, 220, 255], rimX: 1.4, dir: -1 });
    reflect(c, 505, c2 => fig(c2, 940, 505, 260, P0, { col: [10, 11, 16], dir: -1 }), .2);
    bus(c, bx, 515, .62, t); });
  layer(2, 0, c => { rainFall(c, t, 280, 18, 700, .05, [170, 190, 220], .2, 3, 1); });
  return { vig: .7 };
}
S(80.5, 84.75, shBus);
// 84.75 "Bu kalbi başka birine nasıl vereyim?": sahilde korkuluk, karşıda şehir, avuçta yüzük
function shShore(t, lt, d) {
  CAM.z = 1.03 + lt * .02;
  layer(0, 4, c => { camA(c, .3); nightSky(c, [5, 8, 16], [30, 30, 50]); farCity(c, 380, 111, [14, 16, 26], .9, .8); cityBokeh(c, t, 113, 40, 280, 390, .6);
    // deniz + yansımalar
    c.fillStyle = lin(c, 0, 380, 0, H, [[0, [14, 18, 30]], [1, [4, 6, 10]]]); c.fillRect(-300, 380, W + 600, 400);
    const r = rng(7); c.save(); c.globalCompositeOperation = 'lighter'; for (let i = 0; i < 80; i++) { const x = r() * W, col = r() < .7 ? [255, 190, 110] : [140, 180, 255]; for (let j = 0; j < 8; j++) { const y = 392 + j * 16 + r() * 8, w = 10 + r() * 40; c.fillStyle = rgba(col, .25 * (1 - j / 8) * (.5 + .5 * Math.sin(t * 2 + i + j))); c.fillRect(x - w / 2 + Math.sin(t + j) * 6, y, w, 2); } } c.restore(); });
  layer(1, 0, c => { camA(c, 1); c.fillStyle = '#07080b'; c.fillRect(-200, 560, W + 400, 20); for (let x = -200; x < W + 200; x += 90) c.fillRect(x, 560, 8, 200); c.fillRect(-200, 610, W + 400, 8);
    fig(c, 760, 700, 430, Object.assign({}, P0, { head: .32, lean: .1, lA: [.18, .15], rA: [.12, .2] }), { col: [8, 9, 13], rim: [255, 200, 140], rimX: 1.5, dir: 1 }); });
  layer(2, 0, c => { rainFall(c, t, 120, 22, 800, .04, [200, 210, 230], .18, 5, 1); });
  return { vig: .72 };
}
S(84.75, 89, shShore);
// ===== 89-94 geçiş: sabah, kafe dışı (gri yağmur, sıcak vitrin) =====
function cafeFront(c, t) { c.fillStyle = lin(c, 0, 0, 0, H, [[0, [70, 78, 90]], [1, [40, 44, 52]]]); c.fillRect(-300, -300, W + 600, H + 600); c.translate(0, 50);
  c.fillStyle = '#2a2624'; c.fillRect(200, 60, 900, 480); c.fillStyle = lin(c, 0, 160, 0, 480, [[0, [210, 150, 90]], [1, [150, 90, 50]]]); c.fillRect(250, 170, 520, 320); c.fillRect(820, 170, 230, 330);
  rad(c, 510, 300, 360, [255, 190, 120], .3); c.fillStyle = '#1a1614'; c.fillRect(250, 300, 520, 8); for (let i = 0; i < 4; i++) c.fillRect(250 + i * 130, 170, 6, 320);
  for (const [x, y] of [[330, 470], [470, 470], [620, 470]]) { c.fillStyle = 'rgba(30,20,14,.85)'; c.fillRect(x - 40, y - 4, 80, 6); c.fillRect(x - 3, y, 6, 30); }
  c.fillStyle = '#7a1e1a'; c.beginPath(); c.moveTo(180, 120); c.lineTo(1120, 120); c.lineTo(1160, 170); c.lineTo(140, 170); c.fill(); for (let i = 0; i < 20; i++) { c.fillStyle = i % 2 ? '#7a1e1a' : '#e6dccb'; c.beginPath(); c.moveTo(140 + i * 51, 170); c.lineTo(191 + i * 51, 170); c.quadraticCurveTo(165 + i * 51, 190, 140 + i * 51, 170); c.fill(); }
  c.save(); c.font = `italic 700 54px ${FONT}`; c.textAlign = 'center'; c.fillStyle = '#ffd9a0'; c.shadowColor = '#ffb060'; c.shadowBlur = 20; c.fillText('Kafe', 640, 106); c.restore();
  c.fillStyle = lin(c, 0, 540, 0, H, [[0, [36, 38, 44]], [1, [20, 22, 26]]]); c.fillRect(-300, 540, W + 600, 400); wetStreet(c, 548, t, [[510, [255, 190, 120], .22, 300], [935, [255, 190, 120], .18, 120]]); }
function shCafeOut(t, lt, d) { CAM.z = 1 + lt * .03;
  layer(0, 0, c => { camA(c, 1); cafeFront(c, t); }); layer(1, 0, c => { rainFall(c, t, 260, 22, 800, .05, [200, 210, 220], .25, 13, 1); }); layer(2, 9, c => { rainFall(c, t, 30, 70, 1400, .05, [220, 230, 240], .25, 3, 3); });
  return { vig: .55, top: [70, 90, 110], bot: [255, 170, 110] }; }
S(89, 94, shCafeOut, { xo: .3 });
// ===== KITA 2 =====
function cafeIn(c, t, o = {}) { // iç mekân: sıcak duvar, pencere dışında yağmurlu sokak
  c.fillStyle = lin(c, 0, 0, 0, H, [[0, [70, 46, 32]], [1, [40, 26, 20]]]); c.fillRect(-300, -300, W + 600, H + 600);
  c.fillStyle = lin(c, 0, 80, 0, 460, [[0, [90, 100, 116]], [1, [60, 66, 78]]]); c.fillRect(o.wx || 520, 60, 760, 420); cityBokeh(c, t, 121, 14, 120, 440, .35, 0, [[255, 200, 140], [200, 220, 255]]);
  if (o.street) o.street(c);
  c.fillStyle = '#2a1c16'; c.fillRect((o.wx || 520) - 14, 50, 14, 440); c.fillRect((o.wx || 520) + 370, 50, 14, 440); c.fillRect((o.wx || 520) - 14, 470, 800, 18);
  for (const x of [200, 640, 1080]) { c.fillStyle = '#111'; c.fillRect(x - 2, -100, 4, 140); rad(c, x, 50, 200, [255, 190, 120], .45); rad(c, x, 50, 18, [255, 240, 210], 1); }
}
function teaGlass(c, x, y, s, t, o = {}) { c.save(); c.translate(x, y); c.scale(s, s);
  c.fillStyle = 'rgba(0,0,0,.3)'; c.beginPath(); c.ellipse(4, 6, 54, 12, 0, 0, TAU); c.fill(); c.fillStyle = lin(c, -50, 0, 50, 0, [[0, [190, 186, 176]], [.5, [245, 242, 234]], [1, [170, 166, 160]]]); c.beginPath(); c.ellipse(0, 0, 54, 13, 0, 0, TAU); c.fill(); // tabak
  c.beginPath(); c.moveTo(-26, -100); c.bezierCurveTo(-34, -70, -14, -50, -20, -26); c.quadraticCurveTo(-24, -4, -16, -2); c.lineTo(16, -2); c.quadraticCurveTo(24, -4, 20, -26); c.bezierCurveTo(14, -50, 34, -70, 26, -100); c.closePath();
  if (!o.empty) { c.save(); c.clip(); c.fillStyle = lin(c, 0, -90, 0, 0, [[0, [190, 70, 20]], [1, [110, 30, 10]]]); c.fillRect(-40, -88, 80, 90); c.fillStyle = 'rgba(255,200,140,.5)'; c.fillRect(-40, -90, 80, 4); c.restore(); }
  c.strokeStyle = 'rgba(255,255,255,.45)'; c.lineWidth = 2; c.stroke(); c.fillStyle = 'rgba(255,255,255,.12)'; c.fill(); c.fillStyle = 'rgba(255,255,255,.55)'; c.fillRect(-18, -86, 3, 60);
  if (!o.empty && o.steam !== 0) { c.strokeStyle = 'rgba(255,240,220,.16)'; c.lineWidth = 7; c.lineCap = 'round'; for (let i = 0; i < 3; i++) { const p = (t * .3 + i / 3) % 1; c.globalAlpha = Math.sin(p * Math.PI); c.beginPath(); c.moveTo(-8 + i * 8, -104); c.bezierCurveTo(-20 + Math.sin(t + i) * 12, -140 - p * 40, 10, -170 - p * 50, -6 + Math.sin(t * 1.4 + i) * 14, -210 - p * 60); c.stroke(); } }
  c.restore(); }
// 94 "Aynı kafeye gittim, aynı masa"
function shCafeTable(t, lt, d) { CAM.z = 1.04 + lt * .02; CAM.x = 620;
  layer(0, 8, c => { camA(c, .5); cafeIn(c, t); });
  layer(1, 0, c => { camA(c, 1); c.fillStyle = lin(c, 0, 470, 0, 720, [[0, [96, 64, 44]], [1, [46, 30, 22]]]); c.beginPath(); c.ellipse(640, 540, 380, 70, 0, 0, TAU); c.fill(); c.fillRect(620, 540, 40, 300);
    // iki sandalye: biri dolu, biri boş
    c.fillStyle = '#20140f'; c.fillRect(980, 330, 16, 300); c.fillRect(980, 330, 120, 14); c.fillRect(980, 470, 140, 14); c.fillRect(1100, 470, 12, 200);
    fig(c, 330, 690, 400, Object.assign({}, P0, { sit: 1, lean: .1, head: .15, lA: [.5, 1.1], rA: [.4, 1.2], lL: [1.5, -1.5], rL: [1.45, -1.5] }), { col: [18, 12, 10], rim: [255, 190, 120], rimX: 1.5 });
  });
  return { vig: .55, top: [70, 60, 60], bot: [255, 160, 90] }; }
S(94, 96.6, shCafeTable);
// 96.6 "Garson sordu: İki çay mı?": tepside iki çay, garson eli
function shWaiter(t, lt, d) { CAM.z = 1.1 - lt * .02;
  layer(0, 14, c => { cafeIn(c, t); });
  layer(1, 0, c => { camA(c, 1); const y = 330 + Math.sin(t * 2) * 3; c.fillStyle = lin(c, 0, y - 10, 0, y + 20, [[0, [210, 200, 190]], [1, [120, 110, 100]]]); c.beginPath(); c.ellipse(660, y + 20, 260, 44, 0, 0, TAU); c.fill(); teaGlass(c, 590, y + 20, 1.3, t); teaGlass(c, 740, y + 24, 1.3, t + 1);
    // garson kolu (beyaz gömlek)
    c.fillStyle = lin(c, 900, 0, 1300, 0, [[0, [230, 226, 220]], [1, [130, 126, 120]]]); c.beginPath(); c.moveTo(880, y + 50); c.bezierCurveTo(980, y + 60, 1100, y + 120, 1320, y + 160); c.lineTo(1320, y + 300); c.bezierCurveTo(1100, y + 240, 950, y + 120, 860, y + 90); c.fill();
    c.fillStyle = lin(c, 760, 0, 900, 0, [[0, [150, 100, 80]], [1, [90, 60, 50]]]); c.beginPath(); c.ellipse(860, y + 70, 60, 30, -.2, 0, TAU); c.fill(); });
  return { vig: .55, top: [70, 60, 60], bot: [255, 160, 90] }; }
S(96.6, 99.2, shWaiter);
// 99.2 "Dedim: Bir... kaldım öyle yasta": tek çay, karşıda boş sandalye
function shOneTea(t, lt, d) { CAM.z = 1.02 + lt * .03;
  layer(0, 10, c => { cafeIn(c, t); c.fillStyle = '#20140f'; c.fillRect(860, 300, 18, 320); c.fillRect(860, 300, 150, 16); c.fillRect(860, 460, 170, 16); c.fillRect(1010, 460, 14, 220); });
  layer(1, 0, c => { camA(c, 1); c.fillStyle = lin(c, 0, 470, 0, 720, [[0, [110, 74, 50]], [1, [50, 32, 24]]]); c.fillRect(-100, 520, W + 200, 300); teaGlass(c, 460, 590, 1.8, t);
    // ikinci bardak tepsiyle geri gider
    const k = sm(seg(lt, .3, 1.6)); c.globalAlpha = 1 - k; teaGlass(c, lerp(760, 1300, k), lerp(590, 420, k), 1.8, t + 1); c.globalAlpha = 1; });
  return { vig: .65, top: [60, 60, 70], bot: [255, 160, 90] }; }
S(99.2, 101.8, shOneTea);
// 101.8 "Sen şimdi kiminle gülüyorsun, kimin elini tutuyorsun?": pencereden şemsiyeli el ele çift
function couple(c, t, x, y, h) { const P1 = walkPose(t * 5.2, .8), P2 = walkPose(t * 5.2 + .3, .8);
  P1.rA = [.5, -.4]; P2.lA = [.5, -.3];
  fig(c, x - h * .14, y, h * .93, P2, { col: [40, 24, 26], female: 1, rim: [255, 200, 150], rimX: 1.3 }); fig(c, x + h * .14, y, h, P1, { col: [26, 22, 26], rim: [255, 200, 150], rimX: 1.3, dir: 1 });
  c.fillStyle = '#3a1418'; c.beginPath(); c.moveTo(x - h * .55, y - h * .9); c.quadraticCurveTo(x, y - h * 1.35, x + h * .55, y - h * .9); c.quadraticCurveTo(x, y - h * 1.0, x - h * .55, y - h * .9); c.fill(); c.fillRect(x - 2, y - h * 1.1, 4, h * .4); }
function shCouple(t, lt, d) { CAM.z = 1.03;
  layer(0, 3, c => { cafeIn(c, t, { wx: 240, street: c2 => { c2.fillStyle = 'rgba(30,34,44,.5)'; c2.fillRect(240, 380, 760, 100); couple(c2, t, lerp(1100, 160, lt / d), 470, 300); rainFall(c2, t, 120, 16, 600, .03, [210, 220, 235], .25, 4, 1); } }); });
  layer(1, 0, c => { glassDrops(c, t, null, .55, .5); });
  layer(2, 10, c => { c.fillStyle = 'rgba(20,12,10,.95)'; c.beginPath(); c.moveTo(-50, H + 30); c.bezierCurveTo(-30, 460, 60, 400, 180, 400); c.bezierCurveTo(300, 400, 340, 500, 360, H + 30); c.fill(); profileHead(c, 190, 300, .95, .05, { light: [255, 190, 120], col: [16, 11, 10], la: .4 }); });
  return { vig: .6, top: [60, 70, 90], bot: [255, 160, 90] }; }
S(101.8, 104.4, shCouple);
// 104.4 "Ben hâlâ o sokakta...": o duruyor, kalabalık hızla akıp geçiyor (hareket izleri)
function shCrowd(t, lt, d) { CAM.z = 1.04;
  layer(0, 5, c => { streetScene(c, t, { seed: 131, lx: [180, 1040] }); });
  layer(1, 0, c => { fig(c, 640, 640, 380, Object.assign({}, P0, { head: .08 }), { col: [10, 11, 16], rim: [255, 190, 120], rimX: 1.4 }); reflect(c, 640, c2 => fig(c2, 640, 640, 380, P0, { col: [10, 11, 16] }), .2); });
  layer(2, 0, c => { for (let i = 0; i < 14; i++) { const r = rng(i + 30), dir = r() < .5 ? 1 : -1, sp = 900 + r() * 700, x = dir > 0 ? ((r() * 2000 + lt * sp) % 2200) - 400 : 1800 - ((r() * 2000 + lt * sp) % 2200), h = 330 + r() * 120, y = 620 + r() * 60;
      for (let k = 0; k < 6; k++) { c.globalAlpha = .22 * (1 - k / 6); fig(c, x - dir * k * 28, y, h, walkPose(lt * 9 + i, 1), { col: [20, 22, 30], dir, female: r() < .5 }); } } c.globalAlpha = 1; });
  return { vig: .7 }; }
S(104.4, 107, shCrowd);
// 107 "Bir gün karşılaşırsak, yüzüme bakma": yaya geçidinin iki ucu, göz göze, o başını çevirir
function crosswalk(c, t) { c.fillStyle = '#0b0c10'; c.fillRect(-300, 420, W + 600, 400); for (let i = 0; i < 9; i++) { c.fillStyle = 'rgba(220,220,225,.22)'; c.beginPath(); const y = 450 + i * 30, w = 900 + i * 60; c.moveTo(640 - w / 2 + 90, y); c.lineTo(640 + w / 2 - 90, y); c.lineTo(640 + w / 2 - 80, y + 14); c.lineTo(640 - w / 2 + 80, y + 14); c.fill(); }
  wetStreet(c, 425, t, [[220, [255, 60, 50], .25, 30], [1060, [80, 230, 120], .2, 30]]); rad(c, 220, 260, 60, [255, 50, 40], .8); rad(c, 1060, 260, 60, [60, 230, 110], .8); c.fillStyle = '#060608'; c.fillRect(214, 260, 12, 170); c.fillRect(1054, 260, 12, 170); }
function shMeet(t, lt, d) { CAM.z = 1.02 + lt * .03;
  layer(0, 6, c => { camA(c, .4); nightSky(c, [6, 9, 18], [26, 30, 44]); cityBokeh(c, t, 141, 30, 100, 400, .55); farCity(c, 425, 143, [12, 14, 22], .5); });
  layer(1, 0, c => { camA(c, 1); crosswalk(c, t); const turn = sm(seg(lt, 1.0, 1.6));
    fig(c, 380, 600, 330, Object.assign({}, P0, { head: .02 }), { col: [10, 11, 16], rim: [255, 120, 90], rimX: -1.4, dir: 1 });
    fig(c, 900, 590, 310, Object.assign({}, P0, { head: lerp(0, .5, turn) }), { col: [24, 14, 16], female: 1, rim: [120, 230, 160], rimX: 1.4, dir: turn > .5 ? 1 : -1 }); });
  layer(2, 0, c => { rainFall(c, t, 220, 18, 700, .05, [170, 190, 220], .2, 3, 1); });
  return { vig: .72 }; }
S(107, 109.6, shMeet);
// 109.6 "Çünkü gözlerim ele verir...": göz yakın plan, yaş birikir
function shEye(t, lt, d, o = {}) { CAM.z = 1.0 + lt * .035; CAM.x = 620;
  layer(0, 14, c => { nightSky(c, [6, 9, 18], [26, 30, 44]); cityBokeh(c, t, 161, 40, 60, 700, .8, 2, [[255, 120, 90], [120, 230, 160], [255, 190, 110], [200, 220, 255]]); });
  layer(1, 0, c => { camA(c, 1); const x = 560, y = 330, s = 1.75, r = .02;
    closeProfile(c, t, x, y, s, { rot: r, light: [255, 170, 120], lx: 130, ly: -30, la: .8, rimX: 2.5, rimY: -1, wet: 1, blink: Math.max(0, 1 - Math.abs(lt - 1.9) * 9) });
    // yanaktan süzülen yaş
    const k = sm(seg(lt, .6, 2.4)); if (k > 0) { c.save(); c.translate(x, y); c.rotate(r); c.scale(s, s); const ty = lerp(-6, 60, k), tx = 58 - k * 4;
      c.strokeStyle = 'rgba(255,220,190,.35)'; c.lineWidth = 1.6; c.beginPath(); c.moveTo(58, -6); c.quadraticCurveTo(60, ty * .5, tx, ty); c.stroke(); rad(c, tx, ty, 7, [255, 230, 200], .9); c.fillStyle = 'rgba(255,245,235,.9)'; c.beginPath(); c.ellipse(tx, ty, 1.6, 2.3, 0, 0, TAU); c.fill(); c.restore(); } });
  layer(2, 1, c => { rainFall(c, t, 90, 24, 800, .04, [220, 200, 190], .2, 5, 1); });
  return { vig: .78 }; }
S(109.6, 112.2, shEye);
// 112.2 "Sadece Nasılsın de, ben İyiyim derim / Sen inan, ben de o yalanla eve dönerim"
function shPass(t, lt, d) { CAM.z = 1.02; const k = lt / d;
  layer(0, 6, c => { camA(c, .4); nightSky(c, [6, 9, 18], [26, 30, 44]); cityBokeh(c, t, 151, 30, 100, 400, .55); farCity(c, 425, 153, [12, 14, 22], .5); });
  layer(1, 0, c => { crosswalk(c, t); const a = lerp(260, 900, k), b = lerp(1000, 380, k), stop = Math.max(0, 1 - Math.abs(k - .45) * 5);
    fig(c, b, 600, 310, walkPose(lt * 5.4, 1 - stop * .9), { col: [24, 14, 16], female: 1, rim: [120, 230, 160], rimX: 1.4, dir: -1 });
    fig(c, a, 610, 330, Object.assign(walkPose(lt * 5.4 + 1, 1 - stop * .9), { head: .06 }), { col: [10, 11, 16], rim: [255, 120, 90], rimX: -1.4, dir: 1 }); });
  layer(2, 0, c => { rainFall(c, t, 220, 18, 700, .05, [170, 190, 220], .2, 3, 1); });
  return { vig: .72 }; }
S(112.2, 115, shPass, { xo: .5 });
