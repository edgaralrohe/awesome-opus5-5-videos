import { clamp } from './math.js';

export const DURATION = 30;
export const OVERLAP = 0.6;

// Guion de spec.md §4.1. Cada escena entra con un fundido de OVERLAP s sobre la anterior.
export const SCENES = [
  { id: 'papel', start: 0, end: 4 + OVERLAP / 2 },
  { id: 'gota', start: 4 - OVERLAP / 2, end: 11 + OVERLAP / 2 },
  { id: 'cordoba', start: 11 - OVERLAP / 2, end: 19 + OVERLAP / 2 },
  { id: 'fluye', start: 19 - OVERLAP / 2, end: 26 + OVERLAP / 2 },
  { id: 'cierre', start: 26 - OVERLAP / 2, end: DURATION },
];

export const progress = (t, a, b) => clamp((t - a) / (b - a));

export function sceneWeights(t) {
  const w = {};
  for (const [i, s] of SCENES.entries()) {
    const fadeIn = i === 0 ? 1 : progress(t, s.start, s.start + OVERLAP);
    const alive = t >= s.start && (t < s.end || i === SCENES.length - 1);
    w[s.id] = alive ? fadeIn : 0;
  }
  return w;
}
