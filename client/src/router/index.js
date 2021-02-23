import { createRouter, createWebHistory } from 'vue-router'

import Index from '@/pages/index'
import Detail from '@/pages/detail'

const routerHistory = createWebHistory()

export default createRouter({
  history: routerHistory,
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index,
    },
    {
      path: '/detail/:id',
      name: 'detail',
      component: Detail,
    },
  ],
})
