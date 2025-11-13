<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50 p-4">
    <div class="w-full max-w-md">
      <div class="bg-white rounded-2xl shadow-xl p-8">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">
            {{ isRegisterMode ? 'Registrarse' : 'Iniciar Sesión' }}
          </h1>
          <p class="text-sm text-gray-600">
            {{ isRegisterMode ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?' }}
            <button
              type="button"
              @click="toggleMode"
              class="text-orange-600 font-semibold hover:text-orange-700 ml-1"
            >
              {{ isRegisterMode ? 'Inicia sesión' : 'Regístrate' }}
            </button>
          </p>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div v-if="isRegisterMode">
            <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
              Nombre Completo
            </label>
            <input
              id="name"
              v-model="name"
              type="text"
              required
              placeholder="Juan Pérez"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
              :class="{ 'border-red-500': nameError }"
            />
            <p v-if="nameError" class="mt-1 text-sm text-red-600">{{ nameError }}</p>
          </div>

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
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
              :class="{ 'border-red-500': emailError }"
            />
            <p v-if="emailError" class="mt-1 text-sm text-red-600">{{ emailError }}</p>
          </div>

          <div v-if="isRegisterMode">
            <label for="phone" class="block text-sm font-medium text-gray-700 mb-2">
              Teléfono
            </label>
            <input
              id="phone"
              v-model="phone"
              type="tel"
              required
              placeholder="1234567890"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
              :class="{ 'border-red-500': phoneError }"
            />
            <p v-if="phoneError" class="mt-1 text-sm text-red-600">{{ phoneError }}</p>
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
                :placeholder="isRegisterMode ? 'Mínimo 3 caracteres' : '••••••••'"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition pr-12"
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
            class="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 hover:from-orange-600 hover:to-amber-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ loading ? (isRegisterMode ? 'Registrando...' : 'Iniciando sesión...') : (isRegisterMode ? 'Registrarse' : 'Iniciar Sesión') }}
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

const isRegisterMode = ref(false)

const email = ref('')
const password = ref('')
const name = ref('')
const phone = ref('')
const showPassword = ref(false)

const loading = ref(false)
const errorMessage = ref('')
const emailError = ref('')
const passwordError = ref('')
const nameError = ref('')
const phoneError = ref('')

const toggleMode = () => {
  isRegisterMode.value = !isRegisterMode.value
  clearErrors()
  errorMessage.value = ''
}

const clearErrors = () => {
  emailError.value = ''
  passwordError.value = ''
  nameError.value = ''
  phoneError.value = ''
}

const validateForm = () => {
  clearErrors()
  
  if (isRegisterMode.value && !name.value) {
    nameError.value = 'El nombre es requerido'
    return false
  }
  
  if (!email.value) {
    emailError.value = 'El correo electrónico es requerido'
    return false
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.value)) {
    emailError.value = 'Ingresa un correo electrónico válido'
    return false
  }
  
  if (isRegisterMode.value && !phone.value) {
    phoneError.value = 'El teléfono es requerido'
    return false
  }
  
  if (!password.value) {
    passwordError.value = 'La contraseña es requerida'
    return false
  }
  
  if (isRegisterMode.value && password.value.length < 3) {
    passwordError.value = 'La contraseña debe tener al menos 3 caracteres'
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
    let response
    
    if (isRegisterMode.value) {
      const formData = {
        email: email.value,
        password: password.value,
        name: name.value,
        phone: phone.value
      }
      
      response = await authApi.register(formData)
    } else {
      const formData = {
        email: email.value,
        password: password.value
      }
      
      response = await authApi.login(formData)
    }
    
    if (response.token) {
      const userData = {
        userId: response.userId,
        email: response.email,
        role: response.role
      }
      
      authStore.login(response.token, userData)
      
      email.value = ''
      password.value = ''
      name.value = ''
      phone.value = ''
      
      router.push({ name: 'home' })
    } else {
      throw new Error('No se recibió token de autenticación')
    }
  } catch (error) {
    errorMessage.value = error.message || error
  } finally {
    loading.value = false
  }
}
</script>

