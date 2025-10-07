<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
    <div class="w-full max-w-md">
      <div class="bg-white rounded-2xl shadow-xl p-8">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Iniciar Sesión</h1>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
              Correo Electrónico
            </label>
            <input
              id="email"
              v-model="email"
              type="email"
              required
              placeholder="tu@email.com"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              :class="{ 'border-red-500': emailError }"
            />
            <p v-if="emailError" class="mt-1 text-sm text-red-600">{{ emailError }}</p>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
              Contraseña
            </label>
            <div class="relative">
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                required
                placeholder="••••••••"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition pr-12"
                :class="{ 'border-red-500': passwordError }"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 text-sm font-medium"
              >
                {{ showPassword ? 'Ocultar' : 'Mostrar' }}
              </button>
            </div>
            <p v-if="passwordError" class="mt-1 text-sm text-red-600">{{ passwordError }}</p>
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ loading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
          </button>

          <p v-if="errorMessage" class="text-center text-sm text-red-600 mt-4">
            {{ errorMessage }}
          </p>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authApi } from '../composables/authApiService.js'
import { useAuthStore } from '../../common/stores/auth.js'

const router = useRouter()
const authStore = useAuthStore()
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const errorMessage = ref('')
const emailError = ref('')
const passwordError = ref('')

const validateForm = () => {
  emailError.value = ''
  passwordError.value = ''
  
  if (!email.value) {
    emailError.value = 'El correo electrónico es requerido'
    return false
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.value)) {
    emailError.value = 'Ingresa un correo electrónico válido'
    return false
  }
  
  if (!password.value) {
    passwordError.value = 'La contraseña es requerida'
    return false
  }
  
  return true
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }
  
  loading.value = true
  errorMessage.value = ''
  
  try {
    const formData = {
      email: email.value,
      password: password.value
    }
    
    const response = await authApi.login(formData)
    console.log('Login exitoso:', response)
    
    if (response.token) {
      const userData = {
        userId: response.userId,
        email: response.email,
        role: response.role
      }
      
      authStore.login(response.token, userData)
      
      email.value = ''
      password.value = ''
      
      router.push({ name: 'home' })
    } else {
      throw new Error('No se recibió token de autenticación')
    }
  } catch (error) {
    errorMessage.value = error
  } finally {
    loading.value = false
  }
}
</script>

