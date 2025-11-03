<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <n-layout has-sider class="admin-layout" position="absolute">
      <!-- 左侧菜单 -->
      <n-layout-sider
        bordered
        collapse-mode="width"
        :collapsed-width="64"
        :width="240"
        :collapsed="collapsed"
        :native-scrollbar="false"
        class="admin-sider"
      >
        <!-- Logo 区域 -->
        <div class="logo-container">
          <img src="/favicon.ico" alt="Logo" class="logo-img" />
          <span v-show="!collapsed" class="logo-text">鸭鸭博客</span>
        </div>

        <!-- 菜单 -->
        <n-menu
          v-model:value="activeKey"
          :collapsed="collapsed"
          :collapsed-width="64"
          :collapsed-icon-size="22"
          :options="menuOptions"
          @update:value="handleMenuSelect"
          class="admin-menu"
        />

        <!-- 底部收缩按钮 -->
        <div class="sider-footer">
          <div class="trigger-btn" @click="toggleCollapse">
            <n-icon size="20">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path v-if="collapsed" fill="currentColor" d="M10.707 17.707L16.414 12l-5.707-5.707l-1.414 1.414L13.586 12l-4.293 4.293z"/>
                <path v-else fill="currentColor" d="M13.293 6.293L7.586 12l5.707 5.707l1.414-1.414L10.414 12l4.293-4.293z"/>
              </svg>
            </n-icon>
          </div>
        </div>
      </n-layout-sider>

      <!-- 右侧内容区 -->
      <n-layout>
        <!-- 顶部面包屑 -->
        <n-layout-header bordered class="admin-header">
          <n-breadcrumb>
            <n-breadcrumb-item
              v-for="item in breadcrumbs"
              :key="item.path"
            >
              {{ item.label }}
            </n-breadcrumb-item>
          </n-breadcrumb>
        </n-layout-header>

        <!-- 内容区 -->
        <n-layout-content class="admin-content">
          <div class="content-wrapper">
            <router-view />
          </div>
        </n-layout-content>
      </n-layout>
    </n-layout>
  </n-config-provider>
</template>

<script setup>
import { ref, computed, h, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { NIcon } from 'naive-ui';
import {
  HomeOutline,
  FileTrayFullOutline,
  PricetagsOutline,
  DocumentTextOutline,
  ImageOutline,
  SettingsOutline
} from '@vicons/ionicons5';

const router = useRouter();
const route = useRoute();

// 从 localStorage 读取侧边栏收缩状态
const collapsed = ref(localStorage.getItem('adminSiderCollapsed') === 'true');
const activeKey = ref('admin-home');

// 切换收缩状态并保存到 localStorage
function toggleCollapse() {
  collapsed.value = !collapsed.value;
  localStorage.setItem('adminSiderCollapsed', collapsed.value.toString());
}

// 主题配置
const themeOverrides = {
  common: {
    primaryColor: '#17c5c5',
    primaryColorHover: '#14b0b0',
    primaryColorPressed: '#129999',
  }
};

// 渲染图标
function renderIcon(icon) {
  return () => h(NIcon, null, { default: () => h(icon) });
}

// 菜单选项
const menuOptions = [
  {
    label: '首页',
    key: 'admin-home',
    icon: renderIcon(HomeOutline)
  },
  {
    label: '文章管理',
    key: 'admin-blog',
    icon: renderIcon(DocumentTextOutline)
  },
  {
    label: '分类管理',
    key: 'admin-category',
    icon: renderIcon(FileTrayFullOutline)
  },
  {
    label: '标签管理',
    key: 'admin-label',
    icon: renderIcon(PricetagsOutline)
  },
  // {
  //   label: '图片管理',
  //   key: 'admin-image',
  //   icon: renderIcon(ImageOutline)
  // },
  // {
  //   label: '系统设置',
  //   key: 'admin-settings',
  //   icon: renderIcon(SettingsOutline)
  // }
];

// 面包屑映射
const breadcrumbMap = {
  'admin-home': [{ label: '首页', path: '/admin' }],
  'admin-blog': [
    { label: '首页', path: '/admin' },
    { label: '文章管理', path: '/admin/blog' }
  ],
  'admin-blog-edit': [
    { label: '首页', path: '/admin' },
    { label: '文章管理', path: '/admin/blog' },
    { label: '编辑文章', path: '' }
  ],
  'admin-category': [
    { label: '首页', path: '/admin' },
    { label: '分类管理', path: '/admin/category' }
  ],
  'admin-label': [
    { label: '首页', path: '/admin' },
    { label: '标签管理', path: '/admin/label' }
  ],
  'admin-image': [
    { label: '首页', path: '/admin' },
    { label: '图片管理', path: '/admin/image' }
  ],
  'admin-settings': [
    { label: '首页', path: '/admin' },
    { label: '系统设置', path: '/admin/settings' }
  ]
};

// 计算面包屑
const breadcrumbs = computed(() => {
  return breadcrumbMap[activeKey.value] || [{ label: '首页', path: '/admin' }];
});

// 菜单选择处理
function handleMenuSelect(key) {
  activeKey.value = key;
  const routeMap = {
    'admin-home': '/admin',
    'admin-blog': '/admin/blog',
    'admin-category': '/admin/category',
    'admin-label': '/admin/label',
    'admin-image': '/admin/image',
    'admin-settings': '/admin/settings'
  };
  router.push(routeMap[key]);
}

// 监听路由变化更新菜单
watch(() => route.name, (newName) => {
  if (newName) {
    activeKey.value = newName;
  }
}, { immediate: true });
</script>

<style scoped>
.admin-layout {
  height: 100vh;
  width: 100vw;
}

.admin-sider {
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
}

.admin-sider :deep(.n-layout-sider-scroll-container) {
  display: flex;
  flex-direction: column;
  height: 100%;
}

/* 菜单占据剩余空间 */
.admin-menu {
  flex: 1;
  overflow-y: auto;
}

/* Logo 区域 */
.logo-container {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 0 24px;
  border-bottom: 1px solid #f0f0f0;
  background: #fff;
}

.logo-img {
  width: 32px;
  height: 32px;
  object-fit: contain;
}

.logo-text {
  font-size: 18px;
  font-weight: bold;
  color: #17c5c5;
  white-space: nowrap;
}

/* 顶部 Header */
.admin-header {
  height: 64px;
  display: flex;
  align-items: center;
  padding: 0 24px;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

/* 内容区 */
.admin-content {
  background: #f5f5f5;
  overflow: auto;
}

.content-wrapper {
  padding: 24px;
  min-height: calc(100vh - 64px);
}

/* 侧边栏底部 */
.sider-footer {
  margin-top: auto;
  padding: 16px 0;
  border-top: 1px solid #f0f0f0;
  background: #fff;
}

.trigger-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  margin: 0 12px;
  border-radius: 6px;
  cursor: pointer;
  color: #666;
  transition: all 0.3s;
}

.trigger-btn:hover {
  background: #f0f0f0;
  color: #17c5c5;
}
</style>
