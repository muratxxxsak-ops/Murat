'use strict';
const CARY = 600;
const speedAt = t => t < 23.5 ? 0 : t < 28 ? 340 * sm(seg(t, 23.5, 28)) : t < 82 ? 340 + 40 * sm(seg(t, 60, 70)) : t < 117 ? 420 : t < 137 ? 480 : t < 140.5 ? 480 * (1 - sm(seg(t, 137, 140.5))) : t < 199 ? 0 : 500 * sm(seg(t, 199, 203));
const DT = (() => { const a = [0]; for (let i = 1; i <= 4400; i++) a.push(a[i - 1] + speedAt(i * 0.05) * 0.05); return a; })();
const distAt = t => { const f = clamp(t, 0, 219) / 0.05, i = Math.floor(f); return lerp(DT[i], DT[i + 1], f - i); };
const carOff = t => t < 199.5 ? 0 : 1700 * sm(seg(t, 199.5, 203.5));
const SK = [[0, [140, 172, 182], [205, 222, 224]], [26, TEA, [170, 240, 235]], [82, YEL, [255, 238, 160]], [117, [255, 120, 130], [255, 205, 140]], [142, [60, 200, 232], [255, 230, 130]], [187, ORG, [255, 214, 120]], [199, [226, 70, 150], [255, 176, 90]], [210, [226, 70, 150], [255, 176, 90]]];
function skyCols(t) { let i = 0; while (i < SK.length - 2 && t > SK[i + 1][0]) i++; const a = SK[i], b = SK[i + 1], k = sm(seg(t, a[0], b[0])); return [mix(a[1], b[1], k), mix(a[2], b[2], k)]; }
function moodAt(t, behind) { if (t < 22) return 'sleep'; if (t < 92) return behind > 60 ? 'dance' : 'sleep'; if (t < 117) return behind > 60 ? 'smile' : 'frown'; if (t < 142) return behind > 60 ? 'dance' : 'sleep'; return 'dance'; }
function winDraw(c, x, y, mood, t, seed, speaker) {
  const wd = 44, ht = 58; sh(c, [250, 244, 230], () => { c.rect(x - 4, y - 4, wd + 8, ht + 8); }, 3.5);
  if (mood === 'sleep') { c.fillStyle = rgba([150, 160, 170]); c.fillRect(x, y, wd, ht); c.strokeStyle = rgba(INK, 0.6); c.lineWidth = 2; for (let i = 6; i < ht; i += 9) { c.beginPath(); c.moveTo(x, y + i); c.lineTo(x + wd, y + i); c.stroke(); } }
  else {
    c.fillStyle = rgba([70, 44, 80]); c.fillRect(x, y, wd, ht); const ph = bph(t) * Math.PI + seed, cl = POPC[Math.floor(hsh(seed, 5) * 7)], bob = mood === 'dance' ? Math.abs(Math.sin(ph)) * 6 : 0, sk = [[240, 196, 150], [200, 140, 100], [150, 96, 66]][Math.floor(hsh(seed, 6) * 3)];
    c.save(); c.beginPath(); c.rect(x, y, wd, ht); c.clip(); sh(c, mood === 'frown' ? gcol(cl, 0.15) : cl, () => { c.ellipse(x + 22, y + ht + 4 - bob, 18, 20, 0, 0, TAU); }, 3.5);
    if (mood === 'dance') { c.strokeStyle = rgba(INK); c.lineWidth = 9; c.beginPath(); c.moveTo(x + 8, y + ht - bob); c.lineTo(x + 4, y + 14 - bob + Math.sin(ph) * 6); c.moveTo(x + 36, y + ht - bob); c.lineTo(x + 40, y + 14 - bob - Math.sin(ph) * 6); c.stroke(); c.lineWidth = 5; c.strokeStyle = rgba(cl); c.stroke(); }
    sh(c, sk, () => { c.arc(x + 22, y + 30 - bob, 12, 0, TAU); }, 3.5); c.fillStyle = rgba(INK); c.beginPath(); c.arc(x + 18, y + 29 - bob, 1.7, 0, TAU); c.arc(x + 26, y + 29 - bob, 1.7, 0, TAU); c.fill(); c.strokeStyle = rgba(INK); c.lineWidth = 1.8; c.beginPath(); if (mood === 'frown') c.arc(x + 22, y + 40 - bob, 4, Math.PI * 1.1, Math.PI * 1.9); else c.arc(x + 22, y + 34 - bob, 5, 0.2, Math.PI - 0.2); c.stroke(); c.restore();
  }
  if (speaker) { sh(c, [60, 60, 84], () => { c.rect(x + 2, y + ht - 20, 22, 26); }, 3); sh(c, INK, () => { c.arc(x + 13, y + ht - 6, 7 + 3 * pulse(t), 0, TAU); }, 2.5); }
}
function drawWorld(c, t, V) {
  const D = V.D, cx = V.carX, [top, bot] = skyCols(t), party = t >= 142 && t < 199;
  c.fillStyle = vgrad(c, -400, 470, [[0, top], [1, bot]]); c.fillRect(-1600, -700, 4800, 1170);
  dots(c, -500, -300, 1800, 200, 34, [255, 255, 255], 0.25, (x, y) => clamp((200 - y) / 420));
  c.save(); c.translate(980, 90); c.rotate(t * 0.15); for (let i = 0; i < 14; i++) { c.fillStyle = 'rgba(255,255,255,0.18)'; c.beginPath(); c.moveTo(0, 0); c.arc(0, 0, 420, i / 14 * TAU, (i + 0.5) / 14 * TAU); c.fill(); } c.restore();
  sh(c, YEL, () => { c.arc(980, 90, 62, 0, TAU); }, 6);
  for (let i = 0; i < 5; i++) { const x = ((i * 520 - D * 0.08) % 2600 + 2600) % 2600 - 700; sh(c, [255, 255, 255], () => { c.arc(x, 40 + (i % 2) * 70, 38, 0, TAU); c.arc(x + 44, 56 + (i % 2) * 70, 46, 0, TAU); c.arc(x + 96, 44 + (i % 2) * 70, 36, 0, TAU); }, 5); }
  const j0 = Math.floor(D * 0.35 / 210);
  for (let k = -5; k < 15; k++) { const idx = j0 + k, w = 170 + hsh(idx, 1) * 70, h = 230 + hsh(idx, 2) * 150, xs = k * 230 - (D * 0.35 % 210) - 400, base = [PNK, TEA, YEL, ORG, BLU, GRN, RED][((idx % 7) + 7) % 7], col = mix(base, [255, 255, 255], 0.3);
    sh(c, col, () => { c.rect(xs, 440 - h, w, h); }, 5); c.fillStyle = 'rgba(0,0,0,0.16)'; c.fillRect(xs + w - 24, 440 - h + 2, 22, h - 3); dots(c, xs + 6, 440 - h + 8, xs + w - 26, 440 - 6, 18, INK, 0.14, (x, y) => clamp((y - (440 - h)) / h) * 0.8);
    const rows = Math.floor((h - 20) / 80); for (let r = 0; r < rows; r++) for (let q = 0; q < 3; q++) { const wx = xs + 14 + q * ((w - 40) / 3), wy = 440 - h + 16 + r * 80; if (hsh(idx, r * 3 + q, 3) < 0.8) winDraw(c, wx, wy, moodAt(t, cx - (wx + 22)), t, idx * 13 + r * 3 + q, party && hsh(idx, r + q, 8) > 0.45); } }
  const j1 = Math.floor(D * 0.6 / 190);
  for (let k = -5; k < 12; k++) { const idx = j1 + k, w = 170, xs = k * 190 - (D * 0.6 % 190) - 400, col = [[255, 90, 90], [60, 200, 200], [255, 210, 40], [255, 140, 190]][((idx % 4) + 4) % 4];
    sh(c, [255, 244, 222], () => { c.rect(xs, 392, w, 78); }, 5); for (let i = 0; i < 6; i++) { sh(c, i % 2 ? [255, 255, 255] : col, () => { c.rect(xs - 4 + i * (w + 8) / 6, 392, (w + 8) / 6, 26); }, 3.5); } sh(c, [60, 70, 110], () => { c.rect(xs + 18, 426, 50, 44); c.rect(xs + 100, 422, 44, 48); }, 3.5); }
  sh(c, [236, 226, 210], () => { c.rect(-1400, 470, 4000, 40); }, 5); c.fillStyle = rgba(INK, 0.2); c.fillRect(-1400, 504, 4000, 6);
  c.fillStyle = vgrad(c, 510, 760, [[0, [70, 72, 98]], [1, [44, 44, 66]]]); c.fillRect(-1400, 510, 4000, 400); dots(c, -400, 512, 1800, 760, 26, INK, 0.2, (x, y) => clamp((y - 520) / 220));
  for (let i = -4; i < 20; i++) { const x = i * 130 - (D % 130) - 300; sh(c, CRM, () => { c.rect(x, 640, 66, 10); }, 3); }
  for (let i = 0; i < 28; i++) { const xs = ((i * 150 + 20 - D) % 4200 + 4200) % 4200 - 1000, hb = cx - xs, md = moodAt(t, hb); if (xs > -800 && xs < 2000) { ped(c, { x: xs, y: 500 + (i % 2) * 8, s: 0.98, t, mood: md === 'smile' ? 'dance' : md, seed: i + 2 }); } }
  if (t >= 53.25 && t < 62) { const gx = V.carX + 470 - (D - distAt(53.25)); ped(c, { x: gx, y: 506, s: 1.1, t, mood: 'frown', seed: 77 }); c.save(); c.translate(gx + 6, 380); c.rotate(-0.05); sh(c, [236, 236, 240], () => { c.rect(-38, 0, 76, 34); }, 3.5); txt(c, 'SIKICI', 0, 22, 14, { font: SANS, weight: 900, col: rgba(INK), align: 'center' }); c.restore(); }
  for (let i = 0; i < 12; i++) { const x = ((i * 360 - D) % 4320 + 4320) % 4320 - 900; c.fillStyle = rgba([40, 44, 70]); c.fillRect(x, 330, 6, 150); sh(c, YEL, () => { c.arc(x + 3, 326, 12, 0, TAU); }, 3.5); }
  if (party) { for (let i = 0; i < 14; i++) { const xx = cx - 700 + i * 110 + (i % 3) * 16 - 0; ped(c, { x: xx, y: 560 + (i % 3) * 36, s: 1.05 + (i % 3) * 0.1, t, mood: 'dance', seed: i + 40 }); } }
  const jn = [[0, 'driver'], [42, 'boom'], [53, 'snare'], [72, 'granny'], [72.6, 'dog']];
  const crew = [{ kind: 'driver', x: 46, y: -66 }, { kind: 'boom', x: 4, y: -66, j: seg(t, 49.5, 50.4) }, { kind: 'snare', x: -46, y: -66, j: seg(t, 51, 51.9) }, { kind: 'granny', x: -86, y: -66, j: seg(t, 72, 72.9) }, { kind: 'dog', x: -130, y: -74, j: seg(t, 72.6, 73.5), s: 0.9 }];
  if (t >= 112 && t < 117) { /* hazırlık */ }
  if (t >= 42 && t < 45.8) { c.save(); c.translate(cx + 50, CARY - 178 + Math.sin(t * 3) * 4); sh(c, [255, 255, 255], () => { c.arc(-30, 0, 26, 0, TAU); c.arc(4, -10, 34, 0, TAU); c.arc(40, 0, 26, 0, TAU); }, 4.5); c.restore(); }
  carDraw(c, { x: cx, y: CARY, t, D, crew, win: t < 24.2 ? 1 : 1 - sm(seg(t, 24.2, 25.6)) });
  if (t >= 45.8 && t < 62) { const u = clamp((t - 45.8) / 1.5), ax = cx + 60 - 220 * u, ay = CARY - 130 - 120 * Math.sin(u * Math.PI) + 90 * u * u; const landX = cx + 60 - 220 - (D - distAt(47.3)); const px = u < 1 ? ax : landX, py = u < 1 ? ay : CARY + 0; c.save(); c.translate(px, py - 14); c.rotate(u * 5); sh(c, [160, 120, 80], () => { c.rect(-26, -22, 52, 40); }, 4.5); txt(c, 'SIKINTI', 0, 8, 12, { font: SANS, weight: 900, col: rgba(INK), align: 'center' }); c.restore(); }
  if (t >= 92.5 && t < 104) { for (let i = 0; i < 2; i++) { const u = clamp((t - 92.5 - i * 0.3) / 1.2), px = cx - 150 - 120 * u * (1 + i) - (u >= 1 ? D - distAt(93.7 + i * 0.3) : 0), py = CARY - 130 + 130 * u * u - (u < 1 ? 60 * Math.sin(u * 3) : 0); c.save(); c.translate(px, py); c.rotate(u * 3); sh(c, [90, 96, 120], () => { c.rect(-34, -6, 68, 12); c.rect(-42, -18, 12, 36); c.rect(30, -18, 12, 36); }, 4.5); c.restore(); } }
  if (t >= 64.5 && t < 68) { for (let i = 0; i < 18; i++) { const u = clamp((t - 64.5 - hsh(i, 1) * 0.3) / 1.6), a = hsh(i, 2) * TAU, d = 150 * u + 20; c.save(); c.translate(cx + 48 + Math.cos(a) * d, CARY - 100 + Math.sin(a) * d - 30 * u); c.rotate(u * 6); sh(c, POPC[i % 7], () => { for (let q = 0; q < 10; q++) { const aa = q / 10 * TAU, rr = q % 2 ? 4 : 9; q ? c.lineTo(Math.cos(aa) * rr, Math.sin(aa) * rr) : c.moveTo(Math.cos(aa) * rr, Math.sin(aa) * rr); } c.closePath(); }, 2.5); c.restore(); } }
  if (t >= 68.25 && t < 72) { const k = 1 + 0.12 * pulse(t); c.save(); c.translate(cx + 56, CARY - 88); c.scale(k, k); glow(c, 0, 0, 80, [255, 120, 20], 0.7, 'lighter'); sh(c, RED, () => { c.moveTo(0, 14); c.bezierCurveTo(-26, -6, -14, -26, 0, -12); c.bezierCurveTo(14, -26, 26, -6, 0, 14); }, 4); sh(c, YEL, () => { c.moveTo(0, 6); c.quadraticCurveTo(8, -4, 0, -10); c.quadraticCurveTo(-8, -4, 0, 6); }, 2.5); c.restore(); }
  if (t >= 104 && t < 112) { for (let i = 0; i < 4; i++) { c.strokeStyle = rgba(TEA, 0.8); c.lineWidth = 7; c.beginPath(); for (let x = -500; x <= 700; x += 20) { const y = 700 + i * 20 + Math.sin(x * 0.02 + t * 6 + i) * 8; x === -500 ? c.moveTo(cx + x, y) : c.lineTo(cx + x, y); } c.stroke(); } }
  if (t >= 124.5 && t < 130) for (let i = 0; i < 9; i++) { const u = (t - 124.5 + i * 0.12), px = cx - 250 - u * 230 + Math.sin(u * 5 + i) * 30, py = CARY - 220 + Math.sin(u * 3 + i) * 70 - i * 14; c.save(); c.translate(px, py); c.rotate(Math.sin(u * 4 + i) * 0.8); sh(c, [255, 255, 255], () => { c.rect(-22, -26, 44, 52); }, 3.5); c.fillStyle = rgba(RED); c.fillRect(-22, -26, 44, 12); txt(c, 'DÜN', 0, 14, 13, { font: SANS, weight: 900, col: rgba(INK), align: 'center' }); c.restore(); }
  if (party) for (let i = 0; i < 40; i++) { const u = ((t * 0.4 + hsh(i, 1)) % 1), px = cx - 700 + hsh(i, 2) * 1400, py = -200 + u * 800; c.save(); c.translate(px, py); c.rotate(u * 9 + i); c.fillStyle = rgba(POPC[i % 7]); c.fillRect(-5, -3, 10, 6); c.restore(); }
}
