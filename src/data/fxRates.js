// ════════════════════════════════════════════════════════════════
//  TIPOS DE CAMBIO — para descargar los reportes de Paid Media en otra
//  moneda (ARS / USD / EUR). La app siempre muestra la moneda original
//  del export (cómo factura Google Ads); la conversión es SOLO una opción
//  del descargable, como importe aproximado de referencia
//  (docs/DECISIONES.md §19).
//
//  Criterio: Banco de la Nación Argentina, billete VENDEDOR, al CIERRE del
//  último día hábil de cada mes. Valores en ARS por 1 unidad.
//  Se cargan al procesar las métricas del mes (metricas/paid-media/README.md):
//  validar cada valor en al menos 2 fuentes; si una sola fuente da el valor
//  del BNA, cruzarlo con dólar BNA × euro/dólar oficial del BCE y anotarlo.
// ════════════════════════════════════════════════════════════════

export const FX_RATES = {
  m08: {
    date: '2026-08-31',
    USD: 1530, // Rava histórico (cierre 31/08) · La Nación (BNA, 17 h)
    EUR: 1800, // Perfil (pizarra BNA) · La Nación; cruce 1530 × 1,1596 (BCE) = 1774
  },
  m09: {
    date: '2026-09-30',
    USD: 1540, // Ámbito (cierre) · Rava histórico · Estudio de la Mano (compra 1490)
    EUR: 1765, // Perfil (pizarra BNA); cruce 1540 × 1,1355 (BCE) = 1749
  },
};
