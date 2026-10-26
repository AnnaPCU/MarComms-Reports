import { describe, it, expect } from 'vitest';
import { canConvert, fxFactor, convertPaidMonth } from '@/services/fxService';
import { getMonthly, getDetail, listPeriods, listSpecialPeriods, listAccounts, getNativeCurrencies } from '@/services/paidService';
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
    expect(detail.groups[0].weeks[0].cost).toBeCloseTo(det.groups[0].weeks[0].cost / 1748.67, 2);
  });
  it('USD ↔ EUR cruza por el peso del mismo día', () => {
    expect(fxFactor('USD', 'EUR', 'm09')).toBeCloseTo(1540 / 1748.67, 6);
    expect(fxFactor('EUR', 'USD', 'm07')).toBeCloseTo(1.1485, 3);
  });
  it('los meses en EUR (feb–jul) se pueden pasar a ARS y USD', () => {
    const { mo } = convertPaidMonth(getMonthly('pt', 'm07'), null, 'm07', 'USD');
    expect(mo.totals.currency).toBe('USD');
    expect(mo.totals.cost).toBeCloseTo(getMonthly('pt', 'm07').totals.cost * 1.1485, 1);
    expect(mo.fx).toMatchObject({ unit: 'EUR', value: 1.1485, quote: 'USD', source: 'bce' });
    expect(canConvert('EUR', 'ARS', 'm07')).toBe(true);
  });
  it('sin tipo de cambio del mes no convierte', () => {
    expect(canConvert('ARS', 'USD', 'm12')).toBe(false);
    expect(canConvert('EUR', 'EUR', 'm12')).toBe(true);
  });
  it('cada campaña (en paralelo o de Meta) tiene el tipo de cambio de su cierre', () => {
    const missing = listSpecialPeriods()
      .filter(({ id }) => !(FX_RATES[id]?.USD && FX_RATES[id]?.usdPerEur))
      .map(({ id }) => id);
    expect(missing, 'Falta el tipo de cambio de la campaña en src/data/fxRates.js (cierre de la campaña)').toEqual([]);
    for (const p of listSpecialPeriods()) {
      expect(FX_RATES[p.id].date <= p.end, `${p.id}: el tipo de cambio no puede ser posterior al fin de la campaña`).toBe(true);
    }
  });
  it('IFPA (campaña en paralelo) se puede bajar en ARS, USD y EUR, Google y Meta', () => {
    for (const acc of listAccounts().map((a) => a.id)) {
      const curs = getNativeCurrencies(acc, 'par-ifpa-202610');
      if (!curs.length) continue;
      for (const to of ['ARS', 'USD', 'EUR']) expect(curs.every((c) => canConvert(c, to, 'par-ifpa-202610'))).toBe(true);
    }
    const { mo } = convertPaidMonth(getMonthly('cuus', 'par-ifpa-202610'), getDetail('cuus', 'par-ifpa-202610'), 'par-ifpa-202610', 'USD');
    expect(mo.totals.cost).toBeCloseTo(264635.17 / 1550, 2);
    expect(mo.fx).toMatchObject({ from: 'ARS', to: 'USD', value: 1550, campaign: true, date: '2026-10-23' });
  });
  it('los meses no llevan la marca de campaña en la nota del tipo de cambio', () => {
    expect(convertPaidMonth(getMonthly('cuc', 'm09'), null, 'm09', 'USD').mo.fx.campaign).toBe(false);
  });
  it('cada mes de Paid con datos tiene su tipo de cambio cargado (dólar BNA y euro/dólar BCE)', () => {
    const missing = [];
    for (const { id } of listPeriods()) {
      const has = Object.values(PAID_DB).some((a) => a.periods[id]);
      if (has && !(FX_RATES[id]?.USD && FX_RATES[id]?.usdPerEur)) missing.push(id);
    }
    expect(missing, 'Falta el tipo de cambio en src/data/fxRates.js (ver metricas/paid-media/README.md)').toEqual([]);
  });
});
