<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useProductStore, type Product } from '@/stores/product'
import { storeToRefs } from 'pinia'
import ProductFormModal from '@/components/ProductFormModal.vue'

const productStore = useProductStore()
const { products, isLoading, error } = storeToRefs(productStore)

const isModalOpen = ref(false)
const productToEdit = ref<Product | null>(null)

const openModalToCreate = () => {
  productToEdit.value = null
  isModalOpen.value = true
}

const openModalToEdit = (product: Product) => {
  productToEdit.value = product
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

// Esta función ahora recibe el payload correcto desde el modal, que incluye el archivo.
const handleSaveProduct = async (payload: {
  productData: Omit<Product, '_id' | 'imageUrl'>
  file: File | null
}) => {
  try {
    if (productToEdit.value) {
      await productStore.updateProduct(productToEdit.value._id, payload)
    } else {
      await productStore.createProduct(payload)
    }
    closeModal()
  } catch (err) {
    console.error('Fallo al guardar el producto:', err)
  }
}

const handleDeleteProduct = async (productId: string) => {
  if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
    await productStore.deleteProduct(productId)
  }
}

onMounted(() => {
  productStore.fetchProducts()
})
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-3xl font-bold">Gestión de Productos</h1>
      <button
        @click="openModalToCreate"
        class="px-4 py-2 font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
      >
        + Añadir Producto
      </button>
    </div>

    <!-- Feedback para el usuario -->
    <div v-if="isLoading" class="text-center text-gray-500">Cargando productos...</div>
    <div v-else-if="error" class="p-4 text-red-800 bg-red-100 border rounded-lg">{{ error }}</div>
    <div
      v-else-if="products.length === 0"
      class="p-4 text-center text-gray-500 bg-gray-50 rounded-lg"
    >
      Aún no has añadido ningún producto. ¡Empieza creando uno!
    </div>

    <!-- Tabla de Productos -->
    <div v-else class="overflow-x-auto bg-white rounded-lg shadow">
      <table class="min-w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Imagen</th>
            <th class="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Nombre</th>
            <th class="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">
              Descripción
            </th>
            <th class="px-6 py-3 text-xs font-medium text-right text-gray-500 uppercase">Precio</th>
            <th class="px-6 py-3 text-xs font-medium text-center text-gray-500 uppercase">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="product in products" :key="product._id">
            <td class="px-6 py-4">
              <!-- La etiqueta <img> mostrará la imagen del producto -->
              <img
                :src="
                  product.imageUrl || 'https://placehold.co/100x100/e2e8f0/e2e8f0?text=SIN+IMAGEN'
                "
                alt="Imagen del producto"
                class="w-16 h-16 object-cover rounded-md"
              />
            </td>
            <td class="px-6 py-4 font-medium text-gray-900">{{ product.name }}</td>
            <td class="px-6 py-4 text-gray-500 max-w-xs truncate">{{ product.description }}</td>
            <td class="px-6 py-4 text-right font-mono text-gray-700">
              ${{ product.price.toFixed(2) }}
            </td>
            <td class="px-6 py-4 text-center">
              <button
                @click="openModalToEdit(product)"
                class="text-indigo-600 hover:text-indigo-900 font-medium"
              >
                Editar
              </button>
              <button
                @click="handleDeleteProduct(product._id)"
                class="ml-4 text-red-600 hover:text-red-900 font-medium"
              >
                Eliminar
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <ProductFormModal
    :is-open="isModalOpen"
    :product="productToEdit"
    @close="closeModal"
    @save="handleSaveProduct"
  />
</template>
