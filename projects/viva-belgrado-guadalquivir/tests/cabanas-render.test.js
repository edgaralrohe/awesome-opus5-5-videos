import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { openStage } from '../scripts/browser.mjs';

const sha = (buf) => createHash('sha256').update(buf).digest('hex');
let stage;

before(async () => { stage = await openStage({ page: 'cabanas.html' }); });
after(async () => { await stage?.close(); });

test('cabanas.html carga sin errores y dura 67,2 s (K-T6)', async () => {
  assert.deepEqual(stage.errors.map(String), []);
  assert.equal(await stage.page.evaluate(() => window.__duration), 67.2);
});

test('determinista y cada bloque distinto', async () => {
  const hashes = new Set();
  for (const t of [3, 8, 10, 14, 20.5, 30, 62, 66]) {
    const a = sha(await stage.render(t));
    assert.equal(a, sha(await stage.render(t)), `t=${t}`);
    hashes.add(a);
  }
  assert.equal(hashes.size, 8);
});

test('pixel art real: cada bloque de 8×8 es de un solo color', async () => {
  const ok = await stage.page.evaluate(() => {
    window.__renderFrame(30);
    const d = document.getElementById('stage').getContext('2d').getImageData(0, 0, 1080, 1920).data;
    for (let y = 0; y < 1920; y += 8) for (let x = 0; x < 1080; x += 8) {
      const i0 = (y * 1080 + x) * 4, i1 = ((y + 7) * 1080 + x + 7) * 4;
      for (let c = 0; c < 3; c++) if (d[i0 + c] !== d[i1 + c]) return `${x},${y}`;
    }
    return true;
  });
  assert.equal(ok, true);
});
