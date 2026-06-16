-- ════════════════════════════════════════════════════════════════
--  0003_paid.sql — Pilar Paid Media (Google Ads, Meta Ads). Mensual.
--  Clientes propios del pilar (markets como 'España'). No compartidos.
-- ════════════════════════════════════════════════════════════════

create table if not exists public.paid_clients (
  id         text primary key,            -- slug: 'es', ...
  name       text not null,
  sort_order integer default 0,
  is_active  boolean not null default true,
  created_at timestamptz not null default now()
);

-- Totales por cliente + período + plataforma.
create table if not exists public.paid_metrics (
  id               uuid primary key default gen_random_uuid(),
  client_id        text not null references public.paid_clients(id) on delete cascade,
  period_id        text not null references public.periods(id),
  platform         text not null default 'google_ads', -- 'google_ads' | 'meta_ads'
  channel          text,                  -- 'Google Ads Search'
  objetivo         text,                  -- 'Generación de leads'
  impressions      integer,
  clicks           integer,
  ctr              numeric,
  cpc              numeric,
  cost             numeric,
  currency         text default 'EUR',
  conversions      numeric,
  conversion_rate  numeric,
  cost_per_conv    numeric,
  analysis         text,
  import_id        uuid references public.imports(id),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  unique (client_id, period_id, platform)
);

-- Desglose por campaña.
create table if not exists public.paid_campaigns (
  id              uuid primary key default gen_random_uuid(),
  client_id       text not null references public.paid_clients(id) on delete cascade,
  period_id       text not null references public.periods(id),
  platform        text not null default 'google_ads',
  name            text not null,
  impressions     integer,
  clicks          integer,
  ctr             numeric,
  cpc             numeric,
  cost            numeric,
  conversions     numeric,
  conversion_rate numeric,
  cost_per_conv   numeric,
  opt_level       numeric,                -- nivel de optimización %
  import_id       uuid references public.imports(id),
  created_at      timestamptz not null default now()
);

create index if not exists paid_metrics_client_period_idx on public.paid_metrics (client_id, period_id);
create index if not exists paid_campaigns_client_period_idx on public.paid_campaigns (client_id, period_id);

drop trigger if exists paid_metrics_set_updated_at on public.paid_metrics;
create trigger paid_metrics_set_updated_at
  before update on public.paid_metrics
  for each row execute function public.set_updated_at();

alter table public.paid_clients   enable row level security;
alter table public.paid_metrics   enable row level security;
alter table public.paid_campaigns enable row level security;

create policy "auth full access paid_clients" on public.paid_clients
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth full access paid_metrics" on public.paid_metrics
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth full access paid_campaigns" on public.paid_campaigns
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

alter publication supabase_realtime add table public.paid_clients;
alter publication supabase_realtime add table public.paid_metrics;
alter publication supabase_realtime add table public.paid_campaigns;
