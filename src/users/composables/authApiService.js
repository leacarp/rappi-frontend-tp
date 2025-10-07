import api from '../../common/composables/apiService.js'

export const authApi = {
  async login(requestBody) {
    try {
      const response = await api.post('/auth/login', requestBody)
      return response.data
    } catch (error) {
      console.error('Error al iniciar sesión:', error.response?.data)
      const errorMessage = error.response?.data?.message || 'Error al iniciar sesión'
      throw new Error(errorMessage)
    }
  }
}
