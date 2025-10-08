<template>
  <div class="flex items-center space-x-1">
    <span>Carrito</span>
    <span v-if="cartStore.totalItems > 0" 
        class="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
        {{ cartStore.totalItems }}
    </span>
    <span v-else class="text-gray-500 text-sm">0</span>
  </div>
</template>

<script setup>
import { useCartStore } from '../stores/cart'

const cartStore = useCartStore()
</script>