import { test } from 'node:test';
import assert from 'node:assert/strict';
import { BPM, BEAT, DUR, SECS, CUTS, TEXTS_TL, SHOTS, readTime } from '../src/timeline.js';

test('120 bpm, 50 s, 25 compases', () => {
  assert.equal(BPM, 120); assert.equal(BEAT, 0.5); assert.equal(DUR, 50);
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
  for (const s of ['SIN SABER QUIÉN ES', 'EL MICRÓFONO GOLPEA', 'LA PRENSA TE PERSIGUE', '¡SOLO DE GUITARRA!', 'DATOS REALES CON FUENTE']) assert.ok(tx.includes(s), s);
  assert.ok(DUR >= 40 && DUR <= 50);
  for (const s of ['EL VIERNES: MUNDOS 1 Y 2', 'UN DISCO CADA 2 SEMANAS']) assert.ok(tx.includes(s), s);
});

test('las tomas cubren todo hasta el cierre, sin huecos; abre con p2 (la Arena) y sin p1', () => {
  let t = 0;
  for (const s of SHOTS) { assert.equal(s.t0, t, `${s.clip}@${s.t0}`); t = s.t1; }
  assert.equal(t, SECS.find((s) => s.id === 'cierre').t);
  assert.equal(SHOTS[0].clip, 'prologo'); assert.ok(SHOTS[0].from >= 72 && SHOTS[0].from < 144, 'la primera toma es p2');
  for (const s of SHOTS.filter((s) => s.clip === 'prologo')) { assert.ok(s.from >= 72, 'p1 no sale'); const end = s.from + Math.ceil(((s.freeze ?? s.t1) - s.t0) * 24) - 1; /* último fotograma que se dibuja */ assert.ok(Math.floor(end / 72) === Math.floor(s.from / 72), `${s.from}: la toma no se pasa a la viñeta siguiente`); }
});

test('la premisa se cuenta en cadena: la Arena abre, es el plazo y nada dice «esa noche»', () => {
  const pre = TEXTS_TL.filter((x) => x.t1 <= 14 && x.id !== 'titulo');
  const first = pre.filter((x) => x.t0 === 0).map((x) => x.text).join(' ');
  assert.match(first, /PRÓXIMO CONCIERTO/); assert.match(first, /ARENA/);
  assert.ok(pre.some((x) => /RECUPÉRALAS ANTES DE LA ARENA/.test(x.text)), 'la misión tiene plazo: la Arena');
  for (const x of TEXTS_TL) assert.doesNotMatch(x.text, /ESA NOCHE/);
  // Las viñetas del prólogo se muestran sin su texto propio (que dependía de p1).
  for (const s of SHOTS.filter((s) => s.clip === 'prologo')) assert.equal(s.crop, 151, `prólogo @${s.t0} recortado`);
});
