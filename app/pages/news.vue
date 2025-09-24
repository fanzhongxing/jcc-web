<template>
  <div class="page">
    <h1 class="page-title">铲铲资讯</h1>
    <p class="page-desc">同步更新《金铲铲之战》的更新公告</p>

    <!-- 顶部分页：按需开启 -->
    <Pagination v-if="showTopPager" :page="page" :size="size" :total-pages="totalPages" :total="total"
      :size-options="[5, 10, 20, 30]" @update:page="onPageChange" @update:size="onSizeChange" />

    <!-- 列表 -->
    <section class="list">
      <template v-if="status === 'pending'">
        <div class="skeleton" v-for="i in 3" :key="i"></div>
      </template>

      <template v-else-if="error">
        <div class="error">加载失败：{{ error.message || '请稍后重试' }}</div>
      </template>

      <template v-else>
        <NewsItem v-for="(n, i) in items" :key="i" :title="n.title" :date="n.time" :content="n.content" />
        <div v-if="!items.length" class="empty">暂无资讯</div>
      </template>
    </section>

    <!-- 底部分页：保留 -->
    <Pagination v-if="showBottomPager" :page="page" :size="size" :total-pages="totalPages" :total="total"
      :size-options="[5, 10, 20, 30]" @update:page="onPageChange" @update:size="onSizeChange" />
  </div>
</template>

<script setup lang="ts">
import NewsItem from '~/components/NewsItem.vue'
import Pagination from '~/components/Pagination.vue'
import { useNews } from '~/composables/useNews'

const route = useRoute()
const router = useRouter()

// 开关：需要顶部分页就改为 true；需要隐藏底部分页就改为 false
const showTopPager = false
const showBottomPager = true

const page = ref(Math.max(1, Number(route.query.page ?? 1)))
const size = ref(Math.max(1, Number(route.query.size ?? 10)))

const { items, total, totalPages, error, status, refresh } = useNews(page, size)

function syncQuery() {
  router.replace({ query: { ...route.query, page: String(page.value), size: String(size.value) } })
}
function onPageChange(p: number) {
  if (p < 1 || (totalPages.value && p > totalPages.value)) return
  page.value = p
  syncQuery()
  refresh()
}
function onSizeChange(s: number) {
  size.value = Math.max(1, s)
  page.value = 1
  syncQuery()
  refresh()
}

watch(() => route.query, (q) => {
  const p = Number(q.page ?? page.value)
  const s = Number(q.size ?? size.value)
  if (p !== page.value) page.value = Math.max(1, p)
  if (s !== size.value) size.value = Math.max(1, s)
})

useHead({
  title: '铲铲资讯 - 金铲铲逸尘',
  meta: [{ name: 'description', content: '最新的铲铲更新与公告、玩法说明、热修复记录。' }]
})
</script>

<style scoped>
/* 样式同之前；无需改 */
.page {
  max-width: 960px;
  margin: 24px auto 80px;
  padding: 0 24px;
  box-sizing: border-box;
}

.page-title {
  font-size: 28px;
  font-weight: 800;
  margin: 12px 0 6px;
}

.page-desc {
  color: #475569;
  margin: 0 0 18px;
}

.list {
  display: grid;
  gap: 14px;
}

.skeleton {
  height: 120px;
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

@media (max-width: 640px) {
  .page {
    padding: 0 16px;
  }
}
</style>
