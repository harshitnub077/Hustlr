/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: { '2xl': '1400px' },
    },
    extend: {
      colors: {
        // Brand palette — deep navy + electric violet
        background: '#0a0b0f',
        surface: '#111318',
        'surface-2': '#1a1d26',
        'surface-3': '#22263a',
        border: '#2a2d3e',
        'border-bright': '#3d4165',

        primary: {
          DEFAULT: '#7c3aed',
          hover: '#6d28d9',
          light: '#a78bfa',
          glow: 'rgba(124,58,237,0.25)',
        },
        accent: {
          DEFAULT: '#06b6d4',
          hover: '#0891b2',
        },
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',

        text: {
          primary: '#f1f5f9',
          secondary: '#94a3b8',
          muted: '#4b5563',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-outfit)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      backgroundImage: {
        'hero-gradient': 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(124,58,237,0.35) 0%, transparent 70%)',
        'card-gradient': 'linear-gradient(135deg, rgba(26,29,38,0.9) 0%, rgba(34,38,58,0.7) 100%)',
        'glow-gradient': 'radial-gradient(circle at center, rgba(124,58,237,0.15) 0%, transparent 70%)',
        'border-gradient': 'linear-gradient(135deg, rgba(124,58,237,0.4), rgba(6,182,212,0.2))',
      },
      boxShadow: {
        'glow-sm': '0 0 20px rgba(124,58,237,0.2)',
        'glow-md': '0 0 40px rgba(124,58,237,0.3)',
        'glow-lg': '0 0 80px rgba(124,58,237,0.25)',
        card: '0 4px 24px rgba(0,0,0,0.4)',
        'card-hover': '0 8px 40px rgba(0,0,0,0.5), 0 0 20px rgba(124,58,237,0.2)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4,0,0.6,1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        float: { '0%,100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-12px)' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
      },
    },
  },
  plugins: [],
};
