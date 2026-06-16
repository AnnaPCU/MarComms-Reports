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
      { term: 'Pilar ESG', def: 'Clasificación de cada publicación según su eje: Ambiental (E), Social (S) o Gobernanza (G).' },
    ],
  },

  paid: {
    title: 'Glosario — Paid Media',
    entries: [
      { term: 'Impresiones', def: 'Cantidad de veces que los anuncios se mostraron en los resultados de búsqueda.' },
      { term: 'Clics', def: 'Cantidad de veces que los usuarios hicieron clic en un anuncio.' },
      { term: 'CTR', def: 'Click-Through Rate: porcentaje de clics sobre impresiones. Mide qué tan atractivo es el anuncio frente a la búsqueda.' },
      { term: 'CPC medio', def: 'Costo promedio por clic pagado durante el período.' },
      { term: 'Coste', def: 'Inversión total ejecutada en la campaña durante el período.' },
      { term: 'Conversiones', def: 'Acciones de valor completadas tras el clic (por ej. envío de formulario o solicitud de contacto) según el objetivo de la campaña.' },
      { term: 'Tasa de conversión', def: 'Porcentaje de clics que terminaron en una conversión.' },
      { term: 'Coste por conversión', def: 'Inversión promedio necesaria para generar una conversión (coste por lead).' },
      { term: 'Nivel de optimización', def: 'Indicador de salud de la campaña en Google Ads según buenas prácticas de configuración aplicadas.' },
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
