/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        void: '#080a0f',
        surface: '#0d1117',
        card: '#111827',
        border: '#1e2a3a',
        accent: {
          DEFAULT: '#00d4ff',
          glow: '#00d4ff33',
          dim: '#0099bb',
        },
        neon: {
          green: '#00ff88',
          purple: '#a855f7',
          orange: '#ff6b35',
          yellow: '#ffd60a',
        },
        muted: '#4a5568',
        soft: '#8892a4',
      },
      boxShadow: {
        glow: '0 0 24px rgba(0, 212, 255, 0.25)',
        'glow-sm': '0 0 12px rgba(0, 212, 255, 0.15)',
        'glow-green': '0 0 20px rgba(0, 255, 136, 0.2)',
        'glow-purple': '0 0 20px rgba(168, 85, 247, 0.2)',
        card: '0 4px 24px rgba(0, 0, 0, 0.4)',
        'card-hover': '0 8px 40px rgba(0, 0, 0, 0.6)',
      },
      backgroundImage: {
        'grid-pattern':
          "linear-gradient(rgba(0,212,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.03) 1px, transparent 1px)",
        'accent-gradient': 'linear-gradient(135deg, #00d4ff, #a855f7)',
        'green-gradient': 'linear-gradient(135deg, #00ff88, #00d4ff)',
        'card-gradient': 'linear-gradient(135deg, #111827, #0d1117)',
      },
      backgroundSize: {
        grid: '40px 40px',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        float: 'float 6s ease-in-out infinite',
        shimmer: 'shimmer 2s linear infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
