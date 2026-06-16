// ════════════════════════════════════════════════════════════════
//  CLASIFICADOR ESG — portado del dashboard original
//  Clasifica una publicación por pilar ESG según su título.
//  E = Ambiental · S = Social · G = Gobernanza · X = Otro
// ════════════════════════════════════════════════════════════════

const E_KEYS = [
  'sosteni', 'iso 14', 'ghg', 'carbon', 'emis', 'rspo', 'eudr', 'orgáni',
  'organic', 'biomass', 'bioenerg', 'medioambi', 'biofuel', 'pyrogenic',
  'biocarbon', 'deforesta', 'trazab', 'residuos', 'packaging',
];
const G_KEYS = [
  'iso 9001', 'iso 27001', 'iso 45001', 'iso 22000', 'iso tc', 'compliance',
  'csrd', 'regulac', 'regulat', 'eubr', 'passport', 'battery', 'financial',
  'govern', 'audit', 'standard', 'framework', 'reporting',
];
const S_KEYS = [
  'social', 'comunidad', 'trabajador', 'laboral', 'hiring', 'empleo',
  'webinar', 'evento', 'feria', 'congress', 'conference', 'convenci',
  'banquet', 'sugar', 'festival', 'networking',
];

export function classifyESG(title) {
  const s = (title || '').toLowerCase();
  if (E_KEYS.some((k) => s.includes(k))) return 'E';
  if (G_KEYS.some((k) => s.includes(k))) return 'G';
  if (S_KEYS.some((k) => s.includes(k))) return 'S';
  return 'X';
}

export const ESG_LABEL = {
  E: 'E — Ambiental',
  S: 'S — Social',
  G: 'G — Gobernanza',
  X: 'Otro',
};

export const ESG_NAME = {
  E: 'Ambiental',
  S: 'Social',
  G: 'Gobernanza',
  X: 'General',
};

// Clases Tailwind por pilar (chips de la tabla de posts).
export const ESG_CHIP = {
  E: 'bg-cu-cyan/10 text-[#1372a5] border border-cu-cyan/20',
  S: 'bg-cu-dblue/10 text-cu-dblue border border-cu-dblue/20',
  G: 'bg-cu-grey/10 text-[#3e5a5b] border border-cu-grey/30',
  X: 'bg-cu-bg text-cu-grey border border-cu-border',
};
