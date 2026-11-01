import { W, H, TILE, MIC } from '../game/constants.js';
import { PAL } from './palette.js';
import { GLYPHS, ADVANCE, textWidth } from './font.js';
import { buildPepe, PEPE_FRAMES, TITULAR_ROWS } from './sprites.js';
import { micHand, micTip } from '../game/game.js';

const hash = (a, b) => {
  let h = (Math.imul(a | 0, 0x27d4eb2d) ^ Math.imul(b | 0, 0x165667b1)) >>> 0;
  h = Math.imul(h ^ (h >>> 15), 0x85ebca6b);
  return ((h ^ (h >>> 13)) >>> 0) / 4294967296;
};
const canvas = (w, h) => Object.assign(document.createElement('canvas'), { width: w, height: h });

// ── Texto bitmap ───────────────────────────────────────────
export function text(ctx, str, x, y, { color = '#fff', scale = 1, align = 'left', shadow = '#1b1226', bands = null } = {}) {
  const w = textWidth(str, scale);
  let cx = Math.round(align === 'center' ? x - w / 2 : align === 'right' ? x - w : x);
  for (const ch of str) {
    const g = GLYPHS[ch];
    if (g) for (let j = 0; j < 7; j++) for (let i = 0; i < 5; i++) {
      if (g[j][i] !== '1') continue;
      if (shadow) { ctx.fillStyle = shadow; ctx.fillRect(cx + i * scale + scale, y + j * scale + scale, scale, scale); }
      ctx.fillStyle = bands ? bands[Math.min(bands.length - 1, Math.floor((j / 7) * bands.length))] : color;
      ctx.fillRect(cx + i * scale, y + j * scale, scale, scale);
    }
    cx += ADVANCE * scale;
  }
}

export function wrap(str, maxChars) {
  const out = [];
  let line = '';
  for (const w of str.split(' ')) {
    if ((line + ' ' + w).trim().length > maxChars) { out.push(line); line = w; } else line = (line + ' ' + w).trim();
  }
  if (line) out.push(line);
  return out;
}

// ── Sprites precalculados ──────────────────────────────────
function rowsToCanvas(rows, flip = false) {
  const c = canvas(rows[0].length, rows.length), g = c.getContext('2d');
  rows.forEach((r, y) => [...r].forEach((ch, x) => {
    if (ch === '.' || !PAL[ch]) return;
    g.fillStyle = PAL[ch];
    g.fillRect(flip ? r.length - 1 - x : x, y, 1, 1);
  }));
  return c;
}

export function createArt(level) {
  const pepe = {};
  for (const f of PEPE_FRAMES) {
    const rows = buildPepe(f);
    pepe[f.name] = [rowsToCanvas(rows), rowsToCanvas(rows, true)];
  }
  const titular = [rowsToCanvas(TITULAR_ROWS), rowsToCanvas(TITULAR_ROWS, true)];
  return { pepe, titular, tiles: renderTiles(level), far: renderFar(), mid: renderMid() };
}

// ── Escenario ─────────────────────────────────────────────
const SKY = ['#2a1748', '#3d1d5c', '#5a2468', '#82306d', '#b2466a', '#e0715e', '#f2a55a'];

function renderFar() {
  // Silueta de la ciudad con la Arena al fondo (el destino del juego).
  const c = canvas(960, H), g = c.getContext('2d');
  for (let i = 0; i < 70; i++) {
    const x = Math.floor(hash(i, 1) * 960), w = 14 + Math.floor(hash(i, 2) * 26), h = 30 + Math.floor(hash(i, 3) * 70);
    g.fillStyle = i % 3 ? '#2b1d3d' : '#33224a';
    g.fillRect(x, 168 - h, w, h + 60);
    g.fillStyle = '#f2c66a';
    for (let wy = 168 - h + 4; wy < 160; wy += 7) for (let wx = x + 3; wx < x + w - 3; wx += 5) if (hash(wx, wy) < 0.22) g.fillRect(wx, wy, 2, 2);
  }
  // La Arena: cúpula con letrero.
  const ax = 760;
  g.fillStyle = '#3a2556';
  for (let dy = 0; dy < 40; dy++) {
    const hw = Math.floor(70 * Math.sqrt(1 - (dy / 40) ** 2));
    g.fillRect(ax - hw, 160 - dy, hw * 2, 1);
  }
  g.fillRect(ax - 70, 160, 140, 40);
  g.fillStyle = '#ff5a4f';
  for (let i = -60; i <= 60; i += 10) g.fillRect(ax + i, 170, 6, 3);
  text(g, 'ARENA', ax, 182, { color: '#f2c66a', align: 'center' });
  return c;
}

function renderMid() {
  // Vigas y ventanales de nave industrial (guiño a la estética de Spin Master).
  const c = canvas(128, H), g = c.getContext('2d');
  g.fillStyle = '#3b2c52';
  g.fillRect(0, 40, 6, 160); g.fillRect(64, 40, 6, 160);
  g.fillRect(0, 40, 128, 5); g.fillRect(0, 120, 128, 4);
  g.fillStyle = '#4d3b69';
  for (let i = 0; i < 64; i++) { g.fillRect(6 + i, 45 + Math.floor(i * 75 / 64), 2, 2); g.fillRect(70 + i, 120 - Math.floor(i * 75 / 64), 2, 2); }
  g.fillStyle = '#5b4880';
  for (const x of [1, 65]) for (let y = 48; y < 200; y += 12) g.fillRect(x + 1, y, 2, 2);
  return c;
}

function renderTiles(L) {
  const c = canvas(L.w * TILE, L.h * TILE), g = c.getContext('2d');
  for (let ty = 0; ty < L.h; ty++) for (let tx = 0; tx < L.w; tx++) {
    const t = L.tileAt(tx, ty), x = tx * TILE, y = ty * TILE;
    if (t === '#') {
      const top = L.tileAt(tx, ty - 1) !== '#';
      if (top) {
        // Viga naranja con tornillos.
        g.fillStyle = '#1b1226'; g.fillRect(x, y, 16, 16);
        g.fillStyle = '#e8a23c'; g.fillRect(x, y + 1, 16, 10);
        g.fillStyle = '#f7c86a'; g.fillRect(x, y + 1, 16, 2);
        g.fillStyle = '#a8621c'; g.fillRect(x, y + 9, 16, 2);
        g.fillStyle = '#6b3d14'; g.fillRect(x + 3, y + 5, 2, 2); g.fillRect(x + 11, y + 5, 2, 2);
        g.fillStyle = '#5b5070'; g.fillRect(x, y + 12, 16, 4);
      } else {
        g.fillStyle = '#4a4060'; g.fillRect(x, y, 16, 16);
        g.fillStyle = '#5b5075'; g.fillRect(x + 1, y + 1, 14, 1); g.fillRect(x + 1, y + 1, 1, 14);
        g.fillStyle = '#2e2640'; g.fillRect(x, y + 15, 16, 1); g.fillRect(x + 15, y, 1, 16);
        if ((tx + ty) % 2) { g.fillStyle = '#6c6188'; g.fillRect(x + 3, y + 3, 1, 1); g.fillRect(x + 12, y + 12, 1, 1); }
      }
    } else if (t === '=') {
      g.fillStyle = '#1b1226'; g.fillRect(x, y, 16, 7);
      g.fillStyle = '#e8a23c'; g.fillRect(x, y + 1, 16, 4);
      g.fillStyle = '#f7c86a'; g.fillRect(x, y + 1, 16, 1);
      g.fillStyle = '#6b3d14'; g.fillRect(x + 7, y + 2, 2, 2);
    } else if (t === '^') {
      for (let i = 0; i < 4; i++) {
        const sx = x + i * 4;
        for (let j = 0; j < 8; j++) {
          const hw = Math.floor((j / 8) * 2);
          g.fillStyle = j < 2 ? '#ffffff' : '#b9bec6';
          g.fillRect(sx + 2 - hw, y + 8 + j, hw * 2 || 1, 1);
        }
      }
    }
  }
  return c;
}

// ── Fotograma ─────────────────────────────────────────────
export function drawWorld(ctx, g, art, camX, t) {
  for (let i = 0; i < SKY.length; i++) { ctx.fillStyle = SKY[i]; ctx.fillRect(0, Math.floor((i * 168) / SKY.length), W, 30); }
  ctx.fillStyle = '#ffe9a8'; ctx.beginPath(); ctx.arc(250, 150, 18, 0, Math.PI * 2); ctx.fill();
  const fx = -Math.floor(camX * 0.2) % 960;
  ctx.drawImage(art.far, fx, 0); ctx.drawImage(art.far, fx + 960, 0);
  const mx = -Math.floor(camX * 0.5) % 128;
  for (let x = mx; x < W; x += 128) ctx.drawImage(art.mid, x, 0);

  ctx.save();
  ctx.translate(-camX, 0);
  // Cartel tutorial.
  ctx.fillStyle = '#1b1226'; ctx.fillRect(56, 112, 118, 46);
  ctx.fillStyle = '#efe8d4'; ctx.fillRect(58, 114, 114, 42);
  text(ctx, '◀ ▶  MOVER', 64, 118, { color: '#1b1226', shadow: null });
  text(ctx, 'Z / A  SALTAR', 64, 130, { color: '#1b1226', shadow: null });
  text(ctx, 'X / B  MICRÓFONO', 64, 142, { color: '#d8312b', shadow: null });
  ctx.fillStyle = '#1b1226'; ctx.fillRect(112, 158, 4, 34);

  ctx.drawImage(art.tiles, 0, 0);

  // Ganchos.
  for (const h of g.level.hooks) {
    ctx.strokeStyle = '#1b1226'; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(h.x, h.y, 6, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = Math.floor(t * 4) % 2 ? '#f7c86a' : '#b9bec6'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(h.x, h.y, 6, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = '#5b6068'; ctx.fillRect(h.x - 1, h.y - 24, 2, 18);
  }
  // Checkpoints (banderín JMV).
  for (const c of g.level.checkpoints) {
    const on = g.checkpoint.x >= c.x;
    ctx.fillStyle = '#1b1226'; ctx.fillRect(c.x - 1, c.y - 34, 3, 34);
    ctx.fillStyle = on ? '#d8312b' : '#6c6577'; ctx.fillRect(c.x + 2, c.y - 34, 16, 10);
    text(ctx, 'JMV', c.x + 3, c.y - 33, { color: on ? '#fff' : '#b9bec6', shadow: null, scale: 1 });
  }
  // Puerta del museo (meta).
  if (g.level.goal) {
    const { x, y } = g.level.goal;
    ctx.fillStyle = '#1b1226'; ctx.fillRect(x - 16, y - 44, 32, 44);
    ctx.fillStyle = '#7a3b8f'; ctx.fillRect(x - 14, y - 42, 28, 42);
    ctx.fillStyle = Math.floor(t * 3) % 2 ? '#f7c86a' : '#e8a23c'; ctx.fillRect(x - 10, y - 36, 20, 36);
    text(ctx, 'SALA 1', x, y - 54, { color: '#fff', align: 'center' });
  }
  // Piezas del museo: disco dorado que gira.
  for (const pc of g.pieces) {
    if (pc.taken) continue;
    const sx = Math.max(1, Math.round(Math.abs(Math.cos(t * 4 + pc.x)) * 6));
    const yy = pc.y + Math.round(Math.sin(t * 3 + pc.x) * 2);
    ctx.fillStyle = '#1b1226'; ctx.fillRect(pc.x - sx - 1, yy - 7, sx * 2 + 2, 14);
    ctx.fillStyle = '#e8b33c'; ctx.fillRect(pc.x - sx, yy - 6, sx * 2, 12);
    ctx.fillStyle = '#fff2b0'; ctx.fillRect(pc.x - sx, yy - 6, Math.max(1, sx - 1), 3);
    ctx.fillStyle = '#1b1226'; ctx.fillRect(pc.x - 1, yy - 1, 2, 2);
  }
  // Titulares.
  for (const e of g.enemies) {
    if (!e.alive && e.deadT > 0.8) continue;
    const img = art.titular[e.vx > 0 ? 1 : 0];
    if (!e.alive) {
      ctx.save(); ctx.translate(e.x + e.w / 2, e.y + e.deadT * 120); ctx.rotate(Math.PI); ctx.globalAlpha = 1 - e.deadT / 0.8;
      ctx.drawImage(img, -10, -11); ctx.restore();
      continue;
    }
    const bob = Math.floor(t * 8) % 2;
    ctx.drawImage(img, Math.round(e.x), Math.round(e.y) - bob);
    const bw = textWidth(e.word) + 6;
    ctx.fillStyle = '#1b1226'; ctx.fillRect(Math.round(e.x + e.w / 2 - bw / 2) - 1, Math.round(e.y) - 15, bw + 2, 12);
    ctx.fillStyle = '#ffffff'; ctx.fillRect(Math.round(e.x + e.w / 2 - bw / 2), Math.round(e.y) - 14, bw, 10);
    text(ctx, e.word, Math.round(e.x + e.w / 2), Math.round(e.y) - 13, { color: '#d8312b', align: 'center', shadow: null });
  }
  // Micrófono con su cable.
  if (g.mic.phase !== 'idle') {
    const a = micHand(g), b = micTip(g);
    const hx = a.x + g.mic.dir * 8;
    ctx.strokeStyle = '#1b1226'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(hx, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
    ctx.strokeStyle = '#5b6068'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(hx, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
    ctx.fillStyle = '#1b1226'; ctx.fillRect(Math.round(b.x) - 4, Math.round(b.y) - 4, 8, 8);
    ctx.fillStyle = '#b9bec6'; ctx.fillRect(Math.round(b.x) - 3, Math.round(b.y) - 3, 6, 6);
    ctx.fillStyle = '#ffffff'; ctx.fillRect(Math.round(b.x) - 2, Math.round(b.y) - 2, 2, 2);
  }
  // Pepe.
  const p = g.player;
  if (!(g.invuln > 0 && Math.floor(t * 15) % 2)) {
    const name = pepeFrame(g, t);
    const img = art.pepe[name][p.facing > 0 ? 0 : 1];
    ctx.drawImage(img, Math.round(p.x + p.w / 2 - 12), Math.round(p.y + p.h - 32));
  }
  ctx.restore();
}

function pepeFrame(g, t) {
  const p = g.player, throwing = g.mic.phase !== 'idle';
  if (g.invuln > 1.2) return 'hurt';
  if (!p.onGround) return throwing ? 'throwAir' : 'jump';
  if (throwing) return 'throw';
  if (Math.abs(p.vx) > 10) return `run${Math.floor(t * 12) % 4}`;
  return Math.floor(t * 2) % 2 ? 'idle2' : 'idle';
}

export function drawHud(ctx, g) {
  for (let i = 0; i < 3; i++) text(ctx, '♥', 8 + i * 9, 8, { color: i < g.hearts ? '#ff5a4f' : '#4a4060' });
  ctx.fillStyle = '#1b1226'; ctx.fillRect(41, 7, 9, 9);
  ctx.fillStyle = '#e8b33c'; ctx.fillRect(42, 8, 7, 7);
  ctx.fillStyle = '#1b1226'; ctx.fillRect(45, 11, 1, 1);
  text(ctx, `X ${String(g.piezas).padStart(2, '0')}/${g.pieces.length}`, 53, 8);
  text(ctx, 'PROTOTIPO', W - 8, 8, { align: 'right', color: '#f7c86a' });
  // Frase verificada al derrotar a un Titular.
  const pop = g.popups.at(-1);
  if (pop) {
    const lines = wrap(pop.text, 48);
    const h = lines.length * 9 + 16;
    ctx.globalAlpha = Math.min(1, pop.t * 2);
    ctx.fillStyle = '#1b1226'; ctx.fillRect(8, 22, W - 16, h);
    ctx.fillStyle = '#efe8d4'; ctx.fillRect(9, 23, W - 18, h - 2);
    lines.forEach((l, i) => text(ctx, l, W / 2, 27 + i * 9, { color: '#1b1226', align: 'center', shadow: null }));
    text(ctx, `— ${pop.source}`, W / 2, 27 + lines.length * 9, { color: '#d8312b', align: 'center', shadow: null });
    ctx.globalAlpha = 1;
  }
}

const CHROME = ['#ffffff', '#e6e9f0', '#b9c0d0', '#8a93a8', '#c9cfdc', '#f0f2f7', '#9aa2b5'];

// Sello JMV propio (arcade de los 90; no imita logos de terceros).
export function drawBadge(ctx, x, y) {
  ctx.fillStyle = '#1b1226'; ctx.fillRect(x - 32, y - 4, 64, 30);
  ctx.fillStyle = '#d8312b'; ctx.fillRect(x - 30, y - 2, 60, 26);
  ctx.fillStyle = '#94201d'; ctx.fillRect(x - 30, y + 20, 60, 4);
  text(ctx, 'JMV', x, y + 1, { scale: 3, align: 'center', bands: CHROME, shadow: '#1b1226' });
}

export function drawTitle(ctx, t) {
  for (let i = 0; i < SKY.length; i++) { ctx.fillStyle = SKY[i]; ctx.fillRect(0, Math.floor((i * H) / SKY.length), W, 34); }
  drawBadge(ctx, W / 2, 22);
  text(ctx, 'MÉXICO', W / 2, 66, { scale: 3, align: 'center', color: '#f7c86a' });
  text(ctx, 'VS.', W / 2, 92, { scale: 2, align: 'center', color: '#ff5a4f' });
  text(ctx, 'JOSÉ MADERO', W / 2, 112, { scale: 3, align: 'center', bands: CHROME });
  if (Math.floor(t * 2) % 2 === 0) text(ctx, 'PULSA START / A', W / 2, 152, { align: 'center' });
  text(ctx, 'PROTOTIPO JUGABLE · NIVEL DE PRUEBA', W / 2, 176, { align: 'center', color: '#f2c66a' });
  text(ctx, 'HOMENAJE NO OFICIAL HECHO POR FANS', W / 2, 196, { align: 'center', color: '#e6e9f0' });
  text(ctx, '@COLORESRUIDOSOS', W / 2, 208, { align: 'center', color: '#ff5a4f' });
}

export function drawEnd(ctx, g, best) {
  ctx.fillStyle = 'rgba(27,18,38,0.82)'; ctx.fillRect(0, 0, W, H);
  if (g.status === 'won') {
    text(ctx, '¡PIEZA RECUPERADA!', W / 2, 58, { scale: 2, align: 'center', color: '#f7c86a' });
    text(ctx, `TIEMPO ${g.time.toFixed(1)} S`, W / 2, 96, { align: 'center' });
    text(ctx, `PIEZAS ${g.piezas}/${g.pieces.length}`, W / 2, 110, { align: 'center' });
    if (best) text(ctx, `MEJOR TIEMPO ${best.toFixed(1)} S`, W / 2, 124, { align: 'center', color: '#b9c0d0' });
    text(ctx, 'PRÓXIMAMENTE: MUNDO 1 · CARMESÍ', W / 2, 150, { align: 'center', color: '#ff5a4f' });
  } else {
    text(ctx, 'LOS TITULARES', W / 2, 70, { scale: 2, align: 'center', color: '#ff5a4f' });
    text(ctx, 'GANARON ESTA VEZ…', W / 2, 92, { scale: 2, align: 'center', color: '#ff5a4f' });
  }
  text(ctx, 'PULSA A PARA REPETIR', W / 2, 180, { align: 'center' });
}
