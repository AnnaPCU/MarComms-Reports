// ════════════════════════════════════════════════════════════════
//  CAMPAÑAS PARCIALES — campañas que arrancaron a mitad del mes.
//  Cuando una campaña se crea el día 21, sus métricas cubren 11 de los
//  31 días: compararlas de igual a igual contra campañas de mes completo
//  es engañoso. El seed guarda `startedOn: 'AAAA-MM-DD'` (fecha de alta
//  en Google Ads, del historial de cambios) y acá se calcula la ventana
//  real para avisarlo en la UI.
//  Nada se estima: si no hay `startedOn`, no se muestra ningún aviso.
// ════════════════════════════════════════════════════════════════

import { MONTHS_2026 } from '@/constants/periods';

const MONTH_ES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
];
const MONTH_EN = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

// Año del período mensual, leído de la etiqueta del período ("Agosto 2026").
function periodYear(periodId) {
  const label = MONTHS_2026.find((p) => p.id === periodId)?.label ?? '';
  const y = Number(label.match(/\d{4}/)?.[0]);
  return Number.isFinite(y) ? y : null;
}

// Devuelve la info de parcialidad de una campaña en un período mensual, o
// null si cubre el mes completo (o si no sabemos cuándo arrancó).
export function campaignPartial(campaign, periodId) {
  const started = campaign?.startedOn;
  if (!started || !/^m\d\d$/.test(String(periodId))) return null;

  const [y, m, d] = String(started).split('-').map(Number);
  if (!y || !m || !d) return null;

  // Solo es parcial si arrancó DENTRO del mes del reporte; si empezó antes,
  // el mes está completo y no hay nada que aclarar.
  if (m !== Number(periodId.slice(1)) || y !== periodYear(periodId)) return null;

  const totalDays = new Date(y, m, 0).getDate();
  const activeDays = totalDays - d + 1;
  return {
    startedOn: started,
    day: d,
    month: m,
    year: y,
    activeDays,
    totalDays,
    // Fecha larga para las notas al pie ("21 de agosto" / "August 21").
    dateLabel: (lang) => (lang === 'en' ? `${MONTH_EN[m - 1]} ${d}` : `${d} de ${MONTH_ES[m - 1]}`),
    // Fecha corta para los chips ("21/8").
    shortLabel: () => `${d}/${m}`,
  };
}

// ¿Hay al menos una campaña parcial en el mes?
export function hasPartialCampaigns(campaigns, periodId) {
  return (campaigns ?? []).some((c) => campaignPartial(c, periodId));
}
