import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/App.jsx';
import { EmbedApp } from '@/components/embed/EmbedApp';
import '@/index.css';

// Si el HTML fue descargado en modo embed, renderizamos SOLO esa vista.
const embed = typeof window !== 'undefined' ? window.__REPORT_EMBED__ : null;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>{embed ? <EmbedApp embed={embed} /> : <App />}</React.StrictMode>,
);
