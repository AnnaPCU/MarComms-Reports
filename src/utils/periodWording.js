// ════════════════════════════════════════════════════════════════
//  Textos de período: los generadores de insights y las notas de Social
//  hablan de «mes». Cuando la vista es un trimestre (Q1–Q4, suma de 3
//  meses), se reescriben para que digan «trimestre» (y comparen contra el
//  trimestre anterior, que es lo que reciben como `prev`).
// ════════════════════════════════════════════════════════════════

export function isQuarterPeriod(periodId) {
  return /^q[1-4]-\d{4}$/.test(periodId ?? '');
}

// Campaña en paralelo de Paid (`par-…`): es un vuelo, no un mes.
export function isFlightPeriod(periodId) {
  return /^par-/.test(periodId ?? '');
}

const ES = [
  [/mes anterior/g, 'trimestre anterior'],
  [/mes ant\./g, 'trim. ant.'],
  [/el próximo mes/g, 'el próximo trimestre'],
  [/mes a mes/g, 'trimestre a trimestre'],
  [/\bdel mes\b/g, 'del trimestre'],
  [/\ben el mes\b/g, 'en el trimestre'],
  [/\bun dato del mes\b/g, 'un dato del trimestre'],
];
const EN = [
  [/previous month/g, 'previous quarter'],
  [/prev\. month/g, 'prev. quarter'],
  [/next month/g, 'next quarter'],
  [/month over month/gi, 'quarter over quarter'],
  [/the month's/g, "the quarter's"],
  [/of the month/g, 'of the quarter'],
  [/in the month/g, 'in the quarter'],
  [/a monthly figure/g, 'a quarterly figure'],
];

const ES_FLIGHT = [
  [/mes anterior/g, 'período anterior'],
  [/el próximo mes/g, 'el próximo período'],
  [/\bdel mes\b/g, 'del período'],
  [/\ben el mes\b/g, 'en el período'],
];
const EN_FLIGHT = [
  [/previous month/g, 'previous period'],
  [/next month/g, 'next period'],
  [/this month/g, 'this period'],
  [/the month's/g, "the period's"],
  [/of the month/g, 'of the period'],
  [/in the month/g, 'in the period'],
];

function table(periodId, lang) {
  if (isQuarterPeriod(periodId)) return lang === 'en' ? EN : ES;
  if (isFlightPeriod(periodId)) return lang === 'en' ? EN_FLIGHT : ES_FLIGHT;
  return null;
}

// Reescribe un texto de «mes» a «trimestre» (o a «período», en una campaña
// en paralelo) según el período.
export function periodText(text, periodId, lang = 'es') {
  const tb = table(periodId, lang);
  if (typeof text !== 'string' || !tb) return text;
  return tb.reduce((s, [re, to]) => s.replace(re, to), text);
}

// Aplica periodText a todos los textos de una lista de insights / conclusiones
// / próximos pasos (objetos con campos de texto o strings sueltos).
export function periodItems(items, periodId, lang = 'es') {
  if (!table(periodId, lang) || !Array.isArray(items)) return items;
  return items.map((it) =>
    typeof it === 'string'
      ? periodText(it, periodId, lang)
      : Object.fromEntries(Object.entries(it).map(([k, v]) => [k, periodText(v, periodId, lang)])),
  );
}

// Delta con su etiqueta adaptada al período.
export function periodDelta(delta, periodId, lang = 'es') {
  return delta ? { ...delta, label: periodText(delta.label, periodId, lang) } : delta;
}
