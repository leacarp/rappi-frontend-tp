import { defineStore } from 'pinia'
import { ref } from 'vue'

const STORAGE_KEY = 'rejectedOrderIds'

export const useRejectedOrdersStore = defineStore('rejectedOrders', () => {
    const rejectedOrderIds = ref(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'))

    function save () {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(rejectedOrderIds.value))
    }

    function setIds (ids) {
        rejectedOrderIds.value = ids
        save()
    }

    function alreadyIncluded (orderId) {
        return rejectedOrderIds.value.includes(orderId)
    }

    function add (orderId) {
        if (alreadyIncluded(orderId))
            return

        setIds([...rejectedOrderIds.value, orderId])
    }

    function removeRejecteds (orders) {
        // Solo mantiene rechazos presentes en orderIds
        const orderIds = orders.map(o => o._id)
        setIds(rejectedOrderIds.value.filter((id) => orderIds.includes(id)))
        
        save()
        
        // Retorna un array de orderIds excluyendo aquellos que están en rejectedOrderIds
        return orders.filter(o => !rejectedOrderIds.value.includes(o._id))
    }

  return {
    add,
    removeRejecteds
  }
})


