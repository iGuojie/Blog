import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import BlogDetailView from '@/views/BlogDetailView.vue'
import CategoryView from '@/views/CategoryView.vue'
import LabelView from '@/views/LabelView.vue'
import SearchResultView from '@/views/SearchResultView.vue'
import ArchiveView from '@/views/ArchiveView.vue'
import AdminLayout from '@/admin/AdminLayout.vue'
import AdminHome from '@/admin/views/AdminHome.vue'
import BlogManage from '@/admin/views/BlogManage.vue'
import CategoryManage from '@/admin/views/CategoryManage.vue'
import LabelManage from '@/admin/views/LabelManage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('@/views/AboutView.vue')
    },
    {
      path: '/category',
      name: 'category',
      component: CategoryView
    },
    {
      path: '/label',
      name: 'label',
      component: LabelView
    },
    {
      path: '/search',
      name: 'search',
      component: SearchResultView
    },
    {
      path: '/archive',
      name: 'archive',
      component: ArchiveView
    },
    {
      path: '/blogDetail',
      name: 'blogDetail',
      component: BlogDetailView
    },
    // 管理后台路由
    {
      path: '/admin',
      component: AdminLayout,
      children: [
        {
          path: '',
          name: 'admin-home',
          component: AdminHome
        },
        {
          path: 'blog',
          name: 'admin-blog',
          component: BlogManage
        },
        {
          path: 'category',
          name: 'admin-category',
          component: CategoryManage
        },
        {
          path: 'label',
          name: 'admin-label',
          component: LabelManage
        }
      ]
    }
  ]
})

export default router
