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
    return {
      mo: social.getMonthly(account, period),
      prev: social.getPrevMonthly(account, period),
      audience: social.getAudience(account),
    };
  }
  if (pilar === 'paid') {
    return { mo: paid.getMonthly(account, period) };
  }
  if (pilar === 'website') {
    return { quarter: website.getQuarter(account, period), handle: website.getHandle(account) };
  }
  if (pilar === 'email') {
    return { campaign: email.getCampaign(account, period), handle: email.getHandle(account) };
  }
  return {}; // webinars: sin datos, solo glosario
}
