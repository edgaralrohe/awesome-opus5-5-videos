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
  if (!im) return;
  if (s.crop) {   // solo el dibujo de la viñeta, centrado en el marco
    rect(g, x, y, 320, 224, '#0a0610');
    g.drawImage(im, 0, 0, 320, s.crop, x, y + ((224 - s.crop) >> 1), 320, s.crop);
  } else g.drawImage(im, x, y);
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

// ---------- escenas (guion v2) ----------
const GY = 132;   // pantalla de juego 1:1
const BY = 372;   // ventana de abajo

// Ventana de arriba con el sello JMV (color protegido) y un texto de la línea de tiempo.
function topWin(t, id, skin) {
  const q = tlText(id);
  if (!q || t < q.t0 || t >= q.t1) return;
  const dy = slide(t, q.t0, -60);
  win(g, 14, 80 + dy, 332, 34, skin);
  badge(g, 24, 91 + dy);
  say(id, q.text, 196, 92 + dy, { k: 2, align: 'center', color: C.white });
}
// Ventana de abajo con 1 o 2 líneas (la segunda en dorado).
function bottomWin(t, ids, skin, from = 340) {
  const qs = ids.map(tlText).filter((q) => q && t >= q.t0 && t < q.t1);
  if (!qs.length) return;
  const x = 14 + slide(t, qs[0].t0, from);
  win(g, x, BY, 332, 14 + qs.length * 22, skin);
  qs.forEach((q, i) => say(q.id, q.text, x + 166, BY + 11 + i * 22, { k: 2, align: 'center', color: i && i === qs.length - 1 ? C.gold : C.white }));
}

function scenePremisa(t) {
  bgCarmesi();
  const q = tlText('titulo');
  const dy = slide(t, 0, -60);
  win(g, 14, 80 + dy, 332, 34, SKINS.carmesi);
  badge(g, 24, 91 + dy);
  say('titulo', q.text, 196, 92 + dy, { k: 2, align: 'center', rows: [C.gold, C.gold, '#ffe9a8', C.white, C.white, C.silver, C.silver] });
  gameScreen(t, 20, GY);
  bottomWin(t, ['cap0a', 'cap0b'], SKINS.menu, 0);
  if (visible('fuente0', t)) say('fuente0', 'FUENTES: LOS40 · GRUPO ANIMAL', 180, BY + 66, { k: 1, align: 'center', color: C.silver });
  bottomWin(t, ['cap1a', 'cap1b'], SKINS.menu, 0);
  bottomWin(t, ['cap2a', 'cap2b'], SKINS.menu, 0);
  bottomWin(t, ['cap3a', 'cap3b', 'cap3c'], SKINS.menu, 0);
}

function sceneJuego(t) {
  bgMenu();
  const n = Math.min(4, Math.floor((t - 14) / 4) + 1);
  topWin(t, `como${n}`, SKINS.menu);
  gameScreen(t, 20, GY);
  bottomWin(t, [`t${n}a`, `t${n}b`], SKINS.menu);
}

function sceneWorld(t, era) {
  if (era === 'carmesi') bgCarmesi(); else bgNoche();
  topWin(t, era === 'carmesi' ? 'm1' : 'm2', SKINS[era]);
  gameScreen(t, 20 + shake(t), GY);
  if (era === 'carmesi') bottomWin(t, ['m1b'], SKINS.carmesi);
  else bottomWin(t, ['m2a', 'm2b'], SKINS.noche);
}

// Bloque «RUMBO A LA ARENA», en el mismo sitio en el recuerdo y en el cierre.
function arenaBlock(t) {
  const x = 14 + slide(t, 46, 340);
  win(g, x, BY, 332, 58, SKINS.menu);
  say('arena', 'RUMBO A LA ARENA CDMX', x + 166, BY + 11, { k: 2, align: 'center', color: C.white });
  say('fecha', '21 Y 22 MAY 2027', x + 166, BY + 33, { k: 2, align: 'center', color: C.gold });
  say('fuente', 'FUENTES: LOS40 · GRUPO ANIMAL', 180, BY + 66, { k: 1, align: 'center', color: C.silver });
}
function sceneRecuerdo(t) {
  bgNoche();
  topWin(t, 'm2', SKINS.noche);
  gameScreen(t, 20, GY);
}
// Lo que viene: el pasillo real con las puertas bloqueadas y el plan de lanzamiento.
function sceneFuturo(t) {
  bgMenu();
  topWin(t, 'r0', SKINS.menu);
  gameScreen(t, 20, GY);
  bottomWin(t, ['r1', 'r2'], SKINS.carmesi);
}

function sceneCierre(t) {
  ditherV(g, 0, 0, FW, FH, '#0a0206', '#3a0f1c');
  const b = badge(g, 0, -99, 2); badge(g, 180 - (b.w >> 1), 82, 2);
  texts.push({ id: 'logo', text: 'MÉXICO VS. JOSÉ MADERO', x0: 40 * SCALE, y0: 106 * SCALE, x1: 320 * SCALE, y1: 192 * SCALE });
  text(g, 'MÉXICO', 180, 110, { k: 4, align: 'center', rows: [C.gold, C.gold, '#ffe9a8', C.yellow, C.gold, C.goldDark, C.goldDark], outline: C.ink });
  text(g, 'VS.', 180, 146, { k: 2, align: 'center', color: C.white, outline: C.ink });
  text(g, 'JOSÉ MADERO', 180, 166, { k: 4, align: 'center', rows: [C.white, C.white, '#e8e8ee', C.silver, C.silver, '#6f7890', '#6f7890'], outline: C.ink });
  if (t >= 46.5) {
    const x = 14 + slide(t, 46.5, 340);
    win(g, x, 206, 332, 58, SKINS.carmesi);
    say('cta', 'JUEGA GRATIS · VIERNES 6 NOV', x + 166, 217, { k: 2, align: 'center', color: C.gold });
    say('dev', 'EN CELULAR Y COMPU', x + 166, 239, { k: 2, align: 'center', color: C.white });
    const x2 = 14 + slide(t, 46.5, -340);
    win(g, x2, 280, 332, 58, SKINS.menu);
    say('web', 'COLORESRUIDOSOS.GITHUB.IO', x2 + 166, 291, { k: 2, align: 'center', color: C.white });
    say('seccion', 'SECCIÓN GAMES', x2 + 166, 313, { k: 2, align: 'center', color: C.gold });
  }
  arenaBlock(t);
  say('homenaje', 'HOMENAJE NO OFICIAL · @COLORESRUIDOSOS', 180, 486, { k: 1, align: 'center', color: C.silver });
}

// ---------- transiciones ----------
const BIG = [14, 30, 34, 40, 42, 46], MID = [18, 22, 26], SMALL = [4, 7, 10, 12, 16, 20, 24, 32, 36, 38];
const MOSAICS = [...BIG.map((c) => [c, 8]), ...MID.map((c) => [c, 5]), ...SMALL.map((c) => [c, 3])];
function mosaicAt(t) {
  let n = 1;
  for (const [c, peak] of MOSAICS) { const d = Math.abs(t - c); const w = peak > 4 ? 0.25 : 0.1; if (d < w) n = Math.max(n, Math.round(1 + (peak - 1) * (1 - d / w))); }
  return n;
}
function paletteLevel(t) {
  if (t < PALETTE_STEPS[0] || t >= 34) return 0;
  return PALETTE_STEPS.filter((s) => t >= s).length;
}

// ---------- render ----------
function render(t) {
  texts = [];
  rect(g, 0, 0, FW, FH, C.black);
  const s = secAt(t);
  if (s.id === 'premisa') scenePremisa(t);
  else if (s.id === 'juego') sceneJuego(t);
  else if (s.id === 'carmesi') sceneWorld(t, 'carmesi');
  else if (s.id === 'noche') sceneWorld(t, 'noche');
  else if (s.id === 'recuerdo') sceneRecuerdo(t);
  else if (s.id === 'futuro') sceneFuturo(t);
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
