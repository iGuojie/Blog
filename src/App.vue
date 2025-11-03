<template>
  <n-message-provider>
    <!-- 只在非管理后台页面显示前台导航和页脚 -->
    <template v-if="!isAdminRoute">
      <MenuComponent ref="sonRef" @activeKeyChanged="activeKeyChanged"/>
      <div id="router">
        <RouterView/>
      </div>
      <FooterComponent />
    </template>
    <!-- 管理后台页面不显示导航和页脚 -->
    <template v-else>
      <RouterView/>
    </template>
  </n-message-provider>
</template>

<script setup>
import {ref, onMounted, watch} from "vue";
import MenuComponent from "@/components/MenuComponent.vue";
import FooterComponent from "@/components/FooterComponent.vue";
import { useRouter, useRoute } from 'vue-router';
import { NMessageProvider } from 'naive-ui';

const activeKey = ref('home');
const sonRef = ref(null) // 通过 ref 绑定子组件
const router = useRouter();
const route = useRoute();

// 判断是否为管理后台路由
const isAdminRoute = ref(false);

watch(() => route.path, (newPath) => {
  isAdminRoute.value = newPath.startsWith('/admin');
}, { immediate: true });

// 根据当前路由更新菜单状态
function updateActiveKeyFromRoute() {
  const routeName = route.name;
  if (routeName === 'home' || routeName === 'category' || routeName === 'label' || routeName === 'archive' || routeName === 'about') {
    activeKey.value = routeName;
    // 同步子组件的状态
    if (sonRef.value) {
      sonRef.value.setActiveKey(routeName);
    }
  } else {
    // 如果是博客详情页、搜索页等其他页面，清除导航栏的高亮状态
    if (sonRef.value) {
      sonRef.value.setActiveKey(null);
    }
  }
}

function activeKeyChanged(value) {
  // console.log(value)
  // 始终导航到指定路由，即使当前activeKey相同（解决博客详情页点击首页无反应的问题）
  router.push({ name: value });
  activeKey.value = value;
}

// 监听路由变化
watch(() => route.name, () => {
  updateActiveKeyFromRoute();
});

onMounted(() => {
  updateActiveKeyFromRoute();
});
</script>

<style scoped>
/* 扩大内容区域宽度 */
#router {
  box-sizing: border-box;
  width: 100%;
  max-width: 1400px;            /* 增加最大宽度到 1400px */
  padding-inline: clamp(24px, 4vw, 60px); /* 增加两侧空白 */
  margin: 0 auto;               /* 居中 */
  overflow-x: hidden;           /* 防止内容溢出 */
}

/* 响应式设计 */
@media (max-width: 1024px) {
  #router {
    max-width: 100%;
    padding-inline: 20px;
  }
}

@media (max-width: 768px) {
  #router {
    max-width: 100%;
    padding-inline: 16px; /* 增加小屏幕的左右 padding */
  }
}

/* iPhone SE 等小屏幕优化 */
@media (max-width: 480px) {
  #router {
    padding-inline: 12px; /* 小屏幕下稍微减小 padding */
  }
}

/* 让内容别撑破：通用的图片/表格/公式横向处理（可选） */
#router :deep(img),
#router :deep(table),
#router :deep(.katex-display) {
  max-width: 100%;
  overflow-x: auto;
}
</style>
