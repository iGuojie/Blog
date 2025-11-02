<template>
  <div class="search-result-wrapper">
    <!-- 搜索结果标题 -->
    <h2 class="search-title">
      搜索 "{{ displayKeyword }}" 的结果
      <span class="result-count" v-if="total > 0">（共 {{ total }} 条）</span>
    </h2>

    <!-- 博客网格 - 4列紧凑布局 -->
    <div class="blog-grid" v-if="blogs.length > 0">
      <BlogCard
        v-for="blog in blogs"
        :key="blog.id"
        :blog="blog"
        size="compact"
      />
    </div>

    <!-- 空状态 -->
    <div v-else class="empty-state">
      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
        <circle cx="11" cy="11" r="8"></circle>
        <path d="m21 21-4.35-4.35"></path>
      </svg>
      <p>没有找到相关文章</p>
      <p class="empty-hint">试试其他关键词吧</p>
    </div>

    <!-- 分页 -->
    <div class="pagination-container" v-if="totalPages > 1">
      <n-pagination
        v-model:page="currentPage"
        :page-count="totalPages"
        :page-size="pageSize"
        @update:page="handlePageChange"
        show-quick-jumper
      />
    </div>
  </div>
</template>

<script setup>
import { GetBlogList } from "@/api/BlogApi";
import { ref, onMounted, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import BlogCard from "@/components/BlogCard.vue";
import { NPagination } from 'naive-ui';

const route = useRoute();
const router = useRouter();
const blogs = ref([]);
const keyword = ref('');
const currentPage = ref(1);
const pageSize = ref(8); // 每页8个（两行，每行4个）
const totalPages = ref(1);
const total = ref(0);

// 显示的关键词（超过8个字显示省略号）
const displayKeyword = computed(() => {
  if (!keyword.value) return '';
  if (keyword.value.length > 8) {
    return keyword.value.substring(0, 8) + '...';
  }
  return keyword.value;
});

// 获取博客列表
const fetchBlogs = async () => {
  if (!keyword.value) {
    blogs.value = [];
    return;
  }

  try {
    const params = {
      keyword: keyword.value,
      pageNum: currentPage.value,
      pageSize: pageSize.value
    };

    const response = await GetBlogList(params);
    if (response.data.code === '666666') {
      blogs.value = response.data.result.list || response.data.result;
      totalPages.value = response.data.result.pages || 1;
      total.value = response.data.result.total || blogs.value.length;
    }
  } catch (error) {
    console.error('获取搜索结果失败:', error);
  }
};

// 页码变化
const handlePageChange = (page) => {
  currentPage.value = page;

  // 更新URL，保持分页状态
  const query = {
    keyword: keyword.value
  };
  if (page > 1) {
    query.page = page;
  }
  router.replace({ name: 'search', query });

  fetchBlogs();
  // 滚动到顶部
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// 监听路由变化，重新加载数据
watch(() => route.query, (newQuery) => {
  // 更新关键词和页码
  if (newQuery.keyword) {
    keyword.value = newQuery.keyword;
  }
  if (newQuery.page) {
    currentPage.value = parseInt(newQuery.page);
  } else {
    currentPage.value = 1; // 重置页码
  }

  // 重新获取数据
  fetchBlogs();
}, { immediate: false });

onMounted(() => {
  // 从URL获取搜索关键词
  if (route.query.keyword) {
    keyword.value = route.query.keyword;
  }
  if (route.query.page) {
    currentPage.value = parseInt(route.query.page);
  }

  fetchBlogs();
});
</script>

<style scoped>
/* 外层容器 */
.search-result-wrapper {
  width: 100%;
  padding: 32px 0;
}

/* 搜索标题 */
.search-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin: 0 0 32px 0;
  padding-left: 16px;
  position: relative;
}

.search-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 2px;
  bottom: 2px;
  width: 4px;
  background: linear-gradient(180deg, #17c5c5, #667eea, #f093fb);
  border-radius: 2px;
}

.result-count {
  font-size: 16px;
  color: #999;
  font-weight: normal;
  margin-left: 8px;
}

/* 博客网格 - 4列布局 */
.blog-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 56px;
  grid-auto-rows: minmax(240px, auto);
  align-items: stretch;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100px 20px;
  color: #999;
}

.empty-state svg {
  margin-bottom: 24px;
  opacity: 0.5;
}

.empty-state p {
  font-size: 16px;
  margin: 0;
}

.empty-hint {
  font-size: 14px;
  color: #ccc;
  margin-top: 8px;
}

/* 分页容器 */
.pagination-container {
  display: flex;
  justify-content: center;
  padding: 32px 0 48px 0;
}

/* 响应式设计 */
@media (max-width: 1280px) {
  .blog-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }
}

@media (max-width: 960px) {
  .blog-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 18px;
  }
}

@media (max-width: 768px) {
  .search-result-wrapper {
    padding: 24px 0;
  }

  .search-title {
    font-size: 20px;
    margin-bottom: 24px;
  }

  .result-count {
    font-size: 14px;
  }

  .blog-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    margin-bottom: 32px;
  }

  .empty-state {
    padding: 80px 20px;
  }

  .empty-state p {
    font-size: 14px;
  }

  .empty-hint {
    font-size: 13px;
  }
}
</style>
