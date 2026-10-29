import { PALETTE } from '../config.js';
import { ease, clamp } from '../lib/math.js';
import { pencil, resample } from '../render/pencil.js';
import { wrapLines } from './wrap.js';

const clean = (w) => w.replace(/[«»"“”¿?¡!.,:;…]/g, '');

// Tarjeta de texto: golpe de escala al cortar, palabras que entran con rebote,
// palabras de acento subrayadas a lápiz (mundo disco) o con marcador (mundo CR).
export function drawCard(ctx, card, t, o) {
  const local = t - card.start;
  if (local < 0 || t > card.end) return null;
  const {
    x, cy, maxW, size, family, weight = 400, fontStyle = 'normal', color, lineH = 1.12, align = 'left',
    accentMode = 'pencil', accentColor = PALETTE.papel, markerInk = PALETTE.carbon,
  } = o;
  ctx.save();
  ctx.font = `${fontStyle} ${weight} ${size}px ${family}`;
  const measure = (s) => ctx.measureText(s).width;
  const lines = wrapLines(card.text, maxW, measure);
  const blockH = size * lineH * (lines.length - 1) + size;
  const top = cy - blockH / 2;
  const kick = 1 + 0.06 * (1 - ease.outCubic(clamp(local / 0.25)));
  const fade = clamp((card.end - t) / 0.12);
  const accents = new Set((card.accent || []).map(clean));
  const space = measure(' ');

  ctx.translate(align === 'center' ? x : x + maxW / 2, cy);
  ctx.scale(kick, kick);
  ctx.translate(-(align === 'center' ? x : x + maxW / 2), -cy);

  let k = 0;
  lines.forEach((line, li) => {
    const lw = measure(line);
    let wx = align === 'center' ? x - lw / 2 : x;
    const by = top + size * 0.82 + li * size * lineH;
    for (const word of line.split(' ')) {
      const ww = measure(word);
      const p = clamp((local - k * 0.05) / 0.35);
      const dy = (1 - ease.outBack(p)) * size * 0.35;
      const a = ease.outCubic(p) * fade;
      const isAccent = accents.has(clean(word));
      const mark = clamp((local - 0.3 - k * 0.05) / 0.3);
      ctx.globalAlpha = a;
      if (isAccent && accentMode === 'marker' && mark > 0) {
        ctx.fillStyle = accentColor;
        ctx.fillRect(wx - 8, by - size * 0.8 + dy, (ww + 16) * ease.outCubic(mark), size * 0.98);
      }
      ctx.fillStyle = isAccent && accentMode === 'marker' && mark > 0.5 ? markerInk : color;
      ctx.fillText(word, wx, by + dy);
      if (isAccent && accentMode === 'pencil') {
        pencil(ctx, resample([[wx, by + size * 0.16], [wx + ww / 2, by + size * 0.2], [wx + ww, by + size * 0.14]], 5),
          { t, seed: 300 + k, reveal: ease.outCubic(mark), width: 4, color: accentColor, alpha: a, amp: 2 });
      }
      wx += ww + space;
      k++;
    }
  });
  ctx.restore();
  return { top, bottom: top + blockH };
}

// Sello para datos que aún no han llegado: imposible publicarlo sin darse cuenta.
export function drawPendingStamp(ctx, x, y, t, local) {
  const p = clamp((local - 0.2) / 0.3);
  if (p <= 0) return;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(-0.12);
  const s = 1.6 - 0.6 * ease.outBack(p);
  ctx.scale(s, s);
  ctx.globalAlpha = p * 0.92;
  ctx.font = '700 56px Inter, sans-serif';
  ctx.textAlign = 'center';
  const w = ctx.measureText('PENDIENTE').width + 48;
  pencil(ctx, resample([[-w / 2, -50], [w / 2, -50], [w / 2, 22], [-w / 2, 22], [-w / 2, -50]], 8),
    { t, seed: 700, width: 6, color: '#ff5a4f', amp: 1.5 });
  ctx.fillStyle = '#ff5a4f';
  ctx.fillText('PENDIENTE', 0, 0);
  ctx.restore();
}
