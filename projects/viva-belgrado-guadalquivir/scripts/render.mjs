// Uso:
//   node scripts/render.mjs                                   → out/fluye-9x16.mp4
//   node scripts/render.mjs --page reel.html --out reel-9x16.mp4 [--audio cancion.mp3 --audio-start 42]
//   node scripts/render.mjs [--page reel.html] --frames 0,5,12 → out/frames/*.png + out/contactos.png
import { spawn } from 'node:child_process';
import { mkdir, writeFile, rm } from 'node:fs/promises';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { openStage } from './browser.mjs';
import { FPS } from '../src/config.js';

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'out');
const args = process.argv.slice(2);
const opt = (name, def = null) => (args.includes(`--${name}`) ? args[args.indexOf(`--${name}`) + 1] : def);
const page = opt('page', 'index.html');
const framesArg = opt('frames');
const audio = opt('audio');
const audioStart = Number(opt('audio-start', 0));
const outName = opt('out', page === 'index.html' ? 'fluye-9x16.mp4' : `${page.replace(/\.html$/, '')}-9x16.mp4`);

function run(cmd, argv, { input } = {}) {
  const p = spawn(cmd, argv, { stdio: [input ? 'pipe' : 'ignore', 'ignore', 'inherit'] });
  const done = new Promise((ok, ko) => p.on('close', (c) => (c === 0 ? ok() : ko(new Error(`${cmd} salió con ${c}`)))));
  return { stdin: p.stdin, done };
}

const X264 = ['-c:v', 'libx264', '-preset', 'slow', '-crf', '20', '-maxrate', '12M', '-bufsize', '24M', '-pix_fmt', 'yuv420p'];

await mkdir(OUT, { recursive: true });
const stage = await openStage({ page });
const pending = await stage.page.evaluate(() => window.__pending || []);
if (pending.length) console.warn(`⚠️  Tarjetas PENDIENTES en el render: ${pending.join(', ')}`);

try {
  if (framesArg) {
    const dir = join(OUT, 'frames');
    await rm(dir, { recursive: true, force: true });
    await mkdir(dir, { recursive: true });
    const times = framesArg.split(',').map(Number);
    const files = [];
    for (const t of times) {
      const file = join(dir, `t${t.toFixed(1).padStart(4, '0')}.png`);
      await writeFile(file, await stage.render(t));
      files.push(file);
    }
    const cols = Math.min(6, files.length), rows = Math.ceil(files.length / cols);
    await run('ffmpeg', ['-y', '-loglevel', 'error', ...files.flatMap((f) => ['-i', f]),
      '-filter_complex', `${files.map((_, i) => `[${i}]scale=360:-1[s${i}];`).join('')}${files.map((_, i) => `[s${i}]`).join('')}xstack=inputs=${files.length}:layout=${files.map((_, i) => `${(i % cols) * 360}_${Math.floor(i / cols) * 640}`).join('|')}:fill=black`,
      join(OUT, 'contactos.png')]).done.catch(() => {});
    console.log(`${files.length} fotogramas de ${page} en ${dir} · hoja: out/contactos.png (${cols}×${rows})`);
  } else {
    const duration = stage.duration;
    const file = join(OUT, outName);
    const audioArgs = audio
      ? ['-ss', String(audioStart), '-t', String(duration), '-i', resolve(audio),
        '-af', `afade=t=in:d=0.3,afade=t=out:st=${duration - 1.5}:d=1.5`, '-c:a', 'aac', '-b:a', '192k', '-shortest']
      : [];
    const ff = run('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-c:v', 'png', '-framerate', String(FPS), '-i', '-',
      ...audioArgs, ...X264, '-movflags', '+faststart', file], { input: true });
    const total = Math.round(duration * FPS);
    for (let i = 0; i < total; i++) {
      const png = await stage.render(i / FPS);
      if (!ff.stdin.write(png)) await new Promise((r) => ff.stdin.once('drain', r));
      if (i % FPS === 0) process.stdout.write(`\r${(i / FPS).toFixed(0).padStart(2)} / ${duration} s`);
    }
    ff.stdin.end();
    await ff.done;
    console.log(`\nListo: ${file}`);
  }
  if (stage.errors.length) console.error('Errores en la página:', stage.errors);
} finally {
  await stage.close();
}
