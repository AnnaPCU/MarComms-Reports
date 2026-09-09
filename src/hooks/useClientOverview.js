import { useEffect, useState } from 'react';
import { getOverview } from '@/services/clientService';

// Hook de la vista por cliente. Lee del seed (vía clientService); en modo
// embed (HTML descargado) usa el snapshot embebido. Devuelve { overview }.
const EMBED = typeof window !== 'undefined' ? window.__REPORT_EMBED__ : null;

function compute(clientId) {
  if (EMBED?.snapshot && 'overview' in EMBED.snapshot) return { overview: EMBED.snapshot.overview ?? null };
  return { overview: getOverview(clientId) };
}

export function useClientOverview(clientId) {
  const [state, setState] = useState(() => compute(clientId));

  useEffect(() => {
    if (EMBED) return; // embed: datos fijos del snapshot
    setState(compute(clientId));
  }, [clientId]);

  return state;
}
