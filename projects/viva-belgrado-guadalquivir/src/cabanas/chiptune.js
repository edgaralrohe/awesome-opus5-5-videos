// Chiptune original: pulso (melodía) + triángulo (bajo) + ruido LFSR (batería), estilo NES.
// La menor con acorde de Mi mayor (sol#): suena a terror de 8 bits.
import { BPM } from './timeline.js';

const midi = (n) => 440 * 2 ** ((n - 69) / 12);
// Am | F | Dm | E — bajo y tonos del acorde (MIDI).
const CHORDS = [
  { bass: 45, tones: [69, 72, 76] },
  { bass: 41, tones: [65, 69, 72] },
  { bass: 38, tones: [62, 65, 69] },
  { bass: 40, tones: [64, 68, 71] },
];
// Motivos en corcheas: índice de tono del acorde (+3 = octava arriba del primero), -1 = silencio.
const MOTIF_A = [0, 1, 2, 1, 3, 2, 1, 2];
const MOTIF_B = [2, -1, 2, 1, 0, -1, 1, 3];
const QUIET = new Set([12, 13]); // apagón del nivel «Noche»

export function renderChiptune({ sampleRate = 44100, duration }) {
  const n = Math.round(duration * sampleRate);
  const out = new Float32Array(n);
  const beat = 60 / BPM, eighth = beat / 2, bar = beat * 4;
  const totalBars = Math.round(duration / bar);
  let lfsr = 1;
  const noise = () => {
    const bit = (lfsr ^ (lfsr >> 1)) & 1;
    lfsr = (lfsr >> 1) | (bit << 14);
    return lfsr & 1 ? 1 : -1;
  };
  let phL = 0, phB = 0, phK = 0;

  for (let i = 0; i < n; i++) {
    const t = i / sampleRate;
    const b = Math.floor(t / bar);
    const inBar = t - b * bar;
    const chord = CHORDS[b % 4];
    const last = b >= totalBars - 1;
    const fade = last ? Math.max(0, 1 - inBar / bar) : 1;
    let s = 0;

    if (QUIET.has(b)) {
      // Dron grave + golpe disonante al empezar el apagón.
      phB += midi(33) / sampleRate;
      s += (1 - 4 * Math.abs((phB % 1) - 0.5)) * 0.22;
      if (b === 12 && inBar < 0.5) {
        const env = 1 - inBar / 0.5;
        s += (Math.sin(2 * Math.PI * midi(63) * t) + Math.sin(2 * Math.PI * midi(69) * t)) * 0.12 * env;
      }
    } else {
      // Bajo (triángulo) en corcheas, raíz/octava.
      const e = Math.floor(inBar / eighth);
      const bassNote = chord.bass + (e % 2 ? 12 : 0);
      phB += midi(last ? chord.bass : bassNote) / sampleRate;
      s += (1 - 4 * Math.abs((phB % 1) - 0.5)) * 0.24;

      // Melodía (pulso 25 %) a partir del compás 2.
      if (b >= 2) {
        const motif = Math.floor(b / 4) % 2 ? MOTIF_B : MOTIF_A;
        const idx = last ? (e === 0 ? 0 : -1) : motif[e];
        if (idx >= 0) {
          const note = idx === 3 ? chord.tones[0] + 12 : chord.tones[idx];
          const tIn = inBar - e * eighth;
          const env = last ? Math.max(0, 1 - inBar / bar) : Math.max(0, 1 - tIn / (eighth * 1.1));
          phL += midi(note) / sampleRate;
          s += ((phL % 1) < 0.25 ? 1 : -1) * 0.13 * env;
        }
        // Arpegio de entrada de nivel (primer pulso de cada nivel, desde el compás 6).
        if (b >= 6 && (b - 6) % 4 === 0 && inBar < beat) {
          const step = Math.floor(inBar / (beat / 4));
          const note = chord.tones[step % 3] + 12;
          s += ((((t * midi(note)) % 1) < 0.5) ? 1 : -1) * 0.07;
        }
      }

      // Batería desde el compás 4: bombo 1 y 3, caja 2 y 4, charles en corcheas.
      if (b >= 4 && !last) {
        const bt = Math.floor(inBar / beat), tb = inBar - bt * beat;
        if (bt % 2 === 0 && tb < 0.12) {
          phK += (60 + 120 * (1 - tb / 0.12)) / sampleRate;
          s += Math.sin(2 * Math.PI * phK) * 0.3 * (1 - tb / 0.12);
        }
        if (bt % 2 === 1 && tb < 0.1) s += noise() * 0.12 * (1 - tb / 0.1);
        const te = inBar - e * eighth;
        if (te < 0.025) s += noise() * 0.05;
      }
    }
    out[i] = Math.tanh(s * fade * 1.1) * 0.85;
  }
  return out;
}
