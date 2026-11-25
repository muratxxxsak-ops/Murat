'use strict';
// ====== KASIM VE LİNDA — suluboya, sözlerin sırasıyla ======
const B = k => B0 + k * PER * 4; // ölçü başı
const lines = (a, b, n) => Array.from({ length: n + 1 }, (_, i) => lerp(a, b, i / n));
// ---------- ortak sahneler ----------
function street(t, cam = {}, o = {}) { setCam(Object.assign({ y: 1.6, z: -6 }, cam)); streetW(Object.assign({ t, seed: 7 }, o)); if (!o.nolamp) { lampW(-4, 3); lampW(4, 11); lampW(-4, 19); } }
// büyük el (yakın plan)
function bigHand(x, y, s, ang, skin, sleeve, fingers = 1) {
  C.save(); C.translate(x, y); C.rotate(ang);
  limb([-2.4 * s, 0], [-1.6 * s, 0], [-.75 * s, 0], .55 * s, .5 * s, .46 * s, sleeve, .5);
  C.beginPath(); C.ellipse(0, 0, .62 * s, .5 * s, 0, 0, TAU); C.fillStyle = cs(skin); C.fill();
  for (let i = 0; i < 4; i++) { const yy = (-.33 + i * .22) * s; limb([.4 * s, yy], [.8 * s * fingers + .3 * s, yy + .02 * s], [(1.05 * fingers + .45) * s, yy + .08 * s], .11 * s, .1 * s, .085 * s, skin, .65); }
  limb([-.1 * s, .38 * s], [.35 * s, .62 * s], [.7 * s, .6 * s], .14 * s, .12 * s, .1 * s, skin, .6);
  pen([[-.3 * s, -.3 * s], [.3 * s, -.35 * s]], Math.max(.8, s * .02), .3);
  C.restore();
}
// --- Linda portresi (yapraklar, rüzgâr) ---
function lindaPortrait(t, lt, o = {}) {
  vwash(0, H, [[0, o.bg0 || [150, 120, 100]], [1, o.bg1 || [214, 176, 130]]]);
  const r = rng(8); for (let i = 0; i < 16; i++) blob(r() * W, r() * H, 60 + r() * 90, [COL.leaf, [230, 180, 70], COL.leaf2][i % 3], .35);
  const p = person({ x: 640 + Math.sin(lt * .8) * 6, y: 1470 - lt * 6, h: 1300, who: 'linda', view: 'front', smile: o.smile === undefined ? .7 : o.smile, closed: o.closed, wind: .25 + .1 * Math.sin(t * 2), P: fPose({ tilt: -.05 }), L: [-.7, -.7] });
  if (o.crown) { const k = o.crown, [hx, hy] = p.top; for (let i = 0; i < 11; i++) { const a = Math.PI + (i / 10) * Math.PI, rx = 95, ry = 30, lx = hx + Math.cos(a) * rx, ly = hy + 52 + Math.sin(a) * ry - (1 - eo(k)) * 200;
      C.save(); C.translate(lx, ly); C.rotate(a + Math.PI / 2); C.globalAlpha = clamp(k * 2); C.beginPath(); C.ellipse(0, -12, 11, 22, 0, 0, TAU); C.fillStyle = cs([COL.leaf, COL.leaf2, [232, 176, 60]][i % 3]); C.fill(); C.restore(); pen([[lx, ly], [lx + Math.cos(a + Math.PI / 2) * -20, ly + Math.sin(a + Math.PI / 2) * -20]], 1, .3 * k); } }
  leavesFall(t, 14, 3, 1.4);
  return {};
}
// --- buğulu camda kalp; ardında Linda ---
function heartWindow(t, lt, d) {
  street(t, { y: 1.5, z: -3, f: 900 }, { lit: .5, cafe: .3 });
  const p = P2('linda', .25, 1.6, { view: 'front', smile: .6, P: fPose({ ab: [.15, .15] }) }); blob(p.head[0], p.head[1] + 60, 150, COL.warm, .25);
  // buğu
  TP.fillStyle = 'rgba(214,222,232,.66)'; TP.fillRect(0, 0, W, H);
  const k = eo(seg(lt, 0, d * .55)), hx = p.head[0], hy = p.head[1] + 40, s = 230;
  TP.save(); TP.globalCompositeOperation = 'destination-out'; TP.lineWidth = 46; TP.lineCap = 'round'; TP.strokeStyle = '#000';
  TP.beginPath(); const N = 60; for (let i = 0; i <= N * k; i++) { const a = i / N * TAU, x = 16 * Math.sin(a) ** 3, y = -(13 * Math.cos(a) - 5 * Math.cos(2 * a) - 2 * Math.cos(3 * a) - Math.cos(4 * a)); i ? TP.lineTo(hx + x * s / 16, hy + y * s / 16) : TP.moveTo(hx + x * s / 16, hy + y * s / 16); } TP.stroke();
  if (k > .98) { TP.beginPath(); for (let i = 0; i <= N; i++) { const a = i / N * TAU, x = 16 * Math.sin(a) ** 3, y = -(13 * Math.cos(a) - 5 * Math.cos(2 * a) - 2 * Math.cos(3 * a) - Math.cos(4 * a)); i ? TP.lineTo(hx + x * s / 16, hy + y * s / 16) : TP.moveTo(hx + x * s / 16, hy + y * s / 16); } TP.closePath(); TP.globalAlpha = sm(seg(lt, d * .55, d * .8)); TP.fill(); }
  TP.restore(); glassDrops(t, 30, 4);
  return {};
}
// --- soğukta sıcak eller ---
function warmHands(t, lt) {
  vwash(0, H, [[0, [70, 88, 120]], [1, [130, 150, 176]]]);
  setCam({ y: 1.6, z: -6 }); streetW({ t, seed: 9, lit: .5, refl: false }); toneDim(.15);
  const r = rng(2); for (let i = 0; i < 40; i++) { const y = (r() * H + t * (30 + r() * 30)) % H; blob(r() * W + Math.sin(t + i) * 20, y, 3 + r() * 4, [250, 252, 255], .8); }
  blob(640, 470, 300 + 20 * Math.sin(t * 2), COL.amber, .45);
  person({ x: 470, y: 1350, h: 1150, who: 'kasim', view: 'side', dir: 1, P: sPose({ sa: [.9, 1.0], ea: [.35, .3], nod: .15 }), smile: .6 });
  person({ x: 810, y: 1330, h: 1050, who: 'linda', view: 'side', dir: -1, P: sPose({ sa: [.85, .95], ea: [.35, .3], nod: .1 }), smile: .9, closed: 1 });
  blob(640, 480, 120, [255, 214, 150], .5);
  for (let i = 0; i < 3; i++) { const ph = (t * .5 + i / 3) % 1; blob(640 + Math.sin(i * 2 + t) * 30, 300 - ph * 140, 26 + ph * 50, [250, 250, 252], .35 * (1 - ph)); }
  return {};
}
// --- takvim ---
function calendars(t, lt, d, months, final) {
  vwash(0, H, [[0, [226, 214, 196]], [1, [196, 180, 160]]]); brickWallW(0, 0, W, H, [210, 196, 176]);
  const n = months.length, k = lt / d, idx = Math.min(n - 1, Math.floor(k * n)), f = (k * n) % 1;
  calendar(640, 360, 360, months[idx], 1, -.02);
  if (idx < n - 1 && f > .7) { const q = sm((f - .7) / .3); C.save(); C.translate(640, 360 - 234); C.scale(1, 1 - q * 2); calendar(0, 234, 360, months[idx], 1, -.02, 1); C.restore(); }
  if (final && lt > d * .55) { const q = sm(seg(lt, d * .55, d * .9)); L.save(); L.strokeStyle = cs(COL.umb, .85); L.lineWidth = 6; L.beginPath(); for (let i = 0; i <= 40 * q; i++) { const a = i / 40 * TAU * 1.05; const x = 640 + Math.cos(a) * 170, y = 395 + Math.sin(a) * 120; i ? L.lineTo(x, y) : L.moveTo(x, y); } L.stroke(); L.restore(); }
  return { pencil: .6 };
}
// --- yan bakana karşı ---
function guard(t, lt, d) {
  street(t, { y: 1.5, z: -4, f: 820 }, { lit: .4 });
  const st = sm(seg(lt, d * .3, d * .55));
  P2('extra', 2.4, 4.5, { view: 'side', dir: -1, P: sPose({ nod: .1 }), look: { coat: [110, 100, 92] } });
  P2('linda', .6, 3.6, { view: 'front', P: fPose({ ab: [.15, .15] }), smile: .2 });
  P2('kasim', lerp(-1.6, 1.4, st), lerp(3.2, 3.9, st), { view: 'front', P: fPose({ st: .16 }), pockets: [1, 1], smile: -.4 });
  rainTop(t, 160);
  return { shake: st > .1 && st < .9 ? 2 : 0 };
}
// --- şemsiye altında yürüyüş (yan) ---
function walkUmb(t, lt, o = {}) {
  street(t, { y: 1.4, z: -4.5 + (o.cam || 0), f: 820, x: o.cx || 0 }, { lit: .45 });
  const ph = lt * 3.8, x0 = (o.x0 === undefined ? -1.5 : o.x0) + lt * .35;
  const k = P2('kasim', x0 - .3, 3, { view: 'side', dir: 1, P: sWalk(ph, 1, { sa: [-.3, .9], ea: [.2, 1.6] }), holdUmb: 1 });
  P2('linda', x0 + .25, 3.1, { view: 'side', dir: 1, P: sWalk(ph + 3, 1, { nod: o.lean ? .25 : 0, lean: o.lean ? .1 : .04 }), closed: o.lean ? 1 : 0 });
  const p = at(x0, 3, 2.25); umbrella(p.x, p.y, p.k * 1.05, -.06, COL.umb, 1, 1);
  leavesFall(t, 10); rainTop(t, 240); splashes(t, 30, 480, 700);
  return {};
}
// ---------- GİRİŞ (0 - 5.1) ----------
S(0, 2.6, (t, lt) => { // "(Kasım...)": camda yağmur, duvarda KASIM yaprağı
  vwash(0, H, [[0, [90, 100, 122]], [1, [150, 156, 170]]]); brickWallW(0, 0, W, H, [200, 186, 168]);
  calendar(780, 330, 300, 'KASIM', 1, .03); C.fillStyle = cs([60, 70, 92]); C.fillRect(80, 80, 420, 520); blob(290, 340, 200, [150, 160, 186], .6);
  pen([[80, 80], [500, 80], [500, 600], [80, 600]], 3, .7, true); pen([[290, 80], [290, 600]], 3, .6); pen([[80, 340], [500, 340]], 3, .6);
  TP.save(); TP.beginPath(); TP.rect(80, 80, 420, 520); TP.clip(); glassDrops(t, 40, 3); TP.restore();
  return {};
}, { xi: 1.2 });
S(2.6, B(2), (t, lt) => { // "(Efendim, Linda?)": Kasım döner
  street(t, { y: 1.5, z: -2.5, f: 900 }, { lit: .45 });
  const k = sm(seg(lt, .2, 1));
  P2('kasim', -.3, 2.2, { view: k > .5 ? 'front' : 'back', P: fPose({ tilt: .05 }), pockets: [1, 1], smile: .5 });
  rainTop(t, 200); return {};
});
// ---------- NAKARAT ----------
function chorus(a, b, v) { const T = lines(a, b, 4);
  S(T[0], T[1], (t, lt) => lindaPortrait(t, lt, { smile: .8 }), { xi: v === 0 ? 0 : .3 });
  S(T[1], T[2], (t, lt, d) => heartWindow(t, lt, d));
  S(T[2], T[3], (t, lt) => warmHands(t, lt));
  S(T[3], T[4], (t, lt, d) => { if (lt < d * .55) return calendars(t, lt, d * .55, ['KASIM', 'KASIM', 'KASIM', 'KASIM'], 0); return walkUmb(t, lt - d * .55, { x0: -.8 }); }); }
chorus(B(2), B(10), 0);
chorus(B(18), B(22), 1);
chorus(B(30), B(38), 2);
// ---------- 1. KITA (Kasım) ----------
{ const T = lines(B(10), B(18), 10);
  S(T[0], T[1], (t, lt) => { street(t, { y: 1.5, z: -4 }, { lit: .5, cafe: .5 }); // mahallede bilinir
    for (const [x, z, i] of [[-3.4, 3, 0], [3.3, 3.5, 1], [-3.2, 6, 2]]) P2('extra', x, z, { view: 'front', P: fPose({ tilt: i % 2 ? -.1 : .1, ab: [.15, i === 1 ? 1.4 : .15], el: [.1, i === 1 ? 1.5 : .1] }), look: { coat: [[110, 96, 80], [90, 96, 100], [120, 90, 70]][i] }, smile: .6 });
    P2('kasim', -.2 + lt * .5, 4, { view: 'side', dir: 1, P: sWalk(lt * 4) }); rainTop(t, 120); return {}; });
  S(T[1], T[2], (t, lt) => { street(t, { y: .5, z: -3, f: 820, hy: 470 }, { lit: .3 }); // eğilmeyen baş
    P2('kasim', 0, 2.2, { view: 'front', P: fPose({ st: .17 }), pockets: [1, 1], smile: 0, wind: .3 }); leavesFall(t, 14); rainTop(t, 150); return {}; });
  S(T[2], T[3], (t, lt) => { vwash(0, H, [[0, [50, 62, 90]], [1, [110, 120, 146]]]); // yağmur vuruyor cama
    setCam({ y: 1.6, z: -8 }); streetW({ t, seed: 3, lit: .5 }); toneDim(.25); glassDrops(t, 110, 7); rainTop(t, 80, .05, 30, .3); return { wet: 1.4 }; });
  S(T[3], T[4], (t, lt) => { const fr = Math.min(lt, .35); street(t, { y: 1.5, z: -3 }, { lit: .45 }); // kalbim durdu: yağmur donar
    P2('linda', -1 + fr * 1.2, 4.5, { view: 'side', dir: 1, P: sWalk(fr * 4), smile: .5 });
    const pm = at(-1.4, .2); person({ x: pm.x, y: pm.y + 120, h: 1.86 * pm.k, who: 'kasim', view: 'back' });
    rainTop(T[3] + fr, 220); blob(640, 300, 400, COL.warm, .2 * sm(lt / .5)); return {}; });
  S(T[4], T[6], (t, lt, d) => { // İspanyolca sözlük: linda = güzel
    vwash(0, H, [[0, [150, 120, 96]], [1, [110, 84, 70]]]);
    C.save(); C.translate(640, 380); C.rotate(-.04); C.fillStyle = cs([246, 238, 220]); C.fillRect(-470, -260, 470, 520); C.fillRect(0, -260, 470, 520); C.restore();
    pen([[170, 120], [640, 140], [1110, 120]], 1.5, .4); pen([[640, 140], [640, 640]], 2, .5);
    paintText('SÖZLÜK', 400, 170, 34, [120, 60, 50], { sp: 6, rot: -.04 }); paintText('İspanyolca – Türkçe', 400, 210, 20, [90, 80, 74], { rot: -.04, font: 'Caveat' });
    const rr = rng(4); for (let i = 0; i < 9; i++) { const y = 260 + i * 40; pen([[230, y + 10], [230 + 120 + rr() * 200, y + 8]], 3, .25); }
    const k = seg(lt, .2, d * .45); const word = 'linda'.slice(0, Math.ceil(k * 5)); penText(word, 820, 230, 90, { rot: -.05 });
    if (lt > d * .5) { const q = sm(seg(lt, d * .5, d * .8)); penText('= güzel', 830, 330, 70, { rot: -.05, a: q }); }
    if (lt > d * .7) { const q = sm(seg(lt, d * .7, d)); C.save(); C.globalAlpha = q; person({ x: 880, y: 930, h: 560, who: 'linda', view: 'front', smile: .8 }); C.restore(); }
    return { pencil: .4 }; });
  S(T[6], T[7], (t, lt) => { street(t, { y: 1.4, z: -3 }, { lit: .25 }); brickWallW(0, 0, W, 360, [150, 146, 140]); // "taş gibi"
    for (const [x, z, i] of [[-1.8, 2.6, 0], [1.9, 2.8, 1]]) P2('extra', x, z, { view: 'front', P: fPose({ ab: [.15, 1.0], el: [.1, .4], fw: [0, .5], turn: i ? -1 : 1 }), look: { coat: [[96, 92, 90], [110, 100, 92]][i] }, smile: -.3 });
    P2('kasim', 0, 3.4, { view: 'front', P: fPose({ st: .15 }), pockets: [1, 1], smile: -.3, look: { coat: [96, 104, 116] } }); rainTop(t, 120); return {}; });
  S(T[7], T[8], (t, lt) => { if (lt < .9) return lindaPortrait(t, lt, { smile: 1, closed: 1 }); // gülünce eririm: avuçta kar tanesi
    vwash(0, H, [[0, [80, 96, 126]], [1, [150, 166, 190]]]); bigHand(560, 470, 120, -.35, LOOK.kasim.skin, LOOK.kasim.coat, .7);
    const m = sm(seg(lt, 1, 1.9)), sx = 700, sy = 360; for (let i = 0; i < 6; i++) { const a = i / 6 * TAU; pen([[sx, sy], [sx + Math.cos(a) * 40 * (1 - m), sy + Math.sin(a) * 40 * (1 - m)]], 3, .7 * (1 - m), false, [240, 246, 252]); }
    if (m > .3) blob(sx, sy + 10, 26 * m, [190, 210, 230], .6 * m); return {}; });
  S(T[8], T[9], (t, lt, d) => guard(t, lt, d));
  S(T[9], T[10], (t, lt) => lindaPortrait(t, lt, { smile: 1, crown: sm(lt / 1.4) })); }
// ---------- 2. KITA (Linda) ----------
{ const T = lines(B(22), B(30), 10);
  S(T[0], T[1], (t, lt) => { street(t, { y: 1.5, z: -4 }, { lit: .5 }); // herkes peşimde
    P2('linda', -.3, 3, { view: 'front', P: fWalk(lt * 4), smile: .3 });
    for (const [x, z, i] of [[-1.6, 6, 0], [1.2, 7, 1], [.2, 9, 2]]) P2('extra', x, z, { view: 'front', P: fWalk(lt * 4 + i), look: { coat: [[100, 90, 84], [80, 86, 96], [120, 104, 90]][i] }, smile: .9 });
    rainTop(t, 120); return {}; });
  S(T[1], T[2], (t, lt) => { vwash(0, H, [[0, [120, 90, 86]], [1, [80, 60, 60]]]); // kilit
    C.fillStyle = cs([140, 120, 96]); C.fillRect(380, 80, 520, 560); pen([[380, 80], [900, 80], [900, 640], [380, 640]], 3, .6, true);
    C.lineWidth = 34; C.strokeStyle = cs([110, 110, 116]); C.beginPath(); C.arc(640, 340, 90, Math.PI, TAU); C.stroke();
    C.fillStyle = lgc(520, 340, 760, 520, [[0, [210, 176, 90]], [1, [140, 100, 40]]]); C.fillRect(520, 330, 240, 210); pen([[520, 330], [760, 330], [760, 540], [520, 540]], 2.5, .7, true);
    C.beginPath(); C.arc(640, 420, 20, 0, TAU); C.fillStyle = cs([40, 30, 28]); C.fill(); C.fillRect(632, 420, 16, 60);
    const kx = lerp(980, 700, sm(seg(lt, .1, .9))), ka = Math.sin(lt * 18) * .25 * (lt > .9 ? 1 : 0); C.save(); C.translate(kx, 450); C.rotate(ka); C.fillStyle = cs([170, 170, 176]); C.fillRect(0, -8, 120, 16); C.beginPath(); C.arc(140, 0, 26, 0, TAU); C.fill(); C.restore(); return {}; });
  S(T[2], T[3], (t, lt) => { street(t, { y: 1.5, z: -3 }, { lit: .45 }); // çiçekler, sözler
    P2('linda', .9, 3, { view: 'front', P: fPose({ ab: [.15, .15], turn: 1 }), smile: -.2 });
    const n = Math.min(3, 1 + Math.floor(lt / .65)); for (let i = 0; i < n; i++) { const p = P2('extra', -1.2 + i * .1, 2.6 + i * 1.6, { view: 'front', P: fPose({ ab: [.15, .9], el: [.1, .9], fw: [0, .6] }), look: { coat: [[100, 90, 84], [80, 86, 96], [120, 104, 90]][i] }, smile: 1 });
      const [hx, hy] = p.hands[1]; for (let k = 0; k < 7; k++) blob(hx + Math.cos(k) * 14, hy - 20 + Math.sin(k * 2) * 12, 9, [[210, 60, 80], [240, 160, 180], [250, 220, 120]][k % 3], .9); }
    rainTop(t, 110); return {}; });
  S(T[3], T[4], (t, lt) => { street(t, { y: .8, z: -2, f: 900, hy: 300 }, { lit: .3, nolamp: 1 }); // solan çiçekler
    for (let i = 0; i < 3; i++) { const x = 400 + i * 230, y = 600 + (i % 2) * 30, w = sm(seg(lt, 0, 1.6)); pen([[x - 60, y], [x + 40, y - 10]], 3, .7, false, [90, 110, 70]);
      for (let k = 0; k < 6; k++) blob(x + 40 + Math.cos(k) * 16, y - 10 + Math.sin(k * 2) * 10 + w * 18, 11 - w * 4, mix([[210, 60, 80], [240, 160, 180], [250, 220, 120]][k % 3], [120, 100, 90], w * .8), .9); }
    rainTop(t, 200); splashes(t, 40, 450, 700); return {}; });
  S(T[4], T[5], (t, lt) => { street(t, { y: 1.5, z: -3 }, { lit: .4 }); // ne çiçek ne pırlanta: boş eller
    P2('kasim', 0, 2.8 - lt * .3, { view: 'front', P: fPose({ ab: [.5, .5], el: [.5, .5], fw: [.4, .4] }), smile: .4 }); rainTop(t, 200); return {}; });
  S(T[5], T[7], (t, lt, d) => { street(t, { y: 1.4, z: -2.6, f: 900 }, { lit: .45 }); // şemsiye uzattı
    const k = eo(seg(lt, .2, 1.6));
    const pl = P2('linda', .55, 2.6, { view: 'front', P: fPose({ ab: [.2, .2], tilt: -.04 }), smile: lerp(-.1, .7, k), wind: .1 });
    const pk = P2('kasim', -.75, 2.5, { view: 'front', P: fPose({ ab: [.15, lerp(.2, 2.2, k)], el: [.1, lerp(.1, -.6, k)], turn: .6 }), smile: .4 });
    const ux = lerp(pk.hands[1][0], pl.head[0] - 30, k), uy = lerp(pk.hands[1][1], pl.head[1] - 120, k);
    umbrella(ux, uy, 190, -.05 + (1 - k) * .4, COL.umb, k, k > .9 ? 1 : 0);
    rainTop(t, 240, .12, 26, .5); return {}; });
  S(T[7], T[8], (t, lt, d) => calendars(t, lt, d, ['OCAK', 'ŞUBAT', 'MART'], 0));
  S(T[8], T[9], (t, lt, d) => calendars(t, lt, d, ['NİSAN', 'KASIM'], 1));
  S(T[9], T[10], (t, lt) => { street(t, { y: 1.4, z: -3 }, { lit: .5, cafe: .6 }); // "Linda, neden o?" ... güvende
    if (lt < .9) { for (const [x, i] of [[-1.5, 0], [1.6, 1]]) P2('extra', x, 2.8, { view: 'front', P: fPose({ ab: [.15, .9], el: [.1, 1.2], fw: [0, .4] }), look: { coat: [[160, 110, 120], [110, 130, 120]][i], hair: [[90, 50, 40], [40, 30, 26]][i] }, smile: .2 });
      P2('linda', 0, 3, { view: 'front', smile: 1, closed: 1 }); }
    else return walkUmb(t, lt, { lean: 1, x0: -1 });
    rainTop(t, 120); return {}; }); }
// ara (93.3 - 99.4): şemsiye altında uzun yürüyüş
S(B(38), B(40.5), (t, lt) => walkUmb(t, lt, { x0: -2.2, cam: lt * .2, lean: 1 }), { xi: .3 });
// ---------- KÖPRÜ: mevsimler ----------
{ const T = lines(B(40.5), B(44.5), 4);
  const benchScene = (t, lt, season, o = {}) => {
    const skies = { autumn: [[170, 150, 140], [226, 196, 160]], winter: [[160, 172, 196], [226, 232, 240]], spring: [[180, 200, 226], [240, 226, 230]], summer: [[110, 170, 220], [236, 226, 190]] };
    vwash(0, H, [[0, skies[season][0]], [.7, skies[season][1]], [.71, season === 'winter' ? [236, 240, 246] : [130, 140, 110]], [1, season === 'winter' ? [210, 216, 226] : [100, 110, 90]]]);
    treeW(860, 520, 520, season, t, 3); bench(560, 580, 170);
    if (season === 'autumn') leavesFall(t, 18); if (season === 'winter') { const r = rng(1); for (let i = 0; i < 60; i++) blob(r() * W, (r() * H + t * 40) % H, 4, [255, 255, 255], .9); }
    if (season === 'spring') leavesFall(t, 14, 6, .8, [246, 196, 210]);
    const pk = person({ x: 500, y: 690, h: 470, who: 'kasim', view: 'front', P: fPose({ kneel: .55, ab: [.15, .5], el: [.3, .8] }), smile: .6 });
    person({ x: 625, y: 680, h: 420, who: 'linda', view: 'front', P: fPose({ kneel: .55, tilt: .12, ab: [.5, .15], el: [.8, .2] }), smile: .8, closed: o.closed });
    if (o.umb) umbrella(560, 300, 160, -.05, COL.umb, 1);
    return { wet: 1.2 }; };
  S(T[0], T[1], (t, lt) => benchScene(t, lt, 'autumn'), { xi: .4 });
  S(T[1], T[2], (t, lt) => benchScene(t, lt, 'autumn', { umb: 1 }));
  S(T[2], T[3], (t, lt, d) => benchScene(t, lt, ['winter', 'spring', 'summer'][Math.min(2, Math.floor(lt / d * 3))]));
  S(T[3], T[4], (t, lt) => benchScene(t, lt, 'autumn', { closed: 1 })); }
// ---------- 3. KITA (karşılıklı, enerjik) ----------
{ const T = lines(B(44.5), B(50.8), 6);
  S(T[0], T[1], (t, lt, d) => { const snow = lt > d / 2; street(t, { y: 1.5, z: -3 }, { lit: .4, sky1: snow ? [200, 206, 222] : undefined }); // yağmur/kar
    P2('kasim', -.3, 2.6, { view: 'front', P: fPose({ ab: [.9, .9], el: [.4, .4] }), smile: 1 }); P2('linda', .5, 2.8, { view: 'front', smile: 1 });
    if (snow) { const r = rng(2); for (let i = 0; i < 90; i++) { const y = (r() * H + t * 60) % H; TP.fillStyle = 'rgba(255,255,255,.9)'; TP.beginPath(); TP.arc(r() * W + Math.sin(t + i) * 20, y, 2 + r() * 3, 0, TAU); TP.fill(); } } else rainTop(t, 300, .15, 30, .55);
    return {}; });
  S(T[1], T[2], (t, lt) => { street(t, { y: 1.4, z: -3 }, { lit: .3, sky0: [40, 48, 70] }); // fırtına bizden korkar
    const pk = P2('kasim', -.3, 2.6, { view: 'front', P: fPose({ ab: [.15, 2.5], el: [.1, -.6] }), wind: .5, smile: .6 }); P2('linda', .4, 2.7, { view: 'front', wind: .5, smile: .8 });
    { const [hx, hy] = pk.hands[1]; umbrella(hx, hy - 230 * .45, 230, -.15, COL.umb, 1, 1); } rainTop(t, 380, .5, 40, .6);
    TP.save(); TP.globalCompositeOperation = 'destination-out'; TP.fillStyle = '#000'; TP.beginPath(); TP.ellipse(600, 420, 260, 330, 0, 0, TAU); TP.fill(); TP.restore(); leavesFall(t * 2, 20); return {}; });
  S(T[2], T[3], (t, lt) => { vwash(0, H, [[0, [60, 70, 96]], [1, [130, 136, 156]]]); // kalkan
    const pk = person({ x: 500, y: 1360, h: 1120, who: 'kasim', view: 'front', P: fPose({ ab: [.2, 1.5], el: [.1, -.5] }), smile: .2, L: [.7, -.7] });
    person({ x: 780, y: 1330, h: 1000, who: 'linda', view: 'front', smile: .7, P: fPose({ tilt: -.1 }) });
    { const [hx, hy] = pk.hands[1]; umbrella(hx - 72, hy - 300, 330, -.25, COL.umb, 1, 1); } rainTop(t, 300, .55, 40, .55); TP.save(); TP.globalCompositeOperation = 'destination-out'; TP.beginPath(); TP.moveTo(320, 190); TP.lineTo(930, 120); TP.lineTo(1000, 720); TP.lineTo(380, 720); TP.fill(); TP.restore(); return {}; });
  S(T[3], T[4], (t, lt) => { // evim / şafağın
    vwash(0, H, [[0, [120, 110, 170]], [.5, [244, 170, 150]], [.8, [255, 220, 160]], [1, [250, 236, 200]]]);
    const sy = 520 - sm(lt / 2.4) * 120; blob(640, sy, 160, [255, 230, 170], .9); blob(640, sy, 60, [255, 250, 230], 1);
    const r = rng(5); for (let i = 0; i < 18; i++) { const x = i * 75 - 20, h = 80 + r() * 140; C.fillStyle = cs([120 + r() * 30, 90, 110]); C.fillRect(x, H - h - 60, 70, h + 60); for (let k = 0; k < 4; k++) blob(x + 20 + (k % 2) * 30, H - h - 30 + (k >> 1) * 40, 7, COL.warm, .8); }
    person({ x: 600, y: 650, h: 340, who: 'kasim', view: 'back' }); person({ x: 680, y: 650, h: 310, who: 'linda', view: 'back', P: fPose({ tilt: -.15 }) });
    return {}; });
  S(T[4], T[5], (t, lt, d) => { brickWallW(0, 0, W, H, [140, 84, 70]); // her duvara yazılsın
    const k = seg(lt, .1, d * .8), s1 = 'LİNDA ♥ KASIM', n = Math.ceil(k * s1.length);
    TP.save(); TP.translate(640, 330); TP.rotate(-.04); TP.font = '700 120px Kalam'; TP.textAlign = 'center'; TP.textBaseline = 'middle'; TP.fillStyle = 'rgba(250,246,238,.93)'; TP.fillText(s1.slice(0, n), 0, 0); TP.restore();
    for (let i = 0; i < 3; i++) { const dx = 300 + i * 340; blob(dx, 420, 8, [250, 244, 236], .9); C.fillStyle = cs([250, 244, 236], .7); C.fillRect(dx - 3, 420, 6, 30 + i * 12); }
    return { pencil: .5 }; });
  S(T[5], T[6], (t, lt) => { street(t, { y: 1.4, z: -2.5, f: 900 }, { lit: .5 }); // kimse giremez araya
    paintText('KASIM ♥ LİNDA', 260, 200, 48, [250, 244, 236], { rot: -.08 });
    person({ x: 600, y: 900, h: 760, who: 'kasim', view: 'front', P: fPose({ ab: [.6, .6], el: [-1.8, -1.8], fw: [.3, .3] }), smile: .7, closed: 1 });
    person({ x: 680, y: 890, h: 700, who: 'linda', view: 'back', P: fPose({ ab: [.08, .08], el: [.05, .05] }) });
    rainTop(t, 160); return {}; }); }
// 124.6 - 127.3: şemsiye kuşbakışı döner
S(B(50.8), B(52), (t, lt) => { vwash(0, H, [[0, [80, 86, 100]], [1, [70, 76, 92]]]);
  const r = rng(4); for (let i = 0; i < 30; i++) blob(r() * W, r() * H, 30 + r() * 40, [100, 104, 120], .3); for (let i = 0; i < 12; i++) blob(r() * W, r() * H, 14, COL.leaf, .7);
  C.save(); C.translate(640, 360); C.rotate(t * .8); const R0 = 230; for (let i = 0; i < 8; i++) { const a = i / 8 * TAU; C.beginPath(); C.moveTo(0, 0); C.arc(0, 0, R0, a, a + TAU / 8); C.closePath(); C.fillStyle = cs(i % 2 ? COL.umb : shade(COL.umb, .85)); C.fill(); } C.restore();
  splashes(t, 50, 0, H); return {}; });
// ---------- FİNAL NAKARAT ----------
{ const T = lines(B(52), B(58.4), 5);
  S(T[0], T[1], (t, lt) => lindaPortrait(t, lt, { smile: .9 }));
  S(T[1], T[2], (t, lt, d) => heartWindow(t, lt, d));
  S(T[2], T[3], (t, lt) => warmHands(t, lt));
  S(T[3], T[4], (t, lt, d) => guard(t, lt, d));
  S(T[4], T[5], (t, lt) => lindaPortrait(t, lt, { smile: 1, crown: sm(lt / 1.4) })); }
S(B(58.4), B(60), (t, lt) => walkUmb(t, lt, { x0: -1.2, lean: 1 }));
{ const T = lines(B(60), B(64), 2);
  S(T[0], T[1], (t, lt) => walkUmb(t, lt, { x0: -1.6 }));
  S(T[1], T[2], (t, lt, d) => { // kuşbakışı: gri sokakta kırmızı şemsiye
    vwash(0, H, [[0, [96, 100, 112]], [1, [80, 84, 98]]]); const z = 1 + lt * .03;
    C.save(); C.translate(640, 360); C.scale(1 / z, 1 / z); C.translate(-640, -360);
    for (let i = 0; i < 9; i++) { pen([[0, 120 + i * 60], [W, 120 + i * 60]], 1, .15); } C.fillStyle = cs([120, 124, 136]); C.fillRect(0, 0, W, 110); C.fillRect(0, 610, W, 110);
    const r = rng(2); for (let i = 0; i < 14; i++) blob(r() * W, r() * H, 10, COL.leaf, .7);
    for (let i = 0; i < 6; i++) { const x = (r() * W + t * 30 * (r() < .5 ? -1 : 1)) % W; blob(x, 140 + r() * 440, 40, [50, 50, 60], .7); }
    const ux = 520 + lt * 30; for (let i = 0; i < 8; i++) { const a = i / 8 * TAU + t * .2; C.beginPath(); C.moveTo(ux, 360); C.arc(ux, 360, 80, a, a + TAU / 8); C.closePath(); C.fillStyle = cs(i % 2 ? COL.umb : shade(COL.umb, .85)); C.fill(); }
    C.restore(); splashes(t, 60, 0, H); return {}; }); }
// ---------- KAPANIŞ ----------
S(B(64), 161.5, (t, lt) => { street(t, { y: 1.5, z: -6 + lt * .2 }, { lit: .5 }); // yağmurda uzaklaşırlar
  const ph = lt * 3.5, z = 6 + lt * .6; P2('kasim', -.25, z, { view: 'back', P: fWalk(ph) }); P2('linda', .25, z + .05, { view: 'back', P: fWalk(ph + 3), P2: 0 });
  const p = at(0, z, 2.3); umbrella(p.x, p.y, p.k * 1.05, 0, COL.umb, 1); leavesFall(t, 12); rainTop(t, 200, .1, 26, .45 * (1 - sm(seg(lt, 3, 4.5)))); return {}; });
S(161.5, T_END + 1, (t, lt) => { // bitiş kartı
  vwash(0, H, [[0, [238, 230, 214]], [1, [226, 214, 196]]]);
  const k = eo(seg(lt, 0, 1.4)); blob(640, 330, 560 * k, COL.umb, .4); blob(560, 300, 260 * k, [214, 172, 62], .35); blob(740, 380, 240 * k, [44, 54, 78], .3);
  paintText('murat250sr', 640, 320, 160 * (.8 + .2 * k), [70, 20, 24], { a: k, font: 'Kalam' });
  penText('Kasım ve Linda', 640, 450, 56, { a: sm(seg(lt, .8, 1.8)) }); leavesFall(t, 16, 5);
  return { nobadge: 1, pencil: .3 }; }, { xi: .6 });
SH.sort((a, b) => a.a - b.a);
function toneDim(a) { C.save(); C.fillStyle = `rgba(20,26,40,${a})`; C.fillRect(0, 0, W, H); C.restore(); }
