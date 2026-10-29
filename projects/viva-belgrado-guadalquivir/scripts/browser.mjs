import { createRequire } from 'node:module';
import { startServer } from './server.mjs';
import { WIDTH, HEIGHT } from '../src/config.js';

// Playwright viene preinstalado en el entorno; require() también lo encuentra fuera del proyecto.
const { chromium } = createRequire(import.meta.url)('playwright');

// Abre la página en modo render y devuelve render(t) → Buffer PNG.
export async function openStage() {
  const server = await startServer();
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: WIDTH, height: HEIGHT }, deviceScaleFactor: 1 });
  const errors = [];
  page.on('pageerror', (e) => errors.push(e));
  page.on('console', (m) => m.type() === 'error' && errors.push(new Error(m.text())));
  await page.goto(`http://127.0.0.1:${server.address().port}/index.html?render=1`);
  await page.evaluate(() => window.__ready);
  return {
    errors,
    page,
    async render(t) {
      const url = await page.evaluate((tt) => window.__renderFrame(tt), t);
      return Buffer.from(url.slice(url.indexOf(',') + 1), 'base64');
    },
    async close() {
      await browser.close();
      server.close();
    },
  };
}
