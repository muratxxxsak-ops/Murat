'use strict';
// ====== KASIM ŞEHRİ: yağmur, ıslak sokak, sarı yapraklar, sıcak pencereler ======
const COL = { night: [58, 70, 96], dusk: [120, 128, 150], slate: [92, 104, 122], warm: [244, 186, 104], amber: [230, 150, 70], leaf: [214, 128, 44], leaf2: [190, 82, 34], brick: [150, 96, 80], stone: [150, 146, 140], ink: [40, 34, 32], umb: [176, 36, 40] };
let CAM = { x: 0, y: 1.6, z: -6, f: 760, hy: 340, cx: 640 };
function setCam(o) { CAM = Object.assign({ x: 0, y: 1.6, z: -6, f: 760, hy: 340, cx: 640 }, o); }
const pj = (x, y, z) => { const d = Math.max(.05, z - CAM.z), k = CAM.f / d; return [CAM.cx + (x - CAM.x) * k, CAM.hy - (y - CAM.y) * k]; };
const ps = z => CAM.f / Math.max(.05, z - CAM.z);
const at = (x, z, y = 0) => { const p = pj(x, y, z); return { x: p[0], y: p[1], k: ps(z) }; };
function P2(who, x, z, o = {}) { const p = at(x, z); return person(Object.assign({ x: p.x, y: p.y, h: LOOK[who].h * p.k, who }, o)); }
function skyWash(top = COL.night, low = COL.dusk, y1 = H) { vwash(-20, y1, [[0, top], [1, low]]); }
// bulut lekeleri
function cloudsW(t, n, y0, y1, col, a = .35, seed = 3) { const r = rng(seed); for (let i = 0; i < n; i++) { const x = ((r() * (W + 600) + t * (6 + r() * 6)) % (W + 600)) - 300, y = lerp(y0, y1, r()); blob(x, y, 120 + r() * 160, col, a, .35 + r() * .2); } }
// perspektif sokak (suluboya cepheler)
function streetW(o = {}) {
  const xw = o.xw || 5, r = rng(o.seed || 7);
  skyWash(o.sky0 || COL.night, o.sky1 || [150, 150, 166], CAM.hy + 60);
  cloudsW(o.t || 0, 6, 20, CAM.hy - 60, [70, 80, 104], .3, (o.seed || 7) + 1);
  // zemin (ıslak)
  const g0 = pj(0, 0, CAM.z + .6)[1]; vwash(CAM.hy - 2, H + 20, [[0, [128, 130, 140]], [.4, [92, 96, 110]], [1, [60, 64, 80]]]);
  // cepheler
  for (const side of [-1, 1]) {
    let z = CAM.z + 1; const bl = [];
    while (z < 90) { const len = 6 + r() * 7; bl.push({ za: z, zb: z + len, ht: 10 + r() * 9, c: [COL.brick, COL.stone, [170, 150, 120], [120, 118, 126]][(r() * 4) | 0], cafe: r() < (o.cafe || .25) }); z += len; }
    bl.reverse();
    for (const b of bl) { const x = side * xw, A = pj(x, 0, b.za), B = pj(x, 0, b.zb), Cc = pj(x, b.ht, b.zb), D = pj(x, b.ht, b.za);
      const fogk = clamp((b.za - CAM.z) / 60); const col = mix(b.c, [150, 152, 166], fogk * .8);
      Pth([A, B, Cc, D]); C.fillStyle = lgc(A[0], 0, B[0], 0, [[0, shade(col, .85)], [1, shade(col, .95)]]); C.fill();
      // pencereler
      for (let y = 3.6; y < b.ht - 1.5; y += 3.2) for (let wz = b.za + 1; wz < b.zb - 1; wz += 2.4) { const k = ps(wz); if (k < 5) continue;
        const lit = r() < (o.lit === undefined ? .35 : o.lit), w0 = pj(x, y, wz), w1 = pj(x, y, wz + 1), w2 = pj(x, y + 1.7, wz + 1), w3 = pj(x, y + 1.7, wz);
        Pth([w0, w1, w2, w3]); C.fillStyle = cs(lit ? mix(COL.warm, [255, 240, 200], .3) : shade(col, .55)); C.fill();
        if (lit) blob((w0[0] + w2[0]) / 2, (w0[1] + w2[1]) / 2, k * 1.4, COL.warm, .25); }
      // dükkân / kafe
      if (b.cafe) { const s0 = pj(x, 0, b.za + 1), s1 = pj(x, 0, b.zb - 1), s2 = pj(x, 2.8, b.zb - 1), s3 = pj(x, 2.8, b.za + 1); Pth([s0, s1, s2, s3]); C.fillStyle = cs([250, 200, 120]); C.fill();
        blob((s0[0] + s2[0]) / 2, (s0[1] + s2[1]) / 2, ps(b.za + 2) * 3, COL.warm, .35);
        const a0 = pj(x - side * 1.2, 3.2, b.za + 1), a1 = pj(x - side * 1.2, 3.2, b.zb - 1); Pth([s3, s2, a1, a0]); C.fillStyle = cs([150, 50, 46]); C.fill(); }
      pen([A, D], Math.max(.6, ps(b.za) * .02), .25);
    }
  }
  // ıslak yansımalar: pencere/lamba ışıklarının yere düşen dikey izleri
  if (o.refl !== false) { const rr = rng(5); for (let i = 0; i < 26; i++) { const z = 2 + rr() * 40, x = (rr() < .5 ? -1 : 1) * (xw - .5 - rr() * 1.5), p = pj(x, 0, z), k = ps(z); C.save(); C.globalAlpha = .35; C.fillStyle = cs(COL.warm); C.fillRect(p[0] - k * .15, p[1], k * .3, k * 1.6); C.restore(); } }
}
function lampW(x, z, h = 3.8, on = 1) { const b = pj(x, 0, z), tp = pj(x, h, z), k = ps(z); pen([b, tp], Math.max(1.5, k * .08), .85, false, [40, 38, 44]);
  C.beginPath(); C.ellipse(tp[0], tp[1], k * .18, k * .26, 0, 0, TAU); C.fillStyle = cs(on ? [255, 226, 160] : [90, 90, 100]); C.fill();
  if (on) { blob(tp[0], tp[1], k * 2.2 * on, COL.warm, .45 * on); blob(b[0], b[1], k * 2.4, COL.warm, .3 * on, .25); }
  pen([[tp[0] - k * .2, tp[1] - k * .3], [tp[0], tp[1] - k * .45], [tp[0] + k * .2, tp[1] - k * .3]], Math.max(1, k * .04), .8); }
// ağaç (mevsimlik)
function treeW(x, y, s, season = 'autumn', t = 0, seed = 2) {
  const r = rng(seed); const tc = [70, 56, 50];
  // gövde ve dallar
  const br = (x0, y0, a, l, w, d) => { const x1 = x0 + Math.sin(a) * l, y1 = y0 - Math.cos(a) * l; C.beginPath(); C.moveTo(x0 - w, y0); C.lineTo(x0 + w, y0); C.lineTo(x1 + w * .6, y1); C.lineTo(x1 - w * .6, y1); C.closePath(); C.fillStyle = cs(tc); C.fill();
    if (d < 4) { br(x1, y1, a - .35 - r() * .3, l * .72, w * .62, d + 1); br(x1, y1, a + .3 + r() * .3, l * .7, w * .6, d + 1); } else leafs.push([x1, y1]); };
  const leafs = []; br(x, y, 0, s * .45, s * .05, 0);
  const pal = { autumn: [COL.leaf, COL.leaf2, [230, 176, 60]], winter: null, spring: [[250, 200, 214], [240, 170, 190], [255, 230, 236]], summer: [[90, 140, 70], [60, 110, 60], [130, 170, 80]] }[season];
  if (pal) for (const [lx, ly] of leafs) for (let k = 0; k < 4; k++) blob(lx + (r() - .5) * s * .25, ly + (r() - .5) * s * .2, s * (.06 + r() * .07), pal[(r() * 3) | 0], .75);
  if (season === 'winter') for (const [lx, ly] of leafs) blob(lx, ly - 3, s * .03, [250, 252, 255], .8, .5);
}
function leavesFall(t, n, seed = 4, sz = 1, col) { const r = rng(seed); for (let i = 0; i < n; i++) { const sp = .1 + r() * .1, ph = (t * sp + r()) % 1, x = (r() * (W + 200) - 100) + Math.sin(t * 1.3 + i) * 50 + ph * 120, y = -30 + ph * (H + 60), a = t * 2 + i, s = (6 + r() * 7) * sz;
  C.save(); C.translate(x, y); C.rotate(a); C.scale(1, .45 + .55 * Math.abs(Math.sin(t * 2.5 + i))); C.beginPath(); C.ellipse(0, 0, s, s * .5, 0, 0, TAU); C.fillStyle = cs(col || [COL.leaf, COL.leaf2, [232, 180, 60]][i % 3]); C.fill(); C.restore(); } }
// yağmur: beyaz guaj çizgiler (son katman) + su sıçramaları
function rainTop(t, n, slant = .12, len = 26, a = .45, seed = 3) { const r = rng(seed); TP.strokeStyle = `rgba(232,238,246,${a})`; TP.lineWidth = 1.3; TP.beginPath();
  for (let i = 0; i < n; i++) { const x0 = r() * (W + 300) - 150, y0 = r() * H, sp = 1100 * (.7 + r() * .6), y = ((y0 + t * sp) % (H + 60)) - 30, x = x0 - y * slant; TP.moveTo(x, y); TP.lineTo(x - slant * len, y + len); } TP.stroke(); }
function splashes(t, n, y0, y1, seed = 6) { const r = rng(seed); for (let i = 0; i < n; i++) { const ph = (t * 2.2 + r()) % 1, x = r() * W, y = lerp(y0, y1, r()); TP.strokeStyle = `rgba(230,236,244,${.5 * (1 - ph)})`; TP.lineWidth = 1; TP.beginPath(); TP.ellipse(x, y, 3 + ph * 14, (3 + ph * 14) * .3, 0, 0, TAU); TP.stroke(); } }
// camdaki damlalar (içeriden bakış)
function glassDrops(t, n, seed = 9) { const r = rng(seed); for (let i = 0; i < n; i++) { const x = r() * W, sp = r() < .15 ? 30 + r() * 60 : 0, y = (r() * H + t * sp) % H, s = 3 + r() * 6;
  TP.fillStyle = 'rgba(240,244,250,.5)'; TP.beginPath(); TP.ellipse(x, y, s * .8, s, 0, 0, TAU); TP.fill(); TP.fillStyle = 'rgba(40,50,70,.25)'; TP.beginPath(); TP.ellipse(x + s * .2, y + s * .3, s * .5, s * .5, 0, 0, TAU); TP.fill();
  if (sp) { TP.strokeStyle = 'rgba(240,244,250,.3)'; TP.lineWidth = s * .5; TP.beginPath(); TP.moveTo(x, y - 60); TP.lineTo(x, y); TP.stroke(); } } }
// takvim yaprağı
function calendar(x, y, s, month, num, rot = 0, a = 1) {
  C.save(); C.translate(x, y); C.rotate(rot); C.globalAlpha = a;
  C.fillStyle = cs([250, 246, 236]); C.fillRect(-s * .5, -s * .65, s, s * 1.3);
  C.fillStyle = cs(COL.umb); C.fillRect(-s * .5, -s * .65, s, s * .3);
  paintText(month, 0, -s * .5, s * .17, [252, 244, 236], { font: 'Kalam', sp: 3 }); paintText(String(num), 0, s * .15, s * .6, [50, 42, 40], { font: 'Kalam' });
  C.restore();
  pen([[x - s * .5, y - s * .65], [x + s * .5, y - s * .65], [x + s * .5, y + s * .65], [x - s * .5, y + s * .65]], 1.2, .5, true);
}
function bench(x, y, s) { C.fillStyle = cs([110, 76, 56]); for (let i = 0; i < 3; i++) C.fillRect(x - s, y - s * (.55 + i * .12), 2 * s, s * .07); C.fillRect(x - s, y - s * .42, 2 * s, s * .08);
  for (const sd of [-1, 1]) pen([[x + sd * s * .85, y - s * .9], [x + sd * s * .85, y]], Math.max(1.5, s * .05), .8); }
function brickWallW(x0, y0, w, h, col = COL.brick) { C.fillStyle = cs(col); C.fillRect(x0, y0, w, h); const r = rng(3);
  for (let y = y0, row = 0; y < y0 + h; y += 26, row++) { for (let x = x0 - (row % 2) * 28; x < x0 + w; x += 56) blob(x + 28, y + 13, 22, shade(col, .8 + r() * .3), .3, .45); pen([[x0, y], [x0 + w, y]], 1, .15); } }
