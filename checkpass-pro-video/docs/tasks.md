# Tareas (orden TDD: rojo → verde → refactor)

## Fase 1 — Motor de tiempo
- [x] T1 🔴 Test: `clamp`, `easeInOutCubic(0|0.5|1)`, `interp` con rangos y extrapolación acotada.
- [x] T2 🟢 Implementar en `timeline.js`.
- [x] T3 🔴 Test: `SCENES` contiguas, inicia en 0, termina en 30, sin huecos ni solapes; cada escena ≥ 1.5 s.
- [x] T4 🔴 Test: `sceneAt(t)` devuelve la escena correcta en bordes (0, 2.999, 3, 30); `sceneProgress` ∈ [0,1].
- [x] T5 🔴 Test: `counterAt` entero, monótono, alcanza el objetivo; `checkinTimes` caen dentro de la escena QR.
- [x] T6 🟢 Implementar `config.js` + funciones restantes.

## Fase 2 — Marca
- [x] T7 🔴 Test: paleta exacta del brief; colores de estado no se usan como acento decorativo; `showPricing` = false por defecto; ningún texto visible contiene "$" si el flag está apagado.
- [x] T8 🟢 Implementar `brand.js`.

## Fase 3 — Escenas
- [x] T9 Escenario + fuentes + `renderAt(t)`.
- [x] T10 F1 Hook · F2 Logo.
- [x] T11 F3 Check-in QR (HUD, línea de escaneo, confirmación, contador).
- [x] T12 F4 Invitaciones/WhatsApp · F5 Croquis de mesas.
- [x] T13 F6 Dashboard · F7 Segmentos · F8 CTA.

## Fase 4 — Render y verificación
- [x] T14 🔴 Test de integración: renderizar fotogramas clave en Chromium, verificar que no estén vacíos y que el texto clave de cada escena es visible.
- [x] T15 🟢 `render.mjs` + audio sintetizado.
- [x] T16 🔴 Test de salida (ffprobe): 1080×1920, 30 fps, 30 s ± 1 frame, H.264 yuv420p, < 20 MB.
- [x] T17 Revisión visual de hoja de contactos; ajustes.

## Pendiente (requiere al cliente)
- [ ] Grabaciones reales (escaneo, croquis, dashboard) → reemplazar mockups.
- [ ] Logo oficial SVG/PNG → reemplazar `logoSVG()`.
- [ ] Precios finales → activar `showPricing`.
- [ ] Música/voz en off.
