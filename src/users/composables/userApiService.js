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

  async createAddress(userId, addressData) {
    try {
      const response = await api.post(`${BASE_URL}/${userId}/addresses`, addressData)
      return response.data
    } catch (error) {
      console.error('Error al crear dirección:', error.response?.data)
      const errorMessage = error.response?.data?.message || 'Error al crear dirección'
      throw new Error(errorMessage)
    }
  },

  async updateAddress(userId, addressId, addressData) {
    try {
      const response = await api.put(`${BASE_URL}/${userId}/addresses/${addressId}`, addressData)
      return response.data
    } catch (error) {
      console.error('Error al actualizar dirección:', error.response?.data)
      const errorMessage = error.response?.data?.message || 'Error al actualizar dirección'
      throw new Error(errorMessage)
    }
  },

  async deleteAddress(userId, addressId) {
    try {
      const response = await api.delete(`${BASE_URL}/${userId}/addresses/${addressId}`)
      return response.data
    } catch (error) {
      console.error('Error al eliminar dirección:', error.response?.data)
      const errorMessage = error.response?.data?.message || 'Error al eliminar dirección'
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
  },

  async searchRestaurants(param) {
    try {
      const response = await api.get(`${BASE_URL}/vendors/searchRestaurants?param=${param}`)
      return response.data
    } catch (error) {
      console.error('Error al obtener restaurantes:', error.response?.data)
      const errorMessage = error.response?.data?.message || 'Error al obtener restaurantes'
      throw new Error(errorMessage)
    }
  },

  async getVendorProfile(vendorId){
    try {
      const response = await api.get(`${BASE_URL}/vendors/${vendorId}/profile`)
      return response.data
    } catch (error) {
      console.error('Error al obtener perfil del vendor:', error.response?.data)
      const errorMessage = error.response?.data?.message || 'Error al obtener perfil del vendor'
      throw new Error(errorMessage)
    }   
  },

  async updateVendorProfile(vendorId, profileData){
    try {
      const response = await api.put(`${BASE_URL}/vendors/${vendorId}/profile`, profileData)
      return response.data
    } catch (error) {
      console.error('Error al actualizar perfil del vendor:', error.response?.data)
      const errorMessage = error.response?.data?.message || 'Error al actualizar perfil del vendor'
      throw new Error(errorMessage)
    }
  },

  async getVendorMenu(vendorId){
    try {
      const response = await api.get(`products/vendor/${vendorId}`)
      return response.data
    } catch (error) {
      console.error('Error al obtener menu del vendor:', error.response?.data)
      const errorMessage = error.response?.data?.message || 'Error al obtener menu del vendor'
      throw new Error(errorMessage)
    }
  }
}
