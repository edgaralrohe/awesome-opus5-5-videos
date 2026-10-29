# Spec · Video de presentación de la página de Crisbet Podología

## 1. Visión
Un video corto (≈75 s) que enseña la página web de Crisbet Podología y lo que hace,
de forma sencilla y sin rodeos: se ve la página real funcionando y un texto breve en
pantalla dice qué está pasando. Al terminar, quien lo vea sabe que la página informa,
ayuda a explicar la molestia, filtra urgencias y manda la cita lista por WhatsApp.

## 2. Usuarios
- **El dueño del consultorio** (podólogo): necesita entender qué hace su página sin leer código.
- **Pacientes y seguidores** en redes o WhatsApp: necesitan saber que pueden pedir cita desde el celular.

Por eso: formato vertical 9:16 (celular), textos grandes, un solo mensaje por escena.

## 3. Funcionalidades (lo que el video debe mostrar)
| # | Funcionalidad de la página | Cómo se ve en el video |
|---|---|---|
| F1 | Portada con nombre, lema y botón "Pedir cita" | Portada completa |
| F2 | Aviso automático "Abierto / cerrado" según la hora | Franja con "Abierto · cierra a las 20:00" |
| F3 | Lista de padecimientos que se marcan con un toque | Se marcan 2 y aparece el contador |
| F4 | Pie dibujado: marcar la zona que molesta | Se marca "Talón" y se ilumina |
| F5 | Calificación de Google 4.6 | Bloque dorado |
| F6 | Preguntas frecuentes (costo, qué llevar, dónde) | Recorrido rápido |
| F7 | Agenda: día, franja y nombre; el motivo se llena solo | Se llena paso a paso |
| F8 | Vista previa del mensaje y botón "Enviar por WhatsApp" | Botón se activa en dorado |
| F9 | Filtro de urgencias (pus, sangrado, diabetes…) | Se escribe "pus" y aparece el aviso coral |
| F10 | Dirección, horario y WhatsApp 55 9108 1144 | Cierre con los datos |

## 4. Flujos
Intro (logo) → Portada → Franja horario → Qué atendemos (lista + pie) → Calificación →
Preguntas → Pedir cita (día → franja → nombre → mensaje listo) → Urgencia → Datos → Cierre.

## 5. Arquitectura
- La página real (`src/assets/pagina.html`) dentro de un marco de celular, en una
  composición HTML 1080×1920 (`src/video.html`) con los textos de cada escena.
- Un guion de escenas con tiempos (`src/escenas.js`) que hace los clics y el scroll en la página.
- Un grabador (`src/grabar.js`, Playwright) que controla el tiempo cuadro por cuadro:
  pausa todas las animaciones CSS y las avanza a mano, así el video sale fluido y
  repetible aunque la captura sea lenta. Los cuadros pasan a `ffmpeg` → MP4 H.264.
- La fecha se fija en un martes a las 12:30 para que la página diga "Abierto".

## 6. Requisitos no funcionales
- 1080×1920, 30 fps, H.264 + `yuv420p` + `faststart` (funciona en WhatsApp, Instagram, TikTok).
- Duración entre 60 y 90 s; cada texto en pantalla ≤ 12 palabras y visible ≥ 3 s.
- Sin audio obligatorio: se entiende en silencio (los textos van en pantalla).
- Colores y letra de la marca: negro, dorado #C9A455, Montserrat (incluida localmente).
- Grabación repetible: mismo comando → mismo video.
- No se inventan datos: solo lo que ya dice la página (4.6 de 5, 11 calificaciones, horario, dirección).
