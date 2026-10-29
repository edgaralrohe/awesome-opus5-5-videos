import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { openStage } from '../scripts/browser.mjs';

const sha = (buf) => createHash('sha256').update(buf).digest('hex');
let stage;

before(async () => { stage = await openStage(); });
after(async () => { await stage?.close(); });

test('la página carga sin errores y con las fuentes vendorizadas (T3.1)', async () => {
  assert.deepEqual(stage.errors.map(String), []);
  const fonts = await stage.page.evaluate(() =>
    ['400 50px "Instrument Serif"', 'italic 400 50px "Instrument Serif"', '700 50px Inter', '500 50px Inter'].map((f) => document.fonts.check(f)));
  assert.deepEqual(fonts, [true, true, true, true]);
});

test('renderFrame es determinista', async () => {
  for (const t of [0.5, 6, 15.3, 22, 28]) {
    assert.equal(sha(await stage.render(t)), sha(await stage.render(t)), `t=${t}`);
  }
});

test('tiempos distintos dan fotogramas distintos', async () => {
  const hashes = new Set();
  for (const t of [1, 5, 8, 14, 21, 27]) hashes.add(sha(await stage.render(t)));
  assert.equal(hashes.size, 6);
});

test('el fotograma tiene 1080×1920', async () => {
  const png = await stage.render(10);
  assert.equal(png.readUInt32BE(16), 1080);
  assert.equal(png.readUInt32BE(20), 1920);
});
