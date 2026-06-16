/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // ── Paleta de marca Control Union (manual de marca) ──
        cu: {
          cyan: '#3eb2ed',
          dblue: '#1b1e42',
          grey: '#799495',
          dgrey: '#4f6566',
          bg: '#f0f4f5',
          border: '#d8e2e3',
          border2: '#eaf0f1',
        },
      },
      fontFamily: {
        // Ubuntu = sustituto de Sansa Pro (fuente oficial CU); Calibri fallback
        sans: ['Ubuntu', 'Calibri', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        cu: '8px',
      },
      boxShadow: {
        cu: '0 1px 4px rgba(27,30,66,.07), 0 1px 10px rgba(27,30,66,.04)',
        'cu-h': '0 4px 18px rgba(27,30,66,.11)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.35s ease-out',
      },
    },
  },
  plugins: [],
};
