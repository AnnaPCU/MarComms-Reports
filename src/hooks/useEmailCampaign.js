import { useEffect, useState } from 'react';
import { getCampaign } from '@/services/emailService';

// Hook del pilar Email. Lee del seed en código; en modo embed (HTML
// descargado) usa el snapshot embebido. Devuelve { campaign, loading }.
const EMBED = typeof window !== 'undefined' ? window.__REPORT_EMBED__ : null;

function compute(account, period) {
  if (EMBED?.snapshot && 'campaign' in EMBED.snapshot) {
    return { campaign: EMBED.snapshot.campaign ?? null, loading: false };
  }
  return { campaign: getCampaign(account, period), loading: false };
}

export function useEmailCampaign(account, period) {
  const [state, setState] = useState(() => compute(account, period));

  useEffect(() => {
    if (EMBED) return; // embed: datos fijos del snapshot
    setState(compute(account, period));
  }, [account, period]);

  return state;
}
