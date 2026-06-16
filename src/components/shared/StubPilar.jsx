import { SectionHeader } from '@/components/shared/SectionHeader';
import { NoDataScreen } from '@/components/shared/NoDataScreen';

// Vista provisional para los pilares cuyo import/KPIs aún no están definidos.
// Respeta la regla de honestidad: nada de números inventados.
export function StubPilar({ pilar }) {
  return (
    <div className="animate-fade-in">
      <SectionHeader
        title={pilar.label}
        note={`Fuentes: ${pilar.sources.join(' · ')}`}
      />
      <NoDataScreen
        detail={
          <>
            El pilar <strong>{pilar.label}</strong> todavía no tiene datos importados.
            Definí sus KPIs y el formato de import ({pilar.sources.join(', ')}) para
            habilitarlo.
          </>
        }
        hint={<>Pilar en preparación — pendiente de definición de métricas</>}
      />
    </div>
  );
}
