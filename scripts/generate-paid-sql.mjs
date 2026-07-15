// Genera supabase/seed/0004_paid.sql a partir del seed JS (fuente única de verdad).
// Uso: node scripts/generate-paid-sql.mjs
import { PAID_CLIENTS, PAID_DB } from '../src/data/paidSeed.js';
import { writeFileSync } from 'node:fs';

const q = (v) => (v == null ? 'null' : `'${String(v).replace(/'/g, "''")}'`);
const n = (v) => (v == null ? 'null' : Number(v));
const PLATFORM = 'google_ads';
const CLIENT_NAME = { es: 'CU España', pt: 'CU Portugal', cuc: 'CU Canadá', psar: 'PS Argentina' };

let out = `-- ════════════════════════════════════════════════════════════════
--  seed/0004_paid.sql — Pilar Paid Media (Google Ads Search)
--  GENERADO automáticamente desde src/data/paidSeed.js
--  (no editar a mano: correr scripts/generate-paid-sql.mjs).
--  Idempotente: se puede volver a correr.
-- ════════════════════════════════════════════════════════════════

-- Clientes del pilar Paid
insert into public.paid_clients (id, name, sort_order) values
${PAID_CLIENTS.map((c, i) => `  (${q(c.id)}, ${q(c.name)}, ${i + 1})`).join(',\n')}
on conflict (id) do nothing;

-- Limpiar lo existente de estos clientes (platform google_ads) para recargar sin duplicar
delete from public.paid_campaigns
  where platform = ${q(PLATFORM)}
    and client_id in (${PAID_CLIENTS.map((c) => q(c.id)).join(', ')});

`;

const metricRows = [];
const campaignRows = [];

for (const [clientId, client] of Object.entries(PAID_DB)) {
  for (const [periodId, p] of Object.entries(client.periods)) {
    const t = p.totals;
    metricRows.push(
      `  (${q(clientId)}, ${q(periodId)}, ${q(PLATFORM)}, ${q(p.channel)}, ${q(p.objetivo)}, ` +
        `${n(t.impressions)}, ${n(t.clicks)}, ${n(t.ctr)}, ${n(t.cpc)}, ${n(t.cost)}, ${q(t.currency || 'EUR')}, ` +
        `${n(t.conversions)}, ${n(t.convRate)}, ${n(t.costPerConv)}, ${q(p.analysis)})`,
    );
    for (const c of p.campaigns) {
      campaignRows.push(
        `  (${q(clientId)}, ${q(periodId)}, ${q(PLATFORM)}, ${q(c.name)}, ` +
          `${n(c.impressions)}, ${n(c.clicks)}, ${n(c.ctr)}, ${n(c.cpc)}, ${n(c.cost)}, ` +
          `${n(c.conversions)}, ${n(c.convRate)}, ${n(c.costPerConv)}, ${c.optLevel == null ? 'null' : n(c.optLevel)})`,
      );
    }
  }
}

out += `-- Totales por período (upsert)
insert into public.paid_metrics
  (client_id, period_id, platform, channel, objetivo, impressions, clicks, ctr, cpc, cost, currency, conversions, conversion_rate, cost_per_conv, analysis) values
${metricRows.join(',\n')}
on conflict (client_id, period_id, platform) do update set
  channel = excluded.channel, objetivo = excluded.objetivo,
  impressions = excluded.impressions, clicks = excluded.clicks, ctr = excluded.ctr,
  cpc = excluded.cpc, cost = excluded.cost, currency = excluded.currency,
  conversions = excluded.conversions, conversion_rate = excluded.conversion_rate,
  cost_per_conv = excluded.cost_per_conv, analysis = excluded.analysis;

-- Campañas
insert into public.paid_campaigns
  (client_id, period_id, platform, name, impressions, clicks, ctr, cpc, cost, conversions, conversion_rate, cost_per_conv, opt_level) values
${campaignRows.join(',\n')};
`;

writeFileSync(new URL('../supabase/seed/0004_paid.sql', import.meta.url), out);
console.log(`OK → supabase/seed/0004_paid.sql (${metricRows.length} períodos, ${campaignRows.length} campañas)`);
