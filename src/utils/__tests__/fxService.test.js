import { describe, it, expect } from 'vitest';
import { canConvert, fxFactor, convertPaidMonth } from '@/services/fxService';
import { getMonthly, getDetail, listPeriods } from '@/services/paidService';
import { PAID_DB } from '@/data/paidSeed';
import { FX_RATES } from '@/data/fxRates';

describe('Paid · descarga en otra moneda', () => {
  it('ARS → USD con el tipo de cambio de cierre del mes (CU Canadá sep: 354.018,20 ARS = 229,88 USD)', () => {
    const { mo } = convertPaidMonth(getMonthly('cuc', 'm09'), getDetail('cuc', 'm09'), 'm09', 'USD');
    expect(mo.totals.currency).toBe('USD');
    expect(mo.totals.cost).toBe(229.88);
    expect(mo.totals.cpc).toBe(2.17);
    expect(mo.campaigns.reduce((a, c) => a + c.cost, 0)).toBeCloseTo(229.88, 1);
    expect(mo.fx).toMatchObject({ from: 'ARS', to: 'USD', unit: 'USD', value: 1540, quote: 'ARS' });
  });
  it('no toca impresiones, clics ni conversiones; convierte también el detalle por grupo', () => {
    const orig = getMonthly('cuc', 'm09');
    const det = getDetail('cuc', 'm09');
    const { mo, detail } = convertPaidMonth(orig, det, 'm09', 'EUR');
    expect(mo.totals.impressions).toBe(orig.totals.impressions);
    expect(mo.totals.clicks).toBe(orig.totals.clicks);
    expect(mo.totals.conversions).toBe(orig.totals.conversions);
    expect(detail.groups[0].weeks[0].cost).toBeCloseTo(det.groups[0].weeks[0].cost / 1765, 2);
  });
  it('USD ↔ EUR cruza por el peso del mismo día', () => {
    expect(fxFactor('USD', 'EUR', 'm09')).toBeCloseTo(1540 / 1765, 6);
  });
  it('sin tipo de cambio del mes no convierte (meses en EUR de febrero a julio)', () => {
    expect(canConvert('EUR', 'ARS', 'm07')).toBe(false);
    expect(convertPaidMonth(getMonthly('pt', 'm07'), null, 'm07', 'ARS')).toBeNull();
    expect(canConvert('EUR', 'EUR', 'm07')).toBe(true);
  });
  it('cada mes de Paid en ARS tiene su tipo de cambio cargado (USD y EUR)', () => {
    const missing = [];
    for (const { id } of listPeriods()) {
      const inArs = Object.values(PAID_DB).some((a) => a.periods[id]?.totals?.currency === 'ARS');
      if (inArs && !(FX_RATES[id]?.USD && FX_RATES[id]?.EUR)) missing.push(id);
    }
    expect(missing, 'Falta el tipo de cambio en src/data/fxRates.js (ver metricas/paid-media/README.md)').toEqual([]);
  });
});
