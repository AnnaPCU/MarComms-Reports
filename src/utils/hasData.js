// ════════════════════════════════════════════════════════════════
//  REGLA DE HONESTIDAD DE DATOS (requisito firme — ver CLAUDE.md)
//
//  Si un período/pilar no tiene datos importados → "Sin información
//  suficiente". NUNCA inventar ni estimar números.
//
//  Este helper centraliza la verificación para aplicarla de forma
//  uniforme en los 5 pilares. La ausencia de datos se determina por
//  ausencia de filas reales (no por flags inventados).
// ════════════════════════════════════════════════════════════════

// Un registro mensual cuenta como "con datos" solo si existe y no está
// marcado como vacío. (En el seed, los meses sin datos son `_nodata`.)
export function monthHasData(monthly) {
  if (!monthly) return false;
  if (monthly._nodata === true) return false;
  // Debe tener al menos una métrica real.
  return (
    monthly.imp != null ||
    monthly.clk != null ||
    (Array.isArray(monthly.posts) && monthly.posts.length > 0)
  );
}

// Verifica si hay datos para un (registro genérico de métricas).
// Acepta array (filas de Supabase) u objeto mensual del seed.
export function hasData(input) {
  if (Array.isArray(input)) return input.length > 0;
  return monthHasData(input);
}

export const NO_DATA_MESSAGE = 'Sin información suficiente';
