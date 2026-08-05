import { useEffect, useState } from 'react';
import { getMonthly, getDetail } from '@/services/paidService';

// Hook del pilar Paid. Lee del seed en código; en modo embed usa el snapshot.
const EMBED = typeof window !== 'undefined' ? window.__REPORT_EMBED__ : null;

export function usePaidMonthly(account, period) {
  const [state, setState] = useState(() =>
    EMBED?.snapshot
      ? { mo: EMBED.snapshot.mo ?? null, detail: EMBED.snapshot.detail ?? null, loading: false }
      : { mo: getMonthly(account, period), detail: getDetail(account, period), loading: false },
  );

  useEffect(() => {
    if (EMBED) return; // embed: datos fijos
    setState({ mo: getMonthly(account, period), detail: getDetail(account, period), loading: false });
  }, [account, period]);

  return state;
}
