// Única fuente de tiempos del tráiler, guion v2 (TREATMENT v2). 120 bpm: tiempo = 0,5 s, compás = 2 s.
export const BPM = 120;
export const BEAT = 60 / BPM;
const BAR = 4 * BEAT;

export const SECS = [
  { id: 'premisa', t: 0, bars: 7 },
  { id: 'juego', t: 14, bars: 8 },
  { id: 'carmesi', t: 30, bars: 2, silence: 33.75 },
  { id: 'noche', t: 34, bars: 3 },
  { id: 'recuerdo', t: 40, bars: 1 },
  { id: 'futuro', t: 42, bars: 2 },
  { id: 'cierre', t: 46, bars: 2 },
];
export const DUR = SECS.at(-1).t + SECS.at(-1).bars * BAR;

// Tomas del juego real (out/clips/<id>, 24 fps): fotograma de arranque.
export const SHOTS = [
  // Prólogo: solo el dibujo (crop = filas 0–150); su texto propio dependía de la viñeta p1, que no sale.
  { clip: 'prologo', t0: 0, t1: 4, from: 72, freeze: 2.95, crop: 151 }, // p2: la Arena por fuera
  { clip: 'prologo', t0: 4, t1: 7, from: 144, crop: 151 },  // p3: flashes y titulares
  { clip: 'prologo', t0: 7, t1: 10, from: 216, crop: 151 }, // p4: despierta en el museo
  { clip: 'prologo', t0: 10, t1: 12, from: 288, crop: 151 }, // p5: las 8 puertas
  { clip: 'museo', t0: 12, t1: 14, from: 0 },         // el pasillo real
  { clip: 'calle', t0: 14, t1: 16, from: 60 },        // golpes de micrófono
  { clip: 'azoteas', t0: 16, t1: 18, from: 196 },     // gancho
  { clip: 'azoteas', t0: 18, t1: 20, from: 56 },      // ¡FOTO!
  { clip: 'calle', t0: 20, t1: 22, from: 108 },       // ¿DECLARACIONES?
  { clip: 'azoteas', t0: 22, t1: 24, from: 224 },     // Solo
  { clip: 'salon', t0: 24, t1: 26, from: 120 },       // Ovación llena → Solo
  { clip: 'flashbot-fin', t0: 26, t1: 30, from: 601 }, // ¿Sabías que…?
  { clip: 'flashbot', t0: 30, t1: 32, from: 40 },     // presentación del jefe
  { clip: 'flashbot-fin', t0: 32, t1: 34, from: 520 }, // golpe final y victoria
  { clip: 'entrada', t0: 34, t1: 36, from: 40 },
  { clip: 'salon', t0: 36, t1: 38, from: 236 },
  { clip: 'enmascarado-fin', t0: 38, t1: 40, from: 1100 },
  { clip: 'recuerdo', t0: 40, t1: 42, from: 0 },     // RECUERDO RECUPERADO (tools/capture-recuerdo.mjs)
  { clip: 'museo', t0: 42, t1: 46, from: 8 },         // las puertas de los otros 6 discos, con candado
];
export const CUTS = SHOTS.map((s) => ({ id: `${s.clip}@${s.t0}`, t: s.t0 })).concat([{ id: 'cierre', t: 46 }]);

// Paso de paleta del giro (plan D4): rojo → gris en 4 pasos sobre la victoria de Carmesí.
export const PALETTE_STEPS = [33.0, 33.25, 33.5, 33.75];

// Todo texto en pantalla (sin máquina de escribir en el v2: cada texto entra completo).
export const TEXTS_TL = [
  { id: 'titulo', t0: 0, t1: 14, text: 'MÉXICO VS. JOSÉ MADERO' },
  // Premisa en cadena: concierto → pérdida → museo → misión con plazo.
  { id: 'cap0a', t0: 0, t1: 4, text: 'SU PRÓXIMO CONCIERTO:' },
  { id: 'cap0b', t0: 0, t1: 4, text: 'ARENA CDMX · 21 Y 22 MAY 2027' },
  { id: 'fuente0', t0: 0, t1: 4, text: 'FUENTES: LOS40 · GRUPO ANIMAL' },
  { id: 'cap1a', t0: 4, t1: 7, text: 'PERO ALGO SE LE PERDIÓ' },
  { id: 'cap1b', t0: 4, t1: 7, text: 'ENTRE FLASHES Y TITULARES' },
  { id: 'cap2a', t0: 7, t1: 10, text: 'DESPIERTA EN UN MUSEO' },
  { id: 'cap2b', t0: 7, t1: 10, text: 'SIN SABER QUIÉN ES' },
  { id: 'cap3a', t0: 10, t1: 14, text: 'CADA DISCO GUARDA' },
  { id: 'cap3b', t0: 10, t1: 14, text: 'UNA PARTE DE ÉL.' },
  { id: 'cap3c', t0: 10, t1: 14, text: 'RECUPÉRALAS ANTES DE LA ARENA' },
  { id: 'como1', t0: 14, t1: 18, text: 'CÓMO SE JUEGA · 1/4' },
  { id: 't1a', t0: 14, t1: 18, text: 'EL MICRÓFONO GOLPEA' },
  { id: 't1b', t0: 14, t1: 18, text: 'Y SE ENGANCHA' },
  { id: 'como2', t0: 18, t1: 22, text: 'CÓMO SE JUEGA · 2/4' },
  { id: 't2a', t0: 18, t1: 22, text: 'LA PRENSA TE PERSIGUE' },
  { id: 't2b', t0: 18, t1: 22, text: 'TITULARES Y PAPARAZZI' },
  { id: 'como3', t0: 22, t1: 26, text: 'CÓMO SE JUEGA · 3/4' },
  { id: 't3a', t0: 22, t1: 26, text: 'LLENA LA OVACIÓN' },
  { id: 't3b', t0: 22, t1: 26, text: '¡SOLO DE GUITARRA!' },
  { id: 'como4', t0: 26, t1: 30, text: 'CÓMO SE JUEGA · 4/4' },
  { id: 't4a', t0: 26, t1: 30, text: '¿SABÍAS QUE…?' },
  { id: 't4b', t0: 26, t1: 30, text: 'DATOS REALES CON FUENTE' },
  { id: 'm1', t0: 30, t1: 34, text: 'MUNDO 1 · CARMESÍ · 2016' },
  { id: 'm1b', t0: 30, t1: 34, text: 'CONTRA LA PRENSA ROSA' },
  { id: 'm2', t0: 34, t1: 42, text: 'MUNDO 2 · NOCHE · 2017' },
  { id: 'm2a', t0: 34, t1: 38, text: 'MONSTRUOS CLÁSICOS' },
  { id: 'm2b', t0: 34, t1: 38, text: 'Y SE VA LA LUZ' },
  { id: 'r0', t0: 42, t1: 46, text: 'CADA DISCO, UN MUNDO' },
  { id: 'r1', t0: 42, t1: 46, text: 'EL VIERNES: MUNDOS 1 Y 2' },
  { id: 'r2', t0: 42, t1: 46, text: 'UN DISCO CADA 2 SEMANAS' },
  { id: 'arena', t0: 46, t1: 50, text: 'RUMBO A LA ARENA CDMX' },
  { id: 'fecha', t0: 46, t1: 50, text: '21 Y 22 MAY 2027' },
  { id: 'fuente', t0: 46, t1: 50, text: 'FUENTES: LOS40 · GRUPO ANIMAL' },
  { id: 'logo', t0: 46, t1: 50, text: 'MÉXICO VS. JOSÉ MADERO' },
  { id: 'cta', t0: 46.5, t1: 50, text: 'JUEGA GRATIS · VIERNES 6 NOV' },
  { id: 'dev', t0: 46.5, t1: 50, text: 'EN CELULAR Y COMPU' },
  { id: 'web', t0: 46.5, t1: 50, text: 'COLORESRUIDOSOS.GITHUB.IO' },
  { id: 'seccion', t0: 46.5, t1: 50, text: 'SECCIÓN GAMES' },
  { id: 'homenaje', t0: 46, t1: 50, text: 'HOMENAJE NO OFICIAL · @COLORESRUIDOSOS' },
];

export const FACTS = [
  { id: 'F1', screen: 'CARMESÍ · 2016' },
  { id: 'F2', screen: 'NOCHE · 2017' },
  { id: 'F3', screen: '21 Y 22 MAY 2027' },
];

// Tiempo de lectura de la librería: no espacios ÷ 15 + 1,5 s.
export const readTime = (s) => s.replace(/\s/g, '').length / 15 + 1.5;

// Golpes finales reales a los jefes (sacudida y sonido): fotograma en que la vida del jefe llega a 0.
export const HITS = [32 + (532 - 520) / 24, 38 + (1113 - 1100) / 24];
export const WINS = [32 + (542 - 520) / 24, 38 + (1123 - 1100) / 24];

// Eventos de sonido (los lee tools/score.py vía out/timeline.json).
export const EV = [
  { t: 0, type: 'crowd' }, { t: 4, type: 'mosaic' }, { t: 7, type: 'cursor' }, { t: 10, type: 'cursor' }, { t: 12, type: 'mosaic' },
  ...[14, 18, 22, 26].flatMap((t) => [{ t, type: 'select' }, { t: t + 0.05, type: 'mosaic' }]),
  { t: 30, type: 'mosaic' }, { t: WINS[0], type: 'fanfare' },
  ...PALETTE_STEPS.map((t) => ({ t, type: 'bitdrop' })),
  { t: 34, type: 'wind' }, { t: WINS[1], type: 'fanfare' },
  { t: 40, type: 'levelup' }, { t: 42, type: 'mosaic' }, { t: 42, type: 'select' }, { t: 46, type: 'mosaic' }, { t: 46, type: 'crowd' }, { t: 46.5, type: 'start' },
];
