'use strict';
// ===== GİRİŞ: yağmurlu sokak, tek yanan pencereye yaklaşma (0-12.5) =====
function shIntro(t, lt, d) {
  const k = sm(lt / d); CAM.z = lerp(1, 2.35, Math.pow(k, 1.6)); CAM.x = lerp(640, 742, k); CAM.y = lerp(360, 236, k);
  const hero = [3, 1];
  layer(0, 3 + k * 6, c => { camA(c, .3); nightSky(c); cityBokeh(c, t, 4, 30, 80, 330, .6); farCity(c, 380, 21, [12, 15, 24], .6, .9); });
  layer(1, k * 1.2, c => { camA(c, .8); facade(c, 360, 70, 6, 4, 96, 112, 7, t, hero);
    const [x, y, w, h] = hero.rect; c.save(); c.beginPath(); c.rect(x, y, w, h); c.clip();
    c.fillStyle = lin(c, x, y, x, y + h, [[0, [22, 30, 50]], [1, [40, 60, 100]]]); c.fillRect(x, y, w, h);
    rad(c, x + w * .58, y + h * .62, w * .7, [120, 170, 255], .55);
    fig(c, x + w * .5, y + h * 1.08, h * 1.25, Object.assign({}, P0, { sit: 1, lean: .25, head: .35, lA: [.5, 1.9], rA: [.4, 2.0], lL: [1.5, -1.5], rL: [1.45, -1.5] }), { col: [10, 12, 18], rim: [140, 190, 255], rimX: 1.5 });
    rad(c, x + w * .62, y + h * .55, 10, [190, 220, 255], .9);
    c.restore();
    c.fillStyle = 'rgba(160,180,220,.08)'; c.fillRect(x, y, w * .45, h);
    rainShadows(c, t, x, y, w, h, .25);
  });
  layer(2, 0, c => { camA(c, 1);
    c.fillStyle = '#0a0b0e'; c.fillRect(-300, 520, W + 600, 300);
    wetStreet(c, 545, t, [[218, [255, 190, 110], .35, 40], [1018, [255, 190, 110], .3, 40], [742, [120, 160, 230], .12, 22]]);
    for (const lx of [180, 980]) { lamp(c, lx, 548, 330, t); lampRain(c, t, lx + 38, 230, 330); }
    rainFall(c, t, 220, 18, 700, .05, [170, 190, 220], .22, 3, 1);
  });
  layer(3, 7, c => { rainFall(c, t, 50, 60, 1400, .05, [200, 210, 230], .25, 9, 3); });
  return { vig: .7 };
}
S(0, 12.5, shIntro, { x: 0 });
function typing(s, lt, cps = 9) { return s.slice(0, Math.max(0, Math.min(s.length, Math.floor(lt * cps)))); }
function phoneHand(c, x, y, w, rot, scr, glow = 1) {
  rad(c, x, y, w * 2.4, [90, 140, 220], .22 * glow);
  hand(c, x, y, w, rot); phone(c, x, y, w, rot, scr); fingers(c, x, y, w, rot);
}
function shDraft(t, lt, d, mode) {
  CAM.z = 1.05 + lt * .012; const del = mode === 'del';
  layer(0, 14, c => { roomWall(c, [16, 18, 28]); rad(c, 980, 220, 420, [60, 90, 160], .25); cityBokeh(c, t, 9, 18, 120, 400, .35); rad(c, 300, 600, 260, [255, 140, 80], .12); });
  layer(1, 0, c => { camA(c, 1); const s = 'unuttum de'; const dr = del ? s.slice(0, Math.max(0, s.length - Math.floor(Math.max(0, lt - .8) * 8))) : typing(s, lt - .5);
    phoneHand(c, 640, 372, 228, -.06 + Math.sin(t * .7) * .01, (c2, w, h) => chat(c2, w, h, { name: 'S.', status: 'son görülme 03:12', msgs: [{ t: 'iyi geceler', me: 0, time: '23:40' }, { t: 'iyi geceler :)', me: 1, time: '23:41' }], draft: dr, cursor: 1, t }));
  });
  return { vig: .7 };
}
S(12.5, 15.7, (t, lt, d) => shDraft(t, lt, d));
// yatağın kenarında, başı eğik, yüzü telefon ışığında (yakın profil)
function sideBg(c, t, wx = 760) { roomWall(c, [12, 14, 22]); // arkada yağmurlu pencere
  c.fillStyle = lin(c, 0, 60, 0, 560, [[0, [30, 42, 70]], [1, [50, 60, 90]]]); c.fillRect(wx, 40, 520, 520); cityBokeh(c, t, 17, 26, 120, 540, .55, 2); c.fillStyle = '#07080c'; c.fillRect(wx - 16, 30, 16, 540); c.fillRect(wx + 250, 30, 14, 540); c.fillRect(wx - 16, 290, 560, 12);
  rainShadows(c, t, wx, 40, 520, 520, .3); }
function closeProfile(c, t, x, y, s, o = {}) {
  // omuz ve sırt
  c.fillStyle = lin(c, x - 260 * s, 0, x + 120 * s, 0, [[0, [10, 11, 16]], [1, [26, 30, 44]]]); c.beginPath(); c.moveTo(x - 330 * s, H + 20); c.bezierCurveTo(x - 300 * s, y + 160 * s, x - 160 * s, y + 140 * s, x - 70 * s, y + 150 * s); c.bezierCurveTo(x + 20 * s, y + 160 * s, x + 110 * s, y + 220 * s, x + 170 * s, H + 20); c.fill();
  profileHead(c, x, y, s, o.rot === undefined ? .32 : o.rot, Object.assign({ light: [140, 180, 255], lx: 150, ly: 60, rimX: 2, rimY: 3, la: 1.2 }, o));
  // mont yakası boynun dibini örter
  c.fillStyle = lin(c, x - 150 * s, y + 120 * s, x + 80 * s, y + 220 * s, [[0, [8, 9, 13]], [1, [30, 36, 52]]]); c.beginPath(); c.moveTo(x - 200 * s, y + 150 * s); c.bezierCurveTo(x - 120 * s, y + 110 * s, x - 40 * s, y + 140 * s, x + 30 * s, y + 175 * s); c.bezierCurveTo(x + 70 * s, y + 200 * s, x + 110 * s, y + 260 * s, x + 130 * s, H + 20); c.lineTo(x - 340 * s, H + 20); c.closePath(); c.fill();
  c.strokeStyle = 'rgba(140,180,255,.35)'; c.lineWidth = 2; c.beginPath(); c.moveTo(x - 40 * s, y + 140 * s); c.bezierCurveTo(x + 10 * s, y + 160 * s, x + 60 * s, y + 190 * s, x + 100 * s, y + 250 * s); c.stroke();
}
function shBed(t, lt, d) {
  CAM.z = 1.0 + lt * .025; CAM.x = 600 + lt * 6; CAM.y = 380;
  const bl = Math.max(0, 1 - Math.abs(lt - 2.1) * 8);
  layer(0, 10, c => { camA(c, .4); sideBg(c, t); });
  layer(1, 0, c => { camA(c, 1); const px = 760, py = 560 + Math.sin(t * .8) * 3;
    rad(c, px, py - 40, 380, [110, 150, 230], .25);
    closeProfile(c, t, 540, 330, 1.45, { blink: bl, wet: .6 });
    cone(c, px - 20, py - 30, -Math.PI * .78, .42, 380, [140, 180, 255], .13);
    phoneHand(c, px, py, 120, -1.0, (c2, w, h) => chat(c2, w, h, { name: 'S.', status: 'çevrimiçi', msgs: [] }), .6);
  });
  return { vig: .78 };
}
S(15.7, 18.9, shBed);
S(18.9, 22.1, (t, lt, d) => shDraft(t, lt, d, 'del'));
const SRC = mk(W, H);
function shMemory(t, lt, d) {
  const sx = SRC.getContext('2d'); sx.setTransform(1, 0, 0, 1, 0, 0); nightSky(sx, [8, 12, 22], [30, 30, 46]); cityBokeh(sx, t, 13, 70, 100, 700, 1, 4); farCity(sx, 760, 5, [10, 12, 18], .2);
  CAM.z = 1.04 + lt * .01;
  layer(0, 12, c => { c.drawImage(SRC, 0, 0); });
  const m = sm(seg(lt, .2, 1.2)) * (1 - sm(seg(lt, 2.2, 3.1)));
  layer(1, 9, c => { camA(c, 1); c.globalAlpha = .32 * m; fig(c, 600, 640, 420, Object.assign({}, P0, { head: .1 }), { col: [255, 190, 140], dir: 1 }); fig(c, 690, 640, 390, Object.assign({}, P0, { head: -.15 }), { col: [255, 170, 130], dir: -1, female: 1 }); }, { mode: 'screen' });
  layer(2, 0, c => { glassDrops(c, t, SRC, 1, 1); fog(c, .05); });
  return { vig: .7 };
}
S(22.1, 25.3, shMemory);
