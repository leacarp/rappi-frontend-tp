<template>
  <div class="min-h-screen bg-gray-100">
    <div class="max-w-3xl mx-auto p-6">
      <h1 class="text-2xl font-bold text-gray-900">Seguimiento de tu pedido</h1>

      <div v-if="loading" class="mt-6 p-4 bg-white rounded-lg shadow">
        <p class="text-gray-600">Cargando información del pedido...</p>
      </div>

      <div v-else-if="error" class="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
        <p class="text-red-700">{{ error }}</p>
      </div>

      <div v-else-if="order" class="mt-6 space-y-6">
        <div class="p-4 bg-white rounded-lg shadow flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Nº de seguimiento</p>
            <p class="text-lg font-semibold text-gray-900">{{ order._trackingNumber || 'N/A' }}</p>
          </div>
          <span :class="['px-4 py-2 rounded-full text-sm font-medium', getStatusColor(order._status)]">
            {{ getStatusLabel(order._status) }}
          </span>
        </div>

        <div class="p-4 bg-white rounded-lg shadow">
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <div class="h-2 bg-gray-200 rounded">
                <div
                  class="h-2 bg-blue-600 rounded"
                  :style="{ width: progressPercent + '%' }"
                />
              </div>
              <div class="mt-2 text-xs text-gray-600">
                Última actualización: {{ lastUpdatedLabel }}
              </div>
            </div>
          </div>
        </div>

        <div class="grid md:grid-cols-2 gap-4">
          <div class="p-4 bg-white rounded-lg shadow">
            <h2 class="font-semibold text-gray-900 mb-2">Vendedor</h2>
            <p class="text-sm text-gray-700">{{ order._vendor?._name || 'N/A' }}</p>
          </div>
          <div class="p-4 bg-white rounded-lg shadow">
            <h2 class="font-semibold text-gray-900 mb-2">Entrega</h2>
            <p class="text-sm text-gray-700">Cliente: {{ order._customer?._name || 'N/A' }}</p>
            <p class="text-sm text-gray-700">Email: {{ order._customer?._email || 'N/A' }}</p>
            <p v-if="order._deliveryLocation" class="text-sm">
              <a
                class="text-blue-600 hover:underline"
                :href="`https://www.google.com/maps?q=${order._deliveryLocation?._latitude},${order._deliveryLocation?._longitude}`"
                target="_blank"
                rel="noopener"
              >
                Ver ubicación en Google Maps
              </a>
            </p>
          </div>
        </div>

        <div class="flex gap-2">
          <button class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300" @click="goHome">Volver al inicio</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { orderApiService } from '../../orders/composables/orderApiService.js'
import { useOrderTranslations } from '../../common/composables/orderTranslations.js'

const route = useRoute()
const router = useRouter()
const { getStatusLabel, getStatusColor } = useOrderTranslations()

const order = ref(null)
const loading = ref(false)
const error = ref('')
const lastUpdatedAt = ref(null)
const pollTimer = ref(null)

// Estados en orden para barra de progreso
const statusFlow = ['preparing', 'in_transit', 'delivered']

const progressPercent = computed(() => {
  const s = order.value?._status
  const idx = statusFlow.indexOf(s)
  if (idx === -1) return 0
  return Math.round(((idx + 1) / statusFlow.length) * 100)
})

const lastUpdatedLabel = computed(() => {
  if (!lastUpdatedAt.value) return '—'
  const d = new Date(lastUpdatedAt.value)
  return d.toLocaleString()
})

const fetchOrder = async () => {
  try {
    loading.value = true
    error.value = ''
    const { orderId } = route.params
    const data = await orderApiService.getOrderById(orderId)
    order.value = data
    lastUpdatedAt.value = Date.now()

    // Detener polling al finalizar
    if (order.value?._status === 'delivered' || order.value?._status === 'canceled') {
      stopPolling()
    }
  } catch (err) {
    console.error('Error al cargar el pedido:', err)
    error.value = 'No se pudo cargar el pedido.'
  } finally {
    loading.value = false
  }
}

const startPolling = () => {
  stopPolling()
  pollTimer.value = setInterval(fetchOrder, 5000) // 5 segundos
}

const stopPolling = () => {
  if (pollTimer.value) {
    clearInterval(pollTimer.value)
    pollTimer.value = null
  }
}

const goHome = () => router.push({ name: 'home' })

onMounted(async () => {
  await fetchOrder()
  startPolling()
})

onUnmounted(() => {
  stopPolling()
})
</script>