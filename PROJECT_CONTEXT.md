# PROJECT_CONTEXT.md — MarComms Reports (Control Union / PCU Group)

> **Memoria de continuidad.** Este archivo es la fuente de verdad del **estado
> actual** del proyecto, para que cualquier sesión (humana o de Claude Code) pueda
> retomar sin perder contexto. Si algo acá contradice a `CLAUDE.md`, manda este
> archivo: es el que se actualiza en cada sesión.
>
> Documentación complementaria:
> - `CLAUDE.md` — reglas permanentes: marca, stack, convenciones.
> - `docs/DECISIONES.md` — el **porqué** de los criterios (lo que no se deduce
>   leyendo el código: honestidad de datos, monedas, campañas parciales, idioma…).
> - `docs/historial-pedidos.md` — registro textual de lo que pidió el equipo,
>   sesión por sesión. Las conversaciones no viajan entre cuentas: esto sí.

_Última actualización: Social Agosto 2026 (primer mes ingresado por la carpeta
`metricas/`) · vista por CLIENTE (unidad de negocio + país/región, para clientes
con más de un pilar) · Paid Agosto 2026 (CU Estados Unidos, EUR→ARS, campañas
parciales) · marca MarComms como principal · toggle ES/EN en los 5 pilares ·
Email y Webinars con datos reales (webinar EUDR)._

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
3. Nav de 5 pilares + **Clientes**. Cada pilar muestra su reporte para (cuenta,
   período). **Clientes** cruza los pilares: se elige un cliente (unidad de
   negocio + país/región) y arranca en una vista General con lo más importante
   de cada pilar; la botonera permite entrar a cada pilar con la misma vista
   que tendría entrando por el pilar. Solo aparecen los clientes con **más de
   un pilar con datos** (ver §7).
4. Si no hay datos para esa combinación → **"Sin información suficiente"** (nunca
   se inventan números).
5. **Descargar**: baja la vista actual como HTML interactivo offline.

**Cómo entran los datos (importante):** los datos viven en el **seed en código**
(`src/data/*Seed.js`). Los carga el equipo de desarrollo (yo, Claude) a partir de
los Excel/CSV que provee el usuario → commit → deploy. **No hay import por la web
ni base de datos.** Cualquiera que abra la URL ve los mismos datos (van en el
bundle publicado).

**Dos canales de entrega de archivos (desde Ago 2026):**

1. **Paid Media y Website** → Tomás adjunta los archivos directamente en su
   conversación de Claude (como siempre).
2. **Social Media, Email Marketing y Webinars** → los responsables de cada
   pilar dejan los exports crudos en la carpeta **`metricas/`** del repo
   (una subcarpeta por pilar, una carpeta `AAAA-MM` por mes). Ver
   `metricas/README.md` para reglas y nomenclatura. Al procesar un mes,
   Claude corre el tooling del pilar, verifica, deploya y mueve la carpeta
   a `metricas/<pilar>/_procesados/`. Las carpetas de mes que NO están en
   `_procesados/` son las pendientes.

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
  pilares/registry.jsx        conecta cada pilar con su vista, cuentas y períodos (+ clientes)
  constants/
    pilares.js                los 5 pilares (id, fuentes, ícono, ready) + entrada de nav Clientes
    clients.js                mapa cliente (unidad + país) → cuenta de cada pilar (ver §7)
    periods.js                meses y trimestres 2026
    brand.js                  tokens de color CU, paleta charts, logos por cuenta
    glossaries.js             glosarios de los 5 pilares
  data/
    socialSeed.js             estructura + audiencia Social (9 cuentas); los meses vienen de socialMonthly.js
    socialMonthly.js          KPIs y top posts por cuenta y mes (Ene–Ago 2026), generado por scripts/linkedin/
    socialLatam.js / socialNorthAm.js  segmentación por país de CU Latinoamérica y CU North America
    paidSeed.js               datos reales Paid (pt, es, cuc, psar; ver §6)
    websiteSeed.js            datos reales Website (CU Argentina, Q1 2026)
  services/                   socialService, paidService, websiteService… (seed-only)
                              clientService: qué pilares/períodos tiene cada cliente + paquete de la vista General
  hooks/                      useSocialMonthly, usePaidMonthly, useClientOverview (seed-only + embed)
  components/
    shared/                   KpiCard, ChartCard, SectionHeader, Funnel, InsightsPanel,
                              PerformancePanels (Conclusiones + Próximos pasos), NoDataScreen…
    paid/                     PaidApp, PaidFunnel, PaidCharts, CampaignsTable, ComparativeCampaigns
    social/                   SocialApp, AudienceCharts, PostsTable, ComparativeView
    website/                  WebsiteApp (sub-tabs Website/SEO)
    email/                    EmailApp, EmailCharts, HotLeadsTable (Mailchimp)
    webinars/                 WebinarMixReport (reporte mixto por evento) + WebinarsApp
    clients/                  ClientApp (botonera General + pilares, período por pilar) + ClientOverview
    brand/                    Logo/MarCommsLogo/ClientLogo, BrandBars, Tagline
    embed/                    EmbedApp (render del HTML descargable)
  utils/
    paidInsights.js           insights/diagnóstico/próximos pasos + scoreCampaigns (Paid)
    socialInsights.js         insights/diagnóstico/próximos pasos (Social) + ESG
    socialYearInsights.js     agregados e insights del "Resumen del Año" (Social)
    websiteInsights.js        insights/diagnóstico/próximos pasos (Website/SEO)
    emailInsights.js          insights/diagnóstico/próximos pasos (Email) + benchmarks B2B
    clientSummary.js          vista General por cliente: hero/líneas/insights por pilar (reusa los generadores)
    mailchimp/                lógica pura: leads (parseo/detección de columnas),
                              aggregate (métricas/comparativa/hot leads), build (compone campaña)
    esg.js                    clasificador ESG por keywords (+ ESG_NAME_EN)
    paidI18n.js / emailI18n.js / socialI18n.js / websiteI18n.js / webinarsI18n.js / clientI18n.js
                              diccionarios ES/EN de cada pilar y de la vista por cliente (ver §7 idioma)
    reportLang.js             idioma inicial del reporte (lee __REPORT_EMBED__.lang)
    campaignPartial.js        días activos de una campaña que arrancó a mitad de mes
    format.js                 fmt/num/pct/computeDelta (es-AR)
    hasData.js                regla de honestidad de datos
    snapshot.js / exportHtml.js  descarga de la vista como HTML
```

## 6. Formato de los Excel (Paid Media — Google Ads)

El export mensual de Google Ads (Search) que provee el usuario:

Son **3 CSV por mes** (ver `scripts/paid/README.md` para el detalle):
rendimiento de campaña, semanal por grupo de anuncios y términos + palabras clave.

- Traen **2 filas de preámbulo** (título + rango de fechas) antes del encabezado:
  el tooling las saltea, no hay que borrarlas.
- Columnas usadas: `Campaña · Impr. · Clics · CTR · Código de moneda · CPC medio ·
  Coste · Conversiones · Coste/conv. · Tasa de conv.`
- El informe de términos **debe** incluir la columna `Campaña`: hay nombres de
  grupo repetidos entre cuentas (PEFC, GRS, GOTS, Smeta, ISCC…) y sin ella no se
  pueden atribuir.
- El nombre de campaña trae prefijo de cuenta/mercado: `CU España - IFS - SEARCH`,
  `PS Argentina - SuSe - ESG / Reportes - Search`, etc. → se separa por **mercado**
  (prefijo) en las cuentas y se limpia el nombre visible. Prefijo desconocido =
  error del script (no se asigna a ciegas).
- Números en formato es: el `.` es **siempre** separador de miles (`5.561`) y la
  `,` el decimal (`103366,25`). Los totales por cuenta se **calculan** sumando
  campañas y derivando CTR/CPC/tasas, y se validan contra el semanal.
- **Moneda**: hasta julio 2026 el export venía en **EUR**; desde agosto 2026 viene
  en **ARS** (cambio de cuenta de Google Ads). Ver §7.

> Social (LinkedIn) y Website (GA4/Search Console): sus formatos de export reales
> aún no se documentaron; los datos actuales se cargaron a mano en el seed.

### Cuentas Paid actuales (Agosto 2026, ARS)

| Cuenta | slug | logo | Agosto: impr · clics · coste · conv |
|--------|------|------|-------------------------------------|
| PS Argentina | `psar` | Peterson | 11.507 · 503 · 350.121,76 ARS · 0 |
| CU España | `es` | CU | 4.154 · 170 · 374.884,93 ARS · 1 (CAEs) |
| CU Canadá | `cuc` | CU | 911 · 62 · 269.062,08 ARS · 1 (Forestry) |
| CU Portugal | `pt` | CU | 858 · 67 · 140.993,70 ARS · 0 |
| CU Estados Unidos | `cuus` | CU | 179 · 12 · 89.322,29 ARS · 0 |

- `cuus` arranca en agosto 2026 con dos campañas de Organic (USDA NOP y
  PrimusGFS) **creadas el 21/8** → 11 de 31 días (ver campañas parciales en §7).
- La campaña `Car` de CU España **pasó a llamarse `CAEs`** en agosto: es la misma
  (mismos grupos), y los meses previos están renombrados para que el acumulado
  anual no la parta en dos.
- `cuar` (CU Argentina) existe solo para las campañas GEO de Meta Ads.

## 7. Reglas de negocio

- **Honestidad de datos** (`hasData.js`): sin filas reales para (cuenta, período)
  → "Sin información suficiente". Nunca inventar/estimar.
- **Marca**: MarComms (el equipo que produce los reportes) es la marca
  **principal** — logo horizontal arriba a la izquierda del header, logo chico al
  pie enfrentado al tagline, e isotipo como favicon de la app y de todos los
  descargables. El logo del **cliente** (CU / Peterson) va en segundo plano: chico,
  sin etiqueta y con tope de ancho. Assets en `public/marcomms-*`, originales en
  `assets/marca/marcomms/`. Tokens de color CU, tipografía Ubuntu y paleta de
  charts fija siguen igual (`brand.js`); tagline "The Proof to Your Promise" al pie.
- **Idioma del código**: UI y comentarios en español (argentino);
  variables/funciones en inglés.
- **Idioma del reporte (ES/EN)**: los 5 pilares tienen botonera ES/EN, con español
  por defecto. Cada pilar tiene su diccionario `*I18n.js` y sus generadores de
  insights reciben `lang`. Al **descargar**, el diálogo pregunta el idioma
  principal del archivo (viaja en `__REPORT_EMBED__.lang` y lo lee `initialLang()`);
  adentro del HTML el toggle sigue funcionando. Glosarios EN: `*En` en
  `glossaries.js`. Formato numérico: es-AR en español, en-US en inglés.
- **Monedas**: nunca se convierte de una moneda a otra. Cada mes se muestra con la
  moneda con la que se reportó; en el Resumen del Año y la Comparativa los importes
  se muestran como **sumatoria por moneda** (`977,84 EUR + 374.884,93 ARS`) sobre el
  año completo, mientras que los volúmenes se suman normalmente. Los gráficos de
  coste usan un eje por moneda (anual) o solo la moneda vigente (comparativa).
- **Campañas parciales**: una campaña que arrancó a mitad de mes lleva
  `startedOn: 'AAAA-MM-DD'` en el seed (fecha de creación, del historial de cambios
  de Google Ads). `campaignPartial.js` calcula los días activos y la UI avisa con
  chip «Parcial · N días», banner en el detalle e insight propio.
- **Vista por cliente** (`src/constants/clients.js`): un cliente es una unidad de
  negocio (Control Union / Peterson Solutions) + país o región, y mapea
  explícitamente la cuenta de cada pilar (las cuentas nunca se compartieron
  entre pilares: Social `cue`, Paid `es`, Website `cues` son el mismo cliente).
  **Solo tiene vista propia si tiene más de un pilar con datos**; con un solo
  pilar alcanza con la vista del pilar. La vista General muestra el **último
  período con datos de cada pilar** (pueden ser distintos: Social Jul, Paid
  Ago, Website Q2) y lo dice en cada tarjeta. Cuando la cuenta mapeada tiene
  un alcance distinto al del cliente (cuenta regional, campaña conjunta CU+PS,
  solo GEO de Meta), la vista lo aclara con «Alcance: …». Social por país usa
  la segmentación por hashtag de la cuenta regional. Clientes hoy (13):
  CU España, Portugal, Latinoamérica, Argentina, Brasil, Chile, México, Perú,
  North America, Estados Unidos, Canadá; PS Iberia y PS Americas.

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
- **Email**: embudo Entregados→Aperturas→Clics; KPIs con benchmarks B2B;
  comparativa de la secuencia; tabla de hot leads con prioridad por clics.
- **Webinars**: reporte **mixto por evento** (no mensual). Botonera de vistas
  General · Webinar · Email Marketing · Social Media, cada una con su glosario.
  Cruza Livestorm/Teams + Mailchimp + LinkedIn + HubSpot: key insights, países,
  embudo, engagement, atribución de registros, deals priorizados por scoring
  0-100, encuestas y oportunidad comercial. El plan de acción solo se ve en la
  descarga interna. La proyección de «pipeline potencial» se descartó (ver
  `docs/DECISIONES.md` §3).
- **Clientes** (vista transversal): ficha del cliente → hero cards (una por
  pilar, su métrica principal del último período) → Plan de Acción por pilar
  (los primeros insights de cada generador, etiquetados por pilar) → tarjetas
  de resumen por pilar con «Ver vista completa →» → Lectura de Performance
  (un diagnóstico por pilar) → Próximos Pasos por pilar (solo interno) →
  glosarios de los pilares involucrados. Los botones de pilar renderizan el
  **mismo componente del pilar** con la cuenta mapeada (y el país, si
  segmenta) y una botonera de período propia (meses/trimestres/eventos con
  datos + Resumen del Año). La descarga HTML baja **solo la vista General**;
  los reportes completos de cada pilar se descargan desde su pilar.

## 9. Estado de cada módulo

| Módulo | Estado |
|--------|--------|
| Social Media | ✅ Completo (Ene–Ago 2026, 9 cuentas) + comparativa + reportes por país + Resumen del Año (tooling: `scripts/linkedin/`). Agosto fue el primer mes ingresado por `metricas/social-media/` |
| Paid Media | ✅ Completo (Feb–Ago 2026, 5 cuentas) + drill-down + detalle por grupo + Resumen del Año + comparativa (tooling: `scripts/paid/`) |
| Website (GA + SEO) | ✅ Completo (Q1+Q2 2026, 12 cuentas) + Resumen del Año + comparativa |
| Email Marketing | ✅ Con datos reales: `cups` (CU + PS Latinoamérica), m08 — campaña del webinar EUDR (tooling: `scripts/mailchimp-to-seed.mjs`) |
| Webinars | ✅ Reporte mixto por evento: **Webinar EUDR · Ago 2026**. El de ISO 14064 (Jul 2026) está oculto a pedido del equipo, con los datos intactos en el seed |
| Descarga HTML | ✅ Funciona (snapshot embebido, multi-período en un archivo, elección de idioma) |
| Idioma ES/EN | ✅ En los 5 pilares + elección al descargar |
| Marca MarComms | ✅ Logo principal en header y pie + favicon propio |
| Login compartido | ✅ Funciona (localStorage) |
| Vista por cliente | ✅ 13 clientes con más de un pilar (mapa en `constants/clients.js`), vista General + entrada a cada pilar, descarga de la General |

## 10. Decisiones tomadas

1. **Supabase descartado.** La app corre 100% con seed en código. Motivo: el
   requisito es "que los datos persistan para cualquiera que entre desde un
   navegador", y el seed en el bundle ya lo cumple sin base de datos. Se eliminó
   todo el andamiaje: cliente Supabase, servicios con branch `if (supabase)`,
   realtime, import por UI y la función serverless de autoimport. La carpeta
   `supabase/` y los `SETUP_SUPABASE.md` / `SETUP_AUTOIMPORT.md` se eliminaron del
   repo en septiembre 2026 para que no confundan; si alguna vez hace falta el
   modelo de datos, está en el historial de git.
2. **Import por la web retirado.** Los datos se cargan por código (commit → deploy).
3. **Recharts** para todos los gráficos (no Chart.js), por convención del stack.
4. **Clientes por pilar** (no compartidos entre pilares).

## 11. Pendientes

- Formatos de export reales de GA4 / Search Console (documentar columnas cuando
  lleguen los próximos exports).
- **Vista por cliente**: revisar con el equipo dos mapeos que son criterio y no
  dato (ver `docs/DECISIONES.md` §11): la campaña de Email «CU + PS
  Latinoamérica» y los webinars (cuenta global `cu`, audiencia LATAM) cuelgan
  de **CU Latinoamérica**; la cuenta LinkedIn «PS Iberia & Americas» alimenta
  a **PS Iberia** y a **PS Americas** con la aclaración de alcance.
- Resueltos: el ticket promedio EUDR ya no hace falta (la proyección de
  pipeline se descartó); el 31/8 en cero de las campañas de CU Estados Unidos
  se corroboró y en septiembre fluyen normal.
- Opcional: extender drill-down/comparativa a Social por cuenta si se pide.

## 12. Problemas conocidos

- 2 vulnerabilidades `npm audit` restantes: **esbuild/vite, solo dev server**, sin
  impacto en producción. Arreglarlas requiere vite@8 (breaking) — no hecho a propósito.
- El bundle supera los 500 kB (aviso de Vite al buildear). Es esperable: el seed
  de datos viaja adentro. No es un error.

## 13. Instrucciones de ejecución

```bash
npm install
npm run dev        # http://localhost:5173  (contraseña: VITE_SHARED_PASSWORD)
npm run lint       # eslint sobre src/ (real, no un stub)
npx vitest run     # 39 tests de funciones puras (6 archivos en src/utils/__tests__/)
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
- **Ingesta por carpeta (`metricas/`)**: si piden «procesá las métricas nuevas
  de <pilar>», buscar en `metricas/<pilar>/` las carpetas de mes que no
  estén en `_procesados/` (la convención es `AAAA-MM`, pero el equipo puede
  subirlas con otro nombre, p. ej. «Metricas 2026-08 Social Media»: se
  procesan igual y se archivan como `_procesados/AAAA-MM`), correr el tooling
  correspondiente, verificar, deployar y mover la carpeta en el mismo commit.
  - **Social**: `python3 scripts/linkedin/build_monthly.py mXX="<carpeta>"` y
    `build_country_seg.py acc=cul mXX=…` + `acc=cuna mXX=…`. Los tres scripts
    **fusionan** el mes nuevo con lo ya cargado en `src/data/` (los crudos de
    meses anteriores no viven en el repo). Después sumar el mes a `ML`/`MO`
    en `socialSeed.js` y mover `defaultPeriod` de Social en el registry.
    Requiere `pip install openpyxl xlrd`. Si un drop trae un nombre de
    subcarpeta nuevo, ajustar `FOLDER_MATCHERS` en `extract_raw.py`.
  - **Email/Webinars**: construir el parser con el primer drop real.
- Para sumar datos nuevos de Paid: parsear el CSV de Google Ads, separar por
  prefijo de mercado, agregar al seed (respetando el shape existente), y actualizar
  este archivo (§6). Verificar con `npm run build` + captura (Playwright headless,
  ver historial) antes de pushear.
- **Paid mensual**: además del seed, correr
  `python3 scripts/paid/build_detail.py mXX <semanal.csv> <terminos.csv>` para el
  detalle por grupo. El script **fusiona** el mes nuevo y conserva los anteriores.
  Validar siempre el seed contra el semanal antes de deployar.
- **Todo texto nuevo visible va en ES y EN.** Si se agrega una sección a un pilar,
  sumar las claves al `*I18n.js` correspondiente y pasar `lang` a los generadores.
- **Nunca convertir monedas** ni sumar importes de monedas distintas (ver §7).
- Respetar honestidad de datos, jerarquía de marca (MarComms principal, cliente en
  segundo plano) y español argentino.
- Reutilizar los componentes `shared/` (Funnel, KpiCard, InsightsPanel,
  PerformancePanels) para mantener la estética uniforme entre pilares.
- Verificar antes de pushear: `npm run lint`, `npx vitest run`, `npm run build` y
  una pasada por el navegador (Playwright headless) del pilar tocado, en ES y EN.
- Flujo de deploy: commit → merge fast-forward a `main` → **push solo de
  `main`**. Vercel publica solo. **No pushear la rama de trabajo** (pedido del
  10/9/2026: en GitHub debe existir únicamente `main`).
- **Al cerrar una sesión de trabajo**: actualizar §15 de este archivo, sumar al
  final de `docs/historial-pedidos.md` lo que pidió el equipo, y anotar en
  `docs/DECISIONES.md` cualquier criterio nuevo que valga para el futuro. Es lo
  único que sobrevive entre sesiones y entre cuentas.

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
- **Paid: Resumen del Año 2026 + Comparativa Multi-Cuenta** (acumulado Google
  Ads por meses con datos; GEO de Meta transparentado aparte, con nota).
- **Descarga multi-período**: el diálogo de descarga lista los períodos con
  datos de la cuenta y permite tildar varios — un HTML por período.
- **Website: Resumen del Año + Comparativa Multi-Cuenta** (acumulado de
  trimestres con datos; Peterson sin Search Console muestra «—» en SEO).
- **Descarga multi-período en UN archivo**: los períodos tildados van en un
  solo HTML con botonera «Período» interna (EmbedApp remonta la vista con el
  snapshot del período elegido).
- **Webinars: primer contenido real — reporte MIXTO por evento** (ISO 14064,
  Jul 2026): Livestorm + Mailchimp + LinkedIn + HubSpot en un solo reporte
  (key insights, embudo, email, social, hot leads con scoring 0-100,
  diagnóstico de madurez, oportunidad comercial POTENCIAL). Inputs manuales
  por evento: pipeline HubSpot, costo de producción, duración total.
- **Webinar EUDR (Ago 2026)**: segundo evento y el único visible hoy (el de ISO
  quedó oculto a pedido del equipo, con datos intactos). Sumó botonera de vistas
  con glosario por vista, atribución real del canal email (56 registrados con
  clic sobre 295), hero cards para las métricas clave y deals priorizados
  (1 hot + 26 warm).
- **Email Marketing con datos reales**: primera campaña cargada (`cups`, m08 —
  la del webinar EUDR) con `scripts/mailchimp-to-seed.mjs`.
- **Idioma ES/EN en los 5 pilares** con español por defecto, más elección del
  idioma principal al descargar (viaja en el embed; el toggle sigue adentro).
  Diccionarios `*I18n.js` por pilar y glosarios `*En`.
- **Marca MarComms como principal**: logo en el header (donde antes iba el del
  cliente), logo al pie enfrentado al tagline, isotipo como favicon de la app y
  de los descargables. El logo del cliente pasó a segundo plano.
- **Paid Agosto 2026**: 5 cuentas incluyendo la nueva **CU Estados Unidos**;
  detalle por grupo de anuncios de todas; validado contra el semanal.
- **Campañas parciales**: `startedOn` + aviso de días activos, para campañas que
  arrancan a mitad de mes (las dos de USA, creadas el 21/8).
- **Cambio de moneda EUR → ARS** (agosto, por cambio de cuenta de Google Ads):
  el Resumen del Año y la Comparativa cubren el año completo y muestran los
  importes como sumatoria por moneda, sin convertir; cada mes conserva la suya.
- **Fixes del tooling de Paid**: el parseo de miles rompía los números de 4 cifras
  (`5.561` → `5`), `build_detail.py` pisaba los meses ya cargados en vez de
  fusionarlos, y los textos de insights tenían el símbolo `€` fijo.
- **Documentación reordenada antes de mudar el proyecto a otra cuenta de Claude**:
  `CLAUDE.md`, `README.md` y `DEPLOY.md` reescritos sin la arquitectura Supabase;
  se eliminaron `SETUP_SUPABASE.md`, `SETUP_AUTOIMPORT.md` y `supabase/`; se
  sumaron `docs/DECISIONES.md` (criterios y su porqué) y
  `docs/historial-pedidos.md` (registro textual de los pedidos del equipo, para
  que el contexto de las conversaciones no se pierda al cambiar de cuenta).
- **Vista por CLIENTE** (unidad de negocio + país/región): nueva entrada
  «Clientes» en la nav, solo para clientes con más de un pilar con datos.
  Mapa explícito cliente → cuenta por pilar (`constants/clients.js`),
  `clientService` + `clientSummary` (reusa los generadores de insights de cada
  pilar), vista General con hero cards/plan de acción/resumen/diagnóstico/
  próximos pasos por pilar, botonera para entrar a cada pilar con su propio
  período, ES/EN, descarga HTML de la General. `SocialApp` acepta `country`
  para fijar el país de una cuenta segmentada; `HeroCard` pasó a `shared/`.
  Tests: `clientService.test.js`, `clientSummary.test.js`.
- **Social Agosto 2026**: primer mes procesado desde la carpeta `metricas/`
  (9 cuentas, exports del 1 al 31/8, con benchmark de competidores y
  segmentación por país). El tooling de LinkedIn pasó a **fusionar** el mes
  nuevo con los seeds existentes (antes regeneraba todo y exigía los crudos
  de todos los meses) y reconoce los nombres de carpeta del drop («PS
  GLOBAL», «PS IBERIA & AMERICA», «BEL»). Carpeta archivada en
  `metricas/social-media/_procesados/2026-08/`.
- Paid arranca por defecto en **Agosto 2026** (antes quedaba en julio).
- **Modo DEMO temporal** en `/demo` (10/9/2026): cifras visibles enmascaradas
  con «x» para grabar un recorrido del sistema. Se usó para la grabación y
  **se eliminó el mismo día** a pedido del equipo; si hiciera falta de nuevo,
  está en el historial de git (commit «Modo DEMO temporal en /demo»).
