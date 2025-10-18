import { defineStore } from 'pinia'
import api from '@/services/api'
import { ref } from 'vue'

// Definimos la 'forma' que tendrán los datos de una compra
export interface Purchase {
  _id: string
  amount: number
  cashbackGenerated: number
  type: 'compra' | 'cashback'
  createdAt: string
}

// Actualizamos la interfaz del cliente para que pueda contener su historial
export interface Client {
  _id: string
  name: string
  phone?: string
  totalCashback: number
  userId: string
  purchases?: Purchase[] // El historial de compras es opcional
}

export const useClientStore = defineStore('client', () => {
  const clients = ref<Client[]>([])
  // 'selectedClient' ahora puede guardar tanto los datos del cliente como su historial
  const selectedClient = ref<Client | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function fetchClients() {
    // Esta función no cambia
    isLoading.value = true
    error.value = null
    try {
      const response = await api.get('/clients')
      clients.value = response.data
    } catch (e: any) {
      error.value = 'No se pudieron cargar los clientes.'
    } finally {
      isLoading.value = false
    }
  }

  async function createClient(clientData: Omit<Client, '_id' | 'totalCashback' | 'userId'>) {
    // Esta función no cambia
    isLoading.value = true
    error.value = null
    try {
      await api.post('/clients', clientData)
      await fetchClients()
    } catch (e: any) {
      error.value = 'Error al crear el cliente.'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  async function fetchClientById(clientId: string) {
    isLoading.value = true
    error.value = null
    selectedClient.value = null // Limpiamos el cliente anterior
    try {
      // La respuesta del backend ahora tiene el formato { client: {...}, purchases: [...] }
      const response = await api.get(`/clients/${clientId}`)
      // Combinamos ambos en nuestro estado local
      selectedClient.value = {
        ...response.data.client,
        purchases: response.data.purchases,
      }
    } catch (e: any) {
      error.value = 'No se pudo cargar la información del cliente.'
    } finally {
      isLoading.value = false
    }
  }

  return { clients, selectedClient, isLoading, error, fetchClients, createClient, fetchClientById }
})
