import { SPRITES } from './sprites.js';
import { LEVELS, COPY } from './timeline.js';
import { hash2 } from '../lib/rng.js';
import { LW, LH, rect, dither, sprite, disc, text, box, iris } from './pixel.js';

const q = (t, fps = 12) => Math.floor(t * fps) / fps; // movimiento a 12 fps
const type = (t, cps = 28) => Math.max(0, Math.floor(t * cps));
const WIN = { 1: 'R', 2: 'p', 3: 'w', 4: 'B', 5: 'y', 6: 'O', 7: 'L', 8: 'n' };

// ── Mapa del lago con 8 cabañas ────────────────────────────
const LAKE = { x: 67, y: 128, rx: 38, ry: 50 };
const RING = { rx: 54, ry: 70 };
const angleOf = (k) => -Math.PI / 2 + (k * Math.PI * 2) / 8; // k = 0..7
export const cabinPos = (k) => ({ x: LAKE.x + Math.cos(angleOf(k)) * RING.rx, y: LAKE.y + Math.sin(angleOf(k)) * RING.ry });
const ringPos = (a) => ({ x: LAKE.x + Math.cos(a) * RING.rx, y: LAKE.y + Math.sin(a) * RING.ry });

export function drawMap(ctx, t, { lit = 0, numbers = false, pepe = null }) {
  dither(ctx, 0, 0, LW, LH, 'V', 'K');
  // Lago.
  for (let y = -LAKE.ry; y <= LAKE.ry; y++) {
    const hw = Math.floor(LAKE.rx * Math.sqrt(1 - (y / LAKE.ry) ** 2));
    rect(ctx, LAKE.x - hw, LAKE.y + y, hw * 2 + 1, 1, Math.abs(y) > LAKE.ry - 3 || hw < 4 ? 'B' : 'b');
  }
  const f = Math.floor(t * 4);
  for (let i = 0; i < 14; i++) {
    const sx = LAKE.x - 26 + Math.floor(hash2(i, 3) * 52), sy = LAKE.y - 36 + Math.floor(hash2(i, 7) * 72);
    if ((i + f) % 3) rect(ctx, sx, sy, 2 + (i % 3), 1, 'c');
  }
  // Pinos entre cabañas.
  for (let k = 0; k < 8; k++) {
    const a = angleOf(k) + Math.PI / 8;
    sprite(ctx, SPRITES.pino, LAKE.x + Math.cos(a) * 62 - 4, LAKE.y + Math.sin(a) * 86 - 6);
  }
  // Camino.
  for (let i = 0; i < 64; i++) {
    const p = ringPos((i / 64) * Math.PI * 2);
    if (i % 2) rect(ctx, p.x, p.y + 7, 1, 1, 'm');
  }
  // Cabañas: ventana encendida con el color de su disco.
  for (let k = 0; k < 8; k++) {
    const p = cabinPos(k);
    sprite(ctx, SPRITES.cabana, p.x - 8, p.y - 6, { tint: { x: k < lit ? WIN[k + 1] : 'K' } });
    if (numbers) text(ctx, String(k + 1), p.x, p.y - 15, { align: 'center', color: k < lit ? WIN[k + 1] : 'G' });
  }
  if (pepe) {
    const frame = Math.floor(t * 8) % 2 && pepe.walking ? SPRITES.pepe1 : SPRITES.pepe0;
    sprite(ctx, frame, pepe.x - 4, pepe.y - 2);
  }
}

// Pepe camina por el anillo de la cabaña k−1 a la k.
export function pepeOnRing(k, p) {
  const a0 = angleOf(k - 1), a1 = angleOf(k);
  const pos = ringPos(a0 + (a1 - a0) * p);
  return { x: Math.round(pos.x), y: Math.round(pos.y) + 8, walking: p < 1 };
}

// ── Título ────────────────────────────────────────────────
export function drawTitle(ctx, t) {
  rect(ctx, 0, 0, LW, LH, 'k');
  dither(ctx, 0, 112, LW, 40, 'k', 'b');
  for (let i = 0; i < 40; i++) {
    const x = Math.floor(hash2(i, 1) * LW), y = Math.floor(hash2(i, 2) * 110);
    if (y > 54 && y < 116) continue; // nada de estrellas entre las letras
    if ((i + Math.floor(t * 2)) % 5) rect(ctx, x, y, 1, 1, i % 4 ? 'G' : 'w');
  }
  disc(ctx, 104, 34, 13, 'Y');
  rect(ctx, 99, 29, 3, 2, 'G'); rect(ctx, 107, 37, 2, 2, 'G'); rect(ctx, 103, 41, 2, 1, 'G');
  // Bosque y lago.
  for (let x = -4; x < LW; x += 7) sprite(ctx, SPRITES.pino, x, 138 + (x % 3) * 2 - 6, { tint: { V: 'K', M: 'K' } });
  rect(ctx, 0, 150, LW, 90, 'b');
  for (let i = 0; i < 18; i++) {
    const y = 154 + (i % 9) * 9, x = (Math.floor(hash2(i, 5) * LW) + Math.floor(q(t, 6) * 8)) % LW;
    rect(ctx, x, y, 6, 1, i % 3 ? 'B' : 'c');
  }
  for (let j = 0; j < 5; j++) rect(ctx, 100 - j, 156 + j * 7, 8 + j * 2, 1, 'Y');
  sprite(ctx, SPRITES.cabana, 10, 136, { tint: { x: 'y' } });

  const drop = Math.max(0, 1 - q(t - 0.4) / 0.6);
  text(ctx, COPY.title, LW / 2, 62 - Math.round(drop * 70), { scale: 2, align: 'center' });
  if (t > 1.2) text(ctx, COPY.subtitle, LW / 2, 84, { scale: 2, align: 'center', color: 'R', chars: type(t - 1.2, 14) });
  if (t > 2) text(ctx, COPY.tagline, LW / 2, 106, { align: 'center', color: 'G', chars: type(t - 2) });
  if (t > 3 && Math.floor(t * 2) % 2 === 0) text(ctx, COPY.start, LW / 2, 188, { align: 'center' });
}

// ── Habitación de cada disco ──────────────────────────────
export function drawRoom(ctx, t, level, { L }) {
  rect(ctx, 0, 0, LW, LH, level.bg);
  dither(ctx, 0, 0, LW, 6, level.band, level.bg);
  rect(ctx, 0, 140, LW, 100, level.band);
  dither(ctx, 0, 136, LW, 4, level.bg, level.band);
  // Ventana a la noche (con luna).
  rect(ctx, 92, 16, 32, 30, 'M'); rect(ctx, 94, 18, 28, 26, 'k');
  disc(ctx, 114, 25, 4, 'Y'); rect(ctx, 107, 18, 2, 26, 'M'); rect(ctx, 94, 30, 28, 2, 'M');

  // Objeto del disco: entra a escalones enteros (2→3→4) y flota.
  const s = L < 0.15 ? 2 : L < 0.3 ? 3 : 4;
  const bob = Math.floor(q(L, 4) * 4) % 2;
  const size = 16 * s;
  sprite(ctx, SPRITES[level.item], Math.round((LW - size) / 2), 70 - size / 2 + 4 + bob, { scale: s });

  text(ctx, `NIVEL ${level.n}`, LW / 2, 150, { align: 'center', color: level.ink, chars: type(L) });
  if (L > 0.3) text(ctx, level.title, LW / 2, 164, { scale: 2, align: 'center', color: level.ink, chars: type(L - 0.3, 20) });
  if (L > 0.8) text(ctx, level.sub || String(level.year), LW / 2, 186, { align: 'center', color: level.ink, chars: type(L - 0.8) });
}

// Nivel «Noche»: apagón, máscara en la ventana y el dato de la gira.
export function drawTerror(ctx, t, { L }) {
  rect(ctx, 0, 0, LW, LH, 'k');
  if (L < 0.4) return; // apagón seco
  rect(ctx, 92, 16, 32, 30, 'K'); rect(ctx, 94, 18, 28, 26, 'k');
  if (L < 1.6) {
    sprite(ctx, SPRITES.hockey, 102, 22);
    text(ctx, COPY.warn, LW / 2, 150, { scale: 2, align: 'center', color: 'R', chars: type(L - 0.6, 20) });
    return;
  }
  const s = L < 1.7 ? 2 : L < 1.8 ? 3 : 4;
  sprite(ctx, SPRITES.hockey, Math.round((LW - 12 * s) / 2), 40, { scale: s });
  text(ctx, COPY.terror, LW / 2, 146, { align: 'center', chars: type(L - 1.7) });
}

export function drawContinue(ctx, t, L) {
  rect(ctx, 0, 0, LW, LH, 'k');
  if (L < 1.6) {
    text(ctx, COPY.cont, LW / 2, 90, { scale: 2, align: 'center', chars: type(L, 16) });
    if (L > 0.6) {
      text(ctx, COPY.yesno, LW / 2, 120, { align: 'center', chars: type(L - 0.6) });
      if (Math.floor(L * 2) % 2) rect(ctx, 37, 120, 5, 7, 'k'); // cursor que parpadea
    }
  } else {
    sprite(ctx, SPRITES.hockey, Math.round((LW - 36) / 2), 62, { scale: 3 });
    text(ctx, COPY.handle, LW / 2, 120, { align: 'center', chars: type(L - 1.7) });
  }
}

export { box, iris, LEVELS };
