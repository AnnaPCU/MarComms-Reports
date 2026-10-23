import { CalendarClock } from 'lucide-react';
import { listAccounts, isMetaPeriod, isParallelPeriod, getParallel } from '@/services/paidService';
import { usePaidMonthly } from '@/hooks/usePaidMonthly';
import { MONTHS_2026 } from '@/constants/periods';
import { hasData } from '@/utils/hasData';
import { genPaidInsights, genPaidConclusions, genPaidNextSteps, campaignStatus } from '@/utils/paidInsights';
import { campaignPartial } from '@/utils/campaignPartial';
import { PAID_STR, MONTHS_EN } from '@/utils/paidI18n';
import { InsightsPanel } from '@/components/shared/InsightsPanel';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { KpiCard } from '@/components/shared/KpiCard';
import { HeroCard } from '@/components/shared/HeroCard';
import { Select } from '@/components/shared/Select';
import { SegmentedControl } from '@/components/shared/SegmentedControl';
import { NoDataScreen } from '@/components/shared/NoDataScreen';
import { Glossary } from '@/components/shared/Glossary';
import { PaidFunnel } from '@/components/paid/PaidFunnel';
import { PaidCharts } from '@/components/paid/PaidCharts';
import { CampaignsTable } from '@/components/paid/CampaignsTable';
import { ConclusionsPanel, NextStepsPanel } from '@/components/shared/PerformancePanels';
import { ComparativeCampaigns } from '@/components/paid/ComparativeCampaigns';
import { BudgetWeekly } from '@/components/paid/BudgetWeekly';
import { AdGroupsDetail } from '@/components/paid/AdGroupsDetail';
import { MetaGeoReport } from '@/components/paid/MetaGeoReport';
import { PaidAnnualReview } from '@/components/paid/PaidAnnualReview';
import { PaidComparative } from '@/components/paid/PaidComparative';
import { isExternalReport } from '@/utils/reportAudience';
import { CrmDealsCard } from '@/components/shared/CrmDealsCard';
import { usePillarCrm } from '@/hooks/usePillarCrm';
import { lgCols } from '@/utils/gridCols';
import { paidFmt } from '@/utils/paidFormat';
import { useReportLang } from '@/hooks/useReportLang';
import { usePersistentState } from '@/utils/persist';
import { periodItems } from '@/utils/periodWording';


const ALL = 'all';
const CMP = 'cmp';

// Fila de KPIs (sirve para totales de cuenta o para una campaña).
function KpiRow({ d, currency, partial, t, lang = 'es', extra = null }) {
  const { numEs, pct, money } = paidFmt(lang);
  // Conversiones es el indicador destacado (card azul marino, a la derecha),
  // como pidió el equipo el 9/10/2026.
  return (
    <div className={`mb-5 grid grid-cols-2 gap-3 ${lgCols(4 + (extra ? 1 : 0))}`}>
      <KpiCard
        label={`${t.kImp}${partial ? t.partial : ''}`}
        value={numEs(d.impressions)}
        delta={{ dir: 'flat', label: `CTR ${pct(d.ctr)}` }}
      />
      <KpiCard label={t.kClk} value={numEs(d.clicks)} delta={{ dir: 'flat', label: `CPC ${money(d.cpc, currency)}` }} />
      <KpiCard
        label={`${t.kCost}${partial ? t.partial : ''}`}
        value={money(d.cost, currency)}
        accent="amber"
        delta={(d.conversions || 0) > 0 ? { dir: 'flat', label: `${money(d.costPerConv, currency)}${t.perLead}` } : { dir: 'flat', label: t.noConv }}
      />
      <HeroCard label={t.kConv} value={numEs(d.conversions)} footnote={t.convRateFoot(pct(d.convRate))} />
      {extra}
    </div>
  );
}

// Vista de UNA campaña (drill-down).
function CampaignDetail({ c, currency, accName, periodLabel, t, lang, detailGroups, period }) {
  const st = campaignStatus(c);
  const part = campaignPartial(c, period);
  return (
    <>
      <SectionHeader title={`${t.campaignWord} — ${c.name}`} note={[accName, periodLabel].filter(Boolean).join(' · ')} />
      <div className="mb-4 rounded-cu border border-cu-border border-l-4 border-l-cu-cyan bg-white px-4 py-3 text-[12.5px] text-cu-dgrey shadow-cu">
        <strong className="text-cu-dblue">{t.statusWord}: {t.status[st.key]}.</strong> {t.statusText[st.key]}
      </div>
      {part && (
        <div className="mb-4 flex items-start gap-2 rounded-cu border border-amber-300 bg-amber-50 px-4 py-3 text-[12px] text-amber-800">
          <CalendarClock className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            <strong>{t.cPartialTitle}</strong> {t.cPartialNote(part.dateLabel(lang), part.activeDays, part.totalDays)}
          </span>
        </div>
      )}
      <KpiRow d={c} currency={currency} t={t} />
      <SectionHeader title={t.funnelSection} note={t.funnelNote} />
      <PaidFunnel totals={{ ...c, currency }} campaigns={[c]} lang={lang} />

      {/* Consumo semanal del presupuesto por grupo de anuncio */}
      {detailGroups.length > 0 && (
        <>
          <SectionHeader title={t.budgetSection} note={t.budgetNoteGroup} />
          <BudgetWeekly series={detailGroups.map((g) => ({ name: g.name, weeks: g.weeks }))} currency={currency} lang={lang} />
        </>
      )}

      {detailGroups.length > 0 && (
        <>
          <SectionHeader title={t.adgSection} note={t.adgNote(detailGroups.length)} />
          <AdGroupsDetail groups={detailGroups} currency={currency} lang={lang} />
        </>
      )}
    </>
  );
}

// Pilar Paid Media — reporte completo con selector global / campaña / comparativa.
// Idioma base español; toggle EN disponible (también en el descargable).
export function PaidApp({ account, period }) {
  const { mo, detail, loading } = usePaidMonthly(account, period);
  const crm = usePillarCrm('paid', account, period);
  // Vista elegida (todas / una campaña / comparativa), recordada por cuenta y período.
  const [savedView, setView] = usePersistentState(`paid.view.${account}.${period}`, ALL);
  const [lang, setLang] = useReportLang('es');
  // Campaña en paralelo: plataforma elegida (Google Ads por defecto, §22).
  const [platform, setPlatform] = usePersistentState(`paid.platform.${account}.${period}`, 'google');

  const t = PAID_STR[lang];
  const accName = listAccounts().find((a) => a.id === account)?.name ?? '';
  const par = isParallelPeriod(period) ? getParallel(account, period) : null;
  const periodLabel = par
    ? (lang === 'en' ? par.period.labelEn : par.period.label) ?? period
    : lang === 'en'
      ? MONTHS_EN[period] ?? period
      : MONTHS_2026.find((p) => p.id === period)?.label ?? period;

  // Campañas de Meta Ads (GEO de evento y otras cortas): reporte propio,
  // fuera del flujo mensual.
  if (isMetaPeriod(period)) {
    return <MetaGeoReport account={account} period={period} />;
  }

  // Campaña hecha en paralelo en Google Ads y Meta Ads: un selector de
  // plataforma arriba; cada una con sus métricas, nunca sumadas.
  const platformBar = par && (
    <div className="mb-4 flex flex-wrap items-end gap-3">
      <SegmentedControl
        label={t.platformLabel}
        value={platform === 'meta' ? 'meta' : 'google'}
        onChange={setPlatform}
        options={[
          { id: 'google', label: 'Google Ads' },
          { id: 'meta', label: 'Meta Ads' },
        ]}
      />
      <span className="max-w-[640px] pb-1 text-[10.5px] italic leading-snug text-cu-grey">{t.parallelNote}</span>
    </div>
  );
  if (par && platform === 'meta') {
    return (
      <div className="animate-fade-in">
        {platformBar}
        <MetaGeoReport account={account} period={period} />
      </div>
    );
  }

  // Resumen anual (acumulado Google Ads) y comparativa multi-cuenta.
  if (period === 'year-2026') return <PaidAnnualReview account={account} />;
  if (period === 'cmp') return <PaidComparative />;

  if (loading) {
    return (
      <div className="flex animate-fade-in items-center justify-center py-24 text-[13px] text-cu-grey">
        Cargando datos…
      </div>
    );
  }

  if (!hasData([mo].filter(Boolean))) {
    return (
      <div className="animate-fade-in">
        <NoDataScreen
          lang={lang}
          detail={
            lang === 'en' ? (
              <>
                No Paid Media data imported for <strong>{accName}</strong> for <strong>{periodLabel}</strong>.
              </>
            ) : (
              <>
                No hay datos de Paid Media importados de <strong>{accName}</strong> para{' '}
                <strong>{periodLabel}</strong>.
              </>
            )
          }
        />
        <Glossary keys={lang === 'en' ? 'paidEn' : 'paid'} />
      </div>
    );
  }

  const tt = mo.totals;
  const c = tt.currency || 'EUR';
  const partial = Boolean(mo.partial);
  // La vista guardada vale si sigue existiendo en este mes (si no, todas).
  const view = savedView === ALL || savedView === CMP || mo.campaigns.some((x) => x.name === savedView) ? savedView : ALL;
  const selected = mo.campaigns.find((x) => x.name === view);

  const campOptions = [
    { id: ALL, label: t.allCampaigns },
    ...mo.campaigns.map((x) => {
      const p = campaignPartial(x, period);
      return { id: x.name, label: p ? `${x.name} · ${t.cPartialChip(p.activeDays)}` : x.name };
    }),
    { id: CMP, label: t.cmpCampaigns },
  ];

  // Semanas del vuelo de Google (campaña en paralelo): dd/mm en ES, mm/dd en EN.
  const parWeeks = (par?.google?.weeks ?? [])
    .map((w) => (lang === 'en' ? `${Number(w.slice(5, 7))}/${Number(w.slice(8, 10))}` : `${Number(w.slice(8, 10))}/${Number(w.slice(5, 7))}`))
    .join(lang === 'en' ? ', ' : ' · ');

  return (
    <div className="animate-fade-in">
      {platformBar}
      {par && parWeeks && <div className="-mt-2 mb-4 text-[10.5px] text-cu-grey">{t.parGoogleWeeks(parWeeks)}</div>}
      {/* Selector de vista / campaña + idioma */}
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <Select label={t.viewLabel} value={view} onChange={setView} options={campOptions} />
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

      {mo.fx && (
        <div className="mb-4 rounded-cu border border-cu-border border-l-4 border-l-cu-cyan bg-white px-4 py-3 text-[11.5px] leading-relaxed text-cu-dgrey shadow-cu">
          <strong className="text-cu-dblue">{t.fxLead(mo.fx.to)}</strong>
          {t.fxRest(mo.fx.from, mo.fx.source)}
          <strong className="text-cu-dblue">
            1 {mo.fx.unit} ={' '}
            {Number(mo.fx.value).toLocaleString(lang === 'en' ? 'en-US' : 'es-AR', { maximumFractionDigits: mo.fx.decimals })}{' '}
            {mo.fx.quote}
          </strong>
          .
        </div>
      )}

      {partial && (
        <div className="mb-4 flex items-start gap-2 rounded-cu border border-amber-300 bg-amber-50 px-4 py-3 text-[12px] text-amber-800">
          <CalendarClock className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            <strong>{t.partialTitle}</strong> {mo.partialNote} {t.partialNote}
          </span>
        </div>
      )}

      {view === CMP ? (
        <ComparativeCampaigns mo={mo} currency={c} lang={lang} />
      ) : selected ? (
        <CampaignDetail
          c={selected}
          currency={c}
          accName={accName}
          periodLabel={periodLabel}
          t={t}
          lang={lang}
          period={period}
          detailGroups={(detail?.groups ?? []).filter((g) => g.camp === selected.name)}
        />
      ) : (
        <>
          <InsightsPanel
            title={t.insightsTitle}
            label={t.insightsLabel}
            subtitle={[accName, periodLabel, mo.channel].filter(Boolean).join(' · ')}
            items={periodItems(genPaidInsights(mo, lang, period), period, lang)}
            actionLabel={t.actionLabel}
            emptyText={t.emptyInsights}
          />

          <SectionHeader title={t.kpiSection} note={[accName, t.objectives?.[mo.objetivo] ?? mo.objetivo].filter(Boolean).join(' · ')} />
          <KpiRow d={tt} currency={c} partial={partial} t={t} lang={lang} extra={crm && <CrmDealsCard d={crm} lang={lang} />} />

          <SectionHeader title={t.funnelSection} note={t.funnelNote} />
          <PaidFunnel totals={tt} campaigns={mo.campaigns} lang={lang} />

          <SectionHeader title={t.distSection} note={t.campaignsCount(mo.campaigns.length)} />
          <PaidCharts campaigns={mo.campaigns} currency={c} lang={lang} />

          {detail?.groups?.length > 0 && (
            <>
              <SectionHeader title={t.budgetSection} note={t.budgetNoteCamp} />
              <BudgetWeekly
                series={Object.values(
                  detail.groups.reduce((acc, g) => {
                    const e = (acc[g.camp] ??= { name: g.camp, weeks: [] });
                    g.weeks.forEach((w) => {
                      const found = e.weeks.find((x) => x.w === w.w);
                      if (found) found.cost += w.cost;
                      else e.weeks.push({ w: w.w, cost: w.cost });
                    });
                    return acc;
                  }, {}),
                )}
                currency={c}
                lang={lang}
              />
            </>
          )}

          {/* Campaña en paralelo (una sola campaña de Google): el detalle por
              grupo va en la vista general, sin tener que entrar a la campaña. */}
          {par && detail?.groups?.length > 0 && (
            <>
              <SectionHeader title={t.adgSection} note={t.adgNote(detail.groups.length)} />
              <AdGroupsDetail groups={detail.groups} currency={c} lang={lang} />
            </>
          )}

          <SectionHeader title={t.tableSection} />
          <CampaignsTable campaigns={mo.campaigns} currency={c} title={t.tableTitle(mo.channel || 'Google Ads')} lang={lang} period={period} />

          <SectionHeader title={t.perfSection} />
          <ConclusionsPanel items={periodItems(genPaidConclusions(mo, lang), period, lang)} title={t.conclusionsTitle} />

          {!isExternalReport() && (
            <>
              <SectionHeader title={t.nextSection} />
              <NextStepsPanel steps={periodItems(genPaidNextSteps(mo, lang), period, lang)} subtitle={[accName, periodLabel].filter(Boolean).join(' · ')} title={t.nextTitle} />
            </>
          )}
        </>
      )}

      <Glossary keys={lang === 'en' ? 'paidEn' : 'paid'} />
    </div>
  );
}
