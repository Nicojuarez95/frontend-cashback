import axios from 'axios'

// 1. Creamos una instancia de Axios con la configuración base.
const api = axios.create({
  // Asegúrate de que esta URL coincida con la de tu backend.
  baseURL: 'http://localhost:8000/api', // Reemplaza el puerto si es diferente
  headers: {
    'Content-Type': 'application/json',
  },
})

// 2. Usamos un "interceptor" para añadir el token a cada petición.
// Esto se ejecuta ANTES de que cualquier petición sea enviada.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token) {
      // Si tenemos un token, lo añadimos al header 'Authorization'.
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

export default api
