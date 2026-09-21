// SERVICE — Vista Planes. Informes mensuales de avance por plan regional.
// Lee del seed en código (o del snapshot embebido en el HTML descargado).
import { PLAN_CLIENTS, PLAN_PERIODS, PLANS_DB } from '@/data/plansSeed';

const EMBED = typeof window !== 'undefined' ? window.__REPORT_EMBED__ : null;

export function listAccounts() {
  return PLAN_CLIENTS;
}

export function listPeriods() {
  return PLAN_PERIODS;
}

export function getPlan(accountId, periodId) {
  if (EMBED?.snapshot && 'plan' in EMBED.snapshot) return EMBED.snapshot.plan;
  return PLANS_DB[accountId]?.[periodId] ?? null;
}

export function hasDataFor(account, period) {
  return Boolean(PLANS_DB[account]?.[period]);
}
