import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", ...fontFamily.sans],
      },
      colors: {
        primary: "var(--ant-color-primary)",
        secondary: "var(--ant-color-text-secondary)",
      },
    },
  },
  plugins: [],
} satisfies Config;
