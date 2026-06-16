import { CheckCircle2, AlertTriangle } from 'lucide-react';

// Badge de estado de datos en el header.
// variant: 'real' (datos reales) | 'nodata' (sin datos)
export function StatusBadge({ variant = 'real', children }) {
  const cls =
    variant === 'real'
      ? 'bg-cu-cyan/10 text-[#1372a5] border-cu-cyan/20'
      : 'bg-cu-grey/10 text-cu-grey border-cu-grey/25';
  const Icon = variant === 'real' ? CheckCircle2 : AlertTriangle;
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-[5px] text-[10px] font-medium ${cls}`}
    >
      <Icon className="h-3 w-3" />
      {children}
    </span>
  );
}
