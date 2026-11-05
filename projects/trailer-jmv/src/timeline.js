// Única fuente de tiempos del tráiler, guion v2 (TREATMENT v2). 120 bpm: tiempo = 0,5 s, compás = 2 s.
export const BPM = 120;
export const BEAT = 60 / BPM;
const BAR = 4 * BEAT;

export const SECS = [
  { id: 'premisa', t: 0, bars: 5 },
  { id: 'juego', t: 10, bars: 8 },
  { id: 'carmesi', t: 26, bars: 2, silence: 29.75 },
  { id: 'noche', t: 30, bars: 4 },
  { id: 'recuerdo', t: 38, bars: 1 },
  { id: 'cierre', t: 40, bars: 2 },
];
export const DUR = SECS.at(-1).t + SECS.at(-1).bars * BAR;

// Tomas del juego real (out/clips/<id>, 24 fps): fotograma de arranque.
export const SHOTS = [
  { clip: 'prologo', t0: 0, t1: 3, from: 144 },       // p3: flashes y titulares
  { clip: 'prologo', t0: 3, t1: 6, from: 216 },       // p4: no recuerda quién es
  { clip: 'prologo', t0: 6, t1: 8, from: 288 },       // p5: las 8 puertas
  { clip: 'museo', t0: 8, t1: 10, from: 0 },          // el pasillo real
  { clip: 'calle', t0: 10, t1: 12, from: 60 },        // golpes de micrófono
  { clip: 'azoteas', t0: 12, t1: 14, from: 196 },     // gancho
  { clip: 'azoteas', t0: 14, t1: 16, from: 56 },      // ¡FOTO!
  { clip: 'calle', t0: 16, t1: 18, from: 108 },       // ¿DECLARACIONES?
  { clip: 'azoteas', t0: 18, t1: 20, from: 224 },     // Solo
  { clip: 'salon', t0: 20, t1: 22, from: 120 },       // Ovación llena → Solo
  { clip: 'flashbot-fin', t0: 22, t1: 26, from: 601 }, // ¿Sabías que…?
  { clip: 'flashbot', t0: 26, t1: 28, from: 40 },     // presentación del jefe
  { clip: 'flashbot-fin', t0: 28, t1: 30, from: 520 }, // golpe final y victoria
  { clip: 'entrada', t0: 30, t1: 32, from: 40 },
  { clip: 'salon', t0: 32, t1: 34, from: 236 },
  { clip: 'enmascarado', t0: 34, t1: 36, from: 40 },  // presentación del jefe
  { clip: 'enmascarado-fin', t0: 36, t1: 38, from: 1100 },
  { clip: 'recuerdo', t0: 38, t1: 40, from: 0 },     // RECUERDO RECUPERADO (tools/capture-recuerdo.mjs)
];
export const CUTS = SHOTS.map((s) => ({ id: `${s.clip}@${s.t0}`, t: s.t0 })).concat([{ id: 'cierre', t: 40 }]);

// Paso de paleta del giro (plan D4): rojo → gris en 4 pasos sobre la victoria de Carmesí.
export const PALETTE_STEPS = [29.0, 29.25, 29.5, 29.75];

// Todo texto en pantalla (sin máquina de escribir en el v2: cada texto entra completo).
export const TEXTS_TL = [
  { id: 'titulo', t0: 0, t1: 10, text: 'MÉXICO VS. JOSÉ MADERO' },
  { id: 'cap1', t0: 0.3, t1: 3, text: 'ALGO SE LE PERDIÓ' },
  { id: 'cap2', t0: 3, t1: 6, text: 'PEPE NO RECUERDA QUIÉN ES' },
  { id: 'cap3a', t0: 6, t1: 10, text: 'CADA DISCO GUARDA' },
  { id: 'cap3b', t0: 6, t1: 10, text: 'UNA PARTE DE ÉL' },
  { id: 'como1', t0: 10, t1: 14, text: 'CÓMO SE JUEGA · 1/4' },
  { id: 't1a', t0: 10, t1: 14, text: 'EL MICRÓFONO GOLPEA' },
  { id: 't1b', t0: 10, t1: 14, text: 'Y SE ENGANCHA' },
  { id: 'como2', t0: 14, t1: 18, text: 'CÓMO SE JUEGA · 2/4' },
  { id: 't2a', t0: 14, t1: 18, text: 'LA PRENSA TE PERSIGUE' },
  { id: 't2b', t0: 14, t1: 18, text: 'TITULARES Y PAPARAZZI' },
  { id: 'como3', t0: 18, t1: 22, text: 'CÓMO SE JUEGA · 3/4' },
  { id: 't3a', t0: 18, t1: 22, text: 'LLENA LA OVACIÓN' },
  { id: 't3b', t0: 18, t1: 22, text: '¡SOLO DE GUITARRA!' },
  { id: 'como4', t0: 22, t1: 26, text: 'CÓMO SE JUEGA · 4/4' },
  { id: 't4a', t0: 22, t1: 26, text: '¿SABÍAS QUE…?' },
  { id: 't4b', t0: 22, t1: 26, text: 'DATOS REALES CON FUENTE' },
  { id: 'm1', t0: 26, t1: 30, text: 'MUNDO 1 · CARMESÍ · 2016' },
  { id: 'm1b', t0: 26, t1: 30, text: 'CONTRA LA PRENSA ROSA' },
  { id: 'm2', t0: 30, t1: 38, text: 'MUNDO 2 · NOCHE · 2017' },
  { id: 'm2a', t0: 30, t1: 34, text: 'MONSTRUOS CLÁSICOS' },
  { id: 'm2b', t0: 30, t1: 34, text: 'Y SE VA LA LUZ' },
  { id: 'arena', t0: 38, t1: 44, text: 'RUMBO A LA ARENA CDMX' },
  { id: 'fecha', t0: 38, t1: 44, text: '21 Y 22 MAY 2027' },
  { id: 'fuente', t0: 38, t1: 44, text: 'FUENTES: LOS40 · GRUPO ANIMAL' },
  { id: 'logo', t0: 40, t1: 44, text: 'MÉXICO VS. JOSÉ MADERO' },
  { id: 'cta', t0: 40.5, t1: 44, text: 'JUEGA GRATIS · VIERNES 6 NOV' },
  { id: 'dev', t0: 40.5, t1: 44, text: 'EN CELULAR Y COMPU' },
  { id: 'web', t0: 40.5, t1: 44, text: 'COLORESRUIDOSOS.GITHUB.IO' },
  { id: 'seccion', t0: 40.5, t1: 44, text: 'SECCIÓN GAMES' },
  { id: 'homenaje', t0: 40, t1: 44, text: 'HOMENAJE NO OFICIAL · @COLORESRUIDOSOS' },
];

export const FACTS = [
  { id: 'F1', screen: 'CARMESÍ · 2016' },
  { id: 'F2', screen: 'NOCHE · 2017' },
  { id: 'F3', screen: '21 Y 22 MAY 2027' },
];

// Tiempo de lectura de la librería: no espacios ÷ 15 + 1,5 s.
export const readTime = (s) => s.replace(/\s/g, '').length / 15 + 1.5;

// Golpes finales reales a los jefes (sacudida y sonido): fotograma en que la vida del jefe llega a 0.
export const HITS = [28 + (532 - 520) / 24, 36 + (1113 - 1100) / 24];
export const WINS = [28 + (542 - 520) / 24, 36 + (1123 - 1100) / 24];

// Eventos de sonido (los lee tools/score.py vía out/timeline.json).
export const EV = [
  { t: 0.3, type: 'mosaic' }, { t: 3, type: 'cursor' }, { t: 6, type: 'cursor' }, { t: 8, type: 'mosaic' },
  ...[10, 14, 18, 22].flatMap((t) => [{ t, type: 'select' }, { t: t + 0.05, type: 'mosaic' }]),
  { t: 26, type: 'mosaic' }, { t: 28 + 22 / 24, type: 'fanfare' },
  ...PALETTE_STEPS.map((t) => ({ t, type: 'bitdrop' })),
  { t: 30, type: 'wind' }, { t: 34, type: 'mosaic' }, { t: 36 + 23 / 24, type: 'fanfare' },
  { t: 38, type: 'levelup' }, { t: 38, type: 'crowd' }, { t: 40, type: 'mosaic' }, { t: 40.5, type: 'start' },
];
