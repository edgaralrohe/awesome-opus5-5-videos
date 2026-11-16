// Render: captura cada fotograma con Chromium y codifica con FFmpeg (+ bips de check-in).
//   node scripts/render.mjs            → out/checkpass-pro-30s.mp4 + out/poster.png
//   node scripts/render.mjs --stills 1.8,9,22   → out/stills/*.png (revisión rápida)
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { openStage } from './server.mjs';
import { DURATION, FPS } from '../src/config.js';
import { checkinTimes } from '../src/timeline.js';

const { chromium } = createRequire(import.meta.url)('playwright');
const OUT = path.resolve('out');
const args = process.argv.slice(2);
const stillsArg = args.includes('--stills') ? args[args.indexOf('--stills') + 1] : null;

const st = await openStage(chromium);
try {
  if (stillsArg) {
    const dir = path.join(OUT, 'stills'); fs.mkdirSync(dir, { recursive: true });
    for (const t of stillsArg.split(',').map(Number)) {
      await st.page.evaluate(t => window.renderAt(t), t);
      await st.page.screenshot({ path: path.join(dir, `t${t.toFixed(2).padStart(5, '0')}.png`) });
    }
    console.log('stills →', dir);
  } else {
    const frames = path.join(OUT, 'frames'); fs.rmSync(frames, { recursive: true, force: true }); fs.mkdirSync(frames, { recursive: true });
    const total = DURATION * FPS;
    for (let f = 0; f < total; f++) {
      await st.page.evaluate(t => window.renderAt(t), f / FPS);
      await st.page.screenshot({ path: path.join(frames, `f${String(f).padStart(4, '0')}.jpg`), type: 'jpeg', quality: 95 });
      if (f % 90 === 0) console.log(`frame ${f}/${total}`);
    }
    await st.page.evaluate(t => window.renderAt(t), 29);
    await st.page.screenshot({ path: path.join(OUT, 'poster.png') });

    // Audio: bip de dos tonos por check-in + un "whoosh" suave en el logo. Pista en silencio de base.
    const beeps = checkinTimes();
    const inputs = ['-f', 'lavfi', '-t', String(DURATION), '-i', 'anullsrc=r=48000:cl=stereo'];
    const filters = []; let n = 2; // entrada 0 = fotogramas, 1 = silencio base
    for (const t of beeps) {
      for (const [freq, off] of [[1320, 0], [1760, 0.07]]) {
        inputs.push('-f', 'lavfi', '-t', '0.09', '-i', `sine=frequency=${freq}:sample_rate=48000`);
        filters.push(`[${n}:a]volume=0.6,afade=t=out:st=0.05:d=0.04,adelay=${Math.round((t + off) * 1000)}|${Math.round((t + off) * 1000)}[a${n}]`); n++;
      }
    }
    const mix = `[1:a]${Array.from({ length: n - 2 }, (_, i) => `[a${i + 2}]`).join('')}amix=inputs=${n - 1}:normalize=0:duration=first[aout]`;
    const mp4 = path.join(OUT, 'checkpass-pro-30s.mp4');
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', path.join(frames, 'f%04d.jpg'), ...inputs,
      '-filter_complex', [...filters, mix].join(';'), '-map', '0:v', '-map', '[aout]',
      '-c:v', 'libx264', '-preset', 'slow', '-crf', '20', '-pix_fmt', 'yuv420p', '-movflags', '+faststart',
      '-c:a', 'aac', '-b:a', '128k', '-t', String(DURATION), mp4], { stdio: 'inherit' });
    fs.rmSync(frames, { recursive: true, force: true });
    console.log('video →', mp4);
  }
} finally { await st.close(); }
