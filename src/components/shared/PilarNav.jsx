import { PILARES } from '@/constants/pilares';

// Navegación horizontal de pilares. El pilar activo lleva el acento cyan;
// los pilares sin datos todavía muestran un punto tenue.
export function PilarNav({ active, onChange }) {
  return (
    <nav className="flex flex-wrap gap-1 border-b border-cu-border bg-white px-9">
      {PILARES.map((p) => {
        const Icon = p.icon;
        const isActive = p.id === active;
        return (
          <button
            key={p.id}
            onClick={() => onChange(p.id)}
            className={`relative flex items-center gap-2 px-3 py-3 text-[12px] font-medium transition-colors ${
              isActive
                ? 'text-cu-dblue'
                : 'text-cu-grey hover:text-cu-dgrey'
            }`}
          >
            <Icon className="h-4 w-4" strokeWidth={isActive ? 2.4 : 1.8} />
            {p.label}
            {!p.ready && (
              <span
                title="Sin datos todavía"
                className="h-1.5 w-1.5 rounded-full bg-cu-grey/40"
              />
            )}
            {isActive && (
              <span className="absolute inset-x-2 -bottom-px h-[2px] rounded-t bg-cu-cyan" />
            )}
          </button>
        );
      })}
    </nav>
  );
}
