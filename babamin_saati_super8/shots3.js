'use strict';
function shDawn(c, t, lt) {
  const k = sm(lt / 9); c.fillStyle = vgrad(c, 0, H, [[0, mix([8, 14, 34], [120, 150, 220], k)], [1, mix([14, 22, 46], [255, 190, 120], k)]]); c.fillRect(0, 0, W, H); glow(c, 640, 330, 700, [255, 170, 80], 0.2 + 0.5 * k);
  c.fillStyle = vgrad(c, 0, H, [[0, [30, 18, 12]], [1, [50, 28, 16]]]); c.fillRect(0, 0, 330, H); c.fillRect(950, 0, 330, H); const g = c.createLinearGradient(0, 120, 0, 520); g.addColorStop(0, '#ffb45a'); g.addColorStop(1, '#ff7a28'); c.fillStyle = g; c.fillRect(330, 130, 620, 400);
  for (let r = 0; r < 3; r++) for (let q = 0; q < 6; q++) { const grow = clamp((lt - 0.5 - (r * 6 + q) * 0.22) / 0.8); if (grow > 0) loaf(c, 380 + q * 98, 220 + r * 100, 70 * grow, 40 * grow, 0, t, 1); } c.fillStyle = 'rgba(70,36,16,0.8)'; for (let r = 0; r < 3; r++) c.fillRect(340, 240 + r * 100, 600, 8);
  clockFace(c, 640, 160, 44, 4 + lt * 0.2, lt * 6, 0); c.strokeStyle = '#1a1014'; c.lineWidth = 14; c.strokeRect(330, 130, 620, 400); shaft(c, 640, 330, -0.5, 1400, 260, [255, 210, 150], 0.3 * k); dust(c, t, 70, 90, 330, 950, 130, 530, 0.7, 2.2, -10); vignette(c, 0.5);
}
function shSlice(c, t, lt) {
  c.fillStyle = vgrad(c, 0, H, [[0, [34, 18, 10]], [1, [60, 32, 18]]]); c.fillRect(0, 0, W, H); glow(c, 640, 300, 800, [255, 180, 90], 0.35); wood(c, 0, 560, W, 160, 71); const z = 1 + 0.06 * lt / 11; c.save(); c.translate(640, 400); c.scale(z, z);
  const g = c.createRadialGradient(-60, -60, 10, 0, 0, 420); g.addColorStop(0, '#d89a50'); g.addColorStop(1, '#6a3a18'); c.fillStyle = g; c.beginPath(); c.ellipse(0, 0, 400, 220, 0, 0, TAU); c.fill(); c.fillStyle = '#f2e0b4'; c.beginPath(); c.ellipse(0, 0, 366, 190, 0, 0, TAU); c.fill(); for (let i = 0; i < 120; i++) { const a = hsh(i, 1) * TAU, r = Math.sqrt(hsh(i, 2)); c.fillStyle = `rgba(150,112,60,${0.15 + hsh(i, 3) * 0.3})`; c.beginPath(); c.ellipse(Math.cos(a) * r * 340, Math.sin(a) * r * 170, 4 + hsh(i, 4) * 14, 3 + hsh(i, 4) * 9, hsh(i, 5), 0, TAU); c.fill(); }
  const bt = clamp(1 - lt / 9) * 0.8 + 0.2; c.fillStyle = '#ffe27a'; rrect(c, -70, -50, 140 * bt, 70 * bt, 10); c.fill(); glow(c, 0, -10, 140, [255, 220, 120], 0.4, 'lighter'); c.restore(); steam(c, 640, 330, t, 0.35 * clamp(1 - lt / 12), 6, 260); dust(c, t, 72, 80, 100, 1180, 100, 620, 0.7, 2.4, -6); vignette(c, 0.55);
}
function shFinale(c, t, lt) {
  const sync = seg(t, 204.8, 205.4), s2 = seg(t, 208.8, 209.4), k = sm(lt / 6); c.fillStyle = vgrad(c, 0, H, [[0, [255, 214, 150]], [1, [196, 120, 60]]]); c.fillRect(0, 0, W, H); glow(c, 1000, 160, 900, [255, 240, 200], 0.7);
  dofLayer(c, s => { s.fillStyle = vgrad(s, 130, 560, [[0, [255, 240, 210]], [1, [255, 190, 110]]]); s.fillRect(760, 130, 420, 420); for (let i = 0; i < 6; i++) { s.fillStyle = 'rgba(60,40,30,0.8)'; s.beginPath(); s.arc(820 + i * 62, 380, 22, 0, TAU); s.fill(); s.fillRect(800 + i * 62, 396, 40, 150); } }, 8);
  c.strokeStyle = '#3a2418'; c.lineWidth = 16; c.strokeRect(760, 130, 420, 420); for (let i = 0; i < 5; i++) shaft(c, 960, 280, 2.5 + i * 0.1, 1300, 90 + i * 30, [255, 240, 200], 0.22);
  c.fillStyle = vgrad(c, 0, H, [[0, [70, 44, 28]], [1, [40, 24, 16]]]); c.fillRect(0, 560, W, 160); for (let q = 0; q < 6; q++) loaf(c, 120 + q * 120, 540, 100, 56, 0.04 * Math.sin(q), t, 1);
  clockFace(c, 330, 250, 100, 4, 0, 0); const w = watch({ x: 0 }.x === 0 ? c : c, { x: 560, y: 480, R: 170, h: 4, m: 5, s: tickS(t), t, strap: 0 });
  c.save(); c.translate(1130, 120); c.fillStyle = '#2a2020'; c.fillRect(-6, -10, 12, 40); c.fillStyle = '#4a403a'; c.beginPath(); c.moveTo(-50, 30); c.lineTo(50, 30); c.lineTo(110, 100); c.lineTo(96, 300); c.lineTo(60, 300); c.lineTo(50, 160); c.lineTo(56, 380); c.lineTo(-56, 380); c.lineTo(-50, 160); c.lineTo(-60, 300); c.lineTo(-96, 300); c.lineTo(-110, 100); c.closePath(); c.fill(); for (let i = 0; i < 3; i++) handprint(c, -20 + i * 30, 140 + i * 50, 0.5, i - 1, 0.45); glow(c, 0, 200, 220, [255, 220, 160], 0.3 + 0.4 * Math.max(sync, s2), 'lighter'); c.restore();
  for (const sy of [sync, s2]) if (sy > 0 && sy < 1) { c.strokeStyle = `rgba(255,236,190,${0.9 * (1 - sy)})`; c.lineWidth = 8; c.beginPath(); c.arc(560, 480, 180 + sy * 700, 0, TAU); c.stroke(); glow(c, 560, 480, 500, [255, 240, 200], 0.6 * (1 - sy), 'lighter'); }
  manFront(c, { x: 330, y: 600, s: 1.9, t, wave: 1, flour: 0.8, talk: 0, alpha: 0.42 * sm(seg(lt, 0.5, 3)) }); dust(c, t, 80, 120, 0, W, 0, H, 0.9, 3.0, 7); vignette(c, 0.4);
}
function shOutro(c, t, lt) {
  c.fillStyle = '#030202'; c.fillRect(0, 0, W, H); const ticking = t < 220, fade = 1 - sm(seg(t, 219.4, 220.4)); c.save(); c.globalAlpha = 0.9 * fade; glow(c, 640, 360, 420, [255, 170, 80], 0.15); watch(c, { x: 640, y: 360, R: 160, h: 4, m: 5, s: ticking ? tickS(t) : 4 + 0, t, strap: 0 }); c.restore();
  c.fillStyle = `rgba(0,0,0,${0.5 * (1 - fade)})`; c.fillRect(0, 0, W, H);
  const a = sm(seg(lt, 0.8, 1.6)) * (1 - sm(seg(lt, 3, 3.6))), b = sm(seg(lt, 3.6, 4.4)) * (1 - sm(seg(lt, 5.4, 6)));
  txt(c, 'Saat beş dakika ileri…', 640, 540, 38, { font: FI, style: 'italic', col: '#f2e2c0', align: 'center', a: 0 }); txt(c, 'Tam onun istediği gibi.', 640, 540, 38, { font: FI, style: 'italic', col: '#f2e2c0', align: 'center', a: 0 });
  const e = sm(seg(t, 219.6, 220.6)); if (e > 0) { c.save(); c.globalAlpha = e; c.fillStyle = '#050403'; c.fillRect(0, 0, W, H); watch(c, { x: 640, y: 250, R: 70, h: 4, m: 5, s: 4, t, strap: 0 }); txt(c, 'BABAMIN SAATİ', 640, 400, 54, { font: FI, col: '#f4e6c8', align: 'center', sp: 12 }); const bb = eo(seg(t, 220.8, 221.5)); if (bb > 0) txt(c, 'murat250sr', 640, 470, 44 * bb, { font: FI, style: 'italic', col: '#e8b870', align: 'center', sp: 4 }); c.restore(); }
}
