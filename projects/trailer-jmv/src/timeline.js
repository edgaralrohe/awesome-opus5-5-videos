// Única fuente de tiempos del tráiler (TREATMENT §5–6). 120 bpm: tiempo = 0,5 s, compás = 2 s.
export const BPM = 120;
export const BEAT = 60 / BPM;
const BAR = 4 * BEAT;

export const SECS = [
  { id: 'gancho', t: 0, bars: 2 },
  { id: 'menu', t: 4, bars: 2 },
  { id: 'carmesi', t: 8, bars: 3 },
  { id: 'paleta', t: 14, bars: 1, silence: 15.5 },
  { id: 'noche', t: 16, bars: 3 },
  { id: 'identidad', t: 22, bars: 2 },
  { id: 'arena', t: 26, bars: 2 },
  { id: 'cierre', t: 30, bars: 3 },
];
export const DUR = SECS.at(-1).t + SECS.at(-1).bars * BAR;

// Tomas del juego real (out/clips/<id>): de qué fotograma arrancan y cuándo salen.
export const SHOTS = [
  { clip: 'calle', t0: 0, t1: 4, from: 30 },
  { clip: 'calle', t0: 8, t1: 10, from: 150 },
  { clip: 'azoteas', t0: 10, t1: 12, from: 200 },
  { clip: 'flashbot', t0: 12, t1: 16, from: 524, freeze: 14 },
  { clip: 'entrada', t0: 16, t1: 18, from: 40 },
  { clip: 'salon', t0: 18, t1: 20, from: 236 },
  { clip: 'enmascarado', t0: 20, t1: 22, from: 1110 },
];

export const CUTS = [
  { id: 'menu', t: 4 }, { id: 'elegir', t: 7 }, { id: 'carmesi', t: 8 }, { id: 'azoteas', t: 10 }, { id: 'jefe1', t: 12 },
  { id: 'congelar', t: 14 }, { id: 'noche', t: 16 }, { id: 'salon', t: 18 }, { id: 'jefe2', t: 20 },
  { id: 'identidad', t: 22 }, { id: 'arena', t: 26 }, { id: 'cierre', t: 30 },
];

// Pasos de paleta del giro (D4): rojo → gris en 4 pasos, uno cada medio tiempo.
export const PALETTE_STEPS = [14.25, 14.75, 15.25, 15.75];

// Todo texto en pantalla. type = se escribe a 38 caracteres/s.
export const TEXTS_TL = [
  { id: 'titulo', t0: 0, t1: 4, text: 'MÉXICO VS. JOSÉ MADERO' },
  { id: 'dialogo', t0: 0.3, t1: 4, text: '¿QUIÉN SOY?', type: true },
  { id: 'menu', t0: 4, t1: 8, text: 'ELIGE UN RECUERDO' },
  { id: 's1', t0: 4.3, t1: 8, text: 'CARMESÍ · 2016' },
  { id: 's2', t0: 4.3, t1: 8, text: 'NOCHE · 2017' },
  { id: 's3', t0: 4.3, t1: 8, text: '???' },
  { id: 's8', t0: 4.3, t1: 8, text: 'ARENA CDMX' },
  { id: 'mundo1', t0: 8, t1: 16, text: 'MUNDO 1 · CARMESÍ · 2016' },
  { id: 'item1', t0: 12, t1: 14.5, text: '¡DISCO DE ORO!' },
  { id: 'mundo2', t0: 16, t1: 22, text: 'MUNDO 2 · NOCHE · 2017' },
  { id: 'item2', t0: 19.25, t1: 22, text: 'MÁSCARA DE FIESTA' },
  { id: 'identidad', t0: 22, t1: 26, text: 'IDENTIDAD 2/8' },
  { id: 'otros', t0: 23.2, t1: 26, text: '¿Y LOS OTROS 6?', type: true },
  { id: 'proxima', t0: 26, t1: 30, text: 'PRÓXIMA PARADA' },
  { id: 'arena', t0: 26, t1: 30, text: 'ARENA CIUDAD DE MÉXICO' },
  { id: 'fecha', t0: 26, t1: 30, text: '21 Y 22 MAY 2027' },
  { id: 'fuente', t0: 26, t1: 30, text: 'FUENTES: LOS40 · GRUPO ANIMAL' },
  { id: 'logo', t0: 30, t1: 36, text: 'MÉXICO VS. JOSÉ MADERO' },
  { id: 'cta', t0: 30.5, t1: 36, text: 'JUEGA GRATIS · VIERNES 6 NOV' },
  { id: 'web', t0: 31, t1: 36, text: 'COLORESRUIDOSOS.GITHUB.IO' },
  { id: 'seccion', t0: 31, t1: 36, text: 'SECCIÓN GAMES' },
  { id: 'homenaje', t0: 31, t1: 36, text: 'HOMENAJE NO OFICIAL · @COLORESRUIDOSOS' },
  { id: 'start', t0: 32, t1: 36, text: 'PRESS START' },
];

export const FACTS = [
  { id: 'F1', screen: 'CARMESÍ · 2016' },
  { id: 'F2', screen: 'NOCHE · 2017' },
  { id: 'F3', screen: '21 Y 22 MAY 2027' },
];

// Tiempo de lectura de la librería: no espacios ÷ 15 + 1,5 s.
export const readTime = (s) => s.replace(/\s/g, '').length / 15 + 1.5;

// Eventos de sonido (los lee tools/score.py vía events.json).
export const EV = [
  ...[...'¿QUIÉN SOY?'].map((c, i) => ({ t: 0.3 + i / 38, type: 'blip', pitch: 2 })).filter((_, i) => '¿QUIÉN SOY?'[i] !== ' '),
  ...[4.5, 5.0, 5.5, 6.0, 6.5].map((t) => ({ t, type: 'cursor' })),
  { t: 7, type: 'select' }, { t: 7, type: 'mosaic' },
  { t: 4, type: 'mosaic' }, { t: 16, type: 'wind' }, { t: 26, type: 'mosaic' }, { t: 26, type: 'crowd' },
  { t: 13, type: 'fanfare' }, { t: 21, type: 'fanfare' }, { t: 23, type: 'levelup' },
  ...PALETTE_STEPS.map((t) => ({ t, type: 'bitdrop' })),
  { t: 22.5, type: 'tick' }, { t: 22.75, type: 'tick' },
  { t: 32, type: 'start' },
  ...[...'¿Y LOS OTROS 6?'].map((c, i) => ({ t: 23.2 + i / 38, type: 'blip', pitch: 2 })).filter((_, i) => '¿Y LOS OTROS 6?'[i] !== ' '),
];

// Golpes finales reales a los jefes (fotograma 540 de flashbot y 1123 de enmascarado): sacudida y sonido.
export const HITS = [12 + (540 - 524) / 24, 20 + (1123 - 1110) / 24];
