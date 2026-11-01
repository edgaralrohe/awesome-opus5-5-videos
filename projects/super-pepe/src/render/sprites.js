// Pepe en 24×32, construido por formas a partir del dibujo de Colores Ruidosos:
// pelo con tupé, barba, ojos grandes, boca abierta, pañuelo rojo, camiseta blanca, vaqueros, micrófono.
// Se genera por código (sin erratas de píxel) y luego se le pone contorno automático.

const W = 24, H = 32;

function blank() { return Array.from({ length: H }, () => Array(W).fill('.')); }
const set = (g, x, y, c) => { if (x >= 0 && x < W && y >= 0 && y < H) g[y][x] = c; };
const rect = (g, x0, x1, y0, y1, c) => { for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) set(g, x, y, c); };
const ellipse = (g, cx, cy, rx, ry, c, pred = () => true) => {
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    if (((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1 && pred(x, y)) set(g, x, y, c);
  }
};

// legs: 'stand' | 'run0..3' | 'jump' · arm: 'down' | 'throw'
export const PEPE_FRAMES = [
  { name: 'idle', legs: 'stand', arm: 'down' },
  { name: 'idle2', legs: 'stand', arm: 'down', breathe: 1 },
  { name: 'run0', legs: 'run0', arm: 'down' },
  { name: 'run1', legs: 'run1', arm: 'down' },
  { name: 'run2', legs: 'run2', arm: 'down' },
  { name: 'run3', legs: 'run3', arm: 'down' },
  { name: 'jump', legs: 'jump', arm: 'down' },
  { name: 'throw', legs: 'stand', arm: 'throw' },
  { name: 'throwAir', legs: 'jump', arm: 'throw' },
  { name: 'hurt', legs: 'jump', arm: 'down', hurt: true },
];

const LEGS = {
  stand: { L: 0, R: 0, liftL: 0, liftR: 0 },
  run0: { L: -3, R: 3, liftL: 0, liftR: 1 },
  run1: { L: 0, R: 0, liftL: 0, liftR: 2 },
  run2: { L: 3, R: -3, liftL: 1, liftR: 0 },
  run3: { L: 0, R: 0, liftL: 2, liftR: 0 },
};

export function buildPepe({ legs = 'stand', arm = 'down', breathe = 0, hurt = false } = {}) {
  const g = blank();
  const by = breathe; // respiración: el cuerpo baja 1 px

  // Piernas y zapatos.
  if (legs === 'jump') {
    rect(g, 7, 10, 25, 27, 'j'); rect(g, 7, 11, 28, 29, 'k');
    rect(g, 13, 16, 25, 26, 'j'); rect(g, 14, 18, 27, 28, 'k');
  } else {
    const l = LEGS[legs];
    rect(g, 7 + l.L, 10 + l.L, 26, 29 - l.liftL, 'j'); rect(g, 9 + l.L, 10 + l.L, 26, 29 - l.liftL, 'J');
    rect(g, 6 + l.L, 11 + l.L, 30 - l.liftL, 31 - l.liftL, 'k');
    rect(g, 13 + l.R, 16 + l.R, 26, 29 - l.liftR, 'j'); rect(g, 13 + l.R, 13 + l.R, 26, 29 - l.liftR, 'J');
    rect(g, 13 + l.R, 18 + l.R, 30 - l.liftR, 31 - l.liftR, 'k');
  }
  rect(g, 7, 16, 25, 26, 'j');

  // Torso: camiseta, cinturón.
  rect(g, 6, 17, 17 + by, 24, 't'); rect(g, 6, 7, 17 + by, 24, 'T'); rect(g, 6, 17, 24, 24, 'T');
  rect(g, 6, 17, 25, 25, 'k'); rect(g, 11, 12, 25, 25, 'y');
  // Mangas y brazo trasero.
  rect(g, 4, 5, 17 + by, 19 + by, 't'); rect(g, 4, 5, 20 + by, 23 + by, 's'); rect(g, 4, 5, 24 + by, 24 + by, 'S');
  rect(g, 18, 19, 17 + by, 19 + by, 't');
  if (arm === 'down') {
    // Brazo delantero con el micrófono en la mano.
    rect(g, 18, 19, 20 + by, 23 + by, 's'); rect(g, 18, 20, 24 + by, 24 + by, 'S');
    rect(g, 21, 21, 19 + by, 24 + by, 'M'); rect(g, 20, 22, 17 + by, 18 + by, 'm');
  } else {
    // Brazo extendido (lanza el micrófono; el micro se dibuja aparte, con su cable).
    rect(g, 18, 23, 18 + by, 19 + by, 's'); rect(g, 22, 23, 17 + by, 20 + by, 'S');
  }

  // Pañuelo rojo (triángulo al frente).
  rect(g, 7, 17, 15 + by, 15 + by, 'r'); rect(g, 8, 16, 16 + by, 16 + by, 'r');
  rect(g, 10, 14, 17 + by, 17 + by, 'r'); rect(g, 11, 13, 18 + by, 18 + by, 'R');
  for (const x of [9, 12, 15]) set(g, x, 16 + by, 'R');

  // Cabeza.
  ellipse(g, 11.5, 8.5 + by, 8.2, 7.6, 's');
  rect(g, 3, 4, 8 + by, 10 + by, 's'); set(g, 4, 9 + by, 'S'); // oreja
  // Pelo: tupé arriba y laterales cortos.
  ellipse(g, 12, 3 + by, 8.6, 2.6, 'h');
  ellipse(g, 11.5, 8.5 + by, 8.2, 7.6, 'h', (x, y) => y <= 4 + by || (x <= 5 && y <= 7 + by));
  rect(g, 14, 18, 1 + by, 2 + by, 'H'); set(g, 19, 3 + by, 'h'); set(g, 20, 4 + by, 'h');
  // Cejas y ojos grandes.
  rect(g, 11, 13, 6 + by, 6 + by, 'e'); rect(g, 16, 18, 6 + by, 6 + by, 'e');
  for (const ex of [11, 16]) {
    rect(g, ex, ex + 2, 7 + by, 9 + by, 'w');
    rect(g, ex + 1, ex + 2, 8 + by, 9 + by, hurt ? 'w' : 'e');
    set(g, ex + 1, 8 + by, hurt ? 'e' : 'w');
  }
  set(g, 15, 10 + by, 'S'); // nariz
  // Barba (mejillas, mentón y patillas).
  ellipse(g, 11.5, 8.5 + by, 8.2, 7.6, 'b', (x, y) => (y >= 12 + by && !(y === 12 + by && x > 9 && x < 18)) || (x <= 6 && y >= 9 + by) || y >= 14 + by);
  // Boca abierta (cantando).
  rect(g, 12, 16, 12 + by, 13 + by, 'o'); rect(g, 13, 15, 13 + by, 13 + by, 'r');

  // Contorno automático.
  const out = g.map((r) => r.slice());
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    if (g[y][x] !== '.') continue;
    const n = [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => {
      const c = g[y + dy]?.[x + dx];
      return c && c !== '.';
    });
    if (n) out[y][x] = 'o';
  }
  return out.map((r) => r.join(''));
}

// Titular: periódico con patas y cejas de enfado (20×22).
export const TITULAR_ROWS = [
  '....................',
  '..oooooooooooooooo..',
  '..oppppppppppppppo..',
  '..opkkkkkkkkkkkkpo..',
  '..opkkkkkkkkkkkkpo..',
  '..oppppppppppppppo..',
  '..opgggggg.ggggppo..',
  '..oppaaappppaaappo..',
  '..oppkappppppakppo..',
  '..oppkkppppppkkppo..',
  '..opgggggg.ggggppo..',
  '..oppppppppppppppo..',
  '..opgggg.gggg.ggpo..',
  '..oppppppppppppppo..',
  '..opgggggg.ggggppo..',
  '..oPPPPPPPPPPPPPPo..',
  '..oooooooooooooooo..',
  '.....ok......ko.....',
  '.....ok......ko.....',
  '.....ok......ko.....',
  '....okko....okko....',
  '....oooo....oooo....',
];
