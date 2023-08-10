module.exports = {
  mode: 'jit',
  darkMode: 'media',
  content: ['./src/app/**/*.{js,ts,jsx,tsx}', './src/components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontSize: {
        xxs: '.5rem',
      },
    },
  },
  plugins: [],
};
