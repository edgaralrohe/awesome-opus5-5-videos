# CheckPass PRO Events — video de marketing (30 s, 9:16)

![poster](out/poster.png)

▶ [`out/checkpass-pro-30s.mp4`](out/checkpass-pro-30s.mp4) — 1080×1920 · 30 fps · H.264 · bips de check-in sintetizados (funciona sin audio).

| Seg. | Escena | Mensaje |
|---|---|---|
| 0–3 | Hook | ¿Fila en la entrada? Listas en papel. Colados. Caos. |
| 3–6 | Logo | CheckPass PRO EVENTS · Gestión de Invitados y Mesas |
| 6–11 | Escáner Ultra Fast | Check-in en menos de un segundo (3 invitados escaneados) |
| 11–15 | Invitaciones | Pases QR + cola de envíos por WhatsApp + RSVP |
| 15–19 | Croquis | Cada invitado en su mesa |
| 19–23 | Control en vivo | Asistencia en tiempo real (87 %) |
| 23–26 | Segmentos | Boda · XV años · Graduación · Infantil · Ejecutivo · Privado |
| 26–30 | CTA | Empieza gratis · Disponible para Android |

Especificación SDD: [`docs/spec.md`](docs/spec.md) · [`docs/plan.md`](docs/plan.md) · [`docs/tasks.md`](docs/tasks.md)

## Uso
```bash
npm install
npm test                 # lógica de tiempo + marca
npm run test:render      # fotogramas clave en Chromium
npm run render           # → out/checkpass-pro-30s.mp4 + out/poster.png
npm run test:output      # valida el MP4 (resolución, fps, duración, peso)
node scripts/render.mjs --stills 9,22   # PNGs sueltos para revisión
```
Requiere Node 22, FFmpeg y Playwright con Chromium.

## Personalizar
Todo texto, invitado ficticio y flag vive en `src/config.js`.
- **Precios:** ocultos por defecto (`showPricing: false`) porque están pendientes de confirmar. Con `true` el CTA agrega "Desde $149 MXN por evento".
- **Logo:** `logoSVG()` en `src/scenes.js` es una recreación; reemplázalo por el SVG oficial.
- **Mockups → grabaciones reales:** cada escena es una `<section>` independiente; cambia el mockup por un `<video>` manteniendo los tiempos.
