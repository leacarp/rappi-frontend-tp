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
                {{ vendor?.profile?.vendorInfo?.restaurantName }}
              </h1>
              <p class="text-gray-600 text-center mb-3">
                {{ vendor?.profile?.vendorInfo?.description || 'Sin descripción disponible' }}
              </p>

              <div class="flex justify-center space-x-4 text-sm text-gray-500">
                <span v-if="vendor?.profile?.vendorInfo?.schedule">
                  🕒 {{ vendor.profile.vendorInfo.schedule }}
                </span>
                <span
                  :class="vendor?.profile?.vendorInfo?.isAvailable ? 'text-green-600' : 'text-red-600'"
                >
                  {{ vendor?.profile?.vendorInfo?.isAvailable ? '🟢 Disponible' : '🔴 No disponible' }}
                </span>
                <span v-if="vendor?.profile?.vendorInfo?.rating">
                  ⭐ {{ vendor.profile.vendorInfo.rating.toFixed(1) }}
                </span>
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
                    :key="item.name"
                    class="border border-gray-200 rounded-xl p-4 hover:border-orange-400 hover:shadow-md transition-all bg-white"
                  >
                    <div v-if="item.imageURL" class="mb-3">
                      <img
                        :src="item.imageURL"
                        :alt="item.name"
                        class="w-full h-40 object-cover rounded-lg"
                      />
                    </div>

                    <h3 class="text-lg font-semibold text-gray-800 mb-1">{{ item.name }}</h3>
                    <p class="text-sm text-gray-500 mb-2 line-clamp-2">{{ item.description }}</p>

                    <div class="flex justify-between items-center mt-3">
                      <div>
                        <span
                          v-if="item.promotions?.isOnPromotion"
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
                          v-if="item.promotions?.isOnPromotion"
                          class="text-sm text-gray-400 line-through ml-2"
                        >
                          ${{ item.price.toFixed(2) }}
                        </span>
                      </div>

                      <button
                        class="text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-amber-500 px-3 py-1.5 rounded-lg hover:from-orange-600 hover:to-amber-600 transition-all"
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
import { vendorApi } from '../composables/vendorApiService.js';
import { useCartStore } from '@/orders/stores/cart.js';

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
    cartStore.addItem({
    id: `${vendorId}-${product.name}-${product.price}`,
    name: product.name,
    price: product.promotions?.isOnPromotion
      ? product.finalPrice
      : product.price,
    quantity: 1
  })
}

onMounted(async () => {
    try {
      loading.value = true;
        const [vendorResp, menuResp] = await Promise.all([
            vendorApi.getVendorProfile(vendorId),
            vendorApi.getMenu(vendorId)
        ])
        vendor.value = vendorResp;
        menu.value = menuResp.categories || [];
        console.log('Vendor cargado:', vendor.value);
        console.log('Categorias del menú:', menu.value);

    } catch (error) {
        errorMessage.value = error.message;
    } finally {
        loading.value = false;
    }
})
</script>