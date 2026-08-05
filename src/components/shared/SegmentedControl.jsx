// Botonera horizontal de filtrado (segmented control): opciones una al lado
// de la otra; la activa resalta en CU Dark Blue. Reemplaza a los <Select>
// cuando el filtro debe ser visible e inmediato (ej. período del reporte anual).
export function SegmentedControl({ label, value, onChange, options = [], size = 'md' }) {
  const pad = size === 'sm' ? 'px-3 py-[6px] text-[10px]' : 'px-3.5 py-[7px] text-[11px]';
  return (
    <div className="flex flex-col gap-[5px]">
      {label && (
        <span className="text-[9px] font-bold uppercase tracking-[0.6px] text-cu-grey">{label}</span>
      )}
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => {
          const active = o.id === value;
          return (
            <button
              key={o.id}
              onClick={() => onChange(o.id)}
              aria-pressed={active}
              className={`rounded-sm border font-bold uppercase tracking-[0.4px] transition-all ${pad} ${
                active
                  ? 'border-cu-dblue bg-cu-dblue text-white shadow-cu'
                  : 'border-cu-border bg-white text-cu-grey hover:border-cu-cyan hover:text-cu-dblue'
              }`}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
