<script setup lang="ts">
import Pagination from '~/components/Pagination.vue'
import LineupCard from '~/components/LineupCard.vue'
import { computed } from 'vue'
import { useLineups } from '~/composables/useLineups'
import { useSeasons } from '~/composables/useSeasons'
import { DEFAULT_SEASON_THEME, SEASON_THEMES } from '~/data/seasonThemes'

const route = useRoute()
const router = useRouter()

// 从 URL 读取 season / page / size / q
const season = ref<string>(String(route.query.season || ''))
const page = ref(Math.max(1, Number(route.query.page ?? 1)))
const size = ref(Math.max(1, Number(route.query.size ?? 9)))
const q = ref<string>(String(route.query.anme || ''))
const searchInput = ref<string>(q.value)

watch(() => route.query, (qq) => {
  if ('season' in qq) season.value = String(qq.season || '')
  if ('page' in qq) page.value = Math.max(1, Number(qq.page))
  if ('size' in qq) size.value = Math.max(1, Number(qq.size))
  if ('q' in qq) { q.value = String(qq.q || ''); searchInput.value = q.value }
})

// 拉数据（按 season + 分页 + 搜索）
const { items, total, totalPages, error: lError, status: lStatus } =
  useLineups(season, page, size, q)

// 赛季主题展示
const { items: seasons } = useSeasons({ server: false })
const activeSeason = computed(() => seasons.value.find((item) => item.name === season.value))
const activeTheme = computed(() => SEASON_THEMES[season.value] || DEFAULT_SEASON_THEME)
const heroBackground = computed(() => {
  const theme = activeTheme.value
  const gradients = []
  if (theme.gradientFrom && theme.gradientTo) {
    gradients.push(`linear-gradient(135deg, ${theme.gradientFrom}, ${theme.gradientTo})`)
  }
  if (theme.poster) {
    gradients.push(`url(${theme.poster})`)
  }
  return gradients.join(', ')
})
const heroDescription = computed(() => activeTheme.value.description || activeSeason.value?.introduce || '')

// 搜索（提交后写回 URL，触发刷新）
function syncQuery() {
  router.replace({ query: { ...route.query, season: season.value, page: String(page.value), size: String(size.value), q: q.value || undefined } })
}
function applySearch() { q.value = searchInput.value; page.value = 1; syncQuery() }
function clearSearch() { searchInput.value = ''; applySearch() }

function onPageChange(p: number) { if (p < 1 || (totalPages.value && p > totalPages.value)) return; page.value = p; syncQuery() }
function onSizeChange(s: number) { size.value = Math.max(1, s); page.value = 1; syncQuery() }

useHead({
  title: () => `热门阵容 - ${season.value || '未选版本'} - 金铲铲逸尘`,
  meta: [{ name: 'description', content: '金铲铲之战热门阵容，支持搜索与一键复制阵容码' }]
})
</script>

<template>
  <div class="page">
    <h1 class="page-title">热门阵容</h1>
    <section class="season-hero" :style="{ backgroundImage: heroBackground }">
      <div class="season-hero__content">
        <span class="season-hero__badge">{{ season || '未选择赛季' }}</span>
        <h2 class="season-hero__title">{{ activeTheme.title || activeSeason?.introduce || '赛季主题' }}</h2>
        <p v-if="heroDescription" class="season-hero__desc">{{ heroDescription }}</p>
      </div>
    </section>
    <form class="search" @submit.prevent="applySearch">
      <input v-model.trim="searchInput" type="search" placeholder="搜索阵容名称/英雄/羁绊..."
        @keydown.enter.prevent="applySearch" />
      <button type="button" class="btn ghost" @click="clearSearch" v-if="searchInput">清空</button>
      <button type="submit" class="btn primary">搜索</button>
    </form>

    <section class="grid">
      <template v-if="lStatus === 'pending'">
        <div class="skeleton" v-for="i in 6" :key="i"></div>
      </template>
      <template v-else-if="lError">
        <div class="error">加载失败：{{ lError.message || '请稍后重试' }}</div>
      </template>
      <template v-else>
        <LineupCard v-for="it in items" :key="it.id" :name="it.name" :formation-image="it.lineup_image"
          :rating="it.rating" :difficulty="it.difficulty" :version="it.version" :code="it.code">
          <template #stats>
            <div v-if="it.stats">
              <div class="stat"><span class="k">出场率</span><span class="v">{{ it.stats.pick }}</span></div>
              <div class="stat"><span class="k">前四率</span><span class="v">{{ it.stats.top4 }}</span></div>
              <div class="stat"><span class="k">登顶率</span><span class="v">{{ it.stats.win }}</span></div>
              <div class="stat"><span class="k">平均排名</span><span class="v">{{ it.stats.avg }}</span></div>
            </div>
          </template>
        </LineupCard>
        <div v-if="!items.length" class="empty">该版本暂无阵容</div>
      </template>
    </section>

    <!-- 底部分页 -->
    <Pagination :page="page" :size="size" :total="total" :total-pages="totalPages" :size-options="[6, 9, 12, 15]"
      @update:page="onPageChange" @update:size="onSizeChange" />
  </div>
</template>

<style scoped>
.page {
  max-width: 1200px;
  margin: 24px auto 80px;
  padding: 0 24px;
  box-sizing: border-box;
}

.page-title {
  font-size: 28px;
  font-weight: 800;
  margin: 12px 0 12px;
}

.season-hero {
  position: relative;
  border-radius: 18px;
  padding: 28px;
  margin-bottom: 24px;
  background-size: cover;
  background-position: center;
  overflow: hidden;
  min-height: 200px;
  display: flex;
  align-items: flex-end;
  color: #fff;
}

.season-hero::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(120deg, rgba(15, 23, 42, 0.2), rgba(15, 23, 42, 0.6));
}

.season-hero__content {
  position: relative;
  z-index: 1;
  max-width: 520px;
}

.season-hero__badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.4);
  font-size: 14px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 12px;
}

.season-hero__title {
  font-size: 32px;
  font-weight: 700;
  margin: 0 0 8px;
}

.season-hero__desc {
  font-size: 16px;
  line-height: 1.6;
  margin: 0;
  color: rgba(255, 255, 255, 0.9);
}

.search {
  display: flex;
  gap: 8px;
  align-items: center;
  margin: 10px 0 12px;
}

.search input {
  flex: 1;
  padding: 10px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  outline: none;
}

.btn {
  padding: 8px 12px;
  border-radius: 10px;
  border: 1px solid #cbd5e1;
  background: #fff;
  cursor: pointer;
}

.btn.primary {
  background: #3b82f6;
  border-color: #3b82f6;
  color: #fff;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

@media (max-width:1024px) {
  .grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width:640px) {
  .page {
    padding: 0 16px;
  }

  .season-hero {
    padding: 24px 20px;
    min-height: 180px;
  }

  .season-hero__title {
    font-size: 26px;
  }

  .grid {
    grid-template-columns: 1fr;
  }
}

.skeleton {
  height: 240px;
  border-radius: 12px;
  background: linear-gradient(90deg, #f1f5f9, #e2e8f0, #f1f5f9);
  background-size: 200% 100%;
  animation: shimmer 1.2s infinite;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0
  }

  100% {
    background-position: -200% 0
  }
}

.empty {
  padding: 24px;
  text-align: center;
  color: #64748b;
  border: 1px dashed #e2e8f0;
  border-radius: 12px;
}

.error {
  padding: 12px 14px;
  border: 1px solid #fecaca;
  background: #fee2e2;
  color: #7f1d1d;
  border-radius: 8px;
}
</style>
