import { PALETTE } from '../../config.js';
import { ease, clamp } from '../../lib/math.js';
import { mulberry32 } from '../../lib/rng.js';
import { pencil, resample, wobbleFill } from '../../render/pencil.js';

const X = 110, Y = 280, W = 860, H = 880;
// Tres párrafos: cada dato (T13–T15) resalta el suyo.
const PARAS = [[3, 6], [7, 10], [11, 14]];

export function createNewsletter(seed) {
  const r = mulberry32(seed + 61);
  const lines = Array.from({ length: 15 }, (_, i) => ({
    y: Y + 190 + i * 44,
    w: i === 2 || i === 6 || i === 10 ? 0 : (0.55 + r() * 0.4) * (W - 120),
  }));
  const sheet = [[X, Y], [X + W, Y], [X + W, Y + H], [X, Y + H]];

  // focus: índice del párrafo resaltado (−1 ninguno) y su tiempo de inicio.
  return function drawNewsletter(ctx, t, { enter, focus = -1, focusStart = 0, alpha = 1 }) {
    const p = clamp((t - enter) / 0.5);
    if (p <= 0 || alpha <= 0) return;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(540, 720 + (1 - ease.outBack(p)) * 900);
    ctx.rotate(-0.025);
    ctx.translate(-540, -720);

    ctx.fillStyle = '#0006';
    ctx.fillRect(X + 14, Y + 18, W, H);
    wobbleFill(ctx, sheet, { t, seed: 500, amp: 0.8, color: PALETTE.papel });
    ctx.fillStyle = PALETTE.carbon;
    ctx.font = '700 30px Inter, sans-serif';
    ctx.letterSpacing = '6px';
    ctx.fillText('NEWSLETTER', X + 60, Y + 90);
    ctx.letterSpacing = '0px';
    ctx.fillStyle = PALETTE.niebla;
    ctx.fillRect(X + 60, Y + 116, W - 120, 3);

    lines.forEach((l, i) => {
      if (!l.w) return;
      const [a, b] = PARAS[focus] || [-1, -1];
      const hi = i >= a && i <= b;
      if (hi) {
        const m = ease.outCubic(clamp((t - focusStart - (i - a) * 0.12) / 0.3));
        ctx.fillStyle = 'rgba(29,28,26,0.16)';
        ctx.fillRect(X + 52, l.y - 22, (l.w + 16) * m, 34);
      }
      ctx.fillStyle = hi ? PALETTE.carbon : PALETTE.niebla;
      ctx.fillRect(X + 60, l.y - 10, l.w, 12);
    });
    if (focus >= 0) {
      const [a, b] = PARAS[focus];
      const y0 = lines[a].y - 26, y1 = lines[b].y + 16;
      pencil(ctx, resample([[X + 40, y0], [X + 26, y0], [X + 26, y1], [X + 40, y1]], 6),
        { t, seed: 520 + focus, reveal: ease.outCubic(clamp((t - focusStart) / 0.4)), width: 5, color: PALETTE.carbon, amp: 1.5 });
    }
    ctx.restore();
  };
}
