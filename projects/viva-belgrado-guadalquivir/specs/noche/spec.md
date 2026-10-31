# Spec — «No es una canción de Halloween» (Colores Ruidosos · José Madero)

> SDD (Dominicode). Tercera composición del motor (`src/lib`, `src/render`, `src/reel`). Entrega: 31/10/2026.

## 1. Visión
Reel 9:16 de 36 s para Halloween que da la vuelta al tópico: todos ponen «Noche de brujas» hoy, pero **José Madero ha dicho que no es una canción de Halloween**, sino una metáfora sobre las máscaras sociales. Fiesta de disfraces en dibujo animado a lápiz, de noche. Los invitados bailan, se congelan, se intercambian las máscaras y a uno se le cae la suya.

**Éxito:** el gancho se entiende en 4 s y la pregunta final («¿qué máscara te vas a poner?») genera comentarios.

## 2. Usuarios
| Usuario | Necesidad |
|---|---|
| Colores Ruidosos | Publicar hoy; añadir la canción con la biblioteca de música de Instagram |
| Público | Leer sin sonido; dato curioso + pregunta para comentar |

## 3. Funcionalidades
| ID | Funcionalidad | Prioridad |
|---|---|---|
| N1 | Guion como datos: 7 tarjetas en pulsos (`src/noche/script.js`) | Must |
| N2 | Noche: cielo morado con niebla analógica, luna a lápiz con boil, grano | Must |
| N3 | 5 invitados cartoon bailando al pulso (brazos, rebote, squash) | Must |
| N4 | Máscaras: hockey (guiño al bombo de Madero), calabaza, calavera, gato, antifaz | Must |
| N5 | Congelado en T2: el baile se detiene en seco y la escena se apaga | Must |
| N6 | Vinilo genérico «Noche · José Madero · 2017» en T3 (sin imitar la portada real) | Must |
| N7 | Intercambio de máscaras al pulso en T5 (arco de un invitado al siguiente) | Must |
| N8 | Caída de la máscara de hockey en T6, con rebote, dejando la cara al descubierto | Must |
| N9 | Cierre con el logo provisional de Colores Ruidosos y @coloresruidosos | Must |
| N10 | Audio incrustado | Won't: se añade en Instagram (derechos) |

## 4. Flujos — guion (120 bpm; 72 pulsos = 36 s)
| # | Tiempo | Pulsos | Tarjeta | Visual |
|---|---|---|---|---|
| T1 | 0–4 | 8 | Hoy todos van a poner «Noche de brujas». | Fiesta, baile |
| T2 | 4–8 | 8 | Pero no es una canción de Halloween. | Congelado y apagón |
| T3 | 8–14 | 12 | Primer sencillo de «Noche», el segundo disco solista de José Madero (2017). | Vinilo girando bajo la luna |
| T4 | 14–22 | 16 | Habla de las máscaras que nos ponemos para encajar… | Vuelve el baile; las máscaras brillan una a una |
| T5 | 22–28 | 12 | …y de cómo las cambiamos según nos conviene. | Las máscaras saltan de cara en cara al pulso |
| T6 | 28–33 | 10 | Este Halloween, ¿qué máscara te vas a poner? 🎃 | Cae la máscara de hockey |
| T7 | 33–36 | 6 | @coloresruidosos | Logo |

## 5. Arquitectura
`noche.html` + `src/noche/{script,masks,party,main}.js`. Reutiliza `buildSchedule`, `drawCard`, `pencil`, `createBackground`, `createGrainLayer` y `drawLogo`. `masks.js` es puro y testeable: decide qué máscara lleva cada invitado en cada `t`.

## 6. NFR
- Texto ≥ 64 px, entre y = 520 y y = 900 (los bailarines ocupan la mitad inferior; nada de texto en la franja de la UI de Reels).
- Determinista; sin destellos > 3 Hz (el apagón de T2 es un fundido de 0,3 s).
- Veracidad: T3 contrastado ([Wikipedia](https://es.wikipedia.org/wiki/Noche_(%C3%A1lbum_de_Jos%C3%A9_Madero))); la tesis «no es de Halloween» es declaración del artista ([Revista Kuadro](https://revistakuadro.com/jose-madero-nos-presenta-noche-de-brujas/)).
- No se usa la grabación en directo de Revista OnOff (otra canción, baja resolución y derechos de terceros).
