<template>
  <nav class="navbar">
    <!-- 左：Logo -->
    <NuxtLink to="/" class="logo-link">
      <img src="/logo.png" alt="Logo" class="logo-img" />
      <span class="logo-text">金铲铲逸尘</span>
    </NuxtLink>

    <!-- 中：主导航（会随赛季附加条目） -->
    <ul class="nav-links">
      <li v-for="item in navItems" :key="item.to">
        <NuxtLink :to="item.to" active-class="active">{{ item.label }}</NuxtLink>
      </li>
    </ul>

    <!-- 右：赛季下拉 -->
    <div class="ver-switch">
      <label class="ver-label" for="ver-select">版本</label>
      <select id="ver-select" :value="ver" @change="onVerChange(($event.target as HTMLSelectElement).value)">
        <option v-for="v in versions" :key="v.code" :value="v.code">
          {{ v.label || v.code }}
        </option>
      </select>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useVersions } from '~/composables/useVersions'

type NavItem = { label: string; to: string }

const router = useRouter()
const route = useRoute()

/** 基础导航（所有赛季都有） */
const BASE_ITEMS: NavItem[] = [
  { label: '热门阵容', to: '/' },
  { label: '铲铲资讯', to: '/news' },
]

/** 赛季专属导航（前端配置示例；也可以走后端，见文件末尾注释） */
const SEASON_EXTRA: Record<string, NavItem[]> = {
  // S15: [{ label: '强化果实', to: '/fruit' }],
  // S14: [{ label: '黑客入侵', to: '/hacker' }],
}

/** 拉赛季版本列表（你之前已经有这个 composable 了） */
const { versions, latestActive } = useVersions()

/* -------------------- A：同步赛季（URL <-> 下拉） -------------------- */

/** 当前赛季：来自 URL 的 ?ver= */
const ver = ref<string>(String(route.query.ver || ''))

/** URL 改变时，同步到本地 ver（比如你在首页改变了 ?ver=） */
watch(() => route.query.ver, (val) => {
  ver.value = String(val || '')
})

/** 首次进入如果没有 ver，用“最新生效版本”填上，并回到第1页 */
watchEffect(() => {
  if (!ver.value && latestActive.value) {
    ver.value = latestActive.value.code
    router.replace({ query: { ...route.query, ver: ver.value, page: '1' } })
  }
})

/** 下拉切换赛季：写回 URL（保留其他 query，比如搜索词），并回到第1页 */
function onVerChange(next: string) {
  if (!next || next === ver.value) return
  ver.value = next
  router.push({ query: { ...route.query, ver: ver.value, page: '1' } })
}

/* -------------------- B：根据赛季计算导航条目 -------------------- */

const navItems = computed<NavItem[]>(() => {
  // 前端常量版：按当前 ver 从映射里取附加菜单
  const extra = SEASON_EXTRA[ver.value] || []
  return [...BASE_ITEMS, ...extra]
})

/* 
// 如果要走后端返回额外导航：
import type { Version } from '~/composables/useVersions'
const currentVersion = computed(() => versions.value.find(v => v.code === ver.value))
const navItems = computed<NavItem[]>(() => [
  ...BASE_ITEMS,
  ...((currentVersion.value?.extra_nav as NavItem[] | undefined) || [])
])
*/
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(to right, #b444e8, #63d7ee);
  padding: 0 20px;
  color: #fff;
  z-index: 1000;
  box-sizing: border-box;
}

.logo-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #fff;
}

.logo-img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
  object-fit: cover;
  border: 2px solid #fff;
}

.logo-text {
  font-weight: 700;
  font-size: 20px;
}

.nav-links {
  display: flex;
  gap: 16px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-links a {
  color: #fff;
  text-decoration: none;
  opacity: .9;
  padding: 6px 8px;
  border-radius: 8px;
}

.nav-links a.active,
.nav-links a:hover {
  background: rgba(255, 255, 255, .16);
  opacity: 1;
}

/* 下拉样式：浅底深字，避免白字白底看不见选项 */
.ver-switch {
  display: flex;
  align-items: center;
  gap: 8px;
}

.ver-label {
  font-size: 12px;
  color: #fff;
  opacity: .9;
}

.ver-switch select {
  appearance: none;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: #fff;
  color: #111827;
  padding: 6px 28px 6px 10px;
  cursor: pointer;
}

.ver-switch select option {
  color: #111827;
  background: #fff;
}

@media (max-width: 640px) {
  .nav-links {
    display: none;
  }

  /* 小屏可先隐藏主菜单 */
}
</style>
