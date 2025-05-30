/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    screens: {
      'xs': '480px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#4F46E5', // Primary indigo
          600: '#4338ca',
          700: '#3730a3',
          800: '#312e81',
          900: '#1e1b4b',
          950: '#0f172a'
        },
        accent: {
          50: '#effdfb',
          100: '#d3f8f3',
          200: '#aaede6',
          300: '#74dbd3',
          400: '#37c0b7',
          500: '#0D9488', // Teal accent
          600: '#057a71',
          700: '#07625c',
          800: '#0a504a',
          900: '#0c433e',
          950: '#032825',
        },
        success: {
          500: '#10B981', // Success green
        },
        warning: {
          500: '#F59E0B', // Warning amber
        },
        error: {
          500: '#EF4444', // Error red
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'pulse-once': 'pulse 1s ease-in-out 1',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};