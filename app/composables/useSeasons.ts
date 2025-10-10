type SeasonItem = {
  id: number
  name: string
  introduce: string
  sort: number
  status: number
}

type RawSeasonsList = { list: SeasonItem[]; total: number }
type SeasonsResp = { items: SeasonItem[]; total: number }

import { DEFAULT_SEASON } from '~/constants'

export function useSeasons(
  opts?: { server?: boolean }
) {
  const api = useHttp()

  const { data, pending, error } = useAsyncData(
    () => 'season',
    async () => {
      const payload = await api<RawSeasonsList>('/api/season/list', { method: 'GET' })
      const total = Number(payload?.total || 0)
      const items = payload?.list ?? []
      return { items, total } as SeasonsResp
    },
    { server: opts?.server ?? false, immediate: true }
  )

  const items = computed<SeasonItem[]>(() => data.value?.items ?? [])
  const latestActive = computed(() => {
    const list = items.value.filter(s => s.name)
    if (list.length <= 0) {
      return DEFAULT_SEASON
    } else {
      return list[0]?.name
    }
  })

  return { items, latestActive, pending, error }
}
