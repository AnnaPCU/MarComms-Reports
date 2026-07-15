# CLAUDE.md — Dashboard MarComms Control Union

> 🟢 **ESTADO ACTUAL — leer `PROJECT_CONTEXT.md` primero.**
> La arquitectura vigente es **seed en código, sin base de datos**: **Supabase fue
> descartado** y el **import por la web fue retirado**. Las secciones de más abajo
> que describen Supabase/import/realtime son **históricas** (intención original) y
> ya no reflejan el código. Ante cualquier duda, manda `PROJECT_CONTEXT.md`.

> ⚠️ **Proyecto independiente del Marcomms Hub — no integrar todavía.**
> Este dashboard se desarrolla y despliega por separado. No conectar, importar ni
> acoplar con el Marcomms Hub hasta nueva indicación.

App multi-pilar de analytics de marketing para Control Union, migrada desde el
dashboard estático `Mayo_ Reportes_Linkedin.html`.

---

## Stack

- **Framework:** React 18 + Vite 5 (mismo stack que el MarComms Hub — ver abajo)
- **Base de datos / backend:** Supabase (Postgres + Realtime)
- **Deploy:** Vercel, vía GitHub (auto-deploy desde `main`)
- **Estilos:** Tailwind CSS 3 con los tokens de marca CU (ver abajo)
- **Charts:** Recharts (preferido en el Hub; Chart.js solo para herramientas embebidas)
- **CSV/Excel:** papaparse + xlsx (para el upload manual)
- **Íconos:** lucide-react

> **Por qué este stack:** el MarComms Hub (donde este proyecto se integrará el día
> de mañana) es una SPA React + Vite + Tailwind. Igualar el stack permite que Reports
> entre como un módulo más del Hub sin reescritura. **No usar Next.js.**

### Decisiones de arquitectura confirmadas

1. **Importación = upload manual** de CSV/Excel exportados de cada plataforma
   (papaparse/xlsx). Las integraciones por API quedan para una fase posterior;
   mantener los parsers aislados en `src/utils/import/`.
2. **"Tiempo real" = Supabase Realtime al importar** — la vista abierta se refresca
   sola cuando se importan datos. Sin sync vivo contra APIs externas.
3. **Auth = login simple** — un solo rol; todo usuario autenticado ve e importa
   igual. Sin distinción de roles por ahora (login compartido estilo Hub).
4. **Clientes por pilar, no compartidos.** Cada pilar tiene su propia tabla de
   clientes (los slugs pueden coincidir entre pilares, pero no se unifican todavía).
   `periods` e `imports` sí son comunes a todos los pilares.

### Patrón técnico (heredado del Hub — `MarComms Hub/ARCHITECTURE.md`)

- **Capas de datos:** UI → hooks → services → `src/lib/supabaseClient.js` → Supabase.
  **La UI nunca toca Supabase directo.**
- **Un service por tabla** (`xxxService.js`): expone `list/create/update/delete/subscribe`
  y traduce snake_case (DB) ↔ camelCase (app) con `fromRow`/`toRow`.
- **`useCollection`**: hook genérico `[data, setData, meta]` que persiste el diff y
  aplica deltas de realtime — resuelve el requisito de "tiempo real".
- **Supabase:** schema `public`, migrations numeradas (`0002_x.sql`), RLS habilitado
  (`authenticated full access`), todas las tablas en la publicación `supabase_realtime`.
- **Convenciones:** UI y comentarios en **español argentino** (vos, cliquear, tildar);
  variables/funciones en **inglés**. `PascalCase.jsx` componentes · `useCamelCase` hooks
  · `camelCaseService.js` services · `SCREAMING_SNAKE` constantes · IDs con
  `crypto.randomUUID()` · alias `@/` para imports internos.
- **Env:** `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_SHARED_PASSWORD`.
  Nunca poner service role key ni connection string en variables `VITE_*` (se exponen
  en el bundle cliente).

---

## Reglas de marca Control Union

Respetar siempre el manual de marca CU. Tomar estos tokens como única fuente de verdad.

### Colores

| Token | Hex | Uso |
|-------|-----|-----|
| CU Cyan (Primary 2) | `#3eb2ed` | Acento principal, KPIs, charts, barra superior |
| CU Dark Blue (Support) | `#1b1e42` | Texto destacado, paneles, barra inferior |
| CU Grey (Primary 1) | `#799495` | Labels, texto secundario |
| CU Dark Grey | `#4f6566` | Texto de cuerpo |
| Fondo | `#f0f4f5` | Background general |
| Bordes | `#d8e2e3` / `#eaf0f1` | Separadores y bordes suaves |

Paleta ordenada para charts:
`['#3eb2ed','#1b1e42','#799495','#6dc8f2','#2d3a8a','#9ab5b6','#0088cc','#4a5096']`

### Tipografía

- **Headings y cuerpo:** **Ubuntu** (sustituto de Sansa Pro, fuente oficial CU).
- **Fallback:** Calibri, luego sans-serif (para contextos MS Office del manual).

### Logo y dispositivos gráficos

- **Logo:** SVG oficial (globo + wordmark), arriba a la izquierda. Reproducir con
  los colores del manual; nunca deformarlo ni recolorearlo fuera de spec.
- **Dispositivo gráfico superior:** barra **CU Cyan** full-width.
- **Dispositivo gráfico inferior:** barra **CU Dark Blue** alineada a la derecha.
- **Tagline:** `The Proof to Your Promise` — al pie de página, **nunca** junto al logo.

---

## Regla de honestidad de datos

**Si un período/pilar no tiene datos importados, mostrar "Sin información suficiente".
Nunca inventar, estimar ni rellenar números.**

- La ausencia de datos se determina a nivel de base de datos: si no hay filas para
  `(cliente, pilar, período)` → renderizar `<NoDataScreen>` con el mensaje
  *"Sin información suficiente"*.
- No existen filas "estimadas" en el modelo. No hay fallback a valores ficticios.
- El ledger `imports` permite distinguir "nunca importado" de "importado vacío" y
  mostrar la fecha del último import.
- Centralizar la verificación en un helper `src/utils/hasData.js` para aplicar la
  regla de forma uniforme en los 5 pilares.

---

## Los 5 pilares y sus fuentes

| Pilar | Fuentes de datos |
|-------|------------------|
| **Social Media** | LinkedIn |
| **Paid Media** | Google Ads, Meta Ads |
| **Email Marketing** | Mailchimp, Apollo |
| **Webinars** | Livestorm |
| **Website** | Google Analytics (GA4), Google Search Console |

Cada pilar tiene su propia vista, sus propios filtros (cliente / período) y sus
propias tablas de métricas y de clientes en Supabase. El pilar **Social Media** es
la referencia: ya migra los datos reales de Mayo 2026 (9 cuentas LinkedIn) del HTML
original.
