/** @type {import('tailwindcss').Config} */
export default {
  css: ['~/assets/css/tailwind.css'],
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './error.vue',
  ],
  theme: {
    extend: {
      colors: {
        'bean-white-400': '#F8F6F9',
        'bean-white-500': '#EFEDF2',
        'bean-gray-300': '#EAEAEB',
        'bean-gray-400': '#BBBBC0',
        'bean-gray-500': '#7B7B81',
      },
      fontSize: {
        h1: '2.986rem', // 47.776px
        h2: '2.488rem', // 39.808px
        h3: '2.074rem', // 33.184px
        h4: '1.728rem', // 27.648px
        h5: '1.44rem', // 23.04px
        h6: '1.2rem', // 19.2px
        p: '0.9rem', //
        sm: '0.8rem', //
        xs: '0.694rem', // 11.104px
        'lg-h1': '3.7325rem', // 59.72px
        'lg-h2': '3.11rem', // 49.77px
        'lg-h3': '2.591875rem', // 41.47px
        'lg-h4': '2.16rem', // 34.56px
        'lg-h5': '1.8rem', // 28.8px
        'lg-h6': '1.5rem', // 24px
        'lg-p': '1.25rem', // 20px
        'lg-sm': '1.041875rem', // 16.67px
        'lg-xs': '0.868125rem', // 13.89px
      },
    },
  },
  plugins: [],
};
