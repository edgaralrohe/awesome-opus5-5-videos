// Fuente única de verdad: tiempos, textos y flags del video.
export const DURATION = 30;
export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

export const SCENES = [
  { id: 'hook',     start: 0,  end: 3 },
  { id: 'logo',     start: 3,  end: 6 },
  { id: 'scan',     start: 6,  end: 11 },
  { id: 'invite',   start: 11, end: 15 },
  { id: 'tables',   start: 15, end: 19 },
  { id: 'live',     start: 19, end: 23 },
  { id: 'segments', start: 23, end: 26 },
  { id: 'cta',      start: 26, end: 30 },
];

export const CONFIG = {
  // Precios pendientes de confirmar: NO mostrarlos hasta que el cliente los apruebe.
  showPricing: false,
  event: 'Boda Sofía & Andrés',
  copy: {
    hook: ['¿Fila en la entrada?', 'Listas en papel. Colados. Caos.'],
    tagline: 'Gestión de Invitados y Mesas',
    scan: ['Check-in en', 'menos de un segundo'],
    invite: ['Invitaciones y pases QR', 'directo por WhatsApp'],
    tables: ['Cada invitado', 'en su mesa'],
    live: ['Asistencia', 'en tiempo real'],
    segments: ['Para cada', 'celebración'],
    ctaMain: 'Empieza gratis',
    ctaSub: 'Disponible para Android',
    ctaPricing: 'Desde $149 MXN por evento',
  },
  // Invitados ficticios.
  guests: [
    { name: 'Familia Ramírez', table: 4, plus: 3 },
    { name: 'Valeria Ortiz', table: 7, plus: 1 },
    { name: 'Carlos Mendoza', table: 2, plus: 0 },
  ],
  segments: ['Boda', 'XV años', 'Graduación', 'Fiesta infantil', 'Ejecutivo', 'Privado'],
  // Cajas de texto clave (px) para validar zona segura de Reels/TikTok.
  textBoxes: {
    headline: { top: 220, height: 340 },
    cta:      { top: 1180, height: 400 },
  },
};
