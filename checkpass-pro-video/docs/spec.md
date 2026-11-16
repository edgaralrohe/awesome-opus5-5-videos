# Spec — Video de marketing "CheckPass PRO Events"

> Metodología SDD (Dominicode). Este documento define el **qué** y el **por qué**. El **cómo** está en `plan.md` y el orden de trabajo en `tasks.md`.

## 1. Visión

Un video vertical de **30 segundos** que, sin una sola grabación real todavía, convenza a organizadores de eventos en México de que CheckPass PRO elimina las filas, los colados y el caos de las listas en papel.

- **Problema que ataca el video:** la gente no entiende en 3 segundos qué hace una app de "control de acceso"; necesita *ver* el escaneo, el check-in y las mesas llenándose.
- **Resultado esperado:** el espectador sale sabiendo (1) que es un escáner QR para eventos, (2) que también manda invitaciones y acomoda mesas, (3) que puede empezar gratis en Android.
- **Fuera de alcance (v1):** voz en off, música licenciada, grabaciones reales de pantalla, fotos del estreno, versión 16:9. Se diseña para poder reemplazar mockups por grabaciones reales después.

## 2. Usuarios (audiencia del video)

| Segmento | Qué le importa | Escena que le habla |
|---|---|---|
| Familias organizando boda / XV años | Que nadie se cuele, que cada quien llegue a su mesa | QR + croquis de mesas |
| Wedding planners / agencias | Varios eventos, staff, reportes | Dashboard en tiempo real |
| Salones de eventos | Control en la puerta, cero filas | Escáner "Ultra Fast" |
| Eventos ejecutivos / graduaciones | Acreditaciones, asistencia | Dashboard + segmentos |

Canales: Reels, TikTok, Shorts, estados de WhatsApp → **9:16, 1080×1920, 30 fps**, legible **sin audio** (todo el mensaje va en texto en pantalla).

## 3. Funcionalidades (requisitos del video)

- **F1 Hook (0–3 s):** el dolor: lista de papel, nombres tachados, "¿Fila en la entrada?".
- **F2 Logo (3–6 s):** isotipo de puerta con QR + destello; "CheckPass" blanco + "PRO" violeta + píldora "EVENTS"; tagline "Gestión de Invitados y Mesas".
- **F3 Check-in QR (6–11 s):** teléfono con HUD de escáner, pase QR, línea de escaneo, confirmación verde con nombre, mesa y acompañantes; contador de llegadas sube.
- **F4 Invitaciones (11–15 s):** pase personalizado + cola de envío por WhatsApp pasando a "Enviado" y RSVP "Confirmado".
- **F5 Mesas (15–19 s):** croquis del salón; los invitados se acomodan en mesas redondas.
- **F6 Tiempo real (19–23 s):** anillo de asistencia 0→87 %, KPIs y feed en vivo.
- **F7 Segmentos (23–26 s):** Boda · XV años · Graduación · Fiesta infantil · Ejecutivo · Privado.
- **F8 CTA (26–30 s):** logo + "Empieza gratis" + "Disponible para Android".
- **F9 Precios configurables:** los precios **no se muestran por defecto** (pendientes de confirmar). Un flag `showPricing` permite activarlos sin tocar escenas.
- **F10 Audio opcional:** "bip" sintetizado sincronizado con cada check-in; el video debe funcionar en silencio.

## 4. Flujos

**Flujo del espectador:** dolor → marca → "así funciona" (escaneo) → "y además" (invitaciones, mesas, tiempo real) → "es para ti" (segmento) → acción.

**Flujo de producción:**
1. Editar textos/flags en `src/config.js`.
2. `npm test` (lógica de línea de tiempo + validación de marca).
3. `npm run render` → `out/checkpass-pro-30s.mp4` + `out/poster.png`.
4. Cuando lleguen grabaciones reales: sustituir el mockup de la escena correspondiente por `<video>` sin cambiar la línea de tiempo.

## 5. Arquitectura (alto nivel)

- Página HTML/CSS/SVG **determinista**: una función `renderAt(t)` pinta el fotograma exacto del segundo `t`. Sin animaciones CSS dependientes de reloj.
- Lógica pura (escenas, easing, interpolaciones, contadores) en módulos ES testeables con `node --test`.
- Render: Playwright (Chromium preinstalado) captura cada fotograma → FFmpeg codifica H.264 + pista de audio sintetizada.
- Fuentes locales vía `@fontsource` (Playfair Display, Plus Jakarta Sans): el render no depende de internet.

## 6. Requisitos no funcionales

- **Marca:** paleta "Luxe Champagne & Royal Violet" exacta (ver `src/config.js`). Verde/naranja/rojo **solo** para estados (check-in, pendiente, alerta). Radios 24 / 20 dp. Títulos en Playfair, UI en Plus Jakarta.
- **Legibilidad:** texto principal ≥ 64 px a 1080 px de ancho; cada mensaje en pantalla ≥ 1.5 s; zona segura de 180 px arriba y 320 px abajo libre de texto clave (UI de Reels/TikTok).
- **Veracidad:** solo funciones confirmadas en el código; nombres de invitados ficticios; sin logos de terceros (Google Play, WhatsApp) — solo texto.
- **Reproducibilidad:** mismo input → mismos fotogramas. Render completo < 10 min en el contenedor.
- **Entrega:** MP4 H.264 `yuv420p`, 1080×1920, 30 fps, 30.0 s ± 1 frame, < 20 MB.
