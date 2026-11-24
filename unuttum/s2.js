'use strict';
// ===== ortak parçalar =====
function streetScene(c, t, o = {}) { // yağmurlu sokak, iki lamba, uzak şehir
  nightSky(c, [6, 9, 18], [24, 28, 42]); cityBokeh(c, t, o.seed || 31, 24, 120, 380, .5);
  farCity(c, 470, (o.seed || 31) + 1, [12, 14, 22], .5, 1.1);
  c.fillStyle = '#0b0c10'; c.fillRect(-300, 480, W + 600, 300);
  wetStreet(c, 500, t, (o.lx || [200, 900]).map(x => [x + 38, [255, 190, 110], .3, 36]));
  for (const x of (o.lx || [200, 900])) { lamp(c, x, 505, 300, t); lampRain(c, t, x + 38, 218, 300); }
}
function walker(c, t, x, y, h, ph, o = {}) {
  const P = walkPose(ph, o.amt || 1);
  reflect(c, y, c2 => fig(c2, x, y, h, P, { col: [10, 11, 16], dir: o.dir || 1 }), .22, 1);
  fig(c, x, y, h, P, Object.assign({ col: [10, 11, 16], rim: [255, 190, 120], rimX: -1.5 }, o));
}
// avuç içi açık el (üstten), içinde yüzük
function palm(c, x, y, s, rot, lc = [255, 190, 120]) {
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s);
  const sk = lin(c, -120, -80, 120, 120, [[0, [150, 104, 84]], [.6, [96, 64, 52]], [1, [40, 26, 22]]]); c.fillStyle = sk;
  c.beginPath(); c.moveTo(-70, 160); c.bezierCurveTo(-90, 90, -96, 20, -78, -30); c.bezierCurveTo(-40, -60, 40, -66, 76, -40); c.bezierCurveTo(96, 10, 92, 90, 70, 160); c.closePath(); c.fill(); // avuç
  const F = [[-62, -38, -.12, 86], [-22, -54, -.03, 104], [18, -54, .04, 100], [56, -40, .14, 80]];
  for (const [fx, fy, a, L] of F) { c.save(); c.translate(fx, fy); c.rotate(a); c.fillStyle = sk; c.beginPath(); c.roundRect(-15, -L, 30, L + 10, 15); c.fill(); c.strokeStyle = 'rgba(40,24,20,.5)'; c.lineWidth = 2; for (const k of [.36, .68]) { c.beginPath(); c.moveTo(-10, -L * k); c.quadraticCurveTo(0, -L * k + 4, 10, -L * k); c.stroke(); } c.restore(); }
  c.save(); c.translate(-80, 70); c.rotate(-.9); c.fillStyle = sk; c.beginPath(); c.roundRect(-17, -80, 34, 94, 17); c.fill(); c.restore(); // başparmak
  c.strokeStyle = 'rgba(50,30,24,.55)'; c.lineWidth = 2.5; c.beginPath(); c.moveTo(-70, 20); c.quadraticCurveTo(0, 0, 70, -6); c.moveTo(-60, 60); c.quadraticCurveTo(-10, 40, 40, 70); c.moveTo(-40, 110); c.quadraticCurveTo(-30, 50, 10, 10); c.stroke();
  // yüzük
  c.save(); c.translate(6, 40); c.rotate(-.3); c.lineWidth = 9; c.strokeStyle = lin(c, -30, -30, 30, 30, [[0, [255, 230, 150]], [.5, [170, 120, 40]], [1, [255, 220, 130]]]); c.beginPath(); c.ellipse(0, 0, 30, 18, 0, 0, TAU); c.stroke();
  c.fillStyle = 'rgba(0,0,0,.35)'; c.beginPath(); c.ellipse(3, 10, 30, 10, 0, 0, Math.PI); c.fill(); rad(c, -18, -12, 22, [255, 250, 220], .9); c.restore();
  c.restore();
}
// ===== 25.3 "Unuttum de, gideyim": kapıdan çıkıp yağmura yürür =====
function shLeave(t, lt, d) {
  CAM.z = 1.05 + lt * .015; CAM.x = 640 - lt * 10;
  layer(0, 5, c => { camA(c, .4); streetScene(c, t, { seed: 41, lx: [140, 1060] }); });
  layer(1, 0, c => { camA(c, 1);
    // apartman kapısı (sağda), içeriden sıcak ışık
    c.fillStyle = '#121216'; c.fillRect(880, 160, 420, 360); c.fillStyle = lin(c, 0, 230, 0, 500, [[0, [255, 190, 120]], [1, [180, 110, 60]]]); c.fillRect(960, 250, 150, 252);
    cone(c, 1035, 500, Math.PI * .5, .9, 220, [255, 180, 110], .18); rad(c, 1035, 380, 240, [255, 170, 100], .25);
    c.fillStyle = '#0c0c10'; c.fillRect(952, 242, 166, 10); c.fillRect(952, 242, 10, 262); c.fillRect(1108, 242, 10, 262);
    const x = lerp(1030, 560, sm(seg(lt, .2, d))); walker(c, t, x, 505, 250, lt * 6.2, { dir: -1, rim: [255, 190, 120], rimX: 1.6 });
  });
  layer(2, 0, c => { rainFall(c, t, 260, 18, 700, .05, [170, 190, 220], .2, 3, 1); });
  layer(3, 7, c => { rainFall(c, t, 40, 60, 1400, .05, [200, 210, 230], .22, 9, 3); });
  return { vig: .7 };
}
S(25.3, 28.5, shLeave);
// ===== 28.5 "Bu kalbi başka birine nasıl vereyim?": avuçta yüzük =====
function shRing(t, lt, d, warm) {
  CAM.z = 1.02 + lt * .03; CAM.y = 360 - lt * 4;
  layer(0, 16, c => { c.fillStyle = lin(c, 0, 0, 0, H, [[0, [6, 8, 14]], [1, [16, 18, 28]]]); c.fillRect(0, 0, W, H); cityBokeh(c, t, 51, 16, 60, 700, .45, 3); });
  layer(1, 0, c => { camA(c, 1); cone(c, 980, -40, Math.PI * .68, .22, 700, [255, 190, 120], .12);
    palm(c, 660, 420, 1.45, -.15 + Math.sin(t * .8) * .02);
  });
  layer(2, 0, c => { const g = c.createRadialGradient(760, 300, 60, 700, 380, 560); g.addColorStop(0, '#fff'); g.addColorStop(.6, 'rgb(120,110,130)'); g.addColorStop(1, 'rgb(30,32,50)'); c.fillStyle = g; c.fillRect(0, 0, W, H); }, { mode: 'multiply' });
  layer(3, 2, c => { rainFall(c, t, 70, 22, 800, .04, [200, 210, 230], .2, 5, 1); rainFall(c, t, 20, 70, 1500, .04, [220, 230, 240], .2, 7, 3); });
  return { vig: .72 };
}
S(28.5, 33, shRing, { xo: .4 });
// ===== KITA 1 =====
// 33 "Gece üç, yine uyku yok": karanlık oda, dijital saat 03:00
function shClock(t, lt, d) {
  CAM.z = 1.12 - lt * .02;
  layer(0, 9, c => { camA(c, .5); sideBg(c, t, 820); });
  layer(1, 3, c => { camA(c, .8); closeProfile(c, t, 520, 300, 1.2, { rot: .05, light: [120, 150, 220], la: .5, lx: 40, ly: -80, blink: Math.max(0, 1 - Math.abs(lt - 2.6) * 8) }); });
  layer(2, 0, c => { camA(c, 1.2); // ön planda komodin + saat
    c.fillStyle = lin(c, 0, 560, 0, 720, [[0, [26, 20, 22]], [1, [8, 6, 8]]]); c.fillRect(-100, 560, 700, 200);
    c.fillStyle = '#060608'; rrect(c, 150, 470, 260, 96, 14); c.fill(); rad(c, 280, 518, 220, [255, 40, 30], .22);
    const s = lt < 1.6 ? '02:59' : '03:00'; c.save(); c.font = `700 64px ${SANS}`; c.textAlign = 'center'; c.fillStyle = '#ff3b2f'; c.shadowColor = '#ff2010'; c.shadowBlur = 18; c.fillText(s, 280, 540); c.restore();
  });
  return { vig: .8 };
}
S(33, 36.7, shClock);
// 36.7 "Telefon elimde, mesaj yok"
function shNoMsg(t, lt, d, o = {}) {
  if (!o.keep) CAM.z = 1.0 + lt * .03;
  layer(0, 14, c => { sideBg(c, t, 300); rad(c, 640, 420, 500, [90, 130, 210], .2); });
  layer(1, 0, c => { camA(c, 1); const scr = (c2, w, h) => { chat(c2, w, h, Object.assign({ name: 'S.', status: o.status || 'son görülme 03:12', msgs: [{ t: 'iyi geceler', me: 0, time: '23:40' }, { t: 'iyi geceler :)', me: 1, time: '23:41' }, { t: 'uyudun mu?', me: 1, time: '02:47' }, { t: 'bir şey diyecektim', me: 1, time: '02:51' }] }, o.chat || {})); if (o.over) o.over(c2, w, h); };
    phoneHand(c, 640, 368 + Math.sin(t) * 3, 228, -.04 + Math.sin(t * .6) * .01, scr); });
  return { vig: .72 };
}
S(36.7, 40.4, shNoMsg);
// 40.4 "Ekranda çevrimiçi yazıyor": yakın, durum satırı
function shOnline(t, lt, d) {
  CAM.z = lerp(1.5, 2.3, eo(lt / d)); CAM.x = 600; CAM.y = 190;
  return shNoMsg(t, lt, d, { keep: 1, status: 'çevrimiçi', over: (c2, w, h) => { const k = w / 300; rad(c2, 80 * k, 72 * k, 60 * k, [37, 211, 102], .25 + .2 * pulse(t)); } });
}
S(40.4, 44.1, shOnline);
// 44.1 "Ama bana değil, başkasına yazıyor": karşı binada onun penceresi
function shOther(t, lt, d) {
  const k = sm(seg(lt, .3, 2.2)); CAM.z = 1.05; CAM.x = lerp(560, 720, k);
  layer(0, lerp(10, 0, k), c => { camA(c, .7); nightSky(c, [6, 9, 18], [20, 24, 36]); rainFall(c, t, 200, 20, 700, .04, [150, 170, 210], .18, 2, 1);
    c.fillStyle = '#16151a'; c.fillRect(420, 40, 900, 700); facade(c, 470, 70, 6, 4, 130, 150, 19, t, null);
    // onun penceresi: sıcak ışık, telefona bakıp gülümseyen kadın, yanında biri
    const x = 860, y = 250, w = 170, h = 210; c.fillStyle = lin(c, x, y, x, y + h, [[0, [170, 110, 70]], [1, [240, 160, 100]]]); c.fillRect(x, y, w, h);
    c.save(); c.beginPath(); c.rect(x, y, w, h); c.clip(); rad(c, x + 70, y + 110, 120, [140, 180, 255], .4);
    fig(c, x + 110, y + h + 40, 250, Object.assign({}, P0, { head: .3, lA: [.4, 2.0], rA: [.3, 2.1] }), { col: [30, 20, 18], dir: -1, female: 1 });
    fig(c, x + 40, y + h + 40, 270, Object.assign({}, P0, { head: .1, lA: [-.3, -.2] }), { col: [24, 16, 14], dir: 1 }); c.restore();
    c.fillStyle = '#0a0a0c'; c.fillRect(x + w / 2 - 3, y, 6, h); c.fillRect(x, y + h * .42, w, 5); });
  layer(1, lerp(0, 14, k), c => { camA(c, 1.3); phoneHand(c, 330, 420, 230, -.08, (c2, w, h) => chat(c2, w, h, { name: 'S.', status: (lt * 1.5 | 0) % 3 ? 'çevrimiçi' : 'çevrimiçi', msgs: [{ t: 'uyudun mu?', me: 1, time: '02:47' }, { t: 'bir şey diyecektim', me: 1, time: '02:51' }] })); });
  layer(2, 0, c => { glassDrops(c, t, null, .7, .6); });
  return { vig: .72 };
}
S(44.1, 47.8, shOther);
// 47.8 "Fotoğrafları sildim, sonra geri yükledim": galeri
function gallery(c, w, h, t, lt) {
  const k = w / 300; c.fillStyle = '#000'; c.fillRect(0, 0, w, h); txt(c, lt < 1.9 ? 'Fotoğraflar' : 'Son Silinenler', 14 * k, 50 * k, 22 * k, { font: SANS, weight: '700', col: '#fff' });
  const n = 15, cw = (w - 8 * k) / 3;
  for (let i = 0; i < n; i++) { const cx = 2 * k + (i % 3) * (cw + 2 * k), cy = 70 * k + ((i / 3) | 0) * (cw + 2 * k);
    const out = sm(seg(lt, .4 + i * .05, .8 + i * .05)), back = sm(seg(lt, 2.0 + i * .04, 2.4 + i * .04)), v = Math.min(1, 1 - out + back);
    if (v <= .01) continue; const r = rng(i + 3); c.save(); c.globalAlpha = v; c.translate(cx + cw / 2, cy + cw / 2); c.scale(.6 + .4 * v, .6 + .4 * v);
    c.fillStyle = lin(c, 0, -cw / 2, 0, cw / 2, [[0, [180 + r() * 70, 120 + r() * 60, 90 + r() * 50]], [1, [60 + r() * 50, 60 + r() * 50, 80 + r() * 60]]]); c.fillRect(-cw / 2, -cw / 2, cw, cw);
    c.fillStyle = 'rgba(20,14,16,.75)'; c.beginPath(); c.arc(-cw * .12, cw * .02, cw * .12, 0, TAU); c.arc(cw * .14, cw * .04, cw * .11, 0, TAU); c.fill(); c.fillRect(-cw * .26, cw * .12, cw * .22, cw * .4); c.fillRect(cw * .04, cw * .14, cw * .22, cw * .4); c.restore(); }
  const bt = lt < 1.9 ? 'Sil' : 'Kurtar'; c.fillStyle = lt < 1.9 ? '#ff453a' : '#0a84ff'; txt(c, bt, w / 2, h - 26 * k, 18 * k, { font: SANS, weight: '600', col: c.fillStyle, align: 'center' });
}
function shPhotos(t, lt, d) {
  CAM.z = 1.04 + lt * .015;
  layer(0, 14, c => { sideBg(c, t, 900); rad(c, 640, 420, 500, [90, 130, 210], .2); });
  layer(1, 0, c => { camA(c, 1); phoneHand(c, 640, 368, 228, .03, (c2, w, h) => gallery(c2, w, h, t, lt)); });
  return { vig: .72 };
}
S(47.8, 51.5, shPhotos);
// 51.5 "Seni unutmaya yemin ettim, sonra yine özledim": buğulu cama 'UNUT' yazar, damlalar siler; avucunu cama koyar
const FOGM = mk(W, H);
function shFogWrite(t, lt, d) {
  const sx = SRC.getContext('2d'); sx.setTransform(1, 0, 0, 1, 0, 0); nightSky(sx, [8, 12, 22], [30, 30, 46]); cityBokeh(sx, t, 61, 70, 100, 700, 1, 3); farCity(sx, 720, 9, [10, 12, 18], .3);
  // buğu maskesi: parmak izi yazı (sonra damlalarla akar)
  const m = FOGM.getContext('2d'); m.setTransform(1, 0, 0, 1, 0, 0); m.clearRect(0, 0, W, H); m.fillStyle = 'rgba(175,185,200,.62)'; m.fillRect(0, 0, W, H);
  m.globalCompositeOperation = 'destination-out'; m.lineCap = 'round'; m.lineJoin = 'round'; m.lineWidth = 30;
  const word = [[[400, 250], [400, 380], [430, 420], [480, 420], [510, 380], [510, 250]], [[570, 420], [570, 250], [680, 420], [680, 250]], [[740, 250], [740, 380], [770, 420], [820, 420], [850, 380], [850, 250]], [[900, 250], [1010, 250]], [[955, 250], [955, 420]]];
  const tot = word.reduce((a, s) => a + s.length - 1, 0); let drawn = sm(seg(lt, .1, 1.9)) * tot;
  for (const s of word) { m.beginPath(); m.moveTo(s[0][0], s[0][1]); for (let i = 1; i < s.length && drawn > 0; i++) { const f = Math.min(1, drawn); m.lineTo(lerp(s[i - 1][0], s[i][0], f), lerp(s[i - 1][1], s[i][1], f)); drawn -= 1; } m.stroke(); }
  // yazıdan aşağı akan izler
  const run = seg(lt, 1.6, 3.4); m.lineWidth = 8; for (let i = 0; i < 9; i++) { const x = 410 + i * 70, y0 = 420; m.beginPath(); m.moveTo(x, y0); m.lineTo(x + Math.sin(i) * 6, y0 + run * (120 + (i * 37) % 160)); m.stroke(); }
  // sonra yazıyı buğu yeniden kaplar (özledim) ve avuç izi
  m.globalCompositeOperation = 'source-over'; const re = sm(seg(lt, 2.2, 3.2)); m.fillStyle = `rgba(175,185,200,${.62 * re})`; m.fillRect(0, 0, W, H);
  if (lt > 2.9) { m.globalCompositeOperation = 'destination-out'; const pa = sm(seg(lt, 2.9, 3.3)); m.globalAlpha = pa; m.save(); m.translate(820, 360); m.scale(.9, .9); m.beginPath(); m.ellipse(0, 40, 70, 80, 0, 0, TAU); m.fill(); for (const [fx, a, L] of [[-52, -.2, 80], [-20, -.05, 100], [14, .05, 96], [46, .2, 78]]) { m.save(); m.translate(fx, -20); m.rotate(a); m.beginPath(); m.roundRect(-13, -L, 26, L, 13); m.fill(); m.restore(); } m.save(); m.translate(-76, 60); m.rotate(-.8); m.beginPath(); m.roundRect(-14, -70, 28, 70, 14); m.fill(); m.restore(); m.restore(); m.globalAlpha = 1; }
  m.globalCompositeOperation = 'source-over';
  layer(0, 10, c => { c.drawImage(SRC, 0, 0); });
  layer(1, 3, c => { c.drawImage(FOGM, 0, 0); });
  layer(2, 0, c => { glassDrops(c, t, SRC, .9, .7); });
  // ön planda içeriden parmak/el (siluet, sıcak oda ışığıyla)
  layer(3, 6, c => { const k = lt < 2 ? sm(seg(lt, 0, .3)) * (1 - sm(seg(lt, 1.8, 2.1))) : sm(seg(lt, 2.7, 3.0)); if (k <= 0) return; c.globalAlpha = k * .85; c.fillStyle = '#08080a';
    if (lt < 2) { const p = Math.min(1, seg(lt, .1, 1.9)) * tot, segI = Math.min(word.length - 1, 0); let rem = p, px = 400, py = 250; for (const s of word) { for (let i = 1; i < s.length; i++) { if (rem <= 0) break; const f = Math.min(1, rem); px = lerp(s[i - 1][0], s[i][0], f); py = lerp(s[i - 1][1], s[i][1], f); rem -= 1; } }
      c.save(); c.translate(px, py); c.rotate(.18); c.beginPath(); c.roundRect(-15, -10, 30, 150, 15); c.fill(); // işaret parmağı
      c.beginPath(); c.moveTo(-26, 120); c.bezierCurveTo(-60, 160, -70, 260, -50, 420); c.lineTo(110, 430); c.bezierCurveTo(120, 300, 110, 200, 70, 140); c.bezierCurveTo(40, 110, 10, 110, -26, 120); c.fill();
      for (const [fx, fy] of [[30, 150], [56, 158], [80, 168]]) { c.beginPath(); c.ellipse(fx, fy, 15, 20, 0, 0, TAU); c.fill(); } c.restore(); }
  });
  return { vig: .6, bloom: .3 };
}
S(51.5, 55, shFogWrite);
// 55 "Annem diyor: Oğlum, zayıflamışsın": sıcak mutfak, kapıda anne, önünde tabak
function kitchen(c, t) { c.fillStyle = lin(c, 0, 0, 0, H, [[0, [58, 38, 28]], [1, [30, 20, 16]]]); c.fillRect(-300, -300, W + 600, H + 600);
  c.fillStyle = 'rgba(0,0,0,.25)'; for (let i = 0; i < 9; i++) c.fillRect(-100 + i * 170, 0, 2, 420); c.fillStyle = lin(c, 0, 380, 0, 420, [[0, [70, 48, 36]], [1, [44, 30, 24]]]); c.fillRect(-300, 400, W + 600, 30);
  rad(c, 640, 60, 600, [255, 190, 120], .35); c.fillStyle = '#111'; c.fillRect(636, -80, 8, 150); c.fillStyle = lin(c, 560, 60, 720, 110, [[0, [50, 36, 28]], [1, [90, 64, 44]]]); c.beginPath(); c.moveTo(560, 110); c.lineTo(600, 60); c.lineTo(680, 60); c.lineTo(720, 110); c.fill(); rad(c, 640, 112, 40, [255, 230, 180], 1); cone(c, 640, 110, Math.PI / 2, .7, 520, [255, 200, 140], .12); }
function plate(c, x, y, s, t, steam = 1) { c.save(); c.translate(x, y); c.scale(s, s); c.fillStyle = 'rgba(0,0,0,.35)'; c.beginPath(); c.ellipse(4, 10, 120, 30, 0, 0, TAU); c.fill();
  c.fillStyle = lin(c, 0, -30, 0, 30, [[0, [240, 236, 226]], [1, [170, 160, 150]]]); c.beginPath(); c.ellipse(0, 0, 120, 34, 0, 0, TAU); c.fill(); c.fillStyle = lin(c, 0, -20, 0, 20, [[0, [200, 120, 50]], [1, [140, 70, 30]]]); c.beginPath(); c.ellipse(0, -4, 78, 20, 0, 0, TAU); c.fill(); c.fillStyle = 'rgba(255,200,120,.5)'; c.beginPath(); c.ellipse(-20, -10, 40, 6, 0, 0, TAU); c.fill();
  c.strokeStyle = `rgba(255,240,220,${.18 * steam})`; c.lineWidth = 10; c.lineCap = 'round'; for (let i = 0; i < 4; i++) { const p = (t * .25 + i / 4) % 1; c.globalAlpha = Math.sin(p * Math.PI); c.beginPath(); c.moveTo(-40 + i * 26, -20); c.bezierCurveTo(-60 + i * 26 + Math.sin(t + i) * 20, -80 - p * 60, -10 + i * 26, -120 - p * 80, -30 + i * 26 + Math.sin(t * 1.3 + i) * 20, -170 - p * 100); c.stroke(); } c.restore(); }
function shMother(t, lt, d) {
  CAM.z = 1.04 + lt * .012; CAM.x = 660;
  layer(0, 6, c => { camA(c, .5); kitchen(c, t);
    // kapı aralığında anne (arkadan ışıklı)
    c.fillStyle = lin(c, 0, 120, 0, 520, [[0, [255, 210, 150]], [1, [200, 140, 90]]]); c.fillRect(980, 110, 210, 420); rad(c, 1085, 300, 300, [255, 200, 140], .4);
    fig(c, 1080, 560, 400, Object.assign({}, P0, { head: .12, lA: [.3, .7], rA: [.1, .2] }), { col: [34, 22, 18], dir: -1, female: 1, rim: [255, 210, 150], rimX: 1.6 }); });
  layer(1, 0, c => { camA(c, 1); c.fillStyle = lin(c, 0, 470, 0, 720, [[0, [92, 60, 40]], [1, [40, 26, 20]]]); c.fillRect(-200, 480, W + 400, 300); // masa
    plate(c, 600, 560, 1.4, t, 1); c.fillStyle = lin(c, 0, 0, 0, 1, [[0, [200, 200, 205]], [1, [120, 120, 130]]]); c.save(); c.translate(820, 590); c.rotate(-.2); c.fillStyle = '#b8b8c0'; c.fillRect(-90, -4, 180, 8); c.restore();
    // ön planda onun omzu (sırt, odak dışı değil — koyu)
    c.fillStyle = '#0d0a0a'; c.beginPath(); c.moveTo(-50, 760); c.bezierCurveTo(-40, 520, 60, 430, 200, 420); c.bezierCurveTo(330, 410, 380, 520, 400, 760); c.fill(); profileHead(c, 200, 300, 1.05, .25, { light: [255, 180, 120], lx: 60, ly: 40, la: .5, rimX: 2, rimY: 1, col: [14, 11, 11] }); });
  return { vig: .6, top: [70, 60, 60], bot: [255, 160, 90] };
}
S(55, 59.25, shMother);
// 59.25 "Diyorum: Yok anne, iyiyim... yalan": sıcak ışıkta zoraki gülümseme, el değmemiş tabak
function shFine(t, lt, d) {
  CAM.z = 1.0 + lt * .03; CAM.x = 600;
  layer(0, 12, c => { kitchen(c, t); rad(c, 1000, 300, 260, [255, 200, 140], .3); });
  layer(1, 0, c => { camA(c, 1); closeProfile(c, t, 560, 290, 1.35, { rot: .12, light: [255, 180, 120], lx: 120, ly: -20, la: .9, blink: Math.max(0, 1 - Math.abs(lt - 2.9) * 8) });
    // zoraki tebessüm: dudak köşesi hafif kalkar sonra düşer
    const sm1 = sm(seg(lt, .5, 1.2)) * (1 - sm(seg(lt, 2.6, 3.6))); c.save(); c.translate(560, 290); c.rotate(.12); c.scale(1.35, 1.35); c.strokeStyle = `rgba(255,190,140,${.5 * sm1})`; c.lineWidth = 1.6; c.beginPath(); c.moveTo(62, 52); c.quadraticCurveTo(66, 48 - 3 * sm1, 70, 48 - 5 * sm1); c.stroke(); c.restore(); });
  layer(2, 8, c => { c.globalAlpha = .9; c.fillStyle = lin(c, 0, 600, 0, 720, [[0, [70, 46, 32]], [1, [30, 20, 16]]]); c.fillRect(-100, 620, W + 200, 200); plate(c, 980, 650, 1.6, t, .4); });
  return { vig: .65, top: [70, 60, 60], bot: [255, 160, 90] };
}
S(59.25, 63.5, shFine);
// 63.5 "Herkes diyor geçer, geçmiyor": oda; pencere ışığı günler boyu döner, o hep aynı yerde
function shTimelapse(t, lt, d) {
  const day = lt * 1.3, ph = day % 1, sun = Math.max(0, Math.sin(ph * TAU)), col = mix([40, 60, 110], [255, 200, 140], sun);
  CAM.z = 1.02;
  layer(0, 0, c => { roomWall(c, mix([16, 18, 28], [70, 64, 60], sun));
    // duvardaki pencere ışığı süpürülür
    const sx = lerp(1100, 100, ph); c.save(); c.globalCompositeOperation = 'lighter'; c.fillStyle = rgba(col, .2 + .2 * sun); c.beginPath(); c.moveTo(sx, 80); c.lineTo(sx + 260, 60); c.lineTo(sx + 300, 400); c.lineTo(sx + 20, 420); c.fill(); c.restore();
    c.fillStyle = 'rgba(0,0,0,.25)'; c.fillRect(sx + 128, 60, 14, 360); c.fillRect(sx, 230, 300, 12);
    // takvim yaprakları
    c.fillStyle = '#d8d2c6'; c.fillRect(150, 140, 120, 140); c.fillStyle = '#b8302a'; c.fillRect(150, 140, 120, 30); txt(c, String(12 + Math.floor(day)), 210, 250, 64, { font: SANS, weight: '700', col: '#222', align: 'center' });
    const fl = (day % 1); c.save(); c.translate(150, 170); c.scale(1, 1 - fl); c.globalAlpha = 1 - fl; c.fillStyle = '#e8e2d6'; c.fillRect(0, 0, 120, 110); c.restore();
    // yatak kenarında oturan, hiç kıpırdamayan
    c.fillStyle = lin(c, 0, 470, 0, 720, [[0, mix([30, 34, 48], [110, 96, 86], sun)], [1, [12, 12, 18]]]); c.fillRect(380, 470, 800, 300);
    fig(c, 720, 600, 330, Object.assign({}, P0, { sit: 1, lean: .35, head: .4, lA: [.7, .9], rA: [.6, 1.0], lL: [1.45, -1.45], rL: [1.4, -1.5] }), { col: [12, 12, 16], rim: col, rimX: -1.4, rimA: .7 });
    // hızla geçen gölgeler (gelip giden insanlar / günler)
    for (let i = 0; i < 3; i++) { const p = (lt * .9 + i / 3) % 1; c.fillStyle = 'rgba(0,0,0,.18)'; c.fillRect(lerp(-200, 1400, p), 0, 120, H); }
  });
  return { vig: .7 };
}
S(63.5, 67.75, shTimelapse);
// 67.75 "Bu kalp senden başkasını seçmiyor": lamba altında onun fotoğrafı, kalp atışı gibi ışık
function polaroid(c, x, y, s, rot, t) { c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s); c.fillStyle = 'rgba(0,0,0,.4)'; c.fillRect(-96, -106, 200, 236); c.fillStyle = '#eee8dc'; c.fillRect(-100, -110, 200, 236);
  c.fillStyle = lin(c, 0, -96, 0, 80, [[0, [255, 170, 110]], [.6, [220, 110, 90]], [1, [60, 40, 60]]]); c.fillRect(-88, -98, 176, 176); rad(c, 20, 10, 60, [255, 230, 170], .8);
  c.fillStyle = 'rgba(40,40,70,.8)'; c.fillRect(-88, 40, 176, 38); fig(c, 0, 78, 120, Object.assign({}, P0, { head: -.1, lA: [.3, -.6] }), { col: [36, 20, 26], female: 1, dir: -1, wind: 6 }); c.restore(); }
function shPhoto(t, lt, d) {
  CAM.z = 1.03 + lt * .03;
  layer(0, 14, c => { roomWall(c, [20, 16, 16]); rad(c, 520, 200, 500, [255, 170, 100], .25); cityBokeh(c, t, 71, 12, 100, 500, .3); });
  layer(1, 0, c => { camA(c, 1); rad(c, 600, 280, 520, [255, 190, 120], .35); const bt = pulse(t); polaroid(c, 640, 360, 1.5, -.08, t);
    // tutan parmaklar (alt köşe)
    c.fillStyle = lin(c, 480, 520, 560, 600, [[0, [130, 90, 72]], [1, [50, 34, 30]]]); c.beginPath(); c.roundRect(470, 520, 120, 40, 20); c.fill(); c.beginPath(); c.roundRect(700, 515, 110, 38, 19); c.fill();
    rad(c, 640, 360, 360, [255, 120, 90], .12 * bt); });
  return { vig: .7, top: [60, 50, 60], bot: [255, 140, 90] };
}
S(67.75, 72, shPhoto);
