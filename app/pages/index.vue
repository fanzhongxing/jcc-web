<script setup lang="ts">
import Pagination from '~/components/Pagination.vue'
import LineupCard from '~/components/LineupCard.vue'
import { useLineups } from '~/composables/useLineups'

const route = useRoute()
const router = useRouter()

// 从 URL 读取 ver / page / size / q
const ver = ref<string>(String(route.query.ver || ''))
const page = ref(Math.max(1, Number(route.query.page ?? 1)))
const size = ref(Math.max(1, Number(route.query.size ?? 9)))
const q = ref<string>(String(route.query.q || ''))
const searchInput = ref<string>(q.value)

watch(() => route.query, (qq) => {
  if ('ver' in qq) ver.value = String(qq.ver || '')
  if ('page' in qq) page.value = Math.max(1, Number(qq.page))
  if ('size' in qq) size.value = Math.max(1, Number(qq.size))
  if ('q' in qq) { q.value = String(qq.q || ''); searchInput.value = q.value }
})

// 拉数据（按 ver + 分页 + 搜索）
const { items, total, totalPages, error: lError, status: lStatus, refresh } =
  useLineups(ver, page, size, q)

// 搜索（提交后写回 URL，触发刷新）
function syncQuery() {
  router.replace({ query: { ...route.query, ver: ver.value, page: String(page.value), size: String(size.value), q: q.value || undefined } })
}
function applySearch() { q.value = searchInput.value; page.value = 1; syncQuery(); refresh() }
function clearSearch() { searchInput.value = ''; applySearch() }

function onPageChange(p: number) { if (p < 1 || (totalPages.value && p > totalPages.value)) return; page.value = p; syncQuery(); refresh() }
function onSizeChange(s: number) { size.value = Math.max(1, s); page.value = 1; syncQuery(); refresh() }

useHead({
  title: () => `热门阵容 - ${ver.value || '未选版本'} - 金铲铲逸尘`,
  meta: [{ name: 'description', content: '按版本浏览热门阵容，支持搜索与一键复制导入。' }]
})
</script>

<template>
  <div class="page">
    <h1 class="page-title">热门阵容</h1>
    <form class="search" @submit.prevent="applySearch">
      <input v-model.trim="searchInput" type="search" placeholder="搜索阵容名称/关键词…" @keydown.enter.prevent="applySearch" />
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
        <LineupCard v-for="it in items" :key="it.id" :name="it.name" :formation-image="it.formation_image"
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

    <!-- 仅保留底部分页 -->
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
