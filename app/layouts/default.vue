<template>
  <div>
    <NavBar />
    <main class="main">
      <slot />
    </main>
  </div>
</template>

<script setup>
import NavBar from '~/components/NavBar.vue'
</script>

<style scoped>
.main {
  margin-top: 60px;
  padding: 20px;
}
</style>
