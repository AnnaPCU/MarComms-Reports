// ════════════════════════════════════════════════════════════════
//  NOMBRE DE ARCHIVO DE LOS DESCARGABLES
//  Formato: <Cuenta>__Reporte_<Pilar>_<Mes>_<Año>.html
//  Ej: CU_Portugal__Reporte_Paid_Media_Junio_2026.html
//  En inglés: <Cuenta>__Report_<Pilar>_<Month>_<Year>.html
//  Se adapta a la cuenta (quién provee el servicio), el pilar, el período y
//  el idioma elegido al descargar (pedido del 28/9/2026: el nombre siempre
//  en el idioma del reporte, sea cual sea el pilar).
// ════════════════════════════════════════════════════════════════

const MONTHS = {
  m01: 'Enero',
  m02: 'Febrero',
  m03: 'Marzo',
  m04: 'Abril',
  m05: 'Mayo',
  m06: 'Junio',
  m07: 'Julio',
  m08: 'Agosto',
  m09: 'Septiembre',
  m10: 'Octubre',
  m11: 'Noviembre',
  m12: 'Diciembre',
};

const MONTHS_EN = {
  m01: 'January', m02: 'February', m03: 'March', m04: 'April', m05: 'May', m06: 'June',
  m07: 'July', m08: 'August', m09: 'September', m10: 'October', m11: 'November', m12: 'December',
};

// Traducción de las etiquetas de período del seed (en español) para nombres y
// títulos en inglés: meses completos y abreviados, y los textos fijos.
const LABEL_EN = [
  ['Enero', 'January'], ['Febrero', 'February'], ['Marzo', 'March'], ['Abril', 'April'], ['Mayo', 'May'], ['Junio', 'June'],
  ['Julio', 'July'], ['Agosto', 'August'], ['Septiembre', 'September'], ['Octubre', 'October'], ['Noviembre', 'November'], ['Diciembre', 'December'],
  ['Ene ', 'Jan '], ['Abr ', 'Apr '], ['Ago ', 'Aug '], ['Dic ', 'Dec '],
  ['Comparativa Multi-Cuenta', 'Multi-Account Comparison'], ['Resumen del Año', 'Year Summary'], ['Vista General', 'Overview'],
  ['Mes ', 'Month '],
];
export function localizeLabel(label, lang = 'es') {
  let out = String(label ?? '');
  if (lang !== 'en') return out;
  for (const [es, en] of LABEL_EN) out = out.split(es).join(en);
  return out;
}

// Etiqueta del pilar/vista en el idioma elegido (los ids de la nav son ES).
const PILAR_EN = { Cliente: 'Client', Planes: 'Plans', Plan: 'Plan' };
export function localizePilarLabel(label, lang = 'es') {
  return lang === 'en' ? (PILAR_EN[label] ?? label) : label;
}

// Expande la abreviatura de marca al nombre completo (para descargables/títulos).
// "CU Portugal" → "Control Union Portugal" · "PS Argentina" → "Peterson Solutions Argentina".
export function expandAccountName(name) {
  const s = String(name ?? '').trim();
  if (/^CU\b/.test(s)) return s.replace(/^CU\b/, 'Control Union');
  if (/^PS\b/.test(s)) return s.replace(/^PS\b/, 'Peterson Solutions');
  return s;
}

// Limpia un texto para usarlo en un nombre de archivo seguro:
// sin acentos/ñ, y espacios/símbolos → "_".
export function slugPart(s) {
  return String(s ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

// Parte del período: "Junio_2026" (mes), "Q1_2026" (trimestre), "Comparativa".
// En inglés: "June_2026", "Comparison", "Annual_Summary_2026".
function periodPart(period, periodLabel, lang) {
  const en = lang === 'en';
  if (!period) return '';
  if (period === 'cmp') return en ? 'Comparison' : 'Comparativa';
  if (period === 'year-2026') return en ? 'Annual_Summary_2026' : 'Resumen_Anual_2026';
  const year = (String(periodLabel).match(/\d{4}/) || ['2026'])[0];
  const month = (en ? MONTHS_EN : MONTHS)[period];
  if (month) return `${month}_${year}`;
  return slugPart(localizeLabel(periodLabel, lang)); // trimestres, eventos, informes u otros formatos
}

export function reportFilename({ pilarLabel, accountName, period, periodLabel, audience, lang = 'es' }) {
  const en = lang === 'en';
  const acc = slugPart(expandAccountName(accountName));
  const pil = slugPart(localizePilarLabel(pilarLabel, lang));
  const per = periodPart(period, periodLabel, lang);
  // El reporte externo lleva sufijo para distinguirlo del interno al descargar ambos.
  const suffix = audience === 'external' ? (en ? '_External' : '_Externo') : '';
  const base = (acc ? acc + '__' : '') + (en ? 'Report_' : 'Reporte_') + pil + (per ? '_' + per : '') + suffix;
  return `${base}.html`;
}
