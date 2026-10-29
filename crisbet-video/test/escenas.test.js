const test = require('node:test');
const assert = require('node:assert');
const { ESCENAS, DURACION } = require('../src/escenas.js');

test('las escenas van una tras otra, sin huecos ni encimarse', () => {
  assert.strictEqual(ESCENAS[0].t, 0);
  for (let i = 1; i < ESCENAS.length; i++) {
    const prev = ESCENAS[i - 1];
    assert.strictEqual(ESCENAS[i].t, prev.t + prev.dur, `escena ${i} empieza en ${ESCENAS[i].t}`);
  }
});

test('el video dura entre 60 y 90 segundos', () => {
  assert.ok(DURACION >= 60 && DURACION <= 90, `dura ${DURACION}`);
});

test('cada texto es corto (≤ 12 palabras) y se ve al menos 3 s', () => {
  for (const e of ESCENAS) {
    assert.ok(e.dur >= 3, `"${e.texto}" dura ${e.dur}`);
    assert.ok(e.texto.split(/\s+/).filter(Boolean).length <= 12, `"${e.texto}" es largo`);
    if (!e.tarjeta) assert.ok(e.texto.length > 0, 'escena sin texto');
  }
});

test('los pasos caen dentro de su escena y en orden', () => {
  for (const e of ESCENAS) {
    let ultimo = e.t;
    for (const p of e.pasos || []) {
      assert.ok(['scroll', 'click', 'senalar', 'escribir'].includes(p.hacer), p.hacer);
      assert.ok(p.at >= ultimo, `paso en ${p.at} fuera de orden`);
      assert.ok(p.at + (p.dur || 0) <= e.t + e.dur, `paso en ${p.at} se sale de la escena ${e.t}`);
      assert.ok(p.sel, 'paso sin selector');
      ultimo = p.at;
    }
  }
});
