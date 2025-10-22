<template>
  <article class="card">
    <div class="thumb">
      <img :src="formationImage" :alt="name" loading="lazy" />
      <!-- 可选版本角标 -->
      <!-- <div v-if="version" class="badge">{{ version }}</div> -->
    </div>

    <header class="heading">
      <h2 class="title">{{ name }}</h2>
      <ul class="meta">
        <li><span class="label">版本</span><span class="val">{{ version }}</span></li>
        <li><span class="label">上手</span><span class="val">{{ difficulty }}</span></li>
        <li><span class="label">评级</span><span class="val">{{ rating }}</span></li>
      </ul>
    </header>

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
  if (!isClient) return

  const doFallbackCopy = () => {
    const ta = document.createElement('textarea')
    ta.value = props.code
    ta.setAttribute('readonly', '')
    ta.style.position = 'absolute'
    ta.style.left = '-9999px'
    document.body.appendChild(ta)

    const selection = document.getSelection()
    const selectedRange = selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null

    ta.select()

    let ok = false
    try {
      ok = document.execCommand('copy')
    } catch (err) {
      ok = false
    }

    if (selectedRange && selection) {
      selection.removeAllRanges()
      selection.addRange(selectedRange)
    }

    document.body.removeChild(ta)

    return ok
  }

  const clipboard =
    typeof navigator !== 'undefined' && 'clipboard' in navigator ? navigator.clipboard : undefined

  const tryClipboardApi = async () => {
    if (!clipboard || typeof clipboard.writeText !== 'function') return false

    try {
      await clipboard.writeText(props.code)
      return true
    } catch (err) {
      return false
    }
  }

  const copiedSuccessfully = (await tryClipboardApi()) || doFallbackCopy()

  if (copiedSuccessfully) {
    copied.value = true
    setTimeout(() => (copied.value = false), 1800)
  }
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
  min-height: 136px;
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

.heading {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 10px 16px;
  padding: 16px 20px 6px;
}

.title {
  margin: 0;
  font-weight: 700;
  font-size: 18px;
  line-height: 1.2;
  color: #0f172a;
  flex: 1 1 180px;
}

.description {
  position: relative;
  padding: 0 20px 8px;
  margin: 4px 0 2px;
  color: #475569;
  font-size: 14px;
  line-height: 1.45;
}

.description-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 4px;
}

.description-title {
  font-size: 14px;
  font-weight: 700;
  line-height: 1.2;
  color: #0f172a;
}

.description-toggle {
  border: 0;
  background: transparent;
  color: #2563eb;
  font-size: 13px;
  line-height: 1.2;
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
  max-height: 52px;
  line-height: 1.45;
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
  bottom: 8px;
  height: 24px;
  background: linear-gradient(180deg, rgba(248, 251, 255, 0) 0%, #f8fbff 75%);
  pointer-events: none;
}

.description.expanded .fade {
  display: none;
}

.meta {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  list-style: none;
  margin: 2px 0 0;
  padding: 0;
}

.meta li {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(148, 163, 184, .15);
  font-size: 12px;
  line-height: 1.2;
  color: #475569;
}

.meta .label {
  color: inherit;
}

.meta .val {
  font-weight: 600;
  color: #0f172a;
}

.stats-wrap {
  padding: 4px 20px 14px 20px;
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
  justify-content: flex-end;
  padding: 10px 20px 14px;
  border-top: 1px solid rgba(148, 163, 184, .25);
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 12px;
  border: 1px solid rgba(37, 99, 235, .45);
  background: rgba(37, 99, 235, .08);
  color: #1d4ed8;
  font-weight: 600;
  font-size: 13px;
  line-height: 1.2;
  cursor: pointer;
  transition: background .2s ease, border-color .2s ease, color .2s ease;
}

.btn:hover {
  background: rgba(37, 99, 235, .14);
  border-color: rgba(37, 99, 235, .65);
  color: #1e40af;
}

.btn:disabled {
  background: rgba(34, 197, 94, .12);
  border-color: rgba(34, 197, 94, .45);
  color: #15803d;
  cursor: default;
}
</style>