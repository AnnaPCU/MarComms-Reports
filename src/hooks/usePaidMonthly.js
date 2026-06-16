import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { fetchMonthly, getMonthly } from '@/services/paidService';

// Hook reactivo del pilar Paid (igual patrón que useSocialMonthly):
// seed local sin Supabase; en Supabase lee + se suscribe a realtime para
// que la vista se refresque sola al importar.
export function usePaidMonthly(account, period) {
  const live = Boolean(supabase);
  const [state, setState] = useState(() =>
    live ? { mo: null, loading: true } : { mo: getMonthly(account, period), loading: false },
  );

  useEffect(() => {
    if (!live) {
      setState({ mo: getMonthly(account, period), loading: false });
      return;
    }
    let cancelled = false;
    async function load() {
      const mo = await fetchMonthly(account, period);
      if (!cancelled) setState({ mo, loading: false });
    }
    setState((s) => ({ ...s, loading: true }));
    load();

    const channel = supabase
      .channel(`paid-${account}-${period}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'paid_metrics', filter: `client_id=eq.${account}` }, load)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'paid_campaigns', filter: `client_id=eq.${account}` }, load)
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [account, period, live]);

  return state;
}
