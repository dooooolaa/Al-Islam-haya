module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        'light-bg': '#f8fafc',
        'light-text': '#1e293b',
        'light-accent': '#0ea5e9',
        'dark-bg': '#0f172a',
        'dark-text': '#f1f5f9',
        'dark-accent': '#0284c7',
        'dark-muted': '#1e293b',
        'dark-secondary': '#0369a1',
      },
      fontFamily: {
        'title': ['Amiri', 'serif'],
        'quran': ['Amiri Quran', 'serif'],
        'sans': ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}; 