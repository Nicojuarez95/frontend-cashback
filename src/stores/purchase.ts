import { defineStore } from 'pinia'
import api from '@/services/api'
import { ref } from 'vue'
import { useClientStore } from './client' // Importamos el store de clientes

export const usePurchaseStore = defineStore('purchase', () => {
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Obtenemos una instancia del store de clientes para poder llamarlo
  const clientStore = useClientStore()

  async function createPurchase(clientId: string, purchaseData: { amount: number }) {
    isLoading.value = true
    error.value = null
    try {
      await api.post(`/purchases/${clientId}/add`, purchaseData)
      // Después de la compra, refrescamos los datos del cliente
      await clientStore.fetchClientById(clientId)
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Error al registrar la compra.'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Registra un canje de cashback para un cliente.
   */
  async function redeemCashback(clientId: string, redeemData: { amount: number }) {
    isLoading.value = true
    error.value = null
    try {
      await api.post(`/purchases/${clientId}/redeem`, redeemData)
      // Después del canje, también refrescamos los datos del cliente
      await clientStore.fetchClientById(clientId)
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Error al canjear el cashback.'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  return { isLoading, error, createPurchase, redeemCashback }
})
