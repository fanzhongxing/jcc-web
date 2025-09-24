<template>
  <div class="pager">
    <button class="btn" :disabled="page <= 1" @click="$emit('update:page', page - 1)">上一页</button>
    <span class="info">第 {{ page }} / {{ totalPages }} 页（共 {{ total }} 条）</span>
    <button class="btn" :disabled="page >= totalPages" @click="$emit('update:page', page + 1)">下一页</button>

    <label class="size">
      每页
      <select :value="size" @change="$emit('update:size', Number(($event.target as HTMLSelectElement).value))">
        <option v-for="opt in sizeOptions" :key="opt" :value="opt">{{ opt }}</option>
      </select>
      条
    </label>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  page: number
  size: number
  totalPages: number
  total: number
  sizeOptions?: number[]
}>()
</script>

<style scoped>
.pager {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  padding: 10px 0;
}

.btn {
  padding: 6px 10px;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  background: #fff;
  cursor: pointer;
}

.btn:disabled {
  opacity: .5;
  cursor: not-allowed;
}

.info {
  color: #475569;
}

.size {
  margin-left: auto;
  color: #475569;
}

.size select {
  margin: 0 6px;
  padding: 4px 8px;
}
</style>
