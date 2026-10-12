/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        skyPalette: {
          bg: '#f4f9fd',          // Crisp light sky base
          'bg-alt': '#e8f3fa',      // Soft ice/sky secondary
          surface: '#ffffff',       // Pure white card surfaces
          border: 'rgba(14, 116, 144, 0.12)', // Subtle ocean/sky border
          text: '#0c2333',          // Deep navy charcoal text
          muted: '#436174',         // Slate sky muted text
          faint: '#7895a7',         // Subtle sky caption text
        },
        skyPrimary: {
          DEFAULT: '#0284c7',       // Vibrant sky blue
          hover: '#0369a1',         // Deep sky blue hover
          soft: 'rgba(2, 132, 199, 0.1)',
          dark: '#38bdf8',          // Electric sky for dark mode
        },
        skyAccent: {
          DEFAULT: '#06b6d4',       // Cyan/aqua sky highlight
          hover: '#0891b2',
          soft: 'rgba(6, 182, 212, 0.12)',
          dark: '#67e8f9',
        },
        skyNight: {
          bg: '#08141e',            // Deep midnight navy
          'bg-alt': '#0c1d2b',      // Midnight slate
          surface: '#102638',       // Navy surface
          border: 'rgba(186, 230, 253, 0.12)',
          text: '#f0f9ff',          // Crisp icy text
          muted: '#93b4cb',         // Muted ice
          faint: '#62839b',         // Faint ice
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        sans: ['"Inter"', '"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'sky-sm': '0 2px 6px rgba(2, 132, 199, 0.06)',
        'sky-md': '0 8px 24px rgba(2, 132, 199, 0.08)',
        'sky-lg': '0 16px 40px rgba(2, 132, 199, 0.12)',
      },
    },
  },
  plugins: [],
};
