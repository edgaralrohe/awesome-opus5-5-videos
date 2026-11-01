// Genera out/cabanas.wav (44,1 kHz, 16 bit, mono) con el chiptune original de «8 cabañas».
import { mkdir, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderChiptune } from '../src/cabanas/chiptune.js';
import { DURATION } from '../src/cabanas/timeline.js';

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'out');
const sampleRate = 44100;
const pcm = renderChiptune({ sampleRate, duration: DURATION });
const buf = Buffer.alloc(44 + pcm.length * 2);
buf.write('RIFF', 0); buf.writeUInt32LE(36 + pcm.length * 2, 4); buf.write('WAVE', 8);
buf.write('fmt ', 12); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(1, 22);
buf.writeUInt32LE(sampleRate, 24); buf.writeUInt32LE(sampleRate * 2, 28); buf.writeUInt16LE(2, 32); buf.writeUInt16LE(16, 34);
buf.write('data', 36); buf.writeUInt32LE(pcm.length * 2, 40);
pcm.forEach((v, i) => buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, v)) * 32767), 44 + i * 2));
await mkdir(OUT, { recursive: true });
await writeFile(join(OUT, 'cabanas.wav'), buf);
console.log(`out/cabanas.wav · ${DURATION} s`);
