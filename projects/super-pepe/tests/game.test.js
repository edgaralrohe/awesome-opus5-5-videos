import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { TILE, MIC } from '../src/game/constants.js';
import { createGame, stepGame } from '../src/game/game.js';
import { LEVEL_1 } from '../src/data/level1.js';
import { QUOTES } from '../src/data/quotes.js';
import { buildPepe, PEPE_FRAMES } from '../src/render/sprites.js';

const IDLE = { left: false, right: false, jump: false, mic: false };
const run = (g, n, btn = IDLE) => { for (let i = 0; i < n; i++) stepGame(g, btn); };

describe('micrófono con cable (J9)', () => {
  test('sale, llega a su alcance y vuelve', () => {
    const g = createGame('..........\n.P........\n##########');
    run(g, 20);
    stepGame(g, { ...IDLE, mic: true });
    let maxLen = 0;
    for (let i = 0; i < 60; i++) { stepGame(g, IDLE); maxLen = Math.max(maxLen, g.mic.len); }
    assert.ok(maxLen >= MIC.range - 1);
    assert.equal(g.mic.phase, 'idle');
  });

  test('se engancha al gancho y tira de Pepe hacia él', () => {
    const g = createGame('..........\n.P...H....\n##########');
    run(g, 20);
    const x0 = g.player.x;
    stepGame(g, { ...IDLE, mic: true });
    run(g, 40);
    assert.ok(g.player.x > x0 + 40, `x0=${x0} x=${g.player.x}`);
  });

  test('golpear un Titular lo derrota y muestra una frase verificada', () => {
    const g = createGame('..........\n.P...T....\n##########');
    run(g, 5);
    stepGame(g, { ...IDLE, mic: true });
    run(g, 20);
    assert.equal(g.enemies[0].alive, false);
    assert.ok(g.popups.some((p) => QUOTES.some((q) => p.text === q.text)));
  });
});

describe('Titular (J10)', () => {
  test('patrulla y se da la vuelta en los bordes sin caerse', () => {
    const g = createGame('...........\n...........\n.P....T....\n...#####...');
    for (let i = 0; i < 600; i++) stepGame(g, IDLE);
    const e = g.enemies[0];
    assert.ok(e.y < 4 * TILE, 'no se cayó');
  });

  test('pisarlo lo derrota y Pepe rebota', () => {
    const g = createGame('.....\n.....\n.P...\n.T...\n#####');
    const e = g.enemies[0];
    e.vx = 0;
    run(g, 40);
    assert.equal(e.alive, false);
  });

  test('tocarlo de lado quita un corazón', () => {
    const g = createGame('........\n.P.T....\n########');
    const h0 = g.hearts;
    run(g, 120);
    assert.equal(g.hearts, h0 - 1);
  });
});

describe('sprites (J4)', () => {
  test('todos los fotogramas de Pepe son 24×32', () => {
    for (const f of PEPE_FRAMES) {
      const rows = buildPepe(f);
      assert.equal(rows.length, 32, f.name);
      for (const r of rows) assert.equal(r.length, 24, f.name);
    }
  });
});

describe('nivel 1 completable (J5, repetición con bot)', () => {
  // Bot sencillo: corre a la derecha, salta obstáculos, huecos y enemigos, y lanza el micro a los ganchos.
  function bot(g) {
    const p = g.player, L = g.level;
    const ahead = p.x + p.w + 6, feet = p.y + p.h;
    const tx = Math.floor(ahead / TILE), tyFeet = Math.floor((feet - 1) / TILE);
    const wall = L.tileAt(tx, tyFeet) === '#' || L.tileAt(tx, tyFeet - 1) === '#';
    const gap = p.onGround && !['#', '='].includes(L.tileAt(Math.floor((p.x + p.w + 14) / TILE), tyFeet + 1));
    const spike = L.tileAt(Math.floor((p.x + p.w + 18) / TILE), tyFeet) === '^';
    const foe = g.enemies.some((e) => e.alive && e.x > p.x && e.x - p.x < 44 && Math.abs(e.y + e.h - feet) < 20);
    const hook = g.level.hooks.find((h) => h.x > p.x && Math.hypot(h.x - p.x, h.y - (p.y + 10)) < MIC.range - 4 && Math.abs(h.y - (p.y + 10)) < MIC.aimY);
    const jumpNow = p.onGround && (wall || gap || spike || foe);
    return { left: false, right: true, jump: jumpNow || (!p.onGround && p.vy < 0), mic: !p.onGround && !!hook && g.mic.phase === 'idle' };
  }

  test('el bot llega a la puerta en menos de 90 s sin perder todas las vidas', () => {
    const g = createGame(LEVEL_1);
    for (let i = 0; i < 60 * 90 && g.status === 'play'; i++) stepGame(g, bot(g));
    assert.equal(g.status, 'won', `estado ${g.status}, x=${Math.round(g.player.x)} de ${g.level.w * TILE}`);
  });
});
