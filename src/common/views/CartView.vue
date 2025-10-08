<template>
  <div class="max-w-2xl mx-auto p-4">
    <h1 class="text-2xl font-bold mb-6">¡Tu carrito!</h1>

    <div v-if="cartStore.isEmpty" class="text-center py-12 text-gray-500">
      <p>Tu carrito está vacío</p>
      <router-link :to="{ name: 'home' }" class="text-blue-600 hover:underline mt-2 inline-block">
        Seguir comprando...
      </router-link>
    </div>

    <div v-else>
      <div class="space-y-4 mb-8">
        <div v-for="item in cartStore.items" :key="item.id"
          class="flex justify-between items-center p-4 border rounded-lg">
          <div>
            <h3 class="font-medium">{{ item.name }}</h3>
            <p class="text-gray-600">${{ item.price }} c/u</p>
          </div>

          <div class="flex items-center">
            <button @click="cartStore.updateQuantity(item.id, item.quantity - 1)"
              class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              -
            </button>
            <span class="mx-3 w-10 text-center">{{ item.quantity }}</span>
            <button @click="cartStore.updateQuantity(item.id, item.quantity + 1)"
              class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              +
            </button>
            <button @click="cartStore.removeItem(item.id)"
              class="ml-4 text-red-600 hover:text-red-800">
              Eliminar
            </button>
          </div>
        </div>
      </div>

      <div class="border-t pt-4">
        <div class="flex justify-between text-lg font-bold mb-4">
          <span>Total:</span>
          <span>${{ cartStore.totalPrice }}</span>
        </div>
        <div class="flex gap-3">
          <router-link :to="{ name: 'home' }"
            class="flex-1 px-4 py-2 border border-gray-300 text-center rounded">
            Seguir comprando
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from '../stores/cart'

const cartStore = useCartStore()
</script>