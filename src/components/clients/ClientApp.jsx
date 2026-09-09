import { useEffect, useMemo, useState } from 'react';
import { initialLang } from '@/utils/reportLang';
import { getClient, pillarsWithData, periodsFor, latestPeriod } from '@/services/clientService';
import { useClientOverview } from '@/hooks/useClientOverview';
import { CLIENT_STR, PILLAR_NAMES } from '@/utils/clientI18n';
import { ML_EN } from '@/utils/socialI18n';
import { MONTHS_EN } from '@/utils/paidI18n';
import { SegmentedControl } from '@/components/shared/SegmentedControl';
import { NoDataScreen } from '@/components/shared/NoDataScreen';
import { isEmbedReport } from '@/utils/reportAudience';
import { ClientOverview } from '@/components/clients/ClientOverview';
import { SocialApp } from '@/components/social/SocialApp';
import { PaidApp } from '@/components/paid/PaidApp';
import { WebsiteApp } from '@/components/website/WebsiteApp';
import { EmailApp } from '@/components/email/EmailApp';
import { WebinarsApp } from '@/components/webinars/WebinarsApp';

const PILLAR_APP = { social: SocialApp, paid: PaidApp, website: WebsiteApp, email: EmailApp, webinars: WebinarsApp };

// Etiqueta de un período en el idioma elegido (los labels del seed son ES).
function periodLabel(p, lang) {
  if (lang !== 'en') return p.label;
  if (p.id === 'year-2026') return 'Year Summary 2026';
  return ML_EN[p.id] ?? MONTHS_EN[p.id] ?? p.label;
}

// ════════════════════════════════════════════════════════════════
//  Vista por CLIENTE (unidad de negocio + país/región). Solo existe para
//  los clientes con más de un pilar con datos. Arranca en la vista
//  General (lo más importante de cada pilar) y la botonera permite entrar
//  a cada pilar con exactamente la misma vista que tendría entrando por
//  el pilar, con su propio selector de período.
//  En el HTML descargado se muestra solo la vista General.
// ════════════════════════════════════════════════════════════════
export function ClientApp({ account }) {
  const client = getClient(account);
  const { overview } = useClientOverview(account);
  const [view, setView] = useState('general');
  const [lang, setLang] = useState(() => initialLang('es'));
  const [periods, setPeriods] = useState({}); // { [pilar]: periodId }
  useEffect(() => {
    setView('general');
    setPeriods({});
  }, [account]);

  const t = CLIENT_STR[lang];
  const embed = isEmbedReport();
  const pillars = useMemo(() => (client ? pillarsWithData(client) : []), [client]);

  if (!client || pillars.length < 2) {
    return <NoDataScreen detail={t.noClient} />;
  }

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

  const viewOptions = [{ id: 'general', label: t.general }, ...pillars.map((p) => ({ id: p, label: PILLAR_NAMES[lang][p] }))];

  // ── Vista de un pilar: mismo componente que el pilar, con la cuenta
  //    (y el país, si segmenta) mapeada al cliente y su propio período.
  let pillarView = null;
  if (view !== 'general') {
    const ref = client.pillars[view];
    const list = periodsFor(view, ref);
    const pid = periods[view] ?? latestPeriod(view, ref)?.id ?? list[0]?.id ?? null;
    const Pilar = PILLAR_APP[view];
    const note = lang === 'en' ? (ref.noteEn ?? ref.note) : ref.note;
    pillarView = (
      <div className="animate-fade-in">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <SegmentedControl
            label={view === 'webinars' ? t.eventLabel : t.periodLabel}
            value={pid}
            onChange={(id) => setPeriods((prev) => ({ ...prev, [view]: id }))}
            size="sm"
            options={list.map((p) => ({ id: p.id, label: periodLabel(p, lang) }))}
          />
          {note && (
            <span className="text-[10.5px] italic text-cu-grey">
              {t.noteScope} {note}
            </span>
          )}
        </div>
        {pid && Pilar ? (
          <Pilar key={`${view}-${ref.account}-${pid}`} account={ref.account} period={pid} country={ref.country ?? null} />
        ) : (
          <NoDataScreen detail={t.noPillar} />
        )}
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Botonera de vistas (General + un botón por pilar con datos) + idioma */}
      {!embed && (
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <SegmentedControl label={t.viewLabel} value={view} onChange={setView} size="sm" options={viewOptions} />
          {view === 'general' && langToggle}
        </div>
      )}
      {embed && <div className="mb-4 flex justify-end">{langToggle}</div>}

      {view === 'general' ? <ClientOverview overview={overview} lang={lang} onOpen={setView} /> : pillarView}
    </div>
  );
}
