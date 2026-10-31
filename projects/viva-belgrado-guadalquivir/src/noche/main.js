import { WIDTH, HEIGHT, SEED, SAFE } from '../config.js';
import { ease, lerp, clamp } from '../lib/math.js';
import { progress } from '../lib/timeline.js';
import { createGrainLayer, createSoftSprite } from '../render/background.js';
import { SERIF, SANS } from '../render/type.js';
import { buildSchedule, cardAt } from '../reel/schedule.js';
import { drawCard } from '../reel/cards.js';
import { drawLogo } from '../reel/scenes/cr.js';
import { BPM, OFFSET, CARDS } from './script.js';
import { MASKS, CENTER, maskSlots } from './masks.js';
import { NOCHE, FLOOR, DANCER_SCALE, createNight, pose, drawDancer, drawMask, drawVinyl } from './party.js';

const canvas = document.getElementById('stage');
canvas.width = WIDTH;
canvas.height = HEIGHT;
const ctx = canvas.getContext('2d');

const SCHEDULE = buildSchedule(CARDS, BPM, OFFSET);
const DURATION = SCHEDULE.at(-1).end;
const FX = Object.fromEntries(SCHEDULE.map((c) => [c.fx, c]));
const DROP = FX.drop.start + 0.4;

let night, grain, sprite;

async function init() {
  await Promise.all([
    document.fonts.load(`400 100px ${SERIF}`), document.fonts.load(`500 100px ${SANS}`), document.fonts.load(`700 100px ${SANS}`),
  ]);
  night = createNight(SEED);
  grain = createGrainLayer(WIDTH, HEIGHT, SEED);
  sprite = createSoftSprite(128);
  renderFrame(0);
}

const outBounce = (x) => {
  const n = 7.5625, d = 2.75;
  if (x < 1 / d) return n * x * x;
  if (x < 2 / d) return n * (x -= 1.5 / d) * x + 0.75;
  if (x < 2.5 / d) return n * (x -= 2.25 / d) * x + 0.9375;
  return n * (x -= 2.625 / d) * x + 0.984375;
};

function shade(alpha) {
  if (alpha <= 0) return;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = NOCHE.night;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  ctx.restore();
}

export function renderFrame(t) {
  t = clamp(t, 0, DURATION);
  const current = cardAt(SCHEDULE, t);
  ctx.save();
  ctx.textBaseline = 'alphabetic';
  night(ctx, t);

  // T2–T3: el baile se congela en seco en el corte; vuelve en T4.
  const frozen = t >= FX.freeze.start && t < FX.glow.start;
  const tt = frozen ? FX.freeze.start : t;
  const poses = MASKS.map((_, i) => pose(i, tt, BPM, i === CENTER && t >= DROP));
  const slots = maskSlots(t, { swapStart: FX.swap.start, bpm: BPM });

  poses.forEach((P, i) => drawDancer(ctx, t, i, P, { faceVisible: i === CENTER && t >= DROP + 0.15, surprised: true }));

  // Máscaras: brillo por turnos (T4), saltos (T5), caída de la de hockey (T6).
  const glowSlot = Math.floor((t - FX.glow.start) / ((FX.glow.end - FX.glow.start) / MASKS.length));
  const glowEnv = Math.sin(((t - FX.glow.start) % ((FX.glow.end - FX.glow.start) / MASKS.length)) / ((FX.glow.end - FX.glow.start) / MASKS.length) * Math.PI);
  slots.forEach((s, i) => {
    const to = poses[i].head, from = poses[s.from].head;
    const p = ease.inOutSine(s.p);
    let x = lerp(from.x, to.x, p), y = lerp(from.y, to.y, p) - Math.sin(Math.PI * s.p) * 200;
    let rot = to.rot + (1 - s.p) * Math.PI * 2 * (s.from > i ? -1 : 1) * (s.p < 1 ? 1 : 0);
    if (s.mask === 'hockey' && i === CENTER && t >= DROP) {
      const f = progress(t, DROP, DROP + 0.9);
      y = lerp(to.y, FLOOR - 40, outBounce(f));
      x = to.x + 70 * ease.outCubic(f);
      rot = 2.2 * ease.outCubic(f);
    }
    const glow = t >= FX.glow.start && t < FX.glow.end && glowSlot === i ? glowEnv : 0;
    drawMask(ctx, t, s.mask, x, y, rot, { glow, sprite, scale: DANCER_SCALE * (1 + glow * 0.12) });
  });

  // Apagón del congelado + vinilo.
  const dim = Math.max(
    0.5 * progress(t, FX.freeze.start, FX.freeze.start + 0.3) * (1 - progress(t, FX.glow.start - 0.2, FX.glow.start + 0.3)),
    0.6 * progress(t, FX.logo.start, FX.logo.start + 0.4),
  );
  shade(dim);
  const vin = progress(t, FX.vinyl.start, FX.vinyl.start + 0.6) * (t < FX.glow.start - 0.3 ? 1 : 1 - progress(t, FX.glow.start - 0.3, FX.glow.start + 0.2));
  drawVinyl(ctx, t, { cx: WIDTH / 2, cy: 1260, p: vin });

  // Velo tras el texto.
  const v = ctx.createLinearGradient(0, 470, 0, 980);
  v.addColorStop(0, '#0e0a1600');
  v.addColorStop(0.5, '#0e0a16a0');
  v.addColorStop(1, '#0e0a1600');
  ctx.fillStyle = v;
  ctx.fillRect(0, 470, WIDTH, 510);

  if (current.fx === 'logo') drawLogo(ctx, t, { img: null, cx: WIDTH / 2, cy: 640, start: current.start });
  const handle = current.style === 'handle';
  drawCard(ctx, current, t, {
    x: handle ? WIDTH / 2 : SAFE.x, align: handle ? 'center' : 'left', cy: handle ? 920 : 720, maxW: WIDTH - SAFE.x * 2,
    size: handle ? 96 : 74, family: `${SANS}, "Noto Color Emoji"`, weight: 700, color: NOCHE.luna,
    accentMode: 'marker', accentColor: NOCHE.calabaza, markerInk: NOCHE.night,
  });

  grain(ctx, t, 0.5);
  const out = progress(t, DURATION - 0.6, DURATION);
  shade(ease.inOutSine(out));
  ctx.restore();
}

window.__ready = init();
window.__duration = DURATION;
window.__pending = CARDS.filter((c) => c.pending).map((c) => c.id);
window.__renderFrame = (t) => {
  renderFrame(t);
  return canvas.toDataURL('image/png');
};

const params = new URLSearchParams(location.search);
if (!params.has('render')) {
  const play = document.getElementById('play');
  const scrub = document.getElementById('scrub');
  const label = document.getElementById('time');
  scrub.max = DURATION;
  let playing = false, t = Number(params.get('t') || 0), last = 0;
  const show = () => {
    renderFrame(t);
    scrub.value = t;
    label.textContent = `${t.toFixed(2)} s · ${cardAt(SCHEDULE, t).id}`;
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
