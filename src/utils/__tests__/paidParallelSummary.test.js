import { describe, it, expect } from 'vitest';
import { summarizeParallel, shareOf } from '@/utils/paidParallelSummary';
import { getParallel } from '@/services/paidService';
import { fxFactor } from '@/services/fxService';
import { mondayOf, weekRangeLabel } from '@/utils/weekRange';

const PID = 'par-ifpa-202610';

describe('Paid · vista general de una campaña en paralelo (IFPA)', () => {
  const sum = summarizeParallel(getParallel('cuus', PID));

  it('suma inversión (misma moneda), impresiones y clics de las dos plataformas', () => {
    expect(sum.sameCurrency).toBe(true);
    expect(sum.currency).toBe('ARS');
    expect(sum.google.spend).toBe(264635.17);
    expect(sum.meta.spend).toBe(296909.96);
    expect(sum.total.spend).toBe(561545.13);
    expect(sum.total.imp).toBe(1722 + 11398);
    expect(sum.total.clicks).toBe(129 + 141);
  });

  it('Meta de tráfico no registra conversiones: null, no 0; sin costo por conversión total', () => {
    expect(sum.meta.conv).toBeNull();
    expect(sum.total.conv).toBe(1);
    expect(sum.google.costPerConv).toBe(264635.17);
    expect(sum.total.costPerConv).toBeNull();
  });

  it('inversión semanal: Google por semana y Meta agrupado desde el diario', () => {
    expect(sum.weeks.map((w) => w.w)).toEqual(['2026-10-05', '2026-10-12']);
    expect(sum.weeks[0]).toMatchObject({ google: 93293, meta: 0 });
    expect(sum.weeks[1]).toMatchObject({ google: 171342.17, meta: 296909.96 });
  });

  it('participación por plataforma', () => {
    const s = shareOf(sum, 'spend');
    expect(s.google + s.meta).toBeCloseTo(100, 6);
    expect(s.meta).toBeCloseTo((296909.96 / 561545.13) * 100, 4);
  });

  it('CU México ve la misma campaña completa (campaña conjunta)', () => {
    expect(summarizeParallel(getParallel('cumx', PID)).total.spend).toBe(561545.13);
  });

  it('en el descargable convierte con el tipo de cambio del cierre de la campaña', () => {
    const usd = summarizeParallel(getParallel('cuus', PID), { factor: (c) => fxFactor(c, 'USD', PID), to: 'USD' });
    expect(usd.currency).toBe('USD');
    expect(usd.total.spend).toBe(362.29); // 561.545,13 / 1.550, no 170,73 + 191,55
    expect(usd.total.imp).toBe(sum.total.imp);
  });

  it('con monedas distintas no suma la inversión', () => {
    const p = getParallel('cuus', PID);
    const mixed = summarizeParallel({ ...p, meta: { ...p.meta, currency: 'USD' } });
    expect(mixed.sameCurrency).toBe(false);
    expect(mixed.total.spend).toBeNull();
    expect(mixed.total.cpc).toBeNull();
    expect(mixed.weeks).toBeNull();
    expect(shareOf(mixed, 'spend')).toBeNull();
  });
});

describe('semanas de lunes a domingo', () => {
  it('lunes de la semana y rótulo de rango', () => {
    expect(mondayOf('2026-10-18')).toBe('2026-10-12');
    expect(mondayOf('2026-10-12')).toBe('2026-10-12');
    expect(weekRangeLabel('2026-10-12')).toBe('12/10 al 18/10');
    expect(weekRangeLabel('2026-09-28', 'en')).toBe('9/28 to 10/4');
  });
});

describe('textos de la vista general', () => {
  it('lectura con números reales y singular/plural correcto', async () => {
    const { genParallelConclusions, genParallelInsights } = await import('@/utils/paidParallelInsights');
    const sum = summarizeParallel(getParallel('cuus', PID));
    const es = genParallelConclusions(sum, 'es').map((x) => x.text).join(' ');
    expect(es).toContain('561.545,13 ARS');
    expect(es).toContain('1 conversión registrada');
    expect(es).not.toMatch(/[a-zó]\/(s|es)\b/);
    expect(genParallelConclusions(sum, 'en').map((x) => x.text).join(' ')).toContain('1 conversion recorded');
    expect(genParallelInsights(sum, 'es').length).toBeGreaterThan(0);
  });
});
