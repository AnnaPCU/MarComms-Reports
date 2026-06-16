import { BookOpen } from 'lucide-react';
import { GLOSSARIES } from '@/constants/glossaries';

// Sección de glosario — imprescindible al final de cada reporte.
// `keys` permite renderizar más de un glosario (ej. Website + SEO).
export function Glossary({ keys }) {
  const list = (Array.isArray(keys) ? keys : [keys]).map((k) => GLOSSARIES[k]).filter(Boolean);
  if (list.length === 0) return null;

  return (
    <div className="mt-8">
      {list.map((g) => (
        <div
          key={g.title}
          className="mb-4 overflow-hidden rounded-cu border border-cu-border bg-white shadow-cu"
        >
          <div className="flex items-center gap-2.5 bg-cu-dblue px-5 py-3">
            <BookOpen className="h-4 w-4 text-white" />
            <h3 className="text-[11px] font-bold uppercase tracking-[0.5px] text-white">
              {g.title}
            </h3>
          </div>
          <dl className="grid grid-cols-1 md:grid-cols-2">
            {g.entries.map((e) => (
              <div
                key={e.term}
                className="border-b border-r border-cu-border2 p-4 last:border-b-0"
              >
                <dt className="mb-1 text-[12px] font-bold text-cu-dblue">{e.term}</dt>
                <dd className="text-[11.5px] leading-relaxed text-cu-dgrey">{e.def}</dd>
              </div>
            ))}
          </dl>
        </div>
      ))}
    </div>
  );
}
