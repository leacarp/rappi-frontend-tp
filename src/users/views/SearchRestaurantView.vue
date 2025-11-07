<template>
    <div class="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      <div class="flex items-center justify-center p-4 pt-8">
        <div class="w-full max-w-2xl">
          <div class="bg-white rounded-2xl shadow-xl p-8">
            <h1 class="text-3xl font-bold text-gray-800 mb-2 text-center">
              Buscar Restaurantes
            </h1>
            <p class="text-gray-600 text-center mb-8">
              Encuentra tu restaurante favorito
            </p>
  
            <form @submit.prevent="handleSearch" class="space-y-6">
              <div>
                <label for="search" class="block text-sm font-medium text-gray-700 mb-2">
                  Buscar por nombre o categoría
                </label>
                <input
                  id="search"
                  v-model="searchQuery"
                  @input="clearErrors"
                  type="text"
                  placeholder="Ej: Pizza, Sushi, La Trattoria..."
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                  :class="{ 'border-red-500': errorMessage }"
                  required
                />
              </div>
  
              <button
                type="submit"
                :disabled="isSearching"
                class="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-amber-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ isSearching ? 'Buscando...' : 'Buscar' }}
              </button>
            </form>
  
            <div v-if="searchResults.length > 0" class="mt-8">
              <h2 class="text-xl font-semibold text-gray-800 mb-4">
                Encontrados {{ totalResults }} restaurante{{ totalResults !== 1 ? 's' : '' }}:
              </h2>
              <div class="space-y-4">
                <div
                  v-for="(restaurant, index) in searchResults"
                  :key="index"
                  class="p-6 border border-gray-200 rounded-lg hover:border-orange-500 hover:shadow-md transition-all cursor-pointer bg-white"
                >
                  <div class="flex justify-between items-start mb-2">
                    <h3 class="text-lg font-semibold text-gray-800">{{ restaurant.restaurantName }}</h3>
                    <span 
                      v-if="restaurant.rating > 0" 
                      class="bg-orange-100 text-orange-600 px-2 py-1 rounded text-sm font-medium"
                    >
                      ⭐ {{ restaurant.rating.toFixed(1) }}
                    </span>
                  </div>
                  
                  <p v-if="restaurant.description" class="text-sm text-gray-500 mb-3 line-clamp-2">
                    {{ restaurant.description }}
                  </p>
                  
                  <div class="flex justify-between items-center pt-2 border-t border-gray-100">
                    <div class="flex items-center space-x-4 text-xs text-gray-500">
                      <span v-if="restaurant.schedule" class="flex items-center">
                        🕒 {{ restaurant.schedule }}
                      </span>
                      <span :class="restaurant.isAvailable ? 'text-green-600' : 'text-red-600'" class="flex items-center font-medium">
                        {{ restaurant.isAvailable ? '🟢 Disponible' : '🔴 No disponible' }}
                      </span>
                    </div>
                    <button 
                      class="text-orange-500 hover:text-orange-600 font-medium text-sm transition-colors"
                      @click="selectRestaurant(restaurant)"
                    >
                      Ver más →
                    </button>
                  </div>
                </div>
              </div>
            </div>
  
            <div v-if="showNoResults" class="mt-8 text-center text-gray-600">
              No se encontraron restaurantes con el término "{{ lastSearchQuery }}"
            </div>

            <div v-if="errorMessage" class="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p class="text-center text-sm text-red-600">{{ errorMessage }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { vendorApi } from '../composables/vendorApiService.js'
  import { useRouter } from 'vue-router'
  
  const router = useRouter()
  const searchQuery = ref('')
  const isSearching = ref(false)
  const searchResults = ref([])
  const showNoResults = ref(false)
  const errorMessage = ref('')
  const lastSearchQuery = ref('')
  const totalResults = ref(0)

  const validateSearch = () => {
    if (!searchQuery.value || !searchQuery.value.trim()) {
      errorMessage.value = 'Por favor, ingresa un término de búsqueda'
      return false
    }
    
    if (searchQuery.value.trim().length < 3) {
      errorMessage.value = 'El término de búsqueda debe tener al menos 3 caracteres'
      return false
    }
    
    return true
  }

  const clearErrors = () => {
    if (errorMessage.value) {
      errorMessage.value = ''
    }

    if (showNoResults.value) {
      showNoResults.value = false
    }

    if (searchResults.value.length > 0) {
      searchResults.value = []
      totalResults.value = 0
    }
  }

  const selectRestaurant = (restaurant) => {
    console.log('Restaurante seleccionado:', {
      name: restaurant.restaurantName,
      description: restaurant.description,
      rating: restaurant.rating,
      available: restaurant.isAvailable,
      schedule: restaurant.schedule
    })

    const vendorId = restaurant._id || restaurant.id || restaurant.vendorId || restaurant.restaurantId
    if (!vendorId) {
      console.error('No se pudo obtener el ID del restaurante seleccionado.', restaurant)
      return
    }
    router.push({
      name: 'restaurant-menu',
      params: { vendorId }
    })
  }
  
  const handleSearch = async () => {
    if (!validateSearch()) {
      return
    }
  
    isSearching.value = true
    showNoResults.value = false
    errorMessage.value = ''
    searchResults.value = []
    totalResults.value = 0
    lastSearchQuery.value = searchQuery.value.trim()
    
    try {
      const response = await vendorApi.searchRestaurants(lastSearchQuery.value)
      
       // Normalizar resultados para asegurar vendorId
    const results = (response.restaurants || []).map(r => ({
      ...r,
      vendorId: r._id || r.id || r.vendorId || r.restaurantId || (r.vendor && (r.vendor._id || r.vendor.id)) || null
    }))

    searchResults.value = results
    totalResults.value = response.total || results.length
    
    if (results.length === 0) {
      showNoResults.value = true
    }
      
    } catch (error) {
      errorMessage.value = error.message || 'Error al buscar restaurantes. Por favor, intenta nuevamente.'
      searchResults.value = []
      totalResults.value = 0
    } finally {
      isSearching.value = false
    }
  }
  
  </script>
  