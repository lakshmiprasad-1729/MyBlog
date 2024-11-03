

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
    theme: {
    extend: {
       colors: {
      current: 'currentColor',
      'slate':"#0f172a",
      'white' :'white',
      'blue':'#3b82f6',
      'customErrorColor':'#212121',
      'custom1':"#051433",
      'custom2':"#1A3D73",
      'custom3':"#112C59",
     }},
  },
  plugins: [],
}

