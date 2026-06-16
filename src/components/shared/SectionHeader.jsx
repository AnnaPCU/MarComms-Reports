// Encabezado de sección: título cyan en mayúsculas + línea + nota opcional.
export function SectionHeader({ title, note }) {
  return (
    <div className="mb-3 mt-1 flex items-center gap-2.5">
      <h2 className="whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.8px] text-cu-cyan">
        {title}
      </h2>
      <div className="h-px flex-1 bg-cu-border" />
      {note && (
        <span className="whitespace-nowrap text-[9px] italic text-cu-grey">
          {note}
        </span>
      )}
    </div>
  );
}
