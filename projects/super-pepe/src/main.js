import { W, H, DT } from './game/constants.js';
import { createGame, stepGame } from './game/game.js';
import { followCamera } from './engine/camera.js';
import { LEVEL_1 } from './data/level1.js';
import { createArt, drawWorld, drawHud, drawTitle, drawEnd } from './render/draw.js';
import { createAudio } from './audio/audio.js';

const cv = document.getElementById('game');
cv.width = W; cv.height = H;
const ctx = cv.getContext('2d');
ctx.imageSmoothingEnabled = false;
const audio = createAudio();

let game = createGame(LEVEL_1);
let art = createArt(game.level);
let screen = 'title', camX = 0, t = 0, paused = false;
const store = {
  get: () => { try { return Number(localStorage.getItem('jmv-best')) || 0; } catch { return 0; } },
  set: (v) => { try { localStorage.setItem('jmv-best', String(v)); } catch { /* sin almacenamiento */ } },
};

// ── Entrada: teclado, táctil y mando → mismos 4 botones ──
const held = { left: false, right: false, jump: false, mic: false };
const KEYS = { ArrowLeft: 'left', KeyA: 'left', ArrowRight: 'right', KeyD: 'right', KeyZ: 'jump', Space: 'jump', ArrowUp: 'jump', KeyW: 'jump', KeyX: 'mic', KeyJ: 'mic', KeyK: 'mic' };
let startPressed = false;
addEventListener('keydown', (e) => {
  if (KEYS[e.code]) { held[KEYS[e.code]] = true; e.preventDefault(); }
  if (['Enter', 'KeyZ', 'Space'].includes(e.code)) startPressed = true;
  if (e.code === 'KeyP' || e.code === 'Escape') paused = !paused;
  if (e.code === 'KeyM') document.getElementById('music').textContent = audio.toggleMusic() ? '♪ ON' : '♪ OFF';
});
addEventListener('keyup', (e) => { if (KEYS[e.code]) held[KEYS[e.code]] = false; });

for (const btn of document.querySelectorAll('[data-btn]')) {
  const k = btn.dataset.btn;
  const on = (e) => { e.preventDefault(); held[k] = true; btn.classList.add('on'); if (k === 'jump') startPressed = true; audio.unlock(); };
  const off = (e) => { e.preventDefault(); held[k] = false; btn.classList.remove('on'); };
  btn.addEventListener('pointerdown', on);
  btn.addEventListener('pointerup', off);
  btn.addEventListener('pointercancel', off);
  btn.addEventListener('pointerleave', off);
}
document.getElementById('music').addEventListener('click', (e) => { e.currentTarget.textContent = audio.toggleMusic() ? '♪ ON' : '♪ OFF'; });
cv.addEventListener('pointerdown', () => { startPressed = true; audio.unlock(); });

function pad() {
  const gp = navigator.getGamepads?.()[0];
  if (!gp) return {};
  const ax = gp.axes[0] || 0;
  if (gp.buttons[9]?.pressed || gp.buttons[0]?.pressed) startPressed = startPressed || screen !== 'play';
  return { left: ax < -0.4 || gp.buttons[14]?.pressed, right: ax > 0.4 || gp.buttons[15]?.pressed, jump: gp.buttons[0]?.pressed, mic: gp.buttons[2]?.pressed || gp.buttons[1]?.pressed };
}

// ── Bucle de paso fijo ─────────────────────────────────
let last = performance.now(), acc = 0;
function frame(now) {
  acc += Math.min(0.1, (now - last) / 1000);
  last = now;
  const gp = pad();
  const btn = { left: held.left || gp.left, right: held.right || gp.right, jump: held.jump || gp.jump, mic: held.mic || gp.mic };
  while (acc >= DT) {
    acc -= DT; t += DT;
    if (screen === 'title' && startPressed) { audio.unlock(); screen = 'play'; game = createGame(LEVEL_1); }
    else if (screen === 'play' && !paused) {
      stepGame(game, btn);
      audio.play(game.events);
      if (game.status !== 'play') {
        screen = 'end';
        if (game.status === 'won') { const b = store.get(); if (!b || game.time < b) store.set(game.time); }
      }
    } else if (screen === 'end' && startPressed && t > 0.5) { game = createGame(LEVEL_1); screen = 'play'; }
    startPressed = false;
  }
  const p = game.player;
  camX = followCamera(camX, p.x + p.w / 2, game.level.w * 16, p.facing * 24);
  if (screen === 'title') drawTitle(ctx, t);
  else {
    drawWorld(ctx, game, art, camX, t);
    drawHud(ctx, game);
    if (screen === 'end') drawEnd(ctx, game, store.get());
    if (paused) { ctx.fillStyle = 'rgba(27,18,38,0.7)'; ctx.fillRect(0, 0, W, H); }
  }
  requestAnimationFrame(frame);
}
// Acceso para pruebas automáticas (no afecta al juego).
window.__jmv = { get game() { return game; }, start() { startPressed = true; } };
requestAnimationFrame(frame);

// Escalado: entero cuando cabe (píxeles nítidos); fraccionario en pantallas pequeñas.
function fit() {
  const controls = matchMedia('(pointer: coarse)').matches ? 170 : 0;
  const s = Math.min(innerWidth / W, (innerHeight - controls - 24) / H);
  const k = s >= 2 ? Math.floor(s) : Math.max(1, s);
  cv.style.width = `${Math.floor(W * k)}px`;
  cv.style.height = `${Math.floor(H * k)}px`;
}
addEventListener('resize', fit);
fit();
