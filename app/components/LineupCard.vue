<template>
  <article class="card">
    <div class="thumb">
      <img :src="formationImage" :alt="name" loading="lazy" />
      <!-- 可选版本角标 -->
      <!-- <div v-if="version" class="badge">{{ version }}</div> -->
    </div>

    <header class="title">{{ name }}</header>

    <p v-if="description" class="description">{{ description }}</p>

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
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #312e81 100%);
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
  padding: 0 20px;
  margin: 2px 0 10px;
  color: #475569;
  font-size: 14px;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
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
