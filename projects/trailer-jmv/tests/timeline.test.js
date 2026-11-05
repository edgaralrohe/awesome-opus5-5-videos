import { test } from 'node:test';
import assert from 'node:assert/strict';
import { BPM, BEAT, DUR, SECS, CUTS, TEXTS_TL, SHOTS, readTime } from '../src/timeline.js';

test('120 bpm, 44 s, 22 compases', () => {
  assert.equal(BPM, 120); assert.equal(BEAT, 0.5); assert.equal(DUR, 44);
  assert.equal(SECS.at(-1).t + SECS.at(-1).bars * 4 * BEAT, DUR);
});

test('las secciones van seguidas y empiezan en compás', () => {
  let t = 0;
  for (const s of SECS) { assert.equal(s.t, t, s.id); assert.equal((s.t / (4 * BEAT)) % 1, 0, s.id); t += s.bars * 4 * BEAT; }
});

test('cada corte cae en el tiempo 1 o en el 3', () => {
  for (const c of CUTS) assert.equal(Math.round(c.t / BEAT) % 2, 0, `${c.id} en ${c.t}`), assert.ok(Math.abs(c.t / BEAT - Math.round(c.t / BEAT)) < 1e-9, c.id);
});

test('cada texto dura al menos su tiempo de lectura (letras ÷ 15 + 1,5 s) y la tarjeta final ≥ 4 s', () => {
  for (const x of TEXTS_TL) {
    const vis = x.t1 - x.t0 - (x.type ? x.text.length / 38 : 0);
    assert.ok(vis >= readTime(x.text) - 1e-9, `«${x.text}»: ${vis.toFixed(2)} s < ${readTime(x.text).toFixed(2)} s`);
    assert.ok(x.t0 >= 0 && x.t1 <= DUR);
  }
  const fin = SECS.find((s) => s.id === 'cierre');
  assert.ok(fin.bars * 4 * BEAT >= 4);
});

test('hay un silencio total antes del giro y Noche empieza justo después', () => {
  const c = SECS.find((s) => s.id === 'carmesi'), noche = SECS.find((s) => s.id === 'noche');
  assert.equal(c.t + c.bars * 4 * BEAT, noche.t);
  assert.ok(c.silence > c.t && c.silence < noche.t);
});

test('guion v2: premisa, 4 consejos de «CÓMO SE JUEGA», dos mundos y cierre', () => {
  const tx = TEXTS_TL.map((x) => x.text);
  for (let i = 1; i <= 4; i++) assert.ok(tx.includes(`CÓMO SE JUEGA · ${i}/4`));
  for (const s of ['PEPE NO RECUERDA QUIÉN ES', 'EL MICRÓFONO GOLPEA', 'LA PRENSA TE PERSIGUE', '¡SOLO DE GUITARRA!', 'DATOS REALES CON FUENTE']) assert.ok(tx.includes(s), s);
  assert.ok(DUR >= 40 && DUR <= 45);
});

test('las tomas cubren todo hasta el cierre, sin huecos, y el prólogo empieza en p3 (sin p1 ni p2)', () => {
  let t = 0;
  for (const s of SHOTS) { assert.equal(s.t0, t, `${s.clip}@${s.t0}`); t = s.t1; }
  assert.equal(t, SECS.find((s) => s.id === 'cierre').t);
  for (const s of SHOTS.filter((s) => s.clip === 'prologo')) assert.ok(s.from >= 144, 'p1 y p2 del prólogo no salen');
});
