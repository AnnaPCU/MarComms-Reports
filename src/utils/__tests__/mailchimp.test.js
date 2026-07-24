import { describe, it, expect } from 'vitest';
import { parsePercentage, safeInt, detectKeys, extractLeads } from '@/utils/mailchimp/leads';
import {
  metricsFromLeads,
  metricsFromStats,
  aggregateLeads,
  hotLeadsOf,
  priorityOf,
  sequenceTotals,
  comparisonData,
} from '@/utils/mailchimp/aggregate';
import { buildCampaign } from '@/utils/mailchimp/build';

describe('mailchimp/leads', () => {
  it('parsePercentage tolera %, coma decimal y valores inválidos', () => {
    expect(parsePercentage('12,5%')).toBe(12.5);
    expect(parsePercentage('3.2')).toBe(3.2);
    expect(parsePercentage('')).toBe(0);
    expect(parsePercentage('abc')).toBe(0);
  });

  it('safeInt parsea enteros y cae a 0', () => {
    expect(safeInt('4')).toBe(4);
    expect(safeInt('')).toBe(0);
    expect(safeInt('x')).toBe(0);
  });

  it('detectKeys encuentra columnas en inglés y español', () => {
    const k = detectKeys({ 'Email Address': 'a', Clicks: 1, 'Total Opens': 2, Company: 'X', 'First Name': 'N', 'Last Name': 'L' });
    expect(k.emailKey).toBe('Email Address');
    expect(k.clicksKey).toBe('Clicks');
    expect(k.opensKey).toBe('Total Opens');
    expect(k.companyKey).toBe('Company');
    expect(k.firstNameKey).toBe('First Name');
    expect(k.lastNameKey).toBe('Last Name');
  });

  it('extractLeads filtra filas sin email e infiere empresa del dominio', () => {
    const rows = [
      { Email: 'ana@acme.com', Clicks: '2', Opens: '3', Company: '', 'First Name': 'Ana' },
      { Email: 'no-email', Clicks: '9', Opens: '9', Company: '', 'First Name': '' },
      { Email: 'juan@beta.io', Clicks: '0', Opens: '1', Company: 'Beta SA', 'First Name': '' },
    ];
    const leads = extractLeads(rows);
    expect(leads).toHaveLength(2);
    expect(leads[0]).toMatchObject({ email: 'ana@acme.com', clicks: 2, opens: 3, company: 'acme', firstName: 'Ana' });
    expect(leads[1].company).toBe('Beta SA');
  });

  it('extractLeads devuelve [] sin columna email', () => {
    expect(extractLeads([{ Nombre: 'x' }])).toEqual([]);
    expect(extractLeads([])).toEqual([]);
  });
});

describe('mailchimp/aggregate', () => {
  const leads = [
    { email: 'a@x.com', clicks: 2, opens: 3 },
    { email: 'b@x.com', clicks: 0, opens: 1 },
    { email: 'c@x.com', clicks: 1, opens: 0 },
    { email: 'd@x.com', clicks: 0, opens: 0 },
  ];

  it('metricsFromLeads usa únicos para las tasas', () => {
    const m = metricsFromLeads(leads);
    expect(m.sent).toBe(4);
    expect(m.uniqueOpens).toBe(2); // a, b
    expect(m.uniqueClicks).toBe(2); // a, c
    expect(m.openRate).toBe(50);
    expect(m.clickRate).toBe(50);
    expect(m.ctor).toBe(100); // 2 clics únicos / 2 aperturas únicas
    expect(m.totalOpens).toBe(4);
    expect(m.totalClicks).toBe(3);
  });

  it('metricsFromStats calcula tasas sobre el volumen real de envío', () => {
    const m = metricsFromStats({ sent: 1000, delivered: 980, opens: 260, clicks: 42, bounces: 20, unsubs: 3 });
    expect(m.sent).toBe(1000);
    expect(m.delivered).toBe(980);
    expect(m.openRate).toBeCloseTo(26.53); // 260/980
    expect(m.clickRate).toBeCloseTo(4.29); // 42/980
    expect(m.ctor).toBeCloseTo(16.15); // 42/260
    expect(m.bounceRate).toBeCloseTo(2); // 20/1000
    expect(m.unsubRate).toBeCloseTo(0.31); // 3/980
  });

  it('metricsFromStats omite rebote/bajas si no vienen', () => {
    const m = metricsFromStats({ sent: 500, opens: 100, clicks: 10 });
    expect(m.bounceRate).toBeUndefined();
    expect(m.unsubRate).toBeUndefined();
    expect(m.openRate).toBe(20); // 100/500 (sin delivered usa sent)
  });

  it('aggregateLeads deduplica por email, suma y ordena por clics', () => {
    const emails = [
      { leads: [{ email: 'a@x.com', clicks: 1, opens: 1 }, { email: 'b@x.com', clicks: 0, opens: 2 }] },
      { leads: [{ email: 'a@x.com', clicks: 2, opens: 1 }] },
    ];
    const all = aggregateLeads(emails);
    expect(all[0].email).toBe('a@x.com');
    expect(all[0].clicks).toBe(3);
    expect(all[0].opens).toBe(2);
    expect(all[0].campaigns).toBe(2);
    expect(all[0].emailAppearances).toEqual([1, 2]);
  });

  it('hotLeadsOf y priorityOf', () => {
    const all = aggregateLeads([{ leads }]);
    const hot = hotLeadsOf(all);
    expect(hot.map((l) => l.email)).toEqual(['a@x.com', 'c@x.com']);
    expect(priorityOf({ clicks: 3 })).toBe('Crítica');
    expect(priorityOf({ clicks: 2 })).toBe('Alta');
    expect(priorityOf({ clicks: 1 })).toBe('Media');
    expect(priorityOf({ clicks: 0 })).toBe('Baja');
  });

  it('sequenceTotals consolida con tasas ponderadas por volumen', () => {
    const emails = [
      { metrics: { sent: 100, uniqueOpens: 40, uniqueClicks: 10 } },
      { metrics: { sent: 100, uniqueOpens: 20, uniqueClicks: 4 } },
    ];
    const t = sequenceTotals(emails);
    expect(t.emailCount).toBe(2);
    expect(t.totalSent).toBe(200);
    expect(t.totalOpens).toBe(60);
    expect(t.totalClicks).toBe(14);
    expect(t.openRate).toBeCloseTo(30); // 60/200
    expect(t.clickRate).toBeCloseTo(7); // 14/200
    expect(t.bounceRate).toBeNull(); // no vino el dato
  });

  it('comparisonData arma una fila por email', () => {
    const emails = [{ name: 'E1', metrics: { openRate: 33.33, clickRate: 5, ctor: 15 } }];
    expect(comparisonData(emails)).toEqual([{ name: 'E1', aperturas: 33.3, clics: 5, ctor: 15 }]);
  });
});

describe('mailchimp/build', () => {
  it('compone una campaña completa desde emails con leads', () => {
    const c = buildCampaign({
      campaignName: 'Seq',
      emails: [
        { name: 'E1', leads: [{ email: 'a@x.com', clicks: 2, opens: 2 }, { email: 'b@x.com', clicks: 0, opens: 1 }] },
        { name: 'E2', leads: [{ email: 'a@x.com', clicks: 1, opens: 1 }] },
      ],
    });
    expect(c.campaignName).toBe('Seq');
    expect(c.emails).toHaveLength(2);
    expect(c.totals.emailCount).toBe(2);
    expect(c.hotLeadsCount).toBe(1); // solo a@x.com clickeó
    expect(c.hotLeads[0].email).toBe('a@x.com');
    expect(c.hotLeads[0].clicks).toBe(3);
    // el seed NO guarda leads por email (se consolidan en allLeads/hotLeads)
    expect(c.emails[0]).not.toHaveProperty('leads');
  });

  it('usa stats agregadas para las métricas y el CSV solo para hot leads', () => {
    const c = buildCampaign({
      emails: [
        {
          name: 'E1',
          leads: [{ email: 'a@x.com', clicks: 1, opens: 1 }, { email: 'b@x.com', clicks: 0, opens: 1 }],
          stats: { sent: 1000, delivered: 980, opens: 260, clicks: 42, bounces: 20, unsubs: 3 },
        },
      ],
    });
    expect(c.totals.totalSent).toBe(1000);
    expect(c.totals.totalDelivered).toBe(980);
    expect(c.totals.totalBounces).toBe(20);
    expect(c.totals.bounceRate).toBeCloseTo(2);
    expect(c.totals.openRate).toBeCloseTo(26.53);
    // hot leads salen del CSV, independientes de las stats
    expect(c.hotLeadsCount).toBe(1);
    expect(c.hotLeads[0].email).toBe('a@x.com');
  });
});
