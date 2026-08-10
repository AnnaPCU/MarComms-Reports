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
