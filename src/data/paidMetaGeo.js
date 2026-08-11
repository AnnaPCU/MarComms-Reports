// ════════════════════════════════════════════════════════════════
//  SEED — Paid Media · Meta Ads GEO (campaña corta por evento)
//  Congreso Aapresid 2026 — segmentación geográfica hiperlocal
//  (radio ~1 km alrededor del evento, según configuración declarada).
//
//  Fuente: exports diarios de Meta Ads Manager (3–7 Ago 2026):
//  · CU Argentina: nivel campaña, ARS (2 campañas: Tráfico/Typeform y
//    WhatsApp con objetivo de conversaciones iniciadas).
//  · PS Argentina: nivel conjunto de anuncios, USD (solo Typeform).
//  Entrega efectiva: 4–6 Ago (el 3 y el 7 no hubo impresiones; el 7 se
//  atribuyó 1 conversación de WhatsApp por la ventana de atribución).
//
//  Regla de honestidad: el export NO trae alcance único del período
//  (solo diario), ni funnel de Typeform/WhatsApp, ni breakdowns por
//  hora/edad/placement/creativo — la vista lo declara y no estima nada.
// ════════════════════════════════════════════════════════════════

export const META_GEO_PERIOD = { id: 'geo-aapresid-2026', label: 'GEO Aapresid · Ago 2026' };

export const META_GEO = {
  cuar: {
    'geo-aapresid-2026': {
      currency: 'ARS',
      event: 'Congreso Aapresid 2026',
      campaigns: [
        {
          id: 'tf',
          kind: 'typeform',
          name: 'CU ARG - Aapresid - GEO - Agosto 2026',
          budgetDaily: 50000,
          attribution: '7-day click · 1-day view · 1-day engaged-view',
          days: [
            { d: '4 Ago', spend: 11875.32, imp: 3343, reach: 2710, freq: 1.23, lc: 67, ulc: 57, out: 67 },
            { d: '5 Ago', spend: 27838.82, imp: 3290, reach: 1789, freq: 1.84, lc: 109, ulc: 90, out: 109 },
            { d: '6 Ago', spend: 9255.27, imp: 1328, reach: 760, freq: 1.75, lc: 54, ulc: 46, out: 54 },
          ],
          // Alcance único de TODO el vuelo (export sin desglose diario).
          periodReach: { reach: 4629, freq: 1.72 },
          platforms: [
            { p: 'Audience Network', reach: 650, imp: 1535, spend: 20321.61, lc: 168 },
            { p: 'Instagram', reach: 2337, imp: 4160, spend: 23415.43, lc: 44 },
            { p: 'Facebook', reach: 1641, imp: 2016, spend: 4686.43, lc: 16 },
            { p: 'Threads', reach: 243, imp: 250, spend: 545.94, lc: 3 },
          ],
          gender: [
            { g: 'male', reach: 2662, imp: 4901, spend: 27715.63, lc: 122 },
            { g: 'female', reach: 2004, imp: 3013, spend: 21054.1, lc: 109 },
            { g: 'unknown', reach: 29, imp: 47, spend: 199.68, lc: 0 },
          ],
          age: [
            { a: '25-34', reach: 1171, imp: 2041, spend: 8803.35, lc: 46 },
            { a: '35-44', reach: 1063, imp: 1863, spend: 11579.82, lc: 50 },
            { a: '45-54', reach: 883, imp: 1402, spend: 10705.27, lc: 52 },
            { a: '55-64', reach: 632, imp: 1135, spend: 8350.6, lc: 29 },
            { a: '65+', reach: 900, imp: 1520, spend: 9530.37, lc: 54 },
          ],
          // Desglose por hora del día (hora de la cuenta publicitaria),
          // todo el vuelo — suma exactamente los totales del período.
          hourly: [
            { h: 0, spend: 859.97, imp: 109, lc: 4 },
            { h: 1, spend: 189.02, imp: 35, lc: 1 },
            { h: 2, spend: 315.23, imp: 25, lc: 2 },
            { h: 3, spend: 34.57, imp: 9, lc: 0 },
            { h: 4, spend: 242.63, imp: 14, lc: 2 },
            { h: 5, spend: 150.43, imp: 11, lc: 0 },
            { h: 6, spend: 520.26, imp: 46, lc: 3 },
            { h: 7, spend: 527.96, imp: 68, lc: 2 },
            { h: 8, spend: 558.81, imp: 99, lc: 3 },
            { h: 9, spend: 1498.76, imp: 170, lc: 7 },
            { h: 10, spend: 4252.41, imp: 540, lc: 23 },
            { h: 11, spend: 5142.72, imp: 757, lc: 22 },
            { h: 12, spend: 4392.2, imp: 1139, lc: 24 },
            { h: 13, spend: 5202.58, imp: 1092, lc: 19 },
            { h: 14, spend: 3928.75, imp: 972, lc: 19 },
            { h: 15, spend: 2139.43, imp: 350, lc: 7 },
            { h: 16, spend: 1401.94, imp: 229, lc: 9 },
            { h: 17, spend: 1447.45, imp: 205, lc: 10 },
            { h: 18, spend: 1637.83, imp: 238, lc: 6 },
            { h: 19, spend: 4241.2, imp: 555, lc: 32 },
            { h: 20, spend: 1771.25, imp: 262, lc: 5 },
            { h: 21, spend: 3527.83, imp: 280, lc: 9 },
            { h: 22, spend: 1903.78, imp: 371, lc: 10 },
            { h: 23, spend: 3082.4, imp: 385, lc: 12 },
          ],
          ads: [
            { name: 'Anuncio Typeform 1 - Huella de carbono', spend: 2498.43, imp: 354, reach: 243, lc: 12 },
            { name: 'Anuncio Typeform 2 - Huella de carbono', spend: 6095.14, imp: 692, reach: 307, lc: 47 },
            { name: 'Anuncio Typeform 3 - Huella de carbono', spend: 3775.5, imp: 583, reach: 368, lc: 19 },
            { name: 'Anuncio Typeform 4 - Huella de carbono', spend: 9336.8, imp: 1595, reach: 1063, lc: 28 },
            { name: 'Anuncio Typeform 5 - Huella de carbono', spend: 1735.59, imp: 132, reach: 90, lc: 7 },
            { name: 'Anuncio Typeform 6 - Huella de carbono', spend: 982.76, imp: 189, reach: 139, lc: 8 },
            { name: 'Anuncio Typeform 1 - General', spend: 3824.75, imp: 752, reach: 631, lc: 18 },
            { name: 'Anuncio Typeform 2 - General', spend: 6415.85, imp: 1219, reach: 906, lc: 38 },
            { name: 'Anuncio Typeform 3 - General', spend: 1881.64, imp: 408, reach: 361, lc: 5 },
            { name: 'Anuncio Typeform 4 - General', spend: 5000.36, imp: 646, reach: 503, lc: 13 },
            { name: 'Anuncio Typeform 5 - General', spend: 5671.86, imp: 1056, reach: 900, lc: 27 },
            { name: 'Anuncio Typeform 6 - General', spend: 1750.73, imp: 335, reach: 256, lc: 9 },
          ],
        },
        {
          id: 'wa',
          kind: 'whatsapp',
          name: 'CU ARG - Aapresid - GEO - Agosto 2026 - Whatsapp',
          budgetDaily: 110000,
          attribution: '7-day click · 1-day view',
          results: {
            value: 6,
            note: {
              es: '5 conversaciones el 6 de agosto + 1 atribuida el 7 (ventana de atribución)',
              en: '5 conversations on August 6 + 1 attributed on the 7th (attribution window)',
            },
          },
          days: [
            { d: '4 Ago', spend: 2896.35, imp: 773, reach: 617, freq: 1.25, lc: 4, ulc: 4, out: 2 },
            { d: '5 Ago', spend: 38087.78, imp: 6159, reach: 3516, freq: 1.75, lc: 16, ulc: 16, out: 8 },
            { d: '6 Ago', spend: 65074.37, imp: 10512, reach: 5919, freq: 1.78, lc: 45, ulc: 44, out: 20 },
          ],
          periodReach: { reach: 8030, freq: 2.17 },
          platforms: [
            { p: 'Instagram', reach: 4561, imp: 9927, spend: 61642.56, lc: 30, results: 2 },
            { p: 'Facebook', reach: 4102, imp: 7518, spend: 44417.6, lc: 35, results: 4 },
          ],
          gender: [
            { g: 'male', reach: 5603, imp: 12146, spend: 72003.37, lc: 40, results: 5 },
            { g: 'female', reach: 2581, imp: 5214, spend: 32823.4, lc: 24, results: 0 },
            { g: 'unknown', reach: 49, imp: 85, spend: 1233.39, lc: 1, results: 1 },
          ],
          age: [
            { a: '25-34', reach: 1901, imp: 4433, spend: 24935.61, lc: 13, results: 1 },
            { a: '35-44', reach: 1923, imp: 4456, spend: 23690.51, lc: 14, results: 3 },
            { a: '45-54', reach: 1739, imp: 3551, spend: 24746.54, lc: 16, results: 1 },
            { a: '55-64', reach: 1273, imp: 2561, spend: 17193.47, lc: 10, results: 0 },
            { a: '65+', reach: 1258, imp: 2441, spend: 15490.49, lc: 12, results: 1 },
          ],
          hourly: [
            { h: 0, spend: 439.55, imp: 117, lc: 0 },
            { h: 1, spend: 352.58, imp: 73, lc: 1 },
            { h: 2, spend: 200.89, imp: 43, lc: 0 },
            { h: 3, spend: 90.22, imp: 31, lc: 0 },
            { h: 4, spend: 155.22, imp: 29, lc: 0 },
            { h: 5, spend: 4536.09, imp: 35, lc: 1 },
            { h: 6, spend: 1196.98, imp: 91, lc: 0, r: 1 },
            { h: 7, spend: 1095.29, imp: 197, lc: 2 },
            { h: 8, spend: 2038.94, imp: 257, lc: 2, r: 1 },
            { h: 9, spend: 2453.52, imp: 412, lc: 1 },
            { h: 10, spend: 9705.98, imp: 1633, lc: 7, r: 1 },
            { h: 11, spend: 10089.02, imp: 1658, lc: 4, r: 1 },
            { h: 12, spend: 8323.49, imp: 1420, lc: 0 },
            { h: 13, spend: 8839.79, imp: 1891, lc: 6 },
            { h: 14, spend: 9172.09, imp: 1625, lc: 5, r: 1 },
            { h: 15, spend: 7652.7, imp: 1531, lc: 13 },
            { h: 16, spend: 8078.14, imp: 1403, lc: 7 },
            { h: 17, spend: 8750.69, imp: 1231, lc: 2 },
            { h: 18, spend: 7153.22, imp: 1109, lc: 4, r: 1 },
            { h: 19, spend: 6998.93, imp: 1015, lc: 5 },
            { h: 20, spend: 2635.66, imp: 599, lc: 3 },
            { h: 21, spend: 2264.18, imp: 372, lc: 1 },
            { h: 22, spend: 2515.39, imp: 333, lc: 1 },
            { h: 23, spend: 1321.6, imp: 340, lc: 0 },
          ],
          // Los anuncios de WhatsApp vinieron desglosados por plataforma:
          // acá se agregan FB+IG por anuncio (sin alcance, no sumable).
          ads: [
            { name: 'Anuncio Whatsapp 1 - Qué certificación necesito', spend: 18276.83, imp: 2136, lc: 12 },
            { name: 'Anuncio Whatsapp 2 - Certificaciones', spend: 36327.9, imp: 6311, lc: 17 },
            { name: 'Anuncio Whatsapp 3 - ¿Estás pensando en certificar?', spend: 31882.44, imp: 5663, lc: 20 },
            { name: 'Anuncio Whatsapp 4 - Certificaciones', spend: 11719.03, imp: 1843, lc: 10 },
            { name: 'Anuncio Whatsapp 5 - Huella de Carbono 2', spend: 7853.96, imp: 1492, lc: 6 },
          ],
        },
      ],
      // Funnel de Typeform (export de respuestas, ventana 4–7 Ago).
      // Se excluyen las respuestas del 31 Jul: pruebas internas previas al
      // vuelo (incluidos 2 envíos "test"). El export no trae views ni UTM.
      typeform: {
        forms: [
          {
            name: 'Certificaciones',
            starts: 4,
            completed: 0,
            leads: [],
            // Insights oficiales de Typeform ("Big picture", sin filtro de
            // fechas): cubren toda la vida del form, incl. pruebas del 31/7.
            panel: { views: 158, starts: 16, subs: 1, completion: 6.3, time: '00:39' },
            // Primera pregunta del Typeform — distribución de las respuestas
            // del 4–7 Ago (recalculada del export de respuestas; el resumen
            // oficial de Typeform incluye las pruebas del 31 Jul).
            intent: {
              q: '¿Qué querés lograr?',
              dist: [
                { l: 'Acceder a nuevos mercados', v: 2 },
                { l: 'Cumplir requisitos de un cliente', v: 1 },
                { l: 'Diferenciar mi producción', v: 1 },
                { l: 'Estoy explorando opciones', v: 0 },
              ],
            },
          },
          {
            name: 'Huella de Carbono',
            starts: 8,
            completed: 2,
            panel: { views: 173, starts: 20, subs: 4, completion: 20, time: '01:10' },
            intent: {
              q: '¿Tu organización ya calculó su Huella de Carbono?',
              dist: [
                { l: 'No', v: 6 },
                { l: 'Estamos en proceso', v: 2 },
                { l: 'Sí', v: 0 },
              ],
            },
            leads: [
              {
                name: 'Luis Gervasoni', company: 'Terratech', email: 'gervasoni.luis@gmail.com',
                role: 'Productor · Agricultura', goal: 'Acceder a nuevos mercados',
                extra: 'Huella de carbono: aún no calculada', d: '6 Ago',
              },
              {
                name: 'Roberto Daniel Domínguez', company: 'BIO ROAD', email: 'rdominguezbr@gmail.com',
                role: 'Agricultura · Otro rol', goal: 'Generar bonos verdes',
                extra: 'Huella de carbono: aún no calculada', d: '5 Ago',
              },
            ],
          },
        ],
      },
    },
  },

  psar: {
    'geo-aapresid-2026': {
      currency: 'USD',
      event: 'Congreso Aapresid 2026',
      // El export de PS Argentina es a nivel conjunto de anuncios; PS no
      // corrió WhatsApp. El destino del anuncio es un formulario de HubSpot
      // (el conjunto se llama "Typeform" pero el link es hsforms.com).
      campaigns: [
        {
          id: 'tf',
          kind: 'hsform',
          name: 'Peterson - Aapresid - Typeform',
          budgetDaily: null,
          attribution: '7-day click · 1-day view · 1-day engaged-view',
          days: [
            { d: '4 Ago', spend: 4.45, imp: 706, reach: 252, freq: 2.8, lc: 4, ulc: 4, out: 4 },
            { d: '5 Ago', spend: 16.8, imp: 3620, reach: 667, freq: 5.43, lc: 17, ulc: 14, out: 17 },
            { d: '6 Ago', spend: 21.11, imp: 3884, reach: 724, freq: 5.36, lc: 16, ulc: 15, out: 16 },
          ],
          periodReach: { reach: 1286, freq: 6.38 },
          platforms: [
            { p: 'Instagram', reach: 855, imp: 5508, spend: 30.51, lc: 16 },
            { p: 'Facebook', reach: 743, imp: 2380, spend: 10.4, lc: 11 },
            { p: 'Audience Network', reach: 42, imp: 307, spend: 1.38, lc: 10 },
            { p: 'Threads', reach: 10, imp: 13, spend: 0.07, lc: 0 },
            { p: 'WhatsApp', reach: 2, imp: 2, spend: 0, lc: 0 },
          ],
          gender: [
            { g: 'male', reach: 889, imp: 6155, spend: 31.37, lc: 27 },
            { g: 'female', reach: 360, imp: 2023, spend: 10.91, lc: 10 },
            { g: 'unknown', reach: 6, imp: 32, spend: 0.08, lc: 0 },
          ],
          age: [
            { a: '18-24', reach: 69, imp: 552, spend: 1.45, lc: 5 },
            { a: '25-34', reach: 409, imp: 3195, spend: 12.07, lc: 12 },
            { a: '35-44', reach: 397, imp: 2659, spend: 15.03, lc: 7 },
            { a: '45-54', reach: 227, imp: 1052, spend: 5.65, lc: 3 },
            { a: '55-64', reach: 114, imp: 511, spend: 5.37, lc: 2 },
            { a: '65+', reach: 47, imp: 241, spend: 2.79, lc: 8 },
          ],
          hourly: [
            { h: 0, spend: 0.08, imp: 46, lc: 1 },
            { h: 1, spend: 0.05, imp: 35, lc: 0 },
            { h: 2, spend: 0.05, imp: 17, lc: 0 },
            { h: 3, spend: 0.02, imp: 12, lc: 0 },
            { h: 4, spend: 0.02, imp: 11, lc: 0 },
            { h: 5, spend: 0.01, imp: 8, lc: 0 },
            { h: 6, spend: 0.05, imp: 23, lc: 0 },
            { h: 7, spend: 0.09, imp: 27, lc: 0 },
            { h: 8, spend: 0.37, imp: 109, lc: 0 },
            { h: 9, spend: 0.76, imp: 198, lc: 0 },
            { h: 10, spend: 1.74, imp: 325, lc: 0 },
            { h: 11, spend: 2.72, imp: 499, lc: 2 },
            { h: 12, spend: 3.18, imp: 613, lc: 2 },
            { h: 13, spend: 3.91, imp: 696, lc: 2 },
            { h: 14, spend: 4.1, imp: 824, lc: 2 },
            { h: 15, spend: 5.25, imp: 876, lc: 4 },
            { h: 16, spend: 4.16, imp: 866, lc: 5 },
            { h: 17, spend: 6.38, imp: 992, lc: 4 },
            { h: 18, spend: 3.75, imp: 660, lc: 6 },
            { h: 19, spend: 2.57, imp: 556, lc: 1 },
            { h: 20, spend: 1.08, imp: 300, lc: 3 },
            { h: 21, spend: 0.83, imp: 214, lc: 4 },
            { h: 22, spend: 0.55, imp: 153, lc: 0 },
            { h: 23, spend: 0.64, imp: 150, lc: 1 },
          ],
          ads: [
            { name: 'Peterson - Aapresid - Typeform - Carbono', spend: 21.75, imp: 4239, reach: 942, lc: 20 },
            { name: 'Peterson - Aapresid - Typeform - Claims', spend: 9.13, imp: 1679, reach: 592, lc: 9 },
            { name: 'Peterson - Aapresid - Typeform - Certificaciones', spend: 4.55, imp: 849, reach: 355, lc: 5 },
            { name: 'Peterson - Aapresid - Typeform - Sourcing y supply chain', spend: 6.93, imp: 1443, reach: 548, lc: 3 },
          ],
        },
      ],
      // Funnel del formulario HubSpot "PS Argentina Congreso Aapresid - ES"
      // (panel de Performance, rango 9 Jul – 7 Ago).
      hsForm: {
        views: 37,
        visible: 35,
        interactions: 2,
        submissions: 0,
        sources: [
          { s: 'Other campaigns', v: 27 },
          { s: 'Direct traffic', v: 7 },
          { s: 'Referrals', v: 2 },
          { s: 'Organic social', v: 1 },
        ],
      },
    },
  },
};

// ── Agregados de una campaña (suma de los días con entrega) ──
export function aggCampaign(c) {
  const t = c.days.reduce(
    (a, x) => ({
      spend: a.spend + x.spend,
      imp: a.imp + x.imp,
      lc: a.lc + x.lc,
      ulc: a.ulc + x.ulc,
      out: a.out + x.out,
    }),
    { spend: 0, imp: 0, lc: 0, ulc: 0, out: 0 },
  );
  return {
    ...t,
    ctr: t.imp ? (t.lc / t.imp) * 100 : 0,
    outCtr: t.imp ? (t.out / t.imp) * 100 : 0,
    cpc: t.lc ? t.spend / t.lc : 0,
    cpm: t.imp ? (t.spend / t.imp) * 1000 : 0,
    results: c.results?.value ?? null,
    costPerResult: c.results?.value ? t.spend / c.results.value : null,
    maxFreq: Math.max(...c.days.map((x) => x.freq)),
  };
}

// ── Agregados de la cuenta (todas las campañas del evento) ──
export function aggAccount(geo) {
  const per = geo.campaigns.map((c) => ({ c, t: aggCampaign(c) }));
  const sum = per.reduce(
    (a, { t }) => ({
      spend: a.spend + t.spend,
      imp: a.imp + t.imp,
      lc: a.lc + t.lc,
      out: a.out + t.out,
    }),
    { spend: 0, imp: 0, lc: 0, out: 0 },
  );
  return {
    per,
    ...sum,
    ctr: sum.imp ? (sum.lc / sum.imp) * 100 : 0,
    outCtr: sum.imp ? (sum.out / sum.imp) * 100 : 0,
    cpc: sum.lc ? sum.spend / sum.lc : 0,
    cpm: sum.imp ? (sum.spend / sum.imp) * 1000 : 0,
  };
}
