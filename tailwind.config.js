/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        mylightgrey: '#5a5a5a',
        mygrey: '#323233',
        mydarkgrey: '#252526',
        myblack: '#1e1e1e',
      },
    },
  },
  plugins: [],
};
