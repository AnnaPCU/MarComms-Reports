import { createClient } from '@supabase/supabase-js';

// Cliente único de Supabase.
//
// Si faltan las env vars, NO falla: exporta `supabase = null` y la app entra en
// "modo seed local" (los services caen al seed embebido de Mayo 2026). Esto
// permite desarrollar sin un proyecto Supabase todavía (decisión confirmada).

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const isSupabaseConfigured = Boolean(url && key);

export const supabase = isSupabaseConfigured
  ? createClient(url, key, {
      auth: { persistSession: true, autoRefreshToken: true },
    })
  : null;

if (!isSupabaseConfigured && import.meta.env.DEV) {
  // eslint-disable-next-line no-console
  console.info(
    '[Reports] Supabase no configurado — corriendo en modo SEED LOCAL (Mayo 2026, solo lectura).',
  );
}
