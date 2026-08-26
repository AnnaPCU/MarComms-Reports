// ════════════════════════════════════════════════════════════════
//  SNAPSHOT — captura los datos que muestra una vista, para embeberlos
//  en el HTML descargable (que renderiza esa vista interactiva, offline).
//  Lee del seed en código (sin base de datos).
// ════════════════════════════════════════════════════════════════
import * as social from '@/services/socialService';
import * as paid from '@/services/paidService';
import * as website from '@/services/websiteService';
import * as email from '@/services/emailService';

export function buildSnapshot(pilar, account, period) {
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
    return { mo: paid.getMonthly(account, period), detail: paid.getDetail(account, period) };
  }
  if (pilar === 'website') {
    return { quarter: website.getQuarter(account, period), handle: website.getHandle(account) };
  }
  if (pilar === 'email') {
    return { campaign: email.getCampaign(account, period), handle: email.getHandle(account) };
  }
  return {}; // webinars: sin datos, solo glosario
}
