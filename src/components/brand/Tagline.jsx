import { TAGLINES } from '@/constants/brand';

// Tagline de marca — siempre al pie, nunca junto al logo (manual de marca).
// `brand` = marca del cliente del reporte ('cu' | 'peterson').
export function Tagline({ brand = 'cu' }) {
  return (
    <span className="text-[10px] font-bold uppercase tracking-[1.2px] text-cu-grey">
      {TAGLINES[brand] ?? TAGLINES.cu}
    </span>
  );
}
