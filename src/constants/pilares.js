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

// Etiqueta visible de una entrada de la nav (pilar o clientes).
export function navLabel(id) {
  return PILAR_BY_ID[id]?.label ?? (id === CLIENTS_NAV.id ? CLIENTS_NAV.label : id);
}
