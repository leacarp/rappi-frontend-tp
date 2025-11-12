import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const CART_KEY = 'cartItems'
const VENDOR_INFO_KEY = 'cartVendorInfo'

export const useCartStore = defineStore('cart', () => {
  const items = ref(JSON.parse(localStorage.getItem(CART_KEY)) || [])
  const vendorInfo = ref(JSON.parse(localStorage.getItem(VENDOR_INFO_KEY)) || null)
  const isModalOpen = ref(false)

  const totalItems = computed(() => items.value.reduce((sum, item) => sum + item.quantity, 0))
  const totalPrice = computed(() => items.value.reduce((sum, item) => sum + item.price * item.quantity, 0))
  const isEmpty = computed(() => items.value.length === 0)

  function addItem(product, productVendorInfo) {
    if (items.value.length === 0) {
      vendorInfo.value = productVendorInfo
    } else if (vendorInfo.value?.id !== productVendorInfo?.id) {
      const shouldClear = window.confirm(
        'Ya tienes productos de otro restaurante en tu carrito. ¿Deseas eliminarlos y agregar este producto?'
      )
      
      if (shouldClear) {
        clear()
        vendorInfo.value = productVendorInfo
      } else {
        return false
      }
    }

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
    return true
  }

  function removeItem(productId) {
    items.value = items.value.filter(item => item.id !== productId)
    
    if (items.value.length === 0) {
      vendorInfo.value = null
    }
    
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
    vendorInfo.value = null
    save()
  }

  function setVendorInfo(info) {
    vendorInfo.value = info
    localStorage.setItem(VENDOR_INFO_KEY, JSON.stringify(info))
  }

  function save() {
    localStorage.setItem(CART_KEY, JSON.stringify(items.value))
    if (vendorInfo.value) {
      localStorage.setItem(VENDOR_INFO_KEY, JSON.stringify(vendorInfo.value))
    } else {
      localStorage.removeItem(VENDOR_INFO_KEY)
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
    vendorInfo,
    totalItems,
    totalPrice,
    isEmpty,
    isModalOpen,
    addItem,
    removeItem,
    updateQuantity,
    clear,
    setVendorInfo,
    openModal,
    closeModal
  }
})