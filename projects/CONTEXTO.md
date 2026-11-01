# Contexto para retomar el trabajo (Colores Ruidosos)

> Última actualización: 1 nov 2026 (sprites oficiales y enemigos nuevos). Pega este archivo, o su ruta, al empezar una sesión nueva.

## Quién y cómo trabajamos
- **Cliente:** Colores Ruidosos (@coloresruidosos), medio musical que hace reels de Instagram y una web. Escribe en español.
- **Metodología obligatoria:** Spec-Driven Development (Dominicode, Bezael Pérez). Antes de programar cualquier cosa nueva se escriben `spec.md` (6 secciones: Visión, Usuarios, Funcionalidades, Flujos, Arquitectura, NFR), `plan.md` y `tasks.md` (orden TDD: test primero).
- **Veracidad:** el usuario quiere datos **«mil por ciento confirmados»**. Todo dato en pantalla lleva su fuente y no se inventa nada. Si algo no se puede verificar, se marca ⚠️ y se pregunta.
- **Legal (decidido):**
  - No usar música grabada ni composiciones de los artistas sin licencia: solo chiptunes originales hechos por código.
  - No copiar portadas: se evocan.
  - No usar nombres, logos ni sprites de terceros (Nintendo, Neo Geo, Jason, Freddy, Pinhead).
  - Rótulo «homenaje no oficial».
  - Prensa siempre genérica, sin medios ni periodistas reales.
  - No convertir trastornos mentales en enemigos.

## Repositorio
- **Repo:** `edgaralrohe/awesome-opus5-5-videos`
- **Rama de trabajo:** `ccr-70ec02ed-h3g6xs` (todo está subido ahí; sin PR).
- **Stack común:** HTML + Canvas 2D + ES modules, Node 22 (`node --test`), Playwright (Chromium preinstalado; en ESM se carga con `createRequire(import.meta.url)('playwright')`) y ffmpeg para exportar MP4.
- **Red del entorno:** bloquea la mayoría de webs (Bandcamp, medios). Se verifica con búsqueda web.

## Proyectos terminados

### 1. `projects/viva-belgrado-guadalquivir/` — 4 composiciones de vídeo
| Comando | Pieza | Estado |
|---|---|---|
| `npm run render` | **«Fluye»**: 30 s, 9:16, dibujo animado a lápiz con la identidad del disco de Viva Belgrado *Mientras el Guadalquivir fluye y fluye y fluye* (arte de Josu Larrea) | ✅ |
| `npm run render:reel` | **Reel de reseña de Colores Ruidosos**: 80 s, 34 tarjetas al pulso (120 bpm), escena 4 «Lo que la banda dice» (Mondo Sonoro + gira), tema CR **provisional**, 9/10 | ✅ (falta marca real de CR, portada en alta resolución y BPM real) |
| `npm run render:noche` | **«No es una canción de Halloween»** (José Madero, «Noche de brujas»): 36 s, fiesta de disfraces | ✅ publicado el 31/10 |
| `npm run render:cabanas` | **«8 cabañas»**: discografía de Madero en 8 bits estilo NES, 67 s, con chiptune original incrustado | ✅ |

Specs en `specs/`, `specs/reel/`, `specs/noche/` y `specs/cabanas/`. Más de 50 tests. El MP4 sale en `out/` (no se versiona).

### 2. `projects/super-pepe/` — juego «MÉXICO VS. JOSÉ MADERO» (en curso)
- **Spec v2:** `specs/spec.md`, `plan.md`, `tasks.md`. Referencias en `specs/referencias/` (dibujo de Pepe hecho por CR, captura de *Spin Master* y la playera).
- **Prototipo v0.2 jugable:** `dist/mexico-vs-jose-madero.html`, un solo archivo de unos 157 KB que funciona sin servidor y en el móvil. `npm test` pasa 27 tests (física, micrófono, enemigos, atlas, un bot que completa el nivel y pruebas en navegador). `npm run dev` lo sirve en :5174 y `npm run build` genera el archivo único.
- **Arte v3:**
  - Pepe usa la **hoja oficial de CR** (`art/source/pepe-sheet.jpg`, 29 poses).
  - `scripts/slice_sheet.py` recorta cualquier hoja sobre fondo liso: genera un atlas de 48 px con paleta de 48 colores, ancla en los pies y el resultado en `src/data/<nombre>-atlas.js`.
  - Enemigos *chibi* provisionales en SVG (`scripts/enemies-svg.mjs` → `art/source/enemies-sheet.png` → `enemies-atlas.js`): **Titular** (`T`), **Paparazzi** (`F`, el flash congela 0,6 s) y **Reportero** (`R`, embiste).
  - El brief para el arte final de enemigos está en `art/BRIEF-enemigos.md`.
  - Caja de colisión de Pepe: 14×40; mano a 29 px del suelo; el micro apunta y sigue al gancho elegido (asistencia de puntería).
- **Motor propio:**
  - `src/engine/`: tilemap de texto, física, cámara y botones.
  - `src/game/`: lógica del juego y constantes de ajuste en `constants.js`.
  - `src/render/`: el sprite de Pepe se construye con formas en `sprites.js`.
  - `src/audio/`: música y efectos.
  - Paso fijo de 60 Hz y resolución lógica de 320×224.
- **Decisiones tomadas:**
  - Título «MÉXICO VS. JOSÉ MADERO» (de la playera oficial).
  - Sello **JMV = José Madero Vizcaíno**, diseño propio, no el óvalo de Nintendo.
  - Estética 16 bits estilo Neo Geo / *Spin Master*.
  - Arma: **micrófono con cable**, como el yoyó de *Spin Master*.
  - Mismos controles en todo el juego, con un giro de jugabilidad por mundo.
  - Hub: **el Museo**.
  - Enemigos recurrentes de prensa (Titular, Paparazzi, Micrófono de reportero).
  - Jefe intermedio: Rueda de Prensa.
  - **Final: pantalla VS «México vs. José Madero»** en concierto. La barra mide el cariño del público, no la vida. Es un preludio a su concierto en la Arena CDMX.
  - Historia: Pepe tiene que «recordar quién es».
- **Mundos:** Carmesí (2016, rojo) · Noche (2017, negro / B y N) · Alba (2018, blanco) · Psalmos (2019, azul) · Giallo (2022, amarillo) · Aurora EP (2023, naranja óxido) · Sarajevo (2024, lila) · Querido… (3 sep 2026, verde). Enemigos, jefes y power-ups en la spec, §3.2–3.4.

## Pendiente con el usuario
1. **Feedback del prototipo** (sensación de salto y del micrófono). Ajustar `src/game/constants.js` → `P` y `MIC`.
2. **Fecha y enlace del concierto en la Arena Ciudad de México.** No aparece en fuentes públicas: pedírselo al usuario.
3. Alcance: piloto de 2 mundos (Carmesí + Noche, recomendado) o los 8.
4. ¿Panda/PXNDX como mundo 0? ¿Contactar con el equipo de Madero (permiso, licencia de música)?
5. Aprobar o cambiar la lista de enemigos y jefes.
6. Marca real de Colores Ruidosos (logo y colores) para sustituir el tema provisional del reel y del cierre.
7. ¿Publicar el juego como enlace privado? (Usa el nombre de un artista real: que decida el usuario.)

8. Arte final de los enemigos según `art/BRIEF-enemigos.md` (opcional: los provisionales funcionan).

**Siguiente tarea natural:** con el feedback, construir el **Mundo 1 «Carmesí»**: nivel rojo; enemigos Lunes 28, Libro ruso y Espina; jefe **La Rosa Carmesí**, que suelta el **Disco de Oro**; tarjeta «¿Sabías que…?». Seguir `specs/tasks.md`, fase 2 (J1–J8), con TDD.

## Datos verificados (con fuente) — José Madero
| Dato | Fuente |
|---|---|
| *Carmesí*: 29 abr 2016; Disco de Oro en nov. 2016 (30 000 copias); Artista Revelación monitorLATINO 2016; muchas canciones escritas entre 2008 y 2010; sencillos «Lunes 28», «Plural siendo singular», «Literatura rusa» | Wikipedia (Carmesí) |
| *Noche*: 2017; «Noche de brujas», primer sencillo (9 jun 2017), **no es de Halloween** (habla de máscaras sociales); vídeo en B y N como homenaje al terror clásico | Wikipedia (Noche), Revista Kuadro, Milenio, Looking Back |
| Gira *Noche*: figuras de Jason, Freddy y Pinhead en el escenario; «Fantasmas» en el setlist | ABC Noticias, El Alebrije, Soulwavez |
| Es fan del terror y de Stephen King | Milenio, Looking Back |
| *Alba*: 16 mar 2018; «disco blanco», conceptual, *Oda a la nostalgia*, «el amanecer»; tema «Maldita Rueda» | Wikipedia (Alba), Looking Back, Apple Music |
| *Psalmos*: 6 sep 2019; se adelantó por filtraciones; al principio iba a tratar el lado oscuro de Peter Pan; «Codependientes» con Cami; n.º 1 en México; producido con Flip Tamez; portada: persona en posición fetal en una esquina | Wikipedia ES/EN, Intolerancia Diario, Informador; portada confirmada por el usuario |
| *Giallo*: 2022; amarillo + cine *giallo*; trata trastornos mentales; gira *Giallo Fantastique*, Auditorio Nacional el 10 jun 2022 | Grita Radio, Chilango, Entodomusic |
| *Aurora* (EP): 17 mar 2023; 6 canciones (Casanova, Nueva Inglaterra, Aplaudan en Silencio, Domingo de Ceniza, Posa y Sonríe, Tiempo Compartido) | Discogs, Spotify; confirmado por el usuario |
| *Sarajevo*: 2024 (la fecha exacta varía según la fuente ⚠️); «Rey Ahogado» con Lasso, «Luciérnaga» | Letras, Last.fm |
| Estadio GNP Seguros, 24 ene 2026, «Érase una Bestia» (su primer estadio), con museo en una carpa | Chilango, Excélsior |
| Museo en Monterrey, 21 jul–21 ago 2026: más de 100 piezas, gratis, partitura original de «Plural siendo singular» | MVS Noticias, El Horizonte, Info7 |
| *Querido…*: 3 sep 2026; 7.º disco, 13 canciones, epistolar y con aire medieval, sin sencillos previos; verde; portada con dos pierrots con perlas | CineMedios, El Sol de Sinaloa, Indie AM |
| Playera «México vs. José Madero» (merch) | Class Music |
| «En algún momento fui un pendejo, pero dejé atrás eso hace mucho tiempo» | La Razón, 10 dic 2024 |
| A su yo joven le diría que no fuera tan arrogante | Publimetro, 20 oct 2025 |
| ❌ **No verificado:** que dijera que las polémicas fueron «sacadas de contexto»; la fecha del concierto en la Arena CDMX; el concepto de *Sarajevo* | — |

## Datos verificados — Viva Belgrado (reel)
- Quinto disco, 23 oct 2026, Fueled By Salmorejo; producido por Ricky Falkner; Alain Johannes en «Menquitofla»; 11 canciones.
- Titular de Mondo Sonoro: «Una de las responsabilidades de hacerse mayor es ser feliz».
- Presentación en Hiriko Soinuak (Barakaldo) el 23 oct; encuentros «Vernissage»; gira 2027.
- T13 y T14 son paráfrasis del usuario. «Primer disco con Jaime y Cris» y «casi mil copias en preventa» los aportó el usuario y no hay fuente pública que los confirme.
