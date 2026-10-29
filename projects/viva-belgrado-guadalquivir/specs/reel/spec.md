# Spec — Reel de reseña «Mientras el Guadalquivir fluye y fluye y fluye» (Colores Ruidosos)

> SDD (Dominicode). Segunda composición del proyecto: reutiliza el motor de «Fluye» (`src/lib`, `src/render`).

## 1. Visión

Reel vertical de unos 76 s, sin narración y solo con texto en pantalla, en el que **Colores Ruidosos** reseña el quinto disco de Viva Belgrado. El reel tiene dos mundos visuales:

- **El mundo del disco** (escenas 1–4): la identidad de Josu Larrea ya implementada en «Fluye». Monocromo cálido, nube analógica, río de puntos de luz, lápiz con *line boil*, Instrument Serif.
- **El mundo de Colores Ruidosos** (escenas 5–7): cambio de tono para la opinión, el veredicto y el cierre.

El paso de un mundo a otro es el giro narrativo: «esto es el disco» → «esto pensamos nosotros».

**Éxito:** se lee entero sin pausar, cada tarjeta entra al pulso de la canción y el 9/10 se recuerda.

## 2. Usuarios

| Usuario | Necesidad |
|---|---|
| Colores Ruidosos (creador) | Cambiar textos, BPM y marca sin tocar código de dibujo; MP4 listo para Reels/TikTok |
| Público de redes | Entender la reseña con el móvil en silencio o con la canción; 2–3 s por tarjeta |
| Fans de Viva Belgrado | Reconocer la estética del disco |

## 3. Funcionalidades

| ID | Funcionalidad | Prioridad |
|---|---|---|
| R1 | Guion como datos (`src/reel/script.js`): 30 tarjetas T1–T30 en 7 escenas, duración en **pulsos** | Must |
| R2 | Calendario al pulso: `BPM` + `OFFSET` → inicio y fin de cada tarjeta; cambiar el BPM reajusta todo | Must |
| R3 | Golpe de corte: en cada cambio de tarjeta, *kick* de escala y entrada palabra a palabra | Must |
| R4 | Ajuste de línea automático dentro de la zona segura | Must |
| R5 | E1 portada con zoom lento: usa `assets/portada.jpg` si existe; si no, una evocación procedural (nube + constelación + sello mG fff) | Must |
| R6 | E2 ficha: la portada sube y el tracklist de 11 temas se escribe; «Menquitofla» se resalta en T7 | Must |
| R7 | E3 río y Córdoba (motor de «Fluye») + foto de la banda (`assets/banda.jpg`) tratada en monocromo con grano | Must |
| R8 | E4 newsletter: hoja de papel con renglones y subrayador que resalta el fragmento | Must |
| R9 | Las tarjetas `pending` (T13–T15) se ven marcadas como PENDIENTE y el render lo avisa | Must |
| R10 | E5–E7 en tema Colores Ruidosos, con tokens en un solo archivo (`src/reel/theme.js`) | Must |
| R11 | E6 número grande: «9 / 10» con conteo y rebote | Must |
| R12 | Mezcla de audio opcional en el render: `--audio archivo --audio-start s`, con fundidos de entrada y salida | Should |
| R13 | Detección automática de BPM | Won't (el BPM se indica a mano) |

## 4. Flujos

### 4.1 Guion (a 120 bpm: 1 pulso = 0,5 s; 152 pulsos = 76 s)

| Escena | Tiempo | Tarjetas (pulsos) | Visual |
|---|---|---|---|
| E1 Gancho | 0–4 | T1 4 · T2 4 | Portada, zoom lento |
| E2 Ficha | 4–14 | T3–T7 4 cada una | Portada arriba + tracklist |
| E3 De qué va | 14–24 | T8–T11 5 cada una | Río/Córdoba → foto banda (T10–T11) |
| E4 Newsletter | 24–38 | T12 4 · T13–T15 8 | Hoja + subrayador |
| E5 Crítica | 38–62 | T16 4 · T17 6 · T18 6 · T19 6 · T20 7 · T21 6 · T22 6 · T23 7 | Tema CR |
| E6 Veredicto | 62–72 | T24 3 · T25 5 · T26 4 · T27 4 · T28 4 | Número grande |
| E7 Cierre | 72–76 | T29 4 · T30 4 | Logo CR + @coloresruidosos |

### 4.2 Flujo del creador
1. Edita `src/reel/script.js` (textos, BPM, OFFSET) y `src/reel/theme.js` (marca).
2. Opcional: coloca `assets/portada.jpg`, `assets/banda.jpg` y `assets/logo-cr.png`.
3. `npm run preview:reel` para revisar; `npm run render:reel -- --audio cancion.mp3 --audio-start 42` para exportar.

## 5. Arquitectura

- `reel.html` + `src/reel/main.js`: composición nueva, misma API `__ready` / `__renderFrame` / `__duration`.
- `src/reel/schedule.js` (puro): calendario por pulsos, `cardAt(t)`, `beatPhase(t)`.
- `src/reel/wrap.js` (puro): `wrapLines(text, maxW, measure)` con medidor inyectado (testeable sin DOM).
- `src/reel/script.js` (datos) y `src/reel/theme.js` (tokens CR).
- `src/reel/scenes/*.js`: dibujo por escena.
- `scripts/render.mjs` acepta `--page`, `--out`, `--audio` y `--audio-start`, y lee la duración de la página.

## 6. Requisitos no funcionales

| NFR | Criterio |
|---|---|
| Lectura | ≥ 2 s por tarjeta a 120 bpm (≥ 4 pulsos), salvo T24 (frase de 3 palabras, 1,5 s). Texto ≥ 56 px |
| Zona segura | Texto dentro de 120 px laterales, 260 px arriba y 340 px abajo (la UI de Reels tapa más abajo) |
| Determinismo | Mismo `t` → mismos píxeles |
| Accesibilidad | Sin destellos > 3 Hz. El *kick* es de escala, no de brillo |
| Peso | MP4 ≤ 12 Mbit/s |
| Veracidad | Los datos sin fuente pública se marcan en `script.js` con `source: 'usuario'`. Las tarjetas pendientes no salen sin marcar |

### Verificación de datos (29/10/2026)
| Tarjeta | Estado |
|---|---|
| T3, T4, T6, T7 | ✅ Título, quinto álbum, 23/10/2026, Ricky Falkner, Alain Johannes en «Menquitofla» (prensa) |
| T5 | ✅ 11 canciones; sello Fueled By Salmorejo (prensa / tienda) |
| T10 | ⚠️ Jaime Acosta y Cristina G. Sánchez figuran en la formación actual; que sea su *primer disco* no está confirmado públicamente |
| T11 | ⚠️ Preventa: no aparece en fuentes públicas (dato del usuario, probablemente de la newsletter) |
| T13–T15 | ⛔ Pendientes |

## Pendiente del usuario
- Datos de la newsletter (T13–T15)
- Identidad de Colores Ruidosos: logo y colores. Mientras tanto se usa un **tema provisional**
- Portada en alta resolución y foto de la banda (si no llegan, se usa la evocación procedural y la foto recortada del cartel)
- BPM y punto de inicio del fragmento de la canción (por defecto 120 bpm, offset 0)
