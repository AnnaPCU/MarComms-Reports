import { describe, it, expect } from 'vitest';
import { CRM_GENERATED, CRM_ENTITIES, CRM_MQL, CRM_WON } from '@/data/crmSeed';
import { CLIENTS } from '@/constants/clients';
import { getClientCrm, getPillarCrm, summarize, monthsOfPeriod, MAIN_SOURCES, OTHER_SOURCES } from '@/services/crmService';
import { fmtMoney, monthsRangeLabel, periodClosed } from '@/utils/crmI18n';
import { CRM_UI_ENABLED } from '@/constants/crm';
import { crmStripCards } from '@/components/clients/ClientCrm';

const ALL_ENTS = Object.keys(CRM_ENTITIES);
const sumGen = (src) => Object.values(CRM_GENERATED[src]).reduce((a, m) => a + Object.values(m).reduce((x, y) => x + y, 0), 0);

describe('crmService', () => {
  it('los deals generados cuadran con el total de HubSpot por origen (2026, entidades leídas)', () => {
    expect({
      social: sumGen('social'),
      paid: sumGen('paid'),
      website: sumGen('website'),
      email: sumGen('email'),
      webinars: sumGen('webinars'),
      steal: sumGen('steal'),
      database: sumGen('database'),
      ctool: sumGen('ctool'),
      inperson: sumGen('inperson'),
      bdr: sumGen('bdr'),
    }).toEqual({ social: 16, paid: 29, website: 543, email: 258, webinars: 1797, steal: 441, database: 3881, ctool: 557, inperson: 315, bdr: 0 });
  });

  it('MQL y WON: cada fila es de una sola moneda y los sin importe no superan a los deals', () => {
    for (const r of [...CRM_MQL, ...CRM_WON]) {
      const [, ent, month, cur, deals, amount, noAmount] = r;
      expect(ALL_ENTS).toContain(ent);
      expect(month).toMatch(/^m(0[1-9]|1[0-2])$/);
      expect(cur).toMatch(/^[A-Z]{3}$/);
      expect(noAmount).toBeLessThanOrEqual(deals);
      if (noAmount === deals) expect(amount).toBe(0);
    }
  });

  it('los importes se agrupan por moneda, nunca se suman entre monedas', () => {
    const s = summarize(ALL_ENTS, [...MAIN_SOURCES, ...OTHER_SOURCES], monthsOfPeriod('year-2026'));
    expect(Object.keys(s.won.byCurrency).length).toBeGreaterThan(1);
    expect(fmtMoney({ USD: 1000, EUR: 2500 }, 'es')).toBe('2.500 EUR · 1.000 USD');
    expect(fmtMoney({}, 'en')).toBe('—');
  });

  it('cada cliente mapea a entidades conocidas; sin entidad → sin bloque', () => {
    for (const c of CLIENTS) for (const e of c.crmEntities) expect(ALL_ENTS, c.id).toContain(e);
    expect(getClientCrm('cu-global')).toBeNull();
  });

  it('las marcas no se mezclan: cada cliente solo suma entidades de su unidad', () => {
    for (const c of CLIENTS) {
      const units = new Set(c.crmEntities.map((e) => CRM_ENTITIES[e].unit));
      expect([...units].every((u) => u === c.unit), c.id).toBe(true);
    }
    // CU Canadá (Solutions) vende servicios de Peterson: no se asigna a ningún cliente.
    expect(CLIENTS.some((c) => c.crmEntities.includes('583s'))).toBe(false);
  });

  it('Control Union Estados Unidos, septiembre: STEAL y Database van aparte del número principal', () => {
    const d = getClientCrm('cu-us', 'm09');
    expect(d.entities).toEqual(['537', '537i']); // Certifications + Inspections
    expect(d.main.total.generated).toBe(13); // Website 10 + Paid 1 + Email 2 (Inspections)
    expect(d.other.rows.find((r) => r.id === 'steal').generated).toBe(441);
    expect(d.other.total.generated).toBe(486); // STEAL 441 + Database 43 + eventos presenciales 2
    expect(d.other.rows.find((r) => r.id === 'bdr').generated).toBe(0);
  });

  it('tira de Indicadores clave: las cards de HubSpot que dan cero no se muestran', () => {
    const keys = (id) => crmStripCards(getClientCrm(id, 'year-2026')).map((c) => c.key);
    expect(keys('cu-us')).toEqual(['crm-gen', 'crm-mql', 'crm-won']);
    // Control Union España no tiene WON de los 5 pilares en 2026: esa card no va.
    expect(getClientCrm('cu-es', 'year-2026').main.total.won.deals).toBe(0);
    expect(keys('cu-es')).toEqual(['crm-gen', 'crm-mql']);
    expect(crmStripCards(null)).toEqual([]);
  });

  it('UI de HubSpot oculta por ahora (9/10/2026): los datos siguen, la vista no', () => {
    expect(CRM_UI_ENABLED).toBe(false);
    expect(getPillarCrm('website', 'cuus', 'q3-2026').generated).toBe(34); // el dato sigue disponible
  });

  it('pie de la card: un período cerrado se nombra por su rango, uno abierto lleva la fecha de corte', () => {
    expect(periodClosed(monthsOfPeriod('q3-2026'), '2026-10-06')).toBe(true);
    expect(periodClosed(monthsOfPeriod('q4-2026'), '2026-10-06')).toBe(false);
    expect(periodClosed(monthsOfPeriod('year-2026'), '2026-10-06')).toBe(false);
    expect(monthsRangeLabel(monthsOfPeriod('q3-2026'), 'es')).toBe('jul–sep 2026');
    expect(monthsRangeLabel(['m09'], 'en')).toBe('Sep 2026');
  });

  it('meses de un período: mes, trimestre y año; los especiales no aplican', () => {
    expect(monthsOfPeriod('m09')).toEqual(['m09']);
    expect(monthsOfPeriod('q3-2026')).toEqual(['m07', 'm08', 'm09']);
    expect(monthsOfPeriod('year-2026')).toHaveLength(12);
    expect(monthsOfPeriod('geo-agro')).toBeNull();
  });

  it('card de pilar: entidades de la cuenta (o del país) y origen = el pilar', () => {
    expect(getPillarCrm('website', 'cuus', 'q3-2026').generated).toBe(34);
    expect(getPillarCrm('social', 'cul', 'm09', 'ar').entities).toEqual(['538']);
    expect(getPillarCrm('social', 'cun', 'm09')).toBeNull(); // cuenta sin entidad: no se infiere
    expect(getPillarCrm('paid', 'es', 'geo-x')).toBeNull();
  });
});
