import { describe, it, expect } from 'vitest';
import { fmt, num, pct, computeDelta } from '@/utils/format';

describe('format', () => {
  it('num agrupa miles (es-AR) y maneja null', () => {
    expect(num(null)).toBe('—');
    expect(num(500)).toBe('500');
    // grupo de miles con separador (es-AR usa ".")
    expect(num(1234).replace(/\D/g, '')).toBe('1234');
    expect(num(1234)).toMatch(/1.234/);
  });

  it('fmt abrevia miles', () => {
    expect(fmt(null)).toBe('—');
    expect(fmt(500)).toBe('500');
    expect(fmt(58168)).toBe('58.2K');
  });

  it('pct redondea a 1 decimal y maneja null', () => {
    expect(pct(null)).toBe('—');
    expect(pct(12.34)).toBe('12.3%');
  });

  it('computeDelta devuelve dirección correcta', () => {
    expect(computeDelta(120, 100).dir).toBe('up');
    expect(computeDelta(80, 100).dir).toBe('down');
    expect(computeDelta(100, 100).dir).toBe('flat');
    expect(computeDelta(100, null).dir).toBe('none');
    expect(computeDelta(120, 100).label).toContain('20.0%');
  });
});
