// ════════════════════════════════════════════════════════════════
//  SEED — Pilar Webinars. Reportes "mixtos" por evento: combinan
//  Livestorm (asistencia) + Mailchimp (campaña previa) + LinkedIn
//  (posteos orgánicos) + HubSpot (deals / hot leads).
//  Fuente: reporte de resultados del webinar (datos reales, nunca
//  estimados). Los campos que dependen de un input manual por evento
//  (duración total) pueden ser null → la vista no los inventa. El costo
//  de producción ya no se pide ni se muestra (16/9/2026); el campo queda
//  en el seed por si vuelve a hacer falta.
// ════════════════════════════════════════════════════════════════

// Botón «Link al pipeline»: SIEMPRE la vista general de deals de HubSpot
// (board). Desde el 16/9/2026 no se arma un link custom por evento.
export const HUBSPOT_PIPELINE_URL = 'https://app.hubspot.com/contacts/47081900/objects/0-3/views/all/board';

// Una cuenta por audiencia: los webinars en español para LATAM y los
// globales en inglés (base Américas + Europa) son series distintas.
export const WEBINAR_CLIENTS = [
  { id: 'cu', name: 'Control Union Latinoamérica' },
  { id: 'cug', name: 'Control Union Global' },
  { id: 'psi', name: 'Peterson Solutions Iberoamérica' },
];

// Metodología de scoring (doc "Metodología de Scoring de Leads en Webinars",
// vigente desde julio 2026): score 0-100 = Necesidad declarada (0-50) +
// Engagement en vivo (0-30, % asistencia × 30; replay completo = 15) +
// Interacción proactiva (0-20, encuestas + preguntas).
export const SCORING = {
  hotMin: 70,
  warmMin: 40,
  formula: [
    { name: 'Necesidad declarada', pts: '0 – 50', how: 'Respuestas de diagnóstico: ¿tiene el gap que resuelve el servicio? ¿pidió contacto? ¿en qué etapa de madurez está? Más intención explícita, más puntos.' },
    { name: 'Engagement en vivo', pts: '0 – 30', how: '% de asistencia real × 30 (ej: 80% = 24 pts). Replay completo sin asistir: 15 pts. Ninguna de las dos: 0.' },
    { name: 'Interacción proactiva', pts: '0 – 20', how: 'Encuestas respondidas + preguntas en el chat/Q&A durante la sesión.' },
  ],
  classes: [
    { name: 'Hot lead', range: '≥ 70', action: 'Contacto comercial directo esa misma semana. Lead calificado, no nurturing.' },
    { name: 'Warm lead', range: '40 – 69', action: 'Nurturing activo: casos de éxito, contenido de mitad de funnel, próximo webinar.' },
    { name: 'Cold', range: '< 40', action: 'Secuencia de nurturing larga / contenido educativo básico. No pasa a Ventas todavía.' },
  ],
};

export const WEBINARS_DB = {
  cu: {
    'wbn-iso14064': {
      title: 'Webinar ISO 14064 en Acción',
      tema: 'ISO 14064',
      subtitle: '«Validación y Verificación de Huella de Carbono»',
      date: '8 de julio de 2026',
      reagendado: true,
      idioma: 'Español',
      audiencia: 'Responsables de sostenibilidad/ESG y dirección — LATAM',
      canales: 'Email marketing (2 campañas / 7 envíos) + LinkedIn orgánico',
      serieEmails: ['ISO 14064 (2 envíos)', 'GHG ISO México (5 envíos)', 'Mismo webinar, campaña reagendada'],

      // ── Key insights ──
      registered: 51,
      attended: 30,
      showRate: 58.8,
      regCountries: 9, // países entre los registrados
      countries: [
        { name: 'Argentina', reg: null, att: 11 },
        { name: 'México', reg: null, att: 11 },
        { name: 'Estados Unidos', reg: null, att: 3 },
        { name: 'Colombia', reg: null, att: 2 },
        { name: 'Perú', reg: null, att: 2 },
        { name: 'Honduras', reg: null, att: 1 },
      ],
      companies: {
        unique: null, // dato no disponible en este evento (Livestorm sin export por empresa)
        featured: ['BBVA', 'Zucarmex', 'Rivermar (Honduras)', 'Redfishco', 'Caffenio', 'Bovis Project Management', 'Santomar', 'Expo Guadalajara', 'UNAL', 'La Molina'],
      },
      internos: { total: 6, attended: 5 },
      externos: { registered: 45, attended: 25 },
      deals: { total: 25, hot: 4, leads: 21 }, // 25 externos = 25 deals reales en HubSpot
      durationTotalMin: null, // lo pasa el equipo por evento
      durationAvgMin: 37.6,
      durationMedianMin: 47.4,
      engagement: { high: 19, mid: 5, low: 6 }, // ≥80% / 50-79% / <50% (de 30 asistentes)
      highlight:
        '19 de los 30 asistentes (63%) se quedaron más del 80% del webinar, a pesar del reagendamiento que le restó open rate a la campaña. De los 25 asistentes externos, solo 4 calificaron como hot leads — la muestra más chica y más exigente de la serie, sin ningún valor por defecto en el cálculo del score (Livestorm trajo el detalle completo por persona).',

      // ── Sección 1: Email Marketing ──
      email: {
        sends: [
          { name: '1. Invitación inicial', sent: 499, open: 30.1, click: 3.0 },
          { name: '2. Recordatorio', sent: 1722, open: 9.8, click: 1.5 },
          { name: '3. Reactivación', sent: 1361, open: 20.2, click: 2.2 },
          { name: '4. Aviso de nueva fecha', sent: 1340, open: 12.3, click: 0.9 },
          { name: '5. Recordatorio pre-webinar', sent: 1420, open: 34.8, click: 2.5 },
          { name: '6. Última convocatoria', sent: 1298, open: 25.0, click: 1.3 },
          { name: '7. Post-webinar (asistentes)', sent: 30, open: 20.0, click: 0.0 },
        ],
        totalSent: 7670,
        uniqueContacts: 3251,
        openedOnce: 914,
        openedOncePct: 28.1,
        clickedOnce: 99,
        clickedOncePct: 3.0,
        regFromEmail: 41,
        regFromEmailPct: 80,
        nota: 'El aviso de reagendamiento (Email 4) tuvo el open rate más bajo (12,3%), típico al anunciar un cambio de fecha — pero el recordatorio siguiente repuntó al 34,8%, el mejor de toda la secuencia.',
      },

      // ── Sección 2: Social Media (LinkedIn orgánico) ──
      social: {
        posts: [
          { name: 'Post 1', imp: 509, inter: 83, rate: 16.31, clicks: 67, ctr: 13.16, reactions: 14 },
          { name: 'Post 2', imp: 522, inter: 34, rate: 6.51, clicks: 27, ctr: 5.17, reactions: 7 },
          { name: 'Post 3', imp: 1851, inter: 67, rate: 3.62, clicks: 48, ctr: 2.59, reactions: 16 },
        ],
        totals: { imp: 2882, inter: 184, rate: 6.4, clicks: 142, ctr: 4.9, reactions: 37, shares: 5 },
        regFromSocial: 10,
        regFromSocialPct: 20,
        lectura:
          'El Post 1 tuvo 2,5-4,5x mejor tasa de interacción que los otros dos, a pesar de tener el menor alcance — mismo patrón que en webinars anteriores: los primeros posteos de lanzamiento llegan a audiencia más calificada.',
      },

      // ── Sección 3: Hot leads (HubSpot) ──
      hotLeads: {
        col3: 'Asistencia',
        rows: [
          { empresa: 'Zucarmex', pais: 'US', det: '100 %', score: 90.0, tier: 'HOT' },
          { empresa: 'Bovis Project Management', pais: 'MX', det: '100 %', score: 85.0, tier: 'HOT' },
          { empresa: 'Santomar', pais: 'MX', det: '100 %', score: 70.0, tier: 'HOT' },
          { empresa: 'Expo Guadalajara', pais: 'MX', det: '100 %', score: 70.0, tier: 'HOT' },
        ],
        universeNote:
          "Universo más amplio de seguimiento: 7 de 20 respuestas a '¿te gustaría que te contactemos?' fueron Sí — vale la pena que Ventas revise esa lista completa además de estos 4.",
        pipelineUrl: HUBSPOT_PIPELINE_URL,
        scoreNote: 'Score ≥70. Muestra chica, pero filtrada sin defaults: Livestorm trajo el detalle completo por persona.',
      },

      // ── Diagnóstico de madurez (encuestas en vivo) ──
      surveys: [
        { q: '¿Te gustaría que te contactemos?', n: 20, items: [['No por el momento', 65], ['Sí', 35]] },
        { q: '¿En qué punto está tu organización con GHG?', n: 26, items: [['Empezando a conocer el tema', 31], ['Ya calculamos internamente', 27], ['No estoy seguro/a', 23], ['Ya lo conocemos, sin medir', 8], ['Combinado / más avanzado', 11]] },
        { q: '¿Desde qué tipo de organización nos acompañás?', n: 21, items: [['Consultoría / ESG / ambiente', 43], ['Otro', 24], ['Productor / agroindustria', 14], ['Otros rubros (energía, industria, mixtos)', 19]] },
      ],

      // ── Oportunidad comercial (POTENCIAL, no certeza) ──
      commercial: {
        productionCost: 600, // USD — lo pasa el equipo por evento
        pipelinePotential: 145000,
        pipelinePotentialNote: '25 deals externos × ticket ponderado (10 pequeña / 10 mediana / 5 grande)',
        hotPipeline: 23200,
        hotPipelineNote: '4 hot leads (score ≥70) sobre el ticket promedio del webinar',
        closeLow: 9570,
        closeLowNote: 'conservador (5-15% tasa de cierre)',
        closeHigh: 17980,
        closeHighNote: 'optimista (10-25% tasa de cierre)',
        roi: '16x - 30x',
        metodologia:
          'Se excluyen los 5 asistentes internos (Control Union) porque no generan deals reales en HubSpot — solo los 25 externos cuentan como oportunidad. El ticket de ISO 14064 no sale de HubSpot: es un benchmark de mercado publicado para verificación GEI ($2.500 pequeña / $6.000 mediana / $12.000 grande, cavoenergias.com 2026). La tasa de cierre es un benchmark B2B general (Smartbound).',
      },

      // ── Plan de acción (solo vista interna) ──
      actionPlan: [
        '<strong>Activar los 4 hot leads esta semana.</strong> Zucarmex, Bovis Project Management, Santomar y Expo Guadalajara — asistencia 100% + necesidad declarada. Contacto directo.',
        '<strong>Reagendar con más margen la próxima vez.</strong> El aviso de nueva fecha (Email 4) tuvo el open rate más bajo de la serie (12,3%) — evaluar preavisos más largos o un canal adicional.',
        "<strong>Nutrir a los 6 'no estoy seguro/a' sobre GHG.</strong> Son un segmento de descubrimiento puro — contenido educativo básico antes de cualquier oferta comercial.",
        '<strong>Dar seguimiento a los 7 que pidieron contacto directo.</strong> Son la señal de intención más clara del webinar — conviene contactarlos aunque no todos superen el umbral de score.',
      ],
    },

    'wbn-eudr': {
      title: 'Webinar EUDR y Evidencia Verificable',
      tema: 'EUDR',
      subtitle: '«Certificaciones, tecnología y soluciones disponibles para la cadena de suministro»',
      date: '26 de agosto de 2026',
      reagendado: false,
      dateEn: 'August 26, 2026',
      idiomaEn: 'Spanish',
      idioma: 'Español',
      audiencia: 'Exportadores al mercado europeo (soja, café, cacao, palma, madera, ganado, caucho) — LATAM',
      audienciaEn: 'Exporters to the European market (soy, coffee, cocoa, palm, timber, cattle, rubber) — LATAM',
      canales: 'Email marketing (8 envíos) + LinkedIn orgánico (4 posteos) · Plataforma: Microsoft Teams',
      canalesEn: 'Email marketing (8 sends) + organic LinkedIn (4 posts) · Platform: Microsoft Teams',
      serieEmails: ['Emails 1-4 (26/8)', 'Email 5 post-webinar: registrados y participantes (31/8)', 'Base total: 4.966 contactos únicos'],
      serieEmailsEn: ['Emails 1-4 (Aug 26)', 'Email 5 post-webinar: registrants and participants (Aug 31)', 'Total base: 4,966 unique contacts'],

      // ── Key insights ──
      registered: 295,
      attended: 150,
      showRate: 50.8,
      regCountries: 27,
      // Registrados vs asistentes por país (top 10 por registros, externos).
      countries: [
        { name: 'Perú', reg: 63, att: 23 },
        { name: 'Ecuador', reg: 42, att: 10 },
        { name: 'Argentina', reg: 37, att: 20 },
        { name: 'Paraguay', reg: 27, att: 10 },
        { name: 'Colombia', reg: 25, att: 17 },
        { name: 'México', reg: 13, att: 10 },
        { name: 'Chile', reg: 8, att: 1 },
        { name: 'Guatemala', reg: 7, att: 3 },
        { name: 'Uruguay', reg: 4, att: 5 },
        { name: 'Honduras', reg: 4, att: 4 },
      ],
      companies: {
        unique: 87, // empresas únicas entre asistentes externos (213 entre registrados)
        uniqueNote: 'Entre asistentes externos · 213 entre los registrados',
        uniqueNoteEn: 'Among external attendees · 213 among registrants',
        // Destacadas = empresas de los hot y warm leads del evento.
        featured: ['Pantaleon S.A.', 'Ecom', 'Olam Agro Peru', 'Oleaginosas San Marcos', 'TEAM FOODS', 'INTEROC S.A.', 'LAR PY', 'Cooperativa Unicafec', 'Ochosur', 'Agroindustria Palmera San Roman', 'Asoc. de Productores Agroecológicos Origin Coffee Lab', 'Cacao de Colombia', 'COUSA', 'Daabon', 'Ecuadorcolat', 'Facultad de Ciencia y Tecnología — UADER', 'Funglode', 'PROSERIN', 'Productor de banano', 'Productor Aguacate Hass', 'Service Corp Trading', 'Universidad Nacional de Córdoba'],
        featuredNote: 'Empresas de los hot y warm leads del evento',
        featuredNoteEn: 'Companies from the event\'s hot and warm leads',
        others: ['ADM', 'ADM Paraguay', 'ALLPA SAC', 'AMAGGI', 'Amazonas Trading Perú', 'Arcos Dorados', 'Asoc. de Cacaoteros Tecnificados del Ucayali', 'Asoc. de Productores Agrarios Alto Kivinaki', 'Asociación Rural del Paraguay', 'Barry Callebaut', 'BioAp', 'Biocertus', 'Biomar', 'Biopa', 'Cafés de Especialidad de Chiapas', 'CAMSA', 'Cargill SACI', 'CARVIMSA', 'CEREGEO — UADER', 'Citrison', 'COFCO International Argentina', 'Colegio de Ing. Agrónomos de Santa Elena', 'Comercializadora Cumbres', 'COOPEAGRI R.L.', 'Dole Perú', 'Dos Beta', 'Dos Hermanos', 'El Recuerdo', 'Evid-AI', 'Farms Group', 'FSC México', 'Fundación Local Partners', 'INTA-FCA', 'Letis', 'MER Seafood Trading', 'Oleomex', 'Perfiles Coffee', 'PL Abogados', 'Proforest', 'ProTerra', 'PUMA by Regrow', 'Qualabs', 'SIMA', 'Smurfit Westrock', 'Solidaridad', 'Somax Agro', 'Terra Nostra Organics', 'UNOCACE', 'Yazoo Investment'],
      },
      internos: { total: 41, attended: 33 },
      externos: { registered: 254, attended: 117 },
      deals: {
        total: 27, // solo los priorizados por el scoring (hot + warm)
        hot: 1,
        warm: 26,
        note: '1 hot + 26 warm — deals priorizados por el scoring del evento.',
        noteEn: '1 hot + 26 warm — deals prioritized by the event scoring.',
      },
      durationTotalLabel: '48 min 11 s',
      durationAvgMin: 34.4,
      durationMedianMin: 40.2,
      engagement: { high: 78, mid: 25, low: 47 }, // sobre 48:11 de evento · 150 identificados
      highlight:
        '150 asistentes identificados de 295 registrados (50,8% de show rate) desde 27 países — el webinar más grande de la serie. El scoring del evento dejó 27 deals priorizados en HubSpot (1 hot + 26 warm) entre los 117 asistentes externos. La mediana de permanencia fue de 40 minutos sobre un evento de 48; el canal email alcanzó a 229 de los 295 registrados (56 con clic rastreado en la campaña).',
      highlightEn:
        '150 identified attendees out of 295 registrants (50.8% show rate) from 27 countries — the largest webinar of the series. The event scoring left 27 prioritized deals in HubSpot (1 hot + 26 warm) among the 117 external attendees. Median attendance was 40 minutes over a 48-minute event; the email channel reached 229 of the 295 registrants (56 with a tracked campaign click).',

      // Scoring propio de este evento (Teams, sin encuestas de diagnóstico).
      scoring: {
        desc: '+3 asistió en vivo · +2 si estuvo >50 min / +1 si >30 min · +1 por cada interacción identificable (Q&A, cámara encendida, mano levantada, audio activado). Internos CU/Peterson excluidos.',
        descEn: '+3 attended live · +2 if >50 min / +1 if >30 min · +1 per identifiable interaction (Q&A, camera on, hand raised, audio on). CU/Peterson internal attendees excluded.',
        classes: [
          { name: 'Hot lead', range: '≥ 8', action: 'Contacto comercial directo esa misma semana.', actionEn: 'Direct sales contact that same week.' },
          { name: 'Warm lead', range: '5 – 7', action: 'Nurturing activo: casos de éxito, contenido de mitad de funnel, próximo webinar.', actionEn: 'Active nurturing: success stories, mid-funnel content, next webinar.' },
          { name: 'Cold', range: '< 5', action: 'Secuencia de nurturing larga / contenido educativo. No pasa a Ventas todavía.', actionEn: 'Long nurturing sequence / educational content. Not passed to Sales yet.' },
        ],
      },

      // ── Sección 1: Email Marketing ──
      email: {
        sends: [
          { name: '1. Invitación', sent: 2766, open: 18.5, click: 1.5 },
          { name: '2. Recordatorio', sent: 2675, open: 17.4, click: 1.1 },
          { name: '2b. Resend recordatorio', sent: 184, open: 22.3, click: 1.1 },
          { name: '2c. Resend — nueva BBDD', sent: 2018, open: 20.3, click: 0.7 },
          { name: '3. Reactivación', sent: 2666, open: 17.1, click: 2.0 },
          { name: '4. Última convocatoria', sent: 2657, open: 17.5, click: 1.9 },
          { name: '5a. Post-webinar (registrados)', sent: 117, open: 23.9, click: 7.7 },
          { name: '5b. Post-webinar (participantes)', sent: 79, open: 27.8, click: 3.8 },
        ],
        totalSent: 13162,
        sendNamesEn: ['1. Invitation', '2. Reminder', '2b. Reminder resend', '2c. Resend — new database', '3. Reactivation', '4. Last call', '5a. Post-webinar (registrants)', '5b. Post-webinar (participants)'],
        uniqueContacts: 4966,
        openedOnce: 1247,
        openedOncePct: 25.1,
        clickedOnce: 137,
        clickedOncePct: 2.8,
        regFromEmail: 56, // registrados con clic rastreado en la campaña (atribución directa)
        regFromEmailPct: 19,
        regFromEmailNote: 'Con clic rastreado en la campaña — atribución directa del canal',
        regFromEmailNoteEn: 'With a tracked campaign click — direct channel attribution',
        regOpened: 93, // registrados que abrieron al menos un email
        regInBase: 229, // registrados presentes en la base de la campaña
        regInBasePct: 78,
        nota: 'El mejor click rate llegó después del evento: el email post-webinar a registrados que no asistieron hizo 7,7% de clics (el replay como segunda oportunidad).',
        notaEn: 'The best click rate came after the event: the post-webinar email to registrants who did not attend reached 7.7% clicks (the replay as a second chance).',
        notaClics:
          'La atribución del canal se lee en capas: 56 registrados hicieron clic en algún email de la campaña (atribución directa — el piso), 93 abrieron al menos un email, y 229 de los 295 estaban en la base de contactos (el alcance del canal — no todos se registraron POR el email: pueden haber llegado por un link reenviado, LinkedIn o la URL directa, y Mailchimp además pierde clics que no puede rastrear). Los 66 restantes no estaban en la base: llegaron por otros canales.',
        notaClicsEn:
          'Channel attribution is read in layers: 56 registrants clicked a campaign email (direct attribution — the floor), 93 opened at least one email, and 229 of the 295 were in the contact base (the channel\'s reach — not everyone registered BECAUSE of the email: they may have come via a forwarded link, LinkedIn or the direct URL, and Mailchimp also misses clicks it cannot track). The remaining 66 were not in the base: they came through other channels.',
      },

      // ── Sección 2: Social Media (LinkedIn CU Latinoamérica) ──
      social: {
        posts: [
          { name: 'Post 1 · Evento (4/8)', imp: 1980, inter: 157, rate: 7.93, clicks: 110, ctr: 5.56, reactions: 38 },
          { name: 'Post 2 · Sectores EUDR', imp: 1228, inter: 71, rate: 5.78, clicks: 38, ctr: 3.09, reactions: 27 },
          { name: 'Post 3 · Prepararse para EUDR', imp: 1775, inter: 116, rate: 6.54, clicks: 65, ctr: 3.66, reactions: 39 },
          { name: 'Post 4 · «¡Es mañana!» (25/8)', imp: 1992, inter: 104, rate: 5.22, clicks: 69, ctr: 3.46, reactions: 30 },
        ],
        totals: { imp: 6975, inter: 448, rate: 6.4, clicks: 282, ctr: 4.0, reactions: 134, shares: 32 },
        regFromSocial: null, // sin atribución directa: el registro corrió por Teams (Livestorm sí la tendría)
        regFromSocialPct: null,
        regOutsideEmail: 66, // registrados que NO estaban en la base de emails → LinkedIn u otros canales
        regOutsideEmailPct: 22,
        postNamesEn: ['Post 1 · Event (Aug 4)', 'Post 2 · EUDR sectors', 'Post 3 · Getting ready for EUDR', 'Post 4 · "It\'s tomorrow!" (Aug 25)'],
        lectura:
          'El posteo del evento (4/8) fue el más efectivo: 7,93% de tasa de interacción y 5,56% de CTR — el público que agenda temprano es el más calificado. El «¡Es mañana!» del 25/8 logró el mayor alcance (1.992 impresiones) como empujón final. 66 de los 295 registros no estaban en la base de emails: LinkedIn es el origen más probable.',
        lecturaEn:
          'The event post (Aug 4) was the most effective: 7.93% interaction rate and 5.56% CTR — the audience that books early is the most qualified. The Aug 25 "It\'s tomorrow!" post got the biggest reach (1,992 impressions) as the final push. 66 of the 295 registrations were not in the email base: LinkedIn is the most likely origin.',
      },

      // ── Sección 3: Hot leads (scoring del evento) ──
      hotLeads: {
        col3: 'Permanencia',
        rows: [
          { empresa: 'Pantaleon S.A.', pais: 'Guatemala', det: '37,6 min', score: 9, tier: 'HOT' },
          { empresa: 'Asociación de Productores Agroecológicos', pais: 'Perú', det: '103,1 min', score: 6, tier: 'WARM' },
          { empresa: 'Ecom', pais: 'Ecuador', det: '56,4 min', score: 6, tier: 'WARM' },
          { empresa: 'Oleaginosas San Marcos S.A', pais: 'Colombia', det: '53,1 min', score: 6, tier: 'WARM' },
          { empresa: 'Funglode', pais: 'República Dominicana', det: '50,4 min', score: 6, tier: 'WARM' },
          { empresa: 'Productor Aguacate Hass', pais: 'México', det: '50,2 min', score: 6, tier: 'WARM' },
          { empresa: 'Service Corp Trading', pais: 'Argentina', det: '43,2 min', score: 6, tier: 'WARM' },
          { empresa: 'Olam Agro Peru SAC', pais: 'Perú', det: '40,2 min', score: 6, tier: 'WARM' },
          { empresa: 'Productor de banano', pais: 'Costa Rica', det: '98,4 min', score: 5, tier: 'WARM' },
          { empresa: 'Cooperativa Unicafec', pais: 'Perú', det: '95,3 min', score: 5, tier: 'WARM' },
          { empresa: 'Ecuadorcolat', pais: 'Ecuador', det: '73,5 min', score: 5, tier: 'WARM' },
          { empresa: 'LAR PY', pais: 'Paraguay', det: '59,3 min', score: 5, tier: 'WARM' },
          { empresa: 'INTEROC S.A.', pais: 'Ecuador', det: '53,4 min', score: 5, tier: 'WARM' },
          { empresa: 'TEAM FOODS', pais: 'Colombia', det: '51,9 min', score: 5, tier: 'WARM' },
          { empresa: 'Facultad de Ciencia y Tecnología — UADER', pais: 'Argentina', det: '50,8 min', score: 5, tier: 'WARM' },
          { empresa: 'Agroindustria Palmera San Roman', pais: 'Guatemala', det: '48,8 min', score: 5, tier: 'WARM' },
          { empresa: 'Ochosur', pais: 'Perú', det: '47,5 min', score: 5, tier: 'WARM' },
        ],
        rowsNote: '17 de los 27 leads priorizados (el resto de los warm, con score 5 y menor permanencia, está en el tracker completo).',
        pipelineUrl: HUBSPOT_PIPELINE_URL, // antes apuntaba a una vista custom del evento; se unificó el 16/9/2026
        scoreNote: 'Scoring propio del evento (Teams): HOT ≥ 8 · WARM 5-7. Detalle completo por persona, sin defaults.',
      },

      surveys: [], // este evento no corrió encuestas de diagnóstico en vivo

      // ── Oportunidad comercial (POTENCIAL, no certeza) ──
      commercial: {
        productionCost: 600,
        pipelinePotential: null, // pendiente: falta ticket promedio del servicio EUDR
        pipelinePotentialNote: null,
        hotPipeline: null,
        hotPipelineNote: null,
        closeLow: null,
        closeLowNote: null,
        closeHigh: null,
        closeHighNote: null,
        roi: null,
        metodologia:
          'Se excluyen los 33 asistentes internos (CU/Peterson) — solo los 117 externos cuentan como oportunidad. El scoring es el del evento (HOT ≥ 8, WARM 5-7), calculado con el detalle por persona de Microsoft Teams.',
        metodologiaEn:
          'The 33 internal attendees (CU/Peterson) are excluded — only the 117 external ones count as opportunity. The scoring is the event\'s own (HOT ≥ 8, WARM 5-7), computed with Microsoft Teams per-person detail.',
      },

      // ── Plan de acción (solo vista interna) ──
      actionPlan: [
        '<strong>Activar el hot lead esta semana.</strong> Pantaleon S.A. (Guatemala): score 9, 5 interacciones de Q&A y permanencia completa — contacto comercial directo.',
        '<strong>Trabajar los 26 warm en nurturing activo.</strong> Todos superaron los 30-50 minutos de permanencia; casos de éxito EUDR + invitación al próximo webinar.',
        '<strong>Revisar las 16 preguntas anónimas del Q&A.</strong> Quedaron fuera del scoring por no ser identificables, pero pueden contener intención de compra real.',
        '<strong>Definir el ticket promedio del servicio EUDR</strong> para poder proyectar el pipeline potencial de este webinar (la base de 27 leads ya está lista).',
        '<strong>Replicar la fórmula del posteo de evento.</strong> El post del 4/8 con formato «Evento de LinkedIn» duplicó el CTR del resto — usarlo como pieza central en el próximo webinar.',
      ],
      actionPlanEn: [
        '<strong>Activate the hot lead this week.</strong> Pantaleon S.A. (Guatemala): score 9, 5 Q&A interactions and full attendance — direct sales contact.',
        '<strong>Work the 26 warm leads with active nurturing.</strong> All stayed past the 30-50 minute mark; EUDR success stories + invitation to the next webinar.',
        '<strong>Review the 16 anonymous Q&A questions.</strong> They were left out of the scoring for not being identifiable, but they may contain real purchase intent.',
        '<strong>Define the average ticket for the EUDR service</strong> to be able to project this webinar\'s potential pipeline (the base of 27 leads is ready).',
        '<strong>Replicate the event-post formula.</strong> The Aug 4 post using the LinkedIn Event format doubled the CTR of the rest — use it as the centerpiece of the next webinar.',
      ],
    },
  },

  // ── Control Union Global: webinars en inglés con base de Américas + Europa ──
  cug: {
    'wbn-plastic': {
      title: 'Webinar The Future of Plastic Packaging',
      tema: 'Packaging plástico — regulación y certificación',
      temaEn: 'Plastic packaging — regulation and certification',
      subtitle: '«Preparing for the Future of Plastic Packaging»',
      date: '9 de septiembre de 2026',
      dateEn: 'September 9, 2026',
      reagendado: false,
      idioma: 'Inglés',
      idiomaEn: 'English',
      audiencia: 'Empresas de packaging plástico, marcas, recicladores y consultores — registrados de 48 países (Europa, Asia y Américas)',
      audienciaEn: 'Plastic packaging companies, brands, recyclers and consultants — registrants from 48 countries (Europe, Asia and the Americas)',
      canales: 'Email marketing (9 envíos: Emails 1-3 segmentados Américas / Europa, reenvío del Email 3 y post-webinar a asistentes) · Plataforma: Microsoft Teams · Partners: ALPLA, ISCC y RecyClass · LinkedIn: 4 posteos orgánicos en la página de Control Union España',
      canalesEn: 'Email marketing (9 sends: Emails 1-3 split Americas / Europe, an Email 3 resend and a post-webinar to attendees) · Platform: Microsoft Teams · Partners: ALPLA, ISCC and RecyClass · LinkedIn: 4 organic posts on the Control Union España page',
      serieEmails: ['Emails 1-3 segmentados Américas / Europa (+ reenvío del Email 3)', 'Post-webinar a asistentes (74 contactos)', 'Base total: 3,213 contactos únicos'.replace(',', '.')],
      serieEmailsEn: ['Emails 1-3 split Americas / Europe (+ Email 3 resend)', 'Post-webinar to attendees (74 contacts)', 'Total base: 3,213 unique contacts'],

      // ── Key insights (scripts/webinars/build_event.py sobre el Excel de lead scoring) ──
      registered: 163,
      attended: 72,
      showRate: 44.2,
      regCountries: 48,
      // Registrados vs asistentes por país (top 10 por registros, externos).
      countries: [
        { name: 'Bulgaria', reg: 11, att: 4 },
        { name: 'Chile', reg: 11, att: 5 },
        { name: 'Sri Lanka', reg: 10, att: 5 },
        { name: 'Pakistán', reg: 8, att: 2 },
        { name: 'Países Bajos', reg: 7, att: 4 },
        { name: 'Israel', reg: 6, att: 3 },
        { name: 'Alemania', reg: 6, att: 4 },
        { name: 'Bélgica', reg: 6, att: 4 },
        { name: 'España', reg: 6, att: 2 },
        { name: 'India', reg: 4, att: 1 },
      ],
      companies: {
        unique: 41, // empresas únicas entre asistentes externos
        uniqueNote: 'Entre asistentes externos (se excluyen CU/Peterson y los partners ALPLA, ISCC y RecyClass)',
        uniqueNoteEn: 'Among external attendees (CU/Peterson and the partners ALPLA, ISCC and RecyClass excluded)',
        // Destacadas = empresas de los hot y warm leads del evento.
        featured: ['Trinseo', 'AMB', 'Bolsius', 'Dole', 'Enitor Primo', 'Greentech S.A.', 'Nébih', 'Pakuote Ratu VsI', 'Printech Packages pvt Ltd', 'Publiambiente', 'Dole Food and Beverage group', 'TOTEME AB', 'SD Jivkov Lilov Neshev', 'Coca-Cola HBC', 'Estia Consulting', 'DE123239087', 'Jokey BG d.o.o.', 'ECOCERT GREENLIFE', 'Senior International Scientific, Regulatory & Strategic Consultant', 'Rpet', 'Kiwa', 'Avery Dennison', 'Balta Industries', 'deSter', 'Pantaleon S.A.', 'Nutrisco', 'Logoplaste Innovation Lab', 'Recycling Europe', 'Kolmar Group AG', 'LIBERTY MILLS LIMITED', 'Alcaliber S.A.', 'Fecc', 'Hayleys Aventura Pvt Ltd.', 'Silchron', 'Intersnack'],
        featuredNote: 'Empresas de los hot y warm leads del evento',
        featuredNoteEn: 'Companies from the event\'s hot and warm leads',
        others: ['cyclos', 'Bio Extracts (Pvt) Ltd', 'Consultant', 'Bio extracts Pvt Ltd', 'Qualitea Ceylon', 'Asian sciences research pvtltd'],
      },
      internos: { total: 41, attended: 19 }, // CU/Peterson + partners (ALPLA, ISCC, RecyClass)
      externos: { registered: 122, attended: 53 },
      deals: {
        total: 41, // solo los priorizados por el scoring (hot + warm)
        hot: 11,
        warm: 30,
        note: '11 hot + 30 warm — leads priorizados por el scoring del evento (externos).',
        noteEn: '11 hot + 30 warm — leads prioritized by the event scoring (external).',
      },
      durationTotalLabel: '1 h 44 min', // sesión completa en Teams (organizador conectado)
      durationAvgMin: 61.8, // tiempo conectado por asistente, tope 90 min (target del modelo)
      durationMedianMin: 72.1,
      engagement: { high: 36, mid: 15, low: 21 }, // ≥80% / 50-79% / <50% de los 90 min objetivo · 72 asistentes
      highlight:
        '72 asistentes identificados de 163 registrados (44,2% de show rate) desde 48 países — el primer webinar global en inglés de la serie. El scoring dejó 41 leads priorizados (11 hot + 30 warm) entre los 53 asistentes externos, y 36 de los 72 asistentes se quedaron más del 80% de los 90 minutos objetivo. La atribución del email es baja: 24 de los 163 registrados (15%) hicieron clic en la campaña y 92 (56%) no estaban en la base — el registro llegó mayormente por otros canales.',
      highlightEn:
        '72 identified attendees out of 163 registrants (44.2% show rate) from 48 countries — the first global, English-language webinar of the series. The scoring left 41 prioritized leads (11 hot + 30 warm) among the 53 external attendees, and 36 of the 72 attendees stayed past 80% of the 90-minute target. Email attribution is low: 24 of the 163 registrants (15%) clicked the campaign and 92 (56%) were not in the base — registration came mostly through other channels.',

      // Scoring propio de este evento (modelo del Excel de lead scoring del equipo).
      scoring: {
        desc: 'Registro 10 pts + asistencia 20 pts + tiempo conectado hasta 40 pts (minutos / 90 × 40) + pregunta en el Q&A 20 pts + reacciones y otras interacciones hasta 10 pts. Se excluyen Control Union/Peterson y los partners (ALPLA, ISCC, RecyClass).',
        descEn: 'Registration 10 pts + attendance 20 pts + time connected up to 40 pts (minutes / 90 × 40) + Q&A question 20 pts + reactions and other interactions up to 10 pts. Control Union/Peterson and the partners (ALPLA, ISCC, RecyClass) excluded.',
        classes: [
          { name: 'Hot lead', range: '≥ 70', action: 'Contacto comercial directo esa misma semana.', actionEn: 'Direct sales contact that same week.' },
          { name: 'Warm lead', range: '40 – 69,9', action: 'Nurturing activo: casos de éxito, contenido de mitad de funnel, replay y próximo webinar.', actionEn: 'Active nurturing: success stories, mid-funnel content, replay and next webinar.' },
          { name: 'Cold', range: '< 40', action: 'Secuencia de nurturing larga / contenido educativo. No pasa a Ventas todavía.', actionEn: 'Long nurturing sequence / educational content. Not passed to Sales yet.' },
        ],
      },

      // ── Sección 1: Email Marketing (exports de destinatarios de Mailchimp) ──
      email: {
        sends: [
          { name: 'Email 1 · Américas', sent: 2030, open: 15.8, click: 1.4 },
          { name: 'Email 1 · Europa', sent: 1116, open: 18.6, click: 1.6 },
          { name: 'Email 2 · Américas', sent: 1946, open: 15.4, click: 1.7 },
          { name: 'Email 2 · Europa', sent: 1073, open: 15.8, click: 1.6 },
          { name: 'Email 3 · Américas', sent: 1932, open: 17.0, click: 2.3 },
          { name: 'Email 3 · Europa', sent: 1065, open: 16.6, click: 1.3 },
          { name: 'Email 3 (reenvío) · Américas', sent: 1920, open: 13.2, click: 1.7 },
          { name: 'Email 3 (reenvío) · Europa', sent: 1057, open: 12.8, click: 1.3 },
          { name: 'Post-webinar · Asistentes', sent: 74, open: 59.5, click: 16.2 },
        ],
        totalSent: 12213,
        sendNamesEn: ['Email 1 · Americas', 'Email 1 · Europe', 'Email 2 · Americas', 'Email 2 · Europe', 'Email 3 · Americas', 'Email 3 · Europe', 'Email 3 (resend) · Americas', 'Email 3 (resend) · Europe', 'Post-webinar · Attendees'],
        uniqueContacts: 3213,
        openedOnce: 840,
        openedOncePct: 26.1,
        clickedOnce: 96,
        clickedOncePct: 3.0,
        regFromEmail: 24, // registrados con clic rastreado en la campaña (atribución directa)
        regFromEmailPct: 15,
        regFromEmailNote: 'Con clic rastreado en la campaña — atribución directa del canal',
        regFromEmailNoteEn: 'With a tracked campaign click — direct channel attribution',
        regOpened: 50, // registrados que abrieron al menos un email
        regInBase: 71, // registrados presentes en la base de la campaña
        regInBasePct: 44,
        nota: 'Los envíos previos rondaron el 13-19% de apertura con clics entre 1,3% y 2,3%: Europa abrió algo más que Américas en el Email 1 (18,6% vs 15,8%) pero el clic fue parejo. El reenvío del Email 3 sumó aperturas incrementales (13%) sin mejorar el clic. El post-webinar a asistentes fue, por lejos, el mejor envío: 59,5% de apertura y 16,2% de clics.',
        notaEn: 'The pre-event sends ran at 13-19% opens with 1.3-2.3% clicks: Europe opened a bit more than the Americas on Email 1 (18.6% vs 15.8%) but clicks were even. The Email 3 resend added incremental opens (13%) without lifting clicks. The post-webinar send to attendees was by far the best: 59.5% opens and 16.2% clicks.',
        notaClics:
          'La atribución del canal se lee en capas: 24 registrados hicieron clic en algún email de la campaña (atribución directa — el piso), 50 abrieron al menos un email, y 71 de los 163 estaban en la base de contactos (44%). Los otros 92 registrados (56%) llegaron por fuera de la base: LinkedIn, los partners del webinar u otros canales — el registro por Teams no trae atribución por canal.',
        notaClicsEn:
          'Channel attribution is read in layers: 24 registrants clicked a campaign email (direct attribution — the floor), 50 opened at least one email, and 71 of the 163 were in the contact base (44%). The other 92 registrants (56%) came from outside the base: LinkedIn, the webinar partners or other channels — Teams registration carries no per-channel attribution.',
      },

      // ── Sección 2: Social Media (LinkedIn Control Union España) ──
      // Fuente: capturas del panel «Rendimiento del anuncio» de LinkedIn tomadas
      // el 16/9/2026 (no hubo export). El Post 2 coincide con el post del webinar
      // del export mensual de CU España de agosto (3.311 impresiones al 31/8).
      social: {
        posts: [
          { name: 'Post 1 · «1 day to go» (8/9)', imp: 553, inter: 40, rate: 7.23, clicks: 17, ctr: 3.07, reactions: 18 },
          { name: 'Post 2 · «Is your business ready?» (agosto)', imp: 3423, inter: 252, rate: 7.36, clicks: 194, ctr: 5.67, reactions: 43 },
          { name: 'Post 3', imp: 542, inter: 51, rate: 9.41, clicks: 33, ctr: 6.09, reactions: 12 },
          { name: 'Post 4', imp: 368, inter: 27, rate: 7.34, clicks: 17, ctr: 4.62, reactions: 9 },
        ],
        totals: { imp: 4886, inter: 370, rate: 7.6, clicks: 261, ctr: 5.3, reactions: 82, shares: 20 },
        regFromSocial: null, // sin atribución directa: el registro corrió por Teams
        regFromSocialPct: null,
        regOutsideEmail: 92, // registrados que NO estaban en la base de emails → LinkedIn, partners u otros canales
        regOutsideEmailPct: 56,
        postNamesEn: ['Post 1 · "1 day to go" (Sep 8)', 'Post 2 · "Is your business ready?" (August)', 'Post 3', 'Post 4'],
        lectura:
          'Los 4 posteos orgánicos de Control Union España sumaron 4.886 impresiones y 261 clics (CTR 5,3%) con una tasa de interacción del 7,6%. El Post 2 («Is your business ready?», publicado en agosto) concentró el 70% del alcance (3.423 impresiones) y 194 de los 261 clics; el Post 3 fue el más eficiente (9,4% de interacción y 6,1% de CTR) con un alcance chico. El aviso «1 day to go» del 8/9 hizo 553 impresiones y 17 clics. No hay atribución individual (el registro corrió por Teams): 92 de los 163 registrados (56%) llegaron por fuera de la base de email, y LinkedIn y los partners (ALPLA, ISCC, RecyClass) son el origen más probable.',
        lecturaEn:
          'The 4 organic posts on Control Union España added up to 4,886 impressions and 261 clicks (5.3% CTR) with a 7.6% interaction rate. Post 2 ("Is your business ready?", published in August) took 70% of the reach (3,423 impressions) and 194 of the 261 clicks; Post 3 was the most efficient (9.4% interaction, 6.1% CTR) on a small reach. The "1 day to go" notice on Sep 8 did 553 impressions and 17 clicks. There is no individual attribution (registration ran through Teams): 92 of the 163 registrants (56%) came from outside the email base, and LinkedIn and the partners (ALPLA, ISCC, RecyClass) are the most likely origin.',
      },

      // ── Sección 3: leads priorizados (scoring del evento) ──
      hotLeads: {
        col3: 'Permanencia',
        rows: [
          { empresa: 'Trinseo', pais: 'Países Bajos', det: '87,5 min', score: 88.9, tier: 'HOT' },
          { empresa: '—', pais: 'Taiwán', det: '90,0 min', score: 70.0, tier: 'HOT' },
          { empresa: 'AMB', pais: 'Bulgaria', det: '90,0 min', score: 70.0, tier: 'HOT' },
          { empresa: 'Bolsius', pais: 'Países Bajos', det: '90,0 min', score: 70.0, tier: 'HOT' },
          { empresa: 'Dole', pais: 'Tailandia', det: '90,0 min', score: 70.0, tier: 'HOT' },
          { empresa: 'Enitor Primo', pais: 'Países Bajos', det: '90,0 min', score: 70.0, tier: 'HOT' },
          { empresa: 'Greentech S.A.', pais: 'Rumania', det: '90,0 min', score: 70.0, tier: 'HOT' },
          { empresa: 'Nébih', pais: 'Hungría', det: '90,0 min', score: 70.0, tier: 'HOT' },
          { empresa: 'Pakuote Ratu VsI', pais: 'Lituania', det: '90,0 min', score: 70.0, tier: 'HOT' },
          { empresa: 'Printech Packages pvt Ltd', pais: 'Pakistán', det: '90,0 min', score: 70.0, tier: 'HOT' },
          { empresa: 'Publiambiente', pais: 'Portugal', det: '90,0 min', score: 70.0, tier: 'HOT' },
          { empresa: 'Publiambiente', pais: 'Portugal', det: '89,7 min', score: 69.9, tier: 'WARM' },
          { empresa: 'Dole Food and Beverage group', pais: 'Tailandia', det: '89,5 min', score: 69.8, tier: 'WARM' },
          { empresa: 'TOTEME AB', pais: 'Suecia', det: '88,8 min', score: 69.5, tier: 'WARM' },
          { empresa: 'SD Jivkov Lilov Neshev', pais: 'Bulgaria', det: '88,7 min', score: 69.4, tier: 'WARM' },
          { empresa: 'Coca-Cola HBC', pais: 'Bulgaria', det: '88,5 min', score: 69.3, tier: 'WARM' },
          { empresa: 'Estia Consulting', pais: 'Israel', det: '88,5 min', score: 69.3, tier: 'WARM' },
          { empresa: 'DE123239087', pais: 'Alemania', det: '87,4 min', score: 68.8, tier: 'WARM' },
          { empresa: 'Jokey BG d.o.o.', pais: 'Serbia', det: '86,3 min', score: 68.4, tier: 'WARM' },
          { empresa: 'ECOCERT GREENLIFE', pais: 'Francia', det: '84,8 min', score: 67.7, tier: 'WARM' },
          { empresa: 'Senior International Scientific, Regulatory & Strategic Consultant', pais: 'Israel', det: '84,5 min', score: 67.6, tier: 'WARM' },
          { empresa: 'Rpet', pais: 'Israel', det: '83,3 min', score: 67.0, tier: 'WARM' },
          { empresa: 'Kiwa', pais: 'Países Bajos', det: '79,8 min', score: 65.5, tier: 'WARM' },
          { empresa: 'Avery Dennison', pais: 'Estados Unidos', det: '78,9 min', score: 65.1, tier: 'WARM' },
          { empresa: 'Balta Industries', pais: 'Bélgica', det: '70,8 min', score: 61.5, tier: 'WARM' },
          { empresa: '—', pais: 'Alemania', det: '68,5 min', score: 60.4, tier: 'WARM' },
          { empresa: 'deSter', pais: 'Bélgica', det: '67,0 min', score: 59.8, tier: 'WARM' },
          { empresa: 'Pantaleon S.A.', pais: 'Guatemala', det: '66,6 min', score: 59.6, tier: 'WARM' },
          { empresa: 'Nutrisco', pais: 'Chile', det: '62,5 min', score: 57.8, tier: 'WARM' },
          { empresa: 'Logoplaste Innovation Lab', pais: 'Portugal', det: '60,0 min', score: 56.7, tier: 'WARM' },
          { empresa: 'Recycling Europe', pais: 'Bélgica', det: '56,1 min', score: 54.9, tier: 'WARM' },
          { empresa: 'Kolmar Group AG', pais: 'Suiza', det: '51,0 min', score: 52.7, tier: 'WARM' },
          { empresa: 'LIBERTY MILLS LIMITED', pais: 'Pakistán', det: '50,5 min', score: 52.4, tier: 'WARM' },
          { empresa: 'Alcaliber S.A.', pais: 'España', det: '48,7 min', score: 51.6, tier: 'WARM' },
          { empresa: 'Fecc', pais: 'Bélgica', det: '46,9 min', score: 50.8, tier: 'WARM' },
          { empresa: '—', pais: 'Italia', det: '41,0 min', score: 48.2, tier: 'WARM' },
          { empresa: 'Hayleys Aventura Pvt Ltd.', pais: 'Sri Lanka', det: '36,9 min', score: 46.4, tier: 'WARM' },
          { empresa: 'Silchron', pais: 'Chile', det: '29,6 min', score: 43.2, tier: 'WARM' },
          { empresa: 'Intersnack', pais: 'Alemania', det: '29,3 min', score: 43.0, tier: 'WARM' },
          { empresa: '—', pais: 'Reino Unido', det: '25,8 min', score: 41.5, tier: 'WARM' },
          { empresa: '—', pais: 'Austria', det: '24,7 min', score: 41.0, tier: 'WARM' },
        ],
        pipelineUrl: HUBSPOT_PIPELINE_URL,
        scoreNote: 'Scoring del evento (Teams): HOT ≥ 70 · WARM 40-69,9. Permanencia = tiempo conectado sobre los 90 min objetivo (tope del modelo).',
        universeNote: 'Pregunta externa en el Q&A: Is ISCC also accredited for EN15343? (trinseo.com). Las otras 2 preguntas fueron internas (Control Union).',
        universeNoteEn: 'External Q&A question: Is ISCC also accredited for EN15343? (trinseo.com). The other 2 questions were internal (Control Union).',
      },

      surveys: [], // este evento no corrió encuestas de diagnóstico en vivo

      // ── Oportunidad comercial (POTENCIAL, no certeza) ──
      commercial: {
        productionCost: 600, // USD — lo pasó el equipo el 16/9/2026
        pipelinePotential: null, // proyección descartada (docs/DECISIONES.md §3)
        pipelinePotentialNote: null,
        hotPipeline: null,
        hotPipelineNote: null,
        closeLow: null,
        closeLowNote: null,
        closeHigh: null,
        closeHighNote: null,
        roi: null,
        metodologia:
          'Se excluyen los 41 contactos internos y de partners (Control Union/Peterson, ALPLA, ISCC y RecyClass): solo los 122 externos registrados y los 53 que asistieron cuentan como oportunidad. El scoring es el del evento (HOT ≥ 70, WARM 40-69,9), calculado con el detalle por persona de Microsoft Teams; el tiempo conectado se toma con tope de 90 minutos, el target del modelo.',
        metodologiaEn:
          'The 41 internal and partner contacts (Control Union/Peterson, ALPLA, ISCC and RecyClass) are excluded — only the 122 external registrants and the 53 who attended count as opportunity. The scoring is the event\'s own (HOT ≥ 70, WARM 40-69.9), computed with Microsoft Teams per-person detail; time connected is capped at 90 minutes, the model\'s target.',
      },

      // ── Plan de acción (solo vista interna) ──
      actionPlan: [
        '<strong>Activar los 11 hot leads esta semana.</strong> Diez de ellos se quedaron los 90 minutos completos; Trinseo (Países Bajos, score 88,9) además preguntó en el Q&A si ISCC está acreditado para EN 15343 — contacto comercial directo con la respuesta.',
        '<strong>Trabajar los 30 warm en nurturing activo.</strong> La mayoría superó los 45 minutos de permanencia: replay, casos de éxito de certificación de packaging (ISCC PLUS / RecyClass) e invitación al próximo webinar.',
        '<strong>Repetir el formato del Post 2 de LinkedIn</strong> («Is your business ready?»): concentró 3.423 de las 4.886 impresiones y 194 de los 261 clics de la serie. El aviso «1 day to go» rindió menos (553 impresiones): la convocatoria hay que empezarla antes.',
        '<strong>Replicar el post-webinar y extenderlo a los que no asistieron.</strong> Fue el mejor envío de la serie (59,5% de apertura, 16,2% de clics) pero solo llegó a 74 asistentes; los 91 registrados que no asistieron merecen el replay.',
        '<strong>Probar asunto y CTA distintos en vez de reenviar.</strong> El reenvío del Email 3 sumó aperturas (13%) pero no clics (1,3-1,7%): la segunda oportunidad tiene que ser otro mensaje, no el mismo.',
      ],
      actionPlanEn: [
        '<strong>Activate the 11 hot leads this week.</strong> Ten of them stayed the full 90 minutes; Trinseo (Netherlands, score 88.9) also asked in the Q&A whether ISCC is accredited for EN 15343 — direct sales contact with the answer.',
        '<strong>Work the 30 warm leads with active nurturing.</strong> Most stayed past 45 minutes: replay, packaging certification success stories (ISCC PLUS / RecyClass) and an invitation to the next webinar.',
        '<strong>Repeat the format of LinkedIn Post 2</strong> ("Is your business ready?"): it took 3,423 of the series\' 4,886 impressions and 194 of its 261 clicks. The "1 day to go" notice did less (553 impressions): the call-out has to start earlier.',
        '<strong>Replicate the post-webinar send and extend it to no-shows.</strong> It was the best send of the series (59.5% opens, 16.2% clicks) but only reached 74 attendees; the 91 registrants who did not attend deserve the replay.',
        '<strong>Test a different subject line and CTA instead of resending.</strong> The Email 3 resend added opens (13%) but no clicks (1.3-1.7%): the second chance has to be a different message, not the same one.',
      ],
    },
  },

  // ── Peterson Solutions Iberoamérica: webinars en español con la base de PS (Iberia + Américas) ──
  psi: {
    'wbn-empco': {
      title: 'Webinar EmpCo 2026',
      tema: 'Directiva EmpCo — afirmaciones ambientales demostrables y greenwashing',
      temaEn: 'EmpCo Directive — provable environmental claims and greenwashing',
      subtitle: '«¿Tu empresa dice que es sostenible? A partir de septiembre, deberá demostrarlo»',
      date: '10 de septiembre de 2026',
      dateEn: 'September 10, 2026',
      reagendado: false,
      idioma: 'Español',
      idiomaEn: 'Spanish',
      audiencia: 'Empresas de Iberoamérica que comunican atributos ambientales (bodegas, agroindustria, alimentos, energía, consultoras) — registrados de 18 países; entre los externos con país informado, Argentina concentra 66 de 95',
      audienciaEn: 'Ibero-American companies that communicate environmental attributes (wineries, agribusiness, food, energy, consultancies) — registrants from 18 countries; among external registrants with a country on file, Argentina accounts for 66 of 95',
      canales: 'Email marketing (7 envíos: Emails 1-4 a la base completa y post-webinar en tres versiones: base, asistentes y registrados) · Plataforma: Microsoft Teams · LinkedIn: 2 posteos con captura en Peterson Solutions Iberia & Americas',
      canalesEn: 'Email marketing (7 sends: Emails 1-4 to the full base and a post-webinar in three versions: base, attendees and registrants) · Platform: Microsoft Teams · LinkedIn: 2 posts with screenshots on Peterson Solutions Iberia & Americas',
      serieEmails: ['Emails 1-4 a la base completa (5.100-5.300 contactos cada uno)', 'Post-webinar en tres versiones: base completa, asistentes (64) y registrados (63)', 'Base total: 5.403 contactos únicos'],
      serieEmailsEn: ['Emails 1-4 to the full base (5,100-5,300 contacts each)', 'Post-webinar in three versions: full base, attendees (64) and registrants (63)', 'Total base: 5,403 unique contacts'],

      // ── Key insights (scripts/webinars/build_event.py sobre el Excel de lead scoring) ──
      registered: 202,
      attended: 120,
      showRate: 59.4,
      regCountries: 18,
      // Registrados vs asistentes por país (top 10 por registros, externos con país informado).
      countries: [
        { name: 'Argentina', reg: 66, att: 34 },
        { name: 'Chile', reg: 8, att: 2 },
        { name: 'Colombia', reg: 5, att: 4 },
        { name: 'México', reg: 3, att: 1 },
        { name: 'España', reg: 3, att: 2 },
        { name: 'Perú', reg: 3, att: 1 },
        { name: 'Uruguay', reg: 3, att: 0 },
        { name: 'El Salvador', reg: 2, att: 1 },
        { name: 'Reino Unido', reg: 1, att: 1 },
        { name: 'Estados Unidos', reg: 1, att: 1 },
      ],
      companies: {
        unique: 44, // empresas únicas entre asistentes externos
        uniqueNote: 'Entre asistentes externos (se excluyen los 18 contactos internos de Control Union / Peterson)',
        uniqueNoteEn: 'Among external attendees (the 18 internal Control Union / Peterson contacts excluded)',
        // Destacadas = empresas de los hot y warm leads del evento (tal como las escribió cada registrado).
        featured: ['Grupo Bimbo', 'Bio Vanda S.A.', 'WOFA', 'Ingeniería Ambiental Consultora', 'GRUPO COLOME S A', 'Domaine Bousquet', 'Bodega y Viñedos Mauricio Lorca SA', 'Finca Sophenia', 'Bodega Salentein SA', 'Bodegas Salentein', 'PAI S.A.', 'Seaboard Energías Renovables y Alimentos S.R.L.', 'AUSTIN POWDER ARGNETINA', 'DACAS', 'COFCO INTL', 'COFCO INTERNATIONAL ARGENTINA', 'COFCO INTERNATIONAL ARGENTINA S.A.', 'COFCO INTERNATIONAL', 'Patagonian Fruits S.A.', 'SAN MIGUEL', 'La Anonima', 'La Serenisima', 'Aris Mining', 'Just', 'Westons Cider', 'Just International LATAM', 'Bimbo QSR', 'Regrow', 'Bodegas Salentein SA', 'BIOETANOL RIO CUARTO SA', 'AIMPLAS', 'Cera', 'Buyatti SAICA', 'EcoEtika', 'Terratio', 'Agricola Cerro Prieto SA', 'IMCD Chile'],
        featuredNote: 'Empresas de los hot y warm leads del evento',
        featuredNoteEn: 'Companies from the event\'s hot and warm leads',
        others: ['Bunge', 'AMAGGI', 'Nutrisco Chile', 'Fundazucar', 'OLEGA'],
      },
      internos: { total: 18, attended: 14 }, // Control Union / Peterson
      externos: { registered: 184, attended: 106 },
      deals: {
        total: 94, // solo los priorizados por el scoring (hot + warm)
        hot: 5,
        warm: 89,
        note: '5 hot + 89 warm — leads priorizados por el scoring del evento (externos).',
        noteEn: '5 hot + 89 warm — leads prioritized by the event scoring (external).',
      },
      durationTotalLabel: '1 h 06 min', // sesión completa en Teams (organizador conectado)
      durationAvgMin: 39.3, // tiempo conectado por asistente, tope 70 min (target del modelo)
      durationMedianMin: 45.4,
      engagement: { high: 7, mid: 79, low: 34 }, // ≥80% / 50-79% / <50% de los 70 min objetivo · 120 asistentes
      highlight:
        '120 asistentes de 202 registrados (59,4% de show rate), 106 externos de 44 empresas — bodegas, agroindustria y alimentos, sobre todo de Argentina. El scoring dejó 94 leads priorizados (5 hot + 89 warm): la mayoría se quedó entre 45 y 60 de los 66 minutos de sesión, pero pocos llegaron al tope del modelo (7 con más del 80% de los 70 min objetivo). Grupo Bimbo y un contacto de catenazapata.com preguntaron en el Q&A.',
      highlightEn:
        '120 attendees out of 202 registrants (59.4% show rate), 106 external from 44 companies — wineries, agribusiness and food, mostly from Argentina. The scoring left 94 prioritized leads (5 hot + 89 warm): most stayed 45-60 of the 66-minute session, but few reached the model\'s cap (7 above 80% of the 70-minute target). Grupo Bimbo and a catenazapata.com contact asked questions in the Q&A.',

      // Scoring propio de este evento (modelo del Excel de lead scoring del equipo).
      scoring: {
        desc: 'Registro 10 pts + asistencia 20 pts + tiempo conectado hasta 40 pts (minutos / 70 × 40) + pregunta en el Q&A 20 pts + respuestas y discusiones hasta 10 pts (5 por interacción). Se excluyen los 18 contactos internos de Control Union / Peterson. HOT ≥ 70 · WARM 40-69,9.',
        descEn: 'Registration 10 pts + attendance 20 pts + time connected up to 40 pts (minutes / 70 × 40) + Q&A question 20 pts + replies and discussions up to 10 pts (5 per interaction). The 18 internal Control Union / Peterson contacts are excluded. HOT ≥ 70 · WARM 40-69.9.',
        classes: [
          { name: 'Hot lead', range: '≥ 70', action: 'Contacto comercial directo esa misma semana.', actionEn: 'Direct sales contact that same week.' },
          { name: 'Warm lead', range: '40 – 69,9', action: 'Nurturing activo: casos de éxito, contenido de mitad de funnel, replay y próximo webinar.', actionEn: 'Active nurturing: success stories, mid-funnel content, replay and the next webinar.' },
          { name: 'Cold', range: '< 40', action: 'Secuencia de nurturing larga / contenido educativo. No pasa a Ventas todavía.', actionEn: 'Long nurturing sequence / educational content. Not passed to Sales yet.' },
        ],
      },

      // ── Sección 1: Email Marketing (exports de destinatarios de Mailchimp) ──
      email: {
        sends: [
          { name: 'Email 1 · Invitación', sent: 5297, open: 16.8, click: 0.9 },
          { name: 'Email 2', sent: 5199, open: 19.5, click: 1.4 },
          { name: 'Email 3', sent: 5178, open: 18.1, click: 0.6 },
          { name: 'Email 4', sent: 5146, open: 18.5, click: 0.9 },
          { name: 'Post-webinar · Base completa', sent: 5125, open: 18.8, click: 0.7 },
          { name: 'Post-webinar · Asistentes', sent: 64, open: 39.1, click: 9.4 },
          { name: 'Post-webinar · Registrados', sent: 63, open: 19.0, click: 0.0 },
        ],
        totalSent: 26072,
        sendNamesEn: ['Email 1 · Invitation', 'Email 2', 'Email 3', 'Email 4', 'Post-webinar · Full base', 'Post-webinar · Attendees', 'Post-webinar · Registrants'],
        uniqueContacts: 5403,
        openedOnce: 1701,
        openedOncePct: 31.5,
        clickedOnce: 138,
        clickedOncePct: 2.6,
        regFromEmail: 27, // registrados con clic rastreado en la campaña (atribución directa)
        regFromEmailPct: 13,
        regFromEmailNote: 'Con clic rastreado en la campaña — atribución directa del canal',
        regFromEmailNoteEn: 'With a tracked campaign click — direct channel attribution',
        regOpened: 55, // registrados que abrieron al menos un email
        regInBase: 127, // registrados presentes en la base de la campaña
        regInBasePct: 63,
        nota: 'Los cuatro envíos previos a la base completa rindieron parejo: 16,8-19,5% de apertura y 0,6-1,4% de clics, con el Email 2 como el mejor (19,5% / 1,4%). El post-webinar a asistentes fue el de mejor respuesta de la serie (39,1% de apertura, 9,4% de clics); el enviado a los 63 registrados abrió 19% sin ningún clic. Los exports de destinatarios no traen el asunto de cada envío.',
        notaEn: 'The four pre-event sends to the full base performed evenly: 16.8-19.5% opens and 0.6-1.4% clicks, with Email 2 the best (19.5% / 1.4%). The post-webinar to attendees got the best response of the series (39.1% opens, 9.4% clicks); the one sent to the 63 registrants opened at 19% with no clicks at all. The recipient exports do not carry each send\'s subject line.',
        notaClics:
          'La atribución del canal se lee en capas: 27 registrados hicieron clic en algún email de la campaña (atribución directa — el piso), 55 abrieron al menos un email, y 127 de los 202 estaban en la base de contactos (63%). Los otros 75 registrados (37%) llegaron por fuera de la base: LinkedIn u otros canales — el registro por Teams no trae atribución por canal.',
        notaClicsEn:
          'Channel attribution is read in layers: 27 registrants clicked a campaign email (direct attribution — the floor), 55 opened at least one email, and 127 of the 202 were in the contact base (63%). The other 75 registrants (37%) came from outside the base: LinkedIn or other channels — Teams registration carries no per-channel attribution.',
      },

      // ── Sección 2: Social Media (LinkedIn Peterson Solutions Iberia & Americas) ──
      // Fuente: capturas del panel «Rendimiento del anuncio» enviadas por el
      // equipo el 16/9/2026. El Post 1 (video) coincide con el post
      // «#PetersonSolutionsArgentina #Webinar #EmpCo» del export mensual de
      // agosto de la página (1.242 impresiones al 31/8). Ese mismo export lista
      // otros dos posteos del evento (video de 1.236 impresiones y orgánico de
      // 1.172 al 31/8) sin captura actualizada: no se suman acá.
      social: {
        posts: [
          { name: 'Post 1 · Video «#Webinar #EmpCo» (agosto)', imp: 1265, inter: 113, rate: 8.93, clicks: 62, ctr: 4.9, reactions: 43 },
          { name: 'Post 2 · «¿Tu empresa dice que es sostenible?»', imp: 793, inter: 43, rate: 5.42, clicks: 27, ctr: 3.4, reactions: 12 },
        ],
        totals: { imp: 2058, inter: 156, rate: 7.6, clicks: 89, ctr: 4.3, reactions: 55, shares: 8 },
        videoViews: 513, // visualizaciones del video del Post 1
        regFromSocial: null, // sin atribución directa: el registro corrió por Teams
        regFromSocialPct: null,
        regOutsideEmail: 75, // registrados que NO estaban en la base de emails → LinkedIn u otros canales
        regOutsideEmailPct: 37,
        postNamesEn: ['Post 1 · Video "#Webinar #EmpCo" (August)', 'Post 2 · "Does your company say it is sustainable?"'],
        lectura:
          'Dos posteos de Peterson Solutions Iberia & Americas con captura: el video del webinar (1.265 impresiones, 513 visualizaciones, 62 clics y 8,9% de interacción) y el aviso «¿Tu empresa dice que es sostenible?» (793 impresiones, 27 clics, 5,4%). El export mensual de agosto de la página muestra otros dos posteos del evento (un video con 1.236 impresiones y un post orgánico con 1.172 al 31/8) que no tienen captura actualizada y no se suman acá. No hay atribución individual: 75 de los 202 registrados (37%) no estaban en la base de email.',
        lecturaEn:
          'Two posts on Peterson Solutions Iberia & Americas with screenshots: the webinar video (1,265 impressions, 513 views, 62 clicks and 8.9% interaction) and the "Does your company say it is sustainable?" notice (793 impressions, 27 clicks, 5.4%). The page\'s August monthly export shows two more posts for the event (a video with 1,236 impressions and an organic post with 1,172 as of Aug 31) with no updated screenshot, so they are not added here. There is no individual attribution: 75 of the 202 registrants (37%) were not in the email base.',
      },

      // ── Sección 3: Leads priorizados (scoring del evento) ──
      // Sin «Organization» en el Excel se muestra el dominio del email corporativo
      // (dato real del export); los proveedores genéricos quedan en «—».
      hotLeads: {
        col3: 'Permanencia',
        rows: [
          { empresa: 'Grupo Bimbo', pais: 'México', det: '47,5 min', score: 77.1, tier: 'HOT' },
          { empresa: 'catenazapata.com', pais: '—', det: '41,4 min', score: 73.6, tier: 'HOT' },
          { empresa: '—', pais: '—', det: '70,0 min', score: 70.0, tier: 'HOT' },
          { empresa: 'familiazuccardi.com', pais: '—', det: '70,0 min', score: 70.0, tier: 'HOT' },
          { empresa: 'Bio Vanda S.A.', pais: 'Argentina', det: '70,0 min', score: 70.0, tier: 'HOT' },
          { empresa: 'grupocolome.com', pais: '—', det: '58,4 min', score: 63.4, tier: 'WARM' },
          { empresa: 'WOFA', pais: 'Argentina', det: '58,0 min', score: 63.1, tier: 'WARM' },
          { empresa: 'Ingeniería Ambiental Consultora', pais: 'Argentina', det: '56,8 min', score: 62.5, tier: 'WARM' },
          { empresa: '—', pais: '—', det: '56,0 min', score: 62.0, tier: 'WARM' },
          { empresa: 'mendozavineyards.com', pais: '—', det: '54,2 min', score: 61.0, tier: 'WARM' },
          { empresa: '—', pais: '—', det: '52,6 min', score: 60.1, tier: 'WARM' },
          { empresa: '—', pais: '—', det: '52,6 min', score: 60.1, tier: 'WARM' },
          { empresa: 'ojodeagua.global', pais: '—', det: '52,0 min', score: 59.7, tier: 'WARM' },
          { empresa: 'GRUPO COLOME S A', pais: 'Argentina', det: '51,9 min', score: 59.6, tier: 'WARM' },
          { empresa: 'trivento.com', pais: '—', det: '51,2 min', score: 59.3, tier: 'WARM' },
          { empresa: 'Domaine Bousquet', pais: 'Argentina', det: '50,9 min', score: 59.1, tier: 'WARM' },
          { empresa: 'mendozavineyards.com', pais: '—', det: '50,6 min', score: 58.9, tier: 'WARM' },
          { empresa: '—', pais: '—', det: '50,3 min', score: 58.8, tier: 'WARM' },
          { empresa: 'Bodega y Viñedos Mauricio Lorca SA', pais: 'Argentina', det: '49,5 min', score: 58.3, tier: 'WARM' },
          { empresa: 'Finca Sophenia', pais: 'Argentina', det: '49,6 min', score: 58.3, tier: 'WARM' },
          { empresa: 'achaval-ferrer.com', pais: '—', det: '49,2 min', score: 58.1, tier: 'WARM' },
          { empresa: 'Bodega Salentein SA', pais: 'Argentina', det: '49,2 min', score: 58.1, tier: 'WARM' },
          { empresa: 'Bodegas Salentein', pais: 'Argentina', det: '49,0 min', score: 58.0, tier: 'WARM' },
          { empresa: 'grupocolome.com', pais: '—', det: '48,8 min', score: 57.9, tier: 'WARM' },
          { empresa: 'catenazapata.com', pais: '—', det: '48,6 min', score: 57.8, tier: 'WARM' },
          { empresa: 'PAI S.A.', pais: 'Argentina', det: '48,4 min', score: 57.7, tier: 'WARM' },
          { empresa: 'grupoavinea.com', pais: '—', det: '48,2 min', score: 57.6, tier: 'WARM' },
          { empresa: 'bodegasbianchi.com.ar', pais: '—', det: '48,2 min', score: 57.5, tier: 'WARM' },
          { empresa: 'Seaboard Energías Renovables y Alimentos S.R.L.', pais: 'Argentina', det: '48,0 min', score: 57.5, tier: 'WARM' },
          { empresa: 'AUSTIN POWDER ARGNETINA', pais: 'Argentina', det: '48,0 min', score: 57.4, tier: 'WARM' },
          { empresa: 'lagarde.com.ar', pais: '—', det: '47,8 min', score: 57.3, tier: 'WARM' },
          { empresa: 'DACAS', pais: 'Argentina', det: '47,8 min', score: 57.3, tier: 'WARM' },
          { empresa: 'chakanawines.com.ar', pais: '—', det: '47,6 min', score: 57.2, tier: 'WARM' },
          { empresa: 'grupoavinea.com', pais: '—', det: '47,6 min', score: 57.2, tier: 'WARM' },
          { empresa: 'tresvins.dk', pais: '—', det: '47,7 min', score: 57.2, tier: 'WARM' },
          { empresa: 'rutiniwines.com', pais: '—', det: '47,5 min', score: 57.2, tier: 'WARM' },
          { empresa: 'COFCO INTL', pais: 'Argentina', det: '47,6 min', score: 57.2, tier: 'WARM' },
          { empresa: 'Domaine Bousquet', pais: 'Argentina', det: '47,6 min', score: 57.2, tier: 'WARM' },
          { empresa: 'terrazasdelosandes.com.ar', pais: '—', det: '47,5 min', score: 57.1, tier: 'WARM' },
          { empresa: 'catenazapata.com', pais: '—', det: '47,4 min', score: 57.1, tier: 'WARM' },
          { empresa: '—', pais: 'España', det: '47,2 min', score: 57.0, tier: 'WARM' },
          { empresa: 'COFCO INTERNATIONAL ARGENTINA', pais: 'Argentina', det: '47,1 min', score: 56.9, tier: 'WARM' },
          { empresa: 'COFCO INTERNATIONAL ARGENTINA S.A.', pais: 'Argentina', det: '47,0 min', score: 56.9, tier: 'WARM' },
          { empresa: 'COFCO INTERNATIONAL', pais: 'Argentina', det: '46,9 min', score: 56.8, tier: 'WARM' },
          { empresa: 'Patagonian Fruits S.A.', pais: 'Argentina', det: '46,9 min', score: 56.8, tier: 'WARM' },
          { empresa: 'SAN MIGUEL', pais: 'Argentina', det: '46,8 min', score: 56.8, tier: 'WARM' },
          { empresa: 'rutiniwines.com', pais: '—', det: '46,7 min', score: 56.7, tier: 'WARM' },
          { empresa: 'La Anonima', pais: 'Argentina', det: '46,8 min', score: 56.7, tier: 'WARM' },
          { empresa: 'La Serenisima', pais: 'Argentina', det: '46,7 min', score: 56.7, tier: 'WARM' },
          { empresa: 'COFCO International Argentina', pais: 'Argentina', det: '46,5 min', score: 56.6, tier: 'WARM' },
          { empresa: 'liafcontrol.com', pais: '—', det: '46,3 min', score: 56.5, tier: 'WARM' },
          { empresa: '—', pais: '—', det: '46,4 min', score: 56.5, tier: 'WARM' },
          { empresa: 'Aris Mining', pais: 'Colombia', det: '46,3 min', score: 56.4, tier: 'WARM' },
          { empresa: 'chandon.com.ar', pais: '—', det: '45,8 min', score: 56.2, tier: 'WARM' },
          { empresa: 'Aris Mining', pais: 'Colombia', det: '45,7 min', score: 56.1, tier: 'WARM' },
          { empresa: '—', pais: '—', det: '45,4 min', score: 56.0, tier: 'WARM' },
          { empresa: 'lagarde.com.ar', pais: '—', det: '45,4 min', score: 55.9, tier: 'WARM' },
          { empresa: 'Just', pais: 'Argentina', det: '45,4 min', score: 55.9, tier: 'WARM' },
          { empresa: 'terrazasdelosandes.com.ar', pais: '—', det: '45,2 min', score: 55.8, tier: 'WARM' },
          { empresa: 'Westons Cider', pais: 'Reino Unido', det: '44,7 min', score: 55.5, tier: 'WARM' },
          { empresa: 'Just International LATAM', pais: 'Argentina', det: '44,4 min', score: 55.4, tier: 'WARM' },
          { empresa: 'luigibosca.com', pais: '—', det: '44,2 min', score: 55.3, tier: 'WARM' },
          { empresa: 'antigal.com', pais: '—', det: '44,2 min', score: 55.2, tier: 'WARM' },
          { empresa: 'Aris Mining', pais: 'Colombia', det: '43,8 min', score: 55.0, tier: 'WARM' },
          { empresa: 'decero.com', pais: '—', det: '43,3 min', score: 54.8, tier: 'WARM' },
          { empresa: 'familiazuccardi.com', pais: '—', det: '42,8 min', score: 54.4, tier: 'WARM' },
          { empresa: 'inti.gob.ar', pais: '—', det: '42,4 min', score: 54.2, tier: 'WARM' },
          { empresa: 'winesofargentina.com', pais: '—', det: '42,3 min', score: 54.2, tier: 'WARM' },
          { empresa: 'Bimbo QSR', pais: 'Estados Unidos', det: '41,6 min', score: 53.8, tier: 'WARM' },
          { empresa: 'Regrow', pais: 'Argentina', det: '40,9 min', score: 53.4, tier: 'WARM' },
          { empresa: 'familiazuccardi.com', pais: '—', det: '40,5 min', score: 53.1, tier: 'WARM' },
          { empresa: 'pulentaestate.com', pais: '—', det: '39,2 min', score: 52.4, tier: 'WARM' },
          { empresa: 'casayague.com', pais: '—', det: '38,7 min', score: 52.1, tier: 'WARM' },
          { empresa: '—', pais: '—', det: '38,3 min', score: 51.9, tier: 'WARM' },
          { empresa: 'Bodegas Salentein SA', pais: 'Argentina', det: '38,2 min', score: 51.8, tier: 'WARM' },
          { empresa: 'BIOETANOL RIO CUARTO SA', pais: 'Argentina', det: '36,6 min', score: 50.9, tier: 'WARM' },
          { empresa: 'AIMPLAS', pais: 'España', det: '36,4 min', score: 50.8, tier: 'WARM' },
          { empresa: 'inti.gob.ar', pais: '—', det: '34,7 min', score: 49.8, tier: 'WARM' },
          { empresa: 'Cera', pais: 'Argentina', det: '34,3 min', score: 49.6, tier: 'WARM' },
          { empresa: 'Buyatti SAICA', pais: 'Argentina', det: '33,5 min', score: 49.1, tier: 'WARM' },
          { empresa: 'bodegafosterlorca.com', pais: '—', det: '32,6 min', score: 48.6, tier: 'WARM' },
          { empresa: 'coopsve.com', pais: '—', det: '31,7 min', score: 48.1, tier: 'WARM' },
          { empresa: 'norton.com.ar', pais: '—', det: '29,8 min', score: 47.0, tier: 'WARM' },
          { empresa: 'salentein.com', pais: '—', det: '28,5 min', score: 46.3, tier: 'WARM' },
          { empresa: 'EcoEtika', pais: 'Argentina', det: '28,1 min', score: 46.1, tier: 'WARM' },
          { empresa: 'blendswineestates.com', pais: '—', det: '26,4 min', score: 45.1, tier: 'WARM' },
          { empresa: 'masitupungato.com', pais: '—', det: '25,9 min', score: 44.8, tier: 'WARM' },
          { empresa: 'blendswineestates.com', pais: '—', det: '26,0 min', score: 44.8, tier: 'WARM' },
          { empresa: '—', pais: '—', det: '24,0 min', score: 43.7, tier: 'WARM' },
          { empresa: 'Terratio', pais: 'Argentina', det: '22,8 min', score: 43.0, tier: 'WARM' },
          { empresa: 'Agricola Cerro Prieto SA', pais: 'Perú', det: '22,4 min', score: 42.8, tier: 'WARM' },
          { empresa: 'bodegasfabre.com', pais: '—', det: '20,5 min', score: 41.7, tier: 'WARM' },
          { empresa: 'IMCD Chile', pais: 'Chile', det: '19,6 min', score: 41.2, tier: 'WARM' },
          { empresa: 'bywine.com.ar', pais: '—', det: '18,2 min', score: 40.4, tier: 'WARM' },
        ],
        pipelineUrl: HUBSPOT_PIPELINE_URL,
        scoreNote: 'Scoring del evento (Teams): HOT ≥ 70 · WARM 40-69,9. Permanencia = tiempo conectado sobre los 70 min objetivo (tope del modelo).',
        universeNote: 'Preguntas externas en el Q&A: Grupo Bimbo (si la ECGT aplica a comunicaciones publicadas antes de la entrada en vigor) y catenazapata.com (qué requisito debe cumplir el ente verificador para ser aceptado bajo EmpCo, y si la vigencia aplica por fecha de ingreso o por lote). Austin Powder abrió una discusión sobre el alcance geográfico de las comunicaciones de una empresa global.',
        universeNoteEn: 'External Q&A questions: Grupo Bimbo (whether the ECGT applies to communications published before it entered into force) and catenazapata.com (which requirement the verification body must meet to be accepted under EmpCo, and whether applicability goes by entry date or by batch). Austin Powder opened a discussion on the geographic scope of a global company\'s communications.',
      },

      surveys: [], // este evento no corrió encuestas de diagnóstico en vivo

      // ── Oportunidad comercial (POTENCIAL, no certeza) ──
      commercial: {
        productionCost: null, // no se pide ni se muestra (16/9/2026)
        pipelinePotential: null, // proyección descartada (docs/DECISIONES.md §3)
        pipelinePotentialNote: null,
        hotPipeline: null,
        hotPipelineNote: null,
        closeLow: null,
        closeLowNote: null,
        closeHigh: null,
        closeHighNote: null,
        roi: null,
        metodologia:
          'Se excluyen los 18 contactos internos (Control Union / Peterson): solo los 184 externos registrados y los 106 que asistieron cuentan como oportunidad. El scoring es el del evento (HOT ≥ 70, WARM 40-69,9), calculado con el detalle por persona de Microsoft Teams; el tiempo conectado se toma con tope de 70 minutos, el target del modelo.',
        metodologiaEn:
          'The 18 internal contacts (Control Union / Peterson) are excluded — only the 184 external registrants and the 106 who attended count as opportunity. The scoring is the event\'s own (HOT ≥ 70, WARM 40-69.9), computed with Microsoft Teams per-person detail; time connected is capped at 70 minutes, the model\'s target.',
      },

      // ── Plan de acción (solo vista interna) ──
      actionPlan: [
        '<strong>Activar los 5 hot leads esta semana.</strong> Grupo Bimbo (México, score 77,1) y el contacto de catenazapata.com (score 73,6) preguntaron en el Q&A; Bio Vanda y otros dos contactos se quedaron los 70 minutos completos.',
        '<strong>Trabajar los 89 warm por sector.</strong> Bodegas (Salentein, Domaine Bousquet, Finca Sophenia, Mauricio Lorca, Zuccardi), agroindustria y alimentos (COFCO, San Miguel, Patagonian Fruits, La Serenísima, La Anónima): replay, guía práctica de EmpCo / Green Claims y casos de afirmaciones ambientales verificadas.',
        '<strong>Pedir empresa y país como campos obligatorios en el próximo registro.</strong> 53 de los 94 leads priorizados no traen empresa ni país en el formulario de Teams: hoy solo se los identifica por el dominio del email.',
        '<strong>Repetir el formato de video en LinkedIn</strong> (8,9% de interacción y 513 visualizaciones) y conseguir las capturas de los otros dos posteos de agosto para cerrar la atribución del canal.',
        '<strong>Cambiar el post-webinar a los registrados que no asistieron.</strong> Abrió 19% sin ningún clic: mandar el replay con otro asunto y un solo CTA.',
      ],
      actionPlanEn: [
        '<strong>Activate the 5 hot leads this week.</strong> Grupo Bimbo (Mexico, score 77.1) and the catenazapata.com contact (score 73.6) asked questions in the Q&A; Bio Vanda and two other contacts stayed the full 70 minutes.',
        '<strong>Work the 89 warm leads by sector.</strong> Wineries (Salentein, Domaine Bousquet, Finca Sophenia, Mauricio Lorca, Zuccardi), agribusiness and food (COFCO, San Miguel, Patagonian Fruits, La Serenísima, La Anónima): replay, a practical EmpCo / Green Claims guide and cases of verified environmental claims.',
        '<strong>Make company and country mandatory fields at the next registration.</strong> 53 of the 94 prioritized leads have no company or country in the Teams form: today they can only be identified by their email domain.',
        '<strong>Repeat the video format on LinkedIn</strong> (8.9% interaction and 513 views) and get the screenshots of the other two August posts to close the channel attribution.',
        '<strong>Change the post-webinar for registrants who did not attend.</strong> It opened at 19% with no clicks: send the replay with a different subject line and a single CTA.',
      ],
    },
  },
};

export const WEBINAR_PERIODS = [
  // ISO 14064 oculto a pedido del equipo (los datos siguen en el seed):
  // { id: 'wbn-iso14064', label: 'Webinar ISO 14064 · Jul 2026' },
  { id: 'wbn-eudr', label: 'Webinar EUDR · Ago 2026' },
  { id: 'wbn-plastic', label: 'Webinar Plastic Packaging · Sep 2026' },
  { id: 'wbn-empco', label: 'Webinar EmpCo 2026 · Sep 2026' },
];
