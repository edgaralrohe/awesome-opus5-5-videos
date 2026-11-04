# plan.md — Tráiler JMV

## Decisiones
- **D1 Estilo Pixel RPG en vertical:** el estilo pide 320×180 ×6. En 9:16 el lienzo nativo es de **360×640 ×3**, para que la pantalla real del juego (320×224) quepa **pixel a pixel**, sin reescalar sprites ajenos. Todo, incluido el texto, vive en el framebuffer.
- **D2 Juego real, no recreado:** se graba el juego con `page.clock` de Playwright (paso de 60 Hz, fotograma cada 2,5 pasos) y los bots `bot`, `bossBot` y `maskBot` de `tests/bot.js`. El modo asistido impide perder corazones y se marcan como vistos los avisos de objetos, para que no tapen la acción. Solo se graba en las pantallas `play` y `victory`.
- **D3 Interfaz RPG propia:** ventanas con borde de 3 capas (tinta, blanco y plata) y relleno con trama Bayer. La fuente de píxeles es propia, de ancho variable, con acentos y Ñ, y se escribe a 38 caracteres/s. Las ventanas de cada era cambian: *Carmesí* en rojo vino y *Noche* en negro con marco blanco.
- **D4 Paleta como relato:** el cambio de *Carmesí* a *Noche* es una tabla de paleta que baja la saturación en 4 pasos (sin fundidos de opacidad). El **rojo carmesí** queda protegido como hilo conductor: es el único color que sobrevive en *Noche* (el marcador de la ranura 1) y vuelve en el cierre.
- **D5 Música:** chiptune original a 120 bpm, con un compás de 2 s. Pulsos al 12,5, 25 y 50 %, bajo de triángulo y batería de ruido LFSR, con eco de 16 bits. En *Noche* el arreglo se queda en menor y pierde una capa por cada paso de paleta.
- **D6 Zona segura:** franja útil de y = 74 a 513 px nativos (a escala ×3: de 220 a 1540).

## Riesgos
| Riesgo | Mitigación |
|---|---|
| ffmpeg 6 (la librería pide 7 para `mux.sh`) | `loudnorm` de dos pasadas propio en `tools/master.sh` y medición con `ebur128` |
| Que el bot se atasque y la toma se vea mal | Se graban más segundos de los necesarios y se elige el tramo con `CLIPS[].from` |
