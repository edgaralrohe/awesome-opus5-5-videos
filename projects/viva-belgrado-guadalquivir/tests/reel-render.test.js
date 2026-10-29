import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { openStage } from '../scripts/browser.mjs';

const sha = (buf) => createHash('sha256').update(buf).digest('hex');
let stage;

before(async () => { stage = await openStage({ page: 'reel.html' }); });
after(async () => { await stage?.close(); });

test('reel.html carga sin errores y dura 76 s (R-T9)', async () => {
  assert.deepEqual(stage.errors.map(String), []);
  assert.equal(await stage.page.evaluate(() => window.__duration), 76);
});

test('el reel es determinista y cada escena es distinta', async () => {
  const hashes = new Set();
  for (const t of [1, 8, 16, 21, 30, 45, 66, 74]) {
    const a = sha(await stage.render(t));
    assert.equal(a, sha(await stage.render(t)), `t=${t}`);
    hashes.add(a);
  }
  assert.equal(hashes.size, 8);
});

test('informa de las tarjetas pendientes', async () => {
  const pending = await stage.page.evaluate(() => window.__pending);
  assert.deepEqual(pending, ['T13', 'T14', 'T15']);
});
