<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-8">
        <div class="flex items-center gap-4 mb-4">
          <button 
            @click="goBack"
            class="text-orange-500 hover:text-orange-600 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h2 class="text-3xl font-bold text-gray-900 mb-2">
              Calificaciones del Restaurante
            </h2>
            <p class="text-gray-600">Opiniones de clientes sobre este lugar</p>
          </div>
        </div>
      </div>

      <ReviewsDisplay 
        :loading="loading"
        :error="error"
        :reviews="reviews"
        :average-score="averageScore"
        :total-reviews="totalReviews"
        @dismiss-error="error = ''"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { userApi } from '../composables/userApiService.js'
import ReviewsDisplay from '../components/ReviewsDisplay.vue'

const route = useRoute()
const router = useRouter()
const vendorId = route.params.vendorId

const loading = ref(false)
const error = ref('')
const reviews = ref([])
const averageScore = ref(0)
const totalReviews = ref(0)

const loadReviews = async () => {
  if (!vendorId) {
    error.value = 'No se encontró ID del restaurante'
    return
  }

  loading.value = true
  error.value = ''

  try {
    const response = await userApi.getReviews(vendorId)
    
    reviews.value = response.items || []
    averageScore.value = response.averageScore || 0
    totalReviews.value = response.total || 0
  } catch (err) {
    console.error('Error al cargar reviews:', err)
    error.value = err.message || 'Error al cargar las calificaciones'
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  router.back()
}

onMounted(async () => {
  await loadReviews()
})
</script>

