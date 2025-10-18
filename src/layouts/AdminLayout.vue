<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'
import { RouterLink, RouterView } from 'vue-router'

const authStore = useAuthStore()
const { user } = storeToRefs(authStore)

// Estado para controlar la visibilidad del menú en móvil
const isSidebarOpen = ref(false)
</script>

<template>
  <div class="relative min-h-screen md:flex bg-gray-100 font-sans">
    <!-- Botón de Hamburguesa para Móvil -->
    <div class="md:hidden flex justify-between items-center bg-gray-800 text-white p-4">
      <h2 class="text-xl font-bold">Cashback App</h2>
      <button @click="isSidebarOpen = !isSidebarOpen">
        <svg
          class="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16m-7 6h7"
          ></path>
        </svg>
      </button>
    </div>

    <!-- Sidebar -->
    <aside
      :class="isSidebarOpen ? 'translate-x-0' : '-translate-x-full'"
      class="bg-gray-800 text-white w-64 p-6 fixed inset-y-0 left-0 transform md:relative md:translate-x-0 transition-transform duration-200 ease-in-out z-30 flex flex-col"
    >
      <div class="mb-10">
        <h2 class="text-2xl font-bold">Cashback App</h2>
        <p class="text-sm text-gray-400">Panel de Tienda</p>
      </div>
      <nav class="flex-grow">
        <ul>
          <li class="mb-4">
            <RouterLink
              to="/admin/products"
              @click="isSidebarOpen = false"
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
              @click="isSidebarOpen = false"
              class="flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors"
              active-class="bg-blue-600"
            >
              <span class="text-lg">👥</span>
              <span class="ml-4 font-semibold">Clientes</span>
            </RouterLink>
          </li>
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

    <!-- Contenido Principal -->
    <main class="flex-1 p-4 md:p-8 overflow-y-auto">
      <RouterView />
    </main>
  </div>
</template>
