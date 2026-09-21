// ════════════════════════════════════════════════════════════════
//  SEED — Vista PLANES. Informes mensuales de avance de los planes
//  regionales de marketing que MarComms presta a un cliente (hoy: el plan
//  de 6 meses de Control Union USA para el mercado orgánico).
//  Fuente: el informe mensual del plan (PDF del equipo). Es información
//  de gestión (entregables, próximos pasos, tracker), no métricas de
//  plataforma: se transcribe tal cual, no se generan insights.
//  Textos en ES (idioma base) con su variante `…En`.
// ════════════════════════════════════════════════════════════════

export const PLAN_CLIENTS = [{ id: 'cuus', name: 'Control Union USA' }];

// Un período por informe mensual del plan (más antiguo primero).
export const PLAN_PERIODS = [{ id: 'm1', label: 'Mes 1 · 5 ago – 5 sep 2026', labelEn: 'Month 1 · Aug 5 – Sep 5, 2026' }];

export const PLANS_DB = {
  cuus: {
    m1: {
      reportNo: 1,
      title: 'Control Union USA Marketing — Mercado Orgánico',
      titleEn: 'Control Union USA Marketing — Organic Market',
      program: 'Plan regional de marketing · hoja de ruta de 6 meses',
      programEn: 'Regional marketing plan · 6-month roadmap',
      period: 'Mes 1 · 5 de agosto – 5 de septiembre de 2026',
      periodEn: 'Month 1 · Aug 5 – Sep 5, 2026',
      market: 'Certificación orgánica en Estados Unidos (USDA Organic, PrimusGFS)',
      marketEn: 'Organic certification in the United States (USDA Organic, PrimusGFS)',
      // Párrafo de apertura: foco en el objetivo del plan (pedido del 21/9/2026).
      intro:
        'Objetivo del plan: posicionar a Control Union USA como organismo certificador de referencia en el mercado orgánico de Estados Unidos y convertir ese posicionamiento en leads calificados en seis meses. El Mes 1 dejó armada la base sobre la que se apoya todo lo que sigue: definición de marca, benchmarking de competidores, estructura de campaña en Google Ads y audiencia objetivo definida.',
      introEn:
        'Plan objective: position Control Union USA as a reference certification body in the U.S. organic market and turn that positioning into qualified leads within six months. Month 1 built the base every later action rests on: brand definition, competitor benchmarking, Google Ads campaign structure and a defined target audience.',
      objectiveTitle: 'Objetivo del Mes 1: fundamentos',
      objectiveTitleEn: 'Month 1 objective: foundations',
      objective: [
        'Branding definido para Control Union USA',
        'Benchmarking: 33 programas de certificación de competidores mapeados',
        'Estructura inicial de campaña de Google Ads',
        'Base de datos comercial: 1.368 contactos',
        'ICP Tier 1 y audiencia definidos',
      ],
      objectiveEn: [
        'Branding defined for Control Union USA',
        'Benchmarking: 33 competitor certification programs mapped',
        'Initial Google Ads campaign structure',
        'Commercial database: 1,368 contacts',
        'Tier 1 ICP and audience defined',
      ],
      kpis: [
        { value: '6/7', label: 'Entregables completados', labelEn: 'Deliverables completed' },
        { value: '33', label: 'Programas de competidores mapeados', labelEn: 'Competitor programs mapped' },
        { value: '1.368', valueEn: '1,368', label: 'Contactos en la base comercial', labelEn: 'Contacts in commercial database' },
        { value: '2', label: 'Landing pages optimizadas', labelEn: 'Landing pages optimized' },
      ],
      // Estados: 'done' | 'progress' | 'pending' (la etiqueta visible sale del diccionario).
      deliverables: [
        { name: 'Optimización de landing pages', nameEn: 'Landing page optimization', status: 'done', outcome: 'Landing pages de USDA Organic y PrimusGFS optimizadas', outcomeEn: 'USDA Organic and PrimusGFS landing pages optimized' },
        { name: 'Benchmarking: SCS Global Services', nameEn: 'Benchmarking: SCS Global Services', status: 'done', outcome: '33 programas de certificación de competidores mapeados', outcomeEn: '33 competitor certification programs mapped' },
        { name: 'Estructura de campaña de Google Ads', nameEn: 'Google Ads campaign structure', status: 'done', outcome: 'Arquitectura inicial de campaña armada', outcomeEn: 'Initial campaign architecture built' },
        { name: 'Definición de branding — CU USA', nameEn: 'Branding definition — CU USA', status: 'done', outcome: 'Lineamientos de marca definidos', outcomeEn: 'Brand guidelines defined' },
        { name: 'Base de datos comercial', nameEn: 'Commercial database', status: 'done', outcome: '1.368 contactos calificados incorporados', outcomeEn: '1,368 qualified contacts added' },
        { name: 'Optimización de redes sociales', nameEn: 'Social media optimization', status: 'progress', outcome: 'Profesionalización de perfiles en marcha', outcomeEn: 'Profile professionalization underway' },
        { name: 'Market brief: audiencia e ICP', nameEn: 'Market brief: audience & ICP', status: 'done', outcome: 'Target Tier 1 definido', outcomeEn: 'Tier 1 target defined' },
      ],
      nextTitle: 'Próximos pasos: prioridades del Mes 2',
      nextTitleEn: 'Next steps: Month 2 priorities',
      nextSteps: [
        'Sumar casos de éxito a las landing pages de USDA Organic y PrimusGFS.',
        'Terminar la profesionalización de los perfiles de redes sociales de los referentes del equipo.',
        'Lanzar la campaña de Google Ads sobre la estructura definida en el Mes 1.',
        'Activar la prospección comercial sobre la base de contactos, enfocada en el ICP definido.',
      ],
      nextStepsEn: [
        'Add success stories to the USDA Organic and PrimusGFS landing pages.',
        "Finish professionalizing key team members' social media profiles.",
        'Launch the Google Ads campaign on the structure defined in Month 1.',
        'Activate commercial prospecting on the contact database, focused on the defined ICP.',
      ],
      trackerTitle: 'Tracker de acciones — Mes 2',
      trackerTitleEn: 'Month 2 action tracker',
      // Prioridad: 'high' | 'medium' | null (sin asignar).
      tracker: [
        { name: 'Base de certificaciones de Perú', nameEn: 'Peru Certification Database', status: 'pending', priority: null },
        { name: 'Calendario de webinars', nameEn: 'Webinar Calendar', status: 'pending', priority: null },
        { name: 'Plan de Social Media H2', nameEn: 'Social Media Plan H2', status: 'pending', priority: null },
        { name: 'Newsletter interno: benchmark, industria y competencia', nameEn: 'Internal Newsletter: Benchmark, Industry & Competition', status: 'pending', priority: null },
        { name: 'Informe USDA', nameEn: 'USDA Report', status: 'pending', priority: 'medium' },
        { name: 'Benchmarking: certificadoras prioritarias', nameEn: 'Benchmarking: Top Priority CBs', status: 'done', priority: 'high' },
        { name: 'Investigación de Social Media', nameEn: 'Social Media Research', status: 'pending', priority: 'high' },
        { name: 'POC de Sales Navigator', nameEn: 'Sales Navigator POC', status: 'pending', priority: null },
        { name: 'Informe de mercado USDA', nameEn: 'USDA Market Report', status: 'done', priority: 'medium' },
        { name: 'Artículo interno en Sharenet', nameEn: 'Internal Sharenet Article', status: 'pending', priority: null },
        { name: 'Campaña GEO — evento orgánico', nameEn: 'GEO Campaign — Organic Event', status: 'progress', priority: 'high' },
      ],
    },
  },
};
