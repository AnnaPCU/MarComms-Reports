# Tooling — Google Ads → seed de Paid Media

## Flujo mensual (el que usa Anna)

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

Se adjuntan en la conversación de Claude y se procesan con:

```bash
# 1) Totales por campaña → editar src/data/paidSeed.js (bloque mXX por cuenta)
#    (Claude lo genera desde el CSV 1 con el mismo formato de meses previos)

# 2) Detalle de grupos (CSVs 2 y 3):
python3 scripts/paid/build_detail.py m08 "Semanal_por_grupo.csv" "Terminos_y_keywords.csv"
```

## Validaciones que hace Claude al cargar

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
