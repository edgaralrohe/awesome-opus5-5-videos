// Motor de píxeles del tráiler (plan D1, D3): lienzo nativo de 360×640, fuente propia de ancho variable,
// ventanas RPG, trama Bayer, mosaico y pasos de paleta. Todo en coordenadas enteras.
export const FW = 360, FH = 640, SCALE = 3;

export const C = {
  ink: '#0d0a12', white: '#f6f1e7', silver: '#9aa3b5', crimson: '#c02a38', crimsonDark: '#5e1020', wine: '#2a0d16',
  gold: '#ffc94a', goldDark: '#b07414', blue: '#1b2a6b', blueDark: '#0f173f', grey: '#5d5d66', black: '#08080a', yellow: '#ffd23f',
};

// Fuente propia 5×7 (las letras estrechas van a 1–3 de ancho). '#' = píxel.
const G = {
  A: ['.###.', '#...#', '#...#', '#####', '#...#', '#...#', '#...#'],
  B: ['####.', '#...#', '#...#', '####.', '#...#', '#...#', '####.'],
  C: ['.###.', '#...#', '#....', '#....', '#....', '#...#', '.###.'],
  D: ['####.', '#...#', '#...#', '#...#', '#...#', '#...#', '####.'],
  E: ['#####', '#....', '#....', '####.', '#....', '#....', '#####'],
  F: ['#####', '#....', '#....', '####.', '#....', '#....', '#....'],
  G: ['.###.', '#...#', '#....', '#.###', '#...#', '#...#', '.####'],
  H: ['#...#', '#...#', '#...#', '#####', '#...#', '#...#', '#...#'],
  I: ['###', '.#.', '.#.', '.#.', '.#.', '.#.', '###'],
  J: ['..###', '...#.', '...#.', '...#.', '#..#.', '#..#.', '.##..'],
  K: ['#...#', '#..#.', '#.#..', '##...', '#.#..', '#..#.', '#...#'],
  L: ['#....', '#....', '#....', '#....', '#....', '#....', '#####'],
  M: ['#...#', '##.##', '#.#.#', '#.#.#', '#...#', '#...#', '#...#'],
  N: ['#...#', '##..#', '#.#.#', '#..##', '#...#', '#...#', '#...#'],
  O: ['.###.', '#...#', '#...#', '#...#', '#...#', '#...#', '.###.'],
  P: ['####.', '#...#', '#...#', '####.', '#....', '#....', '#....'],
  Q: ['.###.', '#...#', '#...#', '#...#', '#.#.#', '#..#.', '.##.#'],
  R: ['####.', '#...#', '#...#', '####.', '#.#..', '#..#.', '#...#'],
  S: ['.####', '#....', '#....', '.###.', '....#', '....#', '####.'],
  T: ['#####', '..#..', '..#..', '..#..', '..#..', '..#..', '..#..'],
  U: ['#...#', '#...#', '#...#', '#...#', '#...#', '#...#', '.###.'],
  V: ['#...#', '#...#', '#...#', '#...#', '.#.#.', '.#.#.', '..#..'],
  W: ['#...#', '#...#', '#...#', '#.#.#', '#.#.#', '##.##', '#...#'],
  X: ['#...#', '#...#', '.#.#.', '..#..', '.#.#.', '#...#', '#...#'],
  Y: ['#...#', '#...#', '.#.#.', '..#..', '..#..', '..#..', '..#..'],
  Z: ['#####', '....#', '...#.', '..#..', '.#...', '#....', '#####'],
  0: ['.###.', '#...#', '#..##', '#.#.#', '##..#', '#...#', '.###.'],
  1: ['.#.', '##.', '.#.', '.#.', '.#.', '.#.', '###'],
  2: ['.###.', '#...#', '....#', '...#.', '..#..', '.#...', '#####'],
  3: ['####.', '....#', '....#', '.###.', '....#', '....#', '####.'],
  4: ['...#.', '..##.', '.#.#.', '#..#.', '#####', '...#.', '...#.'],
  5: ['#####', '#....', '####.', '....#', '....#', '#...#', '.###.'],
  6: ['.###.', '#....', '#....', '####.', '#...#', '#...#', '.###.'],
  7: ['#####', '....#', '...#.', '..#..', '..#..', '..#..', '..#..'],
  8: ['.###.', '#...#', '#...#', '.###.', '#...#', '#...#', '.###.'],
  9: ['.###.', '#...#', '#...#', '.####', '....#', '....#', '.###.'],
  '.': ['.', '.', '.', '.', '.', '.', '#'],
  ',': ['..', '..', '..', '..', '..', '.#', '#.'],
  ':': ['.', '#', '.', '.', '.', '#', '.'],
  '·': ['.', '.', '.', '#', '.', '.', '.'],
  '!': ['#', '#', '#', '#', '#', '.', '#'],
  '¡': ['#', '.', '#', '#', '#', '#', '#'],
  '?': ['.###.', '#...#', '....#', '..##.', '..#..', '.....', '..#..'],
  '¿': ['..#..', '.....', '..#..', '.##..', '#....', '#...#', '.###.'],
  '/': ['....#', '...#.', '...#.', '..#..', '.#...', '.#...', '#....'],
  '+': ['.....', '..#..', '..#..', '#####', '..#..', '..#..', '.....'],
  '-': ['...', '...', '...', '###', '...', '...', '...'],
  '@': ['.###.', '#...#', '#.###', '#.#.#', '#.###', '#....', '.####'],
  '→': ['.....', '...#.', '....#', '#####', '....#', '...#.', '.....'],
  '▶': ['#...', '##..', '###.', '####', '###.', '##..', '#...'],
  '…': ['.....', '.....', '.....', '.....', '.....', '.....', '#.#.#'],
  ' ': ['..', '..', '..', '..', '..', '..', '..'],
};
const ACC = { 'Á': 'A', 'É': 'E', 'Í': 'I', 'Ó': 'O', 'Ú': 'U' };
const glyph = (ch) => G[ACC[ch] || (ch === 'Ñ' ? 'N' : ch)] || G['?'];
export const charW = (ch) => glyph(ch)[0].length;
export const textW = (s, k = 1) => [...s].reduce((w, ch) => w + (charW(ch) + 1) * k, -k);

export function makeFB(cv) {
  cv.width = FW; cv.height = FH;
  const g = cv.getContext('2d');
  g.imageSmoothingEnabled = false;
  return g;
}

export function rect(g, x, y, w, h, c) { g.fillStyle = c; g.fillRect(x | 0, y | 0, w | 0, h | 0); }

// Texto en el framebuffer: escala entera, sombra de 1 px (de k px) o contorno de 8 vecinos; color o degradado por filas.
export function text(g, s, x, y, { k = 1, color = C.white, shadow = C.ink, outline = null, rows = null, align = 'left' } = {}) {
  const w = textW(s, k);
  let cx = align === 'center' ? Math.round(x - w / 2) : align === 'right' ? x - w : x;
  const x0 = cx;
  const plot = (px, py, col) => { g.fillStyle = col; g.fillRect(px, py, k, k); };
  const pass = (dx, dy, col) => {
    let ox = x0;
    for (const ch of s) {
      const gl = glyph(ch);
      for (let r = 0; r < 7; r++) for (let c = 0; c < gl[r].length; c++) if (gl[r][c] === '#') plot(ox + c * k + dx, y + r * k + dy, col ?? (rows ? rows[Math.min(rows.length - 1, Math.floor(r * rows.length / 7))] : color));
      if (ACC[ch]) { const mid = Math.floor(gl[0].length / 2); plot(ox + (mid + 1) * k + dx, y - 2 * k + dy, col ?? (rows ? rows[0] : color)); plot(ox + mid * k + dx, y - 1 * k + dy, col ?? (rows ? rows[0] : color)); }
      if (ch === 'Ñ') for (let c = 0; c < 5; c++) if (c !== 2) plot(ox + c * k + dx, y - 2 * k + dy + (c % 2 ? -k : 0) + k, col ?? (rows ? rows[0] : color));
      ox += (gl[0].length + 1) * k;
    }
  };
  if (outline) for (const [dx, dy] of [[-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [0, 1], [1, 1]]) pass(dx * Math.max(1, k >> 1), dy * Math.max(1, k >> 1), outline);
  else if (shadow) pass(k, k, shadow);
  pass(0, 0, null);
  return { x0, y0: y - (/[ÁÉÍÓÚÑ]/.test(s) ? 2 * k : 0), x1: x0 + w, y1: y + 7 * k };
}

const BAYER = [[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]];
// Degradado vertical con trama Bayer 4×4 entre dos colores (nunca mezcla alfa).
export function ditherV(g, x, y, w, h, c0, c1) {
  for (let j = 0; j < h; j++) {
    const f = j / Math.max(1, h - 1) * 16;
    for (let i = 0; i < w; i++) { g.fillStyle = BAYER[(y + j) & 3][(x + i) & 3] < f ? c1 : c0; g.fillRect(x + i, y + j, 1, 1); }
  }
}
// Relleno de trama al 50 % (ajedrez) entre dos colores.
export function checker(g, x, y, w, h, c0, c1) {
  rect(g, x, y, w, h, c0); g.fillStyle = c1;
  for (let j = 0; j < h; j++) for (let i = (j + x + y) & 1; i < w; i += 2) g.fillRect(x + i, y + j, 1, 1);
}

// Ventana RPG con borde de 3 capas (tinta, blanco y plata) y esquinas redondeadas; la piel cambia con la era.
export const SKINS = {
  carmesi: { fill0: '#3a0f1c', fill1: '#561526', frame: C.white, inner: '#d9a0a8' },
  noche: { fill0: '#060607', fill1: '#121216', frame: C.white, inner: '#7c7c86' },
  menu: { fill0: C.blueDark, fill1: C.blue, frame: C.white, inner: C.silver },
};
export function win(g, x, y, w, h, skin = SKINS.menu) {
  x |= 0; y |= 0;
  rect(g, x + 2, y, w - 4, h, C.ink); rect(g, x, y + 2, w, h - 4, C.ink); rect(g, x + 1, y + 1, w - 2, h - 2, C.ink);
  rect(g, x + 2, y + 1, w - 4, h - 2, skin.frame); rect(g, x + 1, y + 2, w - 2, h - 4, skin.frame);
  rect(g, x + 2, y + 2, w - 4, h - 4, skin.inner);
  ditherV(g, x + 3, y + 3, w - 6, h - 6, skin.fill0, skin.fill1);
}

// Mosaico: bloques de n píxeles tomados del centro de cada bloque.
export function mosaic(g, n) {
  if (n <= 1) return;
  const src = g.getImageData(0, 0, FW, FH), d = src.data, out = g.createImageData(FW, FH), o = out.data;
  for (let by = 0; by < FH; by += n) for (let bx = 0; bx < FW; bx += n) {
    const sx = Math.min(FW - 1, bx + (n >> 1)), sy = Math.min(FH - 1, by + (n >> 1)), si = (sy * FW + sx) * 4;
    for (let y = by; y < Math.min(FH, by + n); y++) for (let x = bx; x < Math.min(FW, bx + n); x++) { const i = (y * FW + x) * 4; o[i] = d[si]; o[i + 1] = d[si + 1]; o[i + 2] = d[si + 2]; o[i + 3] = 255; }
  }
  g.putImageData(out, 0, 0);
}

// Paso de paleta (plan D4): cada nivel es una tabla. Nivel 0 = color; 4 = gris de 6 tonos (como Noche).
// Los rojos se desaturan más tarde (quedan rosas y ciruelas en los pasos intermedios, STYLE §3).
export function paletteStep(g, level, x = 0, y = 0, w = FW, h = FH) {
  if (level <= 0) return;
  const im = g.getImageData(x, y, w, h), d = im.data, a = Math.min(1, level / 4);
  const greys = [8, 30, 62, 104, 158, 226];
  for (let i = 0; i < d.length; i += 4) {
    const r = d[i], gg = d[i + 1], b = d[i + 2];
    const lum = 0.299 * r + 0.587 * gg + 0.114 * b;
    const q = greys.reduce((best, v) => (Math.abs(v - lum) < Math.abs(best - lum) ? v : best), greys[0]);
    const warm = r > gg + 40 ? 0.75 : 1;
    const k = level >= 4 ? 1 : Math.min(1, a * warm);
    const step = (v) => Math.round((v + (q - v) * k) / 8) * 8;
    d[i] = step(r); d[i + 1] = step(gg); d[i + 2] = step(b);
  }
  g.putImageData(im, x, y);
}

// Pequeños iconos de 1 bit.
const ICONS = {
  hand: ['..##.....', '.#..#....', '.#..####.', '##..#..##', '#.......#', '#.......#', '.#.....#.', '..#####..'],
  lock: ['.###.', '#...#', '#...#', '#####', '##.##', '##.##', '#####'],
  disc: ['..####..', '.#....#.', '#..##..#', '#.#..#.#', '#.#..#.#', '#..##..#', '.#....#.', '..####..'],
  mask: ['.######.', '#..##..#', '#.#..#.#', '#......#', '.#....#.', '..####..'],
};
export function icon(g, name, x, y, color, k = 1, outline = C.ink) {
  const m = ICONS[name];
  const plot = (px, py, c) => { g.fillStyle = c; g.fillRect(px, py, k, k); };
  if (outline) for (let r = 0; r < m.length; r++) for (let c = 0; c < m[r].length; c++) if (m[r][c] === '#') for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) plot(x + (c + dx) * k, y + (r + dy) * k, outline);
  for (let r = 0; r < m.length; r++) for (let c = 0; c < m[r].length; c++) if (m[r][c] === '#') plot(x + c * k, y + r * k, color);
}

// El sello JMV (diseño propio de CR, el del juego): el color protegido que atraviesa las eras.
export function badge(g, x, y, k = 1) {
  const w = textW('JMV', k) + 6 * k, h = 11 * k;
  rect(g, x - k, y - k, w + 2 * k, h + 2 * k, C.ink); rect(g, x, y, w, h, C.crimson); rect(g, x, y + h - 2 * k, w, 2 * k, C.crimsonDark);
  text(g, 'JMV', x + 3 * k, y + 2 * k, { k, color: C.white, shadow: C.crimsonDark });
  return { w, h };
}
