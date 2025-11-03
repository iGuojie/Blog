<template>
  <div class="label-wrapper">
    <div class="label-container">
      <!-- 左侧标签云 -->
      <aside class="label-sidebar">
        <div class="label-cloud">
          <!-- 全部标签按钮 -->
          <button
            :class="['label-item', { active: selectedLabel === null }]"
            @click="selectLabel(null)"
          >
            <span class="label-hash">#</span>
            <span class="label-name">全部</span>
            <span class="label-count">{{ totalBlogCount }}</span>
          </button>

          <!-- 标签列表 -->
          <button
            v-for="label in labels"
            :key="label.id"
            :class="['label-item', { active: selectedLabel === label.id }]"
            @click="selectLabel(label.id)"
          >
            <span class="label-hash">#</span>
            <span class="label-name">{{ label.name }}</span>
            <span class="label-count">{{ label.count || 0 }}</span>
          </button>
        </div>
      </aside>

      <!-- 右侧博客列表 -->
      <main class="label-content">
        <!-- 标题 -->
        <h2 ref="sectionTitle" class="section-title">
          {{ selectedLabelName }}
        </h2>

        <!-- 博客网格 - 2列横向卡片 -->
        <div class="blog-grid">
          <BlogCardHorizontal
            v-for="blog in blogs"
            :key="blog.id"
            :blog="blog"
          />
        </div>

        <!-- 空状态 -->
        <div v-if="blogs.length === 0" class="empty-state">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
            <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
            <line x1="7" y1="7" x2="7.01" y2="7"></line>
          </svg>
          <p>该标签下暂无文章</p>
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
      </main>
    </div>
  </div>
</template>

<script setup>
import { GetBlogList, GetLabelList, GetBlogCount } from "@/api/BlogApi";
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import BlogCardHorizontal from "@/components/BlogCardHorizontal.vue";
import { NPagination } from 'naive-ui';

const route = useRoute();
const router = useRouter();
const blogs = ref([]);
const labels = ref([]);
const selectedLabel = ref(null);
const currentPage = ref(1);
const pageSize = ref(6); // 每页10个（5行，每行2个）
const totalPages = ref(1);
const total = ref(0);
const sectionTitle = ref(null);
const totalBlogCount = ref(0);

// 当前选中标签的名称
const selectedLabelName = computed(() => {
  if (selectedLabel.value === null) {
    return '全部文章';
  }
  const label = labels.value.find(l => l.id === selectedLabel.value);
  return label ? `# ${label.name}` : '文章列表';
});

// 获取文章总数
const fetchBlogCount = async () => {
  try {
    const response = await GetBlogCount();
    if (response.data.code === '666666') {
      totalBlogCount.value = response.data.result || 0;
    }
  } catch (error) {
    console.error('获取文章总数失败:', error);
  }
};

// 获取标签列表
const fetchLabels = async () => {
  try {
    const response = await GetLabelList();
    if (response.data.code === '666666') {
      labels.value = response.data.result;
    }
  } catch (error) {
    console.error('获取标签列表失败:', error);
  }
};

// 获取博客列表
const fetchBlogs = async () => {
  try {
    const params = {
      pageNum: currentPage.value,
      pageSize: pageSize.value
    };

    // 如果选择了标签，添加 labelId 参数
    if (selectedLabel.value !== null) {
      params.labelId = selectedLabel.value;
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

// 选择标签
const selectLabel = (labelId) => {
  selectedLabel.value = labelId;
  currentPage.value = 1; // 重置到第一页

  // 更新URL，保持状态
  const query = labelId ? { labelId } : {};
  router.replace({ name: 'label', query });

  fetchBlogs();
};

// 页码变化
const handlePageChange = (page) => {
  currentPage.value = page;

  // 更新URL，保持分页状态
  const query = {};
  if (selectedLabel.value) {
    query.labelId = selectedLabel.value;
  }
  if (page > 1) {
    query.page = page;
  }
  router.replace({ name: 'label', query });

  fetchBlogs();
  // 滚动到文章列表标题
  // if (sectionTitle.value) {
  //   sectionTitle.value.scrollIntoView({ behavior: 'smooth', block: 'start' });
  // }
};

onMounted(() => {
  // 从URL恢复状态
  if (route.query.labelId) {
    selectedLabel.value = parseInt(route.query.labelId);
  }
  if (route.query.page) {
    currentPage.value = parseInt(route.query.page);
  }

  fetchLabels();
  fetchBlogs();
  fetchBlogCount();
});
</script>

<style scoped>
/* 外层容器 */
.label-wrapper {
  width: 100%;
}

/* 整体布局 */
.label-container {
  display: flex;
  align-items: flex-start;
  gap: 32px;
  max-width: 100%;
  margin: 0;
  padding-top: 32px;
}

/* 左侧标签云 */
.label-sidebar {
  flex: 0 0 200px;
}

.label-cloud {
  position: sticky;
  top: 80px;
  margin-top: 60px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.label-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: #f5f5f5;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
}

.label-item:hover {
  background: #e8e8e8;
  color: #333;
}

.label-item.active {
  background: #17c5c5;
  color: #fff;
}

.label-hash {
  font-weight: 500;
  color: #17c5c5;
}

.label-item.active .label-hash {
  color: #fff;
}

.label-name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.label-count {
  font-size: 12px;
  opacity: 0.8;
}

/* 右侧内容区 */
.label-content {
  flex: 1;
  min-width: 0;
}

/* 标题 */
.section-title {
  font-size: 24px;
  font-weight: bold;
  color: #17c5c5;
  margin: 0 0 24px 0;
  padding-left: 16px;
  position: relative;
}

.section-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 2px;
  bottom: 2px;
  width: 4px;
  background: linear-gradient(180deg, #17c5c5, #667eea, #f093fb);
  border-radius: 2px;
}

/* 博客网格 - 2列布局 */
.blog-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 56px;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  color: #999;
}

.empty-state svg {
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-state p {
  font-size: 14px;
  margin: 0;
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
    grid-template-columns: 1fr;
    gap: 16px;
  }
}

@media (max-width: 960px) {
  .label-container {
    flex-direction: column;
    gap: 24px;
  }

  .label-sidebar {
    flex: 0 0 auto;
  }

  .label-cloud {
    position: static;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 12px;
  }

  .label-item {
    flex: 0 0 auto;
  }
}

@media (max-width: 768px) {
  .label-container {
    padding-top: 24px;
    gap: 16px;
  }

  .section-title {
    font-size: 20px;
    margin-bottom: 20px;
  }

  .label-cloud {
    gap: 8px;
  }

  .label-item {
    padding: 8px 12px;
    font-size: 13px;
  }

  .blog-grid {
    margin-bottom: 32px;
    gap: 12px;
  }
}
</style>
