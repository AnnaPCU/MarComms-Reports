// SERVICE — Pilar Paid Media (Google Ads, Meta Ads). Mensual.
// Fuente de datos: seed en código (src/data/paidSeed.js). Sin base de datos.
import { PAID_CLIENTS, PAID_DB } from '@/data/paidSeed';
import { MONTHS_2026 } from '@/constants/periods';

export function listAccounts() {
  return PAID_CLIENTS;
}

export function listPeriods() {
  return MONTHS_2026;
}

export function getMonthly(accountId, periodId) {
  return PAID_DB[accountId]?.periods?.[periodId] ?? null;
}

export function hasDataFor(account, period) {
  return Boolean(getMonthly(account, period));
}
