import '@/assets/css/reset.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import naive from 'naive-ui'
import 'vfonts/Lato.css'
import axiosInstance from './axiosconfig'
import VueMarkdownEditor from '@kangc/v-md-editor'
import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js'
import VMdPreview from '@kangc/v-md-editor/lib/preview'

import '@kangc/v-md-editor/lib/style/base-editor.css'
import '@kangc/v-md-editor/lib/theme/style/vuepress.css'

import Prism from 'prismjs'
import hljs from 'highlight.js'
import createKatexPlugin from '@kangc/v-md-editor/lib/plugins/katex/npm';
import 'katex/dist/katex.min.css';

const app = createApp(App)

// naive-ui、路由、axios
app.use(naive)
app.use(router)
app.config.globalProperties.$axios = axiosInstance

// 编辑器（含 TOC 配置 + KaTeX）
VueMarkdownEditor
    .use(vuepressTheme, {
        Prism
    }, {
        config: {
            toc: { includeLevel: [1, 2] }
        }
    })
    .use(createKatexPlugin())

// 预览（用 hljs + KaTeX）
VMdPreview
    .use(vuepressTheme, {
        Hljs: hljs
    })
    .use(createKatexPlugin())

app.use(VueMarkdownEditor)
app.use(VMdPreview)

app.mount('#app')
