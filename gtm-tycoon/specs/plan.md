# GTM Tycoon · Plan técnico (MVP v0.1)

> Depende de `spec.md`. Estado: **BORRADOR PARA REVISIÓN**.

## Stack

| Pieza | Elección | Por qué |
|---|---|---|
| Lenguaje | JavaScript ES2022 (módulos) + JSDoc para tipos | Sin paso de compilación obligatorio; Claude Code y cualquiera lo edita fácil |
| Build / dev server | Vite | Dev server instantáneo, build estático de un comando |
| Tests unitarios | Vitest + cobertura v8 | Mismo ecosistema que Vite; rápido para TDD |
| Tests E2E / humo | Playwright (Chromium) | Verifica que cada escena carga y que una partida "bot" llega al final |
| Lint / formato | ESLint + Prettier | Calidad mínima uniforme |
| Render | Canvas 2D (World) + DOM/CSS (Desk) | Coincide con las dos capas del art bible |
| Persistencia | `localStorage` (con try/catch) | Guardado local opcional, sin backend |

## Estructura de carpetas

```
gtm-tycoon/
├─ index.html
├─ docs/            art-bible.html, VISUAL.md
├─ specs/           spec.md, plan.md, tasks.md
├─ src/
│  ├─ core/         lógica pura y determinista (100 % TDD)
│  │  ├─ rng.js         RNG con semilla (mulberry32)
│  │  ├─ palette.js     tokens de color (única fuente de verdad)
│  │  ├─ clock.js       reloj del día y costo de actividades
│  │  ├─ rules.js       reglas de ICP/higiene y su acumulación por memo
│  │  ├─ leads.js       generación y clasificación de leads
│  │  ├─ arcade.js      simulación de Pipeline Panic (tick, colisión, combo)
│  │  ├─ battle.js      llamada por turnos: efectividad, RESIST, PAT
│  │  ├─ economy.js     cash, energía, cuota
│  │  ├─ upgrades.js    oferta de 3 cartas, compra y efectos
│  │  ├─ results.js     estadísticas del día y "error más común"
│  │  ├─ map.js         grid de tiles, colisiones, puertas
│  │  ├─ save.js        serialización / deserialización del estado
│  │  └─ game.js        estado global + máquina de escenas
│  ├─ data/         buyers.js, memos.js, cards.js, coach.js, map-layout.js
│  ├─ render/       sprites.js (personGrid, iconos, powers), world/*.js, desk/*.js
│  ├─ input/        teclado, táctil
│  └─ main.js       bucle requestAnimationFrame, monta escenas
└─ tests/
   ├─ core/         *.test.js (uno por módulo de core)
   └─ e2e/          smoke.spec.js
```

## Decisiones clave

1. **Núcleo sin DOM.** `core/` no importa nada de `render/` ni toca `window`. Las escenas reciben `(state, input, dt)` y devuelven nuevo estado. Esto permite TDD real.
2. **Paso fijo de simulación** (1/60 s) para el arcade; el render interpola. Determinismo garantizado con RNG con semilla.
3. **Paleta como módulo.** `palette.js` exporta los 8 tokens y la rampa de piel; un test falla si cualquier módulo de render usa un hex que no esté en la paleta (test de "lint de color").
4. **Sprites del art bible reutilizados.** `personGrid` e íconos se portan casi tal cual a `render/sprites.js`, separando la generación de la cuadrícula (testeable) del pintado.
5. **Datos declarativos.** Compradores, memos, cartas y líneas del coach son objetos planos validados por un test de esquema.
6. **Escalado entero.** El canvas lógico es 320×224; se escala ×2/×3/×4 según viewport para mantener píxeles nítidos.
7. **Accesibilidad.** `reducedMotion` se lee una vez y viaja en el estado; el render lo consulta para omitir shake/flash.

## Modelo de datos (resumen)

```js
GameState = {
  seed, day, clock /* minutos desde 09:00 */, scene,
  cash, energy, quota,
  rules: Rule[],            // acumuladas por memos
  upgrades: UpgradeId[],
  pipeline: Lead[],         // leads atrapados por llamar
  dayLog: Event[],          // para resultados
  player: { tx, ty, facing }
}
Lead   = { id, kind, size, industry, email: 'ok'|'bounced', dupe, buyerType, revealed }
Battle = { lead, resist, maxResist, patience, turn, log }
```

## Fórmulas iniciales (ajustables)

- Daño a RESIST: efectivo = 18, neutro = 6, inefectivo = 0 y −1 PAT. Intent signal: +6 en el primer turno.
- RESIST inicial según tamaño: pequeño 30, medio 48, grande 72.
- Premio por trato: pequeño $4K, medio $8K, grande $15K.
- Energía: 100; cada llamada −20.

## Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| Balance aburrido o injusto | Fórmulas en un único módulo + test de simulación de "bot óptimo" que debe alcanzar la cuota y "bot aleatorio" que no |
| Fuentes pixel tardan en cargar | `document.fonts.ready` antes del primer frame + fallback monospace |
| Parecido excesivo a Pokémon | Checklist de la guía revisada en cada PR; layouts de batalla propios (tarjeta del art bible) |
| Uso de marca Apollo | `BRAND_MODE=false`; texto "the platform" |

## Estrategia de pruebas

- **Unitarias (TDD):** todo `core/` y `data/` (esquemas). Rojo → Verde → Refactor por tarea.
- **Simulación:** partidas completas con bots y semillas fijas.
- **E2E humo:** Playwright abre `index.html`, navega título → mapa → arcade → llamada → resultados.
- **Visual manual:** comparar capturas contra `docs/art-bible.html`.
