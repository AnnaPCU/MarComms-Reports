// ════════════════════════════════════════════════════════════════
//  SEED — Pilar Website · GA (tráfico/sitio) + GSC (SEO). Trimestral.
//  · CU Argentina: Q1 (capturas originales) + Q2 2026.
//  · Resto de cuentas: Q1 y Q2 2026 (de los PDFs de reporte por cuenta).
//  · Q3 2026: de los reportes trimestrales en .md (GA4 + Search Console,
//    extraídos el 9/10/2026; archivados en metricas/website/_procesados/2026-Q3/),
//    convertidos con scripts/website/md_to_seed.py. CU Estados Unidos y CU
//    Canadá no vienen por separado en Q3: solo CU North America.
//  · Peterson Americas / Iberia: sin datos SEO en Q1 y Q2; desde Q3 sí.
//  Datos reales tomados de los reportes. Seed en código (sin base de datos).
// ════════════════════════════════════════════════════════════════

export const WEBSITE_CLIENTS = [
  { id: 'cua', name: 'Control Union Argentina' },
  { id: 'cubr', name: 'Control Union Brasil' },
  { id: 'cucl', name: 'Control Union Chile' },
  { id: 'cumx', name: 'Control Union México' },
  { id: 'cunam', name: 'Control Union North America' },
  { id: 'cuca', name: 'Control Union Canadá' },
  { id: 'cuus', name: 'Control Union Estados Unidos' },
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

  cuca: {
    name: 'Control Union Canadá',
    handle: '@controlunionnorthamerica',
    periods: {
      'q2-2026': {
        site: {
          singleTraffic: 309,
          totalTraffic: 449,
          impressions: 965,
          conversions: 14,
          topLandingPages: [
            lp('https://northamerica.controlunion.com/', 143),
            lp('https://northamerica.controlunion.com/certification-program/grs-global-recycled-standard/', 132),
            lp('https://northamerica.controlunion.com/industry/forestry/', 43),
          ],
        },
        seo: {
          averagePosition: 7,
          impressions: 2374,
          totalClicks: 105,
          topKeywords: [kw('control union canada', 21), kw('control union', 13), kw('cumcs', 3)],
        },
      },
    },
  },

  cuus: {
    name: 'Control Union Estados Unidos',
    handle: '@controlunionnorthamerica',
    periods: {
      'q2-2026': {
        site: {
          singleTraffic: 614,
          totalTraffic: 732,
          impressions: 1400,
          conversions: 40,
          topLandingPages: [
            lp('https://northamerica.controlunion.com/', 395),
            lp('https://northamerica.controlunion.com/vacancies/', 77),
            lp('https://northamerica.controlunion.com/service/certification/', 42),
          ],
        },
        seo: {
          averagePosition: 12.7,
          impressions: 16023,
          totalClicks: 105,
          topKeywords: [kw('control union usa', 19), kw('control union', 13), kw('primusgfs', 1)],
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

// ── Q1 2026 (de los reportes por cuenta) ───────────────────────────
// CU Argentina ya tiene Q1 arriba. Acá se agrega Q1 al resto de las cuentas.
// PS Americas / PS Iberia: solo Website (sin SEO en el período).
const WEBSITE_Q1_2026 = {
  cubr: {
    site: {
      singleTraffic: 564, totalTraffic: 869, impressions: 1841, conversions: 186,
      topLandingPages: [
        lp('https://brasil.controlunion.com/', 391),
        lp('https://brasil.controlunion.com/vagas/', 148),
        lp('https://brasil.controlunion.com/programas-de-certificacao/', 132),
      ],
    },
    seo: {
      averagePosition: 9.0, impressions: 23533, totalClicks: 521,
      topKeywords: [kw('control union', 148), kw('control union brasil', 36), kw('controlunion', 30)],
    },
  },
  cucl: {
    site: {
      singleTraffic: 149, totalTraffic: 225, impressions: 516, conversions: 29,
      topLandingPages: [
        lp('https://chile.controlunion.com/', 90),
        lp('https://chile.controlunion.com/service/certificaciones/', 39),
        lp('https://chile.controlunion.com/programas-de-certificacion/', 38),
      ],
    },
    seo: {
      averagePosition: 10.24, impressions: 32682, totalClicks: 476,
      topKeywords: [kw('control union chile', 67), kw('control union', 45), kw('bap', 14)],
    },
  },
  cumx: {
    site: {
      singleTraffic: 224, totalTraffic: 355, impressions: 910, conversions: 71,
      topLandingPages: [
        lp('https://mexico.controlunion.com/', 152),
        lp('https://mexico.controlunion.com/service/certificaciones/', 83),
        lp('https://mexico.controlunion.com/contacto/', 52),
      ],
    },
    seo: {
      averagePosition: 13.29, impressions: 45605, totalClicks: 1024,
      topKeywords: [kw('control union', 124), kw('control union mexico', 58), kw('smeta 7.0 pdf', 16)],
    },
  },
  cunam: {
    site: {
      singleTraffic: 186, totalTraffic: 303, impressions: 624, conversions: 45,
      topLandingPages: [
        lp('https://northamerica.controlunion.com/', 185),
        lp('https://northamerica.controlunion.com/certification-programs', 85),
        lp('https://northamerica.controlunion.com/about-us', 49),
      ],
    },
    seo: {
      averagePosition: 9.4, impressions: 10192, totalClicks: 93,
      topKeywords: [kw('control union usa', 10), kw('control union canada', 7), kw('control union', 4)],
    },
  },
  cupe: {
    site: {
      singleTraffic: 873, totalTraffic: 1622, impressions: 3457, conversions: 240,
      topLandingPages: [
        lp('http://peru.controlunion.com/', 643),
        lp('https://peru.controlunion.com/programas-de-certificacion/', 264),
        lp('https://peru.controlunion.com/service/certificaciones/', 210),
      ],
    },
    seo: {
      averagePosition: 6.93, impressions: 125906, totalClicks: 2082,
      topKeywords: [kw('control union', 95), kw('control union services', 65), kw('control union peru', 51)],
    },
  },
  cupt: {
    site: {
      singleTraffic: 368, totalTraffic: 532, impressions: 1418, conversions: 81,
      topLandingPages: [
        lp('https://portugal.controlunion.com/esquemas-de-certificacao/', 199),
        lp('https://portugal.controlunion.com/', 183),
        lp('https://portugal.controlunion.com/certificacoes/', 96),
      ],
    },
    seo: {
      averagePosition: 10.4, impressions: 21042, totalClicks: 330,
      topKeywords: [kw('control union', 60), kw('control union portugal', 28), kw('controlunion', 14)],
    },
  },
  cues: {
    site: {
      singleTraffic: 861, totalTraffic: 1216, impressions: 2618, conversions: 106,
      topLandingPages: [
        lp('https://espana.controlunion.com/', 460),
        lp('https://espana.controlunion.com/certificaciones', 169),
        lp('https://espana.controlunion.com/programas-de-certificacion/', 157),
      ],
    },
    seo: {
      averagePosition: 10.4, impressions: 66918, totalClicks: 579,
      topKeywords: [kw('control union', 55), kw('control union españa', 28), kw('iso 21401', 18)],
    },
  },
  psam: {
    site: {
      singleTraffic: 143, totalTraffic: 265, impressions: 624, conversions: 15,
      topLandingPages: [
        lp('https://americas.peterson-solutions.com/', 223),
        lp('https://americas.peterson-solutions.com/home/sobre-peterson/', 58),
        lp('https://americas.peterson-solutions.com/vacantes/', 29),
      ],
    },
    // Sin datos SEO en el período.
  },
  psib: {
    site: {
      singleTraffic: 115, totalTraffic: 199, impressions: 535, conversions: 19,
      topLandingPages: [
        lp('https://iberia.peterson-solutions.com/', 198),
        lp('https://iberia.peterson-solutions.com/contacto/', 34),
        lp('https://iberia.peterson-solutions.com/vacantes/', 34),
      ],
    },
    // Sin datos SEO en el período.
  },
};

// Mergea Q1 dentro de periods de cada cuenta (CU Argentina ya lo tiene arriba).
for (const [id, data] of Object.entries(WEBSITE_Q1_2026)) {
  if (WEBSITE_DB[id]) WEBSITE_DB[id].periods['q1-2026'] = data;
}

// ── Q3 2026 (reportes trimestrales en .md: GA4 + Search Console) ────
// Generado con scripts/website/md_to_seed.py, que valida CTR, embudo y la
// suma de conversiones (click_email + form_submit) contra el archivo.
// «Peterson Solutions South America» del reporte = sitio americas.peterson-solutions.com
// = cuenta «Peterson Solutions Americas» (psam).
const WEBSITE_Q3_2026 = {
  // Control Union Argentina
  cua: {
    site: {
      singleTraffic: 2920, totalTraffic: 4098, impressions: 8566, conversions: 218,
      conversionsBreakdown: { clickEmail: 153, formSubmit: 65 },
      topLandingPages: [
        lp("https://argentina.controlunion.com/", 1545),
        lp("https://argentina.controlunion.com/nosotros/", 552),
        lp("https://argentina.controlunion.com/vacantes/", 512),
        lp("https://argentina.controlunion.com/programas-de-certificacion/", 429),
        lp("https://argentina.controlunion.com/contacto/", 310),
      ],
    },
    seo: {
      averagePosition: 9.11, impressions: 76744, totalClicks: 1855,
      topKeywords: [kw("control union", 489), kw("control union argentina", 181), kw("control union argentina s.a", 30), kw("control union tucuman", 29), kw("visec", 26)],
    },
  },
  // Control Union Brasil
  cubr: {
    site: {
      singleTraffic: 3040, totalTraffic: 3793, impressions: 7258, conversions: 297,
      conversionsBreakdown: { clickEmail: 234, formSubmit: 63 },
      topLandingPages: [
        lp("https://brasil.controlunion.com/", 2288),
        lp("https://brasil.controlunion.com/contato/", 576),
        lp("https://brasil.controlunion.com/vagas/", 496),
        lp("https://brasil.controlunion.com/programas-de-certificacao/", 413),
        lp("https://brasil.controlunion.com/quem-somos/", 352),
      ],
    },
    seo: {
      averagePosition: 10.49, impressions: 62175, totalClicks: 1874,
      topKeywords: [kw("control union", 689), kw("controlunion", 117), kw("control union brasil", 77), kw("control union latinoamérica", 52), kw("control union warrants ltda", 50)],
    },
  },
  // Control Union Chile
  cucl: {
    site: {
      singleTraffic: 957, totalTraffic: 1197, impressions: 2628, conversions: 104,
      conversionsBreakdown: { clickEmail: 71, formSubmit: 33 },
      topLandingPages: [
        lp("https://chile.controlunion.com/", 490),
        lp("https://chile.controlunion.com/programas-de-certificacion/", 209),
        lp("https://chile.controlunion.com/contacto/", 122),
        lp("https://chile.controlunion.com/service/certificaciones/", 114),
        lp("https://chile.controlunion.com/nosotros/", 87),
      ],
    },
    seo: {
      averagePosition: 11.3, impressions: 29122, totalClicks: 463,
      topKeywords: [kw("control union", 69), kw("control union chile", 51), kw("grasp", 11), kw("bap", 10), kw("controlunion", 8)],
    },
  },
  // Control Union España
  cues: {
    site: {
      singleTraffic: 2370, totalTraffic: 2798, impressions: 5961, conversions: 69,
      conversionsBreakdown: { clickEmail: 28, formSubmit: 41 },
      topLandingPages: [
        lp("https://espana.controlunion.com/", 518),
        lp("https://espana.controlunion.com/programa-de-certificacion/certification-program-iso-27001-certification/", 393),
        lp("https://espana.controlunion.com/programas-de-certificacion/", 270),
        lp("https://espana.controlunion.com/programa-de-certificacion/iso-9001/", 237),
        lp("https://espana.controlunion.com/contacto/", 174),
      ],
    },
    seo: {
      averagePosition: 14.11, impressions: 171269, totalClicks: 1393,
      topKeywords: [kw("control union", 221), kw("control union españa", 48), kw("controlunion", 39), kw("iso 21401", 22), kw("sure", 11)],
    },
  },
  // Control Union México
  cumx: {
    site: {
      singleTraffic: 2092, totalTraffic: 2493, impressions: 4445, conversions: 121,
      conversionsBreakdown: { clickEmail: 95, formSubmit: 26 },
      topLandingPages: [
        lp("https://mexico.controlunion.com/", 1379),
        lp("https://mexico.controlunion.com/contacto-mexico/", 284),
        lp("https://mexico.controlunion.com/programas-de-certificacion/", 221),
        lp("https://mexico.controlunion.com/service/certificaciones/", 154),
        lp("https://mexico.controlunion.com/nosotros/", 141),
      ],
    },
    seo: {
      averagePosition: 11.46, impressions: 59107, totalClicks: 738,
      topKeywords: [kw("control union", 114), kw("control union mexico", 63), kw("controlunion", 8), kw("organico mexico", 8), kw("grs", 7)],
    },
  },
  // Control Union North America
  cunam: {
    site: {
      singleTraffic: 2475, totalTraffic: 3200, impressions: 6388, conversions: 180,
      conversionsBreakdown: { clickEmail: 78, formSubmit: 102 },
      topLandingPages: [
        lp("https://northamerica.controlunion.com/", 1474),
        lp("https://northamerica.controlunion.com/certification-programs/", 600),
        lp("https://northamerica.controlunion.com/vacancies/", 296),
        lp("https://northamerica.controlunion.com/contact/", 289),
        lp("https://northamerica.controlunion.com/service/certification/", 218),
      ],
    },
    seo: {
      averagePosition: 14.63, impressions: 30970, totalClicks: 313,
      topKeywords: [kw("control union canada", 37), kw("control union usa", 29), kw("control union", 17), kw("temo", 2), kw("control union job vacancy", 1)],
    },
  },
  // Control Union Perú
  cupe: {
    site: {
      singleTraffic: 4080, totalTraffic: 6009, impressions: 11431, conversions: 265,
      conversionsBreakdown: { clickEmail: 155, formSubmit: 110 },
      topLandingPages: [
        lp("https://peru.controlunion.com/", 2585),
        lp("https://peru.controlunion.com/programas-de-certificacion/", 572),
        lp("https://peru.controlunion.com/service/certificaciones/", 466),
        lp("https://peru.controlunion.com/vacantes/", 440),
        lp("https://peru.controlunion.com/nosotros/", 406),
      ],
    },
    seo: {
      averagePosition: 7.83, impressions: 274322, totalClicks: 3993,
      topKeywords: [kw("control union", 393), kw("control union peru", 182), kw("control union services", 175), kw("control union services s.a.c", 43), kw("smeta 7.0 standard pdf", 41)],
    },
  },
  // Control Union Portugal
  cupt: {
    site: {
      singleTraffic: 1525, totalTraffic: 1686, impressions: 3456, conversions: 91,
      conversionsBreakdown: { clickEmail: 54, formSubmit: 37 },
      topLandingPages: [
        lp("https://portugal.controlunion.com/", 663),
        lp("https://portugal.controlunion.com/esquemas-de-certificacao/", 156),
        lp("https://portugal.controlunion.com/contacto/", 132),
        lp("https://portugal.controlunion.com/certificacoes/", 89),
        lp("https://portugal.controlunion.com/quem-somos/", 66),
      ],
    },
    seo: {
      averagePosition: 14.4, impressions: 46940, totalClicks: 692,
      topKeywords: [kw("control union", 144), kw("control union portugal", 58), kw("controlunion", 28), kw("grs", 28), kw("gots", 8)],
    },
  },
  // Peterson Solutions South America
  psam: {
    site: {
      singleTraffic: 1421, totalTraffic: 1861, impressions: 3414, conversions: 27,
      conversionsBreakdown: { clickEmail: 0, formSubmit: 27 },
      topLandingPages: [
        lp("https://americas.peterson-solutions.com/", 368),
        lp("https://americas.peterson-solutions.com/service/sostenibilidad-en-la-cadena-de-suministro/agricultura-regenerativa/", 301),
        lp("https://americas.peterson-solutions.com/pt-br/", 246),
        lp("https://americas.peterson-solutions.com/en/privacy-policy/", 194),
        lp("https://americas.peterson-solutions.com/service/estrategia-y-gestion-de-sostenibilidad/gei-y-servicios-medioambientales/", 127),
      ],
    },
    seo: {
      averagePosition: 10.06, impressions: 26163, totalClicks: 486,
      topKeywords: [kw("peterson solutions", 116), kw("peterson solutions brasil", 31), kw("peterson", 15), kw("peterson projects and solutions", 3), kw("peterson solution", 3)],
    },
  },
  // Peterson Solutions Iberia
  psib: {
    site: {
      singleTraffic: 476, totalTraffic: 702, impressions: 1452, conversions: 24,
      conversionsBreakdown: { clickEmail: 0, formSubmit: 24 },
      topLandingPages: [
        lp("https://iberia.peterson-solutions.com/", 219),
        lp("https://iberia.peterson-solutions.com/service/estrategia-y-gestion-de-sostenibilidad/eu-green-consumer-directive-ecgt-compliance/", 57),
        lp("https://iberia.peterson-solutions.com/eudr/", 51),
        lp("https://iberia.peterson-solutions.com/packaging-and-packaging-waste-regulation-ppwr/", 51),
        lp("https://iberia.peterson-solutions.com/vacantes/", 49),
      ],
    },
    seo: {
      averagePosition: 10.53, impressions: 17478, totalClicks: 389,
      topKeywords: [kw("peterson solutions", 102), kw("peterson solutions iberia", 30), kw("one peterson", 4), kw("peterson's solution", 3), kw("ecgt", 2)],
    },
  },
};

for (const [id, data] of Object.entries(WEBSITE_Q3_2026)) {
  if (WEBSITE_DB[id]) WEBSITE_DB[id].periods['q3-2026'] = data;
}
