// SERVICE — Conversión de moneda de los reportes de Paid Media (solo para
// el descargable). Tipos de cambio en src/data/fxRates.js (ARS por unidad,
// BNA vendedor al cierre de cada mes, o al cierre de cada campaña en las
// campañas en paralelo y de Meta). Nunca se suman monedas distintas: se
// convierte el reporte entero de un período con el tipo de cambio de ese período.

// ¿El tipo de cambio es el del cierre de una campaña (no de un mes)?
export const isCampaignFx = (periodId) => !/^m\d\d$/.test(String(periodId));
import { FX_RATES } from '@/data/fxRates';

export const CURRENCIES = ['ARS', 'USD', 'EUR'];

// Tipo de cambio del mes con el euro calculado (ARS por EUR = dólar BNA ×
// euro/dólar oficial del BCE).
export function getFx(periodId) {
  const fx = FX_RATES[periodId];
  if (!fx) return null;
  const EUR = fx.USD && fx.usdPerEur ? Math.round(fx.USD * fx.usdPerEur * 100) / 100 : null;
  return { ...fx, EUR };
}

// ARS por 1 unidad de `cur` en el mes (ARS = 1). null si falta el dato.
function arsPer(cur, fx) {
  if (cur === 'ARS') return 1;
  return fx?.[cur] ?? null;
}

export function canConvert(from, to, periodId) {
  if (!from || !to) return false;
  if (from === to) return true;
  const fx = getFx(periodId);
  return arsPer(from, fx) != null && arsPer(to, fx) != null;
}

// Factor para pasar un importe de `from` a `to` en ese mes.
export function fxFactor(from, to, periodId) {
  if (from === to) return 1;
  const fx = getFx(periodId);
  const a = arsPer(from, fx);
  const b = arsPer(to, fx);
  return a != null && b != null ? a / b : null;
}

// Texto del tipo de cambio para la nota del reporte («1 USD = 1.540 ARS») y
// de dónde sale: 'bna' (dólar BNA), 'bna-bce' (euro con dólar BNA × BCE) o
// 'bce' (entre EUR y USD: el euro/dólar oficial del BCE).
export function fxPair(from, to, periodId) {
  const fx = getFx(periodId);
  const pair = [from, to];
  if (pair.includes('EUR') && pair.includes('USD')) {
    return { unit: 'EUR', value: fx.usdPerEur, quote: 'USD', decimals: 4, source: 'bce' };
  }
  const other = from === 'ARS' ? to : from;
  return { unit: other, value: arsPer(other, fx), quote: 'ARS', decimals: other === 'EUR' ? 2 : 0, source: other === 'EUR' ? 'bna-bce' : 'bna' };
}

const r2 = (v) => Math.round(v * 100) / 100;

function convertRow(o, k) {
  const cost = r2((o.cost || 0) * k);
  return {
    ...o,
    cost,
    cpc: o.clicks ? r2(cost / o.clicks) : 0,
    costPerConv: o.conversions ? r2(cost / o.conversions) : 0,
  };
}

// Convierte el mes de Paid (totales, campañas y detalle por grupo) a `to`.
// Devuelve null si no hay tipo de cambio para ese mes.
export function convertPaidMonth(mo, detail, periodId, to) {
  const from = mo?.totals?.currency;
  if (!mo || !from || from === to) return { mo, detail };
  const k = fxFactor(from, to, periodId);
  if (k == null) return null;
  const outMo = {
    ...mo,
    totals: { ...convertRow(mo.totals, k), currency: to },
    campaigns: mo.campaigns.map((c) => convertRow(c, k)),
    fx: { from, to, date: getFx(periodId).date, campaign: isCampaignFx(periodId), ...fxPair(from, to, periodId) },
  };
  const outDetail = detail
    ? {
        ...detail,
        groups: detail.groups.map((g) => ({
          ...g,
          weeks: (g.weeks ?? []).map((w) => ({ ...w, cost: r2((w.cost || 0) * k) })),
          kws: (g.kws ?? []).map((x) => ({ ...x, cost: r2((x.cost || 0) * k) })),
          terms: (g.terms ?? []).map((x) => ({ ...x, cost: r2((x.cost || 0) * k) })),
        })),
      }
    : detail;
  return { mo: outMo, detail: outDetail };
}
