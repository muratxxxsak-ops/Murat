const { chromium } = require('playwright'); const fs = require('fs');
(async () => {
  const times = process.argv.slice(2).map(Number); const out = process.env.OUT;
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--allow-file-access-from-files', '--disable-web-security'] }); const p = await b.newPage({ viewport: { width: 1280, height: 720 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await p.goto('file://' + process.cwd() + '/index.html'); await p.waitForTimeout(300);
  for (const t of times) {
    const t0 = Date.now();
    const d = await p.evaluate(f => { try { renderFrame(f); return document.getElementById('cv').toDataURL('image/jpeg', 0.9); } catch (e) { return 'ERR ' + e.stack; } }, Math.round(t * 24));
    if (d.startsWith('ERR')) { console.log(t, d); continue; }
    fs.writeFileSync(`${out}/f_${String(t).padStart(6, '0')}.jpg`, Buffer.from(d.split(',')[1], 'base64')); console.log(t, 'ok', Date.now() - t0, 'ms');
  }
  if (errs.length) console.log('PAGEERRORS', errs.slice(0, 5)); await b.close();
})();
