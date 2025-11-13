<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-8">
        <h2 class="text-3xl font-bold text-gray-900 mb-2">Gestión de Productos</h2>
        <p class="text-gray-600">Administra tu menú y promociones</p>
      </div>

      <div v-if="error" class="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
        <p class="font-medium">{{ error }}</p>
      </div>

      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p class="mt-4 text-gray-600">Cargando productos...</p>
      </div>

      <div v-if="!loading" class="flex flex-wrap gap-4 mb-6">
        <button 
          @click="openProductModal()"
          class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          + Agregar Producto
        </button>
      </div>

      <div v-if="!loading" class="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div class="flex flex-wrap gap-4">
          <div class="flex-1 min-w-[200px]">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Buscar productos..."
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div class="min-w-[200px]">
            <select
              v-model="filterStatus"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos los estados</option>
              <option value="active">Activos</option>
              <option value="inactive">Inactivos</option>
            </select>
          </div>
        </div>
      </div>

      <div v-if="!loading" class="bg-white rounded-lg shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Imagen</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Promoción</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="product in filteredProducts" :key="product.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <img 
                    :src="product.image || '/placeholder.svg?height=50&width=50'" 
                    :alt="product.name"
                    class="w-12 h-12 rounded-lg object-cover"
                  />
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm font-medium text-gray-900">{{ product.name }}</div>
                  <div class="text-sm text-gray-500 line-clamp-1">{{ product.description }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                    {{ product.category }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ formatCurrency(product.price) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div v-if="product.specialPrice" class="text-sm">
                    <div class="font-medium text-green-600">{{ formatCurrency(product.specialPrice) }}</div>
                    <div class="text-xs text-gray-500 line-through">{{ formatCurrency(product.price) }}</div>
                  </div>
                  <span v-else class="text-sm text-gray-400">-</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <button
                    @click="toggleProductStatus(product.id)"
                    class="cursor-pointer"
                    :class="[
                      'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                      product.active ? 'bg-green-600' : 'bg-gray-300'
                    ]"
                  >
                    <span
                      :class="[
                        'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                        product.active ? 'translate-x-6' : 'translate-x-1'
                      ]"
                    />
                  </button>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    @click="openProductModal(product)"
                    class="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Editar
                  </button>
                  <button
                    @click="openDeleteModal(product)"
                    class="text-red-600 hover:text-red-900"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          
          <div v-if="filteredProducts.length === 0" class="text-center py-12">
            <p class="text-gray-500 text-lg">No se encontraron productos</p>
            <button 
              @click="openProductModal()"
              class="mt-4 text-blue-600 hover:text-blue-700 font-medium"
            >
              Agregar tu primer producto
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showProductModal" class="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-2xl font-bold text-gray-900">
              {{ editingProduct ? 'Editar Producto' : 'Nuevo Producto' }}
            </h3>
            <button @click="closeProductModal" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form @submit.prevent="saveProduct" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Imagen del producto</label>
              <div class="flex items-center gap-4">
                <div class="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden">
                  <img 
                    v-if="productForm.image" 
                    :src="productForm.image" 
                    alt="Preview"
                    class="w-full h-full object-cover"
                  />
                  <span v-else class="text-gray-400 text-xs text-center px-2">Sin imagen</span>
                </div>
                <div class="flex-1">
                  <input
                    v-model="productForm.image"
                    type="text"
                    placeholder="URL de la imagen"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p class="text-xs text-gray-500 mt-1">Ingresa la URL de la imagen del producto</p>
                </div>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Nombre *</label>
              <input
                v-model="productForm.name"
                type="text"
                required
                placeholder="Ej: Pizza Margarita"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Descripción *</label>
              <textarea
                v-model="productForm.description"
                required
                rows="3"
                placeholder="Describe tu producto..."
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Categoría *</label>
              <input
                v-model="productForm.category"
                type="text"
                required
                placeholder="Ej: Pizzas, Hamburguesas, Bebidas"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p class="text-xs text-gray-500 mt-1">Escribe el nombre de la categoría</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Precio *</label>
              <div class="relative">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  v-model.number="productForm.price"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  placeholder="0.00"
                  class="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Precio Promocional (opcional)</label>
              <div class="relative">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  v-model.number="productForm.specialPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  class="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <p class="text-xs text-gray-500 mt-1">Deja vacío si no hay promoción</p>
            </div>

            <div class="flex items-center gap-3">
              <button
                type="button"
                @click="productForm.active = !productForm.active"
                :class="[
                  'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                  productForm.active ? 'bg-green-600' : 'bg-gray-300'
                ]"
              >
                <span
                  :class="[
                    'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                    productForm.active ? 'translate-x-6' : 'translate-x-1'
                  ]"
                />
              </button>
              <label class="text-sm font-medium text-gray-700">
                Producto {{ productForm.active ? 'activo' : 'inactivo' }}
              </label>
            </div>

            <div class="flex gap-3 pt-4">
              <button
                type="submit"
                class="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                {{ editingProduct ? 'Guardar Cambios' : 'Crear Producto' }}
              </button>
              <button
                type="button"
                @click="closeProductModal"
                class="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <div v-if="showDeleteModal" class="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg max-w-md w-full">
        <div class="p-6">
          <div class="flex items-center justify-center mb-4">
            <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>

          <div class="text-center mb-6">
            <h3 class="text-xl font-bold text-gray-900 mb-2">¿Eliminar producto?</h3>
            <p class="text-gray-600 mb-4">
              ¿Estás seguro de que deseas eliminar 
              <span class="font-semibold text-gray-900">{{ productToDelete?.name }}</span>?
            </p>
            <p class="text-sm text-gray-500">
              Esta acción no se puede deshacer.
            </p>
          </div>

          <div class="flex gap-3">
            <button
              @click="closeDeleteModal"
              class="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              @click="confirmDelete"
              class="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../../common/stores/auth.js'
import { productApiService } from '../composables/productApiService.js'

const authStore = useAuthStore()
const vendorId = computed(() => authStore.userId)
const loading = ref(false)
const error = ref(null)
const products = ref([])
const searchQuery = ref('')
const filterCategory = ref('')
const filterStatus = ref('')
const showProductModal = ref(false)
const editingProduct = ref(null)
const productForm = ref({
  name: '',
  description: '',
  price: 0,
  specialPrice: null,
  category: '',
  image: '',
  active: true
})

const showDeleteModal = ref(false)
const productToDelete = ref(null)
  
const filteredProducts = computed(() => {
  return products.value.filter(product => {
    const productName = product.name || ''
    const productDescription = product.description || ''
    const productCategory = product.category || ''
    
    const matchesSearch = productName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                          productDescription.toLowerCase().includes(searchQuery.value.toLowerCase())

    const matchesCategory = !filterCategory.value || productCategory === filterCategory.value
    
    const matchesStatus = !filterStatus.value || 
                          (filterStatus.value === 'active' && product.active) ||
                          (filterStatus.value === 'inactive' && !product.active)
    
    return matchesSearch && matchesCategory && matchesStatus
  })
})

const formatCurrency = (value) => {
  if (value === null || value === undefined)
    return '$0,00'
  
  const number = typeof value === 'number' ? value : parseFloat(value)
  if (isNaN(number))
    return '$ 0,00'
  
  const formatted = number.toFixed(2)
  const [integerPart, decimalPart] = formatted.split('.')
  const integerWithSeparator = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  
  return `$ ${integerWithSeparator},${decimalPart}`
}
  
const loadProducts = async () => {
  if (!vendorId.value) {
    error.value = 'No se pudo obtener el ID del vendor'
    return
  }

  try {
    loading.value = true
    error.value = null

    const data = await productApiService.getProductsByVendor(vendorId.value)
    
    products.value = data.map(product => {
      const promotions = product.promotions || product._promotions || {}
      const isOnPromotion = promotions.isOnPromotion ?? promotions._isOnPromotion ?? false
      const discountedPrice = promotions.discountedPrice ?? promotions._discountedPrice ?? 0

      return {
        id: product.id || product._id || '',
        vendorId: product.vendorId || product._vendorId || '',
        name: product.name || product._name || 'Sin nombre',
        description: product.description || product._description || 'Sin descripción',
        price: product.price ?? product._price ?? 0,
        specialPrice: isOnPromotion ? discountedPrice : null,
        category: product.category || product._category || 'Sin categoría',
        image: product.imageURL || product._imageURL || 'https://placehold.co/300?text=Sin+Foto',
        active: product.isAvailable ?? product._isAvailable ?? true,
        finalPrice: product.finalPrice ?? product._finalPrice ?? product.price ?? product._price ?? 0,
        discountPercentage: product.discountPercentage ?? product._discountPercentage ?? 0
      }
    })
  } catch (err) {
    console.error('Error al cargar productos:', err)
    error.value = err.message || 'Error al cargar los productos'
  } finally {
    loading.value = false
  }
}

const openProductModal = (product = null) => {
  if (product) {
    editingProduct.value = product
    productForm.value = {
      name: product.name,
      description: product.description,
      price: product.price,
      specialPrice: product.specialPrice,
      category: product.category,
      image: product.image,
      active: product.active
    }
  } else {
    editingProduct.value = null
    productForm.value = {
      name: '',
      description: '',
      price: 0,
      specialPrice: null,
      category: '',
      image: '',
      active: true
    }
  }
  showProductModal.value = true
}

const closeProductModal = () => {
  showProductModal.value = false
  editingProduct.value = null
}
  
const saveProduct = async () => {
  try {
    loading.value = true
    error.value = null

    const imageURL = productForm.value.image?.trim() || 'https://placehold.co/300?text=Sin+Foto'

    if (editingProduct.value) {
      const productData = {
        name: productForm.value.name,
        description: productForm.value.description,
        imageURL: imageURL,
        price: productForm.value.price,
        category: productForm.value.category,
        isAvailable: productForm.value.active,
        promotions: {
          isOnPromotion: productForm.value.specialPrice ? true : false,
          discountedPrice: productForm.value.specialPrice ?? 0
        }
      }

      await productApiService.updateProduct(editingProduct.value.id, productData)
    } else {
      const productData = {
        vendorId: vendorId.value,
        name: productForm.value.name,
        description: productForm.value.description,
        imageURL: imageURL,
        price: productForm.value.price,
        category: productForm.value.category,
        isAvailable: productForm.value.active,
        promotions: {
          isOnPromotion: productForm.value.specialPrice ? true : false,
          discountedPrice: productForm.value.specialPrice ?? 0
        }
      }

      await productApiService.createProduct(productData)
    }

    closeProductModal()
    await loadProducts()
  } catch (err) {
    console.error('Error al guardar producto:', err)
    error.value = err.response?.data?.message || 'Error al guardar el producto'
  } finally {
    loading.value = false
  }
}

const toggleProductStatus = async (productId) => {
  try {
    const product = products.value.find(p => p.id === productId)
    if (!product) return

    const updatedData = {
      isAvailable: !product.active
    }

    await productApiService.updateProduct(productId, updatedData)
    await loadProducts()
  } catch (err) {
    console.error('Error al cambiar estado del producto:', err)
    error.value = 'Error al cambiar el estado del producto'
  }
}

const openDeleteModal = (product) => {
  productToDelete.value = product
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  productToDelete.value = null
}

const confirmDelete = async () => {
  if (!productToDelete.value) return

  try {
    loading.value = true
    error.value = null

    await productApiService.deleteProduct(productToDelete.value.id)

    closeDeleteModal()

    await loadProducts()
  } catch (err) {
    console.error('Error al eliminar producto:', err)
    error.value = 'Error al eliminar el producto'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadProducts()
})
</script>  