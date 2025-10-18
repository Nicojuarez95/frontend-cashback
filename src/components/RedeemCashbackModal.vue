<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  isOpen: boolean
  maxAmount: number // El cashback total que tiene el cliente
}>()

const emit = defineEmits(['close', 'save'])

const amount = ref<number | null>(null)
const error = ref<string | null>(null)

const formattedMaxAmount = computed(() => props.maxAmount.toFixed(2))

const handleSubmit = () => {
  error.value = null // Limpiamos errores previos
  if (!amount.value || amount.value <= 0) {
    error.value = 'El monto debe ser mayor a cero.'
    return
  }
  if (amount.value > props.maxAmount) {
    error.value = `No puedes canjear más de $${formattedMaxAmount.value}`
    return
  }
  emit('save', { amount: amount.value })
  amount.value = null // Limpiamos el input
}
</script>

<template>
  <!-- Fondo oscuro del modal -->
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black bg-opacity-50 z-40"
    @click="$emit('close')"
  ></div>

  <!-- Contenido del Modal -->
  <div v-if="isOpen" class="fixed inset-0 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
      <h2 class="text-2xl font-bold mb-4">Canjear Cashback</h2>
      <p class="mb-6 text-gray-600">
        Disponible para canjear:
        <span class="font-bold text-green-500">${{ formattedMaxAmount }}</span>
      </p>

      <form @submit.prevent="handleSubmit">
        <div class="mb-4">
          <label for="amount" class="block text-gray-700 text-sm font-bold mb-2"
            >Monto a Canjear:</label
          >
          <input
            type="number"
            id="amount"
            v-model.number="amount"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Ej: 5000"
            required
            step="0.01"
          />
        </div>

        <p v-if="error" class="text-red-500 text-xs italic mb-4">{{ error }}</p>

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
            class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Confirmar Canje
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
