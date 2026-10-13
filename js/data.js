/* ==========================================================================
   SOLUCAR REPUESTOS — Datos del sitio (sin backend)
   Edita aquí: contacto, categorías, repuestos y reglas del combo.
   ========================================================================== */

const CONFIG = {
  empresa: 'Solucar Repuestos',
  // WhatsApp en formato internacional, sin "+" ni espacios
  whatsapp: '595984294262',
  whatsappVisible: '0984 294 262',
  email: 'solucarsrl@gmail.com',
  direccion: 'Iturbe y Yegros, Luque, Paraguay',
  sucursales: ['Luque', 'Mariano Roque Alonso', 'San Lorenzo', 'Ñemby'],
  // Horario DE EJEMPLO: confirmar con la empresa
  horario: [
    { dias: 'Lunes a Viernes', horas: '07:30 – 17:30' },
    { dias: 'Sábado', horas: '07:30 – 12:00' },
    { dias: 'Domingo y feriados', horas: 'Cerrado' },
  ],
  redes: {
    instagram: 'https://www.instagram.com/solucarepuestos/',
    facebook: 'https://www.facebook.com/profile.php?id=100054634291069',
    tiktok: '',
  },
  moneda: { locale: 'es-PY', currency: 'PYG' },
  // Precio estimado de la versión alternativa / homologada respecto al precio de lista
  factorAlternativo: 0.62,
};

/* Reglas de descuento de "Arma tu Combo" */
const COMBO_RULES = {
  trenDelantero: { minItems: 2, descuento: 0.15, label: '15% en Tren Delantero y Suspensión (2+ piezas)' },
  general: { minItems: 3, descuento: 0.10, label: '10% llevando 3+ repuestos' },
  refrigeracion: {
    descuento: 0.20, label: '20% Pack Refrigeración Tivoli (radiador + mangueras)',
    requeridos: ['radiador-tivoli', 'manguera-entrada-tivoli', 'manguera-salida-tivoli'],
  },
};
// Si a una pieza le aplican varias reglas, se usa el descuento mayor.

const BRANDS = [
  { id: 'Hyundai', color: '#002C5F', models: ['Accent', 'Grand i10', 'i10', 'Tucson', 'Santa Fe'] },
  { id: 'Kia', color: '#05141F', models: ['Picanto', 'Cerato', 'Sportage', 'Sorento'] },
  { id: 'SsangYong', color: '#7A1E2B', models: ['Tivoli', 'Korando', 'Actyon', 'Rexton'] },
];

/* Categorías (icon = nombre de ícono SVG definido en app.js) */
const CATEGORIES = [
  { id: 'tren-delantero', name: 'Tren Delantero', icon: 'suspension', desc: 'Suspensión: amortiguadores, bujes, muñequines y asientos' },
  { id: 'refrigeracion', name: 'Refrigeración', icon: 'temp', desc: 'Radiadores, mangueras, termostatos y electroventiladores' },
  { id: 'frenos', name: 'Frenos', icon: 'brake', desc: 'Pastillas y discos de freno' },
  { id: 'iluminacion', name: 'Iluminación', icon: 'light', desc: 'Faros delanteros, traseros y antiniebla' },
  { id: 'carroceria', name: 'Carrocería', icon: 'car', desc: 'Parrillas y paragolpes' },
  { id: 'motor', name: 'Motor y Encendido', icon: 'engine', desc: 'Correas dentadas, filtros y bobinas' },
];

/* --------------------------------------------------------------------------
   REPUESTOS (20) — productos reales de Solucar con su código original (OEM).
   - precio: precio de lista en guaraníes (Gs.). El "alternativo" es un estimado
     (precio × factorAlternativo).
   - fotos: archivos en img/repuestos/. La 1ª es la principal; las demás son vistas extra.
   - compat: [marca, 'modelo …']. Si el texto trae 'AAAA–AAAA' se usa en el filtro por año;
     si no trae años, aparece para cualquier año (se confirma por WhatsApp).
   -------------------------------------------------------------------------- */
const PRODUCTS = [
  /* ---------- Tren delantero y suspensión ---------- */
  {
    id: 'amortiguador-korando', sku: '45310-34000', name: 'Amortiguador trasero Korando 4x2', category: 'tren-delantero',
    precio: 600000, badge: 'Más vendido', destacado: true,
    compat: [['SsangYong', 'Korando 4x2']],
    desc: 'Amortiguador trasero para SsangYong Korando 4x2. Recupera la estabilidad, el frenado y el confort de marcha. Se recomienda cambiar en pares.',
    fotos: ['amortiguador-korando.jpg'],
  },
  {
    id: 'buje-parrilla-rexton', sku: '44517-08000', name: 'Buje de parrilla inferior Rexton', category: 'tren-delantero',
    precio: 60000,
    compat: [['SsangYong', 'Rexton']],
    desc: 'Buje de goma-metal para la parrilla inferior del SsangYong Rexton. Elimina golpeteos y mantiene la alineación del tren delantero.',
    fotos: ['buje-parrilla-rexton.jpg'],
  },
  {
    id: 'buje-parrilla-santafe', sku: '55118-26000', name: 'Buje de parrilla trasero Santa Fe', category: 'tren-delantero',
    precio: 80000, badge: 'Original',
    compat: [['Hyundai', 'Santa Fe']],
    desc: 'Buje de parrilla trasero original Hyundai para Santa Fe. Absorbe vibraciones y evita el desgaste irregular de los neumáticos.',
    fotos: ['buje-parrilla-santafe.jpg'],
  },
  {
    id: 'munequin-korando', sku: '46660-34050', name: 'Muñequín de dirección Korando', category: 'tren-delantero',
    precio: 350000,
    compat: [['SsangYong', 'Korando']],
    desc: 'Muñequín (terminal) de dirección con tuerca y chaveta para SsangYong Korando. Devuelve la precisión al volante y elimina el juego.',
    fotos: ['munequin-korando.jpg'],
  },
  {
    id: 'asiento-amortiguador-actyon', sku: '44321-08000', name: 'Asiento de amortiguador Actyon', category: 'tren-delantero',
    precio: 120000,
    compat: [['SsangYong', 'Actyon']],
    desc: 'Asiento de goma para el amortiguador del SsangYong Actyon. Evita ruidos y golpes en la suspensión. Ideal al cambiar amortiguadores.',
    fotos: ['asiento-amortiguador-actyon.jpg'],
  },

  /* ---------- Refrigeración (pack Tivoli: radiador + entrada + salida = 20% OFF) ---------- */
  {
    id: 'radiador-tivoli', sku: '21310-35200', name: 'Radiador de agua Tivoli', category: 'refrigeracion',
    precio: 2500000, badge: 'Más vendido', destacado: true,
    compat: [['SsangYong', 'Tivoli']],
    desc: 'Radiador de aluminio para SsangYong Tivoli. Evita el recalentamiento y protege el motor. Llévalo con las mangueras de entrada y salida y obtén 20% OFF.',
    fotos: ['radiador-tivoli.jpg'],
  },
  {
    id: 'manguera-entrada-tivoli', sku: '21411-35060', name: 'Manguera de radiador entrada (superior) Tivoli', category: 'refrigeracion',
    precio: 140000, badge: 'Original',
    compat: [['SsangYong', 'Tivoli']],
    desc: 'Manguera superior (entrada) de radiador original SsangYong para Tivoli. Parte del Pack Refrigeración Tivoli con 20% OFF.',
    fotos: ['manguera-entrada-tivoli.jpg'],
  },
  {
    id: 'manguera-salida-tivoli', sku: '21421-35060', name: 'Manguera de radiador salida (inferior) Tivoli', category: 'refrigeracion',
    precio: 90000, badge: 'Original',
    compat: [['SsangYong', 'Tivoli']],
    desc: 'Manguera inferior (salida) de radiador original SsangYong para Tivoli. Parte del Pack Refrigeración Tivoli con 20% OFF.',
    fotos: ['manguera-salida-tivoli.jpg'],
  },
  {
    id: 'termostato-picanto', sku: '25500-02500', name: 'Termostato Picanto / i10', category: 'refrigeracion',
    precio: 80000, badge: 'Original',
    compat: [['Kia', 'Picanto desde 2008'], ['Hyundai', 'i10']],
    desc: 'Termostato original para Kia Picanto e Hyundai i10. Mantiene el motor a la temperatura correcta y evita el consumo excesivo.',
    fotos: ['termostato-picanto.jpg'],
  },
  {
    id: 'electroventilador-picanto', sku: '25380-1Y090', name: 'Conjunto electroventilador Picanto', category: 'refrigeracion',
    precio: 850000,
    compat: [['Kia', 'Picanto']],
    desc: 'Electroventilador completo con motor y carcasa para Kia Picanto. Indispensable para no recalentar en ciudad y en el tránsito lento.',
    fotos: ['electroventilador-picanto.jpg'],
  },

  /* ---------- Frenos ---------- */
  {
    id: 'pastillas-ssangyong', sku: '48130-341A0', name: 'Pastillas de freno SsangYong (juego)', category: 'frenos',
    precio: 220000, destacado: true,
    compat: [['SsangYong', 'Consultar modelo']],
    desc: 'Juego de pastillas de freno para SsangYong. Frenado firme y silencioso. Envíanos tu chapa o VIN y confirmamos la compatibilidad exacta.',
    fotos: ['pastillas-ssangyong.jpg'],
  },
  {
    id: 'disco-freno-delantero', sku: '51712-A7000', name: 'Disco de freno delantero', category: 'frenos',
    precio: 420000, destacado: true,
    compat: [['Kia', 'Cerato']],
    desc: 'Disco de freno delantero ventilado. Se recomienda instalarlo junto a pastillas nuevas. Confirmamos la compatibilidad con tu chapa o VIN.',
    fotos: ['disco-freno-delantero.jpg'],
  },

  /* ---------- Iluminación ---------- */
  {
    id: 'faro-delantero-accent', sku: '92101-1E000', name: 'Faro delantero Accent 06', category: 'iluminacion',
    precio: 550000, badge: 'Nuevo', destacado: true,
    compat: [['Hyundai', 'Accent desde 2006']],
    desc: 'Óptica delantera completa para Hyundai Accent 2006 en adelante. Disponible lado izquierdo (LH 92101-1E000) y derecho (RH 92102-1E000): indícalo al cotizar.',
    fotos: ['faro-delantero-accent.jpg', 'faro-delantero-accent-2.jpg'],
  },
  {
    id: 'faro-trasero-tucson', sku: '92401-D3000', name: 'Faro trasero New Tucson', category: 'iluminacion',
    precio: 250000, destacado: true,
    compat: [['Hyundai', 'New Tucson']],
    desc: 'Faro trasero para Hyundai New Tucson. Lado izquierdo (LH 92401-D3000) y derecho (RH 92402-D3500): indícalo al cotizar.',
    fotos: ['faro-trasero-tucson.jpg', 'faro-trasero-tucson-2.jpg'],
  },
  {
    id: 'antiniebla-sorento', sku: 'SOR-16-ANT', name: 'Faro antiniebla Sorento 16', category: 'iluminacion',
    precio: 250000, destacado: true,
    compat: [['Kia', 'Sorento desde 2016']],
    desc: 'Faro antiniebla delantero para Kia Sorento 2016 en adelante. Mejora la visibilidad en niebla y lluvia. Lado izquierdo o derecho.',
    fotos: ['antiniebla-sorento.jpg'],
  },

  /* ---------- Carrocería ---------- */
  {
    id: 'parrilla-picanto', sku: '86350-1Y000', name: 'Parrilla de radiador Picanto', category: 'carroceria',
    precio: 300000, destacado: true,
    compat: [['Kia', 'Picanto']],
    desc: 'Parrilla frontal con marco cromado y emblema Kia para Picanto. Calce exacto con los anclajes originales.',
    fotos: ['parrilla-picanto.jpg'],
  },
  {
    id: 'paragolpe-grand-i10', sku: 'GI10-PDL', name: 'Paragolpe delantero Grand i10', category: 'carroceria',
    precio: 450000,
    compat: [['Hyundai', 'Grand i10']],
    desc: 'Paragolpe delantero para Hyundai Grand i10, listo para pintar. Calce exacto con los anclajes originales.',
    fotos: ['paragolpe-grand-i10.jpg'],
  },

  /* ---------- Motor y encendido ---------- */
  {
    id: 'correa-dentada-tucson', sku: '24312-27000', name: 'Correa dentada Tucson / Sportage', category: 'motor',
    precio: 240000, badge: 'Original', destacado: true,
    compat: [['Hyundai', 'Tucson 2.0 diésel'], ['Kia', 'Sportage 2.0 diésel']],
    desc: 'Correa de distribución original para Hyundai Tucson y Kia Sportage. Cambio preventivo recomendado según el kilometraje del fabricante.',
    fotos: ['correa-dentada-tucson.jpg'],
  },
  {
    id: 'filtro-aire-tucson', sku: '28113-2S000', name: 'Filtro de aire New Tucson / Sportage', category: 'motor',
    precio: 60000,
    compat: [['Hyundai', 'New Tucson'], ['Kia', 'Sportage']],
    desc: 'Filtro de aire de motor. Mejora la respuesta del motor y el consumo de combustible. Cámbialo en cada mantenimiento.',
    fotos: ['filtro-aire-tucson.jpg'],
  },
  {
    id: 'bobina-tivoli', sku: '17315-80103', name: 'Bobina de encendido Tivoli', category: 'motor',
    precio: 500000, badge: 'Original',
    compat: [['SsangYong', 'Tivoli']],
    desc: 'Bobina de encendido original SsangYong para Tivoli. Corrige tirones, pérdida de potencia y la luz de check engine por fallas de encendido.',
    fotos: ['bobina-tivoli.jpg'],
  },
];
