const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');
const { servir, ORIGEN } = require('../src/servir.js');

const HTML = fs.readFileSync(path.join(__dirname, '../src/assets/pagina.html'), 'utf8');

test('la página usa el WhatsApp real 55 9108 1144', () => {
  assert.match(HTML, /const TEL = "525591081144"/);
  assert.doesNotMatch(HTML, /5554623775/);
});

test('en el video la página dice "Abierto", detecta urgencias y todos los selectores existen', async () => {
  const { ESCENAS } = require('../src/escenas.js');
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 760 } });
    await servir(page);
    await page.goto(ORIGEN + 'assets/pagina.html');
    assert.match(await page.textContent('#ahora'), /^Abierto/);
    assert.strictEqual(await page.evaluate(() => esUrgente('Tengo una uña encarnada. Ya me sale pus.')), true);
    assert.strictEqual(await page.evaluate(() => esUrgente('Tengo una uña encarnada y juanetes.')), false);
    for (const e of ESCENAS) for (const p of e.pasos || [])
      assert.ok(await page.$(p.sel), `no existe ${p.sel}`);
    // el primer día que se ofrece no es jueves ni domingo
    const dia = await page.textContent('#dias .dia:nth-child(1) .s');
    assert.ok(!['jue', 'dom'].includes(dia), dia);
  } finally {
    await browser.close();
  }
});
