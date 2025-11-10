import api from '../../common/composables/apiService.js'

const BASE_URL = '/users'

export const userApi = {
  async getAddresses(userId) {
    try {
      const response = await api.get(`${BASE_URL}/${userId}/addresses`)
      return response.data
    } catch (error) {
      console.error('Error al obtener direcciones:', error.response?.data)
      const errorMessage = error.response?.data?.message || 'Error al obtener direcciones'
      throw new Error(errorMessage)
    }
  },

  async getDriverAvailability(userId) {
    try {
      const response = await api.get(`${BASE_URL}/${userId}/driver/availability`)
      return response.data
    } catch (error) {
      console.error('Error al obtener la disponibilidad del driver:', error)
      throw error
    }
  },

  async updateDriverAvailability(userId, isAvailable) {
    try {
      const response = await api.put(`${BASE_URL}/${userId}/driver/availability`, { isAvailable })
      return response.data
    } catch (error) {
      console.error('Error al actualizar la disponibilidad del driver:', error)
      throw error
    }
  },

  async getReviews(userId) {
    try {
      const response = await api.get(`${BASE_URL}/vendors/${userId}/reviews`)
      return response.data
    } catch (error) {
      console.error('Error al obtener reviews:', error.response?.data)
      const errorMessage = error.response?.data?.message || 'Error al obtener reviews'
      throw new Error(errorMessage)
    }
  }
}
