<template>
  <div class="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
    <div class="flex items-center justify-center p-4 pt-8">
      <div class="w-full max-w-3xl">
        <div class="bg-white rounded-2xl shadow-xl p-8">
          <div v-if="loading" class="text-center text-gray-500 py-8">
            Cargando menú...
          </div>

          <div v-else>
            <div class="mb-8 border-b border-gray-100 pb-4">
              <h1 class="text-3xl font-bold text-gray-800 mb-2 text-center">
                {{ vendor?.restaurantName }}
              </h1>
              <p class="text-gray-600 text-center mb-3">
                {{ vendor?.description || 'Sin descripción disponible' }}
              </p>

              <div class="flex flex-wrap justify-center gap-4 text-sm text-gray-500 mb-3">
                <span v-if="vendor?.schedule">
                  🕒 {{ vendor.schedule }}
                </span>
                <span
                  :class="vendor?.isAvailable ? 'text-green-600' : 'text-red-600'"
                >
                  {{ vendor?.isAvailable ? '🟢 Disponible' : '🔴 No disponible' }}
                </span>
                <span v-if="vendor?.rating">
                  ⭐ {{ vendor.rating.toFixed(1) }}
                </span>
              </div>

              <div v-if="vendor?.email || vendor?.phone" class="flex flex-wrap justify-center gap-4 text-xs text-gray-400 mt-2 mb-3">
                <span v-if="vendor?.email">
                  📧 {{ vendor.email }}
                </span>
                <span v-if="vendor?.phone">
                  📞 {{ vendor.phone }}
                </span>
              </div>

              <div class="flex justify-center mt-4">
                <router-link
                  :to="{ name: 'vendor-reviews', params: { vendorId } }"
                  class="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium text-sm"
                >
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  Ver calificaciones y reseñas
                </router-link>
              </div>
            </div>

            <div v-if="menu.length > 0" class="space-y-10">
              <div
                v-for="category in menu"
                :key="category.categoryName"
              >
                <h2 class="text-2xl font-semibold text-gray-800 mb-4 border-b border-gray-100 pb-2">
                  {{ category.categoryName }}
                  <span class="text-sm text-gray-400 ml-1">({{ category.count }})</span>
                </h2>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div
                    v-for="item in category.items"
                    :key="item.id"
                    class="border border-gray-200 rounded-xl p-4 hover:border-orange-400 hover:shadow-md transition-all bg-white"
                    :class="{ 'opacity-60': !item.isAvailable }"
                  >
                    <div v-if="item.imageURL" class="mb-3">
                      <img
                        :src="item.imageURL"
                        :alt="item.name"
                        class="w-full h-40 object-cover rounded-lg"
                      />
                    </div>

                    <div class="flex items-start justify-between mb-1">
                      <h3 class="text-lg font-semibold text-gray-800">{{ item.name }}</h3>
                      <span
                        v-if="!item.isAvailable"
                        class="text-xs text-red-600 font-semibold ml-2"
                      >
                        No disponible
                      </span>
                    </div>
                    <p class="text-sm text-gray-500 mb-2 line-clamp-2">{{ item.description }}</p>

                    <div class="flex justify-between items-center mt-3">
                      <div>
                        <span
                          v-if="item.discountPercentage > 0"
                          class="text-orange-600 font-bold"
                        >
                          ${{ item.finalPrice.toFixed(2) }}
                        </span>
                        <span
                          v-else
                          class="text-gray-700 font-semibold"
                        >
                          ${{ item.price.toFixed(2) }}
                        </span>
                        <span
                          v-if="item.discountPercentage > 0"
                          class="text-sm text-gray-400 line-through ml-2"
                        >
                          ${{ item.price.toFixed(2) }}
                        </span>
                        <span
                          v-if="item.discountPercentage > 0"
                          class="text-xs text-orange-600 font-semibold ml-2"
                        >
                          -{{ item.discountPercentage }}%
                        </span>
                      </div>

                      <button
                        v-if="authStore.isCustomer || authStore.isAdmin"
                        :disabled="!item.isAvailable"
                        class="text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-amber-500 px-3 py-1.5 rounded-lg hover:from-orange-600 hover:to-amber-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        @click="addToCart(item)"
                      >
                        Agregar al carrito
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div v-else class="text-center text-gray-600 mt-8">
              Este restaurante aún no tiene productos cargados.
            </div>

            <div class="text-center mt-10">
              <button
                @click="goBack"
                class="text-orange-500 hover:text-orange-600 font-semibold transition-all"
              >
                ← Volver a la búsqueda
              </button>
            </div>
          </div>

          <div v-if="errorMessage" class="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-center text-red-600">
            {{ errorMessage }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCartStore } from '@/orders/stores/cart.js';
import { userApi } from '@/users/composables/userApiService.js';
import { useAuthStore } from '@/common/stores/auth.js';

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();
const vendorId = route.params.vendorId;

const vendor = ref(null);
const menu = ref([]);
const loading = ref(true);
const errorMessage = ref('');
const cartStore = useCartStore();

const goBack = () => router.push({name: 'home'});

const addToCart = (product) => {
  if (!product.isAvailable) return;
  
  const success = cartStore.addItem({
    id: product.id,
    name: product.name,
    price: product.discountPercentage > 0
      ? product.finalPrice
      : product.price,
    quantity: 1
  }, {
    id: vendorId,
    restaurantName: vendor.value.restaurantName,
    description: vendor.value.description,
    rating: vendor.value.rating,
    isAvailable: vendor.value.isAvailable
  })

  if (success) {
    alert('Producto agregado al carrito');
  }
}

const groupMenuByCategory = (products) => {
  const grouped = {};
  
  products.forEach(product => {
    const category = product.category || 'Sin categoría';
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push(product);
  });
  
  return Object.keys(grouped).map(categoryName => ({
    categoryName,
    count: grouped[categoryName].length,
    items: grouped[categoryName]
  }));
}

onMounted(async () => {
    try {
      loading.value = true;
        const [vendorResp, menuResp] = await Promise.all([
            userApi.getVendorProfile(vendorId),
            userApi.getVendorMenu(vendorId)
        ])
        vendor.value = vendorResp;
        menu.value = groupMenuByCategory(menuResp || []);

    } catch (error) {
        errorMessage.value = error.message;
    } finally {
        loading.value = false;
    }
})
</script>