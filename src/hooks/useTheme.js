import { useEffect } from 'react';
import { useSharedPref } from '@/utils/persist';

// Tema de la app (claro / oscuro), guardado en el navegador. Pone o saca la
// clase `dark` en <html>; los estilos están en index.css. Solo lo usa la app:
// los HTML descargados siempre abren en modo claro.
export function useTheme() {
  const [theme, setTheme] = useSharedPref('pref.theme', 'light');
  const dark = theme === 'dark';
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);
  return [dark ? 'dark' : 'light', setTheme];
}
