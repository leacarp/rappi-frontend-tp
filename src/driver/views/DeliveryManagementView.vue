<template>
    <div class="min-h-screen bg-gray-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div class="mb-8">
                <h2 class="text-3xl font-bold text-gray-900 mb-2">Gestión de Entregas</h2>
                <p class="text-gray-600">Administra tus entregas</p>
            </div>

            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <!-- Tabs -->
                <div class="bg-white rounded-lg shadow-sm mb-6">
                    <div class="border-b border-gray-200">
                        <nav class="flex -mb-px">
                        <button
                            v-for="tab in tabs"
                            :key="tab.id"
                            @click="activeTab = tab.id"
                            :class="[
                            'px-6 py-4 text-sm font-medium border-b-2 transition-colors',
                            activeTab === tab.id
                                ? 'border-blue-600 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            ]"
                        >
                            {{ tab.label }}
                            <span
                            v-if="tab.count > 0"
                            :class="[
                                'ml-2 px-2 py-1 text-xs rounded-full',
                                activeTab === tab.id
                                ? 'bg-blue-100 text-blue-600'
                                : 'bg-gray-100 text-gray-600'
                            ]"
                            >
                            {{ tab.count }}
                            </span>
                        </button>
                        </nav>
                    </div>
                </div>
        
                <!-- Pedidos Listos para Recolección -->
                <div v-if="activeTab === 'ready_for_pickup'" class="space-y-4">
                    <div v-if="readyForPickupOrders.length === 0" class="bg-white rounded-lg shadow-sm p-8 text-center">
                        <p class="text-gray-500">No hay pedidos listos para recolección en este momento</p>
                    </div>
                    <div
                        v-for="order in readyForPickupOrders"
                        :key="order.id"
                        class="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
                    >
                        <div class="flex items-start justify-between mb-4">
                        <div>
                            <h3 class="text-lg font-semibold text-gray-900">Pedido #{{ order.id }}</h3>
                            <p class="text-sm text-gray-500">{{ order.restaurant }}</p>
                        </div>
                        <span class="px-3 py-1 text-sm font-medium bg-purple-100 text-purple-800 rounded-full">
                            Listo para Recolección
                        </span>
                        </div>
            
                        <div class="space-y-3 mb-4">
                        <!-- Dirección de recolección -->
                        <div class="flex items-start space-x-3">
                            <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                            <span class="text-green-600 font-bold text-sm">R</span>
                            </div>
                            <div class="flex-1">
                            <p class="text-sm font-medium text-gray-900">Recolectar en:</p>
                            <p class="text-sm text-gray-600">{{ order.pickupAddress }}</p>
                            </div>
                        </div>
            
                        <!-- Dirección de entrega -->
                        <div class="flex items-start space-x-3">
                            <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                            <span class="text-blue-600 font-bold text-sm">E</span>
                            </div>
                            <div class="flex-1">
                            <p class="text-sm font-medium text-gray-900">Entregar en:</p>
                            <p class="text-sm text-gray-600">{{ order.deliveryAddress }}</p>
                            </div>
                        </div>
                        </div>
            
                        <!-- Botón para ver detalles -->
                        <button
                        @click="viewOrderDetails(order)"
                        class="w-full mb-3 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                        Ver detalles del pedido
                        </button>
            
                        <!-- Botones de acción -->
                        <div class="flex space-x-3">
                        <button
                            @click="acceptOrder(order.id)"
                            class="flex-1 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                        >
                            Aceptar Pedido
                        </button>
                        <button
                            @click="rejectOrder(order.id)"
                            class="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                            Rechazar
                        </button>
                        </div>
                    </div>
                </div>
        
                <!-- Pedidos En Tránsito -->
                <div v-if="activeTab === 'in_transit'" class="space-y-4">
                    <div v-if="inTransitOrders.length === 0" class="bg-white rounded-lg shadow-sm p-8 text-center">
                        <p class="text-gray-500">No tienes pedidos en tránsito</p>
                    </div>
                    <div
                        v-for="order in inTransitOrders"
                        :key="order.id"
                        class="bg-white rounded-lg shadow-sm p-6"
                    >
                        <div class="flex items-start justify-between mb-4">
                        <div>
                            <h3 class="text-lg font-semibold text-gray-900">Pedido #{{ order.id }}</h3>
                            <p class="text-sm text-gray-500">{{ order.restaurant }}</p>
                        </div>
                        <span class="px-3 py-1 text-sm font-medium bg-indigo-100 text-indigo-800 rounded-full">
                            En Tránsito
                        </span>
                        </div>
            
                        <div class="space-y-3 mb-4">
                        <!-- Dirección de recolección -->
                        <div class="flex items-start space-x-3">
                            <div
                            :class="[
                                'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1',
                                order.status === 'picked_up' || order.status === 'on_the_way'
                                ? 'bg-green-600'
                                : 'bg-green-100'
                            ]"
                            >
                            <span
                                :class="[
                                'font-bold text-sm',
                                order.status === 'picked_up' || order.status === 'on_the_way'
                                    ? 'text-white'
                                    : 'text-green-600'
                                ]"
                            >
                                {{ order.status === 'picked_up' || order.status === 'on_the_way' ? '✓' : 'R' }}
                            </span>
                            </div>
                            <div class="flex-1">
                            <p class="text-sm font-medium text-gray-900">Recolectar en:</p>
                            <p class="text-sm text-gray-600">{{ order.pickupAddress }}</p>
                            </div>
                        </div>
            
                        <!-- Dirección de entrega -->
                        <div class="flex items-start space-x-3">
                            <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                            <span class="text-blue-600 font-bold text-sm">E</span>
                            </div>
                            <div class="flex-1">
                            <p class="text-sm font-medium text-gray-900">Entregar en:</p>
                            <p class="text-sm text-gray-600">{{ order.deliveryAddress }}</p>
                            <p class="text-sm text-gray-500 mt-1">Cliente: {{ order.customerName }}</p>
                            </div>
                        </div>
                        </div>
            
                        <!-- Botón para ver detalles -->
                        <button
                        @click="viewOrderDetails(order)"
                        class="w-full mb-3 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                        Ver detalles del pedido
                        </button>
            
                        <!-- Botones de actualización de estado -->
                        <div class="space-y-2">
                        <button
                            @click="updateOrderStatusLocal(order.id, 'delivered')"
                            class="w-full px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                        >
                            Marcar como Entregado
                        </button>
                        </div>
                    </div>
                </div>
        
                <!-- Pedidos Entregados -->
                <div v-if="activeTab === 'delivered'" class="space-y-4">
                    <div v-if="deliveredOrders.length === 0" class="bg-white rounded-lg shadow-sm p-8 text-center">
                        <p class="text-gray-500">No tienes entregas completadas</p>
                    </div>
                    <div
                        v-for="order in deliveredOrders"
                        :key="order.id"
                        class="bg-white rounded-lg shadow-sm p-6"
                    >
                        <div class="flex items-start justify-between mb-4">
                        <div>
                            <h3 class="text-lg font-semibold text-gray-900">Pedido #{{ order.id }}</h3>
                            <p class="text-sm text-gray-500">{{ order.restaurant }}</p>
                            <p class="text-xs text-gray-400 mt-1">Completado: {{ order.completedAt }}</p>
                        </div>
                        <span class="px-3 py-1 text-sm font-medium bg-green-100 text-green-800 rounded-full">
                            Entregado
                        </span>
                        </div>
            
                        <div class="space-y-2 mb-4">
                        <div class="flex items-center justify-between text-sm">
                            <span class="text-gray-600">Ganancia:</span>
                            <span class="font-semibold text-gray-900">${{ order.earnings.toFixed(2) }}</span>
                        </div>
                        <div class="flex items-center justify-between text-sm">
                            <span class="text-gray-600">Distancia:</span>
                            <span class="text-gray-900">{{ order.distance }} km</span>
                        </div>
                        </div>
            
                        <button
                        @click="viewOrderDetails(order)"
                        class="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                        Ver detalles
                        </button>
                    </div>
                </div>
            </div>
        </div>
  
        <div
            v-if="showDetailsModal"
            class="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50"
            @click.self="closeDetailsModal"
        >
            <div class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                    <h2 class="text-xl font-bold text-gray-900">
                        Detalles del Pedido #{{ selectedOrder._trackingNumber }}
                        <span v-if="loading" class="ml-2 text-sm text-gray-500">(Cargando...)</span>
                    </h2>
                    <button
                        @click="closeDetailsModal"
                        class="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                    >
                    ×
                    </button>
                </div>
        
                <div class="p-6 space-y-6">
                    <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p class="text-red-800 text-sm">{{ error }}</p>
                    </div>

                    <div>
                        <h3 class="text-sm font-semibold text-gray-900 mb-2">Restaurante</h3>
                        <p class="text-gray-700">{{ selectedOrder._vendor._name }}</p>
                    </div>

                    <div>
                        <h3 class="text-sm font-semibold text-gray-900 mb-2">Información del Pedido</h3>
                        <div class="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span class="text-gray-600">Número de seguimiento:</span>
                                <p class="font-medium text-gray-900">{{ selectedOrder._trackingNumber || 'N/A' }}</p>
                            </div>
                            <div>
                                <span class="text-gray-600">Fecha de creación:</span>
                                <p class="font-medium text-gray-900">{{ formatDate(selectedOrder._createdAt) }}</p>
                            </div>
                            <div>
                                <span class="text-gray-600">Estado:</span>
                                <p class="font-medium text-gray-900">{{ getStatusLabel(selectedOrder._status) }}</p>
                            </div>
                        </div>
                    </div>
        
                    <div class="space-y-4">
                        <div>
                            <h3 class="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                                <span class="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-bold mr-2">R</span>
                                Dirección de Recolección
                            </h3>
                            <a
                                class="font-medium text-green-600 hover:underline"
                                :href="`https://www.google.com/maps?q=${selectedOrder._pickupLocation?._latitude},${selectedOrder._pickupLocation?._longitude}`"
                                target="_blank"
                                rel="noopener"
                            >
                                Ver en Google Maps
                            </a>
                        </div>
        
                        <div>
                            <h3 class="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                                <span class="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold mr-2">E</span>
                                Dirección de Entrega
                            </h3>
                            <a
                                class="font-medium text-blue-600 hover:underline"
                                :href="`https://www.google.com/maps?q=${selectedOrder._deliveryLocation?._latitude},${selectedOrder._deliveryLocation?._longitude}`"
                                target="_blank"
                                rel="noopener"
                            >
                                Ver en Google Maps
                            </a>
                            <p class="text-sm text-gray-500 mt-1">Cliente: {{ selectedOrder._customer._name }}</p>
                            <p class="text-sm text-gray-500">Email: {{ selectedOrder._customer._email }}</p>
                        </div>
                    </div>
        
                    <div>
                        <h3 class="text-sm font-semibold text-gray-900 mb-3">Contenido del Pedido</h3>
                        <div class="bg-gray-50 rounded-lg p-4 space-y-3">
                            <div
                                v-for="item in selectedOrder._items"
                                :key="item._productOfItem._id"
                                class="flex items-start justify-between"
                            >
                                <div class="flex-1">
                                    <p class="text-sm font-medium text-gray-900">{{ item._productOfItem._name }}</p>
                                    <p v-if="item.notes" class="text-xs text-gray-500 mt-1">Nota: {{ item.notes }}</p>
                                </div>
                                <div class="text-right ml-4">
                                    <p class="text-sm font-medium text-gray-900">x{{ item._quantity }}</p>
                                    <p class="text-sm text-gray-600">${{ item._productOfItem._price.toFixed(2) }}</p>
                                </div>
                            </div>
                            <div class="border-t border-gray-200 pt-3 mt-3">
                                <div class="flex items-center justify-between font-semibold">
                                    <span class="text-gray-900">Total</span>
                                    <span class="text-gray-900">${{ selectedOrder._summary._total.toFixed(2) }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
        
                    <div>
                        <h3 class="text-sm font-semibold text-gray-900 mb-2">Información de Pago</h3>
                        <div class="space-y-3">
                            <div class="flex items-center space-x-2">
                                <span
                                    :class="[
                                        'px-3 py-1 text-sm font-medium rounded-full',
                                        selectedOrder._payment._method === 'card' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                                    ]"
                                >
                                {{ selectedOrder._payment._method === 'card' ? 'Tarjeta' : 'Efectivo' }}
                                </span>
                                <span
                                :class="[
                                    'px-3 py-1 text-sm font-medium rounded-full',
                                    selectedOrder._payment._status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                ]"
                                >
                                {{ selectedOrder._payment._status === 'paid' ? 'Pagado' : 'Pendiente' }}
                                </span>
                            </div>
                            <div v-if="selectedOrder._payment._method === 'card' && selectedOrder._payment._transactionId" class="text-sm">
                                <span class="text-gray-600">ID de transacción:</span>
                                <p class="font-mono text-gray-900">{{ selectedOrder._payment._transactionId }}</p>
                            </div>
                        </div>
                    </div>
        
                    <div v-if="selectedOrder._notes">
                        <h3 class="text-sm font-semibold text-gray-900 mb-2">Notas de Entrega</h3>
                        <p class="text-sm text-gray-700 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                            {{ selectedOrder._notes }}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
  
<script setup>
import { ref, computed } from 'vue'
import { orderApi } from '../composables/orderApiService.js'
import { useOrderTranslations } from '../../common/composables/orderTranslations.js'

const { 
  getStatusLabel, 
  formatDate
} = useOrderTranslations()

const activeTab = ref('ready_for_pickup')
const showDetailsModal = ref(false)
const selectedOrder = ref(null)
const loading = ref(false)
const error = ref(null)

const tabs = computed(() => [
{ id: 'ready_for_pickup', label: 'Listos para Recolección', count: readyForPickupOrders.value.length },
{ id: 'in_transit', label: 'En Tránsito', count: inTransitOrders.value.length },
{ id: 'delivered', label: 'Entregados', count: deliveredOrders.value.length }
])

// Datos de ejemplo - Pedidos listos para recolección
const readyForPickupOrders = ref([
{
    id: '1001',
    restaurant: 'Pizza Napolitana',
    pickupAddress: 'Av. Corrientes 1234, CABA',
    deliveryAddress: 'Av. Santa Fe 5678, Palermo, CABA',
    customerName: 'María González',
    customerPhone: '+54 11 1234-5678',
    status: 'ready_for_pickup',
    items: [
    { id: 1, name: 'Pizza Margarita', quantity: 2, price: 15.00, notes: 'Sin aceitunas' },
    { id: 2, name: 'Coca Cola 1.5L', quantity: 1, price: 3.50 }
    ],
    total: 33.50,
    paymentMethod: 'card',
    paymentStatus: 'paid',
    deliveryNotes: 'Tocar timbre del 4to piso'
},
{
    id: '1002',
    restaurant: 'Burger House',
    pickupAddress: 'Av. Cabildo 2345, Belgrano, CABA',
    deliveryAddress: 'Av. del Libertador 3456, Núñez, CABA',
    customerName: 'Carlos Rodríguez',
    customerPhone: '+54 11 2345-6789',
    status: 'ready_for_pickup',
    items: [
    { id: 1, name: 'Hamburguesa Completa', quantity: 1, price: 12.00 },
    { id: 2, name: 'Papas Fritas', quantity: 1, price: 4.50 }
    ],
    total: 16.50,
    paymentMethod: 'cash',
    paymentStatus: 'pending',
    deliveryNotes: null
}
])

// Datos de ejemplo - Pedidos en tránsito
const inTransitOrders = ref([
{
    id: '1000',
    restaurant: 'Sushi Express',
    pickupAddress: 'Av. Las Heras 890, Recoleta, CABA',
    deliveryAddress: 'Av. Callao 1234, Recoleta, CABA',
    customerName: 'Ana Martínez',
    customerPhone: '+54 11 3456-7890',
    status: 'in_transit',
    items: [
    { id: 1, name: 'Combo Sushi 20 piezas', quantity: 1, price: 25.00 },
    { id: 2, name: 'Sopa Miso', quantity: 2, price: 5.00 }
    ],
    total: 35.00,
    paymentMethod: 'card',
    paymentStatus: 'paid',
    deliveryNotes: 'Departamento 5B'
}
])

// Datos de ejemplo - Pedidos entregados
const deliveredOrders = ref([
{
    id: '999',
    restaurant: 'Parrilla Don José',
    pickupAddress: 'Av. Rivadavia 4567, Caballito, CABA',
    deliveryAddress: 'Av. Díaz Vélez 2345, Almagro, CABA',
    customerName: 'Pedro López',
    customerPhone: '+54 11 4567-8901',
    status: 'delivered',
    completedAt: '2024-01-15 14:30',
    earnings: 8.50,
    distance: 3.2,
    items: [
    { id: 1, name: 'Bife de Chorizo', quantity: 1, price: 18.00 },
    { id: 2, name: 'Ensalada Mixta', quantity: 1, price: 6.00 }
    ],
    total: 24.00,
    paymentMethod: 'card',
    paymentStatus: 'paid',
    deliveryNotes: null
},
{
    id: '998',
    restaurant: 'Café Tortoni',
    pickupAddress: 'Av. de Mayo 825, Monserrat, CABA',
    deliveryAddress: 'Florida 753, Microcentro, CABA',
    customerName: 'Laura Fernández',
    customerPhone: '+54 11 5678-9012',
    status: 'delivered',
    completedAt: '2024-01-15 12:15',
    earnings: 6.00,
    distance: 1.5,
    items: [
    { id: 1, name: 'Café con Leche', quantity: 2, price: 4.00 },
    { id: 2, name: 'Medialunas', quantity: 6, price: 8.00 }
    ],
    total: 16.00,
    paymentMethod: 'cash',
    paymentStatus: 'paid',
    deliveryNotes: null
}
])


const viewOrderDetails = async () => {
  try {
    loading.value = true
    error.value = null

    // const orderDetails = await orderApi.getOrderById(order._id)
    const orderDetails = await orderApi.getOrderById("68f04a6f904de0f188ece5bd")

    selectedOrder.value = orderDetails
    showDetailsModal.value = true
  } catch (err) {
    console.error('Error al obtener detalles del pedido:', err)
    error.value = err.message
  } finally {
    loading.value = false
  }
}

const closeDetailsModal = () => {
    showDetailsModal.value = false
    selectedOrder.value = null
}

const acceptOrder = (orderId) => {
    const orderIndex = readyForPickupOrders.value.findIndex(o => o.id === orderId)
    if (orderIndex !== -1) {
        const order = readyForPickupOrders.value[orderIndex]
        order.status = 'in_transit'
        inTransitOrders.value.push(order)
        readyForPickupOrders.value.splice(orderIndex, 1)
        alert(`Pedido #${orderId} aceptado exitosamente`)
    }
}

const rejectOrder = (orderId) => {
    const orderIndex = readyForPickupOrders.value.findIndex(o => o.id === orderId)
    if (orderIndex !== -1) {
        readyForPickupOrders.value.splice(orderIndex, 1)
        alert(`Pedido #${orderId} rechazado`)
    }
}

const updateOrderStatusLocal = async (orderId, newStatus) => {
  try {
    // Actualizar el estado en el backend
    await orderApi.updateOrderStatus(orderId, newStatus)
    
    // Actualizar el estado local
    const order = inTransitOrders.value.find(o => o.id === orderId)
    if (order) {
      order.status = newStatus
      
      if (newStatus === 'delivered') {
        // Mover a entregados
        const orderIndex = inTransitOrders.value.findIndex(o => o.id === orderId)
        if (orderIndex !== -1) {
          const deliveredOrder = { 
            ...order, 
            completedAt: new Date().toLocaleString('es-AR'),
            earnings: 7.50,
            distance: 2.5
          }
          deliveredOrders.value.unshift(deliveredOrder)
          inTransitOrders.value.splice(orderIndex, 1)
        }
      }
      
      alert(`Pedido #${orderId} actualizado a: ${getStatusLabel(newStatus)}`)
    }
  } catch (err) {
    console.error('Error al actualizar el estado del pedido:', err)
    alert('Error al actualizar el estado del pedido. Por favor, inténtalo de nuevo.')
  }
}
</script>
  