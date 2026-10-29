/* Guion del video. Tiempos en segundos, absolutos.
   Pasos que entiende video.html:
     scroll   { sel, off }      lleva el elemento a `off` px del borde de arriba del celular
     click    { sel }           toca el elemento (con círculo de toque)
     senalar  { sel }           solo el círculo de toque, sin hacer clic
     escribir { sel, texto }    escribe letra por letra durante `dur`; `agregar` lo pone al final */
const ESCENAS = [
  { t: 0, dur: 4, tarjeta: 'intro', etiqueta: '', texto: '' },

  { t: 4, dur: 6, etiqueta: 'Portada', texto: 'Quién eres, qué atiendes y un botón para pedir cita.',
    pasos: [{ at: 7, hacer: 'senalar', sel: '.hero .bt-pri' }] },

  { t: 10, dur: 5, etiqueta: 'Horario', texto: 'Dice sola si estás abierto ahora mismo.',
    pasos: [{ at: 10.2, dur: 1.4, hacer: 'scroll', sel: '.franja', off: 260 },
            { at: 12.2, hacer: 'senalar', sel: '#ahora' }] },

  { t: 15, dur: 6, etiqueta: 'Qué atendemos', texto: 'El paciente toca lo que tiene.',
    pasos: [{ at: 15.2, dur: 1.4, hacer: 'scroll', sel: '#atendemos', off: 70 },
            { at: 17, hacer: 'click', sel: '#lista .it:nth-child(1)' },
            { at: 18.4, hacer: 'click', sel: '#lista .it:nth-child(3)' },
            { at: 19.6, dur: 1, hacer: 'scroll', sel: '#cuenta', off: 520 }] },

  { t: 21, dur: 6, etiqueta: 'Zona del pie', texto: '¿No sabe cómo se llama? Marca dónde le duele.',
    pasos: [{ at: 21.2, dur: 1.4, hacer: 'scroll', sel: '.pie-box', off: 90 },
            { at: 23.4, hacer: 'click', sel: '.zn[data-zona="el talón"]' }] },

  { t: 27, dur: 4, etiqueta: 'Confianza', texto: 'Tu calificación de Google, a la vista.',
    pasos: [{ at: 27.2, dur: 1.4, hacer: 'scroll', sel: '.bloque', off: 120 }] },

  { t: 31, dur: 6, etiqueta: 'Preguntas', texto: 'Responde lo que todos preguntan: costo, qué llevar, dónde.',
    pasos: [{ at: 31.2, dur: 1.2, hacer: 'scroll', sel: '.qs .q:nth-child(3)', off: 90 },
            { at: 33.6, dur: 2.6, hacer: 'scroll', sel: '.qs .q:nth-child(6)', off: 90 }] },

  { t: 37, dur: 7, etiqueta: 'Pedir cita', texto: 'Elige día y horario. Jueves y domingo no aparecen.',
    pasos: [{ at: 37.2, dur: 1.4, hacer: 'scroll', sel: '#agenda', off: 40 },
            { at: 39.6, hacer: 'click', sel: '#dias .dia:nth-child(1)' },
            { at: 41.4, hacer: 'click', sel: '.fr[data-f="por la mañana"]' }] },

  { t: 44, dur: 7, etiqueta: 'Pedir cita', texto: 'Escribe su nombre. El motivo ya se llenó solo.',
    pasos: [{ at: 44.2, dur: 1, hacer: 'scroll', sel: '#nombre', off: 170 },
            { at: 45.4, dur: 1.8, hacer: 'escribir', sel: '#nombre', texto: 'María López' },
            { at: 48.4, hacer: 'senalar', sel: '#motivo' }] },

  { t: 51, dur: 6, etiqueta: 'WhatsApp', texto: 'El mensaje sale listo por WhatsApp. Tú solo confirmas.',
    pasos: [{ at: 51.2, dur: 1.4, hacer: 'scroll', sel: '#prev', off: 140 },
            { at: 54.4, hacer: 'senalar', sel: '#enviar' }] },

  { t: 57, dur: 8, etiqueta: 'Urgencias', texto: '¿Es urgente? La página lo detecta y pide hablar directo.',
    pasos: [{ at: 57.2, dur: 1.2, hacer: 'scroll', sel: '#motivo', off: 120 },
            { at: 58.8, dur: 1.6, hacer: 'escribir', sel: '#motivo', texto: ' Ya me sale pus.', agregar: true },
            { at: 61.2, dur: 1, hacer: 'scroll', sel: '#urg', off: 240 },
            { at: 63.2, hacer: 'senalar', sel: '#urg-wa' }] },

  { t: 65, dur: 5, etiqueta: 'Datos', texto: 'Dirección, horario y qué traer, siempre a la mano.',
    pasos: [{ at: 65.2, dur: 1.6, hacer: 'scroll', sel: '.datos', off: 60 }] },

  { t: 70, dur: 6, tarjeta: 'cierre', etiqueta: '', texto: '' },
];

const DURACION = ESCENAS[ESCENAS.length - 1].t + ESCENAS[ESCENAS.length - 1].dur;

if (typeof module !== 'undefined') module.exports = { ESCENAS, DURACION };
