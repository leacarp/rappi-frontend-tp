<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { createVendorSchema } from '../schemas/createVendorSchema'
import { adminApi } from '../composables/adminApiService'

const router = useRouter()
const loading = ref(false)
const errors = ref({})
const generalError = ref('')

const form = ref({
  email: '',
  password: '',
  name: '',
  phone: '',
  restaurantName: '',
  description: '',
  schedule: '',
  category: ''
})
const successMessage = ref('')

const validateField = async (fieldName) => {
  try {
    await createVendorSchema.validateAt(fieldName, form.value)
    delete errors.value[fieldName]
  } catch (error) {
    errors.value[fieldName] = error.message
  }
}

const validateForm = async () => {
  errors.value = {}
  generalError.value = ''
  
  try {
    await createVendorSchema.validate(form.value, { abortEarly: false })
    return true
  } catch (error) {
    error.inner.forEach((err) => {
      errors.value[err.path] = err.message
    })
    return false
  }
}

const submitForm = async () => {
  if (!(await validateForm())) return
  
  loading.value = true;
  try {
    await adminApi.createVendor(form.value)
    successMessage.value = 'Vendor creado exitosamente'
    setTimeout(() => router.push('/users'), 2000)
  } catch (error) {
    generalError.value = error.message;
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="container mx-auto p-6 max-w-2xl">
    <h1 class="text-3xl font-bold mb-6">Crear Vendor</h1>
    
    <div v-if="successMessage" class="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center">
      <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
      </svg>
      {{ successMessage }}
    </div>

    <div v-if="generalError" class="bg-red-50 border border-red-200 text-red-800 p-4 rounded mb-4">
      {{ generalError }}
    </div>

    <form @submit.prevent="submitForm" class="space-y-6">
      <div>
        <label class="block text-sm font-medium mb-2">Email</label>
        <input
          v-model="form.email"
          type="email"
          placeholder="usuario@email.com"
          class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          @blur="validateField('email')"
        />
        <p v-if="errors.email" class="text-red-500 text-sm mt-1">{{ errors.email }}</p>
      </div>

      <div>
        <label class="block text-sm font-medium mb-2">Contraseña</label>
        <input
          v-model="form.password"
          type="password"
          class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          @blur="validateField('password')"
        />
        <p v-if="errors.password" class="text-red-500 text-sm mt-1">{{ errors.password }}</p>
      </div>

      <div>
        <label class="block text-sm font-medium mb-2">Nombre del Representante</label>
        <input
          v-model="form.name"
          type="text"
          class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          @blur="validateField('name')"
        />
        <p v-if="errors.name" class="text-red-500 text-sm mt-1">{{ errors.name }}</p>
      </div>

      <div>
        <label class="block text-sm font-medium mb-2">Teléfono</label>
        <input
          v-model="form.phone"
          type="tel"
          class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ej: 3561456798"
          @blur="validateField('phone')"
        />
        <p v-if="errors.phone" class="text-red-500 text-sm mt-1">{{ errors.phone }}</p>
      </div>

      <div>
        <label class="block text-sm font-medium mb-2">Nombre del Restaurante</label>
        <input
          v-model="form.restaurantName"
          type="text"
          class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          @blur="validateField('restaurantName')"
        />
        <p v-if="errors.restaurantName" class="text-red-500 text-sm mt-1">{{ errors.restaurantName }}</p>
      </div>

      <div>
        <label class="block text-sm font-medium mb-2">Descripción</label>
        <textarea
          v-model="form.description"
          class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="4"
          @blur="validateField('description')"
        ></textarea>
        <p v-if="errors.description" class="text-red-500 text-sm mt-1">{{ errors.description }}</p>
      </div>

      <div>
        <label class="block text-sm font-medium mb-2">Horario</label>
        <input
          v-model="form.schedule"
          type="text"
          placeholder="Ej: 9:00 AM - 10:00 PM"
          class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          @blur="validateField('schedule')"
        />
        <p v-if="errors.schedule" class="text-red-500 text-sm mt-1">{{ errors.schedule }}</p>
      </div>

      <div>
        <label class="block text-sm font-medium mb-2">Categoría</label>
        <input
          v-model="form.category"
          type="text"
          placeholder="Italiana, Japonesa, Mexicana, etc"
          class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          @blur="validateField('category')"
        />
        <p v-if="errors.category" class="text-red-500 text-sm mt-1">{{ errors.category }}</p>
      </div>

      <button
        type="submit"
        :disabled="loading"
        class="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ loading ? 'Creando...' : 'Crear Vendor' }}
      </button>
    </form>
  </div>
</template>

