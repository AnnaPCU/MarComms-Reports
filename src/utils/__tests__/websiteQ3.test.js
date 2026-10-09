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
      // Conversiones = click_email + form_submit.
      expect(q.site.conversionsBreakdown.clickEmail + q.site.conversionsBreakdown.formSubmit).toBe(q.site.conversions);
    }
  });

  it('valores del reporte: Control Union Argentina y Peterson Solutions Americas («South America»)', () => {
    expect(getQuarter('cua', 'q3-2026').site).toMatchObject({ singleTraffic: 2920, totalTraffic: 4098, impressions: 8566, conversions: 218 });
    expect(getQuarter('cua', 'q3-2026').seo).toMatchObject({ averagePosition: 9.11, impressions: 76744, totalClicks: 1855 });
    expect(getQuarter('psam', 'q3-2026').site).toMatchObject({ singleTraffic: 1421, totalTraffic: 1861, impressions: 3414, conversions: 27 });
    expect(getQuarter('psam', 'q3-2026').seo).toMatchObject({ averagePosition: 10.06, impressions: 26163, totalClicks: 486 });
  });

  it('CU Estados Unidos y CU Canadá no vienen por separado en Q3: sin datos, no se inventan', () => {
    expect(hasDataFor('cuus', 'q3-2026')).toBe(false);
    expect(hasDataFor('cuca', 'q3-2026')).toBe(false);
    expect(hasDataFor('cunam', 'q3-2026')).toBe(true);
  });
});
