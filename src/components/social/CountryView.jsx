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
export function CountryView({ account, country, period }) {
  const cfg = getSegConfig(account);
  const cInfo = cfg?.countries.find((c) => c.id === country);
  const name = cInfo?.name ?? country;
  const d = useMemo(() => getSegCountry(account, country, period), [account, country, period]);
  const prev = useMemo(() => getPrevSegCountry(account, country, period), [account, country, period]);
  const tot = useMemo(() => getSegMonthTotals(account, period), [account, period]);
  const folBase = useMemo(() => getSegFolBase(account, country), [account, country]);
  const mesLabel = ML[period] || period;

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

  const insights = genCountryInsights(d, prev, tot, name);

  return (
    <div className="animate-fade-in">
      {hasPosts && (
        <InsightsPanel
          subtitle={`${cfg.label} · ${name} · ${mesLabel}`}
          items={insights}
        />
      )}

      {hasPosts ? (
        <>
          <SectionHeader
            title={`Indicadores Clave — Contenido de ${name}`}
            note={`${d.np} ${d.np === 1 ? 'publicación etiquetada' : 'publicaciones etiquetadas'} en ${mesLabel}`}
          />
          <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <KpiCard label="Impresiones" value={fmt(d.imp)} delta={computeDelta(d.imp, prev?.imp)} footnote="De las publicaciones del país" />
            <KpiCard label="Engagement Rate" value={Number(d.er).toFixed(1)} unit="%" delta={computeDelta(d.er, prev?.er)} />
            <KpiCard label="Clics" value={fmt(d.clk)} delta={computeDelta(d.clk, prev?.clk)} />
            <KpiCard label="Publicaciones" value={d.np} delta={computeDelta(d.np, prev?.np)} footnote="Posts etiquetados con el país" />
          </div>

          <SectionHeader title={`Top Publicaciones — ${name}`} note="Por impresiones" />
          <PostsTable posts={d.posts} />
        </>
      ) : (
        <div className="mb-5 rounded-cu border border-cu-border bg-white px-6 py-5 text-[12.5px] leading-relaxed text-cu-dgrey shadow-cu">
          Sin publicaciones etiquetadas para <strong>{name}</strong> en {mesLabel}. Se
          muestran solo los datos de audiencia por ubicación del país.
        </div>
      )}

      <SectionHeader title={`Audiencia — ${name}`} note="Por ubicación (LinkedIn)" />
      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="relative overflow-hidden rounded-cu border border-cu-border bg-white px-5 pb-3.5 pt-4 shadow-cu">
          <span className="absolute inset-y-0 left-0 w-[3px] bg-cu-cyan" />
          <div className="mb-2 flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.6px] text-cu-grey">
            <BrandIcon icon={Eye} tone="accent" size="sm" />
            Visualizaciones de página desde {name}
          </div>
          <div className="mb-2 text-[30px] font-bold leading-none tracking-tight text-cu-dblue">
            {num(d.vis)}
          </div>
          <div className="mt-1.5 text-[9px] italic leading-tight text-cu-grey">
            Visualizaciones del período por ubicación — no son visitantes únicos
          </div>
        </div>
        <div className="relative overflow-hidden rounded-cu border border-cu-border bg-white px-5 pb-3.5 pt-4 shadow-cu">
          <span className="absolute inset-y-0 left-0 w-[3px] bg-cu-cyan" />
          <div className="mb-2 flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.6px] text-cu-grey">
            <BrandIcon icon={Users} tone="accent" size="sm" />
            Seguidores de la cuenta en {name}
          </div>
          <div className="mb-2 text-[30px] font-bold leading-none tracking-tight text-cu-dblue">
            {num(folBase)}
          </div>
          <div className="mt-1.5 text-[9px] italic leading-tight text-cu-grey">
            Foto acumulada del último export de LinkedIn — no es un dato del mes
          </div>
        </div>
      </div>

      <div className="mb-5 rounded-cu border border-cu-border border-l-4 border-l-cu-cyan bg-cu-cyan/[0.05] px-5 py-3.5 text-[11.5px] leading-relaxed text-cu-dgrey">
        <strong className="text-cu-dblue">Cómo se arma este reporte por país:</strong>{' '}
        cada publicación se atribuye a {name} por su hashtag ({cInfo?.tag}) o mención de
        país; las métricas de contenido son las acumuladas de esos posts al momento del
        export
        {tot?.un ? (
          <> ({tot.un} {tot.un === 1 ? 'publicación regional del mes no se atribuye' : 'publicaciones regionales del mes no se atribuyen'} a ningún país)</>
        ) : null}
        . LinkedIn no segmenta por país los seguidores nuevos del mes ni los visitantes
        únicos, por eso esos indicadores solo existen a nivel {cfg.label}.
      </div>

      <Glossary keys="social" />
    </div>
  );
}
