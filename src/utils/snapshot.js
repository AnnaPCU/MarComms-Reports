// ════════════════════════════════════════════════════════════════
//  SNAPSHOT — captura los datos que muestra una vista, para embeberlos
//  en el HTML descargable (que renderiza esa vista interactiva, offline).
// ════════════════════════════════════════════════════════════════
import * as social from '@/services/socialService';
import * as paid from '@/services/paidService';
import * as website from '@/services/websiteService';

export async function buildSnapshot(pilar, account, period) {
  if (pilar === 'social') {
    if (period === 'cmp') return { kind: 'social-cmp' }; // ComparativeView usa datos del bundle
    const [mo, audience] = await Promise.all([
      social.fetchMonthly(account, period),
      social.fetchAudience(account),
    ]);
    const pid = social.prevPeriodId(period);
    const prev = pid ? await social.fetchMonthly(account, pid) : null;
    return { mo, prev, audience };
  }
  if (pilar === 'paid') {
    return { mo: await paid.fetchMonthly(account, period) };
  }
  if (pilar === 'website') {
    return { quarter: website.getQuarter(account, period), handle: website.getHandle(account) };
  }
  return {}; // email / webinars: sin datos, solo glosario
}
