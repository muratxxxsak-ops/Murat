'use strict';
// ===== gerçekçi oranlı insan silueti (iskelet + kapsül uzuvlar), kenar ışığı ile =====
function limb(c, ax, ay, bx, by, wa, wb) {
  const dx = bx - ax, dy = by - ay, L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L;
  c.beginPath(); c.moveTo(ax + nx * wa, ay + ny * wa); c.lineTo(bx + nx * wb, by + ny * wb); c.lineTo(bx - nx * wb, by - ny * wb); c.lineTo(ax - nx * wa, ay - ny * wa); c.closePath(); c.fill();
  c.beginPath(); c.arc(ax, ay, wa, 0, TAU); c.arc(bx, by, wb, 0, TAU); c.fill();
}
const P0 = { lean: 0, head: 0, lA: [.05, .1], rA: [-.05, -.1], lL: [0, 0], rL: [0, 0], sit: 0 };
function walkPose(ph, amt = 1) {
  const s = Math.sin(ph), s2 = Math.sin(ph + Math.PI);
  return { lean: .04 * amt, head: 0, lA: [-.38 * s * amt, -.25 * amt - .2 * Math.max(0, -s) * amt], rA: [-.38 * s2 * amt, -.25 * amt - .2 * Math.max(0, -s2) * amt],
    lL: [.42 * s * amt, -.55 * Math.max(0, -Math.cos(ph)) * amt - .05], rL: [.42 * s2 * amt, -.55 * Math.max(0, -Math.cos(ph + Math.PI)) * amt - .05], bob: Math.abs(Math.cos(ph)) * 3 * amt };
}
function poseMix(a, b, k) { const o = {}; for (const key in a) { const va = a[key], vb = b[key] === undefined ? va : b[key]; o[key] = Array.isArray(va) ? va.map((v, i) => lerp(v, vb[i], k)) : lerp(va, vb, k); } return o; }
function figBody(c, h, P, o) {
  const s = h / 180, d = 1; // yerel koordinat: ayak tabanı (0,0); +x = bakış yönü
  const sit = P.sit || 0, hipY = -95 * s + (P.bob || 0) * s + sit * 40 * s;
  const lean = P.lean || 0, shY = hipY - 56 * s, shX = Math.sin(lean) * 56 * s;
  const leg = (a, len = 45 * s) => [Math.sin(a) * len, Math.cos(a) * len];
  const drawLeg = (L, far) => {
    const [t1, t2] = L, kx = Math.sin(t1) * 46 * s, ky = hipY + Math.cos(t1) * 46 * s, a2 = t1 + t2, fx = kx + Math.sin(a2) * 46 * s, fy = ky + Math.cos(a2) * 46 * s;
    limb(c, far ? -2 * s : 2 * s, hipY, kx, ky, 8.5 * s, 6 * s); limb(c, kx, ky, fx, fy, 6 * s, 4.2 * s);
    c.beginPath(); c.ellipse(fx + 5 * s, fy - 1.5 * s, 9 * s, 3.6 * s, 0, 0, TAU); c.fill();
  };
  const drawArm = (A, side) => {
    const sx = shX + side * (o.female ? 11 : 13) * s, sy = shY + 4 * s, [a1, a2] = A, ex = sx + Math.sin(a1 + lean) * 29 * s, ey = sy + Math.cos(a1 + lean) * 29 * s, a = a1 + a2 + lean, hx = ex + Math.sin(a) * 26 * s, hy = ey + Math.cos(a) * 26 * s;
    limb(c, sx, sy, ex, ey, 6.2 * s, 4.8 * s); limb(c, ex, ey, hx, hy, 4.8 * s, 3.6 * s); c.beginPath(); c.ellipse(hx + Math.sin(a) * 5 * s, hy + Math.cos(a) * 5 * s, 3.6 * s, 6 * s, -a, 0, TAU); c.fill();
    return [hx + Math.sin(a) * 6 * s, hy + Math.cos(a) * 6 * s];
  };
  // uzak uzuvlar biraz koyu
  const base = c.fillStyle;
  if (o.shade) c.fillStyle = o.shade;
  drawLeg(P.rL, 1); const hR = drawArm(P.rA, -1);
  c.fillStyle = base;
  // gövde / mont
  c.beginPath();
  const cw = o.female ? 15 : 18, coatL = o.coat === false ? 4 : (o.female ? 30 : 22);
  c.moveTo(shX - cw * s, shY + 2 * s); c.quadraticCurveTo(shX - (cw + 4) * s, shY - 3 * s, shX - 8 * s, shY - 5 * s); c.lineTo(shX + 8 * s, shY - 5 * s); c.quadraticCurveTo(shX + (cw + 4) * s, shY - 3 * s, shX + cw * s, shY + 2 * s);
  c.quadraticCurveTo(shX * .5 + 9 * s, hipY - 24 * s, 13 * s + (o.female ? 4 * s : 0), hipY + coatL * s * (1 - sit * .6)); c.lineTo(-13 * s - (o.female ? 4 * s : 0), hipY + coatL * s * (1 - sit * .6)); c.quadraticCurveTo(shX * .5 - 9 * s, hipY - 24 * s, shX - cw * s, shY + 2 * s); c.fill();
  drawLeg(P.lL, 0);
  // boyun + baş
  const hd = P.head || 0, nx = shX + Math.sin(lean) * 6 * s, ny = shY - 6 * s; limb(c, shX, shY, nx, ny - 3 * s, 4.8 * s, 4.3 * s);
  c.save(); c.translate(nx + 1 * s, ny - 14 * s); c.rotate(hd + lean * .5);
  c.beginPath(); c.ellipse(0, 0, 9.6 * s, 11.8 * s, 0, 0, TAU); c.fill();
  // profil: burun, çene
  c.beginPath(); c.moveTo(8 * s, -3 * s); c.lineTo(12 * s, 2.5 * s); c.lineTo(8.6 * s, 4 * s); c.closePath(); c.fill();
  c.beginPath(); c.ellipse(4 * s, 8.5 * s, 6 * s, 4.2 * s, .2, 0, TAU); c.fill();
  // saç
  if (o.female) { c.beginPath(); c.moveTo(-10 * s, -6 * s); c.quadraticCurveTo(-4 * s, -16 * s, 8 * s, -10 * s); c.quadraticCurveTo(-2 * s, -6 * s, -6 * s, 8 * s); c.quadraticCurveTo(-11 * s, 26 * s, -7 * s + (o.wind || 0) * s, 34 * s); c.quadraticCurveTo(-16 * s, 22 * s, -12 * s, 4 * s); c.fill(); }
  else { c.beginPath(); c.moveTo(-10.5 * s, 2 * s); c.quadraticCurveTo(-12 * s, -13 * s, 1 * s, -13.6 * s); c.quadraticCurveTo(10 * s, -13 * s, 10.5 * s, -5 * s); c.lineTo(-2 * s, -6 * s); c.closePath(); c.fill(); }
  c.restore();
  const hL = drawArm(P.lA, 1);
  return { hL, hR, head: [nx, ny - 14 * s] };
}
// kenar ışığı: önce ışık renginde kaydırılmış siluet, sonra koyu siluet
function fig(c, x, y, h, P, o = {}) {
  const dir = o.dir || 1, col = o.col || [14, 16, 22];
  c.save(); c.translate(x, y); c.scale(dir, 1);
  if (o.rim) { c.save(); c.translate((o.rimX || 1.6) * h / 180 * dir, (o.rimY || -.8) * h / 180); c.fillStyle = rgba(o.rim, o.rimA || 1); figBody(c, h, P, o); c.restore(); }
  c.fillStyle = o.grad ? lin(c, -30 * h / 180, 0, 30 * h / 180, 0, o.grad) : rgba(col); o.shade = rgba(mul(col, .75));
  const J = figBody(c, h, P, o); c.restore();
  return { hL: [x + J.hL[0] * dir, y + J.hL[1]], head: [x + J.head[0] * dir, y + J.head[1]] };
}
// zemine yansıma (ıslak asfalt)
function reflect(c, y, fn, a = .35, squash = 1) { c.save(); c.globalAlpha = a; c.translate(0, y * 2); c.scale(1, -squash); fn(c); c.restore(); }

// ===== telefon =====
function phone(c, x, y, w, rot, screen, o = {}) {
  const h = w * 2.05, r = w * .14; c.save(); c.translate(x, y); c.rotate(rot);
  c.fillStyle = '#0b0c10'; rrect(c, -w / 2, -h / 2, w, h, r); c.fill();
  c.strokeStyle = 'rgba(160,170,190,.35)'; c.lineWidth = Math.max(1, w * .012); c.stroke();
  const m = w * .04; c.save(); rrect(c, -w / 2 + m, -h / 2 + m, w - 2 * m, h - 2 * m, r * .8); c.clip(); c.translate(-w / 2 + m, -h / 2 + m);
  screen(c, w - 2 * m, h - 2 * m); c.restore();
  // cam parlaması
  c.save(); rrect(c, -w / 2 + m, -h / 2 + m, w - 2 * m, h - 2 * m, r * .8); c.clip(); c.fillStyle = lin(c, -w / 2, -h / 2, w / 2, h / 2, [[0, [255, 255, 255], .0], [.42, [255, 255, 255], .0], [.47, [255, 255, 255], .07], [.6, [255, 255, 255], .0]]); c.fillRect(-w, -h, w * 2, h * 2); c.restore();
  c.fillStyle = '#000'; rrect(c, -w * .12, -h / 2 + m * 1.6, w * .24, w * .06, w * .03); c.fill();
  c.restore();
}
const UI = { bg: [11, 20, 26], bar: [31, 44, 52], me: [0, 92, 75], her: [32, 44, 51], txt: [233, 237, 239], sub: [134, 150, 160], grn: [37, 211, 102] };
function chat(c, w, h, o = {}) {
  const k = w / 300; c.fillStyle = rgba(UI.bg); c.fillRect(0, 0, w, h);
  c.fillStyle = rgba(UI.bar); c.fillRect(0, 0, w, 92 * k);
  c.fillStyle = rgba([90, 100, 110]); c.beginPath(); c.arc(52 * k, 58 * k, 18 * k, 0, TAU); c.fill();
  c.fillStyle = rgba([150, 160, 170]); c.beginPath(); c.arc(52 * k, 53 * k, 7 * k, 0, TAU); c.fill(); c.beginPath(); c.arc(52 * k, 72 * k, 12 * k, Math.PI, TAU); c.fill();
  txt(c, o.name || 'S.', 80 * k, 55 * k, 17 * k, { font: SANS, weight: '700', col: rgba(UI.txt) });
  if (o.status) txt(c, o.status, 80 * k, 75 * k, 12.5 * k, { font: SANS, col: rgba(o.status === 'yazıyor...' ? UI.grn : UI.sub) });
  let yy = 120 * k; for (const m of (o.msgs || [])) {
    c.font = `${15 * k}px ${SANS}`; const tw = Math.min(c.measureText(m.t).width + 24 * k, w * .75), bx = m.me ? w - tw - 12 * k : 12 * k;
    c.globalAlpha = m.a === undefined ? 1 : m.a; c.fillStyle = rgba(m.me ? UI.me : UI.her); rrect(c, bx, yy, tw, 34 * k, 9 * k); c.fill();
    txt(c, m.t, bx + 12 * k, yy + 22 * k, 15 * k, { font: SANS, col: rgba(UI.txt) }); if (m.time) txt(c, m.time, bx + tw - 8 * k, yy + 30 * k, 9 * k, { font: SANS, col: rgba(UI.sub), align: 'right' }); c.globalAlpha = 1; yy += 44 * k;
  }
  c.fillStyle = rgba(UI.bar); c.fillRect(0, h - 60 * k, w, 60 * k); c.fillStyle = rgba([42, 57, 66]); rrect(c, 10 * k, h - 50 * k, w - 66 * k, 40 * k, 20 * k); c.fill();
  if (o.draft !== undefined) { txt(c, o.draft + ((o.cursor && (o.t * 2 | 0) % 2) ? '|' : ''), 26 * k, h - 24 * k, 16 * k, { font: SANS, col: rgba(o.draft ? UI.txt : UI.sub) }); }
  c.fillStyle = rgba(UI.me); c.beginPath(); c.arc(w - 30 * k, h - 30 * k, 20 * k, 0, TAU); c.fill();
}
// ===== göz (yakın çekim) =====
function eye(c, x, y, w, t, o = {}) {
  const h = w * .42, look = o.look || [0, 0], open = o.open === undefined ? 1 : o.open;
  c.save(); c.translate(x, y);
  // ten
  c.fillStyle = lin(c, 0, -w * .8, 0, w * .8, [[0, [50, 34, 30]], [.45, [118, 82, 64]], [1, [46, 30, 26]]]); c.fillRect(-W * 2, -H * 2, W * 4, H * 4);
  rad(c, -w * .1, h * 1.6, w * .9, [0, 0, 0], .35, 'source-over', .5); rad(c, -w * .55, -h * .2, w * .4, [0, 0, 0], .25, 'source-over');
  rad(c, o.lx || w * .5, -w * .2, w * 1.2, o.lcol || [255, 170, 110], .25, 'lighter');
  // göz kapağı kıvrımı
  { const lg = c.createLinearGradient(0, -h * 1.7, 0, -h * .4); lg.addColorStop(0, 'rgba(0,0,0,0)'); lg.addColorStop(1, 'rgba(20,10,8,.35)'); c.fillStyle = lg; c.beginPath(); c.moveTo(-w * .55, -h * .2); c.quadraticCurveTo(0, -h * 1.9, w * .6, -h * .4); c.quadraticCurveTo(0, -h * 1.2, -w * .55, -h * .2); c.fill(); }
  c.strokeStyle = 'rgba(30,18,14,.35)'; c.lineWidth = w * .012; c.beginPath(); c.moveTo(-w * .55, -h * .3); c.quadraticCurveTo(0, -h * 1.75, w * .58, -h * .45); c.stroke();
  // kaş
  c.fillStyle = 'rgba(25,16,12,.85)'; c.beginPath(); c.moveTo(-w * .62, -h * 1.5); c.quadraticCurveTo(0, -h * 2.5, w * .7, -h * 1.75); c.quadraticCurveTo(0, -h * 2.15, -w * .62, -h * 1.3); c.fill();
  // göz akı
  c.save(); c.beginPath(); c.moveTo(-w * .5, 0); c.quadraticCurveTo(-w * .05, -h * 1.15 * open, w * .5, -h * .1); c.quadraticCurveTo(w * .05, h * .85, -w * .5, 0); c.closePath(); c.clip();
  c.fillStyle = lin(c, 0, -h, 0, h, [[0, [120, 110, 112]], [.5, [214, 204, 200]], [1, [176, 146, 144]]]); c.fillRect(-w, -h * 2, w * 2, h * 4); { const sg = c.createRadialGradient(0, 0, w * .1, 0, 0, w * .55); sg.addColorStop(0, 'rgba(0,0,0,0)'); sg.addColorStop(1, 'rgba(120,50,50,.45)'); c.fillStyle = sg; c.fillRect(-w, -h * 2, w * 2, h * 4); }
  c.strokeStyle = 'rgba(170,60,60,.25)'; c.lineWidth = 1; for (let i = 0; i < 6; i++) { c.beginPath(); c.moveTo(-w * .48 + i * 3, -h * .1 + i * 4); c.quadraticCurveTo(-w * .38, i * 3, -w * .3 + i * 2, h * .05 - i * 3); c.stroke(); c.beginPath(); c.moveTo(w * .46 - i * 3, -h * .1 + i * 3); c.quadraticCurveTo(w * .38, i * 2, w * .32, h * .02 - i * 3); c.stroke(); }
  // iris
  const ix = look[0] * w * .2, iy = look[1] * h * .3 - h * .08, ir = h * .62;
  const g = c.createRadialGradient(ix, iy, ir * .2, ix, iy, ir); g.addColorStop(0, rgba([120, 80, 40])); g.addColorStop(.5, rgba([88, 56, 30])); g.addColorStop(.92, rgba([40, 26, 16])); g.addColorStop(1, rgba([20, 12, 8])); c.fillStyle = g; c.beginPath(); c.arc(ix, iy, ir, 0, TAU); c.fill();
  c.strokeStyle = 'rgba(200,150,90,.25)'; c.lineWidth = 1.2; for (let i = 0; i < 48; i++) { const a = i / 48 * TAU; c.beginPath(); c.moveTo(ix + Math.cos(a) * ir * .35, iy + Math.sin(a) * ir * .35); c.lineTo(ix + Math.cos(a + .05) * ir * .9, iy + Math.sin(a + .05) * ir * .9); c.stroke(); }
  c.fillStyle = '#050403'; c.beginPath(); c.arc(ix, iy, ir * (.34 + .03 * Math.sin(t)), 0, TAU); c.fill();
  // yansıyan sokak ışıkları
  c.globalCompositeOperation = 'lighter'; for (const [dx, dy, r, col] of [[-.35, -.35, .16, [255, 240, 220]], [.25, -.4, .06, [255, 180, 120]], [.4, .2, .05, [140, 190, 255]]]) rad(c, ix + dx * ir, iy + dy * ir, r * ir * 2.2, col, .9, 'lighter');
  c.globalCompositeOperation = 'source-over';
  // üst kapak gölgesi
  c.fillStyle = lin(c, 0, -h, 0, 0, [[0, [0, 0, 0], .65], [1, [0, 0, 0], 0]]); c.fillRect(-w, -h * 1.2, w * 2, h * 1.2);
  c.restore();
  // kirpikler
  c.strokeStyle = 'rgba(12,8,6,.9)'; c.lineCap = 'round'; const lr = rng(3);
  for (let i = 0; i <= 46; i++) { const p = i / 46, px = lerp(-w * .5, w * .5, p) + (lr() - .5) * 4, py = -h * 1.15 * open * .5 * (1 - Math.pow(2 * p - 1, 2)) * 1.0 - h * .05 * p, L = h * (.14 + .3 * p * Math.sin(p * Math.PI * .9)) * (.6 + lr() * .7); c.lineWidth = w * (.003 + lr() * .004); if (lr() < .25) continue; c.beginPath(); c.moveTo(px, py); c.quadraticCurveTo(px + w * .02 * (p - .2), py - L * .6, px + w * .05 * (p - .35), py - L); c.stroke(); }
  // iç köşe (pembe) ve alt kapak kalınlığı
  c.fillStyle = 'rgba(190,110,100,.55)'; c.beginPath(); c.ellipse(-w * .49, -h * .02, w * .03, h * .09, 0, 0, TAU); c.fill();
  c.strokeStyle = 'rgba(140,90,76,.6)'; c.lineWidth = w * .02; c.beginPath(); c.moveTo(-w * .46, h * .06); c.quadraticCurveTo(0, h * .82, w * .47, -h * .02); c.stroke();
  // alt kapakta ıslaklık + gözyaşı
  const tear = o.tear || 0; c.strokeStyle = `rgba(255,230,210,${.35 + tear * .4})`; c.lineWidth = w * .01; c.beginPath(); c.moveTo(-w * .45, h * .05); c.quadraticCurveTo(0, h * .75, w * .45, -h * .05); c.stroke();
  if (tear > 0) { const ty = h * .5 + tear * w * .5, tx = -w * .1; c.fillStyle = 'rgba(255,240,230,.10)'; c.beginPath(); c.moveTo(tx - 3, h * .45); c.lineTo(tx + 3, h * .45); c.lineTo(tx + 2, ty); c.lineTo(tx - 2, ty); c.fill(); rad(c, tx, ty, w * .05, [255, 240, 220], .7, 'lighter'); c.fillStyle = 'rgba(255,255,255,.55)'; c.beginPath(); c.ellipse(tx, ty, w * .018, w * .026, 0, 0, TAU); c.fill(); }
  c.restore();
}
// ===== ayrıntılı profil baş (yakın çekimler) — sağa bakar, birim ~ baş yüksekliği 200 =====
function headPath(c, female) {
  c.beginPath(); c.moveTo(-62, 280); c.lineTo(-58, 150); c.bezierCurveTo(-62, 110, -100, 70, -100, 5); c.bezierCurveTo(-100, -70, -55, -112, 0, -112);
  c.bezierCurveTo(40, -112, 62, -88, 66, -52); c.bezierCurveTo(68, -36, 70, -26, 73, -18); // alın-kaş
  c.bezierCurveTo(70, -12, 71, -6, 74, -2); c.bezierCurveTo(84, 12, 98, 22, 98, 28); c.bezierCurveTo(98, 34, 90, 36, 84, 36); c.bezierCurveTo(80, 38, 76, 38, 74, 41); // burun
  c.bezierCurveTo(80, 45, 79, 50, 75, 53); c.bezierCurveTo(79, 57, 78, 63, 71, 66); // dudaklar
  c.bezierCurveTo(72, 74, 72, 84, 64, 92); c.bezierCurveTo(56, 100, 40, 102, 30, 104); // çene
  c.bezierCurveTo(28, 120, 32, 136, 38, 150); c.lineTo(46, 280); c.closePath();
}
function profileHead(c, x, y, s, rot, o = {}) {
  const col = o.col || [12, 13, 18], lc = o.light || [130, 175, 255];
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(s * (o.flip ? -1 : 1), s);
  // kenar ışığı
  c.save(); c.translate(o.rimX === undefined ? 3 : o.rimX, o.rimY === undefined ? -2 : o.rimY); c.fillStyle = rgba(lc, o.rimA || .9); headPath(c); c.fill(); c.restore();
  c.fillStyle = rgba(col); headPath(c); c.fill();
  // yüze düşen yumuşak ışık
  c.save(); headPath(c); c.clip(); const g = c.createRadialGradient(o.lx === undefined ? 110 : o.lx, o.ly === undefined ? -10 : o.ly, 5, o.lx === undefined ? 110 : o.lx, o.ly === undefined ? -10 : o.ly, 185);
  g.addColorStop(0, rgba(lc, .7 * (o.la === undefined ? 1 : o.la))); g.addColorStop(.45, rgba(lc, .2 * (o.la === undefined ? 1 : o.la))); g.addColorStop(1, rgba(lc, 0)); c.fillStyle = g; c.fillRect(-120, -130, 240, 300);
  // göz yuvası gölgesi + göz
  c.fillStyle = 'rgba(0,0,0,.45)'; c.beginPath(); c.ellipse(52, -12, 16, 10, 0, 0, TAU); c.fill();
  const bl = o.blink || 0; c.fillStyle = rgba(mix(col, lc, .3)); c.beginPath(); c.moveTo(42, -12); c.quadraticCurveTo(54, -18 + bl * 6, 62, -12); c.quadraticCurveTo(54, -8, 42, -12); c.fill();
  if (o.wet) { c.fillStyle = `rgba(255,255,255,${.6 * o.wet})`; c.beginPath(); c.arc(60, -11, 1.8, 0, TAU); c.fill(); }
  c.strokeStyle = 'rgba(0,0,0,.7)'; c.lineWidth = 2.2; c.beginPath(); c.moveTo(41, -13); c.quadraticCurveTo(54, -20 + bl * 7, 64, -12); c.stroke();
  // kulak
  c.fillStyle = 'rgba(0,0,0,.18)'; c.beginPath(); c.ellipse(-22, 4, 12, 20, .15, 0, TAU); c.fill(); c.strokeStyle = rgba(lc, .12); c.lineWidth = 2; c.beginPath(); c.ellipse(-22, 4, 9, 16, .15, -1.2, 1.6); c.stroke();
  // dudak çizgisi
  c.strokeStyle = 'rgba(0,0,0,.55)'; c.lineWidth = 1.6; c.beginPath(); c.moveTo(60, 52); c.lineTo(75, 52); c.stroke();
  c.restore();
  // saç
  c.fillStyle = rgba(mul(col, .6)); c.beginPath();
  if (o.female) { c.moveTo(66, -60); c.bezierCurveTo(50, -125, -60, -130, -102, -30); c.bezierCurveTo(-118, 40, -100, 140, -70, 230); c.bezierCurveTo(-120, 160, -140, 60, -112, -20); c.bezierCurveTo(-80, -100, 10, -112, 66, -60); }
  else { c.moveTo(66, -54); c.bezierCurveTo(60, -100, 20, -122, -30, -116); c.bezierCurveTo(-80, -110, -108, -60, -100, 10); c.bezierCurveTo(-92, 30, -80, 20, -76, 0); c.bezierCurveTo(-70, -40, -40, -70, 10, -74); c.bezierCurveTo(40, -76, 58, -66, 66, -54);
  }
  c.fill(); c.strokeStyle = rgba(lc, .35); c.lineWidth = 2; c.beginPath(); c.arc(0, 0, o.female ? 112 : 116, -1.75, -.75); c.stroke();
  c.restore();
}
// telefonu tutan el: koyu ten, ekran ışığıyla kenar
function hand(c, x, y, w, rot, lc = [130, 170, 255]) {
  const h = w * 2.05; c.save(); c.translate(x, y); c.rotate(rot);
  const skin = (a) => lin(c, -w * .8, 0, w * .2, 0, [[0, [20, 17, 19], a], [1, [50, 41, 43], a]]);
  // avuç + bilek (alttan çıkar)
  c.fillStyle = skin(1); c.beginPath(); c.moveTo(-w * .58, h * .18); c.bezierCurveTo(-w * .75, h * .5, -w * .55, h * .75, -w * .4, h * 1.1); c.lineTo(w * .45, h * 1.1); c.bezierCurveTo(w * .5, h * .8, w * .62, h * .55, w * .56, h * .3); c.closePath(); c.fill();
  c.restore();
}
function fingers(c, x, y, w, rot, lc = [130, 170, 255]) { // telefonun önüne gelen parmaklar
  const h = w * 2.05; c.save(); c.translate(x, y); c.rotate(rot);
  for (let i = 0; i < 3; i++) { const fy = h * (.06 + i * .12), fl = w * (.2 - i * .02);
    c.fillStyle = lin(c, -w / 2 - fl, 0, -w / 2 + fl, 0, [[0, [22, 19, 21]], [1, [58, 48, 50]]]); c.beginPath(); c.moveTo(-w / 2 - w * .08, fy - h * .045); c.quadraticCurveTo(-w / 2 + fl, fy - h * .05, -w / 2 + fl + w * .02, fy); c.quadraticCurveTo(-w / 2 + fl, fy + h * .05, -w / 2 - w * .08, fy + h * .05); c.closePath(); c.fill();
    c.strokeStyle = rgba(lc, .35); c.lineWidth = 1.5; c.beginPath(); c.moveTo(-w / 2 - w * .02, fy - h * .045); c.quadraticCurveTo(-w / 2 + fl, fy - h * .05, -w / 2 + fl + w * .02, fy); c.stroke(); }
  // başparmak sağ kenarda
  c.fillStyle = lin(c, w * .3, 0, w * .7, 0, [[0, [60, 50, 52]], [1, [22, 19, 21]]]); c.beginPath(); c.moveTo(w * .62, h * .45); c.bezierCurveTo(w * .4, h * .3, w * .38, h * .16, w * .46, h * .1); c.bezierCurveTo(w * .54, h * .06, w * .62, h * .12, w * .64, h * .22); c.closePath(); c.fill();
  c.strokeStyle = rgba(lc, .4); c.lineWidth = 1.5; c.beginPath(); c.moveTo(w * .4, h * .2); c.bezierCurveTo(w * .4, h * .12, w * .5, h * .05, w * .58, h * .12); c.stroke();
  c.restore();
}
