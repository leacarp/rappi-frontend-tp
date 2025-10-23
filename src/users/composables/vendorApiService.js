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

  async getVendorProfile(vendorId){
    try {
      const response = await api.get(`/vendors/${vendorId}/profile`)
      return response.data
    } catch (error) {
      console.error('Error al obtener perfil del vendor:', error.response?.data)
      const errorMessage = error.response?.data?.message || 'Error al obtener perfil del vendor'
      throw new Error(errorMessage)
    }   
  },

  async updateVendorProfile(vendorId, profileData){
    try {
      const response = await api.put(`/vendors/${vendorId}/profile`, profileData)
      return response.data
    } catch (error) {
      console.error('Error al actualizar perfil del vendor:', error.response?.data)
      const errorMessage = error.response?.data?.message || 'Error al actualizar perfil del vendor'
      throw new Error(errorMessage)
    }
  }, 
}