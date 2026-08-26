# Social Media — drops de LinkedIn

Carpeta de ingesta para los exports mensuales de **LinkedIn Analytics**
(las 9 cuentas). El tooling que los procesa es `scripts/linkedin/`.

## Estructura esperada

```
social-media/
└── 2026-08/                        ← una carpeta por mes (AAAA-MM)
    ├── CU Latinoamerica/           ← una subcarpeta por cuenta
    │   ├── *_content_*.xls
    │   ├── *_followers_*.xls
    │   ├── *_visitors_*.xls
    │   └── *competitor*.xlsx
    ├── CU North America/
    │   └── …
    └── … (resto de las cuentas)
```

- **No renombrar los archivos**: se suben tal cual los exporta LinkedIn.
  El nombre de la **subcarpeta** es lo que identifica la cuenta.
- Exportar desde cada página: **Analytics → Exportar** los 3 archivos del
  mes (contenido, seguidores, visitantes) + el de competidores.
- Rango del export: **del día 1 al último día del mes**.

## Cuentas (los nombres de subcarpeta deben reconocerse)

| Cuenta | id interno |
|--------|-----------|
| CU Latinoamérica | `cul` |
| CU España | `cue` |
| CU Portugal | `cup` |
| CU Norte | `cun` |
| CU North America | `cuna` |
| Peterson Solutions | `ps` |
| Peterson Iberia+AM | `pia` |
| TLR Perú | `tlr` |
| Biomass Energy Lab | `bel` |

## Qué hace Claude al procesar

1. `build_monthly.py` → regenera `src/data/socialMonthly.js` (KPIs + top posts
   por cuenta).
2. `build_country_seg.py acc=cul` y `acc=cuna` → regenera la segmentación por
   país de CU Latinoamérica y CU North America.
3. Verifica los reportes en el navegador, deploya a producción y mueve la
   carpeta del mes a `_procesados/`.

Pedido típico: **«Procesá las métricas nuevas de Social Media»**.
