// ════════════════════════════════════════════════════════════════
//  MARCA CONTROL UNION — única fuente de verdad de colores/paleta
//  (refleja el manual de marca; ver CLAUDE.md)
// ════════════════════════════════════════════════════════════════

export const CU = {
  cyan: '#3eb2ed',
  dblue: '#1b1e42',
  grey: '#799495',
  dgrey: '#4f6566',
  bg: '#f0f4f5',
  border: '#d8e2e3',
  border2: '#eaf0f1',
};

// Paleta ordenada para charts (idéntica al dashboard original).
export const PAL = [
  '#3eb2ed',
  '#1b1e42',
  '#799495',
  '#6dc8f2',
  '#2d3a8a',
  '#9ab5b6',
  '#0088cc',
  '#4a5096',
];

export const TAGLINE = 'The Proof to Your Promise';

// ════════════════════════════════════════════════════════════════
//  TOOLTIP DE CHARTS — única fuente de verdad para Recharts.
//  Fondo dark blue + texto SIEMPRE blanco (Recharts por defecto pinta
//  el texto con el color de la serie, que sobre fondo oscuro puede
//  quedar ilegible). Usar SIEMPRE esto para garantizar contraste.
// ════════════════════════════════════════════════════════════════
export const CHART_TOOLTIP = {
  contentStyle: {
    backgroundColor: '#1b1e42',
    border: 'none',
    borderRadius: 6,
    padding: '8px 10px',
    fontSize: 11,
  },
  itemStyle: { color: '#ffffff' },
  labelStyle: { color: 'rgba(255,255,255,.72)', marginBottom: 2 },
};

// ════════════════════════════════════════════════════════════════
//  MARCA POR CUENTA — define qué logo va en el header según de quién
//  se estén mostrando las métricas. 'cu' | 'peterson' | null (sin logo).
//  Las cuentas conocidas tienen mapeo explícito; las nuevas (importadas)
//  caen al inferido por nombre.
// ════════════════════════════════════════════════════════════════
const BRAND_BY_ID = {
  // Social
  cul: 'cu', cue: 'cu', cup: 'cu', cun: 'cu', cuna: 'cu',
  ps: 'peterson', pia: 'peterson',
  tlr: null, bel: null, // TLR y Biomass no son CU ni Peterson → sin logo
  // Paid
  pt: 'cu', es: 'cu', cuc: 'cu', psar: 'peterson',
  // Website
  cua: 'cu', cubr: 'cu', cucl: 'cu', cumx: 'cu', cunam: 'cu', cupe: 'cu', cupt: 'cu', cues: 'cu',
  psam: 'peterson', psib: 'peterson',
};

export function brandOf(id, name = '') {
  if (id in BRAND_BY_ID) return BRAND_BY_ID[id];
  const s = name.toLowerCase();
  if (s.includes('peterson')) return 'peterson';
  if (s.includes('control union') || s.startsWith('cu ') || s === 'cu') return 'cu';
  return null;
}

export const BRAND_LOGOS = {
  cu: { src: '/logo-control-union.svg', alt: 'Control Union' },
  peterson: { src: '/logo-peterson-solutions.png', alt: 'Peterson Solutions' },
};
