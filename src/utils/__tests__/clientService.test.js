import { describe, it, expect } from 'vitest';
import { CLIENTS, CLIENT_BY_ID } from '@/constants/clients';
import { listClients, pillarsWithData, periodsFor, latestPeriod, getOverview, hasDataFor } from '@/services/clientService';
import * as social from '@/services/socialService';
import * as paid from '@/services/paidService';
import * as website from '@/services/websiteService';
import * as email from '@/services/emailService';
import * as webinars from '@/services/webinarsService';

const SVC = { social, paid, website, email, webinars };

describe('mapa de clientes', () => {
  it('cada cuenta mapeada existe en su pilar', () => {
    for (const c of CLIENTS) {
      for (const [pilar, ref] of Object.entries(c.pillars)) {
        const ids = SVC[pilar].listAccounts().map((a) => a.id);
        expect(ids, `${c.id} → ${pilar}:${ref.account}`).toContain(ref.account);
        if (ref.country) {
          const seg = social.getSegConfig(ref.account);
          expect(seg?.countries.map((x) => x.id), `${c.id} país ${ref.country}`).toContain(ref.country);
        }
      }
    }
  });

  it('los ids de cliente son únicos', () => {
    expect(new Set(CLIENTS.map((c) => c.id)).size).toBe(CLIENTS.length);
  });
});

describe('listClients — solo clientes con más de un pilar con datos', () => {
  it('excluye a los que tienen un solo pilar', () => {
    for (const { id } of listClients()) {
      expect(pillarsWithData(CLIENT_BY_ID[id]).length).toBeGreaterThanOrEqual(2);
      expect(hasDataFor(id)).toBe(true);
    }
  });

  it('CU España cruza Social, Paid y Website', () => {
    expect(pillarsWithData(CLIENT_BY_ID['cu-es'])).toEqual(['social', 'paid', 'website']);
  });

  it('un cliente sin cuentas no aparece', () => {
    expect(hasDataFor('no-existe')).toBe(false);
    expect(pillarsWithData({ pillars: {} })).toEqual([]);
  });
});

describe('periodsFor / latestPeriod', () => {
  it('lista más reciente primero, sin comparativa y con el resumen anual al final', () => {
    const list = periodsFor('paid', { account: 'pt' });
    expect(list.map((p) => p.id)).not.toContain('cmp');
    expect(list[0].id).toBe('m08');
    expect(list[list.length - 1].id).toBe('year-2026');
  });

  it('el último período nunca es el anual ni un GEO', () => {
    expect(latestPeriod('paid', { account: 'pt' }).id).toBe('m08');
    expect(latestPeriod('paid', { account: 'cuar' })).toBeNull(); // solo GEO
    expect(latestPeriod('website', { account: 'cua' }).id).toBe('q2-2026');
  });

  it('devuelve vacío para un pilar desconocido o sin referencia', () => {
    expect(periodsFor('otro', { account: 'x' })).toEqual([]);
    expect(periodsFor('paid', null)).toEqual([]);
  });
});

describe('getOverview', () => {
  it('arma un paquete por pilar con datos, con su último período', () => {
    const ov = getOverview('cu-es');
    expect(ov.client.name).toBe('Control Union España');
    expect(ov.pillars.map((p) => p.kind)).toEqual(['social', 'paid', 'website']);
    for (const p of ov.pillars) expect(p.periodLabel).toBeTruthy();
  });

  it('segmenta Social por país y usa el GEO cuando Paid no tiene meses', () => {
    const ov = getOverview('cu-ar');
    const kinds = Object.fromEntries(ov.pillars.map((p) => [p.pilar, p.kind]));
    expect(kinds.social).toBe('social-country');
    expect(kinds.paid).toBe('paid-geo');
    expect(ov.pillars.find((p) => p.pilar === 'social').countryName).toBe('Argentina');
  });

  it('no incluye la tabla de hot leads de Email en el paquete', () => {
    const ov = getOverview('cu-latam');
    const em = ov.pillars.find((p) => p.pilar === 'email');
    expect(em.campaign.hotLeads).toBeUndefined();
    expect(em.campaign.hotLeadsCount).toBeGreaterThan(0);
  });

  it('cliente inexistente → null', () => {
    expect(getOverview('nope')).toBeNull();
  });
});
