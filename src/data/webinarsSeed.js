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
      attCountries: [
        { name: 'Argentina', v: 11 },
        { name: 'México', v: 11 },
        { name: 'Estados Unidos', v: 3 },
        { name: 'Colombia', v: 2 },
        { name: 'Perú', v: 2 },
        { name: 'Honduras', v: 1 },
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
        rows: [
          { empresa: 'Zucarmex', pais: 'US', asistencia: 100, score: 90.0 },
          { empresa: 'Bovis Project Management', pais: 'MX', asistencia: 100, score: 85.0 },
          { empresa: 'Santomar', pais: 'MX', asistencia: 100, score: 70.0 },
          { empresa: 'Expo Guadalajara', pais: 'MX', asistencia: 100, score: 70.0 },
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
  },
};

export const WEBINAR_PERIODS = [{ id: 'wbn-iso14064', label: 'Webinar ISO 14064 · Jul 2026' }];
