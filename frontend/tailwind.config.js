/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Exact colors from the design system
        'primary-color': '#3d98f4',
        'secondary-color': '#e0f2fe',
        'background-color': '#f9f9f9',
        'text-primary': '#111827',
        'text-secondary': '#6b7280',
        'accent-color': '#bfdbfe',
        
        // Tailwind-compatible aliases for the same colors
        primary: {
          DEFAULT: '#3d98f4',
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3d98f4', // Our primary color
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        secondary: {
          DEFAULT: '#e0f2fe',
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
        background: '#f9f9f9',
        accent: '#bfdbfe',
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280', // text-secondary
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827', // text-primary
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      fontSize: {
        // Typography from design system
        'h1': ['3rem', { lineHeight: '1', fontWeight: '800', letterSpacing: '-0.025em' }], // text-4xl lg:text-5xl font-extrabold tracking-tighter
        'h2': ['1.875rem', { lineHeight: '2.25rem', fontWeight: '700' }], // text-3xl font-bold
        'body': ['1rem', { lineHeight: '1.625' }], // text-base lg:text-lg leading-relaxed
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'card-md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
      spacing: {
        '18': '4.5rem',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}