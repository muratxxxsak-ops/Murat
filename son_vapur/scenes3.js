'use strict';
// ortak gece limanı
function nightPort(c, t, o = {}) {
  const hy = o.hy || 392, pal = o.pal || PAL.night, tt = o.tt === undefined ? t : o.tt;
  skyFill(c, pal, hy + 2); stars(c, tt, 0.75 * (o.stars === undefined ? 1 : o.stars), hy);
  if (o.moon) moon(c, o.moon[0], o.moon[1], o.moon[2], 0.95);
  clouds(c, tt, 200, [70, 80, 130], 0.22, 41, 4, 6, 1.3);
  const cc = mul(pal.top, 2.2);
  skyline(c, -60, hy + 2, 520, 51, 8, 60, cc, { lights: { p: 0.5, col: [255, 200, 120], a: 0.85 }, t: tt });
  skyline(c, 800, hy + 2, 560, 52, 8, 50, cc, { lights: { p: 0.5, col: [255, 200, 120], a: 0.85 }, t: tt });
  galata(c, 260, hy + 2, 0.45, mul(pal.top, 1.6));
  sea(c, hy, mix(pal.low, [0, 0, 0], 0.2), pal.sea, tt, { wc: [190, 210, 255], wa: 0.9 });
  for (const lx of (o.lampRefl || [])) { for (let j = 0; j < 14; j++) { const p = j / 14; c.fillStyle = `rgba(255,190,110,${0.35 * (1 - p)})`; const w = 6 + p * 22 * (0.5 + 0.5 * Math.sin(tt * 2 + j)); c.fillRect(lx - w / 2 + Math.sin(tt + j) * 4, hy + 10 + p * 140, w, 2 + p * 3); } }
  if (o.ferry) { const f = o.ferry; ferry(c, f.x, f.y, f.s, f.dir, { lit: 1, dim: 0.34, t: tt, wake: f.wake }); }
  if (o.gang) { const g = o.gang; c.fillStyle = '#0c0a14'; c.beginPath(); c.moveTo(g.x0, g.y0); c.lineTo(g.x1, g.y1); c.lineTo(g.x1, g.y1 + 9); c.lineTo(g.x0, g.y0 + 9); c.fill(); c.strokeStyle = '#0c0a14'; c.lineWidth = 3; c.beginPath(); c.moveTo(g.x0, g.y0 - 34); c.lineTo(g.x1, g.y1 - 34); c.moveTo(g.x0, g.y0); c.lineTo(g.x0, g.y0 - 34); c.moveTo(g.x1, g.y1); c.lineTo(g.x1, g.y1 - 34); c.stroke(); }
  pierDeck(c, o.deckY || 540, [14, 12, 24], [90, 100, 150], tt);
  for (const L of (o.lamps || [])) {
    c.fillStyle = '#08070f'; c.fillRect(L.x - 3, L.top, 6, (o.deckY || 540) + 90 - L.top);
    glow(c, L.x, L.top, 190, [255, 190, 110], 0.7, 'lighter'); glow(c, L.x, L.top, 26, [255, 244, 210], 1, 'lighter');
    const g = c.createLinearGradient(0, L.top, 0, 600); g.addColorStop(0, 'rgba(255,200,130,0.28)'); g.addColorStop(1, 'rgba(255,200,130,0.02)');
    c.save(); c.globalCompositeOperation = 'lighter'; c.fillStyle = g; c.beginPath(); c.moveTo(L.x - 10, L.top + 6); c.lineTo(L.x + 10, L.top + 6); c.lineTo(L.x + 190, 600); c.lineTo(L.x - 190, 600); c.fill(); c.restore();
  }
}
// =============== BÖLÜM 4: Son Vapur — yağmurlu iskele (112.2 - 131.5) ===============
function sceneRainPier(c, t) {
  const lt = t - 112.2, k = sm(lt / 19);
  c.save(); cam(c, lerp(640, 540, k), lerp(380, 400, k), lerp(1, 1.3, k), 0);
  const ap = eo(seg(lt, 0, 9)), fx = lerp(1650, 940, ap);
  nightPort(c, t, { ferry: { x: fx, y: 505, s: 1.15, dir: -1, wake: lt < 9.5 }, gang: lt > 9.2 ? { x0: 640, y0: 540, x1: 780, y1: 470 } : null, lamps: [{ x: 400, top: 270 }, { x: 1010, top: 290 }], lampRefl: [400, 1010] });
  const gx = 470, dir = (lt > 11 && lt < 16.5) ? -1 : 1;
  person(c, { x: gx, y: 598, s: 1.3, dir, pose: 'stand', t, col: [5, 5, 12], rim: [255, 190, 120], kind: 'girl', wind: 0.35, umbrella: 1 });
  c.save(); c.beginPath(); c.moveTo(390, 276); c.lineTo(410, 276); c.lineTo(600, 700); c.lineTo(200, 700); c.clip(); rain(c, t, 260, 0.2, [255, 220, 170], 0.55, 30, 950, 14); c.restore();
  rain(c, t, 420, 0.2, [190, 210, 255], 0.3 + 0.1 * EN, 28, 900, 3);
  for (const [px, py] of [[300, 640], [560, 665], [840, 650], [1050, 690]]) { const rr = (1 - KK) * 34 + 4; c.strokeStyle = `rgba(255,220,170,${KK * 0.45})`; c.lineWidth = 1.5; c.beginPath(); c.ellipse(px, py, rr * 1.6, rr * 0.5, 0, 0, TAU); c.stroke(); }
  const hf = seg(lt, 9.5, 10.6); if (hf > 0 && hf < 1) tint(c, [255, 240, 220], 0.25 * (1 - hf), 'lighter');
  c.restore();
  tint(c, [10, 20, 60], 0.18, 'multiply'); vignette(c, 0.6);
}
// =============== BÖLÜM 5: Duvar (131.5 - 151) ===============
const BRICKS = (() => { const r = rng(404), a = []; for (let row = 0; row < 24; row++) for (let i = -1; i < 8; i++) { const w = 24, x = 560 + i * 20 + (row % 2 ? 10 : 0); a.push({ x: 560 + ((i * 20 + (row % 2 ? 10 : 0)) % 160), y: 130 + row * 18, w: 19, h: 16, col: 70 + r() * 40, d: r(), vx: (r() - 0.5) * 3, vr: (r() - 0.5) * 3, row, i }); } return a; })();
const CRACKS = (() => { const r = rng(909), rays = []; for (let i = 0; i < 9; i++) { let a = i / 9 * TAU + r() * 0.5, x = 640, y = 330, pts = [[x, y]]; for (let s = 0; s < 14; s++) { a += (r() - 0.5) * 0.7; const l = 14 + r() * 14; x += Math.cos(a) * l * 1.0; y += Math.sin(a) * l * 1.5; pts.push([x, y]); } rays.push(pts); } return rays; })();
function sceneBridge(c, t) {
  const lt = t - 131.5, intro = sm(lt / 3), crumb = seg(lt, 16.0, 19.0), burst = sm(seg(lt, 14.6, 16.0));
  c.save(); cam(c, 640, 360, 1 + sm(lt / 19) * 0.12, 0);
  c.fillStyle = '#04050c'; c.fillRect(-300, -300, W + 600, H + 600);
  const room = (x0, x1, cw, cw2, flip) => {
    c.fillStyle = vgrad(c, 130, 560, [[0, cw], [1, cw2]]); c.fillRect(x0, 130, x1 - x0, 430);
    c.fillStyle = 'rgba(0,0,0,0.35)'; c.fillRect(x0, 540, x1 - x0, 20); c.fillStyle = '#08070e'; c.fillRect(x0 - 14, 560, x1 - x0 + 28, 30); c.fillRect(x0 - 14, 100, x1 - x0 + 28, 30);
    const wx = flip ? x1 - 280 : x0 + 70; c.fillStyle = '#0c1030'; c.fillRect(wx, 190, 130, 170); const mm = ((lt / 19) * 0.8 + (flip ? 0.1 : 0)); glow(c, wx + 30 + mm * 80, 300 - Math.sin(mm * 3) * 90, 50, [220, 235, 255], 0.9); c.fillStyle = 'rgba(245,248,255,0.95)'; c.beginPath(); c.arc(wx + 30 + mm * 80, 300 - Math.sin(mm * 3) * 90, 12, 0, TAU); c.fill();
    c.strokeStyle = '#1b1220'; c.lineWidth = 8; c.strokeRect(wx, 190, 130, 170); c.beginPath(); c.moveTo(wx + 65, 190); c.lineTo(wx + 65, 360); c.stroke();
    const bx = flip ? x0 + 30 : x0 + 30, bw = 330; c.fillStyle = flip ? '#1d2438' : '#32221c'; c.fillRect(flip ? x1 - 30 - bw : bx, 500, bw, 60); c.fillStyle = flip ? '#2a3350' : '#4a342a'; c.fillRect(flip ? x1 - 30 - bw : bx, 490, bw, 14);
  };
  room(80, 560, [92, 64, 52], [54, 36, 36], false); room(720, 1200, [48, 66, 100], [28, 38, 62], true);
  const call1 = seg(lt, 6.3, 7.8), call2 = seg(lt, 8.4, 10.3), nights = seg(lt, 10.6, 13.2);
  const pulse = (x, y, a, col) => { for (let i = 0; i < 3; i++) { const p = ((t * 1.1 + i / 3) % 1); c.strokeStyle = rgba(col, a * (1 - p)); c.lineWidth = 2; c.beginPath(); c.arc(x, y, 20 + p * 110, 0, TAU); c.stroke(); } };
  const standing = lt > 15.7;
  const ob = {}, og = {};
  person(c, { x: 430, y: 560, s: 1.35, dir: 1, pose: standing ? 'stand' : 'sit', t, col: [8, 8, 16], rim: [255, 190, 130], kind: 'boy', wind: 0, out: ob });
  person(c, { x: 850, y: 560, s: 1.35, dir: -1, pose: standing ? 'stand' : 'sit', t, col: [6, 8, 16], rim: [150, 190, 255], kind: 'girl', wind: 0, out: og });
  const phone = (o2, a, col, shake) => { if (!o2.hx || a < 0.02) return; c.save(); c.translate(o2.hx + (shake ? Math.sin(t * 70) * 2 : 0), o2.hy - 4); c.fillStyle = rgba(col, 0.9 * a); c.fillRect(-5, -9, 10, 17); glow(c, 0, 0, 90, col, 0.55 * a, 'lighter'); c.restore(); };
  const bPh = call1 > 0 && call1 < 1 ? 1 : 0.18 + (lt > 11 && lt < 15 && Math.floor(lt * 4) % 2 ? 0.8 : 0), gPh = call2 > 0 && call2 < 1 ? 1 : 0.18 + (lt > 11.2 && lt < 15 && Math.floor(lt * 4 + 1) % 2 ? 0.8 : 0);
  phone(ob, bPh, call1 > 0.92 ? [255, 70, 70] : [150, 200, 255], false); phone(og, gPh, [150, 255, 200], call2 > 0 && call2 < 1);
  if (call1 > 0 && call1 < 1 && ob.hx) pulse(ob.hx, ob.hy, 0.6, [150, 200, 255]); if (call2 > 0 && call2 < 1 && og.hx) pulse(og.hx, og.hy, 0.6, [150, 255, 200]);
  // ışık ve duvar
  const lightA = 0.1 + burst * 0.9; glow(c, 640, 330, 380 + burst * 500, [255, 214, 140], lightA * (0.6 + 0.3 * BS));
  if (crumb < 1) {
    c.save(); c.globalAlpha = 1 - clamp(crumb * 4); c.fillStyle = '#12090a'; c.fillRect(560, 130, 160, 430); c.restore();
    c.save(); if (crumb <= 0) { c.beginPath(); c.rect(560, 130, 160, 430); c.clip(); }
    for (const b of BRICKS) {
      const fall = clamp((crumb - b.d * 0.25 - Math.abs(b.row - 12) * 0.02) * 2.4, 0, 3); const y = b.y + fall * fall * 260, x = b.x + b.vx * fall * 30;
      if (y > 700) continue; c.save(); c.translate(x + b.w / 2, y + b.h / 2); c.rotate(b.vr * fall * 0.6); c.fillStyle = `rgb(${b.col + 40},${b.col * 0.55},${b.col * 0.45})`; c.fillRect(-b.w / 2, -b.h / 2, b.w, b.h); c.restore();
    }
    c.restore();
    if (crumb <= 0 && lt > 12.4) {
      const pr = sm(seg(lt, 12.4, 15.2));
      for (const pts of CRACKS) { c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); const n = Math.min(pts.length - 1, Math.floor(pts.length * pr)); for (let i = 1; i <= n; i++) c.lineTo(pts[i][0], pts[i][1]); c.strokeStyle = 'rgba(0,0,0,0.9)'; c.lineWidth = 5; c.stroke(); c.strokeStyle = `rgba(255,220,150,${0.5 + 0.5 * burst})`; c.lineWidth = 2.2; c.stroke(); }
      if (pr > 0.3) for (const pts of CRACKS) { c.save(); c.globalCompositeOperation = 'lighter'; c.strokeStyle = `rgba(255,214,140,${0.25 * burst})`; c.lineWidth = 16; c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length * pr; i++) c.lineTo(pts[i | 0][0], pts[i | 0][1]); c.stroke(); c.restore(); }
    }
  }
  if (burst > 0) { c.save(); c.globalCompositeOperation = 'lighter'; for (let i = 0; i < 7; i++) { const a = -1.2 + i * 0.4 + Math.sin(t + i) * 0.05; const g = c.createLinearGradient(640, 330, 640 + Math.cos(a) * 600, 330 + Math.sin(a) * 600); g.addColorStop(0, `rgba(255,224,160,${0.2 * burst})`); g.addColorStop(1, 'rgba(255,224,160,0)'); c.fillStyle = g; c.beginPath(); c.moveTo(640, 330); c.lineTo(640 + Math.cos(a - 0.05) * 700, 330 + Math.sin(a - 0.05) * 700); c.lineTo(640 + Math.cos(a + 0.05) * 700, 330 + Math.sin(a + 0.05) * 700); c.fill(); } c.restore(); }
  for (let i = 0; i < 40; i++) { const r = rng(i + 500); c.fillStyle = `rgba(255,230,180,${0.4 * r() * (0.2 + burst)})`; c.fillRect((560 + r() * 160 + Math.sin(t + i) * 20), ((r() * 430 + t * 12 * (0.3 + r())) % 430) + 130, 2, 2); }
  const fl = seg(lt, 18.6, 19.5); if (fl > 0) tint(c, [255, 244, 220], fl);
  c.restore();
  c.fillStyle = `rgba(0,0,0,${1 - intro})`; c.fillRect(0, 0, W, H);
  vignette(c, 0.6);
}
// =============== BÖLÜM 6: Koşu (151 - 163) ===============
function sceneRun(c, t) {
  const lt = t - 151;
  c.save(); const sh = 3 * Math.sin(t * 40) * (0.5 + KK); cam(c, 640 + sh, 360 + sh * 0.5, 1.02 + KK * 0.01, 0);
  c.fillStyle = vgrad(c, 0, 520, [[0, [8, 10, 32]], [0.7, [52, 36, 90]], [1, [150, 70, 100]]]); c.fillRect(-100, -100, W + 200, 640);
  const lay = (v, seed, h1, h2, col, lp) => { const tot = cityArr(seed, 60, h1, h2).total; skyline(c, -((((t - 151) * v) % tot + tot) % tot), 548, W + tot, seed, h1, h2, col, { lights: { p: lp, col: [255, 200, 120], a: 0.9 }, t }); };
  lay(110, 31, 90, 210, [32, 26, 66], 0.3); lay(260, 32, 150, 300, [18, 15, 42], 0.4);
  c.fillStyle = vgrad(c, 548, H, [[0, [30, 22, 48]], [1, [8, 6, 20]]]); c.fillRect(-100, 548, W + 200, H);
  for (let i = 0; i < 8; i++) { const x = ((((i * 300 - lt * 900) % 2400) + 2400) % 2400) - 300; glow(c, x, 340, 120, [255, 190, 110], 0.6, 'lighter'); c.fillStyle = 'rgba(255,200,130,0.5)'; c.fillRect(x - 60, 338, 120, 3); c.fillStyle = '#0a0812'; c.fillRect(x - 2, 340, 4, 214); }
  const r = rng(11); c.fillStyle = 'rgba(255,255,255,0.14)'; for (let i = 0; i < 26; i++) { const y = 100 + r() * 540, x = (((r() * W - lt * 1500 * (0.5 + r())) % W) + W) % W; c.fillRect(x, y, 80 + r() * 160, 1.5); }
  for (let i = 0; i < 5; i++) { const x = ((((i * 330 + 700 - lt * 430 + 140) % 1900) + 1900) % 1900) - 300; person(c, { x, y: 610 + (i % 2) * 8, s: 1 + (i % 3) * 0.1, dir: -1, ph: t * 7 + i, t, col: [8, 6, 14], rim: [255, 170, 110], kind: i % 2 ? 'boy' : 'girl', wind: 0.4 }); }
  person(c, { x: 560, y: 650, s: 1.45, dir: 1, pose: 'run', ph: t * 14, t, col: [6, 5, 12], rim: [255, 190, 130], kind: 'boy', wind: 1 });
  c.restore();
  vignette(c, 0.5);
}
function sceneBoard(c, t) {
  const lt = t - 155.6, walk = ease2(seg(lt, 0, 3.0));
  c.save(); cam(c, lerp(560, 640, sm(lt / 4)), 400, 1 + lt * 0.02, 0);
  nightPort(c, t, { ferry: { x: 980, y: 530, s: 1.5, dir: -1 }, gang: { x0: 700, y0: 548, x1: 805, y1: 492 }, lamps: [{ x: 300, top: 280 }, { x: 560, top: 300 }], lampRefl: [300] });
  for (let i = 0; i < 6; i++) { const p = ((t * 0.3 + i * 0.17) % 1); c.fillStyle = `rgba(120,120,140,${0.35 * (1 - p)})`; c.beginPath(); c.arc(920 + p * 90 - 40 * Math.sin(p * 3), 330 - p * 160, 14 + p * 40, 0, TAU); c.fill(); }
  const px = lerp(110, 690, walk), onRamp = clamp((px - 700) / 100), gy = 612 - onRamp * 56;
  person(c, { x: px, y: gy, s: 1.5, dir: 1, ph: lt * 6, t, pose: lt < 3.2 ? 'walk' : 'stand', col: [5, 5, 12], rim: [255, 190, 120], kind: 'girl', wind: 0.7, suitcase: 1 });
  c.restore();
  vignette(c, 0.55);
}
const ease2 = x => clamp(x);
function sceneCrowd(c, t) {
  const lt = t - 159.6, tt = wt(t), z = 1 + eo(seg(lt, 0, 3.4)) * 1.35;
  c.save(); cam(c, lerp(640, 760, eo(seg(lt, 0, 3.4))), lerp(400, 470, eo(seg(lt, 0, 3.4))), z, 0);
  nightPort(c, t, { tt, ferry: { x: 980, y: 530, s: 1.5, dir: -1 }, gang: { x0: 700, y0: 548, x1: 805, y1: 492 }, lamps: [{ x: 300, top: 280 }, { x: 560, top: 300 }] });
  person(c, { x: 760, y: 552, s: 1.5, dir: 1, pose: 'stand', t: tt, col: [5, 5, 12], rim: [255, 200, 140], kind: 'girl', wind: 0.9, suitcase: 1 });
  glow(c, 760, 450, 160, [255, 200, 140], 0.4, 'lighter');
  const r = rng(808); for (let i = 0; i < 14; i++) { const x = r() * 900 + 100 - lt * 6 * (r() - 0.3) * (t < 162.2 ? 1 : 0), s = 1.3 + r() * 0.9; person(c, { x, y: 720 + r() * 140, s, dir: r() > 0.5 ? 1 : -1, pose: 'stand', t: tt, col: [3, 3, 8], rim: [255, 190, 130], kind: r() > 0.5 ? 'boy' : 'girl', wind: 0.5 }); }
  c.restore();
  desat(c, 0.9 * sm(seg(t, 161.8, 163.2)));
  const fr = seg(t, 162.2, 163.6); if (fr > 0) { const rr = fr * 700; c.strokeStyle = `rgba(255,255,255,${0.35 * (1 - fr)})`; c.lineWidth = 3; c.beginPath(); c.arc(W * 0.6, H * 0.6, rr, 0, TAU); c.stroke(); }
  vignette(c, 0.6);
}
// =============== BÖLÜM 7: Kal (163 - 178) ===============
function sceneKal(c, t) {
  const lt = t - 163, tt = wt(t);
  const dawnK = sm(seg(lt, 11, 15)), pal = palMix(PAL.night, PAL.dawn, dawnK * 0.55);
  c.save(); cam(c, 640 - lt * 3, 420, 1.15 + lt * 0.004, 0);
  nightPort(c, t, { tt: lt < 5 ? tt : t, pal, ferry: { x: 980, y: 530, s: 1.5, dir: -1 }, gang: { x0: 700, y0: 548, x1: 805, y1: 492 }, lamps: [{ x: 300, top: 280 }, { x: 560, top: 300 }] });
  const walkS = seg(lt, 4.2, 12), bx = lerp(-80, 560, eo(walkS)), gTurn = seg(lt, 7, 9);
  const gx = lt < 9 ? 725 : lerp(725, 600, sm(seg(lt, 9, 12.5))), gdir = lt > 7.2 ? -1 : 1, together = lt > 12.6;
  const grow = clamp(seg(lt, 5, 12));
  if (!together) {
    person(c, { x: gx, y: lt < 9 ? 556 : lerp(556, 600, sm(seg(lt, 9, 12.5))), s: 1.5, dir: gdir, pose: lt < 9 ? 'stand' : 'walk', ph: lt * 4, t: lt < 5 ? tt : t, col: [5, 5, 12], rim: [255, 200, 140], kind: 'girl', wind: lt < 5 ? 0.9 : 0.5, suitcase: lt < 11 ? 1 : 0 });
    if (lt > 4.2) person(c, { x: bx, y: 600, s: 1.5, dir: 1, pose: walkS < 1 ? 'walk' : 'stand', ph: lt * 3.2, t, col: [5, 5, 12], rim: [255, 200, 140], kind: 'boy', wind: 0.4 });
    if (lt > 4.2) glow(c, bx, 480, 160 + grow * 380, [255, 190, 120], 0.35 * grow, 'lighter');
  } else {
    const ex = 600, bl = sm(seg(lt, 12.6, 14));
    person(c, { x: ex - 16, y: 600, s: 1.5, dir: 1, pose: 'stand', t, col: [5, 5, 12], rim: [255, 214, 160], kind: 'boy', wind: 0.3 });
    person(c, { x: ex + 18, y: 600, s: 1.5, dir: -1, pose: 'stand', t, col: [5, 5, 12], rim: [255, 214, 160], kind: 'girl', wind: 0.3 });
    c.fillStyle = 'rgb(5,5,12)'; c.lineWidth = 9; c.strokeStyle = 'rgb(5,5,12)'; c.lineCap = 'round';
    c.beginPath(); c.moveTo(ex - 14, 600 - 118); c.quadraticCurveTo(ex + 6, 600 - 90, ex + 26, 600 - 112); c.moveTo(ex + 14, 600 - 118); c.quadraticCurveTo(ex - 6, 600 - 90, ex - 22, 600 - 110); c.stroke();
    glow(c, ex, 500, 420, [255, 214, 150], 0.5 * bl, 'lighter');
  }
  // yüzen kıvılcımlar (zaman durmuş)
  const rp = rng(600); for (let i = 0; i < 70; i++) { const px = rp() * W * 1.4 - 100, py0 = rp() * 700, sp = 4 + rp() * 8; const py = ((py0 - tt * sp * 3 - (lt > 11 ? (lt - 11) * 20 * rp() : 0)) % 760 + 760) % 760 - 30; c.fillStyle = `rgba(255,224,170,${0.15 + 0.5 * rp()})`; c.fillRect(px, py, 2.4, 2.4); }
  c.restore();
  desat(c, 0.88 * (1 - sm(seg(lt, 5.5, 10))));
  const kx = 640, ka = sm(seg(lt, 6.8, 8)) * (1 - sm(seg(lt, 11.5, 13.2)));
  if (ka > 0.01) {
    c.save(); c.beginPath(); c.rect(kx - 260, 80, 520 * eo(seg(lt, 6.8, 9.6)), 220); c.clip();
    txt(c, 'Kal.', kx, 235, 150, { font: FONT, style: 'italic', col: 'rgba(255,240,205,0.97)', align: 'center', sp: 6, shadow: 'rgba(255,190,100,0.95)', sb: 40, a: ka });
    c.restore();
    glow(c, kx, 190, 360, [255, 200, 120], 0.28 * ka, 'lighter');
  }
  vignette(c, 0.55);
}
// =============== Önceki bölümlerde: kolaj (178 - 186) ===============
function sceneRecap(c, t) {
  const lt = t - 178;
  c.fillStyle = vgrad(c, 0, H, [[0, [28, 18, 24]], [1, [12, 8, 12]]]); c.fillRect(0, 0, W, H);
  c.fillStyle = 'rgba(255,230,200,0.06)'; for (let x = 0; x < W; x += 56) { c.fillRect(x + 10, 20, 24, 14); c.fillRect(x + 10, H - 34, 24, 14); }
  const cards = [[scenePier, 11, 150, 400, -0.1, 6], [sceneTicket, 34, 1130, 300, 0.09, 5], [sceneWindow, 80.5, 340, 330, 0.06, 5], [sceneCafe, 96, 980, 400, -0.08, 5], [sceneClock, 107, 640, 280, 0.04, 5], [sceneShores, 62, 520, 440, -0.05, 4], [sceneBridge, 139, 800, 330, 0.1, 6], [sceneRun, 153, 240, 270, -0.07, 3]];
  const FADE = seg(lt, 7.0, 8.0);
  cards.forEach(([fn, st, cx, cy, rot, dur], i) => {
    const li = 0.3 + i * 0.85, a = eo(seg(lt, li, li + 0.6)); if (a <= 0) return;
    const cw = 320, ch = 370, iw = 288, ih = 288, sc = iw / 640; // 640x? yarım sahne
    c.save(); c.globalAlpha = a * (1 - FADE);
    c.translate(cx, cy + (1 - a) * -60 + FADE * 120); c.rotate(rot + (1 - a) * 0.4); const zz = lerp(1.35, 1, a); c.scale(zz, zz);
    c.shadowColor = 'rgba(0,0,0,0.6)'; c.shadowBlur = 24; c.shadowOffsetY = 10; c.fillStyle = '#efe8da'; c.fillRect(-cw / 2, -ch / 2, cw, ch); c.shadowColor = 'transparent'; c.shadowBlur = 0; c.shadowOffsetY = 0;
    c.beginPath(); c.rect(-iw / 2, -ch / 2 + 16, iw, ih); c.clip();
    c.translate(0, -ch / 2 + 16 + ih / 2); c.scale(sc * 1.0, sc * 1.0); c.translate(-W / 2 + 0, -H / 2 + 0); c.scale(1, 1);
    c.save(); c.translate(W / 2, H / 2); c.scale(1.0, 1.0); c.translate(-W / 2, -H / 2);
    fn(c, st + Math.max(0, lt - li) * 0.6 * 0 + clamp((lt - li) * 0.6, 0, dur), 'x');
    c.restore(); c.restore();
  });
  txt(c, 'Önceki bölümlerde…', 70, 90, 28, { font: FONT, style: 'italic', col: 'rgba(255,240,215,0.9)', a: sm(seg(lt, 0, 0.6)) * (1 - FADE) });
  vignette(c, 0.55);
}
