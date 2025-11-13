import api from '../../common/composables/apiService.js'

const BASE_URL = '/orders'
const BASE_URL_USER = '/users'

export const ordersApi = {
  async getOrdersByStatus(status) {
    try {
      const response = await api.get(`${BASE_URL}?status=${status}`)
      console.log('Orden info: ', response.data)
      return response.data
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Error al traer las órdenes'
      throw new Error(errorMessage)
    }
  },

  async getAllDrivers() {
    try {
      const response = await api.get(`${BASE_URL_USER}/drivers`)
      console.log('Drivers info: ', response.data)
      return response.data
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Error al traer los drivers'
      throw new Error(errorMessage)
    }
  },

  async assignDriverToOrder(orderId, driverId) {
    try {
      const response = await api.put(`${BASE_URL}/${orderId}/assign-driver`, {driverId} )
      return response.data
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Error al asignar driver'
      throw new Error(errorMessage)
    }
  }
}