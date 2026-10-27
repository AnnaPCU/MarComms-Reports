import { describe, it, expect } from 'vitest';
import { WEBINARS_DB, WEBINAR_CLIENTS } from '@/data/webinarsSeed';
import { EMAIL_DB } from '@/data/emailSeed';
import { brandOf } from '@/constants/brand';
import { listClients, getOverview } from '@/services/clientService';

const ev = WEBINARS_DB.psus['wbn-fueling'];

describe('Webinar Fueling Conversations (PS Estados Unidos, oct 2026)', () => {
  it('es una cuenta propia de Peterson Solutions', () => {
    expect(WEBINAR_CLIENTS.find((c) => c.id === 'psus')?.name).toBe('Peterson Solutions Estados Unidos');
    expect(brandOf('psus')).toBe('peterson');
  });

  it('registrados y asistentes cierran con internos, externos y speakers', () => {
    expect(ev.externos.registered + ev.internos.total).toBe(ev.registered); // 86 + 13 = 99
    expect(ev.externos.attended + ev.internos.attended + ev.speakers).toBe(ev.attended); // 28 + 11 + 2 = 41
    expect(ev.showRate).toBeCloseTo((ev.externos.attended / ev.externos.registered) * 100, 1); // 32,6 % sobre externos
  });

  it('los segmentos suman los registrados externos y los priorizados son hot + warm', () => {
    const d = ev.deals;
    expect(d.hot + d.warm + d.review + d.cold).toBe(ev.externos.attended);
    expect(d.hot + d.warm + d.review + d.cold + d.nurture).toBe(ev.externos.registered);
    expect(d.total).toBe(d.hot + d.warm);
    expect(ev.hotLeads.rows).toHaveLength(d.total);
    expect(ev.hotLeads.rows.filter((r) => r.tier === 'HOT')).toHaveLength(d.hot);
  });

  it('las bandas de permanencia suman los asistentes externos', () => {
    const e = ev.engagement;
    expect(e.high + e.mid + e.low).toBe(e.base);
    expect(e.base).toBe(ev.externos.attended);
    expect(e.low).toBe(ev.deals.cold); // < 20 min = cold
  });

  it('emails y LinkedIn: los totales salen de los envíos y posteos', () => {
    expect(ev.email.sends.reduce((a, s) => a + s.sent, 0)).toBe(ev.email.totalSent);
    expect(ev.email.sends).toHaveLength(ev.email.sendNamesEn.length);
    expect(ev.email.regInBase + ev.social.regOutsideEmail).toBe(ev.registered);
    const p = ev.social.posts;
    expect(p.reduce((a, x) => a + x.imp, 0)).toBe(ev.social.totals.imp);
    expect(p.reduce((a, x) => a + x.clicks, 0)).toBe(ev.social.totals.clicks);
    expect(p.reduce((a, x) => a + x.inter, 0)).toBe(ev.social.totals.inter);
  });

  it('la campaña de email va en la cuenta de Email del mismo nombre, con los mismos envíos', () => {
    const c = EMAIL_DB.psus.periods.m10;
    expect(EMAIL_DB.psus.name).toBe('Peterson Solutions Estados Unidos');
    expect(c.totals.totalSent).toBe(ev.email.totalSent);
    expect(c.emails.map((e) => e.name)).toEqual(ev.email.sends.map((s) => s.name));
  });

  it('el cliente PS Estados Unidos cruza Social (vista EE. UU. de PS Iberia & Americas), Email y Webinars', () => {
    expect(listClients().some((c) => c.id === 'ps-usa')).toBe(true);
    const o = getOverview('ps-usa');
    expect(o.pillars.map((p) => p.kind).sort()).toEqual(['email', 'social-country', 'webinars']);
  });
});
