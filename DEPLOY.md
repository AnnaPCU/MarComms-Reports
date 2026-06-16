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

El repo local ya está inicializado y con el primer commit hecho. Falta crear el
repo remoto y pushear.

### Opción A — con GitHub CLI (`gh`)
```bash
gh repo create control-union/marcomms-reports --private --source=. --remote=origin --push
```

### Opción B — desde la web (sin gh)
1. Entrá a [github.com/new](https://github.com/new) → nombre `marcomms-reports`
   (en la organización de Control Union/Peterson si corresponde) → **Private** →
   *Create repository* (sin README, ya tenemos uno).
2. En la terminal, dentro del proyecto:
   ```bash
   git remote add origin https://github.com/<org>/marcomms-reports.git
   git branch -M main
   git push -u origin main
   ```

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
- Pilar Social → datos de Mayo 2026 (vienen del seed SQL).
- Botón **Importar** habilitado (Supabase conectado). Probá importar un CSV →
  la vista se actualiza sola (realtime).
- Consola del navegador: sin el aviso de "modo seed local".

---

## Notas

- **Supabase Realtime** ya está habilitado en todas las tablas (publicación
  `supabase_realtime`) → el refresco al importar funciona out-of-the-box.
- Si cambiás una env var en Vercel, hacé **Redeploy** para que tome efecto
  (las `VITE_*` se inyectan en build time).
- Dominio custom (opcional): Vercel → Project → Settings → Domains.
- **Nunca** subas el service role key de Supabase ni a GitHub ni a Vercel como
  `VITE_*` — solo la anon/publishable key (es pública por diseño).
