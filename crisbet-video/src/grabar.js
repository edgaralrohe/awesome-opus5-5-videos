/* Graba video.html cuadro por cuadro y lo manda a ffmpeg.
   node src/grabar.js                         → crisbet-podologia.mp4 completo
   node src/grabar.js --cuadros 8,24,47.5     → solo esos instantes, como PNG en cuadros/ */
const { chromium } = require('playwright');
const { spawn } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const { servir, ORIGEN } = require('./servir.js');
const { DURACION } = require('./escenas.js');

const arg = (n, def) => { const i = process.argv.indexOf('--' + n); return i > 0 ? process.argv[i + 1] : def; };
const FPS = Number(arg('fps', 30));
const SALIDA = path.resolve(arg('salida', path.join(__dirname, '..', 'crisbet-podologia.mp4')));
const CUADROS = arg('cuadros', '');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  await servir(page);
  await page.goto(ORIGEN + 'video.html');
  await page.evaluate(() => window.listo);

  if (CUADROS) {
    const dir = path.join(__dirname, '..', 'cuadros');
    fs.mkdirSync(dir, { recursive: true });
    const ts = CUADROS.split(',').map(Number).sort((a, b) => a - b);
    // se recorre todo hasta cada instante para que los pasos ocurran en orden
    for (let f = 0, k = 0; k < ts.length; f++) {
      const t = f / FPS;
      await page.evaluate(t => irA(t), t);
      if (t + 1e-9 >= ts[k]) {
        await page.screenshot({ path: path.join(dir, `t${String(ts[k]).padStart(5, '0')}.png`) });
        k++;
      }
    }
    await browser.close();
    return;
  }

  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-pix_fmt', 'yuv420p', '-r', String(FPS),
    '-movflags', '+faststart', SALIDA], { stdio: ['pipe', 'inherit', 'inherit'] });
  const total = Math.round(DURACION * FPS);
  for (let f = 0; f < total; f++) {
    await page.evaluate(t => irA(t), f / FPS);
    const jpg = await page.screenshot({ type: 'jpeg', quality: 94 });
    if (!ff.stdin.write(jpg)) await new Promise(r => ff.stdin.once('drain', r));
    if (f % (FPS * 5) === 0) process.stdout.write(`${Math.round(f / FPS)}s `);
  }
  ff.stdin.end();
  await new Promise((res, rej) => ff.on('close', c => c ? rej(new Error('ffmpeg ' + c)) : res()));
  await browser.close();
  console.log('\n' + SALIDA);
})();
