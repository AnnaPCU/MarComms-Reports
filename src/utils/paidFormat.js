// ════════════════════════════════════════════════════════════════
//  Formato numérico del pilar Paid según el idioma del reporte:
//  es-AR en español (1.234,56 · 4,09 %), en-US en inglés (1,234.56 · 4.09%).
//  El importe lleva siempre la moneda REAL del período (EUR o ARS).
// ════════════════════════════════════════════════════════════════

export function paidFmt(lang = 'es') {
  const en = lang === 'en';
  const loc = en ? 'en-US' : 'es-AR';
  const two = { minimumFractionDigits: 2, maximumFractionDigits: 2 };
  const numEs = (v) => Number(v || 0).toLocaleString(loc);
  const pct = (v) => Number(v || 0).toLocaleString(loc, two) + (en ? '%' : ' %');
  const money = (v, c) => Number(v || 0).toLocaleString(loc, two) + ' ' + (c || 'EUR');
  return { numEs, pct, money, cash: money };
}
