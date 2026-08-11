import { useState } from 'react';
import { MapPin } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { listAccounts, getGeo } from '@/services/paidService';
import { aggAccount } from '@/data/paidMetaGeo';
import { GEO_STR } from '@/utils/paidI18n';
import { genGeoInsights, genGeoFunnelInsights, genGeoNextSteps } from '@/utils/paidInsights';
import { Funnel } from '@/components/shared/Funnel';
import { PAL, CU, CHART_TOOLTIP } from '@/constants/brand';
import { InsightsPanel } from '@/components/shared/InsightsPanel';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { KpiCard } from '@/components/shared/KpiCard';
import { SegmentedControl } from '@/components/shared/SegmentedControl';
import { NoDataScreen } from '@/components/shared/NoDataScreen';
import { ChartCard } from '@/components/shared/ChartCard';
import { NextStepsPanel } from '@/components/shared/PerformancePanels';
import { BrandIcon } from '@/components/shared/BrandIcon';
import { Glossary } from '@/components/shared/Glossary';
import { isExternalReport } from '@/utils/reportAudience';

// ════════════════════════════════════════════════════════════════
//  Reporte Meta Ads GEO — campaña corta atada a un evento físico
//  (Congreso Aapresid 2026, radio ~1 km). Estructura: ficha del
//  experimento → insights → resultados generales → Typeform vs
//  WhatsApp → evolución diaria → alcance del reporte → glosario.
//  Regla de honestidad: solo datos del export diario de Meta; lo que
//  falta (funnel Typeform/WhatsApp, breakdowns) se declara, no se estima.
// ════════════════════════════════════════════════════════════════

const numEs = (v) => Number(v || 0).toLocaleString('es-AR');
const pct = (v) =>
  Number(v || 0).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '%';

function moneyFor(currency) {
  return (v) =>
    currency === 'ARS'
      ? `${Math.round(Number(v || 0)).toLocaleString('es-AR')} ARS`
      : `US$ ${Number(v || 0).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

const dayLabel = (d, en) => (en ? d.replace(/(\d+) Ago/, 'Aug $1') : d);

// Tabla genérica de desglose (creativos / plataforma / género).
function DataTable({ title, note, headers, rows, foot }) {
  return (
    <div className="mb-4 overflow-x-auto rounded-cu border border-cu-border bg-white px-5 py-4 shadow-cu">
      <div className="mb-3 flex flex-wrap items-baseline gap-2">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.5px] text-cu-dblue">{title}</h3>
        {note && <span className="text-[10px] text-cu-grey">{note}</span>}
      </div>
      <table className="w-full min-w-[640px] border-collapse">
        <thead>
          <tr>
            {headers.map((h) => (
              <th key={h} className="border-b-2 border-cu-cyan px-3 py-2 text-left text-[9px] font-bold uppercase tracking-[0.5px] text-cu-grey">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b border-cu-border2 transition-colors hover:bg-cu-cyan/[0.03]">
              {r.map((cell, j) => (
                <td key={j} className={`px-3 py-2.5 text-[11.5px] ${j === 0 ? 'font-medium text-cu-dblue' : 'text-cu-dgrey'}`}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {foot && <div className="mt-2 text-[10px] italic text-cu-grey">{foot}</div>}
    </div>
  );
}

// Celda de la ficha del experimento.
function FichaCell({ label, value, foot, highlight = false }) {
  return (
    <div
      className={`rounded-cu border bg-white px-4 py-3 shadow-cu ${
        highlight ? 'border-cu-cyan border-l-4 border-l-cu-cyan bg-cu-cyan/[0.04]' : 'border-cu-border'
      }`}
    >
      <div className="mb-1 flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.6px] text-cu-grey">
        {highlight && <BrandIcon icon={MapPin} tone="accent" size="sm" />}
        {label}
      </div>
      <div className="text-[12.5px] font-medium leading-snug text-cu-dblue">{value}</div>
      {foot && <div className="mt-1 text-[9px] italic leading-tight text-cu-grey">{foot}</div>}
    </div>
  );
}

export function MetaGeoReport({ account, period }) {
  const [lang, setLang] = useState('es');
  const t = GEO_STR[lang];
  const en = lang === 'en';
  const accName = listAccounts().find((a) => a.id === account)?.name ?? '';
  const geo = getGeo(account, period);

  if (!geo) {
    return (
      <div className="animate-fade-in">
        <NoDataScreen
          detail={
            <>
              No hay campañas Meta Ads GEO cargadas de <strong>{accName}</strong> para este
              evento. Las cuentas con datos son <strong>CU Argentina</strong> y{' '}
              <strong>PS Argentina</strong>.
            </>
          }
        />
        <Glossary keys="paidMeta" />
      </div>
    );
  }

  const money = moneyFor(geo.currency);
  const acc = aggAccount(geo);
  const per = acc.per; // [{c, t}] por campaña
  const tf = per.find((x) => x.c.kind === 'typeform');
  const wa = per.find((x) => x.c.kind === 'whatsapp');
  const kindOf = (c) => t.kindLabel[c.kind] ?? c.kind;

  // Datos para los charts diarios (una serie por campaña).
  const days = [...new Set(per.flatMap(({ c }) => c.days.map((d) => d.d)))];
  const chart = (field) =>
    days.map((d) => {
      const row = { d: dayLabel(d, en) };
      per.forEach(({ c }) => {
        row[kindOf(c)] = c.days.find((x) => x.d === d)?.[field] ?? 0;
      });
      return row;
    });

  const cmpRows = tf && wa
    ? [
        ['spend', (x) => money(x.spend)],
        ['imp', (x) => numEs(x.imp)],
        ['lc', (x) => numEs(x.lc)],
        ['out', (x) => numEs(x.out)],
        ['ctr', (x) => pct(x.ctr)],
        ['outCtr', (x) => pct(x.outCtr)],
        ['cpc', (x) => money(x.cpc)],
        ['cpm', (x) => money(x.cpm)],
        ['results', (x) => (x.results ? t.resultsVal(x.results) : t.noResults)],
        ['cpr', (x) => (x.costPerResult ? money(x.costPerResult) : '—')],
      ]
    : null;

  return (
    <div className="animate-fade-in">
      <div className="mb-4 flex justify-end">
        <SegmentedControl
          value={lang}
          onChange={setLang}
          size="sm"
          options={[
            { id: 'es', label: 'ES' },
            { id: 'en', label: 'EN' },
          ]}
        />
      </div>

      {/* ── Ficha del experimento ── */}
      <SectionHeader title={t.fichaSection} note={`${accName} · ${t.channel} · ${geo.event}`} />
      <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <FichaCell label={t.fGeo} value={t.fGeoVal(geo.event)} foot={t.fGeoFoot} highlight />
        <FichaCell label={t.fObjective} value={t.fObjectiveVal} />
        <FichaCell label={t.fPeriod} value={t.fPeriodVal} />
        <FichaCell
          label={t.fCampaigns}
          value={
            <>
              {per.map(({ c }) => (
                <div key={c.id}>
                  <span className="font-bold">{kindOf(c)}</span>{' '}
                  <span className="text-[10.5px] text-cu-grey">— {c.name}</span>
                </div>
              ))}
            </>
          }
        />
        <FichaCell
          label={t.fBudget}
          value={per
            .map(({ c }) => (c.budgetDaily ? t.fBudgetDaily(money(c.budgetDaily)) : t.fBudgetCbo))
            .join(' · ')}
          foot={per.map(({ c }) => c.attribution)[0] ? `${t.fAttribution}: ${per[0].c.attribution}` : null}
        />
        <FichaCell
          label={wa?.t.results ? t.fMainResult : t.fInvest}
          value={
            wa?.t.results
              ? `${t.resultsVal(wa.t.results)} · ${money(acc.spend)}`
              : money(acc.spend)
          }
          foot={wa?.c.results?.note[lang]}
        />
      </div>
      <div className="mb-5 rounded-cu border border-cu-border bg-white px-4 py-2.5 text-[11px] italic leading-relaxed text-cu-grey shadow-cu">
        {t.fichaMissing}
      </div>

      {/* ── Insights ── */}
      <InsightsPanel
        title={t.insightsTitle}
        label={t.insightsLabel}
        subtitle={`${accName} · ${geo.event}`}
        items={[...genGeoFunnelInsights(geo, money, lang), ...genGeoInsights(geo, money, lang)]}
        actionLabel={lang === 'en' ? 'Recommended action' : 'Acción recomendada'}
      />

      {/* ── Resultados generales ── */}
      <SectionHeader title={t.kpiSection} note={`${accName} · ${t.channel}`} />
      <div className={`mb-5 grid grid-cols-2 gap-3 ${wa ? 'lg:grid-cols-3' : 'lg:grid-cols-5'}`}>
        <KpiCard label={t.kSpend} value={money(acc.spend)} accent="amber" />
        <KpiCard label={t.kImp} value={numEs(acc.imp)} delta={{ dir: 'flat', label: `${t.kCpm} ${money(acc.cpm)}` }} />
        <KpiCard label={t.kLc} value={numEs(acc.lc)} delta={{ dir: 'flat', label: `${t.ctrShort} ${pct(acc.ctr)}` }} footnote={`${t.cpcShort}: ${money(acc.cpc)}`} />
        <KpiCard label={t.kOut} value={numEs(acc.out)} delta={{ dir: 'flat', label: `${t.outCtrShort} ${pct(acc.outCtr)}` }} footnote={t.kOutFoot} />
        {wa ? (
          <KpiCard
            label={t.kConv}
            value={wa.t.results ?? 0}
            accent="green"
            delta={{ dir: 'up', label: `▲ ${t.resultsVal(wa.t.results ?? 0)}` }}
            footnote={wa.t.costPerResult ? t.kConvFoot(money(wa.t.costPerResult)) : null}
          />
        ) : (
          <KpiCard label={t.kCpm} value={money(acc.cpm)} footnote={t.kCpmFoot} />
        )}
      </div>

      {/* ── Typeform vs WhatsApp ── */}
      {cmpRows && (
        <>
          <SectionHeader title={t.cmpSection} note={t.cmpNote} />
          <div className="mb-5 overflow-x-auto rounded-cu border border-cu-border bg-white px-5 py-4 shadow-cu">
            <table className="w-full min-w-[520px] border-collapse">
              <thead>
                <tr>
                  {[t.thMetric, kindOf(tf.c), kindOf(wa.c)].map((h) => (
                    <th key={h} className="border-b-2 border-cu-cyan px-3 py-2 text-left text-[9px] font-bold uppercase tracking-[0.5px] text-cu-grey">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {cmpRows.map(([key, fmt]) => (
                  <tr key={key} className="border-b border-cu-border2 transition-colors hover:bg-cu-cyan/[0.03]">
                    <td className="px-3 py-2.5 text-[11px] font-medium text-cu-dgrey">{t.rows[key]}</td>
                    <td className="px-3 py-2.5 text-[12px] font-medium text-cu-dblue">{fmt(tf.t)}</td>
                    <td className="px-3 py-2.5 text-[12px] font-medium text-cu-dblue">{fmt(wa.t)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* ── Funnel de conversión: Meta → Typeform (CU) ── */}
      {geo.typeform && tf && (() => {
        const starts = geo.typeform.forms.reduce((a, f) => a + f.starts, 0);
        const completed = geo.typeform.forms.reduce((a, f) => a + f.completed, 0);
        const leads = geo.typeform.forms.flatMap((f) => f.leads);
        return (
          <>
            <SectionHeader title={t.funnelSection} note={t.funnelNoteTf} />
            <div className="mb-4 rounded-cu border border-cu-border bg-white px-7 pb-6 pt-6 shadow-cu">
              <div className="mx-auto max-w-[640px]">
                <Funnel
                  stages={[
                    { name: t.fsOut, value: numEs(tf.t.out), desc: t.fsOutDesc, retention: '100 %' },
                    {
                      name: t.fsStarts,
                      value: numEs(starts),
                      desc: t.fsStartsDesc(geo.typeform.forms.length),
                      retention: pct((starts / tf.t.out) * 100),
                      drop: <><b className="font-bold text-cu-cyan">{pct((starts / tf.t.out) * 100)}</b>&nbsp;· {t.ofStarts}</>,
                    },
                    {
                      name: t.fsCompleted,
                      value: numEs(completed),
                      desc: t.fsCompletedDesc,
                      retention: pct(starts ? (completed / starts) * 100 : 0),
                      drop: <><b className="font-bold text-cu-cyan">{pct(starts ? (completed / starts) * 100 : 0)}</b>&nbsp;· {t.ofInit}</>,
                    },
                  ]}
                />
              </div>
            </div>

            {/* Detalle por Typeform */}
            <div className="mb-4 overflow-x-auto rounded-cu border border-cu-border bg-white px-5 py-4 shadow-cu">
              <h3 className="mb-3 text-[10px] font-bold uppercase tracking-[0.5px] text-cu-dblue">{t.formsTableTitle}</h3>
              <table className="w-full min-w-[480px] border-collapse">
                <thead>
                  <tr>
                    {[t.thForm, t.thStarts, t.thCompleted, t.thCompletion].map((h) => (
                      <th key={h} className="border-b-2 border-cu-cyan px-3 py-2 text-left text-[9px] font-bold uppercase tracking-[0.5px] text-cu-grey">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {geo.typeform.forms.map((f) => (
                    <tr key={f.name} className="border-b border-cu-border2 transition-colors hover:bg-cu-cyan/[0.03]">
                      <td className="px-3 py-2.5 text-[11.5px] font-medium text-cu-dblue">{f.name}</td>
                      <td className="px-3 py-2.5 text-[12px] text-cu-dgrey">{f.starts}</td>
                      <td className="px-3 py-2.5 text-[12px] font-medium text-cu-dblue">{f.completed}</td>
                      <td className="px-3 py-2.5 text-[12px] text-cu-dgrey">{f.starts ? pct((f.completed / f.starts) * 100) : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Panel oficial de Typeform (todo el período, sin filtro de fechas) */}
            {geo.typeform.forms.some((f) => f.panel) && (
              <div className="mb-4 overflow-x-auto rounded-cu border border-cu-border bg-white px-5 py-4 shadow-cu">
                <div className="mb-3 flex flex-wrap items-baseline gap-2">
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.5px] text-cu-dblue">{t.tfPanelTitle}</h3>
                  <span className="text-[10px] text-cu-grey">{t.tfPanelNote}</span>
                </div>
                <table className="w-full min-w-[640px] border-collapse">
                  <thead>
                    <tr>
                      {[t.thForm, t.thViewsTf, t.thStartsAll, t.thViewStart, t.thSubs, t.thCompletion, t.thTime].map((h) => (
                        <th key={h} className="border-b-2 border-cu-cyan px-3 py-2 text-left text-[9px] font-bold uppercase tracking-[0.5px] text-cu-grey">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {geo.typeform.forms.filter((f) => f.panel).map((f) => (
                      <tr key={f.name} className="border-b border-cu-border2 transition-colors hover:bg-cu-cyan/[0.03]">
                        <td className="px-3 py-2.5 text-[11.5px] font-medium text-cu-dblue">{f.name}</td>
                        <td className="px-3 py-2.5 text-[12px] font-medium text-cu-dblue">{numEs(f.panel.views)}</td>
                        <td className="px-3 py-2.5 text-[12px] text-cu-dgrey">{f.panel.starts}</td>
                        <td className="px-3 py-2.5 text-[12px] text-cu-dgrey">{pct((f.panel.starts / f.panel.views) * 100)}</td>
                        <td className="px-3 py-2.5 text-[12px] font-medium text-cu-dblue">{f.panel.subs}</td>
                        <td className="px-3 py-2.5 text-[12px] text-cu-dgrey">{pct(f.panel.completion)}</td>
                        <td className="px-3 py-2.5 text-[12px] text-cu-dgrey">{f.panel.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="mt-2 text-[10px] italic text-cu-grey">{t.tfPanelFoot}</div>
              </div>
            )}

            {/* Intención de la audiencia (1ra pregunta de cada Typeform) */}
            {geo.typeform.forms.some((f) => f.intent) && (
              <div className="mb-4 grid grid-cols-1 gap-3 lg:grid-cols-2">
                {geo.typeform.forms.filter((f) => f.intent).map((f) => {
                  const total = f.intent.dist.reduce((a, x) => a + x.v, 0);
                  const max = Math.max(...f.intent.dist.map((x) => x.v), 1);
                  return (
                    <div key={f.name} className="rounded-cu border border-cu-border bg-white px-5 py-4 shadow-cu">
                      <div className="mb-0.5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.5px] text-cu-dblue">
                        <span className="h-3 w-[3px] shrink-0 rounded-sm bg-cu-cyan" />
                        {t.intentTitle} — {f.name}
                      </div>
                      <div className="mb-3 text-[10px] text-cu-grey">
                        “{f.intent.q}” · {t.intentAnswers(total)}
                      </div>
                      <div className="space-y-2">
                        {f.intent.dist.map((x) => (
                          <div key={x.l} className="flex items-center gap-2">
                            <div className="w-[46%] truncate text-[11px] text-cu-dgrey" title={x.l}>{x.l}</div>
                            <div className="h-[14px] flex-1 overflow-hidden rounded-sm bg-cu-bg">
                              <div
                                className="h-full rounded-sm bg-cu-cyan/80"
                                style={{ width: `${(x.v / max) * 100}%` }}
                              />
                            </div>
                            <div className="w-14 text-right text-[11px] font-bold text-cu-dblue">
                              {x.v}{total ? ` · ${Math.round((x.v / total) * 100)}%` : ''}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Leads captados */}
            {leads.length > 0 && (
              <div className="mb-4 overflow-x-auto rounded-cu border border-cu-border bg-white px-5 py-4 shadow-cu">
                <div className="mb-3 flex flex-wrap items-baseline gap-2">
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.5px] text-cu-dblue">{t.leadsTitle}</h3>
                  <span className="text-[10px] text-cu-grey">{t.leadsNote}</span>
                </div>
                <table className="w-full min-w-[720px] border-collapse">
                  <thead>
                    <tr>
                      {[t.thLead, t.thCompany, t.thRole, t.thGoal, t.thDate].map((h) => (
                        <th key={h} className="border-b-2 border-cu-cyan px-3 py-2 text-left text-[9px] font-bold uppercase tracking-[0.5px] text-cu-grey">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map((l) => (
                      <tr key={l.email} className="border-b border-cu-border2 transition-colors hover:bg-cu-cyan/[0.03]">
                        <td className="px-3 py-2.5">
                          <div className="text-[11.5px] font-medium text-cu-dblue">{l.name}</div>
                          <div className="text-[10.5px] text-cu-grey">{l.email}</div>
                        </td>
                        <td className="px-3 py-2.5 text-[11.5px] font-medium text-cu-dblue">{l.company}</td>
                        <td className="px-3 py-2.5 text-[11px] text-cu-dgrey">{l.role}</td>
                        <td className="px-3 py-2.5 text-[11px] text-cu-dgrey">
                          {l.goal}
                          <div className="text-[10px] italic text-cu-grey">{l.extra}</div>
                        </td>
                        <td className="px-3 py-2.5 text-[11px] text-cu-dgrey">{dayLabel(l.d, en)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="mb-5 rounded-cu border border-cu-border bg-white px-4 py-2.5 text-[11px] italic leading-relaxed text-cu-grey shadow-cu">
              {t.tfNote}
            </div>
          </>
        );
      })()}

      {/* ── Funnel de conversión: Meta → formulario HubSpot (PS) ── */}
      {geo.hsForm && (
        <>
          <SectionHeader title={t.funnelSection} note={t.funnelNoteHs} />
          <div className="mb-4 rounded-cu border border-cu-border bg-white px-7 pb-6 pt-6 shadow-cu">
            <div className="mx-auto max-w-[640px]">
              <Funnel
                stages={[
                  { name: t.fsOut, value: numEs(acc.out), desc: t.fsOutDesc, retention: '100 %' },
                  {
                    name: t.fsViews,
                    value: numEs(geo.hsForm.views),
                    desc: t.fsViewsDesc,
                    retention: pct((geo.hsForm.views / acc.out) * 100),
                    drop: <><b className="font-bold text-cu-cyan">{pct((geo.hsForm.views / acc.out) * 100)}</b>&nbsp;· {t.ofStarts}</>,
                  },
                  {
                    name: t.fsInter,
                    value: numEs(geo.hsForm.interactions),
                    desc: t.fsInterDesc,
                    retention: pct((geo.hsForm.interactions / geo.hsForm.views) * 100),
                    drop: <><b className="font-bold text-cu-cyan">{pct((geo.hsForm.interactions / geo.hsForm.views) * 100)}</b>&nbsp;· {t.ofViews}</>,
                  },
                  {
                    name: t.fsSubs,
                    value: numEs(geo.hsForm.submissions),
                    desc: t.fsSubsDesc,
                    retention: pct(0),
                  },
                ]}
              />
            </div>
          </div>

          <div className="mb-4 overflow-x-auto rounded-cu border border-cu-border bg-white px-5 py-4 shadow-cu">
            <div className="mb-3 flex flex-wrap items-baseline gap-2">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.5px] text-cu-dblue">{t.hsSourcesTitle}</h3>
              <span className="text-[10px] text-cu-grey">{t.hsSourcesNote}</span>
            </div>
            <table className="w-full min-w-[360px] border-collapse">
              <thead>
                <tr>
                  {[t.thSource, t.thViews].map((h) => (
                    <th key={h} className="border-b-2 border-cu-cyan px-3 py-2 text-left text-[9px] font-bold uppercase tracking-[0.5px] text-cu-grey">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {geo.hsForm.sources.map((s) => (
                  <tr key={s.s} className="border-b border-cu-border2 transition-colors hover:bg-cu-cyan/[0.03]">
                    <td className="px-3 py-2.5 text-[11.5px] font-medium text-cu-dblue">{s.s}</td>
                    <td className="px-3 py-2.5 text-[12px] text-cu-dgrey">{s.v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mb-5 rounded-cu border border-cu-border bg-white px-4 py-2.5 text-[11px] italic leading-relaxed text-cu-grey shadow-cu">
            {t.hsNote}
          </div>
        </>
      )}

      {/* ── Evolución diaria ── */}
      <SectionHeader title={t.dailySection} note={t.dailyNote} />
      <div className="mb-3 grid grid-cols-1 gap-3 lg:grid-cols-2">
        <ChartCard title={t.chOutTitle} subtitle={t.chOutSub}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chart('out')} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke={CU.border2} />
              <XAxis dataKey="d" tick={{ fontSize: 10, fill: CU.grey }} />
              <YAxis tick={{ fontSize: 10, fill: CU.grey }} width={36} />
              <Tooltip {...CHART_TOOLTIP} cursor={{ fill: 'rgba(62,178,237,.06)' }} formatter={(v, n) => [numEs(v), n]} />
              <Legend wrapperStyle={{ fontSize: 10, color: CU.dgrey }} />
              {per.map(({ c }, i) => (
                <Bar key={c.id} dataKey={kindOf(c)} fill={PAL[i % PAL.length]} radius={[3, 3, 0, 0]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title={t.chSpendTitle} subtitle={t.chSpendSub}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chart('spend')} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke={CU.border2} />
              <XAxis dataKey="d" tick={{ fontSize: 10, fill: CU.grey }} />
              <YAxis tick={{ fontSize: 10, fill: CU.grey }} width={56} tickFormatter={(v) => numEs(v)} />
              <Tooltip {...CHART_TOOLTIP} cursor={{ fill: 'rgba(62,178,237,.06)' }} formatter={(v, n) => [money(v), n]} />
              <Legend wrapperStyle={{ fontSize: 10, color: CU.dgrey }} />
              {per.map(({ c }, i) => (
                <Bar key={c.id} dataKey={kindOf(c)} fill={PAL[i % PAL.length]} radius={[3, 3, 0, 0]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Tabla día por día */}
      <div className="mb-2 overflow-x-auto rounded-cu border border-cu-border bg-white px-5 py-4 shadow-cu">
        <h3 className="mb-3 text-[10px] font-bold uppercase tracking-[0.5px] text-cu-dblue">{t.dailyTableTitle}</h3>
        <table className="w-full min-w-[720px] border-collapse">
          <thead>
            <tr>
              {[t.thDay, t.thCampaign, t.thSpend, t.thReach, t.thFreq, t.thImp, t.thLc, t.thOut, t.thCtr].map((h) => (
                <th key={h} className="border-b-2 border-cu-cyan px-3 py-2 text-left text-[9px] font-bold uppercase tracking-[0.5px] text-cu-grey">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {days.flatMap((d) =>
              per
                .map(({ c }) => ({ c, x: c.days.find((r) => r.d === d) }))
                .filter(({ x }) => x)
                .map(({ c, x }) => (
                  <tr key={`${d}-${c.id}`} className="border-b border-cu-border2 transition-colors hover:bg-cu-cyan/[0.03]">
                    <td className="px-3 py-2 text-[11px] font-medium text-cu-dblue">{dayLabel(d, en)}</td>
                    <td className="px-3 py-2 text-[11px] text-cu-dgrey">{kindOf(c)}</td>
                    <td className="px-3 py-2 text-[11.5px] font-medium text-cu-dblue">{money(x.spend)}</td>
                    <td className="px-3 py-2 text-[11.5px] text-cu-dgrey">{numEs(x.reach)}</td>
                    <td className="px-3 py-2 text-[11.5px] text-cu-dgrey">{x.freq.toFixed(2)}</td>
                    <td className="px-3 py-2 text-[11.5px] text-cu-dgrey">{numEs(x.imp)}</td>
                    <td className="px-3 py-2 text-[11.5px] font-medium text-cu-dblue">{numEs(x.lc)}</td>
                    <td className="px-3 py-2 text-[11.5px] font-medium text-cu-dblue">{numEs(x.out)}</td>
                    <td className="px-3 py-2 text-[11.5px] text-cu-dgrey">{x.imp ? pct((x.lc / x.imp) * 100) : '—'}</td>
                  </tr>
                )),
            )}
          </tbody>
        </table>
        <div className="mt-2 text-[10px] italic text-cu-grey">{t.dailyReachFoot}</div>
      </div>

      {/* ── Performance por hora del día ── */}
      {per.some(({ c }) => c.hourly?.length) && (() => {
        const withHourly = per.filter(({ c }) => c.hourly?.length);
        const hours = Array.from({ length: 24 }, (_, h) => h);
        const data = hours.map((h) => {
          const row = { h: `${h}` };
          withHourly.forEach(({ c }) => {
            row[kindOf(c)] = c.hourly.find((x) => x.h === h)?.lc ?? 0;
          });
          return row;
        });
        // Lectura: mejor bloque de 4 h y mejor hora puntual (clics combinados).
        const comb = hours.map((h) => withHourly.reduce((a, { c }) => a + (c.hourly.find((x) => x.h === h)?.lc ?? 0), 0));
        const total = comb.reduce((a, b) => a + b, 0);
        let best = { start: 0, sum: -1 };
        for (let s = 0; s <= 20; s++) {
          const sum = comb.slice(s, s + 4).reduce((a, b) => a + b, 0);
          if (sum > best.sum) best = { start: s, sum };
        }
        const bestHour = comb.indexOf(Math.max(...comb));
        const convHours = withHourly
          .flatMap(({ c }) => c.hourly.filter((x) => x.r))
          .map((x) => x.h)
          .sort((a, b) => a - b);
        return (
          <>
            <SectionHeader title={t.hourlySection} note={t.hourlyNote} />
            <ChartCard title={t.chHourTitle} subtitle={t.chHourSub} className="mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
                  <CartesianGrid vertical={false} stroke={CU.border2} />
                  <XAxis dataKey="h" tick={{ fontSize: 9, fill: CU.grey }} interval={1} />
                  <YAxis tick={{ fontSize: 10, fill: CU.grey }} width={30} allowDecimals={false} />
                  <Tooltip
                    {...CHART_TOOLTIP}
                    cursor={{ fill: 'rgba(62,178,237,.06)' }}
                    labelFormatter={(h) => `${h}:00 – ${h}:59`}
                    formatter={(v, n) => [numEs(v), n]}
                  />
                  <Legend wrapperStyle={{ fontSize: 10, color: CU.dgrey }} />
                  {withHourly.map(({ c }, i) => (
                    <Bar key={c.id} dataKey={kindOf(c)} stackId="h" fill={PAL[i % PAL.length]} radius={i === withHourly.length - 1 ? [2, 2, 0, 0] : [0, 0, 0, 0]} />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
            <div className="mb-5 rounded-cu border border-cu-border bg-white px-4 py-2.5 text-[11px] italic leading-relaxed text-cu-grey shadow-cu">
              {total
                ? t.hourlyRead(
                    `${best.start}–${best.start + 4} h`,
                    Math.round((best.sum / total) * 100),
                    bestHour,
                    comb[bestHour],
                  )
                : null}
              {convHours.length ? t.waHoursRead(convHours.join(', ')) : null}
            </div>
          </>
        );
      })()}

      {/* ── Alcance único del período (export sin desglose diario) ── */}
      {per.some(({ c }) => c.periodReach) && (
        <>
          <SectionHeader title={t.reachSection} note={t.reachNote} />
          <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {per.filter(({ c }) => c.periodReach).map(({ c }) => (
              <KpiCard
                key={c.id}
                label={`${t.reachKpi} — ${kindOf(c)}`}
                value={numEs(c.periodReach.reach)}
                delta={
                  c.periodReach.freq >= 3
                    ? { dir: 'down', label: `${en ? 'Freq.' : 'Frec.'} ${c.periodReach.freq.toFixed(1)}` }
                    : { dir: 'flat', label: `${en ? 'Freq.' : 'Frec.'} ${c.periodReach.freq.toFixed(1)}` }
                }
                footnote={t.reachFootFreq(c.periodReach.freq.toFixed(1))}
              />
            ))}
          </div>
        </>
      )}

      {/* ── Resultados por anuncio (creativos) ── */}
      {per.some(({ c }) => c.ads?.length) && (
        <>
          <SectionHeader title={t.adsSection} />
          {per.filter(({ c }) => c.ads?.length).map(({ c }) => {
            const ads = [...c.ads].sort((a, b) => b.lc / b.imp - a.lc / a.imp);
            const eligible = ads.filter((a) => a.lc >= 5);
            const bestCtr = eligible[0];
            const bestCpc = eligible.length
              ? eligible.reduce((a, b) => (b.spend / b.lc < a.spend / a.lc ? b : a), eligible[0])
              : null;
            return (
              <DataTable
                key={c.id}
                title={kindOf(c)}
                note={t.adsCount(ads.length)}
                headers={[t.thAd, t.thSpend, t.thReach, t.thImp, t.thLc, t.thCtr, t.cpcShort]}
                rows={ads.map((a) => [
                  a.name,
                  money(a.spend),
                  a.reach != null ? numEs(a.reach) : '—',
                  numEs(a.imp),
                  numEs(a.lc),
                  pct((a.lc / a.imp) * 100),
                  a.lc ? money(a.spend / a.lc) : '—',
                ])}
                foot={
                  bestCtr && bestCpc
                    ? t.adsRead(
                        bestCtr.name,
                        pct((bestCtr.lc / bestCtr.imp) * 100),
                        bestCpc.name,
                        money(bestCpc.spend / bestCpc.lc),
                      )
                    : null
                }
              />
            );
          })}
        </>
      )}

      {/* ── Desglose por plataforma ── */}
      {per.some(({ c }) => c.platforms?.length) && (
        <>
          <SectionHeader title={t.platSection} />
          {per.filter(({ c }) => c.platforms?.length).map(({ c }) => {
            const hasResults = c.platforms.some((r) => r.results != null);
            const anTop =
              c.platforms.filter((r) => r.imp >= 250).sort((a, b) => b.lc / b.imp - a.lc / a.imp)[0]?.p ===
              'Audience Network';
            return (
              <DataTable
                key={c.id}
                title={kindOf(c)}
                headers={[t.thPlat, t.thReach, t.thImp, t.thSpend, t.thLc, t.thCtr, ...(hasResults ? [t.thConvs] : [])]}
                rows={c.platforms.map((r) => [
                  r.p,
                  numEs(r.reach),
                  numEs(r.imp),
                  money(r.spend),
                  numEs(r.lc),
                  r.imp ? pct((r.lc / r.imp) * 100) : '—',
                  ...(hasResults ? [r.results ?? '—'] : []),
                ])}
                foot={anTop ? t.platAnNote : null}
              />
            );
          })}
        </>
      )}

      {/* ── Desglose por género ── */}
      {per.some(({ c }) => c.gender?.length) && (
        <>
          <SectionHeader title={t.genderSection} />
          {per.filter(({ c }) => c.gender?.length).map(({ c }) => {
            const hasResults = c.gender.some((r) => r.results != null);
            const convParts = hasResults
              ? c.gender
                  .filter((r) => r.results)
                  .map((r) => `${t.genderLabels[r.g] ?? r.g} (${r.results})`)
                  .join(' · ')
              : null;
            return (
              <DataTable
                key={c.id}
                title={kindOf(c)}
                headers={[t.thGender, t.thReach, t.thImp, t.thSpend, t.thLc, t.thCtr, ...(hasResults ? [t.thConvs] : [])]}
                rows={c.gender.map((r) => [
                  t.genderLabels[r.g] ?? r.g,
                  r.reach != null ? numEs(r.reach) : '—',
                  numEs(r.imp),
                  money(r.spend),
                  numEs(r.lc),
                  r.imp ? pct((r.lc / r.imp) * 100) : '—',
                  ...(hasResults ? [r.results ?? 0] : []),
                ])}
                foot={convParts ? t.genderConvRead(convParts) : null}
              />
            );
          })}
        </>
      )}

      {/* ── Desglose por edad ── */}
      {per.some(({ c }) => c.age?.length) && (
        <>
          <SectionHeader title={t.ageSection} />
          {per.filter(({ c }) => c.age?.length).map(({ c }) => {
            const hasResults = c.age.some((r) => r.results != null);
            const eligible = c.age.filter((r) => r.imp >= 200 && r.lc > 0);
            const bestAge = eligible.length
              ? eligible.reduce((a, b) => (b.lc / b.imp > a.lc / a.imp ? b : a), eligible[0])
              : null;
            const convParts = hasResults
              ? c.age
                  .filter((r) => r.results)
                  .map((r) => `${r.a} (${r.results})`)
                  .join(' · ')
              : null;
            return (
              <DataTable
                key={c.id}
                title={kindOf(c)}
                headers={[t.thAge, t.thReach, t.thImp, t.thSpend, t.thLc, t.thCtr, ...(hasResults ? [t.thConvs] : [])]}
                rows={c.age.map((r) => [
                  r.a,
                  numEs(r.reach),
                  numEs(r.imp),
                  money(r.spend),
                  numEs(r.lc),
                  r.imp ? pct((r.lc / r.imp) * 100) : '—',
                  ...(hasResults ? [r.results ?? 0] : []),
                ])}
                foot={
                  <>
                    {bestAge ? t.ageRead(bestAge.a, pct((bestAge.lc / bestAge.imp) * 100)) : null}
                    {convParts ? t.ageConvRead(convParts) : null}
                  </>
                }
              />
            );
          })}
        </>
      )}

      {/* ── Alcance del reporte (qué falta y de dónde sale) ── */}
      <SectionHeader title={t.missingSection} />
      <div className="mb-5 rounded-cu border border-cu-border border-l-4 border-l-cu-cyan bg-cu-cyan/[0.05] px-5 py-3.5 text-[11.5px] leading-relaxed text-cu-dgrey">
        <p className="mb-2">{t.missingIntro}</p>
        <ul className="list-disc space-y-1 pl-5">
          {(geo.hsForm ? t.missingPs : t.missingCu).map((m, i) => (
            <li key={i}>{m}</li>
          ))}
        </ul>
      </div>

      {!isExternalReport() && (
        <>
          <SectionHeader title={t.nextSection} />
          <NextStepsPanel steps={genGeoNextSteps(geo, lang)} subtitle={`${accName} · ${geo.event}`} />
        </>
      )}

      <Glossary keys={t.glossaryKey} />
    </div>
  );
}
