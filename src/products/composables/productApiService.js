import api from '../../common/composables/apiService.js'

export const productApiService = {
  async getProductsByVendor(vendorId) {
    const response = await api.get(`/products/vendor/${vendorId}`)
    return response.data
  },

  async createProduct(productData) {
    const response = await api.post('/products', productData)
    return response.data
  },

  async updateProduct(productId, productData) {
    const response = await api.put(`/products/${productId}`, productData)
    return response.data
  },

  async deleteProduct(productId) {
    await api.delete(`/products/${productId}`)
  }
}

