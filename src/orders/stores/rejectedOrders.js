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
        if (!Array.isArray(orders)) {
            return []
        }
        
        const orderIds = orders.map(o => o.id)
        setIds(rejectedOrderIds.value.filter((id) => orderIds.includes(id)))
        
        save()
        
        return orders.filter(o => !rejectedOrderIds.value.includes(o.id))
    }

  return {
    add,
    removeRejecteds
  }
})


