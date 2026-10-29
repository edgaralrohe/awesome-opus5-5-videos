import { PALETTE, SAFE, WIDTH } from '../config.js';
import { ease, clamp } from '../lib/math.js';
import { jitter, boilFrame } from '../lib/boil.js';

export const SERIF = '"Instrument Serif", serif';
export const SANS = 'Inter, sans-serif';
const MAX_W = WIDTH - SAFE.x * 2;

// Tamaño máximo que cabe en `maxW` (para no salirse de la zona segura).
export function fitSize(ctx, text, family, size, maxW = MAX_W, weight = 400, style = 'normal') {
  ctx.font = `${style} ${weight} ${size}px ${family}`;
  const w = ctx.measureText(text).width;
  return w > maxW ? Math.floor((size * maxW) / w) : size;
}

// Texto que aparece como tinta: máscara con borde irregular que avanza de izquierda a derecha.
export function inkText(ctx, text, x, y, { t, size, family = SERIF, weight = 400, reveal = 1, alpha = 1, color = PALETTE.papel, seed = 0 }) {
  if (reveal <= 0 || alpha <= 0) return;
  ctx.save();
  ctx.font = `${weight} ${size}px ${family}`;
  const w = ctx.measureText(text).width;
  if (reveal < 1) {
    const edge = x - 40 + (w + 80) * reveal, f = boilFrame(t);
    ctx.beginPath();
    ctx.moveTo(x - 20, y - size * 1.2);
    for (let k = 0; k <= 12; k++) ctx.lineTo(edge + jitter(seed + k, f, 18), y - size * 1.2 + (size * 1.6 * k) / 12);
    ctx.lineTo(x - 20, y + size * 0.4);
    ctx.clip();
  }
  ctx.globalAlpha *= alpha;
  ctx.fillStyle = color;
  ctx.fillText(text, x, y);
  ctx.restore();
  return w;
}

// Letras que entran desde abajo con rebote; si `wave`, siguen ondulando como el agua.
export function popText(ctx, text, x, y, { t, start, size, family = SERIF, weight = 400, wave = false, alpha = 1, color = PALETTE.papel }) {
  ctx.save();
  ctx.font = `${weight} ${size}px ${family}`;
  ctx.fillStyle = color;
  const base = ctx.globalAlpha;
  let cx = x;
  [...text].forEach((ch, k) => {
    const p = clamp((t - start - k * 0.035) / 0.5);
    const dy = (1 - ease.outBack(p)) * size * 0.4 + (wave ? Math.sin(t * 3.2 - k * 0.7) * size * 0.06 * p : 0);
    ctx.globalAlpha = base * alpha * ease.outCubic(p);
    if (p > 0) ctx.fillText(ch, cx, y + dy);
    cx += ctx.measureText(ch).width;
  });
  ctx.restore();
  return cx - x;
}

// Título en tres golpes, con el escalonado de los carteles.
export function drawTitle(ctx, t, { start, alpha = 1, lift = 0 }) {
  if (alpha <= 0) return;
  const x = SAFE.x;
  const big = fitSize(ctx, 'Guadalquivir', SERIF, 156);
  const mid = fitSize(ctx, 'fluye y fluye', SERIF, 140, MAX_W - 110);
  const o = { t, alpha };
  popText(ctx, 'Mientras el', x, 1060 - lift, { ...o, start, size: 112 });
  popText(ctx, 'Guadalquivir', x, 1060 + big * 0.95 - lift, { ...o, start: start + 0.25, size: big });

  const y3 = 1060 + big * 0.95 + mid * 0.98 - lift, x3 = x + 110;
  const s2 = start + 1.4;
  let w = popText(ctx, 'fluye', x3, y3, { ...o, start: s2, size: mid, wave: true });
  w += popText(ctx, ' y ', x3 + w, y3, { ...o, start: s2 + 0.18, size: mid });
  popText(ctx, 'fluye', x3 + w, y3, { ...o, start: s2 + 0.3, size: mid, wave: true });

  const y4 = y3 + mid * 0.98, x4 = x + 260, s3 = start + 2.8;
  const w4 = popText(ctx, 'y ', x4, y4, { ...o, start: s3, size: mid });
  popText(ctx, 'fluye', x4 + w4, y4, { ...o, start: s3 + 0.1, size: mid, wave: true });
}

// Monograma «mG / fff» del disco, compuesto con tipografía.
export function drawMonogram(ctx, cx, y, t, { start, alpha = 1 }) {
  const p = clamp((t - start) / 0.7);
  if (p <= 0 || alpha <= 0) return;
  const s = ease.outBack(p);
  ctx.save();
  ctx.globalAlpha *= alpha * ease.outCubic(p);
  ctx.translate(cx, y);
  ctx.scale(s, s);
  ctx.fillStyle = PALETTE.papel;
  ctx.textAlign = 'center';
  ctx.font = `700 112px ${SANS}`;
  ctx.letterSpacing = '-6px';
  ctx.fillText('mG', 0, 0);
  ctx.font = `italic 400 128px ${SERIF}`;
  ctx.letterSpacing = '-6px';
  ctx.transform(1, 0, -0.18, 1, 0, 0);
  ctx.strokeStyle = PALETTE.papel;
  ctx.lineWidth = 4;
  ctx.fillText('fff', 0, 98);
  ctx.strokeText('fff', 0, 98);
  ctx.restore();
}
