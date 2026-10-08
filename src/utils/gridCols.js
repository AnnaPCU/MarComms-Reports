// Columnas de una tira de KPIs en escritorio. Tailwind no genera clases
// dinámicas: el mapa tiene las clases escritas completas.
// Pedido del equipo (8/10/2026): los indicadores clave van siempre en UNA
// tira horizontal (mejor 6 en una fila que 5 + 1 abajo).
const LG_COLS = {
  1: 'lg:grid-cols-1',
  2: 'lg:grid-cols-2',
  3: 'lg:grid-cols-3',
  4: 'lg:grid-cols-4',
  5: 'lg:grid-cols-5',
  6: 'lg:grid-cols-6',
  7: 'lg:grid-cols-7',
  8: 'lg:grid-cols-8',
};

export function lgCols(n) {
  return LG_COLS[Math.min(Math.max(n, 1), 8)];
}
