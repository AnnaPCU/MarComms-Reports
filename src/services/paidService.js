// SERVICE — Pilar Paid Media (Google Ads, Meta Ads). Mensual.
// Lee de Supabase cuando está configurado; si no, del seed local.
import { supabase } from '@/lib/supabaseClient';
import { PAID_CLIENTS, PAID_DB } from '@/data/paidSeed';
import { MONTHS_2026 } from '@/constants/periods';

export function listAccounts() {
  return PAID_CLIENTS;
}

export function listPeriods() {
  return MONTHS_2026;
}

export function getMonthly(accountId, periodId) {
  return PAID_DB[accountId]?.periods?.[periodId] ?? null;
}

export function hasDataFor(account, period) {
  return Boolean(getMonthly(account, period));
}

// ── Lectura desde Supabase (mismo shape que el seed) ──
const n = (v) => (v == null ? 0 : Number(v));

export async function fetchMonthly(account, period) {
  if (!supabase) return getMonthly(account, period);
  const { data: m } = await supabase
    .from('paid_metrics')
    .select('*')
    .eq('client_id', account)
    .eq('period_id', period)
    .maybeSingle();
  if (!m) return null;
  const { data: camps } = await supabase
    .from('paid_campaigns')
    .select('*')
    .eq('client_id', account)
    .eq('period_id', period);
  return {
    channel: m.channel,
    objetivo: m.objetivo,
    analysis: m.analysis,
    totals: {
      impressions: n(m.impressions),
      clicks: n(m.clicks),
      ctr: n(m.ctr),
      cpc: n(m.cpc),
      cost: n(m.cost),
      currency: m.currency || 'EUR',
      conversions: n(m.conversions),
      convRate: n(m.conversion_rate),
      costPerConv: n(m.cost_per_conv),
    },
    campaigns: (camps ?? [])
      .slice()
      .sort((a, b) => n(b.impressions) - n(a.impressions))
      .map((c) => ({
        name: c.name,
        impressions: n(c.impressions),
        clicks: n(c.clicks),
        ctr: n(c.ctr),
        cpc: n(c.cpc),
        cost: n(c.cost),
        conversions: n(c.conversions),
        convRate: n(c.conversion_rate),
        costPerConv: n(c.cost_per_conv),
        optLevel: c.opt_level == null ? null : n(c.opt_level),
      })),
  };
}
