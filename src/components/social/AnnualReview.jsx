import { useMemo, useState, useEffect } from 'react';
import { brandOf } from '@/constants/brand';
import { SegmentedControl } from '@/components/shared/SegmentedControl';
import { NoDataScreen } from '@/components/shared/NoDataScreen';
import { Glossary } from '@/components/shared/Glossary';
import { useSocialYear } from '@/hooks/useSocialYear';
import { ML_EN } from '@/utils/annualI18n';
import { ExecutiveReview } from '@/components/social/ExecutiveReview';

// Vista "Resumen del Año" — formato EJECUTIVO (executive briefing), fiel al
// brief recibido: resumen ejecutivo, KPIs de negocio con contexto, audiencia,
// contenido, qué funcionó y recomendaciones. Bilingüe (Peterson abre en EN).
//
// La vista estándar anterior (hero + segmentación mensual) fue retirada del
// producto a pedido del cliente; queda restaurable desde el historial de git
// (commit 2c2d10f) y en los HTML de respaldo entregados en la conversación.
export function AnnualReview({ account }) {
  const { accName, series } = useSocialYear(account);
  const [lang, setLang] = useState(() => (brandOf(account, accName) === 'peterson' ? 'en' : 'es'));
  useEffect(() => {
    setLang(brandOf(account, accName) === 'peterson' ? 'en' : 'es');
  }, [account, accName]);

  const en = lang === 'en';
  // En EN los nombres cortos de mes se traducen para toda la narrativa.
  const seriesT = useMemo(
    () =>
      en
        ? series.map((s) => ({ ...s, short: (ML_EN[s.id] || s.label).replace(/\s*20\d\d$/, '') }))
        : series,
    [series, en],
  );

  if (!series.some((s) => s.mo)) {
    return (
      <>
        <NoDataScreen
          detail={
            <>
              No hay meses con datos cargados para <strong>{accName || 'esta cuenta'}</strong> en 2026.
              El resumen anual se arma con las métricas mensuales de LinkedIn.
            </>
          }
          hint={<>Cargá al menos un mes para ver el progreso del año</>}
        />
        <Glossary keys="social" />
      </>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-3 flex justify-end">
        <SegmentedControl
          value={lang}
          onChange={setLang}
          size="sm"
          options={[
            { id: 'es', label: 'ES' },
            { id: 'en', label: 'EN' },
          ]}
        />
      </div>
      <ExecutiveReview series={seriesT} accName={accName} lang={lang} />
    </div>
  );
}
