// ════════════════════════════════════════════════════════════════
//  SEED — Paid Media · Meta Ads: campañas cortas (una o pocas semanas)
//
//  Cada campaña de Meta es un período propio del pilar Paid (no se suma a
//  los meses de Google Ads). Vive en su archivo, src/data/paidMeta/<id>.js,
//  generado con scripts/paid/build_meta.py desde los exports de Meta Ads
//  Manager (metricas/paid-media/meta-ads/). Forma de cada archivo:
//    { period: { id, label, labelEn, start, end }, accounts: { <cuenta>: {...} } }
//
//  Ids de período: `geo-…` (campañas GEO de evento, ej. Aapresid) y
//  `meta-…` (el resto). build_meta.py agrega el import y la entrada de la
//  lista de abajo; no hace falta tocarlos a mano.
// ════════════════════════════════════════════════════════════════

// META:IMPORTS (build_meta.py agrega acá)
import geoAapresid2026 from './paidMeta/geo-aapresid-2026.js';

const CAMPAIGNS = [
  // META:LIST (build_meta.py agrega acá)
  geoAapresid2026,
];

// Períodos de Meta, del más reciente al más viejo.
export const META_PERIODS = CAMPAIGNS.map((x) => x.period).sort((a, b) => b.start.localeCompare(a.start));

// cuenta → período → datos de la campaña.
export const META_GEO = {};
for (const { period, accounts } of CAMPAIGNS) {
  for (const [acc, data] of Object.entries(accounts)) {
    (META_GEO[acc] ??= {})[period.id] = { ...data, period };
  }
}


// ── Agregados de una campaña (suma de los días con entrega) ──
export function aggCampaign(c) {
  const t = c.days.reduce(
    (a, x) => ({
      spend: a.spend + x.spend,
      imp: a.imp + x.imp,
      lc: a.lc + x.lc,
      ulc: a.ulc + (x.ulc ?? 0),
      out: a.out + (x.out ?? 0),
    }),
    { spend: 0, imp: 0, lc: 0, ulc: 0, out: 0 },
  );
  return {
    ...t,
    ctr: t.imp ? (t.lc / t.imp) * 100 : 0,
    outCtr: t.imp ? (t.out / t.imp) * 100 : 0,
    cpc: t.lc ? t.spend / t.lc : 0,
    cpm: t.imp ? (t.spend / t.imp) * 1000 : 0,
    results: c.results?.value ?? null,
    costPerResult: c.results?.value ? t.spend / c.results.value : null,
    maxFreq: Math.max(0, ...c.days.map((x) => x.freq ?? 0)),
  };
}

// ── Agregados de la cuenta (todas las campañas del evento) ──
export function aggAccount(geo) {
  const per = geo.campaigns.map((c) => ({ c, t: aggCampaign(c) }));
  const sum = per.reduce(
    (a, { t }) => ({
      spend: a.spend + t.spend,
      imp: a.imp + t.imp,
      lc: a.lc + t.lc,
      out: a.out + t.out,
    }),
    { spend: 0, imp: 0, lc: 0, out: 0 },
  );
  return {
    per,
    ...sum,
    ctr: sum.imp ? (sum.lc / sum.imp) * 100 : 0,
    outCtr: sum.imp ? (sum.out / sum.imp) * 100 : 0,
    cpc: sum.lc ? sum.spend / sum.lc : 0,
    cpm: sum.imp ? (sum.spend / sum.imp) * 1000 : 0,
  };
}
