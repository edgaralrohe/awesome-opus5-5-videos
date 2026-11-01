// Unidades: píxeles lógicos y segundos. Paso fijo de 60 Hz.
export const W = 320, H = 224, TILE = 16, DT = 1 / 60;

export const P = {
  w: 12, h: 26,
  accel: 900, airAccel: 650, friction: 1200, maxRun: 130,
  gravity: 1400, jumpVel: 430, jumpCut: 150, maxFall: 420,
  coyote: 6, buffer: 6, // frames
  stompBounce: 300, invuln: 1.5, knockback: 160,
};

export const MIC = { range: 76, outSpeed: 460, backSpeed: 560, pull: 340, hookRadius: 12, releaseVx: 150, releaseVy: 300, aimY: 48 };
export const TITULAR = { w: 20, h: 22, speed: 30 };
