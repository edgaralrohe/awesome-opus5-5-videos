# GTM Tycoon · Tareas (TDD)

> Orden pensado para TDD: cada tarea de lógica empieza con el test en **ROJO**, luego **VERDE** con el mínimo código y luego **REFACTOR**.
> `[ ]` pendiente · `[x]` hecha. Dependencias entre paréntesis.

## Fase 0 · Andamiaje
- [ ] **T0.1** Crear proyecto Vite + Vitest + ESLint + Prettier en `gtm-tycoon/`; script `npm test` y `npm run dev`.
- [ ] **T0.2** Test trivial que pasa (verifica el pipeline de tests). CI local: `npm test && npm run lint`.

## Fase 1 · Fundamentos del núcleo
- [ ] **T1.1 RNG con semilla** — ROJO: misma semilla ⇒ misma secuencia; semillas distintas ⇒ secuencias distintas; valores en [0,1). VERDE: mulberry32.
- [ ] **T1.2 Paleta** — ROJO: exporta exactamente 8 tokens + 3 tonos de piel con los hex de `VISUAL.md`. VERDE: `palette.js`.
- [ ] **T1.3 Reloj** — ROJO: inicia 09:00; `spend(60)` avanza 1 h; `isOver()` a las 18:00; formatea `09:40 AM`. (T1.1)
- [ ] **T1.4 Economía** — ROJO: cash inicial 10 000; `earn`, `spend` no permite negativo; energía −20 por llamada; `canCall()` falso con 0.

## Fase 2 · Leads y reglas
- [ ] **T2.1 Clasificación de leads** — ROJO: tabla de casos (bolsa ok ⇒ good; banco ⇒ NOT_ICP; diminuto ⇒ TOO_SMALL; gigante ⇒ TOO_BIG; rebotado ⇒ BOUNCED; duplicado ⇒ DUPLICATE; desconocido ⇒ UNKNOWN).
- [ ] **T2.2 Reglas acumulativas** — ROJO: sin reglas, rebotado es aceptado; tras regla "no bounced" es rechazado; regla "50–500 personas" rechaza tamaños fuera. (T2.1)
- [ ] **T2.3 Generador de oleadas** — ROJO: con semilla fija genera N leads; la proporción de buenos está entre 35–55 %. (T1.1)
- [ ] **T2.4 Esquema de datos** — ROJO: `buyers`, `memos`, `cards`, `coach` cumplen esquema (campos, tipos, líneas ≤ 1 frase, pop-ups ≤ 3 palabras).

## Fase 3 · Pipeline Panic (simulación)
- [ ] **T3.1 Física de caída** — ROJO: tras `tick(dt)` el lead baja `speed*dt`; sale de pantalla ⇒ se descarta como "missed".
- [ ] **T3.2 Bandeja y colisión** — ROJO: lead que intersecta la bandeja ⇒ atrapado; bandeja no sale de los límites.
- [ ] **T3.3 Combo y pop-ups** — ROJO: 3 buenos seguidos ⇒ `x3 COMBO`; malo ⇒ combo 0 y pop-up con el motivo. (T2.2)
- [ ] **T3.4 Revelado de desconocidos** — ROJO: se revela al cruzar la mitad; con Enrich se revela al aparecer.
- [ ] **T3.5 Fin de ronda** — ROJO: a los 45 s termina, devuelve leads atrapados y log de errores; reloj +1 h. (T1.3)

## Fase 4 · Llamada (batalla)
- [ ] **T4.1 Inicio** — ROJO: RESIST según tamaño (30/48/72); PAT = 5; tipo oculto si `TYPE ???`.
- [ ] **T4.2 Tabla de efectividad** — ROJO: matriz 4×4 tipo/enfoque ⇒ efectivo 18, neutro 6, inefectivo −1 PAT.
- [ ] **T4.3 Gatekeeper** — ROJO: `ASK FOR MANAGER` contra gatekeeper lo convierte en otro tipo con RESIST completo.
- [ ] **T4.4 Desenlace** — ROJO: RESIST 0 ⇒ `DEAL SIGNED` + premio; PAT 0 ⇒ dead end; reloj +1 h; energía −20. (T1.3, T1.4)
- [ ] **T4.5 Coach** — ROJO: devuelve la línea correcta según resultado del turno y tipo.

## Fase 5 · Fin de día, cartas y memos
- [ ] **T5.1 Resultados** — ROJO: cuenta tratos, dead ends, cash; "error más común" mapea BOUNCED/DUPLICATE ⇒ "bad data", NOT_ICP/TOO_* ⇒ "wrong fit", PAT ⇒ "wrong pitch".
- [ ] **T5.2 Oferta de cartas** — ROJO: 3 cartas distintas, no repite las ya compradas, al menos 1 común; misma semilla ⇒ misma oferta.
- [ ] **T5.3 Efectos de cartas** — ROJO: ICP filter marca no-ICP como `faded`; Sequence devuelve 1 lead fallado; CRM sync conserva pipeline entre días; Intent +6 primer turno.
- [ ] **T5.4 Memos** — ROJO: memo del día n agrega su regla al estado al iniciar el día n+1.
- [ ] **T5.5 Fin de partida** — ROJO: tras el día 5, `QUOTA HIT` si cash ≥ 50 000, si no `QUOTA MISSED`.

## Fase 6 · Mapa y máquina de escenas
- [ ] **T6.1 Grid del mapa** — ROJO: layout 20×14; edificios y árboles bloquean; calles caminables; puertas disparan escena.
- [ ] **T6.2 Movimiento** — ROJO: mover a un tile bloqueado no cambia posición.
- [ ] **T6.3 Máquina de escenas** — ROJO: transiciones válidas del flujo 4.1; transición inválida lanza error.
- [ ] **T6.4 Guardado** — ROJO: `load(save(state))` es igual a `state`; storage que lanza ⇒ juego sigue sin guardar.
- [ ] **T6.5 Simulación de balance** — ROJO: bot óptimo alcanza la cuota con 10 semillas; bot aleatorio no la alcanza en ≥ 8 de 10.

## Fase 7 · Render y entrada (verificación visual + E2E)
- [ ] **T7.1 Sprites** — ROJO: `personGrid` produce 30×24 con contorno; test "lint de color" sobre los colores usados. Portar desde el art bible.
- [ ] **T7.2 World: mapa + HUD + diálogo** (canvas, escalado entero).
- [ ] **T7.3 World: arcade** con pop-ups en steps.
- [ ] **T7.4 World: tarjeta de batalla y menú de enfoques.**
- [ ] **T7.5 Desk: título, memo con sello, resultados, cartas, pantalla final.**
- [ ] **T7.6 Entrada:** teclado (flechas/WASD/Enter/Esc) y controles táctiles.
- [ ] **T7.7 Reduced motion y pausa** al ocultar pestaña.
- [ ] **T7.8 E2E humo (Playwright):** título → mapa → arcade → llamada → resultados sin errores de consola.

## Fase 8 · Cierre del MVP
- [ ] **T8.1** Revisión contra la checklist Sí/No de la guía visual.
- [ ] **T8.2** Auditoría de contraste y teclado.
- [ ] **T8.3** `README` de `gtm-tycoon/` con cómo jugar y cómo correr tests.

## Should / Could (después del MVP)
- [ ] Rival rep (F9) · Gym (F10) · Persona directory (F12) · `BRAND_MODE` (F13)
