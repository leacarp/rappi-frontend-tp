<template>
  <Transition
    enter-active-class="transition-opacity duration-300 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-opacity duration-200 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50"
    >
      <div
        class="fixed inset-0 bg-black/70 transition-opacity duration-300"
        @click="close"
      >
      </div>

      <div class="fixed inset-0 overflow-y-auto flex items-center justify-center p-4 sm:p-0 pointer-events-none">
        <Transition
          enter-active-class="transition-all duration-300 ease-out"
          enter-from-class="opacity-0 translate-y-4 scale-95"
          enter-to-class="opacity-100 translate-y-0 scale-100"
          leave-active-class="transition-all duration-200 ease-in"
          leave-from-class="opacity-100 translate-y-0 scale-100"
          leave-to-class="opacity-0 translate-y-2 scale-[0.98]"
        >
          <div
            v-if="isOpen"
            class="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl w-full max-w-2xl pointer-events-auto"
            @click.stop
          >
            <div class="bg-white px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 class="text-2xl font-bold">¡Tu carrito!</h2>
              <button
                @click="close"
                class="text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div class="bg-white px-6 py-4 max-h-[70vh] overflow-y-auto">
              <div v-if="cartStore.isEmpty" class="text-center py-12 text-gray-500">
                <p>Tu carrito está vacío</p>
                <button
                  @click="close"
                  class="text-blue-600 hover:underline mt-2 inline-block"
                >
                  Seguir comprando...
                </button>
              </div>

              <div v-else>
                <div class="space-y-4 mb-8">
                  <div
                    v-for="item in cartStore.items"
                    :key="item.id"
                    class="flex justify-between items-center p-4 border rounded-lg"
                  >
                    <div>
                      <h3 class="font-medium">{{ item.name }}</h3>
                      <p class="text-gray-600">${{ item.price }} c/u</p>
                    </div>

                    <div class="flex items-center">
                      <button
                        @click="cartStore.updateQuantity(item.id, item.quantity - 1)"
                        class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                      >
                        -
                      </button>
                      <span class="mx-3 w-10 text-center">{{ item.quantity }}</span>
                      <button
                        @click="cartStore.updateQuantity(item.id, item.quantity + 1)"
                        class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                      >
                        +
                      </button>
                      <button
                        @click="cartStore.removeItem(item.id)"
                        class="ml-4 text-red-600 hover:text-red-800 transition-colors"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>

                <div class="border-t pt-4">
                  <div class="flex justify-between text-lg font-bold mb-4">
                    <span>Total:</span>
                    <span>${{ cartStore.totalPrice.toFixed(2) }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="!cartStore.isEmpty" class="bg-gray-50 px-6 py-4 border-t border-gray-200 flex gap-3">
              <button
                @click="close"
                class="flex-1 px-4 py-2 border border-gray-300 text-center rounded hover:bg-gray-100 transition-colors"
              >
                Seguir comprando
              </button>
              <button
                @click="goToCheckout"
                class="flex-1 px-4 py-2 bg-orange-500 text-white text-center rounded hover:bg-orange-600 transition-colors font-medium"
              >
                Realizar pedido
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart.js'

defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

const router = useRouter()
const cartStore = useCartStore()

const close = () => {
  emit('close')
}

const goToCheckout = () => {
  cartStore.closeModal()
  router.push({ name: 'cart' })
}
</script>
