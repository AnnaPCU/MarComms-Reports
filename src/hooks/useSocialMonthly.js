import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import {
  fetchMonthly,
  fetchAudience,
  getMonthly,
  getPrevMonthly,
  getAudience,
  prevPeriodId,
} from '@/services/socialService';

// ════════════════════════════════════════════════════════════════
//  HOOK reactivo del pilar Social.
//  · Modo seed local (sin Supabase): devuelve el seed de forma síncrona.
//  · Modo Supabase: consulta la DB y se SUSCRIBE a realtime → cuando se
//    importan datos para (cuenta, período), la vista se refresca sola.
//  Devuelve siempre el mismo shape { mo, prev, audience }.
// ════════════════════════════════════════════════════════════════
export function useSocialMonthly(account, period) {
  const live = Boolean(supabase);

  const [state, setState] = useState(() =>
    live
      ? { mo: null, prev: null, audience: { seniority: [], jobFunction: [] }, loading: true }
      : {
          mo: getMonthly(account, period),
          prev: getPrevMonthly(account, period),
          audience: getAudience(account),
          loading: false,
        },
  );

  useEffect(() => {
    if (!live) {
      setState({
        mo: getMonthly(account, period),
        prev: getPrevMonthly(account, period),
        audience: getAudience(account),
        loading: false,
      });
      return;
    }

    let cancelled = false;
    async function load() {
      const prevId = prevPeriodId(period);
      const [mo, audience, prev] = await Promise.all([
        fetchMonthly(account, period),
        fetchAudience(account),
        prevId ? fetchMonthly(account, prevId) : Promise.resolve(null),
      ]);
      if (!cancelled) setState({ mo, prev, audience, loading: false });
    }

    setState((s) => ({ ...s, loading: true }));
    load();

    // Realtime: cualquier cambio en las tablas de esta cuenta re-dispara load().
    const channel = supabase
      .channel(`social-${account}-${period}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'social_metrics', filter: `client_id=eq.${account}` }, load)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'social_posts', filter: `client_id=eq.${account}` }, load)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'social_audience', filter: `client_id=eq.${account}` }, load)
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [account, period, live]);

  return state;
}
