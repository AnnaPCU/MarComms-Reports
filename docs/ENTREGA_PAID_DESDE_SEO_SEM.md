# Entrega mensual de Paid Media desde el proyecto SEO-SEM

Instrucciones para **la sesión de Claude Code del proyecto SEO-SEM** (la que
tiene Google Ads y Meta Ads por API, en `Optimizaciónes SEO-SEM/proyecto`),
para pasarle a **MarComms-Reports** las métricas del mes cerrado y que acá se
armen los reportes de Paid Media.

El canal es este repositorio: la sesión de SEO-SEM deja los archivos en
`metricas/paid-media/` y pushea a `main`. Acá, con «Procesá las métricas
nuevas de Paid Media», se corre el tooling de siempre, se valida, se publica
y la carpeta pasa a `_procesados/`. No hay base de datos ni API de por medio
(MarComms-Reports no lee Supabase: `CLAUDE.md`).

## Reglas (no negociables)

1. **Moneda original de la cuenta, sin convertir.** Nada de pasar euros a
   pesos ni al revés (en SEO-SEM sí se hace para su tablero; acá no). Cada
   fila lleva su moneda en `Currency code` (Google) o en el nombre de la
   columna `Amount spent (ARS)` (Meta). Los tipos de cambio los busca
   MarComms-Reports.
2. **Datos reales del período, completos.** Google Ads: del día 1 al último
   día del mes, ya cerrado. Meta Ads: del primer al último día de la
   campaña. Si una métrica no se pudo extraer, la columna va vacía; nunca se
   estima ni se completa.
3. **Nombres de campaña tal cual están en la plataforma.** La cuenta del
   reporte se reconoce por el prefijo (`CU España`, `CU Portugal`, `CU Canada`,
   `CU United States`, `CU Argentina`, `PS Argentina`, `PCU - España`,
   `PCU - Argentina`). Si hay campañas con la nomenclatura nueva
   (`CU_US_SEARCH_…`), avisarlo en el `LEEME.md` de la entrega: hay que
   mapearla una vez acá.
4. **Solo se toca `metricas/paid-media/`.** Un commit por entrega, directo a
   `main` (en el remoto existe solo `main`; no crear ramas).

## Formato de archivo

CSV en UTF-8, separado por comas, con encabezado en la primera fila, una fila
por registro y **sin fila de totales**. Números sin separador de miles y con
punto decimal (`264635.17`). Fechas en `AAAA-MM-DD`. Los nombres de archivo
no importan: el tooling reconoce cada informe por sus columnas.

## Google Ads — un mes completo

Carpeta: `metricas/paid-media/google-ads/AAAA-MM/` (el mes reportado, ej.
`2026-10`). Todas las campañas con actividad de todas las cuentas. Tres
archivos:

**1. `campanas.csv`** — una fila por campaña:

| Columna | Qué es (GAQL) |
|---|---|
| `Campaign` | `campaign.name` |
| `Currency code` | `customer.currency_code` |
| `Impr.` | `metrics.impressions` |
| `Clicks` | `metrics.clicks` |
| `Cost` | `metrics.cost_micros / 1e6` |
| `Conversions` | `metrics.conversions` |

**2. `semanal_por_grupo.csv`** — una fila por campaña × grupo × semana
(`segments.week`, el lunes de la semana):

`Campaign`, `Ad group`, `Week`, `Impr.`, `Clicks`, `Cost`, `Conversions`,
`Search impr. share` (`metrics.search_impression_share`, en %),
`Search lost IS (rank)` (`metrics.search_rank_lost_impression_share`, en %).

Las semanas que cruzan de mes van recortadas al mes (el filtro de fechas del
mes manda). **La suma de este archivo tiene que dar exactamente la del
`campanas.csv`**, por campaña: el tooling lo valida y corta si no cuadra.

**3. `terminos_y_keywords.csv`** — una fila por término de búsqueda
(`search_term_view` con la palabra clave que lo disparó):

`Campaign`, `Ad group`, `Search keyword`, `Search term`,
`Search terms match type` (`Exact match` / `Phrase match` / `Broad match`,
con ` (close variant)` si corresponde), `Impr.`, `Clicks`, `Cost`,
`Conversions`.

Si una campaña **arrancó a mitad de mes**, anotarlo en `LEEME.md` con la
fecha de creación (historial de cambios): el reporte la marca como
«Parcial».

## Meta Ads — una campaña puntual

Carpeta: `metricas/paid-media/meta-ads/AAAA-MM-<campaña>/` (mes de inicio y
un nombre corto, ej. `2026-11-expoagro`). Una carpeta por campaña o vuelo,
cuando termina. Rango: del primer al último día de la campaña.

Columnas comunes a todos los archivos: `Campaign name`,
`Amount spent (ARS)` (con la moneda de la cuenta entre paréntesis),
`Impressions`, `Reach`, `Frequency`, `Link clicks`, `Unique link clicks`,
`Outbound clicks`, `Results`, `Result indicator`. Si la campaña es de
WhatsApp, `Messaging conversations started`; si usa formulario instantáneo,
`Leads`.

| Archivo | Desglose | ¿Obligatorio? |
|---|---|---|
| `diario.csv` | por día: columna `Day` (`AAAA-MM-DD`) | Sí |
| `total.csv` | sin desglose (alcance único del período) | Sí |
| `plataforma.csv` | `Platform` (`publisher_platform`) | Recomendado |
| `edad.csv` | `Age` | Recomendado |
| `sexo.csv` | `Gender` | Recomendado |
| `hora.csv` | `Time of day (viewer's time zone)` | Opcional |
| `anuncios.csv` | nivel anuncio: `Ad name` + `Campaign name` | Recomendado |
| `destinos-anuncios.csv` | `Campaign name`, `Ad name`, `Destino` (`typeform` / `web` / `hsform` / `phone` / `whatsapp`, según la URL final o el CTA de cada anuncio) | Recomendado (define qué se mide) |

El alcance (`Reach`) y los clics únicos **no se suman entre filas**: cada
archivo los trae calculados para su propio corte, como los devuelve la API.
El diario tiene que cuadrar con el total (gasto, impresiones, clics): el
tooling lo valida.

**Campaña en paralelo** (el mismo evento en Google Ads y Meta Ads a la vez,
ej. IFPA): una sola carpeta `metricas/paid-media/<CAMPAÑA>-AAAA-MM/` con
`Google Ads/` (los 3 archivos de Google, con el rango del vuelo) y
`Meta Ads/` (los de Meta), como describe `docs/DECISIONES.md` §22.

Opcional, `campaña.json` con lo que el export no trae (evento, cuenta si el
prefijo no alcanza, campaña en paralelo con Google Ads): formato en
`metricas/paid-media/README.md`.

## Antes de pushear: validar

Desde un clon de MarComms-Reports, correr el tooling en modo prueba (no
escribe nada):

```bash
python3 -B scripts/paid/build_month.py "metricas/paid-media/google-ads/AAAA-MM" --dry-run
python3 -B scripts/paid/build_meta.py "metricas/paid-media/meta-ads/AAAA-MM-<campaña>" --dry-run
```

Si corta, corregir la extracción (no los números a mano) y volver a probar.
Después, solo los archivos de la entrega:

```bash
git add metricas/paid-media/
git commit -m "Paid AAAA-MM: entrega desde SEO-SEM (Google Ads + Meta Ads)"
git push origin main
```

## LEEME.md de la entrega

Un `LEEME.md` corto en cada carpeta, con: cuenta(s) de Ads y su moneda, rango
exacto de fechas, fecha y hora de la extracción, campañas que arrancaron a
mitad de mes (con fecha) y cualquier cosa que no se pudo extraer.

## Qué pasa después (en MarComms-Reports)

**Automático:** una tarea programada («Paid Media: procesar entrega mensual
de SEO-SEM») corre **todos los días a las 8:37 y a las 14:37 (hora de
Argentina)**. Si encuentra una entrega sin procesar, la procesa y la
publica; si no hay nada, termina sin avisar. Una entrega pusheada a `main`
queda publicada, como mucho, en la siguiente de esas dos corridas. Si algo
no cuadra (tooling que corta, nomenclatura nueva, dólar BNA sin 2 fuentes),
no publica y deja un resumen con lo que falta. Si lo único que falta es el
euro/dólar oficial del BCE, publica el mes igual con la descarga en EUR
deshabilitada (`eurPending` en `src/data/fxRates.js`) y lo completa en una
corrida posterior, cuando lo pueda verificar.

También se puede disparar a mano en cualquier sesión del repo:
«Procesá las métricas nuevas de Paid Media» → tooling + validación, tipo de
cambio del cierre del mes (BNA y BCE, validado en 2+ fuentes), análisis
redactado sobre los números, revisión en el navegador en ES y EN, publicación
en Vercel y archivo de la carpeta en `_procesados/`.
