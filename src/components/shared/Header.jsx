import { LogOut, Download } from 'lucide-react';
import { Logo } from '@/components/brand/Logo';
import { Select } from '@/components/shared/Select';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { brandOf } from '@/constants/brand';

// Header sticky: logo (dinámico según la cuenta) + etiqueta + filtros + estado +
// descargar HTML + logout.
export function Header({
  pilarLabel,
  accounts,
  account,
  onAccountChange,
  periods,
  period,
  onPeriodChange,
  badge,
  onDownload,
  onLogout,
}) {
  const showFilters = accounts?.length > 0;
  const accountName = accounts?.find((a) => a.id === account)?.label ?? '';
  const brand = brandOf(account, accountName);

  return (
    <header className="sticky top-[5px] z-50 flex min-h-[68px] flex-wrap items-center gap-4 border-b border-cu-border bg-white px-9">
      {brand && (
        <>
          <Logo brand={brand} />
          <div className="h-9 w-px shrink-0 bg-cu-border" />
        </>
      )}
      <div className="text-[11px] text-cu-grey">
        <strong className="block text-[13px] font-medium text-cu-dgrey">Reportes MarComms</strong>
        {pilarLabel}
      </div>

      <div className="ml-auto flex flex-wrap items-end gap-3">
        {showFilters && (
          <>
            <Select label="Cuenta / Región" value={account} onChange={onAccountChange} options={accounts} />
            <Select label="Período" value={period} onChange={onPeriodChange} options={periods} />
          </>
        )}
        {badge && <StatusBadge variant={badge.variant}>{badge.text}</StatusBadge>}
        <button
          onClick={onDownload}
          title="Descargar esta vista como HTML"
          className="flex h-9 items-center gap-1.5 rounded-sm border border-cu-border px-3 text-[11px] font-medium text-cu-dgrey transition-colors hover:border-cu-cyan hover:text-cu-cyan"
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
