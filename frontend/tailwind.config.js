/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          50:  '#FDFCF9',
          100: '#FAF7F2',
          200: '#F2EDE5',
          300: '#E8E2D8',
          400: '#D4CCBC',
          500: '#BFB5A3',
          600: '#A09080',
        },
        sage: {
          50:  '#EEF5EE',
          100: '#D6E9D6',
          200: '#AECFAE',
          300: '#7FB57F',
          400: '#5C9A5C',
          500: '#4D7A52',
          600: '#3D6042',
          700: '#2D4830',
          800: '#1E3021',
          900: '#111C14',
        },
        ink: {
          DEFAULT: '#1C1A18',
          soft:    '#3A3630',
          muted:   '#7A7268',
          faint:   '#B0A898',
        },
      },
      fontFamily: {
        sans:      ['Inter', 'system-ui', 'sans-serif'],
        display:   ['"Bodoni Moda"', '"Cormorant Garamond"', 'Georgia', 'serif'],
        editorial: ['"Italiana"', '"Bodoni Moda"', 'Georgia', 'serif'],
        elegant:   ['Raleway', '"Josefin Sans"', 'system-ui', 'sans-serif'],
        serif:     ['"Cormorant Garamond"', 'Georgia', 'serif'],
      },
      fontSize: {
        'display-xl': ['clamp(3.5rem, 8vw, 7rem)',   { lineHeight: '1.02', letterSpacing: '-0.03em' }],
        'display-lg': ['clamp(2.5rem, 5vw, 4.5rem)', { lineHeight: '1.06', letterSpacing: '-0.025em' }],
        'display':    ['clamp(2rem, 4vw, 3rem)',      { lineHeight: '1.1',  letterSpacing: '-0.02em' }],
      },
      animation: {
        'fade-up':        'fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) both',
        'fade-in':        'fadeIn 0.5s ease both',
        'slide-left':     'slideLeft 0.6s cubic-bezier(0.16,1,0.3,1) both',
        'scale-in':       'scaleIn 0.5s cubic-bezier(0.16,1,0.3,1) both',
        'shimmer':        'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeUp:    { from: { opacity: '0', transform: 'translateY(32px)' }, to: { opacity: '1', transform: 'none' } },
        fadeIn:    { from: { opacity: '0' }, to: { opacity: '1' } },
        slideLeft: { from: { opacity: '0', transform: 'translateX(24px)' }, to: { opacity: '1', transform: 'none' } },
        scaleIn:   { from: { opacity: '0', transform: 'scale(0.94)' }, to: { opacity: '1', transform: 'none' } },
        shimmer:   { from: { backgroundPosition: '-800px 0' }, to: { backgroundPosition: '800px 0' } },
      },
      boxShadow: {
        card:       '0 2px 12px rgba(28,26,24,0.08), 0 1px 3px rgba(28,26,24,0.05)',
        'card-lg':  '0 8px 32px rgba(28,26,24,0.12), 0 2px 8px rgba(28,26,24,0.06)',
        'card-xl':  '0 20px 60px rgba(28,26,24,0.15), 0 4px 12px rgba(28,26,24,0.08)',
        sage:       '0 0 0 3px rgba(77,122,82,0.2)',
      },
      backgroundImage: {
        'hero-grain': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
}
