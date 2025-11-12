<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCreateVendorStore } from '../stores/createVendorStore'
import { createVendorSchema } from '../schemas/createVendorSchema'
import { adminApi } from '../composables/adminApiService'

const router = useRouter()
const store = useCreateVendorStore()
const loading = ref(false)
const errors = ref({})
const generalError = ref('')

const form = computed({
  get: () => store.form,
  set: (value) => store.setForm(value)
})

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
    store.resetForm()
    router.push('/users')
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

