<template>
  <footer class="bg-slate-900 text-slate-300 py-12">
    <div class="container mx-auto px-4">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- Brand -->
        <div>
          <div class="flex items-center space-x-2 mb-4">
            <div class="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
              <i class="pi pi-chart-bar text-white"></i>
            </div>
            <span class="text-lg font-bold text-white">{{ config.brandName }}</span>
          </div>
          <p class="text-sm text-slate-400">
            {{ config.brandDescription }}
          </p>
        </div>

        <!-- Dynamic Columns -->
        <div v-for="column in config.columns" :key="column.title">
          <h4 class="text-white font-semibold mb-4">{{ column.title }}</h4>
          <ul class="space-y-2 text-sm">
            <li v-for="item in column.items" :key="item.label">
              <a
                :href="item.url"
                class="hover:text-primary-400 transition-colors"
                :target="isExternalLink(item.url) ? '_blank' : undefined"
              >
                <i v-if="item.icon" :class="`pi ${item.icon} mr-2`"></i>{{ item.label }}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div class="border-t border-slate-800 mt-8 pt-8 text-center text-sm text-slate-400">
        <p>&copy; {{ config.copyrightYear }} {{ config.copyrightText }}</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import config from './footer-config.json'

const isExternalLink = (url: string) => {
  return url.startsWith('http://') || url.startsWith('https://')
}
</script>
