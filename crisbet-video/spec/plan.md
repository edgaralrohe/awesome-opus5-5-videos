# Plan técnico

1. **Página** — copia en `src/assets/pagina.html` con el WhatsApp real (525591081144).
   El grabador le inyecta antes de cargar: fecha fija, la letra local y `scroll-behavior:auto`.
2. **Composición** — `src/video.html`: fondo negro, título de escena arriba, celular al centro
   (iframe 390×844 escalado ×2.2), barra de progreso dorada abajo.
3. **Escenas** — `src/escenas.js` exporta una lista `{ t, dur, texto, acciones }`.
   Cada acción es una función `(pagina, progreso)` que se llama en cada cuadro: el scroll se
   interpola con easing y los clics se disparan una vez cuando su momento llega.
4. **Reloj** — en cada cuadro: correr acciones → para cada animación de `getAnimations()`
   (de la página y de la composición) pausarla y fijar `currentTime` desde que apareció.
5. **Captura** — `page.screenshot()` en JPEG → stdin de `ffmpeg` (`-f image2pipe`).
6. **Verificación** — `test/escenas.test.js` con `node:test`: tiempos consistentes y textos cortos;
   `test/pagina.test.js`: la página carga, el número es el real, el filtro de urgencias se dispara.
   Después del render: `ffprobe` verifica resolución, fps y duración; se revisan cuadros sueltos.
