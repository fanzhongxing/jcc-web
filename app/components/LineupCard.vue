<template>
  <article class="card">
    <div class="thumb">
      <img :src="formationImage" :alt="name" loading="lazy" />
      <!-- 可选版本角标 -->
      <!-- <div v-if="version" class="badge">{{ version }}</div> -->
    </div>

    <header class="title">{{ name }}</header>

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
  border-radius: 12px;
  background: #E4F5F0;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, .04);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: border-color .2s ease, box-shadow .2s ease, transform .2s ease;
}

.card:hover {
  border-color: #93c5fd;
  box-shadow: 0 8px 28px rgba(2, 132, 199, .12);
  transform: translateY(-1px);
}

.thumb {
  position: relative;
  background: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 120px;
  border-bottom: 1px solid #f1f5f9;
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
  font-size: 18px;
  padding: 14px 16px 0;
}

.meta {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  padding: 8px 16px 0 16px;
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
  padding: 4px 16px 12px 16px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}

.stats-wrap .stat {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
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
  padding: 12px 16px 16px;
  border-top: 1px solid #2fd1a3;
}

.btn {
  border: 0;
  padding: 8px 14px;
  border-radius: 8px;
  background: #3b82f6;
  color: #fff;
  cursor: pointer;
}

.btn:hover {
  filter: brightness(1.05);
}

.btn:disabled {
  background: #16a34a;
  cursor: default;
}
</style>
