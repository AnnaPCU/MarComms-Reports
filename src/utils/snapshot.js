// ════════════════════════════════════════════════════════════════
//  SNAPSHOT — captura los datos que muestra una vista, para embeberlos
//  en el HTML descargable (que renderiza esa vista interactiva, offline).
//  Lee del seed en código (sin base de datos).
// ════════════════════════════════════════════════════════════════
import * as social from '@/services/socialService';
import * as paid from '@/services/paidService';
import * as website from '@/services/websiteService';
import * as email from '@/services/emailService';
import * as webinars from '@/services/webinarsService';
import * as clients from '@/services/clientService';
import * as plans from '@/services/plansService';
import { convertPaidMonth } from '@/services/fxService';

// `opts.emailCampaign`: campaña elegida en Email cuando el mes tiene varias.
// `opts.currency`: moneda del descargable de Paid (ARS/USD/EUR). Solo aplica a
// los meses de Google Ads; la conversión usa el tipo de cambio de ese mes.
export function buildSnapshot(pilar, account, period, opts = {}) {
  if (pilar === 'social') {
    if (period === 'cmp') return { kind: 'social-cmp' }; // ComparativeView usa datos del bundle
    if (period === 'year-2026') {
      const { accName, series } = social.getYearSeries(account);
      return { kind: 'social-year', accName, series, audience: social.getAudience(account) };
    }
    return {
      mo: social.getMonthly(account, period),
      prev: social.getPrevMonthly(account, period),
      audience: social.getAudience(account),
    };
  }
  if (pilar === 'paid') {
    if (period === 'cmp') return { kind: 'paid-cmp' }; // la comparativa usa datos del bundle
    if (period === 'year-2026') return { kind: 'paid-year', year: paid.getYear(account) };
    const mo = paid.getMonthly(account, period);
    const detail = paid.getDetail(account, period);
    if (opts.currency && mo) {
      const conv = convertPaidMonth(mo, detail, period, opts.currency);
      if (conv) return conv;
    }
    return { mo, detail };
  }
  if (pilar === 'website') {
    if (period === 'cmp') return { kind: 'website-cmp' }; // la comparativa usa datos del bundle
    if (period === 'year-2026') return { kind: 'website-year', year: website.getYear(account) };
    return { quarter: website.getQuarter(account, period), handle: website.getHandle(account) };
  }
  if (pilar === 'email') {
    return { campaign: email.getCampaign(account, period, opts.emailCampaign ?? null), handle: email.getHandle(account) };
  }
  if (pilar === 'webinars') {
    return { event: webinars.getEvent(account, period) };
  }
  if (pilar === 'clients') {
    // Solo la vista General: el último período con datos de cada pilar.
    return { kind: 'client-overview', overview: clients.getOverview(account) };
  }
  if (pilar === 'plans') {
    return { plan: plans.getPlan(account, period) };
  }
  return {}; // webinars: sin datos, solo glosario
}
