import { PALETTE } from '../../config.js';
import { ease, clamp } from '../../lib/math.js';
import { createRiver } from '../../lib/river.js';
import { createBackground } from '../../render/background.js';
import { createRiverRenderer } from '../../render/river.js';
import { drawCover } from '../images.js';
import { TRACKLIST } from '../script.js';

const S = 800;

// Portada: la imagen real si existe; si no, una evocación procedural
// (nube gris + constelación que baja + etiqueta mG fff).
export function createCover(img, seed) {
  if (img) {
    return (ctx, x, y, size) => {
      ctx.save();
      drawCover(ctx, img, x, y, size, size);
      ctx.restore();
    };
  }
  const base = Object.assign(document.createElement('canvas'), { width: S, height: S });
  const g = base.getContext('2d');
  createBackground(S, S, seed + 3)(g, 0, 0);
  g.fillStyle = PALETTE.papel;
  g.globalAlpha = 0.12;
  g.fillRect(0, 0, S, S);
  g.globalAlpha = 1;
  const river = createRiver({
    points: [[600, -30], [560, 160], [440, 310], [530, 440], [620, 560], [520, 700], [400, 820], [480, 940], [560, 1100]],
    count: 95, seed: seed + 8,
  });
  const drawDots = createRiverRenderer(river, seed + 8);

  return (ctx, x, y, size, t) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(size / S, size / S);
    ctx.beginPath();
    ctx.rect(0, 0, S, S);
    ctx.clip();
    ctx.drawImage(base, 0, 0);
    ctx.scale(0.75, 0.75);
    drawDots(ctx, t);
    ctx.restore();

    // Etiqueta blanca con el monograma, como en la portada.
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(size / S, size / S);
    ctx.fillStyle = PALETTE.papel;
    ctx.fillRect(34, 34, 92, 120);
    ctx.fillStyle = PALETTE.carbon;
    ctx.font = '700 34px Inter, sans-serif';
    ctx.fillText('mG', 44, 74);
    ctx.font = 'italic 400 38px "Instrument Serif", serif';
    ctx.fillText('fff', 50, 106);
    ctx.fillRect(44, 122, 70, 3);
    ctx.fillRect(44, 132, 54, 3);
    ctx.fillRect(44, 142, 62, 3);
    ctx.restore();
  };
}

// Tracklist que se escribe línea a línea; `highlight` resalta un tema con marcador.
export function drawTracklist(ctx, t, { start, x, y, highlight, highlightStart, alpha = 1 }) {
  ctx.save();
  ctx.textBaseline = 'alphabetic';
  TRACKLIST.forEach((name, i) => {
    const p = clamp((t - start - i * 0.12) / 0.35);
    if (p <= 0) return;
    const ly = y + i * 44;
    const dx = (1 - ease.outCubic(p)) * 30;
    ctx.globalAlpha = alpha * p;
    ctx.font = '700 26px Inter, sans-serif';
    ctx.fillStyle = PALETTE.niebla;
    ctx.fillText(String(i + 1).padStart(2, '0'), x + dx, ly);
    ctx.font = '500 32px Inter, sans-serif';
    const w = ctx.measureText(name).width;
    const isHi = name === highlight && t >= highlightStart;
    if (isHi) {
      const m = ease.outCubic(clamp((t - highlightStart - 0.3) / 0.35));
      ctx.fillStyle = PALETTE.papel;
      ctx.fillRect(x + 46 + dx - 6, ly - 30, (w + 12) * m, 40);
    }
    ctx.fillStyle = isHi ? PALETTE.carbon : PALETTE.papel;
    ctx.fillText(name, x + 46 + dx, ly);
  });
  ctx.restore();
}
