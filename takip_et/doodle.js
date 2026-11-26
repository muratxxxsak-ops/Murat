'use strict';
// ====== DEFTER KARALAMASI: kurşunkalem + kuru boya, titreyen çizgiler ======
const cv = document.getElementById('cv'), C = cv.getContext('2d');
const mkc = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
const cs = (c, a = 1) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`;
const GR = [52, 50, 56], RED = [214, 60, 70], BLUE = [70, 120, 210], YEL = [244, 200, 60], PINK = [240, 120, 150], SKIN = [246, 206, 170], HOOD = [255, 150, 60], GRN = [90, 170, 100];
let BSEED = 0, BN = 0;
const bj = (a = 1.6) => { BN++; const r = Math.sin(BN * 12.9898 + BSEED * 78.233) * 43758.5453; return (r - Math.floor(r) - .5) * 2 * a; };
// kâğıt (bir kez üretilir)
const PAPER = (() => { const c = mkc(W, H), x = c.getContext('2d'); x.fillStyle = '#fbf8ef'; x.fillRect(0, 0, W, H);
  const id = x.getImageData(0, 0, W, H), r = rng(5); for (let i = 0; i < id.data.length; i += 4) { const n = (r() - .5) * 14; id.data[i] += n; id.data[i + 1] += n; id.data[i + 2] += n; } x.putImageData(id, 0, 0);
  x.strokeStyle = 'rgba(110,160,220,.45)'; x.lineWidth = 2; for (let y = 180; y < H; y += 64) { x.beginPath(); x.moveTo(0, y); x.lineTo(W, y); x.stroke(); }
  x.strokeStyle = 'rgba(230,90,100,.5)'; x.lineWidth = 2.5; x.beginPath(); x.moveTo(120, 0); x.lineTo(120, H); x.stroke();
  for (let i = 0; i < 3; i++) { x.fillStyle = '#e8e2d4'; x.beginPath(); x.arc(52, 300 + i * 640, 22, 0, TAU); x.fill(); }
  const g = x.createRadialGradient(W / 2, H / 2, H * .3, W / 2, H / 2, H * .75); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(90,70,40,.12)'); x.fillStyle = g; x.fillRect(0, 0, W, H); return c; })();
// ---- kalem çizgisi ----
function stroke(pts, o = {}) { const col = o.col || GR, w = o.w || 3.2, a = o.a === undefined ? .9 : o.a, close = o.close;
  for (let pass = 0; pass < 2; pass++) { const J = pts.map(p => [p[0] + bj(o.j || 1.4), p[1] + bj(o.j || 1.4)]);
    if (J.length <= 6 && !o.curve) { C.beginPath(); C.moveTo(J[0][0], J[0][1]); for (let i = 1; i < J.length; i++) C.lineTo(J[i][0], J[i][1]); if (close) C.closePath(); C.strokeStyle = cs(col, pass ? a * .45 : a); C.lineWidth = pass ? w * .6 : w; C.lineCap = 'round'; C.lineJoin = 'round'; C.stroke(); continue; }
    C.beginPath(); C.moveTo(J[0][0], J[0][1]); for (let i = 1; i < J.length - 1; i++) { const p = J[i], q = J[i + 1]; C.quadraticCurveTo(p[0], p[1], (p[0] + q[0]) / 2, (p[1] + q[1]) / 2); }
    if (close) { C.quadraticCurveTo(J[J.length - 1][0], J[J.length - 1][1], (J[J.length - 1][0] + J[0][0]) / 2, (J[J.length - 1][1] + J[0][1]) / 2); C.lineTo(J[0][0], J[0][1]); } else C.lineTo(J[J.length - 1][0], J[J.length - 1][1]);
    C.strokeStyle = cs(col, pass ? a * .45 : a); C.lineWidth = pass ? w * .6 : w; C.lineCap = 'round'; C.lineJoin = 'round'; C.stroke(); } }
const ell = (x, y, rx, ry, n = 22, a0 = 0, a1 = TAU) => Array.from({ length: n + 1 }, (_, i) => { const a = a0 + (a1 - a0) * i / n; return [x + Math.cos(a) * rx, y + Math.sin(a) * ry]; });
const rectP = (x, y, w, h) => [[x, y], [x + w, y], [x + w, y + h], [x, y + h], [x, y]];
// kuru boya tarama dolgusu
function hatch(pts, col, o = {}) { const sp = o.sp || 7, ang = o.ang === undefined ? -.9 : o.ang, a = o.a === undefined ? .55 : o.a;
  let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9; for (const p of pts) { x0 = Math.min(x0, p[0]); y0 = Math.min(y0, p[1]); x1 = Math.max(x1, p[0]); y1 = Math.max(y1, p[1]); }
  C.save(); C.beginPath(); C.moveTo(pts[0][0], pts[0][1]); for (const p of pts) C.lineTo(p[0], p[1]); C.closePath(); C.clip();
  C.fillStyle = cs(col, a * .35); C.fill();
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, R = Math.hypot(x1 - x0, y1 - y0) / 2 + 10, dx = Math.cos(ang), dy = Math.sin(ang);
  C.strokeStyle = cs(col, a); C.lineWidth = o.lw || 3.2; C.lineCap = 'round'; C.beginPath();
  for (let k = -R; k < R; k += sp) { const ox = -dy * k, oy = dx * k, j = bj(2); C.moveTo(cx + ox - dx * R + j, cy + oy - dy * R + bj(2)); C.lineTo(cx + ox + dx * R + bj(2), cy + oy + dy * R + j); }
  C.stroke(); C.restore(); }
function shape(pts, fill, o = {}) { if (fill) hatch(pts, fill, o); stroke(pts, Object.assign({ close: true }, o.line || {})); }
function blobC(x, y, rx, ry, fill, o = {}) { shape(ell(x, y, rx, ry, o.n || 22), fill, o); }
function write(s, x, y, size, o = {}) { C.save(); C.translate(x + bj(1), y + bj(1)); C.rotate((o.rot || 0) + bj(.01)); C.font = `${o.w || 600} ${size}px ${o.font || 'Caveat'}`; C.textAlign = o.align || 'center'; C.textBaseline = 'middle'; C.fillStyle = cs(o.col || GR, o.a === undefined ? .92 : o.a); C.fillText(s, 0, 0); C.restore(); }
// ---- karakter: kapüşonlu genç ----
// o: x,y (ayak), s (ölçek), mouth, mood ('sad','shock','happy','cry'), look, arms [[a,b],[a,b]], tear, walk, back
function kid(o) {
  const s = o.s, x = o.x, y = o.y, md = o.mood || 'sad', lk = o.look || 0, bob = o.bob || 0;
  const hipY = y - 1.05 * s, shY = y - 2.55 * s + bob, hy = shY - .95 * s;
  // bacaklar
  if (!o.noLegs) for (const sd of [-1, 1]) { const ph = o.walk ? Math.sin(o.walk + (sd > 0 ? Math.PI : 0)) : 0, ax = x + sd * .32 * s + ph * .35 * s, ay = y - Math.max(0, ph) * .15 * s;
    shape([[x + sd * .1 * s, hipY], [x + sd * .48 * s, hipY], [ax + sd * .2 * s, ay - .1 * s], [ax - sd * .14 * s, ay - .1 * s]], [70, 90, 150]);
    shape(ell(ax + sd * .06 * s, ay - .05 * s, .3 * s, .14 * s, 14), [240, 240, 240]); }
  // kollar (gövdenin arkasında kalanlar önce)
  const arm = (sd, A) => { const a1 = A ? A[0] : .2, a2 = A ? A[1] : .1, s0 = [x + sd * .72 * s, shY + .25 * s], e = [s0[0] + Math.sin(a1) * sd * .85 * s, s0[1] + Math.cos(a1) * .85 * s], h = [e[0] + Math.sin(a1 + a2) * sd * .8 * s, e[1] + Math.cos(a1 + a2) * .8 * s];
    stroke([s0, e, h], { w: .34 * s, col: shade(HOOD, .75), a: .9, j: .8, curve: 1 }); stroke([s0, e, h], { w: .25 * s, col: HOOD, a: .9, j: .8, curve: 1 }); blobC(h[0], h[1], .17 * s, .17 * s, SKIN); return h; };
  // gövde (kapüşonlu)
  const body = [[x - .3 * s, shY - .14 * s], [x - .66 * s, shY], [x - .8 * s, shY + .35 * s], [x - .78 * s, (shY + hipY) / 2], [x - .82 * s, hipY], [x - .7 * s, hipY + .14 * s], [x, hipY + .16 * s], [x + .7 * s, hipY + .14 * s], [x + .82 * s, hipY], [x + .78 * s, (shY + hipY) / 2], [x + .8 * s, shY + .35 * s], [x + .66 * s, shY], [x + .3 * s, shY - .14 * s], [x, shY - .1 * s]];
  // kapüşon (ensede)
  if (!o.back) shape(ell(x, shY - .02 * s, .55 * s, .2 * s, 14), shade(HOOD, .85), { line: { curve: 1 } });
  const hands = [arm(-1, o.arms && o.arms[0])];
  shape(body, HOOD, { line: { curve: 1 } }); stroke([[x - .45 * s, hipY - .3 * s], [x - .35 * s, hipY - .55 * s], [x + .35 * s, hipY - .55 * s], [x + .45 * s, hipY - .3 * s]], { w: 2.5 }); // cep
  if (!o.back) for (const sd of [-1, 1]) stroke([[x + sd * .14 * s, shY + .02 * s], [x + sd * .16 * s, shY + .55 * s]], { w: 2.5 });
  hands[1] = arm(1, o.arms && o.arms[1]);
  // kafa
  blobC(x, hy, .78 * s, .82 * s, o.back ? null : SKIN, { n: 26 });
  // saç (karışık)
  const hp = []; for (let i = 0; i <= 12; i++) { const a = Math.PI * (1.05 + i / 12 * .9), rr = (i % 2 ? .84 : .98) * s; hp.push([x + Math.cos(a) * rr, hy - .1 * s + Math.sin(a) * rr]); }
  if (o.back) shape(ell(x, hy, .8 * s, .84 * s, 26), [70, 50, 40]); else shape([...hp, [x + .75 * s, hy - .2 * s], [x + .3 * s, hy - .45 * s], [x - .2 * s, hy - .35 * s], [x - .75 * s, hy - .2 * s]], [70, 50, 40]);
  if (!o.back) {
    const ex = .3 * s, ey = hy + .02 * s, lx = lk * .07 * s;
    for (const sd of [-1, 1]) { const cx = x + sd * ex;
      if (md === 'happy') stroke(ell(cx, ey + .06 * s, .13 * s, .1 * s, 10, Math.PI * 1.1, Math.PI * 1.9), { w: 4 });
      else { shape(ell(cx, ey, .17 * s, (md === 'shock' ? .22 : .19) * s, 14), [255, 255, 255], { a: .2 }); blobC(cx + lx, ey + .04 * s, .075 * s, .085 * s, GR, { a: .9, sp: 3 });
        C.fillStyle = 'rgba(255,255,255,.95)'; C.beginPath(); C.arc(cx + lx - .025 * s, ey + .01 * s, .025 * s, 0, TAU); C.fill(); }
      // kaşlar: üzgün = iç uç yukarı
      const tilt = md === 'sad' || md === 'cry' ? .12 : md === 'shock' ? -.05 : md === 'angry' ? -.12 : 0;
      stroke([[cx - sd * .16 * s, ey - .27 * s - tilt * s], [cx + sd * .16 * s, ey - .27 * s + tilt * .3 * s]], { w: 5 }); }
    // ağız
    const mo = clamp(o.mouth || 0), my = hy + .42 * s;
    if (mo > .08 || md === 'shock') { const oo = Math.max(mo, md === 'shock' ? .5 : 0); shape(ell(x, my, (.12 + .06 * oo) * s, (.04 + .16 * oo) * s, 14), [150, 50, 60]); }
    else if (md === 'happy') stroke(ell(x, my - .06 * s, .2 * s, .14 * s, 12, .15, Math.PI - .15), { w: 4 });
    else stroke(ell(x, my + .1 * s, .14 * s, .08 * s, 10, Math.PI * 1.15, Math.PI * 1.85), { w: 4 });
    blobC(x - .5 * s, hy + .25 * s, .1 * s, .06 * s, PINK, { a: .4 }); blobC(x + .5 * s, hy + .25 * s, .1 * s, .06 * s, PINK, { a: .4 });
    if (o.tear) for (const sd of (md === 'cry' ? [-1, 1] : [1])) { const ty = ey + .2 * s + o.tear * .5 * s; shape([[x + sd * ex, ty - .1 * s], [x + sd * ex + .06 * s, ty + .03 * s], [x + sd * ex, ty + .07 * s], [x + sd * ex - .06 * s, ty + .03 * s]], [120, 180, 240]); }
  }
  return { hands, head: [x, hy] };
}
const shade = (c, k) => [c[0] * k, c[1] * k, c[2] * k];
// ---- nesneler ----
function phone(x, y, w, h, rot = 0, fn) { C.save(); C.translate(x, y); C.rotate(rot); shape(rectP(-w / 2, -h / 2, w, h), [60, 60, 70], { sp: 5 }); shape(rectP(-w / 2 + 10, -h / 2 + 16, w - 20, h - 32), [210, 235, 250], { a: .4 }); if (fn) fn(w, h); C.restore(); }
function heart(x, y, s, fill = RED, o = {}) { const p = []; for (let i = 0; i <= 28; i++) { const a = i / 28 * TAU; p.push([x + 16 * Math.sin(a) ** 3 * s / 16, y - (13 * Math.cos(a) - 5 * Math.cos(2 * a) - 2 * Math.cos(3 * a) - Math.cos(4 * a)) * s / 16]); } shape(p, fill, o); }
function lock(x, y, s) { stroke(ell(x, y - .45 * s, .3 * s, .35 * s, 12, Math.PI, TAU), { w: .1 * s }); shape(rectP(x - .45 * s, y - .45 * s, .9 * s, .75 * s), YEL); blobC(x, y - .12 * s, .08 * s, .08 * s, GR); }
function eyeIcon(x, y, s) { stroke(ell(x, y, s, s * .55, 18), { w: 4 }); blobC(x, y, s * .3, s * .3, GR); }
function bubble(x, y, w, h, fill = [255, 255, 255]) { shape([[x, y], [x + w, y], [x + w, y + h], [x + w * .3, y + h], [x + w * .15, y + h + h * .35], [x + w * .18, y + h], [x, y + h]], fill, { a: .25 }); }
function tumbleweed(x, y, r, t) { for (let i = 0; i < 7; i++) { const a = t * 6 + i; stroke(ell(x, y, r * (.6 + .4 * Math.sin(i)), r * (.5 + .5 * Math.cos(i * 1.3)), 16, a, a + TAU * .9), { col: [150, 120, 70], w: 3 }); } }
function spark(x, y, s, col = YEL) { for (let i = 0; i < 8; i++) { const a = i / 8 * TAU; stroke([[x + Math.cos(a) * s * .4, y + Math.sin(a) * s * .4], [x + Math.cos(a) * s, y + Math.sin(a) * s]], { col, w: 5 }); } }
function spring(x0, y0, x1, y1, n = 8, w = 30) { const p = []; for (let i = 0; i <= n * 4; i++) { const k = i / (n * 4), sd = Math.sin(k * n * TAU); p.push([lerp(x0, x1, k) + sd * w * -(y1 - y0) / Math.hypot(x1 - x0, y1 - y0), lerp(y0, y1, k) + sd * w * (x1 - x0) / Math.hypot(x1 - x0, y1 - y0)]); } stroke(p, { w: 4, col: [120, 120, 130] }); }
