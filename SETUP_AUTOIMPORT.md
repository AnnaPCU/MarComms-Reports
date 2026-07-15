> 🗄️ **DOCUMENTO HISTÓRICO — no aplica al estado actual.** El autoimport y su
> función serverless fueron **eliminados** (requerían Supabase, ya descartado).
> Los datos se cargan por código. Ver `PROJECT_CONTEXT.md`.

# Import automático desde una carpeta (autoimport)

Subís un Excel/CSV a una carpeta → se detecta solo → se carga en la base → el
dashboard se actualiza solo (realtime). Sin abrir la app, sin mapear a mano.

```
Subís archivo a  imports/inbox/   (Supabase Storage)
        │  (webhook al subir  ·  + cron diario de respaldo)
        ▼
/api/process-imports  (Vercel)  → parsea + carga en las tablas + ledger `imports`
        │                          mueve el archivo a processed/ (o failed/)
        ▼
Dashboard se actualiza solo (realtime)
```

> El que detecta y procesa es esta función desplegada en Vercel — corre sola,
> no requiere que nadie tenga la app abierta.

---

## 1. Convención de nombre de archivo (clave)

Para saber a qué reporte va cada archivo **sin intervención humana**, el nombre
debe seguir este patrón (separador `__`, doble guión bajo):

```
<pilar>__<cuenta>__<periodo>__<dataset>.csv     (o .xlsx)
```

| pilar | cuenta (slug) | periodo | dataset |
|-------|---------------|---------|---------|
| `social` | `cul`, `cue`, … | `m01`…`m12`, `q1-2026`… , o `na` | `metrics` · `posts` · `audience-seniority` · `audience-function` |
| `paid` | `pt`, `es`, … | `m05`, `q2-2026`… | `campaigns` (export de Google Ads) |
| `website` | `cua`, … | `q1-2026`… | `site` (GA) · `seo` (Search Console) |

**Ejemplos:**
```
paid__pt__m05__campaigns.csv
social__cul__m05__metrics.csv
social__cul__m05__posts.csv
social__cul__na__audience-seniority.csv
website__cua__q1-2026__site.csv
```
Si la cuenta no existe todavía, se crea sola con ese slug.

> ✅ **Paid (Google Ads)** está validado con tus exports reales (incluye el salto
> de 2 filas de preámbulo). Para Social/Website los alias de columnas son
> provisionales: cuando me pases un export real de LinkedIn / GA / Search Console,
> afino los nombres de columna exactos.

---

## 2. Crear el bucket

SQL Editor → correr:
```sql
insert into storage.buckets (id, name, public)
values ('imports', 'imports', false) on conflict (id) do nothing;
```
(o `supabase/migrations/0007_imports_bucket.sql`). Es privado.

---

## 3. Variables de entorno en Vercel (Settings → Environment Variables)

⚠️ Estas son **server-only** (sin prefijo `VITE_`, no se exponen al cliente):

| Name | Value |
|------|-------|
| `SUPABASE_URL` | `https://mjdhadrakbjawgjjgvxe.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | la **service_role** (Supabase → Settings → API → `service_role` secret) |
| `AUTOIMPORT_SECRET` | una clave inventada (ej. un UUID) — la usa el webhook |
| `CRON_SECRET` | otra clave inventada — la usa el cron de Vercel |

> La `service_role` es **secreta y poderosa** (saltea RLS). Va solo acá, nunca en
> el cliente ni en el repo. **Redeploy** después de agregarlas.

---

## 4. Disparador: webhook de Supabase Storage (tiempo casi real)

Supabase → **Database → Webhooks → Create a new hook**:
- **Table:** `storage.objects` · **Events:** Insert
- **Type:** HTTP Request → **POST** a:
  `https://mar-comms-reports.vercel.app/api/process-imports`
- **HTTP Headers:** agregá `x-autoimport-secret` = el valor de `AUTOIMPORT_SECRET`.

Listo: cada archivo que cae en `imports/inbox/` dispara la función al instante.

El **cron diario** (en `vercel.json`, 06:00) es un respaldo que barre `inbox/`
por si algún webhook se perdió.

---

## 5. Probar

1. Subí `paid__pt__m05__campaigns.csv` a `imports/inbox/` (Storage → bucket
   `imports` → carpeta `inbox` → Upload).
2. En segundos, el archivo debería moverse a `processed/`.
3. En el dashboard (pilar Paid · CU Portugal · Mayo) ves los datos actualizados.
4. Si algo falla, el archivo va a `failed/` y queda el detalle en la tabla
   `imports` (status / notas).

---

## Limitaciones conocidas (v1)

- **Formatos:** solo Paid/Google Ads está probado con export real. El resto puede
  necesitar ajustar los alias de columnas (lo afinamos con un archivo de ejemplo).
- **Frecuencia del cron en Vercel Hobby:** diaria. El **webhook** cubre el tiempo
  real; el cron es solo respaldo.
- **Nombre del archivo:** si no respeta la convención, va a `failed/`.
- **Website:** toma la primera fila del export como totales del trimestre (ajustable).
