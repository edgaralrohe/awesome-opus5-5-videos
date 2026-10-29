// Uso:
//   node scripts/render.mjs                    → out/fluye-9x16.mp4
//   node scripts/render.mjs --frames 0,5,12    → out/frames/*.png + out/contactos.png
import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { openStage } from './browser.mjs';
import { FPS } from '../src/config.js';
import { DURATION } from '../src/lib/timeline.js';

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'out');
const args = process.argv.slice(2);
const framesArg = args.includes('--frames') ? args[args.indexOf('--frames') + 1] : null;

function run(cmd, argv, { input } = {}) {
  const p = spawn(cmd, argv, { stdio: [input ? 'pipe' : 'ignore', 'ignore', 'inherit'] });
  const done = new Promise((ok, ko) => p.on('close', (c) => (c === 0 ? ok() : ko(new Error(`${cmd} salió con ${c}`)))));
  return { stdin: p.stdin, done };
}

await mkdir(OUT, { recursive: true });
const stage = await openStage();

try {
  if (framesArg) {
    const dir = join(OUT, 'frames');
    await mkdir(dir, { recursive: true });
    const times = framesArg.split(',').map(Number);
    const files = [];
    for (const t of times) {
      const file = join(dir, `t${String(t.toFixed(1)).padStart(4, '0')}.png`);
      await writeFile(file, await stage.render(t));
      files.push(file);
    }
    const cols = Math.min(6, files.length), rows = Math.ceil(files.length / cols);
    await run('ffmpeg', ['-y', '-loglevel', 'error', ...files.flatMap((f) => ['-i', f]),
      '-filter_complex', `${files.map((_, i) => `[${i}]scale=360:-1[s${i}];`).join('')}${files.map((_, i) => `[s${i}]`).join('')}xstack=inputs=${files.length}:layout=${files.map((_, i) => `${(i % cols) * 360}_${Math.floor(i / cols) * 640}`).join('|')}:fill=black`,
      join(OUT, 'contactos.png')]).done.catch(() => {});
    console.log(`${files.length} fotogramas en ${dir} · hoja: out/contactos.png (${cols}×${rows})`);
  } else {
    const file = join(OUT, 'fluye-9x16.mp4');
    const ff = run('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-c:v', 'png', '-framerate', String(FPS), '-i', '-',
      '-c:v', 'libx264', '-preset', 'slow', '-crf', '20', '-maxrate', '12M', '-bufsize', '24M', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', file], { input: true });
    const total = DURATION * FPS;
    for (let i = 0; i < total; i++) {
      const png = await stage.render(i / FPS);
      if (!ff.stdin.write(png)) await new Promise((r) => ff.stdin.once('drain', r));
      if (i % FPS === 0) process.stdout.write(`\r${(i / FPS).toFixed(0).padStart(2)} / ${DURATION} s`);
    }
    ff.stdin.end();
    await ff.done;
    console.log(`\nListo: ${file}`);
  }
  if (stage.errors.length) console.error('Errores en la página:', stage.errors);
} finally {
  await stage.close();
}
