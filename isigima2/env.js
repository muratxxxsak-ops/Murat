'use strict';
// ====== ORTAMLAR (basit perspektif: metre -> ekran) ======
let CAM = { x: 0, y: 1.6, z: -6, f: 760, hy: 330, cx: 640 };
function setCam(o) { CAM = Object.assign({ x: 0, y: 1.6, z: -6, f: 760, hy: 330, cx: 640 }, o); }
const pj = (x, y, z) => { const d = Math.max(.05, z - CAM.z), k = CAM.f / d; return [CAM.cx + (x - CAM.x) * k, CAM.hy - (y - CAM.y) * k]; };
const ps = z => CAM.f / Math.max(.05, z - CAM.z);
const angOf = (a, b) => Math.atan2(b[1] - a[1], b[0] - a[0]);
// ışık kaynakları (ton için): [{x,y,z,i,r}]
let LIGHTS = [];
function lightAt(x, y, z) { let s = 0; for (const L of LIGHTS) { const d2 = (x - L.x) ** 2 + (y - L.y) ** 2 + (z - L.z) ** 2; s += L.i / (1 + d2 / (L.r * L.r)); } return s; }
function quad(a, b, c, d, style) { P([a, b, c, d]); C.fillStyle = style; C.fill(); }

// ---- gökyüzü (yatay taramalı gravür gökyüzü) ----
function sky(o = {}) {
  const t0 = o.top === undefined ? .12 : o.top, t1 = o.low === undefined ? .45 : o.low;
  C.fillStyle = lg(0, 0, 0, o.h || H, [[0, t0], [1, t1]], 0); C.fillRect(-50, -50, W + 100, (o.h || H) + 50);
  if (o.moon) { const [mx, my, mr] = o.moon; lightR(mx, my, mr * 7, .35); lightR(mx, my, mr * 2.5, .3); C.beginPath(); C.arc(mx, my, mr, 0, TAU); C.fillStyle = ink(1, 0); C.fill();
    C.fillStyle = ink(.82, .5); for (const [dx, dy, rr] of [[-.3, -.2, .22], [.25, .1, .3], [-.1, .4, .16]]) { C.beginPath(); C.arc(mx + dx * mr, my + dy * mr, rr * mr, 0, TAU); C.fill(); } }
  if (o.clouds) { const r = rng(o.seed || 5); for (let i = 0; i < o.clouds; i++) { const y = r() * (o.cy || 300), x = ((r() * (W + 800) + (o.t || 0) * (8 + r() * 10)) % (W + 800)) - 400, w = 200 + r() * 420, hh = 18 + r() * 40, v = t0 + .05 + r() * .25;
    C.save(); C.translate(x, y); C.scale(1, hh / w); C.beginPath(); C.arc(0, 0, w / 2, 0, TAU); C.fillStyle = rg(0, 0, 0, w / 2, [[0, v + .12], [.7, v], [1, v - .02]], 0); C.globalAlpha = .9; C.fill(); C.restore(); } }
}
// ---- arnavut kaldırımı zemin ----
function ground(z0, z1, o = {}) {
  const base = o.base === undefined ? .16 : o.base, a = pj(-60, 0, z0), b = pj(60, 0, z0), c = pj(60, 0, z1), d = pj(-60, 0, z1);
  quad(a, b, c, d, lg(0, a[1], 0, c[1], [[0, base + .06], [1, base * .6]], 0));
  // taş sıraları
  for (let z = Math.ceil(z0 / .35) * .35; z < z1; z += .35) { const k = ps(z); if (k < 3) break; const y = pj(0, 0, z)[1];
    C.beginPath(); C.moveTo(-50, y); C.lineTo(W + 50, y); C.strokeStyle = ink(base * .3, 0); C.lineWidth = Math.max(.6, k * .03); C.stroke();
    const r = rng((z * 100) | 0); const off = r() * .5;
    for (let x = -12 + off; x < 12; x += .5) { const p = pj(x, 0, z), q = pj(x + (r() - .5) * .1, 0, z + .35); C.beginPath(); C.moveTo(p[0], p[1]); C.lineTo(q[0], q[1]); C.stroke(); } }
  // ışık havuzları
  for (const L of LIGHTS) { const p = pj(L.x, 0, L.z), k = ps(L.z); lightR(p[0], p[1], k * L.r * 2.2, Math.min(.6, L.i * .5), .32); }
  if (o.wet) for (const L of LIGHTS) { const p = pj(L.x, 0, L.z), top = pj(L.x, L.y, L.z), k = ps(L.z); C.save(); C.globalCompositeOperation = 'lighter'; C.fillStyle = `rgb(${(L.i * 60) | 0},0,0)`; for (let i = 0; i < 14; i++) { const yy = p[1] + i * k * .12; C.fillRect(p[0] - k * .12 * (1 + Math.sin(i * 2.1)), yy, k * .24 * (1 + Math.sin(i * 2.1)), Math.max(1, k * .03)); } C.restore(); }
}
// ---- cephe: x sabit düzlem, z0..z1 boyunca binalar ----
function facade(side, xw, z0, z1, seed, o = {}) {
  const r = rng(seed); let z = z0; const blds = [];
  while (z < z1) { const len = 7 + r() * 8, ht = 11 + r() * 10, st = r(); blds.push({ za: z, zb: Math.min(z1, z + len), ht, st, win: r() }); z += len; }
  blds.reverse();
  for (const b of blds) {
    if (b.zb < CAM.z + .6) continue; b.za = Math.max(b.za, CAM.z + .6);
    const x = side * xw, A = pj(x, 0, b.za), B = pj(x, 0, b.zb), Ct = pj(x, b.ht, b.zb), D = pj(x, b.ht, b.za);
    const lA = lightAt(x, 3, b.za), lB = lightAt(x, 3, b.zb);
    const base = (o.base === undefined ? .2 : o.base) + b.st * .08;
    const ang = angOf(A, B);
    quad(A, B, Ct, D, lg(A[0], 0, B[0], 0, [[0, base + Math.min(.45, lA * .35)], [1, base * .7 + Math.min(.4, lB * .3)]], ang));
    // katlar ve pencereler
    const fl = 3.4;
    for (let y = 1.2; y < b.ht - 2; y += fl) {
      const cor = [pj(x, y - .25, b.za), pj(x, y - .25, b.zb)]; strokeTone(cor, base * .5, ang, Math.max(.5, ps(b.za) * .06));
      for (let wz = b.za + 1.2; wz < b.zb - 1.2; wz += 2.8) {
        const k = ps(wz); if (k < 4) continue;
        const w0 = pj(x, y + .5, wz), w1 = pj(x, y + .5, wz + 1.1), w2 = pj(x, y + 2.3, wz + 1.1), w3 = pj(x, y + 2.3, wz);
        const lit = o.litWin && r() < o.litWin;
        quad(w0, w1, w2, w3, ink(lit ? .92 : .05 + r() * .05, Math.PI / 2));
        if (lit && o.glowWin) glow((w0[0] + w2[0]) / 2, (w0[1] + w2[1]) / 2, k * 1.4, o.glowWin);
        // pencere pervazı ve lento
        const s0 = pj(x - side * .12, y + .45, wz - .1), s1 = pj(x - side * .12, y + .45, wz + 1.2); strokeTone([s0, s1], Math.min(1, base + .3), ang, Math.max(.5, k * .09));
        const l0 = pj(x - side * .08, y + 2.4, wz - .15), l1 = pj(x - side * .08, y + 2.4, wz + 1.25); strokeTone([l0, l1], Math.min(1, base + .25), ang, Math.max(.5, k * .12));
        // pencere bölmesi
        const m0 = pj(x, y + .5, wz + .55), m1 = pj(x, y + 2.3, wz + .55); strokeTone([m0, m1], .3, Math.PI / 2, Math.max(.4, k * .03));
      }
    }
    // saçak
    const e0 = pj(x - side * .4, b.ht, b.za), e1 = pj(x - side * .4, b.ht, b.zb), e2 = pj(x, b.ht - .5, b.zb), e3 = pj(x, b.ht - .5, b.za);
    quad(e0, e1, e2, e3, ink(base * .5, ang));
    // bina köşesi
    strokeTone([A, D], .04, Math.PI / 2, Math.max(1, ps(b.za) * .08));
    // kapı
    if (b.st > .4) { const dz = b.za + 2, d0 = pj(x, 0, dz), d1 = pj(x, 0, dz + 1.3), d2 = pj(x, 2.5, dz + 1.3), d3 = pj(x, 2.5, dz); quad(d0, d1, d2, d3, ink(.03, Math.PI / 2)); }
  }
}
// ---- fener ----
function lamp(x, z, h = 3.6, lit = 1, o = {}) {
  const b = pj(x, 0, z), t = pj(x, h, z), k = ps(z);
  strokeTone([b, t], .06, Math.PI / 2, Math.max(1.5, k * .1));
  const hd = pj(x, h + .25, z);
  C.beginPath(); C.moveTo(hd[0] - k * .2, hd[1] + k * .25); C.lineTo(hd[0] + k * .2, hd[1] + k * .25); C.lineTo(hd[0] + k * .14, hd[1] - k * .2); C.lineTo(hd[0] - k * .14, hd[1] - k * .2); C.closePath();
  C.fillStyle = ink(.3 + .7 * lit, Math.PI / 2); C.fill(); strokeTone([[hd[0] - k * .24, hd[1] - k * .22], [hd[0], hd[1] - k * .4], [hd[0] + k * .24, hd[1] - k * .22]], .03, 0, Math.max(1, k * .05));
  if (lit > 0) { lightR(hd[0], hd[1], k * 3.5 * lit, .45 * lit); lightR(hd[0], hd[1], k * .8, .6 * lit); }
  if (o.gold) glow(hd[0], hd[1], k * 3, o.gold);
}
// ---- sis (uzakta açılan ton) ----
function fog(y0, y1, amt) { C.save(); C.globalCompositeOperation = 'lighter'; const g = C.createLinearGradient(0, y0, 0, y1); g.addColorStop(0, 'rgb(0,0,0)'); g.addColorStop(.5, `rgb(${(amt * 255) | 0},0,0)`); g.addColorStop(1, 'rgb(0,0,0)'); C.fillStyle = g; C.fillRect(-50, y0, W + 100, y1 - y0); C.restore(); }
function vpFog(amt, rad = 260) { const v = pj(0, 2, 200); lightR(v[0], v[1], rad, amt, .7); }
// ---- sokak (tek kaçış noktalı) ----
function street(o = {}) {
  const xw = o.xw || 4.5;
  sky({ top: o.skyTop === undefined ? .08 : o.skyTop, low: o.skyLow === undefined ? .3 : o.skyLow, moon: o.moon, clouds: o.clouds, t: o.t, h: CAM.hy + 40 });
  ground(CAM.z + .5, 160, { base: o.gbase, wet: o.wet });
  facade(-1, xw, CAM.z - 2, 150, o.seed || 11, { base: o.fbase, litWin: o.litWin, glowWin: o.glowWin });
  facade(1, xw, CAM.z - 2, 150, (o.seed || 11) + 7, { base: o.fbase, litWin: o.litWin, glowWin: o.glowWin });
  vpFog(o.fog === undefined ? .25 : o.fog);
}
// ---- çatılar / şehir panoraması ----
function rooftops(o = {}) {
  const r = rng(o.seed || 3), rows = o.rows || 5;
  for (let j = 0; j < rows; j++) {
    const p = j / (rows - 1), y0 = lerp(o.y0 || 380, o.y1 || 640, p), sc = lerp(.35, 1.4, p * p), v = lerp(o.far === undefined ? .45 : o.far, o.near === undefined ? .1 : o.near, p);
    let x = -100 - r() * 100 + (o.pan || 0) * (.3 + p);
    while (x < W + 100) {
      const w = (60 + r() * 90) * sc, hgt = (50 + r() * 80) * sc, roof = r();
      const yb = y0 + 140 * sc, yt = y0 - hgt;
      // duvar
      C.fillStyle = lg(x, 0, x + w, 0, [[0, v + .08], [1, v - .04]], Math.PI / 2); C.fillRect(x, yt, w + 1, yb - yt);
      // pencereler
      for (let wy = yt + 16 * sc; wy < yb - 10 * sc; wy += 26 * sc) for (let wx = x + 10 * sc; wx < x + w - 14 * sc; wx += 22 * sc) {
        const lit = o.lit && r() < o.lit; C.fillStyle = ink(lit ? .95 : v * .45, 0); C.fillRect(wx, wy, 8 * sc, 13 * sc);
        if (lit && o.goldWin) { C.fillStyle = ink(.9, 0, 1); C.fillRect(wx, wy, 8 * sc, 13 * sc); glow(wx + 4 * sc, wy + 6 * sc, 20 * sc, o.goldWin); } }
      // çatı
      if (roof < .6) { P([[x - 6 * sc, yt], [x + w / 2, yt - hgt * .45], [x + w + 6 * sc, yt]]); C.fillStyle = lg(0, yt - hgt * .45, 0, yt, [[0, v + .1], [1, v - .05]], .6); C.fill(); }
      else { C.fillStyle = ink(v - .05, 0); C.fillRect(x - 4 * sc, yt - 6 * sc, w + 8 * sc, 7 * sc); }
      // bacalar
      if (r() < .7) { const cx = x + r() * w * .7, ch = (20 + r() * 25) * sc, cy = yt - (roof < .6 ? hgt * .2 : 0);
        C.fillStyle = lg(cx, 0, cx + 12 * sc, 0, [[0, v + .1], [1, v - .06]], Math.PI / 2); C.fillRect(cx, cy - ch, 12 * sc, ch);
        C.fillStyle = ink(v - .08, 0); C.fillRect(cx - 2 * sc, cy - ch - 4 * sc, 16 * sc, 5 * sc);
        if (o.smoke) { for (let k = 0; k < 6; k++) { const tt = (o.t || 0) * .3 + k * .17 + cx * .01, ph = ((tt % 1) + 1) % 1, sy = cy - ch - ph * 120 * sc, sx = cx + 6 * sc + Math.sin(tt * 5) * 10 * sc + ph * 40 * sc;
          C.beginPath(); C.arc(sx, sy, (6 + ph * 18) * sc, 0, TAU); C.fillStyle = ink(lerp(v + .25, v + .1, ph), .2); C.globalAlpha = .6 * (1 - ph); C.fill(); C.globalAlpha = 1; } } }
      x += w + r() * 10 * sc;
    }
    if (o.fogRows) fog(y0 - 80 * sc, y0 + 60 * sc, o.fogRows * (1 - p));
  }
}
// ---- altın alevler ----
function flames(x, y, w, hgt, t, seed = 1, amt = 1) {
  const r = rng(seed), n = Math.max(2, (w / 50) | 0);
  const tongue = (fx, fw, fh, ph, v0, v1) => { const L = [], R = [];
    for (let k = 0; k <= 10; k++) { const q = k / 10, yy = y - q * fh, sw = Math.sin(t * 7 + ph - q * 3.2) * fw * .35 * q + Math.sin(t * 3.1 + ph * 2) * fw * .15 * q, hw = fw / 2 * Math.pow(1 - q, .75) * (1 + .18 * Math.sin(q * 9 + t * 5 + ph));
      L.push([fx + sw - hw, yy]); R.push([fx + sw + hw, yy]); }
    C.beginPath(); C.moveTo(L[0][0], L[0][1]); for (let k = 1; k <= 10; k++) C.lineTo(L[k][0], L[k][1]); for (let k = 10; k >= 0; k--) C.lineTo(R[k][0], R[k][1]); C.closePath();
    C.fillStyle = lg(0, y, 0, y - fh, [[0, v0], [1, v1]], Math.PI / 2, 1); C.fill(); };
  for (let i = 0; i < n; i++) { const fx = x + (i + .5) / n * w + (r() - .5) * 20, ph = r() * TAU, fh = hgt * (.55 + r() * .5) * (.85 + .15 * Math.sin(t * 9 + ph)) * amt, fw = w / n * 1.7;
    tongue(fx, fw, fh, ph, .85, .45); tongue(fx, fw * .5, fh * .6, ph + 1, 1, .8); }
  glow(x + w / 2, y - hgt * .4, Math.max(w, hgt) * .9, .8 * amt);
}
function smokeCol(x, y, w, hgt, t, v = .25, seed = 2) { const r = rng(seed);
  for (let i = 0; i < 14; i++) { const ph = (t * .12 + r()) % 1, sx = x + (r() - .5) * w + Math.sin(t * .7 + i) * 30 + ph * 80, sy = y - ph * hgt, rr = (30 + ph * 120) * (w / 300);
    C.beginPath(); C.arc(sx, sy, rr, 0, TAU); C.fillStyle = rg(sx - rr * .3, sy - rr * .3, 0, rr, [[0, v + .12], [1, v - .04]], .4 + i * .3); C.globalAlpha = .8 * Math.sin(ph * Math.PI); C.fill(); C.globalAlpha = 1; } }
