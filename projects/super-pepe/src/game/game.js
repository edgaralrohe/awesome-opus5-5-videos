import { TILE, P, MIC, TITULAR, DT } from './constants.js';
import { parseLevel, moveBody } from '../engine/tilemap.js';
import { createPlayer, stepPlayerMotion } from '../engine/physics.js';
import { edges } from '../engine/buttons.js';
import { QUOTES, HEADLINES } from '../data/quotes.js';

const overlap = (a, b) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;

export function createGame(levelText) {
  const level = parseLevel(levelText);
  const g = {
    level,
    player: createPlayer(level.player),
    mic: { phase: 'idle', len: 0, dir: 1, ax: 1, ay: 0, hook: null },
    enemies: level.enemies.map((s, i) => ({ x: s.x - TITULAR.w / 2, y: s.y - TITULAR.h, w: TITULAR.w, h: TITULAR.h, vx: -TITULAR.speed, vy: 0, alive: true, deadT: 0, word: HEADLINES[i % HEADLINES.length] })),
    pieces: level.pieces.map((s) => ({ ...s, taken: false })),
    hearts: 3, piezas: 0, time: 0, frame: 0, invuln: 0,
    checkpoint: { ...level.player }, quoteIdx: 0,
    status: 'play', popups: [], events: [], prev: {},
  };
  return g;
}

export const micHand = (g) => ({ x: g.player.x + g.player.w / 2, y: g.player.y + 10 });
export const micTip = (g) => {
  const h = micHand(g);
  return { x: h.x + g.mic.ax * g.mic.len, y: h.y + g.mic.ay * g.mic.len };
};

function hurt(g, fromX) {
  if (g.invuln > 0) return;
  g.hearts--;
  g.invuln = P.invuln;
  g.events.push('hurt');
  const p = g.player;
  p.vx = (p.x + p.w / 2 < fromX ? -1 : 1) * P.knockback;
  p.vy = -200;
  p.hooked = null;
  if (g.hearts <= 0) { g.status = 'gameover'; g.events.push('gameover'); }
}

function respawn(g) {
  const p = g.player;
  p.x = g.checkpoint.x - p.w / 2; p.y = g.checkpoint.y - p.h; p.vx = 0; p.vy = 0; p.hooked = null;
  g.mic.phase = 'idle'; g.mic.len = 0;
}

function defeat(g, e) {
  e.alive = false;
  g.events.push('defeat');
  const q = QUOTES[g.quoteIdx++ % QUOTES.length];
  g.popups.push({ text: q.text, source: q.source, t: 4 });
}

function stepMic(g, pressed) {
  const m = g.mic, p = g.player;
  if (m.phase === 'idle') {
    if (pressed) {
      m.phase = 'out'; m.dir = p.facing; m.len = 0; m.ax = m.dir; m.ay = 0;
      // Asistencia de puntería: si hay un gancho delante a tiro, el micro sale hacia él.
      const hand = micHand(g);
      const target = g.level.hooks
        .filter((h) => (h.x - hand.x) * m.dir > 0 && Math.abs(h.y - hand.y) <= MIC.aimY && Math.hypot(h.x - hand.x, h.y - hand.y) <= MIC.range)
        .sort((a, b) => Math.abs(a.x - hand.x) - Math.abs(b.x - hand.x))[0];
      if (target) {
        const d = Math.hypot(target.x - hand.x, target.y - hand.y);
        m.ax = (target.x - hand.x) / d; m.ay = (target.y - hand.y) / d;
      }
      g.events.push('mic');
    }
    return;
  }
  if (m.phase === 'out') {
    m.len = Math.min(MIC.range, m.len + MIC.outSpeed * DT);
    const tip = micTip(g);
    const hook = g.level.hooks.find((h) => Math.hypot(h.x - tip.x, h.y - tip.y) <= MIC.hookRadius);
    if (hook) {
      m.phase = 'hook'; m.hook = hook;
      p.hooked = { x: hook.x, y: hook.y, pull: MIC.pull };
      g.events.push('hook');
      return;
    }
    const e = g.enemies.find((en) => en.alive && tip.x >= en.x && tip.x <= en.x + en.w && tip.y >= en.y - 4 && tip.y <= en.y + en.h);
    if (e) { defeat(g, e); m.phase = 'back'; return; }
    if (m.len >= MIC.range) m.phase = 'back';
    return;
  }
  if (m.phase === 'hook') {
    const dx = m.hook.x - (p.x + p.w / 2), dy = m.hook.y - (p.y + 10);
    const d0 = Math.hypot(dx, dy) || 1;
    m.len = d0; m.ax = dx / d0; m.ay = dy / d0;
    if (Math.hypot(dx, dy) < 12) {
      p.hooked = null;
      p.vx = m.dir * MIC.releaseVx;
      p.vy = -MIC.releaseVy;
      p.jumping = false;
      m.phase = 'back';
      g.events.push('release');
    }
    return;
  }
  if (m.phase === 'back') {
    m.len -= MIC.backSpeed * DT;
    if (m.len <= 0) { m.len = 0; m.phase = 'idle'; }
  }
}

function stepTitular(g, e) {
  if (!e.alive) { e.deadT += DT; return; }
  e.vy = Math.min(420, e.vy + 1400 * DT);
  const r = moveBody(g.level, e, e.vx * DT, e.vy * DT);
  if (r.ground) e.vy = 0;
  if (r.hitX) e.vx = -e.vx;
  // No se tira por los bordes.
  if (r.ground) {
    const frontX = e.vx > 0 ? e.x + e.w + 1 : e.x - 1;
    const below = g.level.tileAt(Math.floor(frontX / TILE), Math.floor((e.y + e.h + 1) / TILE));
    if (below !== '#' && below !== '=') e.vx = -e.vx;
  }
  if (e.y > g.level.h * TILE + 64) e.alive = false;
}

// Un paso de 1/60 s. `btn` = botones mantenidos {left,right,jump,mic}.
export function stepGame(g, btn) {
  g.events = [];
  if (g.status !== 'play') return g;
  const ed = edges(g.prev, btn);
  g.prev = { ...btn };
  g.frame++; g.time += DT;
  g.invuln = Math.max(0, g.invuln - DT);
  const p = g.player;

  stepMic(g, ed.micPressed);
  const prevBottom = p.y + p.h;
  g.events.push(...stepPlayerMotion(p, { ...btn, jumpPressed: ed.jumpPressed }, g.level));

  for (const e of g.enemies) {
    stepTitular(g, e);
    if (!e.alive || !overlap(p, e)) continue;
    if (p.vy > 0 && prevBottom <= e.y + 6) {
      defeat(g, e);
      p.vy = -P.stompBounce; p.jumping = false;
      g.events.push('stomp');
    } else {
      hurt(g, e.x + e.w / 2);
      e.vx = (e.x + e.w / 2 < p.x + p.w / 2 ? -1 : 1) * Math.abs(e.vx || TITULAR.speed);
    }
  }

  for (const pc of g.pieces) {
    if (!pc.taken && Math.abs(pc.x - (p.x + p.w / 2)) < 12 && Math.abs(pc.y - (p.y + p.h / 2)) < 18) {
      pc.taken = true; g.piezas++; g.events.push('piece');
    }
  }

  // Pinchos bajo los pies.
  const tyFeet = Math.floor((p.y + p.h - 1) / TILE);
  for (const tx of [Math.floor((p.x + 2) / TILE), Math.floor((p.x + p.w - 2) / TILE)]) {
    if (g.level.tileAt(tx, tyFeet) === '^') hurt(g, tx * TILE + TILE / 2);
  }

  // Foso: pierdes un corazón y vuelves al último checkpoint.
  if (p.y > g.level.h * TILE + 40 && g.status === 'play') {
    g.invuln = 0;
    hurt(g, p.x);
    g.invuln = 0.6;
    if (g.status === 'play') respawn(g);
  }

  for (const c of g.level.checkpoints) if (p.x > c.x && c.x > g.checkpoint.x) { g.checkpoint = { ...c }; g.events.push('checkpoint'); }

  const goal = g.level.goal;
  if (goal && Math.abs(goal.x - (p.x + p.w / 2)) < 10 && Math.abs(goal.y - (p.y + p.h)) < 20) {
    g.status = 'won'; g.events.push('won');
  }

  for (const pop of g.popups) pop.t -= DT;
  g.popups = g.popups.filter((pop) => pop.t > 0);
  return g;
}
