<script setup>
import { ref, onMounted, watch } from 'vue'
import { ordersApi } from '../composables/ordersApiService' 
       
const orders = ref([]);
const drivers = ref([]);
const selectedStatus = ref('pending');
const loading = ref(false);
const error = ref('');
const modalError = ref('');
const showModal = ref(false);
const selectedOrder = ref(null);
const successMessage = ref('')
const confirming = ref(false)
const selectedDriver = ref(null)
const assigning = ref(false)



const orderStatuses = [
  'pending',
  'accepted',
  'preparing',
  'readyForPickup',
  'inTransit',
  'delivered'
]

const orderStatusLabels = {
  pending: 'Pendiente',
  accepted: 'Aceptado',
  preparing: 'En preparación',
  readyForPickup: 'Listo para retirar',
  inTransit: 'En camino',
  delivered: 'Entregado'
}

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
    drivers.value = data;
    } catch (error) {
    modalError.value = error.message;
    }
}

const openModal = (order, driverId) => {
  selectedOrder.value = order
  selectedDriver.value = driverId
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedOrder.value = null
  modalError.value = ''
  successMessage.value = ''
}

const confirmAssign = (driver) => {
  selectedDriver.value = driver
  confirming.value = true
}

const cancelConfirm = () => {
  selectedDriver.value = null
  confirming.value = false
}

const assignDriver = async (driverId) => {
    loading.value = true;
    modalError.value = '';
    confirming.value = false;
    successMessage.value = '';
    assigning.value = true
    try {
    await ordersApi.assignDriverToOrder(selectedOrder.value.id, driverId)
    successMessage.value = 'Driver asignado correctamente';
    await fetchOrdersByStatus()
    setTimeout(() => {
      closeModal()
      assigning.value = false
    }, 2000)
    } catch (error) {
    modalError.value = error.message;
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

    <div v-if="error" class="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
      {{ error }}
    </div>
   
    <div class="mb-6">
      <label class="block text-sm font-medium mb-2">Filtrar por estado:</label>
      <select 
        v-model="selectedStatus" 
        class="px-4 py-2 border rounded-lg"
      >
        <option v-for="status in orderStatuses" :key="status" :value="status">
          {{ orderStatusLabels[status] }}
        </option>
      </select>
    </div>

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
          <p class="text-sm text-gray-600">Estado: {{ orderStatusLabels[order.status] }}</p>
        </div>
        <button 
          @click="openModal(order)"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Asignar Driver
        </button>
      </div>

      <p v-if="orders.length === 0" class="text-center text-gray-500 py-8">
        No hay órdenes con estado "{{ orderStatusLabels[selectedStatus] }}"
      </p>
    </div>

    <div v-if="showModal" class="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50" @click.self="closeModal">
      <div class="bg-white rounded-xl p-6 shadow-lg max-w-md w-full">

        <div v-if="successMessage" class="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path 
                fill-rule="evenodd" 
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
                clip-rule="evenodd"
              />
            </svg>
            {{ successMessage }}
        </div>

        <div v-else-if="!assigning">
            <div v-if="modalError" class="mb-3 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center">
                {{ modalError }}
            </div>

            <h3 v-if="!successMessage" class="text-xl font-bold mb-4">
              Asignar Driver a Orden #{{ selectedOrder?.trackingNumber }}
            </h3>

            <div v-if="!confirming && !successMessage" class="space-y-2 mb-6">
                <button
                  v-for="driver in drivers"
                  :key="driver.id"
                  @click="confirmAssign(driver)"
                  class="w-full p-3 border rounded-lg hover:bg-gray-100 text-left"
                >
                  <p class="font-semibold">{{ driver.name }}</p>
                  <p class="text-sm text-gray-600">{{ driver.email }}</p>
                </button>

                <p v-if="!drivers.length" class="text-center text-gray-500 py-4">
                  No hay drivers disponibles
                </p>
            </div>

            <div v-else-if="confirming && !successMessage" class="text-center space-y-4 mb-6">
                <p class="text-gray-700">
                  ¿Deseás asignar <strong>{{ selectedDriver?.name }}</strong> a esta orden?
                </p>
                <div class="flex justify-center gap-4">
                  <button 
                    @click="assignDriver(selectedDriver.id)"
                    class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                  >
                    Confirmar
                  </button>
                  <button 
                    @click="cancelConfirm"
                    class="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400"
                  >
                    Cancelar
                  </button>
                </div>
            </div>

            <button v-if="!successMessage" @click="closeModal" class="w-full px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400">
              Cancelar
            </button>
          </div>
        </div>
    </div>
  </div>
</template>
