<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useClientStore } from '@/stores/client'
import { storeToRefs } from 'pinia'
import ClientFormModal from '@/components/ClientFormModal.vue'
import { useRouter } from 'vue-router'

const clientStore = useClientStore()
const { clients, isLoading, error } = storeToRefs(clientStore)
const router = useRouter()

const isModalOpen = ref(false)

const handleSaveClient = async (clientData: { name: string; phone?: string }) => {
  try {
    await clientStore.createClient(clientData)
    isModalOpen.value = false
  } catch (err) {
    // El error ya se maneja y se muestra en el store, aquí solo evitamos que se cierre el modal si hay error.
    console.error('Fallo al guardar el cliente desde la vista.')
  }
}

// Esta función ahora usa el _id para navegar
const goToClientDetail = (clientId: string) => {
  router.push({ name: 'admin-client-detail', params: { id: clientId } })
}

onMounted(() => {
  clientStore.fetchClients()
})
</script>

<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-3xl font-bold">Gestión de Clientes</h1>
      <button
        @click="isModalOpen = true"
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
      >
        + Añadir Cliente
      </button>
    </div>

    <div v-if="isLoading && clients.length === 0" class="text-center text-gray-500">
      Cargando clientes...
    </div>

    <div
      v-else-if="error"
      class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
      role="alert"
    >
      <strong class="font-bold">Error:</strong>
      <span class="block sm:inline">{{ error }}</span>
    </div>

    <div v-else-if="clients.length > 0" class="bg-white shadow-md rounded-lg overflow-hidden">
      <table class="min-w-full leading-normal">
        <thead>
          <tr class="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th class="py-3 px-6 text-left">Nombre</th>
            <th class="py-3 px-6 text-left">Teléfono</th>
            <th class="py-3 px-6 text-center">Cashback Acumulado</th>
          </tr>
        </thead>
        <tbody class="text-gray-600 text-sm font-light">
          <!-- CORREGIDO: Usamos _id para el key y el click -->
          <tr
            v-for="client in clients"
            :key="client._id"
            @click="goToClientDetail(client._id)"
            class="border-b border-gray-200 hover:bg-gray-100 cursor-pointer"
          >
            <td class="py-3 px-6 text-left whitespace-nowrap">{{ client.name }}</td>
            <td class="py-3 px-6 text-left">{{ client.phone || 'N/A' }}</td>
            <td class="py-3 px-6 text-center font-semibold">
              ${{ client.totalCashback.toFixed(2) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else class="text-center text-gray-500 py-8">
      <p class="text-lg">Aún no tienes clientes registrados.</p>
      <p>¡Haz clic en "Añadir Cliente" para empezar!</p>
    </div>
  </div>

  <ClientFormModal :is-open="isModalOpen" @close="isModalOpen = false" @save="handleSaveClient" />
</template>
