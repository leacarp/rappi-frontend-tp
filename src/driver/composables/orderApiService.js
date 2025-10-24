import api from '../../common/composables/apiService.js'

export const orderApi = {
  async getOrderById(orderId) {
    try {
      const response = await api.get(`/orders/${orderId}`)
      return response.data
    } catch (error) {
      console.error('Error al obtener el pedido:', error.response?.data)
      const errorMessage = error.response?.data?.message || 'Error al obtener el pedido'
      throw new Error(errorMessage)
    }
  },

  async updateOrderStatus(orderId, newStatus) {
    try {
      const response = await api.put(`/orders/${orderId}/status`, {
        status: newStatus
      })
      return response.data
    } catch (error) {
      console.error('Error al actualizar el estado del pedido:', error.response?.data)
      const errorMessage = error.response?.data?.message || 'Error al actualizar el estado del pedido'
      throw new Error(errorMessage)
    }
  }
}
