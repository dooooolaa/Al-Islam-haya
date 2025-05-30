/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          500: '#2563eb', // Blue
          600: '#1d4ed8',
        },
        'light-bg': '#ffffff',
        'light-text': '#1e293b',
        'light-accent': '#2563eb',
        'dark-bg': '#0f172a',
        'dark-text': '#f8fafc',
        'dark-accent': '#3b82f6',
        'dark-muted': '#1e293b',
        // Adding specific colors for diacritics
        diacritic: {
          light: '#e53e3e', // A shade of red for light mode
          dark: '#f6ad55', // A shade of orange for dark mode
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        arabic: ['Amiri', 'Noto Naskh Arabic', 'serif'],
        quran: ['Amiri Quran', 'serif'],
      },
    },
  },
  plugins: [],
} 