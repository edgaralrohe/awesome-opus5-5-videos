# Video · Crisbet Podología

Video vertical (1080×1920, 76 s) que presenta la página de Crisbet Podología y sus funciones,
grabado sobre la página real: **[crisbet-podologia.mp4](crisbet-podologia.mp4)**.

| Tiempo | Qué se ve |
|---|---|
| 0:00 | Logo y "Así funciona tu página web" |
| 0:04 | Portada: quién eres, qué atiendes, botón "Pedir cita" |
| 0:10 | Aviso automático "Abierto · cierra a las 20:00" |
| 0:15 | Lista de padecimientos que se marcan con un toque |
| 0:21 | Pie dibujado: marcar dónde duele |
| 0:27 | Calificación de Google 4.6 |
| 0:31 | Preguntas frecuentes |
| 0:37 | Pedir cita: día y franja (jueves y domingo no aparecen) |
| 0:44 | Nombre; el motivo se llena solo |
| 0:51 | Mensaje listo para WhatsApp |
| 0:57 | Filtro de urgencias ("me sale pus" → "Mejor hablemos ahora") |
| 1:05 | Dirección, horario y qué traer |
| 1:10 | Cierre: WhatsApp 55 9108 1144 |

## Volver a generarlo
Requiere Node, Playwright con Chromium y ffmpeg.

```bash
node --test test/*.test.js          # pruebas
node src/grabar.js                  # → crisbet-podologia.mp4 (≈2 min)
node src/grabar.js --cuadros 8,47   # solo cuadros sueltos en cuadros/
```

Los textos y tiempos están en `src/escenas.js`. La especificación está en `spec/`.
`src/assets/pagina.html` es la página con el WhatsApp real (525591081144).
