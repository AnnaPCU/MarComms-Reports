import { useEffect, useState } from 'react';
import { getCampaign } from '@/services/emailService';

// Hook del pilar Email. Lee del seed en código; en modo embed (HTML
// descargado) usa el snapshot embebido. Devuelve { campaign, loading }.
const EMBED = typeof window !== 'undefined' ? window.__REPORT_EMBED__ : null;

function compute(account, period, campaignId) {
  if (EMBED?.snapshot && 'campaign' in EMBED.snapshot) {
    return { campaign: EMBED.snapshot.campaign ?? null, loading: false };
  }
  return { campaign: getCampaign(account, period, campaignId), loading: false };
}

// `campaignId` elige la campaña cuando el mes tiene más de una.
export function useEmailCampaign(account, period, campaignId = null) {
  const [state, setState] = useState(() => compute(account, period, campaignId));

  useEffect(() => {
    if (EMBED) return; // embed: datos fijos del snapshot
    setState(compute(account, period, campaignId));
  }, [account, period, campaignId]);

  return state;
}
