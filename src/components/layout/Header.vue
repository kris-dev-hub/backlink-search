<template>
  <header class="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200">
    <div class="container mx-auto px-4">
      <nav class="flex items-center justify-between h-16">
        <!-- Logo -->
        <a :href="config.brandUrl" class="flex items-center space-x-2">
          <div class="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
            <i class="pi pi-chart-bar text-white text-lg"></i>
          </div>
          <span class="text-xl font-bold text-slate-900">{{ config.brandName }}</span>
        </a>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center space-x-6">
          <a
            v-for="item in config.navigation"
            :key="item.label"
            :href="item.url"
            class="text-slate-600 hover:text-primary-600 transition-colors"
          >
            {{ item.label }}
          </a>
        </div>

        <!-- Mobile Menu Button -->
        <button class="md:hidden p-2 text-slate-600 hover:text-primary-600" @click="mobileMenuOpen = true">
          <i class="pi pi-bars text-xl"></i>
        </button>
      </nav>
    </div>
  </header>

  <!-- Mobile Sidebar -->
  <Sidebar v-model:visible="mobileMenuOpen" position="right" class="w-64">
    <div class="flex flex-col space-y-4 pt-4">
      <a
        v-for="item in config.navigation"
        :key="item.label"
        :href="item.url"
        class="text-lg text-slate-600 hover:text-primary-600 px-4 py-2"
        @click="mobileMenuOpen = false"
      >
        {{ item.label }}
      </a>
    </div>
  </Sidebar>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Sidebar from 'primevue/sidebar'
import config from './header-config.json'

const mobileMenuOpen = ref(false)
</script>
