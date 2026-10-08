// ════════════════════════════════════════════════════════════════
//  SEED — Vista PLANES. Informes mensuales de avance de los planes
//  regionales de marketing que MarComms presta a un cliente.
//  Planes cargados: Control Union USA (mercado orgánico, «Control Union
//  North America · Organic» en el informe del equipo), Peterson Solutions
//  Argentina y Control Union Argentina (hojas «PS Argentina» y «CU
//  Argentina» del Excel de seguimiento de planes).
//  KPIs (pedido del 8/10/2026): operativos (entregables, reuniones,
//  contactos) y performance («Deals generados» + MQLs; ventas solo en CU USA).
//  CU USA mide deals, MQLs y ventas en USD; los planes de Argentina, en
//  cantidad.
//  Fuente: el informe mensual del plan que arma el equipo. Es información
//  de gestión (entregables, KPIs operativos y de performance, iniciativas),
//  no métricas de plataforma: se transcribe tal cual, no se generan insights.
//  Un período por informe; el informe nuevo REEMPLAZA al anterior cuando el
//  equipo lo pide así (sep 2026 reemplazó al «Mes 1» del 21/9).
//  Textos en ES (idioma base) con su variante `…En`.
// ════════════════════════════════════════════════════════════════

export const PLAN_CLIENTS = [
  { id: 'cuus', name: 'Control Union Estados Unidos' },
  { id: 'psar', name: 'Peterson Solutions Argentina' },
  { id: 'cuar', name: 'Control Union Argentina' },
];

// Un período por informe mensual del plan (más antiguo primero).
export const PLAN_PERIODS = [
  { id: 'ago-2026', label: 'Agosto 2026', labelEn: 'August 2026' },
  { id: 'sep-2026', label: 'Septiembre 2026', labelEn: 'September 2026' },
];

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
      // Párrafo de apertura: foco en el objetivo del plan (pedido del 21/9/2026).
      intro:
        'Objetivo del plan: posicionar a Control Union USA como organismo certificador de referencia en el mercado orgánico de Estados Unidos y convertir ese posicionamiento en leads calificados. Este informe resume lo entregado en el mes, los indicadores operativos y de performance, y las iniciativas de generación de demanda en marcha.',
      introEn:
        'Plan objective: position Control Union USA as a reference certification body in the U.S. organic market and turn that positioning into qualified leads. This report summarizes what was delivered during the month, the operational and performance indicators, and the demand-generation initiatives under way.',
      // Resumen del mes (tarjeta oscura).
      summaryTitle: 'Resumen del mes',
      summaryTitleEn: 'Month at a glance',
      summary: ['8 entregables completados', '4 entregables en curso', '5 iniciativas de generación de demanda', '9 reuniones internas'],
      // Links por entregable (columna «Link», solo en la tabla cuyas filas los traen).
      summaryEn: ['8 deliverables completed', '4 deliverables in progress', '5 demand-generation initiatives', '9 internal meetings'],
      // KPIs en dos grupos, en una sola fila (operativos + performance). `value: null` = sin dato
      // (se muestra «—», nunca se inventa). `unit` = unidad chica al lado del valor (USD); `pill` = etiqueta destacada; `note` = aclaración.
      kpiGroups: [
        {
          name: 'Operativos',
          nameEn: 'Operational',
          items: [
            { value: '8', label: 'Entregables completados', labelEn: 'Deliverables completed' },
            { value: '9', label: 'Reuniones internas', labelEn: 'Internal meetings' },
            // Dato que pasa el equipo a mano (todavía no llegó).
            { value: null, label: 'Contactos generados en el CRM', labelEn: 'Contacts generated in the CRM' },
          ],
        },
        {
          name: 'Performance',
          nameEn: 'Performance',
          items: [
            { value: '848.160', valueEn: '848,160', unit: 'USD', label: 'Deals generados', labelEn: 'Deals generated', note: '20 % proveniente de bases de datos creadas con la Commercial Tool', noteEn: '20% from databases created with the Commercial Tool' },
            { value: '40.000', valueEn: '40,000', unit: 'USD', label: 'MQLs generados', labelEn: 'MQLs generated', pill: '8 MQLs', pillEn: '8 MQLs' },
            { value: '10.000', valueEn: '10,000', unit: 'USD', label: 'Ventas generadas', labelEn: 'Sales generated', pill: '2 ventas', pillEn: '2 sales' },
          ],
        },
      ],
      // Entregables por estado: 'done' | 'progress'.
      deliverables: [
        {
          status: 'done', name: 'Optimización web 2.0', nameEn: 'Web Optimization 2.0', desc: 'Landing pages de USDA Organic y PrimusGFS optimizadas.', descEn: 'Optimized landing pages for USDA Organic and PrimusGFS.',
          links: [
            { label: 'USDA Organic', url: 'https://northamerica.controlunion.com/certification-program/usda-organic-nop-certification/' },
            { label: 'PrimusGFS', url: 'https://northamerica.controlunion.com/certification-program/primusgfs-certification/' },
          ],
        },
        {
          status: 'done', name: 'Benchmarking: investigación competitiva', nameEn: 'Benchmarking: Competitive Research', desc: 'Investigación competitiva sobre 33 programas seleccionados.', descEn: 'Competitive research covering 33 selected programs.',
          links: [{ label: 'Benchmarking', labelEn: 'Benchmarking', url: 'https://pcugroup.sharepoint.com/:x:/r/sites/CommunicationsLATAM/Gedeelde%20documenten/General/000.Planes%20MarComms/CU%20-%20Certificaciones%20USA%20-%20Org%C3%A1nico/Reportes/Benchmarking%20-%20competitive%20research.xlsx?d=we8e5f90e90f64f6a952a8139908d6e0b&csf=1&web=1&e=cp8RqZ' }],
        },
        { status: 'done', name: 'Campaña de Google Ads', nameEn: 'Google Ads Campaign', desc: 'Creación de la campaña.', descEn: 'Campaign creation.' },
        {
          status: 'done', name: 'Branding CUC', nameEn: 'CUC Branding', desc: 'Definición de branding.', descEn: 'Branding definition.',
          links: [{ label: 'Decisión de marca CUC', labelEn: 'CUC brand decision', url: 'https://pcugroup.sharepoint.com/:i:/r/sites/CommunicationsLATAM/Gedeelde%20documenten/General/000.Planes%20MarComms/CU%20-%20Certificaciones%20USA%20-%20Org%C3%A1nico/Branding/Decisi%C3%B3n%20de%20marca%20CUC.png?d=w776c45cffd994c2aa776053ea6b3e59f&csf=1&web=1&e=dI4D75' }],
        },
        {
          status: 'done', name: 'Base de datos de la herramienta comercial', nameEn: 'Commercial Tool Database', desc: 'Base y contactos creados: 568 para Florida y Arizona; 800 para los 5 principales estados USDA (suma Nueva York, Texas y Nueva Jersey).', descEn: 'Database and contacts created: 568 for Florida and Arizona; 800 for the top 5 USDA states (adds New York, Texas and New Jersey).',
          links: [{ label: 'Pipeline en HubSpot', labelEn: 'HubSpot pipeline', url: 'https://app.hubspot.com/contacts/47081900/objects/0-3/views/73376389/board' }],
        },
        {
          status: 'done', name: 'Optimización de redes sociales: perfil', nameEn: 'Social Media Optimization: Profile', desc: 'Profesionalización del perfil de Karl.', descEn: "Professionalization of Karl's profile.",
          links: [{ label: 'Perfil de Karl en LinkedIn', labelEn: "Karl's LinkedIn profile", url: 'https://www.linkedin.com/in/karlosoriodiaz/' }],
        },
        {
          status: 'done', name: 'Benchmarking digital: competidores', nameEn: 'Digital Benchmarking: Competitors', desc: 'Investigación del ecosistema digital de los competidores.', descEn: "Research of the competitors' digital ecosystem.",
          links: [{ label: 'Benchmarking digital', labelEn: 'Digital benchmarking', url: 'https://pcugroup.sharepoint.com/:p:/r/sites/CommunicationsLATAM/Gedeelde%20documenten/General/000.Planes%20MarComms/CU%20-%20Certificaciones%20USA%20-%20Org%C3%A1nico/Reportes/Digital%20Benchmarking%20-%20competitors.pptx?d=w4e030068a6734f899ca1e329d95278e0&csf=1&web=1&e=aGiRgH' }],
        },
        {
          status: 'done', name: 'Informe de mercado USDA', nameEn: 'USDA Market Report', desc: 'Informe de mercado USDA con principales clientes, estados y organismos de certificación.', descEn: 'USDA market report covering main clients, states and certification bodies.',
          links: [{ label: 'Informe de mercado USDA', labelEn: 'USDA market report', url: 'https://pcugroup.sharepoint.com/:b:/r/sites/CommunicationsLATAM/Gedeelde%20documenten/General/000.Planes%20MarComms/CU%20-%20Certificaciones%20USA%20-%20Org%C3%A1nico/Reportes/USDA%20Market%20report.pdf?d=wdeb81a494a394019aac6094650f7857e&csf=1&web=1&e=vUmHCw' }],
        },
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
  // ── Peterson Solutions Argentina ──
  // Fuente: hoja «PS Argentina» de «Seguimiento_Planes_Marketing_v2.xlsx»
  // (reunión de seguimiento del 30/9/2026). Plan de 6 meses, septiembre 2026
  // → febrero 2027. Un informe por mes: cada tarea va en el informe del mes
  // de su fila (agosto = arranque, previo al inicio formal). Las tareas de
  // octubre aparecen en el informe de septiembre como trabajo en marcha
  // («En curso», o «Pendiente» si el Excel lo marca así), con los nombres
  // del Excel del 8/10; sus resultados van en el informe de octubre.
  // KPIs (8/10): deals y MQLs en cantidad (septiembre: 70 y 1, del equipo);
  // agosto sin dato → «—». Contactos generados por BBDD: agosto 2.001,
  // septiembre 76 (Ígaris), del Excel.
  // La base de difusión del webinar es de agosto (dato actualizado por el
  // equipo el 8/10: base total 5.403, hecha por MarComms 2.001). La
  // comunicación del webinar es del 4/9. Reuniones internas de septiembre:
  // 16/9, 17/9 y 30/9.
  psar: {
    'ago-2026': {
      title: 'Informe mensual MarComms — Peterson Solutions Argentina',
      titleEn: 'MarComms Monthly Report — Peterson Solutions Argentina',
      program: 'Plan de marketing de 6 meses · revisión mensual',
      programEn: '6-month marketing plan · monthly review',
      period: 'Agosto 2026 (arranque del plan)',
      periodEn: 'August 2026 (plan kickoff)',
      market: 'Argentina · plan septiembre 2026 → febrero 2027',
      marketEn: 'Argentina · plan September 2026 → February 2027',
      intro:
        'Objetivo del plan: generar pipeline, MQLs y revenue para Peterson Solutions Argentina, con una estrategia puntual para los tres servicios prioritarios que defina el equipo comercial. En agosto presentamos el plan, pedimos la información comercial y financiera para dimensionar el pipeline y arrancamos la gestión del webinar de EmpCo, con su landing de registro y su base de difusión. Las metas de pipeline, MQL y revenue todavía no están definidas en el plan.',
      introEn:
        'Plan objective: generate pipeline, MQLs and revenue for Peterson Solutions Argentina, with a focused strategy for the three priority services the sales team defines. In August we presented the plan, requested the commercial and financial data to size the pipeline, and started managing the EmpCo webinar, with its registration landing page and promotion database. The pipeline, MQL and revenue targets have not been set in the plan yet.',
      summaryTitle: 'Resumen del mes',
      summaryTitleEn: 'Month at a glance',
      summary: ['4 entregables completados', 'Presentación del plan MarComms (12/8)', 'Pedido de información comercial y financiera (19/8)', 'Base de difusión del webinar EmpCo: 2.001 contactos propios'],
      summaryEn: ['4 deliverables completed', 'MarComms plan presentation (8/12)', 'Commercial and financial data request (8/19)', 'EmpCo webinar promotion database: 2,001 own contacts'],
      kpiGroups: [
        {
          name: 'Operativos',
          nameEn: 'Operational',
          items: [
            { value: '4', label: 'Entregables completados', labelEn: 'Deliverables completed' },
            { value: '2', label: 'Reuniones internas', labelEn: 'Internal meetings', note: '12/8 y 19/8', noteEn: '8/12 and 8/19' },
            { value: '2.001', valueEn: '2,001', label: 'Contactos generados por BBDD', labelEn: 'Contacts generated from databases', note: 'Hecha por MarComms · base total 5.403', noteEn: 'Built by MarComms · total database 5,403' },
          ],
        },
        {
          name: 'Performance',
          nameEn: 'Performance',
          items: [
            { value: null, label: 'Deals generados', labelEn: 'Deals generated' },
            { value: null, label: 'MQLs generados', labelEn: 'MQLs generated' },
          ],
        },
      ],
      deliverables: [
        {
          status: 'done', name: 'Landing de registro del webinar EmpCo', nameEn: 'EmpCo webinar registration landing page', desc: 'Grupo de Teams y landing page de registro del webinar (10/8).', descEn: 'Teams group and webinar registration landing page (8/10).',
          links: [{ label: 'Landing de registro', labelEn: 'Registration landing page', url: 'https://events.teams.microsoft.com/event/e6c23d94-479e-4ae1-99ad-d3bdd4b0059f@4fc2f3aa-31c4-4dcb-b719-c6c16393e9d3?utm_source=contenido&utm_medium=email_mkt&utm_campaign=marcomms_argentina_certificaciones_marcomms_webinarempco' }],
        },
        { status: 'done', name: 'Presentación del plan MarComms', nameEn: 'MarComms plan presentation', desc: 'Reunión del 12/8: arranque del plan, con prioridad en el webinar de EmpCo. Se pidió al equipo comercial el Top 3 de servicios prioritarios, con sus drivers de mercado y ventajas competitivas, como insumo para contenidos, campañas, LinkedIn y web.', descEn: 'Meeting on 8/12: plan kickoff, prioritizing the EmpCo webinar. The sales team was asked for the Top 3 priority services, with their market drivers and competitive advantages, as input for content, campaigns, LinkedIn and web.' },
        { status: 'done', name: 'Follow-up de información comercial y financiera', nameEn: 'Commercial and financial data follow-up', desc: 'Reunión del 19/8: pedido de información de los servicios del budget (objetivos y revenue actual, mix renovaciones / clientes nuevos, ticket promedio, conversión y competencia) para armar un pipeline tentativo por Revenue Growth Stream.', descEn: 'Meeting on 8/19: request for data on the budgeted services (targets and current revenue, renewal / new-client mix, average ticket, conversion and competition) to build a tentative pipeline by Revenue Growth Stream.' },
        { status: 'done', name: 'Base de datos para la difusión del webinar', nameEn: 'Database for webinar promotion', desc: 'Base para la difusión del webinar de EmpCo: empresas de Iberoamérica que comunican atributos ambientales (bodegas, agroindustria, alimentos, energía, consultoras). Base total: 5.403 contactos únicos; base hecha por MarComms: 2.001. Hubo registrados de 18 países; entre los externos con país informado, Argentina concentra 66 de 95.', descEn: 'Database for promoting the EmpCo webinar: Ibero-American companies that communicate environmental attributes (wineries, agribusiness, food, energy, consultancies). Total database: 5,403 unique contacts; database built by MarComms: 2,001. Registrants came from 18 countries; among external registrants with a stated country, Argentina accounts for 66 of 95.' },
      ],
      initiativeGroups: [
        {
          name: 'Próximos pasos',
          nameEn: 'Next steps',
          items: [
            { name: 'Top 3 de servicios', nameEn: 'Top 3 services', desc: 'El equipo comercial define los tres servicios prioritarios, con drivers de mercado y ventajas competitivas, como insumo para contenidos, campañas, LinkedIn y web.', descEn: 'The sales team defines the three priority services, with market drivers and competitive advantages, as input for content, campaigns, LinkedIn and web.' },
            { name: 'Pipeline tentativo', nameEn: 'Tentative pipeline', desc: 'Con la información comercial y financiera de los servicios del budget, armar un pipeline tentativo por Revenue Growth Stream.', descEn: 'With the commercial and financial data on the budgeted services, build a tentative pipeline by Revenue Growth Stream.' },
            { name: 'Webinar EmpCo', nameEn: 'EmpCo webinar', desc: 'Gestión integral del webinar del 10/9: comunicación por email y LinkedIn, y reporte.', descEn: 'End-to-end management of the 9/10 webinar: email and LinkedIn communication, and report.' },
          ],
        },
      ],
    },
    'sep-2026': {
      title: 'Informe mensual MarComms — Peterson Solutions Argentina',
      titleEn: 'MarComms Monthly Report — Peterson Solutions Argentina',
      program: 'Plan de marketing de 6 meses · revisión mensual',
      programEn: '6-month marketing plan · monthly review',
      period: 'Septiembre 2026',
      periodEn: 'September 2026',
      market: 'Argentina · plan septiembre 2026 → febrero 2027',
      marketEn: 'Argentina · plan September 2026 → February 2027',
      intro:
        'Objetivo del plan: generar pipeline, MQLs y revenue para Peterson Solutions Argentina, con una estrategia puntual para los tres servicios prioritarios que defina el equipo comercial. En septiembre acompañamos la gestión integral del webinar de EmpCo, pusimos en marcha las campañas de Paid Media y armamos la base de Ígaris. Foco del mes: analizar resultados y empezar a armar la estrategia 2027. Las metas de pipeline, MQL y revenue todavía no están definidas en el plan.',
      introEn:
        'Plan objective: generate pipeline, MQLs and revenue for Peterson Solutions Argentina, with a focused strategy for the three priority services the sales team defines. In September we supported the end-to-end management of the EmpCo webinar, launched the Paid Media campaigns and built the Ígaris database. Focus of the month: analyze results and start building the 2027 strategy. The pipeline, MQL and revenue targets have not been set in the plan yet.',
      summaryTitle: 'Resumen del mes',
      summaryTitleEn: 'Month at a glance',
      summary: ['6 entregables completados', '4 tareas de octubre en marcha', 'Webinar EmpCo: 202 registros, 120 asistentes y 94 deals en HubSpot', 'Próxima reunión de seguimiento: 13/10/2026'],
      summaryEn: ['6 deliverables completed', '4 October tasks under way', 'EmpCo webinar: 202 registrations, 120 attendees and 94 deals in HubSpot', 'Next follow-up meeting: 10/13/2026'],
      kpiGroups: [
        {
          name: 'Operativos',
          nameEn: 'Operational',
          items: [
            { value: '6', label: 'Entregables completados', labelEn: 'Deliverables completed' },
            { value: '3', label: 'Reuniones internas', labelEn: 'Internal meetings', note: '16/9, 17/9 y 30/9', noteEn: '9/16, 9/17 and 9/30' },
            { value: '76', label: 'Contactos generados por BBDD', labelEn: 'Contacts generated from databases', note: 'Base Ígaris · 24 empresas', noteEn: 'Ígaris database · 24 companies' },
          ],
        },
        {
          name: 'Performance',
          nameEn: 'Performance',
          items: [
            { value: '70', label: 'Deals generados', labelEn: 'Deals generated' },
            { value: '1', label: 'MQLs generados', labelEn: 'MQLs generated' },
          ],
        },
      ],
      deliverables: [
        { status: 'done', name: 'Comunicación del webinar EmpCo', nameEn: 'EmpCo webinar communication', desc: 'Comunicación hecha el 4/9: email marketing con 7 envíos (Emails 1 a 4 a la base completa y post-webinar en tres versiones: base, asistentes y registrados), 2 posteos en Peterson Solutions Iberia & Americas y artículo para web y LinkedIn.', descEn: 'Communication done on 9/4: email marketing with 7 sends (Emails 1 to 4 to the full database and a post-webinar email in three versions: database, attendees and registrants), 2 posts on Peterson Solutions Iberia & Americas and an article for the website and LinkedIn.' },
        {
          status: 'done', name: 'Webinar EmpCo', nameEn: 'EmpCo webinar', desc: 'Webinar del 10/9 sobre la regulación que entra en vigencia en septiembre, con gestión completa (landing de registro, email, LinkedIn y reporte): 202 registros, 120 asistentes, 94 deals en HubSpot y 5 hot deals.', descEn: 'Webinar on 9/10 about the regulation taking effect in September, managed end to end (registration landing page, email, LinkedIn and report): 202 registrations, 120 attendees, 94 deals in HubSpot and 5 hot deals.',
          links: [{ label: 'Reporte del webinar', labelEn: 'Webinar report', url: 'https://pcugroup-my.sharepoint.com/:u:/p/fcapoulat/IQARL94UHt1UQZKNeGxdvJbFAQIZPI08qPFC3k4SNnatBzg?e=OKYlZW' }],
        },
        { status: 'done', name: 'Follow-up del plan MarComms', nameEn: 'MarComms plan follow-up', desc: 'Reunión del 16/9 con Martin Dachhary, Simón Pierazzoli, Agustina Ball y Victoria Colombo.', descEn: 'Meeting on 9/16 with Martin Dachhary, Simón Pierazzoli, Agustina Ball and Victoria Colombo.' },
        { status: 'done', name: 'Campañas de Paid Media · septiembre', nameEn: 'Paid Media campaigns · September', desc: '8 campañas para SuSo, SuSe y Bioenergía, con foco en generar leads: 1 lead en el mes.', descEn: '8 campaigns for SuSo, SuSe and Bioenergy, focused on lead generation: 1 lead in the month.' },
        {
          status: 'done', name: 'Diseño de propuesta para clientes', nameEn: 'Client proposal design', desc: '22/9: archivo editable para compartir propuestas con clientes, alineado al manual de marca y a la identidad corporativa.', descEn: '9/22: editable file for sharing proposals with clients, aligned with the brand guidelines and corporate identity.',
          links: [{ label: 'Plantilla de propuesta', labelEn: 'Proposal template', url: 'https://canva.link/x39ggwc2sxdrb29' }],
        },
        {
          status: 'done', name: 'Base de datos Ígaris', nameEn: 'Ígaris database', desc: '30/9: base y nurturing para calificar leads: 76 contactos en 24 empresas.', descEn: '9/30: database and nurturing to qualify leads: 76 contacts across 24 companies.',
          links: [{ label: 'Base Ígaris', labelEn: 'Ígaris database', url: 'https://share.gemini.google/cCuqFrENzN2q' }],
        },
        { status: 'progress', name: 'Campañas de Paid Media · octubre', nameEn: 'Paid Media campaigns · October', desc: 'Siguen las 8 campañas para SuSo, SuSe y Bioenergía, con foco en generar leads.', descEn: 'The 8 campaigns for SuSo, SuSe and Bioenergy continue, focused on lead generation.' },
        { status: 'progress', name: 'Presentación comercial para Carrefour', nameEn: 'Sales presentation for Carrefour', desc: 'Presentación simple con un mensaje preciso para Carrefour (5/10).', descEn: 'Simple presentation with a precise message for Carrefour (10/5).' },
        { status: 'progress', name: 'Base de datos genérica para newsletter comercial', nameEn: 'Generic database for a sales newsletter', desc: 'Base para armar un newsletter comercial (7/10).', descEn: 'Database to build a sales newsletter (10/7).' },
        { status: 'pending', name: 'Base de datos por puestos de trabajo', nameEn: 'Database by job title', desc: 'Definir entre 6 y 7 puestos relevantes como criterio de búsqueda para identificar potenciales contactos en Argentina (13/10). Seguimiento en 2 a 3 semanas.', descEn: 'Define 6 to 7 relevant job titles as search criteria to identify potential contacts in Argentina (10/13). Follow-up in 2 to 3 weeks.' },
      ],
      initiativeGroups: [
        {
          name: 'Próximos pasos',
          nameEn: 'Next steps',
          items: [
            { name: 'Estrategia 2027', nameEn: '2027 strategy', desc: 'A la espera de los archivos con los resultados del año (industrias y datos adicionales al Power BI) para analizarlos y empezar a armar la estrategia 2027.', descEn: 'Waiting for the files with this year’s results (industries and data beyond Power BI) to analyze them and start building the 2027 strategy.' },
            { name: 'Acciones en curso', nameEn: 'Ongoing actions', desc: 'Campañas de Paid Media, bases de datos activas y soporte de comunicación en temáticas específicas.', descEn: 'Paid Media campaigns, active databases and communication support on specific topics.' },
          ],
        },
      ],
    },
  },

  // ── Control Union Argentina ──
  // Fuente: hoja «CU Argentina» del Excel de seguimiento (versión del
  // 8/10/2026). Plan de 6 meses, agosto 2026 → enero 2027. La hoja no tiene
  // tareas en agosto: el primer informe es el de septiembre. Las tareas de
  // octubre aparecen como trabajo en marcha, con su estado del Excel. La hoja
  // no trae objetivos ni decisiones del mes: no se inventan.
  // KPIs: deals (340) y MQLs (2) de septiembre, del equipo; los contactos de
  // la base de la campaña GHG no figuran en la hoja → «—».
  cuar: {
    'sep-2026': {
      title: 'Informe mensual MarComms — Control Union Argentina',
      titleEn: 'MarComms Monthly Report — Control Union Argentina',
      program: 'Plan de marketing de 6 meses · revisión mensual',
      programEn: '6-month marketing plan · monthly review',
      period: 'Septiembre 2026',
      periodEn: 'September 2026',
      market: 'Argentina · plan agosto 2026 → enero 2027',
      marketEn: 'Argentina · plan August 2026 → January 2027',
      intro:
        'En septiembre se crearon las campañas de Google Ads para las certificaciones, se relevó la oferta de la competencia en SMETA, ISO 27001 e ISCC mediante mystery shopping y se armó la base de datos de la campaña GHG del Q4, ya cargada en las plataformas de Paid Media.',
      introEn:
        'In September the Google Ads campaigns for the certifications were created, competitors’ offering for SMETA, ISO 27001 and ISCC was surveyed through mystery shopping, and the database for the Q4 GHG campaign was built and uploaded to the Paid Media platforms.',
      summaryTitle: 'Resumen del mes',
      summaryTitleEn: 'Month at a glance',
      summary: ['8 entregables completados', '2 entregables del mes en curso', 'Mystery shopping: SMETA, ISO 27001 e ISCC', '5 tareas de octubre en marcha'],
      summaryEn: ['8 deliverables completed', '2 deliverables of the month in progress', 'Mystery shopping: SMETA, ISO 27001 and ISCC', '5 October tasks under way'],
      kpiGroups: [
        {
          name: 'Operativos',
          nameEn: 'Operational',
          items: [
            { value: '8', label: 'Entregables completados', labelEn: 'Deliverables completed' },
            { value: '2', label: 'Reuniones internas', labelEn: 'Internal meetings', note: '28/9', noteEn: '9/28' },
            { value: null, label: 'Contactos generados por BBDD', labelEn: 'Contacts generated from databases' },
          ],
        },
        {
          name: 'Performance',
          nameEn: 'Performance',
          items: [
            { value: '340', label: 'Deals generados', labelEn: 'Deals generated' },
            { value: '2', label: 'MQLs generados', labelEn: 'MQLs generated' },
          ],
        },
      ],
      deliverables: [
        { status: 'done', name: 'Campañas de Google Ads', nameEn: 'Google Ads campaigns', desc: 'Creación de todas las campañas de Google Ads para las certificaciones.', descEn: 'Creation of all the Google Ads campaigns for the certifications.' },
        {
          status: 'done', name: 'Mystery shopping de SMETA', nameEn: 'SMETA mystery shopping', desc: '21/9: benchmarking de organismos certificadores que ofrecen SMETA (valor de la auditoría, cotización por día o total, formulario de aplicación, alcance de la oferta, material del programa, auditoría remota). Se contactaron 11 y respondieron 6; la tasa de respuesta fue la más baja por el nivel de detalle pedido.', descEn: '9/21: benchmarking of certification bodies offering SMETA (audit price, per-day or total quote, application form, scope of the offer, programme materials, remote audit). 11 were contacted and 6 replied; the response rate was the lowest because of the level of detail requested.',
          links: [{ label: 'Investigación SMETA', labelEn: 'SMETA research', url: 'https://pcugroup.sharepoint.com/:f:/r/sites/CommunicationsLATAM/Gedeelde%20documenten/General/000.Planes%20MarComms/CU%20-%20Certificaciones%20Argentina/Market%20Research/Smeta%20-%202026?d=wd1a3d06288544375bd6e43af13ff0859&csf=1&web=1&e=XRurLW' }],
        },
        {
          status: 'done', name: 'Mystery shopping de ISO 27001', nameEn: 'ISO 27001 mystery shopping', desc: '21/9: benchmarking de organismos certificadores que ofrecen ISO 27001 (valor, plazo de emisión del certificado, formulario de aplicación). Se contactaron 12 y respondieron 8: la tasa de respuesta fue alta porque se pedía menos información.', descEn: '9/21: benchmarking of certification bodies offering ISO 27001 (price, certificate issuance time, application form). 12 were contacted and 8 replied: the response rate was high because less information was requested.',
          links: [{ label: 'Investigación ISO 27001', labelEn: 'ISO 27001 research', url: 'https://pcugroup.sharepoint.com/:f:/r/sites/CommunicationsLATAM/Gedeelde%20documenten/General/000.Planes%20MarComms/CU%20-%20Certificaciones%20Argentina/Market%20Research/ISO%2027001%20%E2%80%93%202026?d=wcc5890dde7834abfaf048af62a3bbf22&csf=1&web=1&e=n11MGZ' }],
        },
        {
          status: 'done', name: 'Mystery shopping de ISCC', nameEn: 'ISCC mystery shopping', desc: '21/9: benchmarking de organismos certificadores que ofrecen ISCC EU (valor de la auditoría, manejo de las fees de ISCC, plazo de emisión, auditores propios o freelance). Se contactaron 6 y respondieron 4: la oferta es más limitada y con foco principalmente europeo.', descEn: '9/21: benchmarking of certification bodies offering ISCC EU (audit price, handling of ISCC fees, issuance time, in-house or freelance auditors). 6 were contacted and 4 replied: the offering is more limited and mainly focused on Europe.',
          links: [{ label: 'Investigación ISCC', labelEn: 'ISCC research', url: 'https://pcugroup.sharepoint.com/:f:/r/sites/CommunicationsLATAM/Gedeelde%20documenten/General/000.Planes%20MarComms/CU%20-%20Certificaciones%20Argentina/Market%20Research/ISCC%20%E2%80%93%202026?d=wc5571a514a174ddaaa90996f7918bcf6&csf=1&web=1&e=f53BtB' }],
        },
        {
          status: 'done', name: 'Base de datos de la campaña GHG', nameEn: 'GHG campaign database', desc: '17/9: base de datos creada para la campaña de ads de GHG del Q4.', descEn: '9/17: database built for the Q4 GHG ads campaign.',
          links: [
            { label: 'Base GHG (1)', labelEn: 'GHG database (1)', url: 'https://share.gemini.google/wJ2cextk1cRb' },
            { label: 'Base GHG (2)', labelEn: 'GHG database (2)', url: 'https://share.gemini.google/sVCbi6127LHI' },
            { label: 'Base GHG (Excel)', labelEn: 'GHG database (Excel)', url: 'https://pcugroup-my.sharepoint.com/:x:/p/fsenorans/IQBgAnsD742oRpxpbc2tID0VAUm1DO3lPAufVIBQMfJO4sQ' },
          ],
        },
        { status: 'done', name: 'Reunión: investigaciones de mercado', nameEn: 'Meeting: market research', desc: '28/9: organización de las investigaciones de mercado.', descEn: '9/28: planning of the market research.' },
        { status: 'done', name: 'Reunión de catch-up', nameEn: 'Catch-up meeting', desc: '28/9: catch-up y organización.', descEn: '9/28: catch-up and planning.' },
        { status: 'done', name: 'Carga de la base en Paid Media', nameEn: 'Database upload to Paid Media', desc: '28/9: carga de la base de datos en las plataformas de Paid Media.', descEn: '9/28: database uploaded to the Paid Media platforms.' },
        { status: 'progress', name: 'Newsletter recurrente', nameEn: 'Recurring newsletter', desc: 'Newsletter recurrente en preparación.', descEn: 'Recurring newsletter in preparation.' },
        { status: 'progress', name: 'Contenidos y campaña GHG', nameEn: 'GHG content and campaign', desc: 'Desde el 28/9: contenidos y campaña de GHG.', descEn: 'Since 9/28: GHG content and campaign.' },
        { status: 'progress', name: 'Evento del 25/11 en el CPIA de General Roca', nameEn: 'November 25 event at CPIA General Roca', desc: 'Octubre: organización del evento.', descEn: 'October: event planning.' },
        { status: 'progress', name: 'Estrategia AEO', nameEn: 'AEO strategy', desc: 'Octubre (desde el 5/10): posicionamiento en motores de búsqueda de IA. Se armaron 4 prompts de PrimusGFS y USDA para ver si mencionan a Control Union.', descEn: 'October (since 10/5): positioning in AI search engines. 4 PrimusGFS and USDA prompts were built to check whether Control Union is mentioned.' },
        { status: 'progress', name: 'Apoyo en el evento de noviembre', nameEn: 'Support for the November event', desc: 'Octubre: apoyo en la organización del evento.', descEn: 'October: support with event planning.' },
        { status: 'pending', name: 'Mystery shopping de ISO 9001, 14001 y 45001', nameEn: 'ISO 9001, 14001 and 45001 mystery shopping', desc: 'Octubre: cotización y plazo de emisión del certificado de la competencia en estas normas.', descEn: 'October: competitors’ quotes and certificate issuance times for these standards.' },
        { status: 'pending', name: 'Mystery shopping de GLOBALG.A.P.', nameEn: 'GLOBALG.A.P. mystery shopping', desc: 'Octubre: cotización, plazo de emisión del certificado y add-ons de la competencia.', descEn: 'October: competitors’ quotes, certificate issuance times and add-ons.' },
      ],
      initiativeGroups: [],
    },
  },
};
