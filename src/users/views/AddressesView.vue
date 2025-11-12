<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-8">
        <h2 class="text-3xl font-bold text-gray-900 mb-2">Mis Direcciones</h2>
        <p class="text-gray-600">Gestiona tus direcciones de entrega</p>
      </div>

      <div v-if="successMessage" class="mb-6 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-center justify-between">
        <div class="flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <p class="font-medium">{{ successMessage }}</p>
        </div>
        <button @click="successMessage = ''" class="text-green-600 hover:text-green-800">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div v-if="error" class="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center justify-between">
        <div class="flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="font-medium">{{ error }}</p>
        </div>
        <button @click="error = ''" class="text-red-600 hover:text-red-800">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div v-if="loading" class="bg-white rounded-lg shadow-sm p-12 text-center">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
        <p class="mt-4 text-gray-600">Cargando direcciones...</p>
      </div>

      <div v-if="showForm" class="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
        <div class="p-6 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">
            {{ editingAddress ? 'Editar Dirección' : 'Nueva Dirección' }}
          </h3>
        </div>
        
        <form @submit.prevent="handleSaveAddress" class="p-6">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Calle y número *
              </label>
              <input
                v-model="addressForm.street"
                type="text"
                required
                placeholder="Ej: Av. Corrientes 1234"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div class="grid md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Ciudad *
                </label>
                <input
                  v-model="addressForm.city"
                  type="text"
                  required
                  placeholder="Ej: Buenos Aires"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Código Postal *
                </label>
                <input
                  v-model="addressForm.zipCode"
                  type="text"
                  required
                  placeholder="Ej: 1043"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>

            <div class="flex items-center">
              <input
                v-model="addressForm.isFavorite"
                type="checkbox"
                id="isFavorite"
                class="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
              />
              <label for="isFavorite" class="ml-2 text-sm font-medium text-gray-700">
                Marcar como dirección favorita
              </label>
            </div>
          </div>

          <div class="mt-6 flex gap-3 justify-end">
            <button
              type="button"
              @click="handleCancelForm"
              :disabled="saving"
              class="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="saving"
              class="px-6 py-2.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <svg v-if="saving" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ saving ? 'Guardando...' : (editingAddress ? 'Actualizar' : 'Crear') }}
            </button>
          </div>
        </form>
      </div>

      <div v-else>
        <div class="mb-4 flex justify-between items-center">
          <p class="text-gray-600">
            Total: {{ addresses.length }} dirección{{ addresses.length !== 1 ? 'es' : '' }}
          </p>
          <button
            @click="handleNewAddress"
            class="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium flex items-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Nueva Dirección
          </button>
        </div>

        <div v-if="addresses.length === 0" class="bg-white rounded-lg shadow-sm p-12 text-center">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <p class="mt-4 text-gray-500 text-lg">No tienes direcciones registradas</p>
          <p class="mt-2 text-gray-400 text-sm">Agrega tu primera dirección para comenzar</p>
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="address in addresses"
            :key="address.id"
            class="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div class="flex justify-between items-start">
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-2">
                  <h3 class="text-lg font-semibold text-gray-900">
                    {{ address.street }}
                  </h3>
                  <span
                    v-if="address.isFavorite"
                    class="bg-orange-100 text-orange-600 px-2 py-1 rounded text-xs font-medium"
                  >
                    ⭐ Favorita
                  </span>
                </div>
                <p class="text-gray-600 mb-1">
                  <span class="font-medium">Ciudad:</span> {{ address.city }}
                </p>
                <p class="text-gray-600">
                  <span class="font-medium">Código Postal:</span> {{ address.zipCode }}
                </p>
              </div>

              <div class="flex gap-2 ml-4">
                <button
                  @click="handleEditAddress(address)"
                  class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Editar"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  @click="handleDeleteAddress(address)"
                  class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Eliminar"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../../common/stores/auth.js'
import { userApi } from '../composables/userApiService.js'

const authStore = useAuthStore()

const addresses = ref([])
const loading = ref(false)
const saving = ref(false)
const error = ref('')
const successMessage = ref('')
const showForm = ref(false)
const editingAddress = ref(null)

const addressForm = ref({
  street: '',
  city: '',
  zipCode: '',
  isFavorite: false
})

const fetchAddresses = async () => {
  if (!authStore.currentUser?.userId) {
    error.value = 'No se encontró ID de usuario'
    return
  }
  
  loading.value = true
  error.value = ''
  
  try {
    const response = await userApi.getAddresses(authStore.currentUser.userId)
    addresses.value = response.addresses || response || []
  } catch (err) {
    console.error('Error al obtener direcciones:', err)
    error.value = err.message || 'Error al obtener direcciones'
  } finally {
    loading.value = false
  }
}

const handleNewAddress = () => {
  editingAddress.value = null
  addressForm.value = {
    street: '',
    city: '',
    zipCode: '',
    isFavorite: false
  }
  showForm.value = true
  error.value = ''
  successMessage.value = ''
}

const handleEditAddress = (address) => {
  editingAddress.value = address
  addressForm.value = {
    street: address.street || '',
    city: address.city || '',
    zipCode: address.zipCode || '',
    isFavorite: address.isFavorite || false
  }
  showForm.value = true
  error.value = ''
  successMessage.value = ''
}

const handleCancelForm = () => {
  showForm.value = false
  editingAddress.value = null
  addressForm.value = {
    street: '',
    city: '',
    zipCode: '',
    isFavorite: false
  }
  error.value = ''
  successMessage.value = ''
}

const handleSaveAddress = async () => {
  if (!authStore.currentUser?.userId) {
    error.value = 'No se encontró ID de usuario'
    return
  }

  saving.value = true
  error.value = ''
  successMessage.value = ''

  try {
    if (editingAddress.value) {
      await userApi.updateAddress(
        authStore.currentUser.userId,
        editingAddress.value.id,
        addressForm.value
      )
      successMessage.value = 'Dirección actualizada exitosamente'
    } else {
      await userApi.createAddress(
        authStore.currentUser.userId,
        addressForm.value
      )
      successMessage.value = 'Dirección creada exitosamente'
    }

    await fetchAddresses()
    showForm.value = false
    editingAddress.value = null

    setTimeout(() => {
      successMessage.value = ''
    }, 5000)
  } catch (err) {
    console.error('Error al guardar dirección:', err)
    error.value = err.message || 'Error al guardar la dirección'
  } finally {
    saving.value = false
  }
}

const handleDeleteAddress = async (address) => {
  if (!confirm(`¿Estás seguro de que deseas eliminar la dirección ${address.street}?`)) {
    return
  }

  if (!authStore.currentUser?.userId) {
    error.value = 'No se encontró ID de usuario'
    return
  }

  error.value = ''
  successMessage.value = ''

  try {
    await userApi.deleteAddress(authStore.currentUser.userId, address.id)
    successMessage.value = 'Dirección eliminada exitosamente'
    await fetchAddresses()

    setTimeout(() => {
      successMessage.value = ''
    }, 5000)
  } catch (err) {
    console.error('Error al eliminar dirección:', err)
    error.value = err.message || 'Error al eliminar la dirección'
  }
}

onMounted(() => {
  fetchAddresses()
})
</script>
