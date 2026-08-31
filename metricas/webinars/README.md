# Webinars — drops de Livestorm

Carpeta de ingesta para los exports de **Livestorm**.

> ⚠️ Este pilar todavía no tiene pipeline: se construye con el **primer drop
> real**. Cuando subas los primeros archivos, Claude arma el parser y la vista
> a partir de lo que Livestorm realmente exporta — por eso es clave subir los
> archivos **crudos, sin editar**.

## Estructura esperada

```
webinars/
└── 2026-08/                          ← una carpeta por mes (AAAA-MM)
    ├── livestorm_<lo-que-sea>.csv    ← prefijo "livestorm_"
    └── livestorm_<otro-export>.csv
```

- **Prefijo obligatorio**: `livestorm_`. El resto del nombre es libre.
- Si un webinar puntual genera varios exports (registrados, asistentes,
  replay, encuestas), subirlos todos en la carpeta del mes en que ocurrió.
- Formato preferido: **CSV**; si la plataforma solo da Excel, subir el `.xlsx`.

Pedido típico: **«Procesá las métricas nuevas de Webinars»**.

## El reporte mixto (Webinars + Email + Social + HubSpot)

Cada webinar genera un **reporte mixto** en el pilar Webinars (un período por
evento), pensado para entrega al cliente: key insights, campaña de email,
posteos de LinkedIn, hot leads (metodología de scoring de julio 2026) y
oportunidad comercial **potencial**. Los reportes por pilar siguen existiendo
para mejora interna.

**Inputs manuales que provee el equipo por cada evento** (no salen de los
exports): link al pipeline de HubSpot con los hot leads, costo de producción
del webinar, y duración total del evento. Hasta que se pasen, el reporte los
muestra como pendientes (nunca los inventa).
