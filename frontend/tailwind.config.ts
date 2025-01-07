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
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontSize: {
        xxs: ["10px", "16px"],
        xs: ["11px", "17px"],
        sm: ["12px", "18px"],
        sb: ["13px", "21px"],
        base: ["14px", "22px"],
        lg: ["18px", "26px"],
        xl: ["22px", "30px"],
        xxl: ["26px", "34px"],
      },
      fontFamily: {
        inconsolata: ["var(--font-inconsolata)"], // Lägg till Inconsolata.
      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
} satisfies Config;
