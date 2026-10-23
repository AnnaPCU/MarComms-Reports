// ════════════════════════════════════════════════════════════════
//  SEED — Paid Media · campañas en paralelo (Google Ads + Meta Ads)
//
//  Una campaña de evento que corrió a la vez en las dos plataformas (mismo
//  nombre en el mismo drop, docs/DECISIONES.md §22) es un período propio
//  de la cuenta: «Período/Campaña» → ej. «IFPA · Oct 2026». Adentro, un
//  selector de plataforma: Google Ads por defecto, Meta Ads a un clic.
//  Las plataformas NUNCA se suman entre sí.
//  Cada campaña vive en src/data/paidParallel/<id>.js, generado con
//  scripts/paid/build_parallel.py. Forma:
//    { period: { id, label, labelEn, start, end, platforms },
//      accounts: { <cuenta>: { google: { mo, detail, weeks, range },
//                              meta: { currency, campaigns, … como paidMeta } } } }
//  Ids: `par-…`. build_parallel.py agrega el import y la entrada de la
//  lista de abajo; no hace falta tocarlos a mano.
// ════════════════════════════════════════════════════════════════

// PARALLEL:IMPORTS (build_parallel.py agrega acá)
import parIfpa202610 from './paidParallel/par-ifpa-202610.js';

const CAMPAIGNS = [
  // PARALLEL:LIST (build_parallel.py agrega acá)
  parIfpa202610,
];

// Períodos en paralelo, del más reciente al más viejo.
export const PARALLEL_PERIODS = CAMPAIGNS.map((x) => x.period).sort((a, b) => b.start.localeCompare(a.start));

// cuenta → período → { google, meta, period }.
export const PARALLEL = {};
for (const { period, accounts } of CAMPAIGNS) {
  for (const [acc, data] of Object.entries(accounts)) {
    (PARALLEL[acc] ??= {})[period.id] = {
      google: data.google,
      // La parte de Meta lleva el período, como las campañas de paidMeta/.
      meta: data.meta ? { ...data.meta, period } : null,
      period,
    };
  }
}
