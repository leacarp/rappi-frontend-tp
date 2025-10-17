<script setup>
import { RouterView } from 'vue-router'
import { useAuthStore } from './common/stores/auth.js'
import NavBar from './common/components/NavBar.vue'

const authStore = useAuthStore()
</script>

<template>
  <div>
    <NavBar v-if="authStore.isAuthenticated" />
    
    <RouterView />
  </div>
</template>
