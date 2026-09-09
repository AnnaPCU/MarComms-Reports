# Reportes MarComms

Dashboard multi-pilar de analytics de marketing que produce el equipo de
**MarComms** (agencia interna de marketing digital del grupo PCU) para
**Control Union** y **Peterson Solutions**.

SPA de React + Vite + Tailwind, **sin backend ni base de datos**: los datos viven
en el código y viajan en el bundle. Deploy en Vercel desde `main`.

🔗 <https://mar-comms-reports.vercel.app/> · login compartido del equipo.

> ⚠️ Proyecto independiente del MarComms Hub — no integrar todavía (ver `CLAUDE.md`).

## Pilares

| Pilar | Fuentes | Período | Estado |
|-------|---------|---------|--------|
| Social Media | LinkedIn | Mensual | Mar–Jul 2026 · 9 cuentas + reportes por país |
| Paid Media | Google Ads, Meta Ads | Mensual | Feb–Ago 2026 · 5 cuentas |
| Website | GA4, Search Console | **Trimestral** | Q1–Q2 2026 · 12 cuentas |
| Email Marketing | Mailchimp, Apollo | Mensual | Ago 2026 (campaña del webinar EUDR) |
| Webinars | Livestorm/Teams + Mailchimp + LinkedIn + HubSpot | Por evento | Webinar EUDR · Ago 2026 |

Cada reporte tiene botonera **ES/EN**, glosario al pie y se puede **descargar como
HTML interactivo** que funciona offline.

**Regla de honestidad**: si no hay datos reales para (cuenta, período) →
"Sin información suficiente". Nunca números inventados.

## Desarrollo local

```bash
npm install
npm run dev        # http://localhost:5173
npm run lint       # eslint sobre src/
npx vitest run     # tests de funciones puras
npm run build      # build de producción → dist/
npm run preview    # sirve el build ya compilado
```

### Variables de entorno

Copiá `.env.example` a `.env.local`. Hay una sola, y es opcional:

```env
VITE_SHARED_PASSWORD=marcomms2026   # login compartido del equipo
```

No hay credenciales de backend porque no hay backend.

## Cómo se cargan los datos

Export de la plataforma → tooling (`scripts/`) → seed (`src/data/*Seed.js`) →
commit → deploy. **No hay import por la web.**

Los responsables de Social, Email y Webinars dejan los exports crudos en
`metricas/<pilar>/AAAA-MM/` (ver [`metricas/README.md`](metricas/README.md));
Paid y Website llegan como adjuntos en la conversación.

## Documentación

| Archivo | Para qué |
|---------|----------|
| [`PROJECT_CONTEXT.md`](PROJECT_CONTEXT.md) | **Empezar por acá.** Estado actual del proyecto |
| [`CLAUDE.md`](CLAUDE.md) | Marca, reglas y convenciones |
| [`docs/DECISIONES.md`](docs/DECISIONES.md) | El porqué de los criterios |
| [`docs/historial-pedidos.md`](docs/historial-pedidos.md) | Registro de lo que pidió el equipo, por fecha |
| [`metricas/README.md`](metricas/README.md) | Cómo entregar los exports de cada pilar |
| [`scripts/paid/README.md`](scripts/paid/README.md) | Tooling de Google Ads |
| [`DEPLOY.md`](DEPLOY.md) | Integración GitHub → Vercel |
