import { describe, it, expect } from 'vitest';
import { maskDigits } from '@/utils/demoMask';

// Modo demo (temporal): los dígitos visibles pasan a «x», salvo lo que hace
// falta para orientarse (años, fechas, trimestres, normas ISO).
describe('maskDigits', () => {
  it('enmascara cifras conservando el formato', () => {
    expect(maskDigits('1.234,56 ARS')).toBe('x.xxx,xx ARS');
    expect(maskDigits('13,0 %')).toBe('xx,x %');
    expect(maskDigits('+1.597 seguidores')).toBe('+x.xxx seguidores');
    expect(maskDigits('12,345')).toBe('xx,xxx');
  });

  it('conserva años, trimestres, fechas y normas', () => {
    expect(maskDigits('Agosto 2026')).toBe('Agosto 2026');
    expect(maskDigits('Q2 2026')).toBe('Q2 2026');
    expect(maskDigits('26 de agosto de 2026')).toBe('26 de agosto de 2026');
    expect(maskDigits('Webinar ISO 14064 · Jul 2026')).toBe('Webinar ISO 14064 · Jul 2026');
    expect(maskDigits('2026-08-10')).toBe('2026-08-10');
    expect(maskDigits('semana del 10/8')).toBe('semana del 10/8');
  });

  it('mezcla: enmascara la cifra y deja el contexto', () => {
    expect(maskDigits('4.154 impresiones en Agosto 2026')).toBe('x.xxx impresiones en Agosto 2026');
    expect(maskDigits('Se creó el 21/08/2026: cubre 11 de los 31 días')).toBe('Se creó el 21/08/2026: cubre xx de los xx días');
  });

  it('sin dígitos → intacto', () => {
    expect(maskDigits('Sin información suficiente')).toBe('Sin información suficiente');
  });
});
