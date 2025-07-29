/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,jsx,ts,tsx,wxml}'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary-color)',
        secondary: 'var(--secondary-color)',
        accent: 'var(--accent-color)',
      },
    },
  },
  corePlugins: {
    // 小程序不需要preflight，避免与小程序内置样式冲突
    preflight: false,
  },
  plugins: [],
} 