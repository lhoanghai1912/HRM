// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require('nativewind/preset')], // ✅ v4 cần preset
  content: [
    './App.{js,jsx,ts,tsx}',
    './index.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: { extend: {} },
  plugins: [],
};
