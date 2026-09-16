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
   evento como **capturas** del panel «Rendimiento del anuncio» de cada post,
   en la subcarpeta `linkedin/` del evento, una imagen por post
   (`post-1.png`, `post-2.png`…). La captura tiene que mostrar el encabezado
   del post (página que lo publicó y primeras líneas del texto) y el panel
   completo de rendimiento (impresiones, interacciones, clics, reacciones,
   comentarios, compartidos). Las cifras se transcriben tal cual. Si no
   vienen, el reporte lo dice («Sin exports de LinkedIn para este evento») y
   no inventa nada.

Si Livestorm reemplaza a Teams, subir sus exports crudos: el parser se ajusta
con el primer drop real de esa plataforma.

## Estructura esperada

```
webinars/
└── 2026-09-empco/                    ← una carpeta por evento: `AAAA-MM-<evento>`
    ├── <Webinar X> Leads.xlsx        ← Excel de lead scoring (Teams)
    └── linkedin/                     ← capturas de los posteos (post-1.png, post-2.png…)
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

**No hay inputs manuales por evento.** El link al pipeline es fijo (el botón
apunta a la vista general de deals de HubSpot, `HUBSPOT_PIPELINE_URL` en
`src/data/webinarsSeed.js`) y el costo de producción no se pide ni se
muestra (decisión del 16/9/2026). La duración del evento sale del export de
asistencia de Teams (ventana del organizador y entradas/salidas de los
asistentes).

Pedido típico: **«Procesá las métricas nuevas de Webinars»**.
