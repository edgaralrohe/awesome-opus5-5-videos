import { WIDTH, HEIGHT, SEED } from '../config.js';
import { mulberry32 } from './rng.js';

// Curva de la constelación de la portada: densa arriba, serpentea hacia abajo.
export const CONTROL_POINTS = [
  [640, -30], [560, 240], [470, 470], [560, 700], [700, 900],
  [610, 1120], [430, 1320], [500, 1540], [650, 1740], [560, 1950],
];

function catmullRom(p0, p1, p2, p3, t) {
  const t2 = t * t, t3 = t2 * t;
  const f = (a, b, c, d) =>
    0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
  return [f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1])];
}

export function createRiver({ points = CONTROL_POINTS, count = 150, seed = SEED } = {}) {
  // Muestreo denso de la spline y tabla de longitud de arco acumulada.
  const samples = [];
  const segs = points.length - 1;
  const perSeg = 200;
  for (let s = 0; s < segs; s++) {
    const p0 = points[Math.max(0, s - 1)], p1 = points[s];
    const p2 = points[s + 1], p3 = points[Math.min(points.length - 1, s + 2)];
    for (let k = 0; k < perSeg; k++) samples.push(catmullRom(p0, p1, p2, p3, k / perSeg));
  }
  samples.push(points.at(-1));

  const cum = [0];
  for (let i = 1; i < samples.length; i++) {
    const [ax, ay] = samples[i - 1], [bx, by] = samples[i];
    cum.push(cum[i - 1] + Math.hypot(bx - ax, by - ay));
  }
  const length = cum.at(-1);

  function pointAt(u) {
    const target = Math.min(1, Math.max(0, u)) * length;
    let lo = 0, hi = cum.length - 1;
    while (hi - lo > 1) {
      const mid = (lo + hi) >> 1;
      if (cum[mid] < target) lo = mid; else hi = mid;
    }
    const span = cum[hi] - cum[lo] || 1;
    const k = (target - cum[lo]) / span;
    const [ax, ay] = samples[lo], [bx, by] = samples[hi];
    const tx = (bx - ax) / (Math.hypot(bx - ax, by - ay) || 1);
    const ty = (by - ay) / (Math.hypot(bx - ax, by - ay) || 1);
    return { x: ax + (bx - ax) * k, y: ay + (by - ay) * k, nx: -ty, ny: tx };
  }

  // Cada punto de luz: fase, velocidad, deriva lateral y brillo propios.
  const rand = mulberry32(seed);
  const dots = Array.from({ length: count }, (_, i) => ({
    i,
    phase: rand(),
    speed: 0.016 + rand() * 0.014,
    offset: (rand() * 2 - 1) ** 3 * 90,
    sway: 4 + rand() * 14,
    swayFreq: 0.3 + rand() * 0.8,
    r: rand() < 0.12 ? 7 + rand() * 5 : 2.5 + rand() * 4,
    twinkle: rand() * Math.PI * 2,
  }));

  function dotsAt(t) {
    return dots.map((d) => {
      const u = (d.phase + d.speed * t) % 1;
      const p = pointAt(u);
      const off = d.offset + Math.sin(t * d.swayFreq * 2 * Math.PI + d.twinkle) * d.sway;
      const x = Math.min(WIDTH, Math.max(0, p.x + p.nx * off));
      const y = Math.min(HEIGHT + 50, Math.max(-50, p.y + p.ny * off));
      const a = 0.55 + 0.45 * Math.sin(t * 2.1 + d.twinkle);
      return { i: d.i, u, x, y, r: d.r, a };
    });
  }

  return { pointAt, dotsAt, length, count };
}
