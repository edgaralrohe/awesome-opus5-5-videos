# Spec — «Fluye»: vídeo animado para *Mientras el Guadalquivir fluye y fluye y fluye*

> Metodología: Spec-Driven Development (Dominicode). Este documento define **qué** se construye y **por qué**. El **cómo** está en `plan.md` y el orden de trabajo en `tasks.md`.

## 1. Visión

Una pieza animada vertical de 30 segundos con estética de **dibujo animado a lápiz**, fiel a la identidad gráfica del quinto disco de Viva Belgrado, *Mientras el Guadalquivir fluye y fluye y fluye* (23/10/2026, Fueled By Salmorejo; arte de Josu Larrea, proceso analógico).

La idea central sale de la portada: **el río es una constelación de puntos de luz**. Una gota cae, se convierte en río, el río pasa por Córdoba bajo el Puente Romano, cuatro figuras lo miran desde la orilla y los puntos acaban subiendo al cielo mientras aparece el título.

**Éxito:** alguien que conoce el disco reconoce su universo visual en el primer segundo. Alguien que no lo conoce entiende «disco nuevo, se llama así, ya está disponible».

### Identidad visual extraída de las referencias (`assets/referencias/`)

| Elemento | Observado en carteles | Traducción al vídeo |
|---|---|---|
| Paleta | Monocromo cálido: carbón, grafito, gris niebla, papel hueso, blanco luz | 5 tokens, nada de color saturado |
| Textura | Nubes/manchas analógicas, grano fotográfico, motas tipo bokeh | Fondo fBm pre-renderizado + grano animado por fotograma + motas |
| Motivo | Constelación de puntos blancos con halo que baja serpenteando | El río = puntos de luz que fluyen por un camino |
| Gesto | Garabatos y flechas a lápiz, anotaciones manuscritas | Trazos que se dibujan solos, con *line boil* |
| Tipografía | Serif condensada (título, ciudades) + grotesca negrita (fechas) | Instrument Serif + Inter Bold |
| Marca | Monograma «mG / fff» | Firma final, compuesta con tipografía |
| Personas | Siluetas de los cuatro, en gris, sin detalle | Cuatro figuras *cartoon* de espaldas, sin rasgos faciales |

### Qué significa «dibujo animado» aquí

- Línea de lápiz/tiza con **line boil**: el contorno tiembla y se redibuja a 12 fps («animar a doses»), aunque el vídeo vaya a 30 fps.
- Formas simples y redondeadas: cabezas en círculo, cuerpos en gota.
- **Squash & stretch** en la gota y rebotes con *overshoot* en las apariciones.
- Todo en la paleta monocroma del disco. El estilo cartoon está en el movimiento y la línea, no en el color.

## 2. Usuarios

| Usuario | Necesidad |
|---|---|
| **Creador** (quien encarga el vídeo) | Un MP4 listo para redes, reproducible y editable desde el código |
| **Público en redes** (Reels/TikTok/Shorts) | Entender en 30 s, sin sonido, qué disco es y que ya ha salido |
| **Fans del grupo** | Reconocer la estética de Larrea, no un genérico |

## 3. Funcionalidades

| ID | Funcionalidad | Prioridad |
|---|---|---|
| F1 | Render determinista: el mismo `t` produce siempre el mismo fotograma | Must |
| F2 | Fondo analógico: nube fBm + grano animado + motas bokeh | Must |
| F3 | Río de puntos de luz que fluyen por un camino serpenteante | Must |
| F4 | Gota inicial con squash & stretch que da origen al río | Must |
| F5 | Puente Romano y horizonte de Córdoba (Mezquita) a lápiz, dibujándose con boil | Must |
| F6 | Cuatro figuras cartoon de espaldas en la orilla, con movimiento secundario (balanceo, cabeceo) | Must |
| F7 | Tipografía: «Viva Belgrado», título en tres golpes con «fluye» ondulando, cierre «Ya disponible» + monograma + web | Must |
| F8 | Garabatos y flechas manuscritas que se trazan solos | Should |
| F9 | Previsualización en navegador con play/pausa y barra de tiempo | Must |
| F10 | Exportación a MP4 1080×1920 30 fps (H.264, yuv420p) | Must |
| F11 | Variante 16:9 | Won't (esta versión) |
| F12 | Pista de audio | Won't: la añade el creador en edición (derechos) |

## 4. Flujos

### 4.1 Guion (30 s)

| # | Escena | Tiempo | Qué pasa |
|---|---|---|---|
| S1 | **Papel** | 0–4 s | Fondo carbón con nube. Un garabato a lápiz se traza. «Viva Belgrado» aparece revelándose como tinta |
| S2 | **La gota** | 4–11 s | Un punto de luz cae desde arriba, se aplasta al tocar fondo y se abre en un río de puntos que serpentea hacia abajo |
| S3 | **Córdoba** | 11–19 s | Se dibujan el Puente Romano y la silueta de la Mezquita. El río pasa bajo los arcos. Las cuatro figuras aparecen sentadas en la orilla con un rebote |
| S4 | **Fluye** | 19–26 s | Los puntos suben al cielo y forman constelación. Entra el título en tres golpes: «Mientras el / Guadalquivir», «fluye y fluye», «y fluye». Cada «fluye» ondula |
| S5 | **Cierre** | 26–30 s | «Ya disponible» (grotesca), monograma «mG fff», «vivabelgrado.org». Fundido a carbón |

Las escenas se solapan unos 0,6 s en transiciones; no hay cortes duros.

### 4.2 Flujo de trabajo del creador

1. `npm install`
2. `npm test` → verde
3. `npm run preview` → abre `http://localhost:5173` y revisa con la barra de tiempo
4. `npm run render` → `out/fluye-9x16.mp4`
5. Añade la canción en su editor y publica

## 5. Arquitectura

- **Stack:** HTML + Canvas 2D + ES Modules sin bundler. Node 22 para tests (`node:test`) y render (Playwright + ffmpeg).
- **Separación:**
  - `src/lib/`: lógica pura y testeable (easing, RNG con semilla, línea de tiempo, geometría del río, boil). Sin DOM.
  - `src/render/`: funciones de dibujo `draw*(ctx, t, …)`. Sin estado global mutable.
  - `src/main.js`: compone las escenas y expone `window.__renderFrame(t)` y `window.__ready`.
- **Determinismo:** no se usan `Math.random()` ni `Date.now()` dentro del render. Todo el azar sale de `mulberry32(seed)`.
- **Fuentes:** vendorizadas en `src/fonts/` (licencia OFL) para que el render no dependa de la red.

## 6. Requisitos no funcionales

| NFR | Criterio |
|---|---|
| Rendimiento | Preview ≥ 30 fps en un portátil normal. El fondo fBm se calcula una sola vez |
| Determinismo | Dos renders del mismo `t` dan píxeles idénticos (se comprueba con hash) |
| Legibilidad | Todo texto ≥ 48 px a 1080 de ancho y dentro de la zona segura 9:16 (márgenes de 120 px laterales y 260 px arriba y abajo) |
| Fidelidad | Solo los 5 tokens de paleta, más alfa |
| Accesibilidad | Sin destellos de más de 3 Hz a pantalla completa. El grano es de baja amplitud |
| Portabilidad | El render funciona sin red tras `npm install` |
| Legal | Pieza no oficial de fan/creador. No incluye audio. Las referencias se usan solo como guía de estilo y no se reproduce la portada |

## Decisiones tomadas por defecto

El usuario no especificó formato ni duración. Se aplica la propuesta inicial: vertical 9:16, 30 s, pieza promocional del disco (no un visualizer de una canción concreta). Se puede cambiar en `src/lib/timeline.js` y `src/config.js`.
