# CLAUDE.md — Reportes MarComms

Guía de trabajo para cualquier sesión de Claude Code sobre este repo.

> **Orden de lectura.** Este archivo tiene las reglas permanentes (marca, stack,
> convenciones). Para el **estado actual** del proyecto leer `PROJECT_CONTEXT.md`;
> para el **porqué** de cómo están hechas las cosas, `docs/DECISIONES.md`. Si algo
> se contradice, manda `PROJECT_CONTEXT.md`, que es el que se actualiza en cada
> sesión.

> ⚠️ **Proyecto independiente del MarComms Hub — no integrar todavía.**
> Este dashboard se desarrolla y despliega por separado. No conectar, importar ni
> acoplar con el Hub hasta nueva indicación.

---

## Qué es

Dashboard web multi-pilar de analytics de marketing que produce el equipo de
**MarComms** (agencia interna de marketing digital del grupo PCU) para sus
clientes **Control Union** y **Peterson Solutions**. Muestra reportes por pilar,
por cuenta/región y por período, y permite **descargar cada vista como un HTML
interactivo** que funciona offline.

## Stack

- **React 18 + Vite 5** · **Tailwind 3** · **Recharts** · **lucide-react**.
  Sin Next.js.
- **Sin backend y sin base de datos.** Los datos viven en el seed en código
  (`src/data/*Seed.js`) y viajan en el bundle publicado.
- **Deploy en Vercel**, auto-deploy desde `main`.
- Única variable de entorno: `VITE_SHARED_PASSWORD` (opcional; default
  `marcomms2026`).

> **No reintroducir Supabase, backend ni import por la web** sin pedido explícito:
> se descartaron a propósito (`docs/DECISIONES.md` §9).

## Cómo entran los datos

Export de la plataforma → tooling (`scripts/`) → seed (`src/data/*Seed.js`) →
commit → deploy. No hay import por UI ni base de datos.

| Pilar | Fuentes | Cómo llegan los archivos |
|-------|---------|--------------------------|
| **Social Media** | LinkedIn Analytics | carpeta `metricas/social-media/` |
| **Paid Media** | Google Ads, Meta Ads | adjuntos en la conversación |
| **Email Marketing** | Mailchimp, Apollo | carpeta `metricas/email-marketing/` |
| **Webinars** | Livestorm / Teams (+ Mailchimp, LinkedIn, HubSpot) | carpeta `metricas/webinars/` |
| **Website** | GA4, Search Console | adjuntos en la conversación |

**Ingesta por carpeta:** ante «procesá las métricas nuevas de \<pilar\>», buscar en
`metricas/<pilar>/` las carpetas `AAAA-MM` que no estén en `_procesados/`, correr
el tooling del pilar, verificar, deployar y mover la carpeta a `_procesados/` en
el mismo commit. Reglas completas en `metricas/README.md`.

---

## Reglas que no se negocian

### 1. Honestidad de los datos

**Si no hay datos reales para (cuenta, período), mostrar "Sin información
suficiente". Nunca inventar, estimar ni rellenar números.**

- La verificación se centraliza en `src/utils/hasData.js`.
- Si una métrica no existe en el export, se dice que no está — no se deduce.
- Una proyección se muestra como proyección, nunca como resultado.
- Nunca convertir monedas ni sumar importes de monedas distintas.

### 2. Idioma

- **Del código**: UI y comentarios en **español argentino** (vos, cliquear,
  tildar); variables y funciones en inglés.
- **Del reporte**: los 5 pilares tienen botonera **ES/EN**, con español por
  defecto. Cada pilar tiene su diccionario `src/utils/*I18n.js`, y los generadores
  de insights reciben `lang`. Al descargar se elige el idioma principal del
  archivo (viaja en `__REPORT_EMBED__.lang`), y adentro el toggle sigue andando.
- **Todo texto visible nuevo se agrega en los dos idiomas.**
- Formato numérico: es-AR en español (`1.234,56`), en-US en inglés.

### 3. Marca

**MarComms es la marca principal de los reportes**; el cliente va en segundo
plano.

- Logo MarComms horizontal arriba a la izquierda del header, logo chico al pie
  enfrentado al tagline, e isotipo como favicon (app y descargables).
  Assets en `public/marcomms-*`; originales en `assets/marca/marcomms/`.
- Logo del cliente (Control Union / Peterson): chico, sin etiqueta y con tope de
  ancho, para que no compita.

**Tokens de Control Union** (fuente de verdad: `src/constants/brand.js`):

| Token | Hex | Uso |
|-------|-----|-----|
| CU Cyan | `#3eb2ed` | Acento principal, KPIs, charts, barra superior |
| CU Dark Blue | `#1b1e42` | Texto destacado, paneles, barra inferior |
| CU Grey | `#799495` | Labels, texto secundario |
| CU Dark Grey | `#4f6566` | Texto de cuerpo |
| Fondo | `#f0f4f5` | Background general |
| Bordes | `#d8e2e3` / `#eaf0f1` | Separadores |

Paleta de charts:
`['#3eb2ed','#1b1e42','#799495','#6dc8f2','#2d3a8a','#9ab5b6','#0088cc','#4a5096']`

- **Tipografía**: Ubuntu (sustituto de Sansa Pro), fallback Calibri → sans-serif.
- **Dispositivos gráficos**: barra cyan full-width arriba, barra dark blue
  alineada a la derecha abajo.
- **Tagline** `The Proof to Your Promise`: al pie, **nunca** junto al logo.

### 4. Estructura de un reporte

Orden común en todos los pilares: **Insights (Plan de Acción)** → **KPIs** →
**Embudo** → gráficos y tablas propias → **Lectura de Performance** →
**Próximos Pasos** → **Glosario**.

- Insights, diagnóstico y próximos pasos se **generan de las métricas reales**
  (reglas fijas contra benchmarks, sin IA). No se hardcodean.
- **Próximos Pasos no se muestra en los reportes de uso externo.**
- **Vista por cliente** («Clientes» en la nav): cruza los pilares para un
  cliente (unidad de negocio + país/región) y **solo existe si el cliente tiene
  más de un pilar con datos**. El mapeo cliente → cuenta por pilar es explícito
  en `src/constants/clients.js`: al sumar una cuenta nueva a un pilar, agregarla
  ahí si pertenece a un cliente. Criterios en `docs/DECISIONES.md` §11.
- Reutilizar los componentes de `src/components/shared/` (KpiCard, ChartCard,
  Funnel, InsightsPanel, PerformancePanels, SectionHeader, Glossary) para que la
  estética se mantenga uniforme entre pilares.

---

## Convenciones de código

- `PascalCase.jsx` componentes · `useCamelCase` hooks · `camelCaseService.js`
  services · `SCREAMING_SNAKE` constantes.
- Alias `@/` para imports internos (resuelve por Vite; en scripts sueltos de Node
  no funciona).
- Capas: **UI → hooks → services → seed**. La UI no lee el seed directo.
- **Modo embed**: `main.jsx` detecta `window.__REPORT_EMBED__` (HTML descargado) y
  monta `EmbedApp` con el snapshot embebido.

## Verificación antes de deployar

```bash
npm run lint      # eslint sobre src/
npx vitest run    # tests de funciones puras
npm run build     # genera dist/
npm run preview   # sirve el build para revisarlo en el navegador
```

Además: pasada por el navegador (Playwright headless) del pilar tocado, **en ES y
en EN**, sin errores de consola. Al cargar un mes nuevo de Paid, validar el seed
contra el informe semanal campaña por campaña.

**Flujo de deploy**: commit en la rama de trabajo → push → merge fast-forward a
`main` → push. Vercel publica solo.

## Documentación del repo

| Archivo | Para qué |
|---------|----------|
| `PROJECT_CONTEXT.md` | Estado actual: qué hay cargado, qué falta, cómo está armado |
| `docs/DECISIONES.md` | El porqué de los criterios (lo que no se deduce del código) |
| `docs/historial-pedidos.md` | Registro textual de lo que pidió el equipo, por fecha |
| `metricas/README.md` | Cómo se entregan los exports de cada pilar |
| `scripts/paid/README.md` | Tooling de Google Ads (los 3 CSV, validaciones, cuentas) |
| `DEPLOY.md` | Integración GitHub → Vercel |
