'use strict';
// ====== KARAKTERLER (yağlı boya portre) ======
const PEOPLE = {
  halil: { skin: [214, 170, 140], hair: [228, 226, 222], hairStyle: 'bald', must: [236, 234, 230], brow: [220, 218, 214], iris: [120, 126, 130], age: 1, top: [120, 112, 104], top2: [170, 160, 140], shirt: [180, 190, 200], pants: [80, 78, 82] },
  yusuf: { skin: [222, 180, 150], hair: [36, 30, 28], hairStyle: 'messy', stub: 1, brow: [40, 32, 30], iris: [90, 60, 40], bags: 1, top: [52, 62, 82], top2: [70, 80, 100], shirt: [150, 150, 150], pants: [44, 44, 52] },
  genc: { skin: [218, 168, 128], hair: [30, 24, 22], hairStyle: 'combed', must: [34, 28, 26], brow: [30, 24, 22], iris: [90, 60, 40], top: [236, 230, 216], top2: [236, 230, 216], shirt: [236, 230, 216], pants: [70, 70, 80], broad: 1.12 },
  cocuk: { skin: [236, 196, 166], hair: [80, 52, 36], hairStyle: 'bowl', brow: [80, 52, 36], iris: [90, 60, 40], top: [190, 50, 50], top2: [200, 60, 60], shirt: [190, 50, 50], pants: [60, 80, 130], child: 1 },
  arkadas: { skin: [206, 160, 126], hair: [40, 34, 30], hairStyle: 'cap', stub: 1, brow: [40, 34, 30], iris: [80, 56, 40], top: [70, 90, 110], top2: [90, 110, 130], shirt: [70, 90, 110], pants: [60, 70, 80] },
  anne: { skin: [226, 186, 160], hair: [70, 50, 40], hairStyle: 'scarf', brow: [70, 50, 40], iris: [80, 60, 40], top: [120, 80, 90] },
};
// ---- kafa: x,y merkez, r = yarım kafa yüksekliği ----
function head(o) {
  const P = PEOPLE[o.who], r = o.r, x = o.x, y = o.y, tn = o.turn || 0, tf = tn * .32 * r, eyes = o.eyes || 'open', mo = o.mouth || 0, smile = o.smile || 0;
  LD = o.L || LD;
  // boyun
  poly([[x - .34 * r + tf * .3, y + .4 * r], [x + .34 * r + tf * .3, y + .4 * r], [x + .4 * r + tf * .3, y + 1.3 * r], [x - .4 * r + tf * .3, y + 1.3 * r]]); C.fillStyle = lgr(x, y + .5 * r, x, y + 1.3 * r, [[0, shade(P.skin, .55)], [1, shade(P.skin, .8)]]); C.fill();
  // saç arkası (kafa üstü dışı)
  if (P.hairStyle === 'messy' || P.hairStyle === 'combed' || P.hairStyle === 'bowl') form(ell(x + tf * .2, y - .3 * r, .82 * r, .78 * r, 18), shade(P.hair, .8), { n: 6, hi: .05 });
  if (P.hairStyle === 'scarf') form([[x - .95 * r, y - .2 * r], [x, y - 1.15 * r], [x + .95 * r, y - .2 * r], [x + 1.0 * r, y + 1.0 * r], [x - 1.0 * r, y + 1.0 * r]], P.top, { n: 6 });
  // kulaklar
  for (const sd of [-1, 1]) { const vis = 1 - Math.max(0, sd * tn) * 1.2; if (vis <= .1) continue; form(ell(x + sd * .74 * r * (1 - .25 * Math.max(0, sd * tn)) + tf * .2, y + .02 * r, .13 * r * vis, .22 * r, 10), shade(P.skin, .9), { n: 2 }); }
  // yüz şekli (döndükçe uzak taraf daralır)
  const sq = (dx) => dx * (Math.sign(dx) === Math.sign(tn) ? 1 - .28 * Math.abs(tn) : 1 + .05 * Math.abs(tn));
  const F = [[0, -1.0], [.5, -.92], [.72, -.55], [.76, -.1], [.7, .3], [.55, .62], [.3, .88], [0, .98], [-.3, .88], [-.55, .62], [-.7, .3], [-.76, -.1], [-.72, -.55], [-.5, -.92]].map(p => [x + sq(p[0] * r * (P.child ? 1.08 : 1)) + tf * .25, y + p[1] * r]);
  if (o.view === 'back') { form(F, P.hairStyle === 'bald' ? P.skin : P.hair, { n: 10, hi: .15, lo: .6 }); if (P.hairStyle === 'bald') { form([[x - .8 * r, y - .1 * r], [x - .7 * r, y + .5 * r], [x, y + .75 * r], [x + .7 * r, y + .5 * r], [x + .8 * r, y - .1 * r], [x, y + .3 * r]], P.hair, { n: 4 }); } return; }
  form(F, P.skin, { n: 14, hi: .2, lo: .62, seed: 7 });
  C.save(); path(F); C.clip();
  // yüz düzlemi gölgeleri
  blob(x - Math.sign(tn || 1) * .62 * r + tf * .2, y + .1 * r, .55 * r, shade(P.skin, .72), .45, 1.4);
  for (const sd of [-1, 1]) { const ex = x + sq(sd * .32 * r) + tf; blob(ex, y - .1 * r, .26 * r, shade(P.skin, .78), .55, .8); if (P.bags) blob(ex, y + .06 * r, .2 * r, [120, 90, 120], .4, .4); if (P.age) blob(ex, y + .08 * r, .2 * r, shade(P.skin, .8), .35, .35); }
  blob(x + tf * 1.15 + .1 * r, y + .25 * r, .14 * r, shade(P.skin, .7), .5, 1.6); // burun gölgesi
  blob(x + tf * 1.1 - .06 * r, y + .05 * r, .07 * r, tint(P.skin, .35), .7, 2.4); // burun sırtı ışığı
  blob(x + tf * .9, y + .78 * r, .3 * r, shade(P.skin, .78), .5, .5); // çene altı
  blob(x + tf * 1.15, y + .3 * r, .11 * r, tint(P.skin, .1), .6, .8); for (const sd of [-1, 1]) blob(x + tf * 1.15 + sd * .08 * r, y + .36 * r, .045 * r, shade(P.skin, .45), .8, .7);
  for (const sd of [-1, 1]) blob(x + sq(sd * .45 * r) + tf, y + .35 * r, .2 * r, [220, 120, 110], P.child ? .35 : .18);
  if (P.stub) blob(x + tf * .8, y + .62 * r, .55 * r, [70, 70, 84], .22, .55);
  if (P.age) { C.strokeStyle = cs(shade(P.skin, .62), .7); C.lineWidth = .02 * r; for (let i = 0; i < 3; i++) { C.beginPath(); C.moveTo(x - .35 * r + tf, y - (.58 - i * .1) * r); C.quadraticCurveTo(x + tf, y - (.62 - i * .1) * r, x + .35 * r + tf, y - (.58 - i * .1) * r); C.stroke(); }
    for (const sd of [-1, 1]) { C.beginPath(); C.moveTo(x + sd * .2 * r + tf * 1.1, y + .3 * r); C.quadraticCurveTo(x + sd * .32 * r + tf, y + .55 * r, x + sd * .28 * r + tf, y + .72 * r); C.stroke(); for (let k = 0; k < 2; k++) { C.beginPath(); C.moveTo(x + sq(sd * .55 * r) + tf, y - .08 * r + k * .07 * r); C.lineTo(x + sq(sd * .68 * r) + tf, y - .12 * r + k * .1 * r); C.stroke(); } } }
  C.restore();
  // gözler
  for (const sd of [-1, 1]) { const ex = x + sq(sd * .32 * r) + tf, ey = y - .08 * r, ew = .19 * r * (Math.sign(sd) === Math.sign(tn) ? 1 - .3 * Math.abs(tn) : 1);
    if (eyes === 'closed') { C.strokeStyle = cs(shade(P.skin, .4)); C.lineWidth = .035 * r; C.beginPath(); C.moveTo(ex - ew, ey); C.quadraticCurveTo(ex, ey + .06 * r, ex + ew, ey); C.stroke(); continue; }
    const op = eyes === 'tired' ? .6 : eyes === 'wide' ? 1.15 : 1;
    C.save(); C.beginPath(); C.moveTo(ex - ew, ey); C.quadraticCurveTo(ex, ey - .16 * r * op, ex + ew, ey); C.quadraticCurveTo(ex, ey + .1 * r, ex - ew, ey); C.closePath(); C.fillStyle = cs([236, 230, 222]); C.fill(); C.clip();
    const lk = (o.look === undefined ? tn * .5 : o.look) * .05 * r;
    blob(ex + lk, ey - .01 * r, .12 * r, P.iris, 1); C.beginPath(); C.arc(ex + lk, ey - .01 * r, .09 * r, 0, TAU); C.fillStyle = cs(P.iris); C.fill(); C.beginPath(); C.arc(ex + lk, ey - .01 * r, .042 * r, 0, TAU); C.fillStyle = cs([20, 16, 16]); C.fill();
    if (eyes !== 'blank') { C.beginPath(); C.arc(ex + lk - .03 * r, ey - .045 * r, .025 * r, 0, TAU); C.fillStyle = 'rgba(255,255,255,.9)'; C.fill(); } else { C.fillStyle = 'rgba(200,205,210,.35)'; C.fillRect(ex - ew, ey - .2 * r, 2 * ew, .4 * r); }
    if (eyes === 'wet') { C.fillStyle = 'rgba(255,255,255,.35)'; C.fillRect(ex - ew, ey + .02 * r, 2 * ew, .03 * r); }
    C.fillStyle = cs(shade(P.skin, .85)); C.fillRect(ex - ew - 2, ey - .2 * r, 2 * ew + 4, .2 * r * (1 - op) * 1.2); C.restore();
    C.strokeStyle = cs([34, 24, 22], .95); C.lineWidth = .05 * r; C.lineCap = 'round'; C.beginPath(); C.moveTo(ex - ew * 1.05, ey + .01 * r); C.quadraticCurveTo(ex, ey - .17 * r * op + (1 - op) * .07 * r, ex + ew * 1.08, ey - .01 * r); C.stroke(); C.strokeStyle = cs(shade(P.skin, .6), .7); C.lineWidth = .025 * r; C.beginPath(); C.moveTo(ex - ew * .8, ey + .08 * r); C.quadraticCurveTo(ex, ey + .12 * r, ex + ew * .8, ey + .07 * r); C.stroke(); C.beginPath(); C.moveTo(ex - ew * .9, ey - .2 * r * op); C.quadraticCurveTo(ex, ey - .27 * r * op, ex + ew * .9, ey - .2 * r * op); C.stroke();
    // kaş
    const sad = o.sad === undefined ? .4 : o.sad; C.strokeStyle = cs(P.brow); C.lineWidth = (P.age ? .05 : .055) * r; C.lineCap = 'round'; C.beginPath(); C.moveTo(ex - sd * .17 * r, ey - .2 * r - sad * .06 * r); C.quadraticCurveTo(ex, ey - .26 * r, ex + sd * .2 * r, ey - .19 * r + sad * .02 * r); C.stroke();
    if (o.tear && sd === 1) { const ty = ey + .1 * r + o.tear * .45 * r; blob(ex - .02 * r, ty, .04 * r, [200, 220, 240], .9, 1.4); C.strokeStyle = 'rgba(220,235,250,.45)'; C.lineWidth = .02 * r; C.beginPath(); C.moveTo(ex, ey + .08 * r); C.lineTo(ex - .02 * r, ty); C.stroke(); }
  }
  // ağız
  const mx = x + tf * 1.05, my = y + .5 * r;
  if (mo > .05) { C.beginPath(); C.ellipse(mx, my + mo * .03 * r, .14 * r, (.02 + .1 * mo) * r, 0, 0, TAU); C.fillStyle = cs([90, 40, 40]); C.fill(); }
  C.beginPath(); C.moveTo(mx - .17 * r, my); C.quadraticCurveTo(mx, my - .07 * r, mx + .17 * r, my); C.quadraticCurveTo(mx, my + .13 * r, mx - .17 * r, my); C.fillStyle = cs(mix(P.skin, [170, 80, 80], .45)); C.fill();
  C.strokeStyle = cs([110, 50, 48], .95); C.lineWidth = .045 * r; C.beginPath(); C.moveTo(mx - .16 * r, my - smile * .03 * r); C.quadraticCurveTo(mx, my + smile * .06 * r - mo * .05 * r, mx + .16 * r, my - smile * .03 * r); C.stroke();
  blob(mx, my + .09 * r, .1 * r, tint(P.skin, .15), .5, .5);
  if (P.must) form([[mx - .3 * r, my - .02 * r], [mx - .12 * r, my - .16 * r], [mx, my - .13 * r], [mx + .12 * r, my - .16 * r], [mx + .3 * r, my - .02 * r], [mx + .15 * r, my - .07 * r], [mx - .15 * r, my - .07 * r]], P.must, { n: 4, hi: .25 });
  // saç ön
  if (P.hairStyle === 'messy') { form([[x - .78 * r + tf * .2, y - .3 * r], [x - .7 * r + tf * .2, y - .85 * r], [x - .2 * r + tf * .2, y - 1.12 * r], [x + .4 * r + tf * .2, y - 1.08 * r], [x + .82 * r + tf * .2, y - .7 * r], [x + .74 * r + tf * .2, y - .3 * r], [x + .5 * r + tf * .3, y - .62 * r], [x + .1 * r + tf * .4, y - .5 * r], [x - .2 * r + tf * .4, y - .66 * r], [x - .5 * r + tf * .3, y - .52 * r]], P.hair, { n: 8, hi: .15 }); }
  if (P.hairStyle === 'combed') form([[x - .76 * r + tf * .2, y - .35 * r], [x - .7 * r + tf * .2, y - .9 * r], [x, y - 1.12 * r], [x + .7 * r + tf * .2, y - .9 * r], [x + .76 * r + tf * .2, y - .35 * r], [x + .6 * r + tf * .3, y - .7 * r], [x - .5 * r + tf * .3, y - .72 * r]], P.hair, { n: 6, hi: .2 });
  if (P.hairStyle === 'bowl') form([[x - .86 * r, y - .1 * r], [x - .8 * r, y - .9 * r], [x, y - 1.15 * r], [x + .8 * r, y - .9 * r], [x + .86 * r, y - .1 * r], [x + .6 * r, y - .4 * r], [x - .6 * r, y - .4 * r]], P.hair, { n: 6, hi: .2 });
  if (P.hairStyle === 'bald') { for (const sd of [-1, 1]) form(ell(x + sd * .7 * r + tf * .2, y - .32 * r, .14 * r, .3 * r, 10), P.hair, { n: 3, hi: .1 }); blob(x - .15 * r + tf * .3, y - .78 * r, .28 * r, tint(P.skin, .4), .5, .6); }
  if (P.hairStyle === 'cap') { form([[x - .82 * r, y - .45 * r], [x - .75 * r, y - 1.0 * r], [x, y - 1.18 * r], [x + .75 * r, y - 1.0 * r], [x + .82 * r, y - .45 * r]], [60, 80, 100], { n: 4 }); form([[x - .2 * r + tf, y - .5 * r], [x + 1.0 * r + tf, y - .45 * r], [x + .95 * r + tf, y - .36 * r], [x - .2 * r + tf, y - .4 * r]], [50, 66, 86], { n: 2 }); }
  if (o.wet) { C.strokeStyle = 'rgba(230,240,255,.35)'; C.lineWidth = .02 * r; for (let i = 0; i < 6; i++) { const sx = x + (i - 2.5) * .22 * r; C.beginPath(); C.moveTo(sx, y - .6 * r); C.lineTo(sx + .02 * r, y + .4 * r); C.stroke(); } }
}
// ---- gövde (ön/üç çeyrek), x,y = omuz ortası; s = kafa r'si ----
function torso(o) { const P = PEOPLE[o.who], s = o.r, x = o.x, y = o.y, tn = o.turn || 0, br = P.broad || 1, slump = o.slump || 0;
  const sw = (P.child ? 1.0 : 1.55) * s * br, by = y + (o.len || 3.4) * s;
  const sl = slump * .3 * s, body = [[x - .4 * s, y - .25 * s], [x - sw * .62, y - .14 * s + sl * .6], [x - sw * .9, y + .08 * s + sl], [x - sw * .98, y + .45 * s + sl], [x - sw * .94, y + 1.6 * s], [x - sw * .92, by], [x - sw * .92, by], [x + sw * .92, by], [x + sw * .92, by], [x + sw * .94, y + 1.6 * s], [x + sw * .98, y + .45 * s + sl], [x + sw * .9, y + .08 * s + sl], [x + sw * .62, y - .14 * s + sl * .6], [x + .4 * s, y - .25 * s]];
  form(body, P.top, { n: 12, hi: .15, lo: .55 });
  if (o.who === 'halil') { form([[x - .35 * s, y - .25 * s], [x + .35 * s, y - .25 * s], [x + .18 * s, by], [x - .18 * s, by]], P.shirt, { n: 4 }); for (let i = 0; i < 4; i++) blob(x + .32 * s, y + (.6 + i * .7) * s, .06 * s, [60, 56, 52], 1); C.strokeStyle = cs(shade(P.top, .6)); C.lineWidth = .04 * s; for (const sd of [-1, 1]) { C.beginPath(); C.moveTo(x + sd * .35 * s, y - .2 * s); C.lineTo(x + sd * .22 * s, by); C.stroke(); } }
  if (o.who === 'yusuf') { form([[x - .3 * s, y - .25 * s], [x + .3 * s, y - .25 * s], [x + .2 * s, y + 1.2 * s], [x - .2 * s, y + 1.2 * s]], [120, 120, 124], { n: 3 }); C.strokeStyle = cs([200, 200, 200], .6); C.lineWidth = .03 * s; C.beginPath(); C.moveTo(x, y + 1.2 * s); C.lineTo(x, by); C.stroke(); }
  if (o.who === 'genc') { C.strokeStyle = cs([200, 196, 184]); C.lineWidth = .03 * s; C.beginPath(); C.moveTo(x, y); C.lineTo(x, by); C.stroke(); form([[x - .35 * s, y - .25 * s], [x, y + .3 * s], [x + .35 * s, y - .25 * s]], [210, 204, 190], { n: 2 }); }
  return { sw, by };
}
function arm(sh, ab, el, s, col, skin, o = {}) { // sh: omuz noktası; ab açı (aşağıdan, + dışa) sd yönü ile
  const sd = o.sd || 1, L1 = 1.55 * s, L2 = 1.4 * s; const e = [sh[0] + Math.sin(ab) * sd * L1, sh[1] + Math.cos(ab) * L1], a2 = ab + el, h = [e[0] + Math.sin(a2) * sd * L2, e[1] + Math.cos(a2) * L2];
  limb(sh, e, h, .36 * s, .3 * s, .26 * s, col); if (!o.noHand) handP(h, a2 * sd, s, skin, o.tremble); return h; }
function handP(p, ang, s, skin, tr = 0) { const jx = tr ? Math.sin(Date.now() * 0 + tr * 40) * .03 * s : 0; C.save(); C.translate(p[0] + jx, p[1]); C.rotate(-ang);
  form(ell(0, .22 * s, .2 * s, .28 * s, 12), skin, { n: 4 }); for (let i = 0; i < 4; i++) limb([(-.13 + i * .09) * s, .4 * s], [(-.14 + i * .095) * s, .55 * s], [(-.14 + i * .1) * s, .68 * s], .045 * s, .042 * s, .038 * s, skin, { tex: false }); limb([.16 * s, .2 * s], [.26 * s, .34 * s], [.27 * s, .46 * s], .05 * s, .045 * s, .04 * s, skin, { tex: false });
  C.restore(); }
// ---- tam figür (orta plan), x,y ayak; h boy (px) ----
function figure(o) { const P = PEOPLE[o.who], h = o.h, s = h / 8.2 * (P.child ? 1.25 : 1), x = o.x, y = o.y, tn = o.turn || 0, sit = o.sit || 0, wk = o.walk;
  const hipY = y - (P.child ? 2.6 : 3.9) * s * (1 - sit * .35), shY = hipY - (P.child ? 2.2 : 3.0) * s, hy = shY - (o.slump ? .75 : .95) * s;
  // bacaklar
  for (const sd of [-1, 1]) { const ph = wk === undefined ? 0 : Math.sin(wk + (sd > 0 ? Math.PI : 0)), hx = x + sd * .45 * s, kx = sit ? x + sd * .5 * s + tn * 1.4 * s : x + sd * .45 * s + ph * .5 * s, ky = sit ? hipY + .2 * s : (hipY + y) / 2 - Math.max(0, ph) * .2 * s, ax = sit ? kx + tn * .2 * s : x + sd * .42 * s + ph * .8 * s, ay = y - .15 * s - (wk === undefined ? 0 : Math.max(0, ph) * .25 * s);
    limb([hx, hipY], [kx, ky], [ax, ay], .5 * s, .4 * s, .32 * s, P.pants); form(ell(ax + tn * .2 * s, ay + .1 * s, .42 * s, .18 * s, 12), [40, 34, 32], { n: 2 }); }
  const T = torso({ who: o.who, x, y: shY, r: s, turn: tn, len: (hipY - shY) / s + .4, slump: o.slump });
  const hands = [-1, 1].map((sd, i) => arm([x + sd * T.sw * .85, shY + .3 * s], (o.arms ? o.arms[i][0] : .15), (o.arms ? o.arms[i][1] : .1), s, P.top2 || P.top, P.skin, { sd, noHand: o.noHands && o.noHands[i], tremble: o.tremble }));
  head(Object.assign({}, o, { x: x + tn * .2 * s, y: hy, r: s * (P.child ? 1.15 : 1) }));
  return { hands, head: [x + tn * .2 * s, hy], s };
}
