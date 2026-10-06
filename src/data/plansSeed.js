// ════════════════════════════════════════════════════════════════
//  SEED — Vista PLANES. Informes mensuales de avance de los planes
//  regionales de marketing que MarComms presta a un cliente (hoy: el plan
//  de Control Union USA para el mercado orgánico, «Control Union North
//  America · Organic» en el informe del equipo).
//  Planes cargados: Control Union USA (mercado orgánico) y Peterson
//  Solutions Argentina (hoja «PS Argentina» del Excel de seguimiento).
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
            { value: '800', label: 'Contactos en la base comercial', labelEn: 'Database created · contacts', note: 'Top 5 estados USDA', noteEn: 'Top 5 USDA states' },
          ],
        },
        {
          name: 'Performance',
          nameEn: 'Performance',
          items: [
            { value: '848.160', valueEn: '848,160', unit: 'USD', label: 'Pipeline generado', labelEn: 'Pipeline generated', note: '20 % proveniente de bases de datos creadas con la Commercial Tool', noteEn: '20% from databases created with the Commercial Tool' },
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
  // octubre quedan para el informe de octubre. Las metas y resultados de los
  // objetivos (pipeline, MQL, revenue) están vacíos en la hoja: no se cargan.
  // Las dos tareas de septiembre sin fecha en la hoja son del 2/9 (base de
  // datos) y del 4/9 (comunicación), según el equipo.
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
        'Objetivo del plan: generar pipeline, MQLs y revenue para Peterson Solutions Argentina, con una estrategia puntual para los tres servicios prioritarios que defina el equipo comercial. En agosto presentamos el plan, pedimos la información comercial y financiera para dimensionar el pipeline y arrancamos la gestión del webinar de EmpCo. Las metas de pipeline, MQL y revenue todavía no están definidas en el plan.',
      introEn:
        'Plan objective: generate pipeline, MQLs and revenue for Peterson Solutions Argentina, with a focused strategy for the three priority services the sales team defines. In August we presented the plan, requested the commercial and financial data to size the pipeline, and started managing the EmpCo webinar. The pipeline, MQL and revenue targets have not been set in the plan yet.',
      summaryTitle: 'Resumen del mes',
      summaryTitleEn: 'Month at a glance',
      summary: ['3 entregables completados', 'Presentación del plan MarComms (12/8)', 'Pedido de información comercial y financiera (19/8)', 'Landing de registro del webinar EmpCo (10/8)'],
      summaryEn: ['3 deliverables completed', 'MarComms plan presentation (8/12)', 'Commercial and financial data request (8/19)', 'EmpCo webinar registration landing page (8/10)'],
      kpiGroups: [
        {
          name: 'Operativos',
          nameEn: 'Operational',
          items: [
            { value: '3', label: 'Entregables completados', labelEn: 'Deliverables completed' },
            { value: '2', label: 'Reuniones con el equipo', labelEn: 'Meetings with the team', note: '12/8 y 19/8', noteEn: '8/12 and 8/19' },
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
      ],
      initiativeGroups: [
        {
          name: 'Próximos pasos',
          nameEn: 'Next steps',
          items: [
            { name: 'Top 3 de servicios', nameEn: 'Top 3 services', desc: 'El equipo comercial define los tres servicios prioritarios, con drivers de mercado y ventajas competitivas, como insumo para contenidos, campañas, LinkedIn y web.', descEn: 'The sales team defines the three priority services, with market drivers and competitive advantages, as input for content, campaigns, LinkedIn and web.' },
            { name: 'Pipeline tentativo', nameEn: 'Tentative pipeline', desc: 'Con la información comercial y financiera de los servicios del budget, armar un pipeline tentativo por Revenue Growth Stream.', descEn: 'With the commercial and financial data on the budgeted services, build a tentative pipeline by Revenue Growth Stream.' },
            { name: 'Webinar EmpCo', nameEn: 'EmpCo webinar', desc: 'Gestión integral del webinar del 10/9: base de datos, comunicación por email y LinkedIn, y reporte.', descEn: 'End-to-end management of the 9/10 webinar: database, email and LinkedIn communication, and report.' },
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
        'Objetivo del plan: generar pipeline, MQLs y revenue para Peterson Solutions Argentina, con una estrategia puntual para los tres servicios prioritarios que defina el equipo comercial. En septiembre acompañamos la gestión integral del webinar de EmpCo, pusimos en marcha las campañas de Paid Media y armamos dos bases de datos. Foco del mes: analizar resultados y empezar a armar la estrategia 2027. Las metas de pipeline, MQL y revenue todavía no están definidas en el plan.',
      introEn:
        'Plan objective: generate pipeline, MQLs and revenue for Peterson Solutions Argentina, with a focused strategy for the three priority services the sales team defines. In September we supported the end-to-end management of the EmpCo webinar, launched the Paid Media campaigns and built two databases. Focus of the month: analyze results and start building the 2027 strategy. The pipeline, MQL and revenue targets have not been set in the plan yet.',
      summaryTitle: 'Resumen del mes',
      summaryTitleEn: 'Month at a glance',
      summary: ['7 entregables completados', 'Webinar EmpCo: 202 registros y 94 deals en HubSpot', '8 campañas de Paid Media en marcha', 'Próxima reunión de seguimiento: 13/10/2026'],
      summaryEn: ['7 deliverables completed', 'EmpCo webinar: 202 registrations and 94 deals in HubSpot', '8 Paid Media campaigns running', 'Next follow-up meeting: 10/13/2026'],
      kpiGroups: [
        {
          name: 'Operativos',
          nameEn: 'Operational',
          items: [
            { value: '7', label: 'Entregables completados', labelEn: 'Deliverables completed' },
            { value: '5.479', valueEn: '5,479', label: 'Contactos en bases creadas', labelEn: 'Contacts in databases built', note: '5.403 webinar EmpCo + 76 Ígaris', noteEn: '5,403 EmpCo webinar + 76 Ígaris' },
            { value: '8', label: 'Campañas de Paid Media', labelEn: 'Paid Media campaigns', note: 'SuSo, SuSe y Bioenergía', noteEn: 'SuSo, SuSe and Bioenergy' },
          ],
        },
        {
          name: 'Performance',
          nameEn: 'Performance',
          items: [
            { value: '94', label: 'Deals en HubSpot · webinar EmpCo', labelEn: 'Deals in HubSpot · EmpCo webinar', pill: '5 hot deals', pillEn: '5 hot deals' },
            { value: '202', label: 'Registros al webinar EmpCo', labelEn: 'EmpCo webinar registrations', pill: '120 asistentes', pillEn: '120 attendees' },
            { value: '1', label: 'Leads de Paid Media', labelEn: 'Paid Media leads' },
          ],
        },
      ],
      deliverables: [
        { status: 'done', name: 'Base de datos para la difusión del webinar', nameEn: 'Database for webinar promotion', desc: 'Base creada el 2/9: empresas de Iberoamérica que comunican atributos ambientales (bodegas, agroindustria, alimentos, energía, consultoras): 5.403 contactos únicos. Hubo registrados de 18 países; entre los externos con país informado, Argentina concentra 66 de 95.', descEn: 'Database built on 9/2: Ibero-American companies that communicate environmental attributes (wineries, agribusiness, food, energy, consultancies): 5,403 unique contacts. Registrants came from 18 countries; among external registrants with a stated country, Argentina accounts for 66 of 95.' },
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
};
