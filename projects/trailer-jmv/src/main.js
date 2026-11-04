// Tráiler «México vs. José Madero» — render(t) determinista (contrato de la librería: DUR, render, READY, EV, TEXTS).
import { FW, FH, SCALE, C, SKINS, makeFB, rect, text, textW, ditherV, checker, win, mosaic, paletteStep, icon, badge } from './px.js';
import { DUR, SECS, SHOTS, TEXTS_TL, PALETTE_STEPS, EV, BEAT, HITS } from './timeline.js';

const out = document.getElementById('out');
out.width = innerWidth || FW * SCALE; out.height = innerHeight || FH * SCALE;
const og = out.getContext('2d'); og.imageSmoothingEnabled = false;
const g = makeFB(document.getElementById('fb'));

// ---------- material ----------
const load = (src) => new Promise((ok) => { const im = new Image(); im.onload = () => ok(im); im.onerror = () => { console.warn('falta', src); ok(null); }; im.src = src; });
const frames = {};
const need = [];
for (const s of SHOTS) {
  const n = Math.round((Math.min(s.t1, s.freeze ?? s.t1) - s.t0) * 24) + 1;
  for (let i = 0; i < n; i++) need.push([s.clip, s.from + i]);
}
const key = (c, i) => `${c}/${i}`;
let pepe, meta;
await Promise.all([
  ...need.map(([c, i]) => load(`out/clips/${c}/f${String(i).padStart(4, '0')}.png`).then((im) => { frames[key(c, i)] = im; })),
  load('assets/pepe.png').then((im) => { pepe = im; }),
  fetch('assets/pepe.json').then((r) => r.json()).then((m) => { meta = m.frames; }),
]);

// ---------- utilidades de tiempo ----------
const seg = (t, a, b) => Math.max(0, Math.min(1, (t - a) / (b - a)));
const eo = (x) => 1 - (1 - x) ** 3;
const secAt = (t) => SECS.filter((s) => s.t <= t).at(-1);
let texts = [];
// Registra cada texto visible (para readcheck) con su caja a escala final.
function say(id, s, x, y, o = {}) {
  const tl = TEXTS_TL.find((q) => q.id === id);
  const shown = o.typed != null ? s.slice(0, o.typed) : s;
  const box = text(g, shown, x, y, o);
  if (o.align === 'center' && o.typed != null) void 0;
  const full = o.typed != null ? { x0: Math.round(x - (o.align === 'center' ? textW(s, o.k || 1) / 2 : 0)), x1: Math.round(x + (o.align === 'center' ? textW(s, o.k || 1) / 2 : textW(s, o.k || 1))), y0: box.y0, y1: box.y1 } : box;
  texts.push({ id, text: tl ? tl.text : s, x0: full.x0 * SCALE, y0: full.y0 * SCALE, x1: full.x1 * SCALE, y1: full.y1 * SCALE });
}
const tlText = (id) => TEXTS_TL.find((q) => q.id === id);
const visible = (id, t) => { const q = tlText(id); return q && t >= q.t0 && t < q.t1; };

// Pantalla de juego real 1:1 con marco.
function gameScreen(t, x, y) {
  const s = SHOTS.find((q) => t >= q.t0 && t < q.t1);
  if (!s) return;
  const tt = s.freeze != null ? Math.min(t, s.freeze) : t;
  const i = s.from + Math.floor((tt - s.t0) * 24 + 1e-6);
  const im = frames[key(s.clip, i)] || frames[key(s.clip, i - 1)];
  rect(g, x - 3, y - 3, 326, 230, C.ink); rect(g, x - 2, y - 2, 324, 228, C.white); rect(g, x - 1, y - 1, 322, 226, C.ink);
  if (im) g.drawImage(im, x, y);
}

// Sacudida 3-2-1 px en 8 fotogramas (STYLE §5) a partir de los golpes marcados.
const SHAKES = HITS;
function shake(t) {
  for (const s of SHAKES) { const f = Math.floor((t - s) * 24); if (f >= 0 && f < 8) return [3, -3, 2, -2, 1, -1, 1, 0][f]; }
  return 0;
}

// Fondo de era con trama.
function bgCarmesi() { ditherV(g, 0, 0, FW, FH, '#14040a', '#4a0f1e'); for (let y = 520; y < FH; y += 6) rect(g, 0, y, FW, 2, '#5e1020'); }
function bgNoche() { ditherV(g, 0, 0, FW, FH, '#030304', '#18181d'); }
function bgMenu() { ditherV(g, 0, 0, FW, FH, '#05081c', '#16205a'); }

// Retrato de Pepe 32×32 (cabeza de la pose idle del atlas oficial) a escala k.
function portrait(x, y, k = 2, f = 'idle0') {
  const m = meta[f];
  rect(g, x - 2, y - 2, 32 * k + 4, 32 * k + 4, C.ink); rect(g, x - 1, y - 1, 32 * k + 2, 32 * k + 2, C.silver);
  ditherV(g, x, y, 32 * k, 32 * k, '#2b3a80', '#141c48');
  g.save(); g.beginPath(); g.rect(x, y, 32 * k, 32 * k); g.clip();
  g.drawImage(pepe, m.x, m.y, m.w, 30, x + Math.round((32 - m.w) / 2) * k, y + 3 * k, m.w * k, 30 * k);
  g.restore();
}
function sprite(f, x, y, k = 2) { const m = meta[f]; g.drawImage(pepe, m.x, m.y, m.w, m.h, x - m.ax * k, y - m.ay * k, m.w * k, m.h * k); }

// Ventana que entra deslizándose ~0,3 s desde un lado (px enteros).
const slide = (t, t0, from) => Math.round(from * (1 - eo(seg(t, t0, t0 + 0.3))));

// ---------- escenas ----------
function sceneGancho(t) {
  bgCarmesi();
  const dy = slide(t, 0, -60);
  win(g, 14, 80 + dy, 332, 34, SKINS.carmesi);
  badge(g, 24, 91 + dy);
  say('titulo', 'MÉXICO VS. JOSÉ MADERO', 196, 92 + dy, { k: 2, rows: [C.gold, C.gold, '#ffe9a8', C.white, C.white, C.silver, C.silver] , align: 'center'});
  gameScreen(t, 20, 132);
  if (t >= 0.3) {
    const by = 370 + slide(t, 0.3, 80);
    win(g, 14, by, 332, 78, SKINS.menu);
    portrait(24, by + 7, 2);
    const q = tlText('dialogo');
    const n = Math.min(q.text.length, Math.floor((t - q.t0) * 38) + 1);
    say('dialogo', q.text, 100, by + 30, { k: 3, typed: n });
    if (n >= q.text.length && Math.floor(t * 4) % 2 === 0) text(g, '▶', 326, by + 62, { k: 1, color: C.white });
  }
}

const SLOTS = [
  { id: 's1', label: 'CARMESÍ · 2016', color: C.crimson, open: true },
  { id: 's2', label: 'NOCHE · 2017', color: '#e8e8ee', open: true },
  { id: 's3', label: '???' }, { id: 's3b', label: '???' }, { id: 's3c', label: '???' }, { id: 's3d', label: '???' }, { id: 's3e', label: '???' },
  { id: 's8', label: 'ARENA CDMX', color: C.gold, goal: true },
];
const slotY = (i) => 128 + i * 46;
function drawSlots(t, { hand = null, sel = -1, ids = true } = {}) {
  SLOTS.forEach((s, i) => {
    const y = slotY(i), on = i === sel && Math.floor(t * 8) % 2 === 0;
    win(g, 40, y, 296, 40, on ? { ...SKINS.menu, fill0: '#2c3f9c', fill1: '#3a52c0' } : SKINS.menu);
    text(g, String(i + 1), 52, y + 13, { k: 2, color: s.open || s.goal ? C.white : C.grey });
    if (s.open || s.goal) { rect(g, 74, y + 10, 20, 20, C.ink); rect(g, 75, y + 11, 18, 18, s.color); if (s.goal) icon(g, 'disc', 76, y + 12, C.ink, 2, null); }
    else icon(g, 'lock', 78, y + 13, C.grey, 2);
    const lid = s.id.startsWith('s3') ? 's3' : s.id;
    if (ids) say(s.id === lid ? lid : s.id, s.label, 104, y + 13, { k: 2, color: s.open ? C.white : s.goal ? C.gold : C.grey });
    else text(g, s.label, 104, y + 13, { k: 2, color: s.open ? C.white : s.goal ? C.gold : C.grey });
  });
  if (hand != null) icon(g, 'hand', 14, Math.round(hand) + 13 + (Math.floor(t * 4) % 2), C.white, 2);
}
function sceneMenu(t) {
  bgMenu();
  win(g, 14, 80, 332, 40, SKINS.menu);
  say('menu', 'ELIGE UN RECUERDO', 180, 93, { k: 2, align: 'center', color: C.white });
  // La mano baja ranura a ranura y vuelve a la 1 (duda en la 3: se detiene, STYLE §5).
  const path = [[4.3, 0], [4.5, 0], [5.0, 1], [5.5, 2], [6.0, 7], [6.5, 1], [6.75, 0]];
  let hy = slotY(0);
  for (let k = 0; k < path.length - 1; k++) { const [a, i] = path[k], [b, j] = path[k + 1]; if (t >= a) hy = slotY(i) + (slotY(j) - slotY(i)) * eo(seg(t, a, Math.min(b, a + 0.18))); }
  if (t >= 6.75) hy = slotY(0);
  drawSlots(t, { hand: t >= 4.3 ? hy : null, sel: t >= 7 ? 0 : -1 });
}

function itemWin(t, id, y, ic, col) {
  const q = tlText(id);
  if (!q || t < q.t0 || t >= q.t1) return;
  const x = 30 + slide(t, q.t0, 340);
  win(g, x, y, 300, 40, t < 16 ? SKINS.carmesi : SKINS.noche);
  icon(g, ic, x + 14, y + 12, col, 2);
  say(id, q.text, x + 46, y + 13, { k: 2, color: C.gold });
}

function sceneWorld(t, era) {
  const sk = SKINS[era];
  if (era === 'carmesi') bgCarmesi(); else bgNoche(t);
  const id = era === 'carmesi' ? 'mundo1' : 'mundo2';
  const q = tlText(id);
  if (t >= q.t0 && t < q.t1) {
    const dy = slide(t, q.t0, -60);
    win(g, 14, 80 + dy, 332, 34, sk);
    badge(g, 24, 91 + dy);
    say(id, q.text, 196, 92 + dy, { k: 2, align: 'center', color: C.white });
  }
  const sh = shake(t);
  gameScreen(t, 20 + sh, 132);
  itemWin(t, era === 'carmesi' ? 'item1' : 'item2', 372, era === 'carmesi' ? 'disc' : 'mask', era === 'carmesi' ? C.gold : C.white);
}

function sceneIdentidad(t) {
  ditherV(g, 0, 0, FW, FH, '#05081c', '#16205a');
  // Panorámica vertical de píxel entero: de los pies a la cabeza.
  const cam = Math.round(60 * (1 - eo(seg(t, 22, 22.7))));
  for (let x = 0; x < FW; x += 24) checker(g, x, 380 - cam, 12, 4, '#1b2a6b', '#2b3a80');
  const f = t < 23 ? 'idle' + (Math.floor(t * 5) % 4) : 'win' + (Math.floor(t * 8) % 4);
  sprite(f, 180, 370 - cam, 3);
  const q = tlText('identidad');
  win(g, 30, 108, 300, 40, SKINS.menu);
  say('identidad', q.text, 180, 121, { k: 2, align: 'center', color: C.white });
  const filled = t < 22.5 ? 0 : t < 22.75 ? 1 : 2;
  for (let i = 0; i < 8; i++) {
    const x = 40 + i * 36, y = 400;
    rect(g, x, y, 30, 22, C.ink);
    rect(g, x + 1, y + 1, 28, 20, i < filled ? (i === 0 ? C.crimson : '#e8e8ee') : '#1b2140');
    if (i >= filled) text(g, '?', x + 13, y + 7, { k: 1, color: C.grey, shadow: null });
  }
  if (t >= 23 && t < 23.6 && Math.floor(t * 6) % 2 === 0) text(g, '+1 NIVEL', 180, 162, { k: 2, align: 'center', color: C.gold });
  const o = tlText('otros');
  if (t >= o.t0) {
    const by = 430 + slide(t, o.t0, 80);
    win(g, 14, by, 332, 78, SKINS.menu);
    portrait(24, by + 7, 2);
    const n = Math.min(o.text.length, Math.floor((t - o.t0) * 38) + 1);
    say('otros', o.text, 100, by + 30, { k: 2, typed: n });
  }
}

function arena(t, y0) {
  // Arena dibujada por código, sin logos: techo, gradas de público y escenario con haces de luz al 50 %.
  ditherV(g, 0, y0, FW, 210, '#04040c', '#141a46');
  rect(g, 0, y0 + 40, FW, 4, '#2b3a80');
  for (let row = 0; row < 7; row++) {
    const y = y0 + 60 + row * 18, col = row % 2 ? '#26285a' : '#323a7a';
    for (let x = -((row * 7) % 12); x < FW; x += 8) {
      const bob = (Math.floor(t * 4 + x * 0.13 + row) % 2);
      rect(g, x, y - bob, 6, 6, col); rect(g, x + 1, y - 2 - bob, 4, 3, col);
      if ((x * 31 + row * 17) % 23 === 0 && Math.floor(t * 3 + x) % 2) rect(g, x + 2, y - 6 - bob, 2, 2, C.gold);
    }
  }
  const sx = 180;
  for (const [dx, c] of [[-90, '#ffe9a8'], [0, C.white], [90, '#ffe9a8']]) {
    const sway = Math.round(Math.sin(t * 1.3 + dx) * 14);
    for (let y = y0 + 44; y < y0 + 190; y++) { const w = Math.round((y - y0 - 44) * 0.18) + 2; g.fillStyle = c; for (let x = sx + dx + sway * (y - y0) / 190 - w; x < sx + dx + sway * (y - y0) / 190 + w; x++) if (((x | 0) + y) % 2 === 0) g.fillRect(x | 0, y, 1, 1); }
  }
  rect(g, 60, y0 + 186, 240, 24, C.ink); rect(g, 62, y0 + 186, 236, 4, C.crimson);
}
function sceneArena(t) {
  bgMenu();
  win(g, 14, 80, 332, 34, SKINS.menu);
  say('proxima', 'PRÓXIMA PARADA', 180, 92, { k: 2, align: 'center', color: C.white });
  rect(g, 17, 125, 326, 216, C.ink); rect(g, 18, 126, 324, 214, C.white); rect(g, 19, 127, 322, 212, C.ink);
  g.save(); g.beginPath(); g.rect(20, 128, 320, 210); g.clip(); arena(t, 128); g.restore();
  say('arena', 'ARENA CIUDAD DE MÉXICO', 180, 360, { k: 2, align: 'center', color: C.white });
  say('fecha', '21 Y 22 MAY 2027', 180, 388, { k: 3, align: 'center', rows: [C.gold, C.gold, C.yellow, C.yellow, C.goldDark, C.goldDark, C.goldDark], outline: C.ink });
  say('fuente', 'FUENTES: LOS40 · GRUPO ANIMAL', 180, 430, { k: 1, align: 'center', color: C.silver });
}

function sceneCierre(t) {
  ditherV(g, 0, 0, FW, FH, '#0a0206', '#3a0f1c');
  const b = badge(g, 0, -99, 2); badge(g, 180 - (b.w >> 1), 92, 2);
  // Logotipo a lo grande (el título del juego); para readcheck cuenta como un solo texto con la caja del bloque.
  texts.push({ id: 'logo', text: 'MÉXICO VS. JOSÉ MADERO', x0: 40 * SCALE, y0: 118 * SCALE, x1: 320 * SCALE, y1: 212 * SCALE });
  text(g, 'MÉXICO', 180, 124, { k: 4, align: 'center', rows: [C.gold, C.gold, '#ffe9a8', C.yellow, C.gold, C.goldDark, C.goldDark], outline: C.ink });
  text(g, 'VS.', 180, 162, { k: 2, align: 'center', color: C.white, outline: C.ink });
  text(g, 'JOSÉ MADERO', 180, 184, { k: 4, align: 'center', rows: [C.white, C.white, '#e8e8ee', C.silver, C.silver, '#6f7890', '#6f7890'], outline: C.ink });
  sprite('idle' + (Math.floor(t * 5) % 4), 180, 318, 2);
  if (t >= 30.5) { const x = 14 + slide(t, 30.5, 340); win(g, x, 330, 332, 34, SKINS.carmesi); say('cta', 'JUEGA GRATIS · VIERNES 6 NOV', x + 166, 342, { k: 2, align: 'center', color: C.gold }); }
  if (t >= 31) {
    const x = 14 + slide(t, 31, -340);
    win(g, x, 372, 332, 52, SKINS.menu);
    say('web', 'COLORESRUIDOSOS.GITHUB.IO', x + 166, 381, { k: 2, align: 'center', color: C.white });
    say('seccion', 'SECCIÓN GAMES', x + 166, 401, { k: 2, align: 'center', color: C.gold });
    say('homenaje', 'HOMENAJE NO OFICIAL · @COLORESRUIDOSOS', 180, 486, { k: 1, align: 'center', color: C.silver });
  }
  if (t >= 32) {
    say('start', 'PRESS START', 186, 446, { k: 2, align: 'center', color: C.white });
    if (Math.floor(t * 2) % 2 === 0) text(g, '▶', 108, 446, { k: 2, color: C.crimson });
  }
}

// ---------- transiciones ----------
const MOSAICS = [[4, 8], [8, 8], [10, 3], [12, 3], [16, 6], [18, 3], [20, 3], [22, 6], [26, 8], [30, 6]];
function mosaicAt(t) {
  let n = 1;
  for (const [c, peak] of MOSAICS) { const d = Math.abs(t - c); const w = peak > 4 ? 0.25 : 0.1; if (d < w) n = Math.max(n, Math.round(1 + (peak - 1) * (1 - d / w))); }
  return n;
}
function paletteLevel(t) {
  if (t < 14 || t >= 16) return 0;
  return PALETTE_STEPS.filter((s) => t >= s).length;
}

// ---------- render ----------
function render(t) {
  texts = [];
  rect(g, 0, 0, FW, FH, C.black);
  const s = secAt(t);
  if (s.id === 'gancho') sceneGancho(t);
  else if (s.id === 'menu') sceneMenu(t);
  else if (s.id === 'carmesi' || s.id === 'paleta') sceneWorld(t, 'carmesi');
  else if (s.id === 'noche') sceneWorld(t, 'noche');
  else if (s.id === 'identidad') sceneIdentidad(t);
  else if (s.id === 'arena') sceneArena(t);
  else sceneCierre(t);
  // Giro: la paleta se apaga por pasos; el sello JMV (color protegido) se vuelve a pintar encima.
  const lv = paletteLevel(t);
  if (lv) { paletteStep(g, lv); badge(g, 24, 91); }
  // Primer fotograma de Noche: la ranura 1 tiñe el sello, el resto ya es gris.
  mosaic(g, mosaicAt(t));
  // Fundido final a negro por pasos de paleta (4 niveles, nunca alfa).
  if (t > DUR - 0.5) { const k = Math.min(4, Math.floor((t - (DUR - 0.5)) / 0.125)); const im = g.getImageData(0, 0, FW, FH), d = im.data; for (let i = 0; i < d.length; i += 4) { d[i] = d[i] * (4 - k) / 4; d[i + 1] = d[i + 1] * (4 - k) / 4; d[i + 2] = d[i + 2] * (4 - k) / 4; } g.putImageData(im, 0, 0); }
  og.drawImage(g.canvas, 0, 0, FW, FH, 0, 0, out.width, out.height);
}

window.DUR = DUR;
window.EV = EV;
window.render = render;
window.TEXTS = (t) => { render(t); return texts.filter((x) => x.x1 > 0 && x.x0 < FW * SCALE); };
window.READY = true;
