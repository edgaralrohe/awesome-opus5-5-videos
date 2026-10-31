import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { openStage } from '../scripts/browser.mjs';

const sha = (buf) => createHash('sha256').update(buf).digest('hex');
let stage;

before(async () => { stage = await openStage({ page: 'noche.html' }); });
after(async () => { await stage?.close(); });

test('noche.html carga sin errores y dura 36 s (N-T6)', async () => {
  assert.deepEqual(stage.errors.map(String), []);
  assert.equal(await stage.page.evaluate(() => window.__duration), 36);
});

test('determinista y cada fase distinta', async () => {
  const hashes = new Set();
  for (const t of [2, 6, 11, 18, 23.2, 31, 35]) {
    const a = sha(await stage.render(t));
    assert.equal(a, sha(await stage.render(t)), `t=${t}`);
    hashes.add(a);
  }
  assert.equal(hashes.size, 7);
});

