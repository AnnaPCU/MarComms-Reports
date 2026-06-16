import { Inbox } from 'lucide-react';
import { NO_DATA_MESSAGE } from '@/utils/hasData';

// Pantalla de la regla de honestidad: se muestra cuando un período/pilar
// no tiene datos importados. NUNCA mostramos números inventados.
export function NoDataScreen({ detail, hint }) {
  return (
    <div className="mb-5 flex animate-fade-in flex-col items-center justify-center rounded-cu border border-cu-border bg-white px-8 py-20 text-center shadow-cu">
      <Inbox className="mb-5 h-12 w-12 text-cu-grey/60" strokeWidth={1.5} />
      <h2 className="mb-3 text-xl font-bold tracking-tight text-cu-dblue">
        {NO_DATA_MESSAGE}
      </h2>
      {detail && (
        <p className="mb-5 max-w-md text-sm leading-relaxed text-cu-dgrey">
          {detail}
        </p>
      )}
      {hint && (
        <div className="rounded-full border border-cu-border bg-cu-bg px-4 py-1.5 text-[11px] text-cu-grey">
          {hint}
        </div>
      )}
    </div>
  );
}
