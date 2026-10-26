// Semanas de Google Ads (lunes a domingo).

// Lunes de la semana de una fecha ISO ("2026-10-15" → "2026-10-12").
export function mondayOf(iso) {
  const d = new Date(`${iso}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 6) % 7));
  return d.toISOString().slice(0, 10);
}

// Semana como rango completo, para que no se lea como un día suelto:
// "2026-10-12" → "12/10 al 18/10" (ES) · "10/12 to 10/18" (EN).
// Si cruza de mes: "28/9 al 4/10".
export function weekRangeLabel(w, lang = 'es') {
  const start = new Date(`${w}T12:00:00Z`);
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 6);
  const [a, b] = [start, end].map((x) => ({ d: x.getUTCDate(), m: x.getUTCMonth() + 1 }));
  return lang === 'en' ? `${a.m}/${a.d} to ${b.m}/${b.d}` : `${a.d}/${a.m} al ${b.d}/${b.m}`;
}
