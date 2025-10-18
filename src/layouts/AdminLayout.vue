<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'
import { RouterLink, RouterView } from 'vue-router'

const authStore = useAuthStore()
// Hacemos que el 'user' sea reactivo para poder usarlo en el template
const { user } = storeToRefs(authStore)
</script>

<template>
  <div class="flex h-screen bg-gray-100 font-sans">
    <!-- Sidebar -->
    <aside class="w-64 flex-shrink-0 bg-gray-800 text-white p-6 flex flex-col">
      <div class="mb-10">
        <h2 class="text-2xl font-bold">Cashback App</h2>
        <p class="text-sm text-gray-400">Panel de Tienda</p>
      </div>
      <nav class="flex-grow">
        <ul>
          <li class="mb-4">
            <RouterLink
              to="/admin/products"
              class="flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors"
              active-class="bg-blue-600"
            >
              <span class="text-lg">🛍️</span>
              <span class="ml-4 font-semibold">Productos</span>
            </RouterLink>
          </li>
          <li class="mb-4">
            <RouterLink
              to="/admin/clients"
              class="flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors"
              active-class="bg-blue-600"
            >
              <span class="text-lg">👥</span>
              <span class="ml-4 font-semibold">Clientes</span>
            </RouterLink>
          </li>
          <!-- ENLACE AÑADIDO -->
          <li class="mb-4 border-t border-gray-700 pt-4 mt-4">
            <a
              v-if="user?.storeSlug"
              :href="`/${user.storeSlug}`"
              target="_blank"
              class="flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <span class="text-lg">🌐</span>
              <span class="ml-4 font-semibold">Ver mi Tienda</span>
            </a>
          </li>
        </ul>
      </nav>
      <div class="w-full">
        <button
          @click="authStore.logout"
          class="w-full bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
        >
          Cerrar Sesión
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 p-8 overflow-y-auto">
      <RouterView />
    </main>
  </div>
</template>
