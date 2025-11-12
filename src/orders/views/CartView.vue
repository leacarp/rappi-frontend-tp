<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 class="text-3xl font-bold mb-4">¡Tu carrito!</h1>

      <div v-if="cartStore.vendorInfo" class="bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg p-4 mb-8 border border-orange-200">
        <div class="flex items-center justify-between">
          <div class="flex-1">
            <h2 class="text-xl font-semibold text-gray-800 mb-1">
              {{ cartStore.vendorInfo.restaurantName }}
            </h2>
            <p class="text-sm text-gray-600 mb-2">
              {{ cartStore.vendorInfo.description || 'Sin descripción' }}
            </p>
            <div class="flex items-center gap-3 text-sm">
              <span v-if="cartStore.vendorInfo.rating" class="text-orange-600 font-medium">
                ⭐ {{ cartStore.vendorInfo.rating.toFixed(1) }}
              </span>
              <span
                :class="cartStore.vendorInfo.isAvailable ? 'text-green-600' : 'text-red-600'"
                class="font-medium"
              >
                {{ cartStore.vendorInfo.isAvailable ? '🟢 Disponible' : '🔴 No disponible' }}
              </span>
            </div>
          </div>
          <router-link
            :to="{ name: 'restaurant-menu', params: { vendorId: cartStore.vendorInfo.id } }"
            class="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium text-sm whitespace-nowrap ml-4"
          >
            Ver menú completo
          </router-link>
        </div>
      </div>

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

            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Dirección de entrega
              </label>
              
              <div v-if="loadingAddresses" class="text-sm text-gray-500 mb-2">
                Cargando direcciones...
              </div>
              
              <div v-else-if="addressesError" class="text-sm text-red-600 mb-2">
                {{ addressesError }}
              </div>
              
              <div v-else-if="addresses.length === 0" class="text-sm text-gray-500 mb-2">
                No tienes direcciones guardadas. 
                <router-link 
                  :to="{ name: 'addresses' }" 
                  class="text-orange-500 hover:text-orange-600 underline"
                >
                  Agregar dirección
                </router-link>
              </div>
              
              <select
                v-else
                v-model="selectedAddressId"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option :value="null" disabled>Selecciona una dirección</option>
                <option 
                  v-for="address in addresses" 
                  :key="address.id" 
                  :value="address.id"
                >
                  {{ address.street }}, {{ address.city }}, {{ address.zipCode }}
                </option>
              </select>
            </div>

            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Método de pago
              </label>
              
              <select
                v-model="selectedPaymentMethod"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option 
                  v-for="(label, value) in paymentMethods" 
                  :key="value" 
                  :value="value"
                >
                  {{ label }}
                </option>
              </select>
            </div>

            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Nota para el pedido <span class="text-gray-500 text-xs font-normal">(opcional)</span>
              </label>
              
              <textarea
                v-model="orderNotes"
                placeholder="Ej: Entregar en el portón principal, timbre dos veces..."
                rows="3"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
              ></textarea>
            </div>

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
                :disabled="!canContinue"
                class="w-full px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium text-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
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
import { ref, computed, onMounted } from 'vue'
import { useCartStore } from '../stores/cart.js'
import { orderApiService } from '../composables/orderApiService.js'
import { useAuthStore } from '../../common/stores/auth.js'
import { userApi } from '../../users/composables/userApiService.js'

const cartStore = useCartStore()
const authStore = useAuthStore()

const addresses = ref([])
const selectedAddressId = ref(null)
const loadingAddresses = ref(false)
const addressesError = ref('')

const paymentMethods = {
  card: 'Tarjeta débito/crédito',
  cash: 'Efectivo',
  other: 'Otro'
}
const selectedPaymentMethod = ref('cash')
const orderNotes = ref('')

const canContinue = computed(() => {
  return !!selectedAddressId.value && addresses.value.length > 0 && !!selectedPaymentMethod.value
})

const fetchAddresses = async () => {
  if (!authStore.userId) {
    addressesError.value = 'No se encontró ID de usuario'
    return
  }
  
  loadingAddresses.value = true
  addressesError.value = ''
  
  try {
    const response = await userApi.getAddresses(authStore.userId)
    addresses.value = response.addresses || response || []
    
    if (addresses.value.length > 0 && !selectedAddressId.value) {
      const favoriteAddress = addresses.value.find(addr => addr.isFavorite)
      selectedAddressId.value = favoriteAddress?.id || addresses.value[0].id
    }
  } catch (err) {
    console.error('Error al obtener direcciones:', err)
    addressesError.value = err.message || 'Error al obtener direcciones'
  } finally {
    loadingAddresses.value = false
  }
}

const handleCreateOrder = async () => {
  if (!selectedAddressId.value) {
    alert('Por favor, selecciona una dirección de entrega')
    return
  }
  
  if (!selectedPaymentMethod.value) {
    alert('Por favor, selecciona un método de pago')
    return
  }

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
    vendorId: cartStore.vendorInfo?.id,
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
    payment: {
      method: selectedPaymentMethod.value,
      status: 'pending',
      transactionId: `txn-${Date.now()}`
    },
    trackingNumber: `TRACK-2024-${Date.now().toString().slice(-6)}`,
    notes: orderNotes.value.trim() || 'Sin notas adicionales'
  }

  try {
    const response = await orderApiService.createOrder(orderData)
    
    // Abrir el link de WhatsApp en una nueva pestaña
    if (response.whatsappLink) {
      window.open(response.whatsappLink, '_blank')
    }
    
    alert('Orden creada correctamente')
    cartStore.clear()
  } catch (error) {
    console.error('Error al crear la orden:', error)
    alert('Error al crear la orden. Por favor, intenta nuevamente.')
  }
}

onMounted(() => {
  fetchAddresses()
})
</script>