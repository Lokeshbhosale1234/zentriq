/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#eef2ff', 100: '#e0e7ff', 200: '#c7d2fe',
          300: '#a5b4fc', 400: '#818cf8', 500: '#6366f1',
          600: '#4f46e5', 700: '#4338ca', 800: '#3730a3', 900: '#312e81',
        },
      },
      fontFamily: {
        sans:    ['DM Sans', 'system-ui', 'sans-serif'],
        display: ['Syne', 'system-ui', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },
      gridTemplateColumns: {
        // named shortcuts used inline in JSX via className
        '2': 'repeat(2, minmax(0, 1fr))',
        '3': 'repeat(3, minmax(0, 1fr))',
        '4': 'repeat(4, minmax(0, 1fr))',
      },
      animation: {
        'spin-slow': 'spin 1.4s linear infinite',
      },
      screens: {
        // Keep defaults, just document them for clarity
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl':'1536px',
      },
    },
  },
  // Safelist classes used dynamically (e.g. in JSX className strings)
  safelist: [
    // Grid layouts used inside JSX style strings + className combos
    'lg:grid-cols-2', 'lg:grid-cols-3', 'lg:grid-cols-4',
    'sm:grid-cols-4',
    'lg:col-span-2',
    // Sidebar margin
    'lg:ml-[var(--sidebar-offset,260px)]',
    // Nav active
    'active',
    // Animations
    'animate-fade-in', 'animate-slide-up', 'animate-slide-down',
    'animate-scale-in', 'animate-spin-custom', 'animate-float',
    'page-enter', 'stagger',
    // Skeletons
    'skeleton',
    // Responsive hidden/shown
    'hidden', 'sm:hidden', 'sm:inline', 'sm:block', 'sm:flex',
    'md:block', 'lg:hidden', 'lg:!translate-x-0', 'lg:!relative', 'lg:!inset-auto',
    // Font
    'font-mono', 'font-display', 'font-700', 'font-600', 'font-500',
  ],
  plugins: [],
}
