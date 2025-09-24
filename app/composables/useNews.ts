type NewsItem = { id: number; title: string; time: string; content: string }
type RawNewsList = { list: NewsItem[]; total: number }
type NewsResp = {
  items: NewsItem[]; page: number; size: number; total: number; totalPages: number
}

export function useNews(page: Ref<number>, size: Ref<number>, opts?: { server?: boolean }) {
  const api = useHttp()

  const { data, error, status, refresh } = useAsyncData(
    () => `news:${page.value}:${size.value}`,
    async () => {
      // 这里拿到的 payload 已是解包后的 data：{ list, total }
      const payload = await api<RawNewsList>(
        '/api/information/list', {
        params: { page: page.value, size: size.value }
      })

      const total = Number(payload?.total || 0)
      const items = payload?.list ?? []
      return {
        items,
        page: page.value,
        size: size.value,
        total,
        totalPages: Math.max(1, Math.ceil(total / size.value))
      } as NewsResp
    },
    { server: opts?.server ?? false, watch: [page, size], immediate: true }
  )

  const items = computed(() => data.value?.items ?? [])
  const total = computed(() => data.value?.total ?? 0)
  const totalPages = computed(() => data.value?.totalPages ?? 1)

  return { data, items, total, totalPages, error, status, refresh }
}
