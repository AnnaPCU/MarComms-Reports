// Logo oficial Control Union (SVG extraído del dashboard original,
// guardado en /public/logo-control-union.svg). Se sirve como imagen
// para mantener el JSX limpio y respetar el manual de marca sin alterar
// colores ni proporciones.

export function Logo({ className = '' }) {
  return (
    <img
      src="/logo-control-union.svg"
      alt="Control Union"
      height={36}
      className={`block h-9 w-auto shrink-0 ${className}`}
    />
  );
}
