import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#f7f4ef",
        ink: {
          900: "#14201d",
        },
        teal: {
          700: "#1f5c55",
          800: "#1a4d48",
          900: "#163f3b",
        },
      },
      fontFamily: {
        sans: ['"Instrument Sans"', "Segoe UI", "Helvetica Neue", "Arial", "sans-serif"],
        serif: ['"Instrument Serif"', "Georgia", "Times New Roman", "serif"],
      },
      maxWidth: {
        "6xl": "72rem",
      },
    },
  },
  plugins: [],
} satisfies Config;
