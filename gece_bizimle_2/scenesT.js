'use strict';
const SKY2 = document.createElement('canvas'); SKY2.width = W; SKY2.height = H;
const BC = [[255, 140, 170], [120, 200, 255], [255, 215, 110], [170, 230, 140], [190, 150, 255], [255, 170, 100]];
const skyG = (c, top, bot, y1 = H) => { c.fillStyle = vgrad(c, 0, y1, [[0, top], [1, bot]]); c.fillRect(-300, -300, W + 600, y1 + 300); };
function cityRow(c, t, base, x0, x1, seed, hmin, hmax, wmin, wmax, f) {
  const r = rng(seed); let x = x0, i = 0;
  while (x < x1) { const w = wmin + r() * (wmax - wmin), h = hmin + r() * (hmax - hmin), cx = x + w / 2, roof = Math.floor(r() * 3), st = f ? f(cx, base - h / 2) : { sat: 1, awake: 1 };
    building(c, { x: cx, base, w, h, col: BC[(i + seed) % 6], roof, sat: st.sat, awake: st.awake, t, seed: seed + i }); x += w + 10 + r() * 20; i++; }
}
function cast(c, t, rows, o = {}) {
  const ph0 = bph(t) * Math.PI;
  for (const R of rows) {
    const r = rng(R.seed);
    for (let i = 0; i < R.n; i++) {
      const x = R.x0 + (i + 0.2 + r() * 0.6) * (R.x1 - R.x0) / R.n, k = r(), hue = PC[Math.floor(r() * 6)], ph = ph0 + r() * 1.4, fl = r() > 0.5 ? 1 : -1, hat = Math.floor(r() * 4), kd = Math.floor(r() * 4), sc = 0.9 + r() * 0.25;
      if (k < 0.2) cat(c, { x, y: R.y, s: R.s * 0.95, t, ph, hue: [P.orange, P.violet, P.cyan][i % 3], flip: fl, awake: 1, sat: o.sat });
      else if (k < 0.33) pigeon(c, { x, y: R.y, s: R.s, t, ph, flip: fl, awake: 1, sat: o.sat });
      else citizen(c, { x, y: R.y, s: R.s * sc, t, kind: kd, hue, awake: 1, ph, hat, up: o.up ? 1 : 0, flip: fl, sat: o.sat });
    }
  }
}
function plaza(c, t, o = {}) {
  const night = o.night, hue = (t * 28) % 360;
  if (night) { skyG(c, [20, 14, 70], [96, 44, 150], 470); stars(c, t, 0.9, 470); }
  else skyG(c, hsl(hue, 0.85, 0.66), hsl(hue + 50, 0.9, 0.82), 470);
  if (!night) {
    c.save(); c.translate(930, 190); c.rotate(t * 1.2); c.beginPath(); c.arc(0, 0, 112, 0, TAU); fillOl(c, [40, 34, 90], 1, 6);
    c.strokeStyle = 'rgba(255,255,255,0.12)'; c.lineWidth = 1.5; for (let r = 56; r < 108; r += 8) { c.beginPath(); c.arc(0, 0, r, 0, TAU); c.stroke(); }
    c.beginPath(); c.arc(0, 0, 46, 0, TAU); fillOl(c, P.yellow, 1, 5); c.beginPath(); c.arc(0, 0, 7, 0, TAU); c.fillStyle = '#1c1440'; c.fill(); c.restore();
    glow(c, 930, 190, 300, [255, 240, 160], 0.35, 'lighter');
  }
  for (let i = 0; i < 4; i++) puffCloud(c, ((i * 380 + t * 12) % 1700) - 200, 100 + (i % 2) * 70, 1.2, night ? [120, 90, 190] : [255, 255, 255], 1);
  cityRow(c, t, 480, -40, 1340, 3, 160, 300, 100, 150, null);
  c.fillStyle = vgrad(c, 470, H, [[0, night ? [60, 40, 120] : [255, 236, 190]], [1, night ? [34, 20, 80] : [255, 200, 150]]]); c.fillRect(-300, 470, W + 600, 400);
  c.strokeStyle = 'rgba(28,20,64,0.18)'; c.lineWidth = 3; for (let i = -10; i <= 10; i++) { c.beginPath(); c.moveTo(640 + i * 20, 470); c.lineTo(640 + i * 180, 760); c.stroke(); }
  for (let j = 0; j < 6; j++) { const y = 470 + Math.pow(j / 6, 1.6) * 290; c.beginPath(); c.moveTo(-300, y); c.lineTo(W + 300, y); c.stroke(); }
  for (const fx of [70, 210, 1090, 1210]) spkFlower(c, fx, 560 + (fx % 3) * 8, 0.85, t, PC[Math.floor(fx / 10) % 6], 1, fx);
  if (night) discoBall(c, 640, 190, 90, t); else notes(c, t, 31, 8, 100, 1180, 560, 1);
  if (o.crowd !== false) cast(c, t, [{ y: 560, s: 0.8, n: 8, x0: 20, x1: 1260, seed: 11 }, { y: 612, s: 1.0, n: 7, x0: 0, x1: 1280, seed: 12 }, { y: 662, s: 1.25, n: 5, x0: 10, x1: 1270, seed: 13 }], { up: o.up });
  if (o.robot !== false) robot(c, { x: 640, y: 620, s: 1.5, t, arms: 'dance', ph: 0, sat: 1, mouth: 1, open: 1, sq: 0.06 * pulse(t) });
}
// ===== 1: Sessiz Şehir (0 - 20) =====
function sceneSilent(c, t) {
  c.save(); cam(c, 640, 380, 1 + 0.03 * sm(t / 20), 0);
  const lamps = [{ x: 230, on: 13.2 }, { x: 880, on: 15.2 }, { x: 1090, on: 17.2 }], rsat = sm(seg(t, 8, 11));
  const stAt = (x) => { let s = lamps.reduce((a, L) => a + (t > L.on ? sm(seg(t, L.on, L.on + 1.2)) * Math.exp(-Math.pow((x - L.x) / 240, 2)) : 0), 0) + 0.95 * rsat * Math.exp(-Math.pow((x - 530) / 330, 2)); s = clamp(s); return { sat: s, awake: s * 0.8 }; };
  skyG(c, [150, 158, 180], [206, 210, 220], 560);
  for (let i = 0; i < 4; i++) puffCloud(c, ((i * 420 + t * 9) % 1700) - 200, 110 + (i % 2) * 60, 1.4, [222, 225, 236], 0);
  cityRow(c, t, 470, -40, 1340, 21, 150, 270, 100, 150, stAt);
  cityRow(c, t, 580, -60, 1340, 22, 220, 330, 130, 190, (x, y) => stAt(x));
  c.fillStyle = vgrad(c, 560, H, [[0, [176, 180, 196]], [1, [128, 130, 150]]]); c.fillRect(-300, 560, W + 600, 300);
  c.fillStyle = 'rgba(28,20,64,0.18)'; c.fillRect(-300, 562, W + 600, 6);
  for (const L of lamps) { const on = t > L.on, k = on ? sm(seg(t, L.on, L.on + 1)) : 0; c.beginPath(); c.moveTo(L.x, 640); c.lineTo(L.x, 340); oln(c, 12, 0); c.strokeStyle = cs([200, 200, 220], k); c.lineWidth = 6; c.stroke(); c.beginPath(); c.arc(L.x, 330, 22, 0, TAU); fillOl(c, P.yellow, k * 0.9 + 0.0, 5); if (on) { glow(c, L.x, 330, 300, P.yellow, 0.55 * k, 'lighter'); for (let i = 0; i < 6; i++) { c.fillStyle = cs(PC[i], 1, 0.12 * k); c.beginPath(); c.arc(L.x, 560, 180 - i * 22, 0, TAU); c.fill(); } } }
  c.fillStyle = cs([160, 165, 185], 0); c.beginPath(); c.moveTo(380, 650); c.lineTo(380, 590); c.lineTo(500, 590); c.lineTo(500, 650); c.closePath(); fillOl(c, [150, 156, 176], 0, 5);
  for (const [bx, by, bw, bh] of [[330, 620, 70, 50], [250, 640, 60, 40], [420, 570, 64, 40]]) { rrect(c, bx, by - bh + 20, bw, bh, 5); fillOl(c, [196, 170, 130], 0, 4); }
  c.beginPath(); c.ellipse(610, 645, 38, 38, 0, 0, TAU); fillOl(c, [80, 82, 100], 0, 5); c.beginPath(); c.ellipse(610, 645, 16, 16, 0, 0, TAU); c.fillStyle = cs([170, 175, 195], 0); c.fill();
  for (let i = 0; i < 3; i++) { const x = ((i * 640 - t * 24 + 1700) % 1700) - 200; citizen(c, { x, y: 640 + i * 4, s: 1.05, t, kind: i, hue: BC[i], awake: 0, sat: stAt(x).sat, ph: t * 2.2 + i, hat: i === 1 ? 1 : 0 }); }
  const open = sm(seg(t, 6.5, 8.5)) * (1 - 0.85 * Math.exp(-Math.pow((t - 9.7) / 0.1, 2))), standing = sm(seg(t, 10.2, 12.4)), wk = t > 13.5;
  const rx = 520 + sm(seg(t, 13.5, 19.5)) * 120;
  robot(c, { x: rx, y: 622, s: 1.35, t, open, look: Math.sin(t * 1.3) * 0.6, sat: rsat, rot: -0.38 * (1 - standing), ph: wk ? t * 8 : 0, zz: t < 8.5 ? 1 - sm(seg(t, 6.5, 8.5)) : 0, brow: 0, mouth: t > 8.5, arms: 'swing', sq: 0.03 * pulse(t) * rsat });
  const r = rng(5); for (let i = 0; i < 30; i++) { c.fillStyle = `rgba(255,255,255,${0.5 * r()})`; c.fillRect(((r() * W + t * 12 * (0.4 + r())) % W), (r() * 560 + t * 5 * r()) % 560, 3, 3); }
  c.restore(); vignette(c, 0.35);
}
// ===== 2: Adımlar Hızlı (20 - 44) =====
function sceneMarch(c, t) {
  let sc = 0; for (let u = 20; u < t; u += 0.05) sc += (1 - 0.9 * sm(seg(u, 38.6, 40.2))) * 0.05;
  const RX = 470, sh = 2.5 * Math.sin(t * 38) * KK * (t < 39 ? 1 : 0.1);
  c.save(); cam(c, 640 + sh, 360 + sh * 0.6, 1.02 + 0.012 * pulse(t), 0);
  const m = (x) => clamp(1.25 - (x - RX) / 460);
  skyG(c, [150, 158, 180], [206, 210, 220], 560); c.fillStyle = vgrad(c, 560, H, [[0, [176, 180, 196]], [1, [128, 130, 150]]]); c.fillRect(-300, 560, W + 600, 300);
  const s2 = SKY2.getContext('2d'); s2.clearRect(0, 0, W, H); s2.globalCompositeOperation = 'source-over'; skyG(s2, [120, 200, 255], [255, 226, 200], 560); s2.fillStyle = vgrad(s2, 560, H, [[0, [255, 220, 170]], [1, [255, 190, 140]]]); s2.fillRect(0, 560, W, 200);
  for (let i = 0; i < 4; i++) puffCloud(s2, ((i * 400 - sc * 40) % 1700 + 1700) % 1700 - 200, 120 + (i % 2) * 70, 1.3, [255, 255, 255], 1);
  s2.globalCompositeOperation = 'destination-in'; const mg = s2.createLinearGradient(0, 0, W, 0); mg.addColorStop(0, 'rgba(0,0,0,1)'); mg.addColorStop(clamp((RX + 20) / W), 'rgba(0,0,0,1)'); mg.addColorStop(clamp((RX + 520) / W), 'rgba(0,0,0,0)'); mg.addColorStop(1, 'rgba(0,0,0,0)'); s2.fillStyle = mg; s2.fillRect(0, 0, W, H); s2.globalCompositeOperation = 'source-over';
  c.drawImage(SKY2, 0, 0);
  const lay = (v, seed, base, hmin, hmax, wmin, wmax) => { const r = rng(seed), list = []; let x = 0; while (x < 2600) { const w = wmin + r() * (wmax - wmin); list.push({ x, w, h: hmin + r() * (hmax - hmin), roof: Math.floor(r() * 3) }); x += w + 14 + r() * 24; } const tot = x; list.forEach((b, i) => { const sx = (((b.x - sc * v) % tot) + tot) % tot - 300, cx = sx + b.w / 2, s = m(cx); building(c, { x: cx, base, w: b.w, h: b.h, col: BC[(i + seed) % 6], roof: b.roof, sat: s, awake: s, t, seed: seed + i }); }); };
  lay(60, 41, 480, 150, 270, 100, 150); lay(140, 42, 590, 220, 330, 130, 190);
  c.fillStyle = 'rgba(28,20,64,0.15)'; c.fillRect(-300, 562, W + 600, 6);
  for (let k = Math.floor(bph(t)) - 4; k <= Math.floor(bph(t)); k++) { const age = t - (B0 + k * PER); if (age < 0 || age > 1.6) continue; const x = RX - age * 260 * (1 - 0.9 * sm(seg(t, 38.6, 40.2))); c.save(); c.translate(x, 636); c.scale(1, 0.26); c.beginPath(); c.arc(0, 0, age * 190, 0, TAU); c.lineWidth = 16 * (1 - age / 1.6); c.strokeStyle = cs(PC[((k % 6) + 6) % 6], 1, 0.8 * (1 - age / 1.6)); c.stroke(); c.restore(); }
  const gl = [{ w: 0, k: 0 }, { w: 520, k: 1 }, { w: 980, k: 2 }, { w: 1450, k: 3 }, { w: 1900, k: 0 }, { w: 2330, k: 1 }];
  gl.forEach((g, i) => { const x = (((g.w - sc * 260) % 2600) + 2600) % 2600 - 250, aw = clamp((RX + 50 - x) / 140); citizen(c, { x, y: 640 + (i % 2) * 8, s: 1.1, t, kind: g.k, hue: BC[(i + 2) % 6], awake: aw, sat: aw, ph: bph(t) * Math.PI + i, hat: i % 4, up: aw > 0.9 }); });
  const crew = [[24, 'c', 0], [27.5, 'k', 1], [31, 'p', 2], [34, 'c', 3], [37, 'c', 1]];
  crew.forEach(([ts, ty, i]) => { if (t < ts) return; const tx = RX - 120 * (i + 1) - 10, a = eo(seg(t, ts, ts + 1.4)), x = lerp(-120, tx, a), ph = bph(t) * Math.PI + i * 0.5, y = 640 + (i % 2) * 6;
    if (ty === 'k') cat(c, { x, y, s: 0.95, t, ph, awake: 1, hue: P.orange }); else if (ty === 'p') pigeon(c, { x, y, s: 1.0, t, ph, awake: 1 }); else citizen(c, { x, y, s: 1.05, t, kind: i, hue: BC[(i + 3) % 6], awake: 1, ph, hat: i % 4, up: 0 }); });
  robot(c, { x: RX, y: 632, s: 1.4, t, ph: t * 8.2, arms: 'swing', sat: 1, brow: 0.7, open: 0.9, look: 0.6, mouth: 1, sq: 0.05 * pulse(t) });
  const r = rng(3); c.fillStyle = 'rgba(255,255,255,0.35)'; for (let i = 0; i < 14; i++) c.fillRect((((r() * W - t * 800 * (0.5 + r())) % W) + W) % W, 120 + r() * 400, 80 + r() * 150, 2);
  notes(c, t, 9, 8, 100, RX, 560, 1, 36);
  const tw = sm(seg(t, 38.5, 42)); if (tw > 0) tower(c, 1040 + (1 - tw) * 1100, 650, 560, 0, 0, t);
  c.restore();
  const fl = seg(t, 43.2, 44); if (fl > 0) tint(c, [255, 255, 255], fl);
  vignette(c, 0.3);
}
// ===== 3a: Fiş takılıyor (44 - 51.5) =====
function sceneTowerBase(c, t) {
  const lt = t - 44, lit = sm(seg(t, 46.4, 50.6));
  c.save(); cam(c, 640, lerp(470, 330, sm(seg(t, 46.5, 51))), lerp(1.0, 1.12, sm(lt / 7.5)), 0);
  skyG(c, mix([150, 158, 180], [255, 140, 190], lit * 0.7), mix([206, 210, 220], [255, 214, 120], lit * 0.7), 620);
  rays(c, 640, 100, t, 18, [255, 255, 255], [255, 255, 255], 0.0 + 0.09 * lit, 0.3);
  c.fillStyle = vgrad(c, 620, H, [[0, [176, 180, 196]], [1, [128, 130, 150]]]); c.fillRect(-300, 620, W + 600, 400);
  const s2 = lit;
  tower(c, 640, 650, 640, lit, lit > 0.05 ? 0.3 + 0.7 * lit : 0, t);
  rrect(c, 566, 590, 38, 40, 8); fillOl(c, [210, 210, 235], 0, 4); c.beginPath(); c.arc(585, 610, 7, 0, TAU); c.fillStyle = cs(P.navy, 0); c.fill();
  const rx = 400, plug = sm(seg(t, 45.4, 46.3)), px = lerp(rx + 60, 585, plug);
  robot(c, { x: rx, y: 652, s: 1.5, t, sat: 0.15 + 0.85 * smoothstep(seg(t, 46.2, 49)), open: 1, brow: 0.6, look: 0.8, ph: 0, arms: lit > 0.5 ? 'up' : 'swing', mouth: 1, sq: 0.05 * pulse(t) * lit });
  c.beginPath(); c.moveTo(rx - 78, 560); c.bezierCurveTo(rx - 150, 700, px - 90, 700, px, 612); oln(c, 12, 1); c.strokeStyle = cs(P.pink, 1); c.lineWidth = 6; c.stroke();
  rrect(c, px - 14, 600, 22, 24, 5); fillOl(c, P.yellow, 1, 4);
  const sp = seg(t, 46.2, 46.8); if (sp > 0 && sp < 1) { for (let i = 0; i < 10; i++) { const a = i / 10 * TAU; c.strokeStyle = cs(P.yellow, 1, 1 - sp); c.lineWidth = 4; c.beginPath(); c.moveTo(585 + Math.cos(a) * 14, 612 + Math.sin(a) * 14); c.lineTo(585 + Math.cos(a) * (14 + sp * 60), 612 + Math.sin(a) * (14 + sp * 60)); c.stroke(); } tint(c, [255, 255, 255], 0.3 * (1 - sp), 'lighter'); }
  if (lit > 0.9) for (let k = Math.floor(bph(t)) - 3; k <= Math.floor(bph(t)); k++) { const age = t - (B0 + k * PER); if (age < 0 || age > 1.8) continue; c.strokeStyle = cs(PC[((k % 6) + 6) % 6], 1, 0.9 * (1 - age / 1.8)); c.lineWidth = 12 * (1 - age / 1.8); c.beginPath(); c.arc(640, 650 - 640 + 20, age * 480, 0, TAU); c.stroke(); }
  c.restore(); vignette(c, 0.3);
}
const smoothstep = x => sm(x);
// ===== 3b: Dalga şehre yayılıyor (51.5 - 60.5) =====
function sceneWave(c, t) {
  const lt = t - 51.5, R = Math.max(0.5, lt * 400), cx0 = 640, cy0 = 300, col = (x, y) => clamp((R - Math.hypot(x - cx0, (y - cy0) * 0.8)) / 120);
  c.save(); cam(c, 640, 380, 1.1 - 0.1 * sm(lt / 9) + 0.01 * pulse(t), Math.sin(t * 0.5) * 0.015);
  skyG(c, [150, 158, 180], [206, 210, 220], 560); c.fillStyle = vgrad(c, 560, H, [[0, [176, 180, 196]], [1, [128, 130, 150]]]); c.fillRect(-300, 560, W + 600, 300);
  const s2 = SKY2.getContext('2d'); s2.clearRect(0, 0, W, H); s2.globalCompositeOperation = 'source-over'; skyG(s2, [255, 140, 190], [255, 226, 130], 560); s2.fillStyle = vgrad(s2, 560, H, [[0, [255, 220, 170]], [1, [255, 190, 140]]]); s2.fillRect(0, 560, W, 200);
  s2.globalCompositeOperation = 'destination-in'; const rg = s2.createRadialGradient(cx0, cy0, Math.max(0, R - 120), cx0, cy0, R + 1); rg.addColorStop(0, 'rgba(0,0,0,1)'); rg.addColorStop(1, 'rgba(0,0,0,0)'); s2.fillStyle = rg; s2.fillRect(0, 0, W, H); s2.globalCompositeOperation = 'source-over';
  c.drawImage(SKY2, 0, 0);
  const f = (x, y) => { const k = col(x, y); return { sat: k, awake: k }; };
  cityRow(c, t, 470, -40, 1340, 21, 150, 270, 100, 150, f); tower(c, 640, 470, 330, 1, 1, t); cityRow(c, t, 585, -60, 1340, 22, 200, 320, 130, 190, f);
  for (let k = Math.floor(bph(t)) - 4; k <= Math.floor(bph(t)); k++) { const age = t - (B0 + k * PER); if (age < 0 || age > 2.2) continue; c.strokeStyle = cs(PC[((k % 6) + 6) % 6], 1, 0.8 * (1 - age / 2.2)); c.lineWidth = 10 * (1 - age / 2.2); c.beginPath(); c.arc(cx0, cy0, age * 520, 0, TAU); c.stroke(); }
  const xs = [90, 230, 380, 520, 760, 900, 1050, 1190];
  xs.forEach((x, i) => { const y = 650 + (i % 2) * 6, aw = col(x, y), ph = bph(t) * Math.PI + i; if (i % 4 === 1) cat(c, { x, y, s: 1.0, t, ph, awake: aw, hue: P.orange }); else if (i % 4 === 3) pigeon(c, { x, y, s: 1.0, t, ph, awake: aw }); else citizen(c, { x, y, s: 1.15, t, kind: i, hue: BC[i % 6], awake: aw, ph, hat: i % 4, up: aw > 0.9 }); });
  robot(c, { x: 640, y: 640, s: 1.3, t, arms: 'dance', sat: 1, mouth: 1, sq: 0.06 * pulse(t), brow: 0.3 });
  notes(c, t, 17, 8, 100, 1180, 600, 1, 36);
  c.restore(); vignette(c, 0.25);
}
// ===== 4: Duvarlar çatlıyor (60.5 - 70.5) =====
function sceneWall(c, t) {
  const lt = t - 60.5, burst = 5.2, age = lt - burst, crack = sm(seg(lt, 0.4, 5.1)), sh = lt < burst ? Math.sin(t * 60) * 2.2 * crack : 0;
  c.save(); cam(c, 640 + sh, 360, 1 + 0.01 * pulse(t) + (lt < burst ? lt * 0.006 : 0), 0);
  const hue = (t * 40) % 360;
  skyG(c, hsl(hue, 0.85, 0.62), hsl(hue + 60, 0.9, 0.8), H);
  rays(c, 640, 380, t, 24, [255, 255, 255], [255, 255, 255], 0.14, 0.5);
  for (let i = 0; i < 7; i++) spkFlower(c, 90 + i * 190, 700 + (i % 2) * 14, 1.5 + (i % 3) * 0.15, t, PC[i % 6], 1, i);
  cast(c, t, [{ y: 655, s: 1.3, n: 6, x0: 40, x1: 1240, seed: 71 }], {});
  robot(c, { x: 640, y: 655, s: 1.6, t, arms: 'dance', sat: 1, mouth: 1, sq: 0.07 * pulse(t) });
  notes(c, t, 77, 12, 80, 1200, 650, 1, 40);
  if (age < 1.8) {
    const r = rng(15);
    for (let j = 0; j < 12; j++) for (let i = 0; i < 20; i++) {
      const bx = i * 66 - 20 + (j % 2 ? 33 : 0), by = j * 62 - 30, d = Math.hypot(bx + 33 - 640, by + 30 - 360);
      if (age < 0) { c.save(); c.translate(bx + 33, by + 30); const gl = Math.exp(-d / 220) * crack; c.beginPath(); rrect(c, -31, -28, 62, 56, 6); fillOl(c, mix([150, 152, 170], P.yellow, gl), gl * 0.9, 4); c.restore(); }
      else { const v = (0.6 + r() * 1.4) * Math.max(d, 60) / 200, a = Math.atan2(by + 30 - 360, bx + 33 - 640), z = 1 + age * 2.4 * (0.6 + r()), x = 640 + Math.cos(a) * (d + age * 700 * v), y = 360 + Math.sin(a) * (d + age * 700 * v) + 220 * age * age; c.save(); c.translate(x, y); c.rotate(age * (r() - 0.5) * 12); c.scale(z, z); c.globalAlpha = clamp(1.7 - age) * 0.95; rrect(c, -31, -28, 62, 56, 6); fillOl(c, PC[(i + j) % 6], 1, 4); c.restore(); }
    }
    if (age < 0) {
      c.save(); rrect(c, 380, 300, 520, 130, 16); fillOl(c, [240, 240, 250], 0.0, 6); c.restore();
      txt(c, 'SESSİZ!', 640, 400, 96, { font: SANS, weight: 900, col: cs([60, 62, 90], 0), align: 'center', sp: 8 });
      const rr = rng(33); for (let k = 0; k < 7; k++) { let x = 640, y = 360, a = k / 7 * TAU + 0.3; c.beginPath(); c.moveTo(x, y); for (let s = 0; s < 14 * crack; s++) { a += (rr() - 0.5) * 0.9; x += Math.cos(a) * 34; y += Math.sin(a) * 34; c.lineTo(x, y); } c.lineJoin = 'round'; c.strokeStyle = 'rgba(28,20,64,0.9)'; c.lineWidth = 9; c.stroke(); c.strokeStyle = rgba(hsl(hue + k * 40, 1, 0.65), 1); c.lineWidth = 4; c.stroke(); glow(c, x, y, 40, hsl(hue + k * 40, 1, 0.65), 0.6, 'lighter'); }
    }
  }
  c.restore();
  const fl = age > 0 ? 1 - seg(age, 0, 0.4) : 0; if (fl > 0) tint(c, [255, 255, 255], fl);
  vignette(c, 0.2);
}
// ===== 5: Kalabalık (70.5 - 81.5) =====
function sceneSurf(c, t) {
  const lt = t - 70.5, sh = 3 * pulse(t) * Math.sin(t * 70);
  c.save(); cam(c, 640 + sh, 380, 1.02 + 0.02 * pulse(t), Math.sin(t * 0.8) * 0.02);
  plaza(c, t, { robot: false, up: true, night: false });
  const p = lt / 11, rx = lerp(140, 1140, p), ry = 430 + Math.sin(t * 3) * 14;
  robot(c, { x: rx, y: ry, s: 1.45, t, rot: -0.12 + Math.sin(t * 2.2) * 0.12, arms: 'up', sat: 1, mouth: 1, open: 1, legs: true, ph: t * 6, brow: 0.3 });
  for (let i = 0; i < 9; i++) { const hx = rx - 140 + i * 36, hy = ry + 110 + Math.sin(t * 6 + i) * 10; c.beginPath(); c.moveTo(hx, hy + 70); c.lineTo(hx, hy); oln(c, 14, 1); c.strokeStyle = cs(PC[i % 6], 1); c.lineWidth = 7; c.stroke(); c.beginPath(); c.arc(hx, hy, 11, 0, TAU); fillOl(c, P.white, 1, 4); }
  discoBall(c, 640, 150 + Math.sin(t * 2) * 10, 70, t);
  confetti(c, t, 70.5, 60);
  c.restore(); vignette(c, 0.2);
}
// ===== 6: Hazır mısın? (81.5 - 89.7) =====
function sceneReady(c, t) {
  const lt = t - 81.5, z = 1 + eo(seg(lt, 0, 8)) * 0.22, press = lt > 7.9 ? clamp((lt - 7.9) / 0.15) : 0;
  c.save(); cam(c, 640, 400, z, 0);
  skyG(c, [14, 10, 44], [40, 24, 90], H);
  const rr = rng(4);
  for (let i = 0; i < 46; i++) { const x = rr() * W, y = rr() * 440, blink = (Math.sin(t * 0.9 + i) > 0.97 || (lt > 3.2 && lt < 3.5)) ? 0.1 : 1, tilt = (x - 640) / 600; for (const sd of [-1, 1]) { c.beginPath(); c.ellipse(x + sd * 16, y, 8, 11 * blink, 0, 0, TAU); c.fillStyle = 'rgba(255,255,255,0.92)'; c.fill(); c.beginPath(); c.arc(x + sd * 16 + tilt * 3, y + 2, 3.4, 0, TAU); c.fillStyle = '#1c1440'; c.fill(); } }
  const sp = c.createLinearGradient(0, 0, 0, 640); sp.addColorStop(0, 'rgba(255,230,255,0.3)'); sp.addColorStop(1, 'rgba(255,230,255,0.04)');
  c.save(); c.globalCompositeOperation = 'lighter'; c.fillStyle = sp; c.beginPath(); c.moveTo(600, 0); c.lineTo(680, 0); c.lineTo(920, 700); c.lineTo(360, 700); c.fill(); c.restore();
  c.beginPath(); c.ellipse(640, 640, 380, 80, 0, 0, TAU); fillOl(c, [70, 60, 130], 1, 6);
  bigButton(c, 640, 600, 1.7, press, t, 1);
  for (let i = 0; i < 4; i++) { const p = (((lt * 0.6 + i / 4) % 1) + 1) % 1; c.strokeStyle = cs(P.pink, 1, 0.5 * (1 - p)); c.lineWidth = 3; c.beginPath(); c.ellipse(640, 600, 150 + p * 300, 40 + p * 80, 0, 0, TAU); c.stroke(); }
  const jump = sm(seg(lt, 6.3, 7.6)), rx = lerp(330, 560, jump), ry = lerp(640, 470, Math.sin(jump * Math.PI)) + (jump >= 1 ? 0 : 0);
  robot(c, { x: rx, y: lt < 7.4 ? ry : 400 + 60 * sm(seg(lt, 7.4, 7.9)), s: 1.1, t, arms: lt > 6 ? 'up' : 'swing', sat: 1, brow: 1, open: 0.8, look: 0.5, mouth: 0, sq: 0.04 * Math.sin(lt * 5) });
  const ta = sm(seg(lt, 1.2, 2.2)) * (1 - sm(seg(lt, 6.0, 6.8)));
  c.save(); c.translate(640, 250); c.rotate(-0.04); txt(c, 'Hazır mısın?', 0, 0, 92, { font: SANS, weight: 900, col: cs(P.yellow), align: 'center', a: ta, shadow: cs(P.pink), sb: 24, sp: 2 }); c.restore();
  c.restore();
  const fw = seg(lt, 8.0, 8.2); if (fw > 0) tint(c, [255, 255, 255], fw);
  vignette(c, 0.5);
}
// ===== 7: Drop (89.7 - 112.5) =====
function sceneDrop(c, t) {
  const lt = t - 89.7, shot = lt < 9.4 ? 0 : lt < 16.3 ? 1 : 2, shake = 6 * pulse(t) * Math.sin(t * 90);
  c.save();
  if (shot === 0) {
    cam(c, 640 + shake, 400, 1 + 0.07 * pulse(t), 0.03 * Math.sin(lt * 0.9));
    const hue = (t * 70) % 360; skyG(c, hsl(hue, 0.9, 0.55), hsl(hue + 80, 0.95, 0.7), H); rays(c, 640, 420, t, 28, hsl(hue + 40, 1, 0.75), hsl(hue + 200, 1, 0.55), 0.35, 0.7);
    for (let k = Math.floor(bph(t)) - 3; k <= Math.floor(bph(t)); k++) { const age = t - (B0 + k * PER); if (age < 0 || age > 1.6) continue; c.strokeStyle = cs(PC[((k % 6) + 6) % 6], 1, 0.9 * (1 - age / 1.6)); c.lineWidth = 22 * (1 - age / 1.6); c.beginPath(); c.arc(640, 420, age * 700, 0, TAU); c.stroke(); }
    for (let i = 0; i < 6; i++) spkFlower(c, 70 + i * 230, 760, 2.0, t, PC[i % 6], 1, i);
    robot(c, { x: 640, y: 760, s: 3.0, t, arms: 'dance', sat: 1, mouth: 1, open: 1, brow: 0.2, sq: 0.1 * pulse(t), ph: 0 });
    notes(c, t, 5, 14, 100, 1180, 700, 1, 52);
    const fl = 1 - seg(lt, 0, 0.5); if (fl > 0) tint(c, [255, 255, 255], fl);
  } else if (shot === 1) {
    c.translate(W / 2, H / 2); c.rotate(t * 0.35); c.scale(1 + 0.06 * pulse(t), 1 + 0.06 * pulse(t));
    const hue = (t * 60) % 360; c.fillStyle = rgba(hsl(hue, 0.9, 0.35)); c.fillRect(-1400, -1400, 2800, 2800); rays(c, 0, 0, t, 24, hsl(hue + 100, 1, 0.6), hsl(hue + 220, 1, 0.45), 0.5, -0.5);
    for (let ring = 0; ring < 2; ring++) for (let i = 0; i < 8; i++) { c.save(); c.rotate(i / 8 * TAU + ring * 0.2); c.translate(0, -(ring ? 400 : 240)); const k = i + ring * 3, ph = bph(t) * Math.PI + i * 0.6;
      building(c, { x: 0, base: 0, w: 100, h: 130, col: BC[k % 6], roof: k % 3, sat: 1, awake: 1, t, seed: 50 + k }); citizen(c, { x: 80, y: 0, s: 0.9, t, kind: k, hue: BC[(k + 2) % 6], awake: 1, ph, hat: k % 4, up: 1 }); if (ring) cat(c, { x: -90, y: 0, s: 0.8, t, ph, hue: P.orange }); c.restore(); }
    c.save(); c.rotate(-t * 0.35); robot(c, { x: 0, y: 130, s: 1.5, t, arms: 'dance', sat: 1, mouth: 1, sq: 0.08 * pulse(t), legs: false }); c.restore();
  } else {
    cam(c, 640 + shake, 380, 1 + 0.03 * pulse(t), Math.sin(lt * 0.7) * 0.05);
    plaza(c, t, { night: false, up: true }); confetti(c, t, 106, 90);
    c.save(); c.globalAlpha = 0.9; discoBall(c, 640, 160, 85, t); c.restore();
  }
  c.restore(); vignette(c, 0.2);
}
function confetti(c, t, t0, n) {
  const age = t - t0; if (age < 0) return; const r = rng(77);
  for (let i = 0; i < n; i++) { const x0 = r() * W, sp = 70 + r() * 130, ph = r() * TAU, y = -20 + ((age * sp + r() * 800) % 860), x = x0 + Math.sin(age * 2 + ph) * 30; c.save(); c.translate(x, y); c.rotate(age * (2 + r() * 3) + ph); c.fillStyle = cs(PC[i % 6]); c.fillRect(-5, -3, 10, 6 * Math.abs(Math.cos(age * 4 + ph)) + 1.5); c.restore(); }
}
// ===== 8: Yukarı El — yükseliş ve gezegen (112.5 - 128.3) =====
function sceneRise(c, t) {
  const lt = t - 112.5, up = sm(seg(lt, 0.5, 9)), sp = sm(seg(lt, 6, 11)), sh = 3 * pulse(t) * Math.sin(t * 60);
  c.save();
  const hue = (t * 40) % 360;
  c.fillStyle = vgrad(c, 0, H, [[0, mix(mix([60, 140, 255], [6, 4, 30], sp), [0, 0, 0], 0)], [1, mix(hsl(hue + 50, 0.9, 0.8), [40, 20, 110], sp)]]); c.fillRect(0, 0, W, H);
  stars(c, t, 1.4 * sp, H);
  if (sp < 0.98) {
    c.save(); c.translate(sh, up * 1100);
    for (let i = 0; i < 6; i++) puffCloud(c, ((i * 300 + t * 16) % 1500) - 150, 140 + i * 90 - 600 * 0, 1.8, [255, 255, 255], 1);
    cityRow(c, t, 470, -40, 1340, 3, 160, 300, 100, 150, null);
    c.fillStyle = cs([255, 220, 160]); c.fillRect(-100, 470, W + 200, 600);
    cast(c, t, [{ y: 590, s: 1.1, n: 8, x0: 20, x1: 1260, seed: 11 }, { y: 690, s: 1.5, n: 5, x0: 10, x1: 1270, seed: 13 }], { up: true });
    robot(c, { x: 640, y: 640, s: 1.6, t, arms: 'up', sat: 1, mouth: 1, sq: 0.05 * pulse(t) });
    c.restore(); c.fillStyle = `rgba(255,255,255,${0.7 * Math.sin(seg(lt, 3, 8) * Math.PI)})`; c.fillRect(0, 0, W, H);
  }
  if (sp > 0.02) {
    const z = 1 + 0.04 * pulse(t) + 0.15 * sm(seg(lt, 11, 15.8)), py = lerp(1200, 540, sp);
    c.save(); c.translate(W / 2 + sh, py); c.scale(z, z);
    glow(c, 0, 0, 700, hsl(hue, 1, 0.6), 0.35 * sp, 'lighter');
    c.beginPath(); c.arc(0, 0, 420, 0, TAU); c.fillStyle = cs([34, 24, 90]); c.fill(); oln(c, 8, 1);
    c.save(); c.beginPath(); c.arc(0, 0, 420, 0, TAU); c.clip();
    for (let i = 0; i < 40; i++) { const rr = rng(i + 90); c.fillStyle = cs(PC[i % 6], 1, 0.9); c.beginPath(); c.arc((rr() - 0.5) * 760, (rr() - 0.2) * 400 - 90, 3 + rr() * 5, 0, TAU); c.fill(); }
    for (const sd of [-1, 1]) { const r = 66 * (1 + 0.14 * BS); c.beginPath(); c.arc(sd * 140, -150, r + 8, 0, TAU); c.fillStyle = cs(P.navy); c.fill(); const g = c.createRadialGradient(sd * 140 - 10, -164, 4, sd * 140, -150, r); g.addColorStop(0, cs([255, 255, 255])); g.addColorStop(0.5, cs(P.cyan)); g.addColorStop(1, cs([20, 110, 190])); c.beginPath(); c.arc(sd * 140, -150, r, 0, TAU); c.fillStyle = g; c.fill(); c.beginPath(); c.arc(sd * 140, -150, r * 0.28, 0, TAU); c.fillStyle = cs(P.navy); c.fill(); glow(c, sd * 140, -150, r * 2.4, P.cyan, 0.3, 'lighter'); }
    for (let i = 0; i < 14; i++) { const lvl = clamp((BS * (1 - i / 14) + HI * (i / 14) * 1.2 + EN * 0.3) * (0.55 + 0.45 * Math.sin(t * 8 + i * 1.6))), bh = 8 + 70 * lvl; c.fillStyle = cs(PC[i % 6]); c.fillRect(-150 + i * 22, 100 - bh, 16, bh); }
    c.restore();
    for (let k = Math.floor(bph(t)) - 3; k <= Math.floor(bph(t)); k++) { const age = t - (B0 + k * PER); if (age < 0 || age > 1.8) continue; c.strokeStyle = cs(PC[((k % 6) + 6) % 6], 1, 0.8 * (1 - age / 1.8)); c.lineWidth = 12 * (1 - age / 1.8); c.beginPath(); c.arc(0, 0, 420 + age * 380, 0, TAU); c.stroke(); }
    c.restore();
    c.save(); c.translate(W / 2, 200); c.rotate(t * 0.8); c.beginPath(); c.arc(480, 0, 46, 0, TAU); fillOl(c, [40, 34, 90], 1, 5); c.beginPath(); c.arc(480, 0, 18, 0, TAU); fillOl(c, P.yellow, 1, 4); c.restore();
  }
  confetti(c, t, 112.5, 40);
  c.restore(); vignette(c, 0.25);
}
// ===== 9: Gece devam — selfie (128.3 - 140) =====
function sceneSelfie(c, t) {
  const lt = t - 128.3, spot = 1 - sm(seg(lt, 1.0, 1.7)), hit = 137.55;
  c.save();
  const drawPlaza = tt => { plaza(c, tt, { night: true, up: tt > 131, robot: false }); const rx = lerp(1500, 640, eo(seg(tt, 128.8, 131.5))); robot(c, { x: rx, y: 630, s: 1.5, t: tt, arms: 'dance', sat: 1, mouth: 1, sq: 0.06 * pulse(tt), ph: tt * 7 }); confetti(c, tt, 129, 50); };
  if (t < hit + 0.25) { cam(c, 640, 380, lerp(1.2, 1.0, sm(seg(lt, 0.8, 8))), 0); drawPlaza(Math.min(t, hit)); if (spot > 0.01) { c.fillStyle = `rgba(6,4,24,${spot})`; c.fillRect(-300, -300, W + 600, H + 600); glow(c, 640, 560, 260, [255, 200, 255], 0.5 * spot, 'lighter'); } }
  c.restore();
  const hf = seg(t, hit, hit + 0.25); if (hf > 0 && hf < 1) tint(c, [255, 255, 255], 1 - hf * 0.0);
  if (t >= hit) {
    c.fillStyle = '#120c34'; c.fillRect(0, 0, W, H); rays(c, 640, 360, t, 20, [255, 255, 255], [255, 255, 255], 0.04, 0.2); const age = t - hit;
    const dr = eo(seg(age, 0.1, 0.8)), rot = -0.06 * dr + Math.sin(t * 1.5) * 0.01;
    c.save(); c.translate(410, lerp(-300, 320, dr)); c.rotate(rot); const cw = 420, ch = 330;
    c.shadowColor = 'rgba(0,0,0,0.5)'; c.shadowBlur = 30; c.shadowOffsetY = 12; c.fillStyle = '#f7f1e6'; rrect(c, -cw / 2 - 18, -ch / 2 - 18, cw + 36, ch + 84, 10); c.fill(); c.shadowColor = 'transparent'; c.shadowBlur = 0; c.shadowOffsetY = 0;
    c.save(); c.beginPath(); c.rect(-cw / 2, -ch / 2, cw, ch); c.clip(); c.translate(0, 0); c.scale(cw / W, cw / W); c.translate(-W / 2, -H / 2); drawPlaza(hit); c.restore();
    txt(c, 'gece bizimle ♪', 0, ch / 2 + 38, 30, { font: FONT, style: 'italic', col: '#3a2c5a', align: 'center' }); c.restore();
    const ta = sm(seg(age, 0.9, 1.5));
    c.save(); c.translate(900, 0); c.rotate(-0.03); txt(c, 'GECE', 0, 260, 92, { font: SANS, weight: 900, col: cs(P.yellow), align: 'center', sp: 6, a: ta, shadow: cs(P.pink), sb: 22 }); txt(c, 'BİZİMLE', 0, 352, 92, { font: SANS, weight: 900, col: cs(P.cyan), align: 'center', sp: 6, a: ta, shadow: cs(P.violet), sb: 22 }); c.restore();
    const fl = 1 - seg(age, 0, 0.3); if (fl > 0) tint(c, [255, 255, 255], fl);
  }
  vignette(c, 0.3);
}
