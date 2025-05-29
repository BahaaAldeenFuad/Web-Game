/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
        rajdhani: ['Rajdhani', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#00ffd0',
          dark: '#00ccaa',
          light: '#66ffe0',
        },
        secondary: {
          DEFAULT: '#ff00ff',
          dark: '#cc00cc',
          light: '#ff66ff',
        },
        accent: {
          DEFAULT: '#ffcc00',
          dark: '#cc9900',
          light: '#ffdd66',
        },
        background: '#050520',
        surface: '#0a0a2a',
      },
      animation: {
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        float: 'float 3s ease-in-out infinite',
        'float-slow': 'float 6s ease-in-out infinite',
        'float-fast': 'float 1.5s ease-in-out infinite',
      },
      keyframes: {
        pulse: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};