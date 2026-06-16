# Supabase — Reportes MarComms

Migrations y seed del backend. Mientras no haya proyecto Supabase configurado,
la app corre en **modo seed local** (datos de Mayo 2026 embebidos en
`src/data/socialSeed.js`, solo lectura).

## Setup cuando tengas el proyecto

1. Crear proyecto en [supabase.com](https://supabase.com).
2. En **SQL Editor**, correr en orden:
   - `migrations/0001_common.sql`   (periods, imports)
   - `migrations/0002_social.sql`   (LinkedIn)
   - `migrations/0003_paid.sql`     (Google Ads / Meta)
   - `migrations/0004_website.sql`  (GA4 / Search Console — trimestral)
   - `migrations/0005_email_webinars.sql` (Mailchimp/Apollo · Livestorm)
   - `seed/0001_social.sql`         (períodos + cuentas LinkedIn)
   - `seed/0002_clients.sql`        (clientes Paid + Website)
3. Copiar **Project URL** y la **publishable/anon key** (Settings → API).
4. Crear `.env.local` en la raíz (ver `.env.example`):
   ```env
   VITE_SUPABASE_URL=https://xxxx.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=eyJ...
   ```
5. Reiniciar `npm run dev`. El cliente detecta las env vars y deja el modo seed local.

## Convenciones

- Schema `public`. Migrations numeradas (`0001_…`, `0002_…`).
- RLS habilitado en todas las tablas con política `auth full access` (authenticated).
- Todas las tablas en la publicación `supabase_realtime` → el refresco en
  tiempo real al importar funciona out-of-the-box.
- **Clientes por pilar** (no compartidos): `social_clients` es propio del pilar
  Social. Los próximos pilares traerán `paid_clients`, `email_clients`, etc.
- `periods` e `imports` son **comunes** a todos los pilares.

## Pendiente

- Seed de métricas reales (hoy en los seeds JS: `socialSeed` Mayo 2026, `paidSeed`
  España Abril 2026, `websiteSeed` CU Argentina Q1 2026). Los persistirá el import manual.
- Servicios con rama Supabase (hoy leen del seed local).
