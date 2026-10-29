import { describe, it, expect } from 'vitest';
import { EMAIL_DB } from '@/data/emailSeed';
import { brandOf } from '@/constants/brand';
import { getOverview } from '@/services/clientService';

describe('Email · Newsletter general de Peterson Solutions Argentina (oct 2026)', () => {
  const c = EMAIL_DB.psar?.periods?.m10;

  it('es una cuenta propia de Peterson Solutions', () => {
    expect(EMAIL_DB.psar.name).toBe('Peterson Solutions Argentina');
    expect(brandOf('psar')).toBe('peterson');
  });

  it('dos envíos, con las métricas de los exports de destinatarios', () => {
    expect(c.emails.map((e) => [e.name, e.metrics.sent, e.metrics.uniqueOpens, e.metrics.uniqueClicks])).toEqual([
      ['Email 1', 738, 128, 3],
      ['Email 2', 663, 124, 2],
    ]);
    expect(c.totals.totalSent).toBe(1401);
    expect(c.hotLeadsCount).toBe(4); // contactos únicos con clic
  });

  it('el cliente Peterson Solutions Americas suma el email', () => {
    expect(getOverview('ps-am').pillars.some((p) => p.kind === 'email')).toBe(true);
  });
});
