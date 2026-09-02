import { useMemo } from 'react';
import { Users, Eye } from 'lucide-react';
import {
  getSegConfig,
  getSegCountry,
  getPrevSegCountry,
  getSegMonthTotals,
  getSegFolBase,
} from '@/services/socialService';
import { ML } from '@/data/socialSeed';
import { genCountryInsights } from '@/utils/socialInsights';
import { SOCIAL_STR, ML_EN } from '@/utils/socialI18n';
import { fmt, num, computeDelta } from '@/utils/format';
import { InsightsPanel } from '@/components/shared/InsightsPanel';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { KpiCard } from '@/components/shared/KpiCard';
import { NoDataScreen } from '@/components/shared/NoDataScreen';
import { BrandIcon } from '@/components/shared/BrandIcon';
import { PostsTable } from '@/components/social/PostsTable';
import { Glossary } from '@/components/shared/Glossary';

// ════════════════════════════════════════════════════════════════
//  Reporte mensual POR PAÍS dentro de una cuenta LinkedIn segmentada
//  (CU Latinoamérica, CU North America).
//  Metodología (regla de honestidad — solo datos reales del export):
//  · Posts atribuidos al país por su hashtag (#ControlUnionArgentina,
//    #ControlUnionUSA…) o por el país nombrado en la primera línea. Las
//    métricas por post son acumuladas al momento del export, por eso la
//    base de cálculo difiere de los totales mensuales de la cuenta.
//  · Visualizaciones de página y seguidores por país: hojas de
//    "Ubicación" del export (seguidores = foto acumulada, no mensual).
//  LinkedIn NO segmenta por país: seguidores nuevos del mes, visitantes
//  únicos ni ER de página — esos indicadores no se muestran acá.
// ════════════════════════════════════════════════════════════════
export function CountryView({ account, country, period, lang = 'es' }) {
  const t = SOCIAL_STR[lang];
  const en = lang === 'en';
  const cfg = getSegConfig(account);
  const cInfo = cfg?.countries.find((c) => c.id === country);
  const name = cInfo?.name ?? country;
  const d = useMemo(() => getSegCountry(account, country, period), [account, country, period]);
  const prev = useMemo(() => getPrevSegCountry(account, country, period), [account, country, period]);
  const tot = useMemo(() => getSegMonthTotals(account, period), [account, period]);
  const folBase = useMemo(() => getSegFolBase(account, country), [account, country]);
  const mesLabel = en ? ML_EN[period] ?? ML[period] ?? period : ML[period] || period;

  const hasPosts = d && d.np > 0;
  const hasAudience = d && (d.vis > 0 || folBase > 0);

  if (!d || (!hasPosts && !hasAudience)) {
    return (
      <>
        <NoDataScreen
          detail={
            <>
              No hay publicaciones etiquetadas para <strong>{name}</strong> en{' '}
              <strong>{mesLabel}</strong> en la cuenta de {cfg?.label}, ni datos de
              audiencia por ubicación para el país.
            </>
          }
          hint={<>La atribución por país se hace por hashtag ({cInfo?.tag})</>}
        />
        <Glossary keys="social" />
      </>
    );
  }

  const insights = genCountryInsights(d, prev, tot, name, lang);

  return (
    <div className="animate-fade-in">
      {hasPosts && (
        <InsightsPanel
          subtitle={`${cfg.label} · ${name} · ${mesLabel}`}
          title={t.insightsTitle}
          label={t.insightLabel}
          actionLabel={t.actionLabel}
          emptyText={t.emptyInsights}
          items={insights}
        />
      )}

      {hasPosts ? (
        <>
          <SectionHeader title={t.cKpiSection(name)} note={t.cKpiNote(d.np, mesLabel)} />
          <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <KpiCard label={t.fImp} value={fmt(d.imp)} delta={computeDelta(d.imp, prev?.imp)} footnote={t.cImpFoot} />
            <KpiCard label={t.kEr} value={Number(d.er).toFixed(1)} unit="%" delta={computeDelta(d.er, prev?.er)} />
            <KpiCard label={t.fClk} value={fmt(d.clk)} delta={computeDelta(d.clk, prev?.clk)} />
            <KpiCard label={t.kPosts} value={d.np} delta={computeDelta(d.np, prev?.np)} footnote={t.cPostsFoot} />
          </div>

          <SectionHeader title={t.cTopSection(name)} note={t.byImpressions} />
          <PostsTable posts={d.posts} lang={lang} />
        </>
      ) : (
        <div className="mb-5 rounded-cu border border-cu-border bg-white px-6 py-5 text-[12.5px] leading-relaxed text-cu-dgrey shadow-cu">
          {t.cNoPosts(name, mesLabel)[0]}<strong>{name}</strong>{t.cNoPosts(name, mesLabel)[1]}
        </div>
      )}

      <SectionHeader title={t.cAudSection(name)} note={t.byLocation} />
      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="relative overflow-hidden rounded-cu border border-cu-border bg-white px-5 pb-3.5 pt-4 shadow-cu">
          <span className="absolute inset-y-0 left-0 w-[3px] bg-cu-cyan" />
          <div className="mb-2 flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.6px] text-cu-grey">
            <BrandIcon icon={Eye} tone="accent" size="sm" />
            {t.cVisLabel(name)}
          </div>
          <div className="mb-2 text-[30px] font-bold leading-none tracking-tight text-cu-dblue">
            {num(d.vis)}
          </div>
          <div className="mt-1.5 text-[9px] italic leading-tight text-cu-grey">
            {t.cVisFoot}
          </div>
        </div>
        <div className="relative overflow-hidden rounded-cu border border-cu-border bg-white px-5 pb-3.5 pt-4 shadow-cu">
          <span className="absolute inset-y-0 left-0 w-[3px] bg-cu-cyan" />
          <div className="mb-2 flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.6px] text-cu-grey">
            <BrandIcon icon={Users} tone="accent" size="sm" />
            {t.cFolLabel(name)}
          </div>
          <div className="mb-2 text-[30px] font-bold leading-none tracking-tight text-cu-dblue">
            {num(folBase)}
          </div>
          <div className="mt-1.5 text-[9px] italic leading-tight text-cu-grey">
            {t.cFolFoot}
          </div>
        </div>
      </div>

      <div className="mb-5 rounded-cu border border-cu-border border-l-4 border-l-cu-cyan bg-cu-cyan/[0.05] px-5 py-3.5 text-[11.5px] leading-relaxed text-cu-dgrey">
        {en ? (
          <>
            <strong className="text-cu-dblue">How this country report is built:</strong>{' '}
            each post is attributed to {name} by its hashtag ({cInfo?.tag}) or country
            mention; content metrics are those posts' accumulated figures at export time
            {tot?.un ? (
              <> ({tot.un} regional {tot.un === 1 ? 'post' : 'posts'} of the month not attributed to any country)</>
            ) : null}
            . LinkedIn does not segment new monthly followers or unique visitors by
            country, so those indicators only exist at the {cfg.label} level.
          </>
        ) : (
          <>
            <strong className="text-cu-dblue">Cómo se arma este reporte por país:</strong>{' '}
            cada publicación se atribuye a {name} por su hashtag ({cInfo?.tag}) o mención de
            país; las métricas de contenido son las acumuladas de esos posts al momento del
            export
            {tot?.un ? (
              <> ({tot.un} {tot.un === 1 ? 'publicación regional del mes no se atribuye' : 'publicaciones regionales del mes no se atribuyen'} a ningún país)</>
            ) : null}
            . LinkedIn no segmenta por país los seguidores nuevos del mes ni los visitantes
            únicos, por eso esos indicadores solo existen a nivel {cfg.label}.
          </>
        )}
      </div>

      <Glossary keys={t.glossaryKey} />
    </div>
  );
}
