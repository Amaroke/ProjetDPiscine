/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
      "./public/**/*.html",
      "./public/**/*.js",
  ],
    darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [
      require('@tailwindcss/forms')
  ],
}
