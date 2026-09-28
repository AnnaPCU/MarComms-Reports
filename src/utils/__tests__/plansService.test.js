import { describe, it, expect } from 'vitest';
import { listAccounts, listPeriods, getPlan, hasDataFor } from '@/services/plansService';

describe('plansService', () => {
  it('lista el plan de Control Union USA con su informe de septiembre 2026', () => {
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
    expect(perf[0].noteEn).toBeTruthy();
    expect(perf.find((k) => k.label === 'MQLs generados')).toMatchObject({ value: '8', pill: '$40k' });
    expect(perf.find((k) => k.label === 'Ventas generadas')).toMatchObject({ value: '2', pill: '$10k' });
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

  it('período desconocido → null', () => {
    expect(getPlan('cuus', 'nope')).toBeNull();
  });
});
