import { boilFrame } from '../lib/boil.js';
import { hash2 } from '../lib/rng.js';

const TAU = Math.PI * 2;

// Polilínea → puntos cada `step` px, para que el boil y el revelado sean uniformes.
export function resample(points, step = 6) {
  const out = [points[0]];
  for (let i = 1; i < points.length; i++) {
    const [ax, ay] = points[i - 1], [bx, by] = points[i];
    const n = Math.max(1, Math.ceil(Math.hypot(bx - ax, by - ay) / step));
    for (let k = 1; k <= n; k++) out.push([ax + ((bx - ax) * k) / n, ay + ((by - ay) * k) / n]);
  }
  return out;
}

export function arc(cx, cy, rx, ry, a0, a1, n = 28) {
  return Array.from({ length: n + 1 }, (_, k) => {
    const a = a0 + ((a1 - a0) * k) / n;
    return [cx + Math.cos(a) * rx, cy + Math.sin(a) * ry];
  });
}

// Desplazamiento de baja frecuencia que cambia a 12 fps: el temblor del lápiz.
export function wobble(pts, t, seed, amp = 2) {
  const f = boilFrame(t);
  const p1 = hash2(seed, f) * TAU, p2 = hash2(seed + 911, f) * TAU;
  return pts.map(([x, y], k) => [
    x + amp * (Math.sin(k * 0.09 + p1) + 0.45 * Math.sin(k * 0.31 + p2)),
    y + amp * (Math.cos(k * 0.07 + p2) + 0.45 * Math.cos(k * 0.27 + p1)),
  ]);
}

export function tracePath(ctx, pts, close = false) {
  ctx.moveTo(pts[0][0], pts[0][1]);
  for (let k = 1; k < pts.length; k++) ctx.lineTo(pts[k][0], pts[k][1]);
  if (close) ctx.closePath();
}

// Trazo de lápiz: dos pasadas desfasadas + revelado progresivo (0..1).
export function pencil(ctx, pts, { t, seed = 0, reveal = 1, width = 3, color, alpha = 1, amp = 2, passes = 2 }) {
  if (reveal <= 0 || alpha <= 0) return;
  const n = Math.max(2, Math.round(pts.length * Math.min(1, reveal)));
  const part = pts.slice(0, n);
  const base = ctx.globalAlpha; // respeta el fundido de la capa que llama
  ctx.save();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.strokeStyle = color;
  for (let p = 0; p < passes; p++) {
    const w = wobble(part, t, seed * 31 + p * 7, amp * (p ? 0.8 : 1));
    ctx.beginPath();
    tracePath(ctx, w);
    ctx.globalAlpha = base * alpha * (p ? 0.4 : 0.9);
    ctx.lineWidth = width * (p ? 0.55 : 1);
    ctx.stroke();
  }
  ctx.restore();
}

// Relleno con el mismo temblor que el contorno.
export function wobbleFill(ctx, pts, { t, seed = 0, amp = 2, color, alpha = 1 }) {
  if (alpha <= 0) return;
  ctx.save();
  ctx.globalAlpha *= alpha;
  ctx.fillStyle = color;
  ctx.beginPath();
  tracePath(ctx, wobble(pts, t, seed * 31, amp), true);
  ctx.fill();
  ctx.restore();
}
