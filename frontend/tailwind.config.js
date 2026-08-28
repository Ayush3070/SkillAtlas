/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: {
          base: "var(--bg-base)",
          canvas: "var(--bg-canvas)",
          subtle: "var(--bg-subtle)",
          muted: "var(--bg-muted)",
        },
        surface: {
          DEFAULT: "var(--surface)",
          raised: "var(--surface-raised)",
          sunken: "var(--surface-sunken)",
          inverse: "var(--surface-inverse)",
        },
        border: {
          subtle: "var(--border-subtle)",
          DEFAULT: "var(--border-default)",
          strong: "var(--border-strong)",
          focus: "var(--border-focus)",
        },
        ink: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          tertiary: "var(--text-tertiary)",
          muted: "var(--text-muted)",
          disabled: "var(--text-disabled)",
          inverse: "var(--text-inverse)",
        },
        primary: {
          50: "var(--primary-50)",
          100: "var(--primary-100)",
          200: "var(--primary-200)",
          300: "var(--primary-300)",
          400: "var(--primary-400)",
          500: "var(--primary-500)",
          600: "var(--primary-600)",
          700: "var(--primary-700)",
          800: "var(--primary-800)",
          900: "var(--primary-900)",
        },
        success: { 50: "var(--success-50)", 100: "var(--success-100)", 500: "var(--success-500)", 600: "var(--success-600)", 700: "var(--success-700)" },
        warning: { 50: "var(--warning-50)", 100: "var(--warning-100)", 500: "var(--warning-500)", 600: "var(--warning-600)", 700: "var(--warning-700)" },
        danger:  { 50: "var(--danger-50)",  100: "var(--danger-100)",  500: "var(--danger-500)",  600: "var(--danger-600)",  700: "var(--danger-700)" },
        info:    { 50: "var(--info-50)",    100: "var(--info-100)",    500: "var(--info-500)",    600: "var(--info-600)",    700: "var(--info-700)" },
        neutral: { 50: "var(--neutral-50)", 100: "var(--neutral-100)", 200: "var(--neutral-200)", 300: "var(--neutral-300)", 400: "var(--neutral-400)", 500: "var(--neutral-500)", 600: "var(--neutral-600)", 700: "var(--neutral-700)", 800: "var(--neutral-800)", 900: "var(--neutral-900)" },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      fontSize: {
        "2xs": ["0.6875rem", { lineHeight: "1rem" }],
        xs:    ["0.75rem",    { lineHeight: "1.1rem" }],
        sm:    ["0.8125rem",  { lineHeight: "1.2rem" }],
        base:  ["0.875rem",   { lineHeight: "1.4rem" }],
        md:    ["0.9375rem",  { lineHeight: "1.45rem" }],
        lg:    ["1.0625rem",  { lineHeight: "1.5rem" }],
        xl:    ["1.25rem",    { lineHeight: "1.65rem" }],
        "2xl": ["1.5rem",     { lineHeight: "1.85rem" }],
        "3xl": ["1.875rem",   { lineHeight: "2.1rem" }],
        "4xl": ["2.25rem",    { lineHeight: "2.4rem" }],
        "5xl": ["2.75rem",    { lineHeight: "2.9rem" }],
      },
      borderRadius: {
        xs: "4px", sm: "6px", md: "8px", lg: "12px", xl: "16px",
      },
      boxShadow: {
        1: "var(--shadow-1)", 2: "var(--shadow-2)", 3: "var(--shadow-3)", 4: "var(--shadow-4)", pop: "var(--shadow-pop)", focus: "var(--shadow-focus)",
      },
      zIndex: {
        base: "var(--z-base)", raised: "var(--z-raised)", sticky: "var(--z-sticky)",
        overlay: "var(--z-overlay)", drawer: "var(--z-drawer)", modal: "var(--z-modal)",
        toast: "var(--z-toast)", tooltip: "var(--z-tooltip)", cmd: "var(--z-cmd)",
      },
      transitionTimingFunction: {
        standard: "cubic-bezier(0.2, 0, 0, 1)",
        emphasized: "cubic-bezier(0.3, 0, 0, 1)",
      },
      transitionDuration: { instant: "80ms", fast: "150ms", base: "200ms", slow: "250ms", slower: "320ms" },
    },
  },
  plugins: [],
};
