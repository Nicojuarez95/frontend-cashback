import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Importamos la nueva vista de la vidriera
import StoreFrontView from '../views/StoreFrontView.vue'
import LoginView from '../views/LoginView.vue'
import AdminLayout from '../layouts/AdminLayout.vue'
import ProductsView from '../views/admin/ProductsView.vue'
import ClientsView from '../views/admin/ClientsView.vue'
import ClientDetailView from '../views/admin/ClientDetailView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // --- RUTAS PÚBLICAS ---
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      // Esta es la nueva ruta principal para la vidriera.
      // Acepta un 'slug' dinámico en la URL.
      path: '/:storeSlug',
      name: 'store-front',
      component: StoreFrontView,
    },

    // --- RUTAS PRIVADAS (Panel de Administración) ---
    {
      path: '/admin',
      component: AdminLayout,
      meta: { requiresAuth: true }, // Protegemos todo lo que está dentro de /admin
      children: [
        {
          path: '', // Redirige /admin a /admin/products
          redirect: '/admin/products',
        },
        {
          path: 'products',
          name: 'admin-products',
          component: ProductsView,
        },
        {
          path: 'clients',
          name: 'admin-clients',
          component: ClientsView,
        },
        {
          path: 'clients/:id',
          name: 'admin-client-detail',
          component: ClientDetailView,
        },
      ],
    },

    // Ruta "catch-all" para redirigir URLs no encontradas
    {
      path: '/:pathMatch(.*)*',
      redirect: '/login', // Puedes cambiar esto a una página 404 si prefieres
    },
  ],
})

// Guardia de navegación para proteger rutas
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  if (to.meta.requiresAuth && !authStore.token) {
    next({ name: 'login' })
  } else {
    next()
  }
})

export default router
