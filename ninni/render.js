const { chromium } = require('playwright'); const fs = require('fs');
const [a, b, out] = [+process.argv[2], +process.argv[3], process.argv[4]];
(async () => {
  const br = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--allow-file-access-from-files', '--disable-web-security'] }); const p = await br.newPage({ viewport: { width: 1080, height: 1920 } });
  await p.goto('file://' + process.cwd() + '/index.html'); await p.waitForTimeout(300); await p.evaluate(() => Promise.all([document.fonts.load('600 40px Caveat'), document.fonts.load('700 40px Kalam')]));
  for (let f = a - (a % 2); f < b; f += 2) { // 12 fps boyama: her çift kare çizilir, tek kare kopyalanır
    const d = await p.evaluate(f => { renderFrame(f); return document.getElementById('cv').toDataURL('image/jpeg', 0.92); }, f);
    const buf = Buffer.from(d.split(',')[1], 'base64'); fs.writeFileSync(`${out}/${String(f).padStart(5, '0')}.jpg`, buf); fs.writeFileSync(`${out}/${String(f + 1).padStart(5, '0')}.jpg`, buf);
  }
  await br.close();
})();
