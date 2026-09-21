// ════════════════════════════════════════════════════════════════
//  CONFIGURACIÓN DE PILARES
//  Define los 5 pilares, sus fuentes y su estado de implementación.
//  La nav y el router por estado (App.jsx) leen de acá.
// ════════════════════════════════════════════════════════════════

import {
  Linkedin,
  Megaphone,
  Mail,
  Video,
  Globe,
  Building2,
  ClipboardCheck,
} from 'lucide-react';

export const PILARES = [
  {
    id: 'social',
    label: 'Social Media',
    sources: ['LinkedIn'],
    icon: Linkedin,
    ready: true, // pilar de referencia, datos reales Mayo 2026
  },
  {
    id: 'paid',
    label: 'Paid Media',
    sources: ['Google Ads', 'Meta Ads'],
    icon: Megaphone,
    ready: true,
  },
  {
    id: 'email',
    label: 'Email Marketing',
    sources: ['Mailchimp', 'Apollo'],
    icon: Mail,
    ready: false,
  },
  {
    id: 'webinars',
    label: 'Webinars',
    sources: ['Livestorm', 'Mailchimp', 'LinkedIn', 'HubSpot'],
    icon: Video,
    ready: true,
  },
  {
    id: 'website',
    label: 'Website',
    sources: ['Google Analytics', 'Search Console'],
    icon: Globe,
    ready: true,
  },
];

export const PILAR_BY_ID = Object.fromEntries(PILARES.map((p) => [p.id, p]));

// Vista por CLIENTE (unidad de negocio + país/región). No es un pilar: cruza
// los 5 pilares para los clientes a los que se les trabaja más de uno. Va en
// la nav como sección aparte, después de los pilares.
export const CLIENTS_NAV = {
  id: 'clients',
  label: 'Clientes',
  icon: Building2,
  ready: true,
};

// Vista PLANES: informes mensuales de avance de los planes regionales de
// marketing (entregables, próximos pasos, tracker). Tampoco es un pilar: es
// información de gestión del servicio, no métricas de plataforma.
export const PLANS_NAV = {
  id: 'plans',
  label: 'Planes',
  icon: ClipboardCheck,
  ready: true,
};

// Entradas de la nav que no son pilares (van después, separadas con una línea).
export const EXTRA_NAV = [CLIENTS_NAV, PLANS_NAV];

// Etiqueta visible de una entrada de la nav (pilar, clientes o planes).
export function navLabel(id) {
  return PILAR_BY_ID[id]?.label ?? EXTRA_NAV.find((n) => n.id === id)?.label ?? id;
}
