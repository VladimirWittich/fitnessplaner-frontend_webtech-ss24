<template>
  <div class="login">
    <div id="okta-signin-container"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, nextTick } from 'vue'
import { oktaSignIn } from '../main'

onMounted(() => {
  nextTick(() => {
    oktaSignIn.showSignInAndRedirect(
        { el: '#okta-signin-container' },
    )
  })
})

onUnmounted(() => {
  oktaSignIn.remove()
})
</script>

<style scoped>
.login{
  margin-top: 200px;
  margin-left: 0px;
}
</style>
