// 150 bpm · 4/4 → 1 compás = 1,6 s. Todo el vídeo se mide en compases.
export const BPM = 150;
export const BAR = (4 * 60) / BPM;

// Fuentes en specs/cabanas/spec.md §6.
export const LEVELS = [
  { n: 1, title: 'CARMESÍ', year: 2016, item: 'rosa', bg: 'R', band: 'r', ink: 'w' },
  { n: 2, title: 'NOCHE', year: 2017, item: 'sombra', bg: 'k', band: 'K', ink: 'w', terror: true },
  { n: 3, title: 'ALBA', year: 2018, item: 'ramas', bg: 'w', band: 'G', ink: 'k' },
  { n: 4, title: 'PSALMOS', year: 2019, item: 'figura', bg: 'B', band: 'b', ink: 'w', corner: true },
  { n: 5, title: 'GIALLO', year: 2022, item: 'llama', bg: 'y', band: 'o', ink: 'k' },
  { n: 6, title: 'AURORA', year: 2023, item: 'hojas', bg: 'G', band: 'g', ink: 'k', sub: 'EP · 2023' },
  { n: 7, title: 'SARAJEVO', year: 2024, item: 'tacon', bg: 'L', band: 'l', ink: 'k' },
  { n: 8, title: 'QUERIDO…', year: 2026, item: 'pierrot', bg: 'V', band: 'K', ink: 'w', sub: 'EL MÁS NUEVO · 2026' },
];

export const COPY = {
  title: 'PEPE MADERO',
  subtitle: '8 CABAÑAS',
  tagline: 'UN RECORRIDO EN 8 BITS',
  start: 'PULSA START',
  map: '8 DISCOS.\n8 CABAÑAS.\nUNA NOCHE.',
  warn: '¡CUIDADO!',
  terror: 'EN LA GIRA DE NOCHE\nJASON SALÍA AL\nESCENARIO.',
  ask: '¿CUÁL ES TU\nNIVEL FAVORITO?',
  cont: 'CONTINUE?',
  yesno: '▶ SÍ    NO',
  handle: '@COLORESRUIDOSOS',
};

const blocks = [['titulo', 4], ['mapa', 2], ...LEVELS.map((l) => [`nivel${l.n}`, 4, l]), ['cierre', 4]];
let bar = 0;
export const SEGMENTS = blocks.map(([id, bars, level]) => {
  const s = { id, level, bar, start: (bar * 240) / BPM, end: ((bar + bars) * 240) / BPM };
  bar += bars;
  return s;
});
export const DURATION = SEGMENTS.at(-1).end;

export function segmentAt(t) {
  for (const s of SEGMENTS) if (t < s.end) return s;
  return SEGMENTS.at(-1);
}

export const TEXTS = [
  ...Object.values(COPY),
  ...LEVELS.flatMap((l) => [`NIVEL ${l.n}`, l.title, l.sub || String(l.year)]),
];
