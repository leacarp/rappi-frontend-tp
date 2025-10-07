<template>
  <div>
    <h1>Lista de Direcciones - Vista de Prueba</h1>
    
    <div v-if="loading">
      Cargando direcciones...
    </div>
    
    <div v-else-if="error">
      <h2>Error:</h2>
      <p>{{ error }}</p>
    </div>
    
    <div v-else>
      <h2>Direcciones del usuario: {{ authStore.currentUser?.email }}</h2>
      <p>User ID: {{ authStore.currentUser?.userId }}</p>
      <p>Total de direcciones: {{ addresses.length }}</p>
      
      <div v-if="addresses.length === 0">
        <p>No tienes direcciones registradas.</p>
      </div>
      
      <div v-else>
        <ul>
          <li v-for="address in addresses" :key="address.id">
            <h3>{{ address.alias || 'Sin alias' }}</h3>
            <p><strong>Dirección:</strong> {{ address.street }}, {{ address.city }}</p>
            <p><strong>Código Postal:</strong> {{ address.postalCode }}</p>
            <p v-if="address.instructions"><strong>Instrucciones:</strong> {{ address.instructions }}</p>
            <hr>
          </li>
        </ul>
      </div>
    </div>
    
    <div>
      <h2>Información de Debug:</h2>
      <p><strong>Token presente:</strong> {{ !!authStore.token }}</p>
      <p><strong>Usuario autenticado:</strong> {{ authStore.isAuthenticated }}</p>
      <p><strong>Headers de Authorization:</strong> {{ authStore.token ? 'Bearer ' + authStore.token.substring(0, 20) + '...' : 'No token' }}</p>
    </div>
    
    <div>
      <button @click="fetchAddresses">Recargar Direcciones</button>
      <button @click="goHome">Volver al Home</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../common/stores/auth.js'
import { userApi } from '../composables/userApiService.js'

const router = useRouter()
const authStore = useAuthStore()

const addresses = ref([])
const loading = ref(false)
const error = ref('')

const fetchAddresses = async () => {
  if (!authStore.currentUser?.userId) {
    error.value = 'No se encontró ID de usuario'
    return
  }
  
  loading.value = true
  error.value = ''
  
  try {
    console.log('Obteniendo direcciones para usuario:', authStore.currentUser.userId)
    const response = await userApi.getAddresses(authStore.currentUser.userId)
    console.log('Respuesta del backend:', response)
    addresses.value = response.addresses || response || []
  } catch (err) {
    console.error('Error completo:', err)
    error.value = err.message || 'Error desconocido'
  } finally {
    loading.value = false
  }
}

const goHome = () => {
  router.push({ name: 'home' })
}

onMounted(() => {
  console.log('Componente montado. Usuario actual:', authStore.currentUser)
  fetchAddresses()
})
</script>
