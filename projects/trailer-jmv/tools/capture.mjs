// Graba tomas REALES del juego (spec §4.1, plan D2): Chromium con reloj controlado, paso de 60 Hz,
// bots de tests/bot.js y un PNG cada 2,5 pasos (24 fps). Solo graba en las pantallas play y victory.
// Uso: node tools/capture.mjs [id…]   (GAME=<carpeta del juego>, por defecto el repo de la web al lado)
import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const GAME = process.env.GAME || resolve(HERE, '../../../coloresruidosos.github.io/juegos/mexico-vs-jose-madero');
const { chromium } = createRequire(import.meta.url)('playwright');
export const CLIPS = [
  { id: 'calle', world: 'carmesi', level: 0, secs: 9 },
  { id: 'azoteas', world: 'carmesi', level: 1, secs: 12 },
  { id: 'flashbot', world: 'carmesi', level: 2, secs: 40, boss: true },
  { id: 'entrada', world: 'noche', level: 0, secs: 10 },
  { id: 'salon', world: 'noche', level: 1, secs: 12 },
  { id: 'enmascarado', world: 'noche', level: 2, secs: 90, boss: true },
  // v2 del guion: el prólogo (avanza cada 3 s), el pasillo del Museo y lo que sigue a cada jefe.
  { id: 'prologo', mode: 'prologue', secs: 16, advance: 3 },
  { id: 'museo', mode: 'museum', secs: 9 },
  { id: 'flashbot-fin', world: 'carmesi', level: 2, secs: 60, boss: true, after: true, advance: 4 },
  { id: 'enmascarado-fin', world: 'noche', level: 2, secs: 100, boss: true, after: true, advance: 4 },
];
const want = process.argv.slice(2);
const PORT = 5199;
const srv = spawn(process.execPath, ['scripts/serve.mjs'], { cwd: GAME, env: { ...process.env, PORT: String(PORT) }, stdio: ['ignore', 'pipe', 'inherit'] });
await new Promise((ok) => srv.stdout.once('data', ok));

const browser = await chromium.launch();
try {
  for (const clip of CLIPS.filter((c) => !want.length || want.includes(c.id))) {
    const ctx = await browser.newContext({ viewport: { width: 400, height: 300 } });
    const page = await ctx.newPage();
    page.on('pageerror', (e) => console.error('page:', e.message));
    await page.clock.install({ time: 0 });
    await page.addInitScript((fresh) => {
      if (fresh) { localStorage.removeItem('jmv-save'); return; }
      localStorage.setItem('jmv-save', JSON.stringify({ v: 1, options: { flashes: true, shake: true, assist: false, music: false },
        worlds: { carmesi: { cleared: ['1-1', '1-2', '1-3'], best: {} } }, unlocked: ['clasico', 'vampiro'], costume: 'auto', record: 0,
        seenPrologue: true, seenItems: ['A', 'J', 'Z', 'L', '+', 'amp', 'pua', 'antifaz', 'aceite', 'carta', 'gancho', 'hook', 'pieza', 'checkpoint'] }));
    }, clip.mode === 'prologue');
    await page.goto(`http://localhost:${PORT}/`);
    await page.clock.runFor(500);
    await page.evaluate(async ({ world, level, mode }) => {
      const b = await import('/tests/bot.js');
      window.__bots = b;
      if (mode === 'prologue') window.__jmv.start();
      else if (mode === 'museum') window.__jmv.museum('carmesi');
      else window.__jmv.goto(level, world);
    }, clip);
    if (clip.mode) await page.clock.runFor(100);
    const dir = join(HERE, 'out/clips', clip.id);
    await rm(dir, { recursive: true, force: true });
    await mkdir(dir, { recursive: true });
    const meta = [];
    let n = 0, steps = 0;
    const maxSteps = clip.secs * 60 * 3;
    while (n < clip.secs * 24 && steps < maxSteps) {
      const st = await page.evaluate(({ boss, world, mode, after, advance, steps }) => {
        const j = window.__jmv, g = j.game, h = j.held, B = window.__bots;
        const play = j.screen === 'play' && !j.paused && g && g.status === 'play';
        const tick = advance ? Math.floor(steps / (advance * 60)) : 0, pressNow = advance && steps % (advance * 60) < 3 && steps > 30;
        let btn;
        if (mode === 'prologue') btn = { jump: pressNow };
        else if (mode === 'museum') btn = { right: true };
        else if (play) btn = g.boss && (boss || g.boss.alive) ? (world === 'noche' ? B.maskBot(g) : B.bossBot(g)) : B.bot(g);
        else if (j.screen === 'victory') btn = {};
        else if (after && j.screen === 'card' && g && g.status === 'won') btn = { jump: window.__cardT > 0 && window.__cardT % (advance * 60) < 3 && window.__cardT > 60 };
        else btn = { jump: (performance.now() / 120 | 0) % 2 === 0 };
        window.__cardT = j.screen === 'card' && g && g.status === 'won' ? (window.__cardT || 0) + 1 : 0;
        void tick;
        for (const k of ['left', 'right', 'jump', 'mic', 'special']) h[k] = !!btn[k];
        return { screen: j.screen, status: g && g.status, x: g && Math.round(g.player.x), boss: g && g.boss ? g.boss.hp : null };
      }, { ...clip, steps });
      await page.clock.runFor(1000 / 60);
      steps++;
      const rec = clip.mode === 'prologue' ? ['prologue'] : clip.mode === 'museum' ? ['museum'] : clip.after ? ['play', 'victory', 'card'] : ['play', 'victory'];
      if (clip.after && !rec.includes(st.screen) && meta.some((m) => m.screen === 'card')) break;
      if (!rec.includes(st.screen)) { if (!clip.after && meta.some((m) => m.screen === 'victory')) break; continue; }
      // Un fotograma cada 2,5 pasos (60 → 24 fps).
      if (Math.floor(steps * 24 / 60) > Math.floor((steps - 1) * 24 / 60)) {
        const png = await page.evaluate(() => document.getElementById('game').toDataURL('image/png'));
        await writeFile(join(dir, `f${String(n).padStart(4, '0')}.png`), Buffer.from(png.split(',')[1], 'base64'));
        meta.push({ n, ...st });
        n++;
      }
    }
    await writeFile(join(dir, 'meta.json'), JSON.stringify(meta));
    const last = meta.at(-1) || {};
    console.log(`${clip.id}: ${n} fotogramas · ${steps} pasos · último estado ${last.screen}/${last.status} x=${last.x} jefe=${last.boss}`);
    await ctx.close();
  }
} finally {
  await browser.close();
  srv.kill();
}
