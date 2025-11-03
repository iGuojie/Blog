<template>
  <div class="admin-home">
    <n-card title="欢迎使用鸭鸭博客管理系统">
      <n-space vertical size="large">
        <n-statistic label="总访问量" :value="0">
          <template #prefix>
            <n-icon>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path fill="currentColor" d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
              </svg>
            </n-icon>
          </template>
        </n-statistic>

        <n-alert type="info" title="提示">
          这是管理后台首页，您可以通过左侧菜单进行各项管理操作。
        </n-alert>
      </n-space>
    </n-card>
  </div>
</template>

<script setup>
import { NCard, NSpace, NStatistic, NAlert, NIcon } from 'naive-ui';
</script>

<style scoped>
.admin-home {
  max-width: 1200px;
}
</style>
