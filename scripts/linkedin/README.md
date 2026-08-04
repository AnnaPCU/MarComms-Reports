# Tooling — LinkedIn → seed mensual de Social

Procesa los exports mensuales de LinkedIn (las 9 cuentas) y genera
`src/data/socialMonthly.js`, que el seed mergea automáticamente.

## Flujo mensual (el que usa Anna)

1. En cada página de LinkedIn: **Analytics → exportar** los 3 archivos del mes
   (contenido, seguidores, visitantes) + el de competidores. Guardarlos en una
   carpeta por cuenta (el nombre de la carpeta identifica la cuenta).
2. Zipear la carpeta del mes y adjuntarla en la conversación de Claude.
   **No hace falta unificar ni renombrar nada.**
3. Claude corre el tooling, verifica que el mes esté completo (1 → fin de mes),
   regenera `socialMonthly.js` y deploya.

## Uso manual

```bash
pip install openpyxl xlrd
python3 scripts/linkedin/build_monthly.py \
  m03="/ruta/Metricas mensuales LKD Marzo" \
  m04="/ruta/METRICAS UNIFIED ABRIL" ...
```

Cada ruta acepta dos formatos (se detectan solos):

- **Crudo** (preferido): subcarpeta por cuenta con `*_content_*.xls`,
  `*_followers_*.xls`, `*_visitors_*.xls` y `*competitor*.xlsx`.
- **Unificado** (legado): un `.xlsx` consolidado por cuenta con hoja Índice.

## Qué calcula

- `imp/clk`: totales del mes (hoja Indicadores, columnas "(totales)").
- `er`: (clics + reacciones + comentarios + compartidos) / impresiones × 100.
- `vis`: visitantes únicos del mes · `fol`: seguidores nuevos del mes.
- `posts`: top 5 del mes por impresiones (título, link, ER, clics, tipo).
- `comp`: benchmark de competidores (seguidores, nuevos, interacciones, posts
  por página del set; `own:true` marca la fila propia).

## Cuentas reconocidas

`cul` CU Latinoamérica · `cue` CU España · `cup` CU Portugal · `cun` CU Norte ·
`cuna` CU North America · `ps` PS Global · `pia` PS Iberia & Americas ·
`tlr` TLR Perú · `bel` Biomass Energy Lab. La resolución es difusa por nombre
de archivo/carpeta; si un mes agrega o quita cuentas, ajustar `MATCHERS` /
`FOLDER_MATCHERS`.
