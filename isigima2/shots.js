'use strict';
// ====== IŞIĞIMA GÖZ DİKEN — gravür klip, sözlerin sırasıyla ======
const fwalk = (ph, o = {}) => frontPose(Object.assign({ st: .05 + .07 * Math.abs(Math.sin(ph)), sway: .04 * Math.sin(ph), ab: [.1 + .1 * Math.sin(ph), .1 - .1 * Math.sin(ph)], el: [.15, .15] }, o));
function alley(cam, lights, o = {}) {
  setCam(cam); LIGHTS = lights.map(L => ({ x: L[0], y: 3.8, z: L[1], i: L[2] === undefined ? 1 : L[2], r: 4 }));
  street(Object.assign({ fog: .3, litWin: .05 }, o)); if (!o.nolamp) for (const L of LIGHTS) lamp(L.x, L.z, 3.6, Math.min(1, L.i));
}
function room(o = {}) { // iç mekân: arka duvar, zemin, pencere
  const v = o.v === undefined ? .18 : o.v;
  C.fillStyle = lg(0, 0, W, 0, [[0, v + .05], [.5, v + .1], [1, v - .02]], Math.PI / 2); C.fillRect(0, 0, W, H);
  const fy = o.floor || 520; C.fillStyle = lg(0, fy, 0, H, [[0, v * .7], [1, v * .4]], 0); C.fillRect(0, fy, W, H - fy); inkLine(0, fy, W, fy, 3, .03);
  for (let i = 0; i < 14; i++) { const x = (i - 6.5) * 140; strokeTone([[640 + x * .3, fy], [640 + x * 1.6, H]], v * .3, angOf([640 + x * .3, fy], [640 + x * 1.6, H]), 1.5); }
  if (o.win) { const [wx, wy, ww, wh, m] = o.win; C.fillStyle = ink(.25 + m * .65, 0); C.fillRect(wx, wy, ww, wh); if (o.moon) { C.beginPath(); C.arc(wx + ww * .65, wy + wh * .3, ww * .12, 0, TAU); C.fillStyle = ink(1, 0); C.fill(); }
    C.fillStyle = ink(.04, 0); C.fillRect(wx + ww / 2 - 4, wy, 8, wh); C.fillRect(wx, wy + wh / 2 - 4, ww, 8); C.strokeStyle = ink(.04, 0); C.lineWidth = 12; C.strokeRect(wx, wy, ww, wh);
    // yere düşen pencere ışığı
    C.save(); C.globalCompositeOperation = 'lighter'; P([[wx, wy + wh], [wx + ww, wy + wh], [wx + ww * 1.6, fy + 150], [wx - ww * .2, fy + 150]]); C.fillStyle = `rgb(${(m * 70) | 0},0,0)`; C.fill(); C.restore(); }
}
// ---------- NAKARAT ----------
// 1) "Ne derlerse desinler, ben onu bırakmam!": el ele yürüyüş, iki yanda fısıldayan gölgeler ve gözler
function ch1(t, lt, d, v) {
  const back = v % 2 === 1, z = back ? 3 + lt * .9 : 9 - lt * .8;
  alley({ y: 1.5, z: back ? -2 + lt * .9 : -4, f: 820 }, [[-3.8, 2], [3.8, 9], [-3.8, 17], [3.8, 26]], { fog: .3, moon: [640, 90, 22] });
  for (const [x, zz, dr, sd] of [[-3.3, 4, 1, 0], [-2.7, 4.2, -1, 0], [3.2, 7, -1, 1], [2.6, 7.3, 1, 1], [-3.2, 12, 1, 2], [3.3, 14, -1, 3]]) {
    const p = at(x, zz), wh = Math.sin(t * 3 + sd) * .05; fig({ x: p.x, y: p.y, h: 1.85 * p.k, view: 'side', dir: dr, kind: 'shade', P: sidePose({ lean: .28 + wh, nod: .25, sa: [.2, .4], ea: [.3, 2.3] }), L: [0, -1], rim: .3 }); }
  eyes(10, 20 + v, 1, 60, 140, 1220, 420, 3, t);
  const ph = lt * 4.2, view = back ? 'back' : 'front';
  F('man', back ? -.35 : -.35, z, { view, P: fwalk(ph, { ab: [.1, .28], el: [.1, .05] }), L: [-.5, -.8], pockets: [1, 0] });
  F('woman', back ? .35 : .35, z + .05, { view, P: fwalk(ph + Math.PI, { ab: [.28, .1], el: [.05, .1] }) }); herLight(.35, z, 1);
  return {};
}
// 2) "Uğruna yansın bu şehir, geri adım atmam!": yanan şehir, önlerinde siluetleri
function ch2(t, lt, d, v) {
  const k = sm(lt / 1.5), big = v >= 2 ? 1.25 : 1;
  sky({ top: .1, low: .45, clouds: 7, t, seed: 9 }); lightR(640, 560, 900, .25 * k);
  smokeCol(640, 420, 900, 400, t, .22, 4);
  flames(-50, 520, 1400, 260 * big * (.7 + .3 * k), t, 7, 1); flames(100, 560, 500, 340 * big, t + 1, 9, 1);
  rooftops({ t, seed: 6 + v, y0: 420, y1: 640, rows: 4, far: .12, near: .04, pan: lt * -12 });
  embers(t, 60, 1);
  // ön plan: çatı kenarı, iki siluet
  C.fillStyle = ink(.04, 0); C.fillRect(0, 590, W, 140);
  const step = v % 2 ? sm(seg(lt, 1.5, 3)) : 0, mx = 560 + step * 30;
  fig({ x: mx, y: 610 + step * 6, h: 400 + step * 20, view: 'back', kind: 'man', L: [0, -1], rim: .9, rimTone: 1, wind: .3, P: frontPose({ st: .08 + step * .05 }) });
  fig({ x: 690, y: 610, h: 350, view: 'back', kind: 'woman', L: [0, -1], wind: .4 }); glow(690, 480, 200, .5);
  return { warm: .6 };
}
// 3) "Rüzgâr da esse, dünya da yıkılsa": fırtına, yıkılan cephe, adam onu paltosuyla korur
function ch3(t, lt, d, v) {
  const w = .7 + .3 * Math.sin(t * 3);
  alley({ y: 1.3, z: -3.5 + (v % 2) * .8, f: 820, x: (v % 2) ? .8 : 0 }, [[-3.8, 3, .9], [3.8, 12, .7]], { fog: .2 });
  debris(t, 26, lt * .9, 11 + v);
  rainL(t, 160, .45, 28, .8, 5 + v);
  F('woman', .35, 2.6, { view: 'front', P: frontPose({ ab: [.5, .5], el: [2.2, 2.2], tilt: -.05 }), wind: w, closed: 1 }); herLight(.35, 2.6, .8);
  F('man', -.15, 2.1, { view: 'front', P: frontPose({ ab: [1.5, .15], el: [.2, .1], st: .14, tilt: .04 }), wind: w * 1.2, L: [-.7, -.6] });
  return { shake: 2 + 4 * KK };
}
// 4) "Işığıma göz diken karşısında beni bulsun!": karanlıkta gözler ona dikilir, adam araya girer
function ch4(t, lt, d, v) {
  C.fillStyle = ink(.05, 0); C.fillRect(0, 0, W, H);
  setCam({ y: 1.2, z: -4, f: 800 }); LIGHTS = [];
  ground(-3.5, 40, { base: .06 });
  const st = sm(seg(lt, 1.6, 2.4));
  eyes(26, 40 + v, sm(lt / 1.2) * (1 - st * .7), 40, 120, 1240, 470, 4, t);
  const ez = lerp(9, 4.5, sm(seg(lt, 0, 2))), pe = at(1.2, ez);
  fig({ x: pe.x, y: pe.y, h: 1.9 * pe.k, view: 'front', kind: 'shade', eyes: 1, P: frontPose({ ab: [.15, lerp(.2, 1.3, sm(seg(lt, .6, 1.8)))], el: [.1, .2], fw: [0, .6] }), rim: .5, L: [-1, 0] });
  F('woman', -.2, 3, { view: 'front', P: frontPose({ ab: [.2, .2], el: [.3, .3] }), closed: 0 }); herLight(-.2, 3, 1.1);
  const mx = lerp(-2.6, .45, eo(st)), pm = at(mx, 1.6);
  fig({ x: pm.x, y: pm.y, h: 1.86 * pm.k, view: 'back', kind: 'man', L: [-.3, -.9], rim: 1, P: frontPose({ st: .16, ab: [.25, .25] }), alpha: clamp(st * 3) });
  return { shake: st > .1 && st < .9 ? 6 : 0 };
}
const CH = [ch1, ch2, ch3, ch4];
[[14, 0], [72, 1], [134, 2], [161, 3]].forEach(([a, v]) => { const L = v === 2 ? 5.75 : 4.75;
  CH.forEach((fn, i) => S(a + i * L, a + (i + 1) * L, (t, lt, d) => fn(t, lt, d, v), i === 0 ? { xi: .3 } : {})); });

// taş kalp levhası: karanlıkta ışınlar, ortada kalp
function heartPlate(t, lt, g) {
  C.fillStyle = ink(.05, 0); C.fillRect(0, 0, W, H);
  for (let i = 0; i < 28; i++) { const a = i / 28 * TAU; C.beginPath(); C.moveTo(640, 360); C.lineTo(640 + Math.cos(a) * 900, 360 + Math.sin(a) * 900); C.lineTo(640 + Math.cos(a + .06) * 900, 360 + Math.sin(a + .06) * 900); C.closePath(); C.fillStyle = ink(.1 + .1 * g, a); C.fill(); }
  lightR(640, 360, 380, .25 + .2 * g); stoneHeart(640, 375, 210 + lt * 8, g, Math.max(0, Math.sin(t * 7.3)) ** 8); glow(640, 370, 380 * g, .7 * g);
}
// ---------- GİRİŞ ----------
// "Kimse bilmeyecek adını...": karanlık şehir, tek bir altın pencere
S(0, 7, (t, lt) => {
  sky({ top: .06, low: .3, moon: [980, 120, 28], clouds: 6, t, seed: 3 });
  const pan = lt * 10; rooftops({ t, seed: 12, y0: 300 + lt * 8, y1: 640, rows: 5, far: .3, near: .05, smoke: 1, pan: -pan });
  const k = sm(seg(lt, 2, 5)); C.fillStyle = ink(.95, 0, 1); C.fillRect(742 - pan * 1.3, 505, 14, 20); glow(749 - pan * 1.3, 515, 60 + 40 * k, .3 + .5 * k);
  return {};
}, { xi: 1.5 });
// "Ama herkes bilecek kimin olduğunu!": sokakta yürürler, kapı aralarında gözler açılır
S(7, 14, (t, lt) => {
  alley({ y: 1.2, z: -5 + lt * .3, f: 780 }, [[-3.8, 3], [3.8, 11], [-3.8, 19]], { moon: [640, 60, 20], fog: .35 });
  eyes(14, 7, sm(seg(lt, 2, 5)), 120, 240, 1160, 470, 3, t);
  const z = 7 - lt * .45, ph = lt * 4;
  F('man', -.3, z, { view: 'front', P: fwalk(ph), pockets: [1, 1], L: [-.6, -.8] });
  F('woman', .4, z + .4, { view: 'front', P: fwalk(ph + 3) }); herLight(.4, z + .4, 1);
  return {};
});
// ---------- 1. KITA ----------
// "Bu sokaklar beni sert yaptı, kalbim taş gibi"
S(33, 36.1, (t, lt) => {
  if (lt < 1.5) { alley({ y: 1.4, z: -4, f: 800 }, [[-3.8, 4, .8], [3.8, 14, .6]], { fog: .25, wet: 1 }); rainL(t, 120, .1, 24, .75);
    F('man', 0, 5 - lt * 1.2, { view: 'front', P: fwalk(lt * 4.3), pockets: [1, 1], L: [-.6, -.7] }); return {}; }
  heartPlate(t, lt - 1.5, 0); return {};
});
// "Kimseye eğilmedim, durdum hep dağ gibi"
S(36.1, 39.2, (t, lt) => {
  sky({ top: .1, low: .4, h: 420 }); const mk = sm(lt / 2); C.save(); C.globalAlpha = mk; mountain(640, 470, 1500, 380, .25, 4); C.restore();
  setCam({ y: 1, z: -5, f: 760, hy: 420 }); LIGHTS = [{ x: 0, y: 4, z: 2, i: 1.2, r: 3 }]; ground(-4, 60, { base: .14 });
  const bow = sm(seg(lt, .3, 1.4));
  for (const [x, z, dr] of [[-2.2, 3.5, 1], [-1.6, 5, 1], [2.1, 3.3, -1], [1.5, 5.2, -1], [-2.9, 6.5, 1], [2.8, 6.8, -1]]) { const p = at(x, z);
    fig({ x: p.x, y: p.y, h: 1.85 * p.k, view: 'side', dir: dr, kind: 'shade', P: sidePose({ lean: .6 * bow, nod: .45 * bow, sa: [-.6 * bow + .05, -.6 * bow + .05], ea: [.1, .1] }), L: [-dr, -.6], rim: .4 }); }
  lamp(0, 2.2, 4, 1);
  F('man', 0, 2, { view: 'front', P: frontPose({ st: .14 }), pockets: [1, 1], L: [0, -1], rim: .6 });
  return {};
});
// "Yumruğum kanadı, dizim yere değdi"
S(39.2, 42.3, (t, lt) => {
  if (lt < 1.5) { C.fillStyle = lg(0, 0, 0, H, [[0, .1], [1, .2]], .3); C.fillRect(0, 0, W, H); lightR(500, 250, 500, .25);
    // tuğla duvar ve yumruk
    brickWall(700, 60, 600, 620, 110, 46, 0, t, 5, .35); for (let i = 0; i < 5; i++) strokeTone([[900, 360], [900 + Math.cos(i * 1.3) * 120, 360 + Math.sin(i * 1.3) * 90]], .02, i, 3);
    const hit = sm(seg(lt, 0, .3)); bigFist(lerp(300, 760, hit), 370, 230, sm(seg(lt, .5, 1.5)), 0); return { shake: lt > .25 && lt < .5 ? 9 : 0 }; }
  alley({ y: .9, z: -3, f: 820 }, [[-2.5, 3.2, 1.2]], { fog: .25, wet: 1 }); rainL(t, 140, .1, 24, .75);
  const k = sm(seg(lt, 1.5, 2.1));
  F('man', -.2, 2.5, { view: 'front', P: frontPose({ kneel: k, ab: [.1, .3 * k], el: [.1, .6 * k], tilt: .05 * k }), L: [-.7, -.6], fist: [0, 1] });
  return { shake: lt > 2 && lt < 2.2 ? 5 : 0 };
});
// "Ama kimse bu adamın gözünde yaş görmedi!": yağmurda dimdik durur, pencerelerden bakan gözler
S(42.3, 45.4, (t, lt) => {
  alley({ y: 1.6, z: -2.5 + lt * .3, f: 820 }, [[-1.2, 2.8, 1.1]], { fog: .2, wet: 1, litWin: .15 });
  eyes(8, 33, 1, 150, 60, 1130, 300, 3, t);
  F('man', -.5, 2.6, { view: 'front', P: frontPose({ st: .14, nod: .2 }), pockets: [1, 1], L: [-.5, -.8], rim: .9 });
  rainL(t, 220, .05, 30, .9, 9);
  return {};
});
// "Sonra o geldi, bir bakışla yıktı duvarımı"
S(45.4, 48.5, (t, lt) => {
  C.fillStyle = ink(.08, 0); C.fillRect(0, 0, W, H);
  const k = sm(seg(lt, .6, 2.6));
  setCam({ y: 1.3, z: -3, f: 800 }); LIGHTS = [{ x: 0, y: 1, z: 6, i: 1.4 * k, r: 5 }]; ground(-2.5, 40, { base: .1 });
  F('woman', 0, 6, { view: 'front', P: frontPose({ ab: [.15, .15] }) }); herLight(0, 6, .4 + 1.2 * k);
  brickWall(-20, -20, W + 40, H + 40, 128, 52, k, t, 8, .32);
  const pm = at(-1.4, -.6); fig({ x: pm.x, y: pm.y + 40, h: 1.86 * pm.k, view: 'back', kind: 'man', L: [.6, -.8], rim: .9 * k + .1 });
  return { shake: k > .02 && k < .4 ? 5 : 0 };
});
// "Kanunu rafa kaldırdım, değiştirdim kurallarımı"
S(48.5, 51.6, (t, lt) => {
  room({ v: .16 }); lightR(400, 200, 700, .3);
  // raf
  for (const y of [190, 420]) { C.fillStyle = lg(0, y, 0, y + 22, [[0, .55], [1, .2]], 0); C.fillRect(150, y, 980, 22); }
  const r = rng(4); let x = 170; while (x < 1100) { const w = 34 + r() * 30, h = 150 + r() * 50; if (x > 600 && x < 720) { x = 720; continue; } book(x + w / 2, 190 - h / 2, w, h, null, .2 + r() * .3); x += w + 2; }
  x = 170; while (x < 1100) { const w = 34 + r() * 30, h = 150 + r() * 50; book(x + w / 2, 420 - h / 2, w, h, null, .2 + r() * .3); x += w + 2; }
  const k = eo(seg(lt, .2, 2)), bx = lerp(660, 660, k), by = lerp(640, 95, k), ang = lerp(-1.2, 0, k);
  book(bx, by, 70, 190, 'KANUN', .4, ang);
  // kitabı iten el
  bigFist(bx - 20, by + 130, 70, 0, -Math.PI / 2 + ang);
  return {};
});
// "Şimdi tek korkum onun gözünde bir damla yaş"
S(51.6, 54.7, (t, lt) => {
  C.fillStyle = lg(0, 0, W, 0, [[0, .05], [1, .15]], .3); C.fillRect(0, 0, W, H);
  fig({ x: 660, y: 1020, h: 900, view: 'front', kind: 'woman', P: frontPose({ tilt: -.04, ab: [.25, .25] }), tear: sm(seg(lt, .6, 2.8)), rim: .6 }); glow(640, 300, 500, .5);
  fig({ x: 300, y: 1180, h: 1150, view: 'back', kind: 'man', L: [.8, -.6], rim: .9 });
  return {};
});
// "Ona bir şey olursa yakarım dünyayı baştan baş!"
S(54.7, 57.8, (t, lt) => {
  room({ v: .1, floor: 600 }); const b = sm(seg(lt, .9, 3));
  globe(640, 330, 230, t * .4, b, t);
  const m = sm(seg(lt, 0, .6)); // kibrit
  C.save(); C.translate(lerp(1100, 920, m), lerp(700, 480, m)); C.rotate(-.6); C.fillStyle = ink(.6, 0); C.fillRect(-4, 0, 8, 160); C.beginPath(); C.ellipse(0, 0, 8, 12, 0, 0, TAU); C.fillStyle = ink(.1, 0); C.fill(); C.restore();
  if (lt > .45) { flames(lerp(1100, 920, m) - 18, lerp(700, 480, m) - 4, 36, 60, t, 3, 1); }
  embers(t, 30 * b, b);
  return { warm: .7 };
});
// "Karanlık bir adamdım, gecelerim kapkara"
S(57.8, 60.9, (t, lt) => {
  room({ v: .1, win: [760, 130, 280, 300, .6], moon: 1, floor: 560 });
  fig({ x: 520, y: 640, h: 470, view: 'back', kind: 'man', L: [.9, -.4], rim: 1, rimW: .02, base: .03, lit: .1 });
  return {};
});
// "Üç harfli bir isim geldi, ışık doldu her yara"
S(60.9, 64, (t, lt) => {
  C.fillStyle = ink(.06, 0); C.fillRect(0, 0, W, H);
  if (lt < 1.5) { goldTiles(640, 360, 190, sm(lt / 1.2), t); return { warm: .2 }; }
  heartPlate(t, lt - 1.5, sm(seg(lt, 1.6, 2.8))); return {};
});
// ara: şehre altın ışık yayılır
S(64, 72, (t, lt) => {
  sky({ top: .08, low: .35, moon: [300, 120, 26], clouds: 6, t, seed: 3 });
  rooftops({ t, seed: 12, y0: 300, y1: 640, rows: 5, far: .3, near: .05, smoke: 1, lit: .04 + lt * .03, goldWin: .5, pan: -lt * 15 });
  return {};
}, { xi: .4 });
// "...fener": lamba titreyip söner, karanlıkta gözler
S(91, 96, (t, lt) => {
  const fl = lt < 3 ? ((Math.sin(t * 41) > .3 || Math.sin(t * 13) > .8) ? 1 : .2) : Math.max(0, 1 - (lt - 3) * 2);
  alley({ y: 1.1, z: -3, f: 820 }, [[-1.8, 2.5, fl]], { fog: .2 });
  eyes(16, 70, sm(seg(lt, 2.5, 4.5)), 100, 200, 1180, 480, 3.5, t);
  return {};
}, { xi: .3 });
// ---------- 2. KITA ----------
// "Arkamdan konuşanlar yüzüme gelince susar"
S(96, 99.4, (t, lt) => {
  alley({ y: 1.4, z: -4, f: 800 }, [[-3.8, 3], [3.8, 9]], { fog: .3 });
  const turn = lt > 1.7; const sh = turn ? 0 : Math.sin(t * 5) * .06;
  for (const [x, z, dr, i] of [[-2.6, 2.5, 1, 0], [-1.9, 2.7, -1, 1], [2.2, 3, -1, 2], [1.5, 3.2, 1, 3]]) { const p = at(x, z);
    fig({ x: p.x, y: p.y, h: 1.85 * p.k, view: 'side', dir: dr, kind: 'shade', P: sidePose(turn ? { lean: .05, nod: .35, sa: [.05, .05] } : { lean: .3 + sh, nod: .2, sa: [.2, .4], ea: [.3, 2.3] }), L: [0, -1], rim: .4 }); }
  F('man', 0, 6, { view: turn ? 'front' : 'back', P: turn ? frontPose({ st: .14 }) : fwalk(lt * 4), pockets: [1, 1], L: [-.5, -.8] });
  return {};
}, { xi: .2 });
// "Ben lafı yüzüne söylerim, sen arkadan, fark bu kadar!"
S(99.4, 102.8, (t, lt) => {
  alley({ y: 1.6, z: -2, f: 820 }, [[3.8, 4]], { fog: .25 });
  const k = sm(seg(lt, .4, 2)); const pe = at(.6, 3.2 + k * .8);
  fig({ x: pe.x, y: pe.y, h: 1.8 * pe.k * (1 - .06 * k), view: 'front', kind: 'shade', P: frontPose({ tilt: .12 * k, ab: [.4 * k, .4 * k], el: [1.2 * k, 1.2 * k], fw: [.5 * k, .5 * k] }), L: [.9, -.4], rim: .5 });
  const pm = at(-.8, 0); fig({ x: pm.x, y: pm.y + 80, h: 1.86 * pm.k, view: 'back', kind: 'man', L: [.9, -.4], rim: .9, P: frontPose({ st: .15 }) });
  return {};
});
// "Dediler: O sana göre değil, unut, bırak."
S(102.8, 106.2, (t, lt) => {
  room({ v: .14, floor: 560 }); lightR(640, 80, 520, .5);
  strokeTone([[640, 0], [640, 70]], .05, Math.PI / 2, 3); C.beginPath(); C.moveTo(590, 100); C.lineTo(690, 100); C.lineTo(660, 70); C.lineTo(620, 70); C.closePath(); C.fillStyle = ink(.8, 0); C.fill();
  setCam({ y: 1.4, z: -3, f: 900, hy: 300 });
  for (const [x, i] of [[-1.2, 0], [0, 1], [1.2, 2]]) { const p = at(x, 2.6), sh = Math.sin(t * 6 + i * 2) * .9;
    fig({ x: p.x, y: p.y, h: 1.85 * p.k, view: 'front', kind: 'shade', hat: 'top', P: frontPose({ turn: sh, ab: i === 1 ? [.15, 1.2] : [.15, .15], el: i === 1 ? [.1, .1] : [.1, .1], fw: i === 1 ? [0, .7] : [0, 0] }), L: [0, -1], rim: .5, base: .1, lit: .2 }); }
  table(-2.2, 2.2, 1.2, 2.2, .78, .45);
  // masadaki not
  const n = pj(0, .8, 1.3); C.save(); C.translate(n[0], n[1] - 10); C.rotate(-.04); C.fillStyle = ink(.95, 0); C.fillRect(-150, -26, 300, 52); C.strokeStyle = ink(.1, 0); C.lineWidth = 1.5; C.strokeRect(-150, -26, 300, 52);
  C.font = `italic 600 26px ${FONT}`; C.textAlign = 'center'; C.textBaseline = 'middle'; C.fillStyle = ink(.02, 0); C.fillText('O sana göre değil.', 0, 2); C.restore();
  return {};
});
// "Dedim: Siz kimsiniz? Benim kalbim, benim toprak!"
S(106.2, 109.6, (t, lt) => {
  const hit = lt > .9, sw = hit ? Math.sin((lt - .9) * 5) * Math.exp(-(lt - .9) * .8) * .5 : 0;
  room({ v: .14, floor: 560 });
  const lx = 640 + Math.sin(sw) * 160, ly = 70 + (1 - Math.cos(sw)) * 160; lightR(lx, ly, 560, .5);
  strokeTone([[640, -100], [lx, ly - 30]], .05, Math.PI / 2, 3); C.beginPath(); C.moveTo(lx - 50, ly); C.lineTo(lx + 50, ly); C.lineTo(lx + 20, ly - 30); C.lineTo(lx - 20, ly - 30); C.closePath(); C.fillStyle = ink(.8, 0); C.fill();
  setCam({ y: 1.4, z: -3, f: 900, hy: 300 });
  for (const [x, i] of [[-1.2, 0], [0, 1], [1.2, 2]]) { const p = at(x, 2.6), back = hit ? .12 : 0;
    fig({ x: p.x, y: p.y, h: 1.85 * p.k, view: 'front', kind: 'shade', hat: 'top', P: frontPose({ tilt: (x ? -Math.sign(x) : 0) * back, ab: [.15 + back, .15 + back] }), L: [(p.x - lx) / -400, -1], rim: .5, base: .1, lit: .2 }); }
  table(-2.2, 2.2, 1.2, 2.2, .78, .45);
  const n = pj(0, .8, 1.3); C.save(); C.translate(n[0] + (hit ? 60 : 0), n[1] - 10 - (hit ? Math.max(0, 80 - (lt - .9) * 200) : 0)); C.rotate(hit ? .4 : -.04); C.fillStyle = ink(.95, 0); C.fillRect(-150, -26, 300, 52); C.restore();
  const pm = at(-.2, .2); fig({ x: pm.x, y: pm.y + 160, h: 1.86 * pm.k, view: 'back', kind: 'man', L: [0, -1], rim: .8, P: frontPose({ ab: [.12, hit ? .5 : .9], el: [.1, hit ? .3 : 1.4], fw: [0, .3] }), fist: [0, 1] });
  return { shake: lt > .9 && lt < 1.2 ? 12 : 0 };
});
// "Yolumuza taş koydular, ben o taşlardan ev kurdum"
S(109.6, 113, (t, lt) => {
  sky({ top: .12, low: .4, h: 470, moon: [1050, 120, 24] });
  setCam({ y: 1.6, z: -6, f: 760, hy: 420 }); LIGHTS = [{ x: 0, y: 3, z: 6, i: .8, r: 6 }]; ground(-5, 80, { base: .2 });
  if (lt < 1.4) { const r = rng(3); for (let i = 0; i < 14; i++) { const t0 = r() * .6, ft = Math.max(0, lt - t0), x = lerp(200, 1080, r()), y = Math.min(560 + r() * 60, -60 + 900 * ft * ft); stone(x, y, 26 + r() * 22, ft * 3, i, .45); } }
  else ev(640, 600, 90, sm(seg(lt, 1.4, 3.3)), t);
  F('man', -3, 5, { view: 'side', dir: 1, P: sidePose(), L: [.6, -.7] }); F('woman', -2.4, 5.2, { view: 'side', dir: 1, P: sidePose() }); herLight(-2.4, 5.2, .5);
  return {};
});
// "Onurum üstüne yemin ettim, bir kere sevdim, durdum"
S(113, 116.4, (t, lt) => {
  C.fillStyle = lg(0, 0, 0, H, [[0, .05], [1, .15]], 0); C.fillRect(0, 0, W, H); lightR(640, 200, 700, .3);
  const k = sm(seg(lt, .2, 1));
  fig({ x: 820, y: 1000, h: 980, view: 'front', kind: 'woman', P: frontPose({ ab: [.2, .2], tilt: .03 }), closed: 1 }); glow(820, 300, 300, .5);
  fig({ x: 500, y: 1050, h: 1100, view: 'front', kind: 'man', P: frontPose({ ab: [lerp(.1, 2.5, k), lerp(.1, .25, k)], el: [lerp(.1, .35, k), lerp(.1, -1.85, k)], fw: [0, .2 * k], turn: .3 }), L: [.6, -.8], rim: .8 });
  return {};
});
// "Ne para ne şöhret, hiçbiri umurumda değil"
S(116.4, 119.8, (t, lt) => {
  alley({ y: 1.5, z: -3, f: 800 }, [[-3.8, 4], [3.8, 10]], { fog: .3 });
  const r = rng(8);
  for (const [x, z, dr, i] of [[-2.4, 1.5, 1, 0], [2.4, 1.8, -1, 1], [-2.6, 4, 1, 2], [2.5, 4.4, -1, 3]]) { const p = at(x, z); const fl = (Math.floor(t * 3 + i * .7) % 3 === 0) ? 1 : 0;
    camera(p.x + dr * 30 * p.k / 100, p.y - 1.5 * p.k, .3 * p.k, fl * (1 - (t * 3 + i * .7) % 1), dr); }
  const z = 5 - lt * .7, ph = lt * 4; F('man', -.3, z, { view: 'front', P: fwalk(ph), pockets: [1, 0], L: [-.5, -.8] }); F('woman', .35, z + .1, { view: 'front', P: fwalk(ph + 3) }); herLight(.35, z, 1);
  for (let i = 0; i < 26; i++) { const x = r() * W, y = ((r() * H + t * (90 + r() * 60)) % (H + 100)) - 50; bill(x + Math.sin(t * 2 + i) * 30, y, 50, t * (r() - .5) * 3 + i, .7); }
  return {};
});
// "Benim zenginliğim o, gerisi koca bir hiç, bil!"
S(119.8, 123, (t, lt) => {
  C.fillStyle = lg(0, 0, 0, H, [[0, .08], [1, .2]], 0); C.fillRect(0, 0, W, H); lightR(640, 300, 600, .3);
  const k = eo(seg(lt, .4, 1.6)), tilt = lerp(-.25, .32, k);
  const pans = scales(640, 330, 190, tilt, t);
  coins(pans[0][0], pans[0][1] - 8, 26, 44, 4); crown(pans[0][0] + 10, pans[0][1] - 80, 52, .6);
  const [gx, gy] = pans[1]; C.beginPath(); C.arc(gx, gy - 40, 34, 0, TAU); C.fillStyle = ink(.95, 0, 1); C.fill(); glow(gx, gy - 40, 140, .8);
  return {};
});
// ---------- KÖPRÜ ----------
// "Gece ne kadar kara olursa olsun..."
S(123, 125.7, (t, lt) => {
  sky({ top: .05, low: .2 }); rooftops({ t, seed: 12, y0: 300, y1: 640, rows: 5, far: .25, near: .04, lit: .25 * (1 - sm(lt / 2.2)) });
  toneMul(1 - .5 * sm(lt / 2.4));
  return {};
}, { xi: .2 });
// "Benim bir ışığım var..."
S(125.7, 128.4, (t, lt) => {
  C.fillStyle = ink(.02, 0); C.fillRect(0, 0, W, H);
  const k = sm(lt / 2); setCam({ y: 1.2, z: -4, f: 800 });
  F('woman', 0, 4, { view: 'front', P: frontPose({ ab: [.2, .2] }), closed: 1, base: .3 + .3 * k }); herLight(0, 4, .5 + 1.4 * k);
  return {};
});
// "Ve kim ona dokunursa..."
S(128.4, 131.1, (t, lt) => {
  C.fillStyle = ink(.02, 0); C.fillRect(0, 0, W, H); setCam({ y: 1.2, z: -4, f: 800 });
  eyes(30, 81, sm(lt / 1.5), 40, 80, 1240, 600, 4, t);
  F('woman', 0, 4, { view: 'front', P: frontPose({ ab: [.2, .2] }), closed: 0 }); herLight(0, 4, 1.6);
  // karanlıktan uzanan el
  const k = sm(seg(lt, .3, 2.6)); C.save(); C.translate(lerp(1500, 900, k), 380); C.rotate(Math.PI); bigFist(0, 0, 120, 0, 0); C.restore(); darkR(lerp(1500, 900, k), 380, 260, .75, .6);
  C.fillStyle = ink(.03, 0); C.fillRect(lerp(1500, 900, k) + 60, 300, 800, 160);
  return {};
});
// "KARŞISINDA BENİ BULUR!"
S(131.1, 134, (t, lt) => {
  C.fillStyle = ink(.04, 0); C.fillRect(0, 0, W, H); setCam({ y: 1.2, z: -4, f: 800 });
  F('woman', .9, 5, { view: 'front', P: frontPose({ ab: [.2, .2] }) }); herLight(.9, 5, 1.4);
  C.save(); C.translate(940, 400); C.rotate(Math.PI); bigFist(0, 0, 110, 0, 0); C.restore(); darkR(940, 400, 240, .75, .6); C.fillStyle = ink(.03, 0); C.fillRect(1000, 320, 400, 150);
  fig({ x: 520, y: 1100, h: 1150, view: 'back', kind: 'man', L: [.8, -.6], rim: 1, P: frontPose({ ab: [.15, 1.6], el: [.1, .05], fw: [0, .2] }) });
  return { flash: Math.max(0, 1 - lt * 3), shake: lt < .4 ? 14 : 0 };
});
// 157-161: kül yağar, sarılırlar
S(157, 161, (t, lt) => {
  sky({ top: .08, low: .3 }); rooftops({ t, seed: 6, y0: 440, y1: 650, rows: 3, far: .12, near: .04 });
  smokeCol(640, 500, 1000, 400, t, .2, 3); embers(t, 50, .8);
  fig({ x: 600, y: 900, h: 860, view: 'front', kind: 'man', P: frontPose({ ab: [.5, .5], el: [1.3, 1.3], fw: [.5, .5] }), L: [.5, -.8], rim: .8 });
  fig({ x: 680, y: 880, h: 760, view: 'back', kind: 'woman', P: frontPose({ ab: [.25, .25], el: [.5, .5], fw: [.4, .4] }) }); glow(680, 500, 300, .6);
  return { warm: .4 };
}, { xi: .3 });
// ---------- KAPANIŞ ----------
// "(Adını söylemem...)": paltosunu ışığın üstüne kapatır
S(180, 185.5, (t, lt) => {
  alley({ y: 1.3, z: -3, f: 820 }, [[-3.8, 3, .6]], { fog: .2 });
  const k = sm(seg(lt, .5, 2.5));
  F('woman', .15, 2.6, { view: 'front', P: frontPose({ ab: [.2, .2] }), closed: 1 }); herLight(.15, 2.6, 1 - .75 * k);
  F('man', -.05, 2.2, { view: 'front', P: frontPose({ ab: [lerp(.2, 1.1, k), lerp(.2, 1.1, k)], el: [lerp(.1, .9, k), lerp(.1, .9, k)], fw: [.3 * k, .3 * k] }), L: [-.6, -.8], rim: .6 });
  eyes(12, 90, 1 - sm(seg(lt, 3, 5)), 80, 200, 1200, 480, 3, t);
  return {};
}, { xi: .3 });
// bitiş kartı
S(185.5, T_END + 1, (t, lt) => {
  C.fillStyle = ink(.06, 0); C.fillRect(0, 0, W, H);
  const k = eo(seg(lt, 0, 1.2));
  for (let i = 0; i < 36; i++) { const a = i / 36 * TAU + lt * .05; C.beginPath(); C.moveTo(640, 330); C.lineTo(640 + Math.cos(a) * 900, 330 + Math.sin(a) * 900); C.lineTo(640 + Math.cos(a + .05) * 900, 330 + Math.sin(a + .05) * 900); C.closePath(); C.fillStyle = ink(.16 + .14 * k, a); C.fill(); }
  glow(640, 330, 420 * k, .6);
  C.save(); C.translate(640, 345); C.scale(.8 + .2 * k, .8 + .2 * k);
  C.font = `700 120px ${FONT}`; C.textAlign = 'center'; C.textBaseline = 'middle'; C.letterSpacing = '4px';
  C.strokeStyle = ink(.02, 0); C.lineWidth = 10; C.globalAlpha = k; C.strokeText('murat250sr', 0, 0); C.fillStyle = ink(.92, 0, 1); C.fillText('murat250sr', 0, 0);
  C.fillStyle = ink(.85, 0, 1); C.fillRect(-330 * k, 82, 660 * k, 4);
  C.restore(); embers(t, 40, .8);
  const ta = sm(seg(lt, .8, 1.8)), sc = .8 + .2 * k;
  return { nobadge: 1, post: (c) => { c.save(); c.translate(640, 345); c.scale(sc, sc); c.font = `600 30px ${FONT}`; c.letterSpacing = '10px'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.globalAlpha = ta; c.fillStyle = '#f1e6cf'; c.fillText('IŞIĞIMA GÖZ DİKEN', 0, 128); c.restore(); }, paperFade: sm(seg(lt, 4.1, 4.5)) };
}, { xi: .4 });
SH.sort((a, b) => a.a - b.a);
