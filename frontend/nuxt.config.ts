// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

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
        // ToDo: enter your project name here
        prefix: 'project-name',
        dir: './assets/icons'
      }
    ]
  },
  components: [
    {
      path: '~/components',
      pathPrefix: true,
    },
  ],
  modules: ['@vueuse/nuxt', '@nuxt/fonts', '@nuxt/icon'],
})