/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        gold: {
          50:  "#FFFBEB",
          100: "#FFF3C4",
          200: "#F5E090",
          300: "#E8C76A",
          400: "#C9A84C",
          500: "#A8862C",
          600: "#8B6914",
          700: "#6B5000",
          800: "#4D3A00",
          900: "#2A1F00",
        },
        dark: {
          50:  "#2A1F00",
          100: "#1A1100",
          200: "#0D0800",
          300: "#080600",
          400: "#040300",
        },
        purple: {
          light: "#A78BFA",
          DEFAULT: "#7C3AED",
          dark:  "#5B21B6",
        },
      },
      fontFamily: {
        cairo: ["Cairo", "sans-serif"],
        mono:  ["Space Mono", "monospace"],
      },
      animation: {
        "fade-up":   "fadeUp .44s ease both",
        "fade-in":   "fadeIn .28s ease both",
        "scale-in":  "scaleIn .3s cubic-bezier(.34,1.2,.64,1) both",
        "slide-up":  "slideUp .4s cubic-bezier(.16,1,.3,1) both",
        "float":     "float 3.4s ease-in-out infinite",
        "pulse-dim": "pulseDim 2s ease-in-out infinite",
        "glow":      "glow 2.5s ease-in-out infinite",
        "shimmer":   "shimmer 2s linear infinite",
        "scan":      "scan 2.8s linear infinite",
      },
      keyframes: {
        fadeUp:   { from: { opacity: "0", transform: "translateY(18px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        fadeIn:   { from: { opacity: "0" }, to: { opacity: "1" } },
        scaleIn:  { from: { transform: "scale(.93)", opacity: "0" }, to: { transform: "scale(1)", opacity: "1" } },
        slideUp:  { from: { transform: "translateY(50px)", opacity: "0" }, to: { transform: "translateY(0)", opacity: "1" } },
        float:    { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-7px)" } },
        pulseDim: { "0%,100%": { opacity: "1" }, "50%": { opacity: ".28" } },
        glow:     { "0%,100%": { boxShadow: "0 0 0 1px rgba(201,168,76,.3)" }, "50%": { boxShadow: "0 0 0 2px rgba(201,168,76,.7),0 0 22px rgba(201,168,76,.18)" } },
        shimmer:  { "0%": { backgroundPosition: "-300% 0" }, "100%": { backgroundPosition: "300% 0" } },
        scan:     { "0%": { top: "-2px" }, "100%": { top: "100%" } },
      },
    },
  },
  plugins: [],
};
