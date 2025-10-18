<script setup lang="ts">
import { ref } from 'vue'
import { useCartStore } from '@/stores/cart'
import { storeToRefs } from 'pinia'

const props = defineProps<{
  storeName: string
  phoneNumber?: string | null
}>()

const cartStore = useCartStore()
const { items, totalItems, totalPrice } = storeToRefs(cartStore)

const isOpen = ref(false)

const generateWhatsAppMessage = () => {
  let message = `¡Hola ${props.storeName}! 👋\n\nQuisiera hacer el siguiente pedido:\n\n`

  items.value.forEach((item) => {
    message += `* producto: ${item.name}\n`
    message += `  Cantidad: ${item.quantity}\n`
    message += `  Precio: $${(item.price * item.quantity).toFixed(2)}\n\n`
  })

  message += `*TOTAL DEL PEDIDO: $${totalPrice.value.toFixed(2)}*`

  return encodeURIComponent(message)
}

const sendWhatsAppOrder = () => {
  if (!props.phoneNumber) {
    alert(
      'Lo sentimos, esta tienda no tiene un número de WhatsApp configurado para recibir pedidos.',
    )
    return
  }
  const message = generateWhatsAppMessage()
  const whatsappUrl = `https://wa.me/${props.phoneNumber}?text=${message}`
  window.open(whatsappUrl, '_blank')
  cartStore.clearCart()
  isOpen.value = false
}
</script>

<template>
  <div>
    <!-- Botón flotante del carrito -->
    <button
      @click="isOpen = true"
      class="fixed bottom-6 right-6 bg-yellow-400 text-gray-900 w-16 h-16 rounded-full shadow-lg flex items-center justify-center transform hover:scale-110 transition-transform z-40"
      aria-label="Abrir carrito de compras"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-8 w-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
      <span
        v-if="totalItems > 0"
        class="absolute -top-2 -right-2 bg-gray-900 text-yellow-400 text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center"
      >
        {{ totalItems }}
      </span>
    </button>

    <!-- Overlay oscuro -->
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black bg-opacity-60 z-40"
      @click="isOpen = false"
    ></div>

    <!-- Panel lateral del carrito -->
    <div
      :class="isOpen ? 'translate-x-0' : 'translate-x-full'"
      class="fixed top-0 right-0 h-full w-full max-w-md bg-gray-900 shadow-xl transform transition-transform duration-300 z-50 flex flex-col"
    >
      <!-- Cabecera del carrito -->
      <div class="flex justify-between items-center p-6 border-b border-gray-700">
        <h2 class="text-2xl font-bold text-yellow-400">Tu Pedido</h2>
        <button @click="isOpen = false" class="text-gray-400 hover:text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <!-- Lista de ítems -->
      <div class="flex-grow p-6 overflow-y-auto">
        <div v-if="items.length > 0" class="space-y-4">
          <div v-for="item in items" :key="item._id" class="flex items-center gap-4">
            <img
              :src="item.imageUrl || 'https://placehold.co/100x100/1a1a1a/eab308?text=Estilo'"
              :alt="item.name"
              class="w-20 h-20 object-cover rounded-md"
            />
            <div class="flex-grow">
              <h3 class="font-semibold text-white">{{ item.name }}</h3>
              <p class="text-sm text-gray-400">${{ item.price.toFixed(2) }}</p>
              <div class="flex items-center gap-3 mt-2">
                <button
                  @click="cartStore.decreaseQuantity(item._id)"
                  class="px-2 py-0.5 bg-gray-700 rounded"
                >
                  -
                </button>
                <span>{{ item.quantity }}</span>
                <button @click="cartStore.addProduct(item)" class="px-2 py-0.5 bg-gray-700 rounded">
                  +
                </button>
              </div>
            </div>
            <button
              @click="cartStore.removeProduct(item._id)"
              class="text-gray-500 hover:text-red-400"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </div>
        <div v-else class="text-center py-10">
          <p class="text-gray-400">Tu carrito está vacío.</p>
        </div>
      </div>

      <!-- Pie del carrito -->
      <div v-if="items.length > 0" class="p-6 border-t border-gray-700">
        <div class="flex justify-between items-center mb-4">
          <span class="text-lg font-semibold text-gray-300">Total</span>
          <span class="text-2xl font-bold text-yellow-400">${{ totalPrice.toFixed(2) }}</span>
        </div>
        <button
          @click="sendWhatsAppOrder"
          class="w-full bg-yellow-400 text-gray-900 font-bold py-3 rounded-lg hover:bg-yellow-300 transition-colors"
        >
          Finalizar Pedido por WhatsApp
        </button>
      </div>
    </div>
  </div>
</template>
