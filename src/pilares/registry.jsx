// ════════════════════════════════════════════════════════════════
//  REGISTRO DE PILARES — conecta cada pilar con su vista, sus cuentas
//  y sus períodos (con la granularidad correspondiente).
//  El App lee de acá para armar los filtros del header y rutear la vista.
// ════════════════════════════════════════════════════════════════

import * as social from '@/services/socialService';
import * as paid from '@/services/paidService';
import * as website from '@/services/websiteService';
import * as email from '@/services/emailService';
import * as webinars from '@/services/webinarsService';
import * as clients from '@/services/clientService';
import * as plans from '@/services/plansService';
import { QUARTERS_2026 } from '@/constants/periods';

import { SocialApp } from '@/components/social/SocialApp';
import { PaidApp } from '@/components/paid/PaidApp';
import { WebsiteApp } from '@/components/website/WebsiteApp';
import { EmailApp } from '@/components/email/EmailApp';
import { WebinarsApp } from '@/components/webinars/WebinarsApp';
import { ClientApp } from '@/components/clients/ClientApp';
import { PlansApp } from '@/components/plans/PlansApp';

const COMPARATIVE = { id: 'cmp', label: 'Comparativa Multi-Cuenta' };
// Vista temporal: resumen anual de progreso de una cuenta (pedido puntual).
const YEAR_2026 = { id: 'year-2026', label: 'Resumen del Año 2026' };

export const REGISTRY = {
  social: {
    Component: SocialApp,
    accounts: social.listAccounts(),
    // meses (más reciente primero) + resumen anual + comparativa
    periods: [...social.listPeriods()].reverse().concat(YEAR_2026, COMPARATIVE),
    defaultPeriod: 'm08', // Agosto 2026: último mes cargado
    hasDataFor: social.hasDataFor,
  },
  paid: {
    Component: PaidApp,
    accounts: paid.listAccounts(),
    // Fallback estático (el header usa periodsFor, dependiente de la cuenta).
    periods: [...paid.listPeriods()].reverse().concat(paid.listGeoPeriods(), QUARTERS_2026),
    // El filtro muestra SOLO los períodos/campañas con datos de la cuenta:
    // eventos GEO de Meta (Ago, lo más reciente) + meses descendentes.
    // Sin opciones vacías.
    periodsFor: (account) => {
      const list = paid
        .listGeoPeriods()
        .concat([...paid.listPeriods()].reverse())
        .filter((p) => paid.hasDataFor(account, p.id));
      // Resumen anual (si la cuenta tiene meses de Google Ads) + comparativa.
      if (paid.hasDataFor(account, 'year-2026')) list.push(YEAR_2026);
      list.push(COMPARATIVE);
      return list;
    },
    periodFilterLabel: 'Período/Campaña',
    defaultPeriod: 'm08', // Agosto 2026: último mes cargado
    hasDataFor: paid.hasDataFor,
  },
  website: {
    Component: WebsiteApp,
    accounts: website.listAccounts(),
    // trimestres + resumen anual + comparativa
    periods: [...website.listPeriods(), YEAR_2026, COMPARATIVE],
    defaultPeriod: 'q2-2026', // último trimestre cargado
    hasDataFor: website.hasDataFor,
  },
  email: {
    Component: EmailApp,
    accounts: email.listAccounts(),
    // meses presentes en el seed (más reciente primero); vacío hasta el 1er import
    periods: [...email.listPeriods()].reverse(),
    // Cada cuenta tiene su propia campaña: solo se listan los meses con datos.
    periodsFor: (account) => [...email.listPeriods()].reverse().filter((p) => email.hasDataFor(account, p.id)),
    defaultPeriod: email.listPeriods().slice(-1)[0]?.id ?? null,
    hasDataFor: email.hasDataFor,
  },
  webinars: {
    Component: WebinarsApp,
    accounts: webinars.listAccounts(),
    // Un período por EVENTO (reporte mixto: Livestorm+Mailchimp+LinkedIn+HubSpot)
    periods: [...webinars.listPeriods()].reverse(),
    // Cada cuenta (LATAM / Global) tiene sus propios eventos.
    periodsFor: (account) => [...webinars.listPeriods()].reverse().filter((p) => webinars.hasDataFor(account, p.id)),
    periodFilterLabel: 'Evento',
    defaultPeriod: webinars.listPeriods().slice(-1)[0]?.id ?? null,
    hasDataFor: webinars.hasDataFor,
  },
  // Vista por CLIENTE (unidad de negocio + país/región): no es un pilar.
  // El "período" es único (la vista General); cada pilar elige el suyo
  // adentro. Solo se listan los clientes con más de un pilar con datos.
  clients: {
    Component: ClientApp,
    accounts: clients.listClients(),
    periods: [{ id: 'overview', label: 'Vista General' }],
    defaultPeriod: 'overview',
    accountFilterLabel: 'Cliente',
    hidePeriod: true,
    hasDataFor: (account) => clients.hasDataFor(account),
    badgeText: (account) => {
      const c = clients.getClient(account);
      const n = c ? clients.pillarsWithData(c).length : 0;
      return `Datos reales — ${n} pilares`;
    },
  },
  // Vista PLANES: informes mensuales de avance de un plan regional. Un
  // período por informe (Mes 1, Mes 2…); la cuenta es el cliente del plan.
  plans: {
    Component: PlansApp,
    accounts: plans.listAccounts(),
    periods: [...plans.listPeriods()].reverse(),
    periodsFor: (account) => [...plans.listPeriods()].reverse().filter((p) => plans.hasDataFor(account, p.id)),
    periodFilterLabel: 'Informe',
    accountFilterLabel: 'Plan',
    defaultPeriod: plans.listPeriods().slice(-1)[0]?.id ?? null,
    hasDataFor: plans.hasDataFor,
    badgeText: () => 'Informe de avance del plan',
  },
};

export function getPilarConfig(id) {
  return REGISTRY[id] ?? REGISTRY.social;
}
