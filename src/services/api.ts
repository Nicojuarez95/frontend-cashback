import axios from 'axios'

const api = axios.create({
  // LA CORRECCIÓN ESTÁ AQUÍ: Añadimos /api al final de la URL
  baseURL: 'https://backend-cashback-bbpy.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

export default api
