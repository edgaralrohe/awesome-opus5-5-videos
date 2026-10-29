import { WIDTH, HEIGHT } from '../../config.js';
import { ease, clamp } from '../../lib/math.js';
import { mulberry32 } from '../../lib/rng.js';
import { boilFrame, jitter } from '../../lib/boil.js';
import { pencil, resample } from '../../render/pencil.js';
import { CR } from '../theme.js';

// Fondo «ruidoso»: manchas de color que derivan y laten con el pulso.
export function createCRBackground(seed) {
  const r = mulberry32(seed + 77);
  const blobs = CR.colors.flatMap((c) => [0, 1].map(() => ({
    c, x: r() * WIDTH, y: r() * HEIGHT, rad: 380 + r() * 360, fx: 0.05 + r() * 0.12, fy: 0.04 + r() * 0.1, ph: r() * 6.28,
  })));
  const squiggles = Array.from({ length: 6 }, (_, i) => {
    const x0 = r() * WIDTH, y0 = r() * HEIGHT;
    return resample(Array.from({ length: 30 }, (_, k) => [x0 + k * 14, y0 + Math.sin(k * 0.8 + i) * 26]), 6);
  });

  return function drawCRBackground(ctx, t, beat) {
    ctx.fillStyle = CR.base;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    const pulse = 1 + 0.05 * (1 - beat) ** 3;
    ctx.save();
    for (const b of blobs) {
      const x = b.x + Math.sin(t * b.fx * 6.28 + b.ph) * 160;
      const y = b.y + Math.cos(t * b.fy * 6.28 + b.ph) * 220;
      const rad = b.rad * pulse;
      const g = ctx.createRadialGradient(x, y, 0, x, y, rad);
      g.addColorStop(0, b.c);
      g.addColorStop(1, `${b.c}00`);
      ctx.globalAlpha = 0.62;
      ctx.fillStyle = g;
      ctx.fillRect(x - rad, y - rad, rad * 2, rad * 2);
    }
    ctx.restore();
    squiggles.forEach((s, i) => pencil(ctx, s, { t, seed: 900 + i, width: 5, color: CR.ink, alpha: 0.18, amp: 4 }));
    // Velo central para que el texto se lea siempre.
    const v = ctx.createLinearGradient(0, 0, 0, HEIGHT);
    v.addColorStop(0, `${CR.base}55`);
    v.addColorStop(0.5, `${CR.base}aa`);
    v.addColorStop(1, `${CR.base}55`);
    ctx.fillStyle = v;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
  };
}

// «9 / 10»: el número cuenta hasta 9 y aterriza con rebote.
export function drawScore(ctx, t, { start, cx, cy, scale = 1, beat = 1 }) {
  const p = clamp((t - start) / 0.9);
  if (p <= 0) return;
  const n = Math.min(9, Math.floor(ease.outCubic(p) * 9.999));
  const pop = ease.outBack(clamp((t - start - 0.75) / 0.4));
  const s = scale * (0.85 + 0.15 * pop) * (1 + 0.02 * (1 - beat) ** 3);
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(s, s);
  ctx.textAlign = 'center';
  ctx.fillStyle = CR.highlight;
  ctx.font = '700 620px Inter, sans-serif';
  ctx.fillText(String(n), -90, 200);
  ctx.fillStyle = CR.ink;
  ctx.font = '700 150px Inter, sans-serif';
  ctx.fillText('/ 10', 250, 200);
  ctx.restore();
}

// Logo: imagen si existe; si no, palabra «ruidosa» (cada letra de un color, temblando).
export function drawLogo(ctx, t, { img, cx, cy, start }) {
  const p = ease.outBack(clamp((t - start) / 0.6));
  if (p <= 0) return;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(p, p);
  if (img) {
    const w = 640, h = (img.height / img.width) * w;
    ctx.drawImage(img, -w / 2, -h / 2, w, h);
  } else {
    ctx.font = '700 150px Inter, sans-serif';
    ctx.letterSpacing = '-4px';
    const f = boilFrame(t);
    ['COLORES', 'RUIDOSOS'].forEach((word, li) => {
      const w = ctx.measureText(word).width;
      let x = -w / 2;
      [...word].forEach((ch, k) => {
        ctx.fillStyle = CR.colors[(k + li) % CR.colors.length];
        ctx.fillText(ch, x + jitter(k + li * 20, f, 3), (li - 0.5) * 150 + 55 + jitter(k * 3 + li, f, 4));
        x += ctx.measureText(ch).width - 4;
      });
    });
  }
  ctx.restore();
}
