/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        wakanda: {
          dark: '#030005',
          darker: '#010002',
          DEFAULT: '#05000A',
        },
        vibranium: {
          light: '#B44FFF',
          DEFAULT: '#9D00FF',
          dark: '#6B00BE',
          glow: 'rgba(157, 0, 255, 0.6)',
        },
        holo: {
          cyan: '#00f0ff',
          blue: '#1d4ed8',
        },

      },
      fontFamily: {
        heading: ['Space Grotesk', 'sans-serif'],
        body: ['Outfit', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'wakanda-gradient': 'linear-gradient(to bottom right, #030005, #0a0014, #030005)',
        'vibranium-flare': 'radial-gradient(circle at center, rgba(157,0,255,0.2) 0%, transparent 70%)',
        'holo-grid': 'linear-gradient(rgba(0, 240, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 240, 255, 0.05) 1px, transparent 1px)',
        'glass-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
      },
      backgroundSize: {
        'grid-sm': '32px 32px',
      },
      boxShadow: {
        'vibranium-glow': '0 0 20px rgba(157, 0, 255, 0.45), inset 0 0 10px rgba(157, 0, 255, 0.2)',
        'holo-glow': '0 0 15px rgba(0, 240, 255, 0.3)',
        'kinetic-glow': '0 0 20px rgba(157,0,255,0.5), 0 0 40px rgba(157,0,255,0.2)',
        'kinetic-glow-intense': '0 0 30px rgba(157,0,255,0.7), 0 0 60px rgba(157,0,255,0.35), inset 0 0 15px rgba(157,0,255,0.1)',
        'glass-panel': '0 8px 32px 0 rgba(0, 0, 0, 0.5)',
      },
      animation: {
        'energy-pulse': 'pulse-vibranium 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'holo-flicker': 'flicker 0.15s infinite',
        'float-slow': 'float 6s ease-in-out infinite',
        'float-medium': 'float 4s ease-in-out infinite',
        'scanline': 'scan 8s linear infinite',
        'spin-slow': 'spin 15s linear infinite',
        'glitch': 'glitch 2.5s infinite',

      },
      keyframes: {
        'pulse-vibranium': {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 20px rgba(157,0,255,0.4)' },
          '50%': { opacity: '.8', boxShadow: '0 0 40px rgba(157,0,255,0.8)' },
        },
        'flicker': {
          '0%': { opacity: '0.9' },
          '50%': { opacity: '0.85' },
          '100%': { opacity: '1' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'scan': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },

        'glitch': {
          '0%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
          '100%': { transform: 'translate(0)' },
        }
      }
    }
  },
  plugins: [],
}
