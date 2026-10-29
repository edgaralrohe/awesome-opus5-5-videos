import { WIDTH, HEIGHT, PALETTE, SEED, SAFE } from './config.js';
import { DURATION, progress } from './lib/timeline.js';
import { ease, lerp, clamp } from './lib/math.js';
import { createRiver } from './lib/river.js';
import { createBackground, createGrainLayer, createSoftSprite } from './render/background.js';
import { createRiverRenderer, drawDrop } from './render/river.js';
import { drawCordoba, bankY } from './render/cordoba.js';
import { drawBand } from './render/band.js';
import { pencil, arc, resample } from './render/pencil.js';
import { arrowPath, loopScribble } from './render/scribble.js';
import { SERIF, SANS, fitSize, inkText, drawTitle, drawMonogram, popText } from './render/type.js';

const canvas = document.getElementById('stage');
canvas.width = WIDTH;
canvas.height = HEIGHT;
const ctx = canvas.getContext('2d');

let drawBackground, drawGrain, drawRiver, river, dropSprite, impact, arrow, scribbles, headerSize, band;

function build() {
  river = createRiver();
  drawBackground = createBackground(WIDTH, HEIGHT, SEED);
  drawGrain = createGrainLayer(WIDTH, HEIGHT, SEED);
  drawRiver = createRiverRenderer(river, SEED);
  dropSprite = createSoftSprite(128);

  // Punto del río donde cae la gota.
  let u0 = 0;
  while (river.pointAt(u0).y < 560) u0 += 0.002;
  impact = { u: u0, ...river.pointAt(u0) };

  arrow = arrowPath([960, 300], [900, 560], [impact.x + 70, impact.y - 70]);
  scribbles = [loopScribble(760, 210, 200, 6), loopScribble(780, 1770, 160, 4, 38)];
  headerSize = fitSize(ctx, 'Viva Belgrado', SERIF, 170);
  band = [130, 215, 300, 385].map((x) => [x, bankY(x) + 12]);
}

const bell = (t, a, b, c, d) => Math.min(progress(t, a, b), 1 - progress(t, c, d));

export function renderFrame(t) {
  t = clamp(t, 0, DURATION);
  ctx.save();
  ctx.textBaseline = 'alphabetic';

  // Fondo: más oscuro al principio y al final, la nube asoma en el centro.
  const dark = lerp(lerp(0.55, 0.3, progress(t, 3.5, 8)), 0.5, progress(t, 25.5, 28));
  drawBackground(ctx, t, dark);

  // ── S2 La gota → río de luz ───────────────────────────────
  const spread = ease.outCubic(progress(t, 5.9, 10.5));
  const rise = ease.inOutSine(progress(t, 19.2, 23.8));
  drawRiver(ctx, t, {
    visible: (d) => clamp((spread * 1.05 - Math.abs(d.u - impact.u)) * 25),
    rise,
  });

  if (t > 4.3 && t < 6.8) {
    const fall = ease.inCubic(progress(t, 4.4, 5.6));
    const y = lerp(-60, impact.y, fall);
    const squash = progress(t, 5.6, 6.5);
    const stretch = t < 5.6 ? 1 + fall * 1.1 : lerp(0.4, 1, ease.outElastic(squash));
    drawDrop(ctx, impact.x, y, 15, stretch, dropSprite, 1 - progress(t, 6.1, 6.7));
  }
  const ring = progress(t, 5.6, 6.8);
  if (ring > 0 && ring < 1) {
    const r = lerp(20, 240, ease.outCubic(ring));
    pencil(ctx, resample(arc(impact.x, impact.y, r, r * 0.42, 0, Math.PI * 2, 40), 6),
      { t, seed: 70, width: 3, color: PALETTE.papel, alpha: 1 - ring, amp: 2.5 });
  }

  // ── S3 Córdoba ───────────────────────────────────────────
  const city = lerp(lerp(1, 0.1, progress(t, 19.3, 20.5)), 0, progress(t, 25.8, 26.6));
  drawCordoba(ctx, t, {
    draw: ease.outCubic(progress(t, 10.8, 14.2)),
    fill: ease.outCubic(progress(t, 12.4, 14)),
    alpha: t < 10.8 ? 0 : city,
    ground: t < 10.8 ? 0 : 1,
  });
  drawBand(ctx, t, {
    start: 13.6,
    positions: band,
    scale: 0.82,
    lean: ease.inOutSine(bell(t, 16.2, 16.9, 18.4, 19.1)),
    lookUp: ease.inOutSine(progress(t, 20, 21)),
  });

  // ── S1 Papel: garabatos + nombre ─────────────────────────
  const scribAlpha = 1 - progress(t, 4.2, 5);
  pencil(ctx, arrow.line, { t, seed: 80, reveal: ease.outCubic(progress(t, 1.2, 3)), width: 3, color: PALETTE.papel, alpha: scribAlpha * 0.85 });
  pencil(ctx, arrow.head, { t, seed: 81, reveal: progress(t, 2.9, 3.3), width: 3, color: PALETTE.papel, alpha: scribAlpha * 0.85 });
  pencil(ctx, scribbles[0], { t, seed: 82, reveal: progress(t, 1.8, 3.6), width: 2, color: PALETTE.papel, alpha: (1 - progress(t, 10, 11)) * 0.55 });
  pencil(ctx, scribbles[1], { t, seed: 83, reveal: progress(t, 14.5, 16), width: 2, color: PALETTE.papel, alpha: (1 - progress(t, 25.5, 26.5)) * 0.5 });

  // Cabecera: grande al principio, sube a la posición de cartel al caer la gota.
  const move = ease.inOutSine(progress(t, 4, 5.2));
  const k = lerp(1, 96 / headerSize, move);
  ctx.save();
  ctx.translate(SAFE.x, lerp(760, SAFE.top + 70, move));
  ctx.scale(k, k);
  inkText(ctx, 'Viva Belgrado', 0, 0, { t, size: headerSize, reveal: ease.inOutSine(progress(t, 0.4, 2.2)), seed: 90 });
  ctx.restore();
  ctx.font = `400 ${headerSize}px ${SERIF}`;
  const headerW = ctx.measureText('Viva Belgrado').width * (96 / headerSize);
  popText(ctx, 'presenta', SAFE.x + headerW + 18, SAFE.top + 70, { t, start: 19.4, size: 48, family: SANS, weight: 500, alpha: 1 - progress(t, 25.6, 26.2) });

  // ── S4 Fluye ─────────────────────────────────────────────
  drawTitle(ctx, t, {
    start: 19.8,
    alpha: 1 - progress(t, 25.6, 26.3),
    lift: ease.inCubic(progress(t, 25.6, 26.3)) * 60,
  });

  // ── S5 Cierre ────────────────────────────────────────────
  if (t > 26) {
    ctx.save();
    ctx.textAlign = 'left';
    const size = fitSize(ctx, 'Ya disponible', SANS, 104, undefined, 700);
    ctx.font = `700 ${size}px ${SANS}`;
    const w = ctx.measureText('Ya disponible').width;
    popText(ctx, 'Ya disponible', (WIDTH - w) / 2, 1080, { t, start: 26.4, size, family: SANS, weight: 700 });
    pencil(ctx, resample([[(WIDTH - w) / 2, 1112], [WIDTH / 2, 1120], [(WIDTH + w) / 2, 1108]], 6),
      { t, seed: 95, reveal: ease.outCubic(progress(t, 26.9, 27.6)), width: 4, color: PALETTE.papel, amp: 2.5 });
    ctx.restore();
    drawMonogram(ctx, WIDTH / 2, 1270, t, { start: 27.0 });
    ctx.save();
    ctx.font = `500 48px ${SANS}`;
    const ww = ctx.measureText('vivabelgrado.org').width;
    popText(ctx, 'vivabelgrado.org', (WIDTH - ww) / 2, 1480, { t, start: 27.5, size: 48, family: SANS, weight: 500 });
    ctx.restore();
  }

  drawGrain(ctx, t, 0.55);

  // Fundido final a carbón.
  const out = progress(t, 29.2, 30);
  if (out > 0) {
    ctx.globalAlpha = ease.inOutSine(out);
    ctx.fillStyle = PALETTE.carbon;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
  }
  ctx.restore();
}

async function init() {
  await Promise.all([
    document.fonts.load(`400 100px ${SERIF}`),
    document.fonts.load(`italic 400 100px ${SERIF}`),
    document.fonts.load(`500 100px ${SANS}`),
    document.fonts.load(`700 100px ${SANS}`),
  ]);
  build();
  renderFrame(0);
}

window.__ready = init();
window.__duration = DURATION;
window.__renderFrame = (t) => {
  renderFrame(t);
  return canvas.toDataURL('image/png');
};

// ── Preview ────────────────────────────────────────────────
const params = new URLSearchParams(location.search);
if (!params.has('render')) {
  const play = document.getElementById('play');
  const scrub = document.getElementById('scrub');
  const label = document.getElementById('time');
  let playing = false, t = Number(params.get('t') || 0), last = 0;

  const show = () => {
    renderFrame(t);
    scrub.value = t;
    label.textContent = `${t.toFixed(2)} s`;
  };
  const loop = (now) => {
    if (!playing) return;
    t += Math.min(0.1, (now - last) / 1000);
    last = now;
    if (t >= DURATION) t = 0;
    show();
    requestAnimationFrame(loop);
  };
  const toggle = () => {
    playing = !playing;
    play.textContent = playing ? 'Pausa' : 'Play';
    if (playing) { last = performance.now(); requestAnimationFrame(loop); }
  };
  play.addEventListener('click', toggle);
  scrub.addEventListener('input', () => { t = Number(scrub.value); show(); });
  window.addEventListener('keydown', (e) => { if (e.code === 'Space') { e.preventDefault(); toggle(); } });
  window.__ready.then(show);
}
