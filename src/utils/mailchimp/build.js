// ════════════════════════════════════════════════════════════════
//  MAILCHIMP · BUILD — compone el objeto de período (campaña/secuencia)
//  que consume el seed y la vista. Usado por el script de tooling
//  (scripts/mailchimp-to-seed.mjs) y por los tests. Función PURA.
//
//  Entrada: { campaignName, emails: [{ name, subject?, leads, stats? }] }
//    · leads: array ya normalizado (ver extractLeads). Se usa para el
//      ranking de hot leads (contactos con clic).
//    · stats: métricas AGREGADAS del reporte de Mailchimp
//      { sent, delivered?, opens, clicks, bounces?, unsubs? }.
//      Si vienen, mandan las tasas (camino correcto). Si NO vienen, las
//      métricas se derivan de los leads (export por destinatario).
//  Salida: objeto de período listo para el seed (ver emailSeed.js).
// ════════════════════════════════════════════════════════════════

import { metricsFromLeads, metricsFromStats, aggregateLeads, hotLeadsOf, sequenceTotals, comparisonData } from './aggregate.js';

export function buildCampaign({ campaignName = '', emails = [] } = {}) {
  const withMetrics = emails.map((e, i) => ({
    name: e.name || `Email ${i + 1}`,
    subject: e.subject || '',
    // Las estadísticas agregadas (si existen) tienen prioridad sobre la
    // derivación desde la muestra de leads.
    metrics: e.stats ? metricsFromStats(e.stats) : metricsFromLeads(e.leads || []),
    leads: e.leads || [],
  }));

  const allLeads = aggregateLeads(withMetrics);
  const hotLeads = hotLeadsOf(allLeads);
  const totals = sequenceTotals(withMetrics);
  const comparison = comparisonData(withMetrics);

  // El seed guarda los emails SIN el detalle de leads por email (se consolida
  // en allLeads/hotLeads) para no duplicar datos en el bundle.
  const emailsOut = withMetrics.map(({ name, subject, metrics }) => ({ name, subject, metrics }));

  return {
    campaignName,
    emails: emailsOut,
    totals,
    comparison,
    allLeads,
    hotLeads,
    hotLeadsCount: hotLeads.length,
  };
}
