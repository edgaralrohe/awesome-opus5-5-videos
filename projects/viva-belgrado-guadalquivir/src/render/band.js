import { PALETTE } from '../config.js';
import { ease, clamp } from '../lib/math.js';
import { pencil, wobbleFill, arc, resample } from './pencil.js';

// Cuatro figuras cartoon de espaldas, sentadas en la orilla mirando el río.
// Sin rasgos faciales: se reconocen por la silueta (gorra, melena corta, rayas).
const BODY = [[-50, 0], [-49, -70], ...arc(-18, -96, 32, 34, Math.PI, Math.PI * 1.5, 10), [18, -130],
  ...arc(18, -96, 32, 34, Math.PI * 1.5, Math.PI * 2, 10), [49, -70], [50, 0]];
const BODY_STROKE = resample(BODY, 6);
const HEAD = (r) => arc(0, -162, r, r * 1.04, 0, Math.PI * 2, 30);

const FIGURES = [
  { id: 'barba', body: PALETTE.grafito, head: 33 },
  { id: 'melena', body: PALETTE.grafito, head: 30, bob: true, arms: true },
  { id: 'gorra', body: PALETTE.niebla, head: 31, stripes: true, cap: true },
  { id: 'bigote', body: PALETTE.grafito, head: 31, collar: true },
];

const BEAT = 2.0; // Hz (~120 bpm): el cabeceo de la banda.

export function drawBand(ctx, t, { start, positions, scale = 1, lookUp = 0, lean = 0, alpha = 1 }) {
  if (alpha <= 0) return;
  const ink = PALETTE.papel;
  FIGURES.forEach((f, i) => {
    const pop = clamp((t - start - i * 0.22) / 0.6);
    if (pop <= 0) return;
    const [x, y] = positions[i];
    const s = ease.outBack(pop) * scale;
    const sway = Math.sin(t * 1.3 + i * 1.7) * 0.025;
    const bob = Math.max(0, Math.sin((t * BEAT + i * 0.25) * Math.PI * 2)) * 5;
    const seed = 100 + i * 20;

    ctx.save();
    ctx.globalAlpha *= alpha;
    ctx.translate(x, y);
    ctx.rotate(sway);
    ctx.scale(s * (1 + (1 - pop) * 0.15), s); // un poco de squash al aparecer

    // Brazos desnudos (camiseta de tirantes).
    if (f.arms) {
      for (const side of [-1, 1]) {
        const arm = resample([[side * 46, -92], [side * 56, -40], [side * 50, -6]], 6);
        pencil(ctx, arm, { t, seed: seed + 9 + side, width: 13, color: PALETTE.niebla, amp: 1, passes: 1 });
      }
    }
    wobbleFill(ctx, BODY, { t, seed, amp: 1.3, color: f.body });
    if (f.stripes) {
      ctx.save();
      ctx.beginPath();
      BODY.forEach(([px, py], k) => (k ? ctx.lineTo(px, py) : ctx.moveTo(px, py)));
      ctx.clip();
      for (let sy = -120; sy < 0; sy += 13) {
        pencil(ctx, resample([[-60, sy], [60, sy + 2]], 8), { t, seed: seed + sy, width: 5, color: PALETTE.carbon, amp: 0.8, passes: 1 });
      }
      ctx.restore();
    }
    if (f.collar) pencil(ctx, resample([[-20, -128], [-4, -104], [0, -128]], 5), { t, seed: seed + 3, width: 2.5, color: ink, alpha: 0.7 });
    pencil(ctx, BODY_STROKE, { t, seed: seed + 1, width: 3, color: ink, amp: 1.3 });

    // Cabeza: inclinación propia (mirar al cielo / apoyarse en el de al lado).
    const tilt = (i === 3 ? -lookUp * 10 : 0) + (i === 1 ? lean * 14 : 0);
    ctx.save();
    ctx.translate(i === 1 ? lean * 10 : 0, -bob - (i === 3 ? lookUp * 5 : 0));
    ctx.rotate((tilt * Math.PI) / 180);
    // Cuello y orejas (piel = niebla).
    wobbleFill(ctx, [[-11, -126], [-12, -140], [12, -140], [11, -126]], { t, seed: seed + 4, amp: 0.6, color: PALETTE.niebla });
    for (const side of [-1, 1]) {
      wobbleFill(ctx, arc(side * f.head, -160, 7, 10, 0, Math.PI * 2, 12), { t, seed: seed + 5 + side, amp: 0.6, color: PALETTE.niebla });
    }
    const head = HEAD(f.head);
    wobbleFill(ctx, head, { t, seed: seed + 6, amp: 1, color: PALETTE.carbon });
    if (f.bob) {
      // Melena corta: la nuca baja hasta el cuello.
      wobbleFill(ctx, [[-29, -165], [-27, -134], [-12, -128], [12, -128], [27, -134], [29, -165]], { t, seed: seed + 7, amp: 1, color: PALETTE.carbon });
    }
    if (f.cap) {
      const cap = arc(0, -166, f.head + 4, f.head + 2, Math.PI * 1.04, Math.PI * 1.96, 20);
      wobbleFill(ctx, [...cap, [f.head + 3, -160], [-f.head - 3, -160]], { t, seed: seed + 8, amp: 1, color: PALETTE.grafito });
      pencil(ctx, resample([[-f.head + 4, -150], [0, -146], [f.head - 4, -150]], 5), { t, seed: seed + 9, width: 2.5, color: ink, alpha: 0.8 });
      // Pelo asomando bajo la gorra.
      for (const side of [-1, 1]) {
        pencil(ctx, resample([[side * 24, -146], [side * 30, -132], [side * 26, -124]], 4), { t, seed: seed + 10 + side, width: 6, color: PALETTE.carbon, amp: 1, passes: 1 });
      }
    }
    pencil(ctx, resample(head, 5), { t, seed: seed + 11, width: 3, color: ink, amp: 1 });
    ctx.restore();
    ctx.restore();
  });
}
