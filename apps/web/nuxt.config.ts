import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/tailwind.css'],
  vite: {
    plugins: [tailwindcss()],
  },
  modules: ['shadcn-nuxt'],
  shadcn: {
    prefix: '',
    componentDir: '@/components/ui',
  },
  devServer: {
    port: Number(process.env.NUXT_PORT),
  },
  runtimeConfig: {
    public: {
      apiBase: '/api',
    },
  },
  $development: {
    routeRules: {
      '/api/**': {
        proxy: `${process.env.NUXT_API_PROXY_TARGET}/**`,
      },
    },
  },
})
