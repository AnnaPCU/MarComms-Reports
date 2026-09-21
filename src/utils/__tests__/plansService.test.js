import { describe, it, expect } from 'vitest';
import { listAccounts, listPeriods, getPlan, hasDataFor } from '@/services/plansService';

describe('plansService', () => {
  it('lista el plan de Control Union USA con su informe del Mes 1', () => {
    expect(listAccounts().map((a) => a.id)).toContain('cuus');
    expect(listPeriods().map((p) => p.id)).toContain('m1');
    expect(hasDataFor('cuus', 'm1')).toBe(true);
    expect(hasDataFor('cuus', 'm2')).toBe(false);
  });

  it('cada informe trae los bloques del reporte con su variante en inglés', () => {
    const plan = getPlan('cuus', 'm1');
    expect(plan.kpis.length).toBeGreaterThan(0);
    expect(plan.deliverables.every((d) => ['done', 'progress', 'pending'].includes(d.status))).toBe(true);
    expect(plan.tracker.every((a) => [null, 'high', 'medium'].includes(a.priority))).toBe(true);
    for (const k of ['title', 'program', 'period', 'intro', 'objectiveTitle', 'nextTitle', 'trackerTitle']) {
      expect(plan[`${k}En`], k).toBeTruthy();
    }
    expect(plan.objectiveEn.length).toBe(plan.objective.length);
    expect(plan.nextStepsEn.length).toBe(plan.nextSteps.length);
  });

  it('período desconocido → null', () => {
    expect(getPlan('cuus', 'nope')).toBeNull();
  });
});
