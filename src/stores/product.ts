import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../services/api'

export interface Product {
  _id: string
  name: string
  description: string
  price: number
  imageUrl?: string
}

type ProductPayload = Omit<Product, '_id' | 'imageUrl'>

export const useProductStore = defineStore('product', () => {
  const products = ref<Product[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const fetchProducts = async () => {
    isLoading.value = true
    error.value = null
    try {
      const response = await api.get('/products')
      products.value = response.data
    } catch (err) {
      error.value = 'No se pudieron cargar los productos.'
    } finally {
      isLoading.value = false
    }
  }

  const createProduct = async (payload: { productData: ProductPayload; file: File | null }) => {
    isLoading.value = true
    error.value = null
    const formData = new FormData()
    formData.append('name', payload.productData.name)
    formData.append('description', payload.productData.description)
    formData.append('price', payload.productData.price.toString())
    if (payload.file) {
      formData.append('image', payload.file)
    }
    try {
      await api.post('/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      await fetchProducts()
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al crear el producto.'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const updateProduct = async (
    productId: string,
    payload: { productData: ProductPayload; file: File | null },
  ) => {
    isLoading.value = true
    error.value = null
    const formData = new FormData()
    formData.append('name', payload.productData.name)
    formData.append('description', payload.productData.description)
    formData.append('price', payload.productData.price.toString())
    if (payload.file) {
      formData.append('image', payload.file)
    }
    try {
      await api.put(`/products/${productId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      await fetchProducts()
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al actualizar el producto.'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const deleteProduct = async (productId: string) => {
    isLoading.value = true
    error.value = null
    try {
      await api.delete(`/products/${productId}`)
      await fetchProducts()
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al eliminar el producto.'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    products,
    isLoading,
    error,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  }
})
