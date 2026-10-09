// ════════════════════════════════════════════════════════════════
//  Textos de período: los generadores de insights y las notas de Social
//  hablan de «mes». Cuando la vista es un trimestre (Q1–Q4, suma de 3
//  meses), se reescriben para que digan «trimestre» (y comparen contra el
//  trimestre anterior, que es lo que reciben como `prev`).
// ════════════════════════════════════════════════════════════════

export function isQuarterPeriod(periodId) {
  return /^q[1-4]-\d{4}$/.test(periodId ?? '');
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

// Reescribe un texto de «mes» a «trimestre» si el período es un trimestre.
export function periodText(text, periodId, lang = 'es') {
  if (typeof text !== 'string' || !isQuarterPeriod(periodId)) return text;
  return (lang === 'en' ? EN : ES).reduce((s, [re, to]) => s.replace(re, to), text);
}

// Aplica periodText a todos los textos de una lista de insights / conclusiones
// / próximos pasos (objetos con campos de texto o strings sueltos).
export function periodItems(items, periodId, lang = 'es') {
  if (!isQuarterPeriod(periodId) || !Array.isArray(items)) return items;
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
