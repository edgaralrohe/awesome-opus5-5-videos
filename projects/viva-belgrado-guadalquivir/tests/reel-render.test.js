import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { openStage } from '../scripts/browser.mjs';

const sha = (buf) => createHash('sha256').update(buf).digest('hex');
let stage;

before(async () => { stage = await openStage({ page: 'reel.html' }); });
after(async () => { await stage?.close(); });

test('reel.html carga sin errores y dura 80 s (R-T9)', async () => {
  assert.deepEqual(stage.errors.map(String), []);
  assert.equal(await stage.page.evaluate(() => window.__duration), 80);
});

test('el reel es determinista y cada escena es distinta', async () => {
  const hashes = new Set();
  for (const t of [1, 8, 16, 21, 30, 39, 50, 70, 78]) {
    const a = sha(await stage.render(t));
    assert.equal(a, sha(await stage.render(t)), `t=${t}`);
    hashes.add(a);
  }
  assert.equal(hashes.size, 9);
});

test('no quedan tarjetas pendientes', async () => {
  assert.deepEqual(await stage.page.evaluate(() => window.__pending), []);
});
