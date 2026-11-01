# Tareas — SÚPER PEPE (TDD: 🧪 test primero · 🎨 visual · 🎮 se valida jugando)

## Fase 0 — Decisiones (bloquea el arranque)
- [ ] D1 Título definitivo · D2 Alcance de la v1 · D3 ¿Mundo 0 Panda? · D4 ¿Contacto con su equipo? · D5 Aprobar enemigos y jefes

## Fase 1 — Motor (🧪)
- [ ] E1 🧪 `loop`: paso fijo; N llamadas de render no cambian el estado
- [ ] E2 🧪 `physics`: gravedad, velocidad máxima, salto variable (soltar antes = salto más bajo), coyote time y jump buffer (6 frames)
- [ ] E3 🧪 `tilemap`: parsear niveles de texto; colisión sólida, semisólida y pinchos; no atravesar paredes a velocidad máxima
- [ ] E4 🧪 `camera`: zona muerta y límites
- [ ] E5 🧪 `save`: serializar y deserializar con almacenamiento inyectado; versión del esquema
- [ ] E6 🎮 Prototipo: Pepe (sprite del dibujo de CR) corre, salta y lanza el micrófono en un nivel gris

## Fase 2 — Juego base (🧪 + 🎨)
- [ ] J1 🧪 Jugador: daño, invencibilidad tras golpe, muerte, vidas, power-ups
- [ ] J2 🧪 Enemigo base (patrulla, pisotón) + Lunes 28 + Espina
- [ ] J3 🧪 Jefe base (máquina de fases) + La Rosa Carmesí
- [ ] J4 🎨 Mundo 1 «Carmesí» completo (nivel + jefe + hito)
- [ ] J5 🧪 Repetición: el mundo 1 se completa con una secuencia de entradas grabada
- [ ] J6 🎨 Museo (hub) con 1 puerta + vitrinas
- [ ] J7 Controles táctiles + mando
- [ ] J8 Chiptune en tiempo real (tema de mundo y de jefe)
- [ ] J9 🧪 Micrófono con cable: alcance, retorno, enganche a ganchos
- [ ] J10 🧪 Enemigos de prensa recurrentes (Titular, Paparazzi, Micrófono de reportero)

## Fase 3 — Mundos 2–8 + epílogo (para cada uno: 🧪 enemigos · 🧪 jefe · 🎨 nivel · 🧪 repetición)
- [ ] W2 Noche · W3 Alba · W4 Psalmos · W5 Giallo · W6 Aurora · W7 Sarajevo · W8 Querido…
- [ ] W9 Rueda de Prensa (intermedio) · W10 🧪 Final «MÉXICO VS. JOSÉ MADERO» (barra de público, ritmo) · W★ La Bestia (secreto)

## Fase 4 — Publicación
- [ ] P1 Accesibilidad (flashes desactivables, modo asistido, remapeo)
- [ ] P2 Créditos con fuentes + aviso de homenaje
- [ ] P3 Build estático < 1 MB + integración en la web
- [ ] P4 Modo grabación 9:16 para reels
