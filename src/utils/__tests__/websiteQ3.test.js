import { describe, it, expect } from 'vitest';
import { getQuarter, hasDataFor } from '@/services/websiteService';

// Q3 2026: reportes trimestrales en .md (GA4 + Search Console), metricas/website/_procesados/2026-Q3/.
describe('Website · Q3 2026', () => {
  it('carga las 10 cuentas del reporte (Website + SEO)', () => {
    for (const id of ['cua', 'cubr', 'cucl', 'cues', 'cumx', 'cunam', 'cupe', 'cupt', 'psam', 'psib']) {
      const q = getQuarter(id, 'q3-2026');
      expect(q?.site, id).toBeTruthy();
      expect(q?.seo, id).toBeTruthy();
      expect(q.site.topLandingPages).toHaveLength(5);
      expect(q.seo.topKeywords).toHaveLength(5);
      // Conversiones = formularios (página de gracias) + emails.
      expect(q.site.conversionsBreakdown.forms + q.site.conversionsBreakdown.emails).toBe(q.site.conversions);
    }
  });

  it('valores del reporte: Control Union Argentina y Peterson Solutions Americas («South America»)', () => {
    expect(getQuarter('cua', 'q3-2026').site).toMatchObject({ singleTraffic: 2920, totalTraffic: 4098, impressions: 8566, conversions: 32 });
    expect(getQuarter('cua', 'q3-2026').seo).toMatchObject({ averagePosition: 9.11, impressions: 76744, totalClicks: 1855 });
    expect(getQuarter('psam', 'q3-2026').site).toMatchObject({ singleTraffic: 1421, totalTraffic: 1861, impressions: 3414, conversions: 6 });
    expect(getQuarter('psam', 'q3-2026').seo).toMatchObject({ averagePosition: 10.06, impressions: 26163, totalClicks: 486 });
  });

  it('CU Estados Unidos y CU Canadá: North America segmentado por país', () => {
    const us = getQuarter('cuus', 'q3-2026');
    const ca = getQuarter('cuca', 'q3-2026');
    expect(us.site).toMatchObject({ singleTraffic: 1192, totalTraffic: 1480, impressions: 2684, conversions: 47 });
    expect(us.seo).toMatchObject({ averagePosition: 15.95, impressions: 12043, totalClicks: 93 });
    expect(ca.site).toMatchObject({ singleTraffic: 224, totalTraffic: 258, impressions: 502, conversions: 6 });
    expect(ca.seo).toMatchObject({ averagePosition: 7.86, impressions: 1503, totalClicks: 68 });
    // No suman el total del sitio (el resto es tráfico de otros países).
    const na = getQuarter('cunam', 'q3-2026');
    expect(us.site.totalTraffic + ca.site.totalTraffic).toBeLessThan(na.site.totalTraffic);
    // Keywords sin clics no entran al top.
    expect(ca.seo.topKeywords.every((k) => k.clicks > 0)).toBe(true);
    expect(hasDataFor('cuus', 'q3-2026') && hasDataFor('cuca', 'q3-2026')).toBe(true);
  });
});
