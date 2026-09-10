import { LogOut, Download } from 'lucide-react';
import { MarCommsLogo, ClientLogo } from '@/components/brand/Logo';
import { Select } from '@/components/shared/Select';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { brandOf } from '@/constants/brand';

// Header sticky: logo MarComms (marca principal, equipo autor del reporte) +
// pilar + cliente en segundo plano + filtros + estado + descargar HTML + logout.
export function Header({
  pilarLabel,
  accounts,
  account,
  onAccountChange,
  periods,
  period,
  onPeriodChange,
  periodFilterLabel = 'Período',
  accountFilterLabel = 'Cuenta / Región',
  hidePeriod = false,
  badge,
  demo = false, // TEMPORAL — modo demo: chip + descarga bloqueada
  onDownload,
  onLogout,
}) {
  const showFilters = accounts?.length > 0;
  const accountName = accounts?.find((a) => a.id === account)?.label ?? '';
  const brand = brandOf(account, accountName);

  return (
    <header className="sticky top-[5px] z-50 flex min-h-[68px] flex-wrap items-center gap-4 border-b border-cu-border bg-white px-9">
      <MarCommsLogo className="h-8" />
      <div className="h-9 w-px shrink-0 bg-cu-border" />
      <div className="text-[11px] text-cu-grey">
        <strong className="block text-[13px] font-medium text-cu-dgrey">{pilarLabel}</strong>
        Reportes de Marketing Digital
      </div>
      {brand && (
        <>
          <div className="h-6 w-px shrink-0 bg-cu-border2" />
          <ClientLogo brand={brand} />
        </>
      )}

      <div className="ml-auto flex flex-wrap items-end gap-3">
        {showFilters && (
          <>
            <Select label={accountFilterLabel} value={account} onChange={onAccountChange} options={accounts} />
            {!hidePeriod && <Select label={periodFilterLabel} value={period} onChange={onPeriodChange} options={periods} />}
          </>
        )}
        {badge && <StatusBadge variant={badge.variant}>{badge.text}</StatusBadge>}
        {demo && (
          <span
            data-demo-keep
            className="inline-flex items-center whitespace-nowrap rounded-full border border-amber-300 bg-amber-50 px-3 py-[5px] text-[10px] font-bold uppercase tracking-[0.5px] text-amber-800"
          >
            Demo · cifras ocultas
          </span>
        )}
        <button
          onClick={demo ? undefined : onDownload}
          disabled={demo}
          title={demo ? 'Descarga deshabilitada en modo demo' : 'Descargar esta vista como HTML'}
          className="flex h-9 items-center gap-1.5 rounded-sm border border-cu-border px-3 text-[11px] font-medium text-cu-dgrey transition-colors hover:border-cu-cyan hover:text-cu-cyan disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-cu-border disabled:hover:text-cu-dgrey"
        >
          <Download className="h-3.5 w-3.5" />
          Descargar
        </button>
        <button
          onClick={onLogout}
          title="Cerrar sesión"
          className="flex h-9 items-center gap-1.5 rounded-sm border border-cu-border px-3 text-[11px] text-cu-grey transition-colors hover:border-cu-cyan hover:text-cu-cyan"
        >
          <LogOut className="h-3.5 w-3.5" />
        </button>
      </div>
    </header>
  );
}
