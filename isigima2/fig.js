'use strict';
// ====== GRAVÜR FİGÜRLERİ ======
// Yan görünüş (profil) ve ön/arka görünüş. Her parça ışık yönüne göre degrade tonla, tarama açısı forma göre (kesitsel) çizilir.
const V2 = (x, y) => [x, y];
const add = (a, b) => [a[0] + b[0], a[1] + b[1]];
const scl = (a, k) => [a[0] * k, a[1] * k];
const rot = (p, a) => [p[0] * Math.cos(a) - p[1] * Math.sin(a), p[0] * Math.sin(a) + p[1] * Math.cos(a)];
const dirA = (a, L) => [Math.sin(a) * L, Math.cos(a) * L]; // açı dikeyden (+ = ileri, x+)

// ---- pozlar ----
function sidePose(o = {}) { return Object.assign({ lean: 0, nod: 0, th: [0, 0], kn: [.05, .05], sa: [.05, .05], ea: [.15, .15], bob: 0 }, o); }
function walkS(ph, amt = 1, o = {}) {
  const L = k => { const p = ph + k * Math.PI; return [.42 * Math.sin(p) * amt, (.06 + .62 * Math.pow(Math.max(0, Math.cos(p)), 1.4)) * amt + .04]; };
  const f = L(0), n = L(1);
  return sidePose(Object.assign({ lean: .05 * amt, th: [f[0], n[0]], kn: [f[1], n[1]], sa: [-.38 * Math.sin(ph + Math.PI) * amt, -.38 * Math.sin(ph) * amt], ea: [.2 + .2 * amt, .2 + .2 * amt] }, o));
}
function mixP(a, b, k) { const o = {}; for (const key in a) { const va = a[key], vb = b[key] === undefined ? va : b[key]; o[key] = Array.isArray(va) ? va.map((v, i) => lerp(v, vb[i], k)) : (typeof va === 'number' ? lerp(va, vb, k) : (k < .5 ? va : vb)); } return o; }
function frontPose(o = {}) { return Object.assign({ tilt: 0, nod: 0, turn: 0, st: .12, ab: [.12, .12], el: [.1, .1], fw: [0, 0], kneel: 0, sway: 0 }, o); }

// ---- parça çizim yardımcıları ----
let FL = [-.6, -.8]; // yerel ışık yönü (birim, ışığa doğru)
let TN = { b: .2, k: .35, gold: 0 }; // temel ton, ışık katkısı
let OL = 1, XC = 1, NOOL = 1;
function sides(a, b, wa, wb) { if (OL <= 0) return; const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L; C.save(); C.globalAlpha = .55; C.strokeStyle = ink(0, 0, TN.gold * .6); C.lineWidth = OL * .8; C.lineCap = 'round';
  C.beginPath(); C.moveTo(a[0] + nx * wa, a[1] + ny * wa); C.lineTo(b[0] + nx * wb, b[1] + ny * wb); C.moveTo(a[0] - nx * wa, a[1] - ny * wa); C.lineTo(b[0] - nx * wb, b[1] - ny * wb); C.stroke(); C.restore(); } // kontur kalınlığı, kesitsel tarama
function outl(w = 1) { if (OL > 0 && !NOOL) { C.strokeStyle = ink(0, 0, TN.gold * .6); C.lineWidth = OL * w; C.lineJoin = 'round'; C.stroke(); } }
function shadeFill(cx, cy, r, ang, bias = 0, b = TN.b, k = TN.k) {
  const x0 = cx + FL[0] * r, y0 = cy + FL[1] * r, x1 = cx - FL[0] * r, y1 = cy - FL[1] * r;
  return lg(x0, y0, x1, y1, [[0, b + k], [.42 + bias, b + k * .45], [1, b * .7]], ang, TN.gold);
}
function capsule(a, b, wa, wb, base, lit, bias = 0) {
  const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L, ang = Math.atan2(dy, dx) + (XC ? Math.PI / 2 : 0);
  C.beginPath(); C.moveTo(a[0] + nx * wa, a[1] + ny * wa); C.lineTo(b[0] + nx * wb, b[1] + ny * wb);
  C.arc(b[0], b[1], wb, Math.atan2(ny, nx), Math.atan2(ny, nx) + Math.PI, false);
  C.lineTo(a[0] - nx * wa, a[1] - ny * wa); C.arc(a[0], a[1], wa, Math.atan2(-ny, -nx), Math.atan2(-ny, -nx) + Math.PI, false); C.closePath();
  C.fillStyle = shadeFill((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, Math.max(wa, wb) * 1.1, ang, bias, base, lit); C.fill(); if (SIDES) sides(a, b, wa, wb);
}
let SIDES = 0;
// tek parça uzuv: a-b-c üç nokta, genişlikler wa, wb, wc; tek degrade (eklem yerinde kesik yok)
function limb3(a, b, c, wa, wb, wc, base, lit) {
  const nrm = (p, q) => { const dx = q[0] - p[0], dy = q[1] - p[1], L = Math.hypot(dx, dy) || 1; return [-dy / L, dx / L]; };
  const n1 = nrm(a, b), n2 = nrm(b, c), nb = (() => { const x = n1[0] + n2[0], y = n1[1] + n2[1], L = Math.hypot(x, y) || 1; return [x / L, y / L]; })();
  const L = [[a[0] + n1[0] * wa, a[1] + n1[1] * wa], [b[0] + nb[0] * wb, b[1] + nb[1] * wb], [c[0] + n2[0] * wc, c[1] + n2[1] * wc]];
  const R = [[c[0] - n2[0] * wc, c[1] - n2[1] * wc], [b[0] - nb[0] * wb, b[1] - nb[1] * wb], [a[0] - n1[0] * wa, a[1] - n1[1] * wa]];
  C.beginPath(); C.moveTo(L[0][0], L[0][1]); C.quadraticCurveTo(L[1][0], L[1][1], L[2][0], L[2][1]);
  C.arc(c[0], c[1], wc, Math.atan2(n2[1], n2[0]), Math.atan2(n2[1], n2[0]) + Math.PI, false);
  C.quadraticCurveTo(R[1][0], R[1][1], R[2][0], R[2][1]); C.arc(a[0], a[1], wa, Math.atan2(-n1[1], -n1[0]), Math.atan2(-n1[1], -n1[0]) + Math.PI, false); C.closePath();
  const ang = Math.atan2(c[1] - a[1], c[0] - a[0]) + (XC ? Math.PI / 2 : 0), m = [(a[0] + c[0]) / 2, (a[1] + c[1]) / 2];
  C.fillStyle = shadeFill(m[0], m[1], Math.max(wa, wb) * 1.2, ang, 0, base, lit); C.fill();
  if (SIDES && OL > 0) { C.save(); C.globalAlpha = .5; C.strokeStyle = ink(0, 0, TN.gold * .6); C.lineWidth = OL * .8; C.beginPath(); C.moveTo(L[0][0], L[0][1]); C.quadraticCurveTo(L[1][0], L[1][1], L[2][0], L[2][1]); C.moveTo(R[2][0], R[2][1]); C.quadraticCurveTo(R[1][0], R[1][1], R[0][0], R[0][1]); C.stroke(); C.restore(); }
}
function smoothPath(pts, close = true) { // Catmull-Rom benzeri yumuşak kapalı yol
  const n = pts.length; C.beginPath();
  if (!close) C.moveTo(pts[0][0], pts[0][1]); else C.moveTo((pts[0][0] + pts[1][0]) / 2, (pts[0][1] + pts[1][1]) / 2);
  for (let i = close ? 1 : 1; i < (close ? n + 1 : n - 1); i++) { const p = pts[i % n], q = pts[(i + 1) % n]; C.quadraticCurveTo(p[0], p[1], (p[0] + q[0]) / 2, (p[1] + q[1]) / 2); }
  if (!close) C.lineTo(pts[n - 1][0], pts[n - 1][1]); else C.closePath();
}
function fold(pts, v, ang, w) { C.save(); C.globalAlpha = .9; smoothPath(pts, false); C.strokeStyle = ink(v, ang, TN.gold); C.lineWidth = w; C.lineCap = 'round'; C.stroke(); C.restore(); }
function hand(p, ang, u, base, lit, fist = 0) { // ang: kolun yönü (dikeyden)
  const d = dirA(ang, 1), c = add(p, scl(d, .28 * u));
  C.save(); C.translate(c[0], c[1]); C.rotate(-ang);
  C.beginPath(); C.ellipse(0, 0, (.13 + fist * .03) * u, (.27 - fist * .07) * u, 0, 0, TAU);
  C.fillStyle = shadeFill(0, 0, .2 * u, ang + Math.PI / 2, 0, base, lit); C.fill(); outl(.8);
  if (!fist) { C.beginPath(); C.ellipse(.11 * u, -.05 * u, .05 * u, .12 * u, -.4, 0, TAU); C.fill(); } // başparmak
  else { for (let i = 0; i < 3; i++) { C.beginPath(); C.moveTo(-.12 * u, (-.06 + i * .07) * u); C.lineTo(.12 * u, (-.06 + i * .07) * u); C.strokeStyle = ink(base * .5, 0, TN.gold); C.lineWidth = .02 * u; C.stroke(); } }
  C.restore();
}

// ---- kafa (profil) ----
function headSide(c, a, u, o) {
  C.save(); C.translate(c[0], c[1]); C.rotate(a); const s = u;
  const pr = [[-.05, -.56], [.2, -.5], [.33, -.32], [.37, -.15], [.36, -.08], [.43, .03], [.5, .12], [.44, .15], [.38, .16], [.4, .22], [.36, .25], [.39, .3], [.34, .38], [.3, .45], [.18, .5], [.02, .44], [-.12, .32], [-.3, .28], [-.42, .1], [-.46, -.1], [-.38, -.38], [-.22, -.52]].map(p => [p[0] * s, p[1] * s]);
  const skin = o.skin, sb = skin[0], sk = skin[1];
  // boyun
  C.beginPath(); C.moveTo(-.2 * s, .2 * s); C.lineTo(.18 * s, .35 * s); C.lineTo(.16 * s, .78 * s); C.lineTo(-.26 * s, .78 * s); C.closePath(); C.fillStyle = shadeFill(0, .5 * s, .3 * s, 0, 0, sb * .7, sk * .6); C.fill();
  smoothPath(pr); C.fillStyle = shadeFill(0, 0, .5 * s, -.3, .05, sb, sk); C.fill(); outl(.9);
  // yüz düzlemi gölgesi: ışık arkadansa yüz koyu kalır
  // kulak, göz, kaş, ağız
  C.beginPath(); C.ellipse(-.1 * s, .02 * s, .07 * s, .12 * s, .1, 0, TAU); C.fillStyle = ink(sb * .8, 1.2, TN.gold); C.fill();
  C.beginPath(); C.ellipse(-.1 * s, .02 * s, .035 * s, .075 * s, .1, 0, TAU); C.fillStyle = ink(sb * .45, 1.2, TN.gold); C.fill();
  C.beginPath(); C.moveTo(.2 * s, -.08 * s); C.quadraticCurveTo(.26 * s, -.12 * s, .31 * s, -.07 * s); C.quadraticCurveTo(.26 * s, -.04 * s, .2 * s, -.08 * s); C.fillStyle = ink(.04, 0, TN.gold); C.fill();
  if (o.tear) { C.beginPath(); C.ellipse(.3 * s, (.0 + o.tear * .35) * s, .025 * s, .04 * s, 0, 0, TAU); C.fillStyle = ink(1, 0, 0); C.fill(); }
  C.beginPath(); C.moveTo(.16 * s, -.16 * s); C.quadraticCurveTo(.27 * s, -.2 * s, .35 * s, -.15 * s); C.strokeStyle = ink(.05, 0, TN.gold); C.lineWidth = .045 * s; C.stroke();
  C.beginPath(); C.moveTo(.3 * s, .245 * s); C.lineTo(.37 * s, .25 * s); C.strokeStyle = ink(.08, 0, TN.gold); C.lineWidth = .025 * s; C.stroke();
  C.beginPath(); C.moveTo(.4 * s, .13 * s); C.quadraticCurveTo(.36 * s, .1 * s, .38 * s, .06 * s); C.strokeStyle = ink(sb * .5, 0, TN.gold); C.lineWidth = .02 * s; C.stroke();
  // elmacık/çene gölgesi
  C.save(); smoothPath(pr); C.clip(); C.fillStyle = mg(0, -.1 * s, 0, .5 * s, [[0, 1], [1, .8]], 0); C.globalCompositeOperation = 'multiply'; C.fillRect(-.6 * s, .25 * s, 1.2 * s, .4 * s); C.restore();
  if (o.stub) { C.save(); smoothPath(pr); C.clip(); C.fillStyle = ink(sb * .75, 1.6, TN.gold); C.beginPath(); C.moveTo(-.1 * s, .3 * s); C.quadraticCurveTo(.2 * s, .52 * s, .4 * s, .3 * s); C.lineTo(.4 * s, .55 * s); C.lineTo(-.15 * s, .55 * s); C.fill(); C.restore(); }
  // saç
  if (o.hair === 'long') {
    C.beginPath(); C.moveTo(.3 * s, -.42 * s); C.quadraticCurveTo(.05 * s, -.72 * s, -.4 * s, -.45 * s); C.quadraticCurveTo(-.62 * s, -.05 * s, -.55 * s, .5 * s);
    C.quadraticCurveTo(-.6 * s + (o.wind || 0) * -.3 * s, 1.3 * s, -.35 * s - (o.wind || 0) * .5 * s, 1.95 * s); C.lineTo(-.12 * s, 1.6 * s); C.quadraticCurveTo(-.2 * s, .9 * s, -.18 * s, .35 * s);
    C.quadraticCurveTo(-.15 * s, .0, -.02 * s, -.2 * s); C.quadraticCurveTo(.15 * s, -.33 * s, .3 * s, -.3 * s); C.closePath();
    C.fillStyle = shadeFill(-.2 * s, .3 * s, .6 * s, .35, 0, sb * .65, sk * .8); C.fill();
    for (let i = 0; i < 6; i++) fold([[(.1 - i * .07) * s, -.45 * s], [(-.35 - i * .03) * s, (-.1 + i * .04) * s], [(-.38 - i * .02) * s, (.8 + i * .12) * s]], sb * .35, .3, .02 * s);
  } else if (o.hair) {
    C.beginPath(); C.moveTo(.25 * s, -.46 * s); C.quadraticCurveTo(-.1 * s, -.66 * s, -.4 * s, -.4 * s); C.quadraticCurveTo(-.5 * s, -.15 * s, -.42 * s, .15 * s); C.lineTo(-.25 * s, .1 * s); C.quadraticCurveTo(-.2 * s, -.25 * s, .25 * s, -.36 * s); C.closePath();
    C.fillStyle = ink(.08, .4, TN.gold); C.fill();
  }
  // şapka
  if (o.hat === 'fedora') {
    C.save(); C.translate(-.02 * s, -.3 * s); C.rotate(-.06);
    C.beginPath(); C.moveTo(-.7 * s, .02 * s); C.quadraticCurveTo(-.1 * s, -.08 * s, .72 * s, .06 * s); C.quadraticCurveTo(.1 * s, .04 * s, -.7 * s, .1 * s); C.closePath(); C.fillStyle = shadeFill(0, 0, .5 * s, 0, 0, .06, .22); C.fill();
    C.beginPath(); C.moveTo(-.42 * s, .03 * s); C.quadraticCurveTo(-.48 * s, -.3 * s, -.34 * s, -.44 * s); C.quadraticCurveTo(-.02 * s, -.36 * s, .3 * s, -.42 * s); C.quadraticCurveTo(.42 * s, -.2 * s, .4 * s, .02 * s); C.closePath();
    C.fillStyle = shadeFill(0, -.2 * s, .45 * s, Math.PI / 2, 0, .07, .26); C.fill();
    C.fillStyle = ink(.02, 0, TN.gold); C.fillRect(-.42 * s, -.09 * s, .82 * s, .08 * s);
    C.restore();
    // siper gölgesi gözlere
    C.save(); smoothPath(pr); C.clip(); C.globalCompositeOperation = 'multiply'; C.fillStyle = mg(0, -.3 * s, 0, .05 * s, [[0, .25], [1, 1]], 0); C.fillRect(-.6 * s, -.6 * s, 1.2 * s, .66 * s); C.restore();
  } else if (o.hat === 'top') {
    C.save(); C.translate(0, -.32 * s); C.rotate(-.04);
    C.beginPath(); C.ellipse(0, 0, .55 * s, .07 * s, 0, 0, TAU); C.fillStyle = ink(.04, 0); C.fill();
    C.beginPath(); C.moveTo(-.36 * s, 0); C.lineTo(-.38 * s, -.82 * s); C.lineTo(.38 * s, -.82 * s); C.lineTo(.36 * s, 0); C.closePath(); C.fillStyle = shadeFill(0, -.4 * s, .4 * s, Math.PI / 2, 0, .04, .2); C.fill();
    C.restore();
  }
  if (o.eyes) { C.fillStyle = ink(1, 0); C.beginPath(); C.arc(.27 * s, -.07 * s, .035 * s, 0, TAU); C.fill(); }
  C.restore();
}

// ---- yan görünüş figür ----
function figSide(o) {
  const h = o.h, u = h / 8, Pz = o.P || sidePose();
  const kind = o.kind || 'man', fem = kind === 'woman';
  // eklemler (ayak tabanı 0)
  const hip = [0, -4.05 * u], up = [Math.sin(Pz.lean), -Math.cos(Pz.lean)];
  const shd = add(hip, scl(up, 2.6 * u)), neck = add(hip, scl(up, 2.95 * u));
  const legs = [0, 1].map(i => { const th = Pz.th[i], kn = Pz.kn[i]; const k = add(hip, dirA(th, 1.98 * u)), an = add(k, dirA(th - kn, 1.92 * u)); const fa = (th - kn) * .7 + (Pz.toe ? Pz.toe[i] : 0);
    const toe = add(an, [Math.cos(fa) * .78 * u, Math.sin(fa) * .78 * u]); return { th, kn, k, an, toe }; });
  let low = -1e9; for (const L of legs) low = Math.max(low, L.an[1] + .06 * u, L.toe[1], L.k[1] + .1 * u);
  const dy = o.air ? 0 : -low;
  const T = p => [p[0], p[1] + dy];
  const arms = [0, 1].map(i => { const sa = Pz.sa[i] + Pz.lean, ea = Pz.ea[i]; const s0 = add(shd, [0, .08 * u]), e = add(s0, dirA(sa, 1.5 * u)), w = add(e, dirA(sa + ea, 1.32 * u)); return { sa, ea, s0, e, w }; });
  C.save(); C.translate(o.x, o.y); C.scale(o.dir || 1, 1); FLIP = o.dir || 1;
  const L0 = o.L || [-.6, -.8]; FL = [L0[0] * (o.dir || 1), L0[1]];
  const cb = o.base === undefined ? (kind === 'shade' ? .05 : fem ? .45 : .1) : o.base, ck = o.lit === undefined ? (kind === 'shade' ? .1 : fem ? .5 : .38) : o.lit;
  TN = { b: cb, k: ck, gold: fem ? 1 : 0 }; OL = o.ol === undefined ? Math.max(.8, u * .035) : o.ol; XC = u > 30 ? 1 : 0;
  const skin = fem ? [.5, .5] : kind === 'shade' ? [.06, .1] : [.32, .5];
  const sleeveW = (fem ? .2 : .27) * u;
  const drawArm = (A, far) => { const kb = far ? .7 : 1;
    SIDES = !far; limb3(T(A.s0), T(A.e), T(A.w), sleeveW, sleeveW * .85, sleeveW * .7, cb * kb, ck * kb); SIDES = 0;
    hand(T(A.w), A.sa + A.ea, u * .8, skin[0] * kb, skin[1] * kb, o.fist ? o.fist[far ? 0 : 1] : 0); };
  const drawLeg = (L, far) => { const kb = far ? .7 : 1, lw = (fem ? .2 : .26) * u;
    limb3(T(hip), T(L.k), T(L.an), lw * 1.25, lw, lw * .72, cb * kb, ck * kb);
    // ayakkabı
    const a = T(L.an), t = T(L.toe); C.beginPath(); C.moveTo(a[0] - .12 * u, a[1] - .12 * u); C.quadraticCurveTo(t[0] + .05 * u, t[1] - .18 * u, t[0] + .06 * u, t[1]); C.lineTo(a[0] - .2 * u, a[1] + .05 * u); C.closePath();
    C.fillStyle = ink(.03 + (far ? 0 : .06), 0, TN.gold); C.fill(); };
  drawArm(arms[0], 1); drawLeg(legs[0], 1); drawLeg(legs[1], 0);
  // gövde / palto
  const wind = o.wind || 0;
  const xAt = (L, y) => { const a = T(hip), b = T(L.k), c2 = T(L.an); if (y <= b[1]) { const k = (y - a[1]) / ((b[1] - a[1]) || 1); return lerp(a[0], b[0], clamp(k)); } const k = (y - b[1]) / ((c2[1] - b[1]) || 1); return lerp(b[0], c2[0], clamp(k)); };
  const tor = (x, y) => T(add(hip, add(scl([-up[1], up[0]], x * u), scl(up, -y * u)))); // x ileri, y aşağı (gövde yerel)
  const hemY = T(hip)[1] + (fem ? 3.85 : (o.coatLen || 2.45)) * u;
  const xs = legs.map(L => xAt(L, hemY)); const hb = Math.min(...xs) - (fem ? .55 : .42) * u - wind * u, hf = Math.max(...xs) + (fem ? .5 : .36) * u - wind * .55 * u;
  const body = [tor(-.25, -2.95), tor(-.52, -2.6), tor(-.6, -2.2), tor(-.5, -1.2), tor(-.55, 0), [hb, hemY - .1 * u], [lerp(hb, hf, .5) - wind * .2 * u, hemY + .08 * u], [hf, hemY - .05 * u], tor(.55, .1), tor(fem ? .5 : .55, -1.1), tor(fem ? .62 : .6, -1.9), tor(.45, -2.6), tor(.25, -2.92)];
  smoothPath(body); C.fillStyle = shadeFill(T(hip)[0], T(hip)[1] - 1.2 * u, 1.3 * u, Math.PI / 2 + Pz.lean * .5, 0); C.fill(); outl(1.2);
  // kıvrımlar
  const fv = cb * .4;
  fold([tor(.15, -1.0), tor(.22, 0), [lerp(hb, hf, .7), hemY - .1 * u]], fv, Math.PI / 2, .05 * u);
  fold([tor(-.25, -.5), tor(-.3, .3), [lerp(hb, hf, .25), hemY]], fv, Math.PI / 2, .05 * u);
  if (!fem) { fold([tor(.5, -2.5), tor(.15, -1.6), tor(.3, -.3)], fv * .6, Math.PI / 2, .06 * u); // yaka/klapa
    C.beginPath(); const c1 = tor(-.3, -2.85), c2 = tor(.1, -3.3), c3 = tor(.35, -2.75); C.moveTo(c1[0], c1[1]); C.lineTo(c2[0], c2[1]); C.lineTo(c3[0], c3[1]); C.closePath(); C.fillStyle = shadeFill(c2[0], c2[1], .4 * u, 1.2, 0, cb * 1.1, ck); C.fill();
    const bl = tor(-.55, -.4), br = tor(.55, -.4); inkLine(bl[0], bl[1], br[0], br[1], .07 * u, cb * .5); }
  else { const bl = tor(-.5, -1.0), br = tor(.5, -1.0); inkLine(bl[0], bl[1], br[0], br[1], .05 * u, cb * .7); }
  // kafa
  const ha = Pz.lean + Pz.nod;
  headSide(T(add(neck, [Math.sin(ha) * .62 * u, -Math.cos(ha) * .62 * u])), ha * 1, u * 1.02, { skin, hat: o.hat === undefined ? (kind === 'man' ? 'fedora' : kind === 'shade' ? 'top' : null) : o.hat, hair: fem ? 'long' : true, stub: kind === 'man', eyes: o.eyes, tear: o.tear, wind });
  drawArm(arms[1], 0);
  C.restore(); FLIP = 1; ROT = 0;
  const res = { hip: T(hip), hand: [arms[0].w, arms[1].w].map(p => { const q = T(p); return [o.x + q[0] * (o.dir || 1), o.y + q[1]]; }), head: (() => { const q = T(add(neck, [Math.sin(ha) * .62 * u, -Math.cos(ha) * .62 * u])); return [o.x + q[0] * (o.dir || 1), o.y + q[1]]; })() };
  return res;
}

// ---- ön / arka görünüş figür ----
function figFront(o) {
  const h = o.h, u = h / 8, Pz = o.P || frontPose(), kind = o.kind || 'man', fem = kind === 'woman', back = o.view === 'back';
  C.save(); C.translate(o.x, o.y); FLIP = 1; const L0 = o.L || [-.6, -.8]; FL = [L0[0], L0[1]];
  const cb = o.base === undefined ? (kind === 'shade' ? .05 : fem ? .45 : .1) : o.base, ck = o.lit === undefined ? (kind === 'shade' ? .1 : fem ? .5 : .38) : o.lit;
  TN = { b: cb, k: ck, gold: fem ? 1 : 0 }; OL = o.ol === undefined ? Math.max(.8, u * .035) : o.ol; XC = u > 30 ? 1 : 0;
  const skin = fem ? [.5, .5] : kind === 'shade' ? [.06, .1] : [.32, .5];
  const kneel = Pz.kneel || 0, hipY = -4.05 * u * (1 - kneel * .32), st = Pz.st, sway = Pz.sway || 0;
  C.rotate(Pz.tilt || 0); ROT = Pz.tilt || 0;
  const hip = [sway * u, hipY], shY = hipY - 2.6 * u, neck = [hip[0] * .6, hipY - 2.95 * u];
  const wind = o.wind || 0;
  // bacaklar
  const lw = (fem ? .2 : .3) * u;
  for (const sd of [-1, 1]) { const hx = hip[0] + sd * .42 * u, kx = hx + sd * st * u, ky = hipY + 1.98 * u * (1 - kneel * .5), ax = hx + sd * st * 1.4 * u, ay = 0;
    limb3([hx, hipY], [kx, ky], [ax, ay - .1 * u], lw * 1.25, lw * 1.05, lw * .85, cb, ck);
    C.beginPath(); C.ellipse(ax + sd * .05 * u, -.06 * u, .2 * u, .1 * u, 0, 0, TAU); C.fillStyle = ink(.05, 0, TN.gold); C.fill(); }
  // kollar
  const sw = (fem ? .2 : .27) * u, hands = [];
  const drawArm = sd => { const i = sd < 0 ? 0 : 1, ab = Pz.ab[i], el = Pz.el[i], fw = 1 - .45 * (Pz.fw[i] || 0);
    const s0 = [hip[0] * .8 + sd * (fem ? .7 : .8) * u, shY + .2 * u], e = add(s0, [Math.sin(ab) * sd * 1.5 * u * fw, Math.cos(ab) * 1.5 * u * fw]), a2 = ab + el, w = add(e, [Math.sin(a2) * sd * 1.32 * u * fw, Math.cos(a2) * 1.32 * u * fw]);
    SIDES = 1; limb3(s0, e, w, sw * 1.1, sw * .92, sw * .75, cb, ck); SIDES = 0; if (!(o.pockets && o.pockets[i])) hand(w, -a2 * sd, u * .8, skin[0], skin[1], o.fist ? o.fist[i] : 0); hands[i] = [o.x + w[0], o.y + w[1]]; };
  // palto / elbise
  const hemY = hipY + (fem ? 3.9 : (o.coatLen || 2.45)) * u * (1 - kneel * .3), hw = (fem ? 1.05 : .78 + st * .6) * u;
  const body = [[neck[0] - .3 * u, neck[1] + .05 * u], [hip[0] * .8 - (fem ? .78 : .98) * u, shY + .05 * u], [hip[0] * .9 - (fem ? .7 : .82) * u, shY + 1.1 * u], [hip[0] - (fem ? .55 : .7) * u, hipY - .2 * u], [hip[0] - hw - wind * .6 * u, hemY - .05 * u], [hip[0] - hw - wind * .6 * u, hemY], [hip[0] + hw - wind * .6 * u, hemY], [hip[0] + hw - wind * .6 * u, hemY - .05 * u], [hip[0] + (fem ? .55 : .7) * u, hipY - .2 * u], [hip[0] * .9 + (fem ? .7 : .82) * u, shY + 1.1 * u], [hip[0] * .8 + (fem ? .78 : .98) * u, shY + .05 * u], [neck[0] + .3 * u, neck[1] + .05 * u]];
  smoothPath(body); C.fillStyle = shadeFill(hip[0], hipY - 1.2 * u, 1.3 * u, Math.PI / 2, 0); C.fill(); outl(1.2);
  const fv = cb * .4;
  if (!back && !fem) { fold([[neck[0] - .25 * u, shY], [hip[0] - .12 * u, hipY - 1.0 * u], [hip[0] - .1 * u, hemY]], fv, Math.PI / 2, .06 * u); fold([[neck[0] + .25 * u, shY], [hip[0] + .05 * u, hipY - 1.0 * u]], fv, Math.PI / 2, .05 * u);
    for (let i = 0; i < 3; i++) { C.beginPath(); C.arc(hip[0] + .12 * u, hipY - (1.3 - i * .55) * u, .05 * u, 0, TAU); C.fillStyle = ink(.02, 0); C.fill(); } }
  else if (back) fold([[neck[0], shY + .2 * u], [hip[0], hipY], [hip[0] - wind * .3 * u, hemY]], fv, Math.PI / 2, .05 * u);
  for (let i = -2; i <= 2; i++) fold([[hip[0] + i * .3 * u, hipY + .2 * u], [hip[0] + i * .42 * u - wind * .4 * u, hemY - .05 * u]], fv * 1.1, Math.PI / 2, .035 * u);
  const bl = [hip[0] - .7 * u, hipY - .4 * u], br = [hip[0] + .7 * u, hipY - .4 * u]; inkLine(bl[0], bl[1], br[0], br[1], .06 * u, cb * .5);
  if (!back && !fem) { C.beginPath(); C.moveTo(neck[0] - .45 * u, shY - .05 * u); C.lineTo(neck[0], shY + .7 * u); C.lineTo(neck[0] + .45 * u, shY - .05 * u); C.lineTo(neck[0] + .2 * u, neck[1] - .1 * u); C.lineTo(neck[0] - .2 * u, neck[1] - .1 * u); C.closePath(); C.fillStyle = shadeFill(neck[0], shY, .5 * u, 1.3, 0, cb * 1.1, ck * .9); C.fill(); }
  if (o.pockets) { for (const i of [0, 1]) if (o.pockets[i]) { Pz.ab[i] = .22; Pz.el[i] = -.1; } } drawArm(-1); drawArm(1);
  // kafa
  const hc = [neck[0] + Math.sin(Pz.nod * 0) * u, neck[1] - .55 * u + Pz.nod * .1 * u];
  C.beginPath(); C.moveTo(neck[0] - .17 * u, neck[1] - .2 * u); C.lineTo(neck[0] + .17 * u, neck[1] - .2 * u); C.lineTo(neck[0] + .2 * u, neck[1] + .15 * u); C.lineTo(neck[0] - .2 * u, neck[1] + .15 * u); C.fillStyle = shadeFill(neck[0], neck[1], .2 * u, 0, 0, skin[0] * .6, skin[1] * .5); C.fill();
  C.save(); C.translate(hc[0], hc[1]); C.rotate(Pz.turn * .15);
  const hr = u * .5;
  if (fem) { C.beginPath(); C.moveTo(0, -1.15 * hr); C.bezierCurveTo(-1.25 * hr, -1.1 * hr, -1.2 * hr - wind * .3 * hr, 1.8 * hr, -1.05 * hr - wind * .9 * hr, 3.6 * hr); C.lineTo(1.05 * hr - wind * .9 * hr, 3.6 * hr); C.bezierCurveTo(1.2 * hr - wind * .3 * hr, 1.8 * hr, 1.25 * hr, -1.1 * hr, 0, -1.15 * hr); C.fillStyle = shadeFill(0, 0, 1.2 * hr, .1, 0, skin[0] * .62, skin[1] * .8); C.fill(); }
  C.beginPath(); C.ellipse(0, 0, .78 * hr, 1.02 * hr, 0, 0, TAU); C.fillStyle = shadeFill(0, 0, .9 * hr, 0, 0, back ? skin[0] * .5 : skin[0], back ? skin[1] * .5 : skin[1]); C.fill();
  if (!back) {
    const ey = -.08 * hr, tf = Pz.turn * .25 * hr;
    C.fillStyle = ink(skin[0] * .55, .3, TN.gold); C.beginPath(); C.ellipse(-.33 * hr + tf, ey, .2 * hr, .13 * hr, 0, 0, TAU); C.ellipse(.33 * hr + tf, ey, .2 * hr, .13 * hr, 0, 0, TAU); C.fill();
    C.fillStyle = ink(.03, 0, TN.gold); C.beginPath(); C.ellipse(-.33 * hr + tf, ey, .1 * hr, .05 * hr, 0, 0, TAU); C.ellipse(.33 * hr + tf, ey, .1 * hr, .05 * hr, 0, 0, TAU); C.fill();
    strokeTone([[-.5 * hr + tf, -.27 * hr], [-.15 * hr + tf, -.3 * hr]], .05, 0, .07 * hr); strokeTone([[.15 * hr + tf, -.3 * hr], [.5 * hr + tf, -.27 * hr]], .05, 0, .07 * hr);
    C.beginPath(); C.moveTo(.02 * hr + tf, -.1 * hr); C.lineTo(.12 * hr + tf, .28 * hr); C.lineTo(-.05 * hr + tf, .3 * hr); C.fillStyle = ink(skin[0] * .6, 1.2, TN.gold); C.fill();
    strokeTone([[-.2 * hr + tf, .55 * hr], [.2 * hr + tf, .55 * hr]], .06, 0, .05 * hr);
    if (o.eyes) { C.fillStyle = ink(1, 0); C.beginPath(); C.arc(-.33 * hr + tf, ey, .07 * hr, 0, TAU); C.arc(.33 * hr + tf, ey, .07 * hr, 0, TAU); C.fill(); }
  }
  C.save(); C.beginPath(); C.ellipse(0, 0, .78 * hr, 1.02 * hr, 0, 0, TAU); C.clip(); C.globalCompositeOperation = 'multiply'; C.fillStyle = mg(0, .3 * hr, 0, 1.1 * hr, [[0, 1], [1, .5]], 0); C.fillRect(-hr, 0, 2 * hr, 1.2 * hr); C.restore();
  if (fem) { C.beginPath(); C.moveTo(-.8 * hr, -.1 * hr); C.quadraticCurveTo(-.85 * hr, -1.2 * hr, 0, -1.12 * hr); C.quadraticCurveTo(.85 * hr, -1.2 * hr, .8 * hr, -.1 * hr); C.quadraticCurveTo(.5 * hr, -.75 * hr, 0, -.78 * hr); C.quadraticCurveTo(-.5 * hr, -.75 * hr, -.8 * hr, -.1 * hr); C.fillStyle = shadeFill(0, -.6 * hr, .8 * hr, .2, 0, skin[0] * .6, skin[1] * .8); C.fill(); }
  const hat = o.hat === undefined ? (kind === 'man' ? 'fedora' : kind === 'shade' ? 'top' : null) : o.hat;
  if (hat === 'fedora') {
    C.beginPath(); C.ellipse(0, -.5 * hr, 1.45 * hr, .3 * hr, 0, 0, TAU); C.fillStyle = shadeFill(0, -.5 * hr, 1.2 * hr, 0, 0, .05, .2); C.fill();
    C.beginPath(); C.moveTo(-.82 * hr, -.5 * hr); C.quadraticCurveTo(-.9 * hr, -1.45 * hr, -.5 * hr, -1.55 * hr); C.quadraticCurveTo(0, -1.35 * hr, .5 * hr, -1.55 * hr); C.quadraticCurveTo(.9 * hr, -1.45 * hr, .82 * hr, -.5 * hr); C.closePath(); C.fillStyle = shadeFill(0, -1 * hr, .9 * hr, Math.PI / 2, 0, .06, .25); C.fill();
    C.fillStyle = ink(.02, 0); C.fillRect(-.83 * hr, -.78 * hr, 1.66 * hr, .2 * hr);
    if (!back) { C.save(); C.beginPath(); C.ellipse(0, 0, .78 * hr, 1.02 * hr, 0, 0, TAU); C.clip(); C.globalCompositeOperation = 'multiply'; C.fillStyle = mg(0, -.45 * hr, 0, .15 * hr, [[0, .2], [1, 1]], 0); C.fillRect(-hr, -hr, 2 * hr, 1.2 * hr); C.restore();
      if (o.eyes) { C.fillStyle = ink(1, 0); C.beginPath(); C.arc(-.33 * hr, -.08 * hr, .07 * hr, 0, TAU); C.arc(.33 * hr, -.08 * hr, .07 * hr, 0, TAU); C.fill(); } }
  } else if (hat === 'top') {
    C.beginPath(); C.ellipse(0, -.55 * hr, 1.2 * hr, .22 * hr, 0, 0, TAU); C.fillStyle = ink(.04, 0); C.fill();
    C.beginPath(); C.moveTo(-.72 * hr, -.55 * hr); C.lineTo(-.78 * hr, -2.3 * hr); C.lineTo(.78 * hr, -2.3 * hr); C.lineTo(.72 * hr, -.55 * hr); C.closePath(); C.fillStyle = shadeFill(0, -1.4 * hr, .8 * hr, Math.PI / 2, 0, .04, .2); C.fill();
  } else if (!fem && kind !== 'shade') { C.beginPath(); C.ellipse(0, -.45 * hr, .8 * hr, .65 * hr, 0, Math.PI, TAU); C.fillStyle = ink(.08, .3); C.fill(); }
  C.restore();
  C.restore(); FLIP = 1; ROT = 0;
  return { hands, head: [o.x + hc[0], o.y + hc[1]] };
}
// ---- kadın, ön görünüş (altın) ----
function womanFront(o) {
  const h = o.h, u = h / 8, Pz = o.P || frontPose(), back = o.view === 'back', wind = o.wind || 0;
  C.save(); C.translate(o.x, o.y); FLIP = 1; ROT = 0; const L0 = o.L || [-.6, -.8]; FL = [L0[0], L0[1]];
  TN = { b: o.base === undefined ? .5 : o.base, k: o.lit === undefined ? .45 : o.lit, gold: o.gold === undefined ? 1 : o.gold }; OL = o.ol === undefined ? Math.max(.7, u * .03) : o.ol; XC = u > 30 ? 1 : 0;
  const sk = [TN.b + .05, TN.k], sx = Pz.sway || 0;
  const X = (x, y) => [x * u + sx * u * (1 + y / 8) * .5, y * u];
  // saç arka kütlesi
  const hc = X(0, -7.45), hr = .5 * u;
  C.beginPath(); C.moveTo(hc[0] - .55 * u, hc[1] - .1 * u); C.bezierCurveTo(hc[0] - .75 * u, hc[1] + .8 * u, hc[0] - .8 * u - wind * .4 * u, hc[1] + 1.4 * u, hc[0] - .62 * u - wind * u, hc[1] + 2.1 * u);
  C.lineTo(hc[0] + .62 * u - wind * u, hc[1] + 2.1 * u); C.bezierCurveTo(hc[0] + .8 * u - wind * .4 * u, hc[1] + 1.4 * u, hc[0] + .75 * u, hc[1] + .8 * u, hc[0] + .55 * u, hc[1] - .1 * u); C.closePath();
  C.fillStyle = shadeFill(hc[0], hc[1] + u, .8 * u, Math.PI / 2, 0, TN.b * .55, TN.k * .6); C.fill(); outl();
  // bacak ucu / ayaklar
  for (const sd of [-1, 1]) { C.beginPath(); C.ellipse(sd * .25 * u, -.06 * u, .16 * u, .08 * u, 0, 0, TAU); C.fillStyle = ink(TN.b * .5, 0, TN.gold); C.fill(); }
  // elbise
  const hemW = 1.2 + (Pz.st || 0) * .5, wb = k => Math.sin(k * 9 + (o.t || 0) * 2) * .05;
  const body = [X(-.2, -6.88), X(-.5, -6.72), X(-.76, -6.45), X(-.66, -5.95), X(-.44, -4.95), X(-.6, -4.25), X(-hemW - wind * .7, -.08), X(-hemW * .5 - wind * .6, .02 + wb(1)), X(-wind * .5, -.06), X(hemW * .5 - wind * .5, .02 + wb(2)), X(hemW - wind * .45, -.08), X(.6, -4.25), X(.44, -4.95), X(.66, -5.95), X(.76, -6.45), X(.5, -6.72), X(.2, -6.88)];
  smoothPath(body); C.fillStyle = shadeFill(X(0, -4)[0], X(0, -4)[1], 1.3 * u, Math.PI / 2, 0); C.fill(); outl(1.1);
  const fv = TN.b * .5;
  for (let i = -3; i <= 3; i++) if (i) fold([X(i * .1, -4.6), X(i * .22, -2.6), X(i * .36 - wind * .5, -.15)], fv, Math.PI / 2, .035 * u);
  fold([X(-.44, -4.95), X(.44, -4.95)], TN.b * .4, 0, .06 * u); // kemer
  fold([X(-.3, -6.7), X(0, -6.35), X(.3, -6.7)], TN.b * .45, 0, .03 * u); // yaka
  // kollar
  const hands = [];
  for (const sd of [-1, 1]) { const i = sd < 0 ? 0 : 1, ab = Pz.ab[i], el = Pz.el[i], fw = 1 - .45 * (Pz.fw[i] || 0);
    const s0 = add(X(sd * .62, -6.35), [0, 0]), e = add(s0, [Math.sin(ab) * sd * 1.45 * u * fw, Math.cos(ab) * 1.45 * u * fw]), a2 = ab + el, w = add(e, [Math.sin(a2) * sd * 1.28 * u * fw, Math.cos(a2) * 1.28 * u * fw]);
    limb3(s0, e, w, .2 * u, .16 * u, .12 * u, TN.b, TN.k); hand(w, -a2 * sd, u * .85, sk[0], sk[1]); hands[i] = [o.x + w[0], o.y + w[1]]; }
  // boyun
  capsule(X(0, -7.05), X(0, -6.7), .15 * u, .17 * u, sk[0] * .8, sk[1] * .7);
  // yüz
  C.save(); C.translate(hc[0], hc[1]); C.rotate((Pz.tilt || 0) + (Pz.turn || 0) * .1);
  C.beginPath(); C.moveTo(0, -1.0 * hr); C.bezierCurveTo(.78 * hr, -1.0 * hr, .78 * hr, .25 * hr, .5 * hr, .7 * hr); C.quadraticCurveTo(.25 * hr, 1.05 * hr, 0, 1.05 * hr); C.quadraticCurveTo(-.25 * hr, 1.05 * hr, -.5 * hr, .7 * hr); C.bezierCurveTo(-.78 * hr, .25 * hr, -.78 * hr, -1.0 * hr, 0, -1.0 * hr); C.closePath();
  const facePath = new Path2D(); facePath.ellipse(0, 0, .74 * hr, 1.03 * hr, 0, 0, TAU);
  C.fillStyle = shadeFill(0, 0, .8 * hr, .2, .1, back ? sk[0] * .5 : sk[0], back ? sk[1] * .5 : sk[1]); C.fill(); outl(.8);
  if (!back) {
    const tf = (Pz.turn || 0) * .2 * hr, ey = -.02 * hr, cl = o.closed ? 1 : 0;
    for (const sd of [-1, 1]) { const ex = sd * .3 * hr + tf;
      C.beginPath(); C.moveTo(ex - .17 * hr, ey); C.quadraticCurveTo(ex, ey - .13 * hr, ex + .17 * hr, ey); C.strokeStyle = ink(.08, 0, TN.gold); C.lineWidth = .05 * hr; C.stroke();
      if (!cl) { C.beginPath(); C.arc(ex, ey + .01 * hr, .065 * hr, 0, TAU); C.fillStyle = ink(.05, 0, TN.gold); C.fill(); }
      else { C.beginPath(); C.moveTo(ex - .15 * hr, ey + .02 * hr); C.quadraticCurveTo(ex, ey + .08 * hr, ex + .15 * hr, ey + .02 * hr); C.strokeStyle = ink(.1, 0, TN.gold); C.lineWidth = .035 * hr; C.stroke(); }
      C.beginPath(); C.moveTo(ex - .2 * hr, ey - .2 * hr); C.quadraticCurveTo(ex, ey - .3 * hr, ex + .2 * hr * sd, ey - .22 * hr); C.strokeStyle = ink(.2, 0, TN.gold); C.lineWidth = .035 * hr; C.stroke(); }
    C.beginPath(); C.moveTo(.04 * hr + tf, -.05 * hr); C.quadraticCurveTo(.1 * hr + tf, .28 * hr, .1 * hr + tf, .33 * hr); C.quadraticCurveTo(.02 * hr + tf, .38 * hr, -.07 * hr + tf, .34 * hr); C.strokeStyle = ink(TN.b * .5, 0, TN.gold); C.lineWidth = .03 * hr; C.stroke();
    C.beginPath(); C.moveTo(-.16 * hr + tf, .56 * hr); C.quadraticCurveTo(0 + tf, .5 * hr, .16 * hr + tf, .56 * hr); C.quadraticCurveTo(0 + tf, .68 * hr, -.16 * hr + tf, .56 * hr); C.fillStyle = ink(TN.b * .55, 0, TN.gold); C.fill();
    if (o.tear) { const ty = ey + (.1 + o.tear * .5) * hr; C.beginPath(); C.moveTo(.32 * hr + tf, ty - .08 * hr); C.quadraticCurveTo(.38 * hr + tf, ty + .04 * hr, .32 * hr + tf, ty + .06 * hr); C.quadraticCurveTo(.26 * hr + tf, ty + .04 * hr, .32 * hr + tf, ty - .08 * hr); C.fillStyle = ink(1, 0, 0); C.fill(); C.strokeStyle = ink(.1, 0, 0); C.lineWidth = .015 * hr; C.stroke(); }
  }
  // saç üstü (ortadan ayrık, yüzü çerçeveler)
  for (const sd of [-1, 1]) { C.beginPath(); C.moveTo(0, -1.02 * hr); C.bezierCurveTo(sd * .5 * hr, -1.15 * hr, sd * .95 * hr, -.7 * hr, sd * .82 * hr, .1 * hr); C.bezierCurveTo(sd * .8 * hr, .7 * hr, sd * .95 * hr, 1.2 * hr, sd * 1.05 * hr - wind * .5 * hr, 1.7 * hr);
    C.lineTo(sd * .78 * hr - wind * .4 * hr, 1.5 * hr); C.bezierCurveTo(sd * .66 * hr, .9 * hr, sd * .72 * hr, .1 * hr, sd * .62 * hr, -.35 * hr); C.quadraticCurveTo(sd * .4 * hr, -.85 * hr, 0, -.86 * hr); C.closePath();
    C.fillStyle = shadeFill(sd * .5 * hr, -.2 * hr, .8 * hr, .5 * sd, 0, TN.b * .7, TN.k * .9); C.fill(); outl(.7);
    for (let k = 0; k < 3; k++) fold([[sd * .1 * hr, -.95 * hr], [sd * (.6 + k * .08) * hr, -.6 * hr], [sd * (.75 + k * .04) * hr, .4 * hr]], TN.b * .4, .5 * sd, .02 * hr); }
  C.restore();
  C.restore(); FLIP = 1; ROT = 0;
  return { hands, head: [o.x + hc[0], o.y + hc[1]] };
}
function figRaw(o) { if (o.kind === 'woman' && (o.view === 'front' || o.view === 'back')) return womanFront(o); return o.view === 'front' || o.view === 'back' ? figFront(o) : figSide(o); }

// ---- figür katmanı: tek parça siluet, bütünsel ışık, kenar ışığı ----
const FCc = mkc(W, H), FX = FCc.getContext('2d'), MKc = mkc(W, H), MX = MKc.getContext('2d'), RCc = mkc(W, H), RX = RCc.getContext('2d');
function fig(o) {
  const prev = C, m = prev.getTransform();
  FX.setTransform(1, 0, 0, 1, 0, 0); FX.globalCompositeOperation = 'source-over'; FX.globalAlpha = 1; FX.clearRect(0, 0, W, H);
  C = FX; C.setTransform(m); let res;
  try { res = figRaw(o); } finally { C = prev; }
  const sx = m.a * o.x + m.c * o.y + m.e, sy = m.b * o.x + m.d * o.y + m.f, hp = o.h * Math.hypot(m.a, m.b);
  MX.setTransform(1, 0, 0, 1, 0, 0); MX.globalCompositeOperation = 'source-over'; MX.clearRect(0, 0, W, H); MX.drawImage(FCc, 0, 0);
  const L = o.L || [-.6, -.8], ln = Math.hypot(L[0], L[1]) || 1, lx = L[0] / ln, ly = L[1] / ln, cx = sx, cy = sy - hp * .55, R = hp * .2;
  FX.setTransform(1, 0, 0, 1, 0, 0); FX.globalCompositeOperation = 'multiply';
  const g1 = FX.createLinearGradient(cx + lx * R, cy + ly * R, cx - lx * R, cy - ly * R), dk = o.dark === undefined ? .55 : o.dark;
  g1.addColorStop(0, 'rgb(255,255,255)'); g1.addColorStop(.5, `rgb(${(255 * lerp(1, dk, .4)) | 0},255,255)`); g1.addColorStop(1, `rgb(${(255 * dk) | 0},255,255)`);
  FX.fillStyle = g1; FX.fillRect(0, 0, W, H);
  const g2 = FX.createLinearGradient(0, sy - hp, 0, sy); g2.addColorStop(0, 'rgb(255,255,255)'); g2.addColorStop(.55, 'rgb(240,255,255)'); g2.addColorStop(1, `rgb(${(255 * (o.feet === undefined ? .7 : o.feet)) | 0},255,255)`);
  FX.fillStyle = g2; FX.fillRect(0, 0, W, H);
  FX.globalCompositeOperation = 'destination-in'; FX.drawImage(MKc, 0, 0);
  // kenar ışığı
  const rw = Math.max(1.5, hp * (o.rimW || .012)), rim = o.rim === undefined ? .7 : o.rim;
  if (rim > 0) {
    RX.setTransform(1, 0, 0, 1, 0, 0); RX.globalCompositeOperation = 'source-over'; RX.clearRect(0, 0, W, H); RX.drawImage(MKc, 0, 0);
    RX.globalCompositeOperation = 'destination-out'; RX.drawImage(MKc, -lx * rw, -ly * rw);
    RX.globalCompositeOperation = 'source-in'; RX.fillStyle = `rgb(${(255 * (o.rimTone || .92)) | 0},${(ANG(Math.PI / 2) * 255) | 0},${o.kind === 'woman' ? 255 : 0})`; RX.fillRect(0, 0, W, H);
    FX.globalCompositeOperation = 'source-over'; FX.globalAlpha = rim; FX.drawImage(RCc, 0, 0); FX.globalAlpha = 1;
  }
  C.save(); C.setTransform(1, 0, 0, 1, 0, 0); C.globalAlpha = o.alpha === undefined ? 1 : o.alpha; C.drawImage(FCc, 0, 0); C.restore();
  if (o.kind !== 'woman') { RX.setTransform(1, 0, 0, 1, 0, 0); RX.globalCompositeOperation = 'source-over'; RX.clearRect(0, 0, W, H); RX.drawImage(MKc, 0, 0); RX.globalCompositeOperation = 'source-in'; RX.fillStyle = '#000'; RX.fillRect(0, 0, W, H);
    G.save(); G.setTransform(.5, 0, 0, .5, 0, 0); G.globalCompositeOperation = 'source-over'; G.globalAlpha = .9 * (o.alpha === undefined ? 1 : o.alpha); G.drawImage(RCc, 0, 0); G.restore(); }
  return res;
}
