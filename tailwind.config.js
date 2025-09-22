/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0072CE',        // основной синий (кнопки)
        primaryDark: '#004AAD',    // тёмный синий (градиенты/hover)
        accent: '#00CFFF',         // яркий голубой (hover/акцент)
        textDark: '#1E293B'        // почти чёрный для светлого фона
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'Arial', 'sans-serif']
      }
    },
  },
  plugins: [],
}
