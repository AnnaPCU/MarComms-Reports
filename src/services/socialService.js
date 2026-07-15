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

// ── ¿Hay datos para (cuenta, período)? (para el badge del header) ──
export function hasDataFor(account, period) {
  if (period === 'cmp') return true;
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
