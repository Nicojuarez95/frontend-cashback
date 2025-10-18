<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import type { Product } from '@/stores/product'

const props = defineProps<{
  isOpen: boolean
  product?: Product | null
}>()

const emit = defineEmits(['close', 'save'])

// Estado local para los campos del formulario
const form = ref({
  name: '',
  description: '',
  price: 0,
})

// Estado para manejar el archivo de imagen seleccionado
const selectedFile = ref<File | null>(null)
// Estado para previsualizar la imagen
const imagePreview = ref<string | null>(null)

// Observamos si se pasa un producto para editar y rellenamos el formulario
watch(
  () => props.product,
  (newProduct) => {
    if (newProduct) {
      form.value = {
        name: newProduct.name,
        description: newProduct.description,
        price: newProduct.price,
      }
      imagePreview.value = newProduct.imageUrl || null
      selectedFile.value = null
    } else {
      // Si es para crear uno nuevo, reseteamos todo
      form.value = { name: '', description: '', price: 0 }
      selectedFile.value = null
      imagePreview.value = null
    }
  },
)

// Se ejecuta cuando el usuario selecciona un archivo
const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    selectedFile.value = file
    // Creamos una URL local para la previsualización
    imagePreview.value = URL.createObjectURL(file)
  }
}

// Se ejecuta al enviar el formulario
const handleSubmit = () => {
  if (form.value.name.trim() && form.value.price > 0) {
    // Emitimos tanto los datos del formulario como el archivo seleccionado
    emit('save', { productData: form.value, file: selectedFile.value })
  }
}

// Título dinámico para el modal
const modalTitle = computed(() => (props.product ? 'Editar Producto' : 'Añadir Nuevo Producto'))
</script>

<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black bg-opacity-50 z-40"
    @click="$emit('close')"
  ></div>
  <div v-if="isOpen" class="fixed inset-0 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl p-8 w-full max-w-lg">
      <h2 class="text-2xl font-bold mb-6">{{ modalTitle }}</h2>

      <form @submit.prevent="handleSubmit">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Columna de campos de texto -->
          <div class="space-y-4">
            <div>
              <label for="name" class="block text-sm font-bold mb-2">Nombre:</label>
              <input
                type="text"
                id="name"
                v-model="form.name"
                class="shadow-sm border rounded w-full py-2 px-3"
                required
              />
            </div>
            <div>
              <label for="description" class="block text-sm font-bold mb-2">Descripción:</label>
              <textarea
                id="description"
                v-model="form.description"
                class="shadow-sm border rounded w-full py-2 px-3 h-24"
              ></textarea>
            </div>
            <div>
              <label for="price" class="block text-sm font-bold mb-2">Precio:</label>
              <input
                type="number"
                id="price"
                v-model.number="form.price"
                class="shadow-sm border rounded w-full py-2 px-3"
                required
                step="0.01"
              />
            </div>
          </div>

          <!-- Columna de la imagen -->
          <div>
            <label class="block text-sm font-bold mb-2">Imagen:</label>
            <div
              class="w-full h-48 bg-gray-100 rounded-lg border-2 border-dashed flex items-center justify-center mb-4"
            >
              <img
                v-if="imagePreview"
                :src="imagePreview"
                class="h-full w-full object-cover rounded-lg"
              />
              <span v-else class="text-gray-400">Vista Previa</span>
            </div>
            <input
              type="file"
              @change="handleFileChange"
              accept="image/*"
              class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
        </div>

        <div class="flex items-center justify-end gap-4 mt-8">
          <button
            type="button"
            @click="$emit('close')"
            class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >
            Cancelar
          </button>
          <button
            type="submit"
            class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
          >
            Guardar
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
