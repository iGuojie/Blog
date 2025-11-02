import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import BlogDetailView from '@/views/BlogDetailView.vue'
import CategoryView from '@/views/CategoryView.vue'
import LabelView from '@/views/LabelView.vue'
import SearchResultView from '@/views/SearchResultView.vue'
import ArchiveView from '@/views/ArchiveView.vue'

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
    }
  ]
})

export default router
