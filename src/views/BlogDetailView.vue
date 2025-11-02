<template>
  <div class="blog-detail-wrapper">
    <!-- 博客内容 -->
    <v-md-preview :text="text" height="400px"></v-md-preview>
  </div>
</template>
<script setup>
import {ref} from "vue";
import {GetBlogDetail} from "@/api/BlogApi";
import {useRoute} from "vue-router";

const route = useRoute();
const text = ref(``)

GetBlogDetail(route.query.id).then(response => {
  text.value = response.data.result.content
}).catch(error => {
  // console.error('Error fetching data:', error);
});
</script>

<style scoped>
.blog-detail-wrapper {
  width: 100%;
  max-width: 100%;
}
</style>

<style>
/* 全局样式（不加scoped） */
.katex-display{
  min-height: 100%;
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
}
.katex{
  font:normal 1.05em KaTeX_Main,Times New Roman,serif;
}
</style>
