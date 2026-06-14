/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
      },
      colors: {
        ink: {
          DEFAULT: '#1C1D21',
          800: '#2a2b30',
          700: '#3a3b41',
          600: '#4a4b52',
          400: '#7a7b84',
          200: '#c4c5cc',
          100: '#e8e9ed',
          50: '#f5f5f7',
        },
        teal: {
          DEFAULT: '#0d9488',
          light: '#14b8a4',
          dark: '#0f766e',
          muted: '#ccfbf1',
        },
        amber: {
          DEFAULT: '#f59e0b',
          light: '#fbbf24',
          muted: '#fef3c7',
        },
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        soft: '0 2px 16px -2px rgba(28, 29, 33, 0.06)',
        card: '0 4px 24px -4px rgba(28, 29, 33, 0.08)',
        lift: '0 8px 32px -8px rgba(28, 29, 33, 0.12)',
        outline: '0 0 0 1px rgba(28, 29, 33, 0.06)',
        'outline-teal': '0 0 0 1.5px rgba(13, 148, 136, 0.25)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-in-right': 'slideInRight 0.35s ease-out',
        'pulse-dot': 'pulseDot 2s infinite',
        ticker: 'ticker 30s linear infinite',
        float: 'float 3s ease-in-out infinite',
        'float-slow': 'float 5s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(16px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        slideInRight: { from: { opacity: '0', transform: 'translateX(24px)' }, to: { opacity: '1', transform: 'translateX(0)' } },
        pulseDot: { '0%, 100%': { opacity: '1' }, '50%': { opacity: '0.3' } },
        ticker: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
        float: { '0%, 100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-8px)' } },
      },
    },
  },
  plugins: [],
}
