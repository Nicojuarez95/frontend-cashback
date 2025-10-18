<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useStoreStore } from '@/stores/store'
import { useCartStore } from '@/stores/cart'
import { storeToRefs } from 'pinia'
import ShoppingCart from '@/components/ShoppingCart.vue'
import type { Product } from '@/stores/product' // Importamos el tipo Product

const route = useRoute()
const storeStore = useStoreStore()
const cartStore = useCartStore()

const { storeInfo, isLoading, error } = storeToRefs(storeStore)

onMounted(() => {
  const storeSlug = route.params.storeSlug as string
  if (storeSlug) {
    storeStore.fetchStoreBySlug(storeSlug)
  }
})

// Función para manejar la adición de productos al carrito
const handleAddToCart = (product: Product) => {
  cartStore.addProduct(product)
}
</script>

<template>
  <div class="bg-gray-900 min-h-screen font-sans text-white">
    <div class="container mx-auto px-4 py-12">
      <!-- Mensaje de Carga -->
      <div v-if="isLoading" class="text-center py-20">
        <p class="text-2xl text-gray-400 animate-pulse">Cargando...</p>
      </div>

      <!-- Mensaje de Error -->
      <div v-else-if="error" class="text-center py-20 max-w-2xl mx-auto">
        <h1 class="text-4xl font-bold text-yellow-400">Tienda no encontrada</h1>
        <p class="text-lg text-gray-300 mt-4">{{ error }}</p>
        <RouterLink
          to="/login"
          class="mt-8 inline-block bg-yellow-400 text-gray-900 font-bold py-3 px-6 rounded-lg hover:bg-yellow-300 transition-colors"
        >
          Ir al Panel de Administración
        </RouterLink>
      </div>

      <!-- Contenido de la Tienda -->
      <main v-else-if="storeInfo">
        <!-- Sección Hero -->
        <header class="text-center my-16">
          <h1 class="text-6xl md:text-8xl font-extrabold tracking-tighter text-white uppercase">
            {{ storeInfo.storeName }}
          </h1>
          <p class="mt-4 text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
            Viste con estilo y gana con cada compra.
          </p>
        </header>

        <!-- SECCIÓN DE CASHBACK REINTEGRADA -->
        <section
          class="my-24 bg-black rounded-xl shadow-2xl shadow-yellow-500/10 p-10 max-w-4xl mx-auto"
        >
          <div class="text-center">
            <h2 class="text-4xl font-bold text-yellow-400">Tu Fidelidad, Recompensada.</h2>
            <p class="mt-4 text-lg text-gray-300">
              Con nuestro sistema exclusivo <span class="font-bold">Cashback</span>, cada compra te
              acerca más a tu próxima prenda favorita.
            </p>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10 text-center">
            <div class="p-6">
              <div class="text-5xl mb-4">🛍️</div>
              <h3 class="text-xl font-semibold text-white">1. Compra</h3>
              <p class="mt-2 text-gray-400">
                Elige las prendas que más te gusten de nuestra colección.
              </p>
            </div>
            <div class="p-6">
              <div class="text-5xl mb-4">💰</div>
              <h3 class="text-xl font-semibold text-white">2. Gana 10%</h3>
              <p class="mt-2 text-gray-400">
                Automáticamente, el 10% de tu compra se convierte en cashback.
              </p>
            </div>
            <div class="p-6">
              <div class="text-5xl mb-4">🎁</div>
              <h3 class="text-xl font-semibold text-white">3. Canjea</h3>
              <p class="mt-2 text-gray-400">
                Usa tu saldo acumulado para llevarte la ropa que quieras, ¡cuando quieras!
              </p>
            </div>
          </div>
        </section>

        <!-- Galería de Productos -->
        <section class="my-24">
          <h2 class="text-center text-4xl font-bold mb-12">Nuestra Colección</h2>
          <div
            v-if="storeInfo.products.length > 0"
            class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
          >
            <div
              v-for="product in storeInfo.products"
              :key="product._id"
              class="bg-black rounded-lg shadow-lg overflow-hidden group transform hover:-translate-y-2 transition-transform duration-300"
            >
              <div class="relative">
                <!-- LA CORRECCIÓN ESTÁ AQUÍ: Contenedor con ratio de aspecto cuadrado -->
                <div class="aspect-square w-full bg-gray-800">
                  <img
                    :src="
                      product.imageUrl || 'https://placehold.co/600x600/1a1a1a/eab308?text=Estilo'
                    "
                    :alt="product.name"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div
                  class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  <button
                    @click="handleAddToCart(product)"
                    class="bg-yellow-400 text-gray-900 font-bold py-3 px-6 rounded-lg transform hover:scale-105 transition-transform"
                  >
                    Añadir al Carrito
                  </button>
                </div>
              </div>
              <div class="p-6">
                <h3 class="text-lg font-semibold text-white truncate">{{ product.name }}</h3>
                <p class="mt-1 text-sm text-gray-400 h-10 overflow-hidden">
                  {{ product.description }}
                </p>
                <p class="mt-4 text-2xl font-bold text-yellow-400 text-right">
                  ${{ product.price.toFixed(2) }}
                </p>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-16 bg-black rounded-lg">
            <p class="text-xl text-gray-500">Próximamente... Nuevos ingresos están en camino.</p>
          </div>
        </section>
      </main>

      <!-- Footer -->
      <footer class="text-center mt-24 pt-8 border-t border-gray-800">
        <p class="text-gray-500">
          &copy; {{ new Date().getFullYear() }} {{ storeInfo?.storeName || 'Cashback App' }}. Todos
          los derechos reservados.
        </p>
      </footer>

      <!-- Carrito de Compras -->
      <ShoppingCart v-if="storeInfo" :phone-number="storeInfo.phoneNumber" />
    </div>
  </div>
</template>
