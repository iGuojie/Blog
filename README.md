# yayaBlog

基于 Vue 3 的个人博客前端。

## 技术栈

- **Vue 3** - 使用 Composition API
- **Vue Router** - 路由管理
- **Naive UI** - UI 组件库
- **Axios** - HTTP 请求
- **V-md-editor** - Markdown 编辑器和渲染器
- **Vite** - 构建工具

## 当前功能

### 核心页面
- **首页** - 博客列表展示，支持按分类筛选
- **分类页** - 分类浏览，网格布局展示博客
- **标签页** - 标签云展示，双列博客网格布局
- **归档页** - 时间轴布局，按年份和月份组织博客，支持无限滚动
- **博客详情** - Markdown 内容渲染，评论区
- **搜索** - 全局搜索功能，模态框输入，四列网格展示结果
- **关于** - 个人介绍页面

### 交互特性
- 响应式设计，适配桌面端、平板和移动端
- 移动端汉堡菜单导航
- 无限滚动加载（归档页）
- 平滑的页面过渡动画
- 毛玻璃导航栏效果

### 技术特性
- API 环境自动切换（开发/生产）
- 基于 SHA-256 的图片去重
- Markdown 代码高亮
- 自适应图片加载

## 项目结构

```
src/
├── api/           # API 接口定义
├── assets/        # 静态资源
├── components/    # 公共组件
│   ├── MenuComponent.vue      # 导航菜单
│   └── FooterComponent.vue    # 页脚
├── router/        # 路由配置
├── views/         # 页面组件
│   ├── HomeView.vue           # 首页
│   ├── CategoryView.vue       # 分类页
│   ├── LabelView.vue          # 标签页
│   ├── ArchiveView.vue        # 归档页
│   ├── BlogDetailView.vue     # 博客详情
│   ├── SearchResultView.vue   # 搜索结果
│   └── AboutView.vue          # 关于页
└── axiosconfig.js # Axios 配置
```
