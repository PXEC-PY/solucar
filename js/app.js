/* ==========================================================================
   SOLUCAR REPUESTOS — Lógica del sitio
   ========================================================================== */
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const fmt = new Intl.NumberFormat(CONFIG.moneda.locale, { style: 'currency', currency: CONFIG.moneda.currency, maximumFractionDigits: 0 });
  const money = (n) => fmt.format(Math.round(n));
  const altPrice = (p) => Math.max(5000, Math.round((p.precio * CONFIG.factorAlternativo) / 5000) * 5000); // redondeado a Gs. 5.000
  const catById = Object.fromEntries(CATEGORIES.map((c) => [c.id, c]));
  const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  const esc = (t) => String(t).replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  const waLink = (text) => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`;

  // Ilustración para repuestos sin foto (se reemplaza sola al poner img/repuestos/<id>.jpg)
  const PART_ICONS = {
    bieleta: '<circle cx="16" cy="16" r="7"/><circle cx="48" cy="48" r="7"/><path d="M21 21 43 43" stroke-width="6"/><path d="M10 10 6 6M54 54l4 4"/>',
    buje: '<circle cx="32" cy="32" r="24"/><circle cx="32" cy="32" r="14"/><circle cx="32" cy="32" r="5"/><path d="M32 8v6M32 50v6"/>',
    espiral: '<path d="M16 10h32M16 54h32"/><path d="M16 10c32 2 32 8 0 10s32 8 0 10 32 8 0 10 32 8 0 14"/>',
    precap: '<path d="M10 40c0-12 10-22 22-22s22 10 22 22Z"/><path d="M6 40h52v6H6z"/><circle cx="32" cy="30" r="5"/><path d="M14 46v6M50 46v6M32 18v-8"/>',
    cremallera: '<rect x="18" y="27" width="28" height="10" rx="3"/><path d="M6 32h4M54 32h4"/><path d="M10 26l2 12 2-12 2 12 2-12M46 26l2 12 2-12 2 12 2-12"/><path d="M32 27v-9"/><circle cx="32" cy="15" r="3"/>',
    manguera: '<path d="M8 14h12c10 0 14 6 14 16s4 20 16 20h6" stroke-width="10"/><path d="M8 14h4M52 50h4" stroke-width="12"/>',
    rodamiento: '<circle cx="32" cy="32" r="24"/><circle cx="32" cy="32" r="10"/><circle cx="32" cy="15" r="3"/><circle cx="49" cy="32" r="3"/><circle cx="32" cy="49" r="3"/><circle cx="15" cy="32" r="3"/>',
    zapatas: '<path d="M10 40a22 22 0 0 1 20-28"/><path d="M54 40a22 22 0 0 0-20-28"/><path d="M14 40a18 18 0 0 1 16-23M50 40a18 18 0 0 0-16-23" stroke-width="5"/><path d="M10 40h44"/>',
    'liquido-frenos': '<path d="M24 6h16v8H24z"/><path d="M22 14h20l4 8v34H18V22z"/><path d="M26 34h12M26 42h12"/>',
    'foco-trasero': '<path d="M8 18h40l8 10v18H8z"/><path d="M16 26h14v12H16z"/><path d="M36 26h12"/>',
    neblinero: '<circle cx="26" cy="32" r="16"/><circle cx="26" cy="32" r="8"/><path d="M46 22h12M46 32h12M46 42h12"/>',
    plumillas: '<path d="M8 50 50 14"/><path d="M14 54 54 20" stroke-width="5"/><circle cx="8" cy="50" r="4"/>',
    'bomba-agua': '<circle cx="28" cy="34" r="16"/><circle cx="28" cy="34" r="5"/><path d="M28 18v-8M44 34h12v-8"/><path d="M16 22 10 16"/>',
    termostato: '<path d="M26 40V12a6 6 0 0 1 12 0v28a10 10 0 1 1-12 0Z"/><path d="M32 22v24"/><path d="M44 16h8M44 24h8"/>',
    electroventilador: '<circle cx="32" cy="32" r="26"/><circle cx="32" cy="32" r="5"/><path d="M32 27c-2-10 4-16 12-14M37 32c10-2 16 4 14 12M32 37c2 10-4 16-12 14M27 32c-10 2-16-4-14-12"/>',
    'filtro-aire': '<rect x="8" y="16" width="48" height="32" rx="3"/><path d="M14 16v32M20 16v32M26 16v32M32 16v32M38 16v32M44 16v32M50 16v32"/>',
    'kit-distribucion': '<circle cx="18" cy="20" r="10"/><circle cx="46" cy="20" r="10"/><circle cx="32" cy="48" r="10"/><path d="M8 20 22 48M56 20 42 48M18 10h28"/>',
    correa: '<circle cx="16" cy="32" r="9"/><circle cx="48" cy="18" r="8"/><circle cx="48" cy="46" r="8"/><path d="M14 23 46 10M18 41l28 13M56 18v28"/>',
    'filtro-combustible': '<rect x="18" y="14" width="28" height="36" rx="6"/><path d="M32 4v10M32 50v10M18 26h28M18 38h28"/>',
    'filtro-cabina': '<rect x="6" y="20" width="52" height="24" rx="2"/><path d="M6 32l6-12 6 24 6-24 6 24 6-24 6 24 6-24 6 12"/>',
    bateria: '<rect x="8" y="18" width="48" height="34" rx="3"/><path d="M16 12h8v6M40 12h8v6"/><path d="M16 34h8M20 30v8M40 34h8"/>',
    alternador: '<circle cx="32" cy="34" r="20"/><circle cx="32" cy="34" r="7"/><path d="M32 14V6M18 22l-6-6M46 22l6-6M22 50l-4 6M42 50l4 6"/>',
    arranque: '<rect x="8" y="22" width="30" height="22" rx="4"/><rect x="38" y="26" width="14" height="14" rx="2"/><path d="M52 33h6M16 16h14v6"/>',
    bobina: '<rect x="24" y="6" width="16" height="12" rx="2"/><path d="M28 18h8v30h-8z"/><path d="M30 48v10h4V48"/><path d="M40 10h10"/>',
  };
  const placeholderCache = {};
  const placeholder = (p) => placeholderCache[p.id] ||= 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><defs><radialGradient id="g" cx=".5" cy=".42" r=".75"><stop offset="0" stop-color="#1f2a44"/><stop offset="1" stop-color="#0b0f19"/></radialGradient></defs><rect width="400" height="300" fill="url(#g)"/><circle cx="200" cy="128" r="78" fill="#e1251b" fill-opacity=".18"/><g transform="translate(144 72) scale(1.75)" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">${PART_ICONS[p.icon] || PART_ICONS[p.id] || ''}</g><text x="200" y="262" text-anchor="middle" font-family="Arial Narrow, Arial, sans-serif" font-weight="700" font-size="${p.name.length > 26 ? 15 : 20}" letter-spacing="1" fill="#9ca3af">${esc(p.name.toUpperCase())}</text></svg>`);

  // Vistas (fotos) de un repuesto: archivos en img/repuestos/ (texto) u objetos { url, credito }.
  // Si una foto no carga, se muestra una ilustración del repuesto.
  const photos = (p) => (p.fotos && p.fotos.length ? p.fotos : [{}]).map((f) => (typeof f === 'string'
    ? { local: `img/repuestos/${f}`, fallback: placeholder(p), credito: null }
    : { local: f.url || placeholder(p), fallback: placeholder(p), credito: f.credito || null }));
  const imgTag = (p, cls = '', extra = '', view = 0) => {
    const list = photos(p);
    const f = list[view] || list[0];
    return `<img src="${f.local}" data-fallback="${f.fallback}" alt="${esc(p.name)}${view ? ` — vista ${view + 1}` : ''}" loading="lazy" class="${cls}" ${extra} onerror="if(this.dataset.fallback&&this.src!==this.dataset.fallback){this.src=this.dataset.fallback}" />`;
  };

  const ICONS = {
    suspension: '<svg viewBox="0 0 24 24"><path d="M12 2v3M12 19v3M8 5h8M8 19h8"/><path d="M9 7l6 2-6 2 6 2-6 2 6 2"/></svg>',
    brake: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/><path d="M12 3v2M21 12h-2M12 21v-2M3 12h2"/></svg>',
    light: '<svg viewBox="0 0 24 24"><path d="M14 6c4 0 7 2.7 7 6s-3 6-7 6c-1.5 0-2-1-2-2V8c0-1 .5-2 2-2Z"/><path d="M3 8h6M2 12h7M3 16h6"/></svg>',
    car: '<svg viewBox="0 0 24 24"><path d="M3 16v-4l2-5h14l2 5v4"/><path d="M3 16h18v2H3z"/><circle cx="7" cy="16" r="1.5"/><circle cx="17" cy="16" r="1.5"/></svg>',
    temp: '<svg viewBox="0 0 24 24"><path d="M10 14V4a2 2 0 1 1 4 0v10a4 4 0 1 1-4 0Z"/><path d="M12 9v6"/></svg>',
    engine: '<svg viewBox="0 0 24 24"><path d="M4 10h3l2-3h6v3h2l2 2v5h-2l-1 2H9l-2-2H4z"/><path d="M2 12v4"/></svg>',
    arrow: '<svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    plus: '<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>',
    check: '<svg viewBox="0 0 24 24"><path d="m5 12 5 5 9-10"/></svg>',
    close: '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    camera: '<svg viewBox="0 0 24 24"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg>',
    left: '<svg viewBox="0 0 24 24"><path d="m15 6-6 6 6 6"/></svg>',
    right: '<svg viewBox="0 0 24 24"><path d="m9 6 6 6-6 6"/></svg>',
    bolt: '<svg viewBox="0 0 24 24"><path d="M13 2 4 14h7l-1 8 9-12h-7z"/></svg>',
  };

  /* ---------------- Estado ---------------- */
  const state = { cat: '', brand: '', model: '', year: '', q: '', sort: '', vin: null, version: {} }; // version[id] = 'orig' | 'alt'
  const NO_VEHICLE = { brand: '', model: '', year: '', vin: null };
  let cart = [];
  try { cart = JSON.parse(localStorage.getItem('solucar-cart') || '[]'); } catch { cart = []; }
  cart = cart.filter((l) => PRODUCTS.some((p) => p.id === l.id));
  const saveCart = () => { try { localStorage.setItem('solucar-cart', JSON.stringify(cart)); } catch {} };

  /* ---------------- Contacto / textos fijos ---------------- */
  const waDefault = waLink('Hola Solucar, quiero cotizar un repuesto.');
  ['#headerWa', '#waFloat', '#emptyWa'].forEach((s) => ($(s).href = waDefault));
  $('#year').textContent = new Date().getFullYear();
  $('#footContact').innerHTML = `
    <li>📍 ${CONFIG.direccion}</li>
    <li>📞 <a href="${waDefault}" target="_blank" rel="noopener">${CONFIG.whatsappVisible}</a></li>
    <li>✉️ <a href="mailto:${CONFIG.email}">${CONFIG.email}</a></li>
    ${CONFIG.redes.instagram ? `<li>📸 <a href="${CONFIG.redes.instagram}" target="_blank" rel="noopener">Instagram</a></li>` : ''}
    ${CONFIG.redes.facebook ? `<li>👍 <a href="${CONFIG.redes.facebook}" target="_blank" rel="noopener">Facebook</a></li>` : ''}
    ${CONFIG.sucursales ? `<li>🏪 Sucursales: ${CONFIG.sucursales.join(' · ')}</li>` : ''}`;
  $('#footHorario').innerHTML = CONFIG.horario.map((h) => `<li><b style="color:#fff">${h.dias}</b><br>${h.horas}</li>`).join('');

  /* ---------------- Texto rotativo del hero ---------------- */
  const words = ['Hyundai', 'Kia', 'SsangYong'];
  let wi = 0;
  setInterval(() => {
    const r = $('#rotator');
    const cur = r.firstElementChild;
    cur.classList.add('out');
    setTimeout(() => { wi = (wi + 1) % words.length; r.innerHTML = `<span>${words[wi]}</span>`; }, 380);
  }, 2600);

  /* ---------------- Marquee ---------------- */
  const mItems = [...CATEGORIES.map((c) => c.name), 'Hyundai', 'Kia', 'SsangYong', 'Envíos a todo el país'];
  $('#marquee').innerHTML = [...mItems, ...mItems].map((t) => `<span>${t}</span>`).join('');

  /* ---------------- Categorías ---------------- */
  const countBy = (cat) => PRODUCTS.filter((p) => p.category === cat).length;
  $('#catGrid').innerHTML = CATEGORIES.map((c) => {
    const cover = PRODUCTS.find((p) => p.category === c.id);
    return `
      <button class="cat reveal" data-cat="${c.id}">
        ${imgTag(cover)}
        <span class="cat__ico">${ICONS[c.icon]}</span>
        <span class="cat__count">${countBy(c.id)} ${countBy(c.id) === 1 ? 'repuesto' : 'repuestos'}</span>
        <h3>${c.name}</h3>
        <p>${c.desc}</p>
        <span class="cat__go">Ver repuestos ${ICONS.arrow}</span>
      </button>`;
  }).join('');

  /* ---------------- Vitrina "Lo más pedido" ---------------- */
  const brandsOf = (p) => [...new Set(p.compat.map(([b]) => b))].join(' · ');
  $('#showcase').innerHTML = PRODUCTS.filter((p) => p.destacado).map((p) => {
    const list = photos(p);
    return `
      <article class="show">
        <div class="show__media" data-open="${p.id}">
          ${imgTag(p)}${list.length > 1 ? imgTag(p, '', 'aria-hidden="true"', 1) : ''}
          ${p.badge ? `<span class="card__badge card__badge--${p.badge.replace(/\s/g, '-')}">${p.badge}</span>` : ''}
          ${list.length > 1 ? `<div class="show__views">${list.slice(0, 3).map((_, i) => imgTag(p, '', 'aria-hidden="true"', i)).join('')}</div>` : ''}
        </div>
        <div class="show__body">
          <span class="card__cat">${catById[p.category].name}</span>
          <h3>${p.name}</h3>
          <span class="show__brands">${brandsOf(p)}</span>
          <div class="show__foot">
            <div class="show__price"><small>Original</small><b>${money(p.precio)}</b><em>Alternativo ${money(altPrice(p))}</em></div>
            <div class="show__actions">
              <button class="btn btn--ghost" data-open="${p.id}">${list.length > 1 ? `${list.length} vistas` : 'Ver ficha'}</button>
              <button class="btn btn--red" data-add="${p.id}" aria-label="Agregar al combo">+ Combo</button>
            </div>
          </div>
        </div>
      </article>`;
  }).join('');
  $$('[data-slide]').forEach((b) => b.addEventListener('click', () => {
    const track = $('#showcase');
    const step = (track.firstElementChild?.getBoundingClientRect().width || 400) + 22;
    track.scrollBy({ left: step * +b.dataset.slide, behavior: 'smooth' });
  }));

  /* ---------------- Chips + selects ---------------- */
  const renderChips = () => {
    const all = [{ id: '', name: 'Todos', n: PRODUCTS.length }, ...CATEGORIES.map((c) => ({ ...c, n: countBy(c.id) }))];
    $('#chips').innerHTML = all.map((c) => `<button class="chip ${state.cat === c.id ? 'is-active' : ''}" data-chip="${c.id}">${c.name}<small>${c.n}</small></button>`).join('');
  };
  $('#brandSelect').innerHTML += BRANDS.map((b) => `<option value="${b.id}">${b.id}</option>`).join('');
  const renderModelSelect = () => {
    const brands = BRANDS.filter((b) => !state.brand || b.id === state.brand);
    $('#modelSelect').innerHTML = '<option value="">Todos los modelos</option>' + brands.map((b) => b.models
      .map((m) => `<option value="${m}" ${state.model === m ? 'selected' : ''}>${state.brand ? '' : b.id + ' '}${m}</option>`).join('')).join('');
  };
  const YEARS = Array.from({ length: 2025 - 2010 + 1 }, (_, i) => 2025 - i);
  $('#yearSelect').innerHTML += YEARS.map((y) => `<option value="${y}">${y}</option>`).join('');

  /* ---------------- Compatibilidad (marca / modelo / año) ---------------- */
  const yearsOf = (text) => { const m = text.match(/(\d{4})\s*[–-]\s*(\d{4})/); return m ? [+m[1], +m[2]] : null; };
  const brandModels = Object.fromEntries(BRANDS.map((b) => [b.id, b.models.map((m) => norm(m.split(' ')[0]))]));
  // Una línea de compatibilidad sirve si cumple a la vez marca, modelo y año pedidos
  const compatOk = ([b, text], { brand, model, year }) => {
    if (brand && b !== brand) return false;
    const t = norm(text);
    if (model) {
      const key = norm(model.split(' ')[0]);
      const namesAnyModel = (brandModels[b] || []).some((m) => t.includes(m));
      if (namesAnyModel && !t.includes(key)) return false; // si no nombra modelos, aplica a toda la marca
      if (!(brandModels[b] || []).includes(key)) return false;
    }
    if (year) { const r = yearsOf(text); if (r && (year < r[0] || year > r[1])) return false; } // sin años: se confirma por WhatsApp
    return true;
  };
  const fitsVehicle = (p, v = state) => (!v.brand && !v.model && !v.year) || p.compat.some((c) => compatOk(c, v));

  /* ---------------- Catálogo ---------------- */
  const filtered = () => {
    const q = norm(state.q.trim());
    let list = PRODUCTS.filter((p) => {
      if (state.cat && p.category !== state.cat) return false;
      if (!fitsVehicle(p)) return false;
      if (q) {
        const hay = norm([p.name, p.sku, catById[p.category].name, p.desc, ...p.compat.flat()].join(' '));
        // "sportage 2017": las palabras de 4 dígitos se buscan como año dentro de los rangos
        return q.split(/\s+/).every((w) => (/^(19|20)\d{2}$/.test(w)
          ? p.compat.some(([, t]) => { const r = yearsOf(t); return r && +w >= r[0] && +w <= r[1]; })
          : hay.includes(w)));
      }
      return true;
    });
    if (state.sort === 'asc') list = [...list].sort((a, b) => a.precio - b.precio);
    if (state.sort === 'desc') list = [...list].sort((a, b) => b.precio - a.precio);
    if (state.sort === 'az') list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    return list;
  };

  const priceOf = (p) => (state.version[p.id] === 'alt' ? altPrice(p) : p.precio);

  const cardHTML = (p, i) => {
    const alt = state.version[p.id] === 'alt';
    const inCart = cart.some((l) => l.id === p.id && l.v === (alt ? 'alt' : 'orig'));
    const views = photos(p).length;
    return `
    <article class="card" style="animation-delay:${i * 45}ms" data-id="${p.id}">
      <div class="card__media" data-open="${p.id}">
        ${imgTag(p)}
        ${views > 1 ? imgTag(p, 'card__alt', 'aria-hidden="true"', 1) : ''}
        ${p.badge ? `<span class="card__badge card__badge--${p.badge.replace(/\s/g, '-')}">${p.badge}</span>` : ''}
        ${views > 1 ? `<span class="card__views">${ICONS.camera}${views} vistas</span>` : ''}
        <span class="card__quick">${views > 1 ? 'Ver vistas' : 'Ver detalle'}</span>
      </div>
      <div class="card__body">
        <div class="card__meta"><span class="card__cat">${catById[p.category].name}</span><span>${p.sku}</span></div>
        <h3 class="card__title">${p.name}</h3>
        <div class="compat">${p.compat.map(([b, m]) => `<span><b>${b}</b> ${m}</span>`).join('')}</div>
        <div class="toggle ${alt ? 'alt' : ''}">
          <button class="${!alt ? 'is-on' : ''}" data-ver="orig" data-id="${p.id}">Original</button>
          <button class="${alt ? 'is-on' : ''}" data-ver="alt" data-id="${p.id}">Alternativo</button>
        </div>
        <div class="card__foot">
          <div class="price"><small>Precio estimado</small><b data-price>${money(priceOf(p))}</b>${alt ? `<s>${money(p.precio)}</s>` : ''}</div>
          <button class="add-btn ${inCart ? 'done' : ''}" data-add="${p.id}" aria-label="Agregar al combo">${inCart ? ICONS.check : ICONS.plus}</button>
        </div>
      </div>
    </article>`;
  };

  const renderGrid = () => {
    const list = filtered();
    $('#grid').innerHTML = list.map(cardHTML).join('');
    $('#empty').hidden = list.length > 0;
    const parts = [];
    if (state.cat) parts.push(catById[state.cat].name);
    if (state.brand) parts.push(state.brand);
    if (state.model) parts.push(state.model);
    if (state.year) parts.push(state.year);
    if (state.q) parts.push(`“${esc(state.q)}”`);
    const hasFilters = parts.length > 0;
    $('#resultInfo').innerHTML = `Mostrando <b>${list.length}</b> de ${PRODUCTS.length} repuestos${hasFilters ? ' · ' + parts.join(' · ') + ' <button class="link-btn" data-reset>Limpiar filtros</button>' : ''}`;
    renderChips();
    renderVin();
  };

  const goCatalog = () => $('#catalogo').scrollIntoView({ behavior: 'smooth' });
  const setFilter = (patch, scroll = true) => {
    Object.assign(state, patch);
    $('#searchInput').value = state.q;
    $('#brandSelect').value = state.brand;
    renderModelSelect();
    $('#yearSelect').value = state.year;
    renderGrid();
    if (scroll) goCatalog();
  };

  /* ---------------- Búsqueda por VIN (simulada) ---------------- */
  const WMI = {
    KNA: 'Kia', KNB: 'Kia', KNC: 'Kia', KND: 'Kia', KNE: 'Kia', U5Y: 'Kia', '3KP': 'Kia',
    KMH: 'Hyundai', KM8: 'Hyundai', KMF: 'Hyundai', '5NP': 'Hyundai', '5NM': 'Hyundai', TMA: 'Hyundai',
    KPT: 'SsangYong', KPA: 'SsangYong', KPB: 'SsangYong',
  };
  const YEAR_CODES = 'ABCDEFGHJKLMNPRSTVWXY'; // 10º carácter: A = 2010 … Y = 2030
  // Simulación: el 4º carácter sugiere el modelo (en la vida real se confirma con el catálogo de la marca)
  const VDS_HINT = {
    Kia: { P: 'Sportage', K: 'Sportage', B: 'Picanto', A: 'Picanto', F: 'Cerato', X: 'Sorento', U: 'Sorento' },
    Hyundai: { J: 'Tucson', T: 'Tucson', C: 'Accent', S: 'Santa Fe', A: 'Grand i10', G: 'Grand i10' },
    SsangYong: { G: 'Rexton', D: 'Korando', A: 'Actyon', T: 'Tivoli' },
  };
  const decodeVin = (raw) => {
    const vin = raw.toUpperCase().replace(/\s/g, '');
    if (vin.length !== 17) return { error: `El VIN tiene 17 caracteres (ingresaste ${vin.length}).` };
    if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(vin)) return { error: 'El VIN no lleva las letras I, O ni Q. Revísalo.' };
    const brand = WMI[vin.slice(0, 3)];
    if (!brand) return { error: 'Este VIN no es de Hyundai, Kia ni SsangYong. Escríbenos y lo revisamos.' };
    const yc = vin[9];
    const year = YEAR_CODES.includes(yc) ? 2010 + YEAR_CODES.indexOf(yc) : null;
    if (!year || year > 2025) return { error: 'No pudimos leer el año (10º carácter). Escríbenos por WhatsApp.' };
    const models = BRANDS.find((b) => b.id === brand).models;
    const hash = [...vin.slice(3, 8)].reduce((a, c) => a + c.charCodeAt(0), 0);
    const model = VDS_HINT[brand][vin[3]] || models[hash % models.length];
    return { vin, brand, model, year };
  };
  const renderVin = () => {
    const box = $('#vinResult');
    const r = state.vin;
    box.hidden = !r;
    if (!r) return;
    if (r.error) { box.className = 'vin__result is-error'; box.innerHTML = `⚠ ${r.error}`; return; }
    const n = PRODUCTS.filter((p) => fitsVehicle(p)).length;
    box.className = 'vin__result';
    box.innerHTML = `<span>Vehículo identificado</span><b>${r.brand} ${r.model} ${r.year}</b><em>✓ ${n} repuesto${n === 1 ? '' : 's'} compatible${n === 1 ? '' : 's'}</em><button class="link-btn" data-reset>Quitar</button>`;
  };

  /* ---------------- Marcas ---------------- */
  $('#brandGrid').innerHTML = BRANDS.map((b) => {
    const n = PRODUCTS.filter((p) => p.compat.some(([br]) => br === b.id)).length;
    return `
      <button class="brand reveal" data-brand="${b.id}" data-letter="${b.id[0]}" style="background:linear-gradient(135deg, ${b.color}, #0b0f19)">
        <h3>${b.id}</h3>
        <span class="brand__count">${n} repuestos compatibles</span>
        <div class="brand__models">${b.models.map((m) => `<span>${m}</span>`).join('')}</div>
        <span class="brand__go">Ver repuestos ${ICONS.arrow}</span>
      </button>`;
  }).join('');

  /* ---------------- Collage Nosotros ---------------- */
  $('#collage').innerHTML = [
    ['edificio', 'Edificio de Solucar'], ['sucursal-mariano', 'Sucursal Mariano Roque Alonso'],
    ['sucursal-san-lorenzo', 'Sucursal San Lorenzo'], ['sucursal-nemby', 'Sucursal Ñemby'],
  ].map(([f, alt]) => `<img src="img/empresa/${f}.jpg" alt="${alt}" loading="lazy" />`).join('');

  /* ---------------- Carrito / combo ---------------- */
  const lineProduct = (l) => PRODUCTS.find((p) => p.id === l.id);
  const lineUnit = (l) => { const p = lineProduct(l); return l.v === 'alt' ? altPrice(p) : p.precio; };

  const pct = (r) => `${Math.round(r * 100)}%`;
  const calc = () => {
    const { trenDelantero: TD, general: GEN, refrigeracion: REF } = COMBO_RULES;
    const units = cart.reduce((a, l) => a + l.qty, 0);
    const tdUnits = cart.filter((l) => lineProduct(l).category === 'tren-delantero').reduce((a, l) => a + l.qty, 0);
    const tdOn = tdUnits >= TD.minItems;
    const genOn = units >= GEN.minItems;
    const refHave = REF.requeridos.filter((id) => cart.some((l) => l.id === id));
    const refOn = refHave.length === REF.requeridos.length;
    let subtotal = 0, discount = 0;
    const byRule = {}; // ahorro por regla, para el resumen
    const lines = cart.map((l) => {
      const p = lineProduct(l);
      const gross = lineUnit(l) * l.qty;
      // Se aplica el mayor descuento que corresponda a la pieza
      const options = [];
      if (refOn && REF.requeridos.includes(p.id)) options.push(['refrigeracion', REF.descuento]);
      if (tdOn && p.category === 'tren-delantero') options.push(['trenDelantero', TD.descuento]);
      if (genOn) options.push(['general', GEN.descuento]);
      const [rule, rate] = options.sort((a, b) => b[1] - a[1])[0] || [null, 0];
      subtotal += gross; discount += gross * rate;
      if (rule) byRule[rule] = (byRule[rule] || 0) + gross * rate;
      return { ...l, p, gross, rate };
    });
    const savings = Object.entries(byRule).map(([k, v]) => ({ label: COMBO_RULES[k].label, amount: v }));
    return { units, tdUnits, tdOn, genOn, refHave, refOn, subtotal, discount, savings, total: subtotal - discount, lines };
  };

  // Siguiente descuento que el cliente puede desbloquear (o null)
  const nextHint = (c) => {
    const { trenDelantero: TD, general: GEN, refrigeracion: REF } = COMBO_RULES;
    if (c.refHave.length && !c.refOn) {
      const missing = REF.requeridos.filter((id) => !c.refHave.includes(id)).map((id) => PRODUCTS.find((p) => p.id === id).name.replace(' de radiador', ''));
      return { text: `Agrega <b>${missing.join(' + ')}</b> y el Pack Refrigeración queda con <b>${pct(REF.descuento)} OFF</b> ❄️`, progress: c.refHave.length / REF.requeridos.length };
    }
    if (c.tdUnits > 0 && !c.tdOn) {
      const need = TD.minItems - c.tdUnits;
      return { text: `Suma <b>${need}</b> pieza${need > 1 ? 's' : ''} más de <b>Tren Delantero</b> y llévate <b>${pct(TD.descuento)} OFF</b> en ellas 🔧`, progress: c.tdUnits / TD.minItems };
    }
    if (!c.genOn) {
      const need = GEN.minItems - c.units;
      return { text: `Agrega <b>${need}</b> repuesto${need > 1 ? 's' : ''} más y obtén <b>${pct(GEN.descuento)} OFF</b> en ${c.discount ? 'el resto del' : 'todo el'} combo 🔥`, progress: c.units / GEN.minItems };
    }
    return null;
  };

  const renderCart = () => {
    const c = calc();
    const badge = $('#cartBadge');
    badge.textContent = c.units;
    badge.classList.toggle('has', c.units > 0);

    // barra de progreso: ahorro actual + siguiente descuento posible
    let prog = '';
    if (c.units > 0) {
      const hint = nextHint(c);
      const active = c.discount ? `✓ Descuento activado: estás ahorrando <b>${money(c.discount)}</b> 🎉` : '';
      prog = [active, hint && hint.text].filter(Boolean).join('<br>') +
        `<div class="bar"><i style="width:${hint ? Math.round(hint.progress * 100) : 100}%"></i></div>`;
    }
    $('#progress').innerHTML = prog;

    if (!c.lines.length) {
      $('#cartItems').innerHTML = `<div class="cart-empty"><div>🛒</div><p><b>Tu combo está vacío</b><br>Agrega repuestos desde el catálogo.</p><button class="btn btn--dark" data-close data-go="catalogo">Ir al catálogo</button></div>`;
      $('#cartFoot').innerHTML = '';
      return;
    }
    $('#cartItems').innerHTML = c.lines.map((l, i) => `
      <div class="line">
        ${imgTag(l.p)}
        <div>
          <h5>${l.p.name}</h5>
          <small>${l.v === 'alt' ? 'Alternativo' : 'Original'} · ${money(lineUnit(l))} c/u</small>
          ${l.rate ? `<small class="disc">−${Math.round(l.rate * 100)}% combo</small>` : ''}
          <div class="qty"><button data-qty="${i}" data-d="-1">−</button><span>${l.qty}</span><button data-qty="${i}" data-d="1">+</button></div>
        </div>
        <div class="line__price">${money(l.gross * (1 - l.rate))}<button data-rm="${i}">Quitar</button></div>
      </div>`).join('');
    $('#cartFoot').innerHTML = `
      <div class="sum"><span>Subtotal</span><span>${money(c.subtotal)}</span></div>
      ${c.savings.map((s) => `<div class="sum sum--save"><span>${s.label}</span><span>−${money(s.amount)}</span></div>`).join('')}
      <div class="sum sum--total"><span>Total estimado</span><span>${money(c.total)}</span></div>
      <a class="btn btn--wa btn--lg btn--block" target="_blank" rel="noopener" href="${waLink(cartMessage(c))}">Enviar pedido por WhatsApp</a>
      <button class="link-btn" data-clear style="color:var(--muted)">Vaciar combo</button>`;
  };

  const cartMessage = (c) => {
    const rows = c.lines.map((l) => `• ${l.qty} x ${l.p.name} (${l.v === 'alt' ? 'Alternativo' : 'Original'}) — ${l.p.sku} — ${money(l.gross)}${l.rate ? ` (−${pct(l.rate)})` : ''}`);
    const disc = c.savings.map((s) => `${s.label}: −${money(s.amount)}`);
    const v = state.vin && !state.vin.error ? state.vin : null;
    return [
      'Hola Solucar 👋, quiero cotizar este combo:', '', ...rows, '',
      `Subtotal: ${money(c.subtotal)}`, ...disc, `*Total estimado: ${money(c.total)}*`, '',
      v ? `Mi vehículo: ${v.brand} ${v.model} ${v.year} (VIN ${v.vin})` : 'Mi vehículo es: ',
    ].join('\n');
  };

  const addToCart = (id) => {
    const v = state.version[id] === 'alt' ? 'alt' : 'orig';
    const ex = cart.find((l) => l.id === id && l.v === v);
    if (ex) ex.qty++; else cart.push({ id, v, qty: 1 });
    saveCart(); renderCart(); renderGrid();
    const b = $('#cartBadge'); b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump');
    const p = PRODUCTS.find((x) => x.id === id);
    toast(`✔ ${p.name} agregado al combo`, 'Ver combo', openCart);
  };

  /* ---------------- Drawer, modal, spotlight ---------------- */
  const overlay = $('#overlay');
  const openCart = () => { closeAll(); $('#drawer').classList.add('is-open'); overlay.classList.add('is-on'); document.body.style.overflow = 'hidden'; };
  const closeAll = () => {
    ['#drawer', '#modal', '#spotlight'].forEach((s) => $(s).classList.remove('is-open'));
    overlay.classList.remove('is-on'); document.body.style.overflow = '';
  };

  const openModal = (id) => {
    const p = PRODUCTS.find((x) => x.id === id);
    const alt = state.version[id] === 'alt';
    $('#modalBox').innerHTML = `
      <button class="icon-btn modal__close" data-close aria-label="Cerrar">${ICONS.close}</button>
      ${galleryHTML(p)}
      <div class="modal__body">
        <span class="eyebrow">${catById[p.category].name} · ${p.sku}</span>
        <h3>${p.name}</h3>
        <p>${p.desc}</p>
        <div><b style="font-size:14px">Compatible con:</b>
          <ul class="compat-list" style="margin-top:8px">${p.compat.map(([b, m]) => `<li><b>${b}</b>${m}</li>`).join('')}</ul>
        </div>
        <div style="display:flex;gap:24px;flex-wrap:wrap">
          <div class="price"><small>Original</small><b>${money(p.precio)}</b></div>
          <div class="price"><small>Alternativo</small><b style="color:#16a34a">${money(altPrice(p))}</b></div>
        </div>
        <div class="modal__actions">
          <button class="btn btn--red" data-add-modal="${p.id}">Agregar ${alt ? 'alternativo' : 'original'} al combo</button>
          <a class="btn btn--wa" target="_blank" rel="noopener" href="${waLink(`Hola Solucar, quiero consultar por: ${p.name} (${p.sku}). Mi vehículo es: `)}">Consultar por WhatsApp</a>
        </div>
      </div>`;
    $('#modal').classList.add('is-open'); document.body.style.overflow = 'hidden';
    setView(0);
  };

  /* ---------------- Galería de vistas (ficha del repuesto) ---------------- */
  let gallery = null; // { p, i, n }
  const creditText = (c) => (c ? `Foto: ${esc(c[0])} · ${esc(c[1])}` : '');
  const galleryHTML = (p) => {
    const list = photos(p);
    gallery = { p, i: 0, n: list.length };
    const multi = list.length > 1;
    return `
      <div class="modal__media gallery">
        <div class="gallery__stage" data-zoom>
          ${list.map((_, i) => imgTag(p, `gallery__img ${i ? '' : 'is-on'}`, `data-view="${i}"`, i)).join('')}
          ${multi ? `<button class="gallery__nav gallery__nav--prev" data-step="-1" aria-label="Vista anterior">${ICONS.left}</button>
          <button class="gallery__nav gallery__nav--next" data-step="1" aria-label="Vista siguiente">${ICONS.right}</button>
          <span class="gallery__count" id="galCount">1 / ${list.length}</span>` : ''}
          <span class="gallery__hint">🔍 Pasa el mouse para ampliar</span>
          <span class="modal__credit" id="galCredit">${creditText(list[0].credito)}</span>
        </div>
        ${multi ? `<div class="gallery__thumbs">${list.map((_, i) => `<button class="gallery__thumb ${i ? '' : 'is-on'}" data-thumb="${i}" aria-label="Vista ${i + 1}">${imgTag(p, '', '', i)}</button>`).join('')}</div>` : ''}
      </div>`;
  };
  const setView = (i) => {
    if (!gallery) return;
    gallery.i = (i + gallery.n) % gallery.n;
    $$('.gallery__img').forEach((im) => im.classList.toggle('is-on', +im.dataset.view === gallery.i));
    $$('.gallery__thumb').forEach((t) => t.classList.toggle('is-on', +t.dataset.thumb === gallery.i));
    const c = $('#galCount'); if (c) c.textContent = `${gallery.i + 1} / ${gallery.n}`;
    const cr = $('#galCredit'); if (cr) cr.textContent = creditText(photos(gallery.p)[gallery.i].credito);
  };
  // Lupa: la foto activa se amplía siguiendo el mouse
  document.addEventListener('mousemove', (e) => {
    const stage = e.target.closest && e.target.closest('[data-zoom]');
    if (!stage) return;
    const r = stage.getBoundingClientRect();
    const img = stage.querySelector('.gallery__img.is-on');
    if (img) img.style.transformOrigin = `${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`;
  });
  // Deslizar con el dedo en el celular
  let touchX = null;
  document.addEventListener('touchstart', (e) => { if (e.target.closest('[data-zoom]')) touchX = e.touches[0].clientX; }, { passive: true });
  document.addEventListener('touchend', (e) => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX; touchX = null;
    if (Math.abs(dx) > 40) setView(gallery.i + (dx < 0 ? 1 : -1));
  });

  const openCredits = () => {
    $('#modalBox').innerHTML = `
      <button class="icon-btn modal__close" data-close aria-label="Cerrar">${ICONS.close}</button>
      <div class="credits"><h3>Créditos de imágenes</h3>
        <p style="color:#6b7280;font-size:14px">Fotografías de referencia obtenidas de Wikimedia Commons bajo licencias libres.</p>
        <ul>${PRODUCTS.flatMap((p) => photos(p).map((f, i) => [p, f, i])).filter(([, f]) => f.credito)
          .map(([p, f, i]) => `<li><b>${esc(p.name)}${photos(p).length > 1 ? ` (vista ${i + 1})` : ''}:</b> ${esc(f.credito[0])} — ${esc(f.credito[1])} — <a href="${f.credito[2]}" target="_blank" rel="noopener">ver fuente</a></li>`).join('')}</ul>
      </div>`;
    $('#modal').classList.add('is-open'); document.body.style.overflow = 'hidden';
  };

  let spotSel = 0;
  const renderSpot = () => {
    const q = norm($('#spotInput').value.trim());
    const list = PRODUCTS.filter((p) => !q || norm([p.name, p.sku, catById[p.category].name, ...p.compat.flat()].join(' ')).includes(q)).slice(0, 7);
    spotSel = Math.min(spotSel, Math.max(0, list.length - 1));
    $('#spotResults').innerHTML = list.length
      ? list.map((p, i) => `<button class="spot-item ${i === spotSel ? 'is-sel' : ''}" data-spot="${p.id}">${imgTag(p)}<div><b>${p.name}</b><small>${catById[p.category].name} · ${p.compat.map((c) => c[0]).join(', ')}</small></div><span>${money(p.precio)}</span></button>`).join('')
      : `<p style="padding:16px;color:#6b7280">Sin resultados. <a style="color:#e1251b" href="${waDefault}" target="_blank">Pregúntanos por WhatsApp</a></p>`;
  };
  const openSpot = () => { closeAll(); $('#spotlight').classList.add('is-open'); document.body.style.overflow = 'hidden'; $('#spotInput').value = ''; spotSel = 0; renderSpot(); setTimeout(() => $('#spotInput').focus(), 50); };

  /* ---------------- Toast ---------------- */
  let tTimer;
  const toast = (msg, action, fn) => {
    const t = $('#toast');
    t.innerHTML = `<span>${msg}</span>${action ? `<button>${action}</button>` : ''}`;
    if (action) t.querySelector('button').onclick = () => { fn(); t.classList.remove('is-on'); };
    t.classList.add('is-on');
    clearTimeout(tTimer); tTimer = setTimeout(() => t.classList.remove('is-on'), 3200);
  };

  /* ---------------- Eventos ---------------- */
  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-step],[data-thumb],[data-reset],[data-cat],[data-chip],[data-brand],[data-quick],[data-ver],[data-add],[data-open],[data-close],[data-qty],[data-rm],[data-clear],[data-add-modal],[data-spot]');
    if (!t) return;
    const d = t.dataset;
    if ('step' in d) setView(gallery.i + +d.step);
    else if ('thumb' in d) setView(+d.thumb);
    else if ('reset' in d) { $('#vinInput').value = ''; setFilter({ ...NO_VEHICLE, cat: '', q: '' }, false); }
    else if ('cat' in d) setFilter({ ...NO_VEHICLE, cat: d.cat, q: '' });
    else if ('chip' in d) setFilter({ cat: d.chip }, false);
    else if ('brand' in d && t.classList.contains('brand')) setFilter({ ...NO_VEHICLE, brand: d.brand, cat: '', q: '' });
    else if ('quick' in d) setFilter({ ...NO_VEHICLE, cat: d.quick, q: '' });
    else if ('ver' in d) {
      state.version[d.id] = d.ver;
      const card = t.closest('.card');
      const p = PRODUCTS.find((x) => x.id === d.id);
      card.outerHTML = cardHTML(p, 0).replace('animation-delay:0ms', 'animation:none');
    }
    else if ('add' in d) addToCart(d.add);
    else if ('addModal' in d) { addToCart(d.addModal); closeAll(); }
    else if ('open' in d) openModal(d.open);
    else if ('spot' in d) { closeAll(); setFilter({ ...NO_VEHICLE, q: '', cat: '' }, false); setTimeout(() => openModal(d.spot), 50); }
    else if ('qty' in d) { const l = cart[+d.qty]; l.qty += +d.d; if (l.qty <= 0) cart.splice(+d.qty, 1); saveCart(); renderCart(); renderGrid(); }
    else if ('rm' in d) { cart.splice(+d.rm, 1); saveCart(); renderCart(); renderGrid(); }
    else if ('clear' in d) { cart = []; saveCart(); renderCart(); renderGrid(); }
    else if ('close' in d) { closeAll(); if (d.go) setTimeout(goCatalog, 150); }
  });

  $('#openCart').onclick = openCart;
  $('#bannerCart').onclick = openCart;
  $('#openSearch').onclick = openSpot;
  $('#openCredits').onclick = openCredits;
  $('#openCredits').hidden = !PRODUCTS.some((p) => photos(p).some((f) => f.credito));
  overlay.onclick = closeAll;
  $('#modal').addEventListener('click', (e) => { if (e.target.id === 'modal') closeAll(); });
  $('#spotlight').addEventListener('click', (e) => { if (e.target.id === 'spotlight') closeAll(); });
  $('#spotInput').addEventListener('input', () => { spotSel = 0; renderSpot(); });
  $('#spotInput').addEventListener('keydown', (e) => {
    const items = $$('.spot-item');
    if (e.key === 'ArrowDown') { spotSel = Math.min(spotSel + 1, items.length - 1); renderSpot(); e.preventDefault(); }
    if (e.key === 'ArrowUp') { spotSel = Math.max(spotSel - 1, 0); renderSpot(); e.preventDefault(); }
    if (e.key === 'Enter' && items[spotSel]) items[spotSel].click();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAll();
    if ($('#modal').classList.contains('is-open') && gallery && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) setView(gallery.i + (e.key === 'ArrowRight' ? 1 : -1));
    if ((e.key === 'k' && (e.ctrlKey || e.metaKey)) || (e.key === '/' && !/input|textarea/i.test(document.activeElement.tagName))) { e.preventDefault(); openSpot(); }
  });

  let sTimer;
  $('#searchInput').addEventListener('input', (e) => { clearTimeout(sTimer); sTimer = setTimeout(() => setFilter({ q: e.target.value }, false), 150); });
  $('#brandSelect').addEventListener('change', (e) => setFilter({ brand: e.target.value, model: '', vin: null }, false));
  $('#modelSelect').addEventListener('change', (e) => {
    const model = e.target.value;
    const brand = model ? BRANDS.find((b) => b.models.includes(model)).id : state.brand;
    setFilter({ model, brand, vin: null }, false);
  });
  $('#yearSelect').addEventListener('change', (e) => setFilter({ year: e.target.value ? +e.target.value : '', vin: null }, false));

  // VIN
  const vinInput = $('#vinInput');
  vinInput.addEventListener('input', () => {
    vinInput.value = vinInput.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 17);
    $('#vinCount').textContent = `${vinInput.value.length}/17`;
  });
  $('#vinExample').onclick = () => { vinInput.value = 'KNAPM81ABH7123456'; vinInput.dispatchEvent(new Event('input')); vinInput.focus(); };
  $('#vinForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = $('#vinForm button[type=submit]');
    btn.disabled = true; btn.textContent = 'Verificando…';
    setTimeout(() => {
      btn.disabled = false; btn.textContent = 'Consultar';
      const r = decodeVin(vinInput.value);
      if (r.error) { state.vin = r; renderVin(); return; }
      setFilter({ vin: r, brand: r.brand, model: r.model, year: r.year, cat: '', q: '' }, false);
      toast(`✔ ${r.brand} ${r.model} ${r.year} identificado`);
    }, 600);
  });
  $('#sortSelect').addEventListener('change', (e) => setFilter({ sort: e.target.value }, false));
  $('#heroSearch').addEventListener('submit', (e) => { e.preventDefault(); setFilter({ ...NO_VEHICLE, q: $('#heroSearchInput').value, cat: '' }); });

  // Menú móvil
  $('#burger').onclick = () => $('#nav').classList.toggle('is-open');
  $$('.nav__link').forEach((a) => a.addEventListener('click', () => $('#nav').classList.remove('is-open')));

  // Header con sombra + link activo según sección
  const sections = $$('main section[id]');
  const onScroll = () => {
    $('#header').classList.toggle('is-scrolled', scrollY > 10);
    let cur = 'inicio';
    sections.forEach((s) => { if (s.getBoundingClientRect().top < 140) cur = s.id; });
    $$('.nav__link').forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === '#' + cur));
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Animación al aparecer + contadores
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      en.target.classList.add('is-in');
      $$('[data-count]', en.target).forEach((el) => {
        const end = +el.dataset.count; const t0 = performance.now();
        const step = (t) => { const k = Math.min(1, (t - t0) / 1200); el.textContent = Math.round(end * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(step); };
        requestAnimationFrame(step);
      });
      io.unobserve(en.target);
    });
  }, { threshold: 0.12 });
  $$('.reveal').forEach((el, i) => { el.style.transitionDelay = `${(i % 4) * 70}ms`; io.observe(el); });

  /* ---------------- Fotos de vehículos (Tucson en Nosotros, Rexton en Marcas) ---------------- */
  // Se muestran solo si existe el archivo en img/ (png, webp o jpg)
  $$('[data-vehicle]').forEach((el) => {
    const exts = ['png', 'webp', 'jpg'];
    const tryExt = (i) => {
      if (i >= exts.length) return;
      const img = new Image();
      img.onload = () => { el.querySelector('img').src = img.src; el.hidden = false; };
      img.onerror = () => tryExt(i + 1);
      img.src = `img/${el.dataset.vehicle}.${exts[i]}`;
    };
    tryExt(0);
  });

  /* ---------------- Inicio ---------------- */
  $('#statProducts').dataset.count = PRODUCTS.length;
  renderModelSelect();
  renderGrid();
  renderCart();
})();
