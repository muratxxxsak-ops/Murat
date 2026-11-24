'use strict';
const PER = 60 / 104, B0 = 0.1;
const bph = t => (t - B0) / PER;
const pulse = t => { let f = bph(t) % 1; if (f < 0) f += 1; return Math.pow(1 - f, 3); };
const NEON = [[255, 60, 170], [60, 220, 255], [150, 100, 255], [255, 184, 70], [90, 255, 170]];

function lasers(c, ox, oy, t, n, a, len = 1500, spread = 1.1) {
  c.save(); c.globalCompositeOperation = 'lighter'; c.lineCap = 'round';
  for (let i = 0; i < n; i++) {
    const ang = -Math.PI / 2 + Math.sin(t * 0.9 + i * 0.8) * spread * (0.55 + 0.45 * Math.sin(t * 0.31 + i)) + (i - n / 2) * 0.1, col = NEON[i % 5];
    const ex = ox + Math.cos(ang) * len, ey = oy + Math.sin(ang) * len;
    c.strokeStyle = rgba(col, a * 0.15); c.lineWidth = 16; c.beginPath(); c.moveTo(ox, oy); c.lineTo(ex, ey); c.stroke();
    c.strokeStyle = rgba(col, a * 0.85); c.lineWidth = 2.2; c.stroke();
  }
  c.restore();
}
function eq(c, x, y, w, h, n, t, col) {
  const bw = w / n;
  for (let i = 0; i < n; i++) {
    const m = i / n, lvl = clamp((BS * (1 - m) + HI * m * 1.2 + EN * 0.3) * (0.55 + 0.45 * Math.sin(t * 7 + i * 1.7)));
    const bh = h * (0.08 + 0.92 * lvl); c.fillStyle = rgba(NEON[i % 5], 0.9); c.fillRect(x + i * bw + 1, y - bh, bw - 3, bh);
  }
}
function neonTxt(c, s, x, y, size, col, a = 1, flick = 1) {
  c.save(); c.globalAlpha *= a * flick; c.font = `800 ${size}px ${SANS}`; c.letterSpacing = size * 0.12 + 'px'; c.textAlign = 'center';
  c.shadowColor = rgba(col, 1); c.shadowBlur = size * 0.7; c.fillStyle = rgba(mix(col, [255, 255, 255], 0.75)); c.fillText(s, x, y);
  c.shadowBlur = size * 0.3; c.fillText(s, x, y); c.restore();
}
function fireworks(c, t, t0, t1, every, area) {
  const k0 = Math.floor(bph(t)) - 5; c.save(); c.globalCompositeOperation = 'lighter';
  for (let k = k0; k <= k0 + 5; k++) {
    if (k % every) continue; const tb = B0 + k * PER, age = t - tb; if (age < 0 || age > 2.4 || tb < t0 || tb > t1) continue;
    const r = rng(k * 7 + 3), ox = area[0] + r() * (area[2] - area[0]), oy = area[1] + r() * (area[3] - area[1]), col = NEON[k % 5], n = 38, sp = 110 + r() * 110;
    glow(c, ox, oy, 120 * Math.exp(-age * 5), [255, 255, 255], 0.5 * Math.exp(-age * 5));
    for (let i = 0; i < n; i++) {
      const a = i / n * TAU + r() * 0.2, v = sp * (0.6 + r() * 0.5), d = v * (1 - Math.exp(-age * 1.6)) / 1.6 * 1.6, px = ox + Math.cos(a) * d, py = oy + Math.sin(a) * d + 38 * age * age;
      const al = clamp(1 - age / 2.3); c.fillStyle = rgba(mix(col, [255, 255, 255], 0.35), al); c.beginPath(); c.arc(px, py, 2.2 * (1 - age / 3), 0, TAU); c.fill();
      c.fillStyle = rgba(col, al * 0.25); c.beginPath(); c.arc(px, py, 6, 0, TAU); c.fill();
    }
  }
  c.restore();
}
function confetti(c, t, t0, n, a = 1) {
  const age = t - t0; if (age < 0) return; const r = rng(77);
  for (let i = 0; i < n; i++) {
    const x0 = r() * W, sp = 60 + r() * 120, ph = r() * TAU, y = -20 + ((age * sp + r() * 800) % 860), x = x0 + Math.sin(age * 2 + ph) * 30;
    c.save(); c.translate(x, y); c.rotate(age * (2 + r() * 3) + ph); c.fillStyle = rgba(NEON[i % 5], 0.9 * a); c.fillRect(-4, -2, 8, 4 * Math.abs(Math.cos(age * 4 + ph)) + 1); c.restore();
  }
}
function crowd(c, t, rows, amp) {
  const ph = bph(t) * Math.PI;
  for (const R of rows) {
    const r = rng(R.seed);
    for (let i = 0; i < R.n; i++) {
      const x = R.x0 + (i + r() * 0.7) * (R.x1 - R.x0) / R.n, bob = Math.abs(Math.sin(ph + r() * 0.8)) * amp * R.s;
      person(c, { x, y: R.y - bob, s: R.s * (0.92 + r() * 0.18), dir: r() > 0.5 ? 1 : -1, pose: 'cheer', ph: ph * 2 + r() * 3, t: t + r(), col: R.col || [6, 4, 14], rim: R.rim || [255, 90, 190], kind: r() > 0.5 ? 'boy' : 'girl', wind: 0.1 });
    }
  }
}
function nightBG(c, t, hy, o = {}) {
  const dn = o.dn === undefined ? 1 : o.dn;
  c.fillStyle = vgrad(c, 0, hy, [[0, mix([34, 24, 80], [6, 6, 26], dn)], [0.7, mix([210, 110, 110], [30, 22, 78], dn)], [1, mix([250, 160, 100], [74, 44, 120], dn)]]); c.fillRect(-300, -300, W + 600, hy + 300);
  stars(c, t, 0.8 * dn, hy); if (o.moon) moon(c, o.moon[0], o.moon[1], o.moon[2], dn);
  glow(c, 640, hy, 700, [140, 80, 220], 0.22 * dn);
  skyline(c, -100, hy + 2, 800, 61, 14, 90, [12, 9, 30], { lights: { p: 0.75 * dn, col: [255, 200, 120], a: 0.9 }, t });
  skyline(c, 700, hy + 2, 800, 62, 10, 80, [12, 9, 30], { lights: { p: 0.75 * dn, col: [255, 200, 120], a: 0.9 }, t });
  galata(c, 330, hy + 2, 0.7, [10, 8, 26]); mosque(c, 880, hy + 2, 0.8, [10, 8, 26]); mosque(c, 160, hy + 2, 0.55, [10, 8, 26]);
  sea(c, hy, [44, 30, 90], [8, 6, 24], t, { wc: [200, 180, 255], wa: 1.1 });
  for (let i = 0; i < 6; i++) { const px = 140 + i * 200 + Math.sin(i) * 40, col = NEON[i % 5]; for (let j = 0; j < 12; j++) { const p = j / 12; c.fillStyle = rgba(col, 0.25 * (1 - p) * (0.5 + 0.5 * Math.sin(t * 2 + j + i))); c.fillRect(px - 6 - p * 8, hy + 8 + p * 120, 12 + p * 16, 2 + p * 3); } }
  if (o.ferry) ferry(c, 300 + ((t * 18) % 1100), hy + 22, 0.32, 1, { lit: 1, dim: 0.3, t, wake: true });
}
// ===== 1: Yeni Sürüm (0 - 20) =====
function sceneStudio(c, t) {
  c.save(); cam(c, 640, 380, 1 + 0.05 * sm(t / 20), 0);
  c.fillStyle = vgrad(c, 0, H, [[0, [18, 12, 40]], [1, [8, 6, 20]]]); c.fillRect(-300, -300, W + 600, H + 600);
  const wx = 720, wy = 90, ww = 500, wh = 380, dn = sm(t / 15);
  c.fillStyle = vgrad(c, wy, wy + wh, [[0, mix([50, 36, 100], [8, 8, 32], dn)], [1, mix([240, 130, 100], [50, 34, 100], dn)]]); c.fillRect(wx, wy, ww, wh);
  c.save(); c.beginPath(); c.rect(wx, wy, ww, wh); c.clip();
  glow(c, wx + 250, wy + wh, 360, [255, 150, 110], 0.5 * (1 - dn));
  skyline(c, wx - 60, wy + wh - 8, ww + 120, 5, 24, 150, [10, 8, 28], { lights: { p: 0.85 * dn, col: [255, 205, 130], a: 0.95 * dn }, t });
  galata(c, wx + 360, wy + wh - 6, 0.8, [8, 6, 24]);
  const gap = lerp(0, 17, sm(seg(t, 2, 13)));
  for (let y = wy; y < wy + wh; y += 22) { c.fillStyle = '#17122c'; c.fillRect(wx, y, ww, 22 - gap); c.fillStyle = 'rgba(255,255,255,0.07)'; c.fillRect(wx, y, ww, 1.5); }
  c.restore(); c.strokeStyle = '#05040c'; c.lineWidth = 16; c.strokeRect(wx, wy, ww, wh);
  const nf = 0.75 + 0.25 * pulse(t); c.fillStyle = rgba([255, 60, 170], 0.95 * nf); c.fillRect(0, 56, W, 4); glow(c, 640, 58, 520, [255, 60, 170], 0.22 * nf, 'lighter');
  for (const sx of [90, 560]) {
    c.fillStyle = '#0c0a18'; c.fillRect(sx, 330, 110, 218); const cr = 38 * (1 + 0.07 * BS); c.fillStyle = '#04030a'; c.beginPath(); c.arc(sx + 55, 450, cr, 0, TAU); c.fill();
    c.strokeStyle = rgba([60, 220, 255], 0.5 + 0.4 * BS); c.lineWidth = 2; c.beginPath(); c.arc(sx + 55, 450, cr + 4, 0, TAU); c.stroke(); c.fillStyle = '#04030a'; c.beginPath(); c.arc(sx + 55, 372, 14 * (1 + 0.05 * HI), 0, TAU); c.fill();
  }
  c.fillStyle = '#120e22'; c.fillRect(230, 548, 400, 14); c.fillRect(250, 562, 8, 160); c.fillRect(600, 562, 8, 160);
  c.fillStyle = '#05040c'; c.fillRect(440, 540, 112, 8); c.fillRect(444, 466, 104, 76); c.fillStyle = '#0b1230'; c.fillRect(448, 470, 96, 68);
  c.strokeStyle = rgba([90, 255, 170], 0.95); c.lineWidth = 2; c.beginPath();
  for (let x = 0; x <= 96; x += 2) { const a = (0.15 + EN * 0.9) * (0.5 + 0.5 * Math.sin(x * 0.25 + t * 6)) * Math.sin(x * 0.07 + t); const yy = 504 + a * 28; x ? c.lineTo(448 + x, yy) : c.moveTo(448 + x, yy); } c.stroke();
  glow(c, 496, 504, 160, [90, 200, 255], 0.28, 'lighter');
  const sit = t < 15.5;
  if (sit) person(c, { x: 330, y: 662, s: 1.45, dir: 1, pose: 'sit', t, col: [8, 6, 16], rim: [255, 90, 190], kind: 'girl', wind: 0 });
  else person(c, { x: 330 + (t - 15.5) * 180, y: 662, s: 1.45, dir: 1, pose: 'walk', ph: t * 7, t, col: [8, 6, 16], rim: [255, 90, 190], kind: 'girl', wind: 0.2 });
  c.restore();
  bokeh(c, t, 4, 8, [[255, 60, 170], [60, 220, 255]], 20, 50, 100, 500, 0.12 * dn, 4);
  vignette(c, 0.55);
}
// ===== 2: Sahne Hazır (20 - 44) =====
function sceneStreet(c, t) {
  const lt = t - 20; let sc = 0; for (let u = 20; u < t; u += 0.05) sc += (1 - 0.88 * sm(seg(u, 38.6, 40.2))) * 0.05;
  const sh = 3 * Math.sin(t * 38) * (0.3 + KK) * (t < 39 ? 1 : 0.2);
  c.save(); cam(c, 640 + sh, 360 + sh * 0.6, 1.03 + 0.015 * pulse(t), 0);
  c.fillStyle = vgrad(c, 0, 540, [[0, [8, 6, 28]], [0.7, [44, 26, 90]], [1, [150, 60, 130]]]); c.fillRect(-100, -100, W + 200, 640);
  const lay = (v, seed, h1, h2, col, lp) => { const tot = cityArr(seed, 60, h1, h2).total; skyline(c, -(((sc * v) % tot) + tot) % tot, 548, W + tot, seed, h1, h2, col, { lights: { p: lp, col: [255, 200, 130], a: 0.9 }, t }); };
  lay(70, 31, 90, 220, [30, 22, 66], 0.3); lay(170, 32, 150, 330, [16, 12, 42], 0.45);
  c.fillStyle = vgrad(c, 548, H, [[0, [30, 18, 52]], [1, [8, 6, 20]]]); c.fillRect(-100, 548, W + 200, H);
  const near = sc * 420, labels = ['BAR', 'CLUB', 'GECE', 'AÇIK', 'DJ', 'MÜZİK'];
  for (let i = 0; i < 6; i++) {
    const x = ((((i * 430 - near) % 2580) + 2580) % 2580) - 300, col = NEON[i % 5], fl = Math.sin(t * 11 + i * 3) > 0.93 ? 0.4 : 1;
    c.fillStyle = '#0a0814'; c.fillRect(x - 3, 300 + (i % 2) * 40, 6, 260); neonTxt(c, labels[i], x, 330 + (i % 2) * 40, 54, col, 1, fl); glow(c, x, 320 + (i % 2) * 40, 190, col, 0.28 * fl, 'lighter');
    c.save(); c.translate(x, 640); c.scale(1, 0.14); glow(c, 0, 0, 240, col, 0.45, 'lighter'); c.restore();
  }
  for (let i = 0; i < 4; i++) { const x = ((((i * 400 + 900 - lt * 90 - sc * 260) % 1800) + 1800) % 1800) - 250; if (Math.abs(x - 520) < 140) continue; person(c, { x, y: 600 + (i % 2) * 10, s: 0.9 + (i % 3) * 0.1, dir: -1, ph: t * 6 + i, t, col: [8, 6, 16], rim: NEON[i % 5], kind: i % 2 ? 'boy' : 'girl', wind: 0.1 }); }
  const run = t < 39, ph = t * 12.5;
  const crew = [[26, 380, 'boy'], [31, 250, 'girl'], [36, 126, 'boy']];
  for (const [ts, x, kd] of crew) if (t > ts) { const a = eo(seg(t, ts, ts + 1.2)); person(c, { x: lerp(-80, x, a), y: 646, s: 1.25, dir: 1, pose: run ? 'run' : 'walk', ph: ph + x, t, col: [6, 5, 14], rim: NEON[Math.round(x) % 5], kind: kd, wind: 0.6 }); }
  person(c, { x: 520, y: 650, s: 1.35, dir: 1, pose: run ? 'run' : 'walk', ph: ph, t, col: [6, 5, 14], rim: [255, 90, 190], kind: 'girl', wind: 0.8 });
  c.save(); c.fillStyle = 'rgba(255,255,255,0.12)'; const r = rng(3); for (let i = 0; i < 18; i++) c.fillRect((((r() * W - lt * 900 * (0.4 + r())) % W) + W) % W, 100 + r() * 560, 80 + r() * 150, 1.5); c.restore();
  const dx = 1020 + (1 - sm(seg(t, 39, 41))) * 1300;
  if (t > 38.5) { c.fillStyle = '#0a0814'; c.fillRect(dx - 80, 300, 160, 340); const op = sm(seg(t, 41.5, 43.5)); c.fillStyle = rgba(mix([60, 40, 90], [255, 240, 210], op)); c.fillRect(dx - 56, 330, 112, 310); glow(c, dx, 480, 360 + op * 600, [255, 190, 255], 0.45 + op * 0.5, 'lighter'); }
  c.restore();
  const fl = seg(t, 43.2, 44.0); if (fl > 0) tint(c, [255, 245, 235], fl);
  vignette(c, 0.5);
}
// ===== sahne: çatı + DJ =====
function stageView(c, t, o) {
  c.save(); cam(c, 640 + (o.px || 0), 380, (o.z || 1) * (1 + 0.012 * pulse(t)), o.rot || 0);
  nightBG(c, t, 400, { moon: [1040, 130, 36], ferry: true });
  const I = o.I;
  c.fillStyle = '#07050f'; c.fillRect(-300, 560, W + 600, 400); c.fillStyle = 'rgba(255,255,255,0.05)'; c.fillRect(-300, 560, W + 600, 3);
  c.fillStyle = '#0b0818'; c.fillRect(220, 190, 840, 14); for (const x of [230, 1050]) c.fillRect(x - 6, 190, 12, 380);
  for (let i = 0; i < 6; i++) { const x = 290 + i * 140; c.fillStyle = '#0b0818'; c.fillRect(x - 12, 204, 24, 22); glow(c, x, 226, 80, NEON[i % 5], 0.7 * I, 'lighter'); }
  lasers(c, 640, 215, t, o.beams, I, 1500, 1.3);
  for (const sx of [120, 1060]) { c.fillStyle = '#0d0a1a'; c.fillRect(sx, 360, 100, 200); for (const [cy, r] of [[420, 30], [500, 24]]) { const rr = r * (1 + 0.1 * BS); c.fillStyle = '#04030a'; c.beginPath(); c.arc(sx + 50, cy, rr, 0, TAU); c.fill(); c.strokeStyle = rgba(NEON[1], 0.5 + 0.4 * BS); c.lineWidth = 2; c.beginPath(); c.arc(sx + 50, cy, rr + 3, 0, TAU); c.stroke(); } }
  c.fillStyle = '#0c0919'; c.fillRect(430, 482, 420, 80); c.fillStyle = '#16112a'; c.fillRect(430, 478, 420, 8);
  eq(c, 446, 548, 388, 52, 24, t, [255, 60, 170]);
  for (const dx of [480, 800]) { c.fillStyle = '#04030a'; c.beginPath(); c.ellipse(dx, 470, 52, 9, 0, 0, TAU); c.fill(); c.strokeStyle = rgba(NEON[1], 0.8); c.lineWidth = 1.5; c.beginPath(); c.ellipse(dx, 470, 52, 9, 0, 0, TAU); c.stroke(); }
  person(c, { x: 640, y: 560, s: 1.2, dir: 1, pose: 'dj', ph: bph(t) * Math.PI, t, col: [8, 5, 18], rim: [255, 90, 190], kind: 'girl', wind: 0.4 });
  glow(c, 640, 420, 300, [255, 60, 170], 0.18 * I * (1 + pulse(t)), 'lighter');
  crowd(c, t, [{ y: 640, s: 1.05, n: 11, x0: 40, x1: 1240, seed: 5, alpha: 1 }, { y: 760, s: 1.5, n: 8, x0: -20, x1: 1300, seed: 9 }], o.amp);
  if (o.fw) fireworks(c, t, o.fw[0], o.fw[1], 2, [140, 70, 1140, 280]);
  c.restore();
  if (I > 0.8) tint(c, [255, 255, 255], 0.1 * pulse(t), 'lighter');
  vignette(c, 0.45);
}
const sceneHook1 = (c, t) => stageView(c, t, { I: 0.65, beams: 5, amp: 14, px: Math.sin(t * 0.4) * 30 });
// ===== 4: Pikap yakın plan (60.5 - 70.5) =====
function sceneDecks(c, t) {
  const lt = t - 60.5;
  c.save(); cam(c, 640, 360, 1.05 + 0.02 * pulse(t) + lt * 0.003, Math.sin(t * 0.5) * 0.02);
  c.fillStyle = vgrad(c, 0, H, [[0, [14, 8, 36]], [1, [4, 3, 12]]]); c.fillRect(-300, -300, W + 600, H + 600);
  bokeh(c, t, 11, 22, [[255, 60, 170], [60, 220, 255], [150, 100, 255]], 20, 80, 0, 720, 0.5, 6);
  const rec = (x, y, dir) => {
    c.save(); c.translate(x, y); c.fillStyle = '#0a0814'; rrect(c, -190, -190, 380, 380, 22); c.fill(); c.strokeStyle = 'rgba(255,255,255,0.08)'; c.lineWidth = 2; rrect(c, -190, -190, 380, 380, 22); c.stroke();
    c.rotate(t * 3.5 * dir); c.fillStyle = '#05040a'; c.beginPath(); c.arc(0, 0, 168, 0, TAU); c.fill();
    c.strokeStyle = 'rgba(255,255,255,0.07)'; c.lineWidth = 1; for (let r2 = 60; r2 < 166; r2 += 7) { c.beginPath(); c.arc(0, 0, r2, 0, TAU); c.stroke(); }
    const g = c.createConicGradient(0, 0, 0); g.addColorStop(0, 'rgba(255,255,255,0.0)'); g.addColorStop(0.1, 'rgba(255,255,255,0.18)'); g.addColorStop(0.2, 'rgba(255,255,255,0)'); g.addColorStop(0.6, 'rgba(255,255,255,0)'); g.addColorStop(0.7, 'rgba(255,255,255,0.14)'); g.addColorStop(0.8, 'rgba(255,255,255,0)');
    c.fillStyle = g; c.beginPath(); c.arc(0, 0, 168, 0, TAU); c.fill();
    c.fillStyle = rgba(NEON[dir > 0 ? 0 : 1], 0.95); c.beginPath(); c.arc(0, 0, 54, 0, TAU); c.fill(); c.fillStyle = '#05040a'; c.beginPath(); c.arc(0, 0, 7, 0, TAU); c.fill(); c.restore();
    glow(c, x, y, 260, NEON[dir > 0 ? 0 : 1], 0.2 + 0.2 * BS, 'lighter');
  };
  rec(310, 380, 1); rec(970, 380, -1);
  c.fillStyle = '#0c0919'; rrect(c, 520, 200, 240, 360, 16); c.fill(); c.strokeStyle = 'rgba(255,255,255,0.1)'; c.lineWidth = 2; rrect(c, 520, 200, 240, 360, 16); c.stroke();
  for (let i = 0; i < 4; i++) { const fx = 556 + i * 52, fy = 330 + Math.sin(t * 1.6 + i * 1.7) * 60; c.fillStyle = '#05040a'; c.fillRect(fx, 270, 6, 250); c.fillStyle = rgba(NEON[i], 1); c.fillRect(fx - 12, fy, 30, 16); }
  for (let i = 0; i < 3; i++) { c.fillStyle = '#05040a'; c.beginPath(); c.arc(580 + i * 60, 240, 16, 0, TAU); c.fill(); c.strokeStyle = rgba(NEON[(i + 2) % 5], 0.95); c.lineWidth = 3; c.beginPath(); c.moveTo(580 + i * 60, 240); const a = -2 + Math.sin(t * 1.2 + i) * 1.2; c.lineTo(580 + i * 60 + Math.cos(a) * 14, 240 + Math.sin(a) * 14); c.stroke(); }
  eq(c, 536, 548, 208, 50, 12, t, [255, 60, 170]);
  c.fillStyle = 'rgba(8,6,20,0.8)'; c.fillRect(120, 100, 1040, 60); c.strokeStyle = rgba(NEON[1], 0.9); c.lineWidth = 2; c.beginPath();
  for (let x = 0; x <= 1040; x += 3) { const a = (0.12 + EN * 0.9) * Math.sin(x * 0.19 + t * 9) * Math.sin(x * 0.021 + t * 2); const yy = 130 + a * 28; x ? c.lineTo(120 + x, yy) : c.moveTo(120 + x, yy); } c.stroke();
  txt(c, 'BPM 104', 140, 190, 22, { font: SANS, weight: 800, col: rgba(NEON[3]), sp: 4 });
  c.restore(); vignette(c, 0.5);
}
// ===== 5: Kalabalık (70.5 - 81.5) =====
function sceneCrowd(c, t) {
  const lt = t - 70.5; c.save(); cam(c, 640, 400 - lt * 3, 1 + 0.02 * pulse(t), Math.sin(t * 0.7) * 0.012);
  c.fillStyle = vgrad(c, 0, H, [[0, [10, 6, 30]], [1, [40, 20, 80]]]); c.fillRect(-300, -300, W + 600, H + 600);
  glow(c, 640, 330, 700, NEON[(Math.floor(t / 1.1)) % 5], 0.3 + 0.2 * pulse(t), 'lighter');
  skyline(c, -100, 470, 1500, 61, 20, 110, [14, 10, 34], { lights: { p: 0.7, col: [255, 205, 130], a: 0.9 }, t });
  lasers(c, 640, 760, t, 9, 0.8, 1600, 1.4);
  const r = rng(12); for (let i = 0; i < 26; i++) { const x = r() * W, y = 440 + r() * 260, fl = 0.5 + 0.5 * Math.sin(t * 3 + i * 2); glow(c, x, y, 18, [255, 214, 130], 0.8 * fl, 'lighter'); }
  crowd(c, t, [{ y: 560, s: 0.85, n: 16, x0: 0, x1: 1280, seed: 21, rim: [60, 220, 255] }, { y: 650, s: 1.15, n: 12, x0: -20, x1: 1300, seed: 22 }, { y: 780, s: 1.7, n: 8, x0: -40, x1: 1320, seed: 23, rim: [255, 184, 70] }], 18);
  c.restore();
  const st = Math.sin(t * 40 * Math.PI) > 0.2 && pulse(t) > 0.7 ? 0.22 : 0; if (st) tint(c, [255, 255, 255], st);
  vignette(c, 0.5);
}
// ===== 6: Hazır mısın? (81.5 - 89.7) =====
function sceneReady(c, t) {
  const lt = t - 81.5, z = 1 + eo(seg(lt, 0, 8)) * 0.18;
  c.save(); cam(c, 640, 380, z, 0);
  c.fillStyle = '#030208'; c.fillRect(-300, -300, W + 600, H + 600);
  const cone = c.createLinearGradient(0, 0, 0, 620); cone.addColorStop(0, 'rgba(200,170,255,0.32)'); cone.addColorStop(1, 'rgba(200,170,255,0.02)');
  c.save(); c.globalCompositeOperation = 'lighter'; c.fillStyle = cone; c.beginPath(); c.moveTo(610, 0); c.lineTo(670, 0); c.lineTo(860, 620); c.lineTo(420, 620); c.fill(); c.restore();
  const rr = rng(8); for (let i = 0; i < 60; i++) { const x = 480 + rr() * 320, y = ((rr() * 640 + t * 14 * (0.3 + rr())) % 640); c.fillStyle = `rgba(220,200,255,${0.4 * rr()})`; c.fillRect(x, y, 2, 2); }
  c.fillStyle = '#0c0919'; c.fillRect(430, 482, 420, 80); eq(c, 446, 548, 388, 30, 24, t * 0.2, [255, 60, 170]);
  person(c, { x: 640, y: 560, s: 1.2, dir: 1, pose: 'stand', t, col: [8, 5, 18], rim: [200, 170, 255], kind: 'girl', wind: 0.1 });
  for (let i = 0; i < 4; i++) { const p = (((lt * 0.5 + i / 4) % 1) + 1) % 1; c.strokeStyle = rgba([255, 60, 170], 0.5 * (1 - p)); c.lineWidth = 2; c.beginPath(); c.arc(640, 470, 20 + p * 260, 0, TAU); c.stroke(); }
  const bp = sm(seg(lt, 5.5, 7.6)), press = lt > 8.0 ? 1 : 0;
  glow(c, 640, 470, 120, [255, 40, 90], (0.3 + 0.4 * Math.abs(Math.sin(lt * 5))) * bp, 'lighter');
  c.fillStyle = rgba(mix([60, 10, 30], [255, 60, 100], bp)); c.beginPath(); c.arc(640, 470, 26 - press * 3, 0, TAU); c.fill();
  c.restore();
  const ta = sm(seg(lt, 1.5, 2.6)) * (1 - sm(seg(lt, 6.2, 7.0)));
  neonTxt(c, 'Hazır mısın?', 640, 190, 76, [200, 160, 255], ta, 0.85 + 0.15 * Math.sin(t * 23));
  const tb = sm(seg(lt, 7.0, 7.4)); if (tb > 0) txt(c, 'tek bir dokunuş…', 640, 640, 30, { font: FONT, style: 'italic', col: '#e8dcff', align: 'center', a: tb });
  const fl = seg(lt, 8.0, 8.2); if (fl > 0) tint(c, [255, 255, 255], fl);
  vignette(c, 0.6);
}
// ===== 7: Drop (89.7 - 112.5) =====
function sceneDrop(c, t) {
  const lt = t - 89.7, z = 1.0 + 0.1 * Math.sin(lt * 0.35), shake = 4 * pulse(t) * Math.sin(t * 90);
  stageView(c, t, { I: 1.0, beams: 10, amp: 24, fw: [89.7, 128], z: z, px: Math.sin(lt * 0.5) * 120 + shake, rot: Math.sin(lt * 0.3) * 0.025 });
  c.save(); confetti(c, t, 90.2, 70, 0.9); c.restore();
  const fl = 1 - seg(lt, 0, 0.5); if (fl > 0) tint(c, [255, 255, 255], fl);
}
// ===== 8: Yukarı el (112.5 - 128.3) =====
function sceneSky(c, t) {
  const lt = t - 112.5; c.save(); cam(c, 640, lerp(470, 380, sm(lt / 15.8)), 1 + 0.015 * pulse(t), Math.sin(t * 0.4) * 0.01);
  nightBG(c, t, 430, { moon: [260, 120, 40], ferry: true });
  fireworks(c, t, 112.5, 128.3, 1, [90, 60, 1190, 330]);
  lasers(c, 640, 800, t, 9, 0.7, 1700, 1.5);
  ferry(c, 840, 466, 0.5, -1, { lit: 1, dim: 0.3, t, wake: true });
  crowd(c, t, [{ y: 640, s: 1.2, n: 11, x0: 0, x1: 1280, seed: 41, rim: [60, 220, 255] }, { y: 790, s: 1.9, n: 7, x0: -40, x1: 1320, seed: 42, rim: [255, 184, 70] }], 22);
  c.restore();
  if (pulse(t) > 0.85) tint(c, [255, 235, 255], 0.08, 'lighter');
  confetti(c, t, 112.5, 40, 0.6); vignette(c, 0.4);
}
// ===== 9: Gece devam (128.3 - 140) =====
function sceneFinale(c, t) {
  const lt = t - 128.3, spot = 1 - sm(seg(lt, 1.0, 1.6));
  c.save(); cam(c, 640, 400, lerp(1.25, 1.0, sm(seg(lt, 0.8, 8))), 0);
  nightBG(c, t, 440, { moon: [1000, 120, 40], ferry: true });
  lasers(c, 640, 800, t, 7, 0.6 * sm(seg(lt, 1, 2)), 1700, 1.4);
  fireworks(c, t, 129, 137.5, 1, [90, 60, 1190, 320]);
  crowd(c, t, [{ y: 650, s: 1.1, n: 12, x0: 0, x1: 1280, seed: 51, rim: [255, 90, 190] }, { y: 790, s: 1.8, n: 7, x0: -40, x1: 1320, seed: 52, rim: [60, 220, 255] }], 16);
  c.restore();
  if (spot > 0.01) { c.fillStyle = `rgba(3,2,8,${spot})`; c.fillRect(0, 0, W, H); c.save(); c.globalCompositeOperation = 'lighter'; glow(c, 640, 400, 200, [255, 200, 255], 0.5 * spot); c.restore(); }
  const hit = seg(t, 137.55, 137.9); if (hit > 0 && hit < 1) tint(c, [255, 255, 255], 0.9 * (1 - hit));
  const bl = sm(seg(t, 137.9, 138.5)); if (bl > 0) { c.fillStyle = `rgba(3,2,8,${bl})`; c.fillRect(0, 0, W, H); }
  vignette(c, 0.4);
  const ea = sm(seg(t, 138.3, 138.9));
  neonTxt(c, 'GECE BİZİMLE', 640, 340, 78, [255, 60, 170], ea, 0.9 + 0.1 * Math.sin(t * 17));
  txt(c, 'gece devam…', 640, 384, 22, { font: FONT, style: 'italic', col: '#e8dcff', align: 'center', a: ea * 0.9, sp: 3 });
}
