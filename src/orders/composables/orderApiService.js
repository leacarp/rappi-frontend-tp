import api from '../../common/composables/apiService.js'

const BASE_URL = '/orders'

export const orderApiService = {
  async getOrdersByUser(userId, role = 'vendor') {
    try {
      const response = await api.get(`${BASE_URL}/user/${userId}?role=${role}`)
      return response.data
    } catch (error) {
      console.error('Error al obtener órdenes del usuario:', error)
      throw error
    }
  },

  async getOrderById(orderId) {
    try {
      const response = await api.get(`${BASE_URL}/${orderId}`)
      return response.data
    } catch (error) {
      console.error('Error al obtener la orden:', error)
      throw error
    }
  },

  async getOrderSummary(orderId) {
    try {
      const response = await api.get(`${BASE_URL}/${orderId}/summary`)
      return response.data
    } catch (error) {
      console.error('Error al obtener el resumen de la orden:', error)
      throw error
    }
  },

  async updateOrderStatus(orderId, status) {
    try {
      const response = await api.put(`${BASE_URL}/${orderId}/status`, {
        status: status
      })
      return response.data
    } catch (error) {
      console.error('Error al actualizar el estado de la orden:', error)
      throw error
    }
  },

  async createOrder(orderData) {
    try {
      const response = await api.post(BASE_URL, orderData)
      return response.data
    } catch (error) {
      console.error('Error al crear la orden:', error)
      throw error
    }
  }
}