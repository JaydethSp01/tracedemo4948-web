import type { Config } from 'tailwindcss';
const config: Config = { darkMode: "class",
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: { extend: { colors: { brand: { DEFAULT: "#dc2626", dark: "#9e1b1b" }, },} },
  plugins: [],
};
export default config;
