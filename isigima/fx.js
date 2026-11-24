'use strict';
// ===== 2B katman efektleri: kıvılcım, toz, kâğıt/para, flaş =====
function embers(c, t, n, a = 1, wind = 40) { const r = rng(5); c.save(); c.globalCompositeOperation = 'lighter';
  for (let i = 0; i < n; i++) { const sp = 30 + r() * 90, ph = r() * 20, life = ((t * sp / 400 + ph) % 1), x = (r() * 1500 - 100 + t * wind * (0.5 + r())) % 1400 - 60, y = 760 - life * 820 + Math.sin(t * 2 + i) * 14, s = 1 + r() * 3;
    const g = c.createRadialGradient(x, y, 0, x, y, s * 4); g.addColorStop(0, `rgba(255,${180 + r() * 60 | 0},90,${a * (1 - life)})`); g.addColorStop(1, 'rgba(255,120,30,0)'); c.fillStyle = g; c.fillRect(x - s * 4, y - s * 4, s * 8, s * 8); }
  c.restore(); }
function dust(c, t, n, wx, a = .5, seed = 9) { const r = rng(seed); c.save();
  for (let i = 0; i < n; i++) { const sp = (200 + r() * 600) * wx, y0 = r() * H, x = ((r() * W + t * sp) % (W + 200) + W + 200) % (W + 200) - 100, y = y0 + Math.sin(t * 3 + i) * 20 + t * 30 % 50, s = .8 + r() * 2.4;
    c.strokeStyle = `rgba(210,210,215,${a * r()})`; c.lineWidth = s; c.beginPath(); c.moveTo(x, y); c.lineTo(x - sp * .025, y - 2); c.stroke(); }
  c.restore(); }
function papers(c, t, n, wx, money = 0, a = .9) { const r = rng(17); c.save();
  for (let i = 0; i < n; i++) { const sp = (250 + r() * 500) * wx, x = ((r() * W + t * sp) % (W + 300) + W + 300) % (W + 300) - 150, y = r() * H * .9 + Math.sin(t * 2.5 + i) * 60, rot = t * (2 + r() * 4) + i, s = 10 + r() * 16;
    c.save(); c.translate(x, y); c.rotate(rot); c.scale(1, Math.sin(t * 5 + i)); c.globalAlpha = a; c.fillStyle = money ? (r() < .5 ? '#9da39a' : '#b7bcb2') : '#cfcac0'; c.fillRect(-s, -s * .5, s * 2, s); if (money) { c.strokeStyle = 'rgba(40,50,40,.6)'; c.lineWidth = 1; c.strokeRect(-s * .8, -s * .35, s * 1.6, s * .7); c.beginPath(); c.arc(0, 0, s * .22, 0, TAU); c.stroke(); } c.restore(); }
  c.restore(); }
function sparkle(c, x, y, s, a) { c.save(); c.globalCompositeOperation = 'lighter'; const g = c.createRadialGradient(x, y, 0, x, y, s); g.addColorStop(0, `rgba(255,240,210,${a})`); g.addColorStop(.3, `rgba(255,200,120,${a * .4})`); g.addColorStop(1, 'rgba(255,160,60,0)'); c.fillStyle = g; c.fillRect(x - s, y - s, s * 2, s * 2);
  c.strokeStyle = `rgba(255,235,200,${a * .7})`; c.lineWidth = 1.2; c.beginPath(); c.moveTo(x - s * 1.4, y); c.lineTo(x + s * 1.4, y); c.moveTo(x, y - s * 1.1); c.lineTo(x, y + s * 1.1); c.stroke(); c.restore(); }
