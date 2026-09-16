# Webinars — drops por evento (Teams / Livestorm + Mailchimp)

Carpeta de ingesta de los exports de cada webinar. El tooling es
`scripts/webinars/build_event.py`.

## Qué subir por evento (formato real, validado con EUDR y Plastic Packaging)

1. **Excel de lead scoring** que arma el equipo por evento, con las hojas
   `Dashboard · Priority Leads · Lead Scoring · Registrations Raw ·
   Attendance Raw · Q&A Raw · Scoring Model` (registros y asistencia de
   Microsoft Teams ya cruzados, score por persona y modelo de puntaje).
2. Los **exports de destinatarios de Mailchimp** de la campaña del webinar
   (uno por envío) — van en `email-marketing/` (ver su README): el tooling los
   cruza con los registrados para la atribución del canal email.
3. **LinkedIn** (opcional pero recomendado): las métricas de los posteos del
   evento — el export, o capturas del panel «Rendimiento del anuncio» de cada
   post (una por post; las cifras se transcriben tal cual). Si no vienen, el
   reporte lo dice («Sin exports de LinkedIn para este evento») y no inventa
   nada.

Si Livestorm reemplaza a Teams, subir sus exports crudos: el parser se ajusta
con el primer drop real de esa plataforma.

## Estructura esperada

```
webinars/
└── 2026-09/                          ← una carpeta por mes (AAAA-MM); con dos
    ├── <Webinar X> Leads.xlsx           eventos en el mes, `AAAA-MM-<evento>`
    └── linkedin/ (opcional)             (ej. `2026-09-empco`)
```

Sin dos puntos ni barras en los nombres de archivo (`10:09:2026 …` rompe un
checkout en Windows): usar `2026-09-10` o el nombre del evento.

## Qué hace Claude al procesar

1. `python3 scripts/webinars/build_event.py "<leads.xlsx>" <carpeta email>` →
   JSON con todos los números del evento (registros, asistencia, países,
   empresas, engagement, leads priorizados, envíos y atribución del email).
   Tolera la columna «Internal / Partner» (EmpCo) además de «Internal»
   (Plastic). Si un lead no trae «Organization», usa el dominio del email
   corporativo (genéricos → «—»).
2. Redacta sobre esos números los textos del reporte mixto (hallazgo, lecturas,
   plan de acción) y carga el evento en `src/data/webinarsSeed.js`, en la
   cuenta que corresponda (CU Latinoamérica en español · CU Global en inglés
   · Peterson Solutions Iberoamérica en español, con logo de Peterson).
3. Verifica en el navegador, deploya y archiva la carpeta.

**Input manual que provee el equipo por cada evento** (no sale de los
exports): el costo de producción. Hasta que se pase, el reporte lo muestra
como pendiente (nunca lo inventa). El link al pipeline ya no se pide: el
botón apunta siempre a la vista general de deals de HubSpot
(`HUBSPOT_PIPELINE_URL` en `src/data/webinarsSeed.js`).

Pedido típico: **«Procesá las métricas nuevas de Webinars»**.
