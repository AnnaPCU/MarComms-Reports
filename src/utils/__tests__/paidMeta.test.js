import { describe, it, expect } from 'vitest';
import { listGeoPeriods, isMetaPeriod, hasDataFor, getGeo } from '@/services/paidService';
import { genGeoNextSteps } from '@/utils/paidInsights';

describe('Paid · campañas de Meta Ads', () => {
  it('registra Aapresid como período de Meta de CU y PS Argentina', () => {
    expect(listGeoPeriods().map((p) => p.id)).toContain('geo-aapresid-2026');
    expect(hasDataFor('cuar', 'geo-aapresid-2026')).toBe(true);
    expect(hasDataFor('psar', 'geo-aapresid-2026')).toBe(true);
    expect(hasDataFor('es', 'geo-aapresid-2026')).toBe(false);
    expect(getGeo('cuar', 'geo-aapresid-2026').period.start).toBe('2026-08-03');
  });
  it('reconoce los ids geo- y meta-', () => {
    expect(isMetaPeriod('geo-aapresid-2026')).toBe(true);
    expect(isMetaPeriod('meta-smeta-202610')).toBe(true);
    expect(isMetaPeriod('m08')).toBe(false);
    expect(hasDataFor('cuar', 'meta-no-existe')).toBe(false);
  });
  it('próximos pasos genéricos: mejor creativo y destino sin resultados', () => {
    const geo = {
      period: { id: 'meta-x' },
      campaigns: [
        { name: 'Leads X', kind: 'leads', results: { value: 0 }, ads: [
          { name: 'A', imp: 1000, lc: 10 }, { name: 'B', imp: 1000, lc: 40 } ] },
      ],
    };
    const s = genGeoNextSteps(geo, 'es');
    expect(s[0]).toContain('«B»');
    expect(s[1]).toContain('Revisar el destino de «Leads X»');
    expect(s[s.length - 1]).not.toContain('radio');
  });
});
