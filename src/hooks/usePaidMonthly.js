import { useEffect, useState } from 'react';
import { getMonthly } from '@/services/paidService';

// Hook del pilar Paid. Lee del seed en código; en modo embed usa el snapshot.
const EMBED = typeof window !== 'undefined' ? window.__REPORT_EMBED__ : null;

export function usePaidMonthly(account, period) {
  const [state, setState] = useState(() =>
    EMBED?.snapshot ? { mo: EMBED.snapshot.mo ?? null, loading: false } : { mo: getMonthly(account, period), loading: false },
  );

  useEffect(() => {
    if (EMBED) return; // embed: datos fijos
    setState({ mo: getMonthly(account, period), loading: false });
  }, [account, period]);

  return state;
}
