import { hash2 } from './rng.js';

// Line boil: la línea se redibuja 12 veces por segundo ("animar a doses").
export const BOIL_FPS = 12;

export const boilFrame = (t) => Math.floor(t * BOIL_FPS + 1e-6);

export const jitter = (seed, frame, amp) => (hash2(seed, frame) * 2 - 1) * amp;
