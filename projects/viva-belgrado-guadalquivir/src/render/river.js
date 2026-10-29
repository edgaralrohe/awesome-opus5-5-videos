import { mulberry32 } from '../lib/rng.js';
import { lerp } from '../lib/math.js';
import { createSoftSprite } from './background.js';

export function createRiverRenderer(river, seed) {
  const sprite = createSoftSprite(128);
  // Destino de cada punto cuando el río sube al cielo (escena «Fluye»).
  const r = mulberry32(seed + 404);
  const sky = Array.from({ length: river.count }, () => {
    const a = r() * Math.PI * 2, d = r() ** 0.7;
    return { x: 540 + Math.cos(a) * d * 430 + (r() - 0.5) * 80, y: 600 + Math.sin(a) * d * 300, k: 0.6 + r() * 0.4 };
  });

  // visible(d) → 0..1 decide qué puntos se ven (la gota abre el río desde el impacto).
  return function drawRiver(ctx, t, { visible = () => 1, rise = 0, alpha = 1 } = {}) {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (const d of river.dotsAt(t)) {
      const v = visible(d) * alpha;
      if (v <= 0.01) continue;
      const s = sky[d.i], k = rise * s.k;
      const x = lerp(d.x, s.x, k), y = lerp(d.y, s.y, k);
      const size = d.r * 7;
      ctx.globalAlpha = v * d.a;
      ctx.drawImage(sprite, x - size / 2, y - size / 2, size, size);
    }
    ctx.restore();
  };
}

// Gota con squash & stretch. `stretch` > 1 la alarga en vertical; < 1 la aplasta.
export function drawDrop(ctx, x, y, radius, stretch, sprite, alpha = 1) {
  const sx = 1 / Math.sqrt(stretch), sy = Math.sqrt(stretch);
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(sx, sy);
  ctx.globalCompositeOperation = 'lighter';
  ctx.globalAlpha = alpha;
  const s = radius * 8;
  ctx.drawImage(sprite, -s / 2, -s / 2, s, s);
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}
