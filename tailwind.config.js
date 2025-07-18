/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        primary:"#16A34A",
        secondary:"#065F46",
      },
      backgroundImage: {
        connect: "url(/img/connect.jpeg)",
        
      },
      gridTemplateColumns: {
        accordian: "1fr 30px",
      
      },
    },
  },
  plugins: [],
}