# spec.md — Tráiler «México vs. José Madero» (reel de Instagram)

> Metodología SDD (Dominicode). Estilo de la librería Lemo-Opuscar: **16-bit Pixel RPG** (`styles/pixel-rpg/STYLE.md`), adaptado a vertical.

## 1. Visión
Un reel de 48 s que anuncia que el juego **México vs. José Madero** (homenaje no oficial de Colores Ruidosos) se puede jugar gratis desde el **viernes 6 de noviembre de 2026** en la web de CR, sección **Games**. Trae los dos primeros discos solistas de José Madero, *Carmesí* (2016) y *Noche* (2017), rumbo a sus conciertos en la Arena Ciudad de México (21 y 22 de mayo de 2027).

**Promesa honesta:** todo lo que se ve del juego es **juego real**, grabado del código del juego con bots. Nada de escenas que el juego no tenga: el VS en la Arena aún no existe, así que la Arena sale como **destino**, no como nivel.

**Métrica de éxito:** visitas a `/games/` y partidas el fin de semana del estreno; que el reel se entienda sin sonido en los primeros 3 s.

## 2. Usuarios
- **Fans de José Madero en Instagram** (México, de 18 a 35 años), que ven el reel en el celular y muchas veces sin sonido.
- **Seguidores de @coloresruidosos**, que ya conocen la trivia de la web.

## 3. Funcionalidades (guion v2, 5 nov 2026)
> **Cambio del usuario:** la v1 contaba la historia pero no explicaba de qué trata el juego. La v2 va en 3 actos: la premisa, cómo se juega y los dos mundos, más lo que viene. Dura 48 s.

- **R1 Premisa (0–10 s):** viñetas **reales** del prólogo del juego. p3 lleva «ALGO SE LE PERDIÓ»; p4, «PEPE NO RECUERDA QUIÉN ES»; y p5 con el pasillo real del Museo, «CADA DISCO GUARDA UNA PARTE DE ÉL». El título del juego va arriba. **No** salen p1 (nombra el estadio) ni p2 (el cartel de la Arena con la cara de Madero, un riesgo aceptado solo dentro del juego).
- **R2 Cómo se juega (10–26 s):** ventana «CÓMO SE JUEGA» y 4 consejos numerados, de 4 s cada uno, sobre juego real:
  1. «EL MICRÓFONO GOLPEA / Y SE ENGANCHA»;
  2. «LA PRENSA TE PERSIGUE / TITULARES Y PAPARAZZI»;
  3. «LLENA LA OVACIÓN / ¡SOLO DE GUITARRA!»;
  4. «¿SABÍAS QUE…? / DATOS REALES CON FUENTE», sobre la pantalla real de datos tras un jefe.
- **R3 Dos mundos (26–38 s):**
  - «MUNDO 1 · CARMESÍ · 2016 / CONTRA LA PRENSA ROSA», con la presentación real del jefe Flash-Bot y su derrota;
  - la paleta se apaga a gris;
  - «MUNDO 2 · NOCHE · 2017 / MONSTRUOS CLÁSICOS / Y SE VA LA LUZ», con la Entrada, el Salón a oscuras y la presentación y derrota del Enmascarado.
- **R3b Lo que viene (40–44 s), petición del usuario del 5 nov:** el pasillo real del Museo con las puertas bloqueadas, «CADA DISCO, UN MUNDO», «EL VIERNES: MUNDOS 1 Y 2» y «UN DISCO CADA 2 SEMANAS» (plan de lanzamiento de CR).
- **R4 Recuerdo y cierre (38–40 y 44–48 s):**
  - la pantalla real «RECUERDO RECUPERADO» y «RUMBO A LA ARENA CDMX · 21 Y 22 MAY 2027», con su fuente;
  - tarjeta final (≥ 4 s): logotipo, «JUEGA GRATIS · VIERNES 6 NOV», «EN CELULAR Y COMPU», «COLORESRUIDOSOS.GITHUB.IO», «SECCIÓN GAMES» y «HOMENAJE NO OFICIAL · @COLORESRUIDOSOS».
- **Sin voz:** el texto va en pantalla, para verse sin sonido. La Arena es **destino**, no nivel.

## 4. Flujos
1. **Captura:** `tools/capture.mjs` carga el juego real (`juegos/mexico-vs-jose-madero`) en Chromium con el reloj controlado, juega con los bots de los tests y guarda PNG a 24 fps de cada toma.
2. **Composición:** `index.html` (contrato `render(t)` de la librería) dibuja un framebuffer de 360×640 con las tomas a escala 1:1, la interfaz RPG, el texto y las transiciones; se escala ×3 a 1080×1920.
3. **Sonido:** `tools/score.py` sintetiza el chiptune original y el foley a partir de la misma línea de tiempo (`src/timeline.js` → `events.json`).
4. **Salida:** `build.sh` → `trailer-jmv.mp4` (1080×1920, 24 fps, −14 LUFS) y `poster.jpg`.

## 5. Arquitectura
| Pieza | Qué es |
|---|---|
| `src/timeline.js` | Secciones, compases (120 bpm) y eventos: la única fuente de tiempos |
| `src/px.js` | Framebuffer de 360×640, fuente de píxeles, ventanas, mosaico y pasos de paleta |
| `index.html` | `render(t)`, `DUR`, `EV`, `TEXTS` |
| `tools/capture.mjs` | Grabación del juego real |
| `tools/score.py` | Música y foley |
| `build.sh` | Todo con un comando |
| `tests/` | Tiempos (lectura y cortes en compás), datos con fuente, sin marcas de terceros |

## 6. Requisitos no funcionales
- **Formato:** 1080×1920, 24 fps, H.264, −14 LUFS, sin grano. Zona segura de Instagram: nada importante en los 220 px de arriba ni en los 380 px de abajo, a escala final.
- **Veracidad:** cada dato en pantalla, con 2 fuentes o más, en `FACTS.md`. Sin datos ⚠️.
- **Legal y ética** (CONTEXTO §1): sin música ni letras de Madero (la música es original y hecha por código), sin logos de terceros ni de la Arena, sin la cara de Madero y con el rótulo de homenaje no oficial. No sale la viñeta 2 del prólogo (el cartel de la Arena), que es un riesgo aceptado solo dentro del juego.
- **Accesibilidad:** nada parpadea más de 3 veces por segundo; ningún texto dura menos de su tiempo de lectura (`readcheck`).
- **Reproducible:** `render(t)` es determinista y la captura usa reloj y bots fijos.
