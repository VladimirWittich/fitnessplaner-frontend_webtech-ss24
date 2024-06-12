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
  // Diese Funktion wird aufgerufen, sobald der Benutzer erfolgreich authentifiziert wurde
  auth.handleAuthentication().then(() => {
    // Nach erfolgreicher Authentifizierung den Benutzer zur gewünschten Seite weiterleiten
    router.push('/')
  }).catch(err => {
    console.error('Fehler beim Verarbeiten der Authentifizierung:', err)
  })
})
</script>
