import { getPilarConfig } from '@/pilares/registry';
import { BarTop, BarBottom } from '@/components/brand/BrandBars';
import { Logo } from '@/components/brand/Logo';
import { Tagline } from '@/components/brand/Tagline';

// ════════════════════════════════════════════════════════════════
//  EMBED — render de UNA sola vista (la descargada), interactiva, sin
//  header de filtros, nav ni login. Los hooks/services leen el snapshot
//  embebido (window.__REPORT_EMBED__) en vez de Supabase.
// ════════════════════════════════════════════════════════════════
export function EmbedApp({ embed }) {
  const cfg = getPilarConfig(embed.pilar);
  const Pilar = cfg.Component;

  return (
    <div className="flex min-h-screen flex-col">
      <BarTop />
      <header className="flex min-h-[68px] flex-wrap items-center gap-4 border-b border-cu-border bg-white px-9">
        {embed.brand && (
          <>
            <Logo brand={embed.brand} />
            <div className="h-9 w-px shrink-0 bg-cu-border" />
          </>
        )}
        <div className="text-[11px] text-cu-grey">
          <strong className="block text-[13px] font-medium text-cu-dgrey">Reportes MarComms</strong>
          {embed.title}
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1440px] flex-1 px-9 pb-11 pt-6">
        <Pilar account={embed.account} period={embed.period} />
      </main>

      <BarBottom />
      <footer className="flex items-center justify-between px-9 pb-5 pt-3.5">
        <p className="text-[10px] text-cu-grey">{embed.title} · PCU Group</p>
        <Tagline />
      </footer>
    </div>
  );
}
