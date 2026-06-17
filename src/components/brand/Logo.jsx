import { BRAND_LOGOS } from '@/constants/brand';

// Logo dinámico: muestra el de la marca de la cuenta cuyas métricas se ven.
//  brand = 'cu' | 'peterson' | null (null → no se muestra ningún logo).
export function Logo({ brand = 'cu', className = '' }) {
  const logo = BRAND_LOGOS[brand];
  if (!logo) return null;
  return (
    <img
      src={logo.src}
      alt={logo.alt}
      height={36}
      className={`block h-9 w-auto shrink-0 ${className}`}
    />
  );
}
