import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: JSON.parse(localStorage.getItem('cartItems')) || []
  }),

  getters: {
    totalItems: (state) => state.items.reduce((sum, item) => sum + item.quantity, 0),
    totalPrice: (state) => state.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    isEmpty: (state) => state.items.length === 0
  },

  actions: { addItem(product) {
      const existing = this.items.find(item => item.id === product.id)
      if (existing) { existing.quantity++ } 
      else {
        this.items.push({
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1
        })}
      this.save()
    },

    removeItem(productId) {
      this.items = this.items.filter(item => item.id !== productId)
      this.save()
    },

    updateQuantity(productId, quantity) {
      if (quantity < 1) {
        this.removeItem(productId)
        return
      }
      const item = this.items.find(item => item.id === productId)
      if (item) {
        item.quantity = quantity
        this.save()
      }
    },

    clear() {
      this.items = []
      this.save()
    },

    save() {
      localStorage.setItem('cartItems', JSON.stringify(this.items))
    }
  }
})