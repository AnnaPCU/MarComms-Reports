import { BRAND_LOGOS } from '@/constants/brand';

const EMBED = typeof window !== 'undefined' ? window.__REPORT_EMBED__ : null;

// Logo dinámico: muestra el de la marca de la cuenta cuyas métricas se ven.
//  brand = 'cu' | 'peterson' | null (null → no se muestra ningún logo).
//  En modo embed (HTML descargado) usa el data URI embebido para no romperse.
export function Logo({ brand = 'cu', className = '' }) {
  const fallback = BRAND_LOGOS[brand];
  const src = EMBED?.logoSrc && brand === EMBED.brand ? EMBED.logoSrc : fallback?.src;
  if (!src) return null;
  return (
    <img
      src={src}
      alt={fallback?.alt || 'Logo'}
      height={36}
      className={`block h-9 w-auto shrink-0 ${className}`}
    />
  );
}
