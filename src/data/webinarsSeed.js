// ════════════════════════════════════════════════════════════════
//  SEED — Pilar Webinars. Reportes "mixtos" por evento: combinan
//  Livestorm (asistencia) + Mailchimp (campaña previa) + LinkedIn
//  (posteos orgánicos) + HubSpot (deals / hot leads).
//  Fuente: reporte de resultados del webinar (datos reales, nunca
//  estimados). Los campos que dependen de un input manual por evento
//  (link al pipeline, costo de producción, duración total) pueden ser
//  null → la vista los muestra como pendientes, no los inventa.
// ════════════════════════════════════════════════════════════════

export const WEBINAR_CLIENTS = [{ id: 'cu', name: 'Control Union' }];

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
        pipelineUrl: null, // lo pasa el equipo por evento (link al pipeline de HubSpot)
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
      idioma: 'Español',
      audiencia: 'Exportadores al mercado europeo (soja, café, cacao, palma, madera, ganado, caucho) — LATAM',
      canales: 'Email marketing (8 envíos) + LinkedIn orgánico (4 posteos) · Plataforma: Microsoft Teams',
      serieEmails: ['Emails 1-4 (26/8)', 'Email 5 post-webinar: registrados y participantes (31/8)', 'Base total: 4.966 contactos únicos'],

      // ── Key insights ──
      registered: 295,
      attended: 150,
      attendedNote: '150 identificados vía Teams · +2 sin identificar',
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
        featured: ['Pantaleon S.A.', 'Ecom', 'Olam Agro Peru', 'Oleaginosas San Marcos', 'TEAM FOODS', 'INTEROC S.A.', 'LAR PY', 'Cooperativa Unicafec', 'Ochosur', 'Agroindustria Palmera San Roman'],
        others: ['ADM Paraguay', 'ALLPA SAC', 'AMAGGI', 'Amazonas Trading Perú', 'Arcos Dorados', 'Asoc. de Cacaoteros Tecnificados del Ucayali', 'Asoc. de Productores Agrarios Alto Kivinaki', 'Asoc. de Productores Agroecológicos Origin Coffee Lab', 'Asociación Rural del Paraguay', 'Barry Callebaut', 'BioAp', 'Biocertus', 'Biomar', 'Biopa', 'C.O.U.S.A.', 'Cacao de Colombia', 'Cafés de Especialidad de Chiapas', 'CAMSA', 'Cargill SACI', 'CARVIMSA', 'CEREGEO — UADER', 'Citrison', 'COFCO International Argentina', 'Colegio de Ing. Agrónomos de Santa Elena', 'Comercializadora Cumbres', 'COOPEAGRI R.L.', 'Daabon', 'Dole Perú', 'Dos Beta', 'Dos Hermanos', 'El Recuerdo', 'Evid-AI', 'Facultad de Ciencia y Tecnología — UADER', 'Farms Group', 'FSC México', 'Fundación Local Partners', 'Fundación Solidaridad', 'Funglode', 'INTA-FCA', 'Letis', 'MER Seafood Trading', 'Oleomex', 'Perfiles Coffee', 'PL Abogados', 'Proforest', 'PROSERIN', 'ProTerra', 'PUMA by Regrow', 'Qualabs', 'Service Corp Trading', 'SIMA', 'Smurfit Westrock', 'Solidaridad', 'Somax Agro', 'Terra Nostra Organics', 'Universidad Nacional de Córdoba', 'UNOCACE', 'Yazoo Investment'],
      },
      internos: { total: 41, attended: 33 },
      externos: { registered: 254, attended: 117 },
      deals: {
        total: 117, // todos los asistentes externos identificados generan deal
        hot: 1,
        warm: 26,
        cold: 90,
        leads: 116,
        note: '1 hot + 26 warm + 90 cold — cada asistente externo identificado genera un deal en HubSpot.',
      },
      durationTotalLabel: '48 min 11 s',
      durationAvgMin: 34.4,
      durationMedianMin: 40.2,
      engagement: { high: 78, mid: 25, low: 47 }, // sobre 48:11 de evento · 150 identificados
      highlight:
        '150 asistentes identificados de 295 registrados (50,8% de show rate) desde 27 países — el webinar más grande de la serie. Los 117 asistentes externos generan 117 deals en HubSpot, y el scoring del evento priorizó 27 (1 hot + 26 warm; el resto queda cold en nurturing). La mediana de permanencia fue de 40 minutos sobre un evento de 48, y la base de emails explica la mayor parte del registro: 229 de los 295 registrados estaban en la campaña de Mailchimp.',

      // Scoring propio de este evento (Teams, sin encuestas de diagnóstico).
      scoring: {
        desc: '+3 asistió en vivo · +2 si estuvo >50 min / +1 si >30 min · +1 por cada interacción identificable (Q&A, cámara encendida, mano levantada, audio activado). Internos CU/Peterson excluidos.',
        classes: [
          { name: 'Hot lead', range: '≥ 8', action: 'Contacto comercial directo esa misma semana.' },
          { name: 'Warm lead', range: '5 – 7', action: 'Nurturing activo: casos de éxito, contenido de mitad de funnel, próximo webinar.' },
          { name: 'Cold', range: '< 5', action: 'Secuencia de nurturing larga / contenido educativo. No pasa a Ventas todavía.' },
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
        uniqueContacts: 4966,
        openedOnce: 1247,
        openedOncePct: 25.1,
        clickedOnce: 137,
        clickedOncePct: 2.8,
        regFromEmail: 229,
        regFromEmailPct: 78,
        regFromEmailNote: 'Registrados presentes en la base de la campaña (229 de 295)',
        nota: 'El mejor click rate llegó después del evento: el email post-webinar a registrados que no asistieron hizo 7,7% de clics (el replay como segunda oportunidad). Los 66 registrados que no estaban en la base de emails llegaron por LinkedIn u otros canales.',
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
        regFromSocial: null, // LinkedIn no permite atribuir registros directamente en este evento
        regFromSocialPct: null,
        lectura:
          'El posteo del evento (4/8) fue el más efectivo: 7,93% de tasa de interacción y 5,56% de CTR — el público que agenda temprano es el más calificado. El «¡Es mañana!» del 25/8 logró el mayor alcance (1.992 impresiones) como empujón final. 66 de los 295 registros no estaban en la base de emails: LinkedIn es el origen más probable.',
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
        universeNote:
          '16 interacciones de Q&A anónimas quedaron excluidas del scoring por no ser identificables — si Comercial quiere, se pueden revisar aparte contra el chat del evento.',
        pipelineUrl: null, // pendiente: lo pasa el equipo
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
        pendingNote:
          'El pipeline potencial de este webinar se calcula cuando se defina el ticket promedio del servicio EUDR (benchmark de mercado o dato comercial). Con 27 leads priorizados sobre 117 asistentes externos, la base para el cálculo ya está lista.',
        metodologia:
          'Se excluyen los 33 asistentes internos (CU/Peterson) — solo los 117 externos cuentan como oportunidad. El scoring es el del evento (HOT ≥ 8, WARM 5-7), calculado con el detalle por persona de Microsoft Teams.',
      },

      // ── Plan de acción (solo vista interna) ──
      actionPlan: [
        '<strong>Activar el hot lead esta semana.</strong> Pantaleon S.A. (Guatemala): score 9, 5 interacciones de Q&A y permanencia completa — contacto comercial directo.',
        '<strong>Trabajar los 26 warm en nurturing activo.</strong> Todos superaron los 30-50 minutos de permanencia; casos de éxito EUDR + invitación al próximo webinar.',
        '<strong>Revisar las 16 preguntas anónimas del Q&A.</strong> Quedaron fuera del scoring por no ser identificables, pero pueden contener intención de compra real.',
        '<strong>Definir el ticket promedio del servicio EUDR</strong> para poder proyectar el pipeline potencial de este webinar (la base de 27 leads ya está lista).',
        '<strong>Replicar la fórmula del posteo de evento.</strong> El post del 4/8 con formato «Evento de LinkedIn» duplicó el CTR del resto — usarlo como pieza central en el próximo webinar.',
      ],
    },
  },
};

export const WEBINAR_PERIODS = [
  // ISO 14064 oculto a pedido del equipo (los datos siguen en el seed):
  // { id: 'wbn-iso14064', label: 'Webinar ISO 14064 · Jul 2026' },
  { id: 'wbn-eudr', label: 'Webinar EUDR · Ago 2026' },
];
