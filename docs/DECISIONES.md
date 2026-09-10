# Decisiones y criterios — MarComms Reports

> **Qué es esto.** El *porqué* detrás de cómo están hechos los reportes. Son
> criterios que salieron de conversaciones con el equipo y que **no se deducen
> leyendo el código**: si alguien los desconoce, es probable que "arregle" algo
> que en realidad está así a propósito.
>
> - **Qué hay hoy** → `PROJECT_CONTEXT.md`
> - **Cómo se pidió cada cosa** → `docs/historial-pedidos.md`
>
> Al tomar una decisión nueva que valga para el futuro, agregarla acá.

---

## 1. Honestidad de los datos (la regla que manda sobre todas)

- **Nunca inventar, estimar ni rellenar un número.** Si no hay datos reales para
  (cuenta, período) → "Sin información suficiente" (`hasData.js`).
- Si una métrica no existe en el export, **no se deduce**: se dice que no está.
  Ejemplos vigentes: LinkedIn no segmenta seguidores nuevos ni visitantes únicos
  por país; el registro del webinar EUDR corrió por Teams y por eso no hay
  atribución de canal por registro; Google oculta los términos de búsqueda de
  bajo volumen, así que el coste de términos no suma el total del mes.
- Cuando un dato es una **proyección** y no un resultado, tiene que decirlo en la
  propia tarjeta (así está el "pipeline potencial" de webinars).
- **Nunca convertir monedas.** Ver §5.

## 2. Qué mostrar y qué no

- **Menos es más en la vista General.** El pedido explícito fue que el resumen
  sea conciso: tarjetas de canal con "Ver vista completa →" en vez de volcar
  todo junto. El detalle vive en las vistas específicas.
- **Cada vista tiene su glosario.** En el reporte de webinars, la botonera
  General / Webinar / Email / Social cambia también el glosario del pie, porque
  el lector de cada vista es distinto.
- **Los próximos pasos son internos.** La sección "Conclusión — Próximos Pasos"
  y el plan de acción no se muestran en los reportes de uso externo.
- **Lo que no está listo se oculta, no se borra.** El webinar de ISO 14064 se
  sacó de la botonera a pedido del equipo, pero sus datos siguen intactos en el
  seed (`webinarsSeed.js`) para poder volver a mostrarlo.

## 3. Webinars — criterios del reporte mixto

- **Los deals priorizados son hot + warm, no todos los asistentes.** Se probó
  contar los 117 asistentes externos y se descartó: el número que importa
  comercialmente son los 27 que el scoring priorizó (1 hot + 26 warm). Los cold
  quedan afuera de la sumatoria.
- **La atribución de email es la real, no la cómoda.** Presentar los 229
  registrados que estaban en la base como "registrados vía email" era engañoso:
  estar en la base no significa haber venido por ahí. La tarjeta muestra los
  **56 que hicieron clic** en la campaña (19%), con las capas de contexto
  (93 abrieron, 229 estaban en la base) debajo.
- **El scoring de leads es una metodología fija**, no un número por evento:
  necesidad declarada (0-50) + engagement en vivo (0-30) + interacción proactiva
  (0-20); hot ≥70, warm 40-69, cold <40. Vigente desde julio 2026.
- **Las métricas clave van destacadas** (hero cards navy): asistentes, deals,
  registrados vía email y registros fuera de la base de email.
- **La proyección de «pipeline potencial» se descartó** (septiembre 2026). Se
  había armado sobre benchmarks (ticket promedio × tasa de cierre B2B) y el
  equipo decidió no mostrar una vista basada en eso. El código sigue
  soportando `commercial.pipelinePotential`, pero se deja en `null` y no hace
  falta pedir el ticket promedio del servicio.

## 4. Campañas parciales (Paid)

- Una campaña que arrancó a mitad de mes **no se compara de igual a igual** con
  las de mes completo. Lleva `startedOn` en el seed y la UI lo avisa por todos
  lados (chip, banner, insight propio).
- La fecha sale del **historial de cambios de Google Ads**, no de la primera
  impresión: el informe semanal solo permite acotar la semana, no el día.

## 5. Monedas (Paid)

- **Nunca se convierte de una moneda a otra**, en ninguna vista. No hay tipo de
  cambio en el proyecto y no debe agregarse sin pedido explícito.
- Cada mes se muestra **con la moneda con la que se reportó**.
- En el Resumen del Año y en la Comparativa: los **volúmenes** (impresiones,
  clics, conversiones) se suman del año completo, y los **importes** se muestran
  como **sumatoria por moneda** (`977,84 EUR + 374.884,93 ARS`).
  Se probó recortar los importes a los meses de la moneda vigente y se descartó:
  el resumen del año perdía sentido.
- Los gráficos de coste usan **un eje por moneda** (resumen anual) o solo la
  moneda vigente (comparativa entre cuentas), porque dos monedas no comparten
  escala.
- Contexto: la cuenta de Google Ads cambió en agosto 2026 y desde entonces el
  export viene en ARS. Es el comportamiento esperado, no un error del export.

## 6. Identidad de las campañas

- Si una campaña **se renombra**, se renombra también hacia atrás en el seed y en
  el detalle, para que el acumulado anual no la parta en dos. Caso resuelto:
  `Car` → `CAEs` en CU España (agosto 2026), confirmado porque conserva los
  mismos grupos de anuncios.

## 7. Idioma

- **Español por defecto en todo**, con botonera ES/EN en los 5 pilares.
- Al descargar, se elige el idioma principal del archivo, **aclarando que
  adentro se puede cambiar igual**. El idioma viaja en `__REPORT_EMBED__.lang`.
- Todo texto visible nuevo se agrega en los dos idiomas. Un pilar a medio
  traducir es peor que uno sin traducir.

## 8. Marca

- **MarComms es la marca principal de los reportes**, porque es el equipo que los
  produce: logo en el header arriba a la izquierda, logo al pie enfrentado al
  tagline, e isotipo como favicon (app y descargables).
- El logo del **cliente** (Control Union / Peterson) va en segundo plano: chico,
  sin etiqueta y con tope de ancho para que los wordmarks anchos no compitan.
- Se mantienen los tokens de color, la tipografía Ubuntu y el tagline
  "The Proof to Your Promise" al pie, nunca junto al logo.

## 9. Arquitectura

- **Sin base de datos y sin import por la web.** Supabase se descartó: el
  requisito era que cualquiera que abra la URL vea los mismos datos, y el seed en
  el bundle ya lo cumple. No reintroducir ninguna de las dos cosas sin pedido
  explícito.
- Los datos entran **por código**: export → tooling → seed → commit → deploy.
- La carpeta `supabase/` se eliminó del repo; si alguna vez hace falta el modelo
  de datos, está en el historial de git.
- **El tooling de ingesta fusiona, no regenera.** Los exports crudos de los
  meses anteriores no viven en el repo (solo el mes archivado en
  `_procesados/`), así que un script que regenere el seed completo a partir
  de los argumentos borra los meses que no se le pasan. Vale para Paid
  (`build_detail.py`, arreglado en agosto) y para Social (`build_monthly.py`
  y `build_country_seg.py`, arreglados en septiembre): cada corrida lee el
  seed existente y solo pisa los meses que se le pasan.
- **Los drops de `metricas/` se aceptan aunque el nombre de la carpeta no siga
  la convención** (`AAAA-MM`). Lo que importa es que el mes esté completo y
  los archivos sean los crudos de la plataforma; al archivar se renombra a
  `_procesados/AAAA-MM`.

## 10. Verificación antes de deployar

Quedó como práctica fija, y conviene sostenerla:

1. `npm run lint` y `npx vitest run`.
2. `npm run build`.
3. Una pasada por el navegador (Playwright headless) del pilar tocado, **en ES y
   en EN**, revisando que no haya errores de consola.
4. Cuando se carga un mes nuevo de Paid: **validar el seed contra el informe
   semanal**, campaña por campaña, antes de commitear.
5. Recién ahí: commit → merge fast-forward a `main` → push **solo de `main`**.
   Las ramas de trabajo no se pushean: en GitHub existe únicamente `main`
   (pedido del equipo, 10/9/2026). Una rama `claude/...` en el remoto es
   ruido que después hay que borrar a mano.

> Historia útil: los tres bugs del tooling de Paid (miles mal parseados,
> `build_detail.py` pisando meses anteriores, símbolo `€` fijo en los textos)
> aparecieron por hacer estas validaciones, no por casualidad.

## 11. Vista por cliente (unidad de negocio + país/región)

- **Un cliente solo tiene vista propia si se le trabaja más de un pilar.** Si
  a un cliente se le hace un solo pilar, su reporte es el del pilar; una vista
  aparte no aporta nada. La regla se aplica por datos reales
  (`clientService.listClients()` exige ≥2 pilares con datos), así que un
  cliente aparece solo cuando su segundo pilar tiene algo cargado.
- **El mapeo cliente → cuenta por pilar es explícito** (`constants/clients.js`),
  no se infiere por nombre: las cuentas nacieron por pilar con ids distintos y
  adivinarlas es la forma de mezclar dos clientes.
- **La vista General muestra el último período con datos de cada pilar**, aunque
  no coincidan entre sí (Social cierra en julio, Paid en agosto, Website por
  trimestre). Cada tarjeta dice a qué período corresponde. No se fuerza un
  período común ni se rellena el pilar que va atrasado.
- **No se suman métricas entre pilares.** Impresiones de LinkedIn, de Google Ads
  y de Search Console no son la misma unidad: la General las muestra una al
  lado de la otra, no las consolida en un total.
- **Cuando la cuenta mapeada no coincide exactamente con el cliente, se
  aclara** («Alcance: …» en la tarjeta y en la ficha). Casos vigentes: la
  cuenta LinkedIn «PS Iberia & Americas» alimenta a PS Iberia y a PS
  Americas; la campaña de Email «CU + PS Latinoamérica» y los webinars
  (cuenta global `cu`, audiencia LATAM) cuelgan de CU Latinoamérica; CU
  Argentina en Paid solo tiene el GEO de Meta. Son criterios revisables por
  el equipo, no datos.
- **Social por país reutiliza la segmentación por hashtag** de la cuenta
  regional (CU Latinoamérica, CU North America), con sus limitaciones ya
  documentadas (§1): lo que LinkedIn no segmenta por país no se muestra.
- **Entrar a un pilar desde el cliente es entrar al pilar.** La botonera
  renderiza el mismo componente del pilar con la cuenta mapeada; no hay una
  versión «resumida» del pilar que pueda quedar desactualizada respecto de la
  vista principal.
- **La descarga del cliente baja solo la vista General.** Los reportes
  completos de cada pilar ya se descargan desde su pilar; duplicarlos dentro
  del archivo del cliente multiplicaba el tamaño y las formas de que un dato
  quedara distinto entre dos descargas.
- **«Clientes» no es un sexto pilar.** Va en la nav separado por una línea y no
  entra en `PILARES`: los pilares son las fuentes; los clientes las cruzan.
