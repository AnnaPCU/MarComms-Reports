import { describe, it, expect } from 'vitest';
import { campaignStatus, activeCampaigns, scoreCampaigns } from '@/utils/paidInsights';

const mk = (over) => ({ name: 'c', impressions: 0, clicks: 0, ctr: 0, cpc: 0, cost: 0, conversions: 0, convRate: 0, costPerConv: 0, ...over });

describe('campaignStatus', () => {
  it('clasifica según actividad', () => {
    expect(campaignStatus(mk({ impressions: 0 })).key).toBe('none');
    expect(campaignStatus(mk({ impressions: 10, clicks: 0 })).key).toBe('low');
    expect(campaignStatus(mk({ impressions: 10, clicks: 2 })).key).toBe('opt');
    expect(campaignStatus(mk({ impressions: 10, clicks: 2, conversions: 1 })).key).toBe('win');
  });
});

describe('activeCampaigns / scoreCampaigns', () => {
  const mo = {
    campaigns: [
      mk({ name: 'A', impressions: 100, clicks: 20, ctr: 20, cpc: 1 }),
      mk({ name: 'B', impressions: 200, clicks: 10, ctr: 5, cpc: 2 }),
      mk({ name: 'Z', impressions: 0 }), // sin actividad → se excluye
    ],
  };

  it('activeCampaigns excluye las sin actividad y ordena por impresiones', () => {
    const a = activeCampaigns(mo);
    expect(a.map((c) => c.name)).toEqual(['B', 'A']);
  });

  it('scoreCampaigns puntúa y ordena por score desc (mejor CTR/CPC primero)', () => {
    const ranked = scoreCampaigns(mo);
    expect(ranked).toHaveLength(2);
    expect(ranked[0].name).toBe('A'); // mejor CTR y CPC → mayor score sin conversiones
    expect(ranked[0].score).toBeGreaterThanOrEqual(ranked[1].score);
  });

  it('devuelve [] si no hay campañas activas', () => {
    expect(scoreCampaigns({ campaigns: [mk({ impressions: 0 })] })).toEqual([]);
  });
});
