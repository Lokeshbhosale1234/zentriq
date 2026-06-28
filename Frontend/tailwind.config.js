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
          50: '#eef2ff', 100: '#e0e7ff', 200: '#c7d2fe',
          300: '#a5b4fc', 400: '#818cf8', 500: '#6366f1',
          600: '#4f46e5', 700: '#4338ca', 800: '#3730a3', 900: '#312e81',
        },
      },
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'spin-slow': 'spin 1.4s linear infinite',
      },
      screens: {
        'sm':  '640px',
        'md':  '768px',
        'lg':  '1024px',
        'xl':  '1280px',
        '2xl': '1536px',
      },
    },
  },
  safelist: [
    'lg:grid-cols-2', 'lg:grid-cols-3', 'lg:grid-cols-4', 'lg:grid-cols-5',
    'sm:grid-cols-4', 'xl:grid-cols-3',
    'lg:col-span-2', 'lg:col-span-3', 'xl:col-span-2',
    'lg:ml-[var(--sidebar-offset,264px)]',
    'hidden', 'lg:hidden', 'md:flex', 'sm:inline', 'sm:block', 'sm:flex',
    'lg:flex', 'lg:block', 'lg:translate-x-0',
    'font-mono', 'font-display',
    'page-enter', 'skeleton', 'animate-scale-in', 'animate-count-up',
    'animate-spin-custom', 'animate-fade-in',
    'card', 'card-hover', 'card-glass', 'card-gradient',
    'btn', 'btn-primary', 'btn-ghost', 'btn-icon',
    'badge', 'badge-green', 'badge-red', 'badge-amber', 'badge-cyan', 'badge-violet', 'badge-indigo',
    'input', 'nav-link', 'active',
    'progress-track', 'progress-fill',
    'section-title', 'section-subtitle', 'section-header',
    'coming-soon-badge', 'stat-accent-bar',
    'dropdown', 'dropdown-item', 'truncate', 'flex-center', 'flex-between',
    'data-table', 'divider',
  ],
  plugins: [],
}
