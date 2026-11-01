// Unidades: píxeles lógicos y segundos. Paso fijo de 60 Hz.
export const W = 320, H = 224, TILE = 16, DT = 1 / 60;

export const P = {
  w: 14, h: 40, // sprite oficial de 48 px (art/source/pepe-sheet.jpg)
  accel: 900, airAccel: 650, friction: 1200, maxRun: 130,
  gravity: 1400, jumpVel: 430, jumpCut: 150, maxFall: 420,
  coyote: 6, buffer: 6, // frames
  stompBounce: 300, invuln: 1.5, knockback: 160,
};

export const MIC = { range: 76, outSpeed: 460, backSpeed: 560, pull: 340, hookRadius: 12, releaseVx: 150, releaseVy: 300, aimY: 48, handX: 18, handY: 29 };
export const FREEZE = 0.6; // s que congela el flash del Paparazzi
export const ENEMY = {
  titular: { w: 18, h: 30, speed: 30 },
  paparazzi: { w: 18, h: 40, speed: 22, sight: 120, aim: 0.7, flash: 0.25, cool: 1.2 },
  reportero: { w: 18, h: 42, speed: 20, sight: 140, windup: 0.25, dash: 0.7, dashSpeed: 170, rest: 0.7 },
};
