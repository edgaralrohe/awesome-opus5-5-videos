# spec.md — Tráiler «México vs. José Madero» (reel de Instagram)

> Metodología SDD (Dominicode). Estilo de la librería Lemo-Opuscar: **16-bit Pixel RPG** (`styles/pixel-rpg/STYLE.md`), adaptado a vertical.

## 1. Visión
Un reel de 36 s que anuncia que el juego **México vs. José Madero** (homenaje no oficial de Colores Ruidosos) se puede jugar gratis desde el **viernes 6 de noviembre de 2026** en la web de CR, sección **Games**. Trae los dos primeros discos solistas de José Madero, *Carmesí* (2016) y *Noche* (2017), rumbo a sus conciertos en la Arena Ciudad de México (21 y 22 de mayo de 2027).

**Promesa honesta:** todo lo que se ve del juego es **juego real**, grabado del código del juego con bots. Nada de escenas que el juego no tenga: el VS en la Arena aún no existe, así que la Arena sale como **destino**, no como nivel.

**Métrica de éxito:** visitas a `/games/` y partidas el fin de semana del estreno; que el reel se entienda sin sonido en los primeros 3 s.

## 2. Usuarios
- **Fans de José Madero en Instagram** (México, de 18 a 35 años), que ven el reel en el celular y muchas veces sin sonido.
- **Seguidores de @coloresruidosos**, que ya conocen la trivia de la web.

## 3. Funcionalidades
- **R1 Gancho (0–4 s):** juego real de *Carmesí* desde el primer fotograma, con la pregunta de Pepe «¿QUIÉN SOY?» en un cuadro de diálogo.
- **R2 Partidas guardadas como recuerdos (4–8 s):** menú «ELIGE UN RECUERDO» con 8 ranuras: 1 CARMESÍ 2016 y 2 NOCHE 2017 disponibles; 3 a 7 «???», bloqueadas; 8 «ARENA CDMX» (el destino, no un nivel). La mano elige la 1 y la miniatura se abre en mosaico.
- **R3 Carmesí (8–14 s):** 3 tomas reales (Calle, Azoteas y el jefe Flash-Bot) con ventana de sistema «MUNDO 1 · CARMESÍ · 2016» y la fanfarria «¡DISCO DE ORO!».
- **R4 Cambio de paleta (14–16 s):** casi en silencio, el rojo se apaga a gris por pasos de paleta. Es el momento nativo del estilo.
- **R5 Noche (16–22 s):** 3 tomas reales (la Entrada, el Salón a oscuras con farol y el Enmascarado) con «MUNDO 2 · NOCHE · 2017» y «MÁSCARA DE FIESTA».
- **R6 Identidad (22–26 s):** «IDENTIDAD 2/8» sube con fanfarria de nivel, y Pepe pregunta «¿Y LOS OTROS 6?».
- **R7 Destino (26–30 s):** «PRÓXIMA PARADA: ARENA CIUDAD DE MÉXICO · 21 Y 22 MAY 2027» con su fuente en letra chica (LOS40, Grupo Animal).
- **R8 Cierre (30–36 s, ≥ 4 s fijo):** logotipo del juego, «JUEGA GRATIS · VIERNES 6 NOV», «coloresruidosos.github.io → GAMES», «HOMENAJE NO OFICIAL · @COLORESRUIDOSOS» y «PRESS START» parpadeando.
- **Sin voz:** el texto va en pantalla (cuadros de diálogo y ventanas), pensado para verse sin sonido.

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
