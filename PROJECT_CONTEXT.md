# PROJECT_CONTEXT.md — MarComms Reports (Control Union / PCU Group)

> **Memoria de continuidad.** Este archivo es la fuente de verdad del estado
> actual del proyecto, para que cualquier sesión (humana o de Claude Code) pueda
> retomar sin perder contexto. Si algo acá contradice a `CLAUDE.md` o a los
> `SETUP_*.md`, **manda este archivo** (esos describen una arquitectura anterior
> con Supabase que fue descartada — ver "Decisiones").

_Última actualización: reporte Paid Junio 2026 + estética unificada + baja de Supabase._

---

## 1. Objetivo

Dashboard web multi-pilar de **analytics de marketing** para Control Union /
Peterson Solutions (grupo "PCU"). Muestra reportes por **pilar** (Social, Paid,
Website, Email, Webinars), por **cuenta/región** y por **período** (mes o
trimestre), con KPIs, gráficos, embudos, insights y recomendaciones.

## 2. Usuarios previstos

Equipo interno de MarComms. **Login compartido** (una sola contraseña, un solo
rol). No hay gestión de usuarios ni permisos.

## 3. Flujo principal (cómo se usa)

1. Login con la contraseña del equipo (`VITE_SHARED_PASSWORD`).
2. Header: logo dinámico según la marca de la cuenta + selector de **cuenta** y
   **período** + badge de estado + **Descargar** (HTML) + Salir.
3. Nav de 5 pilares. Cada pilar muestra su reporte para (cuenta, período).
4. Si no hay datos para esa combinación → **"Sin información suficiente"** (nunca
   se inventan números).
5. **Descargar**: baja la vista actual como HTML interactivo offline.

**Cómo entran los datos (importante):** los datos viven en el **seed en código**
(`src/data/*Seed.js`). Los carga el equipo de desarrollo (yo, Claude) a partir de
los Excel/CSV que provee el usuario → commit → deploy. **No hay import por la web
ni base de datos.** Cualquiera que abra la URL ve los mismos datos (van en el
bundle publicado).

## 4. Arquitectura y stack

- **React 18 + Vite 5**, **Tailwind 3**, **Recharts**, **lucide-react**. Sin
  Next.js. Deploy en **Vercel** (auto-deploy desde `main`).
- **Sin backend / sin base de datos.** Fuente de datos = seed en código.
- Capas: `UI (componentes) → hooks → services → seed`. La UI no toca el seed
  directo; habla con los *services* (`socialService`, `paidService`,
  `websiteService`), que son accesores síncronos del seed.
- **Modo embed**: `main.jsx` detecta `window.__REPORT_EMBED__` (HTML descargado) y
  monta `EmbedApp`, que renderiza una sola vista con un snapshot de datos embebido.

## 5. Estructura de archivos (lo importante)

```
src/
  App.jsx                     layout, estado {pilar,cuenta,período}, header, nav, descarga
  main.jsx                    entrada; App normal o EmbedApp (HTML descargado)
  pilares/registry.jsx        conecta cada pilar con su vista, cuentas y períodos
  constants/
    pilares.js                los 5 pilares (id, fuentes, ícono, ready)
    periods.js                meses y trimestres 2026
    brand.js                  tokens de color CU, paleta charts, logos por cuenta
    glossaries.js             glosarios de los 5 pilares
  data/
    socialSeed.js             datos reales Social (Mayo 2026, 9 cuentas)
    paidSeed.js               datos reales Paid (pt, es, cuc, psar; ver §6)
    websiteSeed.js            datos reales Website (CU Argentina, Q1 2026)
  services/                   socialService, paidService, websiteService (seed-only)
  hooks/                      useSocialMonthly, usePaidMonthly (seed-only + embed)
  components/
    shared/                   KpiCard, ChartCard, SectionHeader, Funnel, InsightsPanel,
                              PerformancePanels (Conclusiones + Próximos pasos), NoDataScreen…
    paid/                     PaidApp, PaidFunnel, PaidCharts, CampaignsTable, ComparativeCampaigns
    social/                   SocialApp, AudienceCharts, PostsTable, ComparativeView
    website/                  WebsiteApp (sub-tabs Website/SEO)
    email/ webinars/          EmailApp, WebinarsApp (placeholder NoData + glosario)
    embed/                    EmbedApp (render del HTML descargable)
  utils/
    paidInsights.js           insights/diagnóstico/próximos pasos + scoreCampaigns (Paid)
    socialInsights.js         insights/diagnóstico/próximos pasos (Social) + ESG
    websiteInsights.js        insights/diagnóstico/próximos pasos (Website/SEO)
    esg.js                    clasificador ESG por keywords
    format.js                 fmt/num/pct/computeDelta (es-AR)
    hasData.js                regla de honestidad de datos
    snapshot.js / exportHtml.js  descarga de la vista como HTML
supabase/                     migraciones y seeds SQL (NO se usan hoy; ver "Decisiones")
```

## 6. Formato de los Excel (Paid Media — Google Ads)

El export mensual de Google Ads (Search) que provee el usuario:

- Trae **2 filas de preámbulo** (título + rango de fechas) antes del encabezado.
- Columnas usadas: `Campaña · Impr. · Clics · CTR · Código de moneda · CPC medio ·
  Coste · Conversiones · Coste/conv. · Tasa de conv.` Moneda: EUR.
- El nombre de campaña trae prefijo de cuenta/mercado: `CU España - IFS - SEARCH`,
  `PS Argentina - SuSe - ESG / Reportes - Search`, etc. → se separa por **mercado**
  (prefijo) en las 4 cuentas y se limpia el nombre visible.
- Números en formato es (coma decimal, punto de miles). Los totales por cuenta se
  **calculan** sumando campañas y derivando CTR/CPC/tasas.

> Social (LinkedIn) y Website (GA4/Search Console): sus formatos de export reales
> aún no se documentaron; los datos actuales se cargaron a mano en el seed.

### Cuentas Paid actuales (Junio 2026, EUR)

| Cuenta | slug | logo | Junio: impr · clics · coste · conv |
|--------|------|------|------------------------------------|
| CU España | `es` | CU | 2.692 · 196 · 301,65 € · 1 (IFS) |
| CU Portugal | `pt` | CU | 838 · 62 · 83,97 € · 0 |
| CU Canadá | `cuc` | CU | 276 · 14 · 22,68 € · 0 |
| PS Argentina | `psar` | Peterson | 3.912 · 119 · 112,57 € · 0 |

(Paid además tiene meses previos de pt: feb–may; es: abr.)

## 7. Reglas de negocio

- **Honestidad de datos** (`hasData.js`): sin filas reales para (cuenta, período)
  → "Sin información suficiente". Nunca inventar/estimar.
- **Marca CU** (`brand.js`): tokens de color oficiales, tipografía Ubuntu, paleta
  de charts fija, logo por cuenta (CU / Peterson / sin logo). Tagline "The Proof
  to Your Promise" al pie.
- **Idioma**: UI y comentarios en español (argentino); variables/funciones en
  inglés. Formato numérico es-AR (miles con `.`, decimales con `,`).

## 8. Tipos de reporte (estructura por pilar)

Estructura común (orden): **Insights (Plan de Acción)** → **KPIs** → **Embudo** →
gráficos/tabla propios del pilar → **Lectura de Performance (diagnóstico)** →
**Próximos Pasos** → **Glosario**. Los insights/diagnóstico/próximos pasos se
**generan de las métricas reales** (no hardcodeados).

- **Paid**: embudo Impresión→Clic→Lead + cost cards; gráficos Inversión vs Clics y
  Reparto de Impresiones; tabla de campañas con badges de estado. Selector
  **Vista/Campaña**: global · una campaña (drill-down) · **Comparativa** (ranking
  por score de efectividad + 4 gráficos + radar).
- **Social**: embudo Impresión→Clic→Visitas al perfil; charts de audiencia; tabla
  de posts por pilar ESG; vista **Comparativa multi-cuenta**.
- **Website**: sub-tabs **Website** (embudo Vista→Sesión→Conversión) y **SEO**
  (embudo Impresión→Clic), cada uno con top-lists y chart.

## 9. Estado de cada módulo

| Módulo | Estado |
|--------|--------|
| Social Media | ✅ Completo (datos Mayo 2026) + comparativa |
| Paid Media | ✅ Completo (Feb–Jun 2026) + drill-down + comparativa |
| Website (GA + SEO) | ✅ Completo (Q1 2026, CU Argentina) |
| Email Marketing | ⛔ Placeholder (NoData + glosario) — falta export/datos |
| Webinars | ⛔ Placeholder (NoData + glosario) — falta export/datos |
| Descarga HTML | ✅ Funciona (snapshot embebido) |
| Login compartido | ✅ Funciona (localStorage) |

## 10. Decisiones tomadas

1. **Supabase descartado.** La app corre 100% con seed en código. Motivo: el
   requisito es "que los datos persistan para cualquiera que entre desde un
   navegador", y el seed en el bundle ya lo cumple sin base de datos. Se eliminó
   todo el andamiaje: cliente Supabase, servicios con branch `if (supabase)`,
   realtime, import por UI y la función serverless de autoimport. *(La carpeta
   `supabase/` con SQL queda como referencia del modelo de datos por si se
   reconecta a futuro; hoy no se usa.)*
2. **Import por la web retirado.** Los datos se cargan por código (commit → deploy).
3. **Recharts** para todos los gráficos (no Chart.js), por convención del stack.
4. **Clientes por pilar** (no compartidos entre pilares).

## 11. Pendientes

- Email Marketing y Webinars: definir formato de export real y cargar datos.
- Formatos de export reales de LinkedIn / GA4 / Search Console (documentar columnas).
- Lint real + tests de funciones puras (hoy `npm run lint` es un stub).
- Opcional: extender drill-down/comparativa a Social por cuenta si se pide.

## 12. Problemas conocidos

- 2 vulnerabilidades `npm audit` restantes: **esbuild/vite, solo dev server**, sin
  impacto en producción. Arreglarlas requiere vite@8 (breaking) — no hecho a propósito.
- Docs `SETUP_SUPABASE.md` / `SETUP_AUTOIMPORT.md` / partes de `CLAUDE.md`
  describen la arquitectura Supabase **descartada** — leer con ese contexto.

## 13. Instrucciones de ejecución

```bash
npm install
npm run dev        # http://localhost:5173  (contraseña: VITE_SHARED_PASSWORD)
npm run build      # genera dist/  (lo que deploya Vercel)
npm run preview    # sirve el build en :4173
```
Env vars (`.env.local`): solo `VITE_SHARED_PASSWORD` (opcional; default
`marcomms2026`). No hacen falta credenciales de backend.

**Deploy**: push a `main` → Vercel buildea y publica en
`https://mar-comms-reports.vercel.app/` automáticamente.

## 14. Instrucciones para futuras sesiones de Claude Code

- **No reintroducir Supabase ni import por UI** salvo pedido explícito. Los datos
  van en `src/data/*Seed.js`.
- Para sumar datos nuevos de Paid: parsear el CSV de Google Ads, separar por
  prefijo de mercado, agregar al seed (respetando el shape existente), y actualizar
  este archivo (§6). Verificar con `npm run build` + captura (Playwright headless,
  ver historial) antes de pushear.
- Respetar honestidad de datos, marca CU y español argentino.
- Reutilizar los componentes `shared/` (Funnel, KpiCard, InsightsPanel,
  PerformancePanels) para mantener la estética uniforme entre pilares.

## 15. Registro de cambios relevantes

- Auditoría inicial del repo (recuperación de contexto).
- Integración GitHub→Vercel documentada; deploy desde `main`.
- **Supabase descartado** → app seed-only (datos globales para todos los visitantes).
- **Paid Media Junio 2026** completo (4 cuentas, incl. CU Canadá y PS Argentina).
- **Rediseño de reportes** al nivel del dashboard de referencia (embudo, insights,
  diagnóstico, próximos pasos) — primero Paid, luego Social y Website.
- Paid: drill-down por campaña + comparativa (ranking/score/radar).
- Limpieza: baja del andamiaje de import/autoimport y deps sin uso (xlsx,
  papaparse, @supabase/supabase-js); services/hooks seed-only.
