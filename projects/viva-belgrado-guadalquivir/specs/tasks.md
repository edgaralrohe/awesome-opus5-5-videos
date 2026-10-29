# Tareas — orden TDD (rojo → verde → refactor)

Leyenda: 🧪 test primero · 🎨 visual (se valida con fotogramas de muestra) · ✅ hecho

## Fase 0 — Andamiaje
- [x] T0.1 `package.json` (type module, scripts `test`, `preview`, `render`, `frames`), `.gitignore` de `out/` y `node_modules/`
- [x] T0.2 Vendorizar fuentes en `src/fonts/`

## Fase 1 — Lógica pura (🧪)
- [x] T1.1 🧪 `math`: `clamp`, `lerp`, `mapRange` y easings con extremos `f(0)=0`, `f(1)=1`; `outBack` hace *overshoot* (>1 en algún punto)
- [x] T1.2 🧪 `rng`: `mulberry32` determinista (misma semilla → misma secuencia, valores en [0,1)); `hash2` estable
- [x] T1.3 🧪 `timeline`: `DURATION = 30`; las escenas cubren [0,30] sin huecos; `progress(t,a,b)` acotado a [0,1]; `sceneWeights(t)` en [0,1] con alguna escena activa en todo t
- [x] T1.4 🧪 `boil`: `boilFrame` cambia exactamente 12 veces por segundo; `jitter` es determinista y está acotado por la amplitud
- [x] T1.5 🧪 `river`: `pointAt(0)` está arriba y `pointAt(1)` abajo (y creciente en conjunto); los segmentos del muestreo tienen longitud ≈ constante (±5 %); `dotsAt(t)` devuelve N puntos dentro del lienzo y es determinista

## Fase 2 — Render (🎨)
- [x] T2.1 🎨 Fondo: nube + grano + motas (F2)
- [x] T2.2 🎨 Lápiz: trazo con boil y revelado progresivo (F8, base de F5)
- [x] T2.3 🎨 Río de puntos con halo y gota con squash & stretch (F3, F4)
- [x] T2.4 🎨 Córdoba: puente y Mezquita (F5)
- [x] T2.5 🎨 Banda: cuatro figuras cartoon (F6)
- [x] T2.6 🎨 Tipografía y monograma (F7)
- [x] T2.7 Composición de escenas en `main.js` y preview con controles (F9)

## Fase 3 — Export e integración (🧪 + 🎨)
- [x] T3.1 🧪 Test de integración: la página carga en Chromium, `__ready` se resuelve, `__renderFrame(t)` es determinista (mismo hash dos veces) y distintos `t` dan fotogramas distintos
- [x] T3.2 `scripts/render.mjs` → `out/fluye-9x16.mp4`; se comprueba con `ffprobe` (1080×1920, 30 fps, 30 s)
- [x] T3.3 🎨 Hoja de contactos con fotogramas clave para revisión
- [x] T3.4 README del proyecto

## Criterios de aceptación globales
- `npm test` en verde
- El MP4 cumple los NFR de `spec.md` §6
- En los fotogramas clave se ven boil, squash & stretch y movimiento secundario
