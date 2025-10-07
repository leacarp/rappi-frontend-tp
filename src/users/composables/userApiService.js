import api from '../../common/composables/apiService.js'

export const userApi = {
  async getAddresses(userId) {
    try {
      const response = await api.get(`/users/${userId}/addresses`)
      return response.data
    } catch (error) {
      console.error('Error al obtener direcciones:', error.response?.data)
      const errorMessage = error.response?.data?.message || 'Error al obtener direcciones'
      throw new Error(errorMessage)
    }
  },
}
