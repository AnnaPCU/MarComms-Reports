// SERVICE — Pilar Paid Media (Google Ads, Meta Ads). Mensual + eventos GEO.
// Fuente de datos: seed en código (src/data/paidSeed.js). Sin base de datos.
import { PAID_CLIENTS, PAID_DB } from '@/data/paidSeed';
import { PAID_DETAIL } from '@/data/paidDetail';
import { META_GEO, META_PERIODS } from '@/data/paidMetaGeo';
import { PARALLEL, PARALLEL_PERIODS } from '@/data/paidParallel';
import { MONTHS_2026 } from '@/constants/periods';

export function listAccounts() {
  return PAID_CLIENTS;
}

export function listPeriods() {
  return MONTHS_2026;
}

// Períodos especiales: campañas cortas de Meta Ads (GEO de evento u otras
// de una o pocas semanas), más reciente primero. Cada una es su propio
// reporte, fuera del flujo mensual de Google Ads.
export function listGeoPeriods() {
  return META_PERIODS;
}

// ¿El período es una campaña de Meta (`geo-…` o `meta-…`)?
export function isMetaPeriod(periodId) {
  return /^(geo|meta)-/.test(String(periodId ?? ''));
}

// Campañas hechas en paralelo en Google Ads y Meta Ads (`par-…`, §22 de
// DECISIONES): un período propio con selector de plataforma adentro.
export function listParallelPeriods() {
  return PARALLEL_PERIODS;
}

export function isParallelPeriod(periodId) {
  return /^par-/.test(String(periodId ?? ''));
}

export function getParallel(accountId, periodId) {
  return PARALLEL[accountId]?.[periodId] ?? null;
}

// Períodos fuera del flujo mensual (en paralelo + campañas de Meta), del
// más reciente al más viejo: van arriba de los meses en «Período/Campaña».
export function listSpecialPeriods() {
  return [...PARALLEL_PERIODS, ...META_PERIODS].sort((a, b) => b.start.localeCompare(a.start));
}

// ── Campañas que todavía no arrancaron ──
// Una campaña aparece desde el mes en que arranca, nunca antes (pedido del
// equipo, 20/10/2026: IFPA figuraba en septiembre de CU Estados Unidos sin
// haber empezado). Arrancó si tiene actividad (impresiones, clics o coste)
// en ese mes o en uno anterior, o si su `startedOn` cae en ese mes o antes.
// Google Ads exporta como «Habilitada» y en cero a las campañas creadas que
// todavía no salieron: esas no se muestran. Los totales no cambian (suman 0).
const ORDER = MONTHS_2026.map((p) => p.id);
const hasActivity = (c) => (c.impressions || 0) > 0 || (c.clicks || 0) > 0 || (c.cost || 0) > 0;
const monthCache = new Map();

function startedBy(accountId, periodId) {
  const names = new Set();
  const periods = PAID_DB[accountId]?.periods ?? {};
  for (const id of ORDER.slice(0, ORDER.indexOf(periodId) + 1)) {
    for (const c of periods[id]?.campaigns ?? []) if (hasActivity(c)) names.add(c.name);
  }
  return names;
}

export function getMonthly(accountId, periodId) {
  // Campaña en paralelo: lo de Google Ads del vuelo (con la misma forma que un mes).
  if (isParallelPeriod(periodId)) return getParallel(accountId, periodId)?.google?.mo ?? null;
  const per = PAID_DB[accountId]?.periods?.[periodId];
  if (!per) return null;
  const key = `${accountId}|${periodId}`;
  if (monthCache.has(key)) return monthCache.get(key);
  const started = startedBy(accountId, periodId);
  const monthNum = Number(String(periodId).slice(1));
  const campaigns = per.campaigns.filter(
    (c) => started.has(c.name) || (c.startedOn && Number(c.startedOn.slice(5, 7)) <= monthNum),
  );
  const out = campaigns.length === per.campaigns.length ? per : { ...per, campaigns };
  monthCache.set(key, out);
  return out;
}

// Reporte de una campaña de Meta Ads de una cuenta.
// En una campaña en paralelo, la parte de Meta Ads.
export function getGeo(accountId, periodId) {
  if (isParallelPeriod(periodId)) return getParallel(accountId, periodId)?.meta ?? null;
  return META_GEO[accountId]?.[periodId] ?? null;
}

export function hasDataFor(account, period) {
  if (period === 'cmp') return true; // comparativa global (todas las cuentas)
  if (period === 'year-2026') return MONTHS_2026.some((p) => PAID_DB[account]?.periods?.[p.id]);
  if (isMetaPeriod(period)) return Boolean(getGeo(account, period));
  if (isParallelPeriod(period)) return Boolean(getParallel(account, period));
  return Boolean(getMonthly(account, period));
}

// Moneda(s) original(es) del período, para el descargable en otra moneda
// (§19): el mes o la parte de Google de una campaña en paralelo (moneda de
// facturación de Google Ads) y la de Meta Ads. [] si el período no se
// convierte (resumen anual, comparativa) o no tiene datos.
export function getNativeCurrencies(accountId, periodId) {
  if (isParallelPeriod(periodId)) {
    const p = getParallel(accountId, periodId);
    return [p?.google?.mo?.totals?.currency, p?.meta?.currency].filter(Boolean);
  }
  if (isMetaPeriod(periodId)) return [getGeo(accountId, periodId)?.currency].filter(Boolean);
  if (/^m\d\d$/.test(String(periodId))) return [getMonthly(accountId, periodId)?.totals?.currency].filter(Boolean);
  return [];
}

// Detalle por grupo de anuncios (consumo semanal + términos/keywords).
// Solo existe para los meses con los informes de detalle cargados.
export function getDetail(accountId, periodId) {
  if (isParallelPeriod(periodId)) return getParallel(accountId, periodId)?.google?.detail ?? null;
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

  // ── Cambio de moneda ──
  // La cuenta pasó de EUR a ARS en agosto 2026 (cambio de cuenta de Google
  // Ads). El resumen cubre igual el año completo: los volúmenes se suman
  // normalmente y los importes se suman POR MONEDA, sin convertir nunca de
  // una a otra (`costByCurrency` es esa sumatoria). `totals.cost` guarda el
  // acumulado de la moneda vigente, que es lo que usan los gráficos y la
  // comparativa entre cuentas, donde hace falta un único número.
  const curOf = (m) => m.currency || 'EUR';
  const currency = curOf(months[months.length - 1]);
  const currencies = [...new Set(months.map(curOf))];
  const mixedCurrency = currencies.length > 1;
  const moneyMonths = months.filter((m) => curOf(m) === currency);
  const costByCurrency = currencies.map((cur) => {
    const ms = months.filter((m) => curOf(m) === cur);
    const a = aggTotals(ms);
    return {
      currency: cur,
      cost: a.cost,
      clicks: a.clicks,
      conversions: a.conversions,
      cpc: a.cpc,
      costPerConv: a.costPerConv,
      months: ms.map((m) => ({ id: m.id, label: m.label })),
    };
  });

  const totals = aggTotals(months);
  const money = aggTotals(moneyMonths);
  totals.cost = money.cost;
  totals.cpc = money.cpc;
  totals.costPerConv = money.costPerConv;
  totals.currency = currency;

  // Campañas acumuladas del año (por nombre, todos los meses con datos).
  // El importe se acumula por moneda para no sumar euros con pesos.
  const byName = {};
  for (const p of MONTHS_2026) {
    // Solo las campañas que ya habían arrancado en cada mes.
    const per = getMonthly(accountId, p.id);
    if (!per) continue;
    const cur = per.totals?.currency || 'EUR';
    for (const c of per.campaigns) {
      const e = (byName[c.name] ??= { name: c.name, impressions: 0, clicks: 0, conversions: 0, months: 0, byCur: {} });
      e.impressions += c.impressions || 0;
      e.clicks += c.clicks || 0;
      e.conversions += c.conversions || 0;
      e.months++;
      e.byCur[cur] = (e.byCur[cur] ?? 0) + (c.cost || 0);
    }
  }
  const campaigns = Object.values(byName)
    .map((e) => ({
      name: e.name,
      impressions: e.impressions,
      clicks: e.clicks,
      conversions: e.conversions,
      months: e.months,
      ctr: e.impressions ? (e.clicks / e.impressions) * 100 : 0,
      // Importe en la moneda vigente (ordena la tabla) + sumatoria por moneda.
      cost: e.byCur[currency] ?? 0,
      costByCurrency: currencies.filter((cur) => e.byCur[cur] != null).map((cur) => ({ currency: cur, cost: e.byCur[cur] })),
    }))
    .sort((a, b) => b.cost - a.cost || b.impressions - a.impressions);

  const first = acc.periods[months[0].id];
  const geo = listGeoPeriods()
    .filter((gp) => getGeo(accountId, gp.id))
    .map((gp) => ({ id: gp.id, label: gp.label }));

  return {
    channel: first.channel,
    currency,
    mixedCurrency,
    costByCurrency,
    moneyMonths: moneyMonths.map((m) => ({ id: m.id, label: m.label })),
    months,
    totals,
    campaigns,
    geo,
  };
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
