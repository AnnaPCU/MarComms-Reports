// ════════════════════════════════════════════════════════════════
//  SERVICE — Pilar Social Media (LinkedIn)
//
//  Capa de acceso a datos. La UI NUNCA toca el seed directo: habla con
//  este service a través del hook useSocialMonthly.
//
//  Fuente de datos: seed en código (src/data/socialSeed.js) — ver
//  src/lib/README de decisiones. Sin base de datos.
// ════════════════════════════════════════════════════════════════

import { DB, ML, MO } from '@/data/socialSeed';
import { LATAM_DB, LATAM_COUNTRIES } from '@/data/socialLatam';
import { monthHasData } from '@/utils/hasData';

// ── Cuentas (clientes del pilar Social) ──
export function listAccounts() {
  return Object.entries(DB).map(([id, d]) => ({ id, name: d.name }));
}

// ── Períodos seleccionables ──
export function listPeriods() {
  return MO.map((id) => ({ id, label: ML[id] }));
}

// ── Datos mensuales de una cuenta para un período (o null; puede traer _nodata) ──
export function getMonthly(accountId, periodId) {
  const acc = DB[accountId];
  if (!acc) return null;
  return acc.mo?.[periodId] ?? null;
}

// Período anterior (para los deltas), solo si existe y TIENE datos.
export function getPrevMonthly(accountId, periodId) {
  const i = MO.indexOf(periodId);
  if (i <= 0) return null;
  const prev = getMonthly(accountId, MO[i - 1]);
  return monthHasData(prev) ? prev : null;
}

// ── Serie anual: todos los meses conocidos con su dato (o null si vacío) ──
// Sirve para el "Resumen del Año" (progreso mes a mes de una cuenta).
export function getYearSeries(accountId) {
  const acc = DB[accountId];
  if (!acc) return { accName: '', series: [] };
  const series = MO.map((id) => {
    const mo = getMonthly(accountId, id);
    return { id, label: ML[id], short: (ML[id] || id).replace(/\s*20\d\d$/, ''), mo: monthHasData(mo) ? mo : null };
  });
  return { accName: acc.name, series };
}

// ¿La cuenta tiene al menos un mes con datos? (para habilitar el resumen anual)
export function hasYearData(accountId) {
  return getYearSeries(accountId).series.some((s) => s.mo);
}

// ── ¿Hay datos para (cuenta, período)? (para el badge del header) ──
export function hasDataFor(account, period) {
  if (period === 'cmp') return true;
  if (period === 'year-2026') return hasYearData(account);
  return monthHasData(getMonthly(account, period));
}

// ── Audiencia (distribuciones de la cuenta) ──
export function getAudience(accountId) {
  const acc = DB[accountId];
  if (!acc) return { seniority: [], jobFunction: [] };
  return { seniority: acc.sen ?? [], jobFunction: acc.job ?? [] };
}

export function prevPeriodId(period) {
  const i = MO.indexOf(period);
  return i > 0 ? MO[i - 1] : null;
}

// ── Comparativa multi-cuenta (efectividad, Mayo 2026) ──
export { CMP_DATA, TOP_ENG_POSTS } from '@/data/socialSeed';

// ════════════════════════════════════════════════════════════════
//  Segmentación POR PAÍS de CU Latinoamérica (cuenta 'cul').
//  Datos generados por scripts/linkedin/build_latam.py — ver la nota de
//  metodología en src/data/socialLatam.js (posts por hashtag de país +
//  hojas de Ubicación del export de LinkedIn).
// ════════════════════════════════════════════════════════════════
export { LATAM_COUNTRIES };

export function getLatamCountry(countryId, periodId) {
  return LATAM_DB[periodId]?.[countryId] ?? null;
}

// Mes anterior del país, solo si tuvo publicaciones (para los deltas).
export function getPrevLatamCountry(countryId, periodId) {
  const i = MO.indexOf(periodId);
  if (i <= 0) return null;
  const prev = getLatamCountry(countryId, MO[i - 1]);
  return prev && prev.np > 0 ? prev : null;
}

// Base de cálculo del mes (todas las publicaciones, con y sin país).
export function getLatamMonthTotals(periodId) {
  return LATAM_DB[periodId]?._tot ?? null;
}

// Seguidores del país: foto acumulada del export más reciente disponible.
export function getLatamFolBase(countryId) {
  for (let i = MO.length - 1; i >= 0; i--) {
    const d = LATAM_DB[MO[i]]?.[countryId];
    if (d?.folBase) return d.folBase;
  }
  return 0;
}
