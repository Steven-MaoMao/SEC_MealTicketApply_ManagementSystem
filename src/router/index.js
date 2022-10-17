import axios from 'axios'
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginView.vue')
  },
  {
    path: '/user',
    name: 'UserManagement',
    component: () => import('../views/UserView.vue')
  },
  {
    path: '/application',
    name: 'ApplicationManagement',
    component: () => import('../views/ApplicationView.vue')
  },
  {
    path: '/ticket',
    name: 'TicketManagement',
    component: () => import('../views/TicketView.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

router.beforeEach(async (to, from, next) => {
  if (to.path === '/login') return next()
  const token = window.sessionStorage.getItem('token')
  const phone = window.sessionStorage.getItem('phone')
  if (!token || !phone) return next('/login')
  const { data: res } = await axios.post('/token', token)
  if (res.toString() !== phone) return next('/login')
  next()
})

export default router
