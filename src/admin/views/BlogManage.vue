<template>
  <div class="blog-manage">
    <n-card title="文章管理">
      <!-- 搜索栏 -->
      <template #header-extra>
        <n-space>
          <n-input
            v-model:value="searchParams.keyword"
            placeholder="搜索文章标题"
            clearable
            style="width: 200px"
            @keyup.enter="handleSearch"
          >
            <template #prefix>
              <n-icon>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5A6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5S14 7.01 14 9.5S11.99 14 9.5 14z"/>
                </svg>
              </n-icon>
            </template>
          </n-input>
          <n-select
            v-model:value="searchParams.categoryId"
            placeholder="选择分类"
            clearable
            style="width: 150px"
            :options="categoryOptions"
            @update:value="handleSearch"
          />
          <n-select
            v-model:value="searchParams.labelId"
            placeholder="选择标签"
            clearable
            style="width: 150px"
            :options="labelOptions"
            @update:value="handleSearch"
          />
          <n-button type="primary" @click="handleSearch">搜索</n-button>
          <n-button @click="handleReset">重置</n-button>
        </n-space>
      </template>

      <!-- 文章列表 -->
      <n-data-table
        :columns="columns"
        :data="blogList"
        :loading="loading"
        :pagination="pagination"
        :bordered="false"
      />
    </n-card>
  </div>
</template>

<script setup>
import { ref, h, onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { NButton, NSpace, NPopconfirm, NTag, useMessage } from 'naive-ui';
import { getBlogList, deleteBlog } from '@/api/BlogApi';
import { getCategoryList } from '@/api/CategoryApi';
import { getLabelList } from '@/api/LabelApi';

const router = useRouter();
const message = useMessage();
const loading = ref(false);
const blogList = ref([]);
const categoryOptions = ref([]);
const labelOptions = ref([]);

// 搜索参数
const searchParams = reactive({
  keyword: '',
  categoryId: null,
  labelId: null
});

// 分页配置
const pagination = reactive({
  page: 1,
  pageSize: 10,
  itemCount: 0,
  showSizePicker: true,
  pageSizes: [10, 20, 50],
  onChange: (page) => {
    pagination.page = page;
    fetchBlogList();
  },
  onUpdatePageSize: (pageSize) => {
    pagination.pageSize = pageSize;
    pagination.page = 1;
    fetchBlogList();
  }
});

// 表格列配置
const columns = [
  {
    title: 'ID',
    key: 'id',
    width: 80
  },
  {
    title: '文章标题',
    key: 'name',
    ellipsis: {
      tooltip: true
    },
    width: 300
  },
  {
    title: '摘要',
    key: 'abstracts',
    ellipsis: {
      tooltip: true
    },
    width: 300
  },
  {
    title: '创建时间',
    key: 'createTime',
    width: 180
  },
  {
    title: '操作',
    key: 'actions',
    width: 180,
    render(row) {
      return h(NSpace, null, {
        default: () => [
          h(
            NButton,
            {
              size: 'small',
              type: 'primary',
              onClick: () => handleEdit(row.id)
            },
            { default: () => '编辑' }
          ),
          h(
            NPopconfirm,
            {
              onPositiveClick: () => handleDelete(row.id)
            },
            {
              default: () => '确定要删除这篇文章吗？',
              trigger: () =>
                h(
                  NButton,
                  {
                    size: 'small',
                    type: 'error'
                  },
                  { default: () => '删除' }
                )
            }
          )
        ]
      });
    }
  }
];

// 获取文章列表
async function fetchBlogList() {
  loading.value = true;
  try {
    const params = {
      keyword: searchParams.keyword || undefined,
      categoryId: searchParams.categoryId || undefined,
      labelId: searchParams.labelId || undefined,
      pageNum: pagination.page,
      pageSize: pagination.pageSize
    };

    const response = await getBlogList(params);

    if (response.data.code === '666666') {
      const result = response.data.result;
      blogList.value = result.list || [];
      pagination.itemCount = result.page?.total || 0;
    } else {
      message.error(response.data.message || '获取文章列表失败');
    }
  } catch (error) {
    console.error('获取文章列表失败:', error);
    message.error('获取文章列表失败');
  } finally {
    loading.value = false;
  }
}

// 获取分类列表
async function fetchCategoryList() {
  try {
    const response = await getCategoryList();
    if (response.data.code === '666666') {
      const result = response.data.result;
      let list = [];

      // 兼容不同的数据格式
      if (Array.isArray(result)) {
        list = result;
      } else if (result && Array.isArray(result.list)) {
        list = result.list;
      } else if (result && Array.isArray(result.data)) {
        list = result.data;
      }

      categoryOptions.value = list.map(item => ({
        label: item.name,
        value: item.id
      }));
    }
  } catch (error) {
    console.error('获取分类列表失败:', error);
  }
}

// 获取标签列表
async function fetchLabelList() {
  try {
    const response = await getLabelList();
    if (response.data.code === '666666') {
      const result = response.data.result;
      let list = [];

      // 兼容不同的数据格式
      if (Array.isArray(result)) {
        list = result;
      } else if (result && Array.isArray(result.list)) {
        list = result.list;
      } else if (result && Array.isArray(result.data)) {
        list = result.data;
      }

      labelOptions.value = list.map(item => ({
        label: item.name,
        value: item.id
      }));
    }
  } catch (error) {
    console.error('获取标签列表失败:', error);
  }
}

// 搜索
function handleSearch() {
  pagination.page = 1;
  fetchBlogList();
}

// 重置
function handleReset() {
  searchParams.keyword = '';
  searchParams.categoryId = null;
  searchParams.labelId = null;
  pagination.page = 1;
  fetchBlogList();
}

// 编辑
function handleEdit(id) {
  router.push({
    name: 'admin-blog-edit',
    query: { id }
  });
}

// 删除
async function handleDelete(id) {
  try {
    const response = await deleteBlog(id);
    if (response.data.code === '666666') {
      message.success('删除成功');
      await fetchBlogList();
    } else {
      message.error(response.data.message || '删除失败');
    }
  } catch (error) {
    console.error('删除文章失败:', error);
    message.error('删除失败');
  }
}

// 初始化
onMounted(() => {
  fetchBlogList();
  fetchCategoryList();
  fetchLabelList();
});
</script>

<style scoped>
.blog-manage {
  max-width: 1400px;
}
</style>
