<script setup>
import profileImg from '@/assets/images/profile.jpg'

const blogMd = `
## 近况 & 计划功能

> 目前我的网站还 **比较简陋**，正在持续优化中。

**后台管理**：目前还没有一个可以管理blog的后台系统，正在调研前端现有框架。
**接口加密**：目前所有的接口都是明文，虽然所写内容不值一提，但是基于尊重，还是要加一下的。
**实时在线统计**：正在调研中。
**夜间模式**：还在排期中。
`

const introMd = `
# 个人简介

你好！我是 **常国杰**，目前在读计算机技术硕士，专注 **多模态 RAG、模态实体链接** 方向。
我喜欢把工程实践和学术探索结合在一起，做 **可落地、可衡量** 的算法。

- 🎓 合肥工业大学 · 计算机技术硕士
- 🌐 个人网站：**www.iguojie.top**
`

const contributionsMd = `
## 博客功能开发记录

> 记录我在博客开发过程中的主要功能迭代与优化历程 📝

### 🗓️ 开发时间线
**2025.11.1** · UI更新
增加标签分类，优化移动端UI体验。

**2025.10.30** · UI更新
更新UI，增加分类、时间排序功能。

**2025.10.4** · 体验优化
启用CDN加速，优化加载速度。

**2025.10.2** · 体验优化
优化前端代码，由于错误的引用方式导致js文件加载速度较慢。

**2025.9.24** · 安全优化
关闭无关端口，之前有大量连接攻击服务器导致服务器连接很慢。

**2025.9.23** · 首页体验优化
增加首页摘要和图片功能，让文章预览更直观丰富。

**2025.8.20** · 图床方案调整
使用开源图床，后修改为图片上传自己图床，提升图片加载稳定性。

**2025.8.12** · 页面完善
增加"关于我"界面，完善个人信息展示。

---

> 持续迭代中... 🚀
`

const hobbiesMd = `
## 我的兴趣爱好
🎾 网球
`

</script>

<template>
  <section class="about">
    <!-- 顶部：博客计划功能 -->
    <n-card size="large" class="blog-card" embedded>
      <v-md-preview :text="blogMd" />
    </n-card>

    <!-- 个人基本信息 + 照片 -->
    <div class="header">
      <div class="text">
        <v-md-preview :text="introMd" />
      </div>
      <div class="photo">
        <img :src="profileImg" alt="我的照片" />
      </div>
    </div>

    <!-- 博客功能贡献记录 -->
    <n-card size="large" class="contribution-card" embedded>
      <v-md-preview :text="contributionsMd" />
    </n-card>

    <!-- 兴趣爱好 -->
    <div class="content">
      <v-md-preview :text="hobbiesMd" />
    </div>

  </section>
</template>

<style scoped>
.about {
  max-width: 1040px;
  margin: 0 auto;
  padding: 32px 20px 60px;
}

/* 顶部博客计划卡片 */
.blog-card {
  margin-bottom: 28px;
  border-radius: 16px;
}

/* 基本信息区 */
.header {
  display: grid;
  grid-template-columns: 1.6fr 1fr;
  gap: 28px;
  align-items: center;
  margin-bottom: 28px;
}

.text :deep(h1) {
  margin-top: 0;
}

/* 照片容器，保持居中 */
.photo {
  width: 100%;
  display: flex;
  justify-content: center;
}

/* 图片按原始比例显示，不裁剪 */
.photo img {
  display: block;
  width: 100%;
  height: auto;            /* 关键：自适应高度 */
  max-width: 320px;        /* 你可以按需调整最大宽度 */
  border-radius: 24px;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.12);
}

/* 博客贡献记录卡片 */
.contribution-card {
  margin-bottom: 28px;
  border-radius: 16px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}

/* 内容区 */
.content :deep(h2) {
  margin-top: 12px;
}

/* 联系方式卡片 */
.contact-card {
  margin-top: 24px;
  border-radius: 16px;
}

/* 响应式 */
@media (max-width: 900px) {
  .header {
    grid-template-columns: 1fr;
  }
  .photo img {
    max-width: 260px;
    border-radius: 20px;
  }
}
</style>
