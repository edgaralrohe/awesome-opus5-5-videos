import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import { buildSchedule } from '../src/reel/schedule.js';
import { BPM, CARDS } from '../src/noche/script.js';
import { MASKS, CENTER, maskSlots } from '../src/noche/masks.js';

describe('script (N-T1)', () => {
  test('7 tarjetas, 36 s a 120 bpm, cortes en 0/4/8/14/22/28/33', () => {
    const s = buildSchedule(CARDS, 120, 0);
    assert.equal(CARDS.length, 7);
    assert.deepEqual(s.map((c) => c.start), [0, 4, 8, 14, 22, 28, 33]);
    assert.equal(s.at(-1).end, 36);
    assert.ok(BPM > 40 && BPM < 240);
  });

  test('cada fase visual tiene su tarjeta', () => {
    for (const fx of ['freeze', 'vinyl', 'glow', 'swap', 'drop', 'logo']) {
      assert.ok(CARDS.some((c) => c.fx === fx), fx);
    }
  });
});

describe('masks (N-T2)', () => {
  const opts = { swapStart: 22, bpm: 120, swaps: 5, every: 2 };
  const sorted = (slots) => slots.map((s) => s.mask).sort();

  test('en todo t cada invitado lleva una máscara distinta', () => {
    for (let t = 0; t <= 36; t += 0.05) assert.deepEqual(sorted(maskSlots(t, opts)), [...MASKS].sort(), `t=${t}`);
  });

  test('antes del intercambio la de hockey está en el centro y todo quieto', () => {
    const s = maskSlots(10, opts);
    assert.equal(s[CENTER].mask, 'hockey');
    for (const slot of s) assert.equal(slot.p, 1);
  });

  test('cada 2 pulsos las máscaras pasan al invitado de la izquierda', () => {
    const before = maskSlots(22.9, opts), after = maskSlots(23.05, opts);
    for (let i = 0; i < MASKS.length; i++) {
      assert.equal(after[i].mask, before[(i + 1) % MASKS.length].mask);
      assert.equal(after[i].from, (i + 1) % MASKS.length);
      assert.ok(after[i].p < 1);
    }
    assert.equal(maskSlots(23.9, opts)[0].p, 1);
  });

  test('tras 5 intercambios la de hockey vuelve al centro (para caer en T6)', () => {
    const s = maskSlots(29, opts);
    assert.equal(s[CENTER].mask, 'hockey');
    for (const slot of s) assert.equal(slot.p, 1);
  });
});
