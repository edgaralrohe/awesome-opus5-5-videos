import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { TEXTS_TL, FACTS } from '../src/timeline.js';

const facts = readFileSync(new URL('../FACTS.md', import.meta.url), 'utf8');
const all = TEXTS_TL.map((x) => x.text).join(' \n ');

test('cada dato en pantalla está en FACTS.md con 2 fuentes o más', () => {
  for (const f of FACTS) {
    assert.ok(all.includes(f.screen), `no sale en pantalla: ${f.screen}`);
    const row = facts.split('\n').find((l) => l.includes(`| ${f.id} |`));
    assert.ok(row, `falta ${f.id} en FACTS.md`);
    assert.ok((row.match(/https?:\/\//g) || []).length >= 2, `${f.id}: menos de 2 fuentes`);
  }
});

test('rótulo de homenaje, fecha de estreno y dónde se juega', () => {
  assert.match(all, /HOMENAJE NO OFICIAL · @COLORESRUIDOSOS/);
  assert.match(all, /VIERNES 6 NOV/);
  assert.match(all, /COLORESRUIDOSOS\.GITHUB\.IO/);
  assert.match(all, /GAMES/);
});

test('la Arena es destino, no nivel; sin marcas ni medios de terceros', () => {
  assert.doesNotMatch(all, /NIVEL[^\n]*ARENA|JUEGA[^\n]*ARENA/);
  for (const bad of [/GNP/i, /NINTENDO/i, /NEO ?GEO/i, /TICKETMASTER/i, /SPOTIFY/i]) assert.doesNotMatch(all, bad);
});
