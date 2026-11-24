'use strict';
const cv = document.getElementById('cv'); const ctx = cv.getContext('2d');
const FOG = document.createElement('canvas'); FOG.width = W; FOG.height = H;
const OFF = document.createElement('canvas'); OFF.width = W; OFF.height = H;
const GR = (() => { const g = document.createElement('canvas'); g.width = 256; g.height = 256; const x = g.getContext('2d'), d = x.createImageData(256, 256), r = rng(5); for (let i = 0; i < d.data.length; i += 4) { const v = r() * 255; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 34; } x.putImageData(d, 0, 0); return g; })();
const SCENES = [
  { s: 0, e: 31, xf: 0, fn: (c, t) => scenePier(c, t, 'dusk') },
  { s: 31, e: 42, xf: 1.2, fn: sceneTicket },
  { s: 42, e: 52.5, xf: 1.2, fn: sceneStreet },
  { s: 52.5, e: 77.2, xf: 1.6, fn: sceneShores },
  { s: 77.2, e: 85.2, xf: 0.25, fn: sceneWindow },
  { s: 85.2, e: 93.2, xf: 0.25, fn: sceneSuitcase },
  { s: 93.2, e: 101.2, xf: 0.25, fn: sceneCafe },
  { s: 101.2, e: 112.2, xf: 0.25, fn: sceneClock },
  { s: 112.2, e: 131.5, xf: 1.0, fn: sceneRainPier },
  { s: 131.5, e: 151, xf: 1.4, fn: sceneBridge },
  { s: 151, e: 155.6, xf: 0.25, fn: sceneRun },
  { s: 155.6, e: 159.6, xf: 0.3, fn: sceneBoard },
  { s: 159.6, e: 163, xf: 0.3, fn: sceneCrowd },
  { s: 163, e: 178, xf: 0.2, fn: sceneKal },
  { s: 178, e: 186, xf: 0.6, fn: sceneRecap },
  { s: 186, e: 191, xf: 0.8, fn: (c, t) => scenePier(c, t, 'dawn') },
  { s: 191, e: 200, xf: 0.35, fn: sceneDeck },
  { s: 200, e: 210, xf: 0.5, fn: sceneSail },
  { s: 210, e: 217.6, xf: 0.8, fn: sceneOutro },
];
const CHAPTERS = [
  [6.6, 11.6, 1, 'Boş Yer'], [53.2, 58.2, 2, 'İki Kıyı'], [77.8, 82.8, 3, 'Gurur'], [112.8, 117.8, 4, 'Son Vapur'],
  [134.6, 139.6, 5, 'Duvar'], [151.3, 155.3, 6, 'Koşu'], [165.0, 170.0, 7, 'Kal'], [191.6, 196.6, 8, 'Yeni Bir Nefes'],
];
function drawScene(c, sc, t) { c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1; c.globalCompositeOperation = 'source-over'; sc.fn(c, t); c.restore(); }
function renderFrame(f) {
  const t = f / 24; setAudio(t);
  const c = ctx; c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1; c.globalCompositeOperation = 'source-over'; c.shadowColor = 'transparent';
  c.fillStyle = '#000'; c.fillRect(0, 0, W, H);
  SCENES.forEach((sc, i) => {
    const nx = SCENES[i + 1] ? SCENES[i + 1].xf : 0, x = sc.xf || 0;
    if (t < sc.s - x / 2 || t > sc.e + nx / 2) return;
    const a = x > 0 ? sm(seg(t, sc.s - x / 2, sc.s + x / 2)) : (t >= sc.s ? 1 : 0);
    if (a <= 0) return;
    if (a >= 0.999) drawScene(c, sc, t);
    else { const oc = OFF.getContext('2d'); oc.setTransform(1, 0, 0, 1, 0, 0); oc.clearRect(0, 0, W, H); drawScene(oc, sc, t); c.globalAlpha = a; c.drawImage(OFF, 0, 0); c.globalAlpha = 1; }
  });
  c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1;
  // müzikle nabız
  const str = (t > 191 && t < 210) ? 1 : (t > 77 && t < 112) ? 0.5 : (t > 112 && t < 131) ? 0.35 : (t > 19 && t < 52) ? 0.25 : 0;
  if (str > 0) tint(c, [255, 226, 180], 0.09 * KK * str, 'lighter');
  // bölüm başlığı
  for (const [s, e, n, title] of CHAPTERS) {
    const a = sm(seg(t, s, s + 0.7)) * (1 - sm(seg(t, e - 0.7, e))); if (a <= 0) continue;
    const dx = -26 * (1 - eo(seg(t, s, s + 0.9)));
    c.save(); c.translate(dx, 0); c.globalAlpha = a; c.fillStyle = 'rgba(240,200,130,0.95)'; c.fillRect(70, H - 160, 38, 2);
    txt(c, 'BÖLÜM ' + n, 70, H - 132, 13, { font: SANS, weight: 600, col: '#f0c882', sp: 5 });
    txt(c, title, 70, H - 96, 40, { font: FONT, style: 'italic', col: '#fff6e6', shadow: 'rgba(0,0,0,0.6)', sb: 14 });
    c.restore();
  }
  // açılış başlığı
  const ta = sm(seg(t, 1.2, 2.8)) * (1 - sm(seg(t, 5.6, 7.0)));
  if (ta > 0) { txt(c, 'SON VAPUR', 640, 150, 88, { font: FONT, col: '#fff2dc', align: 'center', sp: 20, a: ta, shadow: 'rgba(80,30,60,0.8)', sb: 30 }); txt(c, 'KISA DİZİ  ·  SEZON FİNALİ', 640, 190, 15, { font: SANS, weight: 600, col: '#f0c882', align: 'center', sp: 9, a: ta * 0.9 }); }
  // film greni
  c.save(); c.globalAlpha = 0.5; c.translate(-((f * 37) % 256), -((f * 91) % 256)); const pat = c.createPattern(GR, 'repeat'); c.fillStyle = pat; c.fillRect(0, 0, W + 256, H + 256); c.restore();
  // sinema bantları
  c.fillStyle = '#000'; c.fillRect(0, 0, W, 52); c.fillRect(0, H - 52, W, 52);
  const fi = 1 - sm(t / 1.2); if (fi > 0) { c.fillStyle = `rgba(0,0,0,${fi})`; c.fillRect(0, 0, W, H); }
}
window.renderFrame = renderFrame;
