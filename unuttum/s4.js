'use strict';
// ===== KÖPRÜ (115-133): sadece piyano =====
// 115 "Ne olur bir kere ara, konuşma": yatakta ters duran telefon; sonra ekran yanar (S. arıyor)
function incoming(c, w, h, t) { const k = w / 300; c.fillStyle = lin(c, 0, 0, 0, h, [[0, [30, 40, 56]], [1, [10, 12, 18]]]); c.fillRect(0, 0, w, h);
  txt(c, 'S.', w / 2, 150 * k, 34 * k, { font: SANS, weight: '600', col: '#fff', align: 'center' }); txt(c, 'arıyor...', w / 2, 184 * k, 16 * k, { font: SANS, col: '#9aa6b0', align: 'center' });
  const p = (t * 1.2) % 1; c.strokeStyle = `rgba(255,255,255,${.4 * (1 - p)})`; c.lineWidth = 2 * k; c.beginPath(); c.arc(w / 2, 300 * k, (40 + p * 40) * k, 0, TAU); c.stroke(); c.fillStyle = rgba([80, 90, 100]); c.beginPath(); c.arc(w / 2, 300 * k, 40 * k, 0, TAU); c.fill(); txt(c, 'S', w / 2, 316 * k, 40 * k, { font: SANS, weight: '600', col: '#dfe5ea', align: 'center' });
  for (const [x, col] of [[.27, '#ff453a'], [.73, '#30d158']]) { c.fillStyle = col; c.beginPath(); c.arc(w * x, h - 90 * k, 30 * k, 0, TAU); c.fill(); } }
function shWish(t, lt, d) { CAM.z = 1.0 + lt * .02; CAM.y = 400;
  const on = lt > 2.6, flip = sm(seg(lt, 2.6, 3.0));
  layer(0, 11, c => { camA(c, .5); sideBg(c, t, 700); closeProfile(c, t, 330, 260, 1.0, { rot: .1, light: [120, 150, 220], la: .4 }); });
  layer(1, 0, c => { camA(c, 1); c.fillStyle = lin(c, 0, 420, 0, 720, [[0, [34, 38, 54]], [1, [12, 13, 20]]]); c.beginPath(); c.moveTo(-100, 470); c.bezierCurveTo(300, 430, 900, 460, 1400, 440); c.lineTo(1400, 800); c.lineTo(-100, 800); c.fill();
    for (let i = 0; i < 5; i++) { c.strokeStyle = 'rgba(0,0,0,.25)'; c.lineWidth = 6; c.beginPath(); c.moveTo(100 + i * 260, 470); c.quadraticCurveTo(200 + i * 260, 560, 120 + i * 260, 720); c.stroke(); }
    const buzz = on ? Math.sin(t * 60) * 2 * (Math.sin(t * 6) > 0 ? 1 : 0) : 0;
    c.save(); c.translate(700 + buzz, 560); c.scale(1, .42); c.rotate(-.3);
    if (flip < .5) { c.fillStyle = '#121318'; rrect(c, -110, -220, 220, 440, 30); c.fill(); c.fillStyle = '#1e2028'; c.beginPath(); c.roundRect(-90, -200, 70, 90, 16); c.fill(); }
    else { c.fillStyle = '#0b0c10'; rrect(c, -110, -220, 220, 440, 30); c.fill(); c.save(); rrect(c, -100, -210, 200, 420, 26); c.clip(); c.translate(-100, -210); incoming(c, 200, 420, t); c.restore(); }
    c.restore(); if (flip > .5) { rad(c, 700, 540, 420, [120, 170, 255], .35); cone(c, 700, 540, -Math.PI / 2, .7, 400, [140, 180, 255], .08); } });
  return { vig: .78 }; }
S(115, 120, shWish, { x: .8 });
// 120 "Sadece nefesini duyayım...": telefon kulakta, cama yakın; nefesi camı buğular
function shBreath(t, lt, d) { CAM.z = 1.04 + lt * .02;
  const br = .5 - .5 * Math.cos(lt * TAU / 2.55);
  layer(0, 10, c => { nightSky(c, [8, 12, 22], [30, 30, 46]); cityBokeh(c, t, 171, 50, 80, 700, .8, 2); });
  layer(1, 0, c => { camA(c, 1); closeProfile(c, t, 520, 300, 1.6, { rot: -.05, light: [140, 170, 230], lx: 100, ly: -40, la: .5, rimX: 2.5, rimY: 0, blink: Math.max(0, 1 - Math.abs(lt - 3) * 9) * .8 + .15 });
    // kulağa dayalı telefon
    c.save(); c.translate(500, 300); c.rotate(-.05); c.scale(1.6, 1.6); c.fillStyle = '#0a0b0e'; c.beginPath(); c.roundRect(-40, -46, 26, 96, 6); c.fill(); c.fillStyle = 'rgba(150,190,255,.6)'; c.fillRect(-16, -40, 2, 84); rad(c, -14, 0, 60, [130, 170, 255], .3); 
    c.fillStyle = lin(c, -50, 0, -10, 0, [[0, [20, 17, 19]], [1, [50, 41, 43]]]); for (let i = 0; i < 4; i++) { c.beginPath(); c.roundRect(-54, -30 + i * 18, 34, 15, 7); c.fill(); } c.restore(); });
  // cam buğusu: nefesle büyüyüp küçülen bulut
  layer(2, 14, c => { const x = 820, y = 420, r = 90 + br * 110; const g = c.createRadialGradient(x, y, 10, x, y, r); g.addColorStop(0, `rgba(200,210,225,${.25 + .3 * br})`); g.addColorStop(1, 'rgba(200,210,225,0)'); c.fillStyle = g; c.beginPath(); c.ellipse(x, y, r * 1.2, r, 0, 0, TAU); c.fill(); });
  layer(3, 0, c => { glassDrops(c, t, null, .6, .7); });
  return { vig: .78 }; }
S(120, 125, shBreath);
// 125 "Sonra kapat...": 'Arama sonlandı', ekran kararır
function ended(c, w, h, t, lt) { const k = w / 300; c.fillStyle = lin(c, 0, 0, 0, h, [[0, [30, 40, 56]], [1, [10, 12, 18]]]); c.fillRect(0, 0, w, h);
  txt(c, 'S.', w / 2, 150 * k, 34 * k, { font: SANS, weight: '600', col: '#fff', align: 'center' }); txt(c, 'Arama sonlandı', w / 2, 186 * k, 16 * k, { font: SANS, col: '#ff6b60', align: 'center' }); txt(c, '00:47', w / 2, 214 * k, 16 * k, { font: SANS, col: '#9aa6b0', align: 'center' });
  const dim = sm(seg(lt, 1.6, 3.2)); c.fillStyle = `rgba(0,0,0,${dim})`; c.fillRect(0, 0, w, h); }
function shHangup(t, lt, d) { CAM.z = 1.02 + lt * .02; const dim = sm(seg(lt, 1.6, 3.2));
  layer(0, 14, c => { sideBg(c, t, 400); });
  layer(1, 0, c => { camA(c, 1); phoneHand(c, 640, 380, 220, .05, (c2, w, h) => ended(c2, w, h, t, lt), 1 - dim); });
  return { vig: .78 }; }
S(125, 128.5, shHangup);
// 128.5 "Ben yine yaşarım... galiba": pencereyi açar, şafak, yağmur diner, derin nefes
function shDawnWindow(t, lt, d) { const k = sm(seg(lt, .3, 2.5)), op = eo(seg(lt, .4, 1.8));
  CAM.z = 1.06 - lt * .012;
  layer(0, 3, c => { c.fillStyle = lin(c, 0, 0, 0, H, [[0, mix([20, 28, 48], [120, 150, 190], k)], [.7, mix([40, 40, 60], [250, 200, 170], k)], [1, mix([30, 30, 40], [255, 220, 190], k)]]); c.fillRect(0, 0, W, H);
    farCity(c, 560, 181, mix([14, 16, 24], [80, 90, 116], k), .3 * (1 - k), 1.2); rad(c, 980, 560, 500, [255, 210, 170], .5 * k); rainFall(c, t, 160 * (1 - k), 20, 700, .04, [200, 210, 230], .2 * (1 - k), 5, 1); });
  layer(1, 0, c => { // içeriden pencere çerçevesi, kanatlar dışa açılır
    c.fillStyle = '#0c0d12'; c.fillRect(0, 0, 220, H); c.fillRect(1060, 0, 220, H); c.fillRect(0, 0, W, 90); c.fillRect(0, 600, W, 120);
    for (const sd of [-1, 1]) { const w = 420 * (1 - op * .82), x0 = sd < 0 ? 220 : 1060 - w; c.fillStyle = 'rgba(160,180,210,.10)'; c.fillRect(x0, 90, w, 510); c.fillStyle = '#14151b'; c.fillRect(x0, 90, w, 16); c.fillRect(x0, 584, w, 16); c.fillRect(sd < 0 ? x0 + w - 16 : x0, 90, 16, 510); c.fillRect(sd < 0 ? x0 : x0 + w - 16, 90, 16, 510); }
    // pencerede duran siluet (arkadan), nefesle omuzlar kalkar
    const b = Math.sin(seg(lt, 2.2, 4.2) * Math.PI); fig(c, 640, 860 - b * 8, 640, Object.assign({}, P0, { head: -.1 - b * .1, lA: [.05, .05], rA: [.05, .05] }), { col: [10, 10, 14], rim: mix([140, 170, 220], [255, 220, 180], k), rimX: 1.6, rimA: .8 }); });
  return { vig: .55, top: [90, 110, 140], bot: [255, 190, 140] }; }
S(128.5, 133, shDawnWindow, { x: .6 });
// ===== FİNAL NAKARAT (133-149) =====
function rooftop(c, t, warm, k) { const sky = warm ? [[0, [90, 60, 110]], [.55, [240, 140, 90]], [1, [255, 210, 140]]] : [[0, [70, 96, 150]], [.6, [240, 170, 140]], [1, [255, 220, 170]]];
  c.fillStyle = lin(c, 0, 0, 0, 520, sky); c.fillRect(-300, -300, W + 600, 900); const sy = warm ? 450 : 470 - k * 40; rad(c, 900, sy, 520, [255, 210, 150], .55); c.fillStyle = 'rgba(255,240,210,.95)'; c.beginPath(); c.arc(900, sy, 40, 0, TAU); c.fill();
  for (let i = 0; i < 18; i++) { const a = -Math.PI + i / 18 * Math.PI; cone(c, 900, sy, a, .02, 1100, [255, 220, 170], .04); }
  const hz = warm ? [255, 170, 120] : [240, 190, 170];
  farCity(c, 524, 197, mix(warm ? [70, 40, 60] : [60, 60, 90], hz, .45), .2, .45); c.fillStyle = lin(c, 0, 380, 0, 530, [[0, hz, 0], [1, hz, .45]]); c.fillRect(-300, 380, W + 600, 160);
  farCity(c, 536, 191, mix(warm ? [70, 40, 60] : [60, 60, 90], hz, .2), .3, .6); c.fillStyle = lin(c, 0, 420, 0, 540, [[0, hz, 0], [1, hz, .3]]); c.fillRect(-300, 420, W + 600, 130);
  farCity(c, 548, 193, warm ? [44, 26, 40] : [36, 38, 60], .4, .68);
  c.fillStyle = warm ? '#2c1a26' : '#24263a'; for (const [x, h] of [[120, 30], [380, 22], [760, 28], [1100, 34]]) { c.fillRect(x, 548 - 150 - h, 3, h); }
  c.fillStyle = '#0d0c10'; c.fillRect(-300, 560, W + 600, 300); c.fillStyle = '#1a181c'; c.fillRect(-300, 548, W + 600, 16); }
function shRoof(t, lt, d) { CAM.z = 1.08 - lt * .02; CAM.x = 640 + lt * 8; const k = lt / d;
  layer(0, 2, c => { camA(c, .4); rooftop(c, t, 0, k); });
  layer(1, 0, c => { camA(c, 1); fig(c, 500, 560, 380, Object.assign({}, P0, { head: -.08 }), { col: [10, 10, 14], rim: [255, 210, 160], rimX: 1.6 }); });
  layer(2, 0, c => { c.save(); c.globalCompositeOperation = 'lighter'; for (let i = 0; i < 40; i++) { const r = rng(i + 7), x = (r() * W + t * 8) % W, y = r() * 540; c.fillStyle = `rgba(255,230,190,${.25 * r()})`; c.beginPath(); c.arc(x, y + Math.sin(t + i) * 6, 1 + r() * 2, 0, TAU); c.fill(); } c.restore(); });
  return { vig: .5, top: [90, 110, 150], bot: [255, 180, 120] }; }
S(133, 136.85, shRoof, { x: .5 });
// 136.85 anı: aynı çatıda gün batımı, iki siluet (eski film tonu), sonra o tek başına
function shRoofMemory(t, lt, d) { const fade = sm(seg(lt, 2.4, 3.6)); CAM.z = 1.04;
  layer(0, 2, c => { camA(c, .4); rooftop(c, t, 1, 0); }, { a: 1 - fade * .0 });
  layer(1, 0, c => { camA(c, 1); c.globalAlpha = 1 - fade; fig(c, 470, 560, 380, Object.assign({}, P0, { head: .15, rA: [.4, .5] }), { col: [30, 14, 16], rim: [255, 200, 140], rimX: 1.6 }); fig(c, 560, 560, 350, Object.assign({}, P0, { head: -.1, lA: [.4, .5] }), { col: [36, 14, 18], female: 1, dir: -1, rim: [255, 200, 140], rimX: 1.6, wind: 4 });
    c.globalAlpha = fade; fig(c, 500, 560, 380, Object.assign({}, P0, { head: .2 }), { col: [10, 10, 14], rim: [255, 210, 160], rimX: 1.6 }); });
  // eski film: sepya, ışık sızıntısı, çizik
  layer(2, 0, c => { const a = 1 - fade; c.fillStyle = `rgba(255,170,90,${.18 * a})`; c.fillRect(0, 0, W, H); rad(c, 80, 300, 500, [255, 120, 40], .35 * a * (.6 + .4 * Math.sin(t * 3))); c.fillStyle = `rgba(255,255,255,${.25 * a})`; const r = rng((t * 24) | 0); for (let i = 0; i < 3; i++) c.fillRect(r() * W, 0, 1.5, H); }, { mode: 'screen' });
  return { vig: .6, top: [120, 90, 80], bot: [255, 170, 100] }; }
S(136.85, 140.7, shRoofMemory, { x: .2 });
// 140.7 "Unuttum de, gideyim": yüzüğü çatı kenarına bırakır, yürür
function ledgeRing(c, x, y, s, t) { c.save(); c.translate(x, y); c.scale(s, s); c.lineWidth = 4; c.strokeStyle = lin(c, -14, -8, 14, 8, [[0, [255, 230, 150]], [.5, [170, 120, 40]], [1, [255, 220, 130]]]); c.beginPath(); c.ellipse(0, -4, 12, 5, 0, 0, TAU); c.stroke(); rad(c, -6, -7, 14, [255, 250, 220], .9); c.restore(); }
function shLeaveRing(t, lt, d) { CAM.z = 1.05; const wk = sm(seg(lt, 1.4, d));
  layer(0, 2, c => { camA(c, .4); rooftop(c, t, 0, 1); });
  layer(1, 0, c => { camA(c, 1); const bend = Math.sin(seg(lt, .2, 1.4) * Math.PI);
    if (lt < 1.4) fig(c, 560, 560, 380, Object.assign({}, P0, { lean: bend * .5, head: .3, rA: [.3 + bend * 1.0, .2] }), { col: [10, 10, 14], rim: [255, 210, 160], rimX: 1.6 });
    else fig(c, lerp(560, 100, wk), 560, 380, walkPose((lt - 1.4) * 5.2, 1), { col: [10, 10, 14], rim: [255, 210, 160], rimX: 1.6, dir: -1 });
    if (lt > .9) ledgeRing(c, 640, 552, 1.3, t); });
  return { vig: .5, top: [90, 110, 150], bot: [255, 180, 120] }; }
S(140.7, 144.55, shLeaveRing);
// 144.55 "Bu kalbi başka birine nasıl vereyim?": durur, döner, yüzüğü geri alır, göğsüne bastırır
function shTakeBack(t, lt, d) { CAM.z = lerp(1.05, 1.35, sm(seg(lt, 2.2, d))); CAM.x = lerp(640, 600, sm(seg(lt, 2.2, d))); CAM.y = lerp(360, 380, sm(seg(lt, 2.2, d)));
  layer(0, 2 + CAM.z * 2, c => { camA(c, .4); rooftop(c, t, 0, 1); });
  layer(1, 0, c => { camA(c, 1); const back = sm(seg(lt, .3, 1.6)), x = lerp(100, 560, back);
    if (lt < 1.6) fig(c, x, 560, 380, walkPose(lt * 6, 1), { col: [10, 10, 14], rim: [255, 210, 160], rimX: 1.6, dir: 1 });
    else { const bend = Math.sin(seg(lt, 1.6, 2.4) * Math.PI), chest = sm(seg(lt, 2.4, 3.0)); fig(c, 560, 560, 380, Object.assign({}, P0, { lean: bend * .5, head: .3 - chest * .2, rA: [.3 + bend * 1.0 + chest * .4, .2 + chest * 2.2], lA: [.05, .05] }), { col: [10, 10, 14], rim: [255, 210, 160], rimX: 1.6 }); }
    if (lt < 2.0) ledgeRing(c, 640, 552, 1.3, t); });
  return { vig: .5, top: [90, 110, 150], bot: [255, 180, 120] }; }
S(144.55, 149, shTakeBack, { xo: .6 });
// ===== KAPANIŞ (149-167): piyano, fısıltı =====
// 149 "Unuttum de...": onun odası, aynı sohbet onun ekranında
function shHer(t, lt, d) { CAM.z = 1.02 + lt * .015; CAM.x = 660;
  layer(0, 10, c => { camA(c, .5); roomWall(c, [26, 18, 22]); c.fillStyle = lin(c, 0, 60, 0, 560, [[0, [30, 42, 70]], [1, [50, 60, 90]]]); c.fillRect(-20, 40, 520, 520); cityBokeh(c, t, 201, 26, 120, 540, .55, 2); rainShadows(c, t, -20, 40, 520, 520, .3); rad(c, 1100, 200, 400, [255, 170, 110], .3); });
  layer(1, 0, c => { camA(c, 1); profileHead(c, 790, 300, 1.45, .3, { female: 1, flip: 1, light: [140, 180, 255], lx: 150, ly: 60, la: 1.0, rimX: 2, rimY: 3, col: [16, 12, 14], wet: .6, blink: Math.max(0, 1 - Math.abs(lt - 3.5) * 8) });
    c.fillStyle = lin(c, 600, 500, 900, 700, [[0, [14, 11, 13]], [1, [36, 28, 34]]]); c.beginPath(); c.moveTo(1100, H + 20); c.bezierCurveTo(1060, 520, 940, 480, 840, 500); c.bezierCurveTo(760, 510, 700, 560, 680, H + 20); c.fill();
    phoneHand(c, 520, 560, 110, .95, (c2, w, h) => chat(c2, w, h, { name: 'M.', status: 'son görülme 03:12', msgs: [{ t: 'uyudun mu?', me: 0 }, { t: 'bir şey diyecektim', me: 0 }] }), .6); });
  return { vig: .76 }; }
S(149, 155, shHer, { x: 1.0 });
// 155 "Ben de seni unuttum derim...": bölünmüş ekran, ikisi de 'unuttum' yazıp gönderir
function shBoth(t, lt, d) {
  const draw = (x, me, nm, lc, seed) => { phoneHand(ctx, x, 372, 200, me ? -.04 : .04, (c2, w, h) => { const ty = typing('unuttum', lt - (me ? .6 : 1.3), 6), sent = lt > (me ? 2.6 : 3.3); chat(c2, w, h, { name: nm, status: sent ? 'çevrimiçi' : 'yazıyor...', msgs: sent ? [{ t: 'unuttum', me: 1, time: '03:14 ✓✓' }] : [], draft: sent ? '' : ty, cursor: !sent, t }); }); };
  layer(0, 14, c => { c.fillStyle = lin(c, 0, 0, W, 0, [[0, [14, 18, 30]], [.5, [8, 8, 12]], [1, [30, 18, 24]]]); c.fillRect(0, 0, W, H); cityBokeh(c, t, 211, 40, 80, 700, .55, 2); });
  ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W / 2 - 2, H); ctx.clip(); draw(320, 1, 'S.', [140, 180, 255]); ctx.restore();
  ctx.save(); ctx.beginPath(); ctx.rect(W / 2 + 2, 0, W / 2, H); ctx.clip(); draw(960, 1, 'M.', [255, 180, 140]); ctx.restore();
  ctx.fillStyle = '#000'; ctx.fillRect(W / 2 - 2, 0, 4, H);
  return { vig: .7 }; }
S(155, 161, shBoth);
// 161 "İkimiz de inanırız...": iki uzak penceredeki ışık birer birer söner
function shLightsOut(t, lt, d) { CAM.z = 1.0 + lt * .01;
  layer(0, 4, c => { nightSky(c); cityBokeh(c, t, 221, 30, 60, 300, .5); farCity(c, 320, 223, [12, 14, 22], .5, .8); });
  layer(1, 0, c => { const A = [1, 1], B = [3, 2]; facade(c, 60, 140, 4, 4, 110, 120, 225, t, A); facade(c, 820, 180, 4, 4, 100, 110, 227, t, B);
    const offA = sm(seg(lt, 2.0, 2.3)), offB = sm(seg(lt, 3.4, 3.7));
    for (const [h, off] of [[A, offA], [B, offB]]) { const [x, y, w, hh] = h.rect; c.fillStyle = lin(c, x, y, x, y + hh, [[0, [140, 110, 90]], [1, [230, 170, 110]]]); c.fillRect(x, y, w, hh); rad(c, x + w / 2, y + hh / 2, 140, [255, 190, 120], .4); c.fillStyle = `rgba(8,10,16,${off})`; c.fillRect(x, y, w, hh); }
    c.fillStyle = '#0a0b0e'; c.fillRect(-100, 600, W + 200, 200); rainFall(c, t, 200, 18, 700, .05, [170, 190, 220], .18, 3, 1); });
  return { vig: .75 }; }
S(161, 167, shLightsOut, { xo: .8 });
// ===== 167-179 tekrar: kısa geri dönüşler =====
const RE = [[167, 169.4, shWalk], [169.4, 171.8, shOneTea], [171.8, 174.2, shEye], [174.2, 176.6, shRing], [176.6, 179, shLightsOut]];
RE.forEach(([a, b, fn]) => S(a, b, (t, lt, d) => fn(t, lt + (fn === shLightsOut ? 0 : .8), d), { x: .15 }));
// ===== 179-190 bitiş kartı: buğulu cama parmakla 'murat250sr' yazılır, büyük kart =====
const FOG2 = mk(W, H);
function shEnd(t, lt, d) {
  const sx = SRC.getContext('2d'); sx.setTransform(1, 0, 0, 1, 0, 0); nightSky(sx, [8, 12, 22], [30, 30, 46]); cityBokeh(sx, t, 231, 70, 100, 700, 1, 3);
  const m = FOG2.getContext('2d'); m.setTransform(1, 0, 0, 1, 0, 0); m.globalCompositeOperation = 'source-over'; m.clearRect(0, 0, W, H); m.fillStyle = 'rgba(175,185,200,.6)'; m.fillRect(0, 0, W, H);
  // yazı maskesi soldan sağa açılır (parmak izi)
  const p = sm(seg(lt, .3, 3.2)); m.save(); m.beginPath(); m.rect(0, 0, 230 + p * 840, H); m.clip(); m.globalCompositeOperation = 'destination-out'; m.font = `600 136px ${SANS}`; m.textAlign = 'center'; m.lineWidth = 5; m.lineJoin = 'round'; m.strokeStyle = '#000'; m.strokeText('murat250sr', 640, 380); m.fillText('murat250sr', 640, 380); m.restore();
  layer(0, 10, c => { c.drawImage(SRC, 0, 0); });
  layer(1, 1.2, c => { c.drawImage(FOG2, 0, 0); });
  layer(2, 0, c => { glassDrops(c, t, SRC, .9, .8); });
  // büyük kart: alt çizgi ve başlık yükselir
  const q = eo(seg(lt, 3.4, 4.6)); ctx.save(); ctx.globalAlpha = q; ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.fillRect(0, 440, W, 120);
  ctx.fillStyle = '#f2efe8'; ctx.fillRect(640 - 330 * q, 452, 660 * q, 2); ctx.font = `600 30px ${SANS}`; ctx.letterSpacing = '10px'; ctx.textAlign = 'center'; ctx.fillText('UNUTTUM DE, İNANAYIM', 640, 506 + (1 - q) * 20);
  ctx.font = `400 18px ${SANS}`; ctx.letterSpacing = '6px'; ctx.fillStyle = 'rgba(242,239,232,.75)'; ctx.fillText('bir murat250sr klibi', 640, 540 + (1 - q) * 20); ctx.restore();
  const g = eo(seg(lt, 3.0, 4.2)); rad(ctx, 640, 340, 520, [255, 220, 180], .18 * g);
  return { vig: .6, nobadge: lt > 3.4 }; }
S(179, 191, shEnd, { x: .6 });
