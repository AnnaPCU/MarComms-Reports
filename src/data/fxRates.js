// ════════════════════════════════════════════════════════════════
//  TIPOS DE CAMBIO — para descargar los reportes mensuales de Paid Media
//  en otra moneda (ARS / USD / EUR). La app siempre muestra la moneda
//  original del export (cómo factura Google Ads); la conversión es SOLO
//  una opción del descargable, como importe aproximado de referencia
//  (docs/DECISIONES.md §19).
//
//  Criterio, al CIERRE del último día hábil del mes del reporte:
//  · USD: dólar oficial Banco de la Nación Argentina, billete VENDEDOR
//    (ARS por 1 USD), validado en 2+ fuentes.
//  · usdPerEur: cambio oficial euro/dólar del Banco Central Europeo de ese
//    día (resolución del Banco de España en el BOE).
//  · EUR (ARS por 1 EUR) = USD × usdPerEur. El euro billete del BNA no se
//    publica de forma consistente en fuentes verificables, así que el euro se
//    calcula con el dólar BNA y el euro/dólar oficial del BCE.
//  Se cargan al procesar las métricas del mes (metricas/paid-media/README.md).
// ════════════════════════════════════════════════════════════════

export const FX_RATES = {
  // 27/02: Ámbito (cierre BNA) · Rava · Diario de Cuyo · BCE BOE-A-2026-4777
  m02: { date: '2026-02-27', USD: 1420, usdPerEur: 1.1805 },
  // 31/03: Rava · Diario Río Negro · Dólar Histórico · BCE BOE-A-2026-7431
  m03: { date: '2026-03-31', USD: 1405, usdPerEur: 1.1498 },
  // 30/04: Rava · Río Negro · Perfil · indicadores.ar (Ámbito, Infobae y
  // La Nación dan 1.410) · BCE BOE-A-2026-9519
  m04: { date: '2026-04-30', USD: 1405, usdPerEur: 1.1702 },
  // 29/05: La Nación (cierre BNA) · Rava · Dólar Histórico · BCE BOE-A-2026-11690
  m05: { date: '2026-05-29', USD: 1430, usdPerEur: 1.1644 },
  // 30/06: Rava · Dólar Histórico · BCE BOE-A-2026-14328
  m06: { date: '2026-06-30', USD: 1500, usdPerEur: 1.1394 },
  // 31/07: Ámbito (cierre BNA) · Rava · Qpasó · La Nación · BCE BOE-A-2026-16840
  m07: { date: '2026-07-31', USD: 1510, usdPerEur: 1.1485 },
  // 31/08: Rava (cierre) · La Nación (BNA, 17 h) · BCE BOE-A-2026-18423
  m08: { date: '2026-08-31', USD: 1530, usdPerEur: 1.1596 },
  // 30/09: Ámbito (cierre) · Rava · Estudio de la Mano · BCE BOE-A-2026-20464
  m09: { date: '2026-09-30', USD: 1540, usdPerEur: 1.1355 },
};
