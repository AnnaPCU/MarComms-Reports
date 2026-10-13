// ════════════════════════════════════════════════════════════════
//  Fechas de las campañas de Meta Ads (reporte por campaña).
//  Los días vienen en ISO (AAAA-MM-DD) desde build_meta.py; acá se
//  arman las etiquetas ES/EN («4 Ago» / «Aug 4») y los rangos de la ficha
//  («3–7 de agosto de 2026» / «August 3–7, 2026»).
// ════════════════════════════════════════════════════════════════

const MONTHS = {
  es: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
};
const SHORT = {
  es: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
};

function parts(iso) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso ?? '');
  return m ? { y: Number(m[1]), m: Number(m[2]) - 1, d: Number(m[3]) } : null;
}

// Etiqueta corta de un día: «4 Ago» (ES) / «Aug 4» (EN).
export function dayLabel(iso, en = false) {
  const p = parts(iso);
  if (!p) return iso;
  return en ? `${SHORT.en[p.m]} ${p.d}` : `${p.d} ${SHORT.es[p.m]}`;
}

// Rango largo: «3–7 de agosto de 2026» / «August 3–7, 2026». Con
// withYear=false omite el año. Mismo día → un solo día.
export function rangeLabel(startIso, endIso, lang = 'es', withYear = true) {
  const a = parts(startIso);
  const b = parts(endIso);
  if (!a || !b) return '';
  const L = MONTHS[lang === 'en' ? 'en' : 'es'];
  if (lang === 'en') {
    const yr = withYear ? `, ${b.y}` : '';
    if (a.m === b.m && a.y === b.y) return a.d === b.d ? `${L[a.m]} ${a.d}${yr}` : `${L[a.m]} ${a.d}–${b.d}${yr}`;
    return `${L[a.m]} ${a.d} – ${L[b.m]} ${b.d}${yr}`;
  }
  const yr = withYear ? ` de ${b.y}` : '';
  if (a.m === b.m && a.y === b.y) return a.d === b.d ? `${a.d} de ${L[a.m]}${yr}` : `${a.d}–${b.d} de ${L[a.m]}${yr}`;
  return `${a.d} de ${L[a.m]} – ${b.d} de ${L[b.m]}${yr}`;
}

// Días con entrega real (impresiones > 0) de un conjunto de campañas:
// { start, end } en ISO, o null si no hubo entrega.
export function deliveryWindow(campaigns) {
  const days = campaigns
    .flatMap((c) => c.days ?? [])
    .filter((x) => x.imp > 0)
    .map((x) => x.d)
    .sort();
  return days.length ? { start: days[0], end: days[days.length - 1] } : null;
}
