(() => {
'use strict';
const N = window.NEGOCIO;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const RM = matchMedia('(prefers-reduced-motion: reduce)');
let LANG = 'es';

/* ---------- textos de la interfaz que se pintan desde JS ---------- */
const UI = {
  es: {
    dias: ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'],
    diasLargo: ['domingo','lunes','martes','miércoles','jueves','viernes','sábado'],
    hoy: 'Hoy', manana: 'Mañana',
    libres: n => n === 1 ? 'queda 1 lugar' : `quedan ${n} lugares`,
    llena: 'Llena', reservar: 'Reservar', espera: 'Lista de espera', consulta: 'Ver lugares',
    vivo: t => `En vivo desde Fitco · ${t}`, ref: 'Horario de referencia · confirma lugares en Fitco',
    conCoach: c => `con ${c}`,
    sinClases: 'No quedan clases este día. Revisa el siguiente.',
    proxima: (d, h, f, n) => `Próxima clase: ${d} ${h} · ${n === 1 ? 'queda 1 lugar' : 'quedan ' + n + ' lugares'}`,
    proximaRef: (d, h, f) => `Próxima clase: ${d} ${h}`,
    clases: n => n === 1 ? '1 clase' : `${n} clases`,
    ilimitado: 'Ilimitado', porClase: p => `${p} por clase`, comprar: 'Comprar',
    abierto: c => `Abierto ahora · cierra a las ${c}`, cerrado: (d, a) => `Cerrado ahora · abre ${d} a las ${a}`,
    cerradoDia: 'Sin clases', fotoDe: n => `Foto de ${n.split(' ')[0]}`,
    horarioClases: 'Horario de clases'
  },
  en: {
    dias: ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],
    diasLargo: ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
    hoy: 'Today', manana: 'Tomorrow',
    libres: n => n === 1 ? '1 spot left' : `${n} spots left`,
    llena: 'Full', reservar: 'Book', espera: 'Join waitlist', consulta: 'Check spots',
    vivo: t => `Live from Fitco · ${t}`, ref: 'Reference schedule · confirm spots on Fitco',
    conCoach: c => `with ${c}`,
    sinClases: 'No classes left today. Check the next day.',
    proxima: (d, h, f, n) => `Next class: ${d} ${h} · ${n === 1 ? '1 spot left' : n + ' spots left'}`,
    proximaRef: (d, h, f) => `Next class: ${d} ${h}`,
    clases: n => n === 1 ? '1 class' : `${n} classes`,
    ilimitado: 'Unlimited', porClase: p => `${p} per class`, comprar: 'Buy',
    abierto: c => `Open now · closes at ${c}`, cerrado: (d, a) => `Closed now · opens ${d} at ${a}`,
    cerradoDia: 'No classes', fotoDe: n => `${n.split(' ')[0]}'s photo here`,
    horarioClases: 'Class hours'
  }
};
const u = () => UI[LANG];

/* ---------- hora de Los Cabos ---------- */
function ahoraEn(tz, d = new Date()) {
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', weekday: 'short', hourCycle: 'h23' })
    .formatToParts(d).map(x => [x.type, x.value]));
  const dow = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(p.weekday);
  return { fecha: `${p.year}-${p.month}-${p.day}`, dow, min: (+p.hour) * 60 + (+p.minute), y: +p.year, m: +p.month, d: +p.day };
}
const aMin = h => { const [a, b] = h.split(':').map(Number); return a * 60 + b; };
const addDays = (fecha, n) => { const [y, m, d] = fecha.split('-').map(Number); const t = new Date(Date.UTC(y, m - 1, d + n)); return t.toISOString().slice(0, 10); };
const dowDe = fecha => { const [y, m, d] = fecha.split('-').map(Number); return new Date(Date.UTC(y, m - 1, d)).getUTCDay(); };
function hora(h) {
  const [a, b] = h.split(':').map(Number);
  const ap = a >= 12 ? 'pm' : 'am'; const h12 = ((a + 11) % 12) + 1;
  return { n: `${h12}:${String(b).padStart(2, '0')}`, ap: LANG === 'en' ? ap.toUpperCase() : ap };
}
const horaTxt = h => { const x = hora(h); return `${x.n} ${x.ap}`; };
const money = v => new Intl.NumberFormat(LANG === 'en' ? 'en-US' : 'es-MX', { style: 'currency', currency: N.moneda, maximumFractionDigits: 0 }).format(v);

/* ---------- links ---------- */
const waLink = (msg) => `https://wa.me/${N.whatsapp}?text=${encodeURIComponent(msg[LANG])}`;
const dirLink = () => `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(N.mapa_query)}`;
function pintarLinks() {
  $$('.js-wa').forEach(a => a.href = waLink(N.wa_mensaje));
  $$('.js-wa-privada').forEach(a => a.href = waLink(N.wa_privada));
  $$('.js-wa-cel').forEach(a => a.href = waLink(N.wa_celebracion));
  $$('.js-prueba').forEach(a => a.href = N.fitco.comprar(N.prueba.id));
  $$('.js-fitco-horario').forEach(a => a.href = N.fitco.horario);
  $$('.js-dir').forEach(a => a.href = dirLink());
  $$('.js-tel').forEach(a => a.href = 'tel:' + N.telefono);
  $$('.js-maps').forEach(a => a.href = N.maps_url);
}

/* ---------- la semana ---------- */
function pintarSemana() {
  const hoy = ahoraEn(N.zona_horaria).dow;
  $('#semanaGrid').innerHTML = [1, 2, 3, 4, 5, 6].map(d => {
    const e = N.enfoques[d];
    const hs = (N.horario_clases[d] || []).map(x => x[0]);
    const rango = hs.length ? `${horaTxt(hs[0])} a ${horaTxt(hs[hs.length - 1])}`.replace(' a ', LANG === 'en' ? ' to ' : ' a ') : '';
    return `<article class="dia rv${d === hoy ? ' hoy' : ''}"><span class="mono">${u().diasLargo[d]}<span class="hoy-tag mono">· ${u().hoy}</span></span><h3>${e[LANG]}</h3><p>${e.nota[LANG]}</p><p class="mono" style="margin-top:12px;font-size:13px">${rango}</p></article>`;
  }).join('');
  observar($$('#semanaGrid .rv'));
}

/* ---------- horario en vivo (la firma) ---------- */
let DIAS = [];          // [{fecha, dow, clases:[{h, foco, coach, libres, cupo, llena}]}]
let VIVO = false;
let ACTUAL = null;
let actualizado = '';

function enfoqueTxt(nombre, dow) {
  const n = (nombre || '').toUpperCase();
  const map = [['INFERIOR', 2], ['SUPERIOR', 4], ['JUMP', 3], ['FLEX', 5], ['FULL', 1]];
  for (const [k, d] of map) if (n.includes(k)) return N.enfoques[d][LANG];
  if (n.includes('MEN')) return "Men's Reformer";
  if (n.includes('PRIVADA')) return LANG === 'en' ? 'Private class' : 'Clase privada';
  return (N.enfoques[dow] || {})[LANG] || 'Reformer';
}
const limpiarNombre = s => (s || '').replace(/\s+/g, ' ').trim();

async function cargarHorario() {
  const now = ahoraEn(N.zona_horaria);
  const desde = now.fecha, hasta = addDays(now.fecha, 6);
  try {
    const ctrl = new AbortController(); const to = setTimeout(() => ctrl.abort(), 8000);
    const url = `${N.fitco.api}?from=${encodeURIComponent(JSON.stringify(desde))}&to=${encodeURIComponent(JSON.stringify(hasta))}&establishmentId=${N.fitco.establecimiento}`;
    const r = await fetch(url, { signal: ctrl.signal }); clearTimeout(to);
    if (!r.ok) throw new Error(r.status);
    const j = await r.json();
    const por = {};
    for (const l of (j.lessons || [])) {
      if (l.status && l.status !== '0') continue;
      const f = (l.dateLesson || '').slice(0, 10);
      (por[f] = por[f] || []).push({
        h: (l.startTime || '').slice(0, 5), nombre: l.disciplineName,
        coach: limpiarNombre(l.instructors && l.instructors[0] && l.instructors[0].instructorName),
        cupo: l.capacity || N.cupo, libres: Math.max(0, (l.capacity || N.cupo) - (l.reserves || 0)), llena: l.classFull === 1 || (l.reserves >= l.capacity)
      });
    }
    DIAS = Object.keys(por).sort().filter(f => f >= desde && f <= hasta).map(f => ({ fecha: f, dow: dowDe(f), clases: por[f].sort((a, b) => a.h.localeCompare(b.h)) }));
    if (!DIAS.length) throw new Error('vacío');
    VIVO = true;
    actualizado = horaTxt(`${String(Math.floor(now.min / 60)).padStart(2, '0')}:${String(now.min % 60).padStart(2, '0')}`);
  } catch (e) {
    VIVO = false;
    DIAS = [];
    for (let i = 0; i < 7; i++) {
      const f = addDays(desde, i), d = dowDe(f);
      const cl = (N.horario_clases[d] || []).map(([h, c]) => ({ h, nombre: '', coach: c, cupo: N.cupo, libres: null, llena: false }));
      if (cl.length) DIAS.push({ fecha: f, dow: d, clases: cl });
    }
  }
  pintarHorario();
}

function clasesFuturas(dia) {
  const now = ahoraEn(N.zona_horaria);
  if (dia.fecha !== now.fecha) return dia.clases;
  return dia.clases.filter(c => aMin(c.h) > now.min);
}
function etiquetaDia(dia) {
  const now = ahoraEn(N.zona_horaria);
  if (dia.fecha === now.fecha) return u().hoy;
  if (dia.fecha === addDays(now.fecha, 1)) return u().manana;
  return u().dias[dia.dow];
}

let firmaHorario = '';
function pintarHorario() {
  const visiblesSig = DIAS.map(d => d.fecha + ':' + clasesFuturas(d).map(c => c.h + c.libres).join(',')).join('|');
  const sig = LANG + VIVO + actualizado + visiblesSig;
  if (sig === firmaHorario) return; firmaHorario = sig;
  const est = $('#estado');
  est.classList.toggle('ref', !VIVO);
  $('#estadoTxt').textContent = VIVO ? u().vivo(actualizado) : u().ref;
  const visibles = DIAS.filter(d => clasesFuturas(d).length);
  if (!ACTUAL || !visibles.find(d => d.fecha === ACTUAL)) ACTUAL = visibles.length ? visibles[0].fecha : null;
  $('#tabs').innerHTML = visibles.map(d => {
    const n = +d.fecha.slice(8, 10);
    return `<button class="tab" role="tab" type="button" data-f="${d.fecha}" aria-selected="${d.fecha === ACTUAL}"><span>${etiquetaDia(d)}</span><b>${n}</b></button>`;
  }).join('');
  pintarDia();
  pintarProxima(visibles);
}

function pintarDia() {
  const dia = DIAS.find(d => d.fecha === ACTUAL);
  const panel = $('#panelDia');
  if (!dia) { panel.innerHTML = `<p class="vacio">${u().sinClases}</p>`; return; }
  const e = N.enfoques[dia.dow];
  const items = clasesFuturas(dia).map((c, i) => {
    const t = hora(c.h);
    const camas = Array.from({ length: c.cupo }, (_, k) => {
      if (c.libres === null) return '<span class="cama ni"></span>';
      return `<span class="cama${k < c.libres ? ' libre' : ''}"></span>`;
    }).join('');
    const txt = c.libres === null ? '' : (c.libres ? u().libres(c.libres) : u().llena);
    const accion = c.libres === null ? u().consulta : (c.libres ? u().reservar : u().espera);
    const foco = c.nombre ? enfoqueTxt(c.nombre, dia.dow) : e[LANG];
    const label = `${etiquetaDia(dia)} ${t.n} ${t.ap}, ${foco}. ${txt}`;
    return `<li class="clase${c.libres === 0 ? ' llena' : ''}" style="animation-delay:${i * 60}ms">
      <time datetime="${dia.fecha}T${c.h}">${t.n}<small>${t.ap}</small></time>
      <div class="quien"><b>${foco}</b>${u().conCoach(c.coach.split(' ')[0])} · ${N.duracion} min</div>
      <div class="camas" role="img" aria-label="${txt || accion}">${camas}<span class="camas-txt" aria-hidden="true">${txt}</span></div>
      <a class="btn ${c.libres === 0 ? 'btn-ghost' : 'btn-main'}" href="${N.fitco.horario}" target="_blank" rel="noopener" aria-label="${accion}: ${label}">${accion}</a>
    </li>`;
  }).join('');
  panel.innerHTML = `<div class="dia-foco"><h3>${e ? e[LANG] : ''}</h3><p>${e ? e.nota[LANG] : ''}</p></div><ul class="clases">${items}</ul>`;
}

function pintarProxima(visibles) {
  const el = $('#next');
  for (const d of visibles) for (const c of clasesFuturas(d)) {
    if (c.libres === 0) continue;
    const foco = c.nombre ? enfoqueTxt(c.nombre, d.dow) : N.enfoques[d.dow][LANG];
    const dl = etiquetaDia(d); const dTxt = dl === u().dias[d.dow] ? u().diasLargo[d.dow] : dl.toLowerCase();
    el.innerHTML = '<span class="dot" aria-hidden="true"></span><span>' + (c.libres === null ? u().proximaRef(dTxt, horaTxt(c.h), foco) : u().proxima(dTxt, horaTxt(c.h), foco, c.libres)) + '</span>';
    return;
  }
  el.innerHTML = '';
}

$('#tabs').addEventListener('click', e => {
  const b = e.target.closest('.tab'); if (!b) return;
  ACTUAL = b.dataset.f;
  $$('.tab').forEach(t => t.setAttribute('aria-selected', t === b));
  pintarDia();
});
$('#tabs').addEventListener('keydown', e => {
  if (!['ArrowRight', 'ArrowLeft'].includes(e.key)) return;
  const tabs = $$('.tab'); const i = tabs.findIndex(t => t.getAttribute('aria-selected') === 'true');
  const n = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
  n.focus(); n.click();
});

/* ---------- planes ---------- */
function pintarPlanes() {
  $('#ledger').innerHTML = N.planes.map(p => {
    const nombre = p.ilimitado ? u().ilimitado : u().clases(p.clases);
    const pc = !p.ilimitado && p.clases > 1 ? u().porClase(money(Math.round(p.precio / p.clases))) : '';
    return `<li class="fila"><h3>${nombre}</h3><span class="p">${money(p.precio).replace(/\s?MXN/, '')}<small>MXN</small></span>
      <span class="x"><b>${pc || '&nbsp;'}</b>${p.vigencia[LANG]}</span>
      <a class="buy" href="${N.fitco.comprar(p.id)}" target="_blank" rel="noopener" aria-label="${u().comprar} ${nombre}">${u().comprar} <svg class="arrow" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M2 8h11M9 4l4 4-4 4"/></svg></a></li>`;
  }).join('');
}

/* ---------- coaches y reseñas ---------- */
function pintarCoaches() {
  $('#coaches').innerHTML = N.coaches.map(c => `<article class="coach rv"><div class="ph">${c.foto ? `<img src="${c.foto}" alt="${c.nombre}" loading="lazy">` : `<span>${u().fotoDe(c.nombre)}</span>`}</div><h3>${c.nombre}</h3><p>${c.rol[LANG]}</p></article>`).join('');
  observar($$('#coaches .rv'));
}
function pintarResenas() {
  $('#resenasGrid').innerHTML = N.resenas.map(r => `<figure class="resena rv"><blockquote lang="es">${r.texto}</blockquote><cite>${r.nombre} · Google</cite></figure>`).join('');
  observar($$('#resenasGrid .rv'));
}

/* ---------- horario del estudio y "abierto ahora" ---------- */
function turnosDe(fecha, dow) { return (N.cierres_especiales && fecha in N.cierres_especiales) ? N.cierres_especiales[fecha] : (N.horario[dow] || []); }
function pintarAbierto() {
  const now = ahoraEn(N.zona_horaria);
  let abierto = null;
  for (const [a, c] of turnosDe(now.fecha, now.dow)) if (now.min >= aMin(a) && now.min < aMin(c)) abierto = c;
  const el = $('#abierto'); el.classList.toggle('si', !!abierto);
  if (abierto) { $('#abiertoTxt').textContent = u().abierto(horaTxt(abierto)); }
  else {
    let txt = '';
    for (let i = 0; i < 8 && !txt; i++) {
      const f = addDays(now.fecha, i), d = dowDe(f);
      for (const [a] of turnosDe(f, d)) { if (i > 0 || aMin(a) > now.min) { txt = u().cerrado(i === 0 ? u().hoy.toLowerCase() : i === 1 ? u().manana.toLowerCase() : u().diasLargo[d], horaTxt(a)); break; } }
    }
    $('#abiertoTxt').textContent = txt;
  }
  $('#hrs').innerHTML = [1, 2, 3, 4, 5, 6, 0].map(d => {
    const t = N.horario[d] || [];
    return `<li class="${d === now.dow ? 'hoy' : ''}"><span>${u().diasLargo[d][0].toUpperCase() + u().diasLargo[d].slice(1)}</span><span>${t.length ? t.map(([a, c]) => `${horaTxt(a)} a ${horaTxt(c)}`.replace(' a ', LANG === 'en' ? ' to ' : ' a ')).join(' · ') : u().cerradoDia}</span></li>`;
  }).join('');
}

/* ---------- idiomas ---------- */
const T = (() => {
  const orig = new Map(), origAttr = new Map();
  function apply(lang) {
    LANG = lang;
    const dict = (window.I18N && window.I18N[lang]) || null;
    $$('[data-t]').forEach(el => {
      if (!orig.has(el)) orig.set(el, el.textContent);
      el.textContent = dict && dict[el.dataset.t] ? dict[el.dataset.t] : orig.get(el);
    });
    $$('[data-t-attr]').forEach(el => {
      const [attr, key] = el.dataset.tAttr.split(':');
      if (!origAttr.has(el)) origAttr.set(el, el.getAttribute(attr));
      el.setAttribute(attr, dict && dict[key] ? dict[key] : origAttr.get(el));
    });
    document.documentElement.lang = lang;
    document.title = dict && dict['meta.title'] ? dict['meta.title'] : window.__TITLE;
    $$('.lang button').forEach(b => b.setAttribute('aria-pressed', b.dataset.lang === lang));
    try { localStorage.setItem('lang', lang); } catch (e) {}
    document.dispatchEvent(new CustomEvent('langchange', { detail: lang }));
  }
  return { apply };
})();
window.__TITLE = document.title;
$$('.lang button').forEach(b => b.addEventListener('click', () => T.apply(b.dataset.lang)));
document.addEventListener('langchange', () => { pintarLinks(); pintarSemana(); pintarHorario(); pintarPlanes(); pintarCoaches(); pintarResenas(); pintarAbierto(); });

/* ---------- entradas ---------- */
const io = new IntersectionObserver(entries => {
  let k = 0;
  entries.filter(e => e.isIntersecting).forEach(e => {
    const el = e.target;
    if (!RM.matches) el.style.transitionDelay = (Math.min(k++, 4) * 90) + 'ms';
    el.classList.add('in'); io.unobserve(el);
    setTimeout(() => { el.style.transitionDelay = ''; }, 1400);
  });
}, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
const pendientes = new Set();
function observar(list) { list.forEach(el => { if (!el.classList.contains('in')) { io.observe(el); pendientes.add(el); } }); }
let barrido = null;
addEventListener('scroll', () => {           /* respaldo: lo que un scroll muy rápido brincó, se muestra igual */
  clearTimeout(barrido);
  barrido = setTimeout(() => {
    for (const el of pendientes) {
      if (el.classList.contains('in')) { pendientes.delete(el); continue; }
      if (el.getBoundingClientRect().top < innerHeight) { el.classList.add('in'); io.unobserve(el); pendientes.delete(el); }
    }
  }, 120);
}, { passive: true });

/* ---------- hero: el video del estudio ---------- */
const GATES = [
  '(max-width: 720px)',
  '(orientation: portrait) and (max-width: 1024px)',
  '(orientation: portrait) and (pointer: coarse)',
  '(orientation: landscape) and (pointer: coarse) and (max-height: 560px)'
];
const MQLS = GATES.map(q => matchMedia(q));
const esMovil = () => MQLS.some(m => m.matches);
const saveData = !!(navigator.connection && navigator.connection.saveData);
const vid = $('#heroVideo'), arch = $('#arch');
let videoOn = false;
function aplicarVideo() {
  const want = !RM.matches && !saveData;
  if (want && !videoOn) {
    videoOn = true;
    if (!vid.getAttribute('src')) vid.src = 'assets/hero-estudio.mp4';
    vid.play().catch(() => {});
  } else if (!want && videoOn) {
    videoOn = false; vid.pause(); arch.classList.remove('playing');
  }
}
vid.addEventListener('playing', () => arch.classList.add('playing'));
vid.addEventListener('error', () => { vid.style.display = 'none'; });
new IntersectionObserver(([e]) => { if (!videoOn) return; e.isIntersecting ? vid.play().catch(() => {}) : vid.pause(); }).observe(arch);
document.addEventListener('visibilitychange', () => {
  document.body.classList.toggle('paused', document.hidden);
  if (videoOn) document.hidden ? vid.pause() : vid.play().catch(() => {});
});
RM.addEventListener('change', () => { aplicarVideo(); aplicarScroll(); });
if (document.readyState === 'complete') aplicarVideo(); else addEventListener('load', aplicarVideo, { once: true });

/* el arco crece apenas con el scroll en escritorio; solo transform */
const hero = $('.hero'), ghost = $('.ghost.g1');
let raf = null, scrollOn = false, lastS = -1;
function frame() {
  raf = null;
  const r = hero.getBoundingClientRect();
  const p = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height)));
  if (Math.abs(p - lastS) < 0.002) return; lastS = p;
  arch.style.transform = `translate3d(0,${(p * -40).toFixed(1)}px,0) scale(${(1 + p * 0.06).toFixed(4)})`;
  ghost.style.transform = `translate3d(0,${(p * 70).toFixed(1)}px,0)`;
}
const onScroll = () => { if (raf === null) raf = requestAnimationFrame(frame); };
function aplicarScroll() {
  const want = !esMovil() && !RM.matches;
  if (want && !scrollOn) { scrollOn = true; lastS = -1; addEventListener('scroll', onScroll, { passive: true }); onScroll(); }
  else if (!want && scrollOn) { scrollOn = false; removeEventListener('scroll', onScroll); arch.style.transform = ''; ghost.style.transform = ''; }
}
MQLS.forEach(m => m.addEventListener('change', aplicarScroll));
aplicarScroll();

/* ---------- navegación y barra de acción ---------- */
const nav = $('#nav'), barra = $('#barra');
new IntersectionObserver(([e]) => {
  nav.classList.toggle('solid', !e.isIntersecting);
  barra.classList.toggle('on', !e.isIntersecting);
}, { rootMargin: '-120px 0px 0px 0px' }).observe($('.hero-ctas'));

/* ---------- mapa perezoso ---------- */
const mapa = $('.mapa');
new IntersectionObserver(([e], o) => {
  if (!e.isIntersecting) return;
  mapa.src = mapa.dataset.src.replace('QUERY', encodeURIComponent(N.mapa_query)); o.disconnect();
}, { rootMargin: '400px' }).observe(mapa);

/* ---------- arranque ---------- */
function idiomaInicial() {
  const q = new URLSearchParams(location.search).get('lang');
  if (q === 'en' || q === 'es') return q;
  try { const s = localStorage.getItem('lang'); if (s) return s; } catch (e) {}
  return (navigator.language || '').toLowerCase().startsWith('en') ? 'en' : 'es';
}
pintarLinks(); pintarPlanes(); pintarAbierto();
T.apply(idiomaInicial());
$$('.hero .rv').forEach((el, i) => { if (!RM.matches) el.style.transitionDelay = (i * 90) + 'ms'; requestAnimationFrame(() => el.classList.add('in')); setTimeout(() => el.style.transitionDelay = '', 2000); });
observar($$('.rv').filter(el => !el.closest('.hero')));
cargarHorario();
setInterval(() => { if (!document.hidden) { pintarAbierto(); pintarHorario(); } }, 60000);
setInterval(() => { if (!document.hidden) cargarHorario(); }, 5 * 60000);
})();
