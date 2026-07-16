import { X, Building2, Share2, Download } from 'lucide-react';

// Modal que pregunta si el reporte descargable es para uso interno o externo.
// En "externo" se oculta la sección "Conclusión — Próximos Pasos".
export function DownloadDialog({ onClose, onChoose }) {
  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center overflow-y-auto bg-cu-dblue/40 p-6" onClick={onClose}>
      <div className="my-16 w-full max-w-md animate-fade-in rounded-cu border border-cu-border bg-white shadow-cu-h" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-2.5 rounded-t-cu bg-cu-dblue px-5 py-3.5">
          <Download className="h-4 w-4 text-white" />
          <h2 className="text-[12px] font-bold uppercase tracking-[0.5px] text-white">Descargar reporte</h2>
          <button onClick={onClose} className="ml-auto text-white/70 hover:text-white" aria-label="Cerrar">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-5">
          <p className="mb-4 text-[13px] text-cu-dgrey">¿Deseás descargar el reporte para <strong className="text-cu-dblue">uso interno</strong> o <strong className="text-cu-dblue">uso externo</strong>?</p>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onChoose('internal')}
              className="group flex flex-col items-center gap-2 rounded-cu border border-cu-border bg-white px-4 py-5 text-center transition-colors hover:border-cu-cyan hover:bg-cu-cyan/[0.04]"
            >
              <Building2 className="h-6 w-6 text-cu-dblue" />
              <span className="text-[13px] font-bold text-cu-dblue">Uso interno</span>
              <span className="text-[10.5px] leading-tight text-cu-grey">Reporte completo (incluye próximos pasos)</span>
            </button>

            <button
              onClick={() => onChoose('external')}
              className="group flex flex-col items-center gap-2 rounded-cu border border-cu-border bg-white px-4 py-5 text-center transition-colors hover:border-cu-cyan hover:bg-cu-cyan/[0.04]"
            >
              <Share2 className="h-6 w-6 text-cu-cyan" />
              <span className="text-[13px] font-bold text-cu-dblue">Uso externo</span>
              <span className="text-[10.5px] leading-tight text-cu-grey">Para compartir con el cliente</span>
            </button>
          </div>

          <div className="mt-4 rounded-cu border border-cu-border2 bg-cu-bg px-3.5 py-2.5 text-[11.5px] leading-relaxed text-cu-grey">
            ℹ️ En el reporte de <strong className="text-cu-dgrey">uso externo</strong>, la sección
            <strong className="text-cu-dgrey"> «Conclusión — Próximos Pasos»</strong> no estará visible.
          </div>
        </div>
      </div>
    </div>
  );
}
