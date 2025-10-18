<script setup lang="ts">
import { ref } from 'vue'

// Definimos los props que el componente puede recibir
defineProps<{
  isOpen: boolean
}>()

// Definimos los eventos que el componente puede emitir
const emit = defineEmits(['close', 'save'])

// Estado local para el monto de la compra
const amount = ref<number | null>(null)

const handleSubmit = () => {
  if (amount.value && amount.value > 0) {
    emit('save', { amount: amount.value })
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
      <h2 class="text-2xl font-bold mb-6">Añadir Nueva Compra</h2>

      <form @submit.prevent="handleSubmit">
        <div class="mb-6">
          <label for="amount" class="block text-gray-700 text-sm font-bold mb-2"
            >Monto de la Venta:</label
          >
          <input
            type="number"
            id="amount"
            v-model.number="amount"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Ej: 150.00"
            required
            min="0.01"
            step="0.01"
          />
        </div>

        <div class="flex items-center justify-end gap-4">
          <button
            type="button"
            @click="$emit('close')"
            class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cancelar
          </button>
          <button
            type="submit"
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Guardar Compra
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
