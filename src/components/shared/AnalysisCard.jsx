// Bloque "Análisis general" — texto narrativo al pie de los reportes.
export function AnalysisCard({ title = 'Análisis general', children }) {
  return (
    <div className="mb-5 rounded-cu border border-cu-border border-l-4 border-l-cu-cyan bg-white px-5 py-4 shadow-cu">
      <h3 className="mb-2 text-[12px] font-bold uppercase tracking-[0.5px] text-cu-dblue">
        {title}
      </h3>
      <p className="text-[12.5px] leading-relaxed text-cu-dgrey">{children}</p>
    </div>
  );
}
