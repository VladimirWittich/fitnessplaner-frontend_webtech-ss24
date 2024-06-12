<script setup lang="ts">
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { watch, onMounted, ref } from 'vue'
import { useAuth } from '@okta/okta-vue'
import Navbar from '@/components/Navbar.vue'

const auth = useAuth()
const route = useRoute()
const isAuthenticated = ref(false)
const userEmail = ref('')

async function logout() {
  await auth.signOut()
}

async function checkAuthentication() {
  isAuthenticated.value = await auth.isAuthenticated()
  if (isAuthenticated.value) {
    const user = await auth.getUser()
    if (user.email !== undefined) {
      userEmail.value = user.email
    } else {
      userEmail.value = 'Unknown'
    }
  }
}

watch(() => route.path, async () => {
  await checkAuthentication()
})

onMounted(async () => {
  await checkAuthentication()
  auth.authStateManager.subscribe(checkAuthentication)
})
</script>

<template>
  <Navbar :isAuthenticated="isAuthenticated" :logout="logout" />
  <RouterView />
</template>

<style scoped>
</style>
