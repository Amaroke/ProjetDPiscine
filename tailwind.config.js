/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
      "./public/**/*.html",
      "./public/**/*.js",
  ],
  theme: {
    extend: {},
  },
  plugins: [
      require('@tailwindcss/forms')
  ],
}
