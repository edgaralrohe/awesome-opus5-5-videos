import { resample } from './pencil.js';

// Flecha a lápiz como las de los carteles: curva cuadrática + punta.
export function arrowPath([x0, y0], [cx, cy], [x1, y1]) {
  const pts = Array.from({ length: 40 }, (_, i) => {
    const k = i / 39, a = (1 - k) ** 2, b = 2 * (1 - k) * k, c = k * k;
    return [a * x0 + b * cx + c * x1, a * y0 + b * cy + c * y1];
  });
  const ang = Math.atan2(y1 - cy, x1 - cx);
  const head = (d) => [x1 - Math.cos(ang + d) * 34, y1 - Math.sin(ang + d) * 34];
  return { line: resample(pts, 6), head: resample([head(0.5), [x1, y1], head(-0.5)], 4) };
}

// Garabato de caligrafía rápida (las anotaciones «tour», «flo» de los carteles).
export function loopScribble(x, y, width, loops = 5, height = 46) {
  const n = loops * 24;
  return resample(Array.from({ length: n + 1 }, (_, i) => {
    const k = i / n, a = k * loops * Math.PI * 2;
    return [x + k * width + Math.cos(a) * height * 0.35, y - Math.abs(Math.sin(a * 0.5)) * height + Math.sin(a) * 8];
  }), 5);
}
