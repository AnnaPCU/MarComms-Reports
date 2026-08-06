// ════════════════════════════════════════════════════════════════
//  GLOSARIOS — imprescindibles en todos los reportes (van al final).
//  Referencia de estructura/tono: glosario de Website de las capturas
//  (Control Union Argentina). En español para coherencia con la app.
// ════════════════════════════════════════════════════════════════

export const GLOSSARIES = {
  social: {
    title: 'Glosario — Social Media',
    entries: [
      { term: 'Impresiones', def: 'Cantidad de veces que las publicaciones se mostraron en el feed de LinkedIn, incluyendo visualizaciones repetidas.' },
      { term: 'Engagement Rate', def: 'Porcentaje de interacciones (reacciones, comentarios, clics) sobre las impresiones. Mide qué tan relevante resulta el contenido para la audiencia.' },
      { term: 'Clics', def: 'Cantidad total de clics sobre las publicaciones: enlaces, “ver más”, perfil o multimedia.' },
      { term: 'Visitas únicas al perfil', def: 'Visitantes únicos que entraron al perfil de la cuenta. Se usa como proxy de interés, ya que LinkedIn no exporta “conversiones”.' },
      { term: 'Seguidores nuevos', def: 'Seguidores netos ganados por la cuenta durante el período.' },
      { term: 'Publicaciones', def: 'Cantidad de posteos publicados por la cuenta durante el período.' },
      { term: 'Pilar ESG', def: 'Clasificación de cada publicación según su eje: Ambiental (E), Social (S) o Gobernanza (G).' },
    ],
  },

  // Versión en inglés del glosario Social — para el Resumen del Año en EN
  // (definiciones de Impressions/Reactions/Clicks tomadas del glosario oficial
  // de los reportes en inglés del cliente).
  socialEn: {
    title: 'Glossary — Social Media',
    entries: [
      { term: 'Impressions', def: 'The total number of times posts were displayed on users’ feeds, including repeated views. It reflects content visibility and audience reach.' },
      { term: 'Engagement Rate', def: 'Percentage of interactions (reactions, comments, clicks) over impressions. It measures how relevant the content is to the audience.' },
      { term: 'Clicks', def: 'The total number of times users interacted with posts by clicking on content elements such as links, images, or “see more”.' },
      { term: 'Unique page visitors', def: 'Unique visitors who accessed the page profile. Used as an interest proxy, since LinkedIn does not export “conversions”.' },
      { term: 'New followers', def: 'Net followers gained by the page during the period.' },
      { term: 'Posts', def: 'Number of posts published by the page during the period.' },
      { term: 'ESG Pillar', def: 'Classification of each post by axis: Environmental (E), Social (S) or Governance (G).' },
    ],
  },

  paid: {
    title: 'Glosario — Paid Media',
    note: '<strong>El presupuesto solo se consume cuando alguien hace clic en el anuncio.</strong> Que el anuncio se muestre (una "impresión") no cuesta nada: si un anuncio aparece 100 veces y una sola persona le hace clic, se paga únicamente ese clic. Por eso puede haber miles de impresiones con muy poco gasto.<br /><strong>¿Y cuánto cuesta cada clic?</strong> No es un precio fijo: funciona como una subasta. El precio depende de cuántos anunciantes están pagando por la misma palabra clave. Si nadie más la paga, el clic sale barato; cuantos más competidores compran esa misma palabra, más caro se vuelve el clic. Por eso el CPC varía entre campañas y entre meses.',
    entries: [
      { term: 'Impresiones', def: 'Cantidad de veces que los anuncios se mostraron en los resultados de búsqueda.' },
      { term: 'Clics', def: 'Cantidad de veces que los usuarios hicieron clic en un anuncio.' },
      { term: 'CTR', def: 'Click-Through Rate: porcentaje de clics sobre impresiones. Mide qué tan atractivo es el anuncio frente a la búsqueda.' },
      { term: 'CPC medio', def: 'Costo promedio por clic pagado durante el período. El precio de cada clic se define por subasta: depende de cuántos anunciantes compiten por la misma palabra clave (a más competencia, más caro el clic).' },
      { term: 'Coste', def: 'Inversión total ejecutada en la campaña durante el período.' },
      { term: 'Conversiones', def: 'Acciones de valor completadas tras el clic (por ej. envío de formulario o solicitud de contacto) según el objetivo de la campaña.' },
      { term: 'Tasa de conversión', def: 'Porcentaje de clics que terminaron en una conversión.' },
      { term: 'Coste por conversión', def: 'Inversión promedio necesaria para generar una conversión (coste por lead).' },
      { term: 'Nivel de optimización', def: 'Indicador de salud de la campaña en Google Ads según buenas prácticas de configuración aplicadas.' },
      { term: 'Palabra clave', def: 'Las palabras o frases que nosotros elegimos para decirle a Google "mostrá nuestro anuncio cuando alguien busque esto". Se definen por grupo de anuncios.' },
      { term: 'Término de búsqueda', def: 'Lo que la persona escribió realmente en Google cuando se le mostró el anuncio. Puede coincidir con nuestra palabra clave o ser una variante (otro orden, errores de tipeo, palabras de más).' },
      { term: 'Concordancia', def: 'Qué tan parecida debe ser la búsqueda a nuestra palabra clave para que el anuncio aparezca. Exacta: la búsqueda es igual (o casi igual) a la palabra clave. De frase: la búsqueda contiene la palabra clave dentro de una frase más larga. Amplia: Google muestra el anuncio en búsquedas relacionadas con el tema. IA Max: la inteligencia artificial de Google decide por intención de búsqueda.' },
      { term: 'Cuota de búsqueda', def: 'De todas las veces que el anuncio PODRÍA haber aparecido, qué porcentaje apareció de verdad. El resto se reparte entre "perdida por ranking" (el anuncio compitió pero quedó afuera por calidad o puja baja) y "perdida por presupuesto" (no había más presupuesto para participar; en el reporte es estimada como el resto hasta 100%).' },
    ],
  },

  // Versión en inglés del glosario Paid — para el toggle EN del pilar.
  paidEn: {
    title: 'Glossary — Paid Media',
    note: '<strong>Budget is only spent when someone clicks the ad.</strong> Being shown (an "impression") costs nothing: if an ad appears 100 times and only one person clicks it, we pay for that single click. That is why there can be thousands of impressions with very little spend.<br /><strong>And how much does each click cost?</strong> It is not a fixed price: it works like an auction. The price depends on how many advertisers are paying for the same keyword. If nobody else pays for it, the click is cheap; the more competitors buying that same word, the more expensive the click becomes. That is why CPC varies across campaigns and months.',
    entries: [
      { term: 'Impressions', def: 'Number of times the ads were shown in search results.' },
      { term: 'Clicks', def: 'Number of times users clicked on an ad.' },
      { term: 'CTR', def: 'Click-Through Rate: percentage of clicks over impressions. Measures how attractive the ad is for the search.' },
      { term: 'Avg. CPC', def: 'Average cost paid per click during the period. Each click\'s price is set by auction: it depends on how many advertisers compete for the same keyword (more competition, more expensive clicks).' },
      { term: 'Cost', def: 'Total spend executed on the campaign during the period.' },
      { term: 'Conversions', def: 'Valuable actions completed after the click (e.g. form submission or contact request) according to the campaign objective.' },
      { term: 'Conversion rate', def: 'Percentage of clicks that ended in a conversion.' },
      { term: 'Cost per conversion', def: 'Average spend needed to generate one conversion (cost per lead).' },
      { term: 'Optimization score', def: 'Campaign health indicator in Google Ads based on applied configuration best practices.' },
      { term: 'Keyword', def: 'The words or phrases we choose to tell Google "show our ad when someone searches for this". Defined per ad group.' },
      { term: 'Search term', def: 'What the person actually typed into Google when the ad was shown. It may match our keyword exactly or be a variant (different order, typos, extra words).' },
      { term: 'Match type', def: 'How similar the search must be to our keyword for the ad to appear. Exact: the search equals (or nearly equals) the keyword. Phrase: the search contains the keyword within a longer phrase. Broad: Google shows the ad on searches related to the topic. AI Max: Google\'s AI decides based on search intent.' },
      { term: 'Search impression share', def: 'Of all the times the ad COULD have appeared, the percentage it actually did. The rest splits into "lost to rank" (the ad competed but lost due to quality or low bid) and "lost to budget" (no budget left to compete; estimated in the report as the remainder up to 100%).' },
    ],
  },

  email: {
    title: 'Glosario — Email Marketing',
    entries: [
      { term: 'Envíos', def: 'Cantidad total de correos entregados durante el período.' },
      { term: 'Tasa de apertura', def: 'Porcentaje de correos entregados que fueron abiertos por los destinatarios.' },
      { term: 'Tasa de clics', def: 'Porcentaje de correos en los que el destinatario hizo clic en algún enlace.' },
      { term: 'Tasa de rebote', def: 'Porcentaje de correos que no pudieron entregarse (casillas inexistentes o llenas).' },
      { term: 'Tasa de bajas', def: 'Porcentaje de destinatarios que se desuscribieron tras el envío.' },
      { term: 'Contactos nuevos', def: 'Contactos sumados a las listas/secuencias durante el período (Mailchimp / Apollo).' },
    ],
  },

  webinars: {
    title: 'Glosario — Webinars',
    entries: [
      { term: 'Registrados', def: 'Cantidad de personas que se inscribieron al webinar.' },
      { term: 'Asistentes', def: 'Cantidad de inscriptos que efectivamente asistieron en vivo.' },
      { term: 'Tasa de asistencia', def: 'Porcentaje de registrados que asistieron en vivo.' },
      { term: 'Duración promedio', def: 'Tiempo promedio que los asistentes permanecieron conectados.' },
      { term: 'Reproducciones del replay', def: 'Visualizaciones de la grabación después del evento en vivo.' },
      { term: 'Leads generados', def: 'Contactos comerciales calificados originados a partir del webinar.' },
    ],
  },

  // ── Website tiene DOS glosarios (Website + SEO), tal cual las capturas ──
  website: {
    title: 'Glosario — Website',
    entries: [
      { term: 'Single Traffic', def: 'Cantidad total de visitantes únicos que accedieron al sitio durante el período seleccionado. Cada persona se cuenta una sola vez.' },
      { term: 'Total Traffic', def: 'Cantidad total de visitas al sitio, incluyendo múltiples sesiones de un mismo usuario. Muestra la actividad general del sitio.' },
      { term: 'Impressions', def: 'Cantidad total de vistas de página generadas en el sitio; indica cuántas veces se mostraron las páginas.' },
      { term: 'Conversions', def: 'Cantidad de usuarios que realizaron una acción de interés directo, como completar un formulario, solicitar una consulta o contactar por otro canal.' },
    ],
  },

  websiteSeo: {
    title: 'Glosario — Website SEO',
    entries: [
      { term: 'SEO (Search Engine Optimization)', def: 'Proceso de optimización del sitio para mejorar su visibilidad en los resultados de búsqueda. Ayuda a atraer tráfico orgánico haciendo el contenido más relevante y accesible.' },
      { term: 'Impressions', def: 'Cantidad total de veces que las páginas del sitio aparecieron en los resultados de búsqueda. Refleja la visibilidad y el alcance potencial en orgánico.' },
      { term: 'Average Position', def: 'Ranking promedio de las páginas del sitio en los resultados de búsqueda para las keywords seleccionadas. Indica qué tan visible es el contenido frente a competidores.' },
      { term: 'Top 3 keywords con más clics', def: 'Las búsquedas que generaron la mayor cantidad de clics al sitio. Reflejan los temas que impulsan el tráfico más relevante.' },
      { term: 'Total clicks', def: 'Cantidad total de veces que los usuarios hicieron clic en el sitio desde los resultados de búsqueda. Indica el nivel de interés y tráfico orgánico generado.' },
    ],
  },
};
