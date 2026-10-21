// ════════════════════════════════════════════════════════════════
//  PREFERENCIAS GUARDADAS — dónde estaba el usuario (pilar, cuenta,
//  período, país, campaña, pestaña), el idioma y el tema (claro/oscuro).
//  Viven en el almacenamiento del navegador (localStorage), así un refresh
//  o volver a entrar retoma el recorrido en vez de arrancar de cero.
//
//  En un HTML descargado (modo embed) NO se lee ni se escribe nada: el
//  archivo siempre abre tal como se generó.
//  Todo va en try/catch: en una ventana privada o con el almacenamiento
//  bloqueado, la app funciona igual (solo no recuerda).
// ════════════════════════════════════════════════════════════════
import { useCallback, useEffect, useState } from 'react';

const PREFIX = 'marcomms:';
const isEmbed = () => typeof window !== 'undefined' && Boolean(window.__REPORT_EMBED__);

export function loadPref(key, fallback) {
  if (isEmbed()) return fallback;
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    return raw == null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function savePref(key, value) {
  if (isEmbed()) return;
  try {
    if (value === undefined) window.localStorage.removeItem(PREFIX + key);
    else window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    /* almacenamiento no disponible: no se recuerda, nada más */
  }
}

// useState que se guarda. Si cambia la clave (ej. otra cuenta), vuelve a
// leer el valor guardado para esa clave.
export function usePersistentState(key, initial) {
  const init = () => loadPref(key, typeof initial === 'function' ? initial() : initial);
  const [state, setState] = useState(init);
  const [k, setK] = useState(key);
  if (k !== key) {
    setK(key);
    setState(init());
  }
  const set = useCallback(
    (v) =>
      setState((prev) => {
        const next = typeof v === 'function' ? v(prev) : v;
        savePref(key, next);
        return next;
      }),
    [key],
  );
  return [state, set];
}

// Preferencia compartida entre todos los componentes que la usan (idioma,
// tema): si un pilar cambia el idioma, los demás se enteran en el momento.
const listeners = new Map(); // key → Set<fn>
const shared = new Map(); // key → valor actual

export function useSharedPref(key, initial) {
  if (!shared.has(key)) shared.set(key, loadPref(key, typeof initial === 'function' ? initial() : initial));
  const [value, setValue] = useState(() => shared.get(key));
  useSubscription(key, setValue);
  const set = useCallback(
    (v) => {
      const next = typeof v === 'function' ? v(shared.get(key)) : v;
      shared.set(key, next);
      savePref(key, next);
      listeners.get(key)?.forEach((fn) => fn(next));
    },
    [key],
  );
  return [value, set];
}

function useSubscription(key, fn) {
  useEffect(() => {
    if (!listeners.has(key)) listeners.set(key, new Set());
    const set = listeners.get(key);
    set.add(fn);
    fn(shared.get(key)); // por si cambió entre el render y la suscripción
    return () => set.delete(fn);
  }, [key, fn]);
}
