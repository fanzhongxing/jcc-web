<template>
  <article class="card">
    <div class="thumb">
      <img :src="formationImage" :alt="name" loading="lazy" />
      <!-- 可选版本角标 -->
      <!-- <div v-if="version" class="badge">{{ version }}</div> -->
    </div>

    <header class="title">{{ name }}</header>

    <section v-if="descriptionText" class="description" :class="{ expanded }">
      <header class="description-header">
        <h3 class="description-title">核心思路</h3>
        <button v-if="showToggle" type="button" class="description-toggle" @click="toggleDescription">
          {{ expanded ? '收起' : '展开' }}
        </button>
      </header>
      <p ref="descriptionBody" class="description-body">{{ descriptionText }}</p>
      <div v-if="showToggle && !expanded" class="fade" aria-hidden="true"></div>
    </section>

    <ul class="meta">
      <li><span class="label">版本</span><span class="val">{{ version }}</span></li>
      <li><span class="label">上手</span><span class="val">{{ difficulty }}</span></li>
      <!-- <li><span class="label">评级</span><span class="val">{{ rating }}</span></li> -->
    </ul>

    <!-- 可选统计区 -->
    <div v-if="$slots.stats" class="stats-wrap">
      <slot name="stats" />
    </div>

    <div class="actions">
      <button class="btn" @click="copyCode" :disabled="copied">
        {{ copied ? '已复制' : '复制阵容码' }}
      </button>
    </div>
  </article>
</template>

<script setup lang="ts">
const props = defineProps<{
  name: string
  formationImage: string
  rating: string
  difficulty: string
  version: string
  code: string
  description?: string
}>()

const copied = ref(false)
const expanded = ref(false)
const showToggle = ref(false)
const descriptionBody = ref<HTMLElement | null>(null)

const DEFAULT_DESCRIPTION = '核心思路暂未提供，敬请期待更新。'

const descriptionText = computed(() => props.description?.trim() || DEFAULT_DESCRIPTION)

const isClient = import.meta.client

const updateOverflow = () => {
  const el = descriptionBody.value
  if (!el) return
  const tolerance = 1
  const hasOverflow = el.scrollHeight - el.clientHeight > tolerance
  showToggle.value = expanded.value || hasOverflow
}

const onResize = () => {
  nextTick(updateOverflow)
}

onMounted(() => {
  nextTick(updateOverflow)

  if (isClient) {
    window.addEventListener('resize', onResize)
  }
})

onBeforeUnmount(() => {
  if (isClient) {
    window.removeEventListener('resize', onResize)
  }
})

watch(descriptionText, () => {
  expanded.value = false
  nextTick(updateOverflow)
})

function toggleDescription() {
  expanded.value = !expanded.value
  nextTick(updateOverflow)
}

async function copyCode() {
  try {
    await navigator.clipboard.writeText(props.code)
  } catch {
    const ta = document.createElement('textarea')
    ta.value = props.code
    document.body.appendChild(ta)
    ta.select()
    await navigator.clipboard.writeText('copy');
    document.body.removeChild(ta)
  }
  copied.value = true
  setTimeout(() => (copied.value = false), 1800)
}
</script>

<style scoped>
.card {
  border-radius: 18px;
  background: linear-gradient(145deg, #f8fbff 0%, #f1f5f9 100%);
  border: 1px solid rgba(148, 163, 184, .3);
  box-shadow: 0 12px 30px rgba(15, 23, 42, .08);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: border-color .2s ease, box-shadow .2s ease, transform .2s ease;
}

.card:hover {
  border-color: #60a5fa;
  box-shadow: 0 18px 36px rgba(37, 99, 235, .15);
  transform: translateY(-3px);
}

.thumb {
  position: relative;
  background: linear-gradient(135deg, #e4f5f0 0%, #f1f5fb 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 148px;
  border-bottom: 1px solid rgba(148, 163, 184, .35);
}

.thumb img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}

.badge {
  position: absolute;
  top: 8px;
  left: 8px;
  background: #0ea5e9;
  color: #fff;
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 12px;
}

.title {
  font-weight: 700;
  font-size: 19px;
  padding: 18px 20px 4px;
  color: #0f172a;
}

.description {
  position: relative;
  padding: 0 20px 10px;
  margin: 6px 0 4px;
  color: #475569;
  font-size: 14px;
  line-height: 1.6;
}

.description-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 6px;
}

.description-title {
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
}

.description-toggle {
  border: 0;
  background: transparent;
  color: #2563eb;
  font-size: 13px;
  cursor: pointer;
  font-weight: 600;
  padding: 4px 6px;
  border-radius: 6px;
  transition: background .2s ease, color .2s ease;
}

.description-toggle:hover {
  background: rgba(37, 99, 235, .08);
  color: #1d4ed8;
}

.description-body {
  margin: 0;
  max-height: 68px;
  overflow: hidden;
  transition: max-height .25s ease;
}

.description.expanded .description-body {
  max-height: none;
}

.description .fade {
  position: absolute;
  left: 20px;
  right: 20px;
  bottom: 10px;
  height: 36px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #f8fbff 70%);
  pointer-events: none;
}

.description.expanded .fade {
  display: none;
}

.meta {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  padding: 6px 20px 2px 20px;
  margin: 0 0 8px;
  list-style: none;
}

.meta .label {
  color: #64748b;
  margin-right: 6px;
}

.meta .val {
  font-weight: 600;
}

.stats-wrap {
  padding: 4px 20px 16px 20px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}

.stats-wrap .stat {
  background: rgba(241, 245, 249, .75);
  border: 1px solid rgba(148, 163, 184, .3);
  border-radius: 8px;
  padding: 8px 10px;
  display: flex;
  justify-content: space-between;
  font-size: 13px;
}

.stats-wrap .k {
  color: #64748b;
}

.stats-wrap .v {
  font-weight: 600;
}

.actions {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 20px 20px;
  border-top: 1px solid rgba(148, 163, 184, .25);
}

.btn {
  border: 0;
  padding: 8px 16px;
  border-radius: 999px;
  background: linear-gradient(120deg, #3b82f6, #2563eb);
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  transition: transform .2s ease, box-shadow .2s ease;
}

.btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 18px rgba(59, 130, 246, .25);
}

.btn:disabled {
  background: linear-gradient(120deg, #22c55e, #16a34a);
  cursor: default;
}
</style>
