// ════════════════════════════════════════════════════════════════
//  Vista general de una campaña en paralelo (Google Ads + Meta Ads).
//
//  Suma solo lo comparable (docs/DECISIONES.md §22):
//  · Inversión: solo si las dos plataformas están en la MISMA moneda.
//  · Impresiones: las de cada plataforma.
//  · Clics: clics de Google Ads + clics en el enlace de Meta Ads.
//  · Conversiones: las que registra cada plataforma (Google: conversiones;
//    Meta: resultados de la campaña, si la campaña los mide). Una campaña
//    de Meta de tráfico no registra conversiones: queda en null (no es 0).
//  · Costo por conversión total: solo si todas las plataformas registran
//    conversiones (si no, mezclaría inversión que no buscaba convertir).
//  Los envíos de formularios (Typeform / HubSpot) no se suman: su rango no
//  coincide con el vuelo y reciben visitas de cualquier origen.
// ════════════════════════════════════════════════════════════════
import { aggAccount } from '@/data/paidMetaGeo';
import { mondayOf } from '@/utils/weekRange';

const r2 = (v) => Math.round(v * 100) / 100;

function derive(p) {
  return {
    ...p,
    ctr: p.imp ? (p.clicks / p.imp) * 100 : 0,
    cpc: p.spend != null && p.clicks ? p.spend / p.clicks : null,
    cpm: p.spend != null && p.imp ? (p.spend / p.imp) * 1000 : null,
    costPerConv: p.spend != null && p.conv ? p.spend / p.conv : null,
  };
}

// `factor(from)`: factor de conversión de moneda del descargable (o null
// si va en la moneda original); `to`: moneda de destino.
export function summarizeParallel(par, { factor = null, to = null } = {}) {
  const g = par?.google?.mo?.totals;
  const meta = par?.meta;
  if (!g || !meta?.campaigns?.length) return null;
  const m = aggAccount(meta);
  const kOf = (cur) => (factor && to && cur !== to ? factor(cur) ?? 1 : 1);
  const curOf = (cur) => (factor && to && cur !== to && factor(cur) != null ? to : cur);
  const kG = kOf(g.currency);
  const kM = kOf(meta.currency);
  const sameCurrency = g.currency === meta.currency;

  const metaRes = m.per.filter(({ t }) => t.results != null);
  const google = derive({
    id: 'google',
    currency: curOf(g.currency),
    spend: r2((g.cost || 0) * kG),
    imp: g.impressions || 0,
    clicks: g.clicks || 0,
    conv: g.conversions || 0,
  });
  const metaP = derive({
    id: 'meta',
    currency: curOf(meta.currency),
    spend: r2(m.spend * kM),
    imp: m.imp,
    clicks: m.lc,
    conv: metaRes.length ? metaRes.reduce((a, { t }) => a + t.results, 0) : null,
    resultKinds: [...new Set(metaRes.map(({ c }) => c.kind))],
  });

  const convAll = google.conv != null && metaP.conv != null;
  const total = derive({
    id: 'total',
    currency: sameCurrency ? google.currency : null,
    // Desde los importes sin redondear (en el descargable convertido, sumar
    // los ya redondeados puede correr un centavo).
    spend: sameCurrency ? r2((g.cost || 0) * kG + m.spend * kM) : null,
    imp: google.imp + metaP.imp,
    clicks: google.clicks + metaP.clicks,
    conv: (google.conv || 0) + (metaP.conv || 0),
  });
  if (!convAll) total.costPerConv = null;

  // Inversión semanal por plataforma (semanas de lunes a domingo, como el
  // export semanal de Google Ads). Meta se agrupa desde su export diario.
  let weeks = null;
  const groups = par.google.detail?.groups ?? [];
  if (sameCurrency && groups.length) {
    const byWeek = {};
    const row = (w) => (byWeek[w] ??= { w, google: 0, meta: 0 });
    groups.forEach((gr) => gr.weeks.forEach((x) => (row(x.w).google += (x.cost || 0) * kG)));
    meta.campaigns.forEach((c) =>
      c.days.filter((d) => (d.spend || 0) > 0).forEach((d) => (row(mondayOf(d.d)).meta += d.spend * kM)),
    );
    weeks = Object.values(byWeek)
      .map((x) => ({ ...x, google: r2(x.google), meta: r2(x.meta) }))
      .filter((x) => x.google > 0 || x.meta > 0)
      .sort((a, b) => a.w.localeCompare(b.w));
  }

  return { sameCurrency, currency: total.currency, google, meta: metaP, total, weeks };
}

// Participación de cada plataforma en un indicador (0–100), o null si no
// se puede sumar (inversión en monedas distintas).
export function shareOf(sum, key) {
  const a = sum.google[key];
  const b = sum.meta[key];
  if (a == null || b == null || (key === 'spend' && !sum.sameCurrency)) return null;
  const tot = a + b;
  return tot ? { google: (a / tot) * 100, meta: (b / tot) * 100 } : null;
}
