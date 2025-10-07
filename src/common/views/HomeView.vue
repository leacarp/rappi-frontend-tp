<script setup>
import { useAuthStore } from '../stores/auth.js'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const handleLogout = () => {
  authStore.logout()
  router.push({ name: 'login' })
}

const goToAddresses = () => {
  router.push({ name: 'addresses' })
}
</script>

<template>
  <main class="min-h-screen bg-gray-100 p-4">
    <div class="max-w-4xl mx-auto">
      <header class="bg-white rounded-lg shadow-md p-6 mb-6">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">
              ¡Bienvenido, {{ authStore.currentUser?.email }}!
            </h1>
            <p class="text-gray-600 mt-2">
              Rol: {{ authStore.currentUser?.role }}
            </p>
          </div>
          <button 
            @click="handleLogout"
            class="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
          >
            Cerrar Sesión
          </button>
        </div>
      </header>

      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-2xl font-semibold text-gray-900 mb-4">
          Dashboard Principal
        </h2>

        <div class="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 class="font-semibold text-yellow-800">🧪 Vista de Prueba</h3>
          <p class="mt-2 text-yellow-700">
            Probar la comunicación con el backend:
          </p>
          <button 
            @click="goToAddresses"
            class="mt-2 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
          >
            Ver Direcciones (Test API)
          </button>
        </div>
      </div>
    </div>
  </main>
</template>
