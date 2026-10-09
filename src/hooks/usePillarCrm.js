import { useMemo } from 'react';
import { getPillarCrm } from '@/services/crmService';
import { CRM_UI_ENABLED } from '@/constants/crm';

// Deals de HubSpot de un pilar para la card «Deals generados» de
// Indicadores clave. Devuelve null si la cuenta no tiene entidad mapeada,
// si el período no aplica o si no hubo deals generados: un indicador que da
// cero no se muestra (pedido del equipo, 8/10/2026).
export function usePillarCrm(pilar, account, period, country = null) {
  return useMemo(() => {
    if (!CRM_UI_ENABLED) return null; // oculto por pedido del equipo (9/10/2026)
    const d = getPillarCrm(pilar, account, period, country);
    return d && d.generated > 0 ? d : null;
  }, [pilar, account, period, country]);
}
