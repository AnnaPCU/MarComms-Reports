// SERVICE — Pilar Paid Media (Google Ads, Meta Ads). Mensual + eventos GEO.
// Fuente de datos: seed en código (src/data/paidSeed.js). Sin base de datos.
import { PAID_CLIENTS, PAID_DB } from '@/data/paidSeed';
import { PAID_DETAIL } from '@/data/paidDetail';
import { META_GEO, META_GEO_PERIOD } from '@/data/paidMetaGeo';
import { MONTHS_2026 } from '@/constants/periods';

export function listAccounts() {
  return PAID_CLIENTS;
}

export function listPeriods() {
  return MONTHS_2026;
}

// Períodos especiales: campañas GEO de Meta Ads atadas a un evento.
export function listGeoPeriods() {
  return [META_GEO_PERIOD];
}

export function getMonthly(accountId, periodId) {
  return PAID_DB[accountId]?.periods?.[periodId] ?? null;
}

// Reporte GEO (Meta Ads) de una cuenta para un período-evento.
export function getGeo(accountId, periodId) {
  return META_GEO[accountId]?.[periodId] ?? null;
}

export function hasDataFor(account, period) {
  if (String(period).startsWith('geo-')) return Boolean(getGeo(account, period));
  return Boolean(getMonthly(account, period));
}

// Detalle por grupo de anuncios (consumo semanal + términos/keywords).
// Solo existe para los meses con los informes de detalle cargados.
export function getDetail(accountId, periodId) {
  return PAID_DETAIL[accountId]?.[periodId] ?? null;
}
