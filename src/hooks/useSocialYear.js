import { useEffect, useState } from 'react';
import { getYearSeries, getAudience } from '@/services/socialService';

// Hook del "Resumen del Año" (Social). Lee la serie mensual del seed; en
// modo embed (HTML descargado) usa el snapshot embebido.
const EMBED = typeof window !== 'undefined' ? window.__REPORT_EMBED__ : null;

function compute(account) {
  if (EMBED?.snapshot?.kind === 'social-year') {
    const s = EMBED.snapshot;
    return { accName: s.accName ?? '', series: s.series ?? [], audience: s.audience ?? { seniority: [], jobFunction: [] }, loading: false };
  }
  const { accName, series } = getYearSeries(account);
  return { accName, series, audience: getAudience(account), loading: false };
}

export function useSocialYear(account) {
  const [state, setState] = useState(() => compute(account));
  useEffect(() => {
    if (EMBED) return;
    setState(compute(account));
  }, [account]);
  return state;
}
