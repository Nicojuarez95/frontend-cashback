import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../services/api'
import router from '@/router'

// Definimos la 'forma' de los datos del usuario que recibimos del backend
export interface User {
  id: string
  storeName: string
  storeSlug: string
}

export const useAuthStore = defineStore('auth', () => {
  // --- STATE ---
  const token = ref(localStorage.getItem('authToken'))
  // Guardamos toda la información del usuario, no solo el token
  const user = ref<User | null>(JSON.parse(localStorage.getItem('authUser') || 'null'))

  // --- GETTERS ---
  const isAuthenticated = computed(() => !!token.value)

  // --- ACTIONS ---

  /**
   * Guarda el token y los datos del usuario en el estado y en localStorage.
   */
  function setAuthData(newToken: string, newUser: User) {
    user.value = newUser
    token.value = newToken
    localStorage.setItem('authUser', JSON.stringify(newUser))
    localStorage.setItem('authToken', newToken)
    api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
  }

  /**
   * Limpia los datos de autenticación del estado y localStorage.
   */
  function clearAuthData() {
    user.value = null
    token.value = null
    localStorage.removeItem('authUser')
    localStorage.removeItem('authToken')
    delete api.defaults.headers.common['Authorization']
  }

  async function login(credentials: any) {
    try {
      const response = await api.post('/auth/login', credentials)
      // El backend ahora nos devuelve el token y el objeto 'user'
      setAuthData(response.data.token, response.data.user)
      // Redirigimos al panel de administración
      router.push('/admin')
    } catch (error) {
      clearAuthData()
      console.error('Error en el login:', error)
      // Propagamos el error para que el componente de Login pueda mostrar un mensaje
      throw new Error('Email o contraseña incorrectos.')
    }
  }

  function logout() {
    clearAuthData()
    router.push('/login')
  }

  return { token, user, isAuthenticated, login, logout }
})
