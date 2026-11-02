# Contexto para retomar el trabajo (Colores Ruidosos)

> Última actualización: 2 nov 2026. Pega este archivo, o su ruta, al empezar una sesión nueva.

## Quién y cómo trabajamos
- **Cliente:** Colores Ruidosos (@coloresruidosos), medio musical que hace reels de Instagram y una web. Escribe en español.
- **Metodología obligatoria:** Spec-Driven Development (Dominicode, Bezael Pérez). Antes de programar algo nuevo se escriben o actualizan `spec.md` (Visión, Usuarios, Funcionalidades, Flujos, Arquitectura, NFR), `plan.md` y `tasks.md`, en orden TDD (test primero).
- **Veracidad:** datos **«mil por ciento confirmados»**. Todo dato en pantalla lleva su fuente y no se inventa nada. Lo no verificado se marca ⚠️ y se pregunta.
- **Legal y ética (decidido):**
  - Ni música ni **letras** de artistas sin licencia: chiptunes originales hechos por código.
  - Las portadas se evocan, no se copian.
  - Nada de nombres, logos ni sprites de terceros (Nintendo, Neo Geo, *Spin Master*, Jason, Freddy, Pinhead).
  - Rótulo «homenaje no oficial».
  - Prensa siempre genérica, sin medios ni periodistas reales.
  - No convertir trastornos mentales en enemigos.
  - Temas sensibles (feminicidio): memorial sin violencia ni puntos, y sin nombres de víctimas sin consentimiento de su familia.

## Repositorio
- **Repo:** `edgaralrohe/awesome-opus5-5-videos`, **rama** `ccr-70ec02ed-h3g6xs` (todo subido; sin PR).
- **Stack:** HTML + Canvas 2D + ES modules · Node 22 (`node --test`) · Playwright (Chromium preinstalado; en ESM: `createRequire(import.meta.url)('playwright')`) · ffmpeg · Python 3 con PIL y numpy (sin scipy).
- **Red:** bloquea la mayoría de webs; se verifica con búsqueda web.

---

## 1. `projects/viva-belgrado-guadalquivir/` — vídeos (terminados)
| Comando | Pieza | Estado |
|---|---|---|
| `npm run render` | **«Fluye»**: 30 s, 9:16, dibujo animado a lápiz con la identidad del disco de Viva Belgrado *Mientras el Guadalquivir fluye y fluye y fluye* (arte de Josu Larrea) | ✅ |
| `npm run render:reel` | **Reel de reseña de CR**: 80 s, 34 tarjetas al pulso (120 bpm), escena 4 «Lo que la banda dice», tema CR **provisional**, nota 9/10 | ✅ (falta marca real de CR, portada en alta resolución y BPM real) |
| `npm run render:noche` | **«No es una canción de Halloween»** (José Madero, «Noche de brujas»), 36 s | ✅ publicado el 31/10 |
| `npm run render:cabanas` | **«8 cabañas»**: discografía de Madero en 8 bits estilo NES, 67 s, con chiptune original | ✅ |

Specs en `specs/`, `specs/reel/`, `specs/noche/` y `specs/cabanas/`. El MP4 sale en `out/` (no se versiona).

---

## 2. `projects/super-pepe/` — juego «MÉXICO VS. JOSÉ MADERO» (en curso)

### Estado
- **Spec v5:** `specs/spec.md` (+ `plan.md`, `tasks.md`); el Mundo 1 está en §3.0d. Referencias en `specs/referencias/`.
- **v0.3 · Mundo 1 «Carmesí» jugable:** `dist/mexico-vs-jose-madero.html`, un archivo de unos 216 KB que funciona sin servidor y en el móvil.
  - Niveles 1-1 Calle Carmesí → 1-2 Azoteas → 1-3 El Teatro (jefe) → tarjeta «¿Sabías que…?» (Carmesí, Wikipedia) → fin.
  - `npm test`: 64 tests (física, micro, ritmo, Ovación, power-ups, enemigos, jefe, bots que completan 1-1, 1-2 y vencen al jefe, y pruebas en navegador).
  - `npm run dev`: servidor en :5174.
  - `npm run build`: genera el archivo único.
- **Motor propio:**
  - `src/engine/`: tilemap de texto, física, cámara y botones.
  - `src/game/`: lógica; constantes de ajuste en `constants.js` (`P`, `MIC`, `ENEMY`).
  - `src/render/`: dibujo y fuente 5×7.
  - `src/audio/`: chiptune y efectos originales.
  - Paso fijo de 60 Hz, resolución 320×224.
- **Niveles:** `src/data/world1.js` (generado una vez con `scripts/levels_world1.py`; el texto es la fuente). El antiguo nivel de prueba `src/data/level1.js` sigue para los tests. Leyenda: `#` sólido, `=` semisólido, `^` pinchos, `H` gancho, `*` pieza, `P` Pepe, `T` Titular, `F` Paparazzi, `R` Reportero, `C` checkpoint, `G` puerta; v5: `V` Rumor Volador, `M` Micrófono Traidor, `B` jefe, `A` Amplificador, `+` Carta de fan.
- **v5 · Ritmo:** velocidad 165 px/s, impulso al soltar el gancho, parón de impacto (4 fotogramas), combo (2 s) × 100 puntos, cronómetro. **Ovación** (barra) → **Solo de guitarra** (C / ★ / Y): vence a todo en pantalla y quita 1 golpe al jefe. **Amplificador** (micro ×2, 10 s) y **Carta de fan** (+1 corazón). IA en `src/game/enemies.js`, jefe en `src/game/boss.js`, fondos por código en `src/render/themes.js`.
- **Mecánica:** salto variable con *coyote time* y *jump buffer*. Micrófono con cable que golpea y se engancha a ganchos, con asistencia de puntería que sigue al gancho. Caja de colisión de Pepe 14×40; mano a 29 px del suelo.

### Arte
- **Pepe:** hoja oficial de CR (`art/source/pepe-sheet.jpg`, 29 poses).
- **Pipeline** `scripts/slice_sheet.py <hoja> <nombre> <altura> <filas> <anims> [cortes]`:
  - Quita el fondo liso y separa las poses por componentes conectados.
  - Une los efectos a su pose y reduce con una paleta de 48 colores.
  - Ancla en los pies y escribe `src/data/<nombre>-atlas.js`.
- **Enemigos provisionales** (SVG → pipeline): Titular, Paparazzi (el flash congela 0,6 s) y Reportero (embiste).
- **Arte final con Gemini:** prompts en **`art/PROMPTS-GEMINI.md`** (bloque de estilo, plantillas, enemigos, jefes, objetos, poses extra de Pepe, fondos por capas y bloques). Reglas: fondo gris liso #474747 (o magenta #FF00FF en las capas de fondo), sin texto, sin marcos, sin sombras, mirando a la derecha y con las poses separadas.
- **v5 · Conceptos de Carmesí** rescatados de Gemini en `art/source/carmesi/` (jefe y enemigos, teatro, calle, azoteas). Ya **sustituidos** por las hojas definitivas (ver v5b). Los fondos se dibujan por código tomándolos como referencia (Gemini ya no se usa para escenarios).
- **v5b · Arte de Gemini ya en el juego (2 nov):** jefe Flash-Bot (12 poses: andar 4, cargar 2, disparar 1, expuesto 2, daño 1, derrota 2), Rumor Volador (6) y prensa (Titular, Paparazzi y Reportero: espera, caminar, ataque, daño y derrota). Se limpian con `scripts/compose_frames.py <flashbot|rumor|prensa>` (quita rótulos, líneas de suelo y sombras) → `slice_sheet.py`. En la hoja del jefe, CARGAR y DISPARAR salen **sin patas** (se «planta» para disparar). **Micrófono Traidor** (9 poses: flotar 4, apuntar 1, embestida 2, derrota 2) también, desde una captura de pantalla: `compose_frames.py traidor` (rellena huecos y compone sobre magenta) → `SLICE_BY_GAP=1 slice_sheet.py … traidor 34 9 …`. Trajes de Pepe en `art/source/pepe-trajes-1.jpg` y `-2.png`: ⏳ pendiente decidir para qué son.
- **Borrador de Gemini de la hoja de prensa** (Documento / Paparazzi / Reportero): `art/source/prensa-gemini-borrador.png`. El estilo está aprobado, pero hay que regenerarla sin rótulos ni sombras, **un personaje por imagen**. Trae poses de Daño separadas de Derrota, que hay que aprovechar.

### Decisiones tomadas
- **Título** «MÉXICO VS. JOSÉ MADERO» (de la playera oficial). **Sello JMV = José Madero Vizcaíno** (confirmado), diseño propio.
- Estética **16 bits estilo Neo Geo / *Spin Master***. Arma: **micrófono con cable**.
- **Historia:** Pepe tiene que «recordar quién es» antes de su concierto en la **Arena Ciudad de México**, mientras le persigue la prensa. **Hub: el Museo**, inspirado en el museo real de 2026.
- **Enemigos recurrentes de prensa** genéricos. Los Titulares gritan titulares genéricos («¡EXCLUSIVA!», «¡POLÉMICA!», «¡ÚLTIMA HORA!»), sin insultos; al vencer a un **Titular** aparece una frase verificada de Madero.
- **Logo de Colores Ruidosos:** el de los conceptos de Gemini es el real (✅ 2 nov), pero falta el **archivo original** para meterlo en el juego; de momento hay un cartel con el nombre en las Azoteas.
- **Jefe intermedio:** Rueda de Prensa. **Final:** pantalla VS «México vs. José Madero» en concierto; la barra es el cariño del público y la música es original.
- **Mundos:** Carmesí (2016, rojo) · Noche (2017, negro / B y N) · Alba (2018, blanco) · Psalmos (2019, azul) · Giallo (2022, amarillo) · Aurora EP (2023, naranja óxido) · Sarajevo (2024, lila) · Querido… (3 sep 2026, verde).
- **v4 · Paseos reflexivos:** ✅ ***Alba* y *Aurora*** (sin enemigos ni daño, con pasajes y un momento final). *Querido…* es **acción normal**. Pasajes de letras **solo con licencia**; mientras tanto, título de la canción y una reflexión de CR o una cita verificada.
- **v4 · Memorial «Luciérnagas»** (cierre de *Sarajevo*, después del jefe; también accesible desde el Museo):
  - Mecánica: «alzar la voz»; Pepe canta y enciende luciérnagas mientras la calle se ilumina.
  - Sin combate, puntos ni derrota; sin violencia ni víctimas representadas.
  - Aviso previo con opción de saltarlo; recursos de ayuda verificados ⚠️.
  - Dedicatoria con nombres solo con consentimiento de la familia.
  - La luciérnaga **ya no es power-up**: en los niveles oscuros la luz es un **farol**.

### Jefes (spec §3.3 v4/v5) — ⏳ el usuario revisa los de los mundos 2–8
| Mundo | Propuesta actual |
|---|---|
| Carmesí | ✅ **Cámara Flash-Bot** («La Prensa Rosa»): camina → carga → rayo bajo/alto → lente expuesto; 6 golpes, uno por apertura; fase 2 con 3 o menos; se deshace en pétalos → Disco de Oro |
| Noche | El Enmascarado del Lago (arquetipo propio); al vencerlo se quita la máscara |
| Alba (paseo) | La Nostalgia: momento final, se supera siguiendo adelante |
| Psalmos | La Sombra (lado oscuro de Peter Pan) |
| Giallo | El Maniquí en Llamas (ataca si le das la espalda) |
| Aurora (paseo) | Momento final ⚠️ por definir |
| Sarajevo | El Rey Ahogado (bajo el agua) → memorial «Luciérnagas» |
| Querido… (acción) | Los Dos Pierrots ⚠️ en revisión. Recomendación: no castigar al que llora |
| Intermedio / Final / Secreto | Rueda de Prensa / VS en la Arena / La Bestia |

---

## Pendiente con el usuario
1. **Probar el Mundo 1** y dar feedback (velocidad, jefe, Ovación, duración de los niveles: ahora rondan 1 min).
1b. **Revisión de los jefes** de los mundos 2–8 y el **momento final de *Aurora***.
2. **Imágenes de Gemini (solo personajes, un personaje por imagen, de lado, sin texto ni sombras):** Flash-Bot de perfil (andar, carga, rayo, expuesto, daño), Rumor Volador y Micrófono Traidor con 2–3 fotogramas por animación, prensa limpia (3) → Noche → poses extra de Pepe. Archivo del logo de CR.
3. **Feedback del prototipo** (salto, micro, ritmo del Paparazzi y el Reportero): se ajusta en `constants.js`.
4. **Fecha y enlace del concierto en la Arena CDMX** (no aparecen en fuentes públicas).
5. **Escribir al equipo de Madero:** visto bueno al juego, **licencia de letras y música** y **consentimiento de la familia** para la dedicatoria del memorial.
6. Alcance: piloto de 2 mundos (Carmesí + Noche, recomendado) o los 8. ¿Panda/PXNDX como mundo 0?
7. Marca real de Colores Ruidosos (logo y colores) para el reel y los cierres.
8. ¿Publicar el juego como enlace privado? Usa el nombre de un artista real: decide el usuario.
9. Antes de publicar el memorial: verificar teléfonos de ayuda en fuentes oficiales y, si se usan cifras, que sean de SESNSP o INEGI.

**Hecho (2 nov, v0.3):** Mundo 1 «Carmesí» completo con TDD (spec §3.0d, tareas C1–C9). Además: **cinemática de entrada del jefe** (C11: bandas de cine, Pepe entra solo, el Flash-Bot cae del techo, cartel «JEFE · CÁMARA FLASH-BOT · «LA PRENSA ROSA»», «¡A ESCENA!»; saltable con A; cronómetro parado) y cámara que encuadra a Pepe y al jefe durante el combate.

**Siguiente tarea:** feedback del Mundo 1 → ajustes en `constants.js`; sustituir los sprites provisionales cuando lleguen las hojas laterales; después, **Mundo 2 «Noche»** con TDD.

~~Plan anterior del Mundo 1:~~
1. Recortar las hojas con `slice_sheet.py` (usar Daño y Derrota por separado).
2. Enemigos Lunes 28, Libro ruso y Espina, con sus tests.
3. Jefe La Rosa Carmesí como máquina de fases, con tests.
4. Nivel rojo con fondos por capas y bloques.
5. Tarjeta «¿Sabías que…?».
6. Ampliar el bot de repetición.

Seguir `specs/tasks.md`, fases 1.6 y 2.

---

## Datos verificados (con fuente) — José Madero
| Dato | Fuente |
|---|---|
| *Carmesí*: 29 abr 2016; Disco de Oro en 2016 (mes ⚠️ oct/nov); Artista Revelación monitorLATINO 2016; canciones de 2008–2010. **Corrección (2 nov):** «Lunes 28» fue el **adelanto** (0:00 del 29 feb 2016, tras el último concierto de Panda en la Arena CDMX), **no un sencillo**; primer sencillo «Plural siendo singular» (vídeo 8 abr 2016); también «Sinmigo» (vídeo 19 ago 2016) y «Literatura rusa». ❌ «La noche de la mesa triste» es de PXNDX (*Bonanza*, 2012), no de *Carmesí*: la Wikipedia EN se equivoca. Lista completa de datos de la época con fuentes: spec §3.0e (D1–D16) | Wikipedia EN/ES, CineMedios, El Siglo de Torreón |
| *Noche*: 2017; «Noche de brujas», primer sencillo (9 jun 2017), **no es de Halloween** (máscaras sociales); vídeo en B y N, homenaje al terror clásico | Wikipedia (Noche), Revista Kuadro, Milenio, Looking Back |
| Gira *Noche*: figuras de Jason, Freddy y Pinhead en el escenario; «Fantasmas» en el setlist | ABC Noticias, El Alebrije, Soulwavez |
| Es fan del terror y de Stephen King | Milenio, Looking Back |
| *Alba*: 16 mar 2018; «disco blanco», conceptual, *Oda a la nostalgia*, «el amanecer»; «Maldita Rueda» | Wikipedia (Alba), Looking Back, Apple Music |
| *Psalmos*: 6 sep 2019; adelantado por filtraciones; iba a tratar el lado oscuro de Peter Pan; «Codependientes» con Cami; n.º 1 en México; producido con Flip Tamez; portada: persona en posición fetal en una esquina | Wikipedia ES/EN, Intolerancia Diario, Informador; portada confirmada por el usuario |
| *Giallo*: 2022; amarillo + cine *giallo*; trata trastornos mentales; gira *Giallo Fantastique*, Auditorio Nacional el 10 jun 2022 | Grita Radio, Chilango, Entodomusic |
| *Aurora* (EP): 17 mar 2023; 6 canciones (Casanova, Nueva Inglaterra, Aplaudan en Silencio, Domingo de Ceniza, Posa y Sonríe, Tiempo Compartido) | Discogs, Spotify; usuario |
| *Sarajevo*: 2024 (fecha exacta ⚠️); «Rey Ahogado» con Lasso; «Luciérnaga» | Letras, Last.fm |
| **«Luciérnaga»**: sobre el feminicidio de Karen Rebeca Esquivel (19 años; Naucalpan, 2016); coescrita con su madre, Becky Espinosa; dedicada «a las mujeres que hoy no pueden alzar la voz». En un podcast Madero habló también del feminicidio de una seguidora, Prisma Lorena Villarreal | La Razón, Milenio, UnoTV, Diario de México, Revista Netas; El Heraldo de México |
| Estadio GNP Seguros, 24 ene 2026, «Érase una Bestia» (su primer estadio), con museo en una carpa | Chilango, Excélsior |
| Museo en Monterrey, 21 jul–21 ago 2026: más de 100 piezas, gratis, partitura original de «Plural siendo singular» | MVS Noticias, El Horizonte, Info7 |
| *Querido…*: 3 sep 2026; 7.º disco, 13 canciones, epistolar y medieval, sin sencillos; verde; portada con dos pierrots con perlas | CineMedios, El Sol de Sinaloa, Indie AM |
| Playera «México vs. José Madero» (merch) | Class Music |
| «En algún momento fui un pendejo, pero dejé atrás eso hace mucho tiempo» | La Razón, 10 dic 2024 |
| A su yo joven le diría que no fuera tan arrogante | Publimetro, 20 oct 2025 |
| ❌ **No verificado:** que llamara a las polémicas «sacadas de contexto»; la fecha del concierto en la Arena CDMX; el concepto de *Sarajevo* | — |

## Datos verificados — Viva Belgrado (reel)
- Quinto disco, 23 oct 2026, Fueled By Salmorejo; producido por Ricky Falkner; Alain Johannes en «Menquitofla»; 11 canciones.
- Titular de Mondo Sonoro: «Una de las responsabilidades de hacerse mayor es ser feliz».
- Presentación en Hiriko Soinuak (Barakaldo) el 23 oct; encuentros «Vernissage»; gira 2027.
- T13 y T14 son paráfrasis del usuario. «Primer disco con Jaime y Cris» y «casi mil copias en preventa» los aportó el usuario y no hay fuente pública que los confirme.
