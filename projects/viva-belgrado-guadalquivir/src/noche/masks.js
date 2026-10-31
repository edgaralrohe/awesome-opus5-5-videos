import { clamp } from '../lib/math.js';

// Orden inicial: la de hockey (guiño al bombo de Madero) en el invitado central.
export const MASKS = ['calabaza', 'gato', 'hockey', 'calavera', 'antifaz'];
export const CENTER = 2;
const TRAVEL = 0.35; // s que tarda una máscara en saltar de cara

// Qué máscara lleva cada invitado en `t`. Cada `every` pulsos desde swapStart, todas saltan
// al invitado de la izquierda (from = de dónde viene, p = 0..1 del salto).
export function maskSlots(t, { swapStart, bpm, swaps = 5, every = 2 }) {
  const period = (every * 60) / bpm;
  const elapsed = t - swapStart;
  const shift = elapsed < period ? 0 : Math.min(swaps, Math.floor(elapsed / period + 1e-9));
  const p = shift === 0 ? 1 : clamp((elapsed - shift * period) / TRAVEL);
  const n = MASKS.length;
  return MASKS.map((_, i) => ({
    mask: MASKS[(i + shift) % n],
    from: shift === 0 ? i : (i + 1) % n,
    p: shift === swaps && elapsed - shift * period > TRAVEL ? 1 : p,
  }));
}
