// Helpers de formato (portados del dashboard original).

export function fmt(n) {
  if (n == null) return '—';
  return n >= 1000 ? (n / 1000).toFixed(1) + 'K' : String(n);
}

export function pct(n, decimals = 1) {
  if (n == null) return '—';
  return Number(n).toFixed(decimals) + '%';
}

// Devuelve {dir, label} para renderizar el delta vs período anterior.
// dir: 'up' | 'down' | 'flat' | 'none'
export function computeDelta(curr, prev) {
  if (prev == null || prev === 0) {
    return { dir: 'none', label: '— Sin dato previo' };
  }
  const p = ((curr - prev) / Math.abs(prev)) * 100;
  const dir = p > 0 ? 'up' : p < 0 ? 'down' : 'flat';
  const arrow = p > 0 ? '↑' : p < 0 ? '↓' : '→';
  return { dir, label: `${arrow} ${Math.abs(p).toFixed(1)}% vs mes ant.` };
}

export function num(n) {
  if (n == null) return '—';
  return n.toLocaleString('es-AR');
}
