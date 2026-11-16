# Plan técnico

## Stack
| Pieza | Elección | Motivo |
|---|---|---|
| Composición | HTML + CSS + SVG inline | Control píxel a píxel de la marca, sin build |
| Motor de tiempo | `src/timeline.js` (ES module puro) | Testeable en Node, determinista |
| Render | Playwright + Chromium preinstalado | Ya disponible en el entorno |
| Codificación | FFmpeg (libx264, CRF 18, `yuv420p`) | Compatible con todas las redes |
| Audio | FFmpeg `sine` + `adelay` | Bips de check-in sin assets externos |
| Tests | `node --test` | Cero dependencias |
| Fuentes | `@fontsource/*` | Render offline |

## Estructura
```
checkpass-pro-video/
├── docs/        spec.md · plan.md · tasks.md
├── src/
│   ├── config.js     paleta, textos, flags (showPricing), escenas y tiempos
│   ├── timeline.js   easing, clamp, interp, sceneAt, sceneProgress, counterAt, checkinTimes
│   ├── brand.js      validación de paleta / reglas de color de estado
│   ├── index.html    escenario 1080×1920 + estilos
│   └── scenes.js     construye el DOM y expone window.renderAt(t)
├── scripts/render.mjs   servidor estático + captura + ffmpeg
├── tests/              *.test.mjs
└── out/                (generado) mp4 + poster
```

## Modelo de línea de tiempo
`SCENES = [{ id, start, end }]` contiguas de 0 a 30 s. Cada escena recibe `p ∈ [0,1]` (progreso local) y el tiempo global `t`. Transiciones: fade + escala ligera de 0.4 s en entrada/salida (`fadeInOut`). Todo valor animado = `interp(p, [p0,p1], [v0,v1], easing)`.

## Decisiones
- **Precios ocultos por defecto** (spec F9). `showPricing: true` cambia la línea del CTA a "Desde $149 MXN por evento".
- **Logo recreado en SVG** a partir de la descripción (puerta en perspectiva + QR + destello) hasta recibir el SVG oficial; aislado en una función `logoSVG()` para reemplazo directo.
- **Mockups de UI** reproducen la estética de la app (tarjetas #161922, bordes #262B3A, radio 24) — se marcan para reemplazo por grabaciones reales.

## Riesgos
| Riesgo | Mitigación |
|---|---|
| Precios cambian | Flag, no se muestran por defecto |
| Logo no idéntico al oficial | `logoSVG()` aislado; pedir SVG |
| Render lento | JPEG intermedios, viewport 1080×1920 DPR 1 |
