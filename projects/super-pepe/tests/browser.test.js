import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';
import { mkdir } from 'node:fs/promises';

const { chromium } = createRequire(import.meta.url)('playwright');
let server, browser, page;
const errors = [];

before(async () => {
  server = spawn(process.execPath, ['scripts/serve.mjs'], { env: { ...process.env, PORT: '5199' }, stdio: 'pipe' });
  await new Promise((r) => server.stdout.once('data', r));
  browser = await chromium.launch();
  page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  await page.goto('http://127.0.0.1:5199/');
  await mkdir('out', { recursive: true });
});
after(async () => { await browser?.close(); server?.kill(); });

test('carga sin errores y muestra la portada', async () => {
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'out/01-portada.png' });
  assert.deepEqual(errors, []);
});

test('START arranca la partida y Pepe se mueve a la derecha', async () => {
  await page.keyboard.press('Enter');
  await page.waitForTimeout(200);
  await page.keyboard.down('ArrowRight');
  await page.waitForTimeout(1200);
  await page.keyboard.press('KeyZ');
  await page.waitForTimeout(500);
  await page.keyboard.press('KeyX');
  await page.waitForTimeout(150);
  await page.screenshot({ path: 'out/02-juego.png' });
  await page.waitForTimeout(1600);
  await page.keyboard.up('ArrowRight');
  await page.screenshot({ path: 'out/03-juego.png' });
  assert.deepEqual(errors, []);
});
