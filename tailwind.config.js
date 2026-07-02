/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // ── Color Palette ──────────────────────────────────────────
      colors: {
        // Deep obsidian darks — each step noticeably lighter
        dark: {
          950: '#020204',   // void black
          900: '#050507',   // main bg
          800: '#0C0C11',   // panel bg
          750: '#111118',   // card bg
          700: '#18181F',   // border / divider
          600: '#222230',   // hover surface
          500: '#2E2E40',   // active surface
        },
        // Neon purple — the brand primary
        primary: {
          700: '#5B21B6',
          600: '#7C3AED',
          500: '#8B5CF6',
          400: '#A78BFA',
          300: '#C4B5FD',
          200: '#DDD6FE',
          glow: 'rgba(139,92,246,0.35)',
        },
        // Semantic colours
        success: { DEFAULT: '#10B981', dim: 'rgba(16,185,129,0.15)', glow: 'rgba(16,185,129,0.35)' },
        warning: { DEFAULT: '#F59E0B', dim: 'rgba(245,158,11,0.15)',  glow: 'rgba(245,158,11,0.35)' },
        danger:  { DEFAULT: '#F43F5E', dim: 'rgba(244,63,94,0.15)',   glow: 'rgba(244,63,94,0.35)'  },
        info:    { DEFAULT: '#38BDF8', dim: 'rgba(56,189,248,0.15)',   glow: 'rgba(56,189,248,0.35)' },
      },

      // ── Typography ─────────────────────────────────────────────
      fontFamily: {
        sans:  ['Inter', 'system-ui', 'sans-serif'],
        mono:  ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],   // 10px
        xs:    ['0.75rem',  { lineHeight: '1rem' }],        // 12px
        sm:    ['0.8125rem',{ lineHeight: '1.25rem' }],     // 13px
        base:  ['0.875rem', { lineHeight: '1.5rem' }],      // 14px
        md:    ['0.9375rem',{ lineHeight: '1.5rem' }],      // 15px
        lg:    ['1rem',     { lineHeight: '1.625rem' }],    // 16px
        xl:    ['1.125rem', { lineHeight: '1.75rem' }],     // 18px
        '2xl': ['1.25rem',  { lineHeight: '1.875rem' }],    // 20px
        '3xl': ['1.5rem',   { lineHeight: '2rem' }],        // 24px
        '4xl': ['1.875rem', { lineHeight: '2.25rem' }],     // 30px
      },

      // ── Border Radius ──────────────────────────────────────────
      borderRadius: {
        sm:   '6px',
        DEFAULT: '8px',
        md:   '10px',
        lg:   '14px',
        xl:   '18px',
        '2xl':'24px',
        '3xl':'32px',
      },

      // ── Box Shadows ────────────────────────────────────────────
      boxShadow: {
        // Elevation shadows (subtle depth on dark bg)
        'elev-1': '0 1px 3px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.3)',
        'elev-2': '0 4px 12px rgba(0,0,0,0.45), 0 2px 4px rgba(0,0,0,0.3)',
        'elev-3': '0 8px 24px rgba(0,0,0,0.5),  0 4px 8px rgba(0,0,0,0.35)',
        'elev-4': '0 16px 48px rgba(0,0,0,0.55), 0 8px 16px rgba(0,0,0,0.4)',
        // Neon glow shadows
        'glow-xs':  '0 0 8px rgba(139,92,246,0.3)',
        'glow-sm':  '0 0 16px rgba(139,92,246,0.35)',
        'glow-md':  '0 0 28px rgba(139,92,246,0.4)',
        'glow-lg':  '0 0 48px rgba(139,92,246,0.45)',
        'glow-xl':  '0 0 72px rgba(139,92,246,0.5)',
        // Semantic glows
        'glow-success': '0 0 20px rgba(16,185,129,0.4)',
        'glow-danger':  '0 0 20px rgba(244,63,94,0.4)',
        'glow-warning': '0 0 20px rgba(245,158,11,0.4)',
        // Inset inner glow for active states
        'inner-glow': 'inset 0 0 20px rgba(139,92,246,0.12)',
      },

      // ── Extended Animations & Keyframes ───────────────────────
      animation: {
        // Entrances
        'fade-in':       'fadeIn 0.3s ease forwards',
        'fade-slide-up': 'fadeSlideUp 0.45s cubic-bezier(0.16,1,0.3,1) forwards',
        'fade-slide-dn': 'fadeSlideDown 0.35s ease forwards',
        'scale-in':      'scaleIn 0.3s cubic-bezier(0.34,1.56,0.64,1) forwards',
        // Looping
        'float':         'float 7s ease-in-out infinite',
        'float-slow':    'float 10s ease-in-out infinite',
        'pulse-glow':    'pulseGlow 2.5s ease-in-out infinite',
        'spin-slow':     'spin 1.2s linear infinite',
        'shimmer':       'shimmer 1.8s linear infinite',
        'ping-once':     'ping 0.6s cubic-bezier(0,0,0.2,1) forwards',
        // Feedback
        'shake':         'shake 0.45s cubic-bezier(0.36,0.07,0.19,0.97)',
        'press':         'press 0.12s ease',
        'bounce-sm':     'bounceSm 0.4s cubic-bezier(0.34,1.56,0.64,1)',
      },
      keyframes: {
        fadeIn:       { from: { opacity: 0 }, to: { opacity: 1 } },
        fadeSlideUp:  { from: { opacity: 0, transform: 'translateY(20px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        fadeSlideDown:{ from: { opacity: 0, transform: 'translateY(-12px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        scaleIn:      { from: { opacity: 0, transform: 'scale(0.92)' }, to: { opacity: 1, transform: 'scale(1)' } },
        float: {
          '0%,100%': { transform: 'translateY(0) scale(1)' },
          '50%':     { transform: 'translateY(-28px) scale(1.04)' },
        },
        pulseGlow: {
          '0%,100%': { boxShadow: '0 0 20px rgba(139,92,246,0.4)' },
          '50%':     { boxShadow: '0 0 48px rgba(139,92,246,0.8), 0 0 80px rgba(99,102,241,0.3)' },
        },
        shimmer: {
          from: { backgroundPosition: '-200% 0' },
          to:   { backgroundPosition: '200% 0' },
        },
        shake: {
          '0%,100%':       { transform: 'translateX(0)' },
          '15%,55%,85%':   { transform: 'translateX(-7px)' },
          '35%,70%':       { transform: 'translateX(7px)' },
        },
        press:   { '0%': { transform: 'scale(1)' }, '50%': { transform: 'scale(0.96)' }, '100%': { transform: 'scale(1)' } },
        bounceSm:{ '0%': { transform: 'scale(1)' }, '60%': { transform: 'scale(1.06)' }, '100%': { transform: 'scale(1)' } },
      },

      // ── Backdrop Blur ──────────────────────────────────────────
      backdropBlur: {
        xs:  '4px',
        sm:  '8px',
        md:  '16px',
        lg:  '24px',
        xl:  '40px',
        '2xl': '64px',
      },
    },
  },
  plugins: [],
}