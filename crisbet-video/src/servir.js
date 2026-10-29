/* Sirve src/ desde un origen falso, sin red: la letra va local y la página
   recibe una fecha fija (martes 3 de noviembre de 2026, 12:30) para que diga "Abierto". */
const fs = require('node:fs');
const path = require('node:path');

const ORIGEN = 'http://crisbet.video/';
const RAIZ = __dirname;
const TIPOS = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.woff2': 'font/woff2' };

const FECHA_FIJA = `<script>(() => {
  const R = Date, des = new R(2026, 10, 3, 12, 30).getTime() - R.now();
  class D extends R { constructor(...a) { a.length ? super(...a) : super(R.now() + des); } static now() { return R.now() + des; } }
  window.Date = D;
})()</script>
<style>html{scroll-behavior:auto!important}</style>`;

const LETRA = `@font-face{font-family:'Montserrat';font-style:normal;font-weight:400 700;font-display:block;
  src:url(${ORIGEN}assets/montserrat-latin.woff2) format('woff2')}`;

async function servir(page) {
  await page.route('**/*', route => {
    const url = new URL(route.request().url());
    if (url.host === 'fonts.googleapis.com') return route.fulfill({ contentType: 'text/css', body: LETRA });
    if (url.origin + '/' !== ORIGEN) return route.abort();
    const archivo = path.join(RAIZ, decodeURIComponent(url.pathname));
    if (!archivo.startsWith(RAIZ) || !fs.existsSync(archivo)) return route.fulfill({ status: 404, body: '' });
    let body = fs.readFileSync(archivo);
    if (archivo.endsWith('pagina.html')) body = body.toString('utf8').replace('<head>', '<head>' + FECHA_FIJA);
    route.fulfill({ contentType: TIPOS[path.extname(archivo)] || 'application/octet-stream', body });
  });
}

module.exports = { servir, ORIGEN };
