<template>
  <footer class="site-footer" role="contentinfo">
    <div class="footer-inner">
      <!-- 品牌 / 口号 -->
      <section class="brand">
        <h3 class="logo" aria-label="站点名称">{{ siteName }}</h3>
        <p class="slogan">{{ slogan }}</p>
        <p class="copyright">
          © {{ year }} {{ siteName }}. All rights reserved.
        </p>
        <p v-if="icp" class="icp">
          <a :href="icpLink" target="_blank" rel="noopener">备案号：{{ icp }}</a>
        </p>
      </section>

      <!-- 导航 -->
      <nav class="nav" aria-label="页脚导航">
        <div class="nav-col" v-for="(group, i) in nav" :key="i">
          <h4 class="nav-title">{{ group.title }}</h4>
          <ul class="nav-list">
            <li v-for="item in group.items" :key="item.label">
              <NuxtLink :to="item.to" class="nav-link">{{ item.label }}</NuxtLink>
            </li>
          </ul>
        </div>
      </nav>

      <!-- 社交 -->
      <section class="social" aria-label="社交链接">
        <a v-for="s in socials" :key="s.label" :href="s.href" class="social-link" target="_blank" rel="noopener">
          <!-- 内置 SVG -->
          <svg v-if="s.icon === 'github'" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">...</svg>
          <svg v-else-if="s.icon === 'x'" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">...</svg>

          <!-- 其他：当作图片地址（支持 /public 本地或外链） -->
          <img v-else :src="resolveIcon(s.icon)" :alt="s.label" width="20" height="20" class="icon-img"
            loading="lazy" />

          <span class="visually-hidden">{{ s.label }}</span>
        </a>
      </section>
    </div>

    <!-- 回到顶部 -->
    <button class="back-top" type="button" @click="scrollTop" aria-label="回到顶部">↑</button>
  </footer>
</template>

<script setup lang="ts">
/**
 * 如果你的站点不是部署在根路径（设置了 app.baseURL），
 * 用 useAsset 来为 /public 下的路径自动添加前缀。
 * 例如：/douyin.png -> /your-base/douyin.png
 */
const resolveIcon = (icon: string) => {
  return icon.startsWith('/') ? useAsset(icon) : icon
}

const props = withDefaults(defineProps<{
  siteName?: string
  slogan?: string
  icp?: string            // 例如：粤ICP备xxxxxxx号
  icpLink?: string        // 例如：https://beian.miit.gov.cn/
  nav?: Array<{ title: string; items: Array<{ label: string; to: string }> }>
  socials?: Array<{ label: string; href: string; icon?: '' | '' | string }>
}>(), {
  siteName: '金铲铲逸尘',
  slogan: '专属你的铲铲游戏世界，精彩内容等你探索！',
  icp: '粤ICP备2021005069号-1',
  icpLink: 'https://beian.miit.gov.cn/',
  nav: () => ([
    {
      title: '产品',
      items: [
        { label: '优优择', to: 'http://www.youyouze.com' },
        { label: '逸尘blog', to: 'http://star.necc.xyz' }
      ]
    },
    {
      title: '支持',
      items: [
        { label: '问题反馈', to: '/feedback' },
        { label: '联系我', to: '/me' }
      ]
    }
  ]),
  socials: () => ([
    { label: '抖音', href: 'https://www.douyin.com/user/MS4wLjABAAAA77VM1AnQqXnud0JVV08VDF53REhvyTgbhPjhHLiW1_0JEw4VxHr-gc5B3wmRDRnO?from_tab_name=main', icon: 'douyin.png' },
    { label: 'B站', href: 'https://space.bilibili.com/388858958?spm_id_from=333.1007.0.0', icon: 'blibli.png' }
  ])
})

const year = new Date().getFullYear()

function scrollTop() {
  if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}
</script>

<style scoped>
.site-footer {
  margin-top: 32px;
  border-top: 1px solid #e2e8f0;
  background: var(--footer-bg, #fff);
  color: var(--footer-fg, #0f172a);
}

.footer-inner {
  max-width: 1100px;
  margin: 0 auto;
  padding: 24px 16px;
  display: grid;
  grid-template-columns: 1.2fr 2fr auto;
  gap: 24px;
}

.brand .logo {
  font-size: 18px;
  font-weight: 800;
  margin: 0 0 6px;
}

.brand .slogan {
  margin: 0 0 10px;
  color: #64748b;
  font-size: 14px;
}

.icp a {
  color: inherit;
  text-decoration: none;
}

.nav {
  display: grid;
  grid-template-columns: repeat(2, minmax(120px, 1fr));
  gap: 16px 24px;
}

.nav-title {
  font-size: 14px;
  font-weight: 700;
  margin: 0 0 8px;
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-link {
  color: #334155;
  text-decoration: none;
  font-size: 14px;
}

.nav-link:hover {
  text-decoration: underline;
}

.social {
  display: flex;
  align-items: start;
  gap: 10px;
}

.social-link {
  display: inline-flex;
  padding: 8px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  color: #334155;
  text-decoration: none;
}

.social-link:hover {
  background: #f8fafc;
}

.back-top {
  position: fixed;
  right: 16px;
  bottom: 16px;
  width: 36px;
  height: 36px;
  border-radius: 999px;
  border: 1px solid #e2e8f0;
  background: #fff;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(0, 0, 0, .08);
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  border: 0;
  padding: 0;
  clip: rect(0 0 0 0);
  overflow: hidden;
}

/* 响应式 */
@media (max-width: 900px) {
  .footer-inner {
    grid-template-columns: 1fr;
  }

  .nav {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* 暗色模式适配（如果你有暗色主题变量，替换成你的变量即可） */
:global(html.dark) .site-footer {
  --footer-bg: #0b1220;
  --footer-fg: #e5e7eb;
  border-top-color: #1f2937;
}

:global(html.dark) .nav-link,
:global(html.dark) .slogan {
  color: #9ca3af;
}

:global(html.dark) .social-link {
  border-color: #1f2937;
  color: #e5e7eb;
}

:global(html.dark) .social-link:hover {
  background: #0f172a;
}

:global(html.dark) .back-top {
  background: #0b1220;
  border-color: #1f2937;
  color: #e5e7eb;
}
</style>
