import { TAGLINE } from '@/constants/brand';

// Tagline de marca — siempre al pie, nunca junto al logo (manual de marca).
export function Tagline() {
  return (
    <span className="text-[10px] font-bold uppercase tracking-[1.2px] text-cu-grey">
      {TAGLINE}
    </span>
  );
}
