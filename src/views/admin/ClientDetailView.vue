<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useClientStore } from '@/stores/client'
import { usePurchaseStore } from '@/stores/purchase'
import { storeToRefs } from 'pinia'
import PurchaseFormModal from '@/components/PurchaseFormModal.vue'
import RedeemCashbackModal from '@/components/RedeemCashbackModal.vue'

const route = useRoute()
const clientStore = useClientStore()
const purchaseStore = usePurchaseStore()

const { selectedClient, isLoading, error } = storeToRefs(clientStore)

// Estados separados para cada modal
const isPurchaseModalOpen = ref(false)
const isRedeemModalOpen = ref(false)

const handleSavePurchase = async (purchaseData: { amount: number }) => {
  const clientId = route.params.id as string
  if (!clientId) return
  try {
    await purchaseStore.createPurchase(clientId, purchaseData)
    isPurchaseModalOpen.value = false // Cierra el modal si la compra es exitosa
  } catch (err) {
    // El error ya se maneja en el store, pero podemos loguearlo
    console.error('Error al guardar la compra', err)
  }
}

const handleRedeemCashback = async (redeemData: { amount: number }) => {
  const clientId = route.params.id as string
  if (!clientId) return
  try {
    await purchaseStore.redeemCashback(clientId, redeemData)
    isRedeemModalOpen.value = false // Cierra el modal si el canje es exitoso
  } catch (err) {
    // El error se maneja en el store
    console.error('Error al canjear cashback', err)
  }
}

onMounted(() => {
  const clientId = route.params.id as string
  if (clientId) {
    clientStore.fetchClientById(clientId)
  }
})

// Función para formatear la fecha a un formato más legible
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }
  return new Date(dateString).toLocaleDateString('es-ES', options)
}
</script>

<template>
  <div v-if="isLoading && !selectedClient" class="text-center text-gray-500">
    Cargando datos del cliente...
  </div>
  <div
    v-else-if="error"
    class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
  >
    <strong class="font-bold">Error:</strong>
    <span class="block sm:inline">{{ error }}</span>
  </div>
  <div v-else-if="selectedClient" class="space-y-8">
    <!-- Cabecera con información del cliente y botones -->
    <div class="bg-white p-6 rounded-lg shadow-md">
      <div class="flex justify-between items-start">
        <div>
          <h1 class="text-4xl font-bold text-gray-800">{{ selectedClient.name }}</h1>
          <p class="text-gray-500">{{ selectedClient.phone || 'Sin teléfono' }}</p>
        </div>
        <div class="text-right">
          <p class="text-lg text-gray-600">Cashback Acumulado</p>
          <p class="text-5xl font-bold text-green-500">
            ${{ selectedClient.totalCashback.toFixed(2) }}
          </p>
        </div>
      </div>
      <div class="mt-6 flex gap-4">
        <button
          @click="isPurchaseModalOpen = true"
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
        >
          + Añadir Compra
        </button>
        <button
          @click="isRedeemModalOpen = true"
          class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
          :disabled="selectedClient.totalCashback <= 0"
          title="El cliente necesita cashback para poder canjear"
        >
          Canjear Cashback
        </button>
      </div>
    </div>

    <!-- Historial de Transacciones -->
    <div class="bg-white p-6 rounded-lg shadow-md">
      <h2 class="text-2xl font-bold text-gray-800 mb-4">Historial de Transacciones</h2>
      <div
        v-if="selectedClient.purchases && selectedClient.purchases.length > 0"
        class="overflow-x-auto"
      >
        <table class="min-w-full leading-normal">
          <thead>
            <tr class="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th class="py-3 px-6 text-left">Fecha</th>
              <th class="py-3 px-6 text-left">Tipo</th>
              <th class="py-3 px-6 text-right">Monto</th>
              <th class="py-3 px-6 text-right">Cashback</th>
            </tr>
          </thead>
          <tbody class="text-gray-700 text-sm">
            <tr
              v-for="purchase in selectedClient.purchases"
              :key="purchase._id"
              class="border-b border-gray-200 hover:bg-gray-100"
            >
              <td class="py-4 px-6 text-left whitespace-nowrap">
                {{ formatDate(purchase.createdAt) }}
              </td>
              <td class="py-4 px-6 text-left">
                <span
                  :class="
                    purchase.type === 'compra'
                      ? 'bg-blue-200 text-blue-800'
                      : 'bg-green-200 text-green-800'
                  "
                  class="py-1 px-3 rounded-full text-xs font-semibold"
                >
                  {{ purchase.type }}
                </span>
              </td>
              <td class="py-4 px-6 text-right font-mono">${{ purchase.amount.toFixed(2) }}</td>
              <td
                :class="purchase.type === 'compra' ? 'text-green-600' : 'text-red-600'"
                class="py-4 px-6 text-right font-mono font-bold"
              >
                <!-- Muestra el cashback generado en una compra, o el monto restado en un canje -->
                {{
                  purchase.type === 'compra'
                    ? `+${purchase.cashbackGenerated.toFixed(2)}`
                    : `-${purchase.amount.toFixed(2)}`
                }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="text-center text-gray-500 py-6">
        <p>Este cliente aún no tiene transacciones registradas.</p>
      </div>
    </div>
  </div>

  <!-- Modales -->
  <PurchaseFormModal
    :is-open="isPurchaseModalOpen"
    @close="isPurchaseModalOpen = false"
    @save="handleSavePurchase"
  />
  <RedeemCashbackModal
    :is-open="isRedeemModalOpen"
    :max-amount="selectedClient ? selectedClient.totalCashback : 0"
    @close="isRedeemModalOpen = false"
    @save="handleRedeemCashback"
  />
</template>
