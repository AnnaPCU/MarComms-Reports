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
- **Una cuenta de Webinars por audiencia.** Los webinars en español para LATAM
  (`cu`, «Control Union Latinoamérica») y los globales en inglés con base de
  Américas + Europa (`cug`, «Control Union Global») son series distintas: no
  se mezclan en un mismo selector de eventos ni se comparan entre sí. La
  campaña de email de cada webinar va en la cuenta de Email del mismo nombre.
- **Si el drop no trae LinkedIn, el reporte lo dice.** El webinar Plastic
  Packaging llegó primero sin métricas de posteos: la sección Social mostró
  «Sin exports de LinkedIn para este evento» y solo el dato real que sí
  existía (registrados fuera de la base de email). Nunca se estima.
- **Las capturas del panel «Rendimiento del anuncio» de LinkedIn valen como
  fuente** cuando no hay export (16/9/2026, Plastic Packaging): son cifras
  reales de la plataforma. El seed anota que la fuente es la captura y la
  fecha; la página se identifica por la captura misma (o por cruce con el
  export mensual de Social, como se hizo con el Post 2 de CU España).
- **Los webinars de Peterson Solutions van en su propia cuenta** (`psi`,
  «Peterson Solutions Iberoamérica», desde EmpCo 2026 · 10/9/2026): marca
  separada de Control Union, con su logo como cliente y su campaña de email en
  la cuenta de Email del mismo nombre. Nunca se listan junto a los de CU en
  un mismo selector de eventos.
- **Sin «Organization» en el Excel, el lead muestra el dominio del email
  corporativo** (EmpCo: 53 de 94 priorizados sin empresa ni país en el
  formulario de Teams). El dominio es un dato real del export, no una
  deducción; los proveedores genéricos (gmail, hotmail…) quedan en «—».
- **El costo de producción no se pide ni se muestra** (16/9/2026). El campo
  `commercial.productionCost` sigue en el seed (los tres eventos de CU lo
  tienen en 600 USD) pero la vista no lo imprime ni lo marca como pendiente.
- **La duración del evento sale del export de asistencia de Teams**: la
  «duración total» es la ventana del organizador (incluye los minutos previos
  al inicio, en los que el equipo ya está conectado) y el tiempo por asistente
  es su propia ventana, con tope en el target del modelo de scoring.
- **El botón «Link al pipeline» apunta siempre a la vista general de deals
  de HubSpot** (`HUBSPOT_PIPELINE_URL` en `webinarsSeed.js`, la vista
  «board»). Desde el 16/9/2026 no se arman links custom por evento; el de
  EUDR se reemplazó por el general.
- **El modelo de scoring es el del Excel del equipo, evento por evento.** Cada
  webinar puede traer su propia fórmula (EUDR: +3/+2/+1, HOT ≥ 8; Plastic:
  registro 10 + asistencia 20 + tiempo hasta 40 + pregunta 20 + interacción
  hasta 10, HOT ≥ 70). El reporte muestra la del evento y no las normaliza.
- **Un reenvío de Mailchimp («copy») es un envío más.** Se lista como tal
  («Email 3 (reenvío)») y suma a los enviados; no se fusiona con el original
  porque son dos oportunidades de apertura distintas.
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
  Argentina en Paid solo tiene el GEO de Meta; «Peterson Solutions
  Iberoamérica» (`ps-iberoam`) cruza la cuenta `psi` de Email y de Webinars.
  Son criterios revisables por
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

## 12. Vista Planes (informes de avance de planes regionales)

- **No es un pilar: es información de gestión.** Un plan regional de
  marketing (hoy: Control Union USA · mercado orgánico, 6 meses) se reporta
  al cliente con un informe mensual de objetivo, entregables, próximos pasos
  y tracker de acciones. Eso no sale de ninguna plataforma: se transcribe del
  informe del equipo al seed (`src/data/plansSeed.js`) tal cual, en ES y EN.
  No se generan insights ni se cruzan métricas.
- **Los próximos pasos se muestran siempre**, también en el descargable de
  uso externo: no son la sección generada «Próximos Pasos» de los pilares,
  son contenido del informe que el cliente tiene que ver.
- **El párrafo de apertura pone el foco en el objetivo del plan** (pedido del
  21/9/2026), no en la descripción del servicio de MarComms.
- **Un período por informe** (Mes 1, Mes 2…) y una cuenta por plan. Al llegar
  el informe del mes siguiente se agrega un período nuevo; los anteriores
  quedan navegables.
- El logo del cliente sale de la marca de la cuenta (`brandOf`), como en los
  pilares. Estética y estructura: los mismos componentes compartidos (ficha,
  KpiCard, tablas) para que se lea como un reporte más.
- **El informe nuevo reemplaza al anterior cuando el equipo lo pide así**
  (28/9/2026: el de septiembre reemplazó al «Mes 1»). El documento del equipo
  puede venir con otra estructura; la vista mantiene la de MarComms Reports y
  se busca un punto medio en el orden de los textos, no en la estética.
- **Un KPI sin dato se guarda como `null` y se muestra «—»** con la nota «Sin
  dato para este período»; nunca se rellena.
- **Descarga en PDF solo en Planes.** Sale de la impresión del navegador
  («Guardar como PDF»), sin backend ni librería: se fija el idioma elegido en
  la vista, se ocultan nav, filtros, botones y toggle (`print:hidden`) y se
  imprime con `@media print` (A4, fondo blanco, sin sombras, tablas que
  cortan por fila). Es una copia fija: sin cambio de idioma ni
  interacciones. Los pilares no ofrecen PDF porque sus reportes dependen de
  vistas, tooltips y botoneras.
- **`@page { margin: 0 }` para que el navegador no imprima fecha, título,
  URL ni número de página** (28/9/2026: el equipo los vio en el PDF). El
  navegador dibuja esos encabezados y pies dentro del margen de página; sin
  margen no hay dónde. Los márgenes se recuperan a mano: laterales en los
  contenedores (`print:px-[10mm]`) y arriba/abajo con una tabla envolvente
  cuyo `thead`/`tfoot` espaciadores se repiten en cada hoja
  (`.print-page-spacer`). El cierre de marca (barra azul, logo, tagline) lo
  dibuja la propia vista dentro del flujo, para que no caiga solo en una
  hoja aparte.
- **El link al pipeline no va como botón en Planes**: va a ir en una columna
  «Link» de la tabla de entregables, en la fila que el equipo indique
  (campo `url` de la fila; la columna solo aparece si alguna fila lo trae).
- **El nombre del archivo y el título del descargable van en el idioma
  elegido en el diálogo**, en todos los pilares (28/9/2026): `Report_…` con
  meses en inglés, `Comparison`, `Annual_Summary`, `Overview`, sufijo
  `_External`; las etiquetas de período del seed (en español) se traducen
  con `localizeLabel` o con `labelEn` cuando el período lo trae.
- **Logo de MarComms a 1920 px** en `public/` (antes 640): en el PDF se
  veía pixelado. El logo del cliente Control Union es SVG con dos rasters
  chicos embebidos (el isotipo), que a tamaño de impresión se ven bien.
- **El link al pipeline de un plan es propio del plan** (lo pasa el equipo),
  a diferencia de los webinars, donde es la vista general de deals. Va como
  link del entregable «Base de datos de la herramienta comercial».

- **Plan de Peterson Solutions Argentina** (6/10/2026): sale de la hoja
  «PS Argentina» del Excel de seguimiento de planes (solo esa hoja). Los
  contadores de la hoja («Tareas 8 · Completadas 5 · Abiertas 3») cuentan
  desde la fila 32 y dejan afuera las tareas de agosto y dos de septiembre;
  el informe cuenta todas las filas (13: 10 completadas, 2 en curso, 1
  pendiente). Las dos de septiembre sin fecha en la hoja van con la que dio
  el equipo: base de datos del webinar el 2/9 y comunicación el 4/9.
- **Un informe por mes, cada tarea en el mes de su fila** (6/10/2026): agosto
  (arranque, 3 tareas) y septiembre (7 tareas) son informes separados. Las
  tareas de octubre van **«En curso» en el informe de septiembre**, como en
  el de CU USA (también la que la hoja marca «Pendiente»), y pasan a
  completadas en el informe de octubre, con el mes cerrado. Los grupos
  vacíos («En curso», «Pendientes») no se dibujan.
- **Los KPIs de un plan son los mismos que los del informe de CU USA**:
  operativos (entregables completados, reuniones internas, contactos en la
  base comercial) y performance (pipeline, MQLs y ventas generadas, en USD).
  Lo que el equipo no informó queda en `null` y se muestra «—» con «Sin dato
  para este período». Las reuniones internas de PS Argentina salen de las
  filas de reunión de la hoja (agosto: 12/8 y 19/8) y, en septiembre, de
  las tres que confirmó el equipo (16/9, 17/9 y 30/9).
- **Datos actualizados por el equipo (8/10/2026)**: la base de difusión del
  webinar de EmpCo es de **agosto** (base total 5.403 contactos; hecha por
  MarComms 2.001). «Contactos en la base comercial» = la base hecha por
  MarComms en el mes: agosto 2.001, septiembre 76 (Ígaris; a confirmar).
  Los KPIs de performance de PS Argentina siguen pendientes de que el equipo
  los pase. Las metas y resultados de pipeline, MQL y revenue están vacíos
  en la hoja: no se cargan como KPI y la introducción aclara que todavía no
  están definidos.
- **Tagline por marca**: el pie (app, HTML descargado y PDF) usa el tagline
  de la marca del cliente del reporte (`TAGLINES` en `constants/brand.js`).
  Un reporte de Peterson Solutions nunca lleva «The Proof to Your Promise».

- **KPIs por plan (8/10/2026)**, reemplaza al criterio «mismos KPIs que CU
  USA»: «Pipeline generado» pasa a llamarse **«Deals generados»** en todos
  los planes.
  - **CU USA**: deals, MQLs y ventas en USD; **los KPIs de performance los
    pasa el equipo a mano**. «Contactos en la base comercial» pasa a
    **«Contactos generados por BBDD»**, igual que en Argentina; sale del
    Excel de seguimiento (hoja «CU USA Organic», «Creación de BBDD Commercial
    Tool», 31/8): 800, los top 5 estados USDA (9/10/2026). El informe de CU
    USA se sigue armando como hasta ahora (no se reparte por mes); el de
    octubre sale del Excel que pase el equipo.
  - **PS Argentina y CU Argentina**: «Contactos generados por BBDD» (del
    Excel de seguimiento); deals y MQLs **en cantidad**, sin importes; **no
    se muestran ventas (WON)**. Septiembre: PS Argentina 70 deals y 1 MQL;
    CU Argentina 340 deals y 2 MQLs (datos del equipo).
- **Lo que manda es el Excel, mes por mes**: cada tarea va en el informe del
  mes de su fila. Las tareas del mes siguiente aparecen en el informe en un
  **grupo propio** («Tareas de octubre», campo `nextMonth` en el seed) con el
  **estado del Excel**, incluso «Completado» (9/10/2026): no suman a los
  entregables ni a los KPIs del mes del informe, y entran como tareas del
  mes en el informe de ese mes cuando cierre.
- **Plan de Control Union Argentina** (8/10/2026): hoja «CU Argentina». No
  tiene tareas en agosto (aunque el plan arranca en agosto), así que el
  primer informe es el de septiembre. La hoja no trae objetivos ni
  decisiones del mes: no se completan. Los
  contactos por BBDD de septiembre (786, base de la campaña GHG) los pasó el
  equipo el 9/10.
- **Los planes de Argentina (PS y CU) no muestran objetivo del plan**
  (9/10/2026): la introducción solo cuenta lo hecho en el mes. CU USA
  conserva su párrafo de objetivo.
- **Comunicación del webinar EmpCo de PS Argentina el 20/8** (9/10/2026):
  el equipo pidió que la comunicación (emails, posteos y artículo) y todo lo
  relacionado vaya en agosto, el 20/8, aunque el Excel la ponga en
  septiembre. Agosto queda con 5 entregables y septiembre con 5.

## 13. Nombres de cuenta

- **Un mismo cliente se llama igual en todos los filtros** (6/10/2026): marca
  completa y país en español. «Control Union Estados Unidos», nunca «CU
  Estados Unidos», «Control Union USA» ni «Control Union United States»;
  «Peterson Solutions Argentina», nunca «PS Argentina». Lo controla
  `src/utils/__tests__/accountNames.test.js`.
- Excepciones: los nombres que son el de la página o cuenta en la plataforma
  (p. ej. «Peterson Solutions (Iberia & Americas)» en LinkedIn, «Control
  Union North America») se dejan como están. Los textos de posteos y del
  contenido de los informes no se tocan.
- **El logo del cliente se decide por id de cuenta** (`BRAND_BY_ID` en
  `constants/brand.js`), no por el nombre: la cuenta conjunta «Control Union +
  Peterson Solutions Latinoamérica» lleva logo de CU.

## 14. Datos de CRM (HubSpot)

Pedido del 6/10/2026 (historial #103–#105). Deals originados por MarComms en
HubSpot, en la vista por cliente y como card en «Indicadores clave» de cada
pilar. Los KPIs de **Planes** no se tocan: siguen tal cual los informa el
equipo.

- **Qué es un deal de MarComms**: la propiedad «Deal Source»
  (`contact_origin_real`) del deal. **Número principal = los 5 pilares**
  (Social Media, Paid Media, Email Marketing, Webinar, Website). STEAL,
  Database, Commercial Tool, InPerson Event y **BDR MarComms** también son
  de MarComms pero **no son canales tradicionales**: van en un bloque aparte
  («Otros orígenes MarComms») y no suman al número principal. El origen
  «BDR MarComms» existe en HubSpot pero al 6/10/2026 no tiene ningún deal
  (la vista lo aclara). Ojo: «InPerson Event» se guarda internamente como
  `Event`; las consultas tienen que usar el valor interno, no la etiqueta.
- **Deals generados**: todos los stages (New & Renewals también es «new»
  según el servicio), contados por **fecha de creación**.
- **MQL**: stage actual **Qualified o uno más avanzado que no sea LOST**
  (Proposal Sent, WON), contado en el **mes en que llegó por primera vez** a
  ese nivel (la fecha de entrada más temprana a Qualified, Proposal o WON).
  Motivo: el 96 % de los WON de 2026 del pipeline de Certifications saltean
  el stage Qualified; contar solo «entró a Qualified» los dejaba afuera. Se
  leen los deals creados desde el 1/1/2025.
- **WON**: por **fecha de cierre**. Dos WON de Database (Perú) no tienen
  fecha de cierre en HubSpot: no se ubican en ningún mes y se avisan en el
  acumulado.
- **Monedas**: cada importe va en la moneda del deal (EUR, USD, CAD, BRL…),
  **nunca se convierte ni se suman monedas distintas**. Los deals sin monto
  cargado se cuentan y se informa cuántos son.
- **País / unidad de negocio**: la propiedad «PCU Entity» (`pcu_office`).
  Mapeo explícito: por cliente en `constants/clients.js` (`crmEntities`),
  por cuenta de pilar en `constants/crm.js`. Regionales: CU Latinoamérica =
  Argentina + Brasil + Chile + México + Perú; CU North America = Estados
  Unidos + Canadá; PS Americas = Argentina + Brasil + Estados Unidos + Chile;
  PS Iberoamérica = España (Peterson Ibero America) + Argentina + Brasil +
  Chile + México. Control Union Estados Unidos suma Certifications (537) e
  **Inspections** (entidad propia en HubSpot). Peterson Solutions México
  (880) entra en PS Americas y PS Iberoamérica.
- **Las marcas no se mezclan** también acá: «Control Union Canadá
  (Solutions)» registra servicios de Peterson Solutions con la entidad de CU
  Canadá; no se suma a Control Union Canadá (pendiente de validar con el
  equipo). Colombia, Ecuador, Uruguay, Paraguay y PS Technologies no se leen
  (ningún cliente los usa).
- **Sin entidad no se infiere**: CU Global (Email y Webinars) no tiene
  entidad, porque los deals de los webinars globales quedan en la entidad del
  dueño del webinar (Control Union Alemania). Tampoco las cuentas de LinkedIn
  `cun`, `ps`, `tlr` y `bel`. Ahí no hay card ni bloque con números.
- **Webinars en los pilares**: el reporte por evento ya tiene su propio
  bloque de HubSpot; la card por pilar no se agrega ahí (los deals del pilar
  no se pueden atribuir a un evento sin el detalle de origen). En la vista por
  cliente sí aparece la fila Webinars. Según la metodología de scoring
  (Excel v2026-10-05), solo los leads Hot y Warm se convierten en deal.
- **Período**: en la vista por cliente, acumulado 2026 o un mes con
  actividad. En la card del pilar, los meses del período del reporte (mes,
  trimestre o año); los GEO de Meta y las comparativas no tienen card.
- **Cómo se actualiza**: consultas de solo lectura a HubSpot → 
  `scripts/crm/build_crm_seed.py` → `src/data/crmSeed.js` (solo agregados,
  sin nombres de empresas) → commit → deploy. Ver `scripts/crm/README.md`.
- **Dónde y cuándo se muestran** (8/10/2026): los indicadores de HubSpot van
  **en la misma tira horizontal que los indicadores clave**, a la derecha y
  destacados (card azul marino), nunca en un bloque debajo. En la vista por
  cliente, la tira suma «Deals generados», «MQLs» y «Ventas (WON)» del
  acumulado 2026 a las cards de cada pilar; el desglose por pilar y por
  otros orígenes (con su selector de período) queda más abajo, antes de la
  lectura de performance. En cada pilar, «Deals generados» entra como una
  card más de la fila de KPIs. **Un indicador que da cero no se muestra**
  (card, o parte de la pill «MQLs · WON»). La tira es siempre una sola fila:
  mejor 6 cards en una fila que 5 + 1 abajo (`utils/gridCols.js`).

## 15. Email: campañas one shot y varias campañas en un mes

- **One shot por defecto** (9/10/2026): salvo aclaración del equipo, cada
  campaña de email que llega se toma como one shot. Se procesa y publica en el
  momento con el export recibido (aunque sea del mismo día del envío), como
  campaña propia: no se espera a otros envíos ni a que cierre el mes, y no se
  suma a otra campaña. Si después llega un export más nuevo de la misma
  campaña, reemplaza los números.
- **Varias campañas en el mismo mes = botonera, no suma.** Cuando una cuenta
  tiene más de una campaña en un mes, el período guarda la lista
  (`campaigns: [...]`, en orden de envío) y la vista muestra una botonera de
  campaña, igual que los países en Social Media. No hay opción «todas»: las
  campañas tienen audiencias y objetivos distintos y sumar sus tasas
  mezclaría resultados que no se comparan.
- **Arranca en la más reciente.** La botonera abre en la última campaña
  enviada; la vista General del cliente muestra esa misma campaña y la nombra
  en el subtítulo de la card.
- **La descarga queda fija en la campaña elegida** (sin botonera adentro), y
  su nombre va en el título y en el nombre del archivo, como el país en
  Social.

- **UI de HubSpot oculta (9/10/2026)**: por pedido del equipo, las cards
  «Deals generados» de los pilares, las de la tira de Clientes y el detalle
  «Resultados comerciales» quedan **ocultos** con el interruptor
  `CRM_UI_ENABLED = false` (`constants/crm.js`). No se borra nada: seed,
  service, tooling y tests siguen. Cuando se reactive, la card de un período
  cerrado nombra el período («jul–sep 2026») en vez de «al 06/10/2026»; un
  período abierto aclara «datos al …». Los deals del propio webinar (reporte
  de Webinars) no son esta card y siguen visibles.
- **Conversiones, indicador destacado**: en Website y en Paid Media la card
  de conversiones es la destacada (azul marino, a la derecha de la fila), en
  lugar de los deals de HubSpot. Sin desglose email / formulario.

## 15. Website trimestral desde los reportes .md (Q3 2026)

- **Fuente**: dos reportes por trimestre (`reporte_cu_AAAA-QN.md`,
  `reporte_ps_AAAA-QN.md`) con GA4 (hoja Website) y Search Console (hoja SEO)
  por cuenta. Se archivan en `metricas/website/_procesados/AAAA-QN/` y se
  convierten con `scripts/website/md_to_seed.py`, que **corta si no
  coinciden** el CTR, los % del embudo o la suma de conversiones
  (click_email + form_submit) con lo que dice el archivo.
- **Mapeo de cuentas**: el nombre de la sección es el de la cuenta, salvo
  «Peterson Solutions South America», que es el sitio
  americas.peterson-solutions.com = cuenta **Peterson Solutions Americas**
  (`psam`); confirmado por el equipo el 9/10/2026.
- **CU Estados Unidos y CU Canadá**: salen de un reporte aparte, el sitio
  northamerica.controlunion.com **segmentado por país**
  (`reporte_cu_AAAA-QN_northamerica_por_pais.md`), y cada uno tiene su vista.
  CU North America sigue mostrando el total del sitio. Estados Unidos +
  Canadá no suman el total (el resto es tráfico de otros países) y nunca se
  calcula un país restando del total.
- **Keywords sin clics** no entran al top (ej. en Canadá, un número de
  teléfono con 0 clics): el top queda con las que tienen clics.
- Lo que el reporte no trae (insights, diagnóstico, próximos pasos,
  glosario) lo generan las reglas de siempre; la card «Deals generados —
  HubSpot» sale del CRM para los meses del trimestre.
- **Conversiones (desde los reportes del 9/10/2026)** = formularios por
  página de gracias (Gravity Forms y HubSpot redirigen a una thank-you page;
  se cuentan las vistas que llegan desde otra página del mismo sitio) +
  emails (click_email, sin empleo, academy ni reclamos). Ya no se usa
  form_submit (inflaba la cifra). La cifra viene calculada en el reporte; no
  se aclara en la vista. Se muestran sin desglose; el desglose formularios /
  emails queda en el seed (`conversionsBreakdown`). En Peterson,
  click_email no registró eventos en Q3: la conversión es el form_submit.
- **Nombres de métricas en el idioma del reporte**: en ES, Visitantes únicos,
  Sesiones, Vistas de página, Conversiones, Posición promedio, Impresiones y
  Clics totales (también en el glosario); en EN, los nombres del reporte
  (Single Traffic, Total Traffic, Impressions, Conversions, Average
  Position, Total Clicks).
- **SEM (Google Ads)** no viene en estos reportes: va en Paid Media, que se
  reporta **por mes** (no por trimestre). Septiembre de Paid está pendiente
  de que el equipo pase los exports.

