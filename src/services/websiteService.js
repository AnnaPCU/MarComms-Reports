// SERVICE — Pilar Website (Google Analytics + Search Console). Trimestral.
// Lee del seed local mientras Supabase no esté configurado.
import { WEBSITE_CLIENTS, WEBSITE_DB } from '@/data/websiteSeed';
import { QUARTERS_2026 } from '@/constants/periods';

export function listAccounts() {
  return WEBSITE_CLIENTS;
}

export function listPeriods() {
  return QUARTERS_2026;
}

const EMBED = typeof window !== 'undefined' ? window.__REPORT_EMBED__ : null;

export function getQuarter(accountId, periodId) {
  if (EMBED?.snapshot && 'quarter' in EMBED.snapshot) return EMBED.snapshot.quarter;
  return WEBSITE_DB[accountId]?.periods?.[periodId] ?? null;
}

export function getHandle(accountId) {
  if (EMBED?.snapshot?.handle != null) return EMBED.snapshot.handle;
  return WEBSITE_DB[accountId]?.handle ?? '';
}

export function hasDataFor(account, period) {
  if (period === 'cmp') return true; // comparativa global (todas las cuentas)
  if (period === 'year-2026') return QUARTERS_2026.some((q) => WEBSITE_DB[account]?.periods?.[q.id]);
  return Boolean(getQuarter(account, period));
}

// ── Resumen del Año / Comparativa ─────────────────────────────────

// Resumen anual de una cuenta: acumulado de los trimestres CON datos.
// Devuelve null si no hay ningún trimestre cargado (regla de honestidad).
export function getYear(accountId) {
  const acc = WEBSITE_DB[accountId];
  const quarters = QUARTERS_2026.filter((q) => acc?.periods?.[q.id]).map((q) => {
    const d = acc.periods[q.id];
    const site = d.site ?? {};
    const seo = d.seo ?? null; // Peterson no tiene Search Console conectado
    return {
      id: q.id,
      label: q.label,
      visitors: site.singleTraffic || 0,
      total: site.totalTraffic || 0,
      pageviews: site.impressions || 0,
      conversions: site.conversions || 0,
      hasSeo: Boolean(seo),
      seoImp: seo?.impressions || 0,
      seoClicks: seo?.totalClicks || 0,
      avgPos: seo?.averagePosition || 0,
    };
  });
  if (!quarters.length) return null;

  const sum = (k) => quarters.reduce((a, x) => a + (x[k] || 0), 0);
  const withSeo = quarters.filter((x) => x.hasSeo);
  const totals = {
    visitors: sum('visitors'),
    total: sum('total'),
    pageviews: sum('pageviews'),
    conversions: sum('conversions'),
    hasSeo: withSeo.length > 0,
    seoImp: sum('seoImp'),
    seoClicks: sum('seoClicks'),
    // La posición media no se suma: promedio simple de los trimestres con SEO.
    avgPos: withSeo.length ? withSeo.reduce((a, x) => a + x.avgPos, 0) / withSeo.length : 0,
  };

  // Top landing pages / keywords del año (mergeadas entre trimestres).
  const mergeTop = (pick, keyField, valField) => {
    const m = {};
    for (const q of QUARTERS_2026) {
      const d = acc.periods[q.id];
      if (!d) continue;
      for (const it of pick(d) ?? []) m[it[keyField]] = (m[it[keyField]] || 0) + (it[valField] || 0);
    }
    return Object.entries(m)
      .map(([key, value]) => ({ key, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  };

  return {
    handle: acc.handle ?? '',
    quarters,
    totals,
    topPages: mergeTop((d) => d.site?.topLandingPages, 'url', 'views'),
    topKeywords: mergeTop((d) => d.seo?.topKeywords, 'query', 'clicks'),
  };
}

// Comparativa multi-cuenta: resumen anual de cada cuenta con datos.
export function getComparative() {
  return WEBSITE_CLIENTS.map((a) => {
    const y = getYear(a.id);
    return y && { id: a.id, name: a.name, quarters: y.quarters, totals: y.totals };
  }).filter(Boolean);
}
