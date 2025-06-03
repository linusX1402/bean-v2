// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  ssr: false,

  modules: ['@vueuse/nuxt', '@nuxt/fonts', '@nuxt/icon'],

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  css: ['~/assets/css/tailwind.css'],

  typescript: {
    typeCheck: true,
  },

  icon: {
    customCollections: [
      {
        prefix: 'bean',
        dir: './assets/icons',
      },
    ],
  },
  routeRules: {
    '/': {
      redirect: '/login',
    },
  },
  components: [
    {
      path: '~/components',
      pathPrefix: true,
    },
  ],
  imports: {
    dirs: ['types'],
  },
  runtimeConfig: {
    public: {
      baseURL:
        process.env.BUILD_MODE === 'prod'
          ? process.env.API_BASE_URL
          : 'http://localhost:3000',
    },
  },
});
