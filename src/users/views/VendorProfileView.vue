<template>
    <div class="min-h-screen bg-gray-50">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="mb-8">
          <h2 class="text-3xl font-bold text-gray-900 mb-2">Mi Perfil de Restaurante</h2>
          <p class="text-gray-600">Gestiona la información de tu negocio</p>
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
  
        <!-- Loading state -->
        <div v-if="loading" class="bg-white rounded-lg shadow-sm p-12 text-center">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p class="mt-4 text-gray-600">Cargando información del perfil...</p>
        </div>
  
        <div v-else class="bg-white rounded-lg shadow-sm overflow-hidden">
          <form @submit.prevent="handleSaveProfile">
            <div class="p-6">
              <div class="grid md:grid-cols-2 gap-8">
                <div class="space-y-6">
                  <div>
                    <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Información Editable
                    </h3>
                  </div>
  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Nombre del Restaurante *
                    </label>
                    <input
                      v-model="profileForm.restaurantName"
                      type="text"
                      required
                      placeholder="Ej: La Pizzería del Centro"
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Horarios *
                    </label>
                    <textarea
                      v-model="profileForm.schedule"
                      required
                      rows="3"
                      placeholder="Ej: Lunes a Viernes: 10:00 - 22:00&#10;Sábados y Domingos: 11:00 - 23:00"
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    ></textarea>
                    <p class="text-xs text-gray-500 mt-1">Describe tus horarios de atención</p>
                  </div>
  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Teléfono
                    </label>
                    <input
                      v-model="profileForm.phone"
                      type="tel"
                      placeholder="Ej: +54 9 11 1234-5678"
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p class="text-xs text-gray-500 mt-1">Número de contacto con código de área</p>
                  </div>
                </div>
  
                <div class="space-y-6">
                  <div>
                    <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Información del Sistema
                    </h3>
                  </div>
  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Descripción
                    </label>
                    <div class="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700">
                      {{ profileData.description || 'Sin descripción' }}
                    </div>
                    <p class="text-xs text-gray-500 mt-1">Campo de solo lectura</p>
                  </div>
  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Email de Contacto
                    </label>
                    <div class="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 flex items-center gap-2">
                      <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {{ profileData.email || 'Sin email' }}
                    </div>
                    <p class="text-xs text-gray-500 mt-1">Campo de solo lectura</p>
                  </div>
  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Calificación
                    </label>
                    <div class="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg">
                      <div class="flex items-center gap-2">
                        <div class="flex items-center">
                          <svg 
                            v-for="star in 5" 
                            :key="star"
                            class="w-5 h-5"
                            :class="star <= Math.round(profileData.rating) ? 'text-yellow-400' : 'text-gray-300'"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </div>
                        <span class="text-lg font-semibold text-gray-900">{{ profileData.rating?.toFixed(1) || '0.0' }}</span>
                        <span class="text-sm text-gray-500">/ 5.0</span>
                      </div>
                    </div>
                    <p class="text-xs text-gray-500 mt-1">Basado en reseñas de clientes</p>
                  </div>
  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Estado de Disponibilidad
                    </label>
                    <div class="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg">
                      <div class="flex items-center gap-3">
                        <div
                          :class="[
                            'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                            profileData.isAvailable ? 'bg-green-600' : 'bg-gray-300'
                          ]"
                        >
                          <span
                            :class="[
                              'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                              profileData.isAvailable ? 'translate-x-6' : 'translate-x-1'
                            ]"
                          />
                        </div>
                        <span class="text-sm font-medium" :class="profileData.isAvailable ? 'text-green-700' : 'text-gray-700'">
                          {{ profileData.isAvailable ? 'Disponible' : 'No disponible' }}
                        </span>
                      </div>
                    </div>
                    <p class="text-xs text-gray-500 mt-1">Campo de solo lectura</p>
                  </div>
                </div>
              </div>
            </div>
  
            <div class="px-6 py-4 bg-gray-50 border-t border-gray-200 flex gap-3 justify-end">
              <button
                type="button"
                @click="handleCancel"
                :disabled="saving"
                class="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancelar
              </button>
              <button
                type="submit"
                :disabled="saving"
                class="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <svg v-if="saving" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ saving ? 'Guardando...' : 'Guardar Cambios' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useAuthStore } from '../../common/stores/auth.js'
  import { vendorApi } from '../composables/vendorApiService.js'
  
  const authStore = useAuthStore()
  const loading = ref(false)
  const saving = ref(false)
  const error = ref('')
  const successMessage = ref('')
  
  const profileData = ref({
    restaurantName: '',
    description: '',
    schedule: '',
    rating: 0,
    isAvailable: false,
    email: '',
    phone: ''
  })
  
  const profileForm = ref({
    restaurantName: '',
    schedule: '',
    phone: ''
  })
  
const loadProfile = async () => {
  if (!authStore.userId) {
    error.value = 'No se encontró ID de usuario'
    return
  }

  loading.value = true
  error.value = ''

  try {
    const response = await vendorApi.getVendorProfile(authStore.userId)
    
    profileData.value = {
      restaurantName: response.restaurantName || '',
      description: response.description || '',
      schedule: response.schedule || '',
      rating: response.rating || 0,
      isAvailable: response.isAvailable || false,
      email: response.email || '',
      phone: response.phone || ''
    }

    profileForm.value = {
      restaurantName: response.restaurantName || '',
      schedule: response.schedule || '',
      phone: response.phone || ''
    }
  } catch (err) {
    console.error('Error al cargar perfil:', err)
    
    if (err.response?.status === 500 && 
        err.response?.data?.message?.includes('no tiene información de vendor')) {
        
      profileData.value = {
        restaurantName: '',
        description: 'Sin descripción',
        schedule: '',
        rating: 0,
        isAvailable: false,
        email: authStore.currentUser?.email || '',
        phone: ''
      }

      profileForm.value = {
        restaurantName: '',
        schedule: '',
        phone: ''
      }

      error.value = '⚠️ Aún no has completado tu perfil de restaurante. Por favor, completa la información a continuación.'
    } else {
      error.value = err.message || 'Error al cargar el perfil del vendor'
    }
  } finally {
    loading.value = false
  }
}
    
  const handleSaveProfile = async () => {
    if (!authStore.userId) {
      error.value = 'No se encontró ID de usuario'
      return
    }
  
    saving.value = true
    error.value = ''
    successMessage.value = ''
  
    try {
      const updateData = {
        restaurantName: profileForm.value.restaurantName,
        schedule: profileForm.value.schedule,
        phone: profileForm.value.phone || undefined
      }
  
      await vendorApi.updateVendorProfile(authStore.userId, updateData)
      
      successMessage.value = '¡Perfil actualizado exitosamente!'
      
      await loadProfile()
  
      setTimeout(() => {
        successMessage.value = ''
      }, 5000)
    } catch (err) {
      console.error('Error al actualizar perfil:', err)
      error.value = err.message || 'Error al actualizar el perfil'
    } finally {
      saving.value = false
    }
  }
  
  const handleCancel = () => {
    profileForm.value = {
      restaurantName: profileData.value.restaurantName,
      schedule: profileData.value.schedule,
      phone: profileData.value.phone
    }
    error.value = ''
    successMessage.value = ''
  }
  
  onMounted(() => {
    loadProfile()
  })
  </script>