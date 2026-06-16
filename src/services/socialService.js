// ════════════════════════════════════════════════════════════════
//  SERVICE — Pilar Social Media (LinkedIn)
//
//  Capa de acceso a datos. La UI NUNCA toca el seed ni Supabase directo:
//  habla con este service a través del hook useSocialData.
//
//  Estado actual: Supabase aún no configurado → lee del SEED LOCAL
//  (Mayo 2026). Cuando exista el proyecto Supabase, cada función gana su
//  rama `if (supabase) { ... }` consultando las tablas social_* y los
//  parsers de import escribirán ahí. La firma pública no cambia.
// ════════════════════════════════════════════════════════════════

import { supabase } from '@/lib/supabaseClient';
import { DB, ML, MO } from '@/data/socialSeed';
import { monthHasData } from '@/utils/hasData';

// ── Cuentas (clientes del pilar Social) ──
export function listAccounts() {
  return Object.entries(DB).map(([id, d]) => ({ id, name: d.name }));
}

// ── Períodos seleccionables ──
export function listPeriods() {
  return MO.map((id) => ({ id, label: ML[id] }));
}

// ── Datos mensuales de una cuenta para un período ──
// Devuelve el objeto mensual (o null). Puede traer `_nodata: true`.
export function getMonthly(accountId, periodId) {
  const acc = DB[accountId];
  if (!acc) return null;
  return acc.mo?.[periodId] ?? null;
}

// Período anterior (para los deltas), solo si existe y TIENE datos.
// (Si el mes previo es _nodata, devolvemos null para no calcular deltas NaN.)
export function getPrevMonthly(accountId, periodId) {
  const i = MO.indexOf(periodId);
  if (i <= 0) return null;
  const prev = getMonthly(accountId, MO[i - 1]);
  return monthHasData(prev) ? prev : null;
}

// ── ¿Hay datos para (cuenta, período)? (para el badge del header) ──
export function hasDataFor(account, period) {
  if (period === 'cmp') return true;
  return monthHasData(getMonthly(account, period));
}

// ── Audiencia (distribuciones de la cuenta) ──
export function getAudience(accountId) {
  const acc = DB[accountId];
  if (!acc) return { seniority: [], jobFunction: [] };
  return { seniority: acc.sen ?? [], jobFunction: acc.job ?? [] };
}

// ════════════════════════════════════════════════════════════════
//  LECTURA DESDE SUPABASE (cuando está configurado)
//  Devuelven el MISMO shape que el seed para que la UI no cambie.
// ════════════════════════════════════════════════════════════════

function rowToMonthly(metrics, posts) {
  if (!metrics) return null;
  return {
    imp: metrics.impressions,
    clk: metrics.clicks,
    er: metrics.engagement_rate,
    vis: metrics.profile_visits,
    fol: metrics.new_followers,
    posts: (posts ?? []).map((r) => ({
      t: r.title,
      p: r.esg_pillar,
      imp: r.impressions,
      er: r.engagement_rate,
      clk: r.clicks,
      tp: r.post_type,
      url: r.url,
    })),
  };
}

export async function fetchMonthly(account, period) {
  if (!supabase) return getMonthly(account, period);
  if (period === 'cmp') return null;
  const { data: metrics } = await supabase
    .from('social_metrics')
    .select('*')
    .eq('client_id', account)
    .eq('period_id', period)
    .maybeSingle();
  if (!metrics) return null;
  const { data: posts } = await supabase
    .from('social_posts')
    .select('*')
    .eq('client_id', account)
    .eq('period_id', period);
  return rowToMonthly(metrics, posts);
}

export async function fetchAudience(account) {
  if (!supabase) return getAudience(account);
  const { data } = await supabase
    .from('social_audience')
    .select('*')
    .eq('client_id', account);
  const rows = data ?? [];
  return {
    seniority: rows.filter((r) => r.dimension === 'seniority').map((r) => ({ l: r.label, v: r.value })),
    jobFunction: rows.filter((r) => r.dimension === 'function').map((r) => ({ l: r.label, v: r.value })),
  };
}

export function prevPeriodId(period) {
  const i = MO.indexOf(period);
  return i > 0 ? MO[i - 1] : null;
}

// ── Insights pre-cargados (vista anual) ──
export function getAnnualInsights(accountId) {
  return DB[accountId]?.ai ?? [];
}

// ── Comparativa multi-cuenta (efectividad, Mayo 2026) ──
export { CMP_DATA, TOP_ENG_POSTS } from '@/data/socialSeed';

// Flag para que la UI sepa de dónde vienen los datos.
export const usingLiveData = Boolean(supabase);
