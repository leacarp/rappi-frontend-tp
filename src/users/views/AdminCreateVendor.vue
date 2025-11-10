<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { adminApi } from '../composables/adminApiService'

const router = useRouter();
const loading = ref(false);
const errors = ref({});

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

const validateForm = () => {
  errors.value = {}
  if (!form.value.email) errors.value.email = 'Email requerido';
  if (!form.value.password || form.value.password.length < 6) errors.value.password = 'Contraseña mínimo 6 caracteres';
  if (!form.value.name) errors.value.name = 'Nombre requerido';
  if (!form.value.phone) errors.value.phone = 'Teléfono requerido';
  if (!form.value.restaurantName) errors.value.restaurantName = 'Nombre del restaurante requerido';
  if (!form.value.category) errors.value.category = 'Categoría requerida';

  return Object.keys(errors.value).length === 0
}

const submitForm = async () => {
  if (!validateForm()) return

  loading.value = true;
  errors.value.general= '';
  try {
    await adminApi.createVendor(form.value)
    router.push('/users')
  } catch (error) {
    errors.value.general = error.message  } 
finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-4 md:p-8">
    <div class="max-w-2xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Crear Nuevo Vendor</h1>

      <div v-if="errors.general" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
        <p class="text-red-700 font-medium">{{ errors.general }}</p>
      </div>

      <form @submit.prevent="submitForm" class="bg-white rounded-lg shadow p-6 space-y-6">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            v-model="form.email"
            type="email"
            id="email"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p v-if="errors.email" class="text-red-500 text-sm mt-1">{{ errors.email }}</p>
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
          <input
            v-model="form.password"
            type="password"
            id="password"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p v-if="errors.password" class="text-red-500 text-sm mt-1">{{ errors.password }}</p>
        </div>

        <div>
          <label for="name" class="block text-sm font-medium text-gray-700 mb-2">Nombre del Representante</label>
          <input
            v-model="form.name"
            type="text"
            id="name"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p v-if="errors.name" class="text-red-500 text-sm mt-1">{{ errors.name }}</p>
        </div>

        <div>
          <label for="phone" class="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
          <input
            v-model="form.phone"
            type="tel"
            id="phone"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p v-if="errors.phone" class="text-red-500 text-sm mt-1">{{ errors.phone }}</p>
        </div>

        <div>
          <label for="restaurantName" class="block text-sm font-medium text-gray-700 mb-2">Nombre del Restaurante</label>
          <input
            v-model="form.restaurantName"
            type="text"
            id="restaurantName"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p v-if="errors.restaurantName" class="text-red-500 text-sm mt-1">{{ errors.restaurantName }}</p>
        </div>

        <div>
          <label for="description" class="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
          <textarea
            v-model="form.description"
            id="description"
            rows="4"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          ></textarea>
          <p v-if="errors.description" class="text-red-500 text-sm mt-1">{{ errors.description }}</p>
        </div>

        <div>
          <label for="schedule" class="block text-sm font-medium text-gray-700 mb-2">Horarios</label>
          <input
            v-model="form.schedule"
            type="text"
            id="schedule"
            placeholder="Ej: Lunes a Viernes 10:00 - 22:00"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p v-if="errors.schedule" class="text-red-500 text-sm mt-1">{{ errors.schedule }}</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Categoría</label>
          <input
            v-model="form.category"
            type="text"
            placeholder="Ej: Italiana, Mexicana, Sushi"
            class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span v-if="errors.category" class="text-red-500 text-sm">{{ errors.category }}</span>
        </div>

        <div class="flex gap-4 pt-4">
          <button
            type="submit"
            :disabled="loading"
            class="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition"
          >
            {{ loading ? 'Creando...' : 'Crear Vendor' }}
          </button>
          <button
            type="button"
            @click="$router.back()"
            class="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900 font-medium py-2 px-4 rounded-lg transition"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

