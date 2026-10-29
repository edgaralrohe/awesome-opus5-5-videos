# Tareas — Reel (TDD)

## Fase 1 — Lógica pura 🧪
- [x] R-T1 🧪 `schedule`: contiguo y sin huecos; total = Σpulsos·60/BPM; con otro BPM se escala; `cardAt` devuelve la tarjeta correcta en bordes; `beatPhase` ∈ [0,1)
- [x] R-T2 🧪 `wrap`: ninguna línea supera maxW (salvo palabra única); unir las líneas devuelve el texto original
- [x] R-T3 🧪 `script`: 30 tarjetas T1…T30 en orden; los límites de escena coinciden con el guion (±0,01 s a 120 bpm); T13–T15 `pending`; ≥ 4 pulsos salvo T24

## Fase 2 — Escenas 🎨
- [x] R-T4 Tarjetas: entrada por palabras, kick al pulso, sello PENDIENTE
- [x] R-T5 E1–E2 portada (imagen/evocación) + tracklist
- [x] R-T6 E3 río/Córdoba + foto banda
- [x] R-T7 E4 newsletter
- [x] R-T8 E5–E7 tema CR, 9/10, cierre

## Fase 3 — Integración 🧪
- [x] R-T9 🧪 `reel.html` carga sin errores, `__duration` = 76, determinista
- [x] R-T10 `render.mjs --page reel.html` (+ audio opcional) → `out/reel-9x16.mp4`, verificado con ffprobe
- [x] R-T11 Hoja de contactos y README
