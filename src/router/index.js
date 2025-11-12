import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../common/stores/auth.js'

const SearchRestaurantView = () => import('../users/views/SearchRestaurantView.vue')
const LoginView = () => import('../users/views/LoginView.vue')
const AddressesView = () => import('../users/views/AddressesView.vue')
const CartView = () => import('../orders/views/CartView.vue')
const ProductsManagementView = () => import('../products/views/ProductsManagementView.vue')
const OrdersManagementView = () => import('../orders/views/OrdersManagementView.vue')
const DeliveryManagementView = () => import('../orders/views/DeliveryManagementView.vue')
const VendorProfileView = () => import('../users/views/VendorProfileView.vue')
const OrderTrackingView = () => import('../orders/views/OrderTrackingView.vue')
const RestaurantMenuView = () => import('../users/views/RestaurantMenuView.vue')
const AdminCreateVendorView = () => import('../users/views/AdminCreateVendor.vue')
const DriverReviewsView = () => import('../users/views/DriverReviewsView.vue')

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
      path: '/vendor-profile',
      name: 'vendor-profile',
      component: VendorProfileView,
      meta: { requiresAuth: true, requiresVendor: true }
    },
    {
      path: '/delivery-management',
      name: 'delivery-management',
      component: DeliveryManagementView,
      meta: { requiresAuth: true, requiresDriver: true }
    },
    {
      path: '/order-tracking/:orderId',
      name: 'order-tracking',
      component: OrderTrackingView,
      meta: { requiresAuth: true }
    },
    {
      path: '/restaurant/:vendorId/menu',
      name: 'restaurant-menu',
      component: RestaurantMenuView,
      meta: { requiresAuth: true }
    },
    {
      path: '/users/create-vendor',
      name: 'admin-create-vendor',
      component: AdminCreateVendorView,
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/driver-reviews',
      name: 'driver-reviews',
      component: DriverReviewsView,
      meta: { requiresAuth: true, requiresDriver: true }
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

  if (to.meta.requiresDriver && !authStore.isDriver) {
    next({ name: 'home' })
    return
  }
  
  if (to.meta.requiresAdmin && !authStore.isAdmin) {
    next({ name: 'home' });
    return
  }
  
  next()
})

export default router
