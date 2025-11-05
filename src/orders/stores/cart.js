import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const CART_KEY = 'cartItems'
const VENDOR_ID_KEY = 'cartVendorId'

const defaultItems = [
  { id: "68dd42572da14ecf286ba5e6", name: 'Hamburguesa Clásica', price: 15.99, quantity: 2 },
  { id: "68dd42682da14ecf286ba5eb", name: 'Gaseosa', price: 4.50, quantity: 4 }
]
const defaultVendorId = "68c02572855e7473400f9483"

export const useCartStore = defineStore('cart', () => {
  const items = ref(JSON.parse(localStorage.getItem(CART_KEY)) || defaultItems)
  const vendorId = ref(localStorage.getItem(VENDOR_ID_KEY) || defaultVendorId)
  const isModalOpen = ref(false)

  const totalItems = computed(() => items.value.reduce((sum, item) => sum + item.quantity, 0))
  const totalPrice = computed(() => items.value.reduce((sum, item) => sum + item.price * item.quantity, 0))
  const isEmpty = computed(() => items.value.length === 0)

  function addItem(product) {
    const existing = items.value.find(item => item.id === product.id)

    if (existing) {
      existing.quantity++
    } else {
      items.value.push({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1
      })
    }
  
    save()
  }

  function removeItem(productId) {
    items.value = items.value.filter(item => item.id !== productId)
    save()
  }

  function updateQuantity(productId, quantity) {
    if (quantity < 1) {
      removeItem(productId)
      return
    }

    const item = items.value.find(item => item.id === productId)

    if (item) {
      item.quantity = quantity
      save()
    }
  }

  function clear() {
    items.value = []
    vendorId.value = null
    save()
  }

  function setVendorId(id) {
    vendorId.value = id
    localStorage.setItem(VENDOR_ID_KEY, id)
  }

  function save() {
    localStorage.setItem(CART_KEY, JSON.stringify(items.value))
    if (vendorId.value) {
      localStorage.setItem(VENDOR_ID_KEY, vendorId.value)
    } else {
      localStorage.removeItem(VENDOR_ID_KEY)
    }
  }

  function openModal() {
    isModalOpen.value = true
  }

  function closeModal() {
    isModalOpen.value = false
  }

  return {
    items,
    vendorId,
    totalItems,
    totalPrice,
    isEmpty,
    isModalOpen,
    addItem,
    removeItem,
    updateQuantity,
    clear,
    setVendorId,
    openModal,
    closeModal
  }
})