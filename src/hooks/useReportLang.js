import { useSharedPref } from '@/utils/persist';
import { initialLang } from '@/utils/reportLang';

// Idioma del reporte (ES/EN). En la app es una preferencia global: se
// recuerda al refrescar y se comparte entre pilares. En un HTML descargado
// arranca en el idioma elegido al descargar (el toggle sigue andando).
export function useReportLang(fallback = 'es') {
  const [lang, setLang] = useSharedPref('pref.lang', () => initialLang(fallback));
  return [lang === 'en' ? 'en' : 'es', setLang];
}
