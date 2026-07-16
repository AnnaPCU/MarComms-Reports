// ════════════════════════════════════════════════════════════════
//  NOMBRE DE ARCHIVO DE LOS DESCARGABLES
//  Formato: <Cuenta>__Reporte_<Pilar>_<Mes>_<Año>.html
//  Ej: CU_Portugal__Reporte_Paid_Media_Junio_2026.html
//  Se adapta a la cuenta (quién provee el servicio), el pilar y el período.
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
function periodPart(period, periodLabel) {
  if (!period) return '';
  if (period === 'cmp') return 'Comparativa';
  const year = (String(periodLabel).match(/\d{4}/) || ['2026'])[0];
  const month = MONTHS[period];
  if (month) return `${month}_${year}`;
  return slugPart(periodLabel); // trimestres u otros formatos
}

export function reportFilename({ pilarLabel, accountName, period, periodLabel, audience }) {
  const acc = slugPart(expandAccountName(accountName));
  const pil = slugPart(pilarLabel);
  const per = periodPart(period, periodLabel);
  // El reporte externo lleva sufijo para distinguirlo del interno al descargar ambos.
  const suffix = audience === 'external' ? '_Externo' : '';
  const base = (acc ? acc + '__' : '') + 'Reporte_' + pil + (per ? '_' + per : '') + suffix;
  return `${base}.html`;
}
