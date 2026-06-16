import { LogOut, UploadCloud } from 'lucide-react';
import { Logo } from '@/components/brand/Logo';
import { Select } from '@/components/shared/Select';
import { StatusBadge } from '@/components/shared/StatusBadge';

// Header sticky: logo + etiqueta + filtros (cuenta/período) + estado + logout.
// Los filtros sólo aparecen si el pilar activo provee opciones.
export function Header({
  pilarLabel,
  accounts,
  account,
  onAccountChange,
  periods,
  period,
  onPeriodChange,
  badge,
  onImport,
  onLogout,
}) {
  const showFilters = accounts?.length > 0;
  return (
    <header className="sticky top-[5px] z-50 flex min-h-[68px] flex-wrap items-center gap-4 border-b border-cu-border bg-white px-9">
      <Logo />
      <div className="h-9 w-px shrink-0 bg-cu-border" />
      <div className="text-[11px] text-cu-grey">
        <strong className="block text-[13px] font-medium text-cu-dgrey">
          Reportes MarComms
        </strong>
        {pilarLabel} — Control Union
      </div>

      <div className="ml-auto flex flex-wrap items-end gap-3">
        {showFilters && (
          <>
            <Select
              label="Cuenta / Región"
              value={account}
              onChange={onAccountChange}
              options={accounts}
            />
            <Select
              label="Período"
              value={period}
              onChange={onPeriodChange}
              options={periods}
            />
          </>
        )}
        {badge && (
          <StatusBadge variant={badge.variant}>{badge.text}</StatusBadge>
        )}
        <button
          onClick={onImport}
          title="Importar datos"
          className="flex h-9 items-center gap-1.5 rounded-sm bg-cu-cyan px-3 text-[11px] font-bold text-white transition-colors hover:bg-[#2c9fd9]"
        >
          <UploadCloud className="h-3.5 w-3.5" />
          Importar
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
