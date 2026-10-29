import { PALETTE } from '../config.js';
import { pencil, wobbleFill, resample, arc } from './pencil.js';

export const HORIZON = 860;
const DECK_TOP = 1000, DECK_BOT = 1040, SPRING = 1095, WATER = 1170;

// Puente Romano: tablero + arcos de medio punto + tajamares.
const PIERS = [70, 190, 300, 410, 520, 640, 760, 880, 1010];
const PIER_W = 34;

function bridgeOutline() {
  const pts = [[40, DECK_TOP], [1040, DECK_TOP], [1040, WATER]];
  for (let i = PIERS.length - 1; i > 0; i--) {
    const right = PIERS[i] - PIER_W / 2, left = PIERS[i - 1] + PIER_W / 2;
    const cx = (left + right) / 2, rx = (right - left) / 2;
    pts.push([right, WATER], [right, SPRING], ...arc(cx, SPRING, rx, rx * 0.95, 0, -Math.PI, 18).slice(1), [left, WATER]);
  }
  pts.push([40, WATER]);
  return pts;
}

function bridgeStrokes() {
  const strokes = [
    resample([[40, DECK_TOP], [1040, DECK_TOP]], 8),
    resample([[40, DECK_BOT], [1040, DECK_BOT]], 8),
  ];
  for (let i = 1; i < PIERS.length; i++) {
    const right = PIERS[i] - PIER_W / 2, left = PIERS[i - 1] + PIER_W / 2;
    const cx = (left + right) / 2, rx = (right - left) / 2;
    strokes.push(resample([[left, WATER], [left, SPRING], ...arc(cx, SPRING, rx, rx * 0.95, Math.PI, 2 * Math.PI, 18), [right, WATER]], 7));
  }
  // Tajamares (los picos de los pilares contra la corriente).
  for (const p of PIERS.slice(1, -1)) strokes.push(resample([[p - PIER_W / 2, WATER], [p, WATER + 34], [p + PIER_W / 2, WATER]], 6));
  return strokes;
}

// Torre campanario + muro almenado de la Mezquita, en el horizonte.
function mezquitaOutline() {
  const b = HORIZON;
  const pts = [[110, b], [110, b - 56]];
  for (let x = 110; x < 250; x += 20) pts.push([x + 5, b - 56], [x + 10, b - 68], [x + 15, b - 56], [x + 20, b - 56]);
  pts.push([262, b - 56], [262, b - 160], [252, b - 160], [252, b - 172], [270, b - 172], [270, b - 215],
    [276, b - 215], [276, b - 246], [281, b - 260], [286, b - 266], [292, b - 284], [298, b - 266], [303, b - 260], [308, b - 246],
    [308, b - 215], [314, b - 215], [314, b - 172], [332, b - 172], [332, b - 160], [322, b - 160], [322, b - 56]);
  for (let x = 322; x < 540; x += 20) pts.push([x + 5, b - 56], [x + 10, b - 68], [x + 15, b - 56], [x + 20, b - 56]);
  pts.push([560, b - 56], [560, b]);
  return pts;
}

const BRIDGE = bridgeOutline();
const BRIDGE_STROKES = bridgeStrokes();
const MEZQUITA = mezquitaOutline();
const MEZQUITA_STROKE = resample(MEZQUITA, 7);
const HORIZON_L = resample([[0, HORIZON + 4], [380, HORIZON], [520, HORIZON + 6]], 8);
const HORIZON_R = resample([[700, HORIZON + 6], [860, HORIZON - 2], [1080, HORIZON + 3]], 8);
const BANK = resample([[0, 1690], [200, 1715], [400, 1770], [520, 1850], [560, 1920]], 8);
const LAND = [...BANK, [0, 1920]];
export const bankY = (x) => {
  for (let k = 1; k < BANK.length; k++) if (BANK[k][0] >= x) {
    const [ax, ay] = BANK[k - 1], [bx, by] = BANK[k];
    return ay + ((by - ay) * (x - ax)) / (bx - ax || 1);
  }
  return BANK.at(-1)[1];
};
const RIPPLES = [
  [[180, 1200], [260, 1196], [330, 1201]], [[620, 1210], [700, 1205], [760, 1211]],
  [[420, 1250], [520, 1246]], [[760, 1290], [900, 1286]], [[90, 1300], [200, 1296]],
].map((p) => resample(p, 6));

// draw = 0..1 revela los trazos; fill = 0..1 rellena las masas.
// ground: la orilla donde se sienta la banda, con su propio fundido.
export function drawCordoba(ctx, t, { draw = 1, fill = 1, alpha = 1, ground = alpha }) {
  const ink = PALETTE.papel;
  ctx.save();
  ctx.globalAlpha *= alpha;

  wobbleFill(ctx, MEZQUITA, { t, seed: 3, amp: 1.2, color: PALETTE.carbon, alpha: fill * 0.85 });
  pencil(ctx, MEZQUITA_STROKE, { t, seed: 4, reveal: draw * 1.3 - 0.15, width: 3, color: ink, amp: 1.2 });
  pencil(ctx, HORIZON_L, { t, seed: 5, reveal: draw * 1.6, width: 2.5, color: ink, alpha: 0.8 });
  pencil(ctx, HORIZON_R, { t, seed: 6, reveal: draw * 1.6 - 0.3, width: 2.5, color: ink, alpha: 0.8 });

  wobbleFill(ctx, BRIDGE, { t, seed: 7, amp: 1.4, color: PALETTE.grafito, alpha: fill * 0.96 });
  BRIDGE_STROKES.forEach((s, i) =>
    pencil(ctx, s, { t, seed: 10 + i, reveal: draw * 2.2 - i * 0.07, width: i < 2 ? 3.5 : 3, color: ink, amp: 1.6 }));
  RIPPLES.forEach((s, i) =>
    pencil(ctx, s, { t, seed: 40 + i, reveal: draw * 2 - 0.8 - i * 0.1, width: 2, color: ink, alpha: 0.55, amp: 2.5 }));

  ctx.restore();

  ctx.save();
  ctx.globalAlpha *= ground;
  wobbleFill(ctx, LAND, { t, seed: 49, amp: 1.5, color: PALETTE.carbon, alpha: fill * 0.92 });
  pencil(ctx, BANK, { t, seed: 50, reveal: draw * 1.5 - 0.3, width: 3, color: ink, alpha: 0.85 });
  ctx.restore();
}
