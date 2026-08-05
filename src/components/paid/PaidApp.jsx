import { useState, useEffect } from 'react';
import { CalendarClock } from 'lucide-react';
import { listAccounts } from '@/services/paidService';
import { usePaidMonthly } from '@/hooks/usePaidMonthly';
import { MONTHS_2026 } from '@/constants/periods';
import { hasData } from '@/utils/hasData';
import { genPaidInsights, genPaidConclusions, genPaidNextSteps, campaignStatus } from '@/utils/paidInsights';
import { PAID_STR, MONTHS_EN } from '@/utils/paidI18n';
import { InsightsPanel } from '@/components/shared/InsightsPanel';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { KpiCard } from '@/components/shared/KpiCard';
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
import { isExternalReport } from '@/utils/reportAudience';

const numEs = (v) => Number(v || 0).toLocaleString('es-AR');
const pct = (v) =>
  Number(v || 0).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' %';
const money = (v, c) =>
  Number(v || 0).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' ' + (c || 'EUR');

const ALL = 'all';
const CMP = 'cmp';

// Fila de KPIs (sirve para totales de cuenta o para una campaña).
function KpiRow({ d, currency, partial, t }) {
  return (
    <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
      <KpiCard
        label={`${t.kImp}${partial ? t.partial : ''}`}
        value={numEs(d.impressions)}
        delta={{ dir: 'flat', label: `CTR ${pct(d.ctr)}` }}
      />
      <KpiCard label={t.kClk} value={numEs(d.clicks)} delta={{ dir: 'flat', label: `CPC ${money(d.cpc, currency)}` }} />
      <KpiCard
        label={t.kConv}
        value={numEs(d.conversions)}
        accent="green"
        delta={(d.conversions || 0) > 0 ? { dir: 'up', label: `▲ ${numEs(d.conversions)} ${t.leads}` } : { dir: 'down', label: `0 ${t.leads}` }}
        footnote={t.convRateFoot(pct(d.convRate))}
      />
      <KpiCard
        label={`${t.kCost}${partial ? t.partial : ''}`}
        value={money(d.cost, currency)}
        accent="amber"
        delta={(d.conversions || 0) > 0 ? { dir: 'flat', label: `${money(d.costPerConv, currency)}${t.perLead}` } : { dir: 'flat', label: t.noConv }}
      />
    </div>
  );
}

// Vista de UNA campaña (drill-down).
function CampaignDetail({ c, currency, accName, periodLabel, t, lang, detailGroups }) {
  const st = campaignStatus(c);
  return (
    <>
      <SectionHeader title={`${t.campaignWord} — ${c.name}`} note={[accName, periodLabel].filter(Boolean).join(' · ')} />
      <div className="mb-4 rounded-cu border border-cu-border border-l-4 border-l-cu-cyan bg-white px-4 py-3 text-[12.5px] text-cu-dgrey shadow-cu">
        <strong className="text-cu-dblue">{t.statusWord}: {t.status[st.key]}.</strong> {t.statusText[st.key]}
      </div>
      <KpiRow d={c} currency={currency} t={t} />
      <SectionHeader title={t.funnelSection} note={t.funnelNote} />
      <PaidFunnel totals={{ ...c, currency }} campaigns={[c]} lang={lang} />

      {/* Consumo semanal del presupuesto por grupo de anuncio — SOLO interno */}
      {!isExternalReport() && detailGroups.length > 0 && (
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
  const [view, setView] = useState(ALL);
  const [lang, setLang] = useState('es');
  useEffect(() => setView(ALL), [account, period]);

  const t = PAID_STR[lang];
  const accName = listAccounts().find((a) => a.id === account)?.name ?? '';
  const periodLabel =
    lang === 'en'
      ? MONTHS_EN[period] ?? period
      : MONTHS_2026.find((p) => p.id === period)?.label ?? period;

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
          detail={
            <>
              No hay datos de Paid Media importados de <strong>{accName}</strong> para{' '}
              <strong>{periodLabel}</strong>.
            </>
          }
        />
        <Glossary keys="paid" />
      </div>
    );
  }

  const tt = mo.totals;
  const c = tt.currency || 'EUR';
  const partial = Boolean(mo.partial);
  const selected = mo.campaigns.find((x) => x.name === view);

  const campOptions = [
    { id: ALL, label: t.allCampaigns },
    ...mo.campaigns.map((x) => ({ id: x.name, label: x.name })),
    { id: CMP, label: t.cmpCampaigns },
  ];

  return (
    <div className="animate-fade-in">
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
          detailGroups={(detail?.groups ?? []).filter((g) => g.camp === selected.name)}
        />
      ) : (
        <>
          <InsightsPanel
            title={t.insightsTitle}
            label={t.insightsLabel}
            subtitle={[accName, periodLabel, mo.channel].filter(Boolean).join(' · ')}
            items={genPaidInsights(mo, lang)}
            actionLabel={t.actionLabel}
            emptyText={t.emptyInsights}
          />

          <SectionHeader title={t.kpiSection} note={[accName, mo.objetivo].filter(Boolean).join(' · ')} />
          <KpiRow d={tt} currency={c} partial={partial} t={t} />

          <SectionHeader title={t.funnelSection} note={t.funnelNote} />
          <PaidFunnel totals={tt} campaigns={mo.campaigns} lang={lang} />

          <SectionHeader title={t.distSection} note={t.campaignsCount(mo.campaigns.length)} />
          <PaidCharts campaigns={mo.campaigns} currency={c} lang={lang} />

          {!isExternalReport() && detail?.groups?.length > 0 && (
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

          <SectionHeader title={t.tableSection} />
          <CampaignsTable campaigns={mo.campaigns} currency={c} title={t.tableTitle(mo.channel || 'Google Ads')} lang={lang} />

          <SectionHeader title={t.perfSection} />
          <ConclusionsPanel items={genPaidConclusions(mo, lang)} title={t.conclusionsTitle} />

          {!isExternalReport() && (
            <>
              <SectionHeader title={t.nextSection} />
              <NextStepsPanel steps={genPaidNextSteps(mo, lang)} subtitle={[accName, periodLabel].filter(Boolean).join(' · ')} title={t.nextTitle} />
            </>
          )}
        </>
      )}

      <Glossary keys={lang === 'en' ? 'paidEn' : 'paid'} />
    </div>
  );
}
