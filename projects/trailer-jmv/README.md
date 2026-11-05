# Tráiler «México vs. José Madero» · reel 9:16

48 s (guion v2: premisa, cómo se juega, dos mundos y lo que viene), 1080×1920, 24 fps, −14 LUFS. Estilo **16-bit Pixel RPG** (lienzo de 360×640 ×3). Todo lo que se ve del juego es juego real, grabado con bots.

| Paso | Comando |
|---|---|
| Todo | `sh build.sh` (`LIB=<librería de estilos>`; `GAME=<carpeta del juego>` si no está en el repo de la web al lado) |
| Tests (tiempos y datos) | `npm test` |
| Regrabar tomas del juego | `node tools/capture.mjs [calle azoteas flashbot entrada salon enmascarado prologo museo flashbot-fin enmascarado-fin]` y `node tools/capture-recuerdo.mjs` |
| Fotogramas sueltos | `node $LIB/core/render/still.mjs . 1.5 9 31 --size 1080x1920` |

Salida: `trailer-jmv.mp4` y `poster.jpg` (no se suben al repo). Documentos: `specs/` (spec, plan, tareas), `TREATMENT.md`, `FACTS.md` y `CREDITS`.

**Comparación con el demo del estilo** (DIRECTOR §11):
- Cambian 4 de 6 cosas: la apertura (juego real desde el fotograma 0), la estructura (montaje de dos mundos y el destino), el recorrido de cámara (pantalla dentro de pantalla en vertical) y la forma de la música (de re menor a re mayor hacia la Arena).
- Se parece un movimiento nativo del estilo: el cambio de paleta de *Carmesí* a *Noche*, que se queda porque *Noche* es en blanco y negro. Las partidas guardadas de la v1 ya no están: ahora sale el pasillo real del Museo.
