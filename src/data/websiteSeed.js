// ════════════════════════════════════════════════════════════════
//  SEED — Pilar Website · GA (tráfico/sitio) + GSC (SEO). Trimestral.
//  · CU Argentina: Q1 (capturas originales) + Q2 2026.
//  · Resto de cuentas: Q2 2026 (de los PDFs de reporte por cuenta).
//  · Peterson Americas / Iberia: solo Website (sin datos SEO en el período).
//  Datos reales tomados de los reportes. Seed en código (sin base de datos).
// ════════════════════════════════════════════════════════════════

export const WEBSITE_CLIENTS = [
  { id: 'cua', name: 'Control Union Argentina' },
  { id: 'cubr', name: 'Control Union Brasil' },
  { id: 'cucl', name: 'Control Union Chile' },
  { id: 'cumx', name: 'Control Union México' },
  { id: 'cunam', name: 'Control Union North America' },
  { id: 'cupe', name: 'Control Union Perú' },
  { id: 'cupt', name: 'Control Union Portugal' },
  { id: 'cues', name: 'Control Union España' },
  { id: 'psam', name: 'Peterson Solutions Americas' },
  { id: 'psib', name: 'Peterson Solutions Iberia' },
];

const lp = (url, views) => ({ url, views });
const kw = (query, clicks) => ({ query, clicks });

export const WEBSITE_DB = {
  cua: {
    name: 'Control Union Argentina',
    handle: '@controlunionargentina',
    periods: {
      'q1-2026': {
        site: {
          singleTraffic: 514,
          totalTraffic: 856,
          impressions: 1978,
          conversions: 207,
          topLandingPages: [
            lp('https://argentina.controlunion.com/', 449),
            lp('https://argentina.controlunion.com/vacantes/', 223),
            lp('https://argentina.controlunion.com/nosotros/', 166),
          ],
        },
        seo: {
          averagePosition: 7.63,
          impressions: 19530,
          totalClicks: 583,
          topKeywords: [kw('control union', 154), kw('control union argentina', 90), kw('control union tucuman', 13)],
        },
      },
      'q2-2026': {
        site: {
          singleTraffic: 2315,
          totalTraffic: 3319,
          impressions: 6179,
          conversions: 437,
          topLandingPages: [
            lp('https://argentina.controlunion.com/', 1145),
            lp('https://argentina.controlunion.com/nosotros/', 183),
            lp('https://argentina.controlunion.com/vacantes/', 163),
          ],
        },
        seo: {
          averagePosition: 8.4,
          impressions: 71058,
          totalClicks: 1935,
          topKeywords: [kw('control union', 466), kw('control union argentina', 228), kw('visec', 44)],
        },
      },
    },
  },

  cubr: {
    name: 'Control Union Brasil',
    handle: '@controlunionbrazil',
    periods: {
      'q2-2026': {
        site: {
          singleTraffic: 1732,
          totalTraffic: 2279,
          impressions: 4177,
          conversions: 325,
          topLandingPages: [
            lp('https://brasil.controlunion.com/', 995),
            lp('https://brasil.controlunion.com/vagas/', 192),
            lp('https://brasil.controlunion.com/programas-de-certificacao/', 135),
          ],
        },
        seo: {
          averagePosition: 10.3,
          impressions: 61494,
          totalClicks: 1634,
          topKeywords: [kw('control union', 534), kw('controlunion', 104), kw('control union brasil', 77)],
        },
      },
    },
  },

  cucl: {
    name: 'Control Union Chile',
    handle: '@controlunionchile',
    periods: {
      'q2-2026': {
        site: {
          singleTraffic: 893,
          totalTraffic: 1076,
          impressions: 1772,
          conversions: 75,
          topLandingPages: [
            lp('https://chile.controlunion.com/', 352),
            lp('https://chile.controlunion.com/programa-de-certificacion/norma-tecnica-chile-nch-2861-haccp/', 62),
            lp('https://chile.controlunion.com/programa-de-certificacion/bap-best-aquaculture-practice/', 41),
          ],
        },
        seo: {
          averagePosition: 10.5,
          impressions: 40663,
          totalClicks: 636,
          topKeywords: [kw('control union', 86), kw('control union chile', 77), kw('grasp', 11)],
        },
      },
    },
  },

  cumx: {
    name: 'Control Union México',
    handle: '@controlunionmexico',
    periods: {
      'q2-2026': {
        site: {
          singleTraffic: 1158,
          totalTraffic: 1504,
          impressions: 2820,
          conversions: 162,
          topLandingPages: [
            lp('https://mexico.controlunion.com/', 474),
            lp('https://mexico.controlunion.com/contacto-mexico/', 71),
            lp('https://mexico.controlunion.com/vacantes/', 69),
          ],
        },
        seo: {
          averagePosition: 10.1,
          impressions: 58290,
          totalClicks: 799,
          topKeywords: [kw('control union', 121), kw('control union mexico', 98), kw('primusgfs', 9)],
        },
      },
    },
  },

  cunam: {
    name: 'Control Union North America',
    handle: '@controlunionnorthamerica',
    periods: {
      'q2-2026': {
        site: {
          singleTraffic: 1561,
          totalTraffic: 2138,
          impressions: 4533,
          conversions: 134,
          topLandingPages: [
            lp('https://northamerica.controlunion.com/', 949),
            lp('https://northamerica.controlunion.com/certification-program/grs-global-recycled-standard/', 140),
            lp('https://northamerica.controlunion.com/vacancies/', 111),
          ],
        },
        seo: {
          averagePosition: 10.8,
          impressions: 36018,
          totalClicks: 345,
          topKeywords: [kw('control union usa', 43), kw('control union canada', 29), kw('control union', 28)],
        },
      },
    },
  },

  cupe: {
    name: 'Control Union Perú',
    handle: '@controlunionperu',
    periods: {
      'q2-2026': {
        site: {
          singleTraffic: 3554,
          totalTraffic: 5193,
          impressions: 9361,
          conversions: 249,
          topLandingPages: [
            lp('http://peru.controlunion.com/', 1856),
            lp('https://peru.controlunion.com/service/certificaciones/', 199),
            lp('https://peru.controlunion.com/programas-de-certificacion/', 195),
          ],
        },
        seo: {
          averagePosition: 8,
          impressions: 403000, // reportado como "403K" (redondeado a miles)
          totalClicks: 5110,
          topKeywords: [kw('control union', 318), kw('control union peru', 177), kw('control union services', 155)],
        },
      },
    },
  },

  cupt: {
    name: 'Control Union Portugal',
    handle: '@controlunionportugal',
    periods: {
      'q2-2026': {
        site: {
          singleTraffic: 972,
          totalTraffic: 1107,
          impressions: 1709,
          conversions: 69,
          topLandingPages: [
            lp('https://portugal.controlunion.com/', 199),
            lp('https://portugal.controlunion.com/certificacoes/', 31),
            lp('https://portugal.controlunion.com/vagas/', 24),
          ],
        },
        seo: {
          averagePosition: 13.2,
          impressions: 52571,
          totalClicks: 736,
          topKeywords: [kw('control union', 165), kw('control union portugal', 62), kw('controlunion', 29)],
        },
      },
    },
  },

  cues: {
    name: 'Control Union España',
    handle: '@controlunionspain',
    periods: {
      'q2-2026': {
        site: {
          singleTraffic: 1600,
          totalTraffic: 2100,
          impressions: 3637,
          conversions: 90,
          topLandingPages: [
            lp('https://espana.controlunion.com/', 368),
            lp('https://espana.controlunion.com/programa-de-certificacion/iso-9001/', 148),
            lp('https://espana.controlunion.com/programas-de-certificacion/', 86),
          ],
        },
        seo: {
          averagePosition: 11.1,
          impressions: 193000, // reportado como "193K" (redondeado a miles)
          totalClicks: 1770,
          topKeywords: [kw('control union', 238), kw('control union españa', 93), kw('controlunion', 46)],
        },
      },
    },
  },

  psam: {
    name: 'Peterson Solutions Americas',
    handle: '@petersonsolutionsamericas',
    periods: {
      'q2-2026': {
        site: {
          singleTraffic: 442,
          totalTraffic: 723,
          impressions: 1767,
          conversions: 39,
          topLandingPages: [
            lp('https://americas.peterson-solutions.com/', 200),
            lp('https://americas.peterson-solutions.com/pt-br/', 138),
            lp('https://americas.peterson-solutions.com/en/industry/mining/', 39),
          ],
        },
        // Sin datos SEO en el período.
      },
    },
  },

  psib: {
    name: 'Peterson Solutions Iberia',
    handle: '@petersonsolutionsiberia',
    periods: {
      'q2-2026': {
        site: {
          singleTraffic: 286,
          totalTraffic: 518,
          impressions: 1109,
          conversions: 19,
          topLandingPages: [
            lp('https://iberia.peterson-solutions.com/', 215),
            lp('https://iberia.peterson-solutions.com/en/eudr/', 73),
            lp('https://iberia.peterson-solutions.com/eudr/', 36),
          ],
        },
        // Sin datos SEO en el período.
      },
    },
  },
};
