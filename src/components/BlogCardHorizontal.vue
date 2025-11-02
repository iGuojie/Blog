<template>
  <router-link :to="`/blogDetail?id=${blog.id}`" class="blog-card-horizontal-link">
    <div class="blog-card-horizontal">
      <!-- 左侧封面图 -->
      <div class="card-cover">
        <img
          :src="blog.imageUrl || defaultImage"
          :alt="blog.name"
          class="cover-image"
        />
      </div>

      <!-- 右侧内容 -->
      <div class="card-content">
        <!-- 标题 -->
        <h3 class="card-title">{{ blog.name }}</h3>

        <!-- 摘要 -->
        <p class="card-abstract">{{ blog.abstracts || blog.name }}</p>

        <!-- 底部信息 -->
        <div class="card-footer">
          <span class="author">{{ blog.author || 'Mr.Sun' }}</span>
          <span class="dot">·</span>
          <span class="publish-time">发布于{{ formatDate(blog.createdTime) }}</span>
        </div>
      </div>
    </div>
  </router-link>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  blog: {
    type: Object,
    required: true
  }
});

const defaultImage = 'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?auto=format&fit=crop&w=800&q=80';

// 格式化日期
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).replace(/\//g, '.');
};
</script>

<style scoped>
.blog-card-horizontal-link {
  text-decoration: none;
  color: inherit;
  display: block;
}

.blog-card-horizontal {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  display: flex;
  height: 180px;
}

.blog-card-horizontal:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

/* 左侧封面图 */
.card-cover {
  flex: 0 0 240px;
  position: relative;
  overflow: hidden;
}

.cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.blog-card-horizontal:hover .cover-image {
  transform: scale(1.05);
}

/* 右侧内容 */
.card-content {
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

/* 标题 */
.card-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 12px 0;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

/* 摘要 */
.card-abstract {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin: 0 0 auto 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  flex: 1;
}

/* 底部信息 */
.card-footer {
  display: flex;
  align-items: center;
  font-size: 13px;
  color: #999;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
}

.author {
  color: #666;
}

.dot {
  margin: 0 6px;
}

.publish-time {
  color: #999;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .blog-card-horizontal {
    height: auto;
    min-height: 140px;
  }

  .card-cover {
    flex: 0 0 140px;
  }

  .card-content {
    padding: 14px;
  }

  .card-title {
    font-size: 15px;
    margin-bottom: 8px;
    -webkit-line-clamp: 2;
  }

  .card-abstract {
    font-size: 12px;
    -webkit-line-clamp: 2;
  }

  .card-footer {
    font-size: 11px;
    margin-top: 8px;
    padding-top: 8px;
  }
}
</style>
