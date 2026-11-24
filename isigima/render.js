const { chromium } = require('playwright'); const fs = require('fs');
const [a, b, out] = [+process.argv[2], +process.argv[3], process.argv[4]];
(async () => {
  const br = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--allow-file-access-from-files', '--disable-web-security'] }); const p = await br.newPage({ viewport: { width: 1280, height: 720 } });
  await p.goto('file://' + process.cwd() + '/index.html'); await p.waitForTimeout(300);
  for (let f = a; f < b; f++) {
    const d = await p.evaluate(f => { renderFrame(f); return document.getElementById('cv').toDataURL('image/jpeg', 0.93); }, f);
    fs.writeFileSync(`${out}/${String(f).padStart(5, '0')}.jpg`, Buffer.from(d.split(',')[1], 'base64'));
  }
  await br.close();
})();
