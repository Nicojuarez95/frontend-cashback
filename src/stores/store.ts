import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../services/api'
import type { Product } from './product'

// Definimos cómo se verán los datos públicos de la tienda
export interface PublicStoreInfo {
  storeName: string
  phoneNumber?: string // <-- ¡AQUÍ ESTÁ EL CAMBIO!
  products: Product[]
}

export const useStoreStore = defineStore('store', () => {
  // --- STATE ---
  const storeInfo = ref<PublicStoreInfo | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // --- ACTIONS ---
  const fetchStoreBySlug = async (slug: string) => {
    isLoading.value = true
    error.value = null
    storeInfo.value = null
    try {
      const response = await api.get(`/store/${slug}`)
      storeInfo.value = response.data
    } catch (err) {
      console.error('Error fetching store:', err)
      error.value = 'No se pudo encontrar la tienda o no tiene productos.'
    } finally {
      isLoading.value = false
    }
  }

  return {
    storeInfo,
    isLoading,
    error,
    fetchStoreBySlug,
  }
})
