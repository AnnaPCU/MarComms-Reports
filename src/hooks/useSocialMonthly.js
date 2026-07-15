import { useEffect, useState } from 'react';
import { getMonthly, getPrevMonthly, getAudience } from '@/services/socialService';

// ════════════════════════════════════════════════════════════════
//  HOOK del pilar Social. Lee del seed en código de forma síncrona.
//  En modo embed (HTML descargado) usa el snapshot embebido.
//  Devuelve siempre { mo, prev, audience, loading }.
// ════════════════════════════════════════════════════════════════
const EMBED = typeof window !== 'undefined' ? window.__REPORT_EMBED__ : null;

function compute(account, period) {
  if (EMBED?.snapshot) {
    const s = EMBED.snapshot;
    return {
      mo: s.mo ?? null,
      prev: s.prev ?? null,
      audience: s.audience ?? { seniority: [], jobFunction: [] },
      loading: false,
    };
  }
  return {
    mo: getMonthly(account, period),
    prev: getPrevMonthly(account, period),
    audience: getAudience(account),
    loading: false,
  };
}

export function useSocialMonthly(account, period) {
  const [state, setState] = useState(() => compute(account, period));

  useEffect(() => {
    if (EMBED) return; // embed: datos fijos del snapshot
    setState(compute(account, period));
  }, [account, period]);

  return state;
}
