<script setup>
import { RouterView } from 'vue-router'
import { useAuthStore } from './common/stores/auth.js'
import { useCartStore } from './orders/stores/cart.js'
import NavBar from './common/components/NavBar.vue'
import CartModal from './orders/components/CartModal.vue'

const authStore = useAuthStore()
const cartStore = useCartStore()
</script>

<template>
  <div>
    <NavBar v-if="authStore.isAuthenticated" />
    
    <RouterView />
    
    <CartModal v-if="authStore.isAuthenticated" :is-open="cartStore.isModalOpen" @close="cartStore.closeModal" />
  </div>
</template>
