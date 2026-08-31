import { useEffect, useState } from 'react';
import { listAccounts, getEvent } from '@/services/webinarsService';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { NoDataScreen } from '@/components/shared/NoDataScreen';
import { Glossary } from '@/components/shared/Glossary';
import { WebinarMixReport } from '@/components/webinars/WebinarMixReport';

const EMBED = typeof window !== 'undefined' ? window.__REPORT_EMBED__ : null;

// Pilar Webinars — reportes MIXTOS por evento (Livestorm + Mailchimp +
// LinkedIn + HubSpot). Cada evento es un período propio del filtro.
export function WebinarsApp({ account, period }) {
  const compute = () => getEvent(account, period);
  const [ev, setEv] = useState(compute);
  useEffect(() => {
    if (EMBED) return;
    setEv(getEvent(account, period));
  }, [account, period]);

  const accName = listAccounts().find((a) => a.id === account)?.name ?? '';

  if (!ev) {
    return (
      <div className="animate-fade-in">
        <SectionHeader title="Webinars" note="Livestorm + Mailchimp + LinkedIn + HubSpot" />
        <NoDataScreen
          detail={
            <>
              No hay datos importados para este evento. Los exports crudos van en la carpeta{' '}
              <strong>metricas/webinars/</strong> del proyecto.
            </>
          }
          hint={<>Evento con datos reales: <span className="font-bold text-cu-cyan">Webinar ISO 14064 · Jul 2026</span></>}
        />
        <Glossary keys="webinars" />
      </div>
    );
  }

  return <WebinarMixReport ev={ev} accName={accName} />;
}
