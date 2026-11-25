'use strict';
// ====== HAMUR KARAKTERLER ======
const SKIN = [236, 186, 150], SKIN2 = [214, 160, 124];
const CAST = {
  usta: { skin: [222, 170, 132], coat: [50, 58, 50], inner: [26, 26, 30], pants: [30, 30, 34], shoe: [24, 22, 22], belly: 1.0, tall: 1.18, bald: 1, glasses: 'round' },
  huseyin: { skin: SKIN, coat: null, shirt: [242, 238, 226], pants: [72, 92, 134], shoe: [70, 130, 190], hair: [40, 30, 26], belly: 1.38, tall: .95, mustache: 1 },
  asist: { skin: [240, 196, 168], coat: [34, 32, 36], inner: [60, 60, 66], pants: [30, 30, 34], shoe: [24, 22, 22], hair: [22, 20, 24], belly: .88, tall: 1.05, glasses: 'slim', bob: 1 },
  ajan: { skin: [220, 184, 156], coat: [36, 38, 44], inner: [240, 240, 236], pants: [36, 38, 44], shoe: [20, 20, 20], hair: [30, 28, 26], belly: .95, tall: 1.12, glasses: 'slim', tie: 1 },
  anne: { skin: [236, 190, 160], coat: [150, 90, 120], pants: [90, 70, 90], shoe: [80, 60, 60], hair: [220, 220, 220], belly: 1.15, tall: .85, scarf: [200, 70, 90] },
  akraba: { skin: [226, 178, 140], coat: [120, 140, 100], pants: [70, 70, 80], shoe: [50, 40, 40], hair: [60, 44, 36], belly: 1.1, tall: .9 },
};
// yüz
function face(cx, cy, r, K, o) {
  const f = o.face || 0, fx = f * .3 * r, look = o.look === undefined ? f : o.look;
  // kulaklar
  for (const sd of [-1, 1]) if (Math.abs(sd - f * 1.4) > .3) ball(cx + sd * .93 * r + fx * .4, cy + .05 * r, .17 * r, .24 * r, shade(K.skin, .95), 0, { spec: .1 });
  ball(cx, cy, r, r * 1.02, K.skin, 0, { spec: K.bald ? .5 : .25 });
  // saç
  if (K.bald) { } else if (K.bob) { C.save(); C.beginPath(); C.ellipse(cx, cy - .1 * r, 1.08 * r, 1.05 * r, 0, Math.PI * .95, Math.PI * 2.05); C.lineTo(cx + 1.08 * r, cy + .55 * r); C.quadraticCurveTo(cx + .9 * r, cy + .7 * r, cx + .72 * r, cy + .5 * r); C.quadraticCurveTo(cx + .5 * r + fx, cy - .5 * r, cx + fx * .5, cy - .55 * r); C.quadraticCurveTo(cx - .5 * r + fx, cy - .5 * r, cx - .72 * r, cy + .5 * r); C.quadraticCurveTo(cx - .9 * r, cy + .7 * r, cx - 1.08 * r, cy + .55 * r); C.closePath(); C.restore(); blobShapeCur(K.hair); }
  else if (K.hair && !K.mustache) { ball(cx + fx * .3, cy - .62 * r, .9 * r, .45 * r, K.hair, 0, { spec: .15 }); }
  else if (K.mustache) { for (const sd of [-1, 1]) ball(cx + sd * .86 * r + fx * .3, cy - .12 * r, .13 * r, .28 * r, K.hair, sd * .2, { spec: .1 }); ball(cx + fx * .2, cy - .9 * r, .35 * r, .12 * r, K.hair, 0, { spec: .1 }); }
  if (K.hair && K === CAST.anne) { ball(cx, cy - .7 * r, .95 * r, .5 * r, K.hair); ball(cx, cy - 1.05 * r, .35 * r, .3 * r, K.hair); }
  if (K.scarf) { C.save(); C.beginPath(); C.ellipse(cx, cy - .15 * r, 1.12 * r, 1.12 * r, 0, Math.PI, TAU); C.lineTo(cx + 1.0 * r, cy + .7 * r); C.lineTo(cx + .78 * r, cy + .72 * r); C.quadraticCurveTo(cx + .8 * r, cy - .6 * r, cx, cy - .62 * r); C.quadraticCurveTo(cx - .8 * r, cy - .6 * r, cx - .78 * r, cy + .72 * r); C.lineTo(cx - 1.0 * r, cy + .7 * r); C.closePath(); C.restore(); blobShapeCur(K.scarf); }
  // gözler
  const ey = cy - .05 * r, eo2 = o.eyes || 'open';
  if (K.glasses && !o.noGlasses) {
    const gw = K.glasses === 'round' ? .3 : .34, gh = K.glasses === 'round' ? .3 : .2;
    for (const sd of [-1, 1]) ball(cx + sd * .38 * r + fx, ey, gw * r, gh * r, [20, 22, 26], 0, { spec: .55, dark: .9 });
    sausage([cx - .1 * r + fx, ey - .03 * r], [cx + .1 * r + fx, ey - .03 * r], .03 * r, [30, 30, 34]);
  } else for (const sd of [-1, 1]) { const ex = cx + sd * .36 * r + fx;
    if (eo2 === 'closed' || eo2 === 'happy') { C.beginPath(); C.arc(ex, ey + (eo2 === 'happy' ? .06 : -.02) * r, .14 * r, eo2 === 'happy' ? Math.PI * 1.1 : .1, eo2 === 'happy' ? Math.PI * 1.9 : Math.PI - .1); C.strokeStyle = cs([40, 28, 26]); C.lineWidth = .05 * r; C.lineCap = 'round'; C.stroke(); }
    else { const big = eo2 === 'wide' ? 1.3 : eo2 === 'squint' ? .75 : 1; ball(ex, ey, .2 * r * big, .24 * r * big * (eo2 === 'squint' ? .5 : 1), [250, 250, 246], 0, { spec: .4, dark: .85 });
      ball(ex + look * .07 * r, ey + .03 * r, .09 * r * (eo2 === 'wide' ? .8 : 1), .1 * r * (eo2 === 'squint' ? .5 : 1), [30, 24, 24], 0, { spec: .6 });
      if (o.lids) { C.fillStyle = cs(shade(K.skin, .9)); C.beginPath(); C.ellipse(ex, ey - .05 * r, .22 * r * big, .14 * r * o.lids, 0, Math.PI, TAU); C.fill(); } } }
  // kaşlar
  const bw = o.brow || 0; // + kızgın, - üzgün/şaşkın
  for (const sd of [-1, 1]) { const bx = cx + sd * .37 * r + fx, by = ey - (K.glasses && !o.noGlasses ? .38 : .33) * r - (o.raise || 0) * .12 * r; const tilt = bw * .3 * sd;
    sausage([bx - .18 * r, by - Math.sin(tilt) * .18 * r * -1], [bx + .18 * r, by + Math.sin(tilt) * .18 * r * -1], (K.mustache ? .065 : .045) * r, K.bald ? shade(K.skin, .6) : (K.hair || [40, 30, 26])); }
  // burun
  ball(cx + fx * 1.3, cy + .2 * r, (K.mustache ? .2 : .14) * r, (K.mustache ? .17 : .13) * r, shade(K.skin, .92), 0, { spec: .35 });
  // ağız
  const mo = clamp(o.mouth || 0), mx = cx + fx * 1.1, my = cy + .55 * r, sm2 = o.smile || 0;
  if (mo > .05) { C.save(); C.beginPath(); C.ellipse(mx, my + mo * .05 * r, (.2 + .05 * sm2) * r, (.05 + .2 * mo) * r, 0, 0, TAU); C.fillStyle = cs([90, 30, 30]); C.fill(); C.clip(); ball(mx, my + (.1 + .2 * mo) * r, .14 * r, .08 * r, [220, 110, 110], 0, { spec: .2 }); C.fillStyle = cs([250, 248, 240]); C.fillRect(mx - .2 * r, my - (.05 + .2 * mo) * r, .4 * r, .07 * r); C.restore(); }
  else { C.beginPath(); C.moveTo(mx - .17 * r, my - sm2 * .04 * r); C.quadraticCurveTo(mx, my + sm2 * .12 * r, mx + .17 * r, my - sm2 * .04 * r); C.strokeStyle = cs([90, 40, 36]); C.lineWidth = .045 * r; C.lineCap = 'round'; C.stroke(); }
  if (K.mustache) { for (const sd of [-1, 1]) ball(mx + sd * .17 * r, my - .2 * r - mo * .03 * r, .22 * r, .1 * r, K.hair, sd * -.25, { spec: .15 }); }
  if (o.blush) for (const sd of [-1, 1]) ball(cx + sd * .55 * r + fx, cy + .3 * r, .13 * r, .08 * r, [240, 140, 130], 0, { spec: 0 });
  if (o.sweat) { const sy = cy - .5 * r + ((o.t || 0) * 40 % 30); ball(cx + .8 * r + fx, sy, .07 * r, .1 * r, [170, 210, 240], 0, { spec: .7 }); }
}
function blobShapeCur(col) { C.save(); C.clip(); const b = C.getTransform(); C.fillStyle = cs(col); C.fillRect(-4000, -4000, 8000, 8000); C.restore(); }
// gövde ve uzuvlar. Yerel: ayak tabanı (x,y), r = kafa yarıçapı
function toon(o) {
  const K = CAST[o.who], r = o.r, x = o.x, y = o.y, f = o.face || 0, sit = o.sit || 0, bob = (o.bob || 0) * r;
  const tall = K.tall, bl = K.belly;
  const hipY = y - (1.4 - sit * .7) * r * tall + bob * .3, bodyC = hipY - 1.05 * r * tall, shY = hipY - 1.9 * r * tall + bob * .6, headY = shY - .95 * r + bob;
  // bacaklar
  const legC = K.pants, st = o.st || .45;
  if (!o.noLegs) for (const sd of [-1, 1]) { const hx = x + sd * .4 * r * bl, kx = x + sd * st * r * bl + (sit ? f * .6 * r : 0), ky = sit ? hipY + .15 * r : hipY + .7 * r * tall, ax = x + sd * st * r * bl + (sit ? f * .7 * r : 0) + (o.walk ? Math.sin(o.walk + (sd > 0 ? Math.PI : 0)) * .35 * r : 0), ay = y - .15 * r - (o.walk ? Math.max(0, Math.sin(o.walk + (sd > 0 ? Math.PI : 0))) * .25 * r : 0);
    limbS([[hx, hipY], [kx, ky], [ax, ay]], .28 * r * Math.min(1.15, bl), legC);
    ball(ax + f * .15 * r, ay + .05 * r, .32 * r, .17 * r, K.shoe, 0, { spec: .4 }); }
  // gövde
  const bodyCol = K.coat || K.shirt;
  if (K.coat && K !== CAST.anne && K !== CAST.akraba) { // uzun palto etekleri
    C.save(); const hem = o.who === 'usta' ? y - .45 * r : hipY + .2 * r; blobShape([[x - .85 * r * bl, shY + .2 * r], [x - 1.05 * r * bl, hipY], [x - 1.0 * r * bl, hem], [x - .2 * r, hem + .1 * r], [x + .2 * r, hem + .1 * r], [x + 1.0 * r * bl, hem], [x + 1.05 * r * bl, hipY], [x + .85 * r * bl, shY + .2 * r]], K.coat); C.restore();
    ball(x + f * .15 * r, bodyC - .3 * r, .42 * r * bl, 1.0 * r * tall, K.inner, 0, { spec: .15 });
    if (K.tie) sausage([x + f * .15 * r, shY + .25 * r], [x + f * .15 * r, bodyC + .2 * r], .07 * r, [30, 30, 36], .1 * r);
    for (const sd of [-1, 1]) blobShape([[x + sd * .2 * r + f * .1 * r, shY + .1 * r], [x + sd * .62 * r * bl, shY + .2 * r], [x + sd * .5 * r * bl, bodyC + .3 * r], [x + sd * .3 * r, bodyC + .1 * r]], shade(K.coat, 1.15));
  } else { ball(x, bodyC, 1.0 * r * bl, 1.12 * r * tall, bodyCol, 0, { spec: .2 });
    if (o.who === 'huseyin') { // atlet askıları + leke + göbek
      for (const sd of [-1, 1]) ball(x + sd * .5 * r, shY + .25 * r, .28 * r, .15 * r, SKIN, sd * .4, { spec: .1 }); ball(x + .3 * r + f * .2 * r, bodyC + .3 * r, .14 * r, .1 * r, [210, 190, 140], 0, { spec: 0 }); ball(x + f * .25 * r, bodyC + .55 * r, .07 * r, .05 * r, shade(SKIN, .7), 0, { spec: 0 }); }
    if (K.scarf) ball(x, shY + .25 * r, .7 * r, .3 * r, K.scarf); }
  // kollar
  const arm = (sd, A) => { const i = sd < 0 ? 0 : 1, a1 = A ? A[0] : .25, a2 = A ? A[1] : .15; const s0 = [x + sd * .82 * r * bl, shY + .3 * r], e = [s0[0] + Math.sin(a1) * sd * 1.0 * r, s0[1] + Math.cos(a1) * 1.0 * r], h = [e[0] + Math.sin(a1 + a2) * sd * .95 * r, e[1] + Math.cos(a1 + a2) * .95 * r];
    const ac = o.who === 'huseyin' ? SKIN : K.coat; limbS([s0, e, h], .23 * r, ac); ball(h[0], h[1], .26 * r, .24 * r, K.skin, 0, { spec: .35 }); ball(h[0] - sd * .2 * r, h[1] - .06 * r, .09 * r, .14 * r, K.skin, sd * .5, { spec: .2 }); return h; };
  const hands = [arm(-1, o.arms && o.arms[0]), arm(1, o.arms && o.arms[1])];
  // kafa
  face(x + (o.lean || 0) * r, headY, r, K, o);
  return { hands, head: [x, headY], r };
}
// ---- aksesuarlar ----
function pill(x, y, s, col, rot = 0) { C.save(); C.translate(x, y); C.rotate(rot); sausage([-s, 0], [s, 0], s * .55, col); C.restore(); glowC(x, y, s * 2.5, col, .25); }
function tespih(x, y, s, t) { for (let i = 0; i < 9; i++) { const a = i / 9 * TAU * .8 + Math.sin(t * 3) * .3; ball(x + Math.sin(a) * s * .5, y + s * .4 + Math.cos(a) * s * .6, s * .09, s * .09, [150, 96, 50], 0, { spec: .6 }); } }
function armchair(x, y, s, col = [140, 40, 36], dir = 1) { // y: zemin
  slab(x - s * .95, y - s * 1.9, s * 1.9, s * 1.5, shade(col, .85), s * .35); // sırt
  slab(x - s * 1.05, y - s * .85, s * 2.1, s * .75, col, s * .2); // oturak
  for (const sd of [-1, 1]) slab(x + sd * s * .9 - s * .22, y - s * 1.2, s * .44, s * 1.05, tintc(col, .05), s * .2);
  for (const sd of [-1, 1]) ball(x + sd * s * .8, y - s * .05, s * .1, s * .08, [60, 40, 30]);
}
function armchairFront(x, y, s, col = [140, 40, 36]) { for (const sd of [-1, 1]) slab(x + sd * s * .9 - s * .22, y - s * 1.2, s * .44, s * 1.05, tintc(col, .05), s * .2); }
