// ════════════════════════════════════════════════════════════════
//  REGISTRO DE PILARES — conecta cada pilar con su vista, sus cuentas
//  y sus períodos (con la granularidad correspondiente).
//  El App lee de acá para armar los filtros del header y rutear la vista.
// ════════════════════════════════════════════════════════════════

import * as social from '@/services/socialService';
import * as paid from '@/services/paidService';
import * as website from '@/services/websiteService';
import * as email from '@/services/emailService';
import { QUARTERS_2026 } from '@/constants/periods';

import { SocialApp } from '@/components/social/SocialApp';
import { PaidApp } from '@/components/paid/PaidApp';
import { WebsiteApp } from '@/components/website/WebsiteApp';
import { EmailApp } from '@/components/email/EmailApp';
import { WebinarsApp } from '@/components/webinars/WebinarsApp';

const COMPARATIVE = { id: 'cmp', label: 'Comparativa Multi-Cuenta' };
// Vista temporal: resumen anual de progreso de una cuenta (pedido puntual).
const YEAR_2026 = { id: 'year-2026', label: 'Resumen del Año 2026' };

export const REGISTRY = {
  social: {
    Component: SocialApp,
    accounts: social.listAccounts(),
    // meses (más reciente primero) + resumen anual + comparativa
    periods: [...social.listPeriods()].reverse().concat(YEAR_2026, COMPARATIVE),
    defaultPeriod: 'm07',
    hasDataFor: social.hasDataFor,
  },
  paid: {
    Component: PaidApp,
    accounts: paid.listAccounts(),
    // meses (más reciente primero) + trimestres → permite ver/importar por Q
    periods: [...paid.listPeriods()].reverse().concat(QUARTERS_2026),
    defaultPeriod: 'm07', // Julio 2026: último mes completo cargado
    hasDataFor: paid.hasDataFor,
  },
  website: {
    Component: WebsiteApp,
    accounts: website.listAccounts(),
    periods: website.listPeriods(),
    defaultPeriod: 'q2-2026', // último trimestre cargado
    hasDataFor: website.hasDataFor,
  },
  email: {
    Component: EmailApp,
    accounts: email.listAccounts(),
    // meses presentes en el seed (más reciente primero); vacío hasta el 1er import
    periods: [...email.listPeriods()].reverse(),
    defaultPeriod: email.listPeriods().slice(-1)[0]?.id ?? null,
    hasDataFor: email.hasDataFor,
  },
  webinars: { Component: WebinarsApp, accounts: [], periods: [], defaultPeriod: null, hasDataFor: null },
};

export function getPilarConfig(id) {
  return REGISTRY[id] ?? REGISTRY.social;
}
