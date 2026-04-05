import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#09090b', // zinc-950
        foreground: '#fafafa', // zinc-50
        surface: '#18181b', // zinc-900
        'surface-2': '#27272a', // zinc-800
        primary: '#fafafa', 
        accent: '#52525b', // zinc-600
        border: '#27272a', // zinc-800
        'border-bright': '#3f3f46', // zinc-700
        'text-primary': '#fafafa',
        'text-secondary': '#a1a1aa', // zinc-400
        'text-muted': '#71717a', // zinc-500
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
      },
      backgroundImage: {
        'hero-glow': 'radial-gradient(circle at 50% -20%, rgba(250,250,250,0.1) 0%, rgba(9,9,11,0) 80%)',
        'card-gradient': 'linear-gradient(145deg, rgba(39,39,42,0.5) 0%, rgba(24,24,27,0) 100%)',
      },
      animation: {
        'marquee': 'marquee 30s linear infinite',
        'fade-in-up': 'fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      boxShadow: {
        'glass-button': '0 0 10px rgba(255,255,255,0.05), inset 0 1px 0 rgba(255,255,255,0.1)',
        'premium-card': '0 10px 40px -10px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)',
      },
    },
  },
  plugins: [],
};
export default config;
