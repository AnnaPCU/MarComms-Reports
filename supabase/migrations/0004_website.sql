-- ════════════════════════════════════════════════════════════════
--  0004_website.sql — Pilar Website (GA4 + Search Console). TRIMESTRAL.
--  Usa períodos con granularity='quarter'. Clientes propios del pilar.
-- ════════════════════════════════════════════════════════════════

create table if not exists public.web_clients (
  id         text primary key,            -- slug: 'cua'
  name       text not null,
  handle     text,                        -- '@controlunionargentina'
  sort_order integer default 0,
  is_active  boolean not null default true,
  created_at timestamptz not null default now()
);

-- Website / tráfico (Google Analytics).
create table if not exists public.web_site_metrics (
  id             uuid primary key default gen_random_uuid(),
  client_id      text not null references public.web_clients(id) on delete cascade,
  period_id      text not null references public.periods(id),
  single_traffic integer,                 -- visitantes únicos
  total_traffic  integer,                 -- sesiones / visitas
  impressions    integer,                 -- page views
  conversions    integer,
  analysis       text,
  import_id      uuid references public.imports(id),
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  unique (client_id, period_id)
);

-- SEO (Search Console).
create table if not exists public.web_seo_metrics (
  id               uuid primary key default gen_random_uuid(),
  client_id        text not null references public.web_clients(id) on delete cascade,
  period_id        text not null references public.periods(id),
  average_position numeric,
  impressions      integer,
  total_clicks     integer,
  analysis         text,
  import_id        uuid references public.imports(id),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  unique (client_id, period_id)
);

create table if not exists public.web_top_pages (
  id         uuid primary key default gen_random_uuid(),
  client_id  text not null references public.web_clients(id) on delete cascade,
  period_id  text not null references public.periods(id),
  url        text not null,
  views      integer,
  import_id  uuid references public.imports(id),
  created_at timestamptz not null default now()
);

create table if not exists public.web_top_queries (
  id         uuid primary key default gen_random_uuid(),
  client_id  text not null references public.web_clients(id) on delete cascade,
  period_id  text not null references public.periods(id),
  query      text not null,
  clicks     integer,
  import_id  uuid references public.imports(id),
  created_at timestamptz not null default now()
);

drop trigger if exists web_site_metrics_set_updated_at on public.web_site_metrics;
create trigger web_site_metrics_set_updated_at
  before update on public.web_site_metrics
  for each row execute function public.set_updated_at();
drop trigger if exists web_seo_metrics_set_updated_at on public.web_seo_metrics;
create trigger web_seo_metrics_set_updated_at
  before update on public.web_seo_metrics
  for each row execute function public.set_updated_at();

alter table public.web_clients      enable row level security;
alter table public.web_site_metrics enable row level security;
alter table public.web_seo_metrics  enable row level security;
alter table public.web_top_pages    enable row level security;
alter table public.web_top_queries  enable row level security;

create policy "auth full access web_clients" on public.web_clients
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth full access web_site_metrics" on public.web_site_metrics
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth full access web_seo_metrics" on public.web_seo_metrics
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth full access web_top_pages" on public.web_top_pages
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth full access web_top_queries" on public.web_top_queries
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

alter publication supabase_realtime add table public.web_clients;
alter publication supabase_realtime add table public.web_site_metrics;
alter publication supabase_realtime add table public.web_seo_metrics;
alter publication supabase_realtime add table public.web_top_pages;
alter publication supabase_realtime add table public.web_top_queries;
