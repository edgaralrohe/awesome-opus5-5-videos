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

## Fase 5 — Guion v2 (premisa + cómo se juega + dos mundos, 44 s)
- ✅ Spec v2 (R1–R4) y tratamiento v2
- ✅ Captura nueva: prólogo (p3–p5), pasillo del Museo, «¿Sabías que…?» y «Recuerdo recuperado» tras cada jefe
- ✅ 🔴→🟢 Tests: 22 compases (44 s), consejos «CÓMO SE JUEGA», sin p1 ni p2 del prólogo, datos y lectura
- ✅ `src/timeline.js` y escenas nuevas en `src/main.js`; música reacomodada
- ✅ Render, revisión y máster: 44 s, `readcheck` con 31 textos en verde, 0 negros, −14,2 LUFS, pico de −0,8 dBFS tras el AAC

- ✅ Encontrado al grabar: el juego no mostraba «RECUERDO RECUPERADO» (el kind lo pisaba la ficción). Arreglado en el juego, v9.3, con su test
- ✅ Tramo «lo que viene» (40–44 s): «EL VIERNES: MUNDOS 1 Y 2» · «UN DISCO CADA 2 SEMANAS» sobre las puertas bloqueadas del Museo; 48 s, readcheck con 34 textos, 0 negros, −14,2 LUFS
- ⏳ Verla completa con sonido (el usuario)

## Fase 6 — Abrir con la Arena (petición del usuario del 5 nov)
- ✅ Spec y tratamiento: p2 abre el reel (riesgo aceptado anotado); 50 s
- ✅ 🔴→🟢 Tests: 25 compases, la primera toma es p2 y sin p1
- ✅ Línea de tiempo, escenas y música recolocadas
- ✅ Render, readcheck (37 textos en verde), 0 negros, 50 s, −14,3 LUFS y pico de −2,3 dBFS

## Fase 7 — Premisa coherente (6 nov, petición del usuario)
- ✅ Spec y tratamiento: solo el dibujo de las viñetas y narración en cadena con la Arena como plazo
- ✅ 🔴→🟢 Tests: sin «ESA NOCHE», la Arena abre y es el plazo, viñetas recortadas a 151 px
- ✅ Recorte en `gameScreen` y textos nuevos
- ✅ Render y revisión: readcheck con 40 textos en verde, 0 negros, 50 s, −14,3 LUFS

- ⏳ Verla completa con sonido (el usuario)

## Fase 8 — Sin flashes y titulares (6 nov, petición del usuario)
- ✅ Spec y tests en rojo
- ✅ Línea de tiempo, escenas y música 2 s antes; render: 48 s, readcheck con 38 textos en verde, 0 negros, −14,1 LUFS
- ⏳ Verla completa con sonido (el usuario)

