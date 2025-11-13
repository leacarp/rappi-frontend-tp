<template>
  <header class="bg-white shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <div class="flex items-center cursor-pointer" @click="goToHome">
          <span class="text-2xl font-bold text-orange-500">Rappi</span>
        </div>

        <div class="hidden md:flex items-center space-x-6">
          <router-link 
            :to="{ name: 'home' }"
            class="text-gray-700 hover:text-orange-500 font-medium transition-colors"
          >
            Buscar Restaurantes
          </router-link>
          <button
            @click="cartStore.openModal"
            v-if="authStore.isCustomer || authStore.isAdmin"
            class="text-gray-700 hover:text-orange-500 font-medium transition-colors flex items-center space-x-1"
          >
            <span>Mi Carrito</span>
            <span v-if="cartStore.totalItems > 0" 
              class="bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {{ cartStore.totalItems }}
            </span>
          </button>
        </div>

        <div class="flex items-center space-x-4">
          <div class="relative" ref="dropdownRef">
            <button
              @click="toggleDropdown"
              class="text-gray-700 hover:text-orange-500 font-medium transition-colors flex items-center space-x-1"
            >
              <span>Cuenta</span>
              <svg 
                class="w-4 h-4 transition-transform" 
                :class="{ 'rotate-180': showDropdown }"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <div 
              v-show="showDropdown"
              class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200"
            >
              <router-link
                v-if="authStore.isAdmin"
                :to="{ name: 'admin-create-vendor' }"
                class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 font-medium"
              >
                Crear Vendor
              </router-link>

              <router-link
                v-if="authStore.isAdmin"
                :to="{ name: 'admin-create-driver' }"
                class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 font-medium"
              >
                Crear Driver
              </router-link>

              <router-link
                v-if="authStore.isVendor"
                :to="{ name: 'products-management' }"
                class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 font-medium"
              >
                Gestión de productos
              </router-link>
              <router-link
                v-if="authStore.isVendor"
                :to="{ name: 'orders-management' }"
                class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 font-medium"
              >
                Gestión de pedidos
              </router-link>
              <router-link
                v-if="authStore.isVendor"
                :to="{ name: 'vendor-profile' }"
                class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 font-medium"
              >
                Mi perfil
              </router-link>
              <router-link
                v-if="authStore.isDriver"
                :to="{ name: 'delivery-management' }"
                class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 font-medium"
              >
                Gestión de entregas
              </router-link>
              <router-link
                v-if="authStore.isDriver"
                :to="{ name: 'driver-reviews' }"
                class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 font-medium"
              >
                Mis reseñas
              </router-link>
              <button
                @click="handleLogout"
                class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>

        <div class="md:hidden">
          <button
            @click="toggleMobileMenu"
            class="text-gray-700 hover:text-orange-500 focus:outline-none"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                stroke-width="2" 
                :d="showMobileMenu ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'"
              />
            </svg>
          </button>
        </div>
      </div>

      <div v-show="showMobileMenu" class="md:hidden border-t border-gray-200 py-2">
        <div class="flex flex-col space-y-2">
          <button 
            @click="cartStore.openModal(); showMobileMenu = false"
            class="block w-full text-left px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-500"
          >
            Mi Carrito
            <span v-if="cartStore.totalItems > 0" class="text-orange-500">({{ cartStore.totalItems }})</span>
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'
import { useCartStore } from '../../orders/stores/cart.js'

const router = useRouter()
const authStore = useAuthStore()
const cartStore = useCartStore()

const showDropdown = ref(false)
const showMobileMenu = ref(false)
const dropdownRef = ref(null)

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
}

const goToHome = () => {
  router.push({ name: 'home' })
}

const handleLogout = () => {
  authStore.logout()
  router.push({ name: 'login' })
}

const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    showDropdown.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
