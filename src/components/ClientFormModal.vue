<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Client } from '@/stores/client'

const props = defineProps<{
  isOpen: boolean
  client?: Client | null
}>()

const emit = defineEmits(['close', 'save'])

// El estado del formulario debe coincidir con los tipos que puede recibir.
const form = ref({
  name: '',
  phone: '', // Lo inicializamos como string vacío
})

watch(
  () => props.client,
  (newClient) => {
    if (newClient) {
      // LA CORRECCIÓN CLAVE:
      // Nos aseguramos de que 'phone' siempre sea un string.
      // Si newClient.phone es undefined, usamos un string vacío en su lugar.
      form.value = {
        name: newClient.name,
        phone: newClient.phone || '',
      }
    } else {
      // Si no hay cliente, reseteamos el formulario
      form.value = { name: '', phone: '' }
    }
  },
)

const handleSubmit = () => {
  if (form.value.name.trim()) {
    emit('save', { ...form.value })
  }
}
</script>

<template>
  <!-- Fondo oscuro del modal -->
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
    @click="$emit('close')"
  ></div>

  <!-- Contenido del Modal -->
  <div v-if="isOpen" class="fixed inset-0 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
      <h2 class="text-2xl font-bold mb-6">
        {{ client ? 'Editar Cliente' : 'Añadir Nuevo Cliente' }}
      </h2>

      <form @submit.prevent="handleSubmit">
        <div class="mb-4">
          <label for="name" class="block text-gray-700 text-sm font-bold mb-2">Nombre:</label>
          <input
            type="text"
            id="name"
            v-model="form.name"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
            required
          />
        </div>
        <div class="mb-6">
          <label for="phone" class="block text-gray-700 text-sm font-bold mb-2"
            >Teléfono (Opcional):</label
          >
          <input
            type="text"
            id="phone"
            v-model="form.phone"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
          />
        </div>

        <div class="flex items-center justify-end gap-4">
          <button
            type="button"
            @click="$emit('close')"
            class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >
            Cancelar
          </button>
          <button
            type="submit"
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Guardar
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
