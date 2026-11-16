import { test } from 'node:test';
import assert from 'node:assert/strict';
import { clamp, easeInOutCubic, interp, sceneAt, sceneProgress, counterAt, checkinTimes } from '../src/timeline.js';
import { CONFIG, SCENES, DURATION } from '../src/config.js';
import { PALETTE, STATUS, isStatusColor, visibleTexts } from '../src/brand.js';

test('T1 clamp / easing / interp', () => {
  assert.equal(clamp(-1, 0, 1), 0);
  assert.equal(clamp(2, 0, 1), 1);
  assert.equal(easeInOutCubic(0), 0);
  assert.equal(easeInOutCubic(1), 1);
  assert.equal(easeInOutCubic(0.5), 0.5);
  assert.equal(interp(0.5, [0, 1], [10, 20]), 15);
  assert.equal(interp(-5, [0, 1], [10, 20]), 10, 'acotado abajo');
  assert.equal(interp(5, [0, 1], [10, 20]), 20, 'acotado arriba');
  assert.equal(interp(0.25, [0, 0.5], [0, 100], easeInOutCubic), 50);
});

test('T3 escenas contiguas 0→30, cada una ≥1.5 s', () => {
  assert.equal(DURATION, 30);
  assert.equal(SCENES[0].start, 0);
  assert.equal(SCENES.at(-1).end, 30);
  for (let i = 0; i < SCENES.length; i++) {
    assert.ok(SCENES[i].end - SCENES[i].start >= 1.5, SCENES[i].id);
    if (i) assert.equal(SCENES[i].start, SCENES[i - 1].end, `hueco antes de ${SCENES[i].id}`);
  }
  assert.deepEqual(SCENES.map(s => s.id), ['hook', 'logo', 'scan', 'invite', 'tables', 'live', 'segments', 'cta']);
});

test('T4 sceneAt / sceneProgress en bordes', () => {
  assert.equal(sceneAt(0).id, 'hook');
  assert.equal(sceneAt(2.999).id, 'hook');
  assert.equal(sceneAt(3).id, 'logo');
  assert.equal(sceneAt(30).id, 'cta');
  assert.equal(sceneAt(99).id, 'cta');
  for (let t = 0; t <= 30; t += 0.37) {
    const p = sceneProgress(sceneAt(t), t);
    assert.ok(p >= 0 && p <= 1, `p=${p} en t=${t}`);
  }
});

test('T5 counterAt y checkinTimes', () => {
  let prev = -1;
  for (let t = 0; t <= 2; t += 0.05) {
    const v = counterAt(t, 0, 2, 0, 248);
    assert.ok(Number.isInteger(v));
    assert.ok(v >= prev);
    prev = v;
  }
  assert.equal(counterAt(2, 0, 2, 0, 248), 248);
  const scan = SCENES.find(s => s.id === 'scan');
  const times = checkinTimes();
  assert.ok(times.length >= 2);
  for (const ct of times) assert.ok(ct > scan.start && ct < scan.end, `${ct}`);
});

test('T7 paleta de marca exacta y reglas', () => {
  assert.deepEqual(
    { bg: PALETTE.bg, card: PALETTE.card, border: PALETTE.border, violet: PALETTE.violet,
      ctaFrom: PALETTE.ctaFrom, ctaTo: PALETTE.ctaTo, champagneTitle: PALETTE.champagneTitle,
      champagneIcon: PALETTE.champagneIcon, champagneMuted: PALETTE.champagneMuted,
      text: PALETTE.text, text2: PALETTE.text2, text3: PALETTE.text3 },
    { bg: '#0D0E15', card: '#161922', border: '#262B3A', violet: '#7C3AED',
      ctaFrom: '#7928CA', ctaTo: '#581C87', champagneTitle: '#F1E3B8',
      champagneIcon: '#E8D5A3', champagneMuted: '#C8B78A',
      text: '#FFFFFF', text2: '#94A3B8', text3: '#64748B' });
  for (const c of Object.values(PALETTE)) assert.ok(!isStatusColor(c), `${c} es color de estado en paleta decorativa`);
  assert.ok(isStatusColor(STATUS.ok) && isStatusColor(STATUS.pending) && isStatusColor(STATUS.alert));
});

test('T7 precios ocultos por defecto', () => {
  assert.equal(CONFIG.showPricing, false);
  const texts = visibleTexts(CONFIG).join(' ');
  assert.ok(!texts.includes('$'), 'no debe mostrarse ningún precio');
  const withPrices = visibleTexts({ ...CONFIG, showPricing: true }).join(' ');
  assert.ok(withPrices.includes('$149'));
});

test('Zona segura: textos clave dentro de márgenes', () => {
  for (const [k, box] of Object.entries(CONFIG.textBoxes)) {
    assert.ok(box.top >= 180, `${k} invade zona superior`);
    assert.ok(box.top + box.height <= 1920 - 320, `${k} invade zona inferior`);
  }
});
