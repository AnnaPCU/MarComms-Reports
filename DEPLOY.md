# Deploy — GitHub → Vercel

La app no tiene backend: el build es estático y los datos van adentro del bundle.
El deploy es, entonces, solo GitHub → Vercel.

```
GitHub (repo)  ──push a main──▶  Vercel (build + deploy)  ──▶  URL pública
```

## Ramas

- **`main`** es la rama de producción: lo que se mergea acá se publica solo.
- El trabajo se hace en una rama aparte, que genera una *preview URL* por push.
- Para publicar: merge **fast-forward** de la rama de trabajo a `main` y push.

```bash
git fetch origin main
git merge-base --is-ancestor origin/main <rama>   # verifica que se pueda ff
git checkout main && git merge --ff-only <rama>
git push -u origin main
```

El `.gitignore` excluye `node_modules`, `dist` y `.env.local`.

## Configuración en Vercel

Vercel detecta Vite solo. Si hay que crear el proyecto de nuevo:

| Campo | Valor |
|-------|-------|
| Framework Preset | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm install` |
| Production Branch | `main` |

### Variables de entorno

Una sola, opcional, en **Settings → Environment Variables**:

| Nombre | Valor | Entornos |
|--------|-------|----------|
| `VITE_SHARED_PASSWORD` | la contraseña del equipo | Production, Preview, Development |

Si falta, la app usa el default `marcomms2026`. No hay credenciales de backend
porque no hay backend.

> Las variables `VITE_*` se exponen en el bundle del cliente por diseño: nunca
> poner ahí un secreto real.

## Headers

`vercel.json` fuerza `X-Robots-Tag: noindex, nofollow` en todas las rutas: el
sitio es de uso interno y no debe indexarse.

## Verificar un deploy

1. Vercel → *Deployments* → el último debe estar en **Ready**.
2. Abrir la URL de producción, loguearse y revisar el pilar tocado.
3. Si el deploy falla, el log de build de Vercel dice en qué paso — casi siempre
   es un error que `npm run build` reproduce localmente.
