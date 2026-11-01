# Prompts para Gemini: todo el arte de «MÉXICO VS. JOSÉ MADERO»

Objetivo: que **todo** (enemigos, jefes, objetos, fondos y bloques) salga con el mismo estilo que la hoja de Pepe y la hoja de prensa, y que el pipeline (`scripts/slice_sheet.py`) lo recorte sin trabajo manual.

---

## 0. Cómo usarlos

1. **Adjunta siempre 2 imágenes de referencia** en cada conversación con Gemini:
   - `art/source/pepe-sheet.jpg` (la hoja de Pepe)
   - la hoja de prensa (Documento / Paparazzi / Reportero)
2. **Pega primero el BLOQUE DE ESTILO (§1)** y después el prompt concreto.
3. **Una imagen = un personaje** (o un grupo de objetos). No mezcles varios enemigos en una hoja.
4. Si Gemini añade texto, marcos o sombras, contesta: *«Repítelo exactamente igual pero sin ningún texto, sin marcos, sin sombras en el suelo y con fondo gris liso #474747»*.
5. Guarda cada imagen con el nombre indicado (p. ej. `w1-lunes28.png`) y pásamela.

### Reglas técnicas (por qué importan)
| Regla | Motivo |
|---|---|
| Fondo **gris liso uniforme #474747** (sprites) o **magenta #FF00FF** (capas de fondo con transparencia) | El script detecta el fondo por color y lo borra |
| **Sin texto, rótulos, números, marcos ni cuadrícula** | Se recortarían como si fueran parte del sprite |
| **Sin sombras en el suelo** | La sombra se pegaría a los pies |
| Poses **separadas entre sí** (que no se toquen) | Cada pose se detecta como una figura independiente |
| **Mirando a la derecha** | El juego las voltea cuando hace falta |
| **Mismo tamaño de personaje en toda la hoja** | La escala se calcula con la primera fila |
| Filas en el orden pedido | Así cada fotograma recibe su nombre automáticamente |

---

## 1. BLOQUE DE ESTILO (pégalo al inicio de cada prompt)

```
ESTILO: pixel art 16 bits de videojuego arcade de los 90 (estilo Neo Geo / Spin Master), igual que las imágenes de referencia adjuntas: personajes chibi con cabeza grande, contorno oscuro grueso (#1b1226), sombreado plano tipo cel con 2-3 tonos por color, colores saturados, expresiones exageradas y cómicas. Iluminación desde arriba a la izquierda.
FORMATO: hoja de sprites. Fondo gris liso y uniforme #474747, sin degradado. SIN texto, SIN rótulos, SIN números, SIN marcos, SIN cuadrícula, SIN sombras en el suelo. Todos los personajes mirando a la derecha, de cuerpo entero, cada pose separada de las demás con espacio libre alrededor (que no se toquen). Mismo tamaño de personaje en toda la hoja. Personajes genéricos: no representar a personas reales, ni logos ni marcas.
```

---

## 2. Rehacer la hoja de prensa (ya tenéis el diseño; solo hay que limpiar el formato)

> Repite exactamente estos tres personajes con el mismo diseño, pero **cada uno en su propia imagen**, sin textos, sin cuadros y sin sombras, siguiendo la plantilla de §3.

- `prensa-documento.png` — el periódico enfadado (Documento/Titular)
- `prensa-paparazzi.png` — gorra verde, gafas, chaleco, cámara
- `prensa-reportero.png` — traje azul, corbata roja, micrófono; la credencial puede decir «PRESS» genérico, sin nombre de medio

---

## 3. Plantilla de enemigo (para todos)

```
[BLOQUE DE ESTILO]
PERSONAJE: <descripción>
HOJA de 3 filas, de izquierda a derecha:
Fila 1: ESPERA ×2 (respirando) · CAMINAR ×4 (ciclo de paso)
Fila 2: ATAQUE ×2 (<cómo ataca>) · DAÑO ×1 (recibe un golpe, gesto de dolor)
Fila 3: DERROTA ×1 (tirado en el suelo, ojos en X)
Tamaño: el personaje mide aprox. <N> % de la altura de Pepe en la referencia.
```

---

## 4. Enemigos por mundo

Las referencias salen de canciones, portadas y conceptos verificados (ver `specs/spec.md` §3.2). **Personajes genéricos**: ningún famoso.

### Mundo 1 · CARMESÍ (rojo, 2016)
- `w1-lunes28.png` — **Lunes 28**: hoja de calendario viva con el número 28 grande (único texto permitido: «28»), ojos somnolientos y enfadados, bracitos y alas de papel. *Vuela en zigzag.* ATAQUE: se lanza en picado. Tamaño 70 %.
- `w1-libro-ruso.png` — **Libro ruso**: libro grueso de tapa roja con detalles dorados, cara seria con bigote poblado, patitas. ATAQUE: se abre y escupe letras sueltas (sin palabras legibles). Tamaño 75 %.
- `w1-espina.png` — **Espina**: tallo de rosa con espinas, cara gruñona, enraizado. Solo ESPERA ×2 y ATAQUE ×2 (sacude espinas). Tamaño 80 %.

### Mundo 2 · NOCHE (negro / blanco y negro, 2017)
- `w2-invitado.png` — **Invitado enmascarado**: invitado de fiesta de disfraces con traje elegante y máscara veneciana negra. Fila extra: SIN MÁSCARA ×2 (cara sorprendida, más rápido). Tamaño 95 %.
- `w2-fantasma.png` — **Fantasma**: sábana clásica con ojos negros, flotando. Fila extra: SEMITRANSPARENTE ×2. Tamaño 85 %.
- `w2-murcielago.png` — **Murciélago**: murciélago chibi con colmillos. VOLAR ×4 en lugar de CAMINAR. Tamaño 50 %.
- Nota: este mundo se verá en blanco y negro (lo convierte el código), pero generadlo **a color**.

### Mundo 3 · ALBA (blanco, 2018, nostalgia) — **paseo: no generéis enemigos** (se mantienen solo como referencia)
- `w3-recuerdo.png` — **Recuerdo**: foto polaroid viva con una imagen borrosa de un atardecer, mirada triste, bracitos. ATAQUE: abraza (te arrastra). Tamaño 75 %.
- `w3-maldita-rueda.png` — **Maldita Rueda**: rueda de madera vieja con cara enfadada. RODAR ×4 en lugar de CAMINAR. Tamaño 70 %.

### Mundo 4 · PSALMOS (azul, 2019)
- `w4-codependientes.png` — **Codependientes**: pareja de figuritas chibi genéricas (chico y chica, ropa azul) unidas por una cadena dorada en las muñecas. Todas las poses son de los dos juntos. Tamaño 90 %.
- `w4-chambelan.png` — **Chambelán**: joven con traje de chambelán (chaqueta con charreteras, guantes blancos). CAMINAR = paso de vals ×4. Tamaño 95 %.
- `w4-sombra.png` — **Sombra suelta**: silueta negra de una persona con ojos blancos brillantes. Mismas poses que Pepe (correr y saltar) para imitarle. Tamaño 100 %.

### Mundo 5 · GIALLO (amarillo, 2022) — *estética de cine giallo; nada de enfermedades mentales*
- `w5-maniqui.png` — **Maniquí**: maniquí de tienda color crema, sin cara, articulaciones visibles. Fila extra: CONGELADO ×2 (posturas rígidas distintas). Tamaño 105 %.
- `w5-guante.png` — **Guante negro**: mano enguantada de cuero negro que sale de una cortina amarilla. Solo ESPERA ×2 · ATAQUE ×2 (agarra) · DERROTA ×1. Tamaño 60 %.

### Mundo 6 · AURORA (EP 2023, naranja óxido) — **paseo**
- **Sin enemigos: es un paseo reflexivo.** Solo hacen falta fondos (§8) y bloques (§9). Mundo 3 *Alba* tampoco necesita enemigos: ⚠️ no generéis `w3-*.png`.

### Mundo 7 · SARAJEVO (lila, 2024)
- `w7-bailarina.png` — **Bailarina**: bailarina chibi con vestido lila y tacones, girando. CAMINAR = giros ×4. Tamaño 95 %.
- `w7-pez.png` — **Pez linterna** (tramo submarino): pez lila con antena luminosa. NADAR ×4. Tamaño 55 %.

### Mundo 8 · QUERIDO… (verde, 2026, epistolar y medieval)
- `w8-carta.png` — **Carta voladora**: sobre con sello de lacre rojo y alas. VOLAR ×4. Tamaño 50 %.
- `w8-juglar.png` — **Juglar**: juglar medieval con laúd y traje verde y crema. ATAQUE: lanza notas musicales en arco. Tamaño 95 %.
- `w8-pierrot.png` — **Pierrot de perlas**: pierrot chibi de cara blanca con lágrima pintada y cuello de perlas, en verdes. ATAQUE: llora lágrimas que caen. Tamaño 95 %.

---

## 5. Jefes (uno por imagen, más grandes que Pepe)

```
[BLOQUE DE ESTILO]
JEFE FINAL: <descripción>. Mide entre 2 y 3 veces la altura de Pepe en la referencia.
HOJA de 4 filas:
Fila 1: ESPERA ×2
Fila 2: ATAQUE A ×2 · ATAQUE B ×2
Fila 3: DAÑO ×1 · FURIA ×2 (segunda fase: más rojo, más agresivo)
Fila 4: DERROTA ×2
```

| Archivo | Jefe | Descripción para el prompt |
|---|---|---|
| `boss-w1-rosa.png` | **La Rosa Carmesí** | Rosa gigante roja con cara altiva, tallo con espinas como látigos y pétalos que se deshacen en polvo. A: lluvia de pétalos · B: latigazo de espinas |
| `boss-w2-enmascarado.png` | **El Enmascarado del Lago** | Figura alta genérica de terror con capucha oscura, máscara blanca lisa con agujeros y ojos rojos brillantes (**no copiar personajes de películas**). A: aparece y desaparece · B: embestida |
| `boss-w3-nostalgia.png` | **La Nostalgia** | Figura etérea blanca y dorada hecha de fotos antiguas flotando, con un reloj de bolsillo que gira hacia atrás. A: rebobinar (espiral) · B: lanza fotos |
| `boss-w4-sombra.png` | **La Sombra** | Sombra gigante con forma de niño volador de cuento (silueta de capa y gorro puntiagudo) separándose de una figura en posición fetal. A: picado · B: manos de sombra desde el suelo |
| `boss-w5-maniqui.png` | **El Maniquí en Llamas** | Maniquí gigante color crema con la cabeza envuelta en una llama amarilla (como la portada de *Giallo*), sobre un escenario de teatro. A: brazos giratorios · B: bola de fuego amarilla |
| `boss-w7-rey.png` | **El Rey Ahogado** | Rey submarino lila y verde agua con corona torcida, capa empapada y burbujas. A: corriente de agua · B: lanza la corona como bumerán |
| `boss-w8-pierrots.png` | **Los Dos Pierrots** | Dos pierrots gigantes con cuello de perlas: uno ríe y otro llora (como la portada de *Querido…*). A: el que ríe gira · B: el que llora lanza lágrimas |
| `boss-prensa.png` | **La Rueda de Prensa** | Mesa larga con muchos micrófonos genéricos sobre brazos mecánicos y un foco. A: micrófonos que se estiran · B: ráfaga de flashes suaves |
| `boss-bestia.png` | **La Bestia** (secreto) | Criatura grande y peluda de cuento, con un pañuelo rojo en el cuello, más tierna que terrorífica. A: rugido · B: salto |

### Final «MÉXICO VS. JOSÉ MADERO» (pantalla VS)
- `vs-pepe.png`: retrato grande de Pepe de medio cuerpo, cantando con el micrófono y el pañuelo rojo, mirando a la derecha. Fondo gris liso. Expresiones: DECIDIDO ×1 · CANTANDO ×1 · VICTORIA ×1.
- `vs-publico.png`: multitud chibi de un concierto (siluetas con luces de móvil, brazos arriba), sin banderas ni logos. Expresiones: FRÍO ×1 · ANIMADO ×1 · EUFÓRICO ×1.

---

## 6. Pepe: poses extra que faltan

```
[BLOQUE DE ESTILO]
PERSONAJE: exactamente el mismo Pepe de la referencia (barba, tupé, pañuelo rojo, camiseta blanca, vaqueros, micrófono).
Fila 1: NADAR ×4 (brazada bajo el agua, mejillas hinchadas)
Fila 2: COLGADO DEL CABLE ×2 (agarrado al cable del micrófono, balanceándose)
Fila 3: LINTERNA ×2 (sujetando una linterna encendida, asustado) · CARTA ×2 (corriendo con un sobre)
Fila 4: ENTRAR POR PUERTA ×1 (de espaldas) · CEGADO ×1 (tapándose los ojos por un flash)
```
Archivo: `pepe-extra.png`

---

## 7. Objetos y power-ups (una sola hoja)

```
[BLOQUE DE ESTILO]
HOJA DE OBJETOS, cada objeto suelto y separado, del mismo tamaño aproximado (30 % de la altura de Pepe), en este orden de izquierda a derecha y de arriba abajo:
1 púa de guitarra roja brillante · 2 rosa carmesí · 3 disco de oro · 4 máscara blanca lisa de portero (genérica) · 5 sol de amanecer pequeño · 6 farol antiguo encendido · 7 micrófono plateado · 8 sobre con lacre rojo · 9 partitura dorada enrollada · 10 disco de vinilo dorado (pieza del museo) · 11 corazón rojo · 12 gancho metálico de anilla
```
Archivo: `objetos.png`

---

## 8. Fondos de los mundos (3 capas por mundo)

Formato de cada capa: **imagen panorámica horizontal 3:1** que **se repite sin cortes por los lados** (el borde izquierdo encaja con el derecho). Sin personajes y sin texto.

```
[BLOQUE DE ESTILO, cambiando FORMATO por:]
FORMATO: fondo de videojuego 16 bits, panorámico 3:1, repetible en horizontal (el borde izquierdo encaja con el derecho), sin personajes, sin texto, sin logos.
CAPA <LEJANA | MEDIA>: <descripción>
```
- **Capa lejana** (`wN-fondo-lejano.png`): cielo y siluetas. **Opaca.**
- **Capa media** (`wN-fondo-medio.png`): estructuras con huecos. **Todo lo que no sea estructura, en magenta liso #FF00FF** (se vuelve transparente).

| Mundo | Lejana | Media |
|---|---|---|
| 0 · Prototipo / Ciudad | Atardecer morado y naranja sobre Ciudad de México, con una arena de conciertos con cúpula al fondo | Vigas de acero naranjas y ventanales de una nave industrial |
| 1 · Carmesí | Cielo rojo intenso con pétalos flotando y luna roja | Rosales gigantes, vallas de jardín y columnas rojas |
| 2 · Noche | Noche oscura, luna llena, lago con niebla y bosque de pinos (estilo cine clásico de terror) | Cabañas de madera con ventanas encendidas, guirnaldas y farolillos de fiesta de disfraces |
| 3 · Alba | Amanecer blanco y dorado, nubes suaves, campos lejanos | Marcos de fotos colgando, ramas desnudas blancas y negras |
| 4 · Psalmos | Interior de catedral azul en penumbra con rayos de luz | Columnas, vidrieras de colores y bancos de iglesia |
| 5 · Giallo | Escenario de teatro con telón amarillo y focos | Bastidores, escaleras de tramoya, maniquíes de utilería y cuerdas |
| 6 · Aurora | Pared blanca gastada con hiedra y hojas rojo-naranja (como la portada del EP) | Ventanas viejas, macetas y enredaderas |
| 7 · Sarajevo | Noche lila con cortinas de terciopelo lila enormes | Escenario con cortinas; versión submarina: algas y burbujas lilas |
| 8 · Querido… | Castillo medieval verde en la colina, cielo verdoso | Torres, estandartes verdes sin escudos y buzones antiguos |
| Museo (hub) | Sala de museo moderna en penumbra | Vitrinas vacías iluminadas y 8 puertas de colores (rojo, negro, blanco, azul, amarillo, naranja, lila, verde), sin texto |
| Arena (final) | Interior de una arena de conciertos llena, luces de escenario moradas y rojas, público con luces de móvil | Estructura del escenario, focos y pantallas (sin logos) |

---

## 8b. Nivel memorial «Luciérnagas» (tono sobrio; esperad a confirmar el diseño)
- Fondo lejano: calle de barrio mexicano de noche, casas bajas y cables de luz, cielo azul muy oscuro, sin personas, sin texto. Tono respetuoso, nada de terror.
- Fondo medio (magenta #FF00FF donde no hay estructura): fachadas con ventanas apagadas, farolas apagadas y un pequeño escenario al fondo.
- Variante: la misma calle **iluminada** por cientos de luciérnagas cálidas y ventanas encendidas.
- Partículas: luciérnaga **realista y sencilla** (un punto de luz cálida con un halo), no un personaje chibi ni una mascota.

## 9. Bloques del suelo (tileset por mundo)

```
[BLOQUE DE ESTILO]
HOJA DE BLOQUES CUADRADOS para un juego de plataformas, todos del mismo tamaño, separados entre sí, vistos de frente, en este orden:
1 suelo con borde superior (césped/remate) · 2 relleno de suelo · 3 plataforma fina que se puede atravesar · 4 pinchos / peligro · 5 bloque decorativo · 6 bloque decorativo alternativo
TEMA: <material del mundo>
```
| Mundo | Material |
|---|---|
| Carmesí | ladrillo rojo con rosas |
| Noche | madera oscura y piedra con musgo, pinchos = estacas |
| Alba | mármol blanco con grietas doradas |
| Psalmos | piedra azul de catedral, plataforma = banco de iglesia |
| Giallo | tablones de escenario amarillos, plataforma = pasarela de tramoya |
| Aurora | ladrillo blanco con hiedra roja |
| Sarajevo | terciopelo lila y madera de escenario; versión de coral |
| Querido… | piedra de castillo verde, plataforma = viga de madera |

---

## 10. Orden recomendado (piloto primero)
1. **Prensa limpia** (§2): `prensa-documento.png`, `prensa-paparazzi.png`, `prensa-reportero.png`
2. **Mundo 1 Carmesí**: 3 enemigos + jefe + fondo lejano y medio + bloques
3. **Mundo 2 Noche**: 3 enemigos + jefe + fondos + bloques
4. **Objetos** (§7) y **poses extra de Pepe** (§6)
5. El resto de mundos, el museo, la Rueda de Prensa y el final VS

Con los pasos 1 y 2 ya puedo construir el **Mundo 1 completo**.
