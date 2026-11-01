import { PAL } from './palette.js';
import { GLYPHS, ADVANCE, textWidth } from './font.js';

// Lienzo lógico: 135×240 → ×8 = 1080×1920.
export const LW = 135, LH = 240, SCALE = 8;
export const col = (k) => (k in PAL ? PAL[k] : k);

export function rect(ctx, x, y, w, h, c) {
  ctx.fillStyle = col(c);
  ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
}

// Tramado de dos colores (sombreado NES).
export function dither(ctx, x, y, w, h, a, b) {
  rect(ctx, x, y, w, h, a);
  ctx.fillStyle = col(b);
  for (let j = 0; j < h; j++) for (let i = (j + x + y) & 1; i < w; i += 2) ctx.fillRect(x + i, y + j, 1, 1);
}

export function sprite(ctx, rows, x, y, { scale = 1, tint = {} } = {}) {
  x = Math.round(x); y = Math.round(y);
  rows.forEach((row, j) => {
    for (let i = 0; i < row.length; i++) {
      const ch = row[i];
      const c = ch in tint ? col(tint[ch]) : PAL[ch];
      if (!c) continue;
      ctx.fillStyle = c;
      ctx.fillRect(x + i * scale, y + j * scale, scale, scale);
    }
  });
}

export function disc(ctx, cx, cy, r, c) {
  ctx.fillStyle = col(c);
  for (let dy = -r; dy <= r; dy++) {
    const hw = Math.floor(Math.sqrt(r * r - dy * dy));
    ctx.fillRect(cx - hw, cy + dy, hw * 2 + 1, 1);
  }
}

// Texto bitmap; `chars` limita los caracteres visibles (máquina de escribir).
export function text(ctx, str, x, y, { scale = 1, color = 'w', align = 'left', chars = Infinity, lineH = 10 } = {}) {
  ctx.fillStyle = col(color);
  let left = chars;
  str.split('\n').forEach((line, li) => {
    const w = textWidth(line, scale);
    let cx = align === 'center' ? Math.round(x - w / 2) : x;
    const cy = y + li * lineH * scale;
    for (const ch of line) {
      if (left-- <= 0) return;
      const g = GLYPHS[ch];
      if (g) for (let j = 0; j < 7; j++) for (let i = 0; i < 5; i++) if (g[j][i] === '1') ctx.fillRect(cx + i * scale, cy + j * scale, scale, scale);
      cx += ADVANCE * scale;
    }
    left--; // el salto de línea cuenta como pulsación
  });
}

// Cuadro de diálogo NES: fondo negro, doble borde blanco.
export function box(ctx, x, y, w, h) {
  rect(ctx, x, y, w, h, 'k');
  rect(ctx, x + 1, y + 1, w - 2, 1, 'w'); rect(ctx, x + 1, y + h - 2, w - 2, 1, 'w');
  rect(ctx, x + 1, y + 1, 1, h - 2, 'w'); rect(ctx, x + w - 2, y + 1, 1, h - 2, 'w');
}

// Iris NES: todo negro salvo un círculo de radio r.
export function iris(ctx, cx, cy, r) {
  ctx.fillStyle = '#000000';
  for (let y = 0; y < LH; y++) {
    const dy = y - cy;
    if (Math.abs(dy) > r) { ctx.fillRect(0, y, LW, 1); continue; }
    const hw = Math.floor(Math.sqrt(r * r - dy * dy));
    ctx.fillRect(0, y, Math.max(0, cx - hw), 1);
    ctx.fillRect(cx + hw + 1, y, LW, 1);
  }
}
