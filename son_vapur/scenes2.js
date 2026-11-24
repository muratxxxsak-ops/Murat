'use strict';
// =============== BÖLÜM 2: İki Kıyı (52.5 - 77) ===============
function sceneShores(c, t) {
  const lt = t - 52.5, hy = 430;
  c.save(); cam(c, 640, 400, 1 + lt * 0.004, 0);
  c.fillStyle = vgrad(c, 0, hy, [[0, PAL.night.top], [0.6, PAL.night.mid], [1, [54, 66, 120]]]); c.fillRect(-200, -200, W + 400, hy + 200);
  stars(c, t, 0.9, hy);
  const mx = 640, my = 215;
  moon(c, mx, my, 64, 1);
  clouds(c, t, 150, [120, 140, 200], 0.16, 61, 3, 5, 1.4); clouds(c, t, 300, [90, 100, 170], 0.14, 62, 5, 5, 1.1);
  // shooting star
  const ss = seg(t, 66.2, 67.1);
  if (ss > 0 && ss < 1) { const sx = lerp(980, 520, ss), sy = lerp(60, 250, ss); const g = c.createLinearGradient(sx, sy, sx + 160, sy - 76); g.addColorStop(0, 'rgba(255,255,255,0.95)'); g.addColorStop(1, 'rgba(255,255,255,0)'); c.strokeStyle = g; c.lineWidth = 2.5; c.beginPath(); c.moveTo(sx, sy); c.lineTo(sx + 160, sy - 76); c.stroke(); glow(c, sx, sy, 14, [255, 255, 255], 0.9, 'lighter'); }
  skyline(c, -60, hy + 2, 520, 71, 6, 36, [10, 14, 34], { lights: { p: 0.6, col: [255, 214, 130], a: 0.95 }, t });
  skyline(c, 820, hy + 2, 560, 72, 6, 36, [10, 14, 34], { lights: { p: 0.6, col: [255, 214, 130], a: 0.95 }, t });
  galata(c, 330, hy + 2, 0.34, [8, 10, 28]);
  sea(c, hy, [34, 48, 96], [6, 9, 24], t, { wc: [190, 210, 255], wa: 1.2, refl: [mx, [200, 220, 255], 18, 0.7] });
  for (const lx of [60, 150, 240, 340, 880, 960, 1060, 1160]) { c.fillStyle = 'rgba(255,214,130,0.28)'; for (let j = 0; j < 7; j++) c.fillRect(lx + Math.sin(t * 2 + j + lx) * 3, hy + 6 + j * 7, 3, 4); }
  const fx = lerp(330, 940, ei(seg(t, 70.5, 76.8)) * 0.4 + seg(t, 70.5, 76.8) * 0.6);
  if (t > 70.2 && t < 77.5) ferry(c, fx, hy + 28, 0.3, 1, { lit: 1, dim: 0.3, t, wake: true });
  // sahiller
  const sh = (flip) => {
    c.save(); if (flip) { c.translate(W, 0); c.scale(-1, 1); }
    c.fillStyle = 'rgb(5,7,16)'; c.beginPath(); c.moveTo(-80, 760); c.lineTo(-80, 520); c.lineTo(60, 515); c.lineTo(170, 522); c.lineTo(300, 540); c.lineTo(380, 600); c.lineTo(430, 760); c.fill();
    c.fillStyle = 'rgba(120,150,230,0.35)'; c.fillRect(-80, 515, 250, 2); c.restore();
  };
  sh(false); sh(true);
  person(c, { x: 250, y: 533, s: 1.15, dir: 1, pose: 'stand', t, col: [5, 7, 16], rim: [170, 195, 255], kind: 'girl', wind: 0.55 });
  person(c, { x: 1030, y: 533, s: 1.15, dir: -1, pose: 'stand', t, col: [5, 7, 16], rim: [170, 195, 255], kind: 'boy', wind: 0.55 });
  c.restore();
  vignette(c, 0.55);
}
// =============== BÖLÜM 3: Gurur (77.2 - 112) ===============
function sceneWindow(c, t) {
  const lt = t - 77.2;
  c.save(); cam(c, 640 + Math.sin(t * 1.7) * 1.5, 360 + Math.cos(t * 1.3) * 1.5, 1.03 + lt * 0.004, 0);
  c.fillStyle = vgrad(c, 0, H, [[0, [18, 24, 58]], [0.6, [72, 52, 100]], [1, [160, 96, 104]]]); c.fillRect(-100, -100, W + 200, H + 200);
  bokeh(c, t, 5, 28, [[255, 170, 90], [255, 110, 150], [110, 200, 255], [255, 230, 160]], 18, 74, 120, 620, 0.6, 4);
  const f = FOG.getContext('2d'); f.globalCompositeOperation = 'source-over'; f.clearRect(0, 0, W, H);
  const fa = sm(seg(lt, 0, 1.0));
  f.fillStyle = `rgba(198,214,234,${0.58 * fa})`; f.fillRect(0, 0, W, H);
  const gg = f.createLinearGradient(0, 0, 0, H); gg.addColorStop(0, 'rgba(255,255,255,0)'); gg.addColorStop(1, 'rgba(255,255,255,0.2)'); f.fillStyle = gg; f.fillRect(0, 0, W, H);
  f.globalCompositeOperation = 'destination-out'; f.lineCap = 'round'; f.lineJoin = 'round';
  const r = rng(55), drops = [];
  for (let i = 0; i < 14; i++) { const x = 80 + r() * 1120, y0 = r() * 500, v = 18 + r() * 30, y = y0 + lt * v; f.lineWidth = 5; f.beginPath(); f.moveTo(x + Math.sin(i) * 3, Math.max(0, y - 70)); f.lineTo(x + Math.sin(i) * 6, y); f.stroke(); drops.push([x + Math.sin(i) * 6, y]); }
  const scrib = u => [330 + u * 560 + Math.cos(u * 22) * 18, 330 + Math.sin(u * 22) * 40 * (0.6 + 0.4 * Math.sin(u * 6 + 1)) + Math.sin(u * 3) * 30];
  const wp = sm(seg(lt, 1.4, 5.2));
  f.lineWidth = 15; f.beginPath(); for (let u = 0; u <= wp; u += 0.004) { const p = scrib(u); u === 0 ? f.moveTo(p[0], p[1]) : f.lineTo(p[0], p[1]); } f.stroke();
  const wpp = seg(lt, 6.2, 7.8); let head = scrib(wp);
  if (wpp > 0) {
    f.lineWidth = 120; f.beginPath();
    for (let u = 0; u <= wpp; u += 0.01) { const px = lerp(250, 1030, u), py = 360 + Math.sin(u * 9) * 120; u === 0 ? f.moveTo(px, py) : f.lineTo(px, py); } f.stroke();
    head = [lerp(250, 1030, wpp), 360 + Math.sin(wpp * 9) * 120];
  }
  c.drawImage(FOG, 0, 0);
  for (const [dx, dy] of drops) { if (dy < 0 || dy > H) continue; c.fillStyle = 'rgba(255,255,255,0.45)'; c.beginPath(); c.arc(dx, dy, 4, 0, TAU); c.fill(); c.fillStyle = 'rgba(255,255,255,0.8)'; c.fillRect(dx - 1.5, dy - 2, 2, 2); }
  const fa2 = sm(seg(lt, 0.9, 1.4)) * (1 - sm(seg(lt, 7.8, 8.2)));
  if (fa2 > 0.01) {
    c.save(); c.globalAlpha = fa2; const hx2 = head[0], hy2 = head[1];
    c.lineCap = 'round'; c.strokeStyle = 'rgb(48,34,42)'; c.lineWidth = 40; c.beginPath(); c.moveTo(hx2 + 230, hy2 + 330); c.lineTo(hx2 + 8, hy2 + 20); c.stroke();
    c.strokeStyle = 'rgba(255,190,150,0.5)'; c.lineWidth = 4; c.beginPath(); c.moveTo(hx2 + 220, hy2 + 322); c.lineTo(hx2 + 0, hy2 + 14); c.stroke();
    c.restore();
  }
  c.fillStyle = '#0b0a12'; c.fillRect(-100, -100, W + 200, 140); c.fillRect(-100, -100, 90, H + 200); c.fillRect(W - 10, -100, 120, H + 200);
  c.fillRect(-100, 640, W + 200, 200);
  c.fillStyle = 'rgba(255,160,100,0.18)'; c.fillRect(0, 630, W, 10);
  c.restore();
  vignette(c, 0.5);
}
function sceneSuitcase(c, t) {
  const lt = t - 85.2, slam = lt - 3.0;
  const sh = slam > 0 ? Math.exp(-slam * 7) * 14 * Math.sin(slam * 50) : 0;
  c.save(); const k = sm(seg(lt, 4.0, 8));
  cam(c, lerp(640, 860, k) + sh, lerp(380, 340, k) + sh * 0.6, 1 + k * 0.28, 0);
  c.fillStyle = vgrad(c, 0, H, [[0, [70, 46, 58]], [1, [40, 26, 38]]]); c.fillRect(-300, -300, W + 600, H + 600);
  c.fillStyle = 'rgba(255,255,255,0.04)'; for (let x = -300; x < W + 300; x += 46) c.fillRect(x, -300, 18, H + 600);
  c.fillStyle = '#0e1030'; c.fillRect(80, 110, 230, 300); bokeh(c, t, 15, 10, [[255, 190, 120], [120, 180, 255]], 10, 30, 130, 400, 0.4, 3);
  c.strokeStyle = '#1b1220'; c.lineWidth = 14; c.strokeRect(80, 110, 230, 300); c.lineWidth = 8; c.beginPath(); c.moveTo(195, 110); c.lineTo(195, 410); c.moveTo(80, 260); c.lineTo(310, 260); c.stroke();
  const flick = lt > 3.1 && lt < 4.4 ? (Math.sin(lt * 60) > 0.2 ? 0.2 : 0.7) : 1;
  glow(c, 800, 410, 440, [255, 190, 110], 0.5 * flick);
  c.fillStyle = '#2c1c22'; c.fillRect(600, 470, 800, 400); c.fillStyle = 'rgba(255,190,130,0.25)'; c.fillRect(600, 470, 800, 3);
  c.fillStyle = 'rgba(0,0,0,0.3)'; c.fillRect(600, 473, 800, 24);
  c.fillStyle = '#e9c28a'; c.beginPath(); c.moveTo(770, 370); c.lineTo(830, 370); c.lineTo(850, 430); c.lineTo(750, 430); c.fill(); c.fillStyle = '#3a2418'; c.fillRect(796, 430, 8, 40); c.fillRect(780, 466, 40, 6);
  const dy = slam > 0 ? -Math.exp(-slam * 9) * 12 * Math.abs(Math.sin(slam * 30)) : 0;
  c.save(); c.translate(960, 330 + dy);
  c.shadowColor = 'rgba(0,0,0,0.5)'; c.shadowBlur = 20; c.shadowOffsetY = 10; c.fillStyle = '#6a4630'; c.fillRect(-110, -90, 220, 180); c.shadowColor = 'transparent'; c.shadowBlur = 0; c.shadowOffsetY = 0;
  c.fillStyle = '#e8dcc2'; c.fillRect(-96, -76, 192, 152);
  c.fillStyle = vgrad(c, -66, 66, [[0, [60, 70, 130]], [0.6, [236, 140, 100]], [1, [255, 200, 120]]]); c.fillRect(-82, -64, 164, 128);
  glow(c, 20, 20, 60, [255, 230, 170], 0.7);
  c.fillStyle = '#2a1a22'; c.fillRect(-82, 38, 164, 26);
  person(c, { x: -14, y: 40, s: 0.34, dir: 1, pose: 'stand', t: 0, col: [24, 14, 24], kind: 'girl', wind: 0.1 });
  person(c, { x: 14, y: 40, s: 0.36, dir: -1, pose: 'stand', t: 0, col: [24, 14, 24], kind: 'boy', wind: 0.1 });
  const pr = sm(seg(lt, 3.05, 4.4));
  if (pr > 0) {
    const rr = rng(77);
    for (let i = 0; i < 12; i++) {
      let a = i / 12 * TAU + rr() * 0.4, x = 4, y = -4; c.beginPath(); c.moveTo(x, y);
      const steps = 9, len = 18 + rr() * 8;
      for (let s2 = 0; s2 < steps * pr; s2++) { a += (rr() - 0.5) * 0.5; x += Math.cos(a) * len; y += Math.sin(a) * len; x = clamp(x, -96, 96); y = clamp(y, -76, 76); c.lineTo(x, y); }
      c.strokeStyle = 'rgba(0,0,0,0.5)'; c.lineWidth = 3; c.stroke();
      c.strokeStyle = 'rgba(255,255,255,0.9)'; c.lineWidth = 1.4; c.stroke();
    }
    glow(c, 4, -4, 50, [255, 255, 255], 0.5 * (1 - pr), 'lighter');
  }
  c.fillStyle = 'rgba(255,255,255,0.07)'; c.beginPath(); c.moveTo(-96, -76); c.lineTo(-10, -76); c.lineTo(-96, 30); c.fill();
  c.restore();
  // dev gölge: bavul hazırlayan kız
  const sa = 0.34 * (1 - sm(seg(lt, 2.6, 3.0)));
  if (sa > 0.01) { c.save(); c.globalAlpha = 1; person(c, { x: 420 + Math.sin(lt * 1.4) * 90, y: 800, s: 3.0, dir: Math.cos(lt * 1.4) > 0 ? 1 : -1, ph: lt * 3.4, t, col: [10, 6, 14], kind: 'girl', wind: 0.1, alpha: sa }); c.restore(); }
  // bavul
  const lidH = lerp(150, 12, eo(seg(lt, 2.3, 3.0)));
  c.fillStyle = '#2c1c1c'; c.fillRect(120, 540 - lidH, 390, lidH);
  const lump = sm(seg(lidH, 30, 70)); c.globalAlpha = lump;
  for (const [lx, lw, lh, lc] of [[140, 90, 36, [150, 70, 90]], [220, 100, 44, [70, 90, 150]], [310, 80, 30, [200, 170, 120]], [380, 110, 40, [120, 60, 70]]]) { c.fillStyle = rgba(lc); c.beginPath(); c.ellipse(lx + lw / 2, 542, lw / 2, lh, 0, Math.PI, 0); c.fill(); }
  c.globalAlpha = 1;
  c.fillStyle = '#5c3a30'; c.fillRect(120, 540, 390, 150); c.fillStyle = 'rgba(0,0,0,0.25)'; c.fillRect(120, 540, 390, 8);
  c.fillStyle = '#7a5040'; c.fillRect(150, 540, 14, 150); c.fillRect(466, 540, 14, 150);
  c.fillStyle = '#d4b070'; c.fillRect(300, 600, 30, 20);
  if (lt > 3.0) { c.fillStyle = '#5c3a30'; c.fillRect(120, 528, 390, 12); }
  for (let i = 0; i < 26; i++) { const rr = rng(i + 3); const px = 780 + rr() * 300 + Math.sin(t * 0.5 + i) * 14, py = 260 + ((rr() * 300 + t * 6 * (0.3 + rr())) % 300); c.fillStyle = `rgba(255,220,170,${0.25 * rr()})`; c.fillRect(px, py, 2, 2); }
  c.restore();
  vignette(c, 0.55);
}
function mug(c, x, y, s, steam, t) {
  c.save(); c.translate(x, y); c.scale(s, s);
  c.fillStyle = '#e8e2d6'; rrect(c, -16, -28, 32, 28, 5); c.fill();
  c.strokeStyle = '#e8e2d6'; c.lineWidth = 5; c.beginPath(); c.arc(18, -15, 8, -1.5, 1.5); c.stroke();
  c.fillStyle = '#1a0e08'; c.beginPath(); c.ellipse(0, -28, 14, 3.5, 0, 0, TAU); c.fill();
  if (steam > 0.02) { c.lineCap = 'round'; for (let i = 0; i < 3; i++) { c.strokeStyle = `rgba(255,255,255,${0.35 * steam})`; c.lineWidth = 3; c.beginPath(); for (let k = 0; k <= 10; k++) { const yy = -32 - k * 7, xx = Math.sin(k * 0.5 + t * 1.6 + i * 2) * (2 + k * 0.7) + (i - 1) * 6; k ? c.lineTo(xx, yy) : c.moveTo(xx, yy); } c.stroke(); } }
  c.restore();
}
function sceneCafe(c, t) {
  const lt = t - 93.2, k = sm(lt / 8);
  c.save(); cam(c, lerp(640, 570, k), lerp(380, 420, k), lerp(1, 1.22, k), 0);
  c.fillStyle = vgrad(c, 0, H, [[0, [14, 30, 38]], [1, [8, 16, 22]]]); c.fillRect(-300, -300, W + 600, H + 600);
  c.fillStyle = vgrad(c, 90, 470, [[0, [12, 14, 40]], [1, [44, 30, 70]]]); c.fillRect(120, 90, 1040, 380);
  bokeh(c, t, 21, 30, [[255, 90, 170], [90, 200, 255], [255, 170, 80], [160, 120, 255]], 14, 60, 120, 460, 0.55, 5);
  c.save(); c.beginPath(); c.rect(120, 90, 1040, 380); c.clip(); rain(c, t, 160, 0.1, [190, 210, 255], 0.2, 22, 500, 8); c.restore();
  c.strokeStyle = '#05080c'; c.lineWidth = 22; c.strokeRect(120, 90, 1040, 380); c.lineWidth = 12; c.beginPath(); c.moveTo(640, 90); c.lineTo(640, 470); c.stroke();
  const fl = (Math.sin(t * 17) > 0.92) ? 0.4 : 1;
  c.save(); c.translate(380, 290); c.scale(-1, 1); txt(c, 'KAHVE', 0, 0, 78, { font: SANS, weight: 800, col: 'rgba(255,230,245,0.95)', align: 'center', sp: 8, shadow: 'rgba(255,60,170,0.95)', sb: 28, a: fl }); c.restore();
  glow(c, 380, 270, 260, [255, 60, 170], 0.22 * fl, 'lighter');
  c.fillStyle = '#0a1318'; c.fillRect(-300, 470, W + 600, 400);
  glow(c, 640, 560, 460, [255, 190, 120], 0.38);
  c.fillStyle = '#1a1210'; c.fillRect(380, 548, 520, 12); c.fillRect(630, 560, 20, 180);
  c.fillStyle = 'rgba(255,200,140,0.35)'; c.fillRect(380, 548, 520, 2);
  for (const cx of [470, 810]) { c.fillStyle = '#0b0b10'; c.fillRect(cx - 54, 587, 120, 8); c.fillRect(cx - 50, 595, 5, 90); c.fillRect(cx + 56, 595, 5, 90); }
  c.fillStyle = '#0b0b10'; c.fillRect(398, 480, 8, 112); c.fillRect(870, 480, 8, 112);
  const ga = 0.3 * (1 - sm(seg(lt, 5, 7.4))) * (0.8 + 0.2 * Math.sin(t * 9));
  if (ga > 0.005) person(c, { x: 880 + HI * 2, y: 660, s: 1.45, dir: -1, pose: 'sit', t, col: [120, 150, 215], kind: 'boy', wind: 0, alpha: ga });
  person(c, { x: 470, y: 660, s: 1.45, dir: 1, pose: 'sit', t, col: [10, 12, 20], rim: [255, 140, 200], kind: 'girl', wind: 0 });
  mug(c, 548, 548, 1.0, 1 - sm(seg(lt, 4, 8)) * 0.4, t);
  mug(c, 760, 548, 1.0, ga > 0.02 ? 0.8 : 0, t);
  c.restore();
  vignette(c, 0.55);
}
function sceneClock(c, t) {
  const lt = t - 101.2;
  c.save(); cam(c, 640, 380, 1 + lt * 0.003, 0);
  c.fillStyle = vgrad(c, 0, H, [[0, [6, 8, 24]], [1, [30, 26, 56]]]); c.fillRect(-100, -100, W + 200, H + 200);
  bokeh(c, t, 33, 26, [[255, 190, 110], [100, 190, 255], [255, 110, 150]], 20, 80, 200, 700, 0.5, 6);
  const X = 700, Y = 290, R = 170;
  c.fillStyle = '#12121c'; c.fillRect(X - 5, -50, 10, Y - R + 50);
  glow(c, X, Y, 340, [255, 200, 120], 0.35);
  c.fillStyle = '#1a1a26'; c.beginPath(); c.arc(X, Y, R + 20, 0, TAU); c.fill();
  c.fillStyle = '#ebe4d2'; c.beginPath(); c.arc(X, Y, R, 0, TAU); c.fill();
  c.strokeStyle = 'rgba(0,0,0,0.12)'; c.lineWidth = 6; c.beginPath(); c.arc(X, Y, R - 4, 0, TAU); c.stroke();
  for (let i = 0; i < 60; i++) { const a = i / 60 * TAU - Math.PI / 2, big = i % 5 === 0; c.strokeStyle = '#1a1a22'; c.lineWidth = big ? 5 : 2; c.beginPath(); c.moveTo(X + Math.cos(a) * (R - 8), Y + Math.sin(a) * (R - 8)); c.lineTo(X + Math.cos(a) * (R - (big ? 26 : 16)), Y + Math.sin(a) * (R - (big ? 26 : 16))); c.stroke(); }
  for (let i = 1; i <= 12; i++) { const a = i / 12 * TAU - Math.PI / 2; txt(c, String(i), X + Math.cos(a) * (R - 48), Y + Math.sin(a) * (R - 48) + 11, 30, { font: FONT, col: '#1a1a22', align: 'center', weight: 'bold' }); }
  const prog = eo(seg(lt, 0.4, 9.2)); let mins = prog * 30; const beatSnap = Math.floor(mins * 2) / 2;
  const minA = (beatSnap / 60) * TAU - Math.PI / 2, hourA = ((23 + beatSnap / 60) / 12) * TAU - Math.PI / 2;
  c.lineCap = 'round'; c.strokeStyle = '#14141c'; c.lineWidth = 12; c.beginPath(); c.moveTo(X - Math.cos(hourA) * 20, Y - Math.sin(hourA) * 20); c.lineTo(X + Math.cos(hourA) * 90, Y + Math.sin(hourA) * 90); c.stroke();
  c.lineWidth = 8; c.beginPath(); c.moveTo(X - Math.cos(minA) * 24, Y - Math.sin(minA) * 24); c.lineTo(X + Math.cos(minA) * 134, Y + Math.sin(minA) * 134); c.stroke();
  const secA = (Math.floor(t * 1.5) / 60) * TAU * 4 - Math.PI / 2; c.strokeStyle = '#c0242c'; c.lineWidth = 3; c.beginPath(); c.moveTo(X - Math.cos(secA) * 30, Y - Math.sin(secA) * 30); c.lineTo(X + Math.cos(secA) * 140, Y + Math.sin(secA) * 140); c.stroke();
  c.fillStyle = '#c0242c'; c.beginPath(); c.arc(X, Y, 8, 0, TAU); c.fill();
  const o = {}; person(c, { x: 250, y: 660, s: 1.5, dir: 1, pose: 'stand', t, col: [6, 6, 14], rim: [255, 190, 130], kind: 'girl', wind: 0.35, out: o });
  if (o.hx) { c.save(); c.translate(o.hx, o.hy); c.rotate(-0.3); c.fillStyle = '#efe6cc'; c.fillRect(-4, -12, 26, 16); c.restore(); }
  const fa = sm(seg(lt, 8.6, 10.6));
  if (fa > 0) { const fx = lerp(1500, 1120, eo(seg(lt, 8.6, 10.6))); ferry(c, fx, 560, 1.7, -1, { lit: 1, dim: 0.35, t }); glow(c, fx - 160, 480, 380, [255, 214, 130], 0.5 * fa, 'lighter'); }
  const hf = seg(lt, 9.5, 10.5); if (hf > 0 && hf < 1) tint(c, [255, 240, 220], 0.35 * (1 - hf), 'lighter');
  c.restore();
  vignette(c, 0.55);
}
