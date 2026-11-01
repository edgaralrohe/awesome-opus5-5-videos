import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import { PAL } from '../src/cabanas/palette.js';
import { SPRITES } from '../src/cabanas/sprites.js';
import { GLYPHS, textWidth } from '../src/cabanas/font.js';
import { BPM, BAR, LEVELS, SEGMENTS, DURATION, TEXTS, segmentAt } from '../src/cabanas/timeline.js';
import { renderChiptune } from '../src/cabanas/chiptune.js';

describe('palette + sprites (K-T1)', () => {
  test('cada sprite es rectangular y solo usa claves de la paleta', () => {
    for (const [name, rows] of Object.entries(SPRITES)) {
      assert.ok(rows.length > 0, name);
      for (const r of rows) {
        assert.equal(r.length, rows[0].length, `${name}: fila de ancho distinto`);
        for (const ch of r) assert.ok(ch in PAL, `${name}: '${ch}' no está en la paleta`);
      }
    }
  });

  test('los objetos de disco son de 16×16', () => {
    for (const l of LEVELS) {
      const s = SPRITES[l.item];
      assert.ok(s, l.item);
      assert.equal(s.length, 16, l.item);
      assert.equal(s[0].length, 16, l.item);
    }
  });

  test('la paleta son colores hex o transparente', () => {
    for (const [k, v] of Object.entries(PAL)) assert.ok(v === null || /^#[0-9a-f]{6}$/i.test(v), k);
  });
});

describe('font (K-T2)', () => {
  test('glifos 5×7', () => {
    for (const [ch, g] of Object.entries(GLYPHS)) {
      assert.equal(g.length, 7, ch);
      for (const r of g) assert.match(r, /^[01]{5}$/, ch);
    }
  });

  test('hay glifo para todo lo que se escribe en pantalla', () => {
    for (const s of TEXTS) for (const ch of s) assert.ok(ch === ' ' || ch === '\n' || GLYPHS[ch], `falta '${ch}' en «${s}»`);
  });

  test('ningún texto supera el ancho lógico (135 px) a escala 1', () => {
    for (const s of TEXTS) for (const line of s.split('\n')) assert.ok(textWidth(line) <= 131, line);
  });
});

describe('timeline (K-T3)', () => {
  test('8 niveles en orden cronológico', () => {
    assert.equal(LEVELS.length, 8);
    assert.deepEqual(LEVELS.map((l) => l.title), ['CARMESÍ', 'NOCHE', 'ALBA', 'PSALMOS', 'GIALLO', 'AURORA', 'SARAJEVO', 'QUERIDO…']);
    for (let i = 1; i < LEVELS.length; i++) assert.ok(LEVELS[i].year > LEVELS[i - 1].year);
  });

  test('bloques en compases enteros, contiguos, total 67,2 s', () => {
    assert.equal(BAR, (4 * 60) / BPM);
    assert.equal(SEGMENTS[0].start, 0);
    for (let i = 0; i < SEGMENTS.length; i++) {
      const s = SEGMENTS[i];
      const bars = (s.end - s.start) / BAR;
      assert.ok(Math.abs(bars - Math.round(bars)) < 1e-9, s.id);
      if (i) assert.ok(Math.abs(s.start - SEGMENTS[i - 1].end) < 1e-9, s.id);
    }
    assert.ok(Math.abs(DURATION - 67.2) < 1e-9);
  });

  test('segmentAt en los bordes', () => {
    assert.equal(segmentAt(0).id, 'titulo');
    assert.equal(segmentAt(9.6).id, 'nivel1');
    assert.equal(segmentAt(9.59).id, 'mapa');
    assert.equal(segmentAt(DURATION).id, 'cierre');
  });
});

describe('chiptune (K-T4)', () => {
  const sr = 8000;
  const a = renderChiptune({ sampleRate: sr, duration: 6.4 });

  test('duración exacta y determinista', () => {
    assert.equal(a.length, Math.round(6.4 * sr));
    assert.deepEqual(renderChiptune({ sampleRate: sr, duration: 6.4 }).slice(0, 4000), a.slice(0, 4000));
  });

  test('sin saturar y con sonido', () => {
    let peak = 0, energy = 0;
    for (const v of a) { peak = Math.max(peak, Math.abs(v)); energy += v * v; }
    assert.ok(peak <= 0.9, `pico ${peak}`);
    assert.ok(energy / a.length > 0.001);
  });
});
