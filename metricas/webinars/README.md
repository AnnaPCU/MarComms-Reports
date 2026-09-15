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
   evento. Si no vienen, el reporte lo dice («Sin exports de LinkedIn para
   este evento») y no inventa nada.

Si Livestorm reemplaza a Teams, subir sus exports crudos: el parser se ajusta
con el primer drop real de esa plataforma.

## Estructura esperada

```
webinars/
└── 2026-09/                          ← una carpeta por mes (AAAA-MM)
    ├── <Webinar X> Leads.xlsx        ← Excel de lead scoring
    └── linkedin/ (opcional)
```

## Qué hace Claude al procesar

1. `python3 scripts/webinars/build_event.py "<leads.xlsx>" <carpeta email>` →
   JSON con todos los números del evento (registros, asistencia, países,
   empresas, engagement, leads priorizados, envíos y atribución del email).
2. Redacta sobre esos números los textos del reporte mixto (hallazgo, lecturas,
   plan de acción) y carga el evento en `src/data/webinarsSeed.js`, en la
   cuenta que corresponda (LATAM en español · Global en inglés).
3. Verifica en el navegador, deploya y archiva la carpeta.

**Inputs manuales que provee el equipo por cada evento** (no salen de los
exports): link al pipeline de HubSpot y costo de producción. Hasta que se
pasen, el reporte los muestra como pendientes (nunca los inventa).

Pedido típico: **«Procesá las métricas nuevas de Webinars»**.
