<template>
  <div id="app">
    <Navbar />
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
import Navbar from '@/components/Navbar.vue';
</script>

<style scoped>
/* Ihr Style-Inhalt hier */
</style>
