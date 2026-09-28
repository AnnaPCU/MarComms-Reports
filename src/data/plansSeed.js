// ════════════════════════════════════════════════════════════════
//  SEED — Vista PLANES. Informes mensuales de avance de los planes
//  regionales de marketing que MarComms presta a un cliente (hoy: el plan
//  de Control Union USA para el mercado orgánico, «Control Union North
//  America · Organic» en el informe del equipo).
//  Fuente: el informe mensual del plan que arma el equipo. Es información
//  de gestión (entregables, KPIs operativos y de performance, iniciativas),
//  no métricas de plataforma: se transcribe tal cual, no se generan insights.
//  Un período por informe; el informe nuevo REEMPLAZA al anterior cuando el
//  equipo lo pide así (sep 2026 reemplazó al «Mes 1» del 21/9).
//  Textos en ES (idioma base) con su variante `…En`.
// ════════════════════════════════════════════════════════════════

export const PLAN_CLIENTS = [{ id: 'cuus', name: 'Control Union USA' }];

// Un período por informe mensual del plan (más antiguo primero).
export const PLAN_PERIODS = [{ id: 'sep-2026', label: 'Septiembre 2026', labelEn: 'September 2026' }];

export const PLANS_DB = {
  cuus: {
    'sep-2026': {
      title: 'Informe mensual MarComms — Control Union North America · Orgánico',
      titleEn: 'MarComms Monthly Report — Control Union North America · Organic',
      program: 'Plan regional de marketing · mercado orgánico',
      programEn: 'Regional marketing plan · organic market',
      period: 'Septiembre 2026',
      periodEn: 'September 2026',
      market: 'Certificación orgánica en Estados Unidos (USDA Organic, PrimusGFS)',
      marketEn: 'Organic certification in the United States (USDA Organic, PrimusGFS)',
      // Vista de deals del plan en HubSpot (la pasó el equipo el 28/9/2026).
      pipelineUrl: 'https://app.hubspot.com/contacts/47081900/objects/0-3/views/73376389/board',
      // Párrafo de apertura: foco en el objetivo del plan (pedido del 21/9/2026).
      intro:
        'Objetivo del plan: posicionar a Control Union USA como organismo certificador de referencia en el mercado orgánico de Estados Unidos y convertir ese posicionamiento en leads calificados. Este informe resume lo entregado en el mes, los indicadores operativos y de performance, y las iniciativas de generación de demanda en marcha.',
      introEn:
        'Plan objective: position Control Union USA as a reference certification body in the U.S. organic market and turn that positioning into qualified leads. This report summarizes what was delivered during the month, the operational and performance indicators, and the demand-generation initiatives under way.',
      // Resumen del mes (tarjeta oscura).
      summaryTitle: 'Resumen del mes',
      summaryTitleEn: 'Month at a glance',
      summary: ['8 entregables completados', '4 entregables en curso', '5 iniciativas de generación de demanda', '9 reuniones internas'],
      summaryEn: ['8 deliverables completed', '4 deliverables in progress', '5 demand-generation initiatives', '9 internal meetings'],
      // KPIs en dos grupos, en una sola fila (operativos + performance). `value: null` = sin dato
      // (se muestra «—», nunca se inventa). «Pipeline generado» se quitó a pedido del equipo (28/9).
      kpiGroups: [
        {
          name: 'Operativos',
          nameEn: 'Operational',
          items: [
            { value: '8', label: 'Entregables completados', labelEn: 'Deliverables completed' },
            { value: '9', label: 'Reuniones internas', labelEn: 'Internal meetings' },
            { value: '800', label: 'Contactos en la base comercial', labelEn: 'Database created · contacts', note: 'Top 5 estados USDA', noteEn: 'Top 5 USDA states' },
          ],
        },
        {
          name: 'Performance',
          nameEn: 'Performance',
          items: [
            { value: '2', label: 'MQLs generados', labelEn: 'MQLs generated' },
            { value: '6', label: 'Ventas generadas', labelEn: 'Sales generated' },
          ],
        },
      ],
      // Entregables por estado: 'done' | 'progress'.
      deliverables: [
        { status: 'done', name: 'Optimización web 2.0', nameEn: 'Web Optimization 2.0', desc: 'Landing pages de USDA Organic y PrimusGFS optimizadas.', descEn: 'Optimized landing pages for USDA Organic and PrimusGFS.' },
        { status: 'done', name: 'Benchmarking: investigación competitiva', nameEn: 'Benchmarking: Competitive Research', desc: 'Investigación competitiva sobre 33 programas seleccionados.', descEn: 'Competitive research covering 33 selected programs.' },
        { status: 'done', name: 'Campaña de Google Ads', nameEn: 'Google Ads Campaign', desc: 'Creación de la campaña.', descEn: 'Campaign creation.' },
        { status: 'done', name: 'Branding CUC', nameEn: 'CUC Branding', desc: 'Definición de branding.', descEn: 'Branding definition.' },
        { status: 'done', name: 'Base de datos de la herramienta comercial', nameEn: 'Commercial Tool Database', desc: 'Base y contactos creados: 568 para Florida y Arizona; 800 para los 5 principales estados USDA (suma Nueva York, Texas y Nueva Jersey).', descEn: 'Database and contacts created: 568 for Florida and Arizona; 800 for the top 5 USDA states (adds New York, Texas and New Jersey).' },
        { status: 'done', name: 'Optimización de redes sociales: perfil', nameEn: 'Social Media Optimization: Profile', desc: 'Profesionalización del perfil de Karl.', descEn: "Professionalization of Karl's profile." },
        { status: 'done', name: 'Benchmarking digital: competidores', nameEn: 'Digital Benchmarking: Competitors', desc: 'Investigación del ecosistema digital de los competidores.', descEn: "Research of the competitors' digital ecosystem." },
        { status: 'done', name: 'Informe de mercado USDA', nameEn: 'USDA Market Report', desc: 'Informe de mercado USDA con principales clientes, estados y organismos de certificación.', descEn: 'USDA market report covering main clients, states and certification bodies.' },
        { status: 'progress', name: 'Paid Media para evento', nameEn: 'Paid Media for Event', desc: 'Campaña GEO para el evento orgánico.', descEn: 'GEO campaign for the organic event.' },
        { status: 'progress', name: 'Comunicación interna', nameEn: 'Internal Communication', desc: 'Anuncio de Karl a PCU sobre la oportunidad de trabajar con la oficina de Estados Unidos en normas orgánicas; artículo interno en Sharenet.', descEn: 'Announcement from Karl to PCU on the opportunity to work with the US office on organic standards; internal Sharenet article.' },
        { status: 'progress', name: 'Newsletter externo – LinkedIn', nameEn: 'External Newsletter – LinkedIn', desc: 'Newsletter de LinkedIn en las cuentas de Karl y de Control Union North America sobre temas orgánicos.', descEn: "LinkedIn newsletter on Karl's and Control Union North America's accounts covering organic topics." },
        { status: 'progress', name: 'Plan de contenidos: Social Media y Web Q4', nameEn: 'Content Plan: Social Media & Web Q4', desc: 'Calendario de contenidos orgánicos en nuestros canales para el Q4 2026.', descEn: 'Organic content calendar across our channels for Q4 2026.' },
      ],
      // Iniciativas por grupo.
      initiativeGroups: [
        {
          name: 'Generación de demanda',
          nameEn: 'Demand generation',
          items: [
            { name: 'Webinars', nameEn: 'Webinars', desc: 'Temas a definir con WOLF y eventos a calendarizar.', descEn: 'Topics to be defined with WOLF and events to be scheduled.' },
            { name: 'Base de datos de TC de Perú', nameEn: 'Peru TC Database', desc: 'Alineación con Fiorella y Álvaro para usar los leads de los TC de Perú para generar demanda.', descEn: 'Alignment with Fiorella and Alvaro to use leads from Peru TCs to generate demand.' },
            { name: 'Seguimiento BDR', nameEn: 'BDR Follow-up', desc: 'Servicio de BDR montado desde MarComms, con una persona del equipo dedicada al seguimiento de leads.', descEn: 'BDR service set up from MarComms, with a team member dedicated to lead follow-up.' },
            { name: 'Steal Services', nameEn: 'Steal Services', desc: 'Automatización de email marketing dirigida a la base de datos de los competidores.', descEn: "Email marketing automation targeting the competitors' database." },
            { name: 'Seguimiento de leads del evento orgánico', nameEn: 'Organic Event Lead Follow-up', desc: 'Acción de seguimiento con los leads del evento orgánico.', descEn: 'Follow-up action with leads from the organic event.' },
          ],
        },
      ],
    },
  },
};
