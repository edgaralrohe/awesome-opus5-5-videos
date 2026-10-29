# Fluye: vídeo animado para *Mientras el Guadalquivir fluye y fluye y fluye*

Pieza vertical (9:16, 30 s) en estilo **dibujo animado a lápiz** con la identidad visual del quinto disco de Viva Belgrado. El arte original del disco es de Josu Larrea.

![Hoja de contactos](assets/contactos.jpg)

**Idea:** en la portada, el río es una constelación de puntos de luz. Una gota cae, se abre en un río de luz que pasa bajo el Puente Romano de Córdoba, cuatro figuras lo miran desde la orilla y los puntos suben al cielo mientras aparece el título.

| Escena | Tiempo | |
|---|---|---|
| Papel | 0–4 s | Garabato a lápiz y «Viva Belgrado» revelado como tinta |
| La gota | 4–11 s | Gota con squash & stretch → río de puntos de luz |
| Córdoba | 11–19 s | Mezquita y Puente Romano dibujándose; la banda aparece en la orilla |
| Fluye | 19–26 s | El río sube al cielo; título en tres golpes con «fluye» ondulando |
| Cierre | 26–30 s | «Ya disponible», monograma mG fff, web |

## Uso

```bash
npm install
npm test          # lógica pura + integración en Chromium (determinismo, fuentes, tamaño)
npm run preview   # http://localhost:5173 · espacio = play/pausa · ?t=12 salta a 12 s
npm run frames    # fotogramas clave en out/frames + out/contactos.png
npm run render    # out/fluye-9x16.mp4 (H.264, 1080×1920, 30 fps, ~45 MB)
```

Requiere Node 22, ffmpeg y Playwright con Chromium. El vídeo no lleva audio: la canción se añade en edición.

## Cómo está hecho

- **Spec-Driven Development:** [`specs/spec.md`](specs/spec.md) (qué y por qué), [`specs/plan.md`](specs/plan.md) (cómo) y [`specs/tasks.md`](specs/tasks.md) (orden TDD).
- **Canvas 2D determinista:** cada fotograma es una función pura de `t` y todo el azar sale de semillas, así que la preview y el export coinciden píxel a píxel.
- **Lenguaje cartoon:** *line boil* a 12 fps (animar a doses), squash & stretch, rebotes con *overshoot* y movimiento secundario (cabeceo a ~120 bpm, una cabeza que se apoya en el hombro de al lado, otra que mira al cielo).
- **Identidad:** cinco tokens monocromos (`src/config.js`), nube analógica fBm, grano de película, motas bokeh, Instrument Serif más Inter Bold.

Las imágenes de `assets/referencias/` son carteles del disco usados solo como guía de estilo. Esta es una pieza no oficial.
