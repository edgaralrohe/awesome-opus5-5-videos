import { WIDTH, HEIGHT } from '../config.js';
import { DURATION, SEGMENTS, COPY, segmentAt } from './timeline.js';
import { LW, LH, SCALE, box, text, iris } from './pixel.js';
import { drawMap, drawTitle, drawRoom, drawTerror, drawContinue, pepeOnRing, cabinPos } from './scenes.js';

const canvas = document.getElementById('stage');
canvas.width = WIDTH;
canvas.height = HEIGHT;
const ctx = canvas.getContext('2d');
const low = Object.assign(document.createElement('canvas'), { width: LW, height: LH });
const g = low.getContext('2d');

const BAR = SEGMENTS[0].end / 4; // el título dura 4 compases

function dialog(str, t0, t) {
  const lines = str.split('\n').length;
  box(g, 4, 4, LW - 8, 12 + lines * 10);
  text(g, str, LW / 2, 11, { align: 'center', chars: Math.max(0, Math.floor((t - t0) * 28)) });
}

function renderLogical(t) {
  const seg = segmentAt(t);
  const L = t - seg.start;

  if (seg.id === 'titulo') return drawTitle(g, L);

  if (seg.id === 'mapa') {
    drawMap(g, t, { lit: 0, pepe: L > 0.8 && Math.floor(L * 6) % 2 === 0 && L < 1.6 ? null : pepeOnRing(0, 0) });
    dialog(COPY.map, 0.2, L);
    return;
  }

  if (seg.level) {
    const lv = seg.level, k = lv.n - 1;
    if (L < BAR) {
      // Caminar hasta la cabaña; la ventana se enciende al llegar.
      const p = Math.min(1, L / (BAR * 0.75));
      drawMap(g, t, { lit: p >= 1 ? lv.n : k, pepe: pepeOnRing(k, p) });
      dialog(`NIVEL ${lv.n}`, 0.1, L);
      return;
    }
    if (L < BAR + 0.3) {
      drawMap(g, t, { lit: lv.n, pepe: pepeOnRing(k, 1) });
      const c = cabinPos(k);
      iris(g, Math.round(c.x), Math.round(c.y), Math.round(150 * (1 - (L - BAR) / 0.3)));
      return;
    }
    const R = L - BAR - 0.3;
    if (lv.terror && R >= 1.3) {
      drawTerror(g, t, { L: R - 1.3 });
      return;
    }
    drawRoom(g, t, lv, { L: R });
    if (R < 0.3) iris(g, LW / 2, 70, Math.round(150 * (R / 0.3)));
    return;
  }

  // Cierre: mapa con todas las ventanas encendidas + numeradas, luego CONTINUE?
  if (L < BAR * 2) {
    drawMap(g, t, { lit: 8, numbers: true, pepe: { ...pepeOnRing(0, 0), walking: false } });
    dialog(COPY.ask, 0.1, L);
    return;
  }
  drawContinue(g, t, L - BAR * 2);
}

export function renderFrame(t) {
  t = Math.min(Math.max(t, 0), DURATION - 1e-6);
  renderLogical(t);
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(low, 0, 0, LW * SCALE, LH * SCALE);
}

window.__ready = document.fonts.ready.then(() => renderFrame(0));
window.__duration = DURATION;
window.__pending = [];
window.__renderFrame = (t) => {
  renderFrame(t);
  return canvas.toDataURL('image/png');
};

const params = new URLSearchParams(location.search);
if (!params.has('render')) {
  const play = document.getElementById('play');
  const scrub = document.getElementById('scrub');
  const label = document.getElementById('time');
  const audio = new Audio('out/cabanas.wav');
  scrub.max = DURATION;
  let playing = false, t = Number(params.get('t') || 0), last = 0;
  const show = () => {
    renderFrame(t);
    scrub.value = t;
    label.textContent = `${t.toFixed(2)} s · ${segmentAt(t).id}`;
  };
  const loop = (now) => {
    if (!playing) return;
    t += Math.min(0.1, (now - last) / 1000);
    last = now;
    if (t >= DURATION) { t = 0; audio.currentTime = 0; }
    show();
    requestAnimationFrame(loop);
  };
  const toggle = () => {
    playing = !playing;
    play.textContent = playing ? 'Pausa' : 'Play';
    if (playing) { audio.currentTime = t; audio.play().catch(() => {}); last = performance.now(); requestAnimationFrame(loop); }
    else audio.pause();
  };
  play.addEventListener('click', toggle);
  scrub.addEventListener('input', () => { t = Number(scrub.value); audio.currentTime = t; show(); });
  window.addEventListener('keydown', (e) => { if (e.code === 'Space') { e.preventDefault(); toggle(); } });
  window.__ready.then(show);
}
