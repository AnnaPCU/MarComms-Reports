import { describe, it, expect } from 'vitest';
import { summarizePillar, buildClientSummary, periodLabelOf } from '@/utils/clientSummary';
import { getOverview } from '@/services/clientService';

const paidRaw = {
  pilar: 'paid',
  kind: 'paid',
  account: 'x',
  accName: 'CU Test',
  note: null,
  period: 'm08',
  periodLabel: 'Agosto 2026',
  mo: {
    channel: 'Google Ads Search',
    totals: { impressions: 1000, clicks: 50, ctr: 5, cpc: 2, cost: 100, currency: 'ARS', conversions: 2, convRate: 4, costPerConv: 50 },
    campaigns: [
      { name: 'A', impressions: 1000, clicks: 50, ctr: 5, cpc: 2, cost: 100, conversions: 2, convRate: 4, costPerConv: 50 },
      { name: 'B', impressions: 0, clicks: 0, ctr: 0, cpc: 0, cost: 0, conversions: 0, convRate: 0, costPerConv: 0 },
    ],
  },
};

describe('summarizePillar', () => {
  it('Paid: hero de clics, líneas con la moneda real y solo campañas activas', () => {
    const s = summarizePillar(paidRaw, 'es');
    expect(s.title).toBe('Paid Media');
    expect(s.hero.value).toBe('50');
    expect(s.lines.find((l) => l.text === 'Coste total').value).toBe('100,00 ARS');
    expect(s.lines.find((l) => l.text === 'Campañas con actividad').value).toBe('1');
    expect(s.insights.length).toBeGreaterThan(0);
    expect(s.conclusion).toBeTruthy();
    expect(s.nextStep).toBeTruthy();
  });

  it('formatea en en-US cuando el idioma es EN', () => {
    const s = summarizePillar({ ...paidRaw, mo: { ...paidRaw.mo, totals: { ...paidRaw.mo.totals, impressions: 12345 } } }, 'en');
    expect(s.lines.find((l) => l.text === 'Impressions').value).toBe('12,345');
    expect(s.periodLabel).toBe('August 2026');
  });

  it('Website sin SEO: lo dice, no lo deduce', () => {
    const s = summarizePillar(
      { pilar: 'website', kind: 'website', accName: 'PS', period: 'q2-2026', periodLabel: 'Q2 2026', site: { singleTraffic: 10, totalTraffic: 20, impressions: 30, conversions: 1, topLandingPages: [] }, seo: null },
      'es',
    );
    expect(s.lines.some((l) => l.text === 'Sin Search Console conectado')).toBe(true);
    expect(s.glossary).toBe('website');
  });

  it('pilar sin datos → null', () => {
    expect(summarizePillar(null)).toBeNull();
    expect(summarizePillar({ pilar: 'paid', kind: 'paid', mo: null })).toBeNull();
    expect(summarizePillar({ pilar: 'x', kind: 'x' })).toBeNull();
  });

  it('periodLabelOf respeta el idioma según el tipo de período', () => {
    expect(periodLabelOf({ kind: 'social', period: 'm07', periodLabel: 'Jul 2026' }, 'en')).toBe('July 2026');
    expect(periodLabelOf({ kind: 'website', period: 'q2-2026', periodLabel: 'Q2 2026' }, 'en')).toBe('Q2 2026');
    expect(periodLabelOf({ kind: 'paid', period: 'm08', periodLabel: 'Agosto 2026' }, 'es')).toBe('Agosto 2026');
  });
});

describe('buildClientSummary (sobre datos reales del seed)', () => {
  it('cada pilar aporta insight etiquetado, diagnóstico y glosario', () => {
    for (const lang of ['es', 'en']) {
      const s = buildClientSummary(getOverview('cu-es'), lang);
      expect(s.pillars.length).toBe(3);
      expect(s.insights.every((x) => x.label && x.m && x.a)).toBe(true);
      expect(s.conclusions.length).toBe(3);
      expect(s.nextSteps.length).toBe(3);
      expect(s.glossaryKeys.length).toBeGreaterThanOrEqual(3);
    }
  });

  it('CU Argentina: Social por país, Paid GEO y Website', () => {
    const s = buildClientSummary(getOverview('cu-ar'), 'es');
    expect(s.pillars.map((p) => p.kind)).toEqual(['social-country', 'paid-geo', 'website']);
    expect(s.pillars[0].hero.label).toContain('Argentina');
    expect(s.glossaryKeys).toContain('paidMeta');
  });

  it('overview nulo → null', () => {
    expect(buildClientSummary(null)).toBeNull();
  });
});
