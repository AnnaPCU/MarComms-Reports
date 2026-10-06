import { describe, it, expect } from 'vitest';
import { listAccounts, listPeriods, getPlan, hasDataFor } from '@/services/plansService';
import { TAGLINES, brandOf } from '@/constants/brand';

describe('plansService', () => {
  it('lista el plan de Control Union Estados Unidos con su informe de septiembre 2026', () => {
    expect(listAccounts().map((a) => a.id)).toContain('cuus');
    expect(listPeriods().map((p) => p.id)).toContain('sep-2026');
    expect(hasDataFor('cuus', 'sep-2026')).toBe(true);
    expect(hasDataFor('cuus', 'm1')).toBe(false);
  });

  it('cada informe trae los bloques del reporte con su variante en inglés', () => {
    const plan = getPlan('cuus', 'sep-2026');
    expect(plan.kpiGroups.length).toBe(2);
    expect(plan.deliverables.every((d) => ['done', 'progress', 'pending'].includes(d.status))).toBe(true);
    expect(plan.deliverables.filter((d) => d.status === 'done').length).toBe(8);
    expect(plan.deliverables.filter((d) => d.status === 'progress').length).toBe(4);
    expect(plan.initiativeGroups[0].items.length).toBe(5);
    for (const k of ['title', 'program', 'period', 'market', 'intro', 'summaryTitle']) {
      expect(plan[`${k}En`], k).toBeTruthy();
    }
    for (const d of plan.deliverables) expect(d.nameEn && d.descEn, d.name).toBeTruthy();
    for (const g of plan.kpiGroups) for (const k of g.items) expect(k.labelEn, k.label).toBeTruthy();
  });

  it('los KPIs de performance: pipeline, MQLs y ventas, con sus importes', () => {
    const perf = getPlan('cuus', 'sep-2026').kpiGroups[1].items;
    expect(perf.map((k) => k.label)).toEqual(['Pipeline generado', 'MQLs generados', 'Ventas generadas']);
    expect(perf[0].value).toBe('848.160');
    expect(perf[0].valueEn).toBe('848,160');
    expect(perf[0].unit).toBe('USD');
    expect(perf[0].noteEn).toBeTruthy();
    expect(perf.find((k) => k.label === 'MQLs generados')).toMatchObject({ value: '40.000', valueEn: '40,000', unit: 'USD', pill: '8 MQLs' });
    expect(perf.find((k) => k.label === 'Ventas generadas')).toMatchObject({ value: '10.000', valueEn: '10,000', unit: 'USD', pill: '2 ventas', pillEn: '2 sales' });
    // Un KPI sin dato se guardaría como null y la vista mostraría «—»: nunca se inventa.
    expect(perf.every((k) => k.value === null || typeof k.value === 'string')).toBe(true);
  });

  it('los links de entregables tienen etiqueta y URL, solo en completados', () => {
    const plan = getPlan('cuus', 'sep-2026');
    const withLinks = plan.deliverables.filter((d) => d.links?.length);
    expect(withLinks.map((d) => d.name)).toEqual([
      'Optimización web 2.0',
      'Benchmarking: investigación competitiva',
      'Branding CUC',
      'Base de datos de la herramienta comercial',
      'Optimización de redes sociales: perfil',
      'Benchmarking digital: competidores',
      'Informe de mercado USDA',
    ]);
    expect(withLinks.every((d) => d.status === 'done')).toBe(true);
    for (const d of withLinks) for (const l of d.links) expect(l.label && /^https:\/\//.test(l.url), d.name).toBeTruthy();
  });

  it('plan de Peterson Solutions Argentina (hoja «PS Argentina»): 10 completados, 2 en curso y 1 pendiente', () => {
    expect(listAccounts()).toContainEqual({ id: 'psar', name: 'Peterson Solutions Argentina' });
    expect(hasDataFor('psar', 'sep-2026')).toBe(true);
    const plan = getPlan('psar', 'sep-2026');
    const count = (st) => plan.deliverables.filter((d) => d.status === st).length;
    expect([count('done'), count('progress'), count('pending')]).toEqual([10, 2, 1]);
    expect(plan.kpiGroups[1].items.map((k) => k.value)).toEqual(['94', '202', '1']);
    // Metas de pipeline, MQL y revenue vacías en la hoja: no se cargan como KPI.
    expect(plan.kpiGroups.flatMap((g) => g.items).some((k) => /pipeline|mql|revenue/i.test(k.label))).toBe(false);
    for (const d of plan.deliverables) expect(d.nameEn && d.descEn, d.name).toBeTruthy();
    for (const d of plan.deliverables) for (const l of d.links ?? []) expect(/^https:\/\//.test(l.url), d.name).toBe(true);
  });

  it('el tagline sigue la marca del reporte: Peterson no lleva el de Control Union', () => {
    expect(TAGLINES.peterson).toBe('For the world, for ourselves, for our families');
    expect(TAGLINES.cu).toBe('The Proof to Your Promise');
    expect(brandOf('psar', 'Peterson Solutions Argentina')).toBe('peterson');
  });

  it('período desconocido → null', () => {
    expect(getPlan('cuus', 'nope')).toBeNull();
  });
});
