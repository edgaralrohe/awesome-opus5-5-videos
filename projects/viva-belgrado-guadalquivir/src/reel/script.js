// Guion del reel de Colores Ruidosos. Editar aquí textos, BPM y punto de sincronía.
//  beats:   duración en pulsos (a 120 bpm, 4 pulsos = 2 s)
//  accent:  palabras que se resaltan
//  pending: dato aún no recibido → se dibuja con sello PENDIENTE
//  sheet/focus: hoja de la escena 4 ('entrevista' | 'gira') y bloque resaltado
//  keepPrev: mantiene la tarjeta anterior en pantalla (cita + firma)
//  source:  'usuario' cuando el dato no tiene fuente pública verificada (ver specs/reel/spec.md §6)

export const BPM = 120; // ajustar al tempo real de la canción
export const OFFSET = 0; // segundos hasta el primer pulso dentro del fragmento

export const SCENES = [
  { id: 'gancho', world: 'disco' },
  { id: 'ficha', world: 'disco' },
  { id: 'tema', world: 'disco' },
  { id: 'voz', world: 'disco' },
  { id: 'critica', world: 'cr' },
  { id: 'veredicto', world: 'cr' },
  { id: 'cierre', world: 'cr' },
];

// Fechas del cartel de gira (assets/referencias/03-cartel-gira.png).
export const PRESENTACION = { date: '23.10.26', city: 'Barakaldo', venue: 'Hiriko Soinuak' };
export const GIRA_2027 = [
  ['22.01', 'Valencia'], ['23.01', 'Murcia'], ['05.03', 'Vitoria-Gasteiz'], ['19.03', 'Barcelona'],
  ['08.04', 'Sevilla'], ['09.04', 'Algeciras'], ['10.04', 'Granada'], ['24.04', 'Madrid'],
  ['14.05', 'Donostia'], ['15.05', 'Zaragoza'], ['03-05.06', 'Primavera Sound'],
];

export const TRACKLIST = [
  'Un andalucito más', 'Y fluye', 'Demasiado pasado', 'Calienta que sales', 'Amor a 136 bpm',
  'Amor en Em', 'Menquitofla', 'El deber de ofender', 'Varios demonios', 'Memorabilia', 'Súper futuro',
];

export const CARDS = [
  { id: 'T1', scene: 'gancho', beats: 4, text: 'Viva Belgrado sacó disco nuevo.' },
  { id: 'T2', scene: 'gancho', beats: 4, text: 'Y no es el que esperábamos.', accent: ['no'] },

  { id: 'T3', scene: 'ficha', beats: 4, text: '«Mientras el Guadalquivir fluye y fluye y fluye»', style: 'title' },
  { id: 'T4', scene: 'ficha', beats: 4, text: 'Quinto álbum · 23 de octubre de 2026' },
  { id: 'T5', scene: 'ficha', beats: 4, text: '11 canciones · sello propio: Fueled by Salmorejo', accent: ['11'] },
  { id: 'T6', scene: 'ficha', beats: 4, text: 'Producido por Ricky Falkner', accent: ['Ricky', 'Falkner'] },
  { id: 'T7', scene: 'ficha', beats: 4, text: 'Invitado: Alain Johannes en «Menquitofla»', accent: ['Alain', 'Johannes'], highlight: 'Menquitofla' },

  { id: 'T8', scene: 'tema', beats: 5, text: 'El río que cruza Córdoba como hilo conductor.', accent: ['río'] },
  { id: 'T9', scene: 'tema', beats: 5, text: 'El paso del tiempo, el pasado y la amistad.' },
  { id: 'T10', scene: 'tema', beats: 5, text: 'Primer disco con Jaime (guitarra) y Cris G. (bajo).', source: 'usuario', photo: true },
  { id: 'T11', scene: 'tema', beats: 5, text: 'Casi mil copias vendidas en preventa.', accent: ['mil'], source: 'usuario', photo: true },

  { id: 'T12', scene: 'voz', beats: 4, text: 'Lo que contó Cándido a Mondo Sonoro:', sheet: 'entrevista' },
  { id: 'T13', scene: 'voz', beats: 5, text: 'El río como algo gigante que te hace sentir pequeño.', accent: ['gigante'], sheet: 'entrevista', focus: 0, source: 'usuario (paráfrasis de la entrevista)' },
  { id: 'T14', scene: 'voz', beats: 5, text: 'Letras más directas y positivas que nunca.', accent: ['positivas'], sheet: 'entrevista', focus: 1, source: 'usuario (paráfrasis de la entrevista)' },
  { id: 'T15', scene: 'voz', beats: 6, text: '«Una de las responsabilidades de hacerse mayor es ser feliz.»', style: 'quote', sheet: 'entrevista', focus: 2,
    source: 'https://www.mondosonoro.com/entrevistas/viva-belgrado-entrevista-guadalquivir/' },
  { id: 'T16', scene: 'voz', beats: 3, text: '— Viva Belgrado · Mondo Sonoro', style: 'attribution', keepPrev: true, sheet: 'entrevista', focus: 2 },
  { id: 'T17', scene: 'voz', beats: 5, text: 'Lo presentaron en vivo el mismo día en Barakaldo.', accent: ['Barakaldo.'], sheet: 'gira', focus: 0 },
  { id: 'T18', scene: 'voz', beats: 4, text: 'Harán encuentros con fans llamados «Vernissage».', accent: ['«Vernissage».'], sheet: 'gira', focus: -1 },
  { id: 'T19', scene: 'voz', beats: 4, text: 'Gira 2027 por España. ¿México? Esperemos que pronto 👀', accent: ['¿México?'], sheet: 'gira', focus: 1 },

  { id: 'T20', scene: 'critica', beats: 4, text: 'Nuestra opinión 👇', style: 'big' },
  { id: 'T21', scene: 'critica', beats: 6, text: 'La primera escucha costó: esperaba más violencia.', accent: ['violencia.'] },
  { id: 'T22', scene: 'critica', beats: 6, text: 'Pero los sencillos ya avisaban. Todo hizo click.', accent: ['click.'] },
  { id: 'T23', scene: 'critica', beats: 6, text: 'Un pequeño regalo a la nostalgia.', accent: ['nostalgia.'] },
  { id: 'T24', scene: 'critica', beats: 7, text: 'Lejos de sus discos anteriores. Cerca del corazón.', accent: ['corazón.'] },
  { id: 'T25', scene: 'critica', beats: 6, text: 'Un pasaje sonoro que fluye como el agua.', accent: ['fluye'] },
  { id: 'T26', scene: 'critica', beats: 6, text: 'Falkner hace brillar a cada integrante.', accent: ['brillar'] },
  { id: 'T27', scene: 'critica', beats: 7, text: 'Las letras de Cándido: directas, pero con capas.', accent: ['capas.'] },

  { id: 'T28', scene: 'veredicto', beats: 3, text: '¿Su mejor disco? No.', style: 'big' },
  { id: 'T29', scene: 'veredicto', beats: 5, text: 'Pero cuando todo lo anterior es arte, empatar es enorme.', accent: ['enorme.'] },
  { id: 'T30', scene: 'veredicto', beats: 4, text: '9 / 10', style: 'score' },
  { id: 'T31', scene: 'veredicto', beats: 4, text: 'Quizá no es la etapa que más recuerda al pasado…' },
  { id: 'T32', scene: 'veredicto', beats: 4, text: '…pero sí la que más huella va a dejar.', accent: ['huella'] },

  { id: 'T33', scene: 'cierre', beats: 4, text: '¿Ya lo escuchaste? ¿Qué calificación le das?' },
  { id: 'T34', scene: 'cierre', beats: 4, text: '@coloresruidosos', style: 'handle' },
];
