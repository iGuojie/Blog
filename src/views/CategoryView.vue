<template>
  <div class="category-wrapper">
    <!-- 标题 -->
    <h2 ref="sectionTitle" class="section-title">文章列表</h2>

    <!-- 分类筛选 -->
    <div class="category-filter">
      <button
        :class="['filter-btn', { active: selectedCategory === null }]"
        @click="selectCategory(null)"
      >
        全部文章
      </button>
      <button
        v-for="category in categories"
        :key="category.id"
        :class="['filter-btn', { active: selectedCategory === category.id }]"
        @click="selectCategory(category.id)"
      >
        {{ category.name }}
      </button>
    </div>

    <!-- 博客网格 - 一行4个 -->
    <div class="blog-grid">
      <BlogCard
        v-for="blog in blogs"
        :key="blog.id"
        :blog="blog"
        size="compact"
      />
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
import { GetBlogList, GetCategoryList } from "@/api/BlogApi";
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import BlogCard from "@/components/BlogCard.vue";
import { NPagination } from 'naive-ui';

const route = useRoute();
const router = useRouter();
const blogs = ref([]);
const categories = ref([]);
const selectedCategory = ref(null);
const currentPage = ref(1);
const pageSize = ref(8); // 每页8个（两行，每行4个）
const totalPages = ref(1);
const total = ref(0);
const sectionTitle = ref(null);

// 获取分类列表
const fetchCategories = async () => {
  try {
    const response = await GetCategoryList();
    if (response.data.code === '666666') {
      categories.value = response.data.result;
    }
  } catch (error) {
    console.error('获取分类列表失败:', error);
  }
};

// 获取博客列表
const fetchBlogs = async () => {
  try {
    const params = {
      pageNum: currentPage.value,
      pageSize: pageSize.value
    };

    // 如果选择了分类，添加 categoryId 参数
    if (selectedCategory.value !== null) {
      params.categoryId = selectedCategory.value;
    }

    const response = await GetBlogList(params);
    if (response.data.code === '666666') {
      blogs.value = response.data.result.list || response.data.result;
      totalPages.value = response.data.result.pages || 1;
      total.value = response.data.result.total || blogs.value.length;
    }
  } catch (error) {
    console.error('获取博客列表失败:', error);
  }
};

// 选择分类
const selectCategory = (categoryId) => {
  selectedCategory.value = categoryId;
  currentPage.value = 1; // 重置到第一页

  // 更新URL，保持状态
  const query = categoryId ? { categoryId } : {};
  router.replace({ name: 'category', query });

  fetchBlogs();
};

// 页码变化
const handlePageChange = (page) => {
  currentPage.value = page;

  // 更新URL，保持分页状态
  const query = {};
  if (selectedCategory.value) {
    query.categoryId = selectedCategory.value;
  }
  if (page > 1) {
    query.page = page;
  }
  router.replace({ name: 'category', query });

  fetchBlogs();
  // 滚动到文章列表标题
  if (sectionTitle.value) {
    sectionTitle.value.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

onMounted(() => {
  // 从URL恢复状态
  if (route.query.categoryId) {
    selectedCategory.value = parseInt(route.query.categoryId);
  }
  if (route.query.page) {
    currentPage.value = parseInt(route.query.page);
  }

  fetchCategories();
  fetchBlogs();
});
</script>

<style scoped>
/* 外层容器 */
.category-wrapper {
  width: 100%;
  padding: 32px 0;
  box-sizing: border-box; /* 确保 padding 不会导致溢出 */
}

/* 标题 */
.section-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin: 0 0 24px 0;
  padding-top: 0;
  padding-left: 16px;
  position: relative;
}

/* 渐变色竖线装饰 */
.section-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 2px; /* margin-top 2px */
  bottom: 2px;
  width: 4px;
  background: linear-gradient(180deg, #17c5c5, #667eea, #f093fb); /* 渐变色竖线 */
  border-radius: 2px;
}

/* 分类筛选 */
.category-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 40px;
}

.filter-btn {
  padding: 10px 24px;
  border: none;
  background: #f5f5f5;
  color: #666;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.filter-btn:hover {
  background: #e8e8e8;
  color: #333;
}

.filter-btn.active {
  background: #17c5c5;
  color: #fff;
}

/* 博客网格 - 一行4个，两行8个 */
.blog-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px; /* 进一步减小间距，让卡片稍微窄一点 */
  margin-bottom: 56px;
  grid-auto-rows: minmax(240px, auto); /* 紧凑模式：减小最小高度 */
  align-items: stretch; /* 确保所有卡片拉伸到相同高度 */
  width: 100%; /* 确保不会溢出 */
  box-sizing: border-box; /* 包含 gap 在内 */
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
    gap: 20px; /* 统一间距 */
  }
}

@media (max-width: 960px) {
  .blog-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 18px; /* 统一间距 */
  }
}

@media (max-width: 768px) {
  .category-wrapper {
    padding: 24px 0; /* 移除左右 padding，让 App.vue 统一控制 */
  }

  .section-title {
    font-size: 20px;
    margin-bottom: 20px;
  }

  .category-filter {
    gap: 8px;
    margin-bottom: 24px;
  }

  .filter-btn {
    padding: 6px 16px;
    font-size: 13px;
  }

  .blog-grid {
    grid-template-columns: repeat(2, 1fr); /* 移动端保持2列 */
    gap: 12px; /* 减小间距以适应2列 */
    margin-bottom: 32px;
  }
}

/* iPhone SE 等小屏幕优化 */
@media (max-width: 480px) {
  .category-wrapper {
    padding: 16px 0; /* 小屏幕下减小上下 padding */
  }

  .blog-grid {
    grid-template-columns: repeat(2, 1fr); /* 即使小屏幕也保持2列 */
    gap: 10px; /* 进一步减小间距以容纳2列 */
  }

  .filter-btn {
    padding: 5px 12px;
    font-size: 12px;
  }
}
</style>
