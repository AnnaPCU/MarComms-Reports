> ℹ️ **Actualizado:** el proyecto **ya no usa Supabase**. Para el deploy solo
> aplica GitHub → Vercel (los datos van en el bundle). Las secciones de Supabase y
> las env vars `VITE_SUPABASE_*` de abajo son **históricas** y no hacen falta.
> La única env var opcional es `VITE_SHARED_PASSWORD`. Ver `PROJECT_CONTEXT.md`.

# Integración GitHub → Vercel → Supabase

Runbook para dejar la app desplegada con auto-deploy. Mismo patrón que el Marcomms Hub.

```
GitHub (repo)  ──push a main──▶  Vercel (build + deploy)  ──lee──▶  Supabase (datos)
```

---

## 1. Supabase (backend)

Seguí **[`SETUP_SUPABASE.md`](SETUP_SUPABASE.md)**: crear proyecto → pegar
`supabase/all_in_one.sql` → copiar **Project URL** y **anon key**. Guardalas, las
vas a usar en el paso 3.

---

## 2. GitHub (código)

✅ **El repo remoto ya existe:** `AnnaPCU/MarComms-Reports`. No hay que crearlo.

- Rama de **producción**: `main` (es la que Vercel publica en la URL principal).
- Rama de **trabajo**: `claude/funny-maxwell-5ms7op` (los cambios se desarrollan acá
  y, una vez conectado Vercel, generan una *preview URL* automática por cada push).
- Para que un cambio llegue a la **URL de producción**, la rama de trabajo se
  **mergea a `main`** (un click en GitHub: *Compare & pull request* → *Merge*).

> El `.gitignore` ya excluye `node_modules`, `dist` y `.env.local` — las
> credenciales nunca se suben.

---

## 3. Vercel (deploy + auto-deploy)

1. Entrá a [vercel.com/new](https://vercel.com/new) → **Import Git Repository** →
   elegí `marcomms-reports`.
2. Vercel detecta **Vite** automáticamente. Confirmá:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
3. **Environment Variables** — agregá (Production + Preview + Development):
   | Name | Value |
   |------|-------|
   | `VITE_SUPABASE_URL` | (de Supabase, paso 1) |
   | `VITE_SUPABASE_PUBLISHABLE_KEY` | (anon key, paso 1) |
   | `VITE_SHARED_PASSWORD` | la contraseña del equipo |
4. **Deploy**. En ~1 min queda online.

A partir de acá, **cada push a `main` redeploya solo**. Las ramas/PRs generan
*preview deployments* automáticos.

---

## 4. Verificación

- Abrí la URL de Vercel → debería pedir la contraseña del equipo.
- Pilar **Social** → datos de Mayo 2026 (vienen del seed SQL `all_in_one.sql`).
- Pilares **Paid** y **Website** → van a decir *"Sin información suficiente"* hasta
  que se importen sus datos. **Esto es esperado**, no un error: el seed SQL solo trae
  Social. Los datos de Paid/Website se cargan por import (manual o autoimport).
- Botón **Importar** habilitado (Supabase conectado). Probá importar un CSV →
  la vista se actualiza sola (realtime).
- Consola del navegador: sin el aviso de "modo seed local".

> **Siguiente paso previsto:** importar los datos de **Paid Media – Junio 2026**
> (a partir de los exports de Google Ads) y luego resolver los puntos del análisis
> técnico. Con Supabase conectado, cada import se refleja al instante en la URL.

---

## Notas

- **Supabase Realtime** ya está habilitado en todas las tablas (publicación
  `supabase_realtime`) → el refresco al importar funciona out-of-the-box.
- Si cambiás una env var en Vercel, hacé **Redeploy** para que tome efecto
  (las `VITE_*` se inyectan en build time).
- Dominio custom (opcional): Vercel → Project → Settings → Domains.
- **Nunca** subas el service role key de Supabase ni a GitHub ni a Vercel como
  `VITE_*` — solo la anon/publishable key (es pública por diseño).
