/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class", // handles both .dark and .tech via CSS
  theme: {
    container: { center: true, padding: "1rem" },
    extend: {
      colors: {
        brand: {
          50:  "#eef4ff",
          100: "#d9e5ff",
          200: "#bcd1ff",
          300: "#8eb4ff",
          400: "#598cff",
          500: "#3563ff",
          600: "#1f41f5",
          700: "#1a31e1",
          800: "#1c2bb6",
          900: "#1d2b8f",
        },
      },
      fontFamily: {
        sans: ["Inter", "'Noto Sans Ethiopic'", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["'Plus Jakarta Sans'", "Inter", "'Noto Sans Ethiopic'", "sans-serif"],
        ethiopic: ["'Noto Sans Ethiopic'", "sans-serif"],
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: 0, transform: "translateY(12px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "fade-up": "fade-up .5s ease-out both",
        shimmer: "shimmer 1.6s infinite",
      },
      boxShadow: {
        soft: "0 4px 20px -6px rgba(17, 24, 39, 0.08)",
        glow: "0 0 0 3px rgba(53, 99, 255, .25)",
      },
    },
  },
  plugins: [],
};
