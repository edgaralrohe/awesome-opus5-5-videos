import { WIDTH, HEIGHT, PALETTE, SEED, SAFE } from '../config.js';
import { ease, lerp, clamp } from '../lib/math.js';
import { progress } from '../lib/timeline.js';
import { createRiver } from '../lib/river.js';
import { createBackground, createGrainLayer } from '../render/background.js';
import { createRiverRenderer } from '../render/river.js';
import { drawCordoba, bankY } from '../render/cordoba.js';
import { drawBand } from '../render/band.js';
import { SERIF, SANS } from '../render/type.js';
import { BPM, OFFSET, CARDS, SCENES } from './script.js';
import { buildSchedule, cardAt, beatPhase } from './schedule.js';
import { drawCard, drawPendingStamp } from './cards.js';
import { loadImage, drawCover } from './images.js';
import { createCover, drawTracklist } from './scenes/cover.js';
import { createSheets } from './scenes/sheet.js';
import { createCRBackground, drawScore, drawLogo } from './scenes/cr.js';
import { CR } from './theme.js';

const canvas = document.getElementById('stage');
canvas.width = WIDTH;
canvas.height = HEIGHT;
const ctx = canvas.getContext('2d');

const SCHEDULE = buildSchedule(CARDS, BPM, OFFSET);
const DURATION = SCHEDULE.at(-1).end;
const first = (scene) => SCHEDULE.find((c) => c.scene === scene);
const card = (id) => SCHEDULE.find((c) => c.id === id);
const T = Object.fromEntries(SCENES.map((s) => [s.id, first(s.id).start]));
const CR_START = T.critica;
const SCORE = SCHEDULE.find((c) => c.style === 'score');
const SWAP = SCHEDULE.find((c) => c.sheet === 'gira').start;
const NOTE = SCHEDULE.find((c) => c.accent?.includes('«Vernissage».')).start;
const MAX_W = WIDTH - SAFE.x * 2;

let bg, grain, river, drawRiver, cover, sheets, crBg, images, band;

async function init() {
  await Promise.all([
    document.fonts.load(`400 100px ${SERIF}`), document.fonts.load(`italic 400 100px ${SERIF}`),
    document.fonts.load(`500 100px ${SANS}`), document.fonts.load(`700 100px ${SANS}`),
  ]);
  const [portada, banda, logo] = await Promise.all(['assets/portada.jpg', 'assets/banda.jpg', 'assets/logo-cr.png'].map(loadImage));
  images = { portada, banda, logo };
  bg = createBackground(WIDTH, HEIGHT, SEED);
  grain = createGrainLayer(WIDTH, HEIGHT, SEED);
  river = createRiver();
  drawRiver = createRiverRenderer(river, SEED);
  cover = createCover(portada, SEED);
  sheets = createSheets(SEED);
  crBg = createCRBackground(SEED);
  band = [130, 215, 300, 385].map((x) => [x, bankY(x) + 12]);
  renderFrame(0);
}

// ── Estilos de tarjeta por mundo ─────────────────────────────
function cardStyle(c) {
  const cr = SCENES.find((s) => s.id === c.scene).world === 'cr';
  const base = cr
    ? { family: `${SANS}, "Noto Color Emoji"`, weight: 700, size: 82, color: CR.ink, accentMode: 'marker', accentColor: CR.highlight, markerInk: CR.markerInk }
    : { family: `${SERIF}, "Noto Color Emoji"`, weight: 400, size: 86, color: PALETTE.papel, accentMode: 'pencil', accentColor: PALETTE.papel };
  const o = { ...base, x: SAFE.x, maxW: MAX_W, cy: 1000 };
  if (c.style === 'title') Object.assign(o, { size: 106, lineH: 1.0 });
  if (c.style === 'big') Object.assign(o, { size: 132 });
  if (c.style === 'quote') Object.assign(o, { size: 88, fontStyle: 'italic' });
  if (c.style === 'attribution') Object.assign(o, { size: 46, family: SANS, weight: 500 });
  if (c.style === 'handle') Object.assign(o, { size: 104, align: 'center', x: WIDTH / 2 });
  switch (c.scene) {
    case 'gancho': o.cy = 1400; break;
    case 'ficha': o.cy = 1030; break;
    case 'tema': o.cy = c.photo ? 1110 : 1330; break;
    case 'voz': o.cy = c.style === 'quote' ? 1340 : c.style === 'attribution' ? 1560 : 1400; break;
    case 'veredicto': o.cy = c.index > SCORE.index ? 1220 : 980; break;
    case 'cierre': o.cy = 1220; break;
  }
  return o;
}

// ── Mundo del disco (E1–E4) ─────────────────────────────────
function renderDisco(t, current) {
  bg(ctx, t, 0.35);

  // E1–E2 portada: zoom lento, luego sube y deja sitio al tracklist.
  const out = progress(t, T.tema - 0.3, T.tema + 0.2);
  if (out < 1) {
    const m = ease.inOutSine(progress(t, T.ficha, T.ficha + 0.6));
    const zoom = 1 + 0.06 * progress(t, 0, T.ficha);
    const size = lerp(840 * zoom, 380, m);
    const x = lerp(WIDTH / 2 - size / 2, SAFE.x, m);
    const y = lerp(300 - (size - 840) / 2, 260, m) - out * 120;
    ctx.save();
    ctx.globalAlpha = 1 - out;
    ctx.fillStyle = '#0008';
    ctx.fillRect(x + 14, y + 18, size, size);
    cover(ctx, x, y, size, t);
    ctx.restore();
    ctx.save();
    ctx.globalAlpha = 1 - out;
    drawTracklist(ctx, t, { start: T.ficha + 0.5, x: 540, y: 290, highlight: 'Menquitofla', highlightStart: card('T7').start });
    ctx.restore();
  }

  // E3 río + Córdoba + banda; luego la foto.
  if (t >= T.tema - 0.3 && t < T.voz + 0.5) {
    const photoT = card('T10').start;
    const away = progress(t, T.voz - 0.2, T.voz + 0.4);
    const dim = lerp(1, 0.18, progress(t, photoT - 0.2, photoT + 0.3)) * (1 - away);
    drawRiver(ctx, t, { alpha: progress(t, T.tema - 0.3, T.tema + 0.8) * dim });
    drawCordoba(ctx, t, { draw: ease.outCubic(progress(t, T.tema, T.tema + 2.4)), fill: progress(t, T.tema + 1.2, T.tema + 2.6), alpha: dim, ground: dim });
    drawBand(ctx, t, { start: T.tema + 1.2, positions: band, scale: 0.82, alpha: dim, lean: ease.inOutSine(Math.min(progress(t, T.tema + 3, T.tema + 3.6), 1 - progress(t, T.tema + 4.4, T.tema + 5))) });
    if (images.banda && t >= photoT - 0.3) {
      const p = ease.outBack(clamp((t - photoT + 0.3) / 0.6));
      const w = 880, h = (images.banda.height / images.banda.width) * w;
      ctx.save();
      ctx.globalAlpha = 1 - away;
      ctx.translate(WIDTH / 2, 560 + (1 - p) * 1400);
      ctx.rotate(-0.04 + 0.02 * p);
      ctx.fillStyle = '#0009';
      ctx.fillRect(-w / 2 - 6, -h / 2 + 4, w + 40, h + 40);
      ctx.fillStyle = PALETTE.papel;
      ctx.fillRect(-w / 2 - 16, -h / 2 - 16, w + 32, h + 32);
      ctx.filter = 'grayscale(1) contrast(1.08) brightness(0.95)';
      const kb = 1 + 0.04 * progress(t, photoT, T.voz);
      ctx.save();
      ctx.beginPath();
      ctx.rect(-w / 2, -h / 2, w, h);
      ctx.clip();
      drawCover(ctx, images.banda, (-w / 2) * kb, (-h / 2) * kb, w * kb, h * kb);
      ctx.restore();
      ctx.filter = 'none';
      ctx.fillStyle = 'rgba(232,228,216,0.55)'; // cinta adhesiva
      for (const sx of [-1, 1]) {
        ctx.save();
        ctx.translate(sx * (w / 2 - 30), -h / 2 - 10);
        ctx.rotate(sx * 0.5);
        ctx.fillRect(-60, -18, 120, 36);
        ctx.restore();
      }
      ctx.restore();
    }
    // Velo bajo el texto (legibilidad sobre el paisaje).
    if (current.scene === 'tema' && !current.photo) {
      const g = ctx.createLinearGradient(0, 1180, 0, 1490);
      g.addColorStop(0, '#1d1c1a00');
      g.addColorStop(0.5, '#1d1c1acc');
      g.addColorStop(1, '#1d1c1a00');
      ctx.fillStyle = g;
      ctx.fillRect(0, 1180, WIDTH, 310);
    }
  }

  // E4 en voz de la banda: entrevista → cartel de gira.
  if (t >= T.voz - 0.1) {
    const focusCard = current.keepPrev ? SCHEDULE[current.index - 1] : current;
    sheets(ctx, t, { enter: T.voz - 0.1, swapAt: SWAP, focus: current.focus ?? -1, focusStart: focusCard.start, noteStart: t >= NOTE ? NOTE : null });
  }
}

// ── Mundo Colores Ruidosos (E5–E7) ──────────────────────────
function renderCR(t, current, beat) {
  crBg(ctx, t, beat);
  if (t >= SCORE.start && current.scene === 'veredicto') {
    const next = SCHEDULE[SCORE.index + 1].start;
    const small = ease.inOutSine(progress(t, next - 0.1, next + 0.4));
    drawScore(ctx, t, { start: SCORE.start, cx: WIDTH / 2, cy: lerp(820, 380, small), scale: lerp(1, 0.42, small), beat });
  }
  if (current.scene === 'cierre') drawLogo(ctx, t, { img: images.logo, cx: WIDTH / 2, cy: 680, start: T.cierre });
}

export function renderFrame(t) {
  t = clamp(t, 0, DURATION);
  const current = cardAt(SCHEDULE, t);
  const beat = beatPhase(t, BPM, OFFSET);
  ctx.save();
  ctx.textBaseline = 'alphabetic';
  ctx.textAlign = 'left';

  const wipe = ease.outCubic(progress(t, CR_START, CR_START + 0.45));
  if (wipe < 1) renderDisco(t, current);
  if (wipe > 0) {
    ctx.save();
    if (wipe < 1) {
      ctx.beginPath();
      ctx.arc(WIDTH / 2, HEIGHT / 2, wipe * 1150, 0, Math.PI * 2);
      ctx.clip();
    }
    renderCR(t, current, beat);
    ctx.restore();
  }

  if (current.keepPrev) {
    const prev = SCHEDULE[current.index - 1];
    drawCard(ctx, { ...prev, end: current.end }, t, cardStyle(prev));
  }
  if (current.style !== 'score') {
    const o = cardStyle(current);
    const box = drawCard(ctx, current, t, o);
    if (current.pending && box) drawPendingStamp(ctx, WIDTH / 2, box.bottom + 120, t, t - current.start);
  }

  grain(ctx, t, t >= CR_START ? 0.65 : 0.5);
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
