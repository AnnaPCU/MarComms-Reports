// ════════════════════════════════════════════════════════════════
//  CLIENTES — unidad de negocio + país/región, cruzando los pilares.
//
//  Las cuentas de cada pilar tienen ids propios (Social `cue`, Paid `es`,
//  Website `cues`…) y nunca se compartieron entre pilares. Este mapa es la
//  única fuente de verdad de qué cuenta de cada pilar corresponde a cada
//  cliente. Un cliente solo tiene vista propia si se le trabaja MÁS DE UN
//  pilar con datos (`clientService.listClients()` aplica esa regla): para
//  un solo pilar alcanza con la vista del pilar.
//
//  Cada referencia a un pilar puede acotar la cuenta:
//   · `country`: segmento por país dentro de una cuenta LinkedIn regional
//     (CU Latinoamérica → Argentina, CU North America → USA…).
//   · `note` / `noteEn`: alcance distinto al del cliente (cuenta regional,
//     campaña conjunta, solo GEO de Meta). Se muestra en la vista, para
//     no hacer pasar un dato regional por uno del país.
//
//  `crmEntities`: entidades de HubSpot («PCU Entity») cuyos deals se
//  muestran en el bloque CRM del cliente (vacío = sin entidad asignable).
// ════════════════════════════════════════════════════════════════
import { CU_US, CU_LATAM, CU_NA, PS_AMERICAS, PS_IBEROAM } from '@/constants/crm';

export const BUSINESS_UNITS = {
  cu: { name: 'Control Union', brand: 'cu' },
  ps: { name: 'Peterson Solutions', brand: 'peterson' },
};

export const CLIENTS = [
  // ── Control Union · Iberia ──
  {
    id: 'cu-es',
    crmEntities: ['518'],
    name: 'Control Union España',
    unit: 'cu',
    region: 'Iberia',
    pillars: { social: { account: 'cue' }, paid: { account: 'es' }, website: { account: 'cues' } },
  },
  {
    id: 'cu-pt',
    crmEntities: ['522'],
    name: 'Control Union Portugal',
    unit: 'cu',
    region: 'Iberia',
    pillars: { social: { account: 'cup' }, paid: { account: 'pt' }, website: { account: 'cupt' } },
  },

  // ── Control Union · Latinoamérica ──
  {
    id: 'cu-latam',
    crmEntities: CU_LATAM,
    name: 'Control Union Latinoamérica',
    unit: 'cu',
    region: 'Latinoamérica',
    pillars: {
      social: { account: 'cul' },
      email: {
        account: 'cups',
        note: 'Campaña conjunta CU + Peterson Solutions Latinoamérica',
        noteEn: 'Joint CU + Peterson Solutions Latin America campaign',
      },
      webinars: { account: 'cu' },
    },
  },
  {
    id: 'cu-global',
    crmEntities: [],
    name: 'Control Union Global',
    unit: 'cu',
    region: 'Global (Américas + Europa)',
    pillars: {
      email: { account: 'cug' },
      webinars: { account: 'cug', note: 'Webinars en inglés con base de contactos de Américas y Europa', noteEn: 'English-language webinars with an Americas + Europe contact base' },
    },
  },
  {
    id: 'cu-ar',
    crmEntities: ['538'],
    name: 'Control Union Argentina',
    unit: 'cu',
    region: 'Latinoamérica',
    pillars: {
      social: { account: 'cul', country: 'ar' },
      paid: { account: 'cuar', note: 'Solo campañas GEO de Meta Ads', noteEn: 'Meta Ads GEO campaigns only' },
      website: { account: 'cua' },
    },
  },
  {
    id: 'cu-br',
    crmEntities: ['584'],
    name: 'Control Union Brasil',
    unit: 'cu',
    region: 'Latinoamérica',
    pillars: { social: { account: 'cul', country: 'br' }, website: { account: 'cubr' } },
  },
  {
    id: 'cu-cl',
    crmEntities: ['848'],
    name: 'Control Union Chile',
    unit: 'cu',
    region: 'Latinoamérica',
    pillars: { social: { account: 'cul', country: 'cl' }, website: { account: 'cucl' } },
  },
  {
    id: 'cu-mx',
    crmEntities: ['598'],
    name: 'Control Union México',
    unit: 'cu',
    region: 'Latinoamérica',
    pillars: { social: { account: 'cul', country: 'mx' }, website: { account: 'cumx' } },
  },
  {
    id: 'cu-pe',
    crmEntities: ['536'],
    name: 'Control Union Perú',
    unit: 'cu',
    region: 'Latinoamérica',
    pillars: { social: { account: 'cul', country: 'pe' }, website: { account: 'cupe' } },
  },

  // ── Control Union · North America ──
  {
    id: 'cu-na',
    crmEntities: CU_NA,
    name: 'Control Union North America',
    unit: 'cu',
    region: 'North America',
    pillars: { social: { account: 'cuna' }, website: { account: 'cunam' } },
  },
  {
    id: 'cu-us',
    crmEntities: CU_US,
    name: 'Control Union Estados Unidos',
    unit: 'cu',
    region: 'North America',
    pillars: {
      social: { account: 'cuna', country: 'us' },
      paid: { account: 'cuus' },
      website: { account: 'cuus' },
      email: { account: 'cuus' },
    },
  },
  {
    id: 'cu-ca',
    crmEntities: ['583'],
    name: 'Control Union Canadá',
    unit: 'cu',
    region: 'North America',
    pillars: { social: { account: 'cuna', country: 'ca' }, paid: { account: 'cuc' }, website: { account: 'cuca' } },
  },

  // ── Peterson Solutions ──
  {
    id: 'ps-ib',
    crmEntities: ['765'],
    name: 'Peterson Solutions Iberia',
    unit: 'ps',
    region: 'Iberia',
    pillars: {
      social: {
        account: 'pia',
        note: 'Cuenta regional Iberia & Americas (no se puede separar por país)',
        noteEn: 'Regional Iberia & Americas account (cannot be split by country)',
      },
      website: { account: 'psib' },
    },
  },
  {
    id: 'ps-am',
    crmEntities: PS_AMERICAS,
    name: 'Peterson Solutions Americas',
    unit: 'ps',
    region: 'Americas',
    pillars: {
      social: {
        account: 'pia',
        note: 'Cuenta regional Iberia & Americas (no se puede separar por país)',
        noteEn: 'Regional Iberia & Americas account (cannot be split by country)',
      },
      paid: { account: 'psar', note: 'Cuenta de Google Ads de Peterson Solutions Argentina', noteEn: 'Peterson Solutions Argentina Google Ads account' },
      website: { account: 'psam' },
    },
  },
  {
    id: 'ps-iberoam',
    crmEntities: PS_IBEROAM,
    name: 'Peterson Solutions Iberoamérica',
    unit: 'ps',
    region: 'Iberoamérica',
    pillars: {
      email: { account: 'psi' },
      webinars: { account: 'psi', note: 'Webinars en español con la base de contactos de Iberia y Américas', noteEn: 'Spanish-language webinars with the Iberia + Americas contact base' },
    },
  },
];

export const CLIENT_BY_ID = Object.fromEntries(CLIENTS.map((c) => [c.id, c]));

// Orden fijo en el que se muestran los pilares dentro de un cliente.
export const CLIENT_PILLAR_ORDER = ['social', 'paid', 'website', 'email', 'webinars'];
