import { WIDTH, HEIGHT } from '../config.js';
import { ease } from '../lib/math.js';
import { createBackground, createSoftSprite } from '../render/background.js';
import { pencil, wobbleFill, resample, arc } from '../render/pencil.js';

// Paleta «Noche»: morado nocturno + luna + calabaza como único acento.
export const NOCHE = {
  night: '#0e0a16', violeta: '#3a2160', bruma: '#8a7aa8', luna: '#f3ead2',
  calabaza: '#ff7a1a', hueso: '#efe6d6', sangre: '#c2271f',
};
export const FLOOR = 1640;
const XS = [150, 345, 540, 735, 930];
export const DANCER_SCALE = 1.2;
const COSTUMES = ['#5a3a7a', '#2a2238', '#7a3d14', '#3a2160', '#4b4466'];

export function createNight(seed) {
  const fog = createBackground(WIDTH, HEIGHT, seed + 7);
  const glow = createSoftSprite(256);
  return function drawNight(ctx, t) {
    fog(ctx, t, 0.2);
    ctx.save();
    ctx.globalCompositeOperation = 'color';
    ctx.fillStyle = NOCHE.violeta;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.globalCompositeOperation = 'multiply';
    const g = ctx.createLinearGradient(0, 0, 0, HEIGHT);
    g.addColorStop(0, '#5a4a7a');
    g.addColorStop(0.55, '#8d82a6');
    g.addColorStop(1, '#3a3050');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.restore();

    // Luna a lápiz.
    const mx = 800, my = 330, r = 130;
    ctx.save();
    ctx.globalAlpha = 0.45;
    ctx.drawImage(glow, mx - r * 3, my - r * 3, r * 6, r * 6);
    ctx.restore();
    wobbleFill(ctx, arc(mx, my, r, r, 0, Math.PI * 2, 40), { t, seed: 11, amp: 1.2, color: NOCHE.luna });
    for (const [cx, cy, cr] of [[-40, -30, 26], [35, 20, 18], [-10, 55, 14], [50, -55, 10]]) {
      wobbleFill(ctx, arc(mx + cx, my + cy, cr, cr, 0, Math.PI * 2, 16), { t, seed: 12 + cr, amp: 0.8, color: NOCHE.bruma, alpha: 0.35 });
    }
    pencil(ctx, resample(arc(mx, my, r + 2, r + 2, 0, Math.PI * 2, 48), 6), { t, seed: 13, width: 3, color: NOCHE.luna, amp: 1.5 });

    // Murciélagos cartoon cruzando el cielo.
    for (let b = 0; b < 3; b++) {
      const u = ((t * 0.07 + b * 0.37) % 1.2) - 0.1;
      const x = u * WIDTH, y = 230 + b * 95 + Math.sin(t * 1.6 + b) * 30;
      const flap = Math.sin(t * 14 + b * 2) * 18;
      const s = 0.8 + b * 0.15;
      pencil(ctx, resample([[x - 46 * s, y - flap * s], [x - 22 * s, y - 6 * s], [x - 10 * s, y + 4 * s], [x, y - 4 * s],
        [x + 10 * s, y + 4 * s], [x + 22 * s, y - 6 * s], [x + 46 * s, y - flap * s]], 4), { t, seed: 20 + b, width: 6 * s, color: NOCHE.night, amp: 1, passes: 1 });
    }

    // Guirnalda de bombillas.
    const bulbs = 13;
    const rope = (k) => {
      const x = (k / (bulbs - 1)) * (WIDTH + 80) - 40;
      return [x, 1030 + Math.sin((k / (bulbs - 1)) * Math.PI) * 90];
    };
    pencil(ctx, resample(Array.from({ length: bulbs }, (_, k) => rope(k)), 8), { t, seed: 30, width: 2.5, color: NOCHE.luna, alpha: 0.6 });
    for (let k = 0; k < bulbs; k++) {
      const [x, y] = rope(k);
      const c = k % 2 ? NOCHE.calabaza : '#c9a6ff';
      const tw = 0.6 + 0.4 * Math.sin(t * 1.3 + k * 1.7);
      ctx.save();
      ctx.globalAlpha = 0.35 * tw;
      ctx.drawImage(glow, x - 40, y + 4 - 40, 80, 80);
      ctx.globalAlpha = 1;
      ctx.fillStyle = c;
      ctx.beginPath();
      ctx.arc(x, y + 14, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Suelo.
    ctx.fillStyle = '#0e0a16cc';
    ctx.fillRect(0, FLOOR, WIDTH, HEIGHT - FLOOR);
    pencil(ctx, resample([[0, FLOOR], [WIDTH, FLOOR + 4]], 8), { t, seed: 40, width: 3, color: NOCHE.luna, alpha: 0.8 });
  };
}

// Postura de un invitado: rebote al pulso, brazos arriba/abajo, balanceo.
export function pose(i, tt, bpm, still = false) {
  const ph = (tt * bpm) / 60 + (i % 2) * 0.5;
  const bob = still ? 0 : Math.abs(Math.sin(Math.PI * ph)) * 22;
  const sway = still ? 0 : Math.sin(Math.PI * ph) * 0.06;
  const arm = still ? -0.3 : Math.sin(Math.PI * ph * 0.5 + i) * 0.9;
  const x = XS[i], y = FLOOR;
  // Cabeza en coordenadas de lienzo (para dibujar la máscara aparte).
  const S = DANCER_SCALE;
  const hx = x + Math.sin(sway) * 290 * S, hy = y - (290 + bob) * S;
  return { x, y, bob, sway, arm, head: { x: hx, y: hy, rot: sway } };
}

export function drawDancer(ctx, t, i, P, { faceVisible = false, surprised = false } = {}) {
  const ink = NOCHE.luna, seed = 200 + i * 30;
  ctx.save();
  ctx.translate(P.x, P.y);
  ctx.scale(DANCER_SCALE, DANCER_SCALE);
  // Piernas (las rodillas se doblan con el rebote).
  for (const side of [-1, 1]) {
    pencil(ctx, resample([[side * 22, -110 - P.bob], [side * (30 + P.bob * 0.5), -55 - P.bob * 0.5], [side * 30, 0]], 5),
      { t, seed: seed + side, width: 9, color: NOCHE.night, amp: 1, passes: 1 });
  }
  ctx.translate(0, -P.bob);
  ctx.rotate(P.sway);
  // Brazos.
  for (const side of [-1, 1]) {
    const a = side * P.arm;
    const elbow = [side * 70, -200 + Math.sin(a) * 50];
    const hand = [side * (90 + Math.cos(a) * 10), -200 + Math.sin(a) * 120 - 40];
    pencil(ctx, resample([[side * 48, -215], elbow, hand], 5), { t, seed: seed + 3 + side, width: 9, color: NOCHE.night, amp: 1, passes: 1 });
    wobbleFill(ctx, arc(hand[0], hand[1], 11, 11, 0, Math.PI * 2, 10), { t, seed: seed + 5 + side, amp: 0.6, color: NOCHE.hueso });
  }
  // Cuerpo (disfraz).
  const body = [[-36, -100], [-56, -205], ...arc(0, -205, 56, 26, Math.PI, Math.PI * 2, 12), [56, -205], [36, -100], ...arc(0, -100, 36, 14, 0, Math.PI, 8)];
  wobbleFill(ctx, body, { t, seed, amp: 1.2, color: COSTUMES[i] });
  pencil(ctx, resample([...body, body[0]], 6), { t, seed: seed + 1, width: 3, color: ink, amp: 1.2 });
  // Cabeza.
  wobbleFill(ctx, [[-10, -232], [-10, -248], [10, -248], [10, -232]], { t, seed: seed + 7, amp: 0.5, color: NOCHE.hueso });
  const head = arc(0, -290, 46, 50, 0, Math.PI * 2, 28);
  wobbleFill(ctx, head, { t, seed: seed + 8, amp: 1, color: NOCHE.hueso });
  pencil(ctx, resample(head, 5), { t, seed: seed + 9, width: 3, color: ink, amp: 1 });
  if (faceVisible) {
    ctx.fillStyle = NOCHE.night;
    for (const ex of [-15, 15]) {
      ctx.beginPath();
      ctx.ellipse(ex, -298, 5, surprised ? 8 : 6, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.beginPath();
    if (surprised) ctx.ellipse(0, -268, 7, 9, 0, 0, Math.PI * 2);
    else ctx.ellipse(0, -270, 10, 4, 0, 0, Math.PI);
    ctx.fill();
  }
  ctx.restore();
}

// Máscaras, centradas en la cabeza (r = radio de la cabeza).
export function drawMask(ctx, t, kind, x, y, rot = 0, { glow = 0, sprite, scale = 1 } = {}) {
  const r = 50;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.scale(scale, scale);
  if (glow > 0 && sprite) {
    ctx.save();
    ctx.globalAlpha = glow * 0.8;
    ctx.drawImage(sprite, -r * 3, -r * 3, r * 6, r * 6);
    ctx.restore();
  }
  const ink = NOCHE.night;
  let seed = { calabaza: 1, gato: 2, hockey: 3, calavera: 4, antifaz: 5 }[kind] * 50;
  const fill = (pts, color, a = 1) => wobbleFill(ctx, pts, { t, seed: seed++, amp: 0.7, color, alpha: a });
  const line = (pts, color = ink, w = 3) => pencil(ctx, resample(pts, 4), { t, seed: seed++, width: w, color, amp: 0.8 });
  const eye = (ex, ey, rx, ry) => fill(arc(ex, ey, rx, ry, 0, Math.PI * 2, 14), ink);

  if (kind === 'hockey') {
    const o = arc(0, 0, r * 0.92, r * 1.12, 0, Math.PI * 2, 30);
    fill(o, NOCHE.hueso);
    line([...o, o[0]], ink, 3);
    eye(-17, -8, 11, 8); eye(17, -8, 11, 8);
    for (const [hx, hy] of [[-8, 18], [8, 18], [0, 30], [-16, 32], [16, 32], [0, 8]]) eye(hx, hy, 2.6, 2.6);
    for (const [cx, cy, rr] of [[0, -40, 0], [-30, 12, 0.6], [30, 12, -0.6]]) {
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(rr);
      fill([[-9, 5], [0, -7], [9, 5]], NOCHE.sangre);
      ctx.restore();
    }
  } else if (kind === 'calabaza') {
    const o = arc(0, 2, r * 1.08, r, 0, Math.PI * 2, 30);
    fill(o, NOCHE.calabaza);
    line([...o, o[0]], ink, 3);
    line(arc(0, 2, r * 0.45, r * 0.98, -Math.PI / 2, Math.PI / 2, 10), '#b04f0c', 2);
    line(arc(0, 2, r * 0.45, r * 0.98, Math.PI / 2, Math.PI * 1.5, 10), '#b04f0c', 2);
    fill([[-4, -r + 2], [-2, -r - 16], [8, -r - 18], [4, -r + 2]], '#3d6b2a');
    fill([[-28, -2], [-16, -22], [-6, -2]], ink); fill([[6, -2], [16, -22], [28, -2]], ink);
    fill([[-26, 16], [-18, 24], [-10, 16], [-2, 26], [6, 16], [14, 26], [22, 16], [26, 22], [0, 36], [-24, 24]], ink);
  } else if (kind === 'calavera') {
    const o = [...arc(0, -6, r * 0.95, r * 0.95, Math.PI * 0.85, Math.PI * 2.15, 24), [r * 0.5, r * 0.9], [-r * 0.5, r * 0.9]];
    fill(o, NOCHE.hueso);
    line([...o, o[0]], ink, 3);
    eye(-17, -6, 13, 15); eye(17, -6, 13, 15);
    fill([[-6, 18], [0, 8], [6, 18]], ink);
    for (let k = -2; k <= 2; k++) line([[k * 9, 30], [k * 9, 42]], ink, 2.5);
  } else if (kind === 'gato') {
    fill([[-44, -26], [-38, -78], [-12, -44]], ink); fill([[44, -26], [38, -78], [12, -44]], ink);
    const band = [[-50, -18], [50, -18], [46, 10], [10, 14], [0, 6], [-10, 14], [-46, 10]];
    fill(band, ink);
    fill(arc(-20, -4, 10, 5, 0, Math.PI * 2, 12), '#c9e86b'); fill(arc(20, -4, 10, 5, 0, Math.PI * 2, 12), '#c9e86b');
    eye(-20, -4, 2, 5); eye(20, -4, 2, 5);
    for (const s of [-1, 1]) for (const dy of [18, 26]) line([[s * 14, dy], [s * 52, dy + (dy - 22) * 2]], NOCHE.night, 2);
  } else if (kind === 'antifaz') {
    const band = [[-56, -20], [56, -20], [50, 12], [12, 16], [0, 6], [-12, 16], [-50, 12]];
    fill(band, '#7b3fe4');
    line([...band, band[0]], ink, 3);
    fill(arc(-22, -2, 12, 7, 0, Math.PI * 2, 12), NOCHE.hueso); fill(arc(22, -2, 12, 7, 0, Math.PI * 2, 12), NOCHE.hueso);
    eye(-22, -2, 4, 4); eye(22, -2, 4, 4);
    line([[50, -18], [70, -60], [62, -64], [48, -24]], NOCHE.calabaza, 4);
  }
  ctx.restore();
}

// Vinilo genérico (no imita la portada real del disco).
export function drawVinyl(ctx, t, { cx, cy, p }) {
  if (p <= 0) return;
  const R = 270, rot = t * 0.55 * Math.PI * 2;
  ctx.save();
  ctx.translate(cx, cy + (1 - ease.outBack(p)) * 900);
  ctx.fillStyle = '#0006';
  ctx.beginPath(); ctx.arc(14, 18, R, 0, Math.PI * 2); ctx.fill();
  ctx.rotate(rot);
  ctx.fillStyle = '#0b0910';
  ctx.beginPath(); ctx.arc(0, 0, R, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = 'rgba(138,122,168,0.25)';
  ctx.lineWidth = 1.5;
  for (let rr = 110; rr < R - 8; rr += 9) { ctx.beginPath(); ctx.arc(0, 0, rr, 0, Math.PI * 2); ctx.stroke(); }
  ctx.strokeStyle = 'rgba(243,234,210,0.35)';
  ctx.lineWidth = 6;
  ctx.beginPath(); ctx.arc(0, 0, R - 40, -0.5, 0.2); ctx.stroke();
  ctx.fillStyle = NOCHE.violeta;
  ctx.beginPath(); ctx.arc(0, 0, 100, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = NOCHE.luna;
  ctx.textAlign = 'center';
  ctx.font = '400 64px "Instrument Serif", serif';
  ctx.fillText('Noche', 0, 6);
  ctx.font = '500 20px Inter, sans-serif';
  ctx.fillText('JOSÉ MADERO · 2017', 0, 42);
  ctx.fillStyle = NOCHE.night;
  ctx.beginPath(); ctx.arc(0, 0, 8, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}
