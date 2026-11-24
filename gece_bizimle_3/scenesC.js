'use strict';
const city = (c, t, sc, o = {}) => {
  sky(c, t, [3, 5, 16], [44, 20, 80], 520); G(c, 640, 520, 700, MAG, 0.28); G(c, 300, 480, 500, TEAL, 0.14);
  layer(c, t, { seed: 1, base: 560, hmin: 120, hmax: 300, wmin: 40, wmax: 90, scroll: sc * 0.3, col: [14, 12, 36], lp: 0.18, wa: 0.55 });
  layer(c, t, { seed: 2, base: 640, hmin: 180, hmax: 420, wmin: 60, wmax: 120, scroll: sc * 0.6, col: [8, 8, 24], lp: 0.26, edge: [60, 120, 200], neon: 0.8 });
  layer(c, t, { seed: 3, base: 760, hmin: 260, hmax: 520, wmin: 90, wmax: 180, scroll: sc, col: [4, 5, 14], lp: 0.3, edge: [255, 60, 170], neon: 1, wa: 0.95 });
};
// ===== 1: Sessizlik Yasası — şehir (0 - 10) =====
function sceneAerial(c, t) {
  c.save(); cam(c, 640, 360 + 20 * (1 - sm(t / 10)), 1 + 0.12 * sm(t / 10), 0);
  city(c, t, t * 14);
  for (let i = 0; i < 12; i++) { const y = 150 + hsh(i, 1) * 260, x = (((hsh(i, 2) * 1400 + t * (40 + hsh(i, 3) * 80) * (i % 2 ? 1 : -1)) % 1500) + 1500) % 1500 - 100; c.fillStyle = rgba(i % 3 ? ORG : TEAL, 0.9); c.fillRect(x, y, 10, 2); G(c, x, y, 20, i % 3 ? ORG : TEAL, 0.5); }
  for (let i = 0; i < 4; i++) drone(c, 200 + i * 300 + Math.sin(t * 0.6 + i) * 60, 150 + Math.sin(t * 0.9 + i * 2) * 30 + i % 2 * 40, 0.8, t, { beam: Math.sin(t * 0.5 + i) });
  rainFx(c, t, 200, 0.25); c.restore(); vignette(c, 0.5);
}
// ===== 1b: Sokak (10 - 20) =====
function sceneAlley(c, t) {
  const lt = t - 10, z = 1 + 0.9 * sm(seg(lt, 0, 5)) - 0.9 * sm(seg(lt, 7, 8)) * 0.8, sh = lt > 7 ? 3 * Math.sin(t * 60) : 0;
  c.save(); cam(c, lerp(640, 560, sm(seg(lt, 0, 5)) * (1 - sm(seg(lt, 7, 8)))) + sh, lerp(400, 480, sm(seg(lt, 0, 5)) * (1 - sm(seg(lt, 7, 8)))), z, 0);
  c.fillStyle = vgrad(c, 0, H, [[0, [10, 12, 26]], [1, [4, 4, 12]]]); c.fillRect(-400, -300, W + 800, H + 600);
  c.fillStyle = '#0a0c1a'; for (let y = 0; y < 560; y += 38) for (let x = -300; x < W + 300; x += 90) c.fillRect(x + (y / 38 % 2) * 45, y, 86, 34);
  for (const [x, col, s] of [[230, MAG, 'BAR'], [980, TEAL, '24H']]) { G(c, x, 280, 280, col, 0.5); c.save(); c.translate(x, 280); c.rotate(-Math.PI / 2); txt(c, s, 0, 12, 60, { font: SANS, weight: 800, col: rgba(mix(col, [255, 255, 255], 0.7)), align: 'center', sp: 8, shadow: rgba(col), sb: 30, a: Math.sin(t * 17) > 0.95 ? 0.4 : 1 }); c.restore(); }
  c.fillStyle = vgrad(c, 560, H, [[0, [14, 16, 34]], [1, [6, 6, 16]]]); c.fillRect(-400, 560, W + 800, 400);
  c.save(); c.globalAlpha = 0.3; c.scale(1, -1); c.translate(0, -1120); G(c, 230, 380, 250, MAG, 0.5); G(c, 980, 380, 250, TEAL, 0.5); c.restore();
  for (let i = 0; i < 7; i++) { const p = ((t * 0.3 + i / 7) % 1); c.fillStyle = `rgba(190,210,255,${0.16 * (1 - p)})`; c.beginPath(); c.arc(820 + Math.sin(i * 3 + t) * 30, 560 - p * 300, 22 + p * 50, 0, TAU); c.fill(); }
  const out = {}, hd = sm(seg(lt, 7, 7.6)), ph = lt > 7 ? t * (8 + 40 * sm(seg(lt, 7, 9))) : 0, bx = lt > 9.4 ? 640 + (lt - 9.4) * (lt - 9.4) * 700 : 640;
  bike(c, bx, 610, 1.7, t, { ph, head: hd, lean: lt > 9.4 ? -0.08 : 0, out });
  if (lt < 5.5 && out.hx) { const sx = (t * 0), hx = 640 + 170 * 0 + 0; const k = sm(seg(lt, 2, 4)); const dx = 640 + 112 + 40, dy = 610 - 150 - 40 * k; c.fillStyle = rgba([220, 255, 255], 0.95); c.fillRect(dx, dy, 22, 10); G(c, dx + 11, dy + 5, 90, TEAL, 0.9); }
  rainFx(c, t, 300, 0.3); c.restore();
  const fl = seg(lt, 7, 7.15); if (fl > 0 && fl < 1) tint(c, [255, 240, 220], 0.3 * (1 - fl), 'lighter');
  vignette(c, 0.55);
}
// ===== 2: Kovalamaca (20 - 44) =====
function sceneChase(c, t) {
  const lt = t - 20, spd = lt < 19 ? 60 : lerp(60, 8, sm(seg(t, 38.6, 41)));
  let D = 0; for (let u = 20; u < t; u += 0.05) D += (u < 38.6 ? 60 : lerp(60, 8, sm(seg(u, 38.6, 41)))) * 0.05;
  const bend = Math.sin(t * 0.35) * 40, sway = Math.sin(t * 0.9) * 1.6, sh = 2 * Math.sin(t * 50) * KK;
  c.save(); cam(c, 640 + sh, 360, 1 + 0.015 * pulse(t), 0);
  const P = road3d(c, t, { dist: D, bend, camX: sway, cars: 8 });
  const dc = t < 26 ? 0 : t < 32 ? 2 : t < 38 ? 4 : 6;
  for (let i = 0; i < dc; i++) { const z = 30 + 14 * i + Math.sin(t * 0.8 + i) * 6, p = P((i % 2 ? 1 : -1) * (3 + (i >> 1) * 2), 9 + (i % 3) * 2, z); drone(c, p[0], p[1], Math.min(1.1, 38 / z), t, { beam: (i % 2 ? 1 : -1) * 0.8 }); }
  bikeBack(c, 640 + sway * 22, 640, 1.9, t, sway * 0.03);
  for (let i = 0; i < 20; i++) { const r = rng(i + 4); const x = r() * W, y = 200 + r() * 460, l = 60 + r() * 140; c.fillStyle = `rgba(160,220,255,${0.1 * (spd / 60)})`; c.fillRect(x, y, 1.5, l * 0.3); }
  c.restore(); hud(c, t, { up: UP(t), lines: ['SESSİZLİK YASASI // AKTİF', 'TAKİP: 0' + dc + ' SUSTURUCU', 'HIZ ' + Math.floor(spd * 3.2) + ' KM/S'] });
  const fl = seg(t, 43.4, 44); if (fl > 0) tint(c, [255, 255, 255], fl); vignette(c, 0.5);
}
// ===== 3a: Raylar (44 - 52) =====
function sceneRail(c, t) {
  const lt = t - 44, sc = t * 420, sh = 3 * Math.sin(t * 70) * pulse(t);
  c.save(); cam(c, 640 + sh, 380, 1 + 0.03 * pulse(t), -0.02 + 0.02 * Math.sin(t));
  city(c, t, sc * 0.5);
  c.fillStyle = '#04050c'; c.fillRect(-300, 600, W + 600, 300); c.fillStyle = rgba(TEAL, 0.9); c.fillRect(-300, 598, W + 600, 3); G(c, 640, 600, 600, TEAL, 0.15);
  for (let x = -100; x < W + 200; x += 120) { c.fillStyle = '#0a0c1a'; c.fillRect(((x - sc * 0.8) % 1440 + 1440) % 1440 - 140, 600, 14, 120); }
  for (let i = 0; i < 18; i++) { const r = rng(i + 20), x = (((r() * W - sc * (0.6 + r())) % W) + W) % W; c.fillStyle = `rgba(190,230,255,${0.14 + 0.12 * r()})`; c.fillRect(x, 150 + r() * 440, 120 + r() * 220, 1.5); }
  const dx = 120 + Math.sin(t * 2) * 30; drone(c, dx, 250, 1.1, t, { beam: 0.6 }); drone(c, dx + 120, 180 + Math.sin(t * 3) * 20, 0.9, t, { beam: 0.5 });
  for (let k = 0; k < 4; k++) { const p = ((t * 2.2 + k * 0.25) % 1); c.strokeStyle = rgba(RED, 0.95 * (1 - p)); c.lineWidth = 4; c.beginPath(); c.moveTo(dx + p * 700, 260 + p * 340); c.lineTo(dx + p * 700 + 60, 260 + p * 340 + 22); c.stroke(); }
  bike(c, 700, 600, 1.7, t, { ph: t * 40, lean: -0.05 });
  for (let i = 0; i < 12; i++) { const p = ((t * 3 + i * 0.13) % 1); c.fillStyle = rgba(ORG, 1 - p); c.fillRect(640 - 60 - p * 200, 600 - Math.sin(p * 3) * 20 - i % 3 * 4, 3, 2); }
  rainFx(c, t, 220, 0.25, 0.4); c.restore();
  hud(c, t, { up: UP(t), lines: ['KANAL 03 // GECE BİZİMLE', 'MAG-RAY HATTI 7', 'SİNYAL: ZAYIF'] }); vignette(c, 0.5);
}
// ===== 3b: Harita (52 - 60.5) =====
function sceneMap(c, t) {
  const lt = t - 52, cx = 640, cy = 360;
  c.save(); c.fillStyle = '#04060f'; c.fillRect(0, 0, W, H); cam(c, cx, cy, 1.1 - 0.06 * sm(lt / 8.5), lt * 0.02);
  c.strokeStyle = rgba(TEAL, 0.14); c.lineWidth = 1; for (let i = -20; i < 40; i++) { c.beginPath(); c.moveTo(i * 60, -200); c.lineTo(i * 60, 900); c.moveTo(-200, i * 60); c.lineTo(1500, i * 60); c.stroke(); }
  for (let i = 0; i < 90; i++) { const r = rng(i + 1), x = Math.floor(r() * 22) * 60 - 20, y = Math.floor(r() * 14) * 60 - 20, w = (1 + Math.floor(r() * 2)) * 60 - 8, h = (1 + Math.floor(r() * 2)) * 60 - 8, d = Math.hypot(x - 640, y - 360); c.fillStyle = rgba(NC[i % 5], 0.06 + 0.5 * Math.max(0, pulse(t - d / 400) * (d < lt * 200 ? 1 : 0))); c.fillRect(x, y, w, h); c.strokeStyle = rgba(NC[i % 5], 0.35); c.strokeRect(x, y, w, h); }
  for (let k = Math.floor(bph(t)) - 3; k <= Math.floor(bph(t)); k++) { const age = t - (B0 + k * PER); if (age < 0 || age > 2) continue; c.strokeStyle = rgba(MAG, 0.8 * (1 - age / 2)); c.lineWidth = 3; c.beginPath(); c.arc(cx, cy, age * 420, 0, TAU); c.stroke(); }
  const p = lt / 8.5, ang = -0.6 + p * 3.4, bxp = cx + Math.cos(ang) * 420 * (1 - p * 0.95), byp = cy + Math.sin(ang) * 260 * (1 - p * 0.95);
  c.strokeStyle = rgba(TEAL, 0.9); c.lineWidth = 3; c.beginPath(); for (let u = 0; u <= p; u += 0.01) { const a2 = -0.6 + u * 3.4; const x = cx + Math.cos(a2) * 420 * (1 - u * 0.95), y = cy + Math.sin(a2) * 260 * (1 - u * 0.95); u ? c.lineTo(x, y) : c.moveTo(x, y); } c.stroke();
  G(c, bxp, byp, 60, TEAL, 0.9); c.fillStyle = '#fff'; c.beginPath(); c.arc(bxp, byp, 5, 0, TAU); c.fill();
  for (let i = 0; i < 5; i++) { const a = t * 0.5 + i * 1.25, d = 380 - lt * 22 + i * 30, x = bxp + Math.cos(a) * d, y = byp + Math.sin(a) * d * 0.7; c.fillStyle = rgba(RED, 0.95); c.beginPath(); c.moveTo(x, y - 9); c.lineTo(x + 8, y + 7); c.lineTo(x - 8, y + 7); c.fill(); G(c, x, y, 26, RED, 0.6); }
  c.strokeStyle = rgba(ORG, 0.95); c.lineWidth = 2; c.beginPath(); c.arc(cx, cy, 24 + 6 * pulse(t), 0, TAU); c.stroke(); txt(c, 'VERİCİ KULESİ', cx + 34, cy - 24, 13, { font: MONO, col: rgba(ORG), sp: 2 });
  const sw = (t * 0.6) % 1; c.fillStyle = rgba(TEAL, 0.08); c.fillRect(0, sw * H, W, 40);
  c.restore(); hud(c, t, { up: UP(t), lines: ['HEDEF: VERİCİ KULESİ', 'MESAFE ' + Math.max(0, Math.floor(4200 - lt * 480)) + ' M', 'SUSTURUCU: 05'] }); vignette(c, 0.4);
}
// ===== 4: Cam duvar (60.5 - 70.5) =====
function sceneGlass(c, t) {
  const lt = t - 60.5, tb = 3.6, slow = lt < tb - 1 ? 1 : 0.28, tl = lt < tb - 1 ? lt : (tb - 1) + (lt - (tb - 1)) * slow, age = Math.max(0, (lt - tb) * 0.35);
  c.save(); cam(c, lerp(500, 780, sm(seg(lt, 0, 10))), 380, 1.05 + 0.08 * sm(seg(lt, 3, 7)), 0);
  c.fillStyle = vgrad(c, 0, H, [[0, [30, 10, 60]], [1, [255, 70, 140]]]); c.fillRect(-300, -300, W + 600, H + 600); G(c, 900, 380, 700, ORG, 0.5); G(c, 900, 380, 300, [255, 240, 200], 0.6);
  for (let i = 0; i < 40; i++) { const r = rng(i + 6); c.fillStyle = rgba(TEAL, 0.5 * r()); c.fillRect(900 + (r() - 0.5) * 800, 120 + r() * 500, 2, 2); }
  c.fillStyle = vgrad(c, 560, H, [[0, [20, 10, 40]], [1, [6, 4, 14]]]); c.fillRect(-300, 560, W + 600, 300);
  const R = age * 520, ix = 880, iy = 430;
  for (let gx = 0; gx < 7; gx++) for (let gy = 0; gy < 6; gy++) { const x = 740 + gx * 70, y = 130 + gy * 78, d = Math.hypot(x + 35 - ix, y + 39 - iy); if (d < R) continue; c.fillStyle = 'rgba(120,220,255,0.16)'; c.fillRect(x, y, 68, 76); c.strokeStyle = 'rgba(180,240,255,0.7)'; c.lineWidth = 2; c.strokeRect(x, y, 68, 76); c.fillStyle = 'rgba(255,255,255,0.1)'; c.beginPath(); c.moveTo(x, y); c.lineTo(x + 26, y); c.lineTo(x, y + 50); c.fill(); }
  const bxp = lerp(-200, 1500, sm(seg(lt, 0.4, 8.2)) * 0.8 + seg(lt, 0.4, 8.2) * 0.2);
  bike(c, bxp, 560 - Math.sin(clamp((bxp + 200) / 1300) * Math.PI) * 40, 1.6, t, { ph: t * 30, head: 0.9, lean: -0.1 });
  if (age > 0) { const rr = rng(88); for (let i = 0; i < 160; i++) { const a = (rr() - 0.5) * 3.2, v = 220 + rr() * 700, a0 = Math.atan2(rr() - 0.5, 1), sx = ix + Math.cos(a) * v * age * (0.4 + rr()) * 1.2, sy = iy + Math.sin(a) * v * age * 0.8 + 340 * age * age * (0.4 + rr()), rot = rr() * 6 + age * (rr() - 0.5) * 18, s = 8 + rr() * 20; c.save(); c.translate(sx, sy); c.rotate(rot); c.globalAlpha = clamp(1.6 - age * 0.9); c.fillStyle = rgba(rr() > 0.6 ? [255, 230, 255] : [140, 230, 255], 0.75); c.beginPath(); c.moveTo(0, -s); c.lineTo(s * 0.5, s * 0.6); c.lineTo(-s * 0.4, s * 0.4); c.fill(); c.strokeStyle = 'rgba(255,255,255,0.9)'; c.lineWidth = 1; c.stroke(); c.restore(); } G(c, ix, iy, 300 * Math.exp(-age * 3), [255, 255, 255], 0.8 * Math.exp(-age * 3)); }
  rainFx(c, t, 140, 0.22); c.restore(); hud(c, t, { up: UP(t), lines: ['KANAL 04 // CAM CEPHE', 'ÇARPMA SÜRESİ -00:0' + Math.max(0, Math.ceil(tb - lt)), 'ZAMAN: YAVAŞ ÇEKİM'] });
  const fl = lt > tb ? 1 - seg(lt, tb, tb + 0.25) : 0; if (fl > 0) tint(c, [255, 255, 255], fl * 0.7); vignette(c, 0.5);
}
// ===== 5: Pencereler = ekolayzır (70.5 - 81.5) =====
function sceneWindows(c, t) {
  const lt = t - 70.5, up = sm(lt / 11) * 160, cols = 16, rows = 12;
  c.save(); cam(c, 640, 360 - up, 1 + 0.02 * pulse(t), 0);
  c.fillStyle = '#03040a'; c.fillRect(-300, -800, W + 600, 2200);
  for (let cx = 0; cx < cols; cx++) for (let ry = 0; ry < rows * 2; ry++) {
    const x = 60 + cx * 72, y = 620 - ry * 56, lvl = clamp((BS * (1 - cx / cols) + HI * (cx / cols) * 1.3 + EN * 0.35) * (0.5 + 0.5 * Math.sin(t * 6 + cx * 1.7)) * 1.2 + 0.08), on = ry / (rows * 2) < lvl, col = NC[cx % 5];
    c.fillStyle = on ? rgba(col, 0.92) : 'rgba(30,34,60,0.7)'; rrect(c, x, y, 56, 40, 4); c.fill(); if (on) G(c, x + 28, y + 20, 56, col, 0.25);
    if (on && hsh(cx, ry, 9) > 0.93) { c.strokeStyle = '#04050c'; c.lineWidth = 3; c.lineCap = 'round'; const b = Math.abs(Math.sin(bph(t) * Math.PI + cx)) * 5; c.beginPath(); c.moveTo(x + 28, y + 36); c.lineTo(x + 28, y + 18 - b); c.moveTo(x + 18, y + 24 - b); c.lineTo(x + 38, y + 24 - b); c.moveTo(x + 28, y + 18 - b); c.lineTo(x + 28, y + 12 - b); c.stroke(); }
  }
  for (let i = 0; i < 6; i++) { const x = 80 + i * 220; c.fillStyle = rgba(NC[i % 5], 0.9); c.fillRect(x, -800, 3, 2200); }
  c.restore(); hud(c, t, { up: UP(t), lines: ['KANAL 05 // HALK UYANIYOR', 'AKTİF PENCERE: ' + Math.floor(1200 + EN * 6000), 'YASAK İHLALİ: ÇOK'] }); vignette(c, 0.45);
}
// ===== 6: Karartma (81.5 - 89.7) =====
function sceneBlackout(c, t) {
  const lt = t - 81.5, press = seg(lt, 8.0, 8.2);
  c.save(); cam(c, 640, 400, 1 + 0.2 * eo(lt / 8), 0);
  c.fillStyle = '#020308'; c.fillRect(-300, -300, W + 600, H + 600);
  const cone = c.createLinearGradient(0, 0, 0, 700); cone.addColorStop(0, 'rgba(255,60,80,0.35)'); cone.addColorStop(1, 'rgba(255,60,80,0.04)'); c.save(); c.globalCompositeOperation = 'lighter'; c.fillStyle = cone; c.beginPath(); c.moveTo(600, 0); c.lineTo(680, 0); c.lineTo(980, 700); c.lineTo(300, 700); c.fill(); c.restore();
  c.fillStyle = '#0a0c18'; c.fillRect(-300, 640, W + 600, 300); c.fillStyle = rgba(TEAL, 0.6); c.fillRect(-300, 640, W + 600, 2);
  c.fillStyle = '#0c0e1c'; c.beginPath(); c.moveTo(380, 640); c.lineTo(420, 540); c.lineTo(860, 540); c.lineTo(900, 640); c.fill(); c.strokeStyle = rgba(TEAL, 0.8); c.lineWidth = 2; c.stroke();
  c.fillStyle = '#04050c'; rrect(c, 590, 520, 100, 24, 6); c.fill(); c.strokeStyle = rgba(MAG, 0.5 + 0.5 * Math.abs(Math.sin(lt * 5))); c.lineWidth = 2; c.stroke(); G(c, 640, 532, 110, MAG, 0.5);
  const dy = 380 + 120 * sm(seg(lt, 6.4, 8.0)); c.fillStyle = rgba([220, 255, 255], 0.95); c.fillRect(620, dy, 40, 16); G(c, 640, dy + 8, 140, TEAL, 0.8);
  c.strokeStyle = '#05060c'; c.lineWidth = 14; c.lineCap = 'round'; c.beginPath(); c.moveTo(780, 700); c.lineTo(690, 470); c.lineTo(650, dy + 8); c.stroke(); c.strokeStyle = rgba(MAG, 0.7); c.lineWidth = 2; c.stroke();
  for (let i = 0; i < 3; i++) { const dx = 280 + i * 360 + Math.sin(t + i) * 20, dyy = 160 + Math.sin(t * 1.3 + i) * 14; drone(c, dx, dyy, 1.0, t, { beam: 0 }); c.strokeStyle = rgba(RED, 0.85); c.lineWidth = 1.5; c.beginPath(); c.moveTo(dx, dyy + 6); c.lineTo(640, 520); c.stroke(); c.fillStyle = rgba(RED, 0.9); c.beginPath(); c.arc(640 + (i - 1) * 8, 520, 3, 0, TAU); c.fill(); }
  c.restore();
  const ta = sm(seg(lt, 1.4, 2.2)) * (1 - sm(seg(lt, 6.0, 6.8))); c.save(); c.translate(Math.sin(t * 40) * 3 * (ta > 0 && Math.sin(t * 9) > 0.8 ? 1 : 0), 0);
  txt(c, 'Hazır mısın?', 640, 220, 84, { font: SANS, weight: 800, col: rgba(RED), align: 'center', a: ta * 0.95, shadow: rgba(RED), sb: 30, sp: 2 }); txt(c, 'Hazır mısın?', 646, 222, 84, { font: SANS, weight: 800, col: rgba(TEAL, 0.5), align: 'center', a: ta * 0.6, sp: 2 }); c.restore();
  hud(c, t, { up: UP(t), lines: ['TÜM ŞEBEKE KAPALI', 'SUSTURUCU: HEDEF KİLİTLİ', 'YÜKLEME 99% — BEKLİYOR'] });
  if (press > 0) tint(c, [255, 255, 255], press); vignette(c, 0.6);
}
// ===== 7a: Drop — kule (89.7 - 99.1) =====
function sceneDropTower(c, t) {
  const lt = t - 89.7, sh = 6 * pulse(t) * Math.sin(t * 90);
  c.save(); cam(c, 640 + sh, 400, 1 + 0.06 * pulse(t), 0.04 * Math.sin(lt * 0.8));
  sky(c, t, [8, 2, 28], [90, 20, 110], 460); const hue = (t * 40) % 360;
  c.save(); c.translate(640, 330); c.rotate(t * 0.3); for (let i = 0; i < 28; i++) { c.fillStyle = rgba(NC[i % 5], 0.12 + 0.1 * pulse(t)); c.beginPath(); c.moveTo(0, 0); c.arc(0, 0, 1600, i / 28 * TAU, (i + 0.5) / 28 * TAU); c.fill(); } c.restore();
  city(c, t, t * 18); c.save(); c.translate(0, 30); layer(c, t, { seed: 9, base: 740, hmin: 300, hmax: 600, wmin: 80, wmax: 150, scroll: t * 24, col: [3, 4, 12], lp: 0.5, edge: TEAL, neon: 1 }); c.restore();
  c.fillStyle = '#04050c'; c.beginPath(); c.moveTo(600, 760); c.lineTo(626, 200); c.lineTo(654, 200); c.lineTo(680, 760); c.fill(); c.strokeStyle = rgba(MAG, 0.95); c.lineWidth = 3; c.stroke(); G(c, 640, 200, 160, [255, 255, 255], 0.9); G(c, 640, 200, 420, MAG, 0.6);
  for (let k = Math.floor(bph(t)) - 3; k <= Math.floor(bph(t)); k++) { const age = t - (B0 + k * PER); if (age < 0 || age > 1.8) continue; c.save(); c.translate(640, 200); c.scale(1, 0.4); c.strokeStyle = rgba(NC[((k % 5) + 5) % 5], 0.95 * (1 - age / 1.8)); c.lineWidth = 16 * (1 - age / 1.8); c.beginPath(); c.arc(0, 0, age * 900, 0, TAU); c.stroke(); c.restore(); }
  for (let i = 0; i < 7; i++) { const a = t * 1.1 + i / 7 * TAU, x = 640 + Math.cos(a) * 340, y = 220 + Math.sin(a) * 90; drone(c, x, y, 0.8 + 0.3 * Math.sin(a), t, { col: NC[i % 5], beam: 0 }); }
  rainFx(c, t, 120, 0.2); c.restore(); hud(c, t, { up: 100, lines: ['YAYIN: CANLI', 'ŞEBEKE: ELE GEÇİRİLDİ', 'SUSTURUCU → DJ MODU'] });
  const fl = 1 - seg(lt, 0, 0.5); if (fl > 0) tint(c, [255, 255, 255], fl); vignette(c, 0.4);
}
// ===== 7b: Bulvar (99.1 - 112.5) =====
function sceneAvenue(c, t) {
  let D = 0; for (let u = 99.1; u < t; u += 0.05) D += 90 * 0.05; D += 500;
  const sh = 2.5 * Math.sin(t * 60) * KK, bend = Math.sin(t * 0.4) * 30, sway = Math.sin(t * 1.1) * 1.4;
  c.save(); cam(c, 640 + sh, 360, 1 + 0.02 * pulse(t), 0);
  const P = road3d(c, t, { dist: D, bend, camX: sway, arches: true, cars: 4, glowCol: VIO });
  for (let i = 0; i < 6; i++) { const z = 24 + i * 12, p = P((i % 2 ? 1 : -1) * (2 + (i >> 1) * 2.4), 6 + (i % 3) * 2, z); drone(c, p[0], p[1], Math.min(1.1, 40 / z), t, { col: NC[i % 5], beam: 0 }); }
  bikeBack(c, 640 + sway * 22, 640, 1.9, t, sway * 0.03);
  c.restore(); hud(c, t, { up: 100, lines: ['KANAL 07 // BULVAR', 'EKRAN: ' + Math.floor(100 + EN * 900) + ' / 1200', 'HERKES AYNI DİLDE'] });
  txt(c, 'ÇEVİR SESİ', 640, 190, 46, { font: SANS, weight: 800, col: rgba(NC[Math.floor(t * 2) % 5]), align: 'center', sp: 14, a: 0.5 + 0.5 * pulse(t), shadow: rgba(MAG), sb: 24 }); vignette(c, 0.4);
}
// ===== 8: Yukarı El — yukarıdan şehir (112.5 - 128.3) =====
function sceneOrbit(c, t) {
  const lt = t - 112.5, cx = 640, cy = 380;
  c.save(); c.fillStyle = '#030410'; c.fillRect(0, 0, W, H); cam(c, cx, cy, 0.9 + 0.5 * sm(seg(lt, 0, 3)) - 0.45 * sm(seg(lt, 3, 15.8)) + 0.02 * pulse(t), lt * 0.03);
  const dawn = sm(seg(lt, 8, 15.8)); G(c, cx, cy + 700, 1400, ORG, 0.35 * dawn);
  for (let ring = 1; ring < 9; ring++) { c.strokeStyle = rgba(TEAL, 0.1); c.lineWidth = 1; c.beginPath(); c.arc(cx, cy, ring * 80, 0, TAU); c.stroke(); }
  for (let i = 0; i < 64; i++) { const a = i / 64 * TAU + hsh(i, 1) * 0.05, len = 140 + hsh(i, 2) * 560; c.strokeStyle = rgba(NC[i % 5], 0.22); c.lineWidth = 2; c.beginPath(); c.moveTo(cx + Math.cos(a) * 40, cy + Math.sin(a) * 40); c.lineTo(cx + Math.cos(a) * len, cy + Math.sin(a) * len); c.stroke();
    const p = ((t * 0.5 + hsh(i, 3)) % 1), d = 40 + p * (len - 40); G(c, cx + Math.cos(a) * d, cy + Math.sin(a) * d, 16, NC[i % 5], 0.9); }
  for (let k = Math.floor(bph(t)) - 4; k <= Math.floor(bph(t)); k++) { const age = t - (B0 + k * PER); if (age < 0 || age > 2.6) continue; c.strokeStyle = rgba(NC[((k % 5) + 5) % 5], 0.9 * (1 - age / 2.6)); c.lineWidth = 14 * (1 - age / 2.6); c.beginPath(); c.arc(cx, cy, age * 380, 0, TAU); c.stroke(); }
  G(c, cx, cy, 160 + 60 * pulse(t), [255, 255, 255], 0.9);
  for (let i = 0; i < 80; i++) { const r = rng(i + 50), x = r() * W * 1.4 - 200, y = r() * H * 1.4 - 200, up2 = ((t * (14 + r() * 24) + r() * 500) % 500); c.fillStyle = rgba(NC[i % 5], 0.6 * (1 - up2 / 500)); c.fillRect(x, y - up2, 2, 8); }
  c.restore(); hud(c, t, { up: 100, lines: ['YAYIN: CANLI', 'DİNLEYİCİ: ' + (Math.floor(lt * 810000 + EN * 90000)).toLocaleString('tr-TR'), 'KANAL 08 // YUKARI EL'] }); vignette(c, 0.4);
}
// ===== 9: Gece devam (128.3 - 140) =====
function sceneDawn(c, t) {
  const lt = t - 128.3, d = sm(seg(lt, 0.5, 9)), hit = 137.55, gl = t > hit ? (Math.sin(t * 70) > 0 ? 1 : 0) * clamp(1 - (t - hit) * 4) : 0;
  c.save(); cam(c, 640 + (gl ? 6 * Math.sin(t * 120) : 0), 380, 1.08 - 0.06 * sm(lt / 9), 0);
  sky(c, t, mix([4, 5, 18], [40, 60, 120], d), mix([60, 20, 100], [255, 150, 70], d), 520); G(c, 760, 560, 700, ORG, 0.5 * d); G(c, 760, 560, 230, [255, 230, 170], 0.7 * d);
  city(c, t, 0); c.fillStyle = 'rgba(255,170,90,' + 0.12 * d + ')'; c.fillRect(0, 0, W, H);
  c.fillStyle = '#05060e'; c.fillRect(-300, 640, W + 600, 300); c.fillStyle = rgba(TEAL, 0.5); c.fillRect(-300, 640, W + 600, 2);
  bike(c, 470, 640, 1.8, t, { lean: 0 }); drone(c, 760 + Math.sin(t * 1.3) * 12, 470 + Math.sin(t * 2) * 8, 1.0, t, { col: lt > 5 ? TEAL : RED });
  c.restore(); hud(c, t, { up: 100, lines: ['SESSİZLİK YASASI // KALDIRILDI', 'GECE DEVAM…'] });
  if (gl) tint(c, [255, 255, 255], 0.5 * gl); vignette(c, 0.45);
  const bl = sm(seg(t, hit, hit + 0.6)); if (bl > 0) { c.fillStyle = `rgba(2,3,8,${bl})`; c.fillRect(0, 0, W, H); }
  const ea = sm(seg(t, hit + 0.7, hit + 1.4)), j = Math.sin(t * 30) > 0.97 ? 5 : 0;
  txt(c, 'GECE BİZİMLE', 640 + j, 330, 92, { font: SANS, weight: 800, col: '#fff', align: 'center', sp: 14, a: ea }); txt(c, 'GECE BİZİMLE', 640 - 3, 330, 92, { font: SANS, weight: 800, col: rgba(MAG, 0.55), align: 'center', sp: 14, a: ea * 0.8 }); txt(c, 'GECE BİZİMLE', 640 + 3, 330, 92, { font: SANS, weight: 800, col: rgba(TEAL, 0.55), align: 'center', sp: 14, a: ea * 0.8 });
  c.fillStyle = rgba(TEAL, 0.9 * ea); c.fillRect(440, 352, 400 * ea, 2);
}
