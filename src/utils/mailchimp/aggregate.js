// ════════════════════════════════════════════════════════════════
//  MAILCHIMP · AGREGACIÓN — lógica portada del MailchimpReportTool.
//  Funciones PURAS: consolidan métricas de una secuencia de emails,
//  arman la comparativa email-por-email y detectan los "hot leads"
//  (contactos que hicieron clic) con su ranking y prioridad.
//
//  Sin IA: los insights se generan por reglas fijas (ver emailInsights.js).
// ════════════════════════════════════════════════════════════════

const sum = (arr, f) => arr.reduce((s, x) => s + (f(x) || 0), 0);
const rate = (num, den) => (den ? (num / den) * 100 : 0);

// Métricas de UN email a partir de las estadísticas AGREGADAS del reporte de
// Mailchimp (envíos, entregas, aperturas/clics únicos, rebotes, bajas). Es el
// camino correcto cuando se dispone del resumen de la campaña: las tasas se
// calculan sobre el volumen real de envío, no sobre la muestra de leads.
//   stats = { sent, delivered?, opens, clicks, bounces?, unsubs? }
export function metricsFromStats(stats = {}) {
  const sent = stats.sent || 0;
  const delivered = stats.delivered != null ? stats.delivered : sent;
  const base = delivered || sent;
  const opens = stats.opens || 0;
  const clicks = stats.clicks || 0;
  const m = {
    sent,
    delivered,
    uniqueOpens: opens,
    uniqueClicks: clicks,
    totalOpens: opens,
    totalClicks: clicks,
    openRate: rate(opens, base),
    clickRate: rate(clicks, base),
    ctor: rate(clicks, opens),
  };
  if (stats.bounces != null) {
    m.bounces = stats.bounces;
    m.bounceRate = rate(stats.bounces, sent);
  }
  if (stats.unsubs != null) {
    m.unsubs = stats.unsubs;
    m.unsubRate = rate(stats.unsubs, base);
  }
  return m;
}

// Métricas de UN email a partir de su export de destinatarios (leads).
// Las tasas se calculan sobre destinatarios ÚNICOS que abrieron/clickearon
// (definición de Mailchimp), no sobre la suma bruta de aperturas/clics.
export function metricsFromLeads(leads = []) {
  const sent = leads.length;
  const uniqueOpens = leads.filter((l) => (l.opens || 0) > 0).length;
  const uniqueClicks = leads.filter((l) => (l.clicks || 0) > 0).length;
  const totalOpens = sum(leads, (l) => l.opens);
  const totalClicks = sum(leads, (l) => l.clicks);
  return {
    sent,
    uniqueOpens,
    uniqueClicks,
    totalOpens,
    totalClicks,
    openRate: rate(uniqueOpens, sent),
    clickRate: rate(uniqueClicks, sent),
    ctor: rate(uniqueClicks, uniqueOpens),
  };
}

// Consolida los leads de TODA la secuencia: deduplica por email, suma
// clics/aperturas, cuenta en cuántos envíos apareció y ordena por clics
// (desempate por aperturas). Devuelve el ranking completo.
export function aggregateLeads(emails = []) {
  const map = {};
  emails.forEach((email, eIdx) => {
    (email.leads || []).forEach((lead) => {
      if (!map[lead.email]) {
        map[lead.email] = { ...lead, clicks: 0, opens: 0, campaigns: 0, emailAppearances: [] };
      }
      map[lead.email].clicks += lead.clicks || 0;
      map[lead.email].opens += lead.opens || 0;
      map[lead.email].campaigns += 1;
      map[lead.email].emailAppearances.push(eIdx + 1);
    });
  });
  return Object.values(map).sort((a, b) => b.clicks - a.clicks || b.opens - a.opens);
}

// Hot leads = contactos que hicieron al menos un clic en la secuencia.
export function hotLeadsOf(allLeads = []) {
  return allLeads.filter((l) => (l.clicks || 0) > 0);
}

// Prioridad comercial por cantidad de clics acumulados.
export function priorityOf(lead) {
  const c = lead?.clicks || 0;
  if (c >= 3) return 'Crítica';
  if (c >= 2) return 'Alta';
  if (c >= 1) return 'Media';
  return 'Baja';
}

// Totales consolidados de la secuencia (suma de los envíos).
export function sequenceTotals(emails = []) {
  const withMetrics = emails.filter((e) => e.metrics);
  if (!withMetrics.length) return null;
  const totalSent = sum(withMetrics, (e) => e.metrics.sent);
  const totalDelivered = sum(withMetrics, (e) => e.metrics.delivered ?? e.metrics.sent);
  const totalOpens = sum(withMetrics, (e) => e.metrics.uniqueOpens ?? e.metrics.totalOpens);
  const totalClicks = sum(withMetrics, (e) => e.metrics.uniqueClicks ?? e.metrics.totalClicks);
  const totalBounces = sum(withMetrics, (e) => e.metrics.bounces);
  const totalUnsubs = sum(withMetrics, (e) => e.metrics.unsubs);
  const hasBounces = withMetrics.every((e) => e.metrics.bounces != null);
  const hasUnsubs = withMetrics.every((e) => e.metrics.unsubs != null);
  const base = totalDelivered || totalSent;
  return {
    emailCount: withMetrics.length,
    totalSent,
    totalDelivered,
    totalOpens,
    totalClicks,
    totalBounces: hasBounces ? totalBounces : null,
    totalUnsubs: hasUnsubs ? totalUnsubs : null,
    // Tasas consolidadas ponderadas por volumen (no promedio de tasas).
    openRate: rate(totalOpens, base),
    clickRate: rate(totalClicks, base),
    ctor: rate(totalClicks, totalOpens),
    bounceRate: hasBounces ? rate(totalBounces, totalSent) : null,
    unsubRate: hasUnsubs ? rate(totalUnsubs, base) : null,
  };
}

// Datos para el gráfico comparativo email-por-email (aperturas / clics / CTOR).
export function comparisonData(emails = []) {
  return emails
    .filter((e) => e.metrics)
    .map((e, i) => ({
      name: e.name || `Email ${i + 1}`,
      aperturas: Number((e.metrics.openRate || 0).toFixed(1)),
      clics: Number((e.metrics.clickRate || 0).toFixed(1)),
      ctor: Number((e.metrics.ctor || 0).toFixed(1)),
    }));
}
