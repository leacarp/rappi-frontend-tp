<template>
    <div class="min-h-screen bg-gray-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div class="mb-8">
                    <h2 class="text-3xl font-bold text-gray-900 mb-2">Gestión de Entregas</h2>
                    <p class="text-gray-600">Administra tus entregas</p>
                </div>
                
                <div class="mb-4 p-4 bg-white rounded-lg shadow-sm flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                        <span
                            class="inline-flex h-3 w-3 rounded-full"
                            :class="isAvailable ? 'bg-green-500' : 'bg-gray-400'"
                            aria-hidden="true"
                        ></span>
                        <div>
                            <p class="text-sm font-medium text-gray-900">
                                Estado: <span :class="isAvailable ? 'text-green-700' : 'text-gray-600'">{{ isAvailable ? 'Disponible' : 'No disponible' }}</span>
                            </p>
                            <p class="text-xs text-gray-500">Activa tu disponibilidad para recibir pedidos nuevos.</p>
                        </div>
                    </div>
                    <button
                        @click="toggleAvailability"
                        :aria-pressed="isAvailable.toString()"
                        :aria-label="isAvailable ? 'Cambiar a no disponible' : 'Cambiar a disponible'"
                        :title="isAvailable ? 'Cambiar a no disponible' : 'Cambiar a disponible'"
                        :class="[
                            'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                            isAvailable
                                ? 'bg-green-600 text-white hover:bg-green-700'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        ]"
                    >
                        {{ isAvailable ? 'Pasar a No disponible' : 'Pasar a Disponible' }}
                    </button>
                </div>
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
                <div v-if="activeTab === 'ready_for_pickup' && isAvailable" class="space-y-4">
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
                                <h3 class="text-lg font-semibold text-gray-900">Pedido #{{ order._trackingNumber }}</h3>
                                <p class="text-sm text-gray-700 mt-1">Total: ${{ Number(order._total).toFixed(2) }}</p>
                                <p class="text-xs text-gray-500">Creado: {{ formatDate(order._createdAt) }}</p>
                            </div>
                            <span class="px-3 py-1 text-sm font-medium bg-purple-100 text-purple-800 rounded-full">
                                Listo para Recolección
                            </span>
                        </div>
            
                        <button
                            @click="viewOrderDetails(order._id)"
                            class="w-full mb-3 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                            Ver detalles del pedido
                        </button>
            
                        <div class="flex space-x-3">
                            <button
                                @click="acceptOrder(order._id)"
                                class="flex-1 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                            >
                                Aceptar Pedido
                            </button>
                            <button
                                @click="rejectOrder(order._id)"
                                class="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                                Rechazar
                            </button>
                        </div>
                    </div>
                </div>
        
                <!-- Pedidos En Tránsito -->
                <div v-if="activeTab === 'in_transit' && isAvailable" class="space-y-4">
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
                                <h3 class="text-lg font-semibold text-gray-900">Pedido #{{ order._trackingNumber }}</h3>
                                <p class="text-sm text-gray-700 mt-1">Total: ${{ Number(order._total).toFixed(2) }}</p>
                                <p class="text-xs text-gray-500">Creado: {{ formatDate(order._createdAt) }}</p>
                            </div>
                            <span class="px-3 py-1 text-sm font-medium bg-indigo-100 text-indigo-800 rounded-full">
                                En Tránsito
                            </span>
                        </div>
            
                        <button
                            @click="viewOrderDetails(order._id)"
                            class="w-full mb-3 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                            Ver detalles del pedido
                        </button>
            
                        <div class="space-y-2">
                            <button
                                @click="setOrderAsDelivered(order._id)"
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
                                <h3 class="text-lg font-semibold text-gray-900">Pedido #{{ order._trackingNumber }}</h3>
                                <p class="text-sm text-gray-700 mt-1">Total: ${{ Number(order._total).toFixed(2) }}</p>
                                    <p class="text-xs text-gray-500">Creado: {{ formatDate(order._createdAt) }}</p>
                            </div>
                            <span class="px-3 py-1 text-sm font-medium bg-green-100 text-green-800 rounded-full">
                                Entregado
                            </span>
                        </div>
            
                        <button
                            @click="viewOrderDetails(order._id)"
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
import { ref, computed, onMounted } from 'vue'
import { orderApiService } from '../composables/orderApiService.js'
import { userApi } from '../../users/composables/userApiService.js'
import { useOrderTranslations } from '../../common/composables/orderTranslations.js'
import { useAuthStore } from '../../common/stores/auth.js'
import { useRejectedOrdersStore } from '../stores/rejectedOrders.js'

const authStore = useAuthStore()
const rejectedStore = useRejectedOrdersStore()

const { getStatusLabel, formatDate } = useOrderTranslations()

const activeTab = ref('ready_for_pickup')
const showDetailsModal = ref(false)
const selectedOrder = ref(null)
const loading = ref(false)
const error = ref(null)
const isAvailable = ref(true)

const readyForPickupOrders = ref([])
const inTransitOrders = ref([])
const deliveredOrders = ref([])

const tabs = computed(() => {
    if (isAvailable.value) {
        return [
            { id: 'ready_for_pickup', label: 'Listos para Recolección', count: readyForPickupOrders.value.length },
            { id: 'in_transit', label: 'En Tránsito', count: inTransitOrders.value.length },
            { id: 'delivered', label: 'Entregados', count: deliveredOrders.value.length }
        ]
    }

    return [
        { id: 'delivered', label: 'Entregados', count: deliveredOrders.value.length }
    ]
})

const getDriverAvailability = async () => {
    try {
        const availability = await userApi.getDriverAvailability(authStore.userId)
        return availability.isAvailable
    } catch (err) {
        console.error('Error al obtener la disponibilidad del driver:', err)
        throw err
    }
}

const getOrdersByStatus = async (status) => {
    try {
        const orders = await orderApiService.getOrdersByStatus(status)
        return orders._orders
    } catch (err) {
        console.error('Error al obtener las órdenes:', err)
        throw err
    }
}

const getOrdersByStatusToCurrentUser = async (status) => {
    const userId = authStore.userId
    const orders = await orderApiService.getOrdersByUser(userId, 'driver', status)
    return orders._orders
}

const getReadyForPickupOrders = async () => {
    const orders = await getOrdersByStatus('ready_for_pickup')
    const sorted = orders.sort((a, b) => new Date(a._createdAt) - new Date(b._createdAt))
    return rejectedStore.removeRejecteds(sorted)
}

const getInTransitOrders = async () => {
    const orders = await getOrdersByStatusToCurrentUser('in_transit')
    return orders.sort((a, b) => new Date(a._createdAt) - new Date(b._createdAt))
}

const getDeliveredOrders = async () => {
    const orders = await getOrdersByStatusToCurrentUser('delivered')
    return orders.sort((a, b) => new Date(b._createdAt) - new Date(a._createdAt))
}

const loadOrderSection = async () => {
    if (!isAvailable.value) {
        activeTab.value = 'delivered'
        readyForPickupOrders.value = []
        inTransitOrders.value = []
        deliveredOrders.value = await getDeliveredOrders()
        return
    }

    activeTab.value = 'ready_for_pickup'
    readyForPickupOrders.value = await getReadyForPickupOrders()
    inTransitOrders.value = await getInTransitOrders()
    deliveredOrders.value = await getDeliveredOrders()
}

const viewOrderDetails = async (orderId) => {
    try {
        loading.value = true
        error.value = null

        const orderDetails = await orderApiService.getOrderById(orderId)

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

const setOrderAsDelivered = async (orderId) => {
    try {
        await orderApiService.updateOrderStatus(orderId, 'delivered')
        await loadOrderSection()
        alert('El pedido fue marcado como entregado exitosamente.')
    } catch (err) {
        console.error('Error al marcar como entregado el pedido:', err)
        error.value = err.message
    }
}

const toggleAvailability = async () => {
    try {
        if (isAvailable.value && inTransitOrders.value.length > 0) {
            alert('No puedes pasar a No disponible mientras tengas pedidos en tránsito.')
            return
        }

        isAvailable.value = !isAvailable.value
        activeTab.value = isAvailable.value ? 'ready_for_pickup' : 'delivered'

        await userApi.updateDriverAvailability(authStore.userId, isAvailable.value)

        await loadOrderSection()

        alert(isAvailable.value ? 'Estás disponible para recibir pedidos' : 'No estás disponible')
    } catch (err) {
        console.error('Error al actualizar la disponibilidad del driver:', err)
        error.value = err.message
    }
}

const acceptOrder = async (orderId) => {
    // TODO: Pendiente el backend
    console.log('acceptOrder clicked for', orderId)
}

const rejectOrder = (orderId) => {
    if (!orderId) return
    rejectedStore.add(orderId)
    
    readyForPickupOrders.value = readyForPickupOrders.value.filter(o => o._id !== orderId)
}

onMounted(async () => {
    isAvailable.value = await getDriverAvailability()
    await loadOrderSection()
})
</script>
  