import { describe, it, expect } from 'vitest';
import { reportFilename, slugPart } from '@/utils/reportFilename';

describe('reportFilename', () => {
  it('arma el nombre CU_Portugal__Reporte_Paid_Media_Junio_2026 (caso del usuario)', () => {
    expect(
      reportFilename({ pilarLabel: 'Paid Media', accountName: 'CU Portugal', period: 'm06', periodLabel: 'Junio 2026' }),
    ).toBe('CU_Portugal__Reporte_Paid_Media_Junio_2026.html');
  });

  it('normaliza acentos/ñ y espacios', () => {
    expect(slugPart('CU España')).toBe('CU_Espana');
    expect(
      reportFilename({ pilarLabel: 'Social Media', accountName: 'CU España', period: 'm05', periodLabel: 'May 2026' }),
    ).toBe('CU_Espana__Reporte_Social_Media_Mayo_2026.html');
  });

  it('trimestres y comparativa', () => {
    expect(
      reportFilename({ pilarLabel: 'Website', accountName: 'Control Union Argentina', period: 'q1-2026', periodLabel: 'Q1 2026' }),
    ).toBe('Control_Union_Argentina__Reporte_Website_Q1_2026.html');
    expect(
      reportFilename({ pilarLabel: 'Social Media', accountName: 'CU Norte', period: 'cmp', periodLabel: '⚡ Comparativa Multi-Cuenta' }),
    ).toBe('CU_Norte__Reporte_Social_Media_Comparativa.html');
  });

  it('sin cuenta/período (Email/Webinars) no rompe', () => {
    expect(reportFilename({ pilarLabel: 'Email Marketing', accountName: '', period: '', periodLabel: '' })).toBe(
      'Reporte_Email_Marketing.html',
    );
  });
});
