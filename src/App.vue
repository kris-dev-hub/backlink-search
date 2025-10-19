<script setup lang="ts">
import Header from './components/layout/Header.vue'
import Footer from './components/layout/Footer.vue'
</script>

<template>
  <div id="app" class="min-h-screen flex flex-col">
    <Header />
    <div class="pt-16 flex-grow">
      <router-view></router-view>
      <!-- This will render the current route's component -->
    </div>
    <Footer />
  </div>
</template>

<style scoped></style>
