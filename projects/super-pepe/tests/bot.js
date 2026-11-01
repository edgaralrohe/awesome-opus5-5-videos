import { TILE, MIC } from '../src/game/constants.js';

// Bot sencillo: corre a la derecha, salta obstáculos, huecos y enemigos, y lanza el micro a los ganchos.
export function bot(g) {
  const p = g.player, L = g.level;
  const ahead = p.x + p.w + 6, feet = p.y + p.h;
  const tx = Math.floor(ahead / TILE), tyFeet = Math.floor((feet - 1) / TILE);
  const wall = L.tileAt(tx, tyFeet) === '#' || L.tileAt(tx, tyFeet - 1) === '#';
  const gap = p.onGround && !['#', '='].includes(L.tileAt(Math.floor((p.x + p.w + 14) / TILE), tyFeet + 1));
  const spike = L.tileAt(Math.floor((p.x + p.w + 18) / TILE), tyFeet) === '^';
  const foe = g.enemies.some((e) => e.alive && e.x > p.x && e.x - p.x < 52 && Math.abs(e.y + e.h - feet) < 24);
  const hy = p.y + p.h - MIC.handY;
  const hook = g.level.hooks.find((h) => h.x > p.x && Math.hypot(h.x - p.x, h.y - hy) < MIC.range - 4 && Math.abs(h.y - hy) < MIC.aimY);
  const hand = { x: p.x + p.w / 2 + MIC.handX, y: p.y + p.h - MIC.handY };
  const target = g.enemies.find((e) => e.alive && e.x > hand.x - 4 && e.x - hand.x < MIC.range - 8 && hand.y >= e.y - 2 && hand.y <= e.y + e.h);
  const jumpNow = p.onGround && (wall || gap || spike);
  const fire = g.mic.phase === 'idle' && ((!p.onGround && !!hook) || !!target);
  return { left: false, right: !target || g.mic.phase !== 'idle', jump: jumpNow || (!p.onGround && p.vy < 0) || (p.onGround && foe && !target), mic: fire && g.frame % 2 === 0 };
}
