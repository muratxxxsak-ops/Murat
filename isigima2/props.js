'use strict';
// ====== SAHNE NESNELERİ ======
const at = (x, z, y = 0) => { const p = pj(x, y, z); return { x: p[0], y: p[1], k: ps(z) }; };
function F(kind, x, z, o = {}) { const p = at(x, z); return fig(Object.assign({ x: p.x, y: p.y, h: (kind === 'woman' ? 1.68 : kind === 'shade' ? 1.9 : 1.86) * p.k, kind, view: 'front' }, o)); }
function herLight(x, z, amt = 1, y = .95) { const p = at(x, z, y); glow(p.x, p.y, 3 * p.k * amt, .75 * amt); lightR(p.x, p.y, 2.8 * p.k * amt, .32 * amt); const g = at(x, z); lightR(g.x, g.y, 3.2 * p.k * amt, .3 * amt, .3); }
// karanlıkta parlayan göz çiftleri
function eyes(n, seed, amt, x0 = 0, y0 = 0, x1 = W, y1 = H, sz = 4, t = 0) {
  const r = rng(seed);
  for (let i = 0; i < n; i++) { const x = lerp(x0, x1, r()), y = lerp(y0, y1, r()), s = sz * (.6 + r() * .8), on = clamp(amt * 2.5 - r() * 1.5), bl = Math.sin(t * 1.3 + i * 7.1) > .97 ? .1 : 1;
    if (on <= 0) continue; const a = on * bl;
    lightR(x, y, s * 5, .18 * a); C.fillStyle = ink(.4 + .6 * a, 0);
    for (const dx of [-s * 1.6, s * 1.6]) { C.beginPath(); C.ellipse(x + dx, y, s, s * .55, 0, 0, TAU); C.fill(); } }
}
// taş kalp (anatomik, çatlaklı)
function stoneHeart(x, y, s, gold = 0, beat = 0) {
  C.save(); C.translate(x, y); C.scale(s * (1 + beat * .05), s * (1 + beat * .05));
  const pth = () => { C.beginPath(); C.moveTo(0, -.55); C.bezierCurveTo(.35, -.95, 1.0, -.6, .85, -.05); C.bezierCurveTo(.75, .4, .3, .75, .05, 1.0); C.bezierCurveTo(-.25, .72, -.85, .35, -.88, -.1); C.bezierCurveTo(-.9, -.6, -.35, -.9, 0, -.55); C.closePath(); };
  // damarlar
  for (const [a, b, c] of [[-.3, -.6, -.2], [.1, -.62, .05], [.35, -.55, .45]]) { C.beginPath(); C.moveTo(a - .1, b + .1); C.quadraticCurveTo(a, b - .3, c, b - .55); C.lineTo(c + .14, b - .5); C.quadraticCurveTo(a + .15, b - .2, a + .12, b + .1); C.closePath(); C.fillStyle = rg(0, 0, 0, 1, [[0, .5], [1, .25]], .2, gold); C.fill(); }
  pth(); C.fillStyle = rg(-.3, -.35, .05, 1.2, [[0, .92], [.5, .62], [1, .3]], .7, gold * .3); C.fill(); C.strokeStyle = ink(.05, 0); C.lineWidth = .025; C.stroke();
  C.save(); pth(); C.clip();
  const r = rng(77); C.lineCap = 'round'; C.lineJoin = 'round';
  const crack = (x, y, a, len, dep) => { let px = x, py = y; C.beginPath(); C.moveTo(px, py); const pts = [];
    for (let k = 0; k < 6; k++) { a += (r() - .5) * .9; px += Math.cos(a) * len / 6; py += Math.sin(a) * len / 6; C.lineTo(px, py); pts.push([px, py, a]); }
    C.strokeStyle = gold ? ink(1, 0, 1) : ink(.08, 0); C.lineWidth = (gold ? .028 : .016) * (1 - dep * .4); C.stroke();
    if (dep < 2) for (const q of pts) if (r() < .3) crack(q[0], q[1], q[2] + (r() < .5 ? -1 : 1) * (.6 + r() * .6), len * .45, dep + 1); };
  for (let i = 0; i < 4; i++) crack(-.2 + r() * .4, -.5 + r() * .3, Math.PI / 2 + (r() - .5) * 1.6, 1.1, 0);
  C.restore(); C.restore();
}
// dağ silüeti
function mountain(x, y, w, h, v = .3, seed = 9) {
  const r = rng(seed), pts = [[x - w / 2, y]]; const n = 9;
  for (let i = 1; i < n; i++) { const p = i / n, hh = h * Math.sin(p * Math.PI) * (.75 + r() * .3); pts.push([x - w / 2 + p * w, y - hh]); }
  pts.push([x + w / 2, y]);
  P(pts); C.fillStyle = lg(x - w / 2, 0, x + w / 2, 0, [[0, v + .25], [.5, v + .1], [1, v - .1]], .9); C.fill();
  for (let i = 1; i < n - 1; i++) { const p = pts[i]; strokeTone([p, [p[0] + (r() - .3) * w * .1, y - (y - p[1]) * .3], [p[0] + (r() - .5) * w * .06, y]], v - .15, 1.1, 2); }
  // kar/ışık sırtı
  P([pts[4], pts[5], [pts[5][0] - w * .03, pts[5][1] + h * .12], [pts[4][0] + w * .02, pts[4][1] + h * .1]]); C.fillStyle = ink(v + .45, .3); C.fill();
}
// tuğla duvar (yıkılabilir)
function brickWall(x0, y0, w, h, bw, bh, k, t, seed = 3, v = .4) {
  const r = rng(seed);
  for (let row = 0, y = y0 + h - bh; y > y0 - 1; row++, y -= bh) {
    for (let x = x0 - (row % 2) * bw / 2; x < x0 + w; x += bw) {
      const cx = x + bw / 2, cy = y + bh / 2, d = Math.hypot(cx - (x0 + w / 2), cy - (y0 + h * .45)) / (Math.max(w, h) * .6);
      const fall = clamp((k * 1.6 - d) * 2), vx = (cx - (x0 + w / 2)) * .8 + (r() - .5) * 80, ft = fall * 1.2;
      const px = cx + vx * ft, py = cy + 300 * ft * ft + (r() - .5) * 30 * ft, a = (r() - .5) * 4 * ft;
      if (py > H + 100) continue;
      C.save(); C.translate(px, py); C.rotate(a);
      C.fillStyle = lg(-bw / 2, -bh / 2, bw / 2, bh / 2, [[0, v + .15 + r() * .1], [1, v - .1]], 0); C.fillRect(-bw / 2 + 1, -bh / 2 + 1, bw - 2, bh - 2);
      C.strokeStyle = ink(.05, 0); C.lineWidth = 1.5; C.strokeRect(-bw / 2 + 1, -bh / 2 + 1, bw - 2, bh - 2); C.restore();
    }
  }
}
// kitap
function book(x, y, w, h, title, v = .35, ang = 0) {
  C.save(); C.translate(x, y); C.rotate(ang);
  C.fillStyle = lg(-w / 2, 0, w / 2, 0, [[0, v + .2], [.5, v + .05], [1, v - .1]], Math.PI / 2); C.fillRect(-w / 2, -h / 2, w, h);
  C.strokeStyle = ink(.05, 0); C.lineWidth = 2; C.strokeRect(-w / 2, -h / 2, w, h);
  for (const yy of [-.38, -.32, .32, .38]) { C.fillStyle = ink(.85, 0, 1); C.fillRect(-w / 2 + 3, yy * h, w - 6, h * .015); }
  if (title) { C.save(); C.rotate(-Math.PI / 2); C.font = `700 ${w * .42}px ${FONT}`; C.textAlign = 'center'; C.textBaseline = 'middle'; C.letterSpacing = `${w * .08}px`; C.fillStyle = ink(.92, 0, 1); C.fillText(title, 0, 0); C.restore(); }
  C.restore();
}
// dünya küresi
function globe(x, y, r, rotA, burn = 0, t = 0) {
  C.save(); C.translate(x, y);
  C.beginPath(); C.arc(0, 0, r, 0, TAU); C.fillStyle = rg(-r * .35, -r * .4, r * .1, r * 1.1, [[0, .85], [.6, .5], [1, .18]], .35); C.fill();
  C.save(); C.beginPath(); C.arc(0, 0, r, 0, TAU); C.clip();
  // kıtalar
  const R = rng(31);
  for (let i = 0; i < 7; i++) { const lo = R() * TAU + rotA, la = (R() - .5) * 2.2, cz = Math.cos(lo); if (cz < -.1) { R(); R(); continue; }
    const cx = Math.sin(lo) * Math.cos(la) * r, cy = -Math.sin(la) * r, rr = r * (.15 + R() * .25);
    C.beginPath(); for (let k = 0; k < 10; k++) { const a = k / 10 * TAU, q = rr * (.6 + .4 * Math.sin(k * 2.3 + i)); C.lineTo(cx + Math.cos(a) * q * Math.max(.2, cz), cy + Math.sin(a) * q); } C.closePath();
    C.fillStyle = ink(.3 * cz + .1, .8); C.fill(); }
  // meridyenler
  C.strokeStyle = ink(.15, 0); C.lineWidth = 1.2;
  for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI + rotA % (Math.PI / 6); C.beginPath(); C.ellipse(0, 0, Math.abs(Math.cos(a)) * r, r, 0, 0, TAU); C.stroke(); }
  for (let i = -2; i <= 2; i++) { const yy = i / 3 * r; C.beginPath(); C.ellipse(0, yy, Math.sqrt(r * r - yy * yy), r * .08, 0, 0, TAU); C.stroke(); }
  C.restore();
  C.beginPath(); C.arc(0, 0, r, 0, TAU); C.strokeStyle = ink(.02, 0); C.lineWidth = 3; C.stroke();
  C.restore();
  if (burn > 0) { C.save(); C.beginPath(); C.arc(x, y, r * 1.02, 0, TAU); C.clip(); flames(x - r, y + r * (1.1 - burn * 1.6), r * 2, r * 1.3 * burn + r * .2, t, 5, 1); C.restore(); flames(x - r * .8, y - r * .55 + (1 - burn) * r * 1.2, r * 1.6, r * .9 * burn, t, 8, burn); glow(x, y, r * 2.2, .7 * burn); }
}
// terazi
function scales(x, y, s, tilt, t) {
  C.save(); C.translate(x, y); C.scale(s, s);
  // ayak
  P([[-.5, 1.5], [.5, 1.5], [.1, 1.35], [.06, -.95], [-.06, -.95], [-.1, 1.35]]); C.fillStyle = lg(-.5, 0, .5, 0, [[0, .7], [1, .25]], Math.PI / 2); C.fill();
  C.beginPath(); C.arc(0, -1, .1, 0, TAU); C.fillStyle = ink(.8, 0, 1); C.fill();
  C.save(); C.translate(0, -1); C.rotate(tilt);
  C.fillStyle = lg(0, -.05, 0, .05, [[0, .8], [1, .3]], 0); C.fillRect(-1.3, -.04, 2.6, .08);
  C.restore();
  const ends = [-1, 1].map(sd => [Math.cos(tilt) * 1.25 * sd, -1 + Math.sin(tilt) * 1.25 * sd]);
  ends.forEach(([ex, ey], i) => {
    strokeTone([[ex, ey], [ex - .38, ey + .95]], .2, 1, .02); strokeTone([[ex, ey], [ex + .38, ey + .95]], .2, 2, .02);
    C.beginPath(); C.ellipse(ex, ey + .97, .45, .1, 0, 0, Math.PI); C.closePath(); C.fillStyle = lg(ex - .45, 0, ex + .45, 0, [[0, .75], [1, .25]], 0); C.fill();
  });
  C.restore();
  return ends.map(([ex, ey]) => [x + ex * s, y + (ey + .9) * s]);
}
function coins(x, y, n, s, seed = 4, gold = 0) { const r = rng(seed);
  for (let i = 0; i < n; i++) { const row = Math.floor(Math.sqrt(i * 2)), cx = x + (r() - .5) * s * (5 - row * .7), cy = y - row * s * .35 - r() * s * .2;
    C.beginPath(); C.ellipse(cx, cy, s * .5, s * .18, 0, 0, TAU); C.fillStyle = lg(cx - s * .5, 0, cx + s * .5, 0, [[0, .75], [1, .3]], 0, gold); C.fill(); C.strokeStyle = ink(.05, 0); C.lineWidth = 1; C.stroke(); } }
function crown(x, y, s, v = .6) { P([[x - s, y], [x + s, y], [x + s * 1.1, y - s * .9], [x + s * .5, y - s * .45], [x, y - s * 1.1], [x - s * .5, y - s * .45], [x - s * 1.1, y - s * .9]]); C.fillStyle = lg(x - s, 0, x + s, 0, [[0, v + .2], [1, v - .25]], Math.PI / 2); C.fill(); C.strokeStyle = ink(.05, 0); C.lineWidth = 1.5; C.stroke(); }
// para (banknot)
function bill(x, y, w, a, v = .7) { C.save(); C.translate(x, y); C.rotate(a); C.scale(1, .5 + .5 * Math.abs(Math.cos(a * 2.3)));
  C.fillStyle = ink(v, .3); C.fillRect(-w / 2, -w * .23, w, w * .46); C.strokeStyle = ink(.1, 0); C.lineWidth = 1.2; C.strokeRect(-w / 2 + 2, -w * .23 + 2, w - 4, w * .46 - 4);
  C.beginPath(); C.ellipse(0, 0, w * .12, w * .15, 0, 0, TAU); C.stroke(); C.restore(); }
// eski fotoğraf makinesi + magnezyum flaşı
function camera(x, y, s, flash = 0, dir = 1) { C.save(); C.translate(x, y); C.scale(s * dir, s);
  strokeTone([[0, 0], [-.4, 1.6]], .05, 1.3, .05); strokeTone([[0, 0], [.4, 1.6]], .05, 1.8, .05); strokeTone([[0, 0], [0, 1.6]], .05, Math.PI / 2, .05);
  C.fillStyle = lg(-.4, 0, .4, 0, [[0, .45], [1, .1]], Math.PI / 2); C.fillRect(-.4, -.55, .8, .6);
  P([[.4, -.5], [.85, -.62], [.85, .12], [.4, 0]]); C.fillStyle = ink(.12, 0); C.fill(); C.beginPath(); C.arc(.88, -.25, .14, 0, TAU); C.fillStyle = ink(.6, 0); C.fill();
  strokeTone([[-.1, -.55], [-.1, -1.1]], .1, Math.PI / 2, .03); C.fillStyle = ink(.6, 0); C.fillRect(-.35, -1.18, .5, .08);
  C.restore();
  if (flash > 0) { lightR(x - .1 * s * dir, y - 1.15 * s, s * 4 * flash, .9 * flash); lightR(x, y, s * 12 * flash, .4 * flash); }
}
// taş
function stone(x, y, s, a, seed, v = .45) { const r = rng(seed); C.save(); C.translate(x, y); C.rotate(a); C.beginPath();
  for (let i = 0; i < 8; i++) { const an = i / 8 * TAU, q = s * (.75 + r() * .35); C.lineTo(Math.cos(an) * q, Math.sin(an) * q * .8); } C.closePath();
  C.fillStyle = rg(-s * .3, -s * .3, s * .1, s * 1.1, [[0, v + .3], [1, v - .2]], r() * 3); C.fill(); C.strokeStyle = ink(.05, 0); C.lineWidth = Math.max(1, s * .06); C.stroke(); C.restore(); }
// büyük el (yakın plan): yumruk ya da açık
function bigFist(x, y, s, blood = 0, a = 0) {
  C.save(); C.translate(x, y); C.rotate(a); C.scale(s, s);
  // bilek/kol (palto kolu)
  P([[-1.6, .55], [-.45, .35], [-.45, -.55], [-1.6, -.75]]); C.fillStyle = lg(0, -.7, 0, .6, [[0, .3], [1, .05]], Math.PI / 2); C.fill();
  // el sırtı
  C.beginPath(); C.moveTo(-.5, -.5); C.bezierCurveTo(-.1, -.75, .45, -.7, .62, -.45); C.lineTo(.68, .25); C.bezierCurveTo(.5, .55, -.1, .6, -.5, .4); C.closePath();
  C.fillStyle = rg(-.1, -.4, .05, 1.1, [[0, .8], [.6, .5], [1, .25]], .3); C.fill(); C.strokeStyle = ink(.05, 0); C.lineWidth = .03; C.stroke();
  // parmak boğumları
  for (let i = 0; i < 4; i++) { const yy = -.42 + i * .24; C.beginPath(); C.ellipse(.62, yy + .08, .16, .13, 0, 0, TAU); C.fillStyle = rg(.6, yy + .03, .02, .2, [[0, .85], [1, .45]], 0); C.fill(); C.stroke();
    C.beginPath(); C.moveTo(.3, yy + .2); C.quadraticCurveTo(.55, yy + .24, .74, yy + .19); C.strokeStyle = ink(.15, 0); C.lineWidth = .02; C.stroke(); }
  // başparmak
  C.beginPath(); C.moveTo(-.2, .35); C.bezierCurveTo(.1, .55, .45, .52, .55, .38); C.bezierCurveTo(.45, .3, .1, .3, -.1, .2); C.closePath(); C.fillStyle = ink(.62, .2); C.fill(); C.strokeStyle = ink(.05, 0); C.lineWidth = .025; C.stroke();
  // damarlar / tendon
  for (let i = 0; i < 3; i++) strokeTone([[-.45, -.3 + i * .22], [.2, -.35 + i * .26]], .55, 0, .015);
  if (blood > 0) { for (let i = 0; i < 4; i++) { const yy = -.36 + i * .24, L = blood * (.3 + (i % 2) * .25);
    C.beginPath(); C.moveTo(.7, yy + .02); C.quadraticCurveTo(.78, yy + .1 + L * .5, .72, yy + .12 + L); C.lineTo(.68, yy + .12 + L); C.quadraticCurveTo(.66, yy + .05, .62, yy + .02); C.closePath(); C.fillStyle = ink(.02, 0); C.fill(); } }
  C.restore();
}
// altın harf karoları (gizli isim)
function goldTiles(x, y, s, k, t) {
  for (let i = 0; i < 3; i++) { const a = clamp(k * 3 - i), cx = x + (i - 1) * s * 1.25, cy = y + (1 - eo(a)) * 40; if (a <= 0) continue;
    C.save(); C.globalAlpha = a; C.translate(cx, cy);
    C.fillStyle = ink(.85, .5, 1); C.fillRect(-s / 2, -s * .6, s, s * 1.2); C.strokeStyle = ink(.1, 0, 1); C.lineWidth = 3; C.strokeRect(-s / 2 + 6, -s * .6 + 6, s - 12, s * 1.2 - 12);
    // sarmaşık süsleme harfi gizler
    C.strokeStyle = ink(.25, 0, 1); C.lineWidth = s * .05; C.lineCap = 'round';
    const r = rng(60 + i); for (let k2 = 0; k2 < 5; k2++) { C.beginPath(); C.moveTo((r() - .5) * s * .6, (r() - .5) * s); C.bezierCurveTo((r() - .5) * s, (r() - .5) * s, (r() - .5) * s, (r() - .5) * s, (r() - .5) * s * .6, (r() - .5) * s); C.stroke(); }
    for (let k2 = 0; k2 < 6; k2++) { C.beginPath(); C.ellipse((r() - .5) * s * .6, (r() - .5) * s * .9, s * .07, s * .035, r() * 3, 0, TAU); C.fillStyle = ink(.3, 0, 1); C.fill(); }
    C.restore(); glow(cx, cy, s * 1.1, .55 * a);
  }
}
// masa (perspektif)
function table(x0, x1, z0, z1, hgt, v = .45) {
  const a = pj(x0, hgt, z0), b = pj(x1, hgt, z0), c = pj(x1, hgt, z1), d = pj(x0, hgt, z1);
  quad(a, b, c, d, lg(0, d[1], 0, a[1], [[0, v - .1], [1, v + .15]], 0));
  const e = pj(x0, hgt - .08, z0), f = pj(x1, hgt - .08, z0); quad(a, b, f, e, ink(v - .2, 0));
  for (const [x, z] of [[x0 + .1, z0 + .1], [x1 - .1, z0 + .1]]) { const p = pj(x, hgt - .08, z), q = pj(x, 0, z); strokeTone([p, q], .08, Math.PI / 2, ps(z) * .07); }
}
function ev(x, y, s, k, t) { // taşlardan ev
  const r = rng(91), rows = 6, cols = 7, n = rows * cols;
  for (let i = 0; i < n; i++) { const row = (i / cols) | 0, col = i % cols, a = clamp(k * 1.3 * n / n * 1.0 * (n / (i + 4)) - .2 - row * .12), tx = x + (col - cols / 2 + .5 + (row % 2) * .5) * s * .5, ty = y - row * s * .36 - s * .18;
    const sx = x + (r() - .5) * s * 6, sy = y + s * .2 + r() * s * .3; const q = eo(clamp(k * 1.6 - row * .18 - col * .01));
    stone(lerp(sx, tx, q), lerp(sy, ty, q) - Math.sin(q * Math.PI) * s * .8, s * .23, (1 - q) * r() * 3, 200 + i, .5); }
  const rk = clamp(k * 1.6 - 1.05); if (rk > 0) { const ry = y - rows * s * .36 - s * .1; C.save(); C.globalAlpha = rk;
    P([[x - cols * s * .3, ry], [x, ry - s * 1.4], [x + cols * s * .3, ry]]); C.fillStyle = lg(x - s * 2, 0, x + s * 2, 0, [[0, .55], [1, .2]], .9); C.fill(); C.strokeStyle = ink(.05, 0); C.lineWidth = 2; C.stroke(); C.restore();
    const wy = y - s * 1.3; C.fillStyle = ink(.95, 0, 1); C.globalAlpha = rk; C.fillRect(x - s * .3, wy - s * .4, s * .6, s * .6); C.globalAlpha = 1; glow(x, wy - s * .1, s * 2, .7 * rk); }
}
// yağmur (açık tonlu çizgiler, tarama üstüne)
function rainL(t, n, slant, len, v = .85, seed = 3) { const r = rng(seed); C.strokeStyle = ink(v, 0); C.lineWidth = 1.2; C.beginPath();
  for (let i = 0; i < n; i++) { const x0 = r() * (W + 400) - 200, y0 = r() * H, sp = 900 * (.7 + r() * .6), y = ((y0 + t * sp) % (H + 60)) - 30, x = x0 - y * slant; C.moveTo(x, y); C.lineTo(x - slant * len, y + len); } C.stroke(); }
function embers(t, n, amt, seed = 5) { const r = rng(seed); for (let i = 0; i < n; i++) { const ph = (t * (.15 + r() * .2) + r()) % 1, x = r() * W + Math.sin(t + i) * 30, y = H + 20 - ph * (H + 60); const s = 1.5 + r() * 2.5;
  C.fillStyle = ink(1, 0, 1); C.globalAlpha = amt * Math.sin(ph * Math.PI); C.fillRect(x, y, s, s); C.globalAlpha = 1; } }
function debris(t, n, k, seed = 8) { const r = rng(seed); for (let i = 0; i < n; i++) { const t0 = r() * 1.5, ft = Math.max(0, k - t0), x = r() * W + (r() - .5) * 200 * ft, y = -50 + 600 * ft * ft + r() * 100, s = 6 + r() * 16;
  if (ft <= 0 || y > H + 40) continue; C.save(); C.translate(x, y); C.rotate(ft * 4 * (r() - .5)); C.fillStyle = ink(.25 + r() * .2, r() * 3); C.fillRect(-s, -s * .5, s * 2, s); C.restore(); } }
