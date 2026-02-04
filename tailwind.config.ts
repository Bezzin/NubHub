import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Warm feminine palette inspired by Hertility, wellness brands
        terracotta: {
          DEFAULT: '#C17A59',
          50: '#FDF8F5',
          100: '#F5E6DD',
          200: '#E8C8B8',
          300: '#D9A38D',
          400: '#C17A59',
          500: '#A65D3C',
          600: '#8B4A2F',
          700: '#703A26',
          800: '#542B1C',
          900: '#391D13',
        },
        sage: {
          DEFAULT: '#8FA68E',
          50: '#F5F7F5',
          100: '#E3E9E3',
          200: '#C5D4C5',
          300: '#A3BAA3',
          400: '#8FA68E',
          500: '#6B8A6A',
          600: '#557054',
          700: '#415940',
          800: '#2E402D',
          900: '#1C271C',
        },
        cream: {
          DEFAULT: '#FAF7F2',
          50: '#FDFCF9',
          100: '#FAF7F2',
          200: '#F5EFE6',
          300: '#EFE5D6',
          400: '#E5D6C0',
        },
        stone: {
          50: '#FAFAF9',
          100: '#F5F5F4',
          200: '#E7E5E4',
          300: '#D6D3D1',
          400: '#A8A29E',
          500: '#78716C',
          600: '#57534E',
          700: '#44403C',
          800: '#292524',
          900: '#1C1917',
        },
        blush: {
          DEFAULT: '#E8C4C4',
          50: '#FDF8F8',
          100: '#F5E6E6',
          200: '#E8C4C4',
          300: '#D69E9E',
        },
        // Keep primary/secondary for compatibility
        primary: '#C17A59',
        secondary: '#8FA68E',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'soft-lg': '0 10px 40px -4px rgba(0, 0, 0, 0.08)',
        'warm': '0 4px 20px -2px rgba(193, 122, 89, 0.15)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
export default config;
