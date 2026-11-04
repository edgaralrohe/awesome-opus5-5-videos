# tasks.md — Tráiler JMV (orden TDD)

## Fase 1 — Material
- ✅ `tools/capture.mjs`: grabar 6 tomas reales (1-1, 1-2, 1-3 jefe, 2-1, 2-2, 2-3 jefe)
- ✅ Revisar las tomas en una hoja de contactos y elegir los tramos

## Fase 2 — Tiempos
- ✅ 🔴→🟢 `tests/timeline.test.js`: secciones en compás, duración de 34 s, cada texto ≥ su tiempo de lectura y cortes en tiempo fuerte
- ✅ 🔴→🟢 `tests/facts.test.js`: cada dato en pantalla está en `FACTS.md` con 2 fuentes; sin «Arena» como nivel jugable; rótulo de homenaje presente
- ✅ `src/timeline.js`

## Fase 3 — Imagen
- ✅ `src/px.js`: framebuffer, fuente, ventanas, mosaico y paleta
- ✅ Fotogramas de estilo: gancho, menú de recuerdos y cierre (revisados contra STYLE.md)
- ✅ `index.html` completo; `readcheck` en verde

## Fase 4 — Sonido y salida
- ✅ `tools/score.py`: música y foley desde `events.json`
- ✅ Mezcla y masterizado a −14 LUFS; `build.sh`
- ✅ Revisión: hoja de contactos, `blackdetect` (0 negros), −14,1 LUFS y pico de −1,3 dBFS; comparación con el demo de la librería (4 de 6 diferentes, ver README)
- ⏳ Verla completa con sonido (el usuario: aquí no hay altavoces)
