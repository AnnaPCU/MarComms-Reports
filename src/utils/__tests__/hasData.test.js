import { describe, it, expect } from 'vitest';
import { monthHasData, hasData } from '@/utils/hasData';

describe('hasData (regla de honestidad)', () => {
  it('monthHasData distingue datos reales de _nodata/null', () => {
    expect(monthHasData(null)).toBe(false);
    expect(monthHasData({ _nodata: true })).toBe(false);
    expect(monthHasData({})).toBe(false);
    expect(monthHasData({ imp: 5 })).toBe(true);
    expect(monthHasData({ posts: [{ t: 'x' }] })).toBe(true);
  });

  it('hasData acepta array (filas) u objeto mensual', () => {
    expect(hasData([])).toBe(false);
    expect(hasData([{}])).toBe(true);
    expect(hasData({ _nodata: true })).toBe(false);
    expect(hasData({ imp: 1 })).toBe(true);
  });
});
