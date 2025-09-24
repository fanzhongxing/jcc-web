// app/composables/useVersions.ts（临时最小实现）
export function useVersions() {
  const versions = ref([
    { code: 'S15', label: 'S15', start: '2025-05-01', end: '2025-08-31' },
    { code: 'S14', label: 'S14', start: '2025-01-01', end: '2025-04-30' },
  ])
  const latestActive = computed(() => versions.value[0])
  return { versions, latestActive }
}
