# GTM Tycoon · Especificación (MVP v0.1)

> Estado: **BORRADOR PARA REVISIÓN**. No se escribe código hasta aprobar este documento.
> Fuentes: `docs/VISUAL.md` y `docs/art-bible.html` (dirección visual v1).
> Todo lo marcado con **[SUPUESTO]** lo inferí de la guía visual y necesita tu confirmación.

---

## 1. Visión

**Qué es.** Un juego web de navegador, pixel art de 8 bits, donde eres un representante de ventas nuevo y vives una jornada laboral comercial como si fuera un RPG ligero: atrapas leads, los llamas, cierras tratos y mejoras tu "sistema" día a día.

**Por qué existe.** Enseñar los fundamentos de go-to-market (ICP, calidad de datos, tipos de comprador, secuencias) jugando, no leyendo. Cada error del jugador corresponde a un error real de ventas (dato rebotado, lead fuera de ICP, hablarle al gatekeeper en vez del decisor).

**Promesa en una frase.** *"Run your day like a system, not a to-do list."*

**Éxito del MVP.**
- Una partida completa de **5 días** se juega de principio a fin en 15–25 minutos sin errores.
- El jugador entiende por qué perdió un trato (la pantalla de resultados nombra su error más común).
- Respeta al 100 % la guía visual (paleta de 8 colores, dos capas, tipografías, reglas Sí/No).

**Fuera de alcance (MVP).** Multijugador, cuentas/login, backend, monetización, marca real de Apollo (`BRAND_MODE=false`), audio, localización completa, editor de niveles, móvil nativo.

---

## 2. Usuarios

| Persona | Contexto | Lo que necesita |
|---|---|---|
| **SDR/AE en onboarding** (primario) | Primera semana en un equipo comercial | Aprender ICP, tipos de comprador y higiene de datos sin un curso aburrido |
| **Líder de ventas / enablement** | Quiere material de formación memorable | Partidas cortas, mensajes que reflejen buenas prácticas, resultados que pueda comentar |
| **Jugador casual curioso** | Llega por un enlace compartido | Entrar y jugar en < 10 s, sin instrucciones largas |

**Elenco del juego** (de la guía visual): Tú (gorra volt), Mariana (cofundadora, da los memos), Rival rep, y compradores: Lucía (CFO · `$ VISIONARY`), Diego (Head of IT · `# TECHNICAL`), Sofía (Ops · `+ OPERATOR`), Paola (Purchasing · `! GATEKEEPER`), Lead desconocido (`TYPE ???`).

---

## 3. Funcionalidades

Prioridad MoSCoW. Cada funcionalidad tiene criterios de aceptación verificables (Given/When/Then resumido).

### F1 · Ciclo del día — **Must**
Cada día sigue: **Memo matutino → Mapa → (Inbox Plaza / Client District / Gym) → Resultados → Carta de mejora → Memo del día siguiente.**
- Reloj de 09:00 a 18:00. Cada actividad consume tiempo: arcade = 1 h, llamada = 1 h, caminar = 0. **[SUPUESTO]**
- A las 18:00 el día termina automáticamente (si estás en una llamada, termina al acabarla).
- CA: dado el día 1 a las 17:30 en el mapa, cuando inicio una llamada, entonces al terminarla se abre la pantalla de resultados.

### F2 · Mapa hub (World layer) — **Must**
- Una pantalla de 20×14 tiles de 16 px dibujada ×2, como el mapa de la guía: OFFICE, INBOX PLAZA, CLIENTS, GYM, calles limestone.
- El jugador se mueve por tiles con flechas/WASD (y botones táctiles en pantalla). Colisión con edificios y árboles.
- Entrar por la puerta de un edificio dispara su actividad. Barra superior: `DAY n · hh:mm` + `N LEADS TO CALL`.
- Los leads atrapados aparecen como personas en CLIENTS con etiqueta de cargo (`CFO`, `OPS`…) o `?`.
- CA: dado que atrapé 3 leads, cuando vuelvo al mapa, entonces veo 3 personas en CLIENTS y la barra dice `3 LEADS TO CALL`.

### F3 · Pipeline Panic (arcade en Inbox Plaza) — **Must**
- Caen íconos de leads; el jugador mueve una bandeja izquierda/derecha durante 45 s. **[SUPUESTO]**
- Tipos: bolsa volt (bueno), banco/fábrica/hospital (fuera de ICP), diminuto (muy pequeño), gigante (muy grande), rebotado (insignia `!`), duplicado (copia fantasma), caja `?` (desconocido, se revela a media caída o con Enrich).
- Atrapar bueno: +1 lead y combo. Atrapar malo: rompe combo y pop-up de error (`TOO SMALL`, `BOUNCED`, `NOT ICP`, `DUPLICATE`). Un desconocido atrapado sin revelar entra como `TYPE ???`.
- Pop-ups de máx. 3 palabras en Press Start 2P (`DEAL SIGNED`, `x3 COMBO`).
- La "regla del memo" del día cambia qué cuenta como bueno (p. ej. "50 a 500 personas", "sin rebotados").
- CA: dada la regla "bounced leads are out", cuando atrapo un rebotado, entonces no suma lead, el combo vuelve a 0 y aparece `BOUNCED` en signal.

### F4 · Llamada (batalla por turnos en Client District) — **Must**
- Tarjeta de batalla: nombre, cargo, insignia de tipo, **RESIST** (barra) y **PAT** (paciencia, 5 pips).
- Cada turno eliges 1 de 4 enfoques **[SUPUESTO]**: `IMPACT` (números/ROI), `SPECS` (técnico), `WORKFLOW` (operativo), `ASK FOR MANAGER`.
- Efectividad por tipo: Visionary ← IMPACT, Technical ← SPECS, Operator ← WORKFLOW, Gatekeeper ← ASK FOR MANAGER (lo convierte en un decisor real). Efectivo = mucho daño a RESIST; neutro = poco; inefectivo = −1 PAT.
- RESIST en 0 → `DEAL SIGNED` (+cash según tamaño). PAT en 0 → dead end.
- El coach (VT323, una frase por caja) comenta cada turno con la voz de la guía.
- `TYPE ???`: no ves la insignia; Enrich la revela.
- CA: dado un Visionary con RESIST 48, cuando uso IMPACT, entonces RESIST baja más que con cualquier otro enfoque y el coach dice "Executives buy impact. Lead with the number."

### F5 · Resultados del día (Desk layer) — **Must**
- Documento sobre papel crema (Fraunces + Hanken): tratos cerrados, dead ends, cash ganado, **error más común** del día.
- CA: dado un día con 2 rebotados y 1 fuera de ICP, entonces dice "Your most common miss: bad data."

### F6 · Cartas de mejora (Platform powers) — **Must**
- Elegir 1 de 3 cartas al final del día; cuestan cash. Las raras tienen sombra volt.
- Powers: **Enrich** (revela desconocidos y tipos), **Intent signal** (leads listos brillan en el mapa = +daño primer turno), **Sequence** (un lead fallado vuelve), **CRM sync** (los leads no se pierden entre días), **ICP filter** (los leads fuera de ICP se desvanecen en el arcade).
- CA: dado que compré ICP filter, cuando juego el arcade, entonces los íconos fuera de ICP se dibujan con opacidad reducida.

### F7 · Memo matutino con nueva regla (Desk layer) — **Must**
- Mariana entrega un memo con sello `NEW RULE` que modifica el ICP o la higiene de datos del día. Reglas acumulativas.
- CA: el memo del día 3 introduce "bounced or duplicate leads are out" y esa regla aplica desde el día 4.

### F8 · Economía, energía y fin de partida — **Must**
- Cash inicial $10,000; cuota a los 5 días: $50,000. **[SUPUESTO]**
- Energía: baja con cada llamada; con 0 no puedes llamar ese día.
- Fin: al cerrar el día 5 → pantalla final (Desk) con "QUOTA HIT" o "QUOTA MISSED" y resumen de la semana.

### F9 · Rival rep — **Should**
- Aparece en la calle; si te alcanza, te reta a un "pitch-off" (llamada especial) y si pierdes te roba un lead.

### F10 · Gym (entrenamiento) — **Should**
- Llamadas de práctica sin costo de tiempo para aprender la tabla de efectividad.

### F11 · Guardado local — **Should**
- Autoguardado al terminar cada día (localStorage, con try/catch y fallback a partida sin guardado).

### F12 · Persona directory — **Could**
- Directorio en Desk layer con los compradores que conociste y su tipo.

### F13 · `BRAND_MODE` — **Could**
- Flag que cambia los íconos genéricos de powers por los de la marca. En el MVP queda en `false` y sin assets de marca.

---

## 4. Flujos

### 4.1 Flujo principal (una partida)
```
Título (Desk) ─▶ Memo día 1 ─▶ MAPA ◀───────────────┐
                                 │                  │
              ┌──────────────────┼───────────────┐  │
              ▼                  ▼               ▼  │
        INBOX PLAZA         CLIENTS            GYM  │
       Pipeline Panic    Llamada (batalla)  Práctica│
        +leads, −1h       +cash, −1h, −energía      │
              └──────────────────┴───────────────┴──┘
                                 │ 18:00
                                 ▼
               Resultados ─▶ Carta de mejora (1 de 3)
                                 │
                    día < 5 ─────┴───── día = 5
                       ▼                   ▼
               Memo día n+1         Pantalla final
```

### 4.2 Flujo de una llamada
1. El jugador toca a una persona en CLIENTS → transición en `steps()` a la batalla.
2. Coach: línea de apertura. Se muestra tarjeta (tipo visible o `???`).
3. Turno: elegir enfoque → cálculo de efectividad → animación de barra en pasos → línea del coach (correcta o error).
4. Repetir hasta RESIST = 0 (`DEAL SIGNED`) o PAT = 0 (dead end).
5. Volver al mapa; la persona desaparece de CLIENTS; reloj +1 h.

### 4.3 Flujos de error / borde
- Sin leads y visitas CLIENTS → diálogo: "No one to call. Go fill the pipeline."
- Cash insuficiente para todas las cartas → se puede saltar ("SKIP").
- Sin fuentes cargadas → fallback a monospace; el juego no se bloquea.
- Pestaña oculta → el juego se pausa.
- `prefers-reduced-motion` → sin sacudidas ni parpadeos; pop-ups estáticos.

---

## 5. Arquitectura (visión de alto nivel; detalle en `plan.md`)

- **Cliente puro, sin backend.** HTML + Canvas 2D + JavaScript (ES modules). Desplegable como sitio estático.
- **Separación estricta lógica / render:** el núcleo del juego (`core/`) es JavaScript puro, determinista (RNG con semilla) y 100 % testeable sin navegador. El render (`render/`) solo lee estado.
- **Máquina de escenas:** `title → memo → map → arcade | call | gym → results → upgrade → memo … → end`.
- **Sprites procedurales** a partir de cuadrículas (24×30 personajes, íconos por código), reutilizando el enfoque del art bible. Sin imágenes externas.
- **Dos capas visuales:** World en `<canvas>` con paleta de 8 tokens; Desk en DOM/CSS (Fraunces + Hanken) superpuesto.
- **Datos como contenido:** compradores, reglas de memo, cartas y líneas del coach en archivos de datos, no en el código.

---

## 6. Requisitos no funcionales (NFRs)

| # | Categoría | Requisito |
|---|---|---|
| N1 | Rendimiento | 60 fps estables en el arcade en un portátil medio; carga inicial < 2 s, peso total < 500 KB sin fuentes |
| N2 | Compatibilidad | Últimas 2 versiones de Chrome, Firefox, Safari; usable en móvil vertical ≥ 360 px con controles táctiles |
| N3 | Accesibilidad | Todo color va con forma o palabra; contraste AA en texto; teclado completo; `prefers-reduced-motion` respetado; volt nunca como texto sobre marble |
| N4 | Fidelidad visual | Solo los 8 tokens + rampa de piel; sin gradientes ni sombras suaves; sombras duras de 4 px; `image-rendering: pixelated` |
| N5 | Legal / marca | Sin nombres, criaturas, sonidos ni layouts de Pokémon; sin logo ni capturas de Apollo; todos los datos ficticios |
| N6 | Calidad | Cobertura ≥ 90 % en `core/`; todo el núcleo desarrollado con TDD; lint sin errores |
| N7 | Determinismo | Con la misma semilla, la misma partida produce el mismo resultado (habilita tests y depuración) |
| N8 | Mantenibilidad | Agregar un comprador, regla o carta = editar un archivo de datos, sin tocar lógica |
| N9 | Privacidad | Sin analítica ni llamadas de red en el MVP |

---

## Preguntas abiertas (necesito tu respuesta)

1. **Idioma del juego:** la guía está en español pero las líneas del juego en inglés. ¿Juego en inglés, español o ambos?
2. **Mecánica del arcade:** ¿bandeja que atrapa (propuesta) o hacer clic/tap en los leads buenos?
3. **Batalla:** ¿te convencen los 4 enfoques (IMPACT / SPECS / WORKFLOW / ASK FOR MANAGER)?
4. **Duración y cuota:** ¿5 días y $50K está bien?
5. **Alcance:** ¿Rival y Gym entran en el MVP o los dejamos para v0.2?
6. **Ubicación:** este repo es una lista de videos. ¿Seguimos en `gtm-tycoon/` aquí o prefieres un repo propio?
