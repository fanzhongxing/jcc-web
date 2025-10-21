type Stats = { pick?: string; top4?: string; win?: string; avg?: string }
export type Lineup = {
  id: number; name: string; lineup_image: string;
  rating: string; difficulty: string; version: string;
  code: string; stats?: Stats;
  heroes: string; bonds: string;
}
type RawList = { list: Lineup[]; total: number }
type ListResp = { items: Lineup[]; total: number; page: number; size: number; totalPages: number }

export function useLineups(
  season: Ref<string>,
  page: Ref<number>,
  size: Ref<number>,
  q: Ref<string>,  // 搜索关键字                   
  opts?: { server?: boolean }
) {
  const api = useHttp()
  const { data, error, status, refresh } = useAsyncData(
    () => `lineups:${season.value}:${page.value}:${size.value}:${q.value || ''}`,
    async () => {
      const payload = await api<RawList>('/api/lineup/list', {
        params: {
          season: season.value,
          page: page.value,
          size: size.value,
          q: q.value || ""  // 搜索关键字        
        }
      })
      const total = Number(payload?.total || 0)
      return {
        items: payload?.list || [],
        total, page: page.value, size: size.value,
        totalPages: Math.max(1, Math.ceil(total / size.value))
      } as ListResp
    },
    { server: opts?.server ?? false, watch: [season, page, size, q], immediate: true }
  )

  const items = computed(() => data.value?.items ?? [])
  const total = computed(() => data.value?.total ?? 0)
  const totalPages = computed(() => data.value?.totalPages ?? 1)

  return { items, total, totalPages, error, status, refresh }
}
