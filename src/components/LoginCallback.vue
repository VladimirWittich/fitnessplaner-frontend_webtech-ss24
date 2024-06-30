<template>
  <div>
    <p>Loading...</p>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useOktaAuth } from '@okta/okta-vue'

const { auth } = useOktaAuth()

onMounted(() => {
  auth.handleAuthentication().then(() => {
    router.push('/')
  }).catch(err => {
    console.error('Fehler beim Verarbeiten der Authentifizierung:', err)
  })
})
</script>
