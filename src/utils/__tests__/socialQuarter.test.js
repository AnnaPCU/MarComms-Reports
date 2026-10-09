import { describe, it, expect } from 'vitest';
import * as social from '@/services/socialService';
import { periodText, periodItems } from '@/utils/periodWording';

const M = ['m07', 'm08', 'm09'];

describe('Social · trimestres (suma de 3 meses)', () => {
  it('Q3 de una cuenta = suma de julio, agosto y septiembre; ER ponderado por impresiones', () => {
    for (const acc of social.listAccounts().map((a) => a.id)) {
      const ms = M.map((m) => social.getMonthly(acc, m));
      const q = social.getMonthly(acc, 'q3-2026');
      expect(q, acc).toBeTruthy();
      for (const k of ['imp', 'clk', 'vis', 'fol']) expect(q[k], `${acc} ${k}`).toBe(ms.reduce((a, x) => a + (x[k] || 0), 0));
      const er = ms.reduce((a, x) => a + x.er * x.imp, 0) / ms.reduce((a, x) => a + x.imp, 0);
      expect(q.er).toBeCloseTo(er, 6);
      expect(q.posts.length).toBeLessThanOrEqual(5);
      // El top del trimestre está ordenado por impresiones.
      expect(q.posts.map((p) => p.imp)).toEqual([...q.posts.map((p) => p.imp)].sort((a, b) => b - a));
    }
  });

  it('el trimestre anterior es el término de comparación (Q3 vs Q2)', () => {
    expect(social.getPrevMonthly('cue', 'q3-2026')).toEqual(social.getMonthly('cue', 'q2-2026'));
    expect(social.getPrevMonthly('cue', 'q1-2026')).toBeNull();
  });

  it('por país: suma de los 3 meses; seguidores = foto del último mes', () => {
    const ms = M.map((m) => social.getSegCountry('cul', 'ar', m));
    const q = social.getSegCountry('cul', 'ar', 'q3-2026');
    expect(q.imp).toBe(ms.reduce((a, x) => a + x.imp, 0));
    expect(q.np).toBe(ms.reduce((a, x) => a + x.np, 0));
    expect(q.folBase).toBe(ms[2].folBase);
    expect(social.getSegMonthTotals('cul', 'q3-2026').np).toBe(M.reduce((a, m) => a + social.getSegMonthTotals('cul', m).np, 0));
  });

  it('Q3 disponible para descargar en todas las cuentas', () => {
    for (const acc of social.listAccounts().map((a) => a.id)) expect(social.hasDataFor(acc, 'q3-2026'), acc).toBe(true);
    expect(social.listQuarters('cue')[0].id).toBe('q3-2026');
  });

  it('los textos hablan de «trimestre» en un trimestre', () => {
    expect(periodText('Impresiones +12% vs mes anterior', 'q3-2026', 'es')).toBe('Impresiones +12% vs trimestre anterior');
    expect(periodText('↑ 5.0% vs prev. month', 'q3-2026', 'en')).toBe('↑ 5.0% vs prev. quarter');
    expect(periodText('vs mes anterior', 'm09', 'es')).toBe('vs mes anterior');
    expect(periodItems([{ m: 'Post con mayor ER del mes', a: 'el próximo mes' }], 'q3-2026', 'es')).toEqual([{ m: 'Post con mayor ER del trimestre', a: 'el próximo trimestre' }]);
  });
});
