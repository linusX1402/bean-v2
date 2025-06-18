// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  ssr: false,

  modules: ['@vueuse/nuxt', '@nuxt/icon'],

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
    dirs: ['types/types', 'composables/api', 'components/*'],
  },
  runtimeConfig: {
    public: {
      baseURL:
        process.env.BUILD_MODE === 'prod' ? process.env.API_BASE_URL : '',
    },
    // : `http://${process.env.HOST || 'localhost'}:3000`,
  },
  app: {
    head: {
      meta: [
        {
          name: 'viewport',
          content:
            'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
        },
      ],
    },
  },
  devServer: {
    host: '0.0.0.0',
    port: 3000,
  },
});
