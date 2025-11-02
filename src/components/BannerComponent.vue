<template>
  <section class="hero">
    <!-- 右侧：超级模糊背景层（只显示颜色） -->
    <div class="color-bg" :style="colorBg"></div>

    <!-- 左侧：完整清晰图片 -->
    <img :src="resolvedSrc" class="hero-image" alt="">

    <!-- 右侧文字 -->
    <div class="hero-text">
      <p class="date">{{ date }}</p>
      <h1 class="title">{{ title }}</h1>
      <p class="desc">{{ desc }}</p>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  src:   { type: String, default: '/imgs/banner.jpg' },
  date:  { type: String, default: '2025.9.17' },
  title: { type: String, default: 'SpringAI接入DeepSeek模型' },
  desc:  { type: String, default: 'SpringAI 接入 DeepSeek 大模型...' }
})

const resolvedSrc = computed(() => {
  const s = props.src || ''
  if (/^https?:\/\//.test(s) || s.startsWith('/')) return s
  try { return new URL(s, import.meta.url).href } catch { return s }
})

const colorBg = computed(() => ({
  backgroundImage: `url('${resolvedSrc.value}')`
}))
</script>

<style scoped>
.hero {
  position: relative;
  width: 100%;
  height: clamp(200px, 28vw, 380px);
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  margin-top: 20px;
  margin-bottom: 25px;
}

/* 右侧背景：极度模糊提取颜色 */
.color-bg {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center center;
  filter: blur(100px) saturate(180%) brightness(1.1);
  transform: scale(1.3);
  z-index: 1;
}

/* 左侧完整图片（斜切边缘） */
.hero-image {
  position: relative;
  z-index: 2;
  width: 55%;
  height: 100%;
  object-fit: cover;
  object-position: center center;
  clip-path: polygon(0 0, 100% 0, 88% 100%, 0 100%);
}

/* 右侧文字 */
.hero-text {
  position: relative;
  z-index: 3;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: clamp(24px, 5vw, 60px);
  color: #fff;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.date {
  opacity: 0.9;
  font-size: clamp(12px, 1.4vw, 14px);
  margin: 0 0 8px;
}

.title {
  font-weight: 800;
  line-height: 1.2;
  font-size: clamp(20px, 2.8vw, 34px);
  margin: 0 0 16px;
}

.desc {
  font-size: clamp(12px, 1.4vw, 16px);
  line-height: 1.6;
  opacity: 0.96;
}

@media (max-width: 640px) {
  .hero {
    height: clamp(180px, 48vw, 260px);
  }

  .hero-image {
    width: 50%;
    clip-path: polygon(0 0, 100% 0, 85% 100%, 0 100%);
  }

  .hero-text {
    padding: 16px;
  }
}
</style>
