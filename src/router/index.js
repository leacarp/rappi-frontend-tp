import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../common/views/HomeView.vue'
import LoginView from '../users/views/LoginView.vue'
import AddressesView from '../users/views/AddressesView.vue'
import { useAuthStore } from '../common/stores/auth.js'
import CartView from '../common/views/CartView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { requiresGuest: true }
    },
    {
      path: '/addresses',
      name: 'addresses',
      component: AddressesView,
      meta: { requiresAuth: true }
    },
    { 
      path: '/cart', 
      name: 'cart', 
      component: CartView,
      meta: { requiresAuth: true } 
    }
  ],
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login' })
    return
  }
  
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next({ name: 'home' })
    return
  }
  
  next()
})

export default router
