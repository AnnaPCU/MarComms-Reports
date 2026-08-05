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
  { id: 'cuc', name: 'CU Canadá' },
  { id: 'psar', name: 'PS Argentina' },
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
        totals: { impressions: 838, clicks: 62, ctr: 7.4, cpc: 1.35, cost: 83.97, currency: 'EUR', conversions: 0, convRate: 0, costPerConv: 0 },
        campaigns: [
          { name: 'Textile', impressions: 335, clicks: 29, ctr: 8.66, cpc: 1.36, cost: 39.57, conversions: 0, convRate: 0, costPerConv: 0 },
          { name: 'Plásticos', impressions: 90, clicks: 12, ctr: 13.33, cpc: 0.98, cost: 11.72, conversions: 0, convRate: 0, costPerConv: 0 },
          { name: 'GMP+', impressions: 159, clicks: 8, ctr: 5.03, cpc: 2.23, cost: 17.84, conversions: 0, convRate: 0, costPerConv: 0 },
          { name: 'Smeta', impressions: 170, clicks: 7, ctr: 4.12, cpc: 1.25, cost: 8.76, conversions: 0, convRate: 0, costPerConv: 0 },
          { name: 'Bioenergía', impressions: 68, clicks: 6, ctr: 8.82, cpc: 1.01, cost: 6.08, conversions: 0, convRate: 0, costPerConv: 0 },
          { name: 'Forestal', impressions: 12, clicks: 0, ctr: 0, cpc: 0, cost: 0, conversions: 0, convRate: 0, costPerConv: 0 },
          { name: 'Biomasa', impressions: 4, clicks: 0, ctr: 0, cpc: 0, cost: 0, conversions: 0, convRate: 0, costPerConv: 0 },
        ],
        analysis:
          'Junio completo. Textile lideró la actividad (29 clics, CTR 8,66%) y Plásticos destacó por CTR (13,33%) con bajo volumen. GMP+, Smeta y Bioenergía sumaron actividad menor. Forestal y Biomasa tuvieron impresiones pero ningún clic. Sin conversiones en el mes. Total: 838 impresiones, 62 clics y 83,97 EUR invertidos.',
      },
      m07: {
        channel: 'Google Ads Search',
        objetivo: 'Generación de leads',
        totals: { impressions: 1799, clicks: 116, ctr: 6.45, cpc: 1.94, cost: 225.29, currency: 'EUR', conversions: 1, convRate: 0.86, costPerConv: 225.29 },
        campaigns: [
          { name: 'GMP+', impressions: 776, clicks: 29, ctr: 3.74, cpc: 2.46, cost: 71.35, conversions: 0, convRate: 0, costPerConv: 0 },
          { name: 'Textile', impressions: 341, clicks: 26, ctr: 7.62, cpc: 1.83, cost: 47.58, conversions: 0, convRate: 0, costPerConv: 0 },
          { name: 'Smeta', impressions: 270, clicks: 22, ctr: 8.15, cpc: 1.7, cost: 37.33, conversions: 1, convRate: 4.55, costPerConv: 37.33 },
          { name: 'Bioenergía', impressions: 205, clicks: 19, ctr: 9.27, cpc: 2.09, cost: 39.64, conversions: 0, convRate: 0, costPerConv: 0 },
          { name: 'Plásticos', impressions: 156, clicks: 15, ctr: 9.62, cpc: 1.62, cost: 24.31, conversions: 0, convRate: 0, costPerConv: 0 },
          { name: 'Forestal', impressions: 35, clicks: 0, ctr: 0, cpc: 0, cost: 0, conversions: 0, convRate: 0, costPerConv: 0 },
          { name: 'Biomasa', impressions: 16, clicks: 5, ctr: 31.25, cpc: 1.02, cost: 5.08, conversions: 0, convRate: 0, costPerConv: 0 },
        ],
        analysis:
          'Julio completo. Smeta logró la única conversión del mes de toda la cartera (37,33 EUR/lead, tasa 4,55%): es la campaña a proteger. GMP+ tuvo la mayor actividad (29 clics) y Biomasa un CTR excepcional (31,25%) con volumen mínimo. Forestal quedó sin clics. Total: 1.799 impresiones, 116 clics y 225,29 EUR.',
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
      m06: {
        channel: 'Google Ads Search',
        objetivo: 'Generación de leads',
        totals: { impressions: 2692, clicks: 196, ctr: 7.28, cpc: 1.54, cost: 301.65, currency: 'EUR', conversions: 1, convRate: 0.51, costPerConv: 301.65 },
        campaigns: [
          { name: 'IFS', impressions: 366, clicks: 55, ctr: 15.03, cpc: 1.15, cost: 63.1, conversions: 1, convRate: 1.82, costPerConv: 63.1 },
          { name: 'GMP+', impressions: 636, clicks: 31, ctr: 4.87, cpc: 2.93, cost: 90.72, conversions: 0, convRate: 0, costPerConv: 0 },
          { name: 'Forestal', impressions: 485, clicks: 28, ctr: 5.77, cpc: 1.19, cost: 33.24, conversions: 0, convRate: 0, costPerConv: 0 },
          { name: 'Textile', impressions: 378, clicks: 26, ctr: 6.88, cpc: 1.19, cost: 30.83, conversions: 0, convRate: 0, costPerConv: 0 },
          { name: 'Plásticos', impressions: 244, clicks: 20, ctr: 8.2, cpc: 1.7, cost: 34.0, conversions: 0, convRate: 0, costPerConv: 0 },
          { name: 'Bioenergía', impressions: 183, clicks: 15, ctr: 8.2, cpc: 1.47, cost: 22.11, conversions: 0, convRate: 0, costPerConv: 0 },
          { name: 'Smeta', impressions: 331, clicks: 13, ctr: 3.93, cpc: 1.38, cost: 17.92, conversions: 0, convRate: 0, costPerConv: 0 },
          { name: 'Biomasa', impressions: 69, clicks: 8, ctr: 11.59, cpc: 1.22, cost: 9.73, conversions: 0, convRate: 0, costPerConv: 0 },
          { name: 'Car', impressions: 0, clicks: 0, ctr: 0, cpc: 0, cost: 0, conversions: 0, convRate: 0, costPerConv: 0 },
        ],
        analysis:
          'En junio, IFS volvió a ser la única campaña con conversión (1 conversión a 63,10 EUR) sobre 55 clics y un CTR del 15,03% — la mejor señal del mes. GMP+ concentró el mayor coste (90,72 EUR) con 31 clics pero sin conversiones. Forestal, Textile, Plásticos, Bioenergía, Smeta y Biomasa tuvieron actividad moderada sin conversiones, y "Car" quedó sin impresiones. Total: 2.692 impresiones, 196 clics y 301,65 EUR invertidos.',
      },
      m07: {
        channel: 'Google Ads Search',
        objetivo: 'Generación de leads',
        totals: { impressions: 3320, clicks: 246, ctr: 7.41, cpc: 1.74, cost: 428.91, currency: 'EUR', conversions: 0, convRate: 0, costPerConv: 0 },
        campaigns: [
          { name: 'GMP+', impressions: 619, clicks: 26, ctr: 4.2, cpc: 2.68, cost: 69.62, conversions: 0, convRate: 0, costPerConv: 0 },
          { name: 'Car', impressions: 590, clicks: 21, ctr: 3.56, cpc: 2.19, cost: 46.01, conversions: 0, convRate: 0, costPerConv: 0 },
          { name: 'Textile', impressions: 455, clicks: 30, ctr: 6.59, cpc: 1.58, cost: 47.26, conversions: 0, convRate: 0, costPerConv: 0 },
          { name: 'Forestal', impressions: 409, clicks: 33, ctr: 8.07, cpc: 1.51, cost: 49.97, conversions: 0, convRate: 0, costPerConv: 0 },
          { name: 'Plásticos', impressions: 366, clicks: 25, ctr: 6.83, cpc: 1.88, cost: 46.98, conversions: 0, convRate: 0, costPerConv: 0 },
          { name: 'Bioenergía', impressions: 303, clicks: 28, ctr: 9.24, cpc: 1.64, cost: 45.78, conversions: 0, convRate: 0, costPerConv: 0 },
          { name: 'Smeta', impressions: 271, clicks: 23, ctr: 8.49, cpc: 2.1, cost: 48.19, conversions: 0, convRate: 0, costPerConv: 0 },
          { name: 'IFS', impressions: 206, clicks: 43, ctr: 20.87, cpc: 1.06, cost: 45.52, conversions: 0, convRate: 0, costPerConv: 0 },
          { name: 'Biomasa', impressions: 101, clicks: 17, ctr: 16.83, cpc: 1.74, cost: 29.58, conversions: 0, convRate: 0, costPerConv: 0 },
        ],
        analysis:
          'Julio completo. IFS volvió a liderar los clics (43, CTR 20,87%) y Biomasa mostró el mejor CTR del mes (16,83%) con poco volumen. GMP+ concentró el mayor coste (69,62 EUR) sin conversiones. Mes sin conversiones registradas en la cuenta: revisar landing pages y llamados a la acción. Total: 3.320 impresiones, 246 clics y 428,91 EUR invertidos.',
      },
    },
  },

  cuc: {
    name: 'CU Canadá',
    periods: {
      m06: {
        channel: 'Google Ads Search',
        objetivo: 'Generación de leads',
        totals: { impressions: 276, clicks: 14, ctr: 5.07, cpc: 1.62, cost: 22.68, currency: 'EUR', conversions: 0, convRate: 0, costPerConv: 0 },
        campaigns: [
          { name: 'Canada Gap', impressions: 168, clicks: 12, ctr: 7.14, cpc: 1.77, cost: 21.28, conversions: 0, convRate: 0, costPerConv: 0 },
          { name: 'Smeta', impressions: 69, clicks: 2, ctr: 2.9, cpc: 0.7, cost: 1.4, conversions: 0, convRate: 0, costPerConv: 0 },
          { name: 'Forestry', impressions: 27, clicks: 0, ctr: 0, cpc: 0, cost: 0, conversions: 0, convRate: 0, costPerConv: 0 },
          { name: 'GLOBALG.A.P.', impressions: 10, clicks: 0, ctr: 0, cpc: 0, cost: 0, conversions: 0, convRate: 0, costPerConv: 0 },
          { name: 'Aqua / Fisheries', impressions: 2, clicks: 0, ctr: 0, cpc: 0, cost: 0, conversions: 0, convRate: 0, costPerConv: 0 },
          { name: 'Cannabis', impressions: 0, clicks: 0, ctr: 0, cpc: 0, cost: 0, conversions: 0, convRate: 0, costPerConv: 0 },
        ],
        analysis:
          'Primer período cargado de CU Canadá. Canada Gap concentró la actividad (12 clics, 168 impresiones, CTR 7,14%) y Smeta aportó 2 clics. Forestry, GLOBALG.A.P. y Aqua / Fisheries tuvieron impresiones sin clics, y Cannabis quedó sin actividad. Sin conversiones en el mes. Total: 276 impresiones, 14 clics y 22,68 EUR invertidos.',
      },
      m07: {
        channel: 'Google Ads Search',
        objetivo: 'Generación de leads',
        totals: { impressions: 1128, clicks: 65, ctr: 5.76, cpc: 2.2, cost: 142.9, currency: 'EUR', conversions: 0, convRate: 0, costPerConv: 0 },
        campaigns: [
          { name: 'Forestry', impressions: 535, clicks: 16, ctr: 2.99, cpc: 2.54, cost: 40.57, conversions: 0, convRate: 0, costPerConv: 0 },
          { name: 'Smeta', impressions: 276, clicks: 20, ctr: 7.25, cpc: 2.54, cost: 50.88, conversions: 0, convRate: 0, costPerConv: 0 },
          { name: 'Canada Gap', impressions: 227, clicks: 23, ctr: 10.13, cpc: 2.04, cost: 46.9, conversions: 0, convRate: 0, costPerConv: 0 },
          { name: 'GLOBALG.A.P.', impressions: 84, clicks: 6, ctr: 7.14, cpc: 0.76, cost: 4.55, conversions: 0, convRate: 0, costPerConv: 0 },
          { name: 'Aqua / Fisheries', impressions: 6, clicks: 0, ctr: 0, cpc: 0, cost: 0, conversions: 0, convRate: 0, costPerConv: 0 },
          { name: 'Cannabis', impressions: 0, clicks: 0, ctr: 0, cpc: 0, cost: 0, conversions: 0, convRate: 0, costPerConv: 0 },
        ],
        analysis:
          'Julio completo. Canada Gap lideró en clics (23, CTR 10,13%) y Smeta en coste (50,88 EUR) sin convertir. Forestry aportó el mayor alcance (535 impresiones) con CTR bajo (2,99%). Cannabis sin impresiones y Aqua/Fisheries casi sin actividad. Sin conversiones en el mes. Total: 1.128 impresiones, 65 clics y 142,90 EUR.',
      },
    },
  },

  psar: {
    name: 'PS Argentina',
    periods: {
      m06: {
        channel: 'Google Ads Search',
        objetivo: 'Generación de leads',
        totals: { impressions: 3912, clicks: 119, ctr: 3.04, cpc: 0.95, cost: 112.57, currency: 'EUR', conversions: 0, convRate: 0, costPerConv: 0 },
        campaigns: [
          { name: 'SuSe - ESG / Reportes', impressions: 1227, clicks: 47, ctr: 3.83, cpc: 0.8, cost: 37.38, conversions: 0, convRate: 0, costPerConv: 0 },
          { name: 'SuSo - Agricultura regenerativa', impressions: 831, clicks: 34, ctr: 4.09, cpc: 0.87, cost: 29.69, conversions: 0, convRate: 0, costPerConv: 0 },
          { name: 'SuSe - Huella de agua', impressions: 119, clicks: 15, ctr: 12.61, cpc: 1.61, cost: 24.19, conversions: 0, convRate: 0, costPerConv: 0 },
          { name: 'SuSe - Huella de carbono / GEI', impressions: 486, clicks: 9, ctr: 1.85, cpc: 1.12, cost: 10.1, conversions: 0, convRate: 0, costPerConv: 0 },
          { name: 'CeSu - Preparación para certificaciones', impressions: 162, clicks: 7, ctr: 4.32, cpc: 1.36, cost: 9.51, conversions: 0, convRate: 0, costPerConv: 0 },
          { name: 'Bioenergía / Biocombustibles', impressions: 1069, clicks: 7, ctr: 0.65, cpc: 0.24, cost: 1.7, conversions: 0, convRate: 0, costPerConv: 0 },
          { name: 'SuSo - Abastecimiento sostenible', impressions: 6, clicks: 0, ctr: 0, cpc: 0, cost: 0, conversions: 0, convRate: 0, costPerConv: 0 },
          { name: 'SuSo - Trazabilidad / EUDR', impressions: 12, clicks: 0, ctr: 0, cpc: 0, cost: 0, conversions: 0, convRate: 0, costPerConv: 0 },
        ],
        analysis:
          'Primer período cargado de PS Argentina. Las líneas SuSe (ESG / Reportes, Huella de agua y de carbono) y SuSo (Agricultura regenerativa) concentraron los clics; "ESG / Reportes" lideró con 47 clics sobre 1.227 impresiones. "Bioenergía / Biocombustibles" tuvo alto volumen de impresiones (1.069) pero bajo CTR (0,65%). Dos campañas SuSo tuvieron impresiones sin clics. Sin conversiones en el mes. Total: 3.912 impresiones, 119 clics y 112,57 EUR invertidos.',
      },
      m07: {
        channel: 'Google Ads Search',
        objetivo: 'Generación de leads',
        totals: { impressions: 4091, clicks: 144, ctr: 3.52, cpc: 1.32, cost: 189.74, currency: 'EUR', conversions: 0, convRate: 0, costPerConv: 0 },
        campaigns: [
          { name: 'SuSe - ESG / Reportes', impressions: 1422, clicks: 37, ctr: 2.6, cpc: 1.15, cost: 42.62, conversions: 0, convRate: 0, costPerConv: 0 },
          { name: 'SuSo - Agricultura regenerativa', impressions: 937, clicks: 44, ctr: 4.7, cpc: 0.9, cost: 39.41, conversions: 0, convRate: 0, costPerConv: 0 },
          { name: 'SuSe - Huella de carbono / GEI', impressions: 668, clicks: 23, ctr: 3.44, cpc: 1.66, cost: 38.21, conversions: 0, convRate: 0, costPerConv: 0 },
          { name: 'Bioenergía / Biocombustibles', impressions: 531, clicks: 6, ctr: 1.13, cpc: 1.17, cost: 7.03, conversions: 0, convRate: 0, costPerConv: 0 },
          { name: 'SuSe - Huella de agua', impressions: 289, clicks: 24, ctr: 8.3, cpc: 1.91, cost: 45.77, conversions: 0, convRate: 0, costPerConv: 0 },
          { name: 'CeSu - Preparacion para certificaciones', impressions: 217, clicks: 9, ctr: 4.15, cpc: 1.42, cost: 12.78, conversions: 0, convRate: 0, costPerConv: 0 },
          { name: 'SuSo - Trazabilidad / EUDR', impressions: 23, clicks: 1, ctr: 4.35, cpc: 3.92, cost: 3.92, conversions: 0, convRate: 0, costPerConv: 0 },
          { name: 'SuSo - Abastecimiento sostenible', impressions: 4, clicks: 0, ctr: 0, cpc: 0, cost: 0, conversions: 0, convRate: 0, costPerConv: 0 },
        ],
        analysis:
          'Julio completo. Agricultura regenerativa lideró los clics (44, CPC 0,90 EUR) y ESG/Reportes el alcance (1.422 impresiones). Huella de agua sostuvo buen CTR (8,30%). Trazabilidad/EUDR y Abastecimiento sostenible casi sin actividad: revisar pujas y presupuesto. Sin conversiones en el mes. Total: 4.091 impresiones, 144 clics y 189,74 EUR.',
      },
    },
  },
};
