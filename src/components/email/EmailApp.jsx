import { SectionHeader } from '@/components/shared/SectionHeader';
import { NoDataScreen } from '@/components/shared/NoDataScreen';
import { Glossary } from '@/components/shared/Glossary';

// Pilar Email Marketing (Mailchimp / Apollo). KPIs definidos en el glosario;
// muestra "Sin información suficiente" hasta que se importen datos.
export function EmailApp() {
  return (
    <div className="animate-fade-in">
      <SectionHeader title="Email Marketing" note="Fuentes: Mailchimp · Apollo" />
      <NoDataScreen
        detail={
          <>
            El pilar <strong>Email Marketing</strong> todavía no tiene datos importados.
            Los KPIs a medir están definidos en el glosario de abajo.
          </>
        }
        hint={<>Pendiente del primer import (Mailchimp / Apollo)</>}
      />
      <Glossary keys="email" />
    </div>
  );
}
