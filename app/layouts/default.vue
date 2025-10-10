<template>
  <div class="layout-root">
    <NavBar />
    <main class="main layout-main">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import NavBar from '~/components/NavBar.vue'
import AppFooter from '~/components/AppFooter.vue'
</script>

<!-- 全局：让根容器可撑满高度，粘底布局才生效 -->
<style>
html,
body,
#__nuxt {
  height: 100%;
}
</style>

<style scoped>
/* 粘底布局核心：根是列布局，main 占满剩余空间，footer 自然贴底 */
.layout-root {
  min-height: 100dvh;
  /* 兼容移动端的视口单位 */
  display: flex;
  flex-direction: column;
}

.layout-main {
  flex: 1 0 auto;
}

.main {
  margin-top: 60px;
  /* 你的 NavBar 高度 */
  padding: 20px;
}
</style>
