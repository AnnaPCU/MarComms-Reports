import { describe, it, expect } from 'vitest';
import { getSegConfig, getSegCountry, getSegMonthTotals } from '@/services/socialService';

describe('Social · PS Iberia & Americas por país (Argentina, Brasil, Estados Unidos)', () => {
  it('la cuenta segmenta en los tres países pedidos', () => {
    expect(getSegConfig('pia').countries.map((c) => c.name)).toEqual(['Argentina', 'Brasil', 'Estados Unidos']);
  });

  it('posts por hashtag: Argentina en agosto y septiembre, Estados Unidos en septiembre', () => {
    expect(getSegCountry('pia', 'ar', 'm08')).toMatchObject({ np: 5, imp: 6735 });
    expect(getSegCountry('pia', 'ar', 'm09')).toMatchObject({ np: 2, imp: 1377 });
    expect(getSegCountry('pia', 'us', 'm09')).toMatchObject({ np: 2, imp: 929 });
    expect(getSegCountry('pia', 'br', 'm09').np).toBe(0); // sin posteos con marcador de Brasil
  });

  it('lo atribuido más lo sin país da el total del mes', () => {
    for (const m of ['m08', 'm09']) {
      const tot = getSegMonthTotals('pia', m);
      const np = ['ar', 'br', 'us'].reduce((a, c) => a + getSegCountry('pia', c, m).np, 0);
      expect(np + tot.un).toBe(tot.np);
    }
  });

  it('antes de agosto no hay datos por país (no se inventan)', () => {
    expect(getSegCountry('pia', 'ar', 'm07')).toBeNull();
  });
});
