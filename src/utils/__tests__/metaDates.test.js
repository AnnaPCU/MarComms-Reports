import { describe, it, expect } from 'vitest';
import { dayLabel, rangeLabel, deliveryWindow } from '@/utils/metaDates';

describe('metaDates', () => {
  it('etiqueta de día ES/EN', () => {
    expect(dayLabel('2026-08-04')).toBe('4 Ago');
    expect(dayLabel('2026-08-04', true)).toBe('Aug 4');
  });
  it('rangos dentro del mes y entre meses', () => {
    expect(rangeLabel('2026-08-03', '2026-08-07')).toBe('3–7 de agosto de 2026');
    expect(rangeLabel('2026-08-03', '2026-08-07', 'en')).toBe('August 3–7, 2026');
    expect(rangeLabel('2026-08-04', '2026-08-06', 'es', false)).toBe('4–6 de agosto');
    expect(rangeLabel('2026-09-28', '2026-10-04')).toBe('28 de septiembre – 4 de octubre de 2026');
    expect(rangeLabel('2026-09-28', '2026-10-04', 'en')).toBe('September 28 – October 4, 2026');
  });
  it('ventana de entrega: solo días con impresiones', () => {
    const c = { days: [{ d: '2026-08-03', imp: 0 }, { d: '2026-08-05', imp: 3 }, { d: '2026-08-04', imp: 1 }, { d: '2026-08-07', imp: 0 }] };
    expect(deliveryWindow([c])).toEqual({ start: '2026-08-04', end: '2026-08-05' });
    expect(deliveryWindow([{ days: [] }])).toBeNull();
  });
});
