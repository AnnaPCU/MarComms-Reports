import { describe, it, expect } from 'vitest';
import { getMonthly, getYear } from '@/services/paidService';

const names = (acc, m) => getMonthly(acc, m).campaigns.map((c) => c.name);

describe('Paid · una campaña aparece desde el mes en que arranca', () => {
  it('IFPA (en cero, sin arrancar) no figura en septiembre de CU Estados Unidos', () => {
    expect(names('cuus', 'm09')).not.toContain('IFPA event');
    expect(names('cuus', 'm09')).toEqual(expect.arrayContaining(['Organic - USDA NOP', 'Organic - PrimusGFS']));
  });
  it('los totales del mes no cambian', () => {
    const mo = getMonthly('cuus', 'm09');
    expect(mo.totals.impressions).toBe(mo.campaigns.reduce((a, c) => a + c.impressions, 0));
  });
  it('Portugal: antes de arrancar no aparecen; después, aunque den cero, sí', () => {
    expect(names('pt', 'm02')).toEqual(['GMP+']);
    // Textile arrancó en junio: desde ahí se ve todos los meses.
    for (const m of ['m06', 'm07', 'm08', 'm09']) expect(names('pt', m)).toContain('Textile');
  });
  it('Cannabis (CU Canadá) nunca arrancó: no figura ni en el resumen anual', () => {
    expect(names('cuc', 'm06')).not.toContain('Cannabis');
    expect(getYear('cuc').campaigns.map((c) => c.name)).not.toContain('Cannabis');
  });
});
