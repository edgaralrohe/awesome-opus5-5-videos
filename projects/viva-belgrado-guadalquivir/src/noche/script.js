// Guion «No es una canción de Halloween». beats a 120 bpm (4 pulsos = 2 s).
//  fx: fase visual que acompaña a la tarjeta (ver src/noche/main.js)
export const BPM = 120;
export const OFFSET = 0;

export const CARDS = [
  { id: 'T1', beats: 8, fx: 'party', text: 'Hoy todos van a poner «Noche de brujas».', accent: ['«Noche', 'de', 'brujas».'] },
  { id: 'T2', beats: 8, fx: 'freeze', text: 'Pero no es una canción de Halloween.', accent: ['no'] },
  { id: 'T3', beats: 12, fx: 'vinyl', text: 'Primer sencillo de «Noche», el segundo disco solista de José Madero (2017).', accent: ['José', 'Madero'],
    source: 'https://es.wikipedia.org/wiki/Noche_(%C3%A1lbum_de_Jos%C3%A9_Madero)' },
  { id: 'T4', beats: 16, fx: 'glow', text: 'Habla de las máscaras que nos ponemos para encajar…', accent: ['máscaras'],
    source: 'https://revistakuadro.com/jose-madero-nos-presenta-noche-de-brujas/' },
  { id: 'T5', beats: 12, fx: 'swap', text: '…y de cómo las cambiamos según nos conviene.', accent: ['cambiamos'] },
  { id: 'T6', beats: 10, fx: 'drop', text: 'Este Halloween, ¿qué máscara te vas a poner? 🎃', accent: ['máscara'] },
  { id: 'T7', beats: 6, fx: 'logo', text: '@coloresruidosos', style: 'handle' },
];
