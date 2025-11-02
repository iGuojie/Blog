<template>
  <router-link :to="`/blogDetail?id=${blog.id}`" class="blog-card-link">
    <div :class="['blog-card', { 'blog-card--compact': size === 'compact' }]">
      <!-- 封面图片区域 -->
      <div class="card-cover">
        <img
          :src="blog.imageUrl || defaultImage"
          :alt="blog.name"
          class="cover-image"
        />
        <div class="cover-overlay"></div>
        <!-- 分类标签 -->
        <div class="category-tag">{{ blog.category }}</div>
      </div>

      <!-- 内容区域 -->
      <div class="card-content">
        <!-- 标题 -->
        <h3 class="card-title">
          {{ blog.name }}
          <div class="title-underline"></div>
        </h3>

        <!-- 标签 -->
        <div class="card-labels">
          <span
            v-if="blog.labels && blog.labels.length > 0"
            v-for="(label, index) in blog.labels"
            :key="index"
            class="label-tag"
          >
            #{{ label }}
          </span>
        </div>

        <!-- 摘要（显示完整标题） -->
        <p class="card-abstract">{{ blog.name }}</p>

        <!-- 底部信息 -->
        <div class="card-footer">
          <span class="author">Mr.Chang</span>
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
  },
  size: {
    type: String,
    default: 'normal', // 'normal' 或 'compact'
    validator: (value) => ['normal', 'compact'].includes(value)
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
.blog-card-link {
  text-decoration: none;
  color: inherit;
  display: block;
  height: 100%;
  min-width: 0;
}

.blog-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  min-height: 300px; /* 固定最小高度，确保所有卡片高度一致 */
}

/* 紧凑模式 - 分类页使用 */
.blog-card--compact {
  min-height: 240px; /* 紧凑模式：减小高度 */
  border-radius: 10px; /* 稍微小一点的圆角 */
}

.blog-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

/* 封面图片区域 */
.card-cover {
  position: relative;
  width: 100%;
  padding-top: 56.25%; /* 16:9 比例 */
  overflow: hidden;
  flex-shrink: 0; /* 防止图片被压缩 */
}

.blog-card--compact .card-cover {
  padding-top: 56.25%; /* 紧凑模式也保持16:9比例，确保图片不会太矮 */
}

.cover-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.blog-card:hover .cover-image {
  transform: scale(1.05);
}

/* 渐变遮罩 */
.cover-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 40%;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.95));
  pointer-events: none;
}

/* 分类标签 */
.category-tag {
  position: absolute;
  top: 12px;
  left: 12px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 13px;
  color: #666;
  font-weight: 500;
}

.blog-card--compact .category-tag {
  top: 8px;
  left: 8px;
  padding: 3px 10px;
  font-size: 11px;
  border-radius: 3px;
}

/* 内容区域 */
.card-content {
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 150px; /* 固定内容区域最小高度 */
}

.blog-card--compact .card-content {
  padding: 14px; /* 紧凑模式：减小内边距 */
  min-height: 120px; /* 紧凑模式：减小内容区域高度 */
}

/* 标题 */
.card-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
  line-height: 1.4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  position: relative;
  padding-bottom: 8px;
  max-width: 100%;
}

.blog-card--compact .card-title {
  font-size: 15px; /* 紧凑模式：减小标题字体 */
  margin: 0 0 6px 0;
  padding-bottom: 6px;
}

/* 标题下划线动画 */
.title-underline {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  width: 0;
  background: linear-gradient(90deg, #17c5c5, #667eea, #f093fb);
  transition: width 0.4s ease;
}

.blog-card:hover .title-underline {
  width: 100%;
}

/* 标签 */
.card-labels {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 8px;
  min-height: 24px; /* 固定标签区域高度 */
  max-height: 40px; /* 最多两行标签 */
  overflow: hidden;
}

.blog-card--compact .card-labels {
  gap: 6px;
  margin-bottom: 6px;
  min-height: 20px;
  max-height: 32px;
}

.label-tag {
  font-size: 12px;
  color: #17c5c5;
  padding: 2px 0;
  font-weight: 500;
}

.blog-card--compact .label-tag {
  font-size: 10px; /* 紧凑模式：减小标签字体 */
}

/* 摘要 */
.card-abstract {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  min-height: 68px; /* 固定3行的高度（14px * 1.6 * 3 ≈ 67.2px） */
  max-height: 68px;
  flex: 1; /* 让摘要区域占据剩余空间 */
}

.blog-card--compact .card-abstract {
  font-size: 12px; /* 紧凑模式：减小摘要字体 */
  line-height: 1.5;
  -webkit-line-clamp: 2; /* 紧凑模式：只显示2行 */
  min-height: 36px; /* 固定2行的高度（12px * 1.5 * 2 = 36px） */
  max-height: 36px;
}

/* 底部信息 */
.card-footer {
  display: flex;
  align-items: center;
  font-size: 13px;
  color: #999;
  margin-top: auto; /* 使用 auto 让底部始终在底部 */
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
  flex-shrink: 0; /* 防止被压缩 */
}

.blog-card--compact .card-footer {
  font-size: 11px; /* 紧凑模式：减小底部信息字体 */
  padding-top: 12px;
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
  .card-cover {
    padding-top: 56.25%; /* 移动端保持16:9比例，确保图片不会太矮 */
    flex-shrink: 0;
  }

  .card-content {
    padding: 14px; /* 稍微减小padding */
    min-height: auto; /* 移动端不需要固定最小高度 */
  }

  .card-title {
    font-size: 15px; /* 稍微缩小标题 */
    margin: 0 0 6px 0;
    padding-bottom: 6px;
  }

  .card-labels {
    min-height: 20px;
    max-height: 32px;
    margin-bottom: 6px;
  }

  .card-abstract {
    font-size: 12px; /* 稍微缩小摘要 */
    line-height: 1.5;
    -webkit-line-clamp: 2; /* 移动端显示2行 */
    min-height: 36px; /* 固定2行高度 */
    max-height: 36px;
    margin: 0;
  }

  .card-footer {
    font-size: 11px; /* 稍微缩小底部信息 */
    padding-top: 10px;
    margin-top: auto;
  }
}
</style>
