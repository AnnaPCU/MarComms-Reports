import { describe, it, expect } from 'vitest';
import { REGISTRY } from '@/pilares/registry';
import { brandOf } from '@/constants/brand';

// Nombres de cuenta unificados en todos los filtros (pedido del 6/10/2026):
// marca completa (nunca «CU …» ni «PS …») y país en español
// («Control Union Estados Unidos», no «USA» ni «United States»).
const BAD = [/^CU\b/, /^PS\b/, /\bUSA\b/, /United States/, /\bCanada\b/, /\bBrazil\b/, /\bMexico\b/, /\bSpain\b/, /\bPeru\b/];

describe('nombres de cuenta en los filtros', () => {
  for (const [pilar, cfg] of Object.entries(REGISTRY)) {
    it(`${pilar}: nombre completo y país en español`, () => {
      for (const a of cfg.accounts) {
        for (const re of BAD) expect(a.name, `${pilar}:${a.id}`).not.toMatch(re);
      }
    });
  }

  it('una misma cuenta se llama igual en todos los pilares donde aparece', () => {
    const byName = (id) => Object.values(REGISTRY).flatMap((c) => c.accounts.filter((a) => a.id === id).map((a) => a.name));
    // cuus = Control Union Estados Unidos en Paid, Website, Email y Planes
    expect(new Set(byName('cuus'))).toEqual(new Set(['Control Union Estados Unidos']));
  });

  it('el logo del cliente no depende del nombre de la cuenta', () => {
    const brand = (pilar, id) => {
      const a = REGISTRY[pilar].accounts.find((x) => x.id === id);
      return brandOf(a.id, a.name);
    };
    expect(brand('email', 'cups')).toBe('cu'); // campaña conjunta CU + PS Latinoamérica
    expect(brand('email', 'cug')).toBe('cu');
    expect(brand('email', 'psi')).toBe('peterson');
    expect(brand('email', 'cuus')).toBe('cu');
    expect(brand('paid', 'psar')).toBe('peterson');
    expect(brand('webinars', 'cu')).toBe('cu');
    expect(brand('plans', 'cuus')).toBe('cu');
  });
});
