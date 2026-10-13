# Tooling — Paid Media (Google Ads + Meta Ads)

Dos flujos, los dos por carpeta (`metricas/paid-media/`, ver su README para
qué exportar):

| Script | Entrada | Salida |
|--------|---------|--------|
| `build_month.py` | `google-ads/AAAA-MM/` (3 CSV de un mes) | bloque del mes para `src/data/paidSeed.js` + `src/data/paidDetail.js` |
| `build_detail.py` | los CSV 2 y 3 (lo llama `build_month.py`) | `src/data/paidDetail.js` (fusiona, no pisa) |
| `build_meta.py` | `meta-ads/AAAA-MM-<campaña>/` (exports de Meta) | `src/data/paidMeta/<id>.js` + registro en `src/data/paidMetaGeo.js` |

## Google Ads — mes completo

Cada mes se descargan **3 CSVs** de Google Ads (informes guardados en el
Editor de informes — solo ajustar la fecha al mes completo, o programar el
envío por mail):

1. **Rendimiento de campañas** ("Métricas Mensuales - Todas las campañas"):
   nivel campaña, mes completo. Alimenta los totales y la tabla de campañas.
2. **Semanal por grupo de anuncios**: filas Campaña → Grupo → Semana;
   columnas Impresiones, Clics, CTR, CPC medio, Coste, Conversiones,
   Cuota de impr. de búsqueda, Cuota impr. perd. (ranking).
   Alimenta "Consumo del Presupuesto — Semana a Semana".
3. **Términos de búsqueda + Palabras Clave**: filas Campaña → Grupo →
   Palabra clave → Término; columnas Concordancia, Impr., Clics, Coste,
   Conversiones. Alimenta "Detalle por Grupo de Anuncio".

```bash
python3 -B scripts/paid/build_month.py "metricas/paid-media/google-ads/2026-09"
# opcional: moneda=ARS (si el informe 1 no trae «Código de moneda»), mes=m09, --dry-run
```

`build_month.py` reconoce cada CSV por sus columnas, valida que el semanal
cuadre **exacto** con el informe de campañas (por cuenta y por campaña; si
no, corta sin escribir nada), corre `build_detail.py` e imprime, por cuenta,
el bloque `mXX` para `paidSeed.js` (totales, campañas ordenadas por coste,
`analysis` vacío). Claude pega el bloque, redacta el análisis con esos
números (como los meses anteriores), mueve `defaultPeriod` de Paid en el
registry y valida campaña por campaña. Avisa las campañas cuya primera
semana con impresiones es la tercera del mes o después: puede ser un inicio
a mitad de mes (`startedOn`, del historial de cambios de Google Ads).

> El lector del informe 1 se armó con los nombres de columna estándar del
> export en español y se probó recreando agosto 2026 desde el seed (231
> comparaciones, 0 diferencias). Si el primer CSV real trae columnas con
> otro nombre, se ajustan los alias en `build_month.py`.

## Meta Ads — campaña puntual

```bash
python3 -B scripts/paid/build_meta.py "metricas/paid-media/meta-ads/2026-10-smeta"   # --dry-run para ver sin escribir
```

- Reconoce cada export por sus columnas (diario, total, plataforma, edad,
  sexo, hora, anuncios), en español o en inglés, CSV o Excel.
- Valida que el **diario cuadre con el total** (impresiones, importe,
  clics); si no, corta. Si un desglose no suma lo mismo que el diario, lo
  avisa (Meta a veces deja una impresión afuera) y lo carga igual.
- **Alcance y clics únicos no se suman** entre filas: si el export viene por
  conjunto de anuncios con más de uno por campaña, quedan «—».
- Cuenta por prefijo del nombre (`CU ARG`, `PS ARG`, `Peterson`,
  `CU España`…) o `cuenta` en `campaña.json`. Moneda de la columna «Importe
  gastado (XXX)»; nunca mezcla monedas.
- Tipo de campaña (`traffic`, `leads`, `whatsapp`, `awareness`,
  `engagement`, `typeform`, `hsform`) del indicador de resultado o del
  nombre, o `tipo` en `campaña.json`. Solo `whatsapp` y `leads` llevan
  «resultado» propio (conversaciones / leads); en el resto el resultado de
  Meta son los mismos clics o el alcance y no se duplica.
- Id del período: `meta-<carpeta>-AAAAMM` (o `id` en `campaña.json`; los
  GEO de evento usan `geo-…`). Si la campaña ya estaba cargada, la reemplaza.
- El reporte toma del seed lo propio de cada campaña (`objective`,
  `targeting`, `texts`, `nextSteps`); período y entrega efectiva salen de
  los días con impresiones.

> Probado recreando los exports de Aapresid desde su seed: el script
> reproduce los 700 valores sin diferencias. Como no hay todavía un export
> real guardado en el repo, con el primer drop se confirman los nombres de
> columna (los alias están en `COLS` de `build_meta.py`).

## Validaciones de Google Ads

- El semanal debe **cuadrar exacto** contra los totales del mes por cuenta
  (impresiones, clics, coste, conversiones).
- El coste de los términos NO suma el 100% (Google oculta búsquedas de bajo
  volumen); se informa en la UI, no es un error.
- "Cuota perdida por presupuesto" no existe a nivel grupo: se estima como
  `100 − cuota − perdida por ranking` cuando ambas son numéricas.

## Cuentas reconocidas

Prefijos de campaña: `CU España` (es) · `CU Portugal` (pt) · `CU Canada`
(cuc) · `PS Argentina` (psar) · `CU United States` (cuus, "CU Estados
Unidos" en la app). Nombres de campaña normalizados igual que en paidSeed
(Plásticos, Bioenergía, etc.). Si aparece un prefijo nuevo, el script corta
con error en vez de asignar mal: hay que sumarlo al mapa `ACC`.

## Cosas a tener en cuenta

- **El script fusiona, no pisa.** `build_detail.py` reescribe solo el mes que
  se le pasa y conserva los meses ya cargados en `paidDetail.js` (antes cada
  corrida borraba el resto).
- **Columna `Campaña` obligatoria en el informe de términos.** Sin ella los
  grupos no se pueden atribuir a su cuenta: hay nombres de grupo repetidos en
  varias cuentas (PEFC, GRS, GOTS, Smeta, ISCC…).
- **Separador de miles.** En el export en español el `.` siempre es separador
  de miles (`5.561`) y la `,` el decimal (`103366,25`). El parser los limpia
  como corresponde.
- **Moneda.** Desde agosto 2026 el export viene en **ARS** (cambio de cuenta);
  antes venía en EUR. Los importes de monedas distintas nunca se suman ni se
  convierten: el resumen anual acumula solo los meses de la moneda vigente y
  lo avisa en pantalla.
- **Campañas que arrancan a mitad de mes.** Agregar `startedOn: 'AAAA-MM-DD'`
  a la campaña en `paidSeed.js` (fecha de creación, del historial de cambios
  de Google Ads). La app calcula los días activos y muestra el chip «Parcial»,
  la nota en el detalle y un insight dedicado.
