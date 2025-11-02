<template>
  <div class="archive-page">
    <h1 class="archive-title">归档</h1>

    <!-- 一个年份一段 -->
    <section v-for="yearBlock in groupedBlogs" :key="yearBlock.year" class="year-block">
      <!-- 年份标题：放在线上方 -->
      <div class="year-title">{{ yearBlock.year }}</div>

      <n-timeline>
        <n-timeline-item
          v-for="monthBlock in yearBlock.months"
          :key="monthBlock.month"
          type="default"
          color="#17c5c5"
        >
          <!-- 这里就是"右边内容区"，我们自己再拆成左右 -->
          <div class="timeline-row">
            <!-- 左边：只显示月份 -->
            <span class="month-tag">
              {{ monthBlock.month }}月
            </span>

            <!-- 右边：这个月的卡片列表 -->
            <div class="month-cards">
              <div
                v-for="blog in monthBlock.blogs"
                :key="blog.id"
                class="blog-card"
                @click="navigateToBlog(blog.id)"
              >
                <div class="blog-content">
                  <div class="card-title">{{ blog.name }}</div>
                  <div class="card-abs">{{ blog.abstracts || blog.name }}</div>
                  <div class="card-meta">
                    <span class="author">Mr.Chang</span>
                    <span class="dot">·</span>
                    <span class="time">{{ formatDate(blog.createdTime) }}</span>
                  </div>
                </div>
                <div class="blog-cover" v-if="blog.imageUrl">
                  <img :src="blog.imageUrl" :alt="blog.name" />
                </div>
              </div>
            </div>
          </div>
        </n-timeline-item>
      </n-timeline>
    </section>

    <!-- 加载中提示 -->
    <div v-if="loading" class="loading-indicator">
      <span>加载中...</span>
    </div>

    <!-- 没有更多数据提示 -->
    <div v-if="!hasMore && groupedBlogs.length > 0" class="no-more">
      <span>没有更多了</span>
    </div>

    <!-- 空状态 -->
    <div v-if="!loading && groupedBlogs.length === 0" class="empty-state">
      <p>暂无文章</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { GetBlogList } from '@/api/BlogApi';
import { NTimeline, NTimelineItem } from 'naive-ui';

const router = useRouter();
const blogs = ref([]);
const currentPage = ref(1);
const pageSize = ref(8);
const loading = ref(false);
const hasMore = ref(true);

// 按年份和月份分组
const groupedBlogs = computed(() => {
  const groups = {};

  blogs.value.forEach(blog => {
    const date = new Date(blog.createdTime);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    if (!groups[year]) {
      groups[year] = {};
    }
    if (!groups[year][month]) {
      groups[year][month] = [];
    }
    groups[year][month].push(blog);
  });

  // 转换为数组格式，按年份和月份排序
  const result = [];
  Object.keys(groups).sort((a, b) => b - a).forEach(year => {
    const monthsData = [];
    Object.keys(groups[year]).sort((a, b) => b - a).forEach(month => {
      monthsData.push({
        month: month,
        blogs: groups[year][month]
      });
    });
    result.push({
      year: year,
      months: monthsData
    });
  });

  return result;
});

// 获取博客列表
const fetchBlogs = async () => {
  if (loading.value || !hasMore.value) return;

  loading.value = true;
  try {
    const params = {
      pageNum: currentPage.value,
      pageSize: pageSize.value
    };

    const response = await GetBlogList(params);
    if (response.data.code === '666666') {
      const newBlogs = response.data.result.list || response.data.result;

      if (newBlogs.length === 0 || newBlogs.length < pageSize.value) {
        hasMore.value = false;
      }

      blogs.value = [...blogs.value, ...newBlogs];
      currentPage.value++;
    }
  } catch (error) {
    console.error('获取归档列表失败:', error);
  } finally {
    loading.value = false;
  }
};

// 格式化日期（完整）
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).replace(/\//g, '-');
};

// 格式化月份（只显示月份）
const formatMonthDay = (dateString) => {
  const date = new Date(dateString);
  const month = date.getMonth() + 1;
  return `${month}月`;
};

// 跳转到博客详情
const navigateToBlog = (id) => {
  router.push({ name: 'blogDetail', query: { id } });
};

// 滚动加载
const handleScroll = () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;

  // 距离底部 200px 时触发加载
  if (scrollTop + windowHeight >= documentHeight - 200) {
    fetchBlogs();
  }
};

onMounted(() => {
  fetchBlogs();
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
.archive-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 24px 80px;
}

/* 标题 */
.archive-title {
  font-size: 28px;
  font-weight: bold;
  color: #333;
  margin: 0 0 48px 0;
  padding-left: 16px;
  position: relative;
}

.archive-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 2px;
  bottom: 2px;
  width: 4px;
  background: linear-gradient(180deg, #17c5c5, #667eea, #f093fb);
  border-radius: 2px;
}

/* 一年一段，跟截图一样有间距 */
.year-block {
  position: relative;
  margin-bottom: 56px;
}

/* 年份要在线的正上方 */
.year-title {
  position: relative;
  left: 80px;
  font-size: 30px;
  font-weight: 600;
  color: #17c5c5;
  margin-bottom: 14px;
}

/* 这一段时间线整体往右一点：让出一整条空间给"月份" */
.year-block :deep(.n-timeline) {
  margin-left: 80px;
}

/* 这是我们在 item 里自己写的那层 */
.timeline-row {
  position: relative;
  padding-left: 0;
  min-height: 68px;
}

/* 月份在时间轴左边显示 */
.month-tag {
  position: absolute;
  right: 100%;
  top: 1px;
  margin-right: 30px;
  width: 50px;
  text-align: right;
  font-size: 13px;
  color: #666;
  font-weight: 500;
}

/* 右边的卡片区 */
.month-cards {
  display: flex;
  flex-direction: column;
  gap: 10px;

}

.blog-card {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.05);
  padding: 14px 16px;
  display: flex;
  gap: 16px;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s;
}

.blog-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.07);
}

.blog-content {
  flex: 1;
  min-width: 0;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #222;
  margin-bottom: 6px;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-word;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  transition: color 0.2s;
}

.blog-card:hover .card-title {
  color: #17c5c5;
}

.card-abs {
  font-size: 12px;
  color: #999;
  line-height: 1.4;
  margin-bottom: 6px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-meta {
  font-size: 11px;
  color: #aaa;
  display: flex;
  gap: 6px;
  align-items: center;
}

.author {
  color: #17c5c5;
  font-weight: 500;
}

.dot {
  color: #ccc;
}

.time {
  color: #999;
}

.blog-cover {
  flex-shrink: 0;
  width: 200px;
  height: 100px;
  border-radius: 6px;
  overflow: hidden;
  background: #f5f5f5;
}

.blog-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.blog-card:hover .blog-cover img {
  transform: scale(1.05);
}

/* 加载中 */
.loading-indicator {
  text-align: center;
  padding: 32px;
  color: #999;
  font-size: 14px;
}

/* 没有更多 */
.no-more {
  text-align: center;
  padding: 32px;
  color: #ccc;
  font-size: 14px;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 100px 20px;
  color: #999;
  font-size: 16px;
}
@media (min-width: 480px) and (max-width: 1024px) {
  .archive-page {
    padding: 32px 20px 80px;
  }

  /* 时间轴别用 80，那是桌面用的，这里 62-68 差不多 */
  .year-block :deep(.n-timeline) {
    margin-left: 66px;
  }

  .year-title {
    left: 66px;
    transform: translateX(-4%);
    font-size: 26px;
    margin-bottom: 16px;
  }

  /* 线到内容之间，naive 默认给得有点大，这里收一丢 */
  .year-block :deep(.n-timeline-item-timeline) {
    margin-right: 10px;
  }

  /* 左边的月份也别太胖 */
  .month-tag {
    width: 34px;
    right: 100%;
    top: 6%;
    transform: translate(-10px, -50%);
    font-size: 12px;
  }

  /* 右边别贴屏幕 */
  .month-cards {
    margin-right: 50px;
  }

  .blog-card {
    gap: 14px;
  }
}

/* 更窄的 */
@media (max-width: 480px) {
  .archive-page {
    padding: 16px 6px 50px;
  }

  .year-block :deep(.n-timeline) {
    margin-left: 25px;           /* 再收一点点 */
  }

  .year-title {
    left: 46px;
    transform: translateX(-10%);
    font-size: 20px;
  }

  .month-tag {
    width: 26px;
    transform: translate(-4px, -50%);
    font-size: 11px;
    top: 10px;
  }

  .blog-card {
    margin-right: 10px;
  }

  .blog-cover {
    height: 80px;
    width: 130px;
  }
}


</style>
