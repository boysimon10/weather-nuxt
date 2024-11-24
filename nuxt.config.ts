// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  css: ['~/assets/css/main.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  modules: [
    '@nuxtjs/google-fonts'
  ],
  googleFonts: {
    families: {
      'Work+Sans': [300, 400, 500, 600, 700],
    },
    display: 'swap',
    preload: true,
    download: true,
  },
  runtimeConfig: {
    public: {
      openWeatherApiKey: process.env.NUXT_PUBLIC_OPENWEATHER_API_KEY
    }
  },
  app: {
    head: {
      title: 'Weather App'
    }
  }
})