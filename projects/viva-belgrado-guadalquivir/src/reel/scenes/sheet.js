import { PALETTE } from '../../config.js';
import { ease, clamp } from '../../lib/math.js';
import { progress } from '../../lib/timeline.js';
import { mulberry32 } from '../../lib/rng.js';
import { pencil, resample, wobbleFill, arc } from '../../render/pencil.js';
import { PRESENTACION, GIRA_2027 } from '../script.js';

const X = 110, Y = 280, W = 860, H = 880;
const SHEET = [[X, Y], [X + W, Y], [X + W, Y + H], [X, Y + H]];
// «Lo que la banda dice»: tres párrafos; cada tarjeta (T13–T15) resalta el suyo.
const PARAS = [[3, 6], [7, 10], [11, 14]];
const highlight = (ctx, t, start, x, y, w, h, delay = 0) => {
  const m = ease.outCubic(clamp((t - start - delay) / 0.3));
  if (m <= 0) return;
  ctx.fillStyle = 'rgba(29,28,26,0.16)';
  ctx.fillRect(x, y, w * m, h);
};

function paper(ctx, t, label, seed) {
  ctx.fillStyle = '#0006';
  ctx.fillRect(X + 14, Y + 18, W, H);
  wobbleFill(ctx, SHEET, { t, seed, amp: 0.8, color: PALETTE.papel });
  ctx.fillStyle = PALETTE.carbon;
  ctx.font = '700 30px Inter, sans-serif';
  ctx.letterSpacing = '6px';
  ctx.fillText(label, X + 60, Y + 90);
  ctx.letterSpacing = '0px';
  ctx.fillStyle = PALETTE.niebla;
  ctx.fillRect(X + 60, Y + 116, W - 120, 3);
}

export function createSheets(seed) {
  const r = mulberry32(seed + 61);
  const lines = Array.from({ length: 15 }, (_, i) => ({
    y: Y + 190 + i * 44,
    w: i === 2 || i === 6 || i === 10 ? 0 : (0.55 + r() * 0.4) * (W - 120),
  }));

  function interview(ctx, t, focus, focusStart) {
    paper(ctx, t, 'LO QUE LA BANDA DICE', 500);
    const [a, b] = PARAS[focus] || [-1, -1];
    lines.forEach((l, i) => {
      if (!l.w) return;
      const hi = i >= a && i <= b;
      if (hi) highlight(ctx, t, focusStart, X + 52, l.y - 22, l.w + 16, 34, (i - a) * 0.12);
      ctx.fillStyle = hi ? PALETTE.carbon : PALETTE.niebla;
      ctx.fillRect(X + 60, l.y - 10, l.w, 12);
    });
    if (focus >= 0) {
      const y0 = lines[a].y - 26, y1 = lines[b].y + 16;
      pencil(ctx, resample([[X + 40, y0], [X + 26, y0], [X + 26, y1], [X + 40, y1]], 6),
        { t, seed: 520 + focus, reveal: ease.outCubic(clamp((t - focusStart) / 0.4)), width: 5, color: PALETTE.carbon, amp: 1.5 });
    }
  }

  // Cartel de gira: presentación en Barakaldo + fechas 2027 (focus 0 / 1), nota «Vernissage» (note).
  function tour(ctx, t, focus, focusStart, noteStart) {
    paper(ctx, t, 'EN DIRECTO', 540);
    const row = (date, city, y, dateSize = 30) => {
      ctx.fillStyle = PALETTE.carbon;
      ctx.font = `700 ${dateSize}px Inter, sans-serif`;
      ctx.fillText(date, X + 60, y);
      ctx.font = '400 46px "Instrument Serif", serif';
      ctx.fillText(city, X + 220, y + 2);
    };
    const y0 = Y + 190;
    if (focus === 0) highlight(ctx, t, focusStart, X + 48, y0 - 40, W - 96, 58);
    row(PRESENTACION.date, PRESENTACION.city, y0);
    ctx.font = '700 22px Inter, sans-serif';
    ctx.fillStyle = PALETTE.grafito;
    ctx.fillText(PRESENTACION.venue.toUpperCase(), X + 470, y0);

    ctx.fillStyle = PALETTE.carbon;
    ctx.font = '400 92px "Instrument Serif", serif';
    ctx.fillText('2027', X + W - 260, y0 + 110);
    GIRA_2027.forEach(([d, c], i) => {
      const y = y0 + 170 + i * 50;
      if (focus === 1) highlight(ctx, t, focusStart, X + 48, y - 34, W - 96, 46, i * 0.05);
      row(d, c, y, 26);
    });

    // Nota a lápiz: «Vernissage», rodeada como en los carteles.
    const p = clamp((t - noteStart) / 0.5);
    if (noteStart != null && p > 0) {
      ctx.save();
      ctx.translate(X + W - 190, y0 + 430);
      ctx.rotate(-0.12);
      ctx.globalAlpha *= ease.outCubic(p);
      ctx.fillStyle = PALETTE.carbon;
      ctx.font = 'italic 400 56px "Instrument Serif", serif';
      ctx.textAlign = 'center';
      ctx.fillText('Vernissage', 0, 0);
      ctx.font = '700 20px Inter, sans-serif';
      ctx.fillText('ENCUENTROS CON FANS', 0, 34);
      pencil(ctx, resample(arc(0, 0, 140, 60, -2.6, 3.7, 40), 6),
        { t, seed: 560, reveal: ease.outCubic(p), width: 4, color: PALETTE.carbon, amp: 2 });
      ctx.restore();
    }
  }

  // swapAt: cuándo la entrevista sale por la izquierda y entra el cartel de gira.
  return function drawSheets(ctx, t, { enter, swapAt, focus = -1, focusStart = 0, noteStart = null, alpha = 1 }) {
    const p = clamp((t - enter) / 0.5);
    if (p <= 0 || alpha <= 0) return;
    const outI = ease.inCubic(progress(t, swapAt - 0.1, swapAt + 0.35));
    const inG = ease.outBack(progress(t, swapAt - 0.05, swapAt + 0.45));
    const place = (dx, rot, draw) => {
      ctx.save();
      ctx.globalAlpha *= alpha;
      ctx.translate(540 + dx, 720 + (1 - ease.outBack(p)) * 900);
      ctx.rotate(rot);
      ctx.translate(-540, -720);
      draw();
      ctx.restore();
    };
    if (outI < 1) place(-1300 * outI, -0.025, () => interview(ctx, t, t < swapAt ? focus : -1, focusStart));
    if (inG > 0) place(1300 * (1 - inG), 0.02, () => tour(ctx, t, t >= swapAt ? focus : -1, focusStart, noteStart));
  };
}
