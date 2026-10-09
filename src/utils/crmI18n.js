// ════════════════════════════════════════════════════════════════
//  TEXTOS ES/EN — datos de CRM (HubSpot): bloque de la vista por cliente
//  y card «Deals generados» de cada pilar. Idioma base ES.
// ════════════════════════════════════════════════════════════════

export const CRM_SOURCE_NAMES = {
  es: {
    social: 'Social Media',
    paid: 'Paid Media',
    website: 'Website',
    email: 'Email Marketing',
    webinars: 'Webinars',
    steal: 'STEAL',
    database: 'Database',
    ctool: 'Commercial Tool',
    inperson: 'Eventos presenciales',
    bdr: 'BDR MarComms',
  },
  en: {
    social: 'Social Media',
    paid: 'Paid Media',
    website: 'Website',
    email: 'Email Marketing',
    webinars: 'Webinars',
    steal: 'STEAL',
    database: 'Database',
    ctool: 'Commercial Tool',
    inperson: 'In-person events',
    bdr: 'BDR MarComms',
  },
};

export const CRM_STR = {
  es: {
    // Vista por cliente
    section: 'Resultados Comerciales — HubSpot',
    sectionNote: (date) => `Deals originados por MarComms · datos al ${date}`,
    periodLabel: 'Período',
    yearLabel: 'Acumulado 2026',
    kMql: 'MQLs',
    kWon: 'Ventas (WON)',
    dealsWord: (n) => (n === 1 ? 'deal' : 'deals'),
    byPillar: 'Por pilar',
    otherTitle: 'Otros orígenes MarComms',
    otherNote: 'Fuera de los 5 pilares: se informan aparte y no suman al número principal',
    hSource: 'Origen',
    hGenerated: 'Generados',
    hMql: 'MQLs',
    hMqlAmount: 'Importe MQL',
    hWon: 'WON',
    hWonAmount: 'Importe WON',
    total: 'Total',
    bdrEmpty: 'BDR: el origen «BDR MarComms» existe en HubSpot, pero todavía no tiene deals cargados.',
    noCrm: 'Sin información suficiente: este cliente no tiene una entidad de HubSpot asignable.',
    noCrmGlobal:
      'Los deals de los webinars globales quedan en la entidad del dueño del webinar (Control Union Alemania), que no corresponde a este cliente.',
    entitiesLabel: 'Entidades de HubSpot incluidas:',
    undated: (n, amt) => `${n} ${n === 1 ? 'deal WON' : 'deals WON'} sin fecha de cierre en HubSpot (${amt}): no se cuentan en ningún mes.`,
    defs: 'Generados: todos los stages, por fecha de creación. MQL: stage actual Qualified o más avanzado (no LOST), en el mes en que llegó por primera vez a ese nivel. WON: por fecha de cierre. Importes en la moneda de cada deal, sin conversión.',
    noAmountNote: (n) => `${n} ${n === 1 ? 'deal' : 'deals'} sin importe cargado en HubSpot`,
    // Card de los pilares
    cardLabel: 'Deals generados · HubSpot',
    // Solo las partes mayores a cero; si las dos dan cero, sin pill.
    cardPill: (mql, won) => [mql > 0 ? `${mql} MQL${mql === 1 ? '' : 's'}` : null, won > 0 ? `${won} WON` : null].filter(Boolean).join(' · ') || null,
    cardFootShort: (src, when) => `Origen «${src}» · ${when}`,
    asOfLabel: (date) => `datos al ${date}`,
    stripGenerated: 'HubSpot — Deals generados',
    stripMql: 'HubSpot — MQLs',
    stripWon: 'HubSpot — Ventas (WON)',
    stripFoot: 'Acumulado 2026 · 5 pilares',
    stripNoAmount: (n) => `${n} sin importe`,
  },
  en: {
    section: 'Commercial Results — HubSpot',
    sectionNote: (date) => `Deals sourced by MarComms · data as of ${date}`,
    periodLabel: 'Period',
    yearLabel: '2026 to date',
    kMql: 'MQLs',
    kWon: 'Sales (WON)',
    dealsWord: (n) => (n === 1 ? 'deal' : 'deals'),
    byPillar: 'By pillar',
    otherTitle: 'Other MarComms sources',
    otherNote: 'Outside the 5 pillars: reported separately and not added to the main figure',
    hSource: 'Source',
    hGenerated: 'Generated',
    hMql: 'MQLs',
    hMqlAmount: 'MQL amount',
    hWon: 'WON',
    hWonAmount: 'WON amount',
    total: 'Total',
    bdrEmpty: 'BDR: the “BDR MarComms” source exists in HubSpot, but no deals have been logged with it yet.',
    noCrm: 'Not enough information: this client has no HubSpot entity that can be assigned.',
    noCrmGlobal:
      "Deals from the global webinars sit in the webinar owner's entity (Control Union Germany), which does not belong to this client.",
    entitiesLabel: 'HubSpot entities included:',
    undated: (n, amt) => `${n} WON ${n === 1 ? 'deal' : 'deals'} with no close date in HubSpot (${amt}): not counted in any month.`,
    defs: 'Generated: all stages, by creation date. MQL: current stage Qualified or later (not LOST), in the month it first reached that level. WON: by close date. Amounts in each deal’s currency, never converted.',
    noAmountNote: (n) => `${n} ${n === 1 ? 'deal' : 'deals'} with no amount entered in HubSpot`,
    cardLabel: 'Deals generated · HubSpot',
    // Solo las partes mayores a cero; si las dos dan cero, sin pill.
    cardPill: (mql, won) => [mql > 0 ? `${mql} MQL${mql === 1 ? '' : 's'}` : null, won > 0 ? `${won} WON` : null].filter(Boolean).join(' · ') || null,
    cardFootShort: (src, when) => `Source “${src}” · ${when}`,
    asOfLabel: (date) => `data as of ${date}`,
    stripGenerated: 'HubSpot — Deals generated',
    stripMql: 'HubSpot — MQLs',
    stripWon: 'HubSpot — Sales (WON)',
    stripFoot: '2026 to date · 5 pillars',
    stripNoAmount: (n) => `${n} with no amount`,
  },
};

// Importes por moneda («53.323 USD · 1.350 EUR»), nunca sumados entre sí.
export function fmtMoney(byCurrency, lang = 'es') {
  const loc = lang === 'en' ? 'en-US' : 'es-AR';
  const parts = Object.entries(byCurrency)
    .sort((a, b) => b[1] - a[1])
    .map(([cur, v]) => `${Math.round(v).toLocaleString(loc)} ${cur}`);
  return parts.length ? parts.join(' · ') : '—';
}

export function fmtInt(n, lang = 'es') {
  return Number(n ?? 0).toLocaleString(lang === 'en' ? 'en-US' : 'es-AR');
}

export function fmtAsOf(iso, lang = 'es') {
  const [y, m, d] = iso.split('-');
  return lang === 'en' ? `${m}/${d}/${y}` : `${d}/${m}/${y}`;
}

const MONTHS_SHORT = {
  es: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
};

// Rango de meses del período («jul–sep 2026», «sep 2026»).
export function monthsRangeLabel(months, lang = 'es', year = 2026) {
  if (!months?.length) return '';
  const name = (m) => MONTHS_SHORT[lang][Number(m.slice(1)) - 1];
  const first = name(months[0]);
  const last = name(months[months.length - 1]);
  return first === last ? `${first} ${year}` : `${first}–${last} ${year}`;
}

// ¿El período terminó antes de la fecha de corte de los datos? (último día
// del último mes del período < asOf). Si terminó, la card habla del período;
// si no, aclara «datos al <asOf>».
export function periodClosed(months, asOf, year = 2026) {
  if (!months?.length) return false;
  const m = Number(months[months.length - 1].slice(1));
  const end = new Date(Date.UTC(year, m, 0)); // último día del mes m
  return end.toISOString().slice(0, 10) < asOf;
}

