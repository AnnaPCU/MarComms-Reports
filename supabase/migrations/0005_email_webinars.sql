-- ════════════════════════════════════════════════════════════════
--  0005_email_webinars.sql — Pilares Email Marketing y Webinars.
--  KPIs definidos; tablas listas para el primer import. Mensual.
-- ════════════════════════════════════════════════════════════════

-- ── EMAIL MARKETING (Mailchimp / Apollo) ──
create table if not exists public.email_clients (
  id text primary key, name text not null, sort_order integer default 0,
  is_active boolean not null default true, created_at timestamptz not null default now()
);

create table if not exists public.email_metrics (
  id              uuid primary key default gen_random_uuid(),
  client_id       text not null references public.email_clients(id) on delete cascade,
  period_id       text not null references public.periods(id),
  platform        text not null default 'mailchimp', -- 'mailchimp' | 'apollo'
  sends           integer,
  open_rate       numeric,
  click_rate      numeric,
  bounce_rate     numeric,
  unsubscribe_rate numeric,
  new_contacts    integer,
  import_id       uuid references public.imports(id),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  unique (client_id, period_id, platform)
);

create table if not exists public.email_campaigns (
  id         uuid primary key default gen_random_uuid(),
  client_id  text not null references public.email_clients(id) on delete cascade,
  period_id  text not null references public.periods(id),
  platform   text not null default 'mailchimp',
  name       text not null,
  sends      integer,
  open_rate  numeric,
  click_rate numeric,
  import_id  uuid references public.imports(id),
  created_at timestamptz not null default now()
);

-- ── WEBINARS (Livestorm) ──
create table if not exists public.webinar_clients (
  id text primary key, name text not null, sort_order integer default 0,
  is_active boolean not null default true, created_at timestamptz not null default now()
);

create table if not exists public.webinar_events (
  id               uuid primary key default gen_random_uuid(),
  client_id        text not null references public.webinar_clients(id) on delete cascade,
  period_id        text not null references public.periods(id),
  title            text not null,
  event_date       date,
  registrants      integer,
  attendees        integer,
  attendance_rate  numeric,
  avg_duration_min numeric,
  replay_views     integer,
  leads            integer,
  import_id        uuid references public.imports(id),
  created_at       timestamptz not null default now()
);

drop trigger if exists email_metrics_set_updated_at on public.email_metrics;
create trigger email_metrics_set_updated_at
  before update on public.email_metrics
  for each row execute function public.set_updated_at();

alter table public.email_clients   enable row level security;
alter table public.email_metrics   enable row level security;
alter table public.email_campaigns enable row level security;
alter table public.webinar_clients enable row level security;
alter table public.webinar_events  enable row level security;

create policy "auth full access email_clients" on public.email_clients
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth full access email_metrics" on public.email_metrics
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth full access email_campaigns" on public.email_campaigns
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth full access webinar_clients" on public.webinar_clients
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth full access webinar_events" on public.webinar_events
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

alter publication supabase_realtime add table public.email_clients;
alter publication supabase_realtime add table public.email_metrics;
alter publication supabase_realtime add table public.email_campaigns;
alter publication supabase_realtime add table public.webinar_clients;
alter publication supabase_realtime add table public.webinar_events;
