<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div class="flex flex-wrap gap-2">
          <button
            v-for="status in orderStatuses"
            :key="status.value"
            @click="filterStatus = status.value"
            :class="[
              'px-4 py-2 rounded-lg font-medium transition-colors',
              filterStatus === status.value
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
          >
            {{ status.label }}
            <span class="ml-2 px-2 py-0.5 rounded-full text-xs" :class="[
              filterStatus === status.value ? 'bg-blue-500' : 'bg-gray-300'
            ]">
              {{ getOrderCountByStatus(status.value) }}
            </span>
          </button>
        </div>
      </div>

      <div v-if="loading" class="bg-white rounded-lg shadow-sm p-12 text-center">
        <p class="text-gray-500 text-lg">Cargando órdenes...</p>
      </div>

      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <p class="text-red-600">{{ error }}</p>
        <button 
          @click="loadOrders" 
          class="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Reintentar
        </button>
      </div>

      <div v-else class="space-y-3">
        <div
          v-for="order in filteredOrders"
          :key="order.id"
          @click="openOrderModal(order._id)"
          class="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer border border-gray-200 hover:border-blue-300"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div>
                <h3 class="text-lg font-semibold text-gray-900">Pedido #{{ order._id }}</h3>
                <p class="text-sm text-gray-600">{{ formatDate(order._createdAt) }}</p>
              </div>
              <span :class="[
                'px-3 py-1 rounded-full text-sm font-medium',
                getStatusColor(order._status)
              ]">
                {{ getStatusLabel(order._status) }}
              </span>
            </div>
            <div class="text-right">
              <p class="text-xl font-bold text-gray-900">${{ order._total.toFixed(2) }}</p>
              <p class="text-sm text-gray-500">Hacer clic para ver detalles</p>
            </div>
          </div>
        </div>

        <div v-if="filteredOrders.length === 0" class="bg-white rounded-lg shadow-sm p-12 text-center">
          <p class="text-gray-500 text-lg">No hay pedidos con el estado seleccionado</p>
        </div>
      </div>
    </div>

    <div v-if="selectedOrder" class="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h2 class="text-2xl font-bold text-gray-900">Pedido #{{ selectedOrder._id }}</h2>
              <p class="text-sm text-gray-600">{{ formatDate(selectedOrder._createdAt) }}</p>
            </div>
            <div class="flex items-center gap-4">
              <span :class="[
                'px-4 py-2 rounded-full text-sm font-medium',
                getStatusColor(selectedOrder._status)
              ]">
                {{ getStatusLabel(selectedOrder._status) }}
              </span>
            <button
              @click="closeOrderModal"
              class="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        <div class="p-6">
          <div v-if="modalLoading" class="flex items-center justify-center py-8">
            <div class="text-center">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p class="mt-2 text-gray-600">Cargando detalles de la orden...</p>
            </div>
          </div>
          
          <div v-else>
            <div class="grid md:grid-cols-2 gap-6">
              <div>
                <h4 class="font-semibold text-gray-900 mb-3">Información del Cliente</h4>
                <div class="space-y-2 text-sm">
                  <p><span class="text-gray-600">Nombre:</span> <span class="font-medium">{{ selectedOrder._customer?._name || 'N/A' }}</span></p>
                  <p><span class="text-gray-600">Email:</span> <span class="font-medium">{{ selectedOrder._customer?._email || 'N/A' }}</span></p>
                  <p>
                    <span class="text-gray-600">Ubicación de entrega: </span>
                    <a
                      class="font-medium text-blue-600 hover:underline"
                      :href="`https://www.google.com/maps?q=${selectedOrder._deliveryLocation?._latitude},${selectedOrder._deliveryLocation?._longitude}`"
                      target="_blank"
                      rel="noopener"
                    >
                      Ver en Google Maps
                    </a>
                  </p>
                  <p v-if="selectedOrder._notes" class="text-gray-600 italic">Nota: {{ selectedOrder._notes }}</p>
                </div>
              </div>

              <div>
                <h4 class="font-semibold text-gray-900 mb-3">Información del Pedido</h4>
                  <div class="space-y-2 text-sm">
                    <p><span class="text-gray-600">Número de seguimiento:</span> <span class="font-medium">{{ selectedOrder._trackingNumber || 'N/A' }}</span></p>
                    <p><span class="text-gray-600">Vendedor:</span> <span class="font-medium">{{ selectedOrder._vendor?._name || 'N/A' }}</span></p>
                    <p><span class="text-gray-600">Repartidor:</span> <span class="font-medium">{{ selectedOrder._driver?._name || 'Sin asignar' }}</span></p>
                    <p><span class="text-gray-600">Método de pago:</span> <span class="font-medium">{{ getPaymentMethodLabel(selectedOrder._payment?._method) }}</span></p>
                    <p class="flex items-center gap-2">
                      <span class="text-gray-600">Estado del pago:</span> 
                      <span :class="[
                        'px-2 py-1 rounded-full text-xs font-medium',
                        getPaymentStatusColor(selectedOrder._payment?._status)
                      ]">
                        {{ getPaymentStatusLabel(selectedOrder._payment?._status) }}
                      </span>
                    </p>
                  </div>
              </div>
            </div>

            <div class="mt-6">
              <h4 class="font-semibold text-gray-900 mb-3">Productos</h4>
              <div class="space-y-2">
                <div
                  v-for="(item, index) in selectedOrder._items"
                  :key="index"
                  class="flex justify-between items-start text-sm bg-gray-50 p-3 rounded"
                >
                  <div class="flex-1">
                    <p class="font-medium text-gray-900">{{ item._productOfItem?._name || 'Producto' }}</p>
                  </div>
                  <div class="text-right ml-4">
                    <p class="font-medium">x{{ item._quantity }}</p>
                    <p class="text-gray-600">${{ (item._productOfItem?._price * item._quantity || 0).toFixed(2) }}</p>
                  </div>
                </div>
              </div>
            </div>

            <h4 class="font-semibold text-gray-900 mb-3">Resumen del Pedido</h4>
            <div class="space-y-1 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">Subtotal:</span>
                <span class="font-medium">$ {{ selectedOrder._summary?._subtotal?.toFixed(2) || '0.00' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Costo de envío:</span>
                <span class="font-medium">$ {{ selectedOrder._summary?._shippingCost?.toFixed(2) || '0.00' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Impuestos:</span>
                <span class="font-medium">$ {{ selectedOrder._summary?._taxes?.toFixed(2) || '0.00' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Descuento:</span>
                <span class="font-medium">-$ {{ selectedOrder._summary?._discount?.toFixed(2) || '0.00' }}</span>
              </div>
              <div class="flex justify-between border-t border-gray-300 pt-2 font-bold text-lg">
                <span>Total:</span>
                <span>$ {{ selectedOrder._summary?._total?.toFixed(2) || '0.00' }}</span>
              </div>
            </div>
          </div>

          <div class="mt-6 pt-6 border-t border-gray-200 flex flex-wrap gap-2">
            <button
              v-if="selectedOrder._status === 'pending'"
              @click="updateOrderStatus(selectedOrder._id, 'accepted')"
              class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors"
            >
              Aceptar Pedido
            </button>
            <button
              v-if="selectedOrder._status === 'pending'"
              @click="updateOrderStatus(selectedOrder._id, 'canceled')"
              class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors"
            >
              Cancelar Pedido
            </button>
            <button
              v-if="selectedOrder._status === 'accepted'"
              @click="updateOrderStatus(selectedOrder._id, 'preparing')"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
            >
              Comenzar Preparación
            </button>
            <button
              v-if="selectedOrder._status === 'preparing'"
              @click="updateOrderStatus(selectedOrder._id, 'ready_for_pickup')"
              class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium transition-colors"
            >
              Marcar como Listo para Recolección
            </button>
            <button
              v-if="selectedOrder._status === 'ready_for_pickup'"
              @click="updateOrderStatus(selectedOrder._id, 'in_transit')"
              class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors"
            >
              Marcar como En Tránsito
            </button>
            <button
              v-if="selectedOrder._status === 'in_transit'"
              @click="updateOrderStatus(selectedOrder._id, 'delivered')"
              class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium transition-colors"
            >
              Marcar como Entregado
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { orderApiService } from '../composables/orderApiService.js'
import { useAuthStore } from '../../common/stores/auth.js'

const authStore = useAuthStore()
const filterStatus = ref('all')
const orders = ref([])
const loading = ref(false)
const error = ref(null)
const selectedOrder = ref(null)
const modalLoading = ref(false)

const orderStatuses = [
  { value: 'all', label: 'Todos' },
  { value: 'pending', label: 'Pendientes' },
  { value: 'accepted', label: 'Aceptados' },
  { value: 'preparing', label: 'En Preparación' },
  { value: 'ready_for_pickup', label: 'Listos para Recolección' },
  { value: 'in_transit', label: 'En Tránsito' },
  { value: 'delivered', label: 'Entregados' },
  { value: 'canceled', label: 'Cancelados' }
]

const loadOrders = async () => {
  loading.value = true
  error.value = null
  
  try {
    const role = authStore.isVendor ? 'vendor' : authStore.isCustomer ? 'customer' : 'driver'
    const response = await orderApiService.getOrdersByUser(authStore.userId, role)
    orders.value = (response._orders || []).slice().sort((a, b) => new Date(b._createdAt) - new Date(a._createdAt))
  } catch (err) {
    error.value = 'Error al cargar las órdenes'
    console.error('Error loading orders:', err)
  } finally {
    loading.value = false
  }
}

const openOrderModal = async (orderId) => {
  if (!authStore.isAuthenticated) {
    error.value = 'Usuario no autenticado'
    return
  }

  modalLoading.value = true

  try {
    const orderDetails = await orderApiService.getOrderById(orderId)
    selectedOrder.value = orderDetails
  } catch (err) {
    console.error('Error al cargar detalles de la orden:', err)
    error.value = 'Error al cargar los detalles de la orden'
  } finally {
    modalLoading.value = false
  }
}

const closeOrderModal = () => {
  selectedOrder.value = null
}

const filteredOrders = computed(() => {
  if (filterStatus.value === 'all') {
    return orders.value
  }
  return orders.value.filter(order => order._status === filterStatus.value)
})

const getOrderCountByStatus = (status) => {
  if (status === 'all') return orders.value.length
  return orders.value.filter(order => order._status === status).length
}

const getStatusLabel = (status) => {
  const statusObj = orderStatuses.find(s => s.value === status)
  return statusObj ? statusObj.label : status
}

const getStatusColor = (status) => {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800',
    accepted: 'bg-green-100 text-green-800',
    preparing: 'bg-blue-100 text-blue-800',
    ready_for_pickup: 'bg-purple-100 text-purple-800',
    in_transit: 'bg-indigo-100 text-indigo-800',
    delivered: 'bg-gray-100 text-gray-800',
    canceled: 'bg-red-100 text-red-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

const getPaymentMethodLabel = (method) => {
  const methods = {
    'cash': 'Efectivo',
    'credit_card': 'Tarjeta de Crédito',
    'debit_card': 'Tarjeta de Débito',
    'bank_transfer': 'Transferencia Bancaria',
    'digital_wallet': 'Billetera Digital',
    'paypal': 'PayPal',
    'stripe': 'Stripe',
    'mercadopago': 'MercadoPago',
    'other': 'Otro'
  }
  return methods[method] || method || 'No especificado'
}

const getPaymentStatusLabel = (status) => {
  const statuses = {
    'PENDING': 'Pendiente',
    'PROCESSING': 'Procesando',
    'COMPLETED': 'Completado',
    'FAILED': 'Fallido',
    'CANCELLED': 'Cancelado',
    'REFUNDED': 'Reembolsado',
    'PARTIALLY_REFUNDED': 'Parcialmente Reembolsado',
    'AUTHORIZED': 'Autorizado',
    'PAID': 'Pagado',
    'VOIDED': 'Anulado'
  }
  return statuses[status.toUpperCase()] || status || 'Desconocido'
}

const getPaymentStatusColor = (status) => {
  const colors = {
    'PENDING': 'bg-yellow-100 text-yellow-800',
    'PROCESSING': 'bg-blue-100 text-blue-800',
    'COMPLETED': 'bg-green-100 text-green-800',
    'FAILED': 'bg-red-100 text-red-800',
    'CANCELLED': 'bg-gray-100 text-gray-800',
    'REFUNDED': 'bg-purple-100 text-purple-800',
    'PARTIALLY_REFUNDED': 'bg-orange-100 text-orange-800',
    'AUTHORIZED': 'bg-indigo-100 text-indigo-800',
    'PAID': 'bg-green-100 text-green-800',
    'VOIDED': 'bg-gray-100 text-gray-800'
  }
  return colors[status.toUpperCase()] || 'bg-gray-100 text-gray-800'
}

const formatDate = (date) => {
  if (!date) return ''

  const d = new Date(date)
  const pad = num => String(num).padStart(2, '0')
  const day = pad(d.getDate())
  const month = pad(d.getMonth() + 1)
  const year = d.getFullYear()
  const hours = pad(d.getHours())
  const minutes = pad(d.getMinutes())

  return `${day}/${month}/${year} ${hours}:${minutes}`
}

const updateOrderStatus = async (orderId, newStatus) => {
  if (!authStore.isAuthenticated) {
    error.value = 'Usuario no autenticado'
    return
  }

  try {
    await orderApiService.updateOrderStatus(orderId, newStatus)
    
    const order = orders.value.find(o => o._id === orderId)
    if (order) {
      order._status = newStatus
    }
    
    if (selectedOrder.value && selectedOrder.value._id === orderId) {
      const updatedOrder = await orderApiService.getOrderById(orderId)
      selectedOrder.value = updatedOrder
    }
  } catch (err) {
    console.error('Error al actualizar el estado del pedido:', err)
    error.value = 'Error al actualizar el estado del pedido'
  }
}

onMounted(() => {
  loadOrders()
})
</script>
