import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/App.jsx';
import { EmbedApp } from '@/components/embed/EmbedApp';
import { isDemoMode, installDemoMask } from '@/utils/demoMask'; // TEMPORAL — modo demo
import '@/index.css';

// Modo demo (temporal): en /demo se enmascaran los dígitos visibles con «x».
// Se instala antes del render para que el observer vea todo lo que pinta React.
if (isDemoMode()) installDemoMask();

// Si el HTML fue descargado en modo embed, renderizamos SOLO esa vista.
const embed = typeof window !== 'undefined' ? window.__REPORT_EMBED__ : null;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>{embed ? <EmbedApp embed={embed} /> : <App />}</React.StrictMode>,
);
