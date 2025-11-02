<template>
  <n-card class="profile-card">
    <!-- 头像和个人信息 -->
    <div class="profile-header">
      <div class="avatar-wrapper">
        <img src="/favicon.ico" alt="Mr.Chang" class="avatar rotating" />
      </div>
      <h2 class="profile-name">Mr.Chang</h2>
      <p class="profile-motto">Keep Calm and Carry On</p>
    </div>

    <!-- 社交信息 -->
    <div class="social-links">
      <div class="social-item" @click="copyToClipboard('1286602515', 'QQ')" title="点击复制QQ">
        <svg class="social-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M21.395 15.035a39.548 39.548 0 0 0-.803-2.264l-1.079-2.695c.001-.032.014-.562.014-.836C19.526 4.632 17.076 0 12 0S4.474 4.632 4.474 9.241c0 .274.013.804.014.836l-1.08 2.695a39.548 39.548 0 0 0-.802 2.264c-1.021 3.283-.69 4.643-.438 4.673.54.065 2.103-2.472 2.103-2.472 0 1.469.756 3.387 2.394 4.771-.612.188-1.363.479-1.845.835-.434.32-.379.646-.301.778.343.578 5.883.369 7.482.189 1.6.18 7.14.389 7.483-.189.078-.132.132-.458-.301-.778-.483-.356-1.233-.646-1.846-.836 1.637-1.384 2.393-3.302 2.393-4.771 0 0 1.563 2.537 2.103 2.472.251-.03.581-1.39-.438-4.673z"/>
        </svg>
      </div>
      <div class="social-item" @click="copyToClipboard('1286602515@qq.com', '邮箱')" title="点击复制邮箱">
        <svg class="social-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
        </svg>
      </div>
      <div class="social-item" @click="copyToClipboard('wx_jie2023', '微信')" title="点击复制微信号">
        <svg class="social-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.452 9.532c.188 0 .372.01.556.028-1.02-4.719-5.811-7.93-10.703-7.177C3.575 2.992.248 6.843.061 11.563c-.09 2.25.588 4.373 1.876 6.063l-1.857 5.533 5.852-2.882c.96.266 1.97.414 3.014.414.181 0 .362-.007.542-.019a7.793 7.793 0 0 1-.346-2.284c0-4.354 3.628-7.856 8.31-7.856zM7.545 6.42c.836 0 1.515.665 1.515 1.485s-.679 1.485-1.515 1.485a1.501 1.501 0 0 1-1.515-1.485c0-.82.679-1.485 1.515-1.485zm7.13 0c.836 0 1.515.665 1.515 1.485s-.679 1.485-1.515 1.485a1.501 1.501 0 0 1-1.515-1.485c0-.82.679-1.485 1.515-1.485zm3.777 4.597c-3.67 0-6.635 2.75-6.635 6.136 0 3.387 2.965 6.136 6.635 6.136.766 0 1.506-.12 2.19-.34l3.826 1.885-1.213-3.617c1.515-1.248 2.467-3.072 2.467-5.064 0-3.386-2.965-6.136-6.635-6.136h-.635zm-2.384 4.651c.55 0 .997.436.997.974a.986.986 0 0 1-.997.974.986.986 0 0 1-.997-.974c0-.538.447-.974.997-.974zm4.768 0c.55 0 .997.436.997.974a.986.986 0 0 1-.997.974.986.986 0 0 1-.997-.974c0-.538.447-.974.997-.974z"/>
        </svg>
      </div>
    </div>

    <!-- 统计信息 -->
    <div class="stats">
      <div class="stat-item clickable" @click="navigateToHome" title="点击查看所有文章">
        <div class="stat-value">{{ blogCount }}</div>
        <div class="stat-label">文章</div>
      </div>
      <div class="stat-item clickable" @click="navigateToCategory" title="点击查看所有分类">
        <div class="stat-value">{{ categoryCount }}</div>
        <div class="stat-label">分类</div>
      </div>
      <div class="stat-item clickable" @click="navigateToLabel" title="点击查看所有标签">
        <div class="stat-value">{{ labelCount }}</div>
        <div class="stat-label">标签</div>
      </div>
    </div>
  </n-card>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useMessage } from 'naive-ui';
import { useRouter } from 'vue-router';
import { GetPanelData } from '@/api/BlogApi';

const message = useMessage();
const router = useRouter();
const blogCount = ref(0);
const categoryCount = ref(0);
const labelCount = ref(0);

// 获取面板数据
const fetchPanelData = async () => {
  try {
    const response = await GetPanelData();
    if (response.data.code === '666666') {
      blogCount.value = response.data.result.blogCount;
      categoryCount.value = response.data.result.categoryCount;
      labelCount.value = response.data.result.labelCount;
    }
  } catch (error) {
    console.error('获取面板数据失败:', error);
  }
};

// 复制到剪贴板
const copyToClipboard = async (text, label) => {
  try {
    await navigator.clipboard.writeText(text);
    message.success(`${label}复制成功：${text}`);
  } catch (err) {
    // 降级方案：使用旧API
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-9999px';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      message.success(`${label}复制成功：${text}`);
    } catch (e) {
      message.error('复制失败，请手动复制');
    }
  }
};

// 跳转到首页
const navigateToHome = () => {
  router.push({ name: 'home' });
};

// 跳转到分类页
const navigateToCategory = () => {
  router.push({ name: 'category' });
};

// 跳转到标签页
const navigateToLabel = () => {
  router.push({ name: 'label' });
};

onMounted(() => {
  fetchPanelData();
});
</script>

<style scoped>
.profile-card {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

/* 头像和个人信息 */
.profile-header {
  text-align: center;
  padding: 24px 16px 16px; /* 减小上下padding */
}

.avatar-wrapper {
  width: 90px; /* 稍微缩小头像 */
  height: 90px;
  margin: 0 auto 16px; /* 减小间距 */
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar {
  width: 60%;
  height: 60%;
  object-fit: contain;
}

/* 旋转动画 */
.rotating {
  animation: rotate 8s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.profile-name {
  font-size: 22px; /* 稍微缩小字体 */
  font-weight: bold;
  color: #333;
  margin: 0 0 6px 0; /* 减小间距 */
}

.profile-motto {
  font-size: 13px; /* 稍微缩小字体 */
  color: #666;
  margin: 0;
  font-style: italic;
}

/* 社交信息 */
.social-links {
  display: flex;
  justify-content: center;
  gap: 28px; /* 减小间距 */
  padding: 12px 16px; /* 减小上下padding */
}

.social-item {
  cursor: pointer;
  transition: all 0.3s;
  padding: 8px;
}

.social-item:hover {
  transform: scale(1.2);
}

.social-icon {
  width: 22px;
  height: 22px;
  color: #333;
}

/* 统计信息 */
.stats {
  display: flex;
  justify-content: center;
  gap: 32px; /* 减小间距 */
  padding: 8px 16px 20px; /* 减小上下padding，特别是底部 */
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.stat-item.clickable {
  cursor: pointer;
  transition: all 0.3s ease;
}

.stat-item.clickable:hover {
  transform: translateY(-2px);
}

.stat-item.clickable:hover .stat-value,
.stat-item.clickable:hover .stat-label {
  color: #17c5c5; /* 同时高亮数值和标签 */
}

.stat-value {
  font-size: 20px; /* 稍微缩小字体 */
  font-weight: bold;
  color: #333;
  line-height: 1;
}

.stat-label {
  font-size: 13px; /* 稍微缩小字体 */
  color: #666;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .profile-header {
    padding: 16px 12px 12px; /* 大幅减小移动端的padding */
  }

  .avatar-wrapper {
    width: 70px; /* 移动端更小的头像 */
    height: 70px;
    margin: 0 auto 12px; /* 减小间距 */
  }

  .profile-name {
    font-size: 18px; /* 移动端更小的字体 */
    margin: 0 0 4px 0;
  }

  .profile-motto {
    font-size: 12px; /* 移动端更小的字体 */
  }

  .social-links {
    gap: 20px; /* 减小间距 */
    padding: 8px 12px; /* 大幅减小padding */
  }

  .social-icon {
    width: 20px; /* 移动端更小的图标 */
    height: 20px;
  }

  .stats {
    gap: 24px; /* 减小间距 */
    padding: 8px 12px 16px; /* 大幅减小padding，特别是底部 */
  }

  .stat-value {
    font-size: 18px; /* 移动端更小的字体 */
  }

  .stat-label {
    font-size: 12px; /* 移动端更小的字体 */
  }
}
</style>
