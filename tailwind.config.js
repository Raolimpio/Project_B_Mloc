/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6edf4',
          100: '#ccdbe9',
          200: '#99b7d3',
          300: '#6693bd',
          400: '#336fa7',
          500: '#004b91',
          600: '#012458', // Main brand blue
          700: '#001d46',
          800: '#001634',
          900: '#000f22',
        },
        secondary: {
          50: '#ffe6e6',
          100: '#ffcccc',
          200: '#ff9999',
          300: '#ff6666',
          400: '#ff3333',
          500: '#F10006', // Main brand red
          600: '#cc0005',
          700: '#990004',
          800: '#660003',
          900: '#330001',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      fontSize: {
        'display-lg': ['3.75rem', { lineHeight: '1.2' }],
        'display': ['3rem', { lineHeight: '1.2' }],
        'h1': ['2.25rem', { lineHeight: '1.3' }],
        'h2': ['1.875rem', { lineHeight: '1.3' }],
        'h3': ['1.5rem', { lineHeight: '1.4' }],
        'h4': ['1.25rem', { lineHeight: '1.4' }],
        'body-lg': ['1.125rem', { lineHeight: '1.5' }],
        'body': ['1rem', { lineHeight: '1.5' }],
        'small': ['0.875rem', { lineHeight: '1.5' }],
      },
      spacing: {
        container: '2rem',
        section: '6rem',
      },
      borderRadius: {
        DEFAULT: '0.5rem',
        lg: '0.75rem',
        xl: '1rem',
      },
    },
  },
  plugins: [],
};