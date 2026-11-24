'use strict';
// ===== 3B iskelet: poz -> 16 eklem (metre). 0 pelvis 1 göğüs 2 boyun 3 baş 4-6 sol kol 7-9 sağ kol 10-12 sol bacak 13-15 sağ bacak =====
const V3 = (x, y, z) => [x, y, z], add3 = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]], sc3 = (a, k) => [a[0] * k, a[1] * k, a[2] * k];
function rotX(v, a) { const c = Math.cos(a), s = Math.sin(a); return [v[0], v[1] * c - v[2] * s, v[1] * s + v[2] * c]; } // +a: aşağı vektörü öne (+z) çevirir
function rotZ(v, a) { const c = Math.cos(a), s = Math.sin(a); return [v[0] * c - v[1] * s, v[0] * s + v[1] * c, v[2]]; }
function rotY(v, a) { const c = Math.cos(a), s = Math.sin(a); return [v[0] * c + v[2] * s, v[1], -v[0] * s + v[2] * c]; }
const POSE0 = { lean: 0, twist: 0, head: 0, headYaw: 0, aL: [.08, .12, .15], aR: [.08, .12, .15], lL: [0, 0], lR: [0, 0], bob: 0, side: 0 };
function pose(o) { return Object.assign({}, POSE0, o); }
function walk(ph, amt = 1) { const s = Math.sin(ph);
  return pose({ lean: .06 * amt, bob: Math.abs(Math.cos(ph)) * .03 * amt, aL: [-.45 * s * amt, .1, .25 + .2 * Math.max(0, s) * amt], aR: [.45 * s * amt, .1, .25 + .2 * Math.max(0, -s) * amt],
    lL: [.42 * s * amt, .7 * Math.max(0, Math.cos(ph)) * amt], lR: [-.42 * s * amt, .7 * Math.max(0, -Math.cos(ph)) * amt] }); }
function mixPose(a, b, k) { const o = {}; for (const key in a) { const va = a[key], vb = b[key] === undefined ? va : b[key]; o[key] = Array.isArray(va) ? va.map((v, i) => lerp(v, vb[i], k)) : lerp(va, vb, k); } return o; }
// kol: [öne kaldırma, yana açma, dirsek bükümü]; bacak: [kalça öne, diz bükümü]
function skeleton(P, x, z, yaw, h = 1.8, fem = 0) {
  const k = h / 1.8, J = [];
  const pel = [0, .95 + P.bob, 0];
  const up = rotX([0, 1, 0], P.lean);
  const chest = add3(pel, sc3(up, .42)), neck = add3(chest, sc3(up, .1)), head = add3(neck, add3(sc3(rotX([0, 1, 0], P.lean + P.head), .13), [0, 0, 0]));
  const sw = fem ? .17 : .2;
  const right = rotY([1, 0, 0], P.twist);
  const arm = (side, A) => { const sh = add3(chest, add3(sc3(right, side * sw), sc3(up, -.02)));
    let d = rotZ(rotX([0, -1, 0], A[0] + P.lean * .5), side * A[1]); d = rotY(d, P.twist); const el = add3(sh, sc3(d, .3));
    let d2 = rotZ(rotX([0, -1, 0], A[0] + A[2] + P.lean * .5), side * A[1] * .6); d2 = rotY(d2, P.twist); const ha = add3(el, sc3(d2, .27)); return [sh, el, ha]; };
  const leg = (side, Lg) => { const hp = add3(pel, [side * (fem ? .085 : .1), -.04, 0]); const d = rotX([0, -1, 0], Lg[0]); const kn = add3(hp, sc3(d, .45)); const d2 = rotX([0, -1, 0], Lg[0] - Lg[1]); const ft = add3(kn, sc3(d2, .44)); return [hp, kn, ft]; };
  J.push(pel, chest, neck, head, ...arm(-1, P.aL), ...arm(1, P.aR), ...leg(-1, P.lL), ...leg(1, P.lR));
  // ayakları yere oturt
  const mn = Math.min(J[12][1], J[15][1]) - .07; const out = [];
  for (const j of J) { let q = [j[0], j[1] - mn, j[2]]; q = sc3(q, k); q = rotY(q, yaw); out.push([q[0] + x, q[1], q[2] + z]); }
  return out;
}
