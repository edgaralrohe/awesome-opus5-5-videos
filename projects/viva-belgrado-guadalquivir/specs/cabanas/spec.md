# Spec — «8 cabañas»: la discografía de José Madero en 8 bits

> SDD (Dominicode). Composición independiente en pixel art; reutiliza solo la infraestructura de render (`scripts/`).

## 1. Visión
Un reel 9:16 de unos 67 s con estética de videojuego de terror de NES. La referencia de estilo es el *Friday the 13th* de NES (mapa con lago, cabañas, paleta limitada, avisos en pantalla), **sin usar su nombre, logo ni sprites**. Un pequeño Pepe en píxeles recorre 8 cabañas alrededor de un lago nocturno, una por disco solista. Cada cabaña se ilumina con el color de su disco. Suena un chiptune original compuesto por código.

**Éxito:** un fan reconoce cada disco por su color y su objeto, y comenta su «nivel favorito».

## 2. Usuarios
| Usuario | Necesidad |
|---|---|
| Colores Ruidosos | Reel listo, con audio propio sin derechos de terceros |
| Fans de Madero | Recorrido completo de la etapa solista, con guiños de terror |

## 3. Funcionalidades
| ID | Funcionalidad | Prioridad |
|---|---|---|
| C1 | Render en pixel art real: lienzo lógico 135×240 escalado ×8 sin suavizado, paleta fija tipo NES | Must |
| C2 | Fuente bitmap propia 5×7 (mayúsculas, números, tildes, Ñ, ¿?¡!·…@) | Must |
| C3 | Pantalla de título, mapa del lago y 8 niveles con iris de entrada estilo NES | Must |
| C4 | Objetos de 16×16 dibujados a mano que **evocan** cada portada sin copiarla | Must |
| C5 | Guiño de terror en *Noche*: apagón y máscara de hockey en la ventana + dato verificado | Must |
| C6 | Chiptune original (pulso + triángulo + ruido) generado por código, en tonalidad menor, a 150 bpm, mezclado en el MP4 | Must |
| C7 | Movimiento cuantizado a 12 fps (sensación de NES) aunque se exporte a 30 fps | Must |
| C8 | Cierre: «¿Cuál es tu nivel favorito?» + «CONTINUE?» + @coloresruidosos | Must |
| C9 | Etapa con Panda (PXNDX) | Won't (solo etapa solista) |

## 4. Flujos — guion (150 bpm; 1 compás = 1,6 s)
| Bloque | Compases | Tiempo | Contenido |
|---|---|---|---|
| Título | 4 | 0–6,4 | «PEPE MADERO» · «8 CABAÑAS» · lago y luna · «PULSA START» |
| Mapa | 2 | 6,4–9,6 | «8 DISCOS. 8 CABAÑAS. UNA NOCHE.» |
| Niveles 1–8 | 4 c/u | 9,6–60,8 | Pepe camina a la cabaña → iris → habitación del color del disco con su objeto + «NIVEL n · TÍTULO · AÑO» |
| Cierre | 4 | 60,8–67,2 | «¿CUÁL ES TU NIVEL FAVORITO?» → «CONTINUE? ▶ SÍ» → @COLORESRUIDOSOS |

### Niveles
| # | Disco | Año | Color | Objeto (evocación) |
|---|---|---|---|---|
| 1 | Carmesí | 2016 | rojo | rosa |
| 2 | Noche | 2017 | negro | rostro en sombra + guiño de terror |
| 3 | Alba | 2018 | blanco | ramas desnudas |
| 4 | Psalmos | 2019 | azul | persona en posición fetal en una esquina (24×24) |
| 5 | Giallo | 2022 | amarillo | cabeza con llama |
| 6 | Aurora (EP) | 2023 | naranja óxido | rama con hojas rojas |
| 7 | Sarajevo | 2024 | lila | tacón |
| 8 | Querido… | 2026 | verde | máscara de pierrot con perlas |

## 5. Arquitectura
`cabanas.html` + `src/cabanas/`:
- Puro y testeado: `palette.js`, `font.js` (glifos), `sprites.js` (mapas de caracteres), `timeline.js`, `chiptune.js` (síntesis → Float32Array).
- Dibujo: `pixel.js` (primitivas sobre el lienzo lógico), `scenes.js` y `main.js`.
- `scripts/chiptune.mjs` escribe `out/cabanas.wav`; `render.mjs --audio` lo mezcla.

## 6. NFR
- Solo colores de la paleta; ni gradientes ni antialiasing (`imageSmoothingEnabled = false`).
- Texto ≥ 1 px lógico de alto de trazo (= 8 px reales); fuera de los últimos 40 px lógicos (franja de UI de Reels).
- Sin destellos > 3 Hz a pantalla completa: el apagón de *Noche* es un único corte. «PULSA START» parpadea a 2 Hz y solo afecta a una línea de texto.
- Audio sin saturación (pico ≤ 0,9) y determinista.
- Veracidad de los datos:
  - Títulos y años: CineMedios, Wikipedia, Last.fm/Sazum.
  - *Aurora* (EP, 2023): confirmado por el usuario y Album of the Year.
  - Verde = *Querido…*: El Sol de Sinaloa.
  - Jason en la gira de *Noche*: ABC Noticias, El Alebrije, Soulwavez.
