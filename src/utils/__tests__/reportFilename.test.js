import { describe, it, expect } from 'vitest';
import { reportFilename, slugPart, expandAccountName } from '@/utils/reportFilename';

describe('expandAccountName', () => {
  it('expande CU → Control Union y PS → Peterson Solutions', () => {
    expect(expandAccountName('CU Portugal')).toBe('Control Union Portugal');
    expect(expandAccountName('CU España')).toBe('Control Union España');
    expect(expandAccountName('PS Argentina')).toBe('Peterson Solutions Argentina');
  });
  it('deja intactos los nombres ya completos', () => {
    expect(expandAccountName('Control Union Latinoamérica')).toBe('Control Union Latinoamérica');
    expect(expandAccountName('Peterson Solutions (Global)')).toBe('Peterson Solutions (Global)');
  });
});

describe('reportFilename', () => {
  it('usa el nombre completo de la marca (CU Portugal → Control_Union_Portugal)', () => {
    expect(
      reportFilename({ pilarLabel: 'Paid Media', accountName: 'CU Portugal', period: 'm06', periodLabel: 'Junio 2026' }),
    ).toBe('Control_Union_Portugal__Reporte_Paid_Media_Junio_2026.html');
  });

  it('PS Argentina → Peterson_Solutions_Argentina', () => {
    expect(
      reportFilename({ pilarLabel: 'Paid Media', accountName: 'PS Argentina', period: 'm06', periodLabel: 'Junio 2026' }),
    ).toBe('Peterson_Solutions_Argentina__Reporte_Paid_Media_Junio_2026.html');
  });

  it('normaliza acentos/ñ y mapea el mes a nombre completo', () => {
    expect(slugPart('CU España')).toBe('CU_Espana');
    expect(
      reportFilename({ pilarLabel: 'Paid Media', accountName: 'CU España', period: 'm05', periodLabel: 'May 2026' }),
    ).toBe('Control_Union_Espana__Reporte_Paid_Media_Mayo_2026.html');
  });

  it('trimestres y comparativa', () => {
    expect(
      reportFilename({ pilarLabel: 'Website', accountName: 'Control Union Argentina', period: 'q1-2026', periodLabel: 'Q1 2026' }),
    ).toBe('Control_Union_Argentina__Reporte_Website_Q1_2026.html');
    expect(
      reportFilename({ pilarLabel: 'Social Media', accountName: 'Control Union Norte', period: 'cmp', periodLabel: '⚡ Comparativa Multi-Cuenta' }),
    ).toBe('Control_Union_Norte__Reporte_Social_Media_Comparativa.html');
  });

  it('uso externo agrega el sufijo _Externo (interno no)', () => {
    const base = { pilarLabel: 'Paid Media', accountName: 'CU Portugal', period: 'm06', periodLabel: 'Junio 2026' };
    expect(reportFilename({ ...base, audience: 'internal' })).toBe('Control_Union_Portugal__Reporte_Paid_Media_Junio_2026.html');
    expect(reportFilename({ ...base, audience: 'external' })).toBe('Control_Union_Portugal__Reporte_Paid_Media_Junio_2026_Externo.html');
  });

  it('sin cuenta/período (Email/Webinars) no rompe', () => {
    expect(reportFilename({ pilarLabel: 'Email Marketing', accountName: '', period: '', periodLabel: '' })).toBe(
      'Reporte_Email_Marketing.html',
    );
  });
});
