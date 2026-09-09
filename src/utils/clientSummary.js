// ════════════════════════════════════════════════════════════════
//  RESUMEN POR CLIENTE — lógica pura de la vista General.
//  Recibe el paquete crudo de `clientService.getOverview()` (último
//  período con datos de cada pilar) y devuelve lo que muestra la vista:
//  hero card, líneas de resumen, insights, diagnóstico y próximo paso de
//  cada pilar, reutilizando los generadores de cada pilar (reglas fijas
//  sobre datos reales, sin IA). Nunca inventa un número: si un pilar no
//  tiene generador para una sección, esa sección queda vacía.
// ════════════════════════════════════════════════════════════════
import { CLIENT_STR, PILLAR_NAMES } from '@/utils/clientI18n';
import { ML_EN } from '@/utils/socialI18n';
import { MONTHS_EN } from '@/utils/paidI18n';
import { genMonthlyInsights, genCountryInsights, genSocialConclusions, genSocialNextSteps } from '@/utils/socialInsights';
import { genPaidInsights, genPaidConclusions, genPaidNextSteps, genGeoNextSteps, activeCampaigns } from '@/utils/paidInsights';
import { genSiteInsights, genSiteConclusions, genSiteNextSteps, genSeoInsights } from '@/utils/websiteInsights';
import { genEmailInsights, genEmailConclusions, genEmailNextSteps } from '@/utils/emailInsights';

const locale = (lang) => (lang === 'en' ? 'en-US' : 'es-AR');
const num = (v, lang) => Number(v || 0).toLocaleString(locale(lang));
const dec = (v, lang, d = 1) => Number(v || 0).toLocaleString(locale(lang), { minimumFractionDigits: d, maximumFractionDigits: d });
const money = (v, cur, lang) => `${dec(v, lang, 2)} ${cur || 'EUR'}`;

// Etiqueta del período en el idioma del reporte.
export function periodLabelOf(p, lang) {
  if (lang !== 'en') return p.periodLabel;
  if (p.kind === 'social' || p.kind === 'social-country') return ML_EN[p.period] ?? p.periodLabel;
  if (p.kind === 'paid' || p.kind === 'email') return MONTHS_EN[p.period] ?? p.periodLabel;
  return p.periodLabel;
}

// Texto narrativo del seed con variante EN (fallback al español).
const tx = (obj, field, lang) => (lang === 'en' ? (obj?.[`${field}En`] ?? obj?.[field]) : obj?.[field]);

// ── Resumen de UN pilar ──
export function summarizePillar(p, lang = 'es') {
  if (!p) return null;
  const t = CLIENT_STR[lang];
  const en = lang === 'en';
  const n = (v) => num(v, lang);
  const base = {
    pilar: p.pilar,
    kind: p.kind,
    title: PILLAR_NAMES[lang][p.pilar],
    accName: p.accName,
    subtitle: null, // texto propio del período (ej. título del webinar)
    periodLabel: periodLabelOf(p, lang),
    note: en ? (p.noteEn ?? p.note) : p.note,
    hero: null,
    lines: [],
    insights: [],
    conclusion: null,
    nextStep: null,
    glossary: t.glossary[p.pilar],
  };

  switch (p.kind) {
    case 'social': {
      const { mo, prev } = p;
      if (!mo) return null;
      const ins = genMonthlyInsights(mo, prev, lang);
      return {
        ...base,
        hero: { label: t.kImp, value: n(mo.imp), pill: `ER ${dec(mo.er, lang)} %` },
        lines: [
          { value: n(mo.clk), text: t.kClk },
          { value: `+${n(mo.fol)}`, text: t.kFol },
          { value: n(mo.vis), text: t.kVis },
          ...(mo.np != null ? [{ value: n(mo.np), text: t.kPosts }] : []),
        ],
        insights: ins.slice(0, 2),
        conclusion: genSocialConclusions(mo, prev, lang)[0] ?? null,
        nextStep: genSocialNextSteps(mo, prev, lang)[0] ?? null,
      };
    }

    case 'social-country': {
      const { d, prev, tot, countryName } = p;
      if (!d) return null;
      const ins = genCountryInsights(d, prev, tot, countryName, lang);
      return {
        ...base,
        hero: { label: `${t.kImp} · ${countryName}`, value: n(d.imp), pill: d.np ? `ER ${dec(d.er, lang)} %` : null },
        lines: [
          { value: n(d.clk), text: t.kClk },
          { value: n(d.np), text: t.kPostsTag },
          { value: n(d.vis), text: t.kPageViews },
        ],
        insights: ins.slice(0, 2),
        conclusion: d.np
          ? { label: t.cReach, text: t.cCountryText(n(d.imp), n(d.clk), countryName, n(d.np), base.periodLabel) }
          : null,
        // Sin generador propio de próximos pasos por país: se toma la acción
        // recomendada del primer insight (también generada de datos reales).
        nextStep: ins[0]?.a ?? null,
      };
    }

    case 'paid': {
      const { mo } = p;
      if (!mo?.totals) return null;
      const tt = mo.totals;
      const cur = tt.currency || 'EUR';
      return {
        ...base,
        hero: { label: t.kClk, value: n(tt.clicks), pill: `${t.kCtr} ${dec(tt.ctr, lang, 2)} %` },
        lines: [
          { value: n(tt.impressions), text: t.kImp },
          { value: n(tt.conversions), text: t.kConv },
          { value: money(tt.cost, cur, lang), text: t.kCost },
          { value: n(activeCampaigns(mo).length), text: t.kCampaigns },
        ],
        insights: genPaidInsights(mo, lang, p.period).slice(0, 2),
        conclusion: genPaidConclusions(mo, lang)[0] ?? null,
        nextStep: genPaidNextSteps(mo, lang)[0] ?? null,
      };
    }

    case 'paid-geo': {
      const { agg, currency, event, geo } = p;
      if (!agg) return null;
      const spend = currency === 'ARS' ? `${n(Math.round(agg.spend))} ARS` : `US$ ${dec(agg.spend, lang, 2)}`;
      return {
        ...base,
        title: `${base.title} · GEO`,
        glossary: t.glossary.paidGeo,
        hero: { label: t.kLinkClicks, value: n(agg.lc), pill: `${t.kCtr} ${dec(agg.ctr, lang, 2)} %` },
        lines: [
          { value: n(agg.imp), text: t.kImp },
          { value: spend, text: t.kSpend },
          { value: n(agg.out), text: t.kOut },
        ],
        insights: [],
        conclusion: { label: t.cReach, text: t.cGeoText(n(agg.lc), n(agg.imp), spend, event) },
        nextStep: geo ? (genGeoNextSteps(geo, lang)[0] ?? null) : null,
      };
    }

    case 'website': {
      const { site, seo } = p;
      if (!site) return null;
      const lines = [
        { value: n(site.singleTraffic), text: t.kUsers },
        { value: n(site.impressions), text: t.kPageviews },
        { value: n(site.conversions), text: t.kSiteConv },
      ];
      if (seo) {
        lines.push({ value: n(seo.totalClicks), text: `${t.kSeoClicks} · ${n(seo.impressions)} ${t.kSeoImp.toLowerCase()}` });
        lines.push({ value: dec(seo.averagePosition, lang, 2), text: t.kSeoPos });
      } else {
        lines.push({ value: '—', text: t.noSeo });
      }
      const ins = [...genSiteInsights(site, lang).slice(0, 1), ...(seo ? genSeoInsights(seo, lang).slice(0, 1) : [])];
      return {
        ...base,
        glossary: seo ? t.glossary.website : t.glossary.website[0],
        hero: { label: t.kSessions, value: n(site.totalTraffic), pill: `${n(site.conversions)} ${t.kSiteConv.toLowerCase()}` },
        lines,
        insights: ins,
        conclusion: genSiteConclusions(site, lang)[0] ?? null,
        nextStep: genSiteNextSteps(site, lang)[0] ?? null,
      };
    }

    case 'email': {
      const c = p.campaign;
      if (!c?.totals) return null;
      const tt = c.totals;
      return {
        ...base,
        hero: { label: t.kSent, value: n(tt.totalSent), pill: `${t.kOpen} ${dec(tt.openRate, lang)} %` },
        lines: [
          { value: `${dec(tt.clickRate, lang)} %`, text: t.kClick },
          { value: `${dec(tt.ctor, lang)} %`, text: t.kCtor },
          { value: n(c.hotLeadsCount), text: t.kHot },
          { value: n(tt.emailCount), text: t.kSends },
        ],
        insights: genEmailInsights(c, lang).slice(0, 2),
        conclusion: genEmailConclusions(c, lang)[0] ?? null,
        nextStep: genEmailNextSteps(c, lang)[0] ?? null,
      };
    }

    case 'webinars': {
      const ev = p.ev;
      if (!ev) return null;
      const plan = tx(ev, 'actionPlan', lang) ?? [];
      const highlight = tx(ev, 'highlight', lang);
      return {
        ...base,
        subtitle: ev.title,
        hero: { label: t.kAtt, value: n(ev.attended), pill: `${t.kShow} ${dec(ev.showRate, lang)} %` },
        lines: [
          { value: n(ev.registered), text: t.kReg },
          { value: n(ev.deals?.total), text: `${t.kDeals} · ${t.hotWarm(ev.deals?.hot ?? 0, ev.deals?.warm)}` },
          ...(ev.email?.regFromEmail != null ? [{ value: n(ev.email.regFromEmail), text: t.kRegEmail }] : []),
        ],
        // El hallazgo principal y el plan de acción del evento vienen del seed
        // (redactados por el equipo sobre los datos reales del evento).
        insights: highlight && plan[0] ? [{ m: highlight, a: plan[0] }] : [],
        conclusion: {
          label: t.cEvent,
          text: t.cEventText(n(ev.registered), n(ev.attended), dec(ev.showRate, lang), n(ev.deals?.total), n(ev.deals?.hot)),
        },
        nextStep: plan[0] ?? null,
      };
    }

    default:
      return null;
  }
}

// ── Resumen completo del cliente ──
export function buildClientSummary(overview, lang = 'es') {
  if (!overview) return null;
  const pillars = overview.pillars.map((p) => summarizePillar(p, lang)).filter(Boolean);
  const insights = pillars.flatMap((s) => s.insights.map((x) => ({ ...x, label: s.title })));
  const conclusions = pillars.filter((s) => s.conclusion).map((s) => ({ label: s.title, text: s.conclusion.text }));
  const nextSteps = pillars.filter((s) => s.nextStep).map((s) => `<strong>${s.title}:</strong> ${s.nextStep}`);
  const glossaryKeys = [...new Set(pillars.flatMap((s) => (Array.isArray(s.glossary) ? s.glossary : [s.glossary])))];
  return { pillars, insights, conclusions, nextSteps, glossaryKeys };
}
