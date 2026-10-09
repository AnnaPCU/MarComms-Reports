// ════════════════════════════════════════════════════════════════
//  SERVICE — CRM (HubSpot). Deals originados por MarComms: generados,
//  MQLs y WON por entidad de PCU, origen y mes. Lee del seed generado
//  (src/data/crmSeed.js); la UI nunca lo toca directo.
//
//  Reglas (docs/DECISIONES.md §14):
//   · Los importes se agrupan por moneda: nunca se convierten ni se suman
//     monedas distintas.
//   · Sin entidad mapeada → null (la vista dice «Sin información
//     suficiente»); con entidad y sin deals → 0, que es un dato real.
// ════════════════════════════════════════════════════════════════
import { CRM_META, CRM_ENTITIES, CRM_SOURCES, CRM_GENERATED, CRM_MQL, CRM_WON, CRM_WON_UNDATED } from '@/data/crmSeed';
import { CLIENT_BY_ID } from '@/constants/clients';
import { accountEntities } from '@/constants/crm';

export const MAIN_SOURCES = CRM_SOURCES.filter((s) => s.main).map((s) => s.id);
export const OTHER_SOURCES = CRM_SOURCES.filter((s) => !s.main).map((s) => s.id);
export const ALL_MONTHS = Array.from({ length: 12 }, (_, i) => `m${String(i + 1).padStart(2, '0')}`);

// Pilar del reporte → origen en HubSpot (mismo id).
const PILLAR_SOURCE = { social: 'social', paid: 'paid', website: 'website', email: 'email', webinars: 'webinars' };

export function getMeta() {
  return CRM_META;
}

// ¿El origen tiene algún deal cargado en el seed (cualquier entidad y mes)?
export function sourceHasDeals(id) {
  return Object.values(CRM_GENERATED[id] ?? {}).some((byMonth) => Object.values(byMonth).some((n) => n > 0));
}

export function sourceHsName(id) {
  return CRM_SOURCES.find((s) => s.id === id)?.hs ?? id;
}

export function entityName(code, lang = 'es') {
  const e = CRM_ENTITIES[code];
  if (!e) return code;
  return lang === 'en' ? e.nameEn ?? e.name : e.name;
}

// Meses de un período de reporte (mes, trimestre o año). Los períodos
// especiales (GEO de Meta, comparativas) no tienen equivalente → null.
export function monthsOfPeriod(periodId) {
  if (/^m(0[1-9]|1[0-2])$/.test(periodId)) return [periodId];
  const q = /^q([1-4])-2026$/.exec(periodId ?? '');
  if (q) {
    const start = (Number(q[1]) - 1) * 3;
    return ALL_MONTHS.slice(start, start + 3);
  }
  if (periodId === 'year-2026') return ALL_MONTHS;
  return null;
}

function emptyMoney() {
  return { deals: 0, byCurrency: {}, noAmount: 0 };
}

function addRows(acc, rows, ents, sources, months) {
  for (const [src, ent, month, cur, deals, amount, noAmount] of rows) {
    if (!sources.includes(src) || !ents.includes(ent) || !months.includes(month)) continue;
    acc.deals += deals;
    acc.noAmount += noAmount;
    if (deals > noAmount) acc.byCurrency[cur] = (acc.byCurrency[cur] ?? 0) + amount;
  }
  return acc;
}

// Totales de un conjunto de entidades × orígenes × meses.
export function summarize(entities, sources, months) {
  let generated = 0;
  for (const src of sources) {
    for (const ent of entities) {
      const byMonth = CRM_GENERATED[src]?.[ent];
      if (!byMonth) continue;
      for (const m of months) generated += byMonth[m] ?? 0;
    }
  }
  return {
    generated,
    mql: addRows(emptyMoney(), CRM_MQL, entities, sources, months),
    won: addRows(emptyMoney(), CRM_WON, entities, sources, months),
  };
}

// WON sin fecha de cierre (no se ubican en un mes): solo para avisarlos.
export function undatedWon(entities, sources) {
  return addRows(
    emptyMoney(),
    CRM_WON_UNDATED.map(([src, ent, cur, deals, amount, noAmount]) => [src, ent, 'undated', cur, deals, amount, noAmount]),
    entities,
    sources,
    ['undated'],
  );
}

// Meses con alguna actividad (generado, MQL o WON) para las entidades dadas.
export function activeMonths(entities, sources = [...MAIN_SOURCES, ...OTHER_SOURCES]) {
  return ALL_MONTHS.filter((m) => {
    const s = summarize(entities, sources, [m]);
    return s.generated > 0 || s.mql.deals > 0 || s.won.deals > 0;
  });
}

// ── Bloque CRM de la vista por cliente ──
// null si el cliente no tiene entidad de HubSpot asignada.
export function getClientCrm(clientId, periodId = 'year-2026') {
  const client = CLIENT_BY_ID[clientId];
  const entities = client?.crmEntities ?? [];
  if (!entities.length) return null;
  const months = monthsOfPeriod(periodId) ?? ALL_MONTHS;
  const bySource = (ids) => ids.map((id) => ({ id, hs: sourceHsName(id), ...summarize(entities, [id], months) }));
  return {
    entities,
    months: activeMonths(entities),
    main: { total: summarize(entities, MAIN_SOURCES, months), rows: bySource(MAIN_SOURCES) },
    other: { total: summarize(entities, OTHER_SOURCES, months), rows: bySource(OTHER_SOURCES) },
    undatedWon: periodId === 'year-2026' ? undatedWon(entities, OTHER_SOURCES) : null,
  };
}

// ── Card «Deals generados» de un pilar ──
// Deals de las entidades de la cuenta con origen = el pilar, en los meses
// del período. null si la cuenta no tiene entidad o el período no aplica.
export function getPillarCrm(pilar, account, period, country = null) {
  const src = PILLAR_SOURCE[pilar];
  const entities = src ? accountEntities(pilar, account, country) : null;
  const months = monthsOfPeriod(period);
  if (!entities?.length || !months) return null;
  return { source: src, hs: sourceHsName(src), entities, months, ...summarize(entities, [src], months) };
}
