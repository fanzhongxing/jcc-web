// 统一请求器：自动处理 { code, data, msg } 外层壳
export const useHttp = () => {
  const config = useRuntimeConfig()
  // 配合你已开的 devProxy，使用相对前缀
  const baseURL = (config.public?.apiBase as string) || '/api'

  const api = $fetch.create({
    baseURL,
    retry: 1,
    timeout: 15000,

    onRequest({ options }) {
      options.headers = { ...(options.headers || {}) }
    },

    onResponse({ response }) {
      const d = response._data
      // 如果是你这种包壳结构：{ code, data, msg }
      if (d && typeof d === 'object' && 'code' in d) {
        // 成功：把 _data 直接替换成 data，外层对“原始数据”透明
        if (d.code === 200) {
          response._data = d.data ?? null
        } else {
          // 失败：抛错，交给上层 useAsyncData 捕获
          throw createError({
            statusCode: 500,
            statusMessage: d.msg || '接口返回错误',
            data: d
          })
        }
      }
    },

    onResponseError({ response }) {
      console.error('API error:', response.status, response._data)
    }
  })

  return api
}
