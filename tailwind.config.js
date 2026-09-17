/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        saffron: {
          50: '#fff8f0',
          100: '#ffefdb',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
        },
        tiranga: {
          orange: '#FF9933',
          white: '#FFFFFF',
          green: '#138808',
          navy: '#000080',
        },
        gov: {
          navy: '#0b2545',
          blue: '#134074',
          lightBlue: '#eef4f8',
          gold: '#d4af37',
          dark: '#111827',
          gray: '#374151',
          bg: '#f8fafc',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans Devanagari', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
