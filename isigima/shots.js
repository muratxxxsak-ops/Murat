'use strict';
// ===== ortak =====
const DARK = { sky0: [.004, .004, .007], sky1: [.025, .025, .032], fog: [.01, .01, .013], amb: [.018, .018, .022] };
const COOL = [.85, .9, 1], GOLD = [1, .7, .36], FIRE = [1, .45, .15];
function A(o) { return Object.assign({ sc: [1, 7, 0, 0], sc2: [18, 0, .022, 0], sc3: [1, 0, 1, 0] }, DARK, o); }
const lampL = (x, y, z, i = 26, fl = 1) => ({ p: [x, y, z], c: COOL, i: i * fl });
const herL = (x, y, z, i = 9) => ({ p: [x, y, z], c: GOLD, i });
const flick = t => (Math.sin(t * 37) > .93 || Math.sin(t * 13.3) > .985) ? .25 : 1;
const idle = (o = {}) => pose(Object.assign({ aL: [.05, .1, .12], aR: [.05, .1, .12] }, o));
const lerp3 = (a, b, k) => [lerp(a[0], b[0], k), lerp(a[1], b[1], k), lerp(a[2], b[2], k)];
// ===== GİRİŞ (0-14): "Kimse bilmeyecek adını... / Ama herkes bilecek kimin olduğunu!" =====
S(0, 7, (t, lt) => { const z = -7 + lt * .95, P = walk(lt * 4.6, .8); P.head = .25;
  return A({ cam: { p: [.5, 1.35, z + 4.2], t: [0, 1.45, z], f: 1.8 }, lights: [lampL(-1.2, 4.6, -3.5, 30, flick(t))], chars: [man(P, 0, z, 0)], vig: .7 }); }, { x: 1.2 });
S(7, 14, (t, lt) => { const st = sm(seg(lt, 0, 4.5)), z = lerp(-1, 4, st), P = mixPose(walk(lt * 4.6, 1), idle(), sm(seg(lt, 4, 5)));
  const cz = lerp(z - 3.6, z - 2.6, sm(seg(lt, 4, 7)));
  return A({ cam: { p: [.7, 1.7, cz], t: [0, 1.5, z + 6], f: 1.7 }, lights: [lampL(-1.4, 4.4, z + 1.5, 18), herL(0, 1.3, 13.6, 14 * sm(seg(lt, .5, 3)))], sc3: [sm(seg(lt, .5, 3)), 0, 1, 0],
    chars: [man(P, 0, z, 0), woman(idle({ head: .05 }), .2, 14.5, Math.PI)] }); });
// ===== NAKARAT =====
// "Ne derlerse desinler, ben onu bırakmam!": el ele yürürler, kenarlarda fısıldayan gölgeler
function chWalk(t, lt, d, v = 0) { const z = -2 + lt * 1.0, ph = lt * 4.6, Pm = walk(ph, .9), Pw = walk(ph + .2, .85); Pm.aR = [.25, .32, .1]; Pw.aL = [.25, .32, .1];
  const e1 = idle({ head: .1, headYaw: Math.atan2(-2.6, z - 2) * 0 + clamp((z - 3) * .35, -1, 1) * -1 }), e2 = idle({ lean: .08, head: .15 });
  e2.headYaw = clamp((z - 5) * .35, -1, 1);
  const cam = v ? { p: [-2.6, 2.6, z + 7], t: [0, 1.2, z], f: 1.7 } : { p: [.2, 1.45, z + 4.8], t: [0, 1.35, z], f: 1.75 };
  return A({ cam, lights: [lampL(.6, 4.6, z + 1.5, 26), lampL(-3, 3.8, 6, 8), herL(.7, 1.2, z + .5, 6)],
    chars: [man(Pm, -.28, z, 0), woman(Pw, .3, z, 0), enemy(e1, -2.7, 3.2, Math.PI / 2), enemy(e2, 2.75, 5.5, -Math.PI / 2)] }); }
// "Uğruna yansın bu şehir, geri adım atmam!": çatıda, aşağıda yanan şehir
function roofBase(o) { return Object.assign({ sc: [0, 0, 1, 2.5], sc2: [18, -40, .006, 0], sc3: [1, 0, 1, 0], sc4: [36, 0, 0, 0] }, DARK, o); }
function chFire(t, lt, d, v = 0) { const k = sm(seg(lt, 0, 2.5)), ang = (v ? -.5 : .35) + lt * .05 * (v ? 1 : -1);
  const cp = [Math.sin(ang) * 5.5, 1.5 + (v ? 1.2 : 0), Math.cos(ang) * -5.5 + .5];
  return roofBase({ cam: { p: [cp[0], cp[1] + 1.6, cp[2]], t: [0, -4, 30], f: 1.5 }, sc2: [18, -40, .006, .4 + .8 * k], sky0: [.01, .005, .006], sky1: [.12, .05, .03],
    lights: [{ p: [6, 8, 60], c: FIRE, i: 2200 * (.7 + .3 * k) * (.9 + .1 * Math.sin(t * 9)) }, herL(.2, 1.2, -1.2, 5), lampL(-4, 6, -6, 6)],
    chars: [man(idle({ head: .05 }), 0, 1.4, 0, { wind: [.2, -.4] }), woman(idle({ head: -.05 }), .35, .2, .2, { wind: [.2, -.3] })],
    over: (c, t) => embers(c, t, 70, .9 * k, 30), vig: .6 }); }
// "Rüzgâr da esse, dünya da yıkılsa": rüzgârda palto savrulur, enkaz düşer, adam onu korur
function chWind(t, lt, d, v = 0) { const w = 1.4 + .4 * Math.sin(t * 2), B = [];
  for (let i = 0; i < 9; i++) { const r = rng(i + 40), x = (r() - .5) * 6, z = 2 + r() * 10, t0 = r() * 3, ft = Math.max(0, lt - t0), y = Math.max(.25, 14 - 9.8 * ft * ft * .5); B.push({ p: [x, y, z], s: [.25 + r() * .3, .2 + r() * .2, .25 + r() * .3], r: ft * 3, m: 10 }); }
  const Pm = idle({ lean: .12, aL: [1.2, .7, .2], head: .15 }), Pw = idle({ lean: .1, head: .3, aR: [.8, -.2, 1.4], aL: [.9, .1, 1.5] });
  return A({ cam: v ? { p: [3.2, 1.2, 1], t: [0, 1.3, 4], f: 1.6 } : { p: [-.6, 1.5, -1.6], t: [0, 1.3, 4.5], f: 1.6 }, shake: .02 + .015 * KK,
    lights: [lampL(1.5, 4.4, 4.2, 26, flick(t * 1.7)), herL(.3, 1.1, 5.4, 5)], boxes: B,
    chars: [man(Pm, 0, 4.4, Math.PI, { wind: [w, 0] }), woman(Pw, .1, 5.0, Math.PI, { wind: [w, 0] })],
    over: (c, t) => { dust(c, t, 160, 1.2, .5); papers(c, t, 10, 1.3); }, vig: .65 }); }
// "Işığıma göz diken karşısında beni bulsun!": karanlıktan biri yaklaşır, adam araya girer
function chGuard(t, lt, d, v = 0) { const ez = lerp(9, 5.2, sm(seg(lt, 0, 2.2))), step = sm(seg(lt, 1.3, 2.4)), mx = lerp(1.6, 0, step), mz = lerp(2.4, 4.1, step);
  const Pe = walk(lt * 4, 1 - sm(seg(lt, 1.8, 2.4))); Pe.aR = [lerp(.3, 1.2, sm(seg(lt, .8, 1.8))), .1, .1];
  const Pm = step < 1 ? walk(lt * 6, (1 - step) * .9) : idle({ aL: [.1, .15, .3], aR: [.1, .15, .3], head: .08 });
  return A({ cam: v ? { p: [-2.4, .55, 1.0], t: [0, 1.6, 4.4], f: 1.7 } : { p: [2.2, .7, 1.6], t: [0, 1.5, 4.6], f: 1.7 }, shake: step > .9 && lt < 2.7 ? .03 : 0,
    lights: [lampL(-1.4, 4.5, 4.4, 28), herL(0, 1.2, 2.6, 7)],
    chars: [woman(idle({ head: .1 }), 0, 2.4, 0), man(Pm, mx, mz, step > .5 ? Math.PI * 0 : -.6), enemy(Pe, 0, ez, Math.PI)] }); }
const CH1 = [chWalk, chFire, chWind, chGuard];
[[14, 18.75, 23.5, 28.25, 33, 0], [72, 76.75, 81.5, 86.25, 91, 1], [134, 139.75, 145.5, 151.25, 157, 1]].forEach(([a, b, c, dd, e, v], k) => { const T4 = [a, b, c, dd, e]; CH1.forEach((fn, i) => S(T4[i], T4[i + 1], (t, lt, d) => { const r = fn(t, lt, d, (i + v + k) % 2); if (k === 2) { r.shake = (r.shake || 0) + .012 * KK; } return r; })); });
// ===== KITA 1 =====
S(33, 36.1, (t, lt) => { const z = lt * 1.2; return A({ cam: { p: [2.4, 1.3, z + .6], t: [-1, 1.3, z + 1.2], f: 1.5 }, lights: [lampL(-1, 4.3, 2, 24), lampL(-1, 4.3, 7, 20)], chars: [man(walk(lt * 4.8, 1), -.6, z, 0)],
  over: (c, t) => dust(c, t, 40, .05, .25) }); });
S(36.1, 39.2, (t, lt) => { const bow = sm(seg(lt, .2, 1.4)); const E = i => enemy(idle({ lean: .35 * bow, head: .45 * bow }), [-1.6, 1.7, -.4][i], [3.2, 3.4, 4.6][i], [2.2, -2.3, Math.PI][i]);
  return A({ cam: { p: [.3, .35, -.6], t: [0, 2.4, 3.3], f: 1.45 }, lights: [lampL(.4, 5.2, 3.6, 30)], chars: [man(idle({ head: -.08 }), 0, 3.2, Math.PI), E(0), E(1), E(2)] }); });
S(39.2, 42.3, (t, lt) => { const k = sm(seg(lt, 0, .5)); const P = mixPose(idle(), pose({ lean: .55, head: .3, lL: [1.45, 1.45], lR: [-.05, 1.6], aR: [.12, .05, .1], aL: [.5, .1, 1.1] }), k);
  return A({ cam: { p: [1.8, .6, 1.4], t: [0, .6, 3.4], f: 1.6 }, lights: [lampL(-.6, 4.3, 3.3, 26)], chars: [man(P, 0, 3.2, -1.3)], shake: lt < .6 ? .02 : 0, over: (c, t) => dust(c, t, 30, .03, .3) }); });
S(42.3, 45.4, (t, lt) => { const P = idle({ head: .1 }); return A({ cam: { p: [1.15, 1.62, 3.3], t: [0, 1.58, 3.3], f: 2.0 + lt * .06 }, sc2: [18, 0, .03, 0],
  lights: [lampL(-.3, 2.6, 6.5, 26), { p: [-1.2, 1.4, 2.2], c: COOL, i: .6 }], chars: [man(P, 0, 3.3, 0)], vig: .8 }); });
S(45.4, 48.5, (t, lt) => { const B = []; for (let i = 0; i < 20; i++) { const cx = (i % 5) - 2, cy = (i / 5) | 0, r = rng(i + 70), t0 = .4 + r() * .8, ft = Math.max(0, lt - t0); const y = .3 + cy * .58 - 4.9 * ft * ft, z = 4 + ft * (1.5 + r()) + (cy > 1 ? ft * 1.2 : 0);
    if (y > -1) B.push({ p: [cx * .74 + (cy % 2) * .2, Math.max(.29, y), z], s: [.36, .28, .18], r: ft * (r() - .5) * 4, m: 10 }); }
  const k = sm(seg(lt, .5, 2.2)); return A({ cam: { p: [.4, 1.5, -.2], t: [0, 1.3, 6], f: 1.6 }, boxes: B, lights: [herL(0, 1.3, 7.5, 6 + 30 * k), lampL(1.5, 4.3, .5, 10)], sc3: [1, 0, 1, 0],
    chars: [man(idle({ head: .05 }), -.2, 1.2, 0), woman(idle({ head: -.05 }), .1, 8, Math.PI)], shake: lt > .5 && lt < 1.6 ? .015 : 0 }); });
S(48.5, 51.6, (t, lt) => { const B = [{ p: [0, 1.5, 4.2], s: [3, 1.5, .1], m: 9 }]; for (let i = 0; i < 3; i++) B.push({ p: [0, .7 + i * .55, 4.0], s: [1.4, .025, .16], m: 9 });
  const r = rng(3); for (let i = 0; i < 15; i++) { const sh = i / 5 | 0, x = -1.2 + (i % 5) * .32 + (sh === 1 && i % 5 > 2 ? .25 : 0); if (sh === 1 && i % 5 === 2) continue; B.push({ p: [x, .72 + sh * .55 + .2, 3.98], s: [.05 + r() * .04, .17 + r() * .03, .12], m: 11 }); }
  const k = eo(seg(lt, .3, 1.6)); B.push({ p: [lerp(1.6, -.56, k), .72 + .55 + .21, lerp(3.4, 3.98, k)], s: [.07, .2, .13], m: 9 });
  return A({ sc: [1, 0, 0, 0], sc2: [18, 0, .02, 0], cam: { p: [.5, 1.45, 1.6], t: [-.3, 1.2, 4], f: 1.7 }, boxes: B, lights: [{ p: [1.2, 2.4, 2.8], c: [1, .9, .75], i: 7 }, lampL(-2, 3, 1, 3)],
    chars: [man(idle({ aR: [1.1, -.1, .5], head: .15 }), 1.15, 3.2, -1.2)] }); });
S(51.6, 54.7, (t, lt) => { const P = idle({ head: .22, aL: [1.3, -.25, 1.5] }); return A({ cam: { p: [1.5, 1.5, 4.4 - lt * .12], t: [0, 1.35, 3.3], f: 1.9 }, sc2: [18, 0, .025, 0], sc3: [1.1, 0, 1, 0],
  lights: [herL(.4, 1.5, 3.8, 3), lampL(-.6, 3.6, 2.6, 6)], chars: [woman(P, 0, 3.3, .3)],
  over: (c, t, lt) => { const k = seg(lt, .8, 2.6); if (k > 0 && k < 1) sparkle(c, 655 + k * 4, 300 + k * 150, 20, Math.sin(k * Math.PI)); }, vig: .75 }); });
S(54.7, 57.8, (t, lt) => { const fl = sm(seg(lt, .4, .8)), k = sm(seg(lt, 1, 3)); const P = idle({ aR: [1.6, -.2, .9], head: -.05 });
  const man1 = man(P, 0, 1.4, 0); const hnd = man1.J[9];
  return roofBase({ cam: { p: [-1.8, 2.6, -1.6], t: [0, -2, 30], f: 1.45 }, sc2: [18, -40, .006, k * 1.1], sky1: [.05 + .08 * k, .03 + .02 * k, .03], lights: [{ p: [hnd[0], hnd[1] + .15, hnd[2] + .05], c: GOLD, i: 1.2 * fl * (.8 + .2 * Math.sin(t * 30)) }, { p: [6, 8, 60], c: FIRE, i: 2400 * k }],
    chars: [man1], over: (c, t) => embers(c, t, 50 * k, k) }); });
S(57.8, 60.9, (t, lt) => { const B = [{ p: [-1.8, 2, 5], s: [1.4, 2, .15], m: 10 }, { p: [1.8, 2, 5], s: [1.4, 2, .15], m: 10 }, { p: [0, .8, 5], s: [.5, .8, .15], m: 10 }, { p: [0, 3.4, 5], s: [.5, .6, .15], m: 10 }, { p: [0, .25, 3.2], s: [.25, .25, .25], m: 9 }];
  return A({ sc: [1, 0, 0, 0], sc2: [18, 0, .05, 0], cam: { p: [1.5, 1.2, .2], t: [0, 1, 3.6], f: 1.55 }, boxes: B, lights: [{ p: [0, 2.2, 8], c: [.8, .85, 1], i: 30 }],
    chars: [man(pose({ lean: .5, head: .3, lL: [1.5, 1.5], lR: [1.45, 1.5], aL: [.9, .1, .7], aR: [.9, .1, .7] }), 0, 3.3, Math.PI)], amb: [.006, .006, .008] }); });
S(60.9, 64, (t, lt) => { const B = [{ p: [-1.8, 2, 5], s: [1.4, 2, .15], m: 10 }, { p: [1.8, 2, 5], s: [1.4, 2, .15], m: 10 }, { p: [0, .8, 5], s: [.5, .8, .15], m: 10 }, { p: [0, 3.4, 5], s: [.5, .6, .15], m: 10 }, { p: [0, .25, 3.2], s: [.25, .25, .25], m: 9 }];
  const L = [{ p: [0, 2.2, 8], c: [.8, .85, 1], i: 30 }]; for (let i = 0; i < 3; i++) { const k = eo(seg(lt, .2 + i * .35, 1.8 + i * .35)); L.push({ p: [lerp(0, -1 + i, k), lerp(2.2, 1.6 + Math.sin(t * 2 + i) * .1, k), lerp(5.8, 3.6 - i * .2, k)], c: GOLD, i: 4 + 3 * k }); }
  const up = sm(seg(lt, 1.2, 2.8));
  return A({ sc: [1, 0, 0, 0], sc2: [18, 0, .05, 0], cam: { p: [1.5, 1.2, .2], t: [0, 1.1, 3.6], f: 1.55 }, boxes: B, lights: L, amb: lerp3([.006, .006, .008], [.05, .035, .02], up),
    chars: [man(mixPose(pose({ lean: .5, head: .3, lL: [1.5, 1.5], lR: [1.45, 1.5], aL: [.9, .1, .7], aR: [.9, .1, .7] }), pose({ lean: .05, head: -.25, lL: [1.5, 1.5], lR: [1.45, 1.5], aL: [.3, .1, .5], aR: [.3, .1, .5] }), up), 0, 3.3, Math.PI)] }); });
// ara (64-72): şehrin üstünde süzülen kamera
S(64, 72, (t, lt) => { const a = .3 + lt * .03; return Object.assign({ sc: [1, 0, 1, 0], sc2: [18, 0, .008, 0], sc3: [1, 0, 1, 0], sc4: [0, 0, 0, 0], cam: { p: [Math.sin(a) * 60, 55 - lt * 1.5, Math.cos(a) * 60], t: [0, 10, 0], f: 1.5 }, lights: [{ p: [0, 30, 0], c: COOL, i: 400 }] }, DARK, { sky1: [.04, .04, .05] }); }, { x: .6 });
// ara (91-96): lamba altında bekleyen adam
S(91, 96, (t, lt) => A({ cam: { p: [.4, 1.5, 4.5 - lt * .25], t: [0, 1.5, 0], f: 1.8 }, lights: [lampL(.2, 4.2, .4, 24, flick(t * 1.3))], chars: [man(idle({ head: .1 }), 0, 0, 0)], vig: .7 }), { x: .5 });
// ===== KITA 2 =====
S(96, 99.4, (t, lt) => { const k = sm(seg(lt, 1.2, 1.9)); const E = (i, x, z, yaw) => enemy(idle({ lean: .25 * (1 - k), head: .3 * (1 - k), headYaw: k * (i - 1) * .7 }), x, z, yaw);
  return A({ cam: { p: [0, 1.6, -.5], t: [0, 1.4, 4], f: 1.6 }, lights: [lampL(0, 4.2, 4.6, 26)], chars: [E(0, -.45, 4.4, .6), E(1, .45, 4.5, -.6), E(2, 0, 5.1, Math.PI), man(walk(lt * 4.6, 1 - sm(seg(lt, 1.6, 2.2))), .9, lerp(.4, 2.6, sm(seg(lt, 0, 2.2))), 0)] }); });
S(99.4, 102.8, (t, lt) => A({ cam: { p: [1.4, 1.62, 3.0], t: [0, 1.6, 3.0], f: 1.9 }, sc2: [18, 0, .02, 0], lights: [lampL(0, 3.6, 3.0, 14)], chars: [man(idle({ head: .02 }), 0, 2.6, 0), enemy(idle({ head: .1, lean: -.05 }), 0, 3.45, Math.PI)], vig: .7 }));
function tableScene(t, lt, slam) { const sw = slam ? Math.sin(Math.max(0, lt - .6) * 4) * Math.exp(-Math.max(0, lt - .6) * .8) * .7 : 0;
  const B = [{ p: [0, .74, 3.5], s: [.9, .03, .5], m: 9 }, { p: [-.75, .37, 3.1], s: [.04, .37, .04], m: 9 }, { p: [.75, .37, 3.1], s: [.04, .37, .04], m: 9 }, { p: [-.75, .37, 3.9], s: [.04, .37, .04], m: 9 }, { p: [.75, .37, 3.9], s: [.04, .37, .04], m: 9 }, { p: [.1, .78, 3.4], s: [.09, .006, .12], r: .3, m: 16 }];
  const fist = slam ? (lt < .6 ? lerp(1.9, 2.1, lt / .6) : lt < .75 ? lerp(2.1, .5, (lt - .6) / .15) : .5) : 0;
  const Pm = slam ? idle({ lean: lt > .6 ? .3 : .1, aR: [fist, .05, slam ? .2 : .1], head: .15 }) : idle({ head: .1 });
  const shk = n => idle({ head: .2, headYaw: slam ? 0 : Math.sin(t * 7 + n) * .35 * (lt > .4 ? 1 : 0), lean: slam && lt > .7 ? -.12 : 0 });
  return A({ sc: [1, 0, 0, 0], sc2: [18, 0, .007, 0], cam: slam ? { p: [1.6, 1.4, 1.5], t: [0, 1, 3.5], f: 1.6 } : { p: [-1.6, 1.7, 1.4], t: [0, .9, 3.6], f: 1.6 }, boxes: B, shake: slam && lt > .74 && lt < 1.2 ? .04 : 0, flash: slam && lt > .74 && lt < .9 ? .35 : 0,
    lights: [{ p: [sw, 2.1, 3.5], c: [1, .92, .8], i: 6 }, { p: [.1, .9, 3.4], c: GOLD, i: .6 }], chars: [man(Pm, 0, 2.7, 0), enemy(shk(0), -1.1, 3.6, Math.PI / 2), enemy(shk(2), 1.1, 3.6, -Math.PI / 2), enemy(shk(4), 0, 4.4, Math.PI)] }); }
S(102.8, 106.2, (t, lt) => tableScene(t, lt, 0));
S(106.2, 109.6, (t, lt) => tableScene(t, lt, 1));
S(109.6, 113, (t, lt) => { const B = [], k = sm(seg(lt, 1.3, 2.8));
  const house = []; for (let i = 0; i < 4; i++) house.push([-.6 + (i % 2) * 1.2, .3 + (i / 2 | 0) * .6, 4.2]); for (let i = 0; i < 4; i++) house.push([-.6 + (i % 2) * 1.2, .3 + (i / 2 | 0) * .6, 5.4]); house.push([0, 1.45, 4.8]); house.push([0, .3, 3.9]);
  for (let i = 0; i < 10; i++) { const r = rng(i + 90), t0 = r() * .9, ft = Math.max(0, lt - t0); const fall = [(r() - .5) * 2.4, Math.max(.3, 8 - 4.9 * ft * ft), 3.8 + r() * 2]; const H0 = house[i]; const p = lerp3(fall, H0, k); B.push({ p, s: i === 8 ? [.95, .12, .9] : [.6, .3, .3], r: (1 - k) * r() * 3, m: 10 }); }
  B.push({ p: [0, .55, 4.25], s: [.25, .2, .05], m: 16 });
  return A({ cam: { p: [2.8, 2.2, 1.2], t: [0, .7, 4.6], f: 1.6 }, boxes: B, lights: [lampL(-1.5, 4.3, 3, 22), herL(0, .6, 4.8, 6 * k)], chars: [man(idle({ head: .2 }), 1.6, 3.2, -.9)], shake: lt < 1.2 ? .015 : 0 }); });
S(113, 116.4, (t, lt) => A({ cam: { p: [.3, 1.5, 3.6 - lt * .3], t: [0, 1.5, 0], f: 1.9 }, lights: [lampL(-.6, 4.0, .6, 22)], chars: [man(idle({ aR: [1.0, -.55, 1.5], head: .12 }), 0, 0, 0)], vig: .7 }));
S(116.4, 119.8, (t, lt) => { const z = lt * 1.0, fl = Math.max(0, Math.sin(t * 23) > .9 ? 1 : 0) * (Math.sin(t * 5.7) > 0 ? 1 : 0);
  return A({ cam: { p: [.3, 1.5, z + 4.5], t: [0, 1.4, z], f: 1.7 }, lights: [lampL(.5, 4.2, z + 1, 18), { p: [(Math.sin(t * 17) * 2), 1.6, z + 3], c: [1, 1, 1], i: 40 * fl }], chars: [man(walk(lt * 4.6, 1), 0, z, 0)],
    over: (c, t) => papers(c, t, 22, .5, 1), flash: fl * .15 }); });
S(119.8, 123, (t, lt) => { const a = lt * .25; return Object.assign({ sc: [1, 0, 0, 0], sc2: [18, 0, .01, 0], sc3: [1.3, 0, 1, 0], cam: { p: [Math.sin(a) * 4, 1.5, Math.cos(a) * -4 + 1], t: [0, 1.2, 1], f: 1.7 },
  lights: [herL(.4, 1.2, 1.5, 6), { p: [-3, 4, -2], c: COOL, i: 4 }], chars: [man(idle({ aR: [.25, .3, .1] }), -.28, 1, 0), woman(idle({ aL: [.25, .3, .1], head: -.1 }), .3, 1, 0)] }, DARK, { amb: [.004, .004, .006], fog: [0, 0, 0] }); });
// ===== KÖPRÜ (123-134) =====
S(123, 125.7, (t, lt) => { const off = sm(seg(lt, .2, 2.4)); return Object.assign({ sc: [1, 0, 1, 0], sc2: [18, 0, .008, 0], sc3: [1, 0, 1, off], sc4: [0, 0, 0, 0], cam: { p: [40, 30 - lt, 40], t: [0, 8, 0], f: 1.5 }, lights: [{ p: [0, 30, 0], c: COOL, i: 300 * (1 - off) }] }, DARK); }, { x: .5 });
S(125.7, 128.4, (t, lt) => Object.assign({ sc: [1, 0, 0, 0], sc2: [18, 0, .02, 0], sc3: [1.4, 0, 1, 0], cam: { p: [0, 1.2, -6 + lt * .3], t: [0, 1, 2], f: 1.7 }, lights: [herL(0, 1.2, 1.4, 6)], chars: [woman(idle({ head: .05 }), 0, 2, Math.PI)] }, DARK, { amb: [0, 0, 0], fog: [0, 0, 0] }));
S(128.4, 131.1, (t, lt) => { const Pe = walk(lt * 2.4, .5); Pe.aR = [1.4, .1, .05]; Pe.lean = .1;
  return Object.assign({ sc: [1, 0, 0, 0], sc2: [18, 0, .02, 0], sc3: [1.4, 0, 1, 0], cam: { p: [3.2, 1.3, 1.3], t: [0, 1.2, 1.8], f: 1.7 }, lights: [herL(0, 1.2, 1.4, 6)], chars: [woman(idle({ head: .1 }), 0, 2, Math.PI), enemy(Pe, 0, lerp(-1.6, .6, lt / 2.7), 0)] }, DARK, { amb: [0, 0, 0], fog: [0, 0, 0] }); });
S(131.1, 134, (t, lt) => { const on = lt > 2.2, k = sm(seg(lt, 2.2, 2.6)); const Pe = on ? idle({ lean: -.25, aR: [.6, .1, .2], head: -.15 }) : walk(lt * 2.4, .5); if (!on) { Pe.aR = [1.4, .1, .05]; }
  const C = [woman(idle({ head: .1 }), 0, 2, Math.PI), enemy(Pe, 0, on ? lerp(.6, -.4, k) : lerp(.6, 1.0, lt / 2.2), 0)]; if (on) C.push(man(idle({ aL: [.15, .2, .3], aR: [.15, .2, .3] }), 0, 1.15, Math.PI));
  return Object.assign({ sc: [1, 0, 0, 0], sc2: [18, 0, .02, 0], sc3: [1.4, 0, 1, 0], cam: on ? { p: [2.2, .8, .3], t: [0, 1.4, 1.2], f: 1.6 } : { p: [3.2, 1.3, 1.3], t: [0, 1.2, 1.8], f: 1.7 }, lights: [herL(0, 1.2, 1.4, 6), { p: [-1, 3.5, 0], c: COOL, i: on ? 16 : 0 }], chars: C, flash: on ? (1 - k) * .9 : 0, shake: on && lt < 2.9 ? .05 : 0 }, DARK, { amb: [0, 0, 0], fog: [0, 0, 0] }); });
// ===== 157-161 geçiş, 161-180 tekrar (yüksek enerji) =====
S(157, 161, (t, lt) => { const r = chFire(t, lt + 2, 4, 1); r.cam = { p: [0, 2.2 + lt * .4, -4 - lt * 1.5], t: [0, 1.6, 2], f: 1.6 }; return r; }, { x: .2 });
[[161, 165.75, chWalk, 1], [165.75, 170.5, chWind, 0], [170.5, 175.25, chFire, 0], [175.25, 180, chGuard, 1]].forEach(([a, b, fn, v]) => S(a, b, (t, lt, d) => { const r = fn(t, lt, d, v); r.shake = (r.shake || 0) + .012 * KK; return r; }));
// ===== KAPANIŞ (180-190): "Adını söylemem... Dokunamazsın." =====
S(180, 185.5, (t, lt) => { const wz = 2 + lt * 1.1, turn = sm(seg(lt, 2.6, 3.6));
  return A({ cam: { p: [.5, 1.55, -2.5], t: [0, 1.4, 5], f: 1.7 }, lights: [herL(0, 1.3, 13, 30), herL(.2, 1.2, wz + .4, 5), lampL(-1.2, 4.3, .2, 12)], chars: [man(idle({ headYaw: Math.PI * .8 * turn, head: .05 }), -.1, .6, 0), woman(walk(lt * 4.4, .9), .2, wz, 0)], vig: .7 }); }, { xo: .5 });
S(185.5, 191, (t, lt) => ({ nobadge: true, over: (c, t, lt) => endCard(c, t, lt) }), { x: 0 });
function endCard(c, t, lt) {
  c.fillStyle = '#030303'; c.fillRect(0, 0, W, H);
  const g = c.createRadialGradient(640, 360, 0, 640, 360, 520); g.addColorStop(0, `rgba(255,180,90,${.22 * sm(seg(lt, .2, 1.6))})`); g.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = g; c.fillRect(0, 0, W, H);
  const p = eo(seg(lt, .3, 1.6)); c.save(); c.textAlign = 'center';
  c.font = `700 ${Math.round(118 + 10 * (1 - p))}px ${FONT}`; c.letterSpacing = `${Math.round(14 * (1 - p) + 4)}px`; c.fillStyle = `rgba(255,214,150,${p})`; c.shadowColor = 'rgba(255,170,70,.7)'; c.shadowBlur = 30 * p; c.fillText('murat250sr', 640, 380);
  c.shadowBlur = 0; c.fillStyle = `rgba(240,232,220,${p * .9})`; c.fillRect(640 - 300 * p, 412, 600 * p, 2);
  const q = sm(seg(lt, 1.4, 2.4)); c.font = `500 26px ${SANS}`; c.letterSpacing = '12px'; c.fillStyle = `rgba(240,232,220,${q})`; c.fillText('IŞIĞIMA GÖZ DİKEN', 640, 462); c.restore();
  embers(c, t, 40, p * .7, 10);
}
