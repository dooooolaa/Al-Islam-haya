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
        // Reference Colors (Derived from RGB values)
        'ref-light-bg': '#FFFFFF',        // rgb(255, 255, 255)
        'ref-light-text': '#1A1A1A',      // rgb(26, 26, 26)
        'ref-light-text-hero': '#1D1D1D', // rgb(29, 29, 29)
        'ref-light-text-nav': '#374151',  // rgb(55, 65, 81)
        'ref-light-btn1-bg': '#2E7D32',   // rgb(46, 125, 50)
        'ref-light-btn1-text': '#FFFFFF', // rgb(255, 255, 255)
        'ref-light-btn2-text': '#43A047', // rgb(67, 160, 71)
        'ref-light-btn2-border': '#43A047',// rgb(67, 160, 71)
        'ref-light-card-border': '#E5E7EB',// rgb(229, 231, 235) - Default/Initial
        'ref-light-mid-bg': '#16A34A',    // rgb(22, 163, 74) - Assumed Green
        'ref-light-mid-text': '#FFFFFF',  // White text on green
        'ref-light-footer-bg': '#F3F4F6', // rgb(243, 244, 246)
        'ref-light-footer-text': '#4B5563',// rgb(75, 85, 99)
        'ref-light-footer-link': '#4B5563',// rgb(75, 85, 99)

        'ref-dark-bg': '#121212',         // rgb(18, 18, 18)
        'ref-dark-text': '#E0E0E0',       // rgb(224, 224, 224)
        'ref-dark-text-nav': '#D1D5DB',   // rgb(209, 213, 219)
        'ref-dark-btn1-bg': '#43A047',    // rgb(67, 160, 71)
        'ref-dark-btn1-text': '#FFFFFF',  // rgb(255, 255, 255)
        'ref-dark-btn2-text': '#66BB6A',  // rgb(102, 187, 106)
        'ref-dark-btn2-border': '#66BB6A', // rgb(102, 187, 106)
        'ref-dark-card-bg': '#1F2937',    // gray-800 - Estimate for dark cards
        'ref-dark-card-border': '#4B5563', // gray-600 - Estimate for dark borders
        'ref-dark-mid-bg': '#0D9488',     // rgb(13, 148, 136) - Assumed Teal
        'ref-dark-mid-text': '#FFFFFF',   // White text on teal
        'ref-dark-footer-bg': '#111827',  // rgb(17, 24, 39)
        'ref-dark-footer-text': '#9CA3AF', // rgb(156, 163, 175)
        'ref-dark-footer-link': '#9CA3AF', // rgb(156, 163, 175)

        // Accent Colors for Borders/Icons (Based on reference visual)
        'accent-quran': '#3B82F6',    // Blue-500
        'accent-hadith': '#EF4444',   // Red-500
        'accent-adhkar': '#22C55E',   // Green-500
        'accent-dua': '#14B8A6',      // Teal-500
        'accent-calendar': '#EC4899', // Pink-500
        'accent-qibla': '#8B5CF6',    // Violet-500

        // Light Card Backgrounds (Estimates - Tailwind 50 shades)
        'light-card-bg-quran': '#EFF6FF',    // blue-50
        'light-card-bg-hadith': '#FEF2F2',   // red-50
        'light-card-bg-adhkar': '#F0FDF4',   // green-50
        'light-card-bg-dua': '#F0FDFA',      // teal-50
        'light-card-bg-calendar': '#FDF2F8', // pink-50
        'light-card-bg-qibla': '#F5F3FF',    // violet-50
      },
      fontFamily: {
        sans: ['Tajawal', 'Inter', 'system-ui', 'sans-serif'], // Added Tajawal for better Arabic
        arabic: ['Amiri', 'Noto Naskh Arabic', 'serif'],
        quran: ['Amiri Quran', 'serif'],
      },
    },
  },
  plugins: [],
}

