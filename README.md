# Reportes MarComms — Control Union

Dashboard multi-pilar de analytics de marketing para Control Union. App SPA
React + Vite + Tailwind, backend Supabase, deploy en Vercel.

> ⚠️ Proyecto independiente del Marcomms Hub — no integrar todavía (ver `CLAUDE.md`).

## Pilares

| Pilar | Fuentes | Período | Estado |
|-------|---------|---------|--------|
| Social Media | LinkedIn | Mensual | Datos reales (Mayo 2026) |
| Paid Media | Google Ads, Meta | Mensual | Datos reales (CU Portugal Feb–Jun, España Abr) |
| Website | GA4, Search Console | **Trimestral** | Datos reales (CU Argentina Q1) |
| Email Marketing | Mailchimp, Apollo | Mensual | KPIs definidos · pendiente import |
| Webinars | Livestorm | Mensual | KPIs definidos · pendiente import |

Cada reporte incluye su **glosario** al pie. Regla de honestidad: si no hay datos
importados para (cuenta, período) → "Sin información suficiente", nunca números inventados.

## Stack

- React 18 + Vite 5 + Tailwind 3 · Recharts · papaparse/xlsx · lucide-react
- Supabase (Postgres + Realtime) · Deploy en Vercel (auto-deploy desde `main`)

## Desarrollo local

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # build de producción → dist/
```

Sin variables de entorno, la app corre en **modo seed local** (datos de ejemplo,
solo lectura, import deshabilitado). Para datos reales + import + realtime, conectá
Supabase (ver más abajo).

## Variables de entorno

Copiá `.env.example` a `.env.local`:

```env
VITE_SUPABASE_URL=                 # Supabase → Project Settings → API
VITE_SUPABASE_PUBLISHABLE_KEY=     # anon/publishable key (pública por diseño)
VITE_SHARED_PASSWORD=marcomms2026  # login compartido del equipo
```

Nunca poner el service role key ni el connection string en variables `VITE_*`
(se exponen en el bundle del cliente).

## Login

Login compartido (un solo rol). Contraseña por defecto: `marcomms2026`
(configurable con `VITE_SHARED_PASSWORD`).

## Importar datos

Botón **Importar** (header) → elegí pilar / cuenta / período / tipo de dato, subí
el CSV o Excel, mapeá las columnas (auto-sugerido y recordado) y confirmá. Para los
export de Google Ads, dejá "filas a saltar" en **2** (traen 2 filas de preámbulo).
Requiere Supabase configurado.

## Documentación

- [`SETUP_SUPABASE.md`](SETUP_SUPABASE.md) — crear el proyecto Supabase paso a paso.
- [`SETUP_AUTOIMPORT.md`](SETUP_AUTOIMPORT.md) — import automático desde una carpeta (Storage + `/api/process-imports`).
- [`DEPLOY.md`](DEPLOY.md) — integración GitHub → Vercel → Supabase.
- [`CLAUDE.md`](CLAUDE.md) — marca, reglas y convenciones del proyecto.
- [`supabase/`](supabase/) — migrations, seeds y `all_in_one.sql`.
