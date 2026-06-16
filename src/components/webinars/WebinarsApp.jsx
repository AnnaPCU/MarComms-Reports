import { SectionHeader } from '@/components/shared/SectionHeader';
import { NoDataScreen } from '@/components/shared/NoDataScreen';
import { Glossary } from '@/components/shared/Glossary';

// Pilar Webinars (Livestorm). KPIs definidos en el glosario; muestra
// "Sin información suficiente" hasta que se importen datos.
export function WebinarsApp() {
  return (
    <div className="animate-fade-in">
      <SectionHeader title="Webinars" note="Fuente: Livestorm" />
      <NoDataScreen
        detail={
          <>
            El pilar <strong>Webinars</strong> todavía no tiene datos importados. Los KPIs a
            medir están definidos en el glosario de abajo.
          </>
        }
        hint={<>Pendiente del primer import (Livestorm)</>}
      />
      <Glossary keys="webinars" />
    </div>
  );
}
