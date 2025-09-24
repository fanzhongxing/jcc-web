// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      title: '金铲铲逸尘',
      meta: [
        { name: 'description', content: '专属的铲铲游戏世界，精彩内容等你探索！' }
      ]
    }
  },
  runtimeConfig: {
    public: {
      apiBase: '/api'        // ✅ 用相对路径，交给 Nuxt 代理
    }
  },
  nitro: {
    devProxy: {
      '/api': { target: 'http://122.51.6.180:8080/api/', changeOrigin: true }
    }
  }
})
