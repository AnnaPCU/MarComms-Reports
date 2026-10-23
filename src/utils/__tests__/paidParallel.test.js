import { describe, it, expect } from 'vitest';
import {
  listParallelPeriods,
  listSpecialPeriods,
  isParallelPeriod,
  isMetaPeriod,
  getParallel,
  getMonthly,
  getDetail,
  getGeo,
  hasDataFor,
} from '@/services/paidService';
import { aggAccount } from '@/data/paidMetaGeo';
import { REGISTRY } from '@/pilares/registry';
import { latestPeriod } from '@/services/clientService';

const PID = 'par-ifpa-202610';

describe('campaña en paralelo (Google Ads + Meta Ads): IFPA · CU Estados Unidos', () => {
  it('es un período propio, distinto de los meses y de las campañas de Meta', () => {
    expect(listParallelPeriods().map((p) => p.id)).toContain(PID);
    expect(isParallelPeriod(PID)).toBe(true);
    expect(isMetaPeriod(PID)).toBe(false);
    expect(hasDataFor('cuus', PID)).toBe(true);
    expect(hasDataFor('es', PID)).toBe(false);
  });

  it('aparece en «Período/Campaña» de la cuenta, arriba de los meses', () => {
    const ids = REGISTRY.paid.periodsFor('cuus').map((p) => p.id);
    expect(ids[0]).toBe(PID);
    expect(ids).toContain('m09');
    expect(listSpecialPeriods()[0].id).toBe(PID); // más reciente primero
  });

  it('Google: totales del vuelo y semanal por grupo que cuadran con el informe de campañas', () => {
    const mo = getMonthly('cuus', PID);
    expect(mo.totals).toMatchObject({ impressions: 1722, clicks: 129, cost: 264635.17, conversions: 1, currency: 'ARS' });
    const weeks = getDetail('cuus', PID).groups.flatMap((g) => g.weeks);
    expect(weeks.reduce((a, w) => a + w.imp, 0)).toBe(1722);
    expect(weeks.reduce((a, w) => a + w.clk, 0)).toBe(129);
    expect(Math.round(weeks.reduce((a, w) => a + w.cost, 0) * 100) / 100).toBe(264635.17);
  });

  it('Meta: dos campañas, diario = total y destino en cada anuncio', () => {
    const geo = getGeo('cuus', PID);
    const agg = aggAccount(geo);
    expect(geo.campaigns).toHaveLength(2);
    expect(agg.imp).toBe(11398);
    expect(Math.round(agg.spend * 100) / 100).toBe(296909.96);
    expect(agg.lc).toBe(141);
    const ads = geo.campaigns.flatMap((c) => c.ads);
    expect(ads).toHaveLength(40);
    expect(ads.every((a) => a.dest)).toBe(true);
    expect(ads.filter((a) => a.dest === 'typeform')).toHaveLength(21);
    expect(ads.filter((a) => a.dest === 'web')).toHaveLength(19);
    // Meta no registró visitas a la página: queda sin dato, no en cero.
    expect(ads.some((a) => 'lpv' in a)).toBe(false);
  });

  it('las plataformas quedan separadas (nada se suma entre Google y Meta)', () => {
    const p = getParallel('cuus', PID);
    expect(p.google.mo.totals.impressions).toBe(1722);
    expect(aggAccount(p.meta).imp).toBe(11398);
  });

  it('el último mes de la cuenta sigue siendo un mes, nunca la campaña en paralelo', () => {
    expect(latestPeriod('paid', { account: 'cuus' }).id).toBe('m09');
  });
});

describe('IFPA: campaña conjunta de CU Estados Unidos y CU México', () => {
  it('CU México ve la misma campaña completa, sin repartir cifras', () => {
    expect(hasDataFor('cumx', PID)).toBe(true);
    const mx = getParallel('cumx', PID);
    const us = getParallel('cuus', PID);
    expect(mx.owners).toEqual(['cuus', 'cumx']);
    expect(mx.sharedFrom).toBe('cuus');
    expect(getMonthly('cumx', PID)).toBe(getMonthly('cuus', PID));
    expect(aggAccount(getGeo('cumx', PID)).imp).toBe(aggAccount(us.meta).imp);
    expect(REGISTRY.paid.periodsFor('cumx').map((p) => p.id)[0]).toBe(PID);
  });
});
