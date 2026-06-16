// ════════════════════════════════════════════════════════════════
//  REGISTRO DE PILARES — conecta cada pilar con su vista, sus cuentas
//  y sus períodos (con la granularidad correspondiente).
//  El App lee de acá para armar los filtros del header y rutear la vista.
// ════════════════════════════════════════════════════════════════

import * as social from '@/services/socialService';
import * as paid from '@/services/paidService';
import * as website from '@/services/websiteService';

import { SocialApp } from '@/components/social/SocialApp';
import { PaidApp } from '@/components/paid/PaidApp';
import { WebsiteApp } from '@/components/website/WebsiteApp';
import { EmailApp } from '@/components/email/EmailApp';
import { WebinarsApp } from '@/components/webinars/WebinarsApp';

const COMPARATIVE = { id: 'cmp', label: '⚡ Comparativa Multi-Cuenta' };

export const REGISTRY = {
  social: {
    Component: SocialApp,
    accounts: social.listAccounts(),
    // meses (más reciente primero) + comparativa
    periods: [...social.listPeriods()].reverse().concat(COMPARATIVE),
    defaultPeriod: 'm05',
    hasDataFor: social.hasDataFor,
  },
  paid: {
    Component: PaidApp,
    accounts: paid.listAccounts(),
    periods: [...paid.listPeriods()].reverse(),
    defaultPeriod: 'm05', // CU Portugal: último mes completo
    hasDataFor: paid.hasDataFor,
  },
  website: {
    Component: WebsiteApp,
    accounts: website.listAccounts(),
    periods: website.listPeriods(),
    defaultPeriod: 'q1-2026',
    hasDataFor: website.hasDataFor,
  },
  email: { Component: EmailApp, accounts: [], periods: [], defaultPeriod: null, hasDataFor: null },
  webinars: { Component: WebinarsApp, accounts: [], periods: [], defaultPeriod: null, hasDataFor: null },
};

export function getPilarConfig(id) {
  return REGISTRY[id] ?? REGISTRY.social;
}
