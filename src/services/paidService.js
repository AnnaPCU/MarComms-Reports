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
  if (period === 'cmp') return true; // comparativa global (todas las cuentas)
  if (period === 'year-2026') return MONTHS_2026.some((p) => PAID_DB[account]?.periods?.[p.id]);
  if (String(period).startsWith('geo-')) return Boolean(getGeo(account, period));
  return Boolean(getMonthly(account, period));
}

// Detalle por grupo de anuncios (consumo semanal + términos/keywords).
// Solo existe para los meses con los informes de detalle cargados.
export function getDetail(accountId, periodId) {
  return PAID_DETAIL[accountId]?.[periodId] ?? null;
}

// ── Resumen del Año / Comparativa ─────────────────────────────────

// Deriva las métricas calculadas (CTR, CPC, etc.) de un acumulado.
function derive(s) {
  s.ctr = s.impressions ? (s.clicks / s.impressions) * 100 : 0;
  s.cpc = s.clicks ? s.cost / s.clicks : 0;
  s.convRate = s.clicks ? (s.conversions / s.clicks) * 100 : 0;
  s.costPerConv = s.conversions ? s.cost / s.conversions : 0;
  return s;
}

function aggTotals(list) {
  const s = { impressions: 0, clicks: 0, cost: 0, conversions: 0 };
  for (const t of list) {
    s.impressions += t.impressions || 0;
    s.clicks += t.clicks || 0;
    s.cost += t.cost || 0;
    s.conversions += t.conversions || 0;
  }
  return derive(s);
}

// Resumen anual de una cuenta: solo los meses CON datos (Google Ads).
// Devuelve null si la cuenta no tiene ningún mes cargado (regla de honestidad).
export function getYear(accountId) {
  const acc = PAID_DB[accountId];
  const months = MONTHS_2026.filter((p) => acc?.periods?.[p.id]).map((p) => {
    const per = acc.periods[p.id];
    return { id: p.id, label: p.label, partial: Boolean(per.partial), ...per.totals };
  });
  if (!months.length) return null;

  const totals = aggTotals(months);
  totals.currency = months[0].currency || 'EUR';

  // Campañas acumuladas del año (por nombre, sumando los meses activos).
  const byName = {};
  for (const p of MONTHS_2026) {
    const per = acc.periods[p.id];
    if (!per) continue;
    for (const c of per.campaigns) {
      const e = (byName[c.name] ??= { name: c.name, impressions: 0, clicks: 0, cost: 0, conversions: 0, months: 0 });
      e.impressions += c.impressions || 0;
      e.clicks += c.clicks || 0;
      e.cost += c.cost || 0;
      e.conversions += c.conversions || 0;
      e.months++;
    }
  }
  const campaigns = Object.values(byName).map(derive).sort((a, b) => b.cost - a.cost);

  const first = acc.periods[months[0].id];
  const geo = listGeoPeriods()
    .filter((gp) => getGeo(accountId, gp.id))
    .map((gp) => ({ id: gp.id, label: gp.label }));

  return { channel: first.channel, currency: totals.currency, months, totals, campaigns, geo };
}

// Comparativa multi-cuenta: resumen anual de cada cuenta con datos mensuales.
export function getComparative() {
  return PAID_CLIENTS.map((a) => {
    const y = getYear(a.id);
    return y && { id: a.id, name: a.name, ...y };
  }).filter(Boolean);
}

// Cuentas que corrieron campañas GEO de Meta (reporte propio, fuera de la
// comparativa de Google Ads).
export function listGeoAccounts() {
  return PAID_CLIENTS.filter((a) => listGeoPeriods().some((p) => getGeo(a.id, p.id)));
}
