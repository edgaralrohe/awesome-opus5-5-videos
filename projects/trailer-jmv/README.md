# Tráiler «México vs. José Madero» · reel 9:16

36 s, 1080×1920, 24 fps, −14 LUFS. Estilo **16-bit Pixel RPG** (lienzo de 360×640 ×3). Todo lo que se ve del juego es juego real, grabado con bots.

| Paso | Comando |
|---|---|
| Todo | `sh build.sh` (`LIB=<librería de estilos>`; `GAME=<carpeta del juego>` si no está en el repo de la web al lado) |
| Tests (tiempos y datos) | `npm test` |
| Regrabar tomas del juego | `node tools/capture.mjs [calle azoteas flashbot entrada salon enmascarado]` |
| Fotogramas sueltos | `node $LIB/core/render/still.mjs . 1.5 9 31 --size 1080x1920` |

Salida: `trailer-jmv.mp4` y `poster.jpg` (no se suben al repo). Documentos: `specs/` (spec, plan, tareas), `TREATMENT.md`, `FACTS.md` y `CREDITS`.

**Comparación con el demo del estilo** (DIRECTOR §11):
- Cambian 4 de 6 cosas: la apertura (juego real desde el fotograma 0), la estructura (montaje de dos mundos y el destino), el recorrido de cámara (pantalla dentro de pantalla en vertical) y la forma de la música (de re menor a re mayor hacia la Arena).
- Se parecen dos movimientos nativos del estilo: las partidas guardadas como recuerdos y el cambio de paleta. Se quedan porque cuentan la historia del propio juego: cada disco es un recuerdo, y *Noche* es en blanco y negro.
