# Paid Media — drops de Google Ads y Meta Ads

Carpeta de ingesta de Paid Media. Hay **dos flujos**, uno por plataforma:

| Plataforma | Qué se sube | Carpeta | Reporte que genera |
|------------|-------------|---------|--------------------|
| **Google Ads** | Un **mes completo**, todas las campañas de todas las cuentas | `google-ads/AAAA-MM/` | El mes de cada cuenta (KPIs, campañas, consumo semanal, grupos y términos) |
| **Meta Ads** | **Una campaña puntual** (vuelos cortos, de una o pocas semanas) | `meta-ads/AAAA-MM-<campaña>/` | Un reporte propio de esa campaña, que aparece como una opción más en «Período/Campaña» |

Tooling: `scripts/paid/build_month.py` (Google Ads) y
`scripts/paid/build_meta.py` (Meta Ads). Detalle técnico en
`scripts/paid/README.md`.

---

## Google Ads — un mes de todas las campañas

Cuando **cierra el mes** (del 1 al último día), descargar los **3 informes
guardados** del Editor de informes de Google Ads, con el rango de fechas en
el mes completo, en **CSV** y sin renombrar columnas:

1. **«Métricas Mensuales - Todas las campañas»** — nivel campaña. Columnas:
   Campaña, Código de moneda, Impr., Clics, CTR, CPC medio, Coste,
   Conversiones.
2. **«Semanal por grupo de anuncios»** — Campaña → Grupo de anuncios →
   Semana, con Impr., Clics, Coste, Conversiones, Cuota de impr. de búsqueda
   y Cuota impr. perd. de búsq. (ranking).
3. **«Términos de búsqueda + Palabras clave»** — Campaña → Grupo → Palabra
   clave → Término, con Tipo de concordancia, Impr., Clics, Coste,
   Conversiones. **La columna Campaña es obligatoria.**

```
paid-media/google-ads/
└── 2026-09/                                ← una carpeta por mes (AAAA-MM)
    ├── Metricas_Mensuales_Todas_las_campanas.csv
    ├── Semanal_por_grupo.csv
    └── Terminos_y_keywords.csv
```

Los nombres de archivo no importan: el tooling reconoce cada informe por sus
columnas, y el export puede venir en español o en inglés. Las cuentas se reconocen por el prefijo del nombre de la campaña
(`CU España`, `CU Portugal`, `CU Canada`, `PS Argentina`, `CU United
States`, `CU Argentina`, `PCU - España`, `PCU - Argentina`); si aparece un prefijo nuevo, el proceso corta y avisa en vez de
asignarlo mal.

**Si una campaña arrancó a mitad de mes**, avisarlo al subir (con la fecha
de creación del historial de cambios de Google Ads): el reporte la marca
como «Parcial».

## Meta Ads — una campaña puntual

En Meta hacemos campañas más chicas, con inicio y fin de una o pocas
semanas. **Cada campaña se sube y se reporta por separado**, cuando termina
el vuelo.

En el **Administrador de anuncios**, filtrar la campaña (o las campañas, si
son varias del mismo vuelo, por ejemplo Tráfico + WhatsApp), poner como
rango de fechas **del primer al último día de la campaña** y exportar
(*Exportar → Exportar datos de la tabla*, en CSV o Excel) estas vistas:

| Archivo | Nivel | Desglose | ¿Obligatorio? |
|---------|-------|----------|---------------|
| **diario** | Campañas | Por tiempo → **Día** | Sí |
| **total** | Campañas | Sin desglose | Sí (da el alcance único del período) |
| **plataforma** | Campañas | Por entrega → **Plataforma** | Recomendado |
| **edad** | Campañas | Por entrega → **Edad** | Recomendado |
| **sexo** | Campañas | Por entrega → **Sexo** | Recomendado |
| **hora** | Campañas | Por tiempo → **Hora del día** | Opcional |
| **anuncios** | **Anuncios** | Sin desglose | Recomendado (creativos) |

Columnas que tienen que estar en todos: **Nombre de la campaña, Importe
gastado, Impresiones, Alcance, Frecuencia, Clics en el enlace, Clics únicos
en el enlace, Clics salientes, Resultados e Indicador de resultado.** Si la
campaña es de WhatsApp, sumar *Conversaciones con mensajes iniciadas*; si
usa formulario instantáneo de Meta, *Clientes potenciales*.

Edad y sexo van en **dos exports separados**: si vienen juntos, Meta no
permite sumar el alcance por edad o por sexo y esa columna queda vacía.

```
paid-media/meta-ads/
└── 2026-10-smeta/                          ← una carpeta por campaña: AAAA-MM-<campaña>
    ├── diario.csv
    ├── total.csv
    ├── plataforma.csv
    ├── edad.csv
    ├── sexo.csv
    ├── hora.csv
    ├── anuncios.csv
    └── campaña.json                        ← opcional (ver abajo)
```

`AAAA-MM` es el mes en que **arrancó** la campaña. Sin dos puntos ni barras
en los nombres (`10:09:2026 …` rompe un checkout en Windows).

### `campaña.json` (opcional)

Todo lo que no viene en el export de métricas. Si no se sube, el reporte se
arma igual con lo que trae Meta: el nombre del período sale de la carpeta y
el objetivo, del tipo de campaña.

```json
{
  "label": "Meta · SMETA · Oct 2026",
  "labelEn": "Meta · SMETA · Oct 2026",
  "objetivo": { "es": "Captar leads de productores para auditorías SMETA", "en": "Capture producer leads for SMETA audits" },
  "segmentacion": { "es": "Argentina · productores frutihortícolas, 30–65 años", "en": "Argentina · fruit and vegetable growers, 30–65" },
  "evento": "Congreso X 2026",
  "campañas": {
    "CU ARG - SMETA - Octubre 2026": { "tipo": "leads", "presupuesto": 150000 }
  }
}
```

- `tipo` (si no se aclara, se deduce del indicador de resultado o del
  nombre): `traffic` (tráfico al sitio), `leads` (formulario instantáneo de
  Meta), `whatsapp` (conversaciones), `awareness` (alcance), `engagement`,
  `typeform` u `hsform` (tráfico a un Typeform o a un formulario de HubSpot).
- `cuenta`: solo si el nombre de la campaña no empieza con el prefijo de la
  cuenta (`CU ARG`, `PS ARG`, `Peterson`, `CU España`…).
- `evento`: solo para campañas GEO atadas a un evento físico.

El funnel del formulario (Typeform, HubSpot) **no viene en el export de
Meta**: si se quiere en el reporte, subir también el export de respuestas
del formulario o una captura del panel, y avisarlo.

---

## Qué hace Claude al procesar

- **Google Ads**: `python3 -B scripts/paid/build_month.py
  "metricas/paid-media/google-ads/AAAA-MM"` → valida que el semanal cuadre
  exacto con el informe de campañas (si no, corta), genera el detalle por
  grupo (`paidDetail.js`) e imprime el bloque del mes para `paidSeed.js`;
  Claude lo carga, redacta el análisis con esos números, mueve el período
  por defecto al mes nuevo y valida el seed campaña por campaña.
- **Tipo de cambio del mes** (para descargar en ARS, USD o EUR): Claude busca
  el cierre del último día hábil del mes del reporte (si se sube septiembre
  en octubre, el del 30/09): el dólar oficial del Banco de la Nación
  Argentina (billete vendedor, validado en al menos 2 fuentes) y el
  euro/dólar oficial del BCE de ese día (resolución del Banco de España en
  el BOE). El euro en pesos se calcula como dólar BNA × euro/dólar BCE. Se
  carga en `src/data/fxRates.js` con las fuentes anotadas.
  `build_month.py` avisa si falta y el test `fxService.test.js` falla si un
  mes en ARS no lo tiene.
- **Meta Ads**: `python3 -B scripts/paid/build_meta.py
  "metricas/paid-media/meta-ads/AAAA-MM-<campaña>"` → valida que el diario
  cuadre con el total (si no, corta), escribe
  `src/data/paidMeta/<id>.js` y lo registra como período nuevo.
- En los dos casos: verifica el reporte en el navegador (ES y EN), deploya y
  archiva la carpeta en `_procesados/` en el mismo commit.

Pedido típico: **«Procesá las métricas nuevas de Paid Media»** (o «…de
Google Ads de septiembre», «…de la campaña de Meta X»).
