import api from '../../common/composables/apiService.js'

export const vendorApi = {
  async searchRestaurants(param) {
    try {
      const response = await api.get(`/vendors/searchRestaurants?param=${param}`)
      return response.data
    } catch (error) {
      console.error('Error al obtener restaurantes:', error.response?.data)
      const errorMessage = error.response?.data?.message || 'Error al obtener restaurantes'
      throw new Error(errorMessage)
    }
  },
}
