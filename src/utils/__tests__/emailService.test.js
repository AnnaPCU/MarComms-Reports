import { describe, it, expect } from 'vitest';
import { listCampaigns, getCampaign, hasDataFor } from '@/services/emailService';
import { EMAIL_DB } from '@/data/emailSeed';
import { buildSnapshot } from '@/utils/snapshot';

describe('varias campañas en un mismo mes', () => {
  it('lista las campañas de CU Estados Unidos en octubre, en orden de envío', () => {
    const list = listCampaigns('cuus', 'm10');
    expect(list.map((c) => c.id)).toEqual(['fairly-made', 'smeta-3']);
    for (const c of list) {
      expect(c.label).toBeTruthy();
      expect(c.totals).toBeTruthy();
    }
  });

  it('sin id elegido devuelve la más reciente; con id, esa campaña', () => {
    expect(getCampaign('cuus', 'm10').id).toBe('smeta-3');
    expect(getCampaign('cuus', 'm10', 'fairly-made').totals.totalSent).toBe(1350);
    expect(getCampaign('cuus', 'm10', 'smeta-3').totals.totalSent).toBe(253);
    // Un id que no es del período cae en la más reciente.
    expect(getCampaign('cuus', 'm10', 'otra').id).toBe('smeta-3');
  });

  it('un mes con una sola campaña sigue funcionando igual', () => {
    const list = listCampaigns('cups', 'm08');
    expect(list).toHaveLength(1);
    expect(getCampaign('cups', 'm08')).toBe(EMAIL_DB.cups.periods.m08);
    expect(getCampaign('cups', 'm08', 'smeta-3')).toBe(EMAIL_DB.cups.periods.m08);
  });

  it('sin datos → lista vacía y null (regla de honestidad)', () => {
    expect(listCampaigns('cuus', 'm01')).toEqual([]);
    expect(getCampaign('cuus', 'm01')).toBeNull();
    expect(hasDataFor('cuus', 'm01')).toBe(false);
    expect(hasDataFor('cuus', 'm10')).toBe(true);
  });

  it('la descarga embebe solo la campaña elegida', () => {
    expect(buildSnapshot('email', 'cuus', 'm10', { emailCampaign: 'fairly-made' }).campaign.id).toBe('fairly-made');
    expect(buildSnapshot('email', 'cuus', 'm10').campaign.id).toBe('smeta-3');
  });
});
