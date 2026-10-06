// ════════════════════════════════════════════════════════════════
//  CRM — qué entidades de HubSpot («PCU Entity») corresponden a cada
//  cuenta de pilar. El mapeo por CLIENTE vive en constants/clients.js
//  (`crmEntities`); este archivo cubre las cuentas de cada pilar, para la
//  card «Deals generados» de Indicadores clave.
//
//  Una cuenta sin entidad mapeada no muestra la card (no se infiere):
//  · Social `cun` (Control Union Norte), `ps` (Peterson global), `tlr`, `bel`
//  · Email / Webinars `cug` (Control Union Global): los deals de los
//    webinars globales quedan en la entidad del dueño del webinar
//    (Control Union Alemania), que no corresponde a ninguna cuenta.
//  Criterios en docs/DECISIONES.md §14.
// ════════════════════════════════════════════════════════════════

// Control Union Estados Unidos = Certifications (537) + Inspections (537i).
// «Control Union Canadá (Solutions)» (583s) no se asigna: sus deals son
// servicios de Peterson Solutions bajo la entidad de CU Canadá, y las marcas
// no se mezclan (pendiente de validar con el equipo).
export const CU_US = ['537', '537i'];
export const CU_LATAM = ['538', '584', '848', '598', '536'];
export const CU_NA = [...CU_US, '583'];
export const PS_IBEROAM = ['765', '592', '442', '849', '880'];
export const PS_AMERICAS = ['592', '442', '767', '849', '880'];

// Países de las cuentas LinkedIn segmentadas → entidades.
const COUNTRY_ENTITY = { ar: ['538'], br: ['584'], cl: ['848'], mx: ['598'], pe: ['536'], us: CU_US, ca: ['583'] };

export const CRM_ACCOUNT_ENTITIES = {
  social: {
    cue: ['518'],
    cup: ['522'],
    cul: CU_LATAM,
    cuna: CU_NA,
    pia: ['765', ...PS_AMERICAS],
  },
  paid: { es: ['518'], pt: ['522'], cuc: ['583'], cuus: CU_US, cuar: ['538'], psar: ['592'] },
  website: {
    cues: ['518'],
    cupt: ['522'],
    cua: ['538'],
    cubr: ['584'],
    cucl: ['848'],
    cumx: ['598'],
    cupe: ['536'],
    cunam: CU_NA,
    cuus: CU_US,
    cuca: ['583'],
    psib: ['765'],
    psam: PS_AMERICAS,
  },
  email: {
    // Campaña conjunta CU + Peterson Solutions Latinoamérica: las dos marcas.
    cups: [...CU_LATAM, '592', '442', '849'],
    psi: PS_IBEROAM,
    cuus: CU_US,
  },
};

// Entidades de una cuenta de pilar (con el país, si la cuenta segmenta).
export function accountEntities(pilar, account, country = null) {
  if (country && COUNTRY_ENTITY[country]) return COUNTRY_ENTITY[country];
  return CRM_ACCOUNT_ENTITIES[pilar]?.[account] ?? null;
}
