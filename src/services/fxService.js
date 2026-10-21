// SERVICE — Conversión de moneda de los reportes de Paid Media (solo para
// el descargable). Tipos de cambio en src/data/fxRates.js (ARS por unidad,
// BNA vendedor al cierre de cada mes). Nunca se suman monedas distintas: se
// convierte el reporte entero de un mes con el tipo de cambio de ese mes.
import { FX_RATES } from '@/data/fxRates';

export const CURRENCIES = ['ARS', 'USD', 'EUR'];

export function getFx(periodId) {
  return FX_RATES[periodId] ?? null;
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

// Texto del tipo de cambio para la nota del reporte: «1 USD = 1.540 ARS».
export function fxPair(from, to, periodId) {
  const fx = getFx(periodId);
  if (from === 'ARS') return { unit: to, value: arsPer(to, fx), quote: 'ARS', decimals: 0 };
  if (to === 'ARS') return { unit: from, value: arsPer(from, fx), quote: 'ARS', decimals: 0 };
  // Entre USD y EUR: cruce a través del peso (los dos del BNA, mismo día).
  return { unit: to, value: arsPer(to, fx) / arsPer(from, fx), quote: from, decimals: 4 };
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
    fx: { from, to, date: getFx(periodId).date, ...fxPair(from, to, periodId) },
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
