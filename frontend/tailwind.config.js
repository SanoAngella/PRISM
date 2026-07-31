/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Inter',
          'Manrope',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
      },
      colors: {
        // Primary brand — remapped to deep teal/pine for a single, consistent
        // green identity across the whole app (pre-login + all portals).
        brand: {
          50: '#e9f4ef',
          100: '#cfe7dd',
          200: '#a7d3c3',
          300: '#74b7a1',
          400: '#3f9379',
          500: '#1c7458',
          600: '#125e47', // primary
          700: '#0f5140',
          800: '#0c4133',
          900: '#0a3529',
        },
        // Deep teal/pine — patient portal primary (matches portal designs)
        pine: {
          50: '#e9f4ef',
          100: '#cfe7dd',
          200: '#a7d3c3',
          300: '#74b7a1',
          400: '#3f9379',
          500: '#1c7458',
          600: '#125e47',
          700: '#0f5140', // primary
          800: '#0c4133',
          900: '#0a3529',
        },
        // Subtle success green (used sparingly)
        success: {
          50: '#ecfdf3',
          100: '#d1fadf',
          500: '#12b76a',
          600: '#039855',
          700: '#027a48',
        },
        warning: {
          50: '#fffaeb',
          100: '#fef0c7',
          500: '#f79009',
          600: '#dc6803',
          700: '#b54708',
        },
        danger: {
          50: '#fef3f2',
          100: '#fee4e2',
          500: '#f04438',
          600: '#d92d20',
          700: '#b42318',
        },
        // Neutral gray scale (Slate-like, enterprise)
        gray: {
          25: '#fcfcfd',
          50: '#f9fafb',
          100: '#f2f4f7',
          200: '#e4e7ec',
          300: '#d0d5dd',
          400: '#98a2b3',
          500: '#667085',
          600: '#475467',
          700: '#344054',
          800: '#1d2939',
          900: '#101828',
        },
      },
      borderRadius: {
        // Cap radii to keep the enterprise look (max 8px)
        none: '0',
        sm: '4px',
        DEFAULT: '6px',
        md: '6px',
        lg: '8px',
        xl: '8px',
        '2xl': '8px',
        full: '9999px',
      },
      boxShadow: {
        // Subtle, low shadows only
        xs: '0 1px 2px 0 rgba(16, 24, 40, 0.05)',
        sm: '0 1px 3px rgba(16, 24, 40, 0.08), 0 1px 2px rgba(16, 24, 40, 0.04)',
        md: '0 2px 6px -1px rgba(16, 24, 40, 0.08), 0 1px 3px -1px rgba(16, 24, 40, 0.05)',
        card: '0 1px 2px rgba(16, 24, 40, 0.04), 0 0 0 1px rgba(16, 24, 40, 0.04)',
        none: 'none',
      },
      fontSize: {
        xs: ['12px', '18px'],
        sm: ['13px', '20px'],
        base: ['14px', '21px'],
        md: ['15px', '22px'],
        lg: ['16px', '24px'],
        xl: ['18px', '26px'],
        '2xl': ['22px', '30px'],
        '3xl': ['28px', '36px'],
        '4xl': ['34px', '42px'],
      },
    },
  },
  plugins: [],
}
