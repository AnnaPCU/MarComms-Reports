# Setup Supabase — paso a paso

Guía para levantar el backend real. Toma ~5 minutos. Hacelo una sola vez.

## 1. Crear el proyecto

1. Entrá a [supabase.com](https://supabase.com) → **Sign in** (con GitHub o email).
2. **New project**:
   - **Name**: `marcomms-reports`
   - **Database Password**: generá una y guardala (no la vas a necesitar en la app).
   - **Region**: la más cercana (ej. `South America (São Paulo)`).
   - **Plan**: Free.
3. Esperá ~2 min a que termine de aprovisionar.

## 2. Crear las tablas + seed

1. En el panel del proyecto → menú izquierdo → **SQL Editor** → **New query**.
2. Abrí el archivo [`supabase/all_in_one.sql`](supabase/all_in_one.sql) de este repo,
   copiá **todo** el contenido y pegalo en el editor.
3. **Run** (▶, o Ctrl+Enter).
   - Deberías ver *Success. No rows returned*.
   - ⚠️ Corré este script **una sola vez** en el proyecto nuevo (las políticas RLS y
     el alta en realtime no son re-ejecutables sin error).

## 3. Copiar las credenciales

1. Menú izquierdo → **Project Settings** (⚙) → **API**.
2. Copiá:
   - **Project URL** → es tu `VITE_SUPABASE_URL`.
   - **Project API keys → `anon` / `publishable`** → es tu `VITE_SUPABASE_PUBLISHABLE_KEY`.
     (Es pública por diseño, no pasa nada si queda en el bundle.)

## 4. Conectar la app

1. En la raíz del repo, creá un archivo `.env.local` (copiá de `.env.example`):

   ```env
   VITE_SUPABASE_URL=https://xxxxxxxx.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOi...
   VITE_SHARED_PASSWORD=marcomms2026
   ```

2. Reiniciá el dev server (`Ctrl+C` y `npm run dev`).
   - En la consola del navegador ya **no** debería aparecer el aviso de “modo SEED LOCAL”.
   - El badge de import (arriba a la derecha) pasa a estar habilitado.

## 5. Probar el import

1. Click en **Importar** (header) → elegí pilar **Social**, cuenta, período y tipo de dato.
2. Subí un CSV/Excel, mapeá las columnas y confirmá.
3. La vista del pilar se actualiza **sola** (Supabase Realtime) sin recargar.

---

### Notas

- Mientras no exista `.env.local`, la app sigue funcionando en **modo seed local**
  (datos de ejemplo, solo lectura — el import queda deshabilitado con un aviso).
- Las migrations individuales están en `supabase/migrations/` por si preferís
  correrlas una por una. `all_in_one.sql` es la suma de todas + los seeds.
- Para producción (Vercel): cargá las mismas dos variables `VITE_*` en
  **Project Settings → Environment Variables** y redeploy.
