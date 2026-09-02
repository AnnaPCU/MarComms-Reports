import { useMemo, useState, useEffect } from 'react';
import { initialLang } from '@/utils/reportLang';
import { listAccounts, getSegConfig } from '@/services/socialService';
import { useSocialMonthly } from '@/hooks/useSocialMonthly';
import { ML } from '@/data/socialSeed';
import { monthHasData } from '@/utils/hasData';
import { genMonthlyInsights, genSocialConclusions, genSocialNextSteps } from '@/utils/socialInsights';
import { SOCIAL_STR, ML_EN } from '@/utils/socialI18n';
import { fmt, num, computeDelta } from '@/utils/format';
import { InsightsPanel } from '@/components/shared/InsightsPanel';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { KpiCard } from '@/components/shared/KpiCard';
import { NoDataScreen } from '@/components/shared/NoDataScreen';
import { Funnel } from '@/components/shared/Funnel';
import { ConclusionsPanel, NextStepsPanel } from '@/components/shared/PerformancePanels';
import { isExternalReport, isEmbedReport } from '@/utils/reportAudience';
import { viewState } from '@/utils/viewState';
import { AudienceCharts } from '@/components/social/AudienceCharts';
import { PostsTable } from '@/components/social/PostsTable';
import { ComparativeView } from '@/components/social/ComparativeView';
import { AnnualReview } from '@/components/social/AnnualReview';
import { CountryView } from '@/components/social/CountryView';
import { CountryYearView } from '@/components/social/CountryYearView';
import { SegmentedControl } from '@/components/shared/SegmentedControl';
import { Glossary } from '@/components/shared/Glossary';

// Vista del pilar Social Media (LinkedIn).
// Idioma base español; toggle EN disponible (también en el descargable).
export function SocialApp({ account, period }) {
  const accName = useMemo(
    () => listAccounts().find((a) => a.id === account)?.name ?? '',
    [account],
  );
  const [lang, setLang] = useState(() => initialLang('es'));
  const t = SOCIAL_STR[lang];
  const periodLabel = lang === 'en' ? ML_EN[period] ?? ML[period] ?? period : ML[period] || period;

  // Hook reactivo (seed local o Supabase + realtime). Se llama siempre,
  // antes de cualquier return, por las reglas de hooks.
  const { mo, prev, audience, loading } = useSocialMonthly(account, period);

  // Segmentación por país (CU Latinoamérica, CU North America): el reporte
  // de la cuenta se mantiene igual ('all') y se puede abrir el reporte de
  // cada país (posts por hashtag + audiencia por ubicación), tanto en la
  // vista mensual como en el Resumen del Año.
  // A diferencia del GEO de Paid, acá CADA PAÍS se descarga por su cuenta:
  // el HTML descargado queda fijo en la selección hecha (sin botonera) y
  // el país elegido viaja en window.__REPORT_EMBED__.socialCountry.
  const embedCountry =
    (typeof window !== 'undefined' && window.__REPORT_EMBED__?.socialCountry) || 'all';
  const [country, setCountry] = useState(embedCountry);
  useEffect(() => {
    setCountry(embedCountry);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);
  useEffect(() => {
    viewState.socialCountry = country;
    return () => {
      viewState.socialCountry = 'all';
    };
  }, [country]);
  const segCfg = getSegConfig(account);
  const isSeg = !!segCfg && (/^m\d\d$/.test(period) || period === 'year-2026');

  const langToggle = (
    <SegmentedControl
      value={lang}
      onChange={setLang}
      size="sm"
      options={[
        { id: 'es', label: 'ES' },
        { id: 'en', label: 'EN' },
      ]}
    />
  );

  const countrySelector = (
    <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
      {isSeg && !isEmbedReport() ? (
        <SegmentedControl
          label={t.reportLabel}
          value={country}
          onChange={setCountry}
          size="sm"
          options={[
            { id: 'all', label: segCfg.label },
            ...segCfg.countries.map((c) => ({ id: c.id, label: c.name })),
          ]}
        />
      ) : (
        <span />
      )}
      {langToggle}
    </div>
  );

  // Vista comparativa multi-cuenta.
  if (period === 'cmp')
    return (
      <>
        <div className="mb-4 flex justify-end">{langToggle}</div>
        <ComparativeView lang={lang} />
        <Glossary keys={t.glossaryKey} />
      </>
    );

  // Resumen del Año (progreso mes a mes de la cuenta o de un país).
  // AnnualReview trae su propio toggle de idioma; el selector externo
  // solo aplica a la vista por país.
  if (period === 'year-2026') {
    return (
      <div className="animate-fade-in">
        {isSeg && country !== 'all' ? (
          <>
            {countrySelector}
            <CountryYearView account={account} country={country} lang={lang} />
          </>
        ) : (
          <>
            {isSeg && !isEmbedReport() && (
              <div className="mb-4">
                <SegmentedControl
                  label={t.reportLabel}
                  value={country}
                  onChange={setCountry}
                  size="sm"
                  options={[
                    { id: 'all', label: segCfg.label },
                    ...segCfg.countries.map((c) => ({ id: c.id, label: c.name })),
                  ]}
                />
              </div>
            )}
            <AnnualReview account={account} />
          </>
        )}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex animate-fade-in items-center justify-center py-24 text-[13px] text-cu-grey">
        Cargando datos…
      </div>
    );
  }

  // Reporte mensual por país dentro de la cuenta segmentada.
  if (isSeg && country !== 'all') {
    return (
      <div className="animate-fade-in">
        {countrySelector}
        <CountryView account={account} country={country} period={period} lang={lang} />
      </div>
    );
  }

  // ── Regla de honestidad ──
  if (!monthHasData(mo)) {
    return (
      <>
        <NoDataScreen
          detail={
            <>
              No hay datos importados de <strong>{accName}</strong> para{' '}
              <strong>{ML[period] || period}</strong>. Importá el archivo
              correspondiente desde LinkedIn Analytics para verlos acá.
            </>
          }
          hint={
            <>
              Período con datos reales: <span className="font-bold text-cu-cyan">Mayo 2026</span>
            </>
          }
        />
        <Glossary keys="social" />
      </>
    );
  }

  const insights = genMonthlyInsights(mo, prev, lang);

  return (
    <div className="animate-fade-in">
      {countrySelector}
      <InsightsPanel
        subtitle={`${accName} · ${periodLabel}`}
        title={t.insightsTitle}
        label={t.insightLabel}
        actionLabel={t.actionLabel}
        emptyText={t.emptyInsights}
        items={insights}
      />

      <SectionHeader title={t.kpiSection} />
      <div className={`mb-5 grid grid-cols-2 gap-3 ${mo.np != null ? 'lg:grid-cols-5' : 'lg:grid-cols-4'}`}>
        <KpiCard label={t.kImp} value={fmt(mo.imp)} delta={computeDelta(mo.imp, prev?.imp)} />
        <KpiCard label={t.kEr} value={Number(mo.er).toFixed(1)} unit="%" delta={computeDelta(mo.er, prev?.er)} />
        <KpiCard label={t.kClk} value={fmt(mo.clk)} delta={computeDelta(mo.clk, prev?.clk)} />
        {mo.np != null && (
          <KpiCard label={t.kPosts} value={mo.np} delta={computeDelta(mo.np, prev?.np)} footnote={t.postsFoot} />
        )}
        <KpiCard
          label={t.kVis}
          value={mo.vis}
          delta={computeDelta(mo.vis, prev?.vis)}
          footnote={t.visFoot}
        />
      </div>

      <SectionHeader title={t.funnelSection} note={t.funnelNote} />
      <div className="mb-5 rounded-cu border border-cu-border bg-white px-7 pb-6 pt-6 shadow-cu">
        <div className="mx-auto max-w-[640px]">
          <Funnel
            stages={[
              {
                name: t.fImp,
                value: num(mo.imp),
                desc: t.fImpDesc(num(mo.imp)),
                retention: '100 %',
              },
              {
                name: t.fClk,
                value: num(mo.clk),
                desc: `ER ${Number(mo.er).toFixed(1)}%`,
                retention: mo.imp ? `${((mo.clk / mo.imp) * 100).toFixed(2)} %` : '—',
                drop: (
                  <>
                    CTR&nbsp;<b className="font-bold text-cu-cyan">{mo.imp ? ((mo.clk / mo.imp) * 100).toFixed(2) : '0'} %</b>&nbsp;· {t.fClkDropNote}
                  </>
                ),
              },
              {
                name: t.fVis,
                value: num(mo.vis),
                desc: t.fVisDesc(num(mo.fol)),
                retention: mo.clk ? `${((mo.vis / mo.clk) * 100).toFixed(1)} %` : '—',
                drop: (
                  <>
                    <b className="font-bold text-cu-cyan">{mo.clk ? ((mo.vis / mo.clk) * 100).toFixed(1) : '0'} %</b>&nbsp;· {t.fVisDropNote}
                  </>
                ),
              },
            ]}
          />
        </div>
      </div>

      <SectionHeader title={t.audSection} />
      <AudienceCharts audience={audience} lang={lang} />

      <SectionHeader title={t.topSection} />
      <PostsTable posts={mo.posts} lang={lang} />

      {/* Nota: mo.comp (benchmark de competidores) se almacena en el seed pero
          NO se muestra: los competidores del set son cuentas globales y la
          comparación no aplica. El dato queda disponible para uso futuro. */}
      <SectionHeader title={t.perfSection} />
      <ConclusionsPanel items={genSocialConclusions(mo, prev, lang)} title={t.conclusionsTitle} />

      {!isExternalReport() && (
        <>
          <SectionHeader title={t.nextSection} />
          <NextStepsPanel steps={genSocialNextSteps(mo, prev, lang)} subtitle={`${accName} · ${periodLabel}`} title={t.nextTitle} />
        </>
      )}

      <Glossary keys={t.glossaryKey} />
    </div>
  );
}
