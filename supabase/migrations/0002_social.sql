-- ════════════════════════════════════════════════════════════════
--  0002_social.sql — Pilar Social Media (LinkedIn)
--  Clientes propios del pilar (no compartidos con otros pilares todavía).
-- ════════════════════════════════════════════════════════════════

-- ── social_clients: las cuentas/regiones LinkedIn ──
create table if not exists public.social_clients (
  id         text primary key,             -- slug: 'cul', 'cue', ...
  name       text not null,
  org_group  text,                         -- 'CU' | 'Peterson' | 'Lab'
  sort_order integer default 0,
  is_active  boolean not null default true,
  created_at timestamptz not null default now()
);

-- ── social_metrics: métricas mensuales por cuenta+período ──
create table if not exists public.social_metrics (
  id              uuid primary key default gen_random_uuid(),
  client_id       text not null references public.social_clients(id) on delete cascade,
  period_id       text not null references public.periods(id),
  impressions     integer,
  clicks          integer,
  engagement_rate numeric,                 -- %
  profile_visits  integer,                 -- proxy de conversiones
  new_followers   integer,
  import_id       uuid references public.imports(id),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  unique (client_id, period_id)
);

-- ── social_posts: publicaciones del período ──
create table if not exists public.social_posts (
  id              uuid primary key default gen_random_uuid(),
  client_id       text not null references public.social_clients(id) on delete cascade,
  period_id       text not null references public.periods(id),
  title           text not null,
  esg_pillar      text,                    -- 'E' | 'S' | 'G' | 'X'
  impressions     integer,
  engagement_rate numeric,
  clicks          integer,
  reactions       integer,
  comments        integer,
  post_type       text,                    -- 'Orgánico' | 'Artículo' | ...
  url             text,
  import_id       uuid references public.imports(id),
  created_at      timestamptz not null default now()
);

-- ── social_audience: distribuciones de audiencia (seniority / función) ──
create table if not exists public.social_audience (
  id         uuid primary key default gen_random_uuid(),
  client_id  text not null references public.social_clients(id) on delete cascade,
  period_id  text references public.periods(id),
  dimension  text not null,                -- 'seniority' | 'function'
  label      text not null,
  value      integer not null,
  import_id  uuid references public.imports(id),
  created_at timestamptz not null default now()
);

create index if not exists social_metrics_client_period_idx on public.social_metrics (client_id, period_id);
create index if not exists social_posts_client_period_idx   on public.social_posts (client_id, period_id);
create index if not exists social_audience_client_idx       on public.social_audience (client_id, dimension);

-- ── updated_at trigger en social_metrics ──
drop trigger if exists social_metrics_set_updated_at on public.social_metrics;
create trigger social_metrics_set_updated_at
  before update on public.social_metrics
  for each row execute function public.set_updated_at();

-- ── RLS + realtime ──
alter table public.social_clients  enable row level security;
alter table public.social_metrics  enable row level security;
alter table public.social_posts    enable row level security;
alter table public.social_audience enable row level security;

create policy "auth full access social_clients" on public.social_clients
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth full access social_metrics" on public.social_metrics
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth full access social_posts" on public.social_posts
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth full access social_audience" on public.social_audience
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

alter publication supabase_realtime add table public.social_clients;
alter publication supabase_realtime add table public.social_metrics;
alter publication supabase_realtime add table public.social_posts;
alter publication supabase_realtime add table public.social_audience;
