// ════════════════════════════════════════════════════════════════
//  SEED — Pilar Email Marketing (Mailchimp / Apollo). Mensual.
//  Datos en código (sin base de datos). Se cargan procesando los
//  exports de Mailchimp con `scripts/mailchimp-to-seed.mjs` y pegando
//  el resultado en EMAIL_DB.
//
//  Forma de cada período (campaña/secuencia) — ver utils/mailchimp/build.js:
//    {
//      campaignName,
//      emails:   [{ name, subject, metrics:{ sent, openRate, clickRate, ctor, … } }],
//      totals:   { emailCount, totalSent, totalDelivered, openRate, clickRate, ctor, … },
//      comparison:[{ name, aperturas, clics, ctor }],
//      allLeads: [{ email, firstName, lastName, company, clicks, opens, campaigns, emailAppearances }],
//      hotLeads: [ …subconjunto de allLeads con clicks>0… ],
//      hotLeadsCount,
//    }
//
//  Mientras no haya datos reales importados, EMAIL_DB queda vacío y la
//  vista muestra "Sin información suficiente" (regla de honestidad).
// ════════════════════════════════════════════════════════════════

import { MONTHS_2026 } from '@/constants/periods';

// { [accountId]: { name, handle?, periods: { [periodId]: <campaña> } } }
export const EMAIL_DB = {};

// Cuentas derivadas del seed (vacío hasta el primer import real).
export const EMAIL_CLIENTS = Object.entries(EMAIL_DB).map(([id, v]) => ({ id, name: v.name }));

// Períodos (meses) presentes en el seed, en el orden canónico de MONTHS_2026.
export function emailPeriodsPresent() {
  const present = new Set();
  Object.values(EMAIL_DB).forEach((acc) => {
    Object.keys(acc.periods || {}).forEach((p) => present.add(p));
  });
  return MONTHS_2026.filter((m) => present.has(m.id));
}
