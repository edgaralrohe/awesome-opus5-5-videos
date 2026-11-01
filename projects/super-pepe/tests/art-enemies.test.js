import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { PEPE_META } from '../src/data/pepe-atlas.js';
import { ENEMIES_META } from '../src/data/enemies-atlas.js';
import { createGame, stepGame } from '../src/game/game.js';

const IDLE = { left: false, right: false, jump: false, mic: false };
const run = (g, n, btn = IDLE) => { for (let i = 0; i < n; i++) stepGame(g, btn); };

function checkAtlas(meta, expected) {
  for (const [anim, n] of Object.entries(expected)) assert.equal(meta.anims[anim]?.length, n, anim);
  for (const [k, f] of Object.entries(meta.frames)) {
    assert.ok(f.ax >= 0 && f.ax <= f.w, `${k}: ancla x fuera`);
    assert.ok(f.ay > 0 && f.ay <= f.h, `${k}: ancla y fuera`);
  }
}

describe('atlas de sprites (A1)', () => {
  test('Pepe: 29 poses de la hoja oficial, ≈ 48 px de alto', () => {
    checkAtlas(PEPE_META, { idle: 4, run: 8, crouch: 2, jump: 2, land: 1, throw: 2, shout: 3, ko: 2, hurt: 1, win: 4 });
    for (const k of PEPE_META.anims.idle) assert.ok(Math.abs(PEPE_META.frames[k].h - 48) <= 2, k);
  });

  test('enemigos con todas sus animaciones', () => {
    checkAtlas(ENEMIES_META, { titularWalk: 4, titularKo: 1, papWalk: 2, papAim: 1, papFlash: 1, papKo: 1, repWalk: 2, repDash: 1, repKo: 1 });
  });
});

describe('Paparazzi (A3)', () => {
  test('si tiene delante a Pepe, apunta y lo congela sin quitar vida', () => {
    const g = createGame('..........\n.P....F...\n##########');
    let frozen = false;
    for (let i = 0; i < 120; i++) { stepGame(g, IDLE); if (g.player.frozen > 0) frozen = true; }
    assert.ok(frozen);
    assert.equal(g.hearts, 3);
  });

  test('congelado, Pepe no se mueve', () => {
    const g = createGame('..........\n.P........\n##########');
    run(g, 10);
    g.player.frozen = 0.5;
    const x0 = g.player.x;
    run(g, 20, { ...IDLE, right: true });
    assert.equal(g.player.x, x0);
  });

  test('se vence con el micrófono', () => {
    const g = createGame('..........\n.P...F....\n##########');
    run(g, 3);
    stepGame(g, { ...IDLE, mic: true });
    run(g, 20);
    assert.equal(g.enemies[0].alive, false);
  });
});

describe('Reportero (A4)', () => {
  test('embiste hacia Pepe cuando lo ve', () => {
    const g = createGame('............\n.P......R...\n############');
    const x0 = g.enemies[0].x;
    run(g, 40);
    assert.ok(g.enemies[0].x < x0 - 40, `x0=${x0} x=${g.enemies[0].x}`);
  });

  test('pisarlo lo derrota', () => {
    const g = createGame('......\n.P....\n......\n......\n.R....\n######');
    g.enemies[0].kind = 'reportero';
    run(g, 60);
    assert.equal(g.enemies[0].alive, false);
  });
});
