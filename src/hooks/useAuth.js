import { useCallback, useEffect, useState } from 'react';

// ════════════════════════════════════════════════════════════════
//  AUTH SIMPLE — login compartido (estilo Marcomms Hub)
//
//  Decisión confirmada: un solo rol, todo usuario autenticado ve e
//  importa igual. Sin Supabase Auth todavía. La sesión se persiste en
//  localStorage. NO es seguridad real — gate de uso interno.
// ════════════════════════════════════════════════════════════════

const SESSION_KEY = 'marcomms_reports_session_v1';
const SHARED_PASSWORD =
  import.meta.env.VITE_SHARED_PASSWORD || 'marcomms2026';

export function useAuth() {
  const [authed, setAuthed] = useState(
    () => localStorage.getItem(SESSION_KEY) === 'ok',
  );

  useEffect(() => {
    if (authed) localStorage.setItem(SESSION_KEY, 'ok');
  }, [authed]);

  const login = useCallback((password) => {
    if (password === SHARED_PASSWORD) {
      localStorage.setItem(SESSION_KEY, 'ok');
      setAuthed(true);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setAuthed(false);
  }, []);

  return { authed, login, logout };
}
