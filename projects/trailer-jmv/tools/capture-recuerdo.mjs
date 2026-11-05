// «RECUERDO RECUPERADO» de Noche dibujado con el renderer real del juego (recuerdoCard + drawCard, v9.3),
// sobre el último fotograma de la pelea. 48 fotogramas a 24 fps → out/clips/recuerdo/.
import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const GAME = process.env.GAME || resolve(HERE, '../../../coloresruidosos.github.io/juegos/mexico-vs-jose-madero');
const { chromium } = createRequire(import.meta.url)('playwright');
const PORT = 5198;
const srv = spawn(process.execPath, ['scripts/serve.mjs'], { cwd: GAME, env: { ...process.env, PORT: String(PORT) }, stdio: ['ignore', 'pipe', 'inherit'] });
await new Promise((ok) => srv.stdout.once('data', ok));
const b = await chromium.launch();
try {
  const page = await b.newPage();
  page.on('pageerror', (e) => console.error('page:', e.message));
  await page.goto(`http://localhost:${PORT}/`);
  const bg = 'data:image/png;base64,' + (await readFile(join(HERE, 'out/clips/enmascarado-fin/f1185.png'))).toString('base64');
  const frames = await page.evaluate(async (bg) => {
    const { createArt, drawCard } = await import('/src/render/draw.js');
    const { recuerdoCard } = await import('/src/data/historia.js');
    window.__jmv.goto(2, 'noche');
    const art = createArt(window.__jmv.game.level, 'pista', { costume: 'vampiro' });
    await art.ready;
    const im = new Image(); im.src = bg; await im.decode();
    const cv = document.createElement('canvas'); cv.width = 320; cv.height = 224;
    const g = cv.getContext('2d'); g.imageSmoothingEnabled = false;
    const card = recuerdoCard('noche', ['carmesi', 'noche']);
    const out = [];
    for (let i = 0; i < 48; i++) { g.drawImage(im, 0, 0); drawCard(g, card, art, i / 24); out.push(cv.toDataURL('image/png')); }
    return out;
  }, bg);
  const dir = join(HERE, 'out/clips/recuerdo');
  await mkdir(dir, { recursive: true });
  for (const [i, d] of frames.entries()) await writeFile(join(dir, `f${String(i).padStart(4, '0')}.png`), Buffer.from(d.split(',')[1], 'base64'));
  console.log('recuerdo:', frames.length, 'fotogramas');
} finally { await b.close(); srv.kill(); }
