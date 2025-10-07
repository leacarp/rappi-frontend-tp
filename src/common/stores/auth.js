import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('authToken'))
  const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))

  const isAuthenticated = computed(() => !!token.value)
  const currentUser = computed(() => user.value)

  function login(tokenValue, userData) {
    token.value = tokenValue
    user.value = userData

    localStorage.setItem('authToken', tokenValue)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  function logout() {
    token.value = null
    user.value = null

    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
  }

  function getAuthHeader() {
    return token.value ? { Authorization: `Bearer ${token.value}` } : {}
  }

  return {
    token,
    user,
    isAuthenticated,
    currentUser,
    login,
    logout,
    getAuthHeader
  }
})
