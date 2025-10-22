<script setup lang="ts">
import Pagination from '~/components/Pagination.vue'
import LineupCard from '~/components/LineupCard.vue'
import { useLineups } from '~/composables/useLineups'

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
    <div class="page-inner">
      <section class="hero">
        <h1 class="page-title">热门阵容</h1>
        <p class="subtitle">快速浏览当前版本最受欢迎的阵容，查看强度、上手难度与统计表现，一键复制阵容码开局。</p>
      </section>

      <form class="search" @submit.prevent="applySearch">
        <div class="search-bar">
          <svg class="search-icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd"
              d="M9 3.5a5.5 5.5 0 1 0 3.257 9.926l3.658 3.659a.75.75 0 1 0 1.06-1.06l-3.658-3.66A5.5 5.5 0 0 0 9 3.5Zm-4 5.5a4 4 0 1 1 8 0a4 4 0 0 1-8 0Z"
              clip-rule="evenodd" />
          </svg>
          <input v-model.trim="searchInput" type="search" placeholder="搜索阵容名称 / 主C / 羁绊..."
            @keydown.enter.prevent="applySearch" />
          <button type="button" class="search-clear" @click="clearSearch" v-if="searchInput">清空</button>
        </div>
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
          :rating="it.rating" :difficulty="it.difficulty" :version="it.version" :code="it.code"
          :description="it.description">
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
      <div class="pagination-wrap">
        <Pagination :page="page" :size="size" :total="total" :total-pages="totalPages"
          :size-options="[6, 9, 12, 15]" @update:page="onPageChange" @update:size="onSizeChange" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.page {
  background: radial-gradient(circle at 20% 20%, rgba(96, 165, 250, .18), transparent 55%),
    radial-gradient(circle at 80% 0%, rgba(45, 212, 191, .22), transparent 50%),
    #f8fafc;
  min-height: 100vh;
  padding: 36px 0 96px;
}

.page-inner {
  max-width: 1180px;
  margin: 0 auto;
  padding: 0 24px;
  box-sizing: border-box;
}

.hero {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 28px;
}

.page-title {
  font-size: 32px;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -.01em;
}

.subtitle {
  max-width: 600px;
  color: #475569;
  font-size: 16px;
  line-height: 1.6;
}

.search {
  display: flex;
  gap: 12px;
  align-items: center;
  margin: 0 0 24px;
}

.btn {
  padding: 10px 22px;
  border-radius: 999px;
  border: 0;
  background: #e2e8f0;
  color: #334155;
  font-weight: 600;
  cursor: pointer;
  transition: transform .2s ease, box-shadow .2s ease, background .2s ease, color .2s ease;
}

.btn.primary {
  background: linear-gradient(120deg, #2563eb, #6366f1);
  color: #fff;
  box-shadow: 0 14px 28px rgba(79, 70, 229, .25);
}

.btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 12px 24px rgba(15, 23, 42, .12);
}

.btn:active {
  transform: translateY(0);
  box-shadow: none;
}

.search-bar {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 999px;
  padding: 10px 16px 10px 44px;
  box-shadow: 0 12px 24px rgba(15, 23, 42, .08);
  border: 1px solid rgba(148, 163, 184, .2);
}

.search input {
  flex: 1;
  border: 0;
  outline: none;
  font-size: 15px;
  color: #0f172a;
  background: transparent;
}

.search input::placeholder {
  color: #94a3b8;
}

.search-icon {
  position: absolute;
  left: 18px;
  width: 20px;
  height: 20px;
  color: #60a5fa;
}

.search-clear {
  border: 0;
  background: transparent;
  color: #64748b;
  font-size: 14px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  transition: color .2s ease;
}

.search-clear:hover {
  color: #ef4444;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
}

@media (max-width:1024px) {
  .grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width:640px) {
  .page {
    padding: 24px 0 72px;
  }

  .page-inner {
    padding: 0 16px;
  }

  .hero {
    margin-bottom: 20px;
  }

  .page-title {
    font-size: 26px;
  }

  .search {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }

  .search-bar {
    width: 100%;
  }

  .btn.primary {
    width: 100%;
  }

  .grid {
    grid-template-columns: 1fr;
  }
}

.skeleton {
  height: 260px;
  border-radius: 18px;
  background: linear-gradient(90deg, rgba(226, 232, 240, .6), rgba(203, 213, 225, .8), rgba(226, 232, 240, .6));
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
  padding: 32px;
  text-align: center;
  color: #475569;
  border: 1px dashed rgba(148, 163, 184, .35);
  border-radius: 16px;
  background: rgba(248, 250, 252, .8);
}

.error {
  padding: 14px 16px;
  border: 1px solid #fecaca;
  background: #fef2f2;
  color: #7f1d1d;
  border-radius: 12px;
}

.pagination-wrap {
  margin-top: 36px;
  display: flex;
  justify-content: flex-end;
}
</style>
