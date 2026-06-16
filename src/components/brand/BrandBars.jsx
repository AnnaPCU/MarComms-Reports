// Dispositivos gráficos del manual de marca CU:
//  · barra superior cyan full-width
//  · barra inferior dark blue alineada a la derecha

export function BarTop() {
  return <div className="h-[5px] w-full bg-cu-cyan" />;
}

export function BarBottom() {
  return (
    <div className="flex justify-end px-9">
      <div className="h-[5px] w-[65%] rounded-l-[3px] bg-cu-dblue" />
    </div>
  );
}
