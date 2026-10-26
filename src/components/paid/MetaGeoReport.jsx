import { useState } from 'react';
import { MapPin } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { listAccounts, getGeo } from '@/services/paidService';
import { aggAccount } from '@/data/paidMetaGeo';
import { GEO_STR, PAID_STR, fxDate } from '@/utils/paidI18n';
import { fxFactor, fxPair, getFx } from '@/services/fxService';
import { genGeoNextSteps } from '@/utils/paidInsights';
import { dayLabel, rangeLabel, deliveryWindow } from '@/utils/metaDates';
import { Funnel } from '@/components/shared/Funnel';
import { PAL, CU, CHART_TOOLTIP } from '@/constants/brand';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { KpiCard } from '@/components/shared/KpiCard';
import { SegmentedControl } from '@/components/shared/SegmentedControl';
import { NoDataScreen } from '@/components/shared/NoDataScreen';
import { ChartCard } from '@/components/shared/ChartCard';
import { NextStepsPanel } from '@/components/shared/PerformancePanels';
import { BrandIcon } from '@/components/shared/BrandIcon';
import { Glossary } from '@/components/shared/Glossary';
import { isExternalReport, getReportCurrency } from '@/utils/reportAudience';
import { useReportLang } from '@/hooks/useReportLang';

// ════════════════════════════════════════════════════════════════
//  Reporte de una campaña de Meta Ads (GEO de evento, como Aapresid, u
//  otra campaña corta de una o pocas semanas). Estructura: ficha →
//  resultados generales → Typeform vs WhatsApp / funnels (si se cargaron)
//  → evolución diaria → alcance único → creativos → desgloses → próximos
//  pasos → glosario. Lo propio de cada campaña (objetivo, segmentación,
//  notas) viene del seed; período y entrega efectiva salen de los días.
//  Regla de honestidad: solo datos de los exports de Meta; lo que falta
//  se declara, no se estima.
// ════════════════════════════════════════════════════════════════

// Formato numérico por idioma: es-AR en español, en-US en inglés.
const fmtNum = (loc) => (v) => Number(v || 0).toLocaleString(loc);
const fmtPct = (loc) => (v) =>
  Number(v || 0).toLocaleString(loc, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '%';

function moneyFor(currency, loc = 'es-AR') {
  const two = (v) => Number(v || 0).toLocaleString(loc, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return (v) =>
    currency === 'ARS'
      ? `${Math.round(Number(v || 0)).toLocaleString(loc)} ARS`
      : currency === 'USD'
        ? `US$ ${two(v)}`
        : `${two(v)} ${currency}`;
}

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
  const [lang, setLang] = useReportLang('es');
  // Vista por campaña (CU tiene 2): en la app se navega de a una para no
  // saturar; el HTML descargado trae SIEMPRE las dos vistas completas.
  const [view, setView] = useState('tf');
  const en = lang === 'en';
  const loc = en ? 'en-US' : 'es-AR';
  const numEs = fmtNum(loc);
  const pct = fmtPct(loc);
  const dec = (v, n) => Number(v).toLocaleString(loc, { minimumFractionDigits: n, maximumFractionDigits: n });
  const accName = listAccounts().find((a) => a.id === account)?.name ?? '';
  const geo = getGeo(account, period);
  // Textos base + los propios de la campaña (seed `texts`).
  const t = { ...GEO_STR[lang], ...(geo?.texts?.[lang] ?? {}) };
  // Descargable externo: ficha, alcance único, día por día, anuncios y
  // género son de uso interno (pedido del equipo, 26/10/2026).
  const external = isExternalReport();

  if (!geo) {
    return (
      <div className="animate-fade-in">
        <NoDataScreen
          lang={lang}
          detail={
            <>
              {t.noData(accName)}
              {(() => {
                const withData = listAccounts().filter((a) => getGeo(a.id, period)).map((a) => a.name);
                return withData.length ? t.noDataWith(withData.join(en ? ' and ' : ' y ')) : null;
              })()}
            </>
          }
        />
        <Glossary keys={en ? 'paidMetaEn' : 'paidMeta'} />
      </div>
    );
  }

  // Moneda del descargable (§19 de DECISIONES): importes aproximados de
  // referencia al tipo de cambio del cierre de la campaña. En la app y sin
  // elegir moneda, siempre la moneda original del export de Meta.
  const fxTo = getReportCurrency();
  const fxK = fxTo && fxTo !== geo.currency ? fxFactor(geo.currency, fxTo, period) : null;
  const moneyCur = moneyFor(fxK != null ? fxTo : geo.currency, loc);
  const money = fxK != null ? (v) => moneyCur(Number(v || 0) * fxK) : moneyCur;
  const fx = fxK != null ? { from: geo.currency, to: fxTo, date: getFx(period).date, ...fxPair(geo.currency, fxTo, period) } : null;
  const pt = PAID_STR[lang];
  const acc = aggAccount(geo);
  const per = acc.per; // [{c, t}] por campaña
  const tf = per.find((x) => x.c.kind === 'typeform');
  const wa = per.find((x) => x.c.kind === 'whatsapp');
  const kindOf = (c) => c.label?.[lang] ?? t.kindLabel[c.kind] ?? c.kind;
  // Campaña con resultado propio de Meta (conversaciones o leads del
  // formulario instantáneo), para la ficha y el KPI de resultados.
  const resC = per.find((x) => x.t.results != null);
  // Período: fechas del seed + entrega efectiva (días con impresiones).
  const pr = geo.period ?? {};
  const win = deliveryWindow(geo.campaigns);
  // Entrega efectiva solo si difiere del período (ej. días sin impresiones).
  const sameWin = win && win.start === pr.start && win.end === pr.end;
  const periodVal = t.fPeriodVal(
    rangeLabel(pr.start, pr.end, lang),
    win && !sameWin ? rangeLabel(win.start, win.end, lang, false) : null,
  );
  const effLabel = win ? rangeLabel(win.start, win.end, lang, false) : '';

  // Vista activa: con 2 campañas se muestra UNA por vez, también en el
  // HTML descargado (interno o externo): el archivo trae las dos vistas y
  // la botonera "Campaña" funciona offline para alternarlas. La ficha, la
  // comparativa y el glosario son comunes a ambas vistas.
  const multi = per.length > 1;
  const showAll = !multi;
  // Si la vista guardada no es una campaña de este período, arranca en la primera.
  const active = per.some((x) => x.c.id === view) ? view : per[0]?.c.id;
  const visible = showAll ? per : per.filter((x) => x.c.id === active);
  const showTfBlocks = Boolean(geo.typeform && tf) && (showAll || active === tf.c.id);
  const showWaFunnel = Boolean(wa) && (showAll || active === wa.c.id);

  // Agregados de las campañas visibles (Resultados Generales).
  const sums = visible.reduce(
    (a, { t: x }) => ({ spend: a.spend + x.spend, imp: a.imp + x.imp, lc: a.lc + x.lc, out: a.out + x.out }),
    { spend: 0, imp: 0, lc: 0, out: 0 },
  );
  const visAgg = {
    ...sums,
    ctr: sums.imp ? (sums.lc / sums.imp) * 100 : 0,
    outCtr: sums.imp ? (sums.out / sums.imp) * 100 : 0,
    cpc: sums.lc ? sums.spend / sums.lc : 0,
    cpm: sums.imp ? (sums.spend / sums.imp) * 1000 : 0,
  };

  // Datos para los charts diarios (una serie por campaña visible).
  // Solo los días de la entrega efectiva: el export diario puede traer el
  // rango completo del informe con días en cero antes y después del vuelo.
  const days = [...new Set(visible.flatMap(({ c }) => c.days.map((d) => d.d)))]
    .filter((d) => !win || (d >= win.start && d <= win.end))
    .sort();
  // `k`: factor de conversión para los importes (la inversión del día).
  const chart = (field, k = 1) =>
    days.map((d) => {
      const row = { d: dayLabel(d, en) };
      visible.forEach(({ c }) => {
        row[kindOf(c)] = (c.days.find((x) => x.d === d)?.[field] ?? 0) * k;
      });
      return row;
    });

  // Destino de cada anuncio (§21): resultados por destino de las campañas
  // visibles. Cada destino con su métrica; nunca se suman entre sí.
  const destOrder = ['web', 'typeform', 'hsform', 'phone', 'whatsapp'];
  const allDests = [...new Set(per.flatMap(({ c }) => (c.ads ?? []).map((a) => a.dest).filter(Boolean)))];
  const destRows = destOrder
    .map((d) => {
      const ads = visible.flatMap(({ c }) => (c.ads ?? []).filter((a) => a.dest === d));
      if (!ads.length) return null;
      const sum = (k) => ads.reduce((a, x) => a + (x[k] ?? 0), 0);
      const hasLpv = ads.some((x) => x.lpv != null);
      const value = d === 'web' ? sum('lc') : d === 'typeform' || d === 'hsform' ? sum('out') : null;
      return { d, n: ads.length, imp: sum('imp'), spend: sum('spend'), value, lpv: hasLpv ? sum('lpv') : null };
    })
    .filter(Boolean);

  // Comparativa simplificada Typeform vs WhatsApp: los "leads" del Typeform
  // son los formularios COMPLETOS; los de WhatsApp, las conversaciones.
  const tfLeads = geo.typeform ? geo.typeform.forms.reduce((a, f) => a + f.completed, 0) : 0;
  const cmpRows =
    tf && wa
      ? [
          [t.rows.spend, money(tf.t.spend), money(wa.t.spend)],
          [t.rows.imp, numEs(tf.t.imp), numEs(wa.t.imp)],
          [t.rows.lc, numEs(tf.t.lc), numEs(wa.t.lc)],
          [t.rows.ctr, pct(tf.t.ctr), pct(wa.t.ctr)],
          [t.rows.leads, numEs(tfLeads), numEs(wa.t.results ?? 0)],
          [
            t.rows.cpl,
            tfLeads ? money(tf.t.spend / tfLeads) : '—',
            wa.t.costPerResult ? money(wa.t.costPerResult) : '—',
          ],
        ]
      : null;

  return (
    <div className="animate-fade-in">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        {multi && !showAll ? (
          <SegmentedControl
            label={t.viewLabel}
            value={active}
            onChange={setView}
            options={per.map(({ c }) => ({ id: c.id, label: c.label?.[lang] ?? t.kindShort[c.kind] ?? kindOf(c) }))}
          />
        ) : (
          <span />
        )}
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

      {fx && (
        <div className="mb-4 rounded-cu border border-cu-border border-l-4 border-l-cu-cyan bg-white px-4 py-3 text-[11.5px] leading-relaxed text-cu-dgrey shadow-cu">
          <strong className="text-cu-dblue">{pt.fxLead(fx.to)}</strong>
          {pt.fxRest(fx.from, fx.source, fxDate(fx.date, lang))}
          <strong className="text-cu-dblue">
            1 {fx.unit} = {Number(fx.value).toLocaleString(loc, { maximumFractionDigits: fx.decimals })} {fx.quote}
          </strong>
          .
        </div>
      )}

      {/* ── Ficha del experimento — solo uso interno ── */}
      {!external && (
      <>
      <SectionHeader title={t.fichaSection} note={[accName, t.channel, geo.event].filter(Boolean).join(' · ')} />
      <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {geo.targeting && (
          <FichaCell
            label={String(period).startsWith('geo-') ? t.fGeo : t.fTargeting}
            value={geo.targeting[lang]}
            foot={en ? geo.targeting.footEn : geo.targeting.footEs}
            highlight
          />
        )}
        <FichaCell
          label={t.fObjective}
          value={
            geo.objective?.[lang] ??
            (allDests.length
              ? t.fObjectiveByDest(destOrder.filter((d) => allDests.includes(d)).map((d) => t.destLabel[d] ?? d).join(' · '))
              : t.fObjectiveFallback([...new Set(per.map(({ c }) => kindOf(c)))].join(' · ')))
          }
        />
        <FichaCell label={t.fPeriod} value={periodVal} />
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
          value={
            <>
              {per
                .filter(({ c }) => c.budget)
                .map(({ c }) => (
                  <div key={c.id}>{`${kindOf(c)}: ${money(c.budget)}`}</div>
                ))}
              <div className="mt-1 font-bold text-cu-dblue">{t.fBudgetTotal(money(acc.spend))}</div>
            </>
          }
          foot={per.map(({ c }) => c.attribution)[0] ? `${t.fAttribution}: ${per[0].c.attribution}` : null}
        />
        <FichaCell
          label={resC?.t.results ? t.fMainResult : t.fInvest}
          value={
            resC?.t.results
              ? `${t.resultsVal(resC.t.results, resC.c.kind)} · ${money(acc.spend)}`
              : money(acc.spend)
          }
          foot={resC?.c.results?.note?.[lang]}
        />
      </div>
      {!geo.hsForm && (
        <div className="mb-5 rounded-cu border border-cu-border bg-white px-4 py-2.5 text-[11px] italic leading-relaxed text-cu-grey shadow-cu">
          {t.fichaMissing}
        </div>
      )}
      </>
      )}

      {/* ── Resultados generales (de la vista activa) ── */}
      <SectionHeader
        title={t.kpiSection}
        note={[accName, t.channel, !showAll ? kindOf(visible[0].c) : null].filter(Boolean).join(' · ')}
      />
      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-3">
        <KpiCard label={t.kSpend} value={money(visAgg.spend)} accent="amber" />
        <KpiCard label={t.kImp} value={numEs(visAgg.imp)} delta={{ dir: 'flat', label: `${t.kCpm} ${money(visAgg.cpm)}` }} />
        <KpiCard label={t.kLc} value={numEs(visAgg.lc)} delta={{ dir: 'flat', label: `${t.ctrShort} ${pct(visAgg.ctr)}` }} footnote={`${t.cpcShort}: ${money(visAgg.cpc)}`} />
        <KpiCard label={t.kOut} value={numEs(visAgg.out)} delta={{ dir: 'flat', label: `${t.outCtrShort} ${pct(visAgg.outCtr)}` }} footnote={t.kOutFoot} />
        {visible
          .filter(({ c, t: x }) => x.results != null && (c.kind !== 'whatsapp' || showWaFunnel))
          .map(({ c, t: x }) => {
            const isLead = c.kind === 'leads';
            return (
              <KpiCard
                key={`res-${c.id}`}
                label={isLead ? t.kLeadsMeta : t.kConv}
                value={x.results ?? 0}
                accent="green"
                delta={{ dir: 'up', label: `▲ ${t.resultsVal(x.results ?? 0, c.kind)}` }}
                footnote={x.costPerResult ? (isLead ? t.kLeadsMetaFoot : t.kConvFoot)(money(x.costPerResult)) : null}
              />
            );
          })}
        {showTfBlocks && (() => {
          const starts = geo.typeform.forms.reduce((a, f) => a + f.starts, 0);
          const completed = geo.typeform.forms.reduce((a, f) => a + f.completed, 0);
          return (
            <KpiCard
              label={t.kTf}
              value={completed}
              accent="green"
              delta={{ dir: 'up', label: t.kTfDelta(starts) }}
              footnote={completed ? t.kTfFoot(money(tf.t.spend / completed)) : null}
            />
          );
        })()}
        {geo.hsForm && (
          <KpiCard
            label={t.kHs}
            value={geo.hsForm.submissions}
            accent="green"
            delta={{ dir: geo.hsForm.submissions > 0 ? 'up' : 'down', label: t.kHsDelta(geo.hsForm.views) }}
            footnote={t.kHsFoot(geo.hsForm.interactions)}
          />
        )}
      </div>

      {/* ── Resultados por destino del anuncio (§21) ── */}
      {destRows.length > 0 && (
        <>
          <SectionHeader title={t.destSection} note={t.destNote} />
          <DataTable
            title={!showAll ? kindOf(visible[0].c) : t.destSection}
            headers={[t.thDest, t.thAdsN, t.thImp, t.thSpend, t.thMeasure, t.thValue, t.thCostPer]}
            rows={destRows.map((r) => [
              t.destLabel[r.d] ?? r.d,
              numEs(r.n),
              numEs(r.imp),
              money(r.spend),
              <>
                {t.destMeasure[r.d] ?? '—'}
                {r.d === 'web' && (
                  <div className="text-[10px] italic text-cu-grey">{r.lpv != null ? t.destLpv(numEs(r.lpv)) : t.destLpvNone}</div>
                )}
              </>,
              r.value != null ? <b className="text-cu-dblue">{numEs(r.value)}</b> : '—',
              r.value ? money(r.spend / r.value) : '—',
            ])}
            foot={t.destFoot}
          />
        </>
      )}

      {/* ── Formularios fuera de Meta: contexto aparte, con su rango ── */}
      {geo.forms?.length > 0 && (
        <>
          <SectionHeader title={t.formsSection} note={t.formsNote} />
          <DataTable
            title={t.formsSection}
            headers={[t.thForm, t.thTool, t.thRange, t.thViewsF, t.thStartsF, t.thSubsF, t.thCompletion, t.thTime]}
            rows={geo.forms.map((f) => [
              f.name,
              t.toolLabel[f.tool] ?? f.tool,
              f.range?.[lang] ?? '—',
              f.views != null ? numEs(f.views) : '—',
              f.starts != null ? numEs(f.starts) : '—',
              f.subs != null ? numEs(f.subs) : '—',
              f.completion != null ? pct(f.completion) : '—',
              f.time ?? '—',
            ])}
            foot={t.formsFoot}
          />
        </>
      )}

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
                {cmpRows.map(([label, a, b]) => (
                  <tr key={label} className="border-b border-cu-border2 transition-colors hover:bg-cu-cyan/[0.03]">
                    <td className="px-3 py-2.5 text-[11px] font-medium text-cu-dgrey">{label}</td>
                    <td className="px-3 py-2.5 text-[12px] font-medium text-cu-dblue">{a}</td>
                    <td className="px-3 py-2.5 text-[12px] font-medium text-cu-dblue">{b}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* ── Funnel de conversión (CU): Typeform y/o WhatsApp según vista ── */}
      {(showTfBlocks || showWaFunnel) && geo.typeform && tf && (() => {
        const starts = geo.typeform.forms.reduce((a, f) => a + f.starts, 0);
        const completed = geo.typeform.forms.reduce((a, f) => a + f.completed, 0);
        const leads = geo.typeform.forms.flatMap((f) => f.leads);
        const both = showTfBlocks && showWaFunnel;
        return (
          <>
            <SectionHeader
              title={t.funnelSection}
              note={both ? t.funnelNoteCu : showTfBlocks ? t.funnelNoteTf : t.funnelNoteWa}
            />
            <div className={`mb-4 grid grid-cols-1 gap-3 ${both ? 'lg:grid-cols-2' : ''}`}>
              {showTfBlocks && (
              <div className="rounded-cu border border-cu-border bg-white px-6 pb-5 pt-5 shadow-cu">
                <div className="mb-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.5px] text-cu-dblue">
                  <span className="h-3 w-[3px] shrink-0 rounded-sm bg-cu-cyan" />
                  {kindOf(tf.c)}
                </div>
                <div className={both ? '' : 'mx-auto max-w-[640px]'}>
                <Funnel
                  stages={[
                    { name: t.fsImp, value: numEs(tf.t.imp), desc: t.fsImpDesc, retention: '100 %' },
                    {
                      name: t.fsOut,
                      value: numEs(tf.t.out),
                      desc: t.fsOutDesc,
                      retention: pct(tf.t.outCtr),
                      drop: <><b className="font-bold text-cu-cyan">{pct(tf.t.outCtr)}</b>&nbsp;· {t.ofImp}</>,
                    },
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
              )}
              {showWaFunnel && wa && (
                <div className="rounded-cu border border-cu-border bg-white px-6 pb-5 pt-5 shadow-cu">
                  <div className="mb-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.5px] text-cu-dblue">
                    <span className="h-3 w-[3px] shrink-0 rounded-sm bg-cu-cyan" />
                    {kindOf(wa.c)}
                  </div>
                  <div className={both ? '' : 'mx-auto max-w-[640px]'}>
                  <Funnel
                    stages={[
                      { name: t.fsImp, value: numEs(wa.t.imp), desc: t.fsImpDesc, retention: '100 %' },
                      {
                        name: t.fsClk,
                        value: numEs(wa.t.lc),
                        desc: t.fsClkDesc,
                        retention: pct(wa.t.ctr),
                        drop: <><b className="font-bold text-cu-cyan">{pct(wa.t.ctr)}</b>&nbsp;· {t.ofImp}</>,
                      },
                      {
                        name: t.fsConv,
                        value: numEs(wa.t.results ?? 0),
                        desc: t.fsConvDesc,
                        retention: pct(wa.t.lc ? ((wa.t.results ?? 0) / wa.t.lc) * 100 : 0),
                        drop: <><b className="font-bold text-cu-cyan">{pct(wa.t.lc ? ((wa.t.results ?? 0) / wa.t.lc) * 100 : 0)}</b>&nbsp;· {t.ofClk}</>,
                      },
                    ]}
                  />
                  </div>
                </div>
              )}
            </div>

            {/* Panel oficial de Typeform (todo el período, sin filtro de fechas) */}
            {showTfBlocks && geo.typeform.forms.some((f) => f.panel) && (
              <div className="mb-4 overflow-x-auto rounded-cu border border-cu-border bg-white px-5 py-4 shadow-cu">
                <div className="mb-3 flex flex-wrap items-baseline gap-2">
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.5px] text-cu-dblue">{t.tfPanelTitle}</h3>
                  <span className="text-[10px] text-cu-grey">{t.tfPanelNote}</span>
                </div>
                <table className="w-full min-w-[640px] border-collapse">
                  <thead>
                    <tr>
                      {[t.thForm, t.thViewsTf, t.thStartsAll, t.thSubs, t.thLeads, t.thCompletion, t.thTime].map((h) => (
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
                        <td className="px-3 py-2.5 text-[12px] text-cu-dgrey">{f.panel.subs}</td>
                        <td className="px-3 py-2.5 text-[12px] font-bold text-cu-dblue">{f.completed}</td>
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
            {showTfBlocks && geo.typeform.forms.some((f) => f.intent) && (
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
            {showTfBlocks && leads.length > 0 && (
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

          {t.hsNote && (
            <div className="mb-5 rounded-cu border border-cu-border bg-white px-4 py-2.5 text-[11px] italic leading-relaxed text-cu-grey shadow-cu">
              {t.hsNote}
            </div>
          )}
        </>
      )}

      {/* ── Evolución diaria ── */}
      <SectionHeader title={t.dailySection} note={effLabel ? t.dailyNote(effLabel) : null} />
      <div className="mb-3 grid grid-cols-1 gap-3 lg:grid-cols-2">
        <ChartCard title={t.chOutTitle} subtitle={t.chOutSub}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chart('out')} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke={CU.border2} />
              <XAxis dataKey="d" tick={{ fontSize: 10, fill: CU.grey }} />
              <YAxis tick={{ fontSize: 10, fill: CU.grey }} width={36} />
              <Tooltip {...CHART_TOOLTIP} cursor={{ fill: 'rgba(62,178,237,.06)' }} formatter={(v, n) => [numEs(v), n]} />
              <Legend wrapperStyle={{ fontSize: 10, color: CU.dgrey }} />
              {visible.map(({ c }, i) => (
                <Bar key={c.id} dataKey={kindOf(c)} fill={PAL[i % PAL.length]} radius={[3, 3, 0, 0]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title={t.chSpendTitle} subtitle={t.chSpendSub}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chart('spend', fxK ?? 1)} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke={CU.border2} />
              <XAxis dataKey="d" tick={{ fontSize: 10, fill: CU.grey }} />
              <YAxis tick={{ fontSize: 10, fill: CU.grey }} width={56} tickFormatter={(v) => numEs(v)} />
              <Tooltip {...CHART_TOOLTIP} cursor={{ fill: 'rgba(62,178,237,.06)' }} formatter={(v, n) => [moneyCur(v), n]} />
              <Legend wrapperStyle={{ fontSize: 10, color: CU.dgrey }} />
              {visible.map(({ c }, i) => (
                <Bar key={c.id} dataKey={kindOf(c)} fill={PAL[i % PAL.length]} radius={[3, 3, 0, 0]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Tabla día por día — solo uso interno */}
      {!external && (
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
              visible
                .map(({ c }) => ({ c, x: c.days.find((r) => r.d === d) }))
                .filter(({ x }) => x)
                .map(({ c, x }) => (
                  <tr key={`${d}-${c.id}`} className="border-b border-cu-border2 transition-colors hover:bg-cu-cyan/[0.03]">
                    <td className="px-3 py-2 text-[11px] font-medium text-cu-dblue">{dayLabel(d, en)}</td>
                    <td className="px-3 py-2 text-[11px] text-cu-dgrey">{kindOf(c)}</td>
                    <td className="px-3 py-2 text-[11.5px] font-medium text-cu-dblue">{money(x.spend)}</td>
                    <td className="px-3 py-2 text-[11.5px] text-cu-dgrey">{x.reach != null ? numEs(x.reach) : '—'}</td>
                    <td className="px-3 py-2 text-[11.5px] text-cu-dgrey">{x.freq != null ? dec(x.freq, 2) : '—'}</td>
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
      )}

      {/* ── Alcance único del período (export sin desglose diario) — solo uso interno ── */}
      {!external && visible.some(({ c }) => c.periodReach) && (
        <>
          <SectionHeader title={t.reachSection} note={t.reachNote} />
          <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {visible.filter(({ c }) => c.periodReach).map(({ c }) => (
              <KpiCard
                key={c.id}
                label={`${t.reachKpi} — ${kindOf(c)}`}
                value={numEs(c.periodReach.reach)}
                delta={
                  c.periodReach.freq >= 3
                    ? { dir: 'down', label: `${en ? 'Freq.' : 'Frec.'} ${dec(c.periodReach.freq, 1)}` }
                    : { dir: 'flat', label: `${en ? 'Freq.' : 'Frec.'} ${dec(c.periodReach.freq, 1)}` }
                }
                footnote={t.reachFootFreq(dec(c.periodReach.freq, 1))}
              />
            ))}
          </div>
          <div
            className="mb-5 rounded-cu border border-cu-border border-l-4 border-l-cu-cyan bg-cu-cyan/[0.05] px-5 py-3.5 text-[11.5px] leading-relaxed text-cu-dgrey [&_strong]:text-cu-dblue"
            dangerouslySetInnerHTML={{ __html: t.reachExplain }}
          />
        </>
      )}

      {/* ── Resultados por anuncio (creativos) — solo uso interno ── */}
      {!external && visible.some(({ c }) => c.ads?.length) && (
        <>
          <SectionHeader title={t.adsSection} />
          {visible.filter(({ c }) => c.ads?.length).map(({ c }) => {
            const ctrOf = (a) => (a.imp ? a.lc / a.imp : 0);
            const ads = [...c.ads].sort((a, b) => ctrOf(b) - ctrOf(a));
            const withDest = ads.some((a) => a.dest);
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
                headers={[t.thAd, ...(withDest ? [t.thDest] : []), t.thSpend, t.thReach, t.thImp, t.thLc, t.thCtr, t.cpcShort]}
                rows={ads.map((a) => [
                  a.name,
                  ...(withDest ? [a.dest ? t.destLabel[a.dest] ?? a.dest : '—'] : []),
                  money(a.spend),
                  a.reach != null ? numEs(a.reach) : '—',
                  numEs(a.imp),
                  numEs(a.lc),
                  pct(ctrOf(a) * 100),
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
      {visible.some(({ c }) => c.platforms?.length) && (
        <>
          <SectionHeader title={t.platSection} />
          {visible.filter(({ c }) => c.platforms?.length).map(({ c }) => {
            const anTop =
              c.platforms.filter((r) => r.imp >= 250).sort((a, b) => b.lc / b.imp - a.lc / a.imp)[0]?.p ===
              'Audience Network';
            return (
              <DataTable
                key={c.id}
                title={kindOf(c)}
                headers={[t.thPlat, t.thReach, t.thImp, t.thSpend, t.thLc, t.thCtr, t.thLeads]}
                rows={c.platforms.map((r) => [
                  r.p,
                  r.reach != null ? numEs(r.reach) : '—',
                  numEs(r.imp),
                  money(r.spend),
                  numEs(r.lc),
                  r.imp ? pct((r.lc / r.imp) * 100) : '—',
                  r.results ?? '—',
                ])}
                foot={anTop ? t.platAnNote : null}
              />
            );
          })}
        </>
      )}

      {/* ── Desglose por género — solo uso interno (la edad sí va al externo) ── */}
      {!external && visible.some(({ c }) => c.gender?.length) && (
        <>
          <SectionHeader title={t.genderSection} />
          {visible.filter(({ c }) => c.gender?.length).map(({ c }) => {
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
      {visible.some(({ c }) => c.age?.length) && (
        <>
          <SectionHeader title={t.ageSection} />
          {visible.filter(({ c }) => c.age?.length).map(({ c }) => {
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
                  r.reach != null ? numEs(r.reach) : '—',
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

      {!isExternalReport() && (
        <>
          <SectionHeader title={t.nextSection} />
          <NextStepsPanel steps={genGeoNextSteps(geo, lang)} subtitle={[accName, geo.event].filter(Boolean).join(' · ')} />
        </>
      )}

      <Glossary keys={t.glossaryKey} />
    </div>
  );
}
