<script setup>
import { ref, onMounted, watch } from 'vue'
import { ordersApi } from '../composables/ordersApiService'
       
const orders = ref([])
const drivers = ref([])
const selectedStatus = ref('pending')
const loading = ref(false)
const error = ref('')
const showModal = ref(false)
const selectedOrder = ref(null)

const orderStatuses = [
  'pending',
  'accepted',
  'preparing',
  'readyForPickup',
  'inTransit',
  'delivered',
  'canceled'
]
        
const fetchOrdersByStatus = async () => {
loading.value = true;
error.value= '';
    try {
    const data = await ordersApi.getOrdersByStatus(selectedStatus.value)
    orders.value = data.orders;
    } catch (error) {
    error.value = error.message;
    } finally{
      loading.value = false;
    }
}
        
const fetchDrivers = async () => {
    try {
    const data = await ordersApi.getAllDrivers()
    drivers.value = data || {};
    } catch (error) {
    error.value = error.message;
    }
}

const openModal = (order) => {
  selectedOrder.value = order
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedOrder.value = null
}

const assignDriver = async (driverId) => {
    loading.value = true;
    try {
    await ordersApi.assignDriverToOrder(selectedOrder.value.id, driverId)
    closeModal()
    await fetchOrdersByStatus()
    } catch (error) {
    error.value = error.message;
    }
    finally{
      loading.value = false;
    }
}
onMounted(async () => {
  await Promise.all([fetchOrdersByStatus(), fetchDrivers()])
})

watch(selectedStatus, () => {
  fetchOrdersByStatus()
})
</script>


<template>
  <div class="p-6">
    <h2 class="text-2xl font-bold mb-6">Asignar Drivers</h2>

    <!-- Mensaje de error -->
    <div v-if="error" class="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
      {{ error }}
    </div>

    <!-- Selector de estado -->
    <div class="mb-6">
      <label class="block text-sm font-medium mb-2">Filtrar por estado:</label>
      <select 
        v-model="selectedStatus" 
        class="px-4 py-2 border rounded-lg"
      >
        <option v-for="status in orderStatuses" :key="status" :value="status">
          {{ status }}
        </option>
      </select>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-8">
      Cargando órdenes...
    </div>

    <div v-else class="space-y-4">
      <div 
        v-for="order in orders" 
        :key="order.id"
        class="p-4 border rounded-lg flex justify-between items-center"
      >
        <div>
          <p class="font-semibold">Orden #{{ order.trackingNumber }}</p>
          <p class="text-sm text-gray-600">Creada: {{ order.createdAt }}</p>
          <p class="text-sm text-gray-600">Estado: {{ order.status }}</p>
        </div>
        <button 
          @click="openModal(order)"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Asignar Driver
        </button>
      </div>

      <p v-if="orders.length === 0" class="text-center text-gray-500 py-8">
        No hay órdenes con estado "{{ selectedStatus }}"
      </p>
    </div>

    <!-- Modal para asignar driver -->
    <div 
      v-if="showModal" 
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="closeModal"
    >
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 class="text-xl font-bold mb-4">
          Asignar Driver a Orden #{{ selectedOrder?.trackingNumber }}
        </h3>

        <div class="space-y-2 mb-6">
          <button
            v-for="driver in drivers"
            :key="driver.id"
            @click="assignDriver(driver.id)"
            class="w-full p-3 border rounded-lg hover:bg-gray-100 text-left"
          >
            <p class="font-semibold">{{ driver.name }}</p>
            <p class="text-sm text-gray-600">{{ driver.email }}</p>
          </button>

          <p v-if="!drivers.length" class="text-center text-gray-500 py-4">
            No hay drivers disponibles
          </p>
        </div>

        <button 
          @click="closeModal"
          class="w-full px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
        >
          Cancelar
        </button>
      </div>
    </div>
  </div>
</template>
