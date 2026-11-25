'use strict';
// ====== SULUBOYA FİGÜRLER: Kasım ve Linda ======
const LOOK = {
  kasim: { coat: [44, 54, 78], coatS: [20, 26, 42], scarf: [132, 38, 42], legs: [42, 40, 44], shoe: [30, 24, 22], skin: [212, 166, 136], hair: [32, 26, 24], h: 1.86, coatLen: 2.4, sh: .84, hipW: .4 },
  linda: { coat: [198, 150, 94], coatS: [128, 86, 50], scarf: [214, 172, 62], legs: [58, 44, 44], shoe: [78, 44, 32], skin: [230, 186, 158], hair: [92, 56, 40], lips: [178, 62, 62], h: 1.68, coatLen: 1.95, sh: .72, hipW: .36 },
  extra: { coat: [96, 92, 90], coatS: [52, 50, 52], scarf: [80, 70, 64], legs: [50, 48, 50], shoe: [34, 30, 28], skin: [200, 160, 132], hair: [40, 34, 30], h: 1.8, coatLen: 2.6, sh: .82, hipW: .4 },
};
const add2 = (a, b) => [a[0] + b[0], a[1] + b[1]];
const dir2 = (a, l) => [Math.sin(a) * l, Math.cos(a) * l];
function fPose(o = {}) { return Object.assign({ st: .1, ab: [.12, .12], el: [.12, .12], fw: [0, 0], tilt: 0, turn: 0, nod: 0, kneel: 0, sway: 0 }, o); }
function sPose(o = {}) { return Object.assign({ lean: 0, nod: 0, th: [0, 0], kn: [.05, .05], sa: [.05, .05], ea: [.15, .15] }, o); }
function sWalk(ph, amt = 1, o = {}) { const Lg = k => { const p = ph + k * Math.PI; return [.4 * Math.sin(p) * amt, (.06 + .6 * Math.pow(Math.max(0, Math.cos(p)), 1.4)) * amt + .04]; };
  const f = Lg(0), n = Lg(1); return sPose(Object.assign({ lean: .04 * amt, th: [f[0], n[0]], kn: [f[1], n[1]], sa: [-.32 * Math.sin(ph + Math.PI) * amt, -.32 * Math.sin(ph) * amt], ea: [.2 + .2 * amt, .2 + .2 * amt] }, o)); }
const fWalk = (ph, o = {}) => fPose(Object.assign({ st: .06 + .07 * Math.abs(Math.sin(ph)), sway: .04 * Math.sin(ph), ab: [.1 + .08 * Math.sin(ph), .1 - .08 * Math.sin(ph)] }, o));
let LD = [-.6, -.8];
// boyalı uzuv: üç noktalı inceltilmiş fırça darbesi
function limb(a, b, c, wa, wb, wc, col, shadeK = .5) {
  const nrm = (p, q) => { const dx = q[0] - p[0], dy = q[1] - p[1], l = Math.hypot(dx, dy) || 1; return [-dy / l, dx / l]; };
  const n1 = nrm(a, b), n2 = nrm(b, c), nb = (() => { const x = n1[0] + n2[0], y = n1[1] + n2[1], l = Math.hypot(x, y) || 1; return [x / l, y / l]; })();
  const pts = [[a[0] + n1[0] * wa, a[1] + n1[1] * wa], [b[0] + nb[0] * wb, b[1] + nb[1] * wb], [c[0] + n2[0] * wc, c[1] + n2[1] * wc], [c[0] - n2[0] * wc, c[1] - n2[1] * wc], [b[0] - nb[0] * wb, b[1] - nb[1] * wb], [a[0] - n1[0] * wa, a[1] - n1[1] * wa]];
  const path = () => { C.beginPath(); C.moveTo(pts[0][0], pts[0][1]); C.quadraticCurveTo(pts[1][0], pts[1][1], pts[2][0], pts[2][1]); C.arc(c[0], c[1], wc, Math.atan2(n2[1], n2[0]), Math.atan2(n2[1], n2[0]) + Math.PI); C.quadraticCurveTo(pts[4][0], pts[4][1], pts[5][0], pts[5][1]); C.arc(a[0], a[1], wa, Math.atan2(-n1[1], -n1[0]), Math.atan2(-n1[1], -n1[0]) + Math.PI); C.closePath(); };
  path(); C.fillStyle = cs(col); C.fill();
  // gölge tarafı
  const m = [(a[0] + c[0]) / 2, (a[1] + c[1]) / 2], r = Math.max(wa, wb) * 1.3;
  C.save(); path(); C.clip(); C.globalCompositeOperation = 'multiply'; C.fillStyle = lgc(m[0] + LD[0] * r, m[1] + LD[1] * r, m[0] - LD[0] * r, m[1] - LD[1] * r, [[0, [255, 255, 255]], [.5, [255, 255, 255]], [1, shade(col, shadeK + .3)]]); C.fillRect(m[0] - 400, m[1] - 400, 800, 800); C.restore();
  return path;
}
function shapeFill(pts, col, sk = .55, cx, cy, r) { smooth(C, pts); C.fillStyle = cs(col); C.fill();
  C.save(); smooth(C, pts); C.clip(); C.globalCompositeOperation = 'multiply'; C.fillStyle = lgc(cx + LD[0] * r, cy + LD[1] * r, cx - LD[0] * r, cy - LD[1] * r, [[0, [255, 255, 255]], [.45, [255, 255, 255]], [1, shade(col, sk + .35)]]); C.fillRect(cx - 2000, cy - 2000, 4000, 4000);
  // aydınlık kenar: açık ton fırça
  C.globalCompositeOperation = 'screen'; C.fillStyle = lgc(cx + LD[0] * r * 1.05, cy + LD[1] * r * 1.05, cx + LD[0] * r * .6, cy + LD[1] * r * .6, [[0, [90, 80, 70]], [1, [0, 0, 0]]]); C.fillRect(cx - 2000, cy - 2000, 4000, 4000); C.restore(); }
function hand(p, ang, u, skin, s = 1) { C.save(); C.translate(p[0], p[1]); C.rotate(-ang); C.beginPath(); C.ellipse(0, .2 * u * s, .12 * u * s, .22 * u * s, 0, 0, TAU); C.fillStyle = cs(skin); C.fill(); C.beginPath(); C.ellipse(.09 * u * s, .1 * u * s, .045 * u * s, .1 * u * s, -.5, 0, TAU); C.fill(); C.restore(); }
// ---- ön yüz kafa ----
function headFront(cx, cy, u, Lk, o, who) {
  const hr = .5 * u, back = o.view === 'back', fem = who === 'linda';
  C.save(); C.translate(cx, cy); C.rotate((o.P.tilt || 0) * .6 + (o.P.nod || 0) * 0);
  const tf = (o.P.turn || 0) * .22 * hr;
  if (fem) { // uzun dalgalı saç (arka kütle)
    const wd = o.wind || 0; const pts = [[-.7, -.6], [-.92, .2], [-.98 - wd * .3, 1.0], [-1.05 - wd * .6, 1.75], [-.75 - wd * .6, 1.95], [-.55 - wd * .5, 1.55], [.55 - wd * .5, 1.55], [.75 - wd * .6, 1.95], [1.05 - wd * .6, 1.75], [.98 - wd * .3, 1.0], [.92, .2], [.7, -.6], [0, -1.15]].map(p => [p[0] * hr, p[1] * hr]);
    shapeFill(pts, Lk.hair, .5, 0, .6 * hr, 1.3 * hr); }
  // boyun
  C.fillStyle = cs(shade(Lk.skin, .85)); C.fillRect(-.28 * hr, .6 * hr, .56 * hr, .8 * hr);
  // yüz
  const face = [[0, -1.02], [.62, -.85], [.8, -.2], [.72, .45], [.42, .9], [0, 1.08], [-.42, .9], [-.72, .45], [-.8, -.2], [-.62, -.85]].map(p => [p[0] * hr * (fem ? .92 : 1), p[1] * hr]);
  shapeFill(face, back ? Lk.hair : Lk.skin, .55, 0, 0, hr * 1.1);
  if (!back) {
    // kulaklar
    if (!fem) for (const sd of [-1, 1]) { C.beginPath(); C.ellipse(sd * .82 * hr, 0, .14 * hr, .24 * hr, 0, 0, TAU); C.fillStyle = cs(shade(Lk.skin, .9)); C.fill(); }
    blob(-.42 * hr + tf, .32 * hr, .28 * hr, [226, 120, 110], fem ? .35 : .15); blob(.42 * hr + tf, .32 * hr, .28 * hr, [226, 120, 110], fem ? .35 : .15);
    if (!fem) blob(0, .72 * hr, .55 * hr, [90, 74, 66], .28, .5); // sakal gölgesi
    // gözler
    const ey = -.08 * hr, cl = o.closed;
    for (const sd of [-1, 1]) { const ex = sd * .34 * hr + tf;
      if (cl) pen([[ex - .16 * hr, ey + .02 * hr], [ex, ey + .07 * hr], [ex + .16 * hr, ey + .02 * hr]], Math.max(1, hr * .05), .9);
      else { C.beginPath(); C.ellipse(ex, ey, .15 * hr, .08 * hr, 0, 0, TAU); C.fillStyle = cs([240, 232, 222]); C.fill(); C.beginPath(); C.arc(ex + (o.look || 0) * .05 * hr, ey, .065 * hr, 0, TAU); C.fillStyle = cs([48, 34, 28]); C.fill();
        pen([[ex - .17 * hr, ey + .01 * hr], [ex, ey - .09 * hr], [ex + .17 * hr, ey - .01 * hr]], Math.max(1, hr * (fem ? .06 : .045)), .9); }
      pen([[ex - .2 * hr, ey - .22 * hr], [ex, ey - (fem ? .3 : .27) * hr], [ex + .2 * hr * sd, ey - .2 * hr]], Math.max(1, hr * (fem ? .04 : .07)), .8); }
    pen([[.05 * hr + tf, -.02 * hr], [.12 * hr + tf, .3 * hr], [-.02 * hr + tf, .36 * hr]], Math.max(.8, hr * .035), .6);
    const sm2 = o.smile === undefined ? .3 : o.smile;
    if (fem) { C.beginPath(); C.moveTo(-.2 * hr + tf, .6 * hr); C.quadraticCurveTo(tf, (.56 + .1 * sm2) * hr, .2 * hr + tf, .6 * hr); C.quadraticCurveTo(tf, (.75 + .05 * sm2) * hr, -.2 * hr + tf, .6 * hr); C.fillStyle = cs(Lk.lips); C.fill(); }
    pen([[-.18 * hr + tf, .6 * hr], [tf, (.6 + .08 * sm2) * hr], [.18 * hr + tf, .6 * hr]], Math.max(.8, hr * .04), .75);
  }
  // saç üstü
  if (fem) { for (const sd of [-1, 1]) { const pts = [[0, -1.08], [sd * .6, -1.0], [sd * .92, -.35], [sd * .85, .5], [sd * 1.0, 1.4], [sd * .72, 1.1], [sd * .66, .2], [sd * .5, -.6], [sd * .1, -.78]].map(p => [p[0] * hr, p[1] * hr]); shapeFill(pts, Lk.hair, .5, sd * .5 * hr, 0, hr); }
    for (let i = 0; i < 6; i++) { const sd = i % 2 ? 1 : -1; pen([[sd * .2 * hr, -.95 * hr], [sd * (.7 + i * .03) * hr, -.5 * hr], [sd * (.78 + i * .02) * hr, .4 * hr], [sd * (.85 + i * .03) * hr, 1.2 * hr]], Math.max(.7, hr * .025), .35, false, shade(Lk.hair, .5)); }
    if (back) for (let i = 0; i < 8; i++) pen([[(-.6 + i * .17) * hr, -.6 * hr], [(-.7 + i * .2) * hr, 1.0 * hr], [(-.8 + i * .22) * hr, 2.3 * hr]], Math.max(.7, hr * .025), .35, false, shade(Lk.hair, .5));
  } else { const pts = [[-.78, -.2], [-.82, -.7], [-.4, -1.12], [.2, -1.15], [.75, -.85], [.82, -.25], [.66, -.55], [.1, -.8], [-.5, -.72]].map(p => [p[0] * hr, p[1] * hr]); shapeFill(back ? [[-.82 * hr, .4 * hr], ...pts.slice(0, 6), [.82 * hr, .4 * hr]] : pts, Lk.hair, .5, 0, -.6 * hr, hr); }
  C.restore();
}
// ---- ön / arka görünüş ----
function personFront(o) {
  const Lk = Object.assign({}, LOOK[o.who || 'kasim'], o.look || {}), who = o.who || 'kasim', fem = who === 'linda';
  const h = o.h, u = h / 8, Pz = fPose(o.P || {}), back = o.view === 'back', wind = o.wind || 0;
  LD = o.L || [-.6, -.8];
  C.save(); C.translate(o.x, o.y); C.rotate(Pz.tilt * .3);
  const kn = Pz.kneel, hipY = -4 * u * (1 - kn * .3), sx = Pz.sway * u;
  // bacaklar
  const lw = (fem ? .17 : .26) * u;
  for (const sd of [-1, 1]) { const hx = sx + sd * Lk.hipW * u * .8, ax = sx * .3 + sd * (Lk.hipW * .7 + Pz.st) * u, kx = (hx + ax) / 2 + sd * .04 * u, ky = hipY + (-hipY) * (.5 - kn * .1);
    limb([hx, hipY], [kx, ky], [ax, -.15 * u], lw * 1.3, lw, lw * .8, Lk.legs, .5);
    C.beginPath(); C.ellipse(ax + sd * .06 * u, -.08 * u, (fem ? .16 : .22) * u, .11 * u, 0, 0, TAU); C.fillStyle = cs(Lk.shoe); C.fill();
    if (fem) { C.fillStyle = cs(Lk.shoe); C.fillRect(ax - lw * .9, -1.3 * u, lw * 1.8, 1.2 * u); } }
  // palto
  const hem = hipY + Lk.coatLen * u * (1 - kn * .4), shY = -6.45 * u * (1 - kn * .3) / (1 - kn * .3) + kn * 1.2 * u;
  const sw = Lk.sh * u, hw = (fem ? .95 : .78) * u + Pz.st * .5 * u;
  const body = [[sx - .3 * u, shY - .38 * u], [sx - sw * .7, shY - .2 * u], [sx - sw, shY + .3 * u], [sx - sw * .92, shY + 1.4 * u], [sx - (fem ? .55 : .74) * u, hipY - .3 * u], [sx - hw - wind * .5 * u, hem - .05 * u], [sx - wind * .45 * u, hem + .05 * u], [sx + hw - wind * .5 * u, hem - .05 * u], [sx + (fem ? .55 : .74) * u, hipY - .3 * u], [sx + sw * .92, shY + 1.4 * u], [sx + sw, shY + .3 * u], [sx + sw * .7, shY - .2 * u], [sx + .3 * u, shY - .38 * u]];
  shapeFill(body, Lk.coat, .5, sx, (shY + hem) / 2, 1.4 * u);
  if (!back) { // yaka, düğmeler, kemer
    pen([[sx - .05 * u, shY + .2 * u], [sx + .08 * u, hipY], [sx + .02 * u, hem]], Math.max(1, u * .03), .45);
    if (fem) pen([[sx - .55 * u, hipY - .45 * u], [sx + .55 * u, hipY - .45 * u]], Math.max(1, u * .06), .5, false, shade(Lk.coatS, .8));
    else for (let i = 0; i < 3; i++) for (const sd of [-1, 1]) { C.beginPath(); C.arc(sx + sd * .28 * u, shY + (1 + i * .55) * u, .055 * u, 0, TAU); C.fillStyle = cs(shade(Lk.coat, .5)); C.fill(); }
    // atkı
    const sc = [[sx - .45 * u, shY - .4 * u], [sx + .45 * u, shY - .4 * u], [sx + .4 * u, shY + .2 * u], [sx + .25 * u - wind * .2 * u, shY + 1.4 * u], [sx + .02 * u - wind * .2 * u, shY + 1.45 * u], [sx - .08 * u, shY + .25 * u], [sx - .4 * u, shY + .15 * u]];
    shapeFill(sc, Lk.scarf, .5, sx, shY, .6 * u);
  } else { const sc = [[sx - .45 * u, shY - .4 * u], [sx + .45 * u, shY - .4 * u], [sx + .42 * u, shY + .05 * u], [sx - .42 * u, shY + .05 * u]]; shapeFill(sc, Lk.scarf, .5, sx, shY, .5 * u); pen([[sx, shY + .3 * u], [sx, hem]], Math.max(1, u * .025), .35); }
  for (let i = -2; i <= 2; i++) if (i) pen([[sx + i * .25 * u, hipY + .1 * u], [sx + i * .33 * u - wind * .4 * u, hem - .05 * u]], Math.max(.7, u * .02), .25);
  // kollar
  const hands = [];
  for (const sd of [-1, 1]) { const i = sd < 0 ? 0 : 1, ab = Pz.ab[i], el = Pz.el[i], fw = 1 - .45 * (Pz.fw[i] || 0);
    const s0 = [sx + sd * (sw - .2 * u), shY + .2 * u], e = add2(s0, [Math.sin(ab) * sd * 1.45 * u * fw, Math.cos(ab) * 1.45 * u * fw]), a2 = ab + el, w = add2(e, [Math.sin(a2) * sd * 1.3 * u * fw, Math.cos(a2) * 1.3 * u * fw]);
    limb(s0, e, w, (fem ? .2 : .27) * u, (fem ? .17 : .23) * u, (fem ? .13 : .18) * u, Lk.coat, .5);
    if (!(o.pockets && o.pockets[i])) hand(w, a2 * sd, u, Lk.skin, fem ? .85 : 1);
    hands[i] = [o.x + w[0], o.y + w[1]]; }
  // kafa
  const hc = [sx * .6 + Pz.tilt * u * .5, shY - .86 * u];
  headFront(hc[0], hc[1], u, Lk, Object.assign({}, o, { P: Pz }), who);
  C.restore();
  return { hands, head: [o.x + hc[0], o.y + hc[1]], top: [o.x + hc[0], o.y + hc[1] - .55 * u] };
}
// ---- yan görünüş (profil, yürüme) ----
function headSide(cx, cy, a, u, Lk, o, who) {
  const s = u, fem = who === 'linda';
  C.save(); C.translate(cx, cy); C.rotate(a);
  if (fem) { const wd = o.wind || 0; shapeFill([[.1, -.55], [-.45, -.45], [-.62, .1], [-.7 - wd * .4, 1.1], [-.85 - wd * .8, 1.9], [-.35 - wd * .6, 1.7], [-.2, .9], [-.1, .3], [.15, -.2]].map(p => [p[0] * s, p[1] * s]), Lk.hair, .5, -.3 * s, .5 * s, .8 * s); }
  C.fillStyle = cs(shade(Lk.skin, .85)); C.fillRect(-.18 * s, .25 * s, .3 * s, .55 * s);
  const pr = [[-.05, -.55], [.22, -.48], [.34, -.3], [.36, -.12], [.35, -.06], [.44, .06], [.48, .13], [.39, .16], [.4, .23], [.36, .26], [.38, .31], [.33, .4], [.2, .49], [.03, .45], [-.14, .3], [-.32, .22], [-.42, 0], [-.4, -.32], [-.25, -.5]].map(p => [p[0] * s, p[1] * s]);
  shapeFill(pr, Lk.skin, .55, 0, 0, .5 * s);
  blob(.18 * s, .15 * s, .14 * s, [226, 120, 110], fem ? .35 : .12);
  if (!fem) blob(.15 * s, .35 * s, .25 * s, [90, 74, 66], .25, .6);
  C.beginPath(); C.ellipse(-.1 * s, .02 * s, .07 * s, .12 * s, .1, 0, TAU); C.fillStyle = cs(shade(Lk.skin, .85)); C.fill();
  if (o.closed) pen([[.18 * s, -.04 * s], [.25 * s, -.01 * s], [.31 * s, -.04 * s]], Math.max(1, s * .03), .9);
  else { C.beginPath(); C.ellipse(.26 * s, -.05 * s, .05 * s, .035 * s, 0, 0, TAU); C.fillStyle = cs([48, 34, 28]); C.fill(); pen([[.19 * s, -.08 * s], [.27 * s, -.1 * s], [.33 * s, -.06 * s]], Math.max(1, s * .03), .9); }
  pen([[.16 * s, -.17 * s], [.27 * s, -.2 * s], [.35 * s, -.16 * s]], Math.max(1, s * (fem ? .025 : .045)), .8);
  if (fem) { C.beginPath(); C.ellipse(.38 * s, .27 * s, .04 * s, .035 * s, 0, 0, TAU); C.fillStyle = cs(Lk.lips); C.fill(); }
  pen([[.3 * s, .26 * s], [.38 * s, .265 * s]], Math.max(.8, s * .02), .7);
  pen(pr.slice(2, 13), Math.max(.8, s * .02), .35);
  if (fem) { shapeFill([[.32, -.32], [.05, -.62], [-.45, -.45], [-.55, .05], [-.25, .1], [-.05, -.2], [.2, -.3]].map(p => [p[0] * s, p[1] * s]), Lk.hair, .5, 0, -.3 * s, .6 * s); }
  else shapeFill([[.3, -.36], [.18, -.56], [-.1, -.6], [-.38, -.46], [-.46, -.1], [-.38, .1], [-.22, .02], [-.18, -.22], [.05, -.34]].map(p => [p[0] * s, p[1] * s]), Lk.hair, .5, 0, -.3 * s, .6 * s);
  C.restore();
}
function personSide(o) {
  const Lk = Object.assign({}, LOOK[o.who || 'kasim'], o.look || {}), who = o.who || 'kasim', fem = who === 'linda';
  const h = o.h, u = h / 8, Pz = sPose(o.P || {}), dr = o.dir || 1, wind = o.wind || 0;
  LD = [(o.L || [-.6, -.8])[0] * dr, (o.L || [-.6, -.8])[1]];
  C.save(); C.translate(o.x, o.y); C.scale(dr, 1);
  const hip = [0, -4 * u], up = [Math.sin(Pz.lean), -Math.cos(Pz.lean)];
  const shd = add2(hip, [up[0] * 2.5 * u, up[1] * 2.5 * u]), neck = add2(hip, [up[0] * 2.85 * u, up[1] * 2.85 * u]);
  const legs = [0, 1].map(i => { const th = Pz.th[i], kn = Pz.kn[i], k = add2(hip, dir2(th, 1.98 * u)), an = add2(k, dir2(th - kn, 1.92 * u)); return { k, an }; });
  let low = -1e9; for (const Lg of legs) low = Math.max(low, Lg.an[1] + .1 * u); const dy = -low; const T = p => [p[0], p[1] + dy];
  const arms = [0, 1].map(i => { const sa = Pz.sa[i] + Pz.lean, ea = Pz.ea[i], s0 = add2(shd, [0, .15 * u]), e = add2(s0, dir2(sa, 1.45 * u)), w = add2(e, dir2(sa + ea, 1.3 * u)); return { s0, e, w, a: sa + ea }; });
  const lw = (fem ? .17 : .26) * u, aw = (fem ? .19 : .26) * u;
  const drawArm = (A, far) => { limb(T(A.s0), T(A.e), T(A.w), aw, aw * .85, aw * .7, far ? shade(Lk.coat, .7) : Lk.coat, .5); if (!(o.holdUmb && !far)) hand(T(A.w), A.a, u, far ? shade(Lk.skin, .8) : Lk.skin, fem ? .85 : 1); };
  const drawLeg = (Lg, far) => { const cl = far ? shade(Lk.legs, .7) : Lk.legs; limb(T(hip), T(Lg.k), T(Lg.an), lw * 1.3, lw, lw * .8, cl, .5);
    const a = T(Lg.an); C.beginPath(); C.ellipse(a[0] + .12 * u, a[1] + .02 * u, (fem ? .2 : .26) * u, .1 * u, 0, 0, TAU); C.fillStyle = cs(far ? shade(Lk.shoe, .7) : Lk.shoe); C.fill();
    if (fem) { limb(T(add2(Lg.k, dir2(Pz.th[0], .3 * u))), T(add2(Lg.k, [0, .8 * u])), T(Lg.an), lw * 1.15, lw * 1.1, lw * 1.0, far ? shade(Lk.shoe, .7) : Lk.shoe, .5); } };
  drawArm(arms[0], 1); drawLeg(legs[0], 1); drawLeg(legs[1], 0);
  const tor = (x, y) => T(add2(hip, add2([-up[1] * x * u, up[0] * x * u], [up[0] * -y * u, up[1] * -y * u])));
  const hemY = T(hip)[1] + Lk.coatLen * u;
  const xs = legs.map(Lg => { const a = T(hip), b = T(Lg.k), c = T(Lg.an); const y = hemY; if (y <= b[1]) return lerp(a[0], b[0], clamp((y - a[1]) / ((b[1] - a[1]) || 1))); return lerp(b[0], c[0], clamp((y - b[1]) / ((c[1] - b[1]) || 1))); });
  const hb = Math.min(...xs) - (fem ? .5 : .4) * u - wind * u, hf = Math.max(...xs) + (fem ? .45 : .35) * u - wind * .5 * u;
  const body = [tor(-.2, -2.9), tor(-.5, -2.55), tor(-.55, -1.6), tor(-.5, -.3), [hb, hemY - .1 * u], [(hb + hf) / 2, hemY + .06 * u], [hf, hemY - .06 * u], tor(fem ? .45 : .5, -.2), tor(fem ? .4 : .48, -1.0), tor(fem ? .55 : .55, -1.9), tor(.45, -2.55), tor(.2, -2.9)];
  const tc = tor(0, -1.4); shapeFill(body, Lk.coat, .5, tc[0], tc[1], 1.3 * u);
  pen([tor(.3, -2.5), tor(.25, -1.2), [lerp(hb, hf, .75), hemY]], Math.max(.8, u * .025), .4);
  if (fem) pen([tor(-.5, -1.1), tor(.45, -1.1)], Math.max(1, u * .05), .5, false, shade(Lk.coatS, .8));
  const sc = [tor(-.3, -2.95), tor(.3, -2.95), tor(.35, -2.6), tor(.3 - wind * .6, -1.7), tor(.12 - wind * .6, -1.7), tor(.05, -2.5), tor(-.3, -2.6)]; shapeFill(sc, Lk.scarf, .5, tor(0, -2.6)[0], tor(0, -2.6)[1], .5 * u);
  const ha = Pz.lean + Pz.nod, hc = T(add2(neck, [Math.sin(ha) * .6 * u, -Math.cos(ha) * .6 * u]));
  headSide(hc[0], hc[1], ha, u, Lk, o, who);
  drawArm(arms[1], 0);
  C.restore();
  const W2 = p => [o.x + p[0] * dr, o.y + p[1]];
  return { hands: arms.map(A => W2(T(A.w))), head: W2(hc), top: W2([hc[0], hc[1] - .55 * u]) };
}
function person(o) { return o.view === 'side' ? personSide(o) : personFront(o); }
// ---- şemsiye ----
function umbrella(x, y, r, tilt = 0, col = [176, 36, 40], open = 1, rain = 0) {
  C.save(); C.translate(x, y); C.rotate(tilt);
  const ry = r * .5 * open; // kubbe yüksekliği
  strokeHandle(0, 0, r * 1.35);
  if (open < .2) { C.restore(); return; }
  const n = 8, pts = [];
  for (let i = 0; i <= n; i++) { const a = Math.PI + i / n * Math.PI; pts.push([Math.cos(a) * r, Math.sin(a) * ry]); }
  C.beginPath(); C.moveTo(-r, 0); C.ellipse(0, 0, r, ry, 0, Math.PI, TAU);
  for (let i = n; i > 0; i--) { const x0 = pts[i][0], x1 = pts[i - 1][0]; C.quadraticCurveTo((x0 + x1) / 2, r * .1 * open, x1, 0); }
  C.closePath(); C.fillStyle = cs(col); C.fill();
  C.save(); C.clip(); C.globalCompositeOperation = 'multiply'; C.fillStyle = lgc(-r, -ry, r, 0, [[0, [255, 255, 255]], [.5, [235, 225, 225]], [1, shade(col, .7)]]); C.fillRect(-r, -ry, 2 * r, ry + r * .2); C.restore();
  for (let i = 1; i < n; i++) pen([[0, -ry], [pts[i][0] * .5, pts[i][1] * .7], [pts[i][0], 0]], Math.max(.8, r * .008), .45);
  pen([[0, -ry], [0, -ry - r * .1]], Math.max(1, r * .02), .8);
  if (rain) for (let i = 0; i < 14; i++) { const xx = (i / 13 - .5) * 2 * r * .95; blob(xx, r * .05, r * .02, [170, 190, 210], .5); }
  C.restore();
}
function strokeHandle(x, y, len) { pen([[x, y - len * .3], [x, y + len * .85], [x + len * .06, y + len * .95], [x + len * .12, y + len * .87]], Math.max(1.2, len * .018), .85); }
