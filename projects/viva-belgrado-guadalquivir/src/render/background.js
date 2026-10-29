import { PALETTE } from '../config.js';
import { hash2, mulberry32 } from '../lib/rng.js';

const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));

function valueNoise(x, y, seed) {
  const xi = Math.floor(x), yi = Math.floor(y);
  const xf = x - xi, yf = y - yi;
  const s = (v) => v * v * (3 - 2 * v);
  const h = (a, b) => hash2(a + seed * 101, b - seed * 57);
  const top = h(xi, yi) + (h(xi + 1, yi) - h(xi, yi)) * s(xf);
  const bot = h(xi, yi + 1) + (h(xi + 1, yi + 1) - h(xi, yi + 1)) * s(xf);
  return top + (bot - top) * s(yf);
}

function fbm(x, y, seed, octaves = 5) {
  let v = 0, amp = 0.5, f = 1;
  for (let o = 0; o < octaves; o++) {
    v += amp * valueNoise(x * f, y * f, seed + o);
    f *= 2.03;
    amp *= 0.5;
  }
  return v / 0.97;
}

const canvas = (w, h) => Object.assign(document.createElement('canvas'), { width: w, height: h });

// Nube analógica: se calcula una vez a 1/4 de resolución y se escala (queda blanda).
function createCloud(W, H, seed) {
  const s = 4, w = Math.ceil(W / s) + 30, h = Math.ceil(H / s) + 30;
  const c = canvas(w, h), g = c.getContext('2d');
  const img = g.createImageData(w, h);
  const dark = hex(PALETTE.carbon), mid = hex(PALETTE.grafito), light = hex(PALETTE.niebla);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const warp = fbm(x / 90, y / 90, seed + 9, 3) * 2.2;
      let v = fbm(x / 70 + warp, y / 70 - warp, seed);
      const spots = fbm(x / 22, y / 22, seed + 33, 3);
      v = Math.min(1, Math.max(0, (v - 0.32) * 1.9)) - Math.max(0, spots - 0.62) * 1.4;
      v = Math.min(1, Math.max(0, v));
      const [a, b, k] = v < 0.5 ? [dark, mid, v * 2] : [mid, light, (v - 0.5) * 2];
      const i = (y * w + x) * 4;
      for (let ch = 0; ch < 3; ch++) img.data[i + ch] = a[ch] + (b[ch] - a[ch]) * k;
      img.data[i + 3] = 255;
    }
  }
  g.putImageData(img, 0, 0);
  return c;
}

function createGrain(seed, n = 4, size = 256) {
  return Array.from({ length: n }, (_, k) => {
    const c = canvas(size, size), g = c.getContext('2d');
    const img = g.createImageData(size, size);
    const r = mulberry32(seed + k * 77);
    for (let i = 0; i < img.data.length; i += 4) {
      const v = r() < 0.5 ? 0 : 255;
      img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
      img.data[i + 3] = r() * 70;
    }
    g.putImageData(img, 0, 0);
    return c;
  });
}

export function createSoftSprite(size = 128, stops = [[0, 1], [0.12, 0.95], [0.26, 0.35], [0.55, 0.08], [1, 0]]) {
  const c = canvas(size, size), g = c.getContext('2d');
  const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  for (const [o, a] of stops) grad.addColorStop(o, `rgba(255,255,255,${a})`);
  g.fillStyle = grad;
  g.fillRect(0, 0, size, size);
  return c;
}

export function createBackground(W, H, seed) {
  const cloud = createCloud(W, H, seed);
  const grain = createGrain(seed);
  const bokeh = createSoftSprite(128, [[0, 0.9], [0.6, 0.7], [0.8, 0.25], [1, 0]]);
  const r = mulberry32(seed + 5);
  const motes = Array.from({ length: 26 }, () => ({
    x: r() * W, y: r() * H, rad: 6 + r() ** 2 * 26, a: 0.03 + r() * 0.09,
    vx: (r() - 0.5) * 6, vy: -2 - r() * 6,
  }));
  const specks = Array.from({ length: 70 }, () => ({ x: r() * W, y: r() * H, rad: 0.8 + r() * 1.8, ph: r() * 6.28 }));

  // darkness: 0 = nube a la vista, 1 = carbón plano.
  return function drawBackground(ctx, t, darkness = 0.4) {
    ctx.fillStyle = PALETTE.carbon;
    ctx.fillRect(0, 0, W, H);
    ctx.save();
    ctx.imageSmoothingQuality = 'high';
    const ox = -60 + Math.sin(t * 0.11) * 30, oy = -60 + t * 1.5;
    ctx.globalAlpha = 1 - darkness;
    ctx.drawImage(cloud, ox, oy, W + 120, H + 120);
    ctx.restore();

    ctx.save();
    for (const m of motes) {
      const x = (m.x + m.vx * t + W) % W, y = (((m.y + m.vy * t) % H) + H) % H;
      ctx.globalAlpha = m.a * (1 - darkness * 0.6);
      ctx.drawImage(bokeh, x - m.rad, y - m.rad, m.rad * 2, m.rad * 2);
    }
    ctx.fillStyle = PALETTE.papel;
    for (const s of specks) {
      ctx.globalAlpha = 0.25 + 0.2 * Math.sin(t * 1.7 + s.ph);
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.rad, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  };
}

// Grano de película: se aplica al final de cada fotograma, encima de todo.
export function createGrainLayer(W, H, seed) {
  const tiles = createGrain(seed + 1);
  return function drawGrain(ctx, t, amount = 0.5) {
    const f = Math.floor(t * 30);
    const tile = tiles[f % tiles.length];
    const ox = Math.floor(hash2(f, seed) * 256), oy = Math.floor(hash2(seed, f) * 256);
    ctx.save();
    ctx.globalAlpha = amount;
    for (let y = -oy; y < H; y += 256) for (let x = -ox; x < W; x += 256) ctx.drawImage(tile, x, y);
    ctx.restore();
  };
}
