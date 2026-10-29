import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import { buildSchedule, cardAt, beatPhase } from '../src/reel/schedule.js';
import { wrapLines } from '../src/reel/wrap.js';
import { BPM, OFFSET, SCENES, CARDS } from '../src/reel/script.js';

const cards = [{ id: 'a', beats: 4 }, { id: 'b', beats: 6 }, { id: 'c', beats: 2 }];

describe('schedule (R-T1)', () => {
  test('contiguo y con la duración correcta', () => {
    const s = buildSchedule(cards, 120, 0);
    assert.deepEqual(s.map((c) => [c.start, c.end]), [[0, 2], [2, 5], [5, 6]]);
  });

  test('otro BPM escala y el offset desplaza', () => {
    const s = buildSchedule(cards, 60, 0.5);
    assert.equal(s[0].start, 0.5);
    assert.equal(s.at(-1).end, 12.5);
  });

  test('cardAt en los bordes', () => {
    const s = buildSchedule(cards, 120, 0);
    assert.equal(cardAt(s, 0).id, 'a');
    assert.equal(cardAt(s, 1.999).id, 'a');
    assert.equal(cardAt(s, 2).id, 'b');
    assert.equal(cardAt(s, 6).id, 'c'); // último fotograma
    assert.equal(cardAt(s, -1).id, 'a');
  });

  test('beatPhase en [0,1) y 0 en cada pulso', () => {
    assert.equal(beatPhase(1.5, 120, 0), 0);
    assert.ok(Math.abs(beatPhase(1.75, 120, 0) - 0.5) < 1e-9);
    for (let t = 0; t < 10; t += 0.07) {
      const p = beatPhase(t, 97, 0.2);
      assert.ok(p >= 0 && p < 1);
    }
  });
});

describe('wrap (R-T2)', () => {
  const measure = (s) => s.length * 10;

  test('ninguna línea supera el ancho', () => {
    const text = 'Pero cuando todo lo anterior es arte, empatar es enorme.';
    const lines = wrapLines(text, 200, measure);
    assert.ok(lines.length > 1);
    for (const l of lines) assert.ok(measure(l) <= 200 || !l.includes(' '), l);
    assert.equal(lines.join(' '), text);
  });

  test('una palabra larga queda sola', () => {
    assert.deepEqual(wrapLines('supercalifragilístico sí', 100, measure), ['supercalifragilístico', 'sí']);
  });

  test('respeta saltos de línea explícitos', () => {
    assert.deepEqual(wrapLines('uno\ndos', 1000, measure), ['uno', 'dos']);
  });
});

describe('script (R-T3)', () => {
  const sched = buildSchedule(CARDS, 120, 0);

  test('34 tarjetas T1…T34 en orden', () => {
    assert.equal(CARDS.length, 34);
    CARDS.forEach((c, i) => assert.equal(c.id, `T${i + 1}`));
    for (const c of CARDS) assert.ok(SCENES.some((s) => s.id === c.scene), c.id);
  });

  test('las escenas empiezan donde dice el guion (a 120 bpm)', () => {
    const expected = { gancho: 0, ficha: 4, tema: 14, voz: 24, critica: 42, veredicto: 66, cierre: 76 };
    for (const [scene, start] of Object.entries(expected)) {
      const first = sched.find((c) => c.scene === scene);
      assert.ok(Math.abs(first.start - start) < 0.01, `${scene}: ${first.start}`);
    }
    assert.ok(Math.abs(sched.at(-1).end - 80) < 0.01);
  });

  test('sin pendientes; ≥ 4 pulsos salvo frases muy cortas (T16 firma, T28)', () => {
    assert.deepEqual(CARDS.filter((c) => c.pending).map((c) => c.id), []);
    for (const c of CARDS) if (!['T16', 'T28'].includes(c.id)) assert.ok(c.beats >= 4, c.id);
  });

  test('la cita de T15 es literal y lleva fuente (titular de Mondo Sonoro, 23/10/2026)', () => {
    const q = CARDS.find((c) => c.id === 'T15');
    assert.equal(q.text, '«Una de las responsabilidades de hacerse mayor es ser feliz.»');
    assert.match(q.source, /mondosonoro\.com/);
  });

  test('el BPM y el offset por defecto son válidos', () => {
    assert.ok(BPM > 40 && BPM < 240);
    assert.ok(OFFSET >= 0);
  });
});
