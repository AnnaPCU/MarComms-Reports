// ════════════════════════════════════════════════════════════════
//  TEXTOS ES/EN — vista PLANES (informes mensuales de un plan regional).
//  Mismo patrón que los demás *I18n.js; el idioma base es ES.
// ════════════════════════════════════════════════════════════════

export const PLANS_STR = {
  es: {
    reportNo: (n) => `Informe mensual N.º ${n}`,
    fProgram: 'Programa',
    fPeriod: 'Período',
    fMarket: 'Mercado',
    fClient: 'Cliente',
    metricsTitle: 'Indicadores del mes',
    deliverablesTitle: 'Entregables del mes',
    deliverablesNote: 'Estado al cierre del período',
    hDeliverable: 'Entregable',
    hStatus: 'Estado',
    hOutcome: 'Resultado',
    hAction: 'Acción / Tarea',
    hPriority: 'Prioridad',
    trackerNote: 'Acciones planificadas para el próximo período',
    status: { done: 'Completado', progress: 'En curso', pending: 'Pendiente' },
    priority: { high: 'Alta', medium: 'Media' },
    embedNote: 'Informe de avance del plan. Los datos de plataforma de cada pilar se descargan desde su propia vista.',
    noData: 'No hay ningún informe de plan cargado para este período.',
  },
  en: {
    reportNo: (n) => `Monthly report No. ${n}`,
    fProgram: 'Program',
    fPeriod: 'Period',
    fMarket: 'Market',
    fClient: 'Client',
    metricsTitle: 'Month metrics',
    deliverablesTitle: 'Deliverables of the month',
    deliverablesNote: 'Status at period close',
    hDeliverable: 'Deliverable',
    hStatus: 'Status',
    hOutcome: 'Outcome',
    hAction: 'Action / Task',
    hPriority: 'Priority',
    trackerNote: 'Actions planned for the next period',
    status: { done: 'Completed', progress: 'In progress', pending: 'Pending' },
    priority: { high: 'High', medium: 'Medium' },
    embedNote: 'Plan progress report. Each pillar\'s platform data is downloaded from its own view.',
    noData: 'No plan report loaded for this period.',
  },
};
