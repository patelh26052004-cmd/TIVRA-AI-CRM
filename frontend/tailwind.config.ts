import type { Config } from "tailwindcss";
const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: { extend: { colors: { brand: { orange:"#FF6B00", navy:"#0F172A" } } } },
  plugins: []
};
export default config;