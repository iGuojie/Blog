<template>
  <header class="navbar">
    <div class="navbar-container">
      <!-- 左侧 Logo -->
      <div class="navbar-left">
        <div class="logo" @click="handleNavigate('home')">
          <img src="/favicon.ico" alt="Logo" class="logo-img" />
<!--          <span class="logo-text">MRSUN</span>-->
        </div>
      </div>

      <!-- 中间导航菜单 -->
      <nav class="navbar-center">
        <a
          v-for="item in menuItems"
          :key="item.key"
          :class="['nav-link', { active: activeKey === item.key }]"
          @click="handleNavigate(item.key)"
        >
          {{ item.label }}
        </a>
      </nav>

<!--       右侧功能区 -->
      <div class="navbar-right">
        <button class="icon-btn" title="搜索" @click="showSearchModal = true">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
        </button>
        <!-- 汉堡菜单按钮（仅移动端显示） -->
        <button class="icon-btn mobile-menu-btn" title="菜单" @click="showMobileMenu = !showMobileMenu">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
<!--        <button class="icon-btn" title="夜间模式">-->
<!--          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">-->
<!--            <circle cx="12" cy="12" r="4"></circle>-->
<!--            <path d="M12 2v2"></path>-->
<!--            <path d="M12 20v2"></path>-->
<!--            <path d="m4.93 4.93 1.41 1.41"></path>-->
<!--            <path d="m17.66 17.66 1.41 1.41"></path>-->
<!--            <path d="M2 12h2"></path>-->
<!--            <path d="M20 12h2"></path>-->
<!--            <path d="m6.34 17.66-1.41 1.41"></path>-->
<!--            <path d="m19.07 4.93-1.41 1.41"></path>-->
<!--          </svg>-->
<!--        </button>-->
<!--        <button class="login-btn">登录</button>-->
      </div>
    </div>

    <!-- 移动端下拉菜单 -->
    <div v-if="showMobileMenu" class="mobile-menu">
      <a
        v-for="item in menuItems"
        :key="item.key"
        :class="['mobile-menu-item', { active: activeKey === item.key }]"
        @click="handleNavigate(item.key)"
      >
        {{ item.label }}
      </a>
    </div>
  </header>

  <!-- 移动端菜单遮罩 -->
  <teleport to="body">
    <div v-if="showMobileMenu" class="mobile-menu-overlay" @click="showMobileMenu = false"></div>
  </teleport>

  <!-- 搜索模态框 - 使用 teleport 传送到 body -->
  <teleport to="body">
    <div v-if="showSearchModal" class="search-modal" @click="closeSearchModal">
      <div class="search-modal-content" @click.stop>
        <div class="search-header">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <input
            ref="searchInput"
            v-model="searchKeyword"
            type="text"
            placeholder="搜索文章..."
            class="search-input"
            @keyup.enter="performSearch"
          />
          <button class="close-btn" @click="closeSearchModal">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class="search-footer">
          <button class="search-btn" @click="performSearch">搜索</button>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { ref, defineExpose, nextTick, computed } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();
const emit = defineEmits(['activeKeyChanged']);
const activeKey = ref('home');
const showSearchModal = ref(false);
const searchKeyword = ref('');
const searchInput = ref(null);
const showMobileMenu = ref(false);

const menuItems = ref([
  { label: "首页", key: "home" },
  { label: "分类", key: "category" },
  { label: "标签", key: "label" },
  { label: "归档", key: "archive" },
  { label: "关于我", key: "about" }
]);

function handleNavigate(key) {
  activeKey.value = key;
  emit('activeKeyChanged', key);
  // 关闭移动端菜单
  showMobileMenu.value = false;
}

// 暴露方法供父组件调用
function setActiveKey(key) {
  // 允许设置null来清除高亮状态
  activeKey.value = key;
}

// 关闭搜索模态框
const closeSearchModal = () => {
  showSearchModal.value = false;
  searchKeyword.value = '';
};

// 执行搜索
const performSearch = () => {
  if (!searchKeyword.value.trim()) {
    return;
  }

  // 跳转到搜索结果页
  router.push({
    name: 'search',
    query: { keyword: searchKeyword.value.trim() }
  });

  // 关闭模态框
  closeSearchModal();
};

// 监听模态框显示，自动聚焦输入框
const handleModalShow = async () => {
  if (showSearchModal.value) {
    await nextTick();
    searchInput.value?.focus();
  }
};

// 使用watch监听showSearchModal变化
import { watch } from 'vue';
watch(showSearchModal, handleModalShow);

// 监听路由变化，关闭搜索模态框和移动端菜单
watch(() => route.name, () => {
  if (showSearchModal.value) {
    closeSearchModal();
  }
  if (showMobileMenu.value) {
    showMobileMenu.value = false;
  }
});

defineExpose({
  setActiveKey
});
</script>

<style scoped>
.navbar {
  /* 毛玻璃效果 */
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  position: sticky;
  top: 0;
  z-index: 1000;
  width: 100%;
}

.navbar-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* 左侧 Logo */
.navbar-left {
  flex: 0 0 auto;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: opacity 0.2s;
}

.logo:hover {
  opacity: 0.8;
}

.logo-img {
  width: 32px;
  height: 32px;
  object-fit: contain;
}

.logo-text {
  font-size: 22px;
  font-weight: bold;
  color: #17c5c5;
  letter-spacing: 1px;
}

/* 中间导航 */
.navbar-center {
  flex: 1;
  display: flex;
  justify-content: center;
  gap: 32px;
}

.nav-link {
  color: #333;
  font-size: 15px;
  text-decoration: none;
  cursor: pointer;
  position: relative;
  padding: 4px 0;
  transition: color 0.2s;
}

.nav-link:hover {
  color: #17c5c5;
}

.nav-link.active {
  color: #17c5c5;
  font-weight: 500;
}

.nav-link.active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 2px;
  background-color: #17c5c5;
}

/* 右侧功能区 */
.navbar-right {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  gap: 16px;
}

.icon-btn {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s;
}

.icon-btn:hover {
  background-color: rgba(0, 0, 0, 0.05);
  color: #333;
}

.icon-btn.active {
  background-color: rgba(23, 197, 197, 0.1);
  color: #17c5c5;
}

/* 汉堡菜单按钮 - 默认隐藏 */
.mobile-menu-btn {
  display: none;
}

.login-btn {
  background-color: transparent;
  border: 1px solid #17c5c5;
  color: #17c5c5;
  padding: 6px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.login-btn:hover {
  background-color: #17c5c5;
  color: white;
}

/* 移动端菜单遮罩 */
.mobile-menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.2);
  z-index: 998;
  animation: fadeIn 0.2s ease;
}

/* 移动端下拉菜单 */
.mobile-menu {
  position: absolute;
  top: 60px;
  right: 16px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  min-width: 140px;
  overflow: hidden;
  animation: slideDown 0.2s ease;
  z-index: 999;
}

.mobile-menu-item {
  display: block;
  padding: 14px 20px;
  color: #333;
  font-size: 15px;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s;
  border-bottom: 1px solid #f0f0f0;
}

.mobile-menu-item:last-child {
  border-bottom: none;
}

.mobile-menu-item:hover {
  background-color: rgba(23, 197, 197, 0.05);
  color: #17c5c5;
}

.mobile-menu-item.active {
  background-color: rgba(23, 197, 197, 0.1);
  color: #17c5c5;
  font-weight: 500;
}

/* 搜索模态框 */
.search-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 2000;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 120px;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.search-modal-content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  width: 90%;
  max-width: 600px;
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.search-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px 24px;
  border-bottom: 1px solid #f0f0f0;
}

.search-header svg {
  color: #999;
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 16px;
  color: #333;
  min-width: 0;
}

.search-input::placeholder {
  color: #ccc;
}

.close-btn {
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s;
}

.close-btn:hover {
  background-color: rgba(0, 0, 0, 0.05);
  color: #333;
}

.search-footer {
  padding: 16px 24px;
  display: flex;
  justify-content: flex-end;
}

.search-btn {
  background: linear-gradient(135deg, #17c5c5, #667eea);
  color: white;
  border: none;
  padding: 10px 32px;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 500;
}

.search-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(23, 197, 197, 0.3);
}

.search-btn:active {
  transform: translateY(0);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .navbar-container {
    padding: 0 16px;
    height: 56px;
  }

  .logo-img {
    width: 28px;
    height: 28px;
  }

  .logo-text {
    font-size: 18px;
  }

  /* 隐藏中间导航菜单 */
  .navbar-center {
    display: none;
  }

  /* 显示汉堡菜单按钮 */
  .mobile-menu-btn {
    display: flex;
  }

  .navbar-right {
    gap: 8px;
  }

  .login-btn {
    padding: 6px 16px;
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .logo-img {
    width: 24px;
    height: 24px;
  }

  .logo-text {
    font-size: 16px;
  }

  .icon-btn {
    padding: 6px;
  }

  .login-btn {
    padding: 6px 12px;
    font-size: 12px;
  }

  .mobile-menu {
    right: 12px;
    min-width: 120px;
  }

  .mobile-menu-item {
    padding: 12px 16px;
    font-size: 14px;
  }
}
</style>
