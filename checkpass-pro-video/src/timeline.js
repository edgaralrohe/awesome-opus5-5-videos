import { SCENES, DURATION } from './config.js';

export const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
export const linear = x => x;
export const easeInOutCubic = x => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
export const easeOutCubic = x => 1 - Math.pow(1 - x, 3);
export const easeOutBack = x => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); };

/** Mapea x del rango [a,b] a [c,d] con easing, acotado. */
export function interp(x, [a, b], [c, d], ease = linear) {
  const p = clamp((x - a) / (b - a), 0, 1);
  return c + (d - c) * ease(p);
}

export function sceneAt(t) {
  const tt = clamp(t, 0, DURATION);
  return SCENES.find(s => tt >= s.start && tt < s.end) ?? SCENES.at(-1);
}

export const sceneProgress = (scene, t) => clamp((t - scene.start) / (scene.end - scene.start), 0, 1);

/** Opacidad de entrada/salida de una escena (fade de `f` s). */
export function fadeInOut(scene, t, f = 0.4) {
  const first = scene.start === 0, last = scene.end === DURATION;
  const fin = first ? 1 : interp(t, [scene.start, scene.start + f], [0, 1], easeOutCubic);
  const fout = last ? 1 : interp(t, [scene.end - f, scene.end], [1, 0], easeInOutCubic);
  return Math.min(fin, fout);
}

export const counterAt = (t, t0, t1, v0, v1) => Math.round(interp(t, [t0, t1], [v0, v1], easeOutCubic));

/** Momentos (s) en que suena el bip de check-in: uno por invitado escaneado. */
export function checkinTimes() {
  const s = SCENES.find(x => x.id === 'scan');
  return [s.start + 1.35, s.start + 2.55, s.start + 3.75];
}
