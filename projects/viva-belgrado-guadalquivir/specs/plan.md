# Plan técnico — «Fluye»

## Estructura

```
projects/viva-belgrado-guadalquivir/
├── specs/            spec.md · plan.md · tasks.md
├── assets/referencias/   carteles usados como guía de estilo
├── index.html        preview (canvas + controles)
├── src/
│   ├── config.js     tamaño, fps, duración, paleta, semilla
│   ├── main.js       composición, bucle de preview, window.__renderFrame
│   ├── fonts/        woff2 vendorizadas (OFL)
│   ├── lib/          puro, testeado
│   │   ├── math.js       clamp, lerp, mapRange, easings (outCubic, outBack, inOutSine)
│   │   ├── rng.js        mulberry32, hash2 → [0,1)
│   │   ├── timeline.js   SCENES, progress(t, a, b), sceneWeights(t)
│   │   ├── river.js      riverPath(), pointAt(u) por longitud de arco, dotsAt(t)
│   │   └── boil.js       boilFrame(t), jitter(seed, frame) — line boil a 12 fps
│   └── render/
│       ├── background.js nube fBm (offscreen, una vez) + grano + motas
│       ├── pencil.js     pencilPath(): trazo doble con jitter + revelado parcial
│       ├── river.js      puntos con halo (gradiente radial cacheado)
│       ├── cordoba.js    Puente Romano (arcos) + Mezquita + orilla
│       ├── band.js       4 figuras cartoon de espaldas
│       └── type.js       textos, ondulación de «fluye», monograma
├── scripts/
│   ├── serve.mjs     servidor estático mínimo (node:http)
│   └── render.mjs    Playwright → PNG por fotograma → ffmpeg (pipe)
└── tests/            node --test
```

## Decisiones clave

1. **El tiempo es la única entrada.** `renderFrame(ctx, t)` es una función pura del tiempo. Así la preview y el export comparten código y el export es determinista.
2. **Line boil:** `boilFrame(t) = floor(t * 12)`. Cada trazo de lápiz recibe `jitter(seed + id, boilFrame)`, así la línea solo cambia 12 veces por segundo, como la animación tradicional a doses.
3. **Río:** curva serpenteante definida por puntos de control (Catmull-Rom), muestreada y reparametrizada por longitud de arco para que los puntos avancen a velocidad constante. Cada punto tiene fase `φ_i` y `u_i(t) = (φ_i + v·t) mod 1`, más una deriva lateral seeded.
4. **Fondo:** fBm de value-noise calculado una vez a 1/4 de resolución sobre canvas offscreen y escalado con suavizado, lo que da la nube blanda. El grano es un tile de ruido de 256 px desplazado por fotograma con una semilla que depende del fotograma.
5. **Halo de los puntos:** un sprite de gradiente radial pre-renderizado, dibujado con `globalCompositeOperation = 'lighter'`.
6. **Export:** Playwright abre `index.html?render=1` a 1080×1920 con `deviceScaleFactor` 1, llama a `__renderFrame(i/30)` y hace `canvas.toDataURL` → buffer → stdin de `ffmpeg -f image2pipe -c:v png -r 30 -i - -c:v libx264 -pix_fmt yuv420p -crf 18`. Es más rápido y exacto que hacer capturas de pantalla.
7. **Fuentes:** `@fontsource/instrument-serif` (400 normal e itálica) y `@fontsource/inter` (700) copiadas a `src/fonts/` con `@font-face` local. Antes del primer fotograma se espera a `document.fonts.ready`.

## Riesgos

| Riesgo | Mitigación |
|---|---|
| Una fuente no carga en headless | `__ready` espera a `document.fonts.load(...)` de cada familia; el test de render lo comprueba |
| Render lento (900 fotogramas) | PNG por pipe sin escribir a disco; fondo cacheado |
| Que parezca una presentación y no un cartoon | Boil, squash & stretch y movimiento secundario están en los criterios de aceptación |
