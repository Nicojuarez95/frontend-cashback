import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Product } from './product'

// Definimos cómo se verá un ítem dentro del carrito
export interface CartItem extends Product {
  quantity: number
}

export const useCartStore = defineStore('cart', () => {
  // --- STATE ---
  // Guardamos los ítems del carrito en una referencia reactiva.
  const items = ref<CartItem[]>([])

  // --- GETTERS (Propiedades computadas) ---

  // Calcula el número total de productos en el carrito
  const totalItems = computed(() => {
    return items.value.reduce((total, item) => total + item.quantity, 0)
  })

  // Calcula el precio total del carrito
  const totalPrice = computed(() => {
    return items.value.reduce((total, item) => total + item.price * item.quantity, 0)
  })

  // --- ACTIONS ---

  /**
   * Añade un producto al carrito. Si ya existe, incrementa su cantidad.
   * @param product El producto a añadir.
   */
  function addProduct(product: Product) {
    const existingItem = items.value.find((item) => item._id === product._id)

    if (existingItem) {
      existingItem.quantity++
    } else {
      items.value.push({ ...product, quantity: 1 })
    }
  }

  /**
   * Reduce la cantidad de un producto en el carrito. Si la cantidad llega a 0, lo elimina.
   * @param productId El ID del producto a decrementar.
   */
  function decreaseQuantity(productId: string) {
    const item = items.value.find((item) => item._id === productId)
    if (item && item.quantity > 1) {
      item.quantity--
    } else if (item) {
      // Si la cantidad es 1, eliminamos el producto del carrito
      removeProduct(productId)
    }
  }

  /**
   * Elimina un producto completamente del carrito, sin importar su cantidad.
   * @param productId El ID del producto a eliminar.
   */
  function removeProduct(productId: string) {
    items.value = items.value.filter((item) => item._id !== productId)
  }

  /**
   * Vacía completamente el carrito.
   */
  function clearCart() {
    items.value = []
  }

  return {
    items,
    totalItems,
    totalPrice,
    addProduct,
    decreaseQuantity,
    removeProduct,
    clearCart,
  }
})
