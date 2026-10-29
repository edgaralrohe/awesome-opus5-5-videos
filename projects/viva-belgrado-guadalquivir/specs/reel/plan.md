# Plan técnico — Reel

## Reutilización
- `src/lib/*` (math, rng, boil, river) y `src/render/*` (fondo, lápiz, río, Córdoba, banda, tipografía) sin cambios de API.
- `scripts/browser.mjs` → `openStage({ page })`; `render.mjs` lee `window.__duration`.

## Nuevos módulos
```
reel.html
src/reel/
├── script.js     BPM, OFFSET, SCENES, CARDS (id, scene, text, beats, pending?, source?)
├── schedule.js   buildSchedule(cards, bpm, offset) → [{...card, start, end}]; cardAt; beatPhase
├── wrap.js       wrapLines(text, maxW, measure)
├── theme.js      tokens Colores Ruidosos (provisional)
├── cards.js      dibujo de tarjeta: entrada palabra a palabra, kick, salida
├── images.js     carga opcional de assets/ con fallback
├── main.js       composición
└── scenes/
    ├── cover.js      portada (imagen o evocación) + tracklist
    ├── newsletter.js hoja + subrayador
    └── cr.js         fondo «ruidoso» del tema CR + número grande + logo
```

## Decisiones
1. **Tiempo musical.** Las tarjetas se definen en pulsos y `buildSchedule` convierte a segundos. Así sincronizar con la canción real solo exige cambiar `BPM` y `OFFSET`.
2. **Imágenes opcionales.** `images.js` intenta cargar `assets/*.jpg`. Si falla, la escena usa el fallback procedural, así el render nunca se rompe.
3. **Tema CR provisional.** Fondo de manchas de color fBm saturadas con grano y Inter Bold. Al ser solo tokens + una función de fondo, la marca real se cambia en un archivo.
4. **Pendientes visibles.** Las tarjetas `pending` se dibujan con un sello «PENDIENTE» y el render imprime un aviso.
5. **Audio.** ffmpeg con `-ss` sobre la pista, `afade` de entrada (0,3 s) y salida (1,5 s), `-shortest`.
