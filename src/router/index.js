import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/member-register',
    name: 'MemberRegister',
    component: () => import('@/views/MemberRegister')
  },
  {
    path: '/member-update',
    name: 'MemberUpdate',
    component: () => import('@/views/MemberUpdate')
  },
  {
    path: '/transactions',
    name: 'TransactionList',
    component: () => import('@/views/TransactionList')
  },
  {
    path: '/home',
    name: 'MemberList',
    component: () => import('@/views/MemberList')
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
