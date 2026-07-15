// ════════════════════════════════════════════════════════════════
//  FUENTE DE DATOS — seed en código (Supabase descartado)
//
//  Los reportes se sirven desde el seed en código (src/data/*). Ese seed viaja
//  en el bundle publicado, por lo que es idéntico y persistente para TODOS los
//  visitantes (cualquier navegador o dispositivo), sin base de datos ni backend.
//  La carga de datos se hace por código (commit → deploy), no desde la UI.
//
//  Antes existía un modo Supabase (lectura en vivo + realtime + import desde la
//  web). Se descartó porque el requisito —que los datos persistan para cualquiera
//  que entre desde un navegador— ya lo cumple el seed en código. Las funciones de
//  los services detectan `supabase === null` y leen del seed.
//
//  ¿Reconectar una base a futuro? Restaurar acá el `createClient(...)` con las env
//  vars VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY y volver a habilitar el
//  camino `if (supabase)` en los services/hooks.
// ════════════════════════════════════════════════════════════════

export const isSupabaseConfigured = false;
export const supabase = null;
