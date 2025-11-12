<template>
  <div>
    <div v-if="error" class="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center justify-between">
      <div class="flex items-center gap-2">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p class="font-medium">{{ error }}</p>
      </div>
      <button @click="$emit('dismiss-error')" class="text-red-600 hover:text-red-800">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <div v-if="loading" class="bg-white rounded-lg shadow-sm p-12 text-center">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p class="mt-4 text-gray-600">Cargando calificaciones...</p>
    </div>

    <div v-else>
      <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div class="flex flex-col md:flex-row items-center justify-between gap-6">
          <div class="flex flex-col items-center">
            <p class="text-sm text-gray-600 mb-2">Calificación Promedio</p>
            <div class="flex items-center gap-2">
              <span class="text-5xl font-bold text-gray-900">{{ averageScore.toFixed(1) }}</span>
              <span class="text-2xl text-gray-400">/ 5.0</span>
            </div>
            <div class="flex items-center mt-2">
              <svg 
                v-for="star in 5" 
                :key="star"
                class="w-8 h-8"
                :class="star <= Math.round(averageScore) ? 'text-yellow-400' : 'text-gray-300'"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
          </div>

          <div class="hidden md:block w-px h-24 bg-gray-200"></div>

          <div class="flex flex-col items-center">
            <p class="text-sm text-gray-600 mb-2">Total de Calificaciones</p>
            <span class="text-5xl font-bold text-blue-600">{{ totalReviews }}</span>
            <p class="text-sm text-gray-500 mt-2">{{ totalReviews === 1 ? 'calificación' : 'calificaciones' }}</p>
          </div>

          <div class="hidden md:block w-px h-24 bg-gray-200"></div>

          <div class="flex-1 w-full md:w-auto">
            <p class="text-sm text-gray-600 mb-3 text-center md:text-left">Distribución</p>
            <div class="space-y-1">
              <div v-for="rating in [5, 4, 3, 2, 1]" :key="rating" class="flex items-center gap-2">
                <span class="text-sm text-gray-600 w-3">{{ rating }}</span>
                <svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <div class="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div 
                    class="bg-yellow-400 h-full transition-all duration-300"
                    :style="{ width: `${getStarPercentage(rating)}%` }"
                  ></div>
                </div>
                <span class="text-sm text-gray-600 w-8 text-right">{{ getStarCount(rating) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="space-y-4">
        <h3 class="text-xl font-semibold text-gray-900 mb-4">Comentarios de Clientes</h3>

        <div v-if="reviews.length === 0" class="bg-white rounded-lg shadow-sm p-12 text-center">
          <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <p class="text-gray-500 text-lg">Aún no hay calificaciones</p>
          <p class="text-gray-400 text-sm mt-2">Los comentarios de los clientes aparecerán aquí</p>
        </div>

        <div 
          v-for="(review, index) in reviews" 
          :key="index"
          class="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
        >
          <div class="flex items-start justify-between mb-3">
            <div>
              <div class="flex items-center gap-1 mb-2">
                <svg 
                  v-for="star in 5" 
                  :key="star"
                  class="w-5 h-5"
                  :class="star <= review.score ? 'text-yellow-400' : 'text-gray-300'"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span class="ml-2 text-lg font-semibold text-gray-900">{{ review.score }}.0</span>
              </div>
              <p class="text-sm text-gray-500">{{ formatDate(review.date) }}</p>
            </div>

            <span 
              class="px-3 py-1 rounded-full text-sm font-medium"
              :class="getScoreBadgeClass(review.score)"
            >
              {{ getScoreLabel(review.score) }}
            </span>
          </div>

          <div v-if="review.comment" class="mt-4">
            <p class="text-gray-700 leading-relaxed">{{ review.comment }}</p>
          </div>
          <div v-else class="mt-4">
            <p class="text-gray-400 italic text-sm">Sin comentarios adicionales</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  },
  reviews: {
    type: Array,
    default: () => []
  },
  averageScore: {
    type: Number,
    default: 0
  },
  totalReviews: {
    type: Number,
    default: 0
  }
})

defineEmits(['dismiss-error'])

const getStarPercentage = (rating) => {
  if (props.totalReviews === 0) return 0
  const count = props.reviews.filter(r => r.score === rating).length
  return (count / props.totalReviews) * 100
}

const getStarCount = (rating) => {
  return props.reviews.filter(r => r.score === rating).length
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

const getScoreBadgeClass = (score) => {
  if (score >= 4.5) return 'bg-green-100 text-green-800'
  if (score >= 3.5) return 'bg-blue-100 text-blue-800'
  if (score >= 2.5) return 'bg-yellow-100 text-yellow-800'
  return 'bg-red-100 text-red-800'
}

const getScoreLabel = (score) => {
  if (score >= 4.5) return 'Excelente'
  if (score >= 3.5) return 'Bueno'
  if (score >= 2.5) return 'Regular'
  return 'Necesita mejorar'
}
</script>

