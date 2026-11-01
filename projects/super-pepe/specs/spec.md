# Spec — «SÚPER PEPE: 8 MUNDOS» (título provisional)

> Spec-Driven Development (Dominicode). Juego de plataformas 8 bits, jugable en la web de Colores Ruidosos, que recorre la carrera solista de José Madero. Cada disco es un mundo con enemigos y un jefe final. El hub es **el Museo**.
> Estado: **borrador para definir con el equipo**. Las celdas marcadas con ⚠️ esperan verificación o decisión.

---

## 1. Visión

Un homenaje jugable, hecho por fans, en el que cada disco de José Madero es un mundo con su color, su ambientación sacada de la portada y del concepto real del disco, enemigos inspirados en sus canciones y un jefe final. Entre mundos aparecen **hitos verificados** de su carrera («¿Sabías que…?»). El jugador recorre **el Museo**, inspirado en el museo real de 2026 con más de 100 piezas, y recupera esas piezas por los mundos.

**Por qué funciona:**
- Madero es fan declarado del terror (Milenio, Looking Back), así que un juego de terror retro es coherente con él.
- Cada disco tiene color propio («serie de colores»: La Razón, Wikipedia), lo que encaja con una paleta de NES.
- El museo real (Monterrey, jul–ago 2026, más de 100 piezas) da la estructura: coleccionar piezas.

**Éxito:** partidas completas compartidas en redes, visitas recurrentes a la web y comentarios del tipo «mi jefe favorito es…».

### Riesgos que hay que asumir desde ya
| Riesgo | Decisión propuesta |
|---|---|
| **Marca «Super Mario Bros.»** (Nintendo). «Súper José Madero Bros» puede generar reclamaciones o retiradas | Usar un título propio: **«SÚPER PEPE: 8 MUNDOS»** o **«MADERO: 8 MUNDOS»**. Las mecánicas de plataformas son libres; el nombre y los sprites de Nintendo no |
| **Personajes de terror con dueño** (Jason, Freddy, Pinhead) | Arquetipos propios: «el Enmascarado del Lago», etc. Nunca los nombres ni los diseños registrados |
| **Nombre e imagen de José Madero** en una web | Rótulo «Homenaje no oficial hecho por fans» en portada y créditos. Ideal: **avisar o pedir permiso a su equipo** (incluso puede salir una colaboración) |
| **Su música grabada** | No se usa. Solo chiptunes originales compuestos por código |
| **Portadas** | Se evocan con objetos y paletas; no se reproducen |
| **Giallo trata trastornos mentales** (Chilango) | **No convertir trastornos en enemigos.** El mundo usa los códigos del cine *giallo* (maniquíes, guantes negros, teatro), nunca enfermedades |
| **Fotosensibilidad** (flashes de *Posa y sonríe*) | Flash de baja intensidad, < 3 Hz y desactivable en Opciones |

---

## 2. Usuarios

| Usuario | Necesidad |
|---|---|
| Fan de Madero (móvil, Instagram → web) | Jugar en 30 s sin instalar nada; controles táctiles; reconocer cada disco |
| Jugador retro | Controles precisos, dificultad justa, secretos |
| Colores Ruidosos | Contenido que retiene en la web; escenas grabables para reels; fácil de ampliar con nuevos discos |

---

## 3. Funcionalidades

| ID | Funcionalidad | Prioridad |
|---|---|---|
| G1 | Plataformas 2D: correr, saltar (altura variable), pisar enemigos, disparar con power-up | Must |
| G2 | **Hub «El Museo»**: 8 salas (una por disco) que abren cada mundo; las vitrinas se llenan con las piezas recuperadas | Must |
| G3 | 8 mundos = 8 discos, cada uno con 1 nivel y 1 jefe (v1). Aurora, al ser EP, es un mundo corto | Must |
| G4 | Enemigos y jefes con patrones propios (ver §3.2–3.3) | Must |
| G5 | Power-ups (ver §3.4) | Must |
| G6 | Coleccionables: **100 piezas del museo** (12–13 por mundo) + 1 pieza dorada por mundo | Must |
| G7 | Tarjetas de hitos «¿SABÍAS QUE…?» entre mundos, con fuente en los créditos | Must |
| G8 | Controles: teclado, mando (Gamepad API) y táctil (cruceta + A/B) | Must |
| G9 | Guardado del progreso en el navegador; continuar partida | Must |
| G10 | Chiptune original por mundo (motor de «8 cabañas», en tiempo real) | Must |
| G11 | Accesibilidad: sin flashes, modo «sin daño» (asistido), remapeo de teclas | Should |
| G12 | Mundo epílogo «Érase una Bestia» (estadio) con el jefe final del juego | Should |
| G13 | Modo «grabación» para reels: vertical 9:16 con la cámara centrada | Could |
| G14 | Mundo 0 «Panda / PXNDX» | Won't (v1) ⚠️ falta verificar datos y decidir |
| G15 | Ranking online | Won't (v1) |

### 3.1 Mundos (orden cronológico)

| # | Mundo | Año | Paleta | Ambientación (de dónde sale) | Mecánica del mundo |
|---|---|---|---|---|---|
| 1 | **Carmesí** | 2016 | rojo | Portada: mano y rosa que se deshace. Canciones escritas entre 2008 y 2010 | Tutorial: correr, saltar, pétalos que caen como plataformas temporales |
| 2 | **Noche** | 2017 | negro / B y N | Homenaje al terror clásico; vídeo de «Noche de brujas» en blanco y negro; fiesta de disfraces | Nivel en **blanco y negro**; cabañas junto al lago (enlace con «8 cabañas»); máscaras que cambian a los enemigos |
| 3 | **Alba** | 2018 | blanco | «Disco blanco», conceptual, *Oda a la nostalgia*. Madero lo llamó «el amanecer»; yin-yang con *Noche* | El nivel amanece: la luz revela plataformas; si te quedas quieto, «la nostalgia» te arrastra hacia atrás |
| 4 | **Psalmos** | 2019 | azul | Espiritualidad y desamor. Portada: figura en posición fetal en una esquina. Iba a tratar «el lado oscuro de Peter Pan» | Vidrieras de colores y sombras que se separan de sus dueños |
| 5 | **Giallo** | 2022 | amarillo | Doble sentido: amarillo y cine *giallo* italiano. Portada: maniquí con la cabeza en llamas. Gira *Giallo Fantastique* | Teatro y bastidores; luces amarillas que se encienden y apagan; maniquíes que solo se mueven cuando no los miras |
| 6 | **Aurora** (EP) | 2023 | naranja óxido / gris | 6 canciones. Portada: hiedra con hojas rojas sobre pared blanca | Mundo corto. Sección de sigilo «Aplaudan en silencio»: un salto ruidoso despierta a los enemigos |
| 7 | **Sarajevo** | 2024 | lila | Portada: piernas con tacones ante una cortina lila. Canciones: «Luciérnaga», «Rey Ahogado» (con Lasso) | Nivel nocturno con luciérnagas como luz; tramo **bajo el agua** hasta el Rey Ahogado |
| 8 | **Querido…** | 2026 | verde | 7.º disco, 13 canciones, **epistolar** y con aire **medieval**, cuerdas, sin sencillos. Portada: dos pierrots con perlas | Castillo medieval de cartas; los sobres son checkpoints; dos rutas (las «dos caras») |
| ★ | **Érase una Bestia** (epílogo) | 2026 | todos | Su primer estadio: Estadio GNP Seguros, 24 ene 2026 | Escenario de estadio con público; jefe final del juego |

### 3.2 Enemigos (borrador para definir)

Regla: cada enemigo sale de **un título de canción, una portada o un concepto verificado**, nunca de inventos sobre la vida privada del artista.

| Mundo | Enemigo | Referencia | Comportamiento |
|---|---|---|---|
| Carmesí | **Lunes 28** | Sencillo «Lunes 28» | Hoja de calendario que vuela en zigzag |
| Carmesí | **Libro ruso** | Sencillo «Literatura rusa» | Libro que se abre y lanza letras |
| Carmesí | **Espina** | Rosa de la portada | Tallo estático; daña al tocarlo |
| Noche | **Invitado enmascarado** | «Noche de brujas» (fiesta de disfraces) | Al pisarlo pierde la máscara y cambia de comportamiento |
| Noche | **Fantasma** | «Fantasmas» (setlist de la gira *Noche*) | Atraviesa paredes; solo es visible con flash |
| Noche | **Murciélago** | Terror clásico | Picado en curva |
| Alba | **Recuerdo** (polaroid) | Concepto nostalgia | Te sigue lento; si te toca, te devuelve a un punto anterior |
| Alba | **Maldita Rueda** | Canción «Maldita Rueda» | Rueda que rueda por pendientes |
| Psalmos | **Codependientes** | Sencillo «Codependientes» (con Cami) | Pareja unida por una cadena: hay que vencer a los dos |
| Psalmos | **Chambelán** | «Chambelán (Nunca fui)» | Baila en formación; patrón de vals |
| Psalmos | **Sombra suelta** | Concepto original: lado oscuro de Peter Pan | Copia tus movimientos con retraso |
| Giallo | **Maniquí** | Portada de *Giallo* | Avanza solo cuando le das la espalda |
| Giallo | **Guante negro** | Código del cine *giallo* | Mano que sale de los bastidores |
| Aurora | **Casanova** | «Casanova» | Te lanza rosas que desvían el salto |
| Aurora | **Flash** | «Posa y sonríe» | Cámara: si te pilla en su encuadre, te congela 1 s (flash suave) |
| Aurora | **Ceniza** | «Domingo de Ceniza» | Nube que se deshace al pisarla |
| Sarajevo | **Luciérnaga** (amiga) | «Luciérnaga» | No es enemiga: ilumina zonas oscuras |
| Sarajevo | **Bailarina** | «Baila conmigo» ⚠️ (versión extendida, confirmar) | Gira y rebota |
| Querido… | **Carta voladora** | Disco epistolar | Sobre que planea; al abrirlo suelta una pieza |
| Querido… | **Juglar** | Aire medieval y cuerdas | Lanza notas en arco |
| Querido… | **Pierrot de perlas** | Portada | Llora lágrimas que caen como proyectiles |

### 3.3 Jefes finales

| Mundo | Jefe | Referencia | Fases (borrador) | Al vencerlo |
|---|---|---|---|---|
| Carmesí | **La Rosa Carmesí** | Portada | 1) Lluvia de pétalos · 2) Látigos de espinas · 3) Se deshace como en la portada | **Disco de Oro** (*Carmesí* fue Disco de Oro en nov. 2016) |
| Noche | **El Enmascarado del Lago** | Máscaras de la fiesta + figuras de terror en la gira *Noche* (arquetipo propio) | 1) Aparece y desaparece entre las cabañas · 2) Apagón: solo ves sus ojos · 3) Persecución | Máscara de hockey (power-up) |
| Alba | **La Nostalgia** | Concepto del disco | Rebobina el nivel y tu posición; solo se vence **avanzando** (mensaje del disco: la nostalgia puede impedir disfrutar el presente) | Luz del Alba |
| Psalmos | **La Sombra** | Concepto original del lado oscuro de Peter Pan; la pelea es en la esquina de la portada | Se separa de la figura en posición fetal; la luz de la vidriera la debilita | Vidriera (pieza) |
| Giallo | **El Maniquí en Llamas** | Portada | Se apagan las luces del teatro; ataca cuando le das la espalda | Programa de mano de *Giallo Fantastique* (pieza) |
| Aurora | **Casanova** (minijefe) | «Casanova» | Duelo corto de esquivar rosas | Hoja de hiedra (pieza) |
| Sarajevo | **El Rey Ahogado** | «Rey Ahogado» (con Lasso) | Bajo el agua: corona que tira corrientes; las luciérnagas marcan los huecos | Corona (pieza) |
| Querido… | **Los Dos Pierrots** | Portada (dos rostros) | Jefe doble: cuando uno ríe, el otro llora; hay que golpear al que llora | Carta sellada (pieza dorada) |
| ★ Epílogo | **La Bestia** | «Érase una Bestia», su primer estadio (24 ene 2026) | Combina patrones de los 8 jefes al ritmo del público | Créditos + museo completo |

### 3.4 Power-ups y objetos

| Objeto | Referencia | Efecto |
|---|---|---|
| **Púa de guitarra** | Guitarras expuestas en el museo | Disparo (equivalente a la flor de fuego) |
| **Rosa carmesí** | Portada de *Carmesí* | +1 corazón |
| **Disco de Oro** | Disco de Oro de *Carmesí* (nov. 2016) | Vida extra |
| **Máscara de hockey** | Terror de la gira *Noche* | Invencible 8 s (las máscaras de la fiesta te ignoran) |
| **Luz del Alba** | «El amanecer» (*Alba*) | Revela plataformas ocultas durante 10 s |
| **Luciérnaga** | «Luciérnaga» (*Sarajevo*) | Ilumina el entorno en zonas oscuras |
| **Micrófono** | Directo | Grito que aturde a los enemigos de la pantalla (1 uso) |
| **Carta** | *Querido…* epistolar | Checkpoint |
| **Partitura dorada** | Partitura original de «Plural siendo singular» expuesta en el museo | Pieza dorada secreta (1 por mundo; todas = final secreto) |
| **Pieza del museo** | Más de 100 piezas del museo real | Coleccionable (100 en total) |

### 3.5 Hitos «¿SABÍAS QUE…?» (verificados)

| Tras | Hito | Fuentes |
|---|---|---|
| Carmesí | Salió el 29 abr 2016; fue **Disco de Oro** (nov. 2016) y monitorLATINO lo nombró Artista Revelación 2016. Muchas canciones son de 2008–2010 | Wikipedia (Carmesí) |
| Noche | «Noche de brujas» **no es de Halloween**: habla de máscaras sociales. En la gira, figuras de terror salían al escenario | Wikipedia (Noche), Revista Kuadro, ABC Noticias, El Alebrije |
| Alba | Es el «disco blanco»: conceptual, sobre la nostalgia; Madero lo llamó «el amanecer» | Wikipedia (Alba), Looking Back |
| Psalmos | Se adelantó por filtraciones; al principio iba a tratar el lado oscuro de Peter Pan; fue **n.º 1 en ventas en México** | Wikipedia ES (Psalmos), Intolerancia Diario, Wikipedia EN (n.º 1 2019) |
| Giallo | El título es amarillo y también un género de cine de terror italiano; la gira *Giallo Fantastique* pasó por el Auditorio Nacional (10 jun 2022) | Grita Radio, Entodomusic |
| Aurora | EP de 6 canciones, publicado el 17 mar 2023 | Discogs, Spotify |
| Sarajevo | Incluye «Rey Ahogado» con Lasso ⚠️ (fecha de 2024 distinta según la fuente) | Letras, Last.fm, Sazum |
| Estadio | 24 ene 2026: su primer Estadio GNP Seguros, «Érase una Bestia», con museo en una carpa | Chilango, Excélsior |
| Museo | Monterrey, 21 jul–21 ago 2026: más de 100 piezas, gratis, con la partitura original de «Plural siendo singular» | MVS Noticias, El Horizonte, Info7 |
| Querido… | 3 sep 2026: 7.º disco, 13 canciones, epistolar, sin sencillos previos; el verde es su color | CineMedios, El Sol de Sinaloa, Indie AM |

---

## 4. Flujos

### 4.1 Jugador
1. Portada → «PULSA START» (con el aviso de homenaje no oficial).
2. **Museo** (hub): Pepe camina por un pasillo con 8 puertas de colores. Solo está abierta la siguiente; las vitrinas muestran las piezas recogidas.
3. Mundo: nivel → puerta del jefe → jefe → recompensa → tarjeta «¿SABÍAS QUE…?» → vuelta al museo con la vitrina actualizada.
4. Tras el mundo 8 se abre la sala «Érase una Bestia» (epílogo).
5. Créditos con fuentes, aviso legal y @coloresruidosos.

### 4.2 Equipo (añadir un disco nuevo)
1. Añadir una entrada en `data/worlds.js` (paleta, textos, fuentes).
2. Dibujar el nivel en `data/levels/<mundo>.txt` (mapa de caracteres).
3. Elegir enemigos de la biblioteca o crear uno con su test.
4. `npm test` → `npm run build` → subir `dist/` a la web.

---

## 5. Arquitectura

- **Motor propio en ES Modules + Canvas 2D**, sin dependencias de runtime. Reutiliza de «8 cabañas» la paleta, la fuente 5×7, los sprites y el chiptune.
- **Resolución lógica 256×224** (NES), escalado entero, `image-rendering: pixelated`. Responsive: cabe en horizontal y en vertical con controles táctiles debajo.
- **Lógica pura y testeable en Node** (sin DOM): física AABB, colisiones con tiles, IA de enemigos (funciones `update(state, dt)`), patrones de jefes, inventario y guardado.
- **Bucle de paso fijo a 60 Hz** (determinista: permite repeticiones y grabar reels).
- **Datos**: niveles como texto (un carácter = un tile), mundos y hitos en JSON/JS.
- **Audio**: WebAudio con el sintetizador chiptune en tiempo real; un tema por mundo y otro por jefe.
- **Entrega**: carpeta estática `dist/` (iframe o subruta de la web). Guardado en `localStorage`.

## 6. Requisitos no funcionales

| NFR | Criterio |
|---|---|
| Rendimiento | 60 fps en un móvil medio; < 1 MB de descarga inicial |
| Controles | Latencia < 1 fotograma; *coyote time* (6 frames) y *jump buffer* (6 frames) |
| Accesibilidad | Sin flashes > 3 Hz; flashes desactivables; modo asistido; remapeo; textos ≥ 8 px lógicos |
| Compatibilidad | Chrome, Safari iOS, Firefox; teclado, táctil y mando |
| Determinismo | Misma entrada → misma partida (tests de repetición) |
| Veracidad | Todo dato en pantalla tiene su fuente en `data/sources.js` y en los créditos |
| Legal | Título propio; «Homenaje no oficial»; sin música grabada, portadas ni personajes registrados |

## Decisiones abiertas (para definir juntos)
1. **Título**: «SÚPER PEPE: 8 MUNDOS», «MADERO: 8 MUNDOS» u otro (mi recomendación: evitar «Bros»).
2. **Alcance de la v1**: 8 mundos × (1 nivel + jefe), o un MVP de 2 mundos (Carmesí + Noche) para probar primero.
3. ¿Incluimos **Panda/PXNDX** como mundo 0?
4. ¿Escribimos al **equipo de José Madero** antes de publicar?
5. Enemigos y jefes de §3.2–3.3: ¿cuáles se quedan, cuáles cambiamos?
