// Construye el escenario y expone window.renderAt(t): fotograma determinista del segundo t.
import { CONFIG, SCENES } from './config.js';
import { interp, clamp, easeOutCubic, easeInOutCubic, easeOutBack, fadeInOut, sceneProgress, counterAt, checkinTimes } from './timeline.js';

const C = CONFIG.copy;
const $ = (root, sel) => root.querySelector(sel);
const $$ = (root, sel) => [...root.querySelectorAll(sel)];
const style = (el, o) => { for (const k in o) el.style[k] = o[k]; };
const tf = (el, { x = 0, y = 0, s = 1, r = 0, o } = {}) => {
  el.style.transform = `translate(${x}px, ${y}px) scale(${s}) rotate(${r}deg)`;
  if (o !== undefined) el.style.opacity = o;
};

function rng(seed) { // mulberry32
  return () => { seed |= 0; seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

/* ---------- Piezas reutilizables ---------- */

function qrSVG(seed, fg = '#0D0E15', n = 25) {
  const r = rng(seed); let cells = '';
  const finder = (x, y) => `<rect x="${x}" y="${y}" width="7" height="7" rx="1.6" fill="${fg}"/><rect x="${x + 1}" y="${y + 1}" width="5" height="5" rx="1" fill="#fff"/><rect x="${x + 2}" y="${y + 2}" width="3" height="3" rx=".6" fill="${fg}"/>`;
  const inFinder = (x, y) => (x < 8 && y < 8) || (x >= n - 8 && y < 8) || (x < 8 && y >= n - 8);
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++)
    if (!inFinder(x, y) && r() > 0.52) cells += `<rect x="${x}" y="${y}" width="1" height="1" fill="${fg}"/>`;
  return `<svg viewBox="0 0 ${n} ${n}" width="100%" height="100%" shape-rendering="crispEdges">${cells}${finder(0, 0)}${finder(n - 7, 0)}${finder(0, n - 7)}</svg>`;
}

/** Isotipo recreado (puerta en perspectiva + QR + destello). Reemplazar por el SVG oficial cuando llegue. */
function logoSVG(uid) {
  const r = rng(7); let qr = '';
  for (let y = 0; y < 7; y++) for (let x = 0; x < 7; x++) {
    if (r() > 0.45 || (x < 2 && y < 2) || (x > 4 && y < 2) || (x < 2 && y > 4))
      qr += `<rect x="${86 + x * 6.4}" y="${84 + y * 6.4}" width="5.6" height="5.6" rx="1.2" fill="#2A1450"/>`;
  }
  return `<svg viewBox="0 0 220 220" width="100%" height="100%">
    <defs>
      <linearGradient id="lgFrame-${uid}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#9F67FF"/><stop offset="1" stop-color="#581C87"/></linearGradient>
      <linearGradient id="lgDoor-${uid}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#7928CA"/><stop offset="1" stop-color="#3B0F6B"/></linearGradient>
      <radialGradient id="lgLight-${uid}" cx=".5" cy=".55" r=".75"><stop offset="0" stop-color="#FFF6DC"/><stop offset=".55" stop-color="#F1E3B8"/><stop offset="1" stop-color="#C8B78A"/></radialGradient>
    </defs>
    <path d="M70 34 Q70 22 82 22 H160 Q172 22 172 34 V196 H70 Z" fill="url(#lgLight-${uid})"/>
    ${qr}
    <path d="M70 34 Q70 22 82 22 H160 Q172 22 172 34 V196 H70 Z" fill="none" stroke="url(#lgFrame-${uid})" stroke-width="11" stroke-linejoin="round"/>
    <path d="M70 26 L30 8 L30 214 L70 196 Z" fill="url(#lgDoor-${uid})" stroke="#9F67FF" stroke-width="2" stroke-linejoin="round"/>
    <circle cx="40" cy="112" r="4.5" fill="#E8D5A3"/>
    <path d="M58 204 H196" stroke="#E8D5A3" stroke-width="3" stroke-linecap="round" opacity=".5"/>
    <g class="sparkle" style="transform-origin:186px 30px"><path d="M186 6 C188 22 190 26 206 30 C190 34 188 38 186 54 C184 38 182 34 166 30 C182 26 184 22 186 6 Z" fill="#F1E3B8"/></g>
  </svg>`;
}

const wordmarkHTML = (size = 92) => `<div class="wordmark"><div class="name" style="font-size:${size}px">CheckPass <b>PRO</b></div><div class="pill-events">EVENTS</div></div>`;
const headlineHTML = (lines, kicker) => `<div class="headline">${kicker ? `<div class="kicker"><i></i>${kicker}</div>` : ''}<span class="l1">${lines[0]}</span><span class="l2">${lines[1]}</span></div>`;
const check = (c = '#22C55E', w = 52) => `<svg width="${w}" height="${w}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>`;

/** Animación estándar de titular: entra subiendo en los primeros 0.6 s de la escena. */
function animHeadline(root, local) {
  const h = $(root, '.headline');
  const k = $(h, '.kicker'), l1 = $(h, '.l1'), l2 = $(h, '.l2');
  if (k) tf(k, { y: interp(local, [0, 0.45], [24, 0], easeOutCubic), o: interp(local, [0, 0.4], [0, 1]) });
  tf(l1, { y: interp(local, [0.05, 0.55], [40, 0], easeOutCubic), o: interp(local, [0.05, 0.45], [0, 1]) });
  tf(l2, { y: interp(local, [0.2, 0.7], [40, 0], easeOutCubic), o: interp(local, [0.2, 0.6], [0, 1]) });
}

/* ---------- Escenas ---------- */

const scenes = {
  hook: {
    html: () => `
      <div class="headline"><span class="l1">${C.hook[0]}</span>
        <div class="hooksub" style="margin-top:28px;font-size:44px;font-weight:600;color:#94A3B8">${C.hook[1].split('. ').map((w, i, a) => `<span class="hw" style="display:inline-block;margin:0 8px">${w}${i < a.length - 1 ? '.' : ''}</span>`).join('')}</div></div>
      <div class="paper"><h4>Lista de invitados</h4>
        ${['Fam. López', 'Andrea Gil', 'Fam. Torres', 'Luis Peña', 'Fam. Castro', 'Mónica Vela', '+ 2 sin invitación'].map((n, i) =>
          `<div class="row">${n}<span class="strike"></span>${[1, 4, 6].includes(i) ? `<span class="scrib">${['¿mesa?', '¿llegó?', '¿quién?'][[1, 4, 6].indexOf(i)]}</span>` : ''}</div>`).join('')}
      </div>`,
    render(root, local) {
      const h = $(root, '.l1');
      tf(h, { y: interp(local, [0, 0.5], [50, 0], easeOutCubic), o: interp(local, [0, 0.35], [0, 1]) });
      $$(root, '.hw').forEach((w, i) => tf(w, { y: interp(local, [0.6 + i * 0.4, 0.9 + i * 0.4], [20, 0], easeOutCubic), o: interp(local, [0.6 + i * 0.4, 0.85 + i * 0.4], [0, 1]) }));
      const paper = $(root, '.paper');
      const chaos = interp(local, [0.8, 2.6], [0, 1]);
      const jitter = Math.sin(local * 31) * 2.2 * chaos;
      tf(paper, { y: interp(local, [0, 0.7], [260, 0], easeOutCubic) + interp(local, [2.55, 3], [0, 500], easeInOutCubic),
        r: -4 + jitter + interp(local, [2.55, 3], [0, -10], easeInOutCubic), o: interp(local, [0, 0.4], [0, 1]) * interp(local, [2.6, 3], [1, 0]) });
      $$(root, '.strike').forEach((s, i) => { s.style.width = `${interp(local, [0.5 + i * 0.22, 0.75 + i * 0.22], [0, i % 3 === 2 ? 300 : 460], easeOutCubic)}px`; });
      $$(root, '.scrib').forEach((s, i) => tf(s, { s: interp(local, [1 + i * 0.4, 1.25 + i * 0.4], [0.4, 1], easeOutBack), o: interp(local, [1 + i * 0.4, 1.2 + i * 0.4], [0, 1]), r: -6 }));
    },
  },

  logo: {
    html: () => `
      <div class="lglow" style="position:absolute;left:190px;top:330px;width:700px;height:700px;border-radius:50%;background:radial-gradient(circle,rgba(124,58,237,.45),rgba(124,58,237,0) 65%)"></div>
      <div class="lmark" style="position:absolute;left:340px;top:440px;width:400px;height:400px">${logoSVG('a')}</div>
      <div class="lword" style="position:absolute;left:0;right:0;top:960px">${wordmarkHTML(96)}</div>
      <div class="lline" style="position:absolute;left:340px;width:400px;top:1110px;height:2px;background:linear-gradient(90deg,transparent,#E8D5A3,transparent)"></div>
      <div class="tagline" style="position:absolute;left:0;right:0;top:1150px">${C.tagline}</div>`,
    render(root, local) {
      tf($(root, '.lmark'), { s: interp(local, [0, 0.8], [0.55, 1], easeOutBack), o: interp(local, [0, 0.3], [0, 1]), y: interp(local, [0.8, 3], [0, -14]) });
      tf($(root, '.lglow'), { s: interp(local, [0, 1.2], [0.6, 1.1], easeOutCubic) + 0.05 * Math.sin(local * 3), o: interp(local, [0, 0.6], [0, 1]) });
      const sp = $(root, '.sparkle');
      const flash = Math.exp(-Math.pow((local - 0.95) * 6, 2));
      sp.style.transform = `rotate(${local * 60}deg) scale(${0.4 + interp(local, [0.5, 0.9], [0, 0.6], easeOutBack) + flash * 0.5})`;
      sp.style.filter = `drop-shadow(0 0 ${6 + flash * 18}px #F1E3B8)`;
      tf($(root, '.lword'), { y: interp(local, [0.45, 1.05], [50, 0], easeOutCubic), o: interp(local, [0.45, 0.9], [0, 1]) });
      tf($(root, '.lline'), { s: interp(local, [0.9, 1.5], [0, 1], easeOutCubic), o: 1 });
      tf($(root, '.tagline'), { y: interp(local, [1.0, 1.5], [20, 0], easeOutCubic), o: interp(local, [1.0, 1.5], [0, 1]) });
    },
  },

  scan: {
    html: () => `
      ${headlineHTML(C.scan, 'Escáner Ultra Fast')}
      <div class="phone"><div class="notch"></div><div class="screen">
        <div class="appbar"><div class="t">Control de acceso<small>${CONFIG.event}</small></div><div class="bolt">⚡ ULTRA FAST</div></div>
        <div class="counterbar card"><div class="lbl">Llegadas</div><div class="num"><em class="cnt" style="font-style:normal">124</em> <span>/ 250</span></div></div>
        <div class="viewfinder">
          ${CONFIG.guests.map((g, i) => `<div class="pass" data-i="${i}">${qrSVG(100 + i)}</div>`).join('')}
          <div class="corner c1"></div><div class="corner c2"></div><div class="corner c3"></div><div class="corner c4"></div>
          <div class="scanline"></div><div class="flash"></div>
        </div>
        <div class="result card">
          <div class="okdot">${check()}</div>
          <div><div class="who"><small>Bienvenidos</small><span class="gname"></span></div>
            <div class="meta"><span class="chip mute gtable"></span><span class="chip ok">CHECK-IN</span></div></div>
        </div>
      </div></div>`,
    render(root, local, t) {
      animHeadline(root, local);
      const phone = $(root, '.phone');
      const times = checkinTimes().map(x => x - SCENES.find(s => s.id === 'scan').start);
      let shake = 0;
      times.forEach(ci => { const d = local - ci; if (d >= 0 && d < 0.3) shake += Math.sin(d * 90) * 7 * (1 - d / 0.3); });
      tf(phone, { y: interp(local, [0, 0.7], [700, 0], easeOutCubic), x: shake, o: 1 });
      // Pases entrando y saliendo del visor
      const done = times.filter(ci => local >= ci).length;
      $$(root, '.pass').forEach((p, i) => {
        const ci = times[i];
        const yIn = interp(local, [ci - 0.95, ci - 0.35], [520, 0], easeOutCubic);
        const yOut = interp(local, [ci + 0.35, ci + 0.75], [0, -520], easeInOutCubic);
        tf(p, { y: yIn + yOut, r: interp(local, [ci - 0.95, ci - 0.35], [8, 0], easeOutCubic), s: 1, o: local > ci - 1 && local < ci + 0.8 ? 1 : 0 });
      });
      // Línea de escaneo y esquinas
      const sl = $(root, '.scanline');
      sl.style.top = `${200 + Math.sin(local * 5.5) * 170}px`;
      const recent = times.some(ci => local >= ci && local < ci + 0.45);
      $$(root, '.corner').forEach(c => { c.style.borderColor = recent ? '#22C55E' : '#E8D5A3'; });
      sl.style.opacity = recent ? 0 : 1;
      const lastCi = times[Math.max(0, done - 1)];
      $(root, '.flash').style.opacity = done ? interp(local, [lastCi, lastCi + 0.25], [0.55, 0]) : 0;
      // Contador y tarjeta de resultado
      const cnt = $(root, '.cnt');
      cnt.textContent = 124 + done;
      tf(cnt, { s: done ? interp(local, [lastCi, lastCi + 0.3], [1.35, 1], easeOutCubic) : 1 });
      cnt.style.display = 'inline-block';
      const res = $(root, '.result');
      if (done) {
        const g = CONFIG.guests[done - 1];
        $(res, '.gname').textContent = g.name;
        $(res, '.gtable').textContent = `Mesa ${g.table}${g.plus ? ` · +${g.plus}` : ''}`;
        tf(res, { y: interp(local, [lastCi, lastCi + 0.3], [done === 1 ? 260 : 24, 0], easeOutBack), o: done === 1 ? interp(local, [lastCi, lastCi + 0.2], [0, 1]) : 1 });
        tf($(res, '.okdot'), { s: interp(local, [lastCi, lastCi + 0.35], [0.5, 1], easeOutBack) });
      } else tf(res, { y: 260, o: 0 });
    },
  },

  invite: {
    html: () => {
      const rows = [['Valeria Ortiz', 'VO'], ['Familia Ramírez', 'FR'], ['Carlos Mendoza', 'CM'], ['Daniela Ruiz', 'DR'], ['Familia Herrera', 'FH']];
      return `
      ${headlineHTML(C.invite, 'Invitaciones')}
      <div class="invite-card">
        <div style="flex:1"><div style="font-size:20px;letter-spacing:6px;color:#C8B78A;font-weight:700;margin-bottom:12px">NUESTRA BODA</div>
          <div class="names">Sofía &amp; Andrés</div><div class="date">12 · DIC · 2026</div><div class="mini">Pase para 4 · Mesa 4</div></div>
        <div class="qrbox">${qrSVG(55)}</div>
        <div class="rsvp chip ok" style="position:absolute;right:-24px;top:-30px;font-size:24px;padding:14px 24px;background:#0F2A1B;border:2px solid #22C55E">${check('#22C55E', 28)} RSVP · Confirmado</div>
      </div>
      <div class="queue card">
        <h5>Cola de envíos · WhatsApp <span class="qcount">0/5 enviados</span></h5>
        ${rows.map(([n, a], i) => `<div class="qrow"><div class="avatar" style="background:${i % 2 ? '#C8B78A' : '#E8D5A3'}">${a}</div>
          <div class="n">${n}<small>Invitación web + pase QR</small></div>
          <div class="st"><span class="chip pend">En cola</span><span class="chip ok">${check('#22C55E', 22)} Enviado</span></div></div>`).join('')}
        <div class="progress"><i></i></div>
      </div>`;
    },
    render(root, local) {
      animHeadline(root, local);
      tf($(root, '.invite-card'), { x: interp(local, [0.15, 0.75], [700, 0], easeOutCubic), r: interp(local, [0.15, 0.75], [8, -2.5], easeOutCubic), o: interp(local, [0.15, 0.5], [0, 1]) });
      tf($(root, '.queue'), { y: interp(local, [0.35, 0.95], [500, 0], easeOutCubic), o: interp(local, [0.35, 0.7], [0, 1]) });
      let sent = 0;
      $$(root, '.qrow').forEach((row, i) => {
        const ts = 1.0 + i * 0.42;
        const [pend, ok] = $$(row, '.chip');
        const k = interp(local, [ts, ts + 0.2], [0, 1]);
        tf(pend, { y: -20 * k, o: 1 - k });
        tf(ok, { y: 20 * (1 - k), s: interp(local, [ts, ts + 0.3], [0.7, 1], easeOutBack), o: k });
        if (local >= ts) sent++;
      });
      $(root, '.qcount').textContent = `${sent}/5 enviados`;
      $(root, '.progress i').style.width = `${interp(local, [1.0, 1.0 + 4 * 0.42 + 0.2], [0, 100])}%`;
      tf($(root, '.rsvp'), { s: interp(local, [2.9, 3.25], [0.3, 1], easeOutBack), o: interp(local, [2.9, 3.05], [0, 1]), r: 4 });
    },
  },

  tables: {
    html: () => {
      const T = [[150, 330], [150, 560], [150, 790], [790, 330], [790, 560], [790, 790], [350, 830], [590, 830]];
      const order = [1, 2, 3, 4, 5, 6, 7, 8];
      // Numeración: izquierda 1-3, derecha 4-6, abajo 7-8. Mesa 4 = derecha arriba.
      let seats = '', tables = '';
      T.forEach(([cx, cy], ti) => {
        tables += `<circle cx="${cx}" cy="${cy}" r="62" fill="#1B1F2B" stroke="#262B3A" stroke-width="3" class="tbl" data-t="${order[ti]}"/>
          <text x="${cx}" y="${cy + 16}" text-anchor="middle" font-family="Playfair Display" font-weight="700" font-size="44" fill="#F1E3B8">${order[ti]}</text>`;
        for (let k = 0; k < 8; k++) {
          const a = (k / 8) * Math.PI * 2 - Math.PI / 2;
          seats += `<circle class="seat" data-t="${ti}" cx="${(cx + Math.cos(a) * 92).toFixed(1)}" cy="${(cy + Math.sin(a) * 92).toFixed(1)}" r="15" fill="#161922" stroke="#3A4054" stroke-width="3"/>`;
        }
      });
      return `
      ${headlineHTML(C.tables, 'Croquis del salón')}
      <div class="floor card">
        <svg viewBox="0 0 940 980" width="940" height="980">
          <defs><pattern id="dots" width="34" height="34" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="2" fill="#262B3A"/></pattern></defs>
          <rect width="940" height="980" fill="url(#dots)"/>
          <rect x="290" y="120" width="360" height="74" rx="20" fill="rgba(232,213,163,.1)" stroke="#C8B78A" stroke-width="2.5"/>
          <text x="470" y="167" text-anchor="middle" font-family="Plus Jakarta Sans" font-weight="700" font-size="26" letter-spacing="3" fill="#E8D5A3">MESA DE HONOR</text>
          <rect x="330" y="300" width="280" height="390" rx="24" fill="rgba(124,58,237,.10)" stroke="#7C3AED" stroke-dasharray="10 10" stroke-width="2.5"/>
          <text x="470" y="505" text-anchor="middle" font-family="Plus Jakarta Sans" font-weight="800" font-size="30" letter-spacing="6" fill="#A78BFA">PISTA</text>
          ${tables}${seats}
          <circle class="hlring" cx="790" cy="330" r="118" fill="none" stroke="#E8D5A3" stroke-width="4" opacity="0"/>
          <g class="dragger"><circle r="30" fill="#E8D5A3"/><text y="9" text-anchor="middle" font-family="Plus Jakarta Sans" font-weight="800" font-size="24" fill="#0D0E15">FR</text></g>
        </svg>
        <div class="floorchip chip dark">Asignados <b class="acount" style="color:#F1E3B8;margin-left:6px">0</b>&nbsp;/ 250</div>
        <div class="tip" style="left:330px;top:205px">Mesa 4 · Familia Ramírez<small>4 lugares asignados</small></div>
      </div>`;
    },
    render(root, local) {
      animHeadline(root, local);
      tf($(root, '.floor'), { y: interp(local, [0.1, 0.7], [400, 0], easeOutCubic), s: interp(local, [0.1, 0.7], [0.94, 1], easeOutCubic), o: interp(local, [0.1, 0.45], [0, 1]) });
      const seats = $$(root, '.seat');
      const r = rng(3); const delays = seats.map(() => r());
      let filled = 0;
      seats.forEach((s, i) => {
        const ti = +s.dataset.t; const k = i % 8;
        // Mesa índice 3 (= Mesa 4): sólo 4 lugares, el último lo ocupa el arrastre.
        const skip = (ti === 3 && k >= 4) || (r() < 0.12 && ti !== 3);
        const ts = ti === 3 && k === 3 ? 2.25 : 0.7 + delays[i] * 1.5;
        const on = !skip && local >= ts;
        if (on) filled++;
        s.setAttribute('fill', on ? '#7C3AED' : '#161922');
        s.setAttribute('stroke', on ? '#A78BFA' : '#3A4054');
        s.setAttribute('r', on ? 15 * interp(local, [ts, ts + 0.2], [1.5, 1], easeOutCubic) : 15);
      });
      $(root, '.acount').textContent = counterAt(local, 0.7, 2.4, 0, 186);
      // Invitado arrastrado hasta la Mesa 4
      const a = (3 / 8) * Math.PI * 2 - Math.PI / 2;
      const tx = 790 + Math.cos(a) * 92, ty = 330 + Math.sin(a) * 92;
      const k = interp(local, [1.5, 2.25], [0, 1], easeInOutCubic);
      const x = 470 + (tx - 470) * k, y = 860 - (860 - ty) * k - Math.sin(k * Math.PI) * 160;
      const dg = $(root, '.dragger');
      dg.setAttribute('transform', `translate(${x} ${y}) scale(${interp(local, [1.3, 1.5], [0, 1.15], easeOutBack) * interp(local, [2.2, 2.3], [1, 0.5])})`);
      dg.style.opacity = local < 2.3 ? 1 : 0;
      $(root, '.hlring').setAttribute('opacity', interp(local, [2.3, 2.6], [0, 1]));
      tf($(root, '.tip'), { y: interp(local, [2.4, 2.8], [20, 0], easeOutCubic), o: interp(local, [2.4, 2.7], [0, 1]) });
    },
  },

  live: {
    html: () => `
      ${headlineHTML(C.live, 'Control en vivo')}
      <div class="dash card">
        <div class="top"><div><b>${CONFIG.event}</b><small>Salón Los Arcos · 20:42</small></div><div class="live"><i></i>EN VIVO</div></div>
        <div class="ringwrap">
          <svg viewBox="0 0 400 400" width="400" height="400" style="transform:rotate(-90deg)">
            <defs><linearGradient id="rg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7928CA"/><stop offset="1" stop-color="#A78BFA"/></linearGradient></defs>
            <circle cx="200" cy="200" r="170" fill="none" stroke="#20242F" stroke-width="30"/>
            <circle class="ring" cx="200" cy="200" r="170" fill="none" stroke="url(#rg)" stroke-width="30" stroke-linecap="round" stroke-dasharray="1068.1" stroke-dashoffset="1068.1"/>
          </svg>
          <div class="center"><div><div class="pct">0%</div><div class="sub"><b class="arr" style="color:#fff">0</b> de 250 invitados</div></div></div>
        </div>
        <div class="kpis">
          <div class="kpi"><div class="k"><i style="background:#22C55E"></i>Llegaron</div><div class="v k1">0</div></div>
          <div class="kpi"><div class="k"><i style="background:#F59E0B"></i>Pendientes</div><div class="v k2">250</div></div>
          <div class="kpi"><div class="k"><i style="background:#E8D5A3"></i>Mesas</div><div class="v k3">0/28</div></div>
        </div>
        <div class="feed">
          ${[['20:42', 'Valeria Ortiz', 'Mesa 7'], ['20:42', 'Familia Ramírez', 'Mesa 4'], ['20:41', 'Carlos Mendoza', 'Mesa 2'], ['20:41', 'Daniela Ruiz', 'Mesa 9']]
            .map(([h, n, m]) => `<div class="frow"><span class="time">${h}</span><span class="d"></span>${n}<span class="m">${m}</span></div>`).join('')}
        </div>
      </div>`,
    render(root, local) {
      animHeadline(root, local);
      tf($(root, '.dash'), { y: interp(local, [0.1, 0.7], [400, 0], easeOutCubic), o: interp(local, [0.1, 0.45], [0, 1]) });
      const p = interp(local, [0.5, 2.4], [0, 0.868], easeOutCubic);
      $(root, '.ring').setAttribute('stroke-dashoffset', (1068.1 * (1 - p)).toFixed(1));
      const arrived = counterAt(local, 0.5, 2.4, 0, 217);
      $(root, '.pct').textContent = `${Math.round(p * 100)}%`;
      $(root, '.arr').textContent = arrived;
      $(root, '.k1').textContent = arrived;
      $(root, '.k2').textContent = 250 - arrived;
      $(root, '.k3').textContent = `${counterAt(local, 0.5, 2.4, 0, 26)}/28`;
      $(root, '.live i').style.opacity = 0.35 + 0.65 * (0.5 + 0.5 * Math.cos(local * 7));
      // Feed: cada nueva llegada empuja las filas hacia abajo
      const rows = $$(root, '.frow');
      const arrivals = [1.0, 1.6, 2.2];
      rows.forEach((row, i) => {
        // fila 0 = más reciente; la fila 3 ya estaba al inicio.
        const appear = i < 3 ? arrivals[2 - i] : -1;
        const pos = arrivals.filter(a => a > appear).reduce((acc, a) => acc + interp(local, [a, a + 0.3], [0, 1], easeOutCubic), 0);
        tf(row, { y: pos * 76, o: local >= appear ? interp(local, [appear, appear + 0.25], [0, 1]) : 0 });
      });
    },
  },

  segments: {
    html: () => {
      const ic = {
        'Boda': '<circle cx="9" cy="14" r="5.5"/><circle cx="15" cy="14" r="5.5"/><path d="M10 5l2-2 2 2-2 2z"/>',
        'XV años': '<path d="M3 17l2-10 4.5 5L12 5l2.5 7L19 7l2 10z"/><path d="M3 20h18"/>',
        'Graduación': '<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c3 2.5 9 2.5 12 0v-5"/><path d="M22 9v6"/>',
        'Fiesta infantil': '<ellipse cx="12" cy="9" rx="5.5" ry="6.5"/><path d="M12 15.5l-1 1.5h2zM12 17c0 2-2 2.5-1 5"/>',
        'Ejecutivo': '<rect x="3" y="7" width="18" height="13" rx="2.5"/><path d="M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2M3 12h18"/>',
        'Privado': '<rect x="5" y="10.5" width="14" height="10" rx="2.5"/><path d="M8 10.5V8a4 4 0 018 0v2.5"/><circle cx="12" cy="15.5" r="1.3"/>',
      };
      return `${headlineHTML(C.segments, 'Un fondo para cada evento')}
      <div class="seg-grid">${CONFIG.segments.map(s => `<div class="seg"><div class="hl"></div><div class="ic"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#E8D5A3" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${ic[s]}</svg></div><div class="lb">${s}</div></div>`).join('')}</div>`;
    },
    render(root, local) {
      animHeadline(root, local);
      $$(root, '.seg').forEach((s, i) => {
        const ts = 0.25 + i * 0.12;
        tf(s, { y: interp(local, [ts, ts + 0.45], [80, 0], easeOutCubic), s: interp(local, [ts, ts + 0.45], [0.85, 1], easeOutBack), o: interp(local, [ts, ts + 0.3], [0, 1]) });
        const hs = 1.25 + i * 0.22;
        $(s, '.hl').style.opacity = Math.max(interp(local, [hs, hs + 0.15], [0, 1]) * interp(local, [hs + 0.35, hs + 0.6], [1, 0]), i === 0 ? interp(local, [2.6, 2.9], [0, 1]) : 0);
      });
    },
  },

  cta: {
    html: () => `
      <div class="cglow" style="position:absolute;left:240px;top:200px;width:600px;height:600px;border-radius:50%;background:radial-gradient(circle,rgba(124,58,237,.45),rgba(124,58,237,0) 65%)"></div>
      <div class="cmark" style="position:absolute;left:390px;top:300px;width:300px;height:300px">${logoSVG('b')}</div>
      <div class="cword" style="position:absolute;left:0;right:0;top:700px">${wordmarkHTML(84)}</div>
      <div class="tagline ctag" style="position:absolute;left:0;right:0;top:840px;font-size:28px">${C.tagline}</div>
      <div class="cmain" style="position:absolute;left:0;right:0;top:1180px;text-align:center;font-family:var(--serif);font-weight:700;font-size:112px;color:#F1E3B8;line-height:1">${C.ctaMain}</div>
      <div class="cbtn" style="position:absolute;left:0;right:0;top:1350px;text-align:center"><span class="btn">${C.ctaSub}</span></div>
      ${CONFIG.showPricing ? `<div class="cprice" style="position:absolute;left:0;right:0;top:1510px;text-align:center;font-size:32px;font-weight:600;color:#C8B78A">${C.ctaPricing}</div>` : ''}`,
    render(root, local) {
      tf($(root, '.cmark'), { s: interp(local, [0, 0.7], [0.6, 1], easeOutBack), o: interp(local, [0, 0.3], [0, 1]) });
      tf($(root, '.cglow'), { s: 1 + 0.06 * Math.sin(local * 2.5), o: interp(local, [0, 0.6], [0, 1]) });
      const sp = $(root, '.sparkle');
      sp.style.transform = `rotate(${local * 50}deg) scale(${0.9 + 0.25 * Math.sin(local * 4)})`;
      tf($(root, '.cword'), { y: interp(local, [0.25, 0.8], [40, 0], easeOutCubic), o: interp(local, [0.25, 0.7], [0, 1]) });
      tf($(root, '.ctag'), { o: interp(local, [0.6, 1.1], [0, 1]) });
      tf($(root, '.cmain'), { y: interp(local, [0.8, 1.35], [50, 0], easeOutCubic), o: interp(local, [0.8, 1.25], [0, 1]) });
      tf($(root, '.cbtn'), { s: interp(local, [1.2, 1.7], [0.7, 1], easeOutBack) * (1 + 0.025 * Math.sin(Math.max(0, local - 1.7) * 5)), o: interp(local, [1.2, 1.5], [0, 1]) });
      const pr = $(root, '.cprice'); if (pr) tf(pr, { o: interp(local, [1.6, 2], [0, 1]) });
    },
  },
};

/* ---------- Montaje ---------- */

const stage = document.getElementById('stage');
stage.innerHTML = `
  <div class="bg-glow" id="glow"></div>
  <div id="particles">${(() => { const r = rng(42); return Array.from({ length: 46 }, () => {
    const s = 2 + r() * 5; return `<i class="dust" data-x="${r() * 1080}" data-y="${r() * 1920}" data-v="${10 + r() * 30}" data-ph="${r() * 6.28}" style="width:${s}px;height:${s}px"></i>`; }).join(''); })()}</div>
  ${SCENES.map(s => `<section class="scene" id="s-${s.id}">${scenes[s.id].html()}</section>`).join('')}`;

const dust = $$(stage, '.dust');
const glow = document.getElementById('glow');
const roots = Object.fromEntries(SCENES.map(s => [s.id, document.getElementById(`s-${s.id}`)]));

window.renderAt = (t) => {
  // Fondo vivo
  const gx = 50 + 18 * Math.sin(t * 0.35), gy = 38 + 12 * Math.cos(t * 0.27);
  glow.style.background = `radial-gradient(900px 900px at ${gx}% ${gy}%, rgba(124,58,237,.20), transparent 70%), radial-gradient(700px 700px at ${100 - gx}% ${100 - gy * 0.6}%, rgba(232,213,163,.07), transparent 70%)`;
  dust.forEach(d => {
    const y = ((+d.dataset.y - t * +d.dataset.v) % 1920 + 1920) % 1920;
    d.style.transform = `translate(${+d.dataset.x + Math.sin(t * 0.6 + +d.dataset.ph) * 14}px, ${y}px)`;
    d.style.opacity = 0.12 + 0.3 * (0.5 + 0.5 * Math.sin(t * 1.7 + +d.dataset.ph));
  });
  for (const s of SCENES) {
    const el = roots[s.id];
    const active = t >= s.start - 0.001 && t <= s.end;
    if (!active) { el.style.display = 'none'; continue; }
    el.style.display = 'block';
    const f = fadeInOut(s, t);
    el.style.opacity = f;
    el.style.transform = `scale(${0.97 + 0.03 * f})`;
    scenes[s.id].render(el, clamp(t - s.start, 0, s.end - s.start), t, sceneProgress(s, t));
  }
};

window.__ready = document.fonts.ready.then(() => { window.renderAt(0); return true; });
