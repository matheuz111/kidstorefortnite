/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        // Deben coincidir con los @font-face de globals.css
        burbankBig: ['"Burbank Big"', "sans-serif"],
        burbankSmall: ['"Burbank Small"', "sans-serif"]
      }
    }
  },
  plugins: []
};
