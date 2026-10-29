import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import { clamp, lerp, mapRange, ease } from '../src/lib/math.js';
import { mulberry32, hash2 } from '../src/lib/rng.js';
import { DURATION, SCENES, progress, sceneWeights } from '../src/lib/timeline.js';
import { BOIL_FPS, boilFrame, jitter } from '../src/lib/boil.js';
import { createRiver } from '../src/lib/river.js';
import { WIDTH, HEIGHT } from '../src/config.js';

describe('math (T1.1)', () => {
  test('clamp, lerp, mapRange', () => {
    assert.equal(clamp(5, 0, 1), 1);
    assert.equal(clamp(-5, 0, 1), 0);
    assert.equal(lerp(10, 20, 0.5), 15);
    assert.equal(mapRange(5, 0, 10, 100, 200), 150);
    assert.equal(mapRange(50, 0, 10, 0, 1, true), 1);
  });

  test('todos los easings van de 0 a 1', () => {
    for (const [name, f] of Object.entries(ease)) {
      assert.ok(Math.abs(f(0)) < 1e-9, `${name}(0)`);
      assert.ok(Math.abs(f(1) - 1) < 1e-9, `${name}(1)`);
    }
  });

  test('outBack hace overshoot', () => {
    const peak = Math.max(...Array.from({ length: 101 }, (_, i) => ease.outBack(i / 100)));
    assert.ok(peak > 1.02);
  });
});

describe('rng (T1.2)', () => {
  test('mulberry32 es determinista y está en [0,1)', () => {
    const a = mulberry32(42), b = mulberry32(42), c = mulberry32(7);
    const sa = Array.from({ length: 50 }, a);
    const sb = Array.from({ length: 50 }, b);
    const sc = Array.from({ length: 50 }, c);
    assert.deepEqual(sa, sb);
    assert.notDeepEqual(sa, sc);
    for (const v of sa) assert.ok(v >= 0 && v < 1);
  });

  test('hash2 es estable y está en [0,1)', () => {
    assert.equal(hash2(3, 9), hash2(3, 9));
    assert.notEqual(hash2(3, 9), hash2(9, 3));
    for (let i = 0; i < 100; i++) {
      const v = hash2(i, i * 7 + 1);
      assert.ok(v >= 0 && v < 1);
    }
  });
});

describe('timeline (T1.3)', () => {
  test('dura 30 s y las escenas cubren [0,30] sin huecos', () => {
    assert.equal(DURATION, 30);
    assert.equal(SCENES[0].start, 0);
    assert.equal(SCENES.at(-1).end, DURATION);
    for (let i = 1; i < SCENES.length; i++) {
      assert.ok(SCENES[i].start <= SCENES[i - 1].end, `hueco antes de ${SCENES[i].id}`);
    }
  });

  test('progress está acotado', () => {
    assert.equal(progress(-1, 2, 4), 0);
    assert.equal(progress(3, 2, 4), 0.5);
    assert.equal(progress(9, 2, 4), 1);
  });

  test('siempre hay alguna escena activa', () => {
    for (let t = 0; t <= DURATION; t += 0.1) {
      const w = sceneWeights(t);
      const vals = Object.values(w);
      for (const v of vals) assert.ok(v >= 0 && v <= 1);
      assert.ok(Math.max(...vals) > 0.99, `t=${t.toFixed(1)}`);
    }
  });
});

describe('boil (T1.4)', () => {
  test('cambia 12 veces por segundo', () => {
    assert.equal(BOIL_FPS, 12);
    const frames = new Set();
    for (let i = 0; i < 30; i++) frames.add(boilFrame(1 + i / 30));
    assert.equal(frames.size, 12);
  });

  test('jitter determinista y acotado', () => {
    assert.equal(jitter(5, 3, 2), jitter(5, 3, 2));
    for (let i = 0; i < 200; i++) {
      const v = jitter(i, i % 17, 3);
      assert.ok(Math.abs(v) <= 3);
    }
  });
});

describe('river (T1.5)', () => {
  const river = createRiver();

  test('baja de arriba abajo', () => {
    const top = river.pointAt(0), bottom = river.pointAt(1);
    assert.ok(top.y < HEIGHT * 0.2);
    assert.ok(bottom.y > HEIGHT * 0.9);
    let prev = -Infinity, downs = 0;
    for (let u = 0; u <= 1; u += 0.05) {
      const { y } = river.pointAt(u);
      if (y >= prev) downs++;
      prev = y;
    }
    assert.ok(downs >= 19);
  });

  test('parametrizado por longitud de arco (±5 %)', () => {
    const n = 100, lens = [];
    for (let i = 0; i < n; i++) {
      const a = river.pointAt(i / n), b = river.pointAt((i + 1) / n);
      lens.push(Math.hypot(b.x - a.x, b.y - a.y));
    }
    const mean = lens.reduce((s, l) => s + l, 0) / n;
    for (const l of lens) assert.ok(Math.abs(l - mean) / mean < 0.05);
  });

  test('dotsAt es determinista y queda dentro del lienzo', () => {
    const a = river.dotsAt(12.3), b = river.dotsAt(12.3);
    assert.equal(a.length, river.count);
    assert.deepEqual(a, b);
    for (const d of a) {
      assert.ok(d.x >= 0 && d.x <= WIDTH);
      assert.ok(d.y >= -50 && d.y <= HEIGHT + 50);
      assert.ok(d.r > 0);
    }
    assert.notDeepEqual(river.dotsAt(12.3), river.dotsAt(13));
  });
});
