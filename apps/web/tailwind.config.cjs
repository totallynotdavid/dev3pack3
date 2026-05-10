/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent-bg)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        success: {
          DEFAULT: "var(--success)",
          foreground: "var(--success-foreground)",
        },
        brand: {
          DEFAULT: "var(--brand)",
          foreground: "var(--brand-foreground)",
        },
        border: "var(--border)",
        "border-strong": "var(--border-strong)",
        input: "var(--input)",
        ring: "var(--ring)",
      },
      borderRadius: {
        none: "0px",
        xs: "2px",
        sm: "4px",
        md: "8px",
        DEFAULT: "8px",
        lg: "16px",
        xl: "24px",
        "2xl": "32px",
        full: "9999px",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        display: ["var(--font-newsreader)", "Newsreader", "ui-serif", "Georgia", "serif"],
        serif: ["var(--font-newsreader)", "Newsreader", "ui-serif", "Georgia", "serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      letterSpacing: {
        tightest: "-0.04em",
        tighter: "-0.025em",
      },
      fontSize: {
        display: ["72px", { lineHeight: "1", letterSpacing: "-0.025em", fontWeight: "400" }],
      },
      boxShadow: {
        card: "0 15px 35px -5px rgba(0, 0, 0, 0.1)",
        soft: "0 20px 60px -15px rgba(0, 0, 0, 0.05)",
        press: "inset 0 2px 0 rgba(255, 255, 255, 1), 0 10px 30px rgba(0, 0, 0, 0.1)",
        "lens-inset": "inset 0 4px 10px rgba(0, 0, 0, 0.05)",
        "lens-deep": "inset 0 10px 20px rgba(0, 0, 0, 0.5)",
      },
      borderColor: {
        DEFAULT: "var(--border)",
      },
      ringColor: {
        DEFAULT: "var(--ring)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "skeleton-fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "cart-badge-pop": {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.4)" },
          "100%": { transform: "scale(1)" },
        },
        breathe: {
          "0%, 100%": { opacity: "0.85" },
          "50%": { opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "skeleton-delayed": "skeleton-fade-in 0.2s ease-in 0.25s forwards",
        "skeleton-delayed-long": "skeleton-fade-in 0.2s ease-in 0.4s forwards",
        "cart-badge-pop": "cart-badge-pop 0.3s ease-out",
        breathe: "breathe 4s cubic-bezier(0.4, 0, 0.2, 1) infinite",
      },
      transitionTimingFunction: {
        sentinel: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      transitionDuration: {
        DEFAULT: "150ms",
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
    require("@tailwindcss/container-queries"),
    require("tailwindcss-animate"),
  ],
};
