/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        charcoal: '#0A0A0A',
        gold: '#C9A96E',
        'gold-light': '#E8D5B0',
        'gold-pale': '#F5EDD9',
        ivory: '#FAFAF8',
        border: '#E8E4DF',
        muted: '#9B9187',
        surface: '#F5F0EB',
        'text-primary': '#1A1A1A',
        'text-secondary': '#5C5652',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        luxury: '0 1px 3px 0 rgba(10,10,10,0.05), 0 4px 16px 0 rgba(10,10,10,0.04)',
        'luxury-md': '0 4px 24px 0 rgba(10,10,10,0.08)',
        'luxury-lg': '0 8px 48px 0 rgba(10,10,10,0.12)',
        gold: '0 0 0 1px rgba(201,169,110,0.3), 0 4px 16px 0 rgba(201,169,110,0.15)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'shimmer': 'shimmer 1.5s infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(16px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
      },
    },
  },
  plugins: [],
}
