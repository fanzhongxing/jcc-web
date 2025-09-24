<template>
  <div class="wrap">
    <div class="rail" role="tablist" aria-label="版本切换">
      <button v-for="v in versions" :key="v.code" class="chip" :class="{ active: v.code === modelValue }" role="tab"
        :aria-selected="v.code === modelValue" @click="$emit('update:modelValue', v.code)" :title="vRange(v)">
        {{ v.label || v.code }}
      </button>
    </div>

    <!-- 多版本生效提示（可选） -->
    <p v-if="activeTips" class="tips">{{ activeTips }}</p>
  </div>
</template>

<script setup lang="ts">
export type Version = {
  code: string
  label?: string
  start?: string | null
  end?: string | null
}
const props = defineProps<{
  versions: Version[]
  modelValue: string
  activeTips?: string
}>()
defineEmits<{ (e: 'update:modelValue', val: string): void }>()
function vRange(v: Version) {
  if (!v.start && !v.end) return '未设定时间'
  return `${v.start || '—'} ~ ${v.end || '—'}`
}
</script>

<style scoped>
.wrap {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.rail {
  display: flex;
  gap: 8px;
  overflow: auto;
  padding: 4px;
  border-radius: 12px;
  background: #f8fafc;
}

.chip {
  border: 1px solid #cbd5e1;
  background: #fff;
  border-radius: 999px;
  padding: 6px 12px;
  cursor: pointer;
  white-space: nowrap;
}

.chip.active {
  background: #0ea5e9;
  border-color: #0284c7;
  color: #fff;
}

.tips {
  margin: 0;
  color: #64748b;
  font-size: 13px;
}
</style>
