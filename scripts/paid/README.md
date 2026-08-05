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
(cuc) · `PS Argentina` (psar). Nombres de campaña normalizados igual que en
paidSeed (Plásticos, Bioenergía, etc.).
