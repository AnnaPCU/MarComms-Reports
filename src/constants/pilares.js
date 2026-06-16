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
    sources: ['Livestorm'],
    icon: Video,
    ready: false,
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
