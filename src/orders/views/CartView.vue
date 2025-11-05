<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 class="text-3xl font-bold mb-8">¡Tu carrito!</h1>

      <div v-if="cartStore.isEmpty" class="bg-white rounded-lg shadow-sm p-12 text-center">
        <p class="text-gray-500 text-lg mb-4">Tu carrito está vacío</p>
        <router-link 
          :to="{ name: 'home' }" 
          class="inline-block px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
        >
          Seguir comprando...
        </router-link>
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 space-y-4">
          <div
            v-for="item in cartStore.items"
            :key="item.id"
            class="bg-white rounded-lg shadow-sm p-6 flex justify-between items-center"
          >
            <div class="flex-1">
              <h3 class="text-lg font-medium mb-1">{{ item.name }}</h3>
              <p class="text-gray-600">${{ item.price }} c/u</p>
              <p class="text-gray-500 text-sm mt-1">
                Subtotal: ${{ (item.price * item.quantity).toFixed(2) }}
              </p>
            </div>

            <div class="flex items-center ml-6">
              <button
                @click="cartStore.updateQuantity(item.id, item.quantity - 1)"
                class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors font-medium"
              >
                -
              </button>
              <span class="mx-4 w-12 text-center text-lg font-medium">{{ item.quantity }}</span>
              <button
                @click="cartStore.updateQuantity(item.id, item.quantity + 1)"
                class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors font-medium"
              >
                +
              </button>
              <button
                @click="cartStore.removeItem(item.id)"
                class="ml-6 px-4 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>

        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow-sm p-6 sticky top-8">
            <h2 class="text-xl font-bold mb-6">Resumen del pedido</h2>

            <div class="space-y-4 mb-6">
              <div class="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${{ cartStore.totalPrice.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between text-gray-600">
                <span>Envío</span>
                <span>Gratis</span>
              </div>
              <div class="border-t pt-4 flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${{ cartStore.totalPrice.toFixed(2) }}</span>
              </div>
            </div>

            <div class="space-y-3">
              <button
                @click="handleCreateOrder"
                class="w-full px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium text-lg"
              >
                Confirmar y pagar
              </button>
              <router-link
                :to="{ name: 'home' }"
                class="block w-full px-6 py-3 border border-gray-300 text-center rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Seguir comprando
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from '../stores/cart.js'
import { orderApiService } from '../composables/orderApiService.js'
import { useAuthStore } from '../../common/stores/auth.js'

const cartStore = useCartStore()
const authStore = useAuthStore()

const handleCreateOrder = async () => {
  // TODO: Implementar la lógica para seleccionar la dirección de entrega y el método de pago
  // TODO: Implementar la lógica para seleccionar una nota para la orden

  const items = cartStore.items.map(item => ({
    product: {
      productId: `${item.id}`,
      name: item.name,
      price: item.price
    },
    quantity: item.quantity
  }))

  // Calcular resumen de la orden
  const subtotal = cartStore.totalPrice
  const shippingCost = 0
  const taxes = 0
  const discount = 0
  const total = parseFloat((subtotal + shippingCost + taxes - discount).toFixed(2))

  const orderData = {
    customerId: authStore.userId,
    vendorId: cartStore.vendorId,
    pickupLocation: {
      latitude: -34.603722,
      longitude: -58.381592
    },
    items: items,
    summary: {
      subtotal: subtotal,
      shippingCost: shippingCost,
      taxes: taxes,
      discount: discount,
      total: total
    },
    // TODO: Implementar la lógica para seleccionar el método de pago
    payment: {
      method: 'cash',
      status: 'pending',
      transactionId: `txn-${Date.now()}`
    },
    trackingNumber: `TRACK-2024-${Date.now().toString().slice(-6)}`,
    // TODO: Implementar la lógica para seleccionar una nota para la orden
    notes: 'Entregar en el portón principal'
  }

  try {
    const response = await orderApiService.createOrder(orderData)
    console.log(response)
    
    // Abrir el link de WhatsApp en una nueva pestaña
    if (response._whatsappLink) {
      window.open(response._whatsappLink, '_blank')
    }
    
    alert('Orden creada correctamente')
    cartStore.clear()
  } catch (error) {
    console.error('Error al crear la orden:', error)
    alert('Error al crear la orden. Por favor, intenta nuevamente.')
  }
}
</script>