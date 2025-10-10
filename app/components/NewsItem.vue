<template>
  <article class="card">
    <header class="head">
      <h2 class="title">{{ title }}</h2>
      <time class="time" :datetime="date">{{ date }}</time>
    </header>

    <!-- 折叠开关（默认折叠） -->
    <button v-if="collapsible" class="toggle" type="button" :aria-expanded="isOpen" @click="isOpen = !isOpen">
      {{ isOpen ? '收起' : '展开全文' }}
    </button>

    <!-- 正文：v-show 保留在 DOM（利于 SEO），仅切换可见性 -->
    <div class="content" v-show="isOpen || !collapsible" v-text="content" :id="contentId"></div>
  </article>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  title: string
  date: string
  content: string
  collapsible?: boolean
  defaultOpen?: boolean
}>(), {
  collapsible: true,
  defaultOpen: false
})

const isOpen = ref(!!props.defaultOpen)


// 可选：给 content 生成一个可关联 id（便于无障碍/跳转）
const contentId = computed(() => `news-content-${hash(`${props.title}-${props.date}`)}`)

function hash(s: string) {
  let h = 0; for (let i = 0; i < s.length; i++) h = (h << 5) - h + s.charCodeAt(i) | 0;
  return Math.abs(h)
}
</script>

<style scoped>
.card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 16px 18px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, .04);
}

.head {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.title {
  font-size: 20px;
  font-weight: 800;
  margin: 0;
}

.time {
  color: #64748b;
  font-size: 13px;
}

.toggle {
  margin-top: 8px;
  padding: 6px 10px;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  background: #fff;
  cursor: pointer;
}

.content {
  margin-top: 10px;
  line-height: 1.85;
  white-space: pre-wrap;
  /* ✅ 保留换行与空格 */
  word-break: break-word;
  overflow-wrap: anywhere;
}
</style>
