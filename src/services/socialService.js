// ════════════════════════════════════════════════════════════════
//  SERVICE — Pilar Social Media (LinkedIn)
//
//  Capa de acceso a datos. La UI NUNCA toca el seed directo: habla con
//  este service a través del hook useSocialMonthly.
//
//  Fuente de datos: seed en código (src/data/socialSeed.js) — ver
//  src/lib/README de decisiones. Sin base de datos.
// ════════════════════════════════════════════════════════════════

import { DB, ML, MO } from '@/data/socialSeed';
import { LATAM_DB, LATAM_COUNTRIES } from '@/data/socialLatam';
import { NA_DB, NA_COUNTRIES } from '@/data/socialNorthAm';
import { monthHasData } from '@/utils/hasData';

// ── Cuentas (clientes del pilar Social) ──
export function listAccounts() {
  return Object.entries(DB).map(([id, d]) => ({ id, name: d.name }));
}

// ── Períodos seleccionables ──
export function listPeriods() {
  return MO.map((id) => ({ id, label: ML[id] }));
}

// ── Datos mensuales de una cuenta para un período (o null; puede traer _nodata) ──
export function getMonthly(accountId, periodId) {
  const acc = DB[accountId];
  if (!acc) return null;
  if (isQuarter(periodId)) return getQuarterly(accountId, periodId);
  return acc.mo?.[periodId] ?? null;
}

// Período anterior (para los deltas), solo si existe y TIENE datos.
export function getPrevMonthly(accountId, periodId) {
  if (isQuarter(periodId)) {
    const pq = prevQuarterId(periodId);
    return pq ? getQuarterly(accountId, pq) : null;
  }
  const i = MO.indexOf(periodId);
  if (i <= 0) return null;
  const prev = getMonthly(accountId, MO[i - 1]);
  return monthHasData(prev) ? prev : null;
}

// ── Serie anual: todos los meses conocidos con su dato (o null si vacío) ──
// Sirve para el "Resumen del Año" (progreso mes a mes de una cuenta).
export function getYearSeries(accountId) {
  const acc = DB[accountId];
  if (!acc) return { accName: '', series: [] };
  const series = MO.map((id) => {
    const mo = getMonthly(accountId, id);
    return { id, label: ML[id], short: (ML[id] || id).replace(/\s*20\d\d$/, ''), mo: monthHasData(mo) ? mo : null };
  });
  return { accName: acc.name, series };
}

// ¿La cuenta tiene al menos un mes con datos? (para habilitar el resumen anual)
export function hasYearData(accountId) {
  return getYearSeries(accountId).series.some((s) => s.mo);
}

// ── ¿Hay datos para (cuenta, período)? (para el badge del header) ──
export function hasDataFor(account, period) {
  if (period === 'cmp') return true;
  if (period === 'year-2026') return hasYearData(account);
  return monthHasData(getMonthly(account, period));
}

// ── Audiencia (distribuciones de la cuenta) ──
export function getAudience(accountId) {
  const acc = DB[accountId];
  if (!acc) return { seniority: [], jobFunction: [] };
  return { seniority: acc.sen ?? [], jobFunction: acc.job ?? [] };
}

export function prevPeriodId(period) {
  const i = MO.indexOf(period);
  return i > 0 ? MO[i - 1] : null;
}

// ── Comparativa multi-cuenta (efectividad, Mayo 2026) ──
export { CMP_DATA, TOP_ENG_POSTS } from '@/data/socialSeed';

// ════════════════════════════════════════════════════════════════
//  Segmentación POR PAÍS de cuentas LinkedIn (CU Latinoamérica y
//  CU North America). Datos generados por
//  scripts/linkedin/build_country_seg.py — ver la nota de metodología en
//  los seeds (posts por hashtag de país + hojas de Ubicación del export).
// ════════════════════════════════════════════════════════════════
const SEG = {
  cul: { label: 'CU Latinoamérica', countries: LATAM_COUNTRIES, db: LATAM_DB },
  cuna: { label: 'CU North America', countries: NA_COUNTRIES, db: NA_DB },
};

// Config de segmentación de la cuenta (o null si no segmenta por país).
export function getSegConfig(accountId) {
  return SEG[accountId] ?? null;
}

export function getSegCountry(accountId, countryId, periodId) {
  if (isQuarter(periodId)) return getSegQuarter(accountId, countryId, periodId);
  return SEG[accountId]?.db[periodId]?.[countryId] ?? null;
}

// Mes anterior del país, solo si tuvo publicaciones (para los deltas).
export function getPrevSegCountry(accountId, countryId, periodId) {
  if (isQuarter(periodId)) {
    const pq = prevQuarterId(periodId);
    const prev = pq ? getSegCountry(accountId, countryId, pq) : null;
    return prev && prev.np > 0 ? prev : null;
  }
  const i = MO.indexOf(periodId);
  if (i <= 0) return null;
  const prev = getSegCountry(accountId, countryId, MO[i - 1]);
  return prev && prev.np > 0 ? prev : null;
}

// Base de cálculo del mes (todas las publicaciones, con y sin país).
export function getSegMonthTotals(accountId, periodId) {
  if (isQuarter(periodId)) {
    const tots = quarterMonths(periodId).map((m) => SEG[accountId]?.db[m]?._tot);
    if (tots.some((x) => !x)) return null;
    return { np: sumBy(tots, 'np'), imp: sumBy(tots, 'imp'), clk: sumBy(tots, 'clk'), un: sumBy(tots, 'un') };
  }
  return SEG[accountId]?.db[periodId]?._tot ?? null;
}

// Serie anual del país: todos los meses conocidos con su dato (o null).
// Alimenta el "Resumen del Año" segmentado por país.
export function getSegCountryYearSeries(accountId, countryId) {
  const db = SEG[accountId]?.db ?? {};
  return MO.map((id) => ({
    id,
    label: ML[id],
    short: (ML[id] || id).replace(/\s*20\d\d$/, ''),
    d: db[id]?.[countryId] ?? null,
    tot: db[id]?._tot ?? null,
  }));
}

// Seguidores del país: foto acumulada del export más reciente disponible.
export function getSegFolBase(accountId, countryId) {
  const db = SEG[accountId]?.db ?? {};
  for (let i = MO.length - 1; i >= 0; i--) {
    const d = db[MO[i]]?.[countryId];
    if (d?.folBase) return d.folBase;
  }
  return 0;
}

// ════════════════════════════════════════════════════════════════
//  TRIMESTRES (pedido del 9/10/2026): Social se carga mes a mes; un
//  trimestre es la SUMA de sus 3 meses y solo existe si los tres tienen
//  datos (nunca se completa un mes faltante).
//   · imp, clk, np, fol (seguidores nuevos) y vis: suma de los meses.
//   · er: recalculado, ponderado por impresiones (Σ er·imp / Σ imp).
//   · posts: top 5 del trimestre por impresiones (de los top 5 de cada mes,
//     que contienen siempre al top 5 del trimestre).
//   · comp (competidores): nuevos seguidores, interacciones y posts se suman;
//     seguidores totales = foto del último mes.
//   · Por país: igual; folBase (foto acumulada) = la del último mes.
// ════════════════════════════════════════════════════════════════
export const QUARTERS = [
  { id: 'q1-2026', label: 'Q1 2026', months: ['m01', 'm02', 'm03'] },
  { id: 'q2-2026', label: 'Q2 2026', months: ['m04', 'm05', 'm06'] },
  { id: 'q3-2026', label: 'Q3 2026', months: ['m07', 'm08', 'm09'] },
];

export function isQuarter(periodId) {
  return QUARTERS.some((q) => q.id === periodId);
}

function quarterMonths(periodId) {
  return QUARTERS.find((q) => q.id === periodId)?.months ?? [];
}

function prevQuarterId(periodId) {
  const i = QUARTERS.findIndex((q) => q.id === periodId);
  return i > 0 ? QUARTERS[i - 1].id : null;
}

const sumBy = (list, k) => list.reduce((a, x) => a + (Number(x?.[k]) || 0), 0);
const weightedEr = (list) => {
  const imp = sumBy(list, 'imp');
  return imp ? list.reduce((a, x) => a + (Number(x.er) || 0) * (Number(x.imp) || 0), 0) / imp : 0;
};
const topPosts = (list, n = 5) =>
  list
    .flatMap((x) => x.posts ?? [])
    .sort((a, b) => (b.imp || 0) - (a.imp || 0))
    .slice(0, n);

function sumComp(months) {
  const byName = new Map();
  for (const m of months) {
    for (const c of m.comp ?? []) {
      const cur = byName.get(c.name) ?? { name: c.name, nfol: 0, eng: 0, posts: 0 };
      cur.nfol += c.nfol || 0;
      cur.eng += c.eng || 0;
      cur.posts += c.posts || 0;
      if (c.fol != null) cur.fol = c.fol; // foto: queda la del último mes
      if (c.own) cur.own = true;
      byName.set(c.name, cur);
    }
  }
  return [...byName.values()];
}

// Trimestre de una cuenta (o null si falta algún mes).
export function getQuarterly(accountId, periodId) {
  const acc = DB[accountId];
  const months = quarterMonths(periodId).map((m) => acc?.mo?.[m]);
  if (!months.length || months.some((m) => !monthHasData(m))) return null;
  const q = {
    imp: sumBy(months, 'imp'),
    clk: sumBy(months, 'clk'),
    er: weightedEr(months),
    vis: sumBy(months, 'vis'),
    fol: sumBy(months, 'fol'),
    posts: topPosts(months),
    comp: sumComp(months),
    quarter: true,
  };
  if (months.every((m) => m.np != null)) q.np = sumBy(months, 'np');
  return q;
}

// Trimestre de un país de una cuenta segmentada (o null si falta algún mes).
function getSegQuarter(accountId, countryId, periodId) {
  const db = SEG[accountId]?.db ?? {};
  const months = quarterMonths(periodId).map((m) => db[m]?.[countryId]);
  if (!months.length || months.some((m) => !m)) return null;
  return {
    np: sumBy(months, 'np'),
    imp: sumBy(months, 'imp'),
    clk: sumBy(months, 'clk'),
    er: weightedEr(months),
    vis: sumBy(months, 'vis'),
    folBase: months[months.length - 1].folBase,
    posts: topPosts(months),
  };
}

// Trimestres con datos completos para la cuenta (más reciente primero).
export function listQuarters(accountId = null) {
  return QUARTERS.filter((q) => !accountId || getQuarterly(accountId, q.id))
    .map(({ id, label }) => ({ id, label }))
    .reverse();
}
