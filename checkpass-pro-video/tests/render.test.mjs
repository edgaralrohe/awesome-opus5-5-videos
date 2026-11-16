// T14: fotogramas clave renderizan sin errores, no vacíos, y con el texto clave visible.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright'); // Playwright preinstalado globalmente
import { openStage } from '../scripts/server.mjs';

let st;
before(async () => { st = await openStage(chromium); });
after(async () => st && st.close());

const KEY = [
  [1.8, 'Fila en la entrada'], [4.8, 'Gestión de Invitados y Mesas'], [9.0, 'Check-in en'],
  [13.8, 'Enviado'], [18.0, 'Mesa 4 · Familia Ramírez'], [22.0, '87%'],
  [25.0, 'XV años'], [29.0, 'Empieza gratis'],
];

for (const [t, text] of KEY) {
  test(`t=${t}s muestra "${text}"`, async () => {
    await st.page.evaluate(t => window.renderAt(t), t);
    const visible = await st.page.evaluate((text) => {
      const walker = document.createTreeWalker(document.getElementById('stage'), NodeFilter.SHOW_TEXT);
      for (let n; (n = walker.nextNode());) {
        if (!n.textContent.includes(text)) continue;
        let el = n.parentElement, op = 1;
        while (el && el.id !== 'stage') { const cs = getComputedStyle(el); if (cs.display === 'none') return false; op *= +cs.opacity; el = el.parentElement; }
        if (op > 0.9) return true;
      }
      return false;
    }, text);
    assert.ok(visible, `"${text}" no visible en t=${t}`);
    const png = await st.page.screenshot({ type: 'png' });
    assert.ok(png.length > 60_000, 'fotograma sospechosamente vacío');
  });
}

test('sin errores de JS ni precios visibles', async () => {
  for (let t = 0; t <= 30; t += 0.5) await st.page.evaluate(t => window.renderAt(t), t);
  assert.deepEqual(st.errors, []);
  const txt = await st.page.evaluate(() => document.getElementById('stage').innerText);
  assert.ok(!txt.includes('$'));
});
