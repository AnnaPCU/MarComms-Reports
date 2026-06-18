// ════════════════════════════════════════════════════════════════
//  SEED — Pilar Paid Media · Google Ads Search
//  · CU Portugal: mes a mes Feb→Jun 2026 (de los CSV de Google Ads).
//    Junio es PARCIAL (1–12 jun). Se muestran las 7 campañas, incluso las
//    que estuvieron habilitadas sin actividad (se aclara y explica).
//  · España: Abril 2026 (del reporte original IFS / GMP+).
//  Las métricas son la parte firme. Seed temporal hasta que el import persista.
// ════════════════════════════════════════════════════════════════

export const PAID_CLIENTS = [
  { id: 'pt', name: 'CU Portugal' },
  { id: 'es', name: 'CU España' },
];

// Helper para no repetir campañas en cero.
const zero = (name) => ({
  name,
  impressions: 0,
  clicks: 0,
  ctr: 0,
  cpc: 0,
  cost: 0,
  conversions: 0,
  convRate: 0,
  costPerConv: 0,
});

// Orden fijo de campañas de CU Portugal (para que la vista por campaña sea estable).
const PT_CAMPAIGNS = ['Textile', 'Smeta', 'Plásticos', 'GMP+', 'Forestal', 'Biomasa', 'Bioenergía'];

// Arma el set de 7 campañas a partir de las que tuvieron actividad.
function ptMonth(active) {
  return PT_CAMPAIGNS.map((n) => active[n] ?? zero(n));
}

export const PAID_DB = {
  pt: {
    name: 'CU Portugal',
    periods: {
      m02: {
        channel: 'Google Ads Search',
        objetivo: 'Generación de leads',
        totals: { impressions: 9260, clicks: 72, ctr: 0.78, cpc: 0.54, cost: 39.12, currency: 'EUR', conversions: 0, convRate: 0, costPerConv: 0 },
        campaigns: ptMonth({
          'GMP+': { name: 'GMP+', impressions: 9260, clicks: 72, ctr: 0.78, cpc: 0.54, cost: 39.12, conversions: 0, convRate: 0, costPerConv: 0 },
        }),
        analysis:
          'En febrero solo GMP+ tuvo actividad (9.260 impresiones, 72 clics, 39,12 EUR), sin conversiones. Las otras 6 campañas estaban habilitadas pero sin impresiones en el período.',
      },
      m03: {
        channel: 'Google Ads Search',
        objetivo: 'Generación de leads',
        totals: { impressions: 9238, clicks: 145, ctr: 1.57, cpc: 1.06, cost: 153.03, currency: 'EUR', conversions: 2, convRate: 1.38, costPerConv: 76.51 },
        campaigns: ptMonth({
          'GMP+': { name: 'GMP+', impressions: 9238, clicks: 145, ctr: 1.57, cpc: 1.06, cost: 153.03, conversions: 2, convRate: 1.38, costPerConv: 76.51 },
        }),
        analysis:
          'Marzo fue el mejor mes de GMP+: 2 conversiones a 76,51 EUR cada una, con CTR de 1,57% sobre 9.238 impresiones. El resto de las campañas siguió sin actividad.',
      },
      m04: {
        channel: 'Google Ads Search',
        objetivo: 'Generación de leads',
        totals: { impressions: 1522, clicks: 56, ctr: 3.68, cpc: 2.42, cost: 135.41, currency: 'EUR', conversions: 1, convRate: 1.79, costPerConv: 135.41 },
        campaigns: ptMonth({
          'GMP+': { name: 'GMP+', impressions: 1522, clicks: 56, ctr: 3.68, cpc: 2.42, cost: 135.41, conversions: 1, convRate: 1.79, costPerConv: 135.41 },
        }),
        analysis:
          'En abril GMP+ mejoró el CTR a 3,68%, pero con menos volumen (1.522 impresiones) y 1 conversión a 135,41 EUR — coste por conversión más alto que en marzo. Resto sin actividad.',
      },
      m05: {
        channel: 'Google Ads Search',
        objetivo: 'Generación de leads',
        totals: { impressions: 1680, clicks: 42, ctr: 2.5, cpc: 2.33, cost: 98.05, currency: 'EUR', conversions: 0, convRate: 0, costPerConv: 0 },
        campaigns: ptMonth({
          Textile: { name: 'Textile', impressions: 104, clicks: 8, ctr: 7.69, cpc: 0.68, cost: 5.47, conversions: 0, convRate: 0, costPerConv: 0 },
          Smeta: { name: 'Smeta', impressions: 53, clicks: 1, ctr: 1.89, cpc: 1.49, cost: 1.49, conversions: 0, convRate: 0, costPerConv: 0 },
          'Plásticos': { name: 'Plásticos', impressions: 14, clicks: 0, ctr: 0, cpc: 0, cost: 0, conversions: 0, convRate: 0, costPerConv: 0 },
          'GMP+': { name: 'GMP+', impressions: 1495, clicks: 33, ctr: 2.21, cpc: 2.76, cost: 91.09, conversions: 0, convRate: 0, costPerConv: 0 },
          Forestal: { name: 'Forestal', impressions: 4, clicks: 0, ctr: 0, cpc: 0, cost: 0, conversions: 0, convRate: 0, costPerConv: 0 },
          Biomasa: { name: 'Biomasa', impressions: 3, clicks: 0, ctr: 0, cpc: 0, cost: 0, conversions: 0, convRate: 0, costPerConv: 0 },
          'Bioenergía': { name: 'Bioenergía', impressions: 7, clicks: 0, ctr: 0, cpc: 0, cost: 0, conversions: 0, convRate: 0, costPerConv: 0 },
        }),
        analysis:
          'En mayo se activaron casi todas las campañas, pero con volúmenes muy bajos (Plásticos, Forestal, Biomasa y Bioenergía con pocas impresiones y sin clics). GMP+ sigue concentrando el grueso de impresiones y costo. Sin conversiones en el mes.',
      },
      m06: {
        channel: 'Google Ads Search',
        objetivo: 'Generación de leads',
        partial: true,
        partialNote: 'Métricas parciales: del 1 al 12 de junio de 2026 (no es el mes completo).',
        totals: { impressions: 153, clicks: 12, ctr: 7.84, cpc: 0.93, cost: 11.1, currency: 'EUR', conversions: 0, convRate: 0, costPerConv: 0 },
        campaigns: ptMonth({
          Textile: { name: 'Textile', impressions: 83, clicks: 8, ctr: 9.64, cpc: 0.68, cost: 5.42, conversions: 0, convRate: 0, costPerConv: 0 },
          Smeta: { name: 'Smeta', impressions: 18, clicks: 0, ctr: 0, cpc: 0, cost: 0, conversions: 0, convRate: 0, costPerConv: 0 },
          'Plásticos': { name: 'Plásticos', impressions: 4, clicks: 0, ctr: 0, cpc: 0, cost: 0, conversions: 0, convRate: 0, costPerConv: 0 },
          'GMP+': { name: 'GMP+', impressions: 47, clicks: 4, ctr: 8.51, cpc: 1.42, cost: 5.68, conversions: 0, convRate: 0, costPerConv: 0 },
          'Bioenergía': { name: 'Bioenergía', impressions: 1, clicks: 0, ctr: 0, cpc: 0, cost: 0, conversions: 0, convRate: 0, costPerConv: 0 },
        }),
        analysis:
          'Datos parciales hasta el 12 de junio. Textile y GMP+ muestran buen CTR (9,64% y 8,51%) pero con pocos clics por lo corto del período. Sin conversiones todavía. No comparable contra meses completos.',
      },
    },
  },

  es: {
    name: 'CU España',
    periods: {
      m04: {
        channel: 'Google Ads Search',
        objetivo: 'Generación de leads',
        totals: { impressions: 1144, clicks: 181, ctr: 15.82, cpc: 1.37, cost: 247.28, currency: 'EUR', conversions: 4, convRate: 2.21, costPerConv: 61.82 },
        campaigns: [
          { name: 'IFS', impressions: 368, clicks: 130, ctr: 35.33, cpc: 0.83, cost: 107.66, conversions: 4, convRate: 3.08, costPerConv: 26.91, optLevel: 83.1 },
          { name: 'GMP+', impressions: 776, clicks: 51, ctr: 6.57, cpc: 2.74, cost: 139.62, conversions: 0, convRate: 0, costPerConv: 0, optLevel: 80.9 },
        ],
        analysis:
          'En abril el análisis se concentra en IFS y GMP+. IFS muestra la mejor señal: 130 clics, 4 conversiones, tasa de conversión de 3,08% y coste por conversión de 26,91 EUR — la campaña con mejor resultado del mes. GMP+ generó más impresiones pero no registró conversiones, lo que sugiere revisar intención de búsqueda, anuncios y landing page.',
      },
    },
  },
};
