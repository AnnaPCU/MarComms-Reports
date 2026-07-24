import { describe, it, expect } from 'vitest';
import { genEmailInsights, genEmailConclusions, genEmailNextSteps, EMAIL_BENCHMARKS } from '@/utils/emailInsights';

const campaign = {
  campaignName: 'Seq',
  totals: {
    emailCount: 2,
    totalSent: 200,
    totalDelivered: 196,
    totalOpens: 60,
    totalClicks: 14,
    openRate: 30,
    clickRate: 7,
    ctor: 23,
    bounceRate: null,
    unsubRate: null,
  },
  hotLeads: [{ email: 'a@x.com', clicks: 3 }],
  hotLeadsCount: 1,
};

describe('emailInsights', () => {
  it('genera insights comparando contra benchmarks B2B', () => {
    const ins = genEmailInsights(campaign);
    expect(ins).toHaveLength(4);
    expect(ins[0].m).toContain('por encima'); // 30% > 21%
    expect(ins[1].m).toContain('supera'); // 7% > 2,5%
    expect(ins[3].m).toContain('hot leads');
  });

  it('marca por debajo cuando las tasas son flojas', () => {
    const weak = { ...campaign, totals: { ...campaign.totals, openRate: 10, clickRate: 1 }, hotLeadsCount: 0, hotLeads: [] };
    const ins = genEmailInsights(weak);
    expect(ins[0].m).toContain('por debajo');
    expect(ins[1].m).toContain('no alcanza');
  });

  it('conclusiones incluyen alcance, apertura e interés', () => {
    const c = genEmailConclusions(campaign);
    expect(c.map((x) => x.label)).toContain('Alcance');
    expect(c.map((x) => x.label)).toContain('Apertura');
    expect(c.map((x) => x.label)).toContain('Interés');
  });

  it('conclusiones muestran salud de la base si hay rebote/bajas', () => {
    const withHealth = { ...campaign, totals: { ...campaign.totals, bounceRate: 1.2, unsubRate: 0.3, totalBounces: 2, totalUnsubs: 1 } };
    const labels = genEmailConclusions(withHealth).map((x) => x.label);
    expect(labels).toContain('Salud de la base');
  });

  it('próximos pasos priorizan hot leads cuando existen', () => {
    const steps = genEmailNextSteps(campaign);
    expect(steps[0]).toContain('hot leads');
  });

  it('devuelve vacío sin totales', () => {
    expect(genEmailInsights({})).toEqual([]);
    expect(genEmailConclusions({})).toEqual([]);
    expect(genEmailNextSteps({})).toEqual([]);
  });

  it('benchmarks expuestos', () => {
    expect(EMAIL_BENCHMARKS.openRate).toBe(21);
  });
});
