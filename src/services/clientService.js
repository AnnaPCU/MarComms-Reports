// ════════════════════════════════════════════════════════════════
//  SERVICE — Vista por CLIENTE (unidad de negocio + país/región).
//  Resuelve, para cada cliente del mapa `constants/clients.js`, qué
//  pilares tienen datos reales, con qué períodos, y arma el paquete de
//  datos de la vista General (último período con datos de cada pilar).
//  Lee de los services de cada pilar — nunca del seed directo.
// ════════════════════════════════════════════════════════════════
import { CLIENTS, CLIENT_BY_ID, CLIENT_PILLAR_ORDER, BUSINESS_UNITS } from '@/constants/clients';
import { MONTHS_2026, QUARTERS_2026 } from '@/constants/periods';
import * as social from '@/services/socialService';
import * as paid from '@/services/paidService';
import * as website from '@/services/websiteService';
import * as email from '@/services/emailService';
import * as webinars from '@/services/webinarsService';
import { aggAccount } from '@/data/paidMetaGeo';
import { ML } from '@/data/socialSeed';

const YEAR = { id: 'year-2026', label: 'Resumen del Año 2026' };

// ── Períodos con datos de la cuenta mapeada, más reciente primero ──
// Sin la comparativa multi-cuenta (no es un dato del cliente) y con el
// Resumen del Año al final cuando la cuenta lo tiene.
export function periodsFor(pilar, ref) {
  if (!ref) return [];
  switch (pilar) {
    case 'social': {
      const list = social
        .listPeriods()
        .filter((p) => social.hasDataFor(ref.account, p.id))
        .reverse();
      if (social.hasYearData(ref.account)) list.push(YEAR);
      return list;
    }
    case 'paid': {
      const months = [...paid.listPeriods()].reverse().filter((p) => paid.hasDataFor(ref.account, p.id));
      const geo = paid.listGeoPeriods().filter((p) => paid.hasDataFor(ref.account, p.id));
      const list = [...geo, ...months];
      if (paid.hasDataFor(ref.account, 'year-2026')) list.push(YEAR);
      return list;
    }
    case 'website': {
      const list = [...website.listPeriods()].reverse().filter((p) => website.hasDataFor(ref.account, p.id));
      if (website.hasDataFor(ref.account, 'year-2026')) list.push(YEAR);
      return list;
    }
    case 'email':
      return [...email.listPeriods()].reverse().filter((p) => email.hasDataFor(ref.account, p.id));
    case 'webinars':
      return [...webinars.listPeriods()].reverse().filter((p) => webinars.hasDataFor(ref.account, p.id));
    default:
      return [];
  }
}

// Último período "de reporte" con datos (mes, trimestre o evento; nunca el
// resumen anual ni el GEO, que son vistas especiales).
export function latestPeriod(pilar, ref) {
  return periodsFor(pilar, ref).find((p) => p.id !== 'year-2026' && !String(p.id).startsWith('geo-')) ?? null;
}

// Pilares del cliente que tienen al menos un período con datos.
export function pillarsWithData(client) {
  return CLIENT_PILLAR_ORDER.filter((pilar) => client.pillars[pilar] && periodsFor(pilar, client.pillars[pilar]).length > 0);
}

// ── Cuentas del selector: solo los clientes con MÁS DE UN pilar con datos ──
export function listClients() {
  return CLIENTS.filter((c) => pillarsWithData(c).length >= 2).map((c) => ({ id: c.id, name: c.name }));
}

export function getClient(id) {
  return CLIENT_BY_ID[id] ?? null;
}

export function unitOf(client) {
  return BUSINESS_UNITS[client?.unit] ?? null;
}

export function hasDataFor(clientId) {
  const c = getClient(clientId);
  return Boolean(c && pillarsWithData(c).length >= 2);
}

// ── Nombre visible de la cuenta mapeada (con el país si segmenta) ──
function accountName(pilar, ref) {
  const svc = { social, paid, website, email, webinars }[pilar];
  const base = svc?.listAccounts().find((a) => a.id === ref.account)?.name ?? ref.account;
  if (pilar === 'social' && ref.country) {
    const c = social.getSegConfig(ref.account)?.countries.find((x) => x.id === ref.country);
    return c ? `${base} · ${c.name}` : base;
  }
  return base;
}

const monthLabel = (id) => MONTHS_2026.find((p) => p.id === id)?.label ?? id;

// ── Datos crudos del último período de UN pilar (para la vista General) ──
// Devuelve null si el pilar no tiene datos. Todo sale de los services: la
// vista solo formatea, no calcula ni estima.
export function getPillarLatest(pilar, ref) {
  if (!ref) return null;
  const common = { pilar, account: ref.account, country: ref.country ?? null, accName: accountName(pilar, ref), note: ref.note ?? null, noteEn: ref.noteEn ?? null };

  if (pilar === 'social') {
    const p = latestPeriod('social', ref);
    if (!p) return null;
    if (ref.country) {
      const cfg = social.getSegConfig(ref.account);
      const cInfo = cfg?.countries.find((c) => c.id === ref.country);
      // Último mes en el que el país tuvo publicaciones (la cuenta puede
      // tener el mes cargado sin posts etiquetados para ese país).
      const months = periodsFor('social', ref).filter((x) => /^m\d\d$/.test(x.id));
      const withPosts = months.find((m) => (social.getSegCountry(ref.account, ref.country, m.id)?.np ?? 0) > 0) ?? months[0];
      const d = social.getSegCountry(ref.account, ref.country, withPosts.id);
      if (!d) return null;
      return {
        ...common,
        kind: 'social-country',
        period: withPosts.id,
        periodLabel: ML[withPosts.id] ?? withPosts.label,
        countryName: cInfo?.name ?? ref.country,
        segLabel: cfg?.label ?? '',
        d,
        prev: social.getPrevSegCountry(ref.account, ref.country, withPosts.id),
        tot: social.getSegMonthTotals(ref.account, withPosts.id),
        folBase: social.getSegFolBase(ref.account, ref.country),
      };
    }
    return {
      ...common,
      kind: 'social',
      period: p.id,
      periodLabel: ML[p.id] ?? p.label,
      mo: social.getMonthly(ref.account, p.id),
      prev: social.getPrevMonthly(ref.account, p.id),
    };
  }

  if (pilar === 'paid') {
    const p = latestPeriod('paid', ref);
    if (p) {
      return { ...common, kind: 'paid', period: p.id, periodLabel: monthLabel(p.id), mo: paid.getMonthly(ref.account, p.id) };
    }
    // Cuenta solo con campañas GEO de Meta (ej. CU Argentina).
    const gp = paid.listGeoPeriods().find((x) => paid.hasDataFor(ref.account, x.id));
    if (!gp) return null;
    const geo = paid.getGeo(ref.account, gp.id);
    const agg = aggAccount(geo);
    return {
      ...common,
      kind: 'paid-geo',
      period: gp.id,
      periodLabel: gp.label,
      event: geo.event,
      currency: geo.currency,
      agg: { spend: agg.spend, imp: agg.imp, lc: agg.lc, out: agg.out, ctr: agg.ctr, cpc: agg.cpc, cpm: agg.cpm },
      geo,
    };
  }

  if (pilar === 'website') {
    const p = latestPeriod('website', ref);
    if (!p) return null;
    const q = website.getQuarter(ref.account, p.id);
    return {
      ...common,
      kind: 'website',
      period: p.id,
      periodLabel: QUARTERS_2026.find((x) => x.id === p.id)?.label ?? p.label,
      site: q?.site ?? null,
      seo: q?.seo ?? null,
      handle: website.getHandle(ref.account),
    };
  }

  if (pilar === 'email') {
    const p = latestPeriod('email', ref);
    if (!p) return null;
    const c = email.getCampaign(ref.account, p.id);
    if (!c) return null;
    // Sin la tabla de hot leads (pesada): la vista General solo usa el conteo.
    const { hotLeads, ...rest } = c;
    return {
      ...common,
      kind: 'email',
      period: p.id,
      periodLabel: monthLabel(p.id),
      campaign: { ...rest, hotLeadsCount: c.hotLeadsCount ?? hotLeads?.length ?? 0 },
    };
  }

  if (pilar === 'webinars') {
    const p = latestPeriod('webinars', ref);
    if (!p) return null;
    return { ...common, kind: 'webinars', period: p.id, periodLabel: p.label, ev: webinars.getEvent(ref.account, p.id) };
  }

  return null;
}

// ── Paquete completo de la vista General de un cliente ──
export function getOverview(clientId) {
  const client = getClient(clientId);
  if (!client) return null;
  const pillars = pillarsWithData(client)
    .map((pilar) => getPillarLatest(pilar, client.pillars[pilar]))
    .filter(Boolean);
  return {
    client: { id: client.id, name: client.name, unit: client.unit, unitName: unitOf(client)?.name ?? '', region: client.region },
    pillars,
  };
}
