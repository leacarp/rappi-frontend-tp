export function useOrderTranslations() {
  
  const orderStatuses = [
    { value: 'all', label: 'Todos' },
    { value: 'pending', label: 'Pendientes' },
    { value: 'accepted', label: 'Aceptados' },
    { value: 'preparing', label: 'En Preparación' },
    { value: 'ready_for_pickup', label: 'Listos para Recolección' },
    { value: 'in_transit', label: 'En Tránsito' },
    { value: 'delivered', label: 'Entregados' },
    { value: 'canceled', label: 'Cancelados' }
  ]

  const getStatusLabel = (status) => {
    const statusObj = orderStatuses.find(s => s.value === status)
    return statusObj ? statusObj.label : status
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      accepted: 'bg-green-100 text-green-800',
      preparing: 'bg-blue-100 text-blue-800',
      ready_for_pickup: 'bg-purple-100 text-purple-800',
      in_transit: 'bg-indigo-100 text-indigo-800',
      delivered: 'bg-gray-100 text-gray-800',
      canceled: 'bg-red-100 text-red-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getPaymentMethodLabel = (method) => {
    const methods = {
      'cash': 'Efectivo',
      'card': 'Tarjeta',
      'credit_card': 'Tarjeta de Crédito',
      'debit_card': 'Tarjeta de Débito',
      'bank_transfer': 'Transferencia Bancaria',
      'digital_wallet': 'Billetera Digital',
      'paypal': 'PayPal',
      'stripe': 'Stripe',
      'mercadopago': 'MercadoPago',
      'other': 'Otro'
    }
    return methods[method] || method || 'No especificado'
  }

  const getPaymentStatusLabel = (status) => {
    const statuses = {
      'PENDING': 'Pendiente',
      'PROCESSING': 'Procesando',
      'COMPLETED': 'Completado',
      'FAILED': 'Fallido',
      'CANCELLED': 'Cancelado',
      'REFUNDED': 'Reembolsado',
      'PARTIALLY_REFUNDED': 'Parcialmente Reembolsado',
      'AUTHORIZED': 'Autorizado',
      'PAID': 'Pagado',
      'VOIDED': 'Anulado',
      'paid': 'Pagado',
      'pending': 'Pendiente'
    }
    return statuses[status?.toUpperCase()] || statuses[status] || status || 'Desconocido'
  }

  const getPaymentStatusColor = (status) => {
    const colors = {
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'PROCESSING': 'bg-blue-100 text-blue-800',
      'COMPLETED': 'bg-green-100 text-green-800',
      'FAILED': 'bg-red-100 text-red-800',
      'CANCELLED': 'bg-gray-100 text-gray-800',
      'REFUNDED': 'bg-purple-100 text-purple-800',
      'PARTIALLY_REFUNDED': 'bg-orange-100 text-orange-800',
      'AUTHORIZED': 'bg-indigo-100 text-indigo-800',
      'PAID': 'bg-green-100 text-green-800',
      'VOIDED': 'bg-gray-100 text-gray-800',
      'paid': 'bg-green-100 text-green-800',
      'pending': 'bg-yellow-100 text-yellow-800'
    }
    return colors[status?.toUpperCase()] || colors[status] || 'bg-gray-100 text-gray-800'
  }

  const formatDate = (date) => {
    if (!date) return 'N/A'
    const dateObj = new Date(date)
    return dateObj.toLocaleString('es-AR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatAddress = (location) => {
    if (!location) return 'N/A'
    return `${location._latitude}, ${location._longitude}`
  }

  return {
    orderStatuses,
    getStatusLabel,
    getStatusColor,
    getPaymentMethodLabel,
    getPaymentStatusLabel,
    getPaymentStatusColor,
    formatDate,
    formatAddress
  }
}