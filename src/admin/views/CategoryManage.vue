<template>
  <div class="category-manage">
    <n-card title="分类管理">
      <!-- 操作栏 -->
      <template #header-extra>
        <n-button type="primary" @click="handleAdd">
          <template #icon>
            <n-icon>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
              </svg>
            </n-icon>
          </template>
          新增分类
        </n-button>
      </template>

      <!-- 分类列表 -->
      <n-data-table
        :columns="columns"
        :data="categoryList"
        :loading="loading"
        :pagination="pagination"
        :bordered="false"
      />
    </n-card>

    <!-- 新增/编辑对话框 -->
    <n-modal
      v-model:show="showModal"
      :title="modalTitle"
      preset="dialog"
      :positive-text="isEdit ? '更新' : '添加'"
      negative-text="取消"
      @positive-click="handleSubmit"
    >
      <n-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-placement="left"
        label-width="80"
        style="margin-top: 24px"
      >
        <n-form-item label="分类名称" path="name">
          <n-input
            v-model:value="formData.name"
            placeholder="请输入分类名称"
            maxlength="50"
            show-count
          />
        </n-form-item>
        <n-form-item label="分类描述" path="description">
          <n-input
            v-model:value="formData.description"
            type="textarea"
            placeholder="请输入分类描述"
            maxlength="200"
            show-count
            :rows="4"
          />
        </n-form-item>
      </n-form>
    </n-modal>
  </div>
</template>

<script setup>
import { ref, h, onMounted } from 'vue';
import { NButton, NIcon, NSpace, NPopconfirm, useMessage } from 'naive-ui';
import { addCategory, updateCategory, deleteCategory, getCategoryListWithPage } from '@/api/CategoryApi';

const message = useMessage();
const loading = ref(false);
const showModal = ref(false);
const isEdit = ref(false);
const formRef = ref(null);
const categoryList = ref([]);

// 表单数据
const formData = ref({
  id: null,
  name: '',
  description: ''
});

// 表单验证规则
const rules = {
  name: [
    { required: true, message: '请输入分类名称', trigger: 'blur' },
    { max: 50, message: '分类名称最多50个字符', trigger: 'blur' }
  ],
  description: [
    { max: 200, message: '分类描述最多200个字符', trigger: 'blur' }
  ]
};

// 分页配置
const pagination = ref({
  page: 1,
  pageSize: 10,
  itemCount: 0,
  showSizePicker: true,
  pageSizes: [10, 20, 50],
  onChange: (page) => {
    pagination.value.page = page;
    fetchCategoryList();
  },
  onUpdatePageSize: (pageSize) => {
    pagination.value.pageSize = pageSize;
    pagination.value.page = 1;
    fetchCategoryList();
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
    title: '分类名称',
    key: 'name',
    ellipsis: {
      tooltip: true
    },

    width: 180
  },
  {
    title: '描述',
    key: 'description',
    ellipsis: {
      tooltip: true
    },
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
              onClick: () => handleEdit(row)
            },
            { default: () => '编辑' }
          ),
          h(
            NPopconfirm,
            {
              onPositiveClick: () => handleDelete(row.id)
            },
            {
              default: () => '确定要删除这个分类吗？',
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

// 模态框标题
const modalTitle = ref('新增分类');

// 获取分类列表
async function fetchCategoryList() {
  loading.value = true;
  try {
    const response = await getCategoryListWithPage(pagination.value.page, pagination.value.pageSize);
    if (response.data.code === '666666') {
      const result = response.data.result;
      categoryList.value = result.list || [];
      pagination.value.itemCount = result.page?.total || 0;
    } else {
      message.error(response.data.message || '获取分类列表失败');
    }
  } catch (error) {
    console.error('获取分类列表失败:', error);
    message.error('获取分类列表失败');
  } finally {
    loading.value = false;
  }
}

// 新增
function handleAdd() {
  isEdit.value = false;
  modalTitle.value = '新增分类';
  formData.value = {
    id: null,
    name: '',
    description: ''
  };
  showModal.value = true;
}

// 编辑
function handleEdit(row) {
  isEdit.value = true;
  modalTitle.value = '编辑分类';
  formData.value = {
    id: row.id,
    name: row.name,
    description: row.description || ''
  };
  showModal.value = true;
}

// 删除
async function handleDelete(id) {
  try {
    const response = await deleteCategory({ id });
    if (response.data.code === '666666') {
      message.success('删除成功');
      await fetchCategoryList();
    } else {
      message.error(response.data.message || '删除失败');
    }
  } catch (error) {
    console.error('删除分类失败:', error);
    message.error('删除失败');
  }
}

// 提交表单
async function handleSubmit() {
  try {
    await formRef.value?.validate();

    const api = isEdit.value ? updateCategory : addCategory;
    const response = await api(formData.value);

    if (response.data.code === '666666') {
      message.success(isEdit.value ? '更新成功' : '添加成功');
      showModal.value = false;
      await fetchCategoryList();
    } else {
      message.error(response.data.message || '操作失败');
      return false; // 阻止对话框关闭
    }
  } catch (error) {
    console.error('提交失败:', error);
    message.error('操作失败');
    return false; // 阻止对话框关闭
  }
}

// 初始化
onMounted(() => {
  fetchCategoryList();
});
</script>

<style scoped>
.category-manage {
  max-width: 1400px;
}
</style>
