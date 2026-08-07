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

## Segmentación por país (CU Latinoamérica y CU North America)

`build_country_seg.py` genera los seeds de reportes por país:

- `acc=cul` → `src/data/socialLatam.js` (Argentina, Brasil, Chile, Perú,
  México, Ecuador)
- `acc=cuna` → `src/data/socialNorthAm.js` (USA, Canadá)

```bash
python3 scripts/linkedin/build_country_seg.py acc=cuna \
  m03="/ruta/Metricas mensuales LKD Marzo" \
  m07="/ruta/.../Control_Union_North_America_unified.xlsx" ...
```

Cada arg de mes acepta la carpeta cruda del mes (resuelve sola la subcarpeta
de la cuenta) o el `.xlsx` unificado de la cuenta. Metodología:

- **Posts por país**: se atribuyen por hashtag (`#ControlUnionArgentina`,
  `#ControlUnionUSA`, …) o país nombrado en la primera línea. Posts sin
  marcador (p. ej. `#ControlUnion` regional) quedan sin atribuir — el conteo
  va en `_tot.un` y se transparenta en la vista.
- Las métricas por post son **acumuladas al momento del export**, por eso la
  base de cálculo del mes (`_tot`) difiere de los totales de la cuenta.
- **vis**: visualizaciones de página por ubicación (hoja `visitors -
  Ubicación`) agregadas por país. **folBase**: seguidores por ubicación
  (foto acumulada al export — NO es serie mensual; la vista muestra la del
  export más reciente).
- **USA**: LinkedIn no agrega ", Estados Unidos" a sus áreas metro; se
  detectan por estado de EE. UU. como sufijo ("Austin ..., Texas") o metro
  sin país ("Miami-Fort Lauderdale y alrededores").

Al cargar un mes nuevo, correr `build_monthly.py` y `build_country_seg.py`
**una vez por cuenta segmentada** (`acc=cul` y `acc=cuna`).

## Cuentas reconocidas

`cul` CU Latinoamérica · `cue` CU España · `cup` CU Portugal · `cun` CU Norte ·
`cuna` CU North America · `ps` PS Global · `pia` PS Iberia & Americas ·
`tlr` TLR Perú · `bel` Biomass Energy Lab. La resolución es difusa por nombre
de archivo/carpeta; si un mes agrega o quita cuentas, ajustar `MATCHERS` /
`FOLDER_MATCHERS`.
