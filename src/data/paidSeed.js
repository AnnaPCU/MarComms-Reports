// ════════════════════════════════════════════════════════════════
//  SEED — Pilar Paid Media · Google Ads Search
//  · CU Portugal: mes a mes Feb→Jun 2026 (de los CSV de Google Ads).
//    Junio es PARCIAL (1–12 jun). Las campañas en cero sin actividad previa
//    quedan en el seed pero la app no las muestra hasta que arrancan
//    (paidService.getMonthly, pedido del 20/10/2026).
//  · España: Abril 2026 (del reporte original IFS / GMP+).
//  · CU España: la campaña «Car» pasó a llamarse «CAEs» en agosto 2026. Es la
//    misma campaña (mismos grupos: Certificados y Sistema CAE / Verificación y
//    Actuaciones CAE), así que los meses previos van con el nombre nuevo para
//    que el acumulado anual no la parta en dos.
//  Las métricas son la parte firme. Seed temporal hasta que el import persista.
// ════════════════════════════════════════════════════════════════

export const PAID_CLIENTS = [
  { id: 'pt', name: 'Control Union Portugal' },
  { id: 'es', name: 'Control Union España' },
  { id: 'cuc', name: 'Control Union Canadá' },
  { id: 'psar', name: 'Peterson Solutions Argentina' },
  { id: 'cuus', name: 'Control Union Estados Unidos' },
  // Google Ads desde septiembre 2026 + campañas de Meta Ads (src/data/paidMetaGeo.js).
  { id: 'cuar', name: 'Control Union Argentina' },
  // Campañas de Google Ads con marca de grupo (PCU), una cuenta por país (sep 2026).
  { id: 'pcues', name: 'PCU España' },
  { id: 'pcuar', name: 'PCU Argentina' },
  // Solo la campaña conjunta IFPA (con CU Estados Unidos, src/data/paidParallel.js).
  { id: 'cumx', name: 'Control Union México' },
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
    name: 'Control Union Portugal',
    periods: {
      m02: {
        channel: 'Google Ads Search',
        objetivo: 'Generación de leads',
        totals: { impressions: 9260, clicks: 72, ctr: 0.78, cpc: 0.54, cost: 39.12, currency: 'EUR', conversions: 0, convRate: 0, costPerConv: 0 },
        campaigns: ptMonth({
          'GMP+': { name: 'GMP+', impressions: 9260, clicks: 72, ctr: 0.78, cpc: 0.54, cost: 39.12, conversions: 0, convRate: 0, costPerConv: 0 },
        }),
        analysis:
          'En febrero solo GMP+ tuvo actividad (9.260 impresiones, 72 clics, 39,12 EUR), sin conversiones.',
      },
      m03: {
        channel: 'Google Ads Search',
        objetivo: 'Generación de leads',
        totals: { impressions: 9238, clicks: 145, ctr: 1.57, cpc: 1.06, cost: 153.03, currency: 'EUR', conversions: 2, convRate: 1.38, costPerConv: 76.51 },
        campaigns: ptMonth({
          'GMP+': { name: 'GMP+', impressions: 9238, clicks: 145, ctr: 1.57, cpc: 1.06, cost: 153.03, conversions: 2, convRate: 1.38, costPerConv: 76.51 },
        }),
        analysis:
          'Marzo fue el mejor mes de GMP+: 2 conversiones a 76,51 EUR cada una, con CTR de 1,57% sobre 9.238 impresiones.',
      },
      m04: {
        channel: 'Google Ads Search',
        objetivo: 'Generación de leads',
        totals: { impressions: 1522, clicks: 56, ctr: 3.68, cpc: 2.42, cost: 135.41, currency: 'EUR', conversions: 1, convRate: 1.79, costPerConv: 135.41 },
        campaigns: ptMonth({
          'GMP+': { name: 'GMP+', impressions: 1522, clicks: 56, ctr: 3.68, cpc: 2.42, cost: 135.41, conversions: 1, convRate: 1.79, costPerConv: 135.41 },
        }),
        analysis:
          'En abril GMP+ mejoró el CTR a 3,68%, pero con menos volumen (1.522 impresiones) y 1 conversión a 135,41 EUR — coste por conversión más alto que en marzo.',
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
      m08: {
        channel: 'Google Ads Search',
        objetivo: 'Generación de leads',
        totals: { impressions: 858, clicks: 67, ctr: 7.81, cpc: 2104.38, cost: 140993.7, currency: 'ARS', conversions: 0, convRate: 0.0, costPerConv: 0 },
        campaigns: [
          { name: 'Textile', impressions: 427, clicks: 27, ctr: 6.32, cpc: 1549.88, cost: 41846.78, conversions: 0, convRate: 0, costPerConv: 0 },
          { name: 'Forestal', impressions: 152, clicks: 18, ctr: 11.84, cpc: 2671.08, cost: 48079.37, conversions: 0, convRate: 0, costPerConv: 0 },
          { name: 'Smeta', impressions: 109, clicks: 6, ctr: 5.5, cpc: 1902.76, cost: 11416.53, conversions: 0, convRate: 0, costPerConv: 0 },
          { name: 'Bioenergía', impressions: 91, clicks: 10, ctr: 10.99, cpc: 2317.37, cost: 23173.69, conversions: 0, convRate: 0, costPerConv: 0 },
          { name: 'Plásticos', impressions: 69, clicks: 6, ctr: 8.7, cpc: 2746.22, cost: 16477.33, conversions: 0, convRate: 0, costPerConv: 0 },
          { name: 'Biomasa', impressions: 10, clicks: 0, ctr: 0, cpc: 0, cost: 0, conversions: 0, convRate: 0, costPerConv: 0 },
          { name: 'GMP+', impressions: 0, clicks: 0, ctr: 0, cpc: 0, cost: 0, conversions: 0, convRate: 0, costPerConv: 0 },
        ],
        analysis:
          'Agosto completo, primer mes reportado en pesos tras el cambio de cuenta. Textile lideró en alcance con 427 impresiones y 27 clics, mientras que Forestal fue la más efectiva en atracción (CTR 11,84%) y la de mayor gasto (48.079,37 ARS). Bioenergía sostuvo un CTR alto (10,99%) con volumen bajo. Biomasa tuvo 10 impresiones sin clics y GMP+ no registró impresiones. Sin conversiones en el mes. Total: 858 impresiones, 67 clics y 140.993,70 ARS.',
      },
      m09: {
        channel: 'Google Ads Search',
        objetivo: 'Generación de leads',
        totals: { impressions: 2661, clicks: 151, ctr: 5.67, cpc: 2272.2, cost: 343101.45, currency: 'ARS', conversions: 0, convRate: 0, costPerConv: 0 },
        campaigns: [
          { name: 'Textile', impressions: 822, clicks: 40, ctr: 4.87, cpc: 1799.62, cost: 71984.76, conversions: 0, convRate: 0, costPerConv: 0 },
          { name: 'Smeta', impressions: 433, clicks: 25, ctr: 5.77, cpc: 2800.55, cost: 70013.64, conversions: 0, convRate: 0, costPerConv: 0 },
          { name: 'Plásticos', impressions: 400, clicks: 28, ctr: 7, cpc: 2310.9, cost: 64705.26, conversions: 0, convRate: 0, costPerConv: 0 },
          { name: 'Bioenergía', impressions: 380, clicks: 24, ctr: 6.32, cpc: 2620.09, cost: 62882.06, conversions: 0, convRate: 0, costPerConv: 0 },
          { name: 'Forestal', impressions: 571, clicks: 27, ctr: 4.73, cpc: 2060.73, cost: 55639.75, conversions: 0, convRate: 0, costPerConv: 0 },
          { name: 'Biomasa', impressions: 51, clicks: 7, ctr: 13.73, cpc: 2553.71, cost: 17875.98, conversions: 0, convRate: 0, costPerConv: 0 },
          { name: 'GMP+', impressions: 4, clicks: 0, ctr: 0, cpc: 0, cost: 0, conversions: 0, convRate: 0, costPerConv: 0 },
        ],
        analysis:
          'Septiembre completo. La cuenta triplicó el alcance frente a agosto: 2.661 impresiones (+210%) y 151 clics (+125%), con 343.101,45 ARS invertidos. Textile lideró en alcance (822 impresiones) y en gasto (71.984,76 ARS); Plásticos y Bioenergía sostuvieron CTR altos (7,00% y 6,32%) y Biomasa marcó el mejor CTR (13,73%) sobre apenas 51 impresiones. GMP+ tuvo 4 impresiones sin clics. Sin conversiones en el mes. Total: 2.661 impresiones, 151 clics y 343.101,45 ARS.',
      },
    },
  },

  es: {
    name: 'Control Union España',
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
          { name: 'CAEs', impressions: 0, clicks: 0, ctr: 0, cpc: 0, cost: 0, conversions: 0, convRate: 0, costPerConv: 0 },
        ],
        analysis:
          'En junio, IFS volvió a ser la única campaña con conversión (1 conversión a 63,10 EUR) sobre 55 clics y un CTR del 15,03% — la mejor señal del mes. GMP+ concentró el mayor coste (90,72 EUR) con 31 clics pero sin conversiones. Forestal, Textile, Plásticos, Bioenergía, Smeta y Biomasa tuvieron actividad moderada sin conversiones. Total: 2.692 impresiones, 196 clics y 301,65 EUR invertidos.',
      },
      m07: {
        channel: 'Google Ads Search',
        objetivo: 'Generación de leads',
        totals: { impressions: 3320, clicks: 246, ctr: 7.41, cpc: 1.74, cost: 428.91, currency: 'EUR', conversions: 0, convRate: 0, costPerConv: 0 },
        campaigns: [
          { name: 'GMP+', impressions: 619, clicks: 26, ctr: 4.2, cpc: 2.68, cost: 69.62, conversions: 0, convRate: 0, costPerConv: 0 },
          { name: 'CAEs', impressions: 590, clicks: 21, ctr: 3.56, cpc: 2.19, cost: 46.01, conversions: 0, convRate: 0, costPerConv: 0 },
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
      m08: {
        channel: 'Google Ads Search',
        objetivo: 'Generación de leads',
        totals: { impressions: 4154, clicks: 170, ctr: 4.09, cpc: 2205.21, cost: 374884.93, currency: 'ARS', conversions: 1, convRate: 0.59, costPerConv: 374884.93 },
        campaigns: [
          { name: 'CAEs', impressions: 1913, clicks: 63, ctr: 3.29, cpc: 1368.58, cost: 86220.78, conversions: 1, convRate: 1.59, costPerConv: 86220.78 },
          { name: 'IFS', impressions: 1008, clicks: 35, ctr: 3.47, cpc: 2360.11, cost: 82603.95, conversions: 0, convRate: 0, costPerConv: 0 },
          { name: 'Forestal', impressions: 393, clicks: 20, ctr: 5.09, cpc: 2707.28, cost: 54145.59, conversions: 0, convRate: 0, costPerConv: 0 },
          { name: 'Textile', impressions: 354, clicks: 25, ctr: 7.06, cpc: 2730.67, cost: 68266.8, conversions: 0, convRate: 0, costPerConv: 0 },
          { name: 'Smeta', impressions: 318, clicks: 8, ctr: 2.52, cpc: 3477.78, cost: 27822.23, conversions: 0, convRate: 0, costPerConv: 0 },
          { name: 'Plásticos', impressions: 77, clicks: 8, ctr: 10.39, cpc: 3281.1, cost: 26248.77, conversions: 0, convRate: 0, costPerConv: 0 },
          { name: 'Bioenergía', impressions: 69, clicks: 9, ctr: 13.04, cpc: 2707.19, cost: 24364.67, conversions: 0, convRate: 0, costPerConv: 0 },
          { name: 'Biomasa', impressions: 22, clicks: 2, ctr: 9.09, cpc: 2606.07, cost: 5212.14, conversions: 0, convRate: 0, costPerConv: 0 },
          { name: 'GMP+', impressions: 0, clicks: 0, ctr: 0, cpc: 0, cost: 0, conversions: 0, convRate: 0, costPerConv: 0 },
        ],
        analysis:
          'Agosto completo, primer mes reportado en pesos tras el cambio de cuenta. CAEs (renombrada desde "Car" en agosto) lidera la cuenta: 1.913 impresiones, 63 clics y la única conversión del mes, con un coste por lead de 86.220,78 ARS — su primer resultado tras dos meses sin convertir. IFS aportó 1.008 impresiones y 35 clics con el segundo mayor gasto (82.603,95 ARS). Bioenergía tuvo el mejor CTR (13,04%) pero sobre apenas 69 impresiones, y GMP+ no registró impresiones. Total: 4.154 impresiones, 170 clics y 374.884,93 ARS.',
      },
      m09: {
        channel: 'Google Ads Search',
        objetivo: 'Generación de leads',
        totals: { impressions: 6708, clicks: 273, ctr: 4.07, cpc: 1749.16, cost: 477519.76, currency: 'ARS', conversions: 6, convRate: 2.2, costPerConv: 79586.63 },
        campaigns: [
          { name: 'Smeta', impressions: 754, clicks: 36, ctr: 4.77, cpc: 2022.38, cost: 72805.81, conversions: 1, convRate: 2.78, costPerConv: 72805.81 },
          { name: 'CAEs', impressions: 2041, clicks: 57, ctr: 2.79, cpc: 1211.47, cost: 69054.04, conversions: 1, convRate: 1.75, costPerConv: 69054.04 },
          { name: 'IFS', impressions: 1449, clicks: 34, ctr: 2.35, cpc: 2025.25, cost: 68858.37, conversions: 0, convRate: 0, costPerConv: 0 },
          { name: 'Textile', impressions: 667, clicks: 49, ctr: 7.35, cpc: 1397.53, cost: 68478.89, conversions: 0, convRate: 0, costPerConv: 0 },
          { name: 'Forestal', impressions: 976, clicks: 39, ctr: 4, cpc: 1747.57, cost: 68155.26, conversions: 0, convRate: 0, costPerConv: 0 },
          { name: 'Bioenergía', impressions: 421, clicks: 30, ctr: 7.13, cpc: 2083.97, cost: 62519.03, conversions: 2, convRate: 6.67, costPerConv: 31259.51 },
          { name: 'Plásticos', impressions: 310, clicks: 23, ctr: 7.42, cpc: 2280.5, cost: 52451.45, conversions: 2, convRate: 8.7, costPerConv: 26225.72 },
          { name: 'GMP+', impressions: 78, clicks: 2, ctr: 2.56, cpc: 3868.92, cost: 7737.84, conversions: 0, convRate: 0, costPerConv: 0 },
          { name: 'Biomasa', impressions: 12, clicks: 3, ctr: 25, cpc: 2486.36, cost: 7459.07, conversions: 0, convRate: 0, costPerConv: 0 },
        ],
        analysis:
          'Septiembre completo. El volumen creció fuerte frente a agosto: 6.708 impresiones (+61%) y 273 clics (+61%), con 477.519,76 ARS invertidos. Seis conversiones en el mes: Bioenergía y Plásticos aportaron dos cada una (coste por lead de 31.259,51 y 26.225,73 ARS) y Smeta y CAEs, una cada una. CAEs sostuvo el mayor alcance (2.041 impresiones) y Textile el mejor CTR entre las campañas con volumen (7,35%). Biomasa recién tuvo impresiones desde la semana del 21/9 y GMP+ tuvo actividad mínima (78 impresiones, 2 clics). Total: 6.708 impresiones, 273 clics y 477.519,76 ARS.',
      },
    },
  },

  cuc: {
    name: 'Control Union Canadá',
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
          'Primer período cargado de CU Canadá. Canada Gap concentró la actividad (12 clics, 168 impresiones, CTR 7,14%) y Smeta aportó 2 clics. Forestry, GLOBALG.A.P. y Aqua / Fisheries tuvieron impresiones sin clics. Sin conversiones en el mes. Total: 276 impresiones, 14 clics y 22,68 EUR invertidos.',
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
          'Julio completo. Canada Gap lideró en clics (23, CTR 10,13%) y Smeta en coste (50,88 EUR) sin convertir. Forestry aportó el mayor alcance (535 impresiones) con CTR bajo (2,99%). Aqua/Fisheries casi sin actividad. Sin conversiones en el mes. Total: 1.128 impresiones, 65 clics y 142,90 EUR.',
      },
      m08: {
        channel: 'Google Ads Search',
        objetivo: 'Generación de leads',
        totals: { impressions: 911, clicks: 62, ctr: 6.81, cpc: 4339.71, cost: 269062.08, currency: 'ARS', conversions: 1, convRate: 1.61, costPerConv: 269062.08 },
        campaigns: [
          { name: 'Forestry', impressions: 461, clicks: 34, ctr: 7.38, cpc: 4481.03, cost: 152355.05, conversions: 1, convRate: 2.94, costPerConv: 152355.05 },
          { name: 'Canada Gap', impressions: 155, clicks: 14, ctr: 9.03, cpc: 3750.42, cost: 52505.87, conversions: 0, convRate: 0, costPerConv: 0 },
          { name: 'Smeta', impressions: 136, clicks: 4, ctr: 2.94, cpc: 4309.36, cost: 17237.42, conversions: 0, convRate: 0, costPerConv: 0 },
          { name: 'Aqua / Fisheries', impressions: 118, clicks: 8, ctr: 6.78, cpc: 4284.82, cost: 34278.57, conversions: 0, convRate: 0, costPerConv: 0 },
          { name: 'GLOBALG.A.P.', impressions: 41, clicks: 2, ctr: 4.88, cpc: 6342.58, cost: 12685.17, conversions: 0, convRate: 0, costPerConv: 0 },
        ],
        analysis:
          'Agosto completo, primer mes reportado en pesos tras el cambio de cuenta. Forestry concentró la mitad de la cuenta: 461 impresiones, 34 clics y 152.355,05 ARS (57% del coste del mes), y aportó la única conversión, con un coste por lead de 152.355,05 ARS. Canada Gap fue la más eficiente en atracción (CTR 9,03% sobre 155 impresiones) y Smeta la de peor CTR (2,94%). Total: 911 impresiones, 62 clics y 269.062,08 ARS.',
      },
      m09: {
        channel: 'Google Ads Search',
        objetivo: 'Generación de leads',
        totals: { impressions: 2591, clicks: 106, ctr: 4.09, cpc: 3339.79, cost: 354018.2, currency: 'ARS', conversions: 1, convRate: 0.94, costPerConv: 354018.2 },
        campaigns: [
          { name: 'Forestry', impressions: 1270, clicks: 34, ctr: 2.68, cpc: 4160.81, cost: 141467.62, conversions: 0, convRate: 0, costPerConv: 0 },
          { name: 'Canada Gap', impressions: 486, clicks: 30, ctr: 6.17, cpc: 2297.6, cost: 68927.91, conversions: 0, convRate: 0, costPerConv: 0 },
          { name: 'Smeta', impressions: 413, clicks: 18, ctr: 4.36, cpc: 2835.98, cost: 51047.62, conversions: 0, convRate: 0, costPerConv: 0 },
          { name: 'GLOBALG.A.P.', impressions: 338, clicks: 13, ctr: 3.85, cpc: 3693.54, cost: 48016.08, conversions: 1, convRate: 7.69, costPerConv: 48016.08 },
          { name: 'Aqua / Fisheries', impressions: 84, clicks: 11, ctr: 13.1, cpc: 4050.82, cost: 44558.97, conversions: 0, convRate: 0, costPerConv: 0 },
        ],
        analysis:
          'Septiembre completo. Frente a agosto, 2.591 impresiones (+184%) y 106 clics (+71%), con 354.018,20 ARS invertidos. GLOBALG.A.P. aportó la única conversión del mes (48.016,08 ARS por lead). Forestry concentró el 40% del gasto (141.467,62 ARS) y el mayor alcance (1.270 impresiones), pero con el CTR más bajo de la cuenta (2,68%). Aqua / Fisheries tuvo el mejor CTR (13,10%) sobre 84 impresiones. Total: 2.591 impresiones, 106 clics y 354.018,20 ARS.',
      },
    },
  },

  psar: {
    name: 'Peterson Solutions Argentina',
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
      m08: {
        channel: 'Google Ads Search',
        objetivo: 'Generación de leads',
        totals: { impressions: 11507, clicks: 503, ctr: 4.37, cpc: 696.07, cost: 350121.76, currency: 'ARS', conversions: 0, convRate: 0.0, costPerConv: 0 },
        campaigns: [
          { name: 'SuSo - Agricultura regenerativa', impressions: 5561, clicks: 348, ctr: 6.26, cpc: 297.03, cost: 103366.25, conversions: 0, convRate: 0, costPerConv: 0 },
          { name: 'SuSe - Huella de carbono / GEI', impressions: 2552, clicks: 69, ctr: 2.7, cpc: 1306.07, cost: 90118.53, conversions: 0, convRate: 0, costPerConv: 0 },
          { name: 'Bioenergía / Biocombustibles', impressions: 1981, clicks: 29, ctr: 1.46, cpc: 1525.44, cost: 44237.8, conversions: 0, convRate: 0, costPerConv: 0 },
          { name: 'SuSe - ESG / Reportes', impressions: 1029, clicks: 41, ctr: 3.98, cpc: 1622.94, cost: 66540.72, conversions: 0, convRate: 0, costPerConv: 0 },
          { name: 'SuSe - Huella de agua', impressions: 157, clicks: 9, ctr: 5.73, cpc: 3565.65, cost: 32090.81, conversions: 0, convRate: 0, costPerConv: 0 },
          { name: 'SuSo - Abastecimiento sostenible', impressions: 144, clicks: 5, ctr: 3.47, cpc: 1152.59, cost: 5762.95, conversions: 0, convRate: 0, costPerConv: 0 },
          { name: 'SuSo - Trazabilidad / EUDR', impressions: 75, clicks: 2, ctr: 2.67, cpc: 4002.35, cost: 8004.7, conversions: 0, convRate: 0, costPerConv: 0 },
          { name: 'CeSu - Preparacion para certificaciones', impressions: 8, clicks: 0, ctr: 0, cpc: 0, cost: 0, conversions: 0, convRate: 0, costPerConv: 0 },
        ],
        analysis:
          'Agosto completo, primer mes reportado en pesos tras el cambio de cuenta. SuSo - Agricultura regenerativa fue el motor del mes: 5.561 impresiones y 348 de los 503 clics de la cuenta (CTR 6,26%) al CPC más bajo (297,03 ARS). Le siguieron Huella de carbono / GEI (2.552 impresiones, 69 clics) y Bioenergía / Biocombustibles, que con 1.981 impresiones solo logró 29 clics (CTR 1,46%, el más bajo). CeSu - Preparación para certificaciones quedó casi sin actividad (8 impresiones). Sin conversiones en el mes. Total: 11.507 impresiones, 503 clics y 350.121,76 ARS.',
      },
      m09: {
        channel: 'Google Ads Search',
        objetivo: 'Generación de leads',
        totals: { impressions: 17062, clicks: 324, ctr: 1.9, cpc: 1105.63, cost: 358222.62, currency: 'ARS', conversions: 0, convRate: 0, costPerConv: 0 },
        campaigns: [
          { name: 'Bioenergía / Biocombustibles', impressions: 2670, clicks: 45, ctr: 1.69, cpc: 1544.92, cost: 69521.35, conversions: 0, convRate: 0, costPerConv: 0 },
          { name: 'SuSo - Agricultura regenerativa', impressions: 7676, clicks: 134, ctr: 1.75, cpc: 515.91, cost: 69132.09, conversions: 0, convRate: 0, costPerConv: 0 },
          { name: 'SuSe - Huella de carbono / GEI', impressions: 3838, clicks: 65, ctr: 1.69, cpc: 1050.71, cost: 68295.87, conversions: 0, convRate: 0, costPerConv: 0 },
          { name: 'SuSe - ESG / Reportes', impressions: 1888, clicks: 45, ctr: 2.38, cpc: 1500.42, cost: 67518.7, conversions: 0, convRate: 0, costPerConv: 0 },
          { name: 'SuSe - Huella de agua', impressions: 494, clicks: 24, ctr: 4.86, cpc: 2602.52, cost: 62460.37, conversions: 0, convRate: 0, costPerConv: 0 },
          { name: 'CeSu - Preparacion para certificaciones', impressions: 194, clicks: 4, ctr: 2.06, cpc: 2533.92, cost: 10135.68, conversions: 0, convRate: 0, costPerConv: 0 },
          { name: 'SuSo - Trazabilidad / EUDR', impressions: 119, clicks: 5, ctr: 4.2, cpc: 1608.24, cost: 8041.2, conversions: 0, convRate: 0, costPerConv: 0 },
          { name: 'SuSo - Abastecimiento sostenible', impressions: 183, clicks: 2, ctr: 1.09, cpc: 1558.68, cost: 3117.36, conversions: 0, convRate: 0, costPerConv: 0 },
        ],
        analysis:
          'Septiembre completo. Las impresiones subieron a 17.062 (+48% frente a agosto) pero los clics bajaron a 324 (−36%): el CTR de la cuenta cayó de 4,37% a 1,90%, con 358.222,62 ARS invertidos. SuSo - Agricultura regenerativa concentró el 45% de las impresiones (7.676) y 134 clics, con el CPC más bajo de la cuenta (515,91 ARS). SuSe - Huella de agua tuvo el mejor CTR (4,86%). Sin conversiones en el mes. Total: 17.062 impresiones, 324 clics y 358.222,62 ARS.',
      },
    },
  },

  // CU Estados Unidos — cuenta nueva: arranca en agosto 2026 con las dos
  // campañas de Organic (USDA NOP y PrimusGFS), creadas el 21/8.
  cuus: {
    name: 'Control Union Estados Unidos',
    periods: {
      m08: {
        channel: 'Google Ads Search',
        objetivo: 'Generación de leads',
        totals: { impressions: 179, clicks: 12, ctr: 6.7, cpc: 7443.52, cost: 89322.29, currency: 'ARS', conversions: 0, convRate: 0.0, costPerConv: 0 },
        campaigns: [
          { name: 'Organic - USDA NOP', startedOn: '2026-08-21', impressions: 129, clicks: 8, ctr: 6.2, cpc: 7922.62, cost: 63380.93, conversions: 0, convRate: 0, costPerConv: 0 },
          { name: 'Organic - PrimusGFS', startedOn: '2026-08-21', impressions: 50, clicks: 4, ctr: 8.0, cpc: 6485.34, cost: 25941.36, conversions: 0, convRate: 0, costPerConv: 0 },
        ],
        analysis:
          'Primer mes de la cuenta. Las dos campañas se crearon el 21 de agosto, así que las métricas cubren 11 de los 31 días del mes y no son comparables con las de una cuenta en régimen. Organic - USDA NOP concentró el grueso de la actividad (129 impresiones, 8 clics, 63.380,93 ARS) y Organic - PrimusGFS el mejor CTR (8,00% sobre 50 impresiones). El gasto y todos los clics se produjeron entre el 24 y el 30 de agosto; ninguna de las dos registró actividad el 31. Sin conversiones todavía. Total: 179 impresiones, 12 clics y 89.322,29 ARS.',
      },
      m09: {
        channel: 'Google Ads Search',
        objetivo: 'Generación de leads',
        totals: { impressions: 452, clicks: 32, ctr: 7.08, cpc: 7529.51, cost: 240944.29, currency: 'ARS', conversions: 0, convRate: 0, costPerConv: 0 },
        campaigns: [
          { name: 'Organic - USDA NOP', impressions: 449, clicks: 32, ctr: 7.13, cpc: 7529.51, cost: 240944.29, conversions: 0, convRate: 0, costPerConv: 0 },
          { name: 'Organic - PrimusGFS', impressions: 3, clicks: 0, ctr: 0, cpc: 0, cost: 0, conversions: 0, convRate: 0, costPerConv: 0 },
          { name: 'IFPA event', impressions: 0, clicks: 0, ctr: 0, cpc: 0, cost: 0, conversions: 0, convRate: 0, costPerConv: 0 },
        ],
        analysis:
          'Primer mes completo de la cuenta. Toda la actividad la hizo Organic - USDA NOP: 449 impresiones, 32 clics (CTR 7,13%) y 240.944,29 ARS, con un CPC de 7.529,51 ARS, el más alto de todas las cuentas. Organic - PrimusGFS registró apenas 3 impresiones sin clics. Sin conversiones todavía. Total: 452 impresiones, 32 clics y 240.944,29 ARS.',
      },
    },
  },
  cuar: {
    name: 'Control Union Argentina',
    periods: {
      m09: {
        channel: 'Google Ads Search',
        objetivo: 'Generación de leads',
        totals: { impressions: 2031, clicks: 112, ctr: 5.51, cpc: 1466, cost: 164191.66, currency: 'ARS', conversions: 1, convRate: 0.89, costPerConv: 164191.66 },
        campaigns: [
          { name: 'Agroexportación', impressions: 1055, clicks: 68, ctr: 6.45, cpc: 1401.57, cost: 95306.47, conversions: 1, convRate: 1.47, costPerConv: 95306.47 },
          { name: 'GHG', impressions: 513, clicks: 24, ctr: 4.68, cpc: 1834.12, cost: 44018.89, conversions: 0, convRate: 0, costPerConv: 0 },
          { name: 'Biocombustible', impressions: 210, clicks: 11, ctr: 5.24, cpc: 1364.13, cost: 15005.41, conversions: 0, convRate: 0, costPerConv: 0 },
          { name: 'Industria', impressions: 215, clicks: 8, ctr: 3.72, cpc: 1220.79, cost: 9766.3, conversions: 0, convRate: 0, costPerConv: 0 },
          { name: 'Agro sostenible', impressions: 20, clicks: 1, ctr: 5, cpc: 94.59, cost: 94.59, conversions: 0, convRate: 0, costPerConv: 0 },
          { name: 'Cadena de Custodia', impressions: 18, clicks: 0, ctr: 0, cpc: 0, cost: 0, conversions: 0, convRate: 0, costPerConv: 0 },
        ],
        analysis:
          'Primer mes de Google Ads de la cuenta, con seis campañas. Agroexportación concentró el 52% de las impresiones (1.055), 68 clics y la única conversión del mes (95.306,47 ARS por lead). GHG sumó 513 impresiones y 24 clics; Biocombustible e Industria tuvieron volumen menor. Agro sostenible y Cadena de Custodia recién registraron impresiones en la semana del 28/9 (20 y 18). Total: 2.031 impresiones, 112 clics y 164.191,66 ARS.',
      },
    },
  },
  pcues: {
    name: 'PCU España',
    periods: {
      m09: {
        channel: 'Google Ads Search',
        objetivo: 'Generación de leads',
        totals: { impressions: 5671, clicks: 373, ctr: 6.58, cpc: 1066.1, cost: 397655.58, currency: 'ARS', conversions: 1, convRate: 0.27, costPerConv: 397655.58 },
        campaigns: [
          { name: 'ISO 27001', impressions: 5480, clicks: 360, ctr: 6.57, cpc: 975.03, cost: 351010.31, conversions: 1, convRate: 0.28, costPerConv: 351010.31 },
          { name: 'Competidores ISO 27001', impressions: 191, clicks: 13, ctr: 6.81, cpc: 3588.1, cost: 46645.27, conversions: 0, convRate: 0, costPerConv: 0 },
        ],
        analysis:
          'Primer mes de la cuenta (campañas de ISO 27001 con marca PCU). ISO 27001 concentró casi todo: 5.480 impresiones, 360 clics (CTR 6,57%, CPC 975,03 ARS) y la única conversión del mes (351.010,31 ARS por lead). Competidores ISO 27001 sumó 191 impresiones y 13 clics, con un CPC más alto (3.588,10 ARS). Total: 5.671 impresiones, 373 clics y 397.655,58 ARS.',
      },
    },
  },
  pcuar: {
    name: 'PCU Argentina',
    periods: {
      m09: {
        channel: 'Google Ads Search',
        objetivo: 'Generación de leads',
        totals: { impressions: 2895, clicks: 159, ctr: 5.49, cpc: 1949.63, cost: 309991.29, currency: 'ARS', conversions: 1, convRate: 0.63, costPerConv: 309991.29 },
        campaigns: [
          { name: 'ISO 27001', impressions: 2597, clicks: 150, ctr: 5.78, cpc: 1954.95, cost: 293242.54, conversions: 1, convRate: 0.67, costPerConv: 293242.54 },
          { name: 'Competidores ISO 27001', impressions: 298, clicks: 9, ctr: 3.02, cpc: 1860.97, cost: 16748.75, conversions: 0, convRate: 0, costPerConv: 0 },
        ],
        analysis:
          'Primer mes de la cuenta (campañas de ISO 27001 con marca PCU). ISO 27001 hizo 2.597 impresiones y 150 clics (CTR 5,78%) y aportó la única conversión del mes (293.242,54 ARS por lead). Competidores ISO 27001 sumó 298 impresiones y 9 clics (CTR 3,02%). Total: 2.895 impresiones, 159 clics y 309.991,29 ARS.',
      },
    },
  },
};
