import { useState } from 'react';
import { getPilarConfig } from '@/pilares/registry';
import { BarTop, BarBottom } from '@/components/brand/BrandBars';
import { MarCommsLogo, ClientLogo } from '@/components/brand/Logo';
import { Tagline } from '@/components/brand/Tagline';
import { SegmentedControl } from '@/components/shared/SegmentedControl';

// ════════════════════════════════════════════════════════════════
//  EMBED — render de la vista descargada, interactiva, sin header de
//  filtros, nav ni login. Los hooks/services leen el snapshot embebido
//  (window.__REPORT_EMBED__) en vez del seed.
//  Multi-período: si el archivo trae varios períodos (embed.periods),
//  se muestra una botonera para filtrar entre ellos — el snapshot del
//  período elegido se activa y la vista se remonta con esos datos.
// ════════════════════════════════════════════════════════════════
export function EmbedApp({ embed }) {
  const cfg = getPilarConfig(embed.pilar);
  const Pilar = cfg.Component;
  const multi = Array.isArray(embed.periods) && embed.periods.length > 1;
  const [pid, setPid] = useState(embed.period);
  const en = embed.lang === 'en';

  function changePeriod(id) {
    const p = embed.periods.find((x) => x.id === id);
    if (!p) return;
    // Los hooks leen window.__REPORT_EMBED__.snapshot al montar: activamos
    // el snapshot del período elegido y remontamos la vista (key={pid}).
    window.__REPORT_EMBED__.snapshot = p.snapshot;
    window.__REPORT_EMBED__.period = p.id;
    setPid(id);
  }

  return (
    <div className="flex min-h-screen flex-col">
      <BarTop />
      <header className="flex min-h-[68px] flex-wrap items-center gap-4 border-b border-cu-border bg-white px-9">
        <MarCommsLogo className="h-8" />
        <div className="h-9 w-px shrink-0 bg-cu-border" />
        <div className="text-[11px] text-cu-grey">
          <strong className="block text-[13px] font-medium text-cu-dgrey">{embed.title}</strong>
          {en ? 'Digital Marketing Report' : 'Reporte de Marketing Digital'}
        </div>
        {embed.brand && <ClientLogo brand={embed.brand} className="ml-auto" />}
      </header>

      <main className="mx-auto w-full max-w-[1440px] flex-1 px-9 pb-11 pt-6">
        {multi && (
          <div className="mb-4">
            <SegmentedControl
              label="Período"
              value={pid}
              onChange={changePeriod}
              size="sm"
              options={embed.periods.map((p) => ({ id: p.id, label: p.label }))}
            />
          </div>
        )}
        <Pilar key={pid} account={embed.account} period={pid} />
      </main>

      <BarBottom />
      {/* Al pie: logo MarComms (autor del reporte) enfrentado al tagline. */}
      <footer className="flex flex-wrap items-center justify-between gap-3 px-9 pb-5 pt-3.5">
        <MarCommsLogo className="h-5" />
        <Tagline />
      </footer>
    </div>
  );
}
