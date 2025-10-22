import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../users/views/LoginView.vue'
import AddressesView from '../users/views/AddressesView.vue'
import { useAuthStore } from '../common/stores/auth.js'
import CartView from '../common/views/CartView.vue'
import SearchRestaurantView from '../users/views/SearchRestaurantView.vue'
import ProductsManagementView from '../products/views/ProductsManagementView.vue'
import OrdersManagementView from '../orders/views/OrdersManagementView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: SearchRestaurantView,
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
    },
    {
      path: '/products-management',
      name: 'products-management',
      component: ProductsManagementView,
      meta: { requiresAuth: true, requiresVendor: true }
    },
    {
      path: '/orders-management',
      name: 'orders-management',
      component: OrdersManagementView,
      meta: { requiresAuth: true, requiresVendor: true }
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: { name: 'home' }
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

  if (to.meta.requiresVendor && !authStore.isVendor) {
    next({ name: 'home' })
    return
  }
  
  next()
})

export default router
